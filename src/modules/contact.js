'use strict';

import { StandardMaterial, Texture, MeshBuilder, Vector3, Color3 } from "babylonjs";
import CardImg from '../images/contactCard.png';

const contactModule = (() => {

    const contactCard = (_scene) =>{
        const cardMesh = MeshBuilder.CreatePlane("card", {width: 5, height: 3.75}, _scene);

        cardMesh.material = new StandardMaterial('non-lit', _scene);
        cardMesh.material.disableLighting = true;
        cardMesh.material.emissiveColor = Color3.White();
        cardMesh.material.diffuseTexture = new Texture(CardImg, _scene);
        cardMesh.material.diffuseTexture.hasAlpha = true;
        cardMesh.position = new Vector3(cardMesh.position.x, cardMesh.position.y+6, cardMesh.position.z-6);

        return cardMesh;
    };
    const POS_STATE = {
        out_of_frame : 1,
        moving_in : 2,
        visible : 3,
        moving_out : 4
    };
    Object.freeze(POS_STATE);

    const pos = {
        hiddenY : 6, visibleY : 0
    };
    Object.freeze(pos);

    const moveRules = {
        maxSpeed : 9.0, minSpeed : 0.1,
        maxDist : 1, minDist : 0.05
    };
    Object.freeze(moveRules);

    let _posState = POS_STATE.out_of_frame;

    const setPosState = (_newState) =>{
        _posState = _newState;
    };
    const getPosState = () =>{
        return _posState;
    };

    return{ POS_STATE, setPosState, getPosState, contactCard, pos, moveRules };
})();

export { contactModule };