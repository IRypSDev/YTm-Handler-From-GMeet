

chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {

    // sendResponse({farewell: "goodbye"});

    switch( request.type ) {

        case "COMMAND":
            console.log("Debería accionar un comando")
            break;

        default:
            console.log("❌ No se reconoce el mensaje")

    }

});
