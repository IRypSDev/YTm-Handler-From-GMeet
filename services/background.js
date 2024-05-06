import { COMMANDS } from "../scripts/commands.js";

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {

    // sendResponse({farewell: "goodbye"});

    switch( request.type ) {

        case "COMMAND":
            // console.log("Debería accionar un comando")

            chrome.storage.session.get(['selectedTabId'], function(result) {
    
                let tabId = result.selectedTabId;
                if (!!!tabId) {
                    console.warn("❌ No se tiene una tab seleccionada");
                    return;
                };
        
                chrome.tabs.get(tabId, function(tab) {
        
                    if ( !!!tab ) {
                        console.warn("❌ No se tiene una tab con ID válido");
                        return;
                    }
        
                    executeCommand( tab.id, request.message );
                });
            });

            break;

        default:
            console.log("❌ No se reconoce el mensaje")

    }

});



function executeCommand( tabID, command ) {

    switch( command ) {

        case "prev":
            chrome.scripting.executeScript({
                target: {tabId: tabID},
                func: COMMANDS.prev
            });
            break;
        
        case "skip":
        case "s":
            chrome.scripting.executeScript({
                target: {tabId: tabID},
                func: COMMANDS.skip
            });
            break;

        case "pase":
        case "p":
        case "resume":
        case "r":
            chrome.scripting.executeScript({
                target: {tabId: tabID},
                func: COMMANDS.pause
            });
            break;

        default:
            chrome.scripting.executeScript({
                target: {tabId: tabID},
                func: COMMANDS.def
            });
    }

}