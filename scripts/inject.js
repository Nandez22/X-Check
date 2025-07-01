var style = document.getElementById('xCheck-Style-Link');
if(style) { removeStyle(style); }
else { injectStyle(createStyleLink('globalStyles/xCheckHighlight.css')); }

function createStyleLink(source) {
    const link = document.createElement('link');
    link.id = 'xCheck-Style-Link';
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = chrome.runtime.getURL(source);

    return link;
}

function injectStyle(link) {
    document.head.appendChild(link);
}

function removeStyle(link){
    document.head.removeChild(link);
}
