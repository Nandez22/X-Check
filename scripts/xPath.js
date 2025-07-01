export function evaluateXPath(xPath) {
    const elements = [];
    const xPathEval = docuemnt.evaluate(xPath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);

    for(let i = 0; i < xPathEval.snapshotLength; i++){
        elements.push(xPathEval.snapshotItem(i));
    }

    return elements;
}