
export const COMMANDS = {

    prev: () => {
        let prevButtom = document.querySelector(".previous-button");

        if ( prevButtom ) prevButtom.click();
        else {
            console.warn("❌ No se encuentra el elemento");
        }
    },

    skip: () => {
        let prevButtom = document.querySelector(".next-button");

        if ( prevButtom ) prevButtom.click();
        else {
            console.warn("❌ No se encuentra el elemento");
        }
    },

    pause: () => {
        let prevButtom = document.querySelector(".play-pause-button");

        if ( prevButtom ) prevButtom.click();
        else {
            console.warn("❌ No se encuentra el elemento");
        }
    },


    def: () => {
        console.log("Comando random 🐱‍👤🚨🤖😼🐱‍🏍")
    }

}