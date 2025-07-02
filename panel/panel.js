import { evaluateXPath } from "../scripts/evaluateXPath.js";

document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById('xPath-Input');
    
    input.addEventListener('input', () => {
      const xPath = input.value;
      console.log(`Evaluating XPath: ${xPath}`);

        evaluateXPath(input.value);
    });
});