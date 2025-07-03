document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById('xPath-Input');
    
    input.addEventListener('input', () => {
        const xPath = input.value;
        sendEvalRequest(xPath);
    });
});


function sendEvalRequest(xPath){
    let data = {
        type: "evalXPath",
        xPath: xPath
    };  

    sendQuery(data);
}

function sendQuery(data){
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { data }, (response) => {
            console.log("Response from content script:", response)
            displayResults(response);
        });
    });
}

function createResultContainer(result, doc, resultsContainer) {
    const container = doc.createElement('div');
    container.className = 'result-row';

    const text = doc.createElement('span');
    text.className = 'result-text';
    text.textContent = result.tagName;
    
    const button = doc.createElement('button');
    button.classList.add('copy-side-button');
    button.textContent = 'Copy';
    
    container.appendChild(text);
    container.appendChild(button);
    resultsContainer.appendChild(container);
}


function displayResults(results) {
    const iframe = document.getElementById('results');
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    const resultsContainer = doc.getElementById('results-container');

    resultsContainer.innerHTML = '';
    if (!results || results.length === 0) { return; }

    results.forEach(result => {
        createResultContainer(result, doc, resultsContainer);
    });
}