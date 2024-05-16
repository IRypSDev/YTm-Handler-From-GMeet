import { COMMANDS_LIST } from "../resources/command-list.js"

import { RENDER, COMMANDS } from "../scripts/commands.js";
import { RESPONSE } from "../scripts/responses.js";

import { makeCommandsListMessage, splitCommandAndQuery } from "../utils/commandUtils.js";

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {

    switch( request.type ) {

        case "COMMAND":

            let command = request.message.toString().toLowerCase();

            chrome.tabs.query({url: "*://meet.google.com/*"}, function(tabs) {
        
                if ( !tabs || tabs.length == 0 ) {
                    console.warn("❌ No se encuentra una tab para enviar una respuesta")
                    return;
                }

                executeCommand( tabs[0].id, command );

            });

            break;

        default:
            console.log("❌ No se reconoce el mensaje")

    }

});



async function executeCommand( responseTabID, command ) {

    chrome.storage.session.get(['selectedTabId'], function(result) {
    
        let tabId = result.selectedTabId;

        if (!!!tabId) {
            sendResponseMessage( responseTabID, "❌ No se está escuchando ninguna pestaña" );
            return;
        };

        chrome.tabs.get(tabId, function(tab) {

            if ( !!!tab ) {
                sendResponseMessage( responseTabID, "❌ El ID de la pestaña es inválido" );
                return;
            }

            if ( command.startsWith("play") || command.startsWith("search") ) {

                let splitCommand = splitCommandAndQuery( command );
                searchCommandWithQuery( responseTabID, tab.id, splitCommand.command, splitCommand.query );
                return;

            } 

            searchCommand( responseTabID, tab.id, command );

        });
    });


}



const ACTIONS_TYPE = {
    preRedir: "pre-redirect",
    preRender: "pre-render",
    search: "redirect-search",
    play: "search-and-play",
    wResp: "with-response"
}

function searchCommand( responseTabID, ytmTabID, candidate ) {

    switch( candidate ) {

        //Info
        
        case "np":
        case "nowplaying":
            sendActionToTab( ACTIONS_TYPE.wResp, responseTabID, ytmTabID, COMMANDS.nowPlaying );
            break;


        // Controls

        case "prev":
            sendActionToTab( ACTIONS_TYPE.wResp, responseTabID, ytmTabID, COMMANDS.prev );
            break;
        
        case "skip":
        case "s":
            sendActionToTab( ACTIONS_TYPE.wResp, responseTabID, ytmTabID, COMMANDS.skip );
            break;

        case "pause":
        case "p":
        case "resume":
        case "r":
            sendActionToTab( ACTIONS_TYPE.wResp, responseTabID, ytmTabID, COMMANDS.pause );
            break;


        // Other

        case "sr":
        case "radio":
        case "startradio":
        case "start radio":
            sendActionToTab( ACTIONS_TYPE.preRender, responseTabID, ytmTabID, RENDER.renderOptionsMenu, COMMANDS.startRadio );
            break;


        // Help
        
        case "help":
        case "h":
            let commandsListMessage = makeCommandsListMessage( COMMANDS_LIST );
            let finalMessage = "📕 Lista de comandos: \n\n" + commandsListMessage;
            sendResponseMessage( responseTabID, finalMessage );
            break;


        default:
            sendResponseMessage( responseTabID, `❓ No se reconoce el comando` );
    }
    
}


function searchCommandWithQuery( responseTabID, ytmTabID, candidate, query ) {

    switch( candidate ) {

        case "play":
            sendActionToTab( ACTIONS_TYPE.play, responseTabID, ytmTabID, COMMANDS.play, null, query );
            break;

        case "search":
            sendActionToTab( ACTIONS_TYPE.search, responseTabID, ytmTabID, null, null, query );
            break;

        default:
            sendResponseMessage( responseTabID, `❓ No se reconoce el comando` );
    }
    
}


function sendActionToTab( type, responseTabID, ytmTabID, action, nextAction = null, query = "" ) {

    switch (type) {

        case ACTIONS_TYPE.search:
        case ACTIONS_TYPE.play:

            query = query.toLowerCase();
            const URL = `https://music.youtube.com/search?q=${query.replace(" ", "+")}`;

            chrome.tabs.update(ytmTabID, {url: URL});

            if ( type == ACTIONS_TYPE.search ) {
                sendResponseMessage( responseTabID, `✅ Mostrando los resultados de la búsqueda...` );
                return;
            }

            function onUpdatedListener(tabId, changeInfo, tab) {
                if (tabId === ytmTabID && changeInfo.status === 'complete') {
                    sendActionToTab(ACTIONS_TYPE.wResp, responseTabID, ytmTabID, action);
                    chrome.tabs.onUpdated.removeListener(onUpdatedListener);
                }
            }

            chrome.tabs.onUpdated.addListener(onUpdatedListener);

            break;

        case ACTIONS_TYPE.preRender:
            chrome.scripting.executeScript({
                target: {tabId: ytmTabID},
                func: action
            }, function (result) {
                
                let response = result[0].result;
        
                if ( !response || response.status != 0 ) {
                    sendResponseMessage( responseTabID, `❌ No pudieron realizarse las preparaciones para el accionar del comando` );
                    return;
                }

                sendActionToTab( ACTIONS_TYPE.wResp, responseTabID, ytmTabID, nextAction )

            });
            break;

        case ACTIONS_TYPE.wResp:
            chrome.scripting.executeScript({
                target: {tabId: ytmTabID},
                func: action
            }, function (result) {
                
                let response = result[0].result;
        
                if ( !response || response.status != 0 ) {
                    sendResponseMessage( responseTabID, `❌ El comando no pudo completarse con éxito (${response.message})` );
                    return;
                }
        
                sendResponseMessage( responseTabID, response.message );
            });
            break;

        default:
            chrome.scripting.executeScript({
                target: {tabId: ytmTabID},
                func: action
            });

    }

}


function sendResponseMessage( meetID, message ) {
    chrome.scripting.executeScript({
        target: {tabId: meetID},
        func: RESPONSE.responseInChat,
        args: [message]
    });
}