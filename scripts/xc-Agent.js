// content.js
console.log("xCheckAgent.js loaded");
injectStylesheet('resources/xc-styles.css');

var elementId = 0;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.data.type === "evalXPath") {
        removeHighlights();
        resetUIDs();

        let results = evalXPath(message.data.xPath)
        let resultsPackage = handleResults(results);

        sendResponse(resultsPackage);
        return true
    }
});

//TODO assign UID to each node for individual selections (will be reset and cleared per-search)
//This does not apply to anything other than ELEMENT_NODEs (since nothing else can be highlighted)
function serializeNode(node) {
    let data;
    switch(node.nodeType){
        case(Node.ELEMENT_NODE):
            data = {
                tagName: node.tagName,
                // While I hate to modify the DOM before serialization and then filter out the added attribute, it's the simplest way to do this.
                // I really hate it but the re-write required to do it 'better' would be pretty significant.
                attributes: Array.from(node.attributes).map(a => ({
                    name: a.name,
                    value: a.value
                })),
                UID: elementId++
            }
            break;

        case(Node.TEXT_NODE):
        case(Node.COMMENT_NODE):
            data = {
                text: node.textContent.trim()
            }
            break;

        case(Node.ATTRIBUTE_NODE):
            data = {
                name: node.name,
                value: node.value
            }
            break;

        case(Node.PROCESSING_INSTRUCTION_NODE):
            data = {
                target: node.target,
                data: node.data
            }
            break;

        default:
            console.warn("Unhandled Node type: ", node.nodeType);
            break;
    }

    return {
        nodeType: node.nodeType,
        data: data
    }
}

function packageIterators(results) {
    const nodes = [];
    let node;

    while((node = results.iterateNext())) { 
        nodes.push(node); 
    }
    return packageHelper(nodes);
}


function packageSnapshots(results) {
    const nodes = [];

    for(let i = 0; i < results.snapshotLength; i++){
        nodes.push(results.snapshotItem(i));
    }
    return packageHelper(nodes);
}

function packageHelper(nodes) {
    let sNode;
    return nodes.map(node => {
        sNode = serializeNode(node);
        applyUID(node, sNode.data.UID);
        highlightElement(node);
        return sNode;
    })
}

function evalXPath(xPath) {
    try {
        return document.evaluate(xPath, document, null, XPathResult.ANY_TYPE, null);
    } catch {
        return null;
    }
}

//We want to process different types of results
//For elements we want to highlight
//For expressions with bool, number or text responses we want to display them properly
function handleResults(results) {
    if(!results) return { type: null, data: null };
    let data = null

    switch(results.resultType) {
        case XPathResult.STRING_TYPE:
            data = results.stringValue;
            break;

        case XPathResult.NUMBER_TYPE:
            data = results.numberValue;
            break;

        case XPathResult.BOOLEAN_TYPE:
            data = results.booleanValue;
            break;

        case XPathResult.ORDERED_NODE_ITERATOR_TYPE:
        case XPathResult.UNORDERED_NODE_ITERATOR_TYPE:
            data = packageIterators(results);
            break;
        
        case XPathResult.ORDERED_NODE_SNAPSHOT_TYPE:
        case XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE:
            data = packageSnapshots(results);
            break;

        case XPathResult.ANY_UNORDERED_NODE_TYPE:
        case XPathResult.FIRST_ORDERED_NODE_TYPE:
            data = results.singleNodeValue;
            break;

        default:
            console.warn("Unhandled XPathResult Type: ", results.resultType);
            return { type: null, data: null };
    }

    let resultPackage = {
        type: results.resultType,
        data: data
    }
    console.log(`${resultPackage.type} : ${resultPackage.data}`)
    return resultPackage;
}


function highlightElement(node) {
    if(!node || node.nodeType != Node.ELEMENT_NODE) return;
    node.classList.add('xc-highlight');
}

function removeHighlight(element) {
    if(!element) return;
    element.classList.remove('xc-highlight');
}

function removeHighlights() {
    let highlightedElements = document.querySelectorAll('.xc-highlight');
    highlightedElements.forEach(element => {
        removeHighlight(element);
    });
}

function applyUID(node, id){
    if(!node || node.nodeType != Node.ELEMENT_NODE) return;

    node.setAttribute('xc-id', id)
}

function resetUIDs(){
    let elements = document.querySelectorAll('[xc-id]');
    elements.forEach(e => {
        e.removeAttribute('xc-id');
    });

    elementId = 0;
}

function injectStylesheet(path) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = chrome.runtime.getURL(path);
    document.head.appendChild(link);
}