export function evaluateXPath(xPath, document){
    if(!xPath || !document){ 
        console.error(`
            Invalid xPath or document reference provided.
            xPath provided: ${xPath? 'True' : 'False'}
            Document provided: ${document? 'True' : 'False'}
        `); 
    }

    let results = getResults(xPath, document);
    console.log(results);
}

function getResults(xPath, document){
    try {
        const results = document.evaluate(xPath, document, null, XPathResult.ANY_TYPE);
        const elements = [];

        let result = results.iterateNext();
        
        while (result) {
            elements.push(result);
            result = results.iterateNext();
        }
        
        return elements;

    } catch (error) {
        console.error(`Error evaluating XPath: ${error.message}`);
        return [];
    }
}