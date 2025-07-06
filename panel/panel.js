
let doc;
let resultsContainer;


document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById('xPath-Input');
    
    input.addEventListener('input', () => {
        const xPath = input.value;
        sendEvalRequest(xPath);
    });


    const iframe = document.getElementById('results');

    iframe.addEventListener('load', () => {
        doc = iframe.contentDocument || iframe.contentWindow.document;
        resultsContainer = doc.getElementById('results-container');

        resultsContainer.addEventListener('mouseover', e=> {
            const row = e.target.closest('.result-row');

            if(row){ 
                row.classList.add('hover');
                sendEmphasizeRequest(row);
            }
        });
        
        resultsContainer.addEventListener('mouseout', e => {
            const row = e.target.closest('.result-row');

            if(row){ 
                row.classList.remove('hover'); 
                if(!row.classList.contains('active')) {
                    sendRemoveEmphasisRequest(row);
                }
            }
        })
        
        resultsContainer.addEventListener('click', e => {
            const row = e.target.closest('.result-row');
        
            if(row){ 
                if(!row.classList.contains('active')) {
                    row.classList.add('active');
                    sendEmphasizeRequest(row); 
                }
                else {
                    row.classList.remove('active');
                    sendRemoveEmphasisRequest(row);
                }
            }
        });
    });    
});

function sendEvalRequest(xPath) {
    sendQuery({
        type: "evalXPath",
        value: xPath
    });
}

function sendEmphasizeRequest(row) {
    const UID = row.getAttribute('xc-id');
    if(!UID) return;

    sendQuery({
        type: "emphasizeElement",
        value: UID
    });

}

function sendRemoveEmphasisRequest(row) {
    const UID = row.getAttribute('xc-id');
    if(!UID) return;

    sendQuery({
        type: "removeEmphasis",
        value: UID
    });
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
    container.setAttribute('xc-id', result.UID);


    const text = doc.createElement('span');
    text.className = 'result-text';
    text.textContent = result.UID;
    
    const button = doc.createElement('button');
    button.classList.add('copy-side-button');
    button.textContent = 'Copy';
    
    container.appendChild(text);
    container.appendChild(button);
    resultsContainer.appendChild(container);
}


function unpackNodes(nodes) {
    if(!nodes) return;
    let elements = [];


    nodes.forEach(node => {
        switch(node.nodeType) {
            case(Node.ELEMENT_NODE):
                elements.push(node.data)
                break;

            case(Node.STRING_TYPE):
            case(Node.COMMENT_NODE):
                break;

            case(Node.ATTRIBUTE_NODE):
                break;

            case(Node.PROCESSING_INSTRUCTION_NODE):
                break;
        }
    });

    resultsContainer.innerHTML = '';
    elements.forEach(displayResult)
}

//TODO figure out what the fuck you are going to do with non element types
//For every query we want to reset result display 

function handleResponse(response) {
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