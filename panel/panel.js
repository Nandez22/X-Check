const iframe = document.getElementById('results');
const doc = iframe.contentDocument || iframe.contentWindow.document;
const resultsContainer = doc.getElementById('results-container')


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
            handleResponse(response)
        });
    });
}

function displayResult(result) {
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


function unpackNodes(nodes) {
    if(!nodes) return;

    nodes.forEach(node => {
        switch(node.nodeType) {
            case(Node.ELEMENT_NODE):
                displayResult(node.data)
                break;

            case(Node.STRING_TYPE):
            case(Node.COMMENT_NODE):
                break;

            case(Node.ATTRIBUTE_NODE):
                break;

            case(Node.PROCESSING_INSTRUCTION_NODE):
        }
    })
}

//TODO figure out what the fuck you are going to do with non element types
//For every query we want to reset result display 

function handleResponse(response) {
    resultsContainer.innerHTML = '';

    if(!response || !response.type) {
        console.log("SomethingWrong")
        return;
    }

    switch(response.type) {
        case XPathResult.STRING_TYPE:
            //console.log(response.data)
            break;

        case XPathResult.NUMBER_TYPE:
            //console.log(response.data)
            break;

        case XPathResult.BOOLEAN_TYPE:
            //console.log(response.data)
            break;

        case XPathResult.ORDERED_NODE_ITERATOR_TYPE:
        case XPathResult.UNORDERED_NODE_ITERATOR_TYPE:
        case XPathResult.ORDERED_NODE_SNAPSHOT_TYPE:
        case XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE:
            //console.log(response.data)
            unpackNodes(response.data)
            break;

        case XPathResult.ANY_UNORDERED_NODE_TYPE:
        case XPathResult.FIRST_ORDERED_NODE_TYPE:
            //console.log(response.data)
            break;

        default:
            console.warn("Unhandled XPathResult Type: ", results.resultType);
            break;
    }
}