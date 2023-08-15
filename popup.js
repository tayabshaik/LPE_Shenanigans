
const LS = {
    getAllItems: () => chrome.storage.local.get(),
    getItem: async key => (await chrome.storage.local.get(key))[key],
    setItem: (key, val) => chrome.storage.local.set({ [key]: val }),
    removeItems: keys => chrome.storage.local.remove(keys),
  };
  
  const refreshPage = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.reload(tabs[0].id);
    });
  }
  
  const clearLocalStorageScript = () => {
    localStorage.clear();
  }
  
  const clearLocalStorageForDomain = (domain) => {
    chrome.tabs.query({}, function (tabs) {
      tabs.forEach(function (tab) {
        if (tab.url.includes(domain)) {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: clearLocalStorageScript
          });
  
          refreshPage();
        }
      });
    });
  }
  
  
  const clearDaznStaging = () => {
    clearLocalStorageForDomain("stag.dazn.com");
  };
  
  
  const ConnectLocalToStaging = async (domain) => {
    const tabs = await chrome.tabs.query({});
    for (const tab of tabs) {
      if (tab.url.includes(domain)) {
        try {
          console.log('trying script execution')
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: () => {
              const key = '@dazn/landing-page-experiments/developmentPath';
              const value = 'http://localhost:9000';
              localStorage.setItem(key, value);
            },
          }
          )
          refreshPage();
  
        }
        catch (err) {
          console.error(`failed to execute script: ${err}`);
        }
  
  
      }
    }
  
  };
  
  document.getElementById("refreshButton").addEventListener("click", refreshPage);
  document.getElementById("clearDaznStagingButton").addEventListener("click", clearDaznStaging);
  document.getElementById("ConnectLocalToStaging").addEventListener("click", () => ConnectLocalToStaging("stag.dazn.com"));
  
  