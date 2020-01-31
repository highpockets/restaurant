'use strict';

import HomeImg from '../images/home.png';
import MenuImg from '../images/menu.png';
import ContactImg from '../images/contact.png';
import HomeLitImg from '../images/homeLit.png';
import MenuLitImg from '../images/menuLit.png';
import ContactLitImg from '../images/contactLit.png';
import Logo from '../images/fiftiesDinerLogo.png';

const headerFactory = (_parentNode, _navLabels) => {

    const _headerBGNode = document.createElement('div');
    const _headerNode = document.createElement('div');
    const _titleContainerNode = document.createElement("div");
    const _logoNode = document.createElement("img");
    const _navBarNode = document.createElement("div");
    const _navGridNode = document.createElement("div");
    const _buttonImgs = [[HomeImg,HomeLitImg],[MenuImg,MenuLitImg],[ContactImg,ContactLitImg]];
    const navButtons = [];
    const _buttonLitStates = [];

    _headerBGNode.className = "header-bg";
    _headerNode.className = "header-cont";
    _titleContainerNode.className = "logo-cont";
    _navBarNode.className = "nav-bar";
    _navGridNode.className = "nav-grid";
    _logoNode.className = "logo";
    _logoNode.src = Logo;
    _logoNode.alt = "The 50's Diner";
    _logoNode.width = 200;
    _logoNode.height = 150;

    for(let i = 0; i < _navLabels.length; i++){
        const _navButtonContainer = document.createElement('div');
        navButtons.push(document.createElement("img"));
        navButtons[i].className = 'nav-button';
        navButtons[i].alt = _navLabels[i];
        if(i === 0){ 
            navButtons[i].src = _buttonImgs[i][1];
            _buttonLitStates.push(true);
            navButtons[i].width = 120;
            navButtons[i].height = 60;
        }
        else{
            navButtons[i].src = _buttonImgs[i][0];
            _buttonLitStates.push(false);
            navButtons[i].width = 100;
            navButtons[i].height = 50;
        } 
        _navButtonContainer.appendChild(navButtons[i]);
        _navGridNode.appendChild(_navButtonContainer);
    }
    _titleContainerNode.appendChild(_logoNode);
    _navBarNode.appendChild(_navGridNode);
    _headerNode.appendChild(_headerBGNode);
    _headerNode.appendChild(_titleContainerNode);
    _headerNode.appendChild(_navBarNode);
    _parentNode.appendChild(_headerNode);

    for(let i = 0; i < navButtons.length; i++){
        navButtons[i].onmouseover = () => {
            navButtons[i].src = _buttonImgs[i][1];
        }
        navButtons[i].onmouseleave = () => {
            navButtons[i].src = (_buttonLitStates[i]) ? _buttonImgs[i][1] : _buttonImgs[i][0];
        }
        navButtons[i].onclick = () => {
            navButtons[i].src = _buttonImgs[i][1];
            _buttonLitStates[i] = true;

            for(let j = 0; j < navButtons.length; j++){
                if(j !== i){
                    _buttonLitStates[j] = false;
                    navButtons[j].src = _buttonImgs[j][0];
                }
            }
        }
    }

    return { navButtons };
};

export{ headerFactory };