'use strict';

import{ headerFactory } from './modules/header.js';
import { bodyFactory } from './modules/body.js';

let parentNode = document.getElementById('content');
let siteHeader = headerFactory(parentNode, ["Home", "Menu", "Contact"]);
let siteBody = bodyFactory(parentNode, siteHeader.navButtons);

siteBody.engine.runRenderLoop(() =>{
    siteBody.scene.render();
});

siteBody.engine.resize();

window.addEventListener("resize", () => {
    siteBody.engine.resize();
});