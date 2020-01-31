'use strict';

const footerFactory = (_parentNode) => {

    //const canvasNode = document.createElement('canvas');
    const _footerNode = document.createElement('div');
    const footerBGNode = document.createElement('div');

    //canvasNode.id = 'render-canvas';
    _footerNode.className = 'footer-cont';
    footerBGNode.className = 'footer-bg';

    _footerNode.appendChild(footerBGNode);
    //_parentNode.appendChild(canvasNode);
    _parentNode.appendChild(_footerNode);

    return{ footerBGNode /*canvasNode*/ };
};

export { footerFactory };