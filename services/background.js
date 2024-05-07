import { COMMANDS } from "../scripts/commands.js";
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




function searchCommand( responseTabID, ytmTabID, candidate ) {

    switch( candidate ) {

        case "prev":
            sendActionToTab( responseTabID, ytmTabID, COMMANDS.prev );
            break;
        
        case "skip":
        case "s":
            sendActionToTab( responseTabID, ytmTabID, COMMANDS.skip );
            break;

        case "pause":
        case "p":
        case "resume":
        case "r":
            sendActionToTab( responseTabID, ytmTabID, COMMANDS.pause )
            break;

        default:
            sendResponseMessage( responseTabID, `❓ No se reconoce el comando` );
    }
    
}


function sendActionToTab( responseTabID, ytmTabID, action ) {
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
}


function sendResponseMessage( meetID, message ) {
    chrome.scripting.executeScript({
        target: {tabId: meetID},
        func: RESPONSE.responseInChat,
        args: [message]
    });
}