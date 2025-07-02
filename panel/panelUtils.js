export function displayResults(results) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    if (results.length === 0) {
        resultsContainer.textContent = 'No elements found.';
        return;
    }

    results.forEach(element => {
        const resultItem = document.createElement('div');
        resultItem.textContent = element.outerHTML;
        resultsContainer.appendChild(resultItem);
    });
}