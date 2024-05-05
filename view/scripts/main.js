document.addEventListener('DOMContentLoaded', function() {
    const tabsContainer = document.getElementById('tabsContainer');
  
    // Función para actualizar el listado de pestañas
    function updateTabsList() {
        chrome.tabs.query({url: "*://music.youtube.com/*"}, function(tabs) {
            
            removeAllTabsFromContainer( tabsContainer );

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

                tabsContainer.appendChild(tabDiv);
            });
        });
    }
  
    // Actualizar el listado inicialmente
    updateTabsList();
  
    // Escuchar el evento de actualización de pestañas
    chrome.tabs.onUpdated.addListener(function() {
      updateTabsList();
    });
  });




function removeAllTabsFromContainer( nodeParent ) {
    let child = nodeParent.lastElementChild;
    while (child) {
        nodeParent.removeChild(child);
        child = nodeParent.lastElementChild;
    }
}
