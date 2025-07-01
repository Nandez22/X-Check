
export function highlightElement(element) {
    const border = document.createElement('div');
    border.classList.add('xpath-highlight')
}

export function injectStyle(path){
    const link = document.createElement('link');
    link.href = browser.runtime.getURL(path);
    link.rel = 'stylesheet';
    link.type = 'text/css';
    document.head.appendChild(link);
}