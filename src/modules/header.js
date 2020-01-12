'use strict';

const headerFactory = (_parentNode, _navLabels) => {

    const _headerBGNode = document.createElement('div');
    const _headerNode = document.createElement('div');
    const _titleContainerNode = document.createElement("div");
    const _logoNode = document.createElement("img");
    const _navBarNode = document.createElement("div");
    const _navGridNode = document.createElement("div");
    const navButtons = [];

    _headerBGNode.className = "header-bg";
    _headerNode.className = "header-cont";
    _titleContainerNode.className = "logo-cont";
    _navBarNode.className = "nav-bar";
    _navGridNode.className = "nav-grid";
    _logoNode.className = "logo";
    _logoNode.src = '../src/images/fiftiesDinerLogo.png';
    _logoNode.alt = "The 50's Diner";
    _logoNode.width = 300;
    _logoNode.height = 225;

    for(let i = 0; i < _navLabels.length; i++){

        const _navButtonContainer = document.createElement('div');
        navButtons.push(document.createElement("img"));
        navButtons[i].className = 'nav-button';
        navButtons[i].alt = _navLabels[i];
        navButtons[i].src = `../src/images/${_navLabels[i].toLowerCase()}.png`;
        navButtons[i].width = 120;
        navButtons[i].height = 60;
        _navButtonContainer.appendChild(navButtons[i]);
        _navGridNode.appendChild(_navButtonContainer);
    }
    _titleContainerNode.appendChild(_logoNode);
    _navBarNode.appendChild(_navGridNode);
    _headerNode.appendChild(_headerBGNode);
    _headerNode.appendChild(_titleContainerNode);
    _headerNode.appendChild(_navBarNode);
    _parentNode.appendChild(_headerNode);

    return { navButtons };
};

export{ headerFactory };