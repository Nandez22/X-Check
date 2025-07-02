import { evaluateXPath } from "../scripts/xPathUtils.js";

document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById('xPath-Input');
    
    input.addEventListener('input', () => {
        const xPath = input.value;
        console.log(`Evaluating XPath: ${xPath}`);

        evaluateXPath(input.value, document);

        browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
            browser.tabs.executeScript(tabs.id, { 
                file: '../scripts/xCheckAgent.js'
            }).then(() => {
                browser.tabs.sendMessage(tabs.id, { action: 'evaluateXPath', xPath: xPath }).then((results) => {
                    console.log('Results:', results);
                    displayResults(results);
                }).catch((error) => {
                    console.error('Error sending message to content script:', error);
                });
            })
        });
    });
});