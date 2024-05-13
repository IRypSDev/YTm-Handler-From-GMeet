import { RENDER, COMMANDS } from "../scripts/commands.js";
import { RESPONSE } from "../scripts/responses.js";

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

            searchCommand( responseTabID, tab.id, command );
        });
    });


}



const ACTIONS_TYPE = {
    preRender: "pre-render",
    wResp: "with-response"
}

function searchCommand( responseTabID, ytmTabID, candidate ) {

    switch( candidate ) {

        //Info
        
        case "np":
        case "nowplaying":
            sendActionToTab( ACTIONS_TYPE.wResp, responseTabID, ytmTabID, COMMANDS.nowPlaying, null );
            break;

        // Controls

        case "prev":
            sendActionToTab( ACTIONS_TYPE.wResp, responseTabID, ytmTabID, COMMANDS.prev, null );
            break;
        
        case "skip":
        case "s":
            sendActionToTab( ACTIONS_TYPE.wResp, responseTabID, ytmTabID, COMMANDS.skip, null );
            break;

        case "pause":
        case "p":
        case "resume":
        case "r":
            sendActionToTab( ACTIONS_TYPE.wResp, responseTabID, ytmTabID, COMMANDS.pause, null );
            break;


        // Other
        case "sr":
        case "radio":
        case "startradio":
        case "start radio":
            sendActionToTab( ACTIONS_TYPE.preRender, responseTabID, ytmTabID, RENDER.renderOptionsMenu, COMMANDS.startRadio );
            break;

        default:
            sendResponseMessage( responseTabID, `❓ No se reconoce el comando` );
    }
    
}


function sendActionToTab( type, responseTabID, ytmTabID, action, nextAction ) {

    switch (type) {

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

                sendActionToTab( ACTIONS_TYPE.wResp, responseTabID, ytmTabID, nextAction, null )

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