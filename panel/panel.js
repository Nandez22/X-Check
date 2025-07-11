
let doc;
let resultsContainer;
const icons = [
    'VISIBILITY',
    'GROUP_WORK',
    'HDR_AUTO',
    'ADS_CLICK',
    'STROKE_FULL'
];


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
                sendEmphasizeRequest(row);
            }
        });
        
        resultsContainer.addEventListener('mouseout', e => {
            const row = e.target.closest('.result-row');

            if(row){
                if(!row.classList.contains('active')) {
                    sendRemoveEmphasisRequest(row);
                }
            }
        })
        
        resultsContainer.addEventListener('click', e => {
            const showAttributes = e.target.closest('.show-attributes');
            const rowBody = e.target.closest('.result-row-body');

            if(showAttributes) {
                const attributes = rowBody.querySelector('.attributes');
                var expanded = showAttributes.getAttribute('aria-expanded') === 'true';

                showAttributes.setAttribute('aria-expanded', String(!expanded));
                attributes.setAttribute('aria-hidden', String(expanded))
                return;
            }

            const row = e.target.closest('.result-row');
            if(rowBody) { 
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
    const article = doc.createElement('article');
    article.className = 'result-row';
    article.setAttribute('xc-id', result.UID);

    const body = doc.createElement('div');
    body.className = 'result-row-body';
    const text = doc.createElement('div');
    text.className = 'result-text';

    const header = doc.createElement('div');
    header.className = 'result-row-header';

    const title = doc.createElement('h3');
    title.className = 'result-title';
    title.textContent = result.UID;

    const toggle = doc.createElement('button');
    toggle.className = 'toggle-attributes';

    const toggleText = doc.createElement('span');
    toggleText.textContent = 'Show Attributes';

    const toggleIcon = doc.createElement('i');
    toggleIcon.classList.add('toggle-icon');
    toggleIcon.classList.add('material-symbols-outlined');
    toggleIcon.textContent = 'ARROW_RIGHT';

    const iconContainer = doc.createElement('div');
    iconContainer.className = 'result-icons';

    icons.forEach(name => {
        let icon = doc.createElement('i');
        icon.classList.add('result-icon');
        icon.classList.add('material-symbols-outlined');
        icon.textContent = name;
        iconContainer.appendChild(icon);
    });
    
    const copyButton = doc.createElement('button');
    copyButton.classList.add('result-copy');
    copyButton.classList.add('material-symbols-outlined')
    copyButton.textContent = 'content_copy';
    
    const attributes = doc.createElement('div');
    attributes.className = 'attributes';
    attributes.textContent = result.attributes

    toggle.appendChild(toggleText);
    toggle.appendChild(toggleIcon);

    text.appendChild(title);
    text.appendChild(toggle);

    body.appendChild(header);
    header.appendChild(text);
    header.appendChild(iconContainer);
    body.appendChild(attributes);

    article.appendChild(body);
    article.appendChild(copyButton);

    resultsContainer.appendChild(article);
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