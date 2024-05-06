document.addEventListener('DOMContentLoaded', function() {
    const tabsContainer = document.getElementById('tabsContainer');
  
    function updateTabsList() {
        chrome.tabs.query({url: "*://music.youtube.com/*"}, function(tabs) {
            
            removeAllChildsFromContainer( tabsContainer );

            tabs.forEach(tab => {
                const tabDiv = document.createElement('div');
                tabDiv.className = 'tab-item';
        
                const tabIcon = document.createElement('img');
                tabIcon.className = 'tab-icon';
                tabIcon.src = tab.favIconUrl || '/icon/tmp.png';
        
                const tabName = document.createElement('span');
                tabName.className = 'tab-name';
                tabName.textContent = tab.title || 'Sin título';
        
                tabDiv.appendChild(tabIcon);
                tabDiv.appendChild(tabName);

                tabDiv.addEventListener( "click", () => { saveSelectedTab(tab.id) } );

                tabsContainer.appendChild(tabDiv);

            });
        });
    }


    updateTabsList();


    chrome.tabs.onUpdated.addListener(function() {
        updateTabsList();
        recognizeSelectedTab();
    });


    function removeAllChildsFromContainer( nodeParent ) {
        let child = nodeParent.lastElementChild;
        while (child) {
            nodeParent.removeChild(child);
            child = nodeParent.lastElementChild;
        }
    }
    
    
    function saveSelectedTab( tabId ) {
        chrome.storage.session.set({selectedTabId: tabId}, function() {
            console.log('ID de la pestaña guardado/actualizado: ' + tabId);
        });

        recognizeSelectedTab();
    }
    
    
    function recognizeSelectedTab() {
    
        const selectedTabMessage = document.getElementById('selectedTabMessage');
        selectedTabMessage.innerText = "";

        const selectedImageTabContainer = document.getElementById('selectedImageTab');
        removeAllChildsFromContainer( selectedImageTabContainer );

        const selectedTabTitle = document.getElementById('infoTitle');
        const selectedTabID = document.getElementById('infoID');
    

        const notFoundText = ' (Ninguna)';
    

        chrome.storage.session.get(['selectedTabId'], function(result) {
    
            let tabId = result.selectedTabId;
    
            if (!!!tabId) {
                selectedTabMessage.innerText = notFoundText;
                return;
            }
    
            chrome.tabs.get(tabId, function(tab) {
    
                if ( !!!tab ) {
                    selectedTabMessage.innerText = notFoundText;
                    return;
                }
    
                const nowListeningImage = document.createElement('img');
                nowListeningImage.className = 'selected-image';
                nowListeningImage.src = getNowPlayingImage(tab?.url) || '/icon/tmp.png';

                selectedImageTabContainer.appendChild( nowListeningImage );

                selectedTabTitle.innerText = tab.title || "-";
                selectedTabID.innerText = tab.id || "-";
    
            });
        });
        
    }

    recognizeSelectedTab();



    function getNowPlayingImage( videoURL ) {

        if (!!!videoURL) return null;

        let splited = videoURL?.split("v=");
        let splitedAgain = splited[1]?.split("&");
        let videoId = splitedAgain ? splitedAgain[0] : null;

        return !!videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
    }

  });