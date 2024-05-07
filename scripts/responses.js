
export const RESPONSE = {

    responseInChat: ( message ) => {
        
        let textInput = document.querySelector(`textarea[jsname="YPqjbf"]`);
        let sendButton = document.querySelector(`.mcadHd`).querySelector('button');

        if ( !textInput || !sendButton ) {
            console.warn("❌ No se encuentra el input para devolver una respuesta");
        }

        textInput.value = `\n${message}\n`;
        sendButton.disabled = false; // force button
        sendButton.click();

    }
    
}