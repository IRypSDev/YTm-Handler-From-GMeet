
export const COMMANDS = {

    prev: () => {
        let prevButton = document.querySelector(".previous-button");
        
        if ( !prevButton ) return { status: 1, message: "❌ No se encuentra el elemento" };

        prevButton.click();
        return { status: 0, message: "✅ Retrocediendo..." };
    },

    skip: () => {
        let nextButton = document.querySelector(".next-button");

        if ( !nextButton ) return { status: 1, message: "❌ No se encuentra el elemento" };

        nextButton.click();
        return { status: 0, message: "✅ Saltando a la siguiente canción..." };
    },

    pause: () => {
        let pauseButton = document.querySelector(".play-pause-button");

        if ( !pauseButton ) return { status: 1, message: "❌ No se encuentra el elemento" };

        pauseButton.click();
        return { status: 0, message: "✅ Pausando/Reanudando..." };
    },

}