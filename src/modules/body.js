'use strict';

import { Engine, Scene, Color3, Texture, UniversalCamera, Vector3, HemisphericLight, PointLight, MeshBuilder, StandardMaterial } from 'babylonjs';

const bodyFactory = (_parentNode, _navButtons) => {

    const _navController = (e) => {
        console.log(e);
    };

    const _canvasNode = document.createElement("canvas");
    _parentNode.appendChild(_canvasNode);
    _canvasNode.id = "renderCanvas";

    const engine = new Engine(_canvasNode, true);

    const createScene = () => {
        const scene = new Scene(engine);
        const _camera = new UniversalCamera("camera", new Vector3(0,0,-15.5), scene);
        
        //camera.attachControl(_canvasNode, false);
        _camera.noRotationConstraint = false;
        _camera.setTarget(new Vector3.Zero());

        //const _light = new PointLight("light", new Vector3(0,1,-1), scene);
        //const _light2 = new HemisphericLight("light2", new Vector3(0, 1, 0), scene);
        const _plane = MeshBuilder.CreatePlane("plane", {width: 20.48, height: 13.31}, scene);
        const _bgTexture = new Texture('https://t3.ftcdn.net/jpg/02/12/43/28/240_F_212432820_Zf6CaVMwOXFIylDOEDqNqzURaYa7CHHc.jpg');

        _plane.material = new StandardMaterial('non-lit', scene);
        _plane.material.disableLighting = true;
        _plane.material.emissiveColor = Color3.White();
        _plane.material.diffuseTexture = _bgTexture;
        //_light.intensity = 100;
        //_light2.intensity = 1;

        for(let i = 0; i < _navButtons.length; i++){
            _navButtons[i].addEventListener("click", _navController);
        }

        console.log('rough');
        
        return scene;
    };
    const scene = createScene();

    return { scene, engine };
};

export { bodyFactory };