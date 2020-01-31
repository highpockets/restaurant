'use strict';

import{ headerFactory } from './modules/header.js';
import { footerFactory } from './modules/footer.js';
import { bodyFactory } from './modules/body.js';
import './index.css';

const parentNode = document.getElementById('content');
const siteHeader = headerFactory(parentNode, ["Home", "Menu", "Contact"]);
const siteBody = bodyFactory(parentNode, siteHeader.navButtons);
footerFactory(parentNode);

siteBody.engine.runRenderLoop(() =>{
    siteBody.scene.render();
});

siteBody.engine.resize();

window.addEventListener("resize", () => {
    siteBody.engine.resize();
});