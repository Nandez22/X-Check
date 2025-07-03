// content.js
console.log("xCheckAgent.js loaded");
injectStylesheet('resources/xc-styles.css');



chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.data.type === "evalXPath") {
        removeHighlights();

        let results = evalXPath(message.data.xPath)
        highlightResults(results);
        sendResponse(packageResults(results));
    }
});

function packageResults(elements) {
    if (!elements || elements.length === 0) {
        return [];
    }

    return elements.map(element => {
        return {
            tagName: element.tagName,
        };
    });
}

function evalXPath(xPath){
    try{
        let results = document.evaluate(xPath, document, null, XPathResult.ANY_TYPE)
        let elements = [];

        let result = results.iterateNext();
        while (result) {
            elements.push(result);
            result = results.iterateNext();
        }

        return elements;

    } catch (error) {
        return [];
    }
}

function highlightResults(results) {
    if (!results || results.length === 0) { return; }
    results.forEach(element => {
        element.classList.add('xc-highlight');
    });
}

function removeHighlights() {
    let highlightedElements = document.querySelectorAll('.xc-highlight');
    highlightedElements.forEach(element => {
        element.classList.remove('xc-highlight');
    });
}


function injectStylesheet(path) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = chrome.runtime.getURL(path);
    document.head.appendChild(link);
}