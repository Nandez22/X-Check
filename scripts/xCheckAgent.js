

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
        case 'evaluateXPath':
            const results = document.evaluate(xPath, document, null, XPathResult.ANY_TYPE);
            const elements = [];

            let result = results.iterateNext();
            
            while (result) {
                elements.push(result);
                result = results.iterateNext();
            }
            
             sendResponse(elements);
            return true;
    }
});