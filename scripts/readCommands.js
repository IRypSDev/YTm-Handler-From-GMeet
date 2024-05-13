
// CONFIGURATIONS

const CHAT_JSNAME = "xySENc";
const USERNAME_CLASS = "poVWob";
const MESSAGE_TIME_CLASS = "MuzmKe";
const MESSAGE_SET_CLASS = "EY8ABd-OWXEXe-TAWMXe";

const MAIN_COMMAND = "!";



function searchChat() {

    let chatbox = document.querySelector(`div[jsname="${CHAT_JSNAME}"]`);

    if ( !chatbox ) {
        console.log("❌ No se encuentra el elemento, reintentando...");
        return;
    }

    clearInterval(waitToChat);
    console.log("✅ Se encontró el elemento");
    observeChatbox( chatbox );
}

let waitToChat = setInterval(searchChat, 3000);



function observeChatbox( chatBoxElement ) {

    const observer = new MutationObserver((mutationsList, observer) => {
        for(let mutation of mutationsList) {
            
            if ( 
                mutation.type === 'childList' 
                && mutation.addedNodes[0]?.nodeName === "#text" 
                && !mutation.target.classList.contains("google-material-icons") 
                && !mutation.target.classList.contains(USERNAME_CLASS) 
                && !mutation.target.classList.contains(MESSAGE_TIME_CLASS) 
                && !mutation.target.classList.contains(MESSAGE_SET_CLASS) 
            ) {

                let message = mutation.addedNodes[0].data;
                console.log(`El mensaje enviado es: ${message}`);

                if ( message.toString().startsWith(MAIN_COMMAND) ) {
                    sendCommand( message.split(MAIN_COMMAND)[1] );
                }

            }
        }
    });

    if (chatBoxElement) {
        observer.observe(chatBoxElement, { childList: true, subtree: true });
        sendMessageOnChatbox("🎧 Esperando comandos...");
    } else {
        console.warn("❌ Ocurrió un error al recibir el elemento de chat");
    }

}


async function sendCommand( command ) {

    try {
        console.log( `⏲ Ejecutando comando (${ command })` );
        await chrome.runtime.sendMessage({ type: "COMMAND", message: command });
        console.log( "✅ Comando ejecutado" );
    } catch {
        console.warn("❌ Ocurrió un error inesperado al ejecutar el comando");
    }

}


function sendMessageOnChatbox( message ) {
    let textInput = document.querySelector(`textarea[jsname="YPqjbf"]`);
    let sendButton = document.querySelector(`.mcadHd`).querySelector('button');

    if ( !textInput || !sendButton ) return;

    textInput.value = message;
    sendButton.disabled = false; // force button
    sendButton.click();
}