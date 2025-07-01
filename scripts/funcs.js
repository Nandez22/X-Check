function evaluateXPath(xPath) {
    const elements = [];
    const xPathEval = docuemnt.evaluate(xPath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);

    for(let i = 0; i < xPathEval.snapshotLength; i++){
        elements.push(xPathEval.snapshotItem(i));
    }

    return elements;
}

function highlightElement(element) {
    const border = document.createElement('div');
    border.classList.add('xpath-highlight')
}

function injectSty(path){
    const link = document.createElement('link');
    link.href = browser.runtime.getURL(path);
    link.rel = 'stylesheet';
    link.type = 'text/css';
    document.head.appendChild(link);
}