
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


    nowPlaying: () => {

        try {

            // title
            let titleElement = document.querySelector("yt-formatted-string.title.ytmusic-player-bar");
            let title = titleElement.textContent || titleElement.getAttribute("title");

            // url
            let currentURL = window.location.href;

            if (!currentURL.includes("/watch?")) {
                let tooglePlayerButton = document.querySelectorAll("tp-yt-paper-icon-button.toggle-player-page-button.style-scope.ytmusic-player-bar");
                tooglePlayerButton[tooglePlayerButton.length-1].click();
                currentURL = window.location.href;
            }

            let url = currentURL.split("&")[0];

            let message = `✅ Ahora suena: 🎶 ${title} 🎶\n🔗 ${url}`;
            return { status: 0, message: message };

        } catch (e) {
            return { status: 1, message: "❌ No se puede obtener el nombre o url de la pista actual" };
        }
    },

}