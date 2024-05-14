export const RENDER = {

    renderOptionsMenu: async () => {
        try {
            let optionsMenu = document.querySelector("ytmusic-menu-renderer.ytmusic-player-bar");
            let optionsMenuButton = optionsMenu.querySelector("yt-button-shape.ytmusic-menu-renderer");

            optionsMenuButton.click();
            optionsMenuButton.click();

            return { status: 0, message: "" };

        } catch (e) {
            return { status: 1, message: e.message };
        }
    }

}

export const COMMANDS = {

    play: () => {

        try {

            let bestResultContainer = document.querySelector("div.card-content-container.style-scope.ytmusic-card-shelf-renderer");

            if ( bestResultContainer )  {
                let buttonCTA = bestResultContainer.querySelector("button.yt-spec-button-shape-next--filled");
                buttonCTA.click();
                return { status: 0, message: "✅ Reproduciendo..." };
            }
            
            let listResults = document.querySelectorAll("ytmusic-responsive-list-item-renderer");
            let resultSelected = listResults[1];
            let linkResult = resultSelected.querySelector("yt-formatted-string.title").querySelector("a");
            linkResult.click();
            
            return { status: 0, message: "✅ Reproduciendo..." };

        } catch (e) {
            return { status: 1, message: e.message };
        }

    },

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


    startRadio: () => {

        try {

            let startRadioOption = document.querySelectorAll("ytmusic-menu-navigation-item-renderer")[0];
            if ( !startRadioOption ) return { status: 1, message: "❌ No se encuentran las opciones \n🔍 Asegúrese de tener una pista válida \n(Escriba !restart o !reset y vuelva a intentarlo)" };
            let startRadioButton = startRadioOption.querySelector("a");
            startRadioButton.click();

            return { status: 0, message: "✅ Iniciando radio..." }; 

        } catch (e) {
            return { status: 1, message: "❌ No se puede iniciar la radio" };
        }
    }

}