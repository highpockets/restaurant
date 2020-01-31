'use strict';

import { Engine, Scene, Color3, Texture, AssetsManager, UniversalCamera, Vector3, MultiMaterial, HemisphericLight, PointLight, MeshBuilder, StandardMaterial, _forceSceneHelpersToBundle } from 'babylonjs';
import { homeModule } from './home';
import { menuModule } from './menu';
import { contactModule } from './contact';
import BGImg from '../images/fiftiesDiner.png';
import MenuCoverImg from '../images/fiftiesDinerMenu.001.png';
import MenuMainImg from '../images/fiftiesDinerMenu.002.png';
import MainMenuSelectImg from '../images/mainMenu.png';
import MainMenuLitSelectImg from '../images/mainMenuLit.png';
import DessertMenuSelectImg from '../images/dessertMenu.png';
import DessertMenuLitSelectImg from '../images/dessertMenuLit.png';
import FiftiesMenu from '../scenes/fiftiesMenu.babylon';

const bodyFactory = (_parentNode, _navButtons) => {

    const _home = homeModule;
    const _menu = menuModule;
    const _contact = contactModule;
    const _swapState = {
        newSwap : false,
        home : false, menu : false, contact : false 
    };

    let _navLocation = _home;
    let _pageSwapping = false;
    let _fiftiesMenu = [];
    let _menuSelections = [];
    let _contactCardMesh;
    const _selectTextures = [[MainMenuSelectImg, MainMenuLitSelectImg],[DessertMenuSelectImg, DessertMenuLitSelectImg]];

    const _navController = (_e) => {
        const _label = _e.target.alt;
        const _location = (_label === "Home") ? _home :
        (_label === "Menu") ? _menu : _contact;

        if(_navLocation !== _location){
            if(_location === _menu){
                _menuSelections[0].material.subMaterials[0].diffuseTexture = _selectTextures[0][1];
                _menuSelections[1].material.subMaterials[0].diffuseTexture = _selectTextures[1][0];
            }
            _navLocation = _location;
            _swapState.newSwap = true;
            _swapState.contact = false;
            _swapState.home = false;
            _swapState.menu = false;
            _pageSwapping = false;
        }
    };

    const _canvasNode = document.createElement('canvas');
    _canvasNode.id = "renderCanvas";
    _parentNode.appendChild(_canvasNode);
    const engine = new Engine(_canvasNode, true);
    
    _home.createNodes(_parentNode);

    const _createScene = () => {
        const scene = new Scene(engine);
        const _camera = new UniversalCamera("camera", new Vector3(0,0,-15.5), scene);

        const _light = new PointLight("light", new Vector3(0,3,-15.5), scene);
        const _light2 = new HemisphericLight("light2", new Vector3(0, 1, 0), scene);

        const _bgPlane = MeshBuilder.CreatePlane("plane", {width: 20.48, height: 13.31}, scene);
        const _assetsManager = new AssetsManager(scene);
        const [file, ...path] = FiftiesMenu.split('/').reverse();
        const _meshTask = _assetsManager.addMeshTask('menu task', '', path.reverse().join('/') + '/', file, scene);
        const _menuMat = [new StandardMaterial('menu-mat', scene), new StandardMaterial('menu2-mat', scene)];
        const _multiMat = new MultiMaterial('multi-mat', scene);
        const _menuSelectMats = [new StandardMaterial('menu-select-mat', scene), new StandardMaterial('menu-select-mat2', scene)];
        const _selectMultiMats = [new MultiMaterial('select-multi-mat', scene), new MultiMaterial('select-multi-mat2', scene)];

        _light.intensity = 1.25;
        _light2.intensity = 0.5;
        _light.emissiveColor = new Color3(1, 0.84, 0.69);
        _light2.emissiveColor = new Color3(1, 0.84, 0.69);

        _bgPlane.material = new StandardMaterial('non-lit', scene);
        _bgPlane.material.disableLighting = true;
        _bgPlane.material.emissiveColor = Color3.White();
        _bgPlane.material.diffuseTexture = new Texture(BGImg);

        _contactCardMesh = _contact.contactCard(scene);

        _menuMat[0].diffuseTexture = new Texture(MenuCoverImg);
        _menuMat[1].diffuseTexture = new Texture(MenuMainImg);
        _multiMat.subMaterials.push(_menuMat[0]);
        _multiMat.subMaterials.push(_menuMat[1]);

        for(let i = 0; i < _selectTextures.length; i++){
            for(let j = 0; j < _selectTextures[i].length; j++){
                _selectTextures[i][j] = new Texture(_selectTextures[i][j]);
            }
        }

        _menuSelectMats[0].disableLighting = true;
        _menuSelectMats[0].emissiveColor = Color3.White();
        _menuSelectMats[0].diffuseTexture = _selectTextures[0][1];
        _menuSelectMats[1].diffuseColor = Color3.Black();

        for(let i = 0; i < 2; i++){
            _menuSelectMats.push(_menuSelectMats[i].clone());
            for(let j = 0; j < 2; j++){
                _selectMultiMats[j].subMaterials.push(_menuSelectMats[i+(j*2)]);
            }
        }

        _meshTask.onSuccess = (_task) => {
            _menuSelections.push(_task.loadedMeshes.splice(_task.loadedMeshes.length-1,1)[0]);
            _menuSelections.push(_menuSelections[0].clone());
            _menuSelections[1].setParent(_menuSelections[0]);
            _fiftiesMenu = _task.loadedMeshes.reverse();
            _fiftiesMenu[0].position = new Vector3(_menu.pos.closedX,_menu.pos.hiddenY, _menu.pos.staticZ);
            _fiftiesMenu[1].rotate(Vector3.Up(), Math.PI);
        
            for(let i = 1; i < _fiftiesMenu.length; i++){
                _fiftiesMenu[i].material = _multiMat;
            }
            for(let i = 0; i < _menuSelections.length; i++){
                _menuSelections[i].material = _selectMultiMats[i];
            }
            _menuSelections[0].position = new Vector3(_menu.pos.openX, _menu.pos.hiddenSelectY, _menu.pos.staticZ);
            _menuSelections[1].position = new Vector3(0.5, 0, 0);
            _menuSelections[1].scaling.x = 1.05;
            _menuSelections[1].material.subMaterials[0].diffuseTexture = _selectTextures[1][0];
            _registerActions(_menuSelections[0], _selectTextures[0][1], _selectTextures[0][0], 'main');
            _registerActions(_menuSelections[1], _selectTextures[1][1], _selectTextures[1][0], 'dessert');
            _registerActions(_contactCardMesh);
        };
        _meshTask.onError = () =>{ console.log("can't load mesh"); };

        for(let i = 0; i < _navButtons.length; i++){
            _navButtons[i].addEventListener("click", _navController);
        }

        _assetsManager.onFinish = (_tasks) => {
            scene.registerBeforeRender(() => {
                if(_swapState.newSwap){
                    if(_pageSwapping){ _swapPages(); }
                    else{ _setPageStatesForSwapping(); } 
                }
                if(_menu.rotState.newRot){
                    _menuRotation();
                }
            });
        };
        _assetsManager.load();

        return scene;
    };
    function _registerActions(_mesh, _litTexture = null, _unlitTexture = null, _name = null){
        _mesh.actionManager = new BABYLON.ActionManager(scene);
        if(_name === null){
            _mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, (_e) =>{
                window.location.href = "mailto:kris.tobiasson@gmail.com?subject=App/Web Development Inquiry";
            }));
            return;
        }
        _mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, (_e) =>{
            _mesh.material.subMaterials[0].diffuseTexture = _litTexture;
        }));
        _mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, (_e) =>{
            if(_navLocation === _menu){
                const _state = _menu.getPageState();
                if(_name === 'main'){
                    if(_state === _menu.PAGE_STATE.dessert || _state === _menu.PAGE_STATE.main_to_dessert){
                        _changePage(_menu.PAGE_STATE.dessert_to_main);
                        _menuSelections[1].material.subMaterials[0].diffuseTexture = _selectTextures[1][0];
                    }
                }
                else{
                    if(_state === _menu.PAGE_STATE.main || _state === _menu.PAGE_STATE.dessert_to_main || _state === _menu.PAGE_STATE.front_to_main){
                        _changePage(_menu.PAGE_STATE.main_to_dessert);
                        _menuSelections[0].material.subMaterials[0].diffuseTexture = _selectTextures[0][0];
                    }
                }
                function _changePage(_pageState){
                    _menu.setPageState(_pageState);
                    _menu.rotState.newRot = true;
                    _menu.rotState.menu = false;
                    _menu.rotState.front = false;
                }
            }
        }));
        _mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, (_e) =>{
            const _state = _menu.getPageState();
            (_name === 'main') ?
                (_state === _menu.PAGE_STATE.dessert || _state === _menu.PAGE_STATE.main_to_dessert) ?
                    _mesh.material.subMaterials[0].diffuseTexture = _unlitTexture :
                    _mesh.material.subMaterials[0].diffuseTexture = _litTexture
            :
                (_state !== _menu.PAGE_STATE.dessert && _state !== _menu.PAGE_STATE.main_to_dessert) ?
                    _mesh.material.subMaterials[0].diffuseTexture = _unlitTexture :
                    _mesh.material.subMaterials[0].diffuseTexture = _litTexture;
        }));
    }
    function _scaleAndCheckNav(_button, _dest){
        if(_button.width === _dest){ return true; }
        let _speed = 8;
        const _dist = Math.abs(_button.width-_dest);

        if(_speed > _dist){ _speed = _dist; } 
        (_button.width < _dest) ? _button.width+=_speed : _button.width-=_speed;
        _button.height = Math.floor(_button.width/2);
        if(_button.width === _dest){ return true; }
        else{ return false; }
    }
    function _menuRotation(){
        const _state = _menu.getPageState();
        let _frontPageTarget;
        let _menuTarget;
        let _rotDir = 1;
        let _moveComplete = true;
        
        if(!_swapState.newSwap){
            _moveComplete = _updateAndCheckMenuSelectMovement(_state);
        }
        if(_state === _menu.PAGE_STATE.front_to_main || _state === _menu.PAGE_STATE.dessert_to_main){
            _frontPageTarget = _fiftiesMenu[0].forward;
            _menuTarget = Vector3.Forward();
            if(_checkRotCompletion() && _moveComplete){ _menu.setPageState(_menu.PAGE_STATE.main); }
        }
        else if(_state === _menu.PAGE_STATE.main_to_front || _state === _menu.PAGE_STATE.dessert_to_front){
            _frontPageTarget = _fiftiesMenu[0].forward.scale(-1);
            _menuTarget = Vector3.Forward();
            _rotDir = -1;
            if(_checkRotCompletion() && _moveComplete){ _menu.setPageState(_menu.PAGE_STATE.front); }
        }
        else if(_state === _menu.PAGE_STATE.main_to_dessert){
            _frontPageTarget = _fiftiesMenu[0].forward.scale(-1);
            _menuTarget = Vector3.Backward();
            _rotDir = -1;
            if(_checkRotCompletion() && _moveComplete){ _menu.setPageState(_menu.PAGE_STATE.dessert); }
        }
        function _checkRotCompletion(){
            if(!_menu.rotState.front){
                _menu.rotState.front = _setAndCheckRot(_fiftiesMenu[1], _fiftiesMenu[1].forward, _frontPageTarget);
            }
            if(!_menu.rotState.menu){
                _menu.rotState.menu = _setAndCheckRot(_fiftiesMenu[0], _fiftiesMenu[0].forward, _menuTarget);
            }
            if(_menu.rotState.front && _menu.rotState.menu){
                _menu.rotState.newRot = false;
                return true;
            }
            return false;
        }
        function _setAndCheckRot(_mesh, _fromDir, _toDir){
            const _maxAngle = 1, _minAngle = 2;
            const _maxSpeed = 30, _minSpeed = 70;

            const _angle = Math.sqrt(Vector3.Dot(_toDir, _toDir)*Vector3.Dot(_fromDir, _fromDir))+Vector3.Dot(_toDir,_fromDir);
            const _step = (_angle < _maxAngle) ? Math.PI/_maxSpeed : (_angle > _minAngle) ?
                Math.PI/_minSpeed : Math.PI/(_minSpeed - ((_minAngle - _angle)/(_minAngle - _maxAngle))*(_minSpeed - _maxSpeed));
            
            if(2-_angle > _step ){ _mesh.rotate(Vector3.Up(), _step*_rotDir); }
            else if(_angle < 1.999){ _mesh.rotate(Vector3.Up(), (2-_angle)*_rotDir); }
            else{ return true; }
            return false;
        }
    }
    function _updateAndCheckMenuSelectMovement(_state){
        if(_state === _menu.PAGE_STATE.front_to_main || _state === _menu.PAGE_STATE.dessert_to_main){
            let _fin = (_updateAndCheckPosition(_fiftiesMenu[0], new Vector3(_menu.pos.openX, _menu.pos.visibleY, _menu.pos.staticZ), _menu.moveRules));
            return (_updateAndCheckPosition(_menuSelections[0], new Vector3(_menu.pos.openX, _menu.pos.visibleSelectY, _menu.pos.staticZ), _menu.moveRules) && _fin);
        }
        else if(_state === _menu.PAGE_STATE.main_to_dessert){
            let _fin = (_updateAndCheckPosition(_fiftiesMenu[0], new Vector3(_menu.pos.dessertX, _menu.pos.visibleY, _menu.pos.staticZ), _menu.moveRules));
            return (_updateAndCheckPosition(_menuSelections[0], new Vector3(_menu.pos.closedX-0.16, _menu.pos.visibleSelectY, _menu.pos.staticZ), _menu.moveRules) && _fin);
        }
        return(_state === _menu.PAGE_STATE.main);
    }
    function _swapPages(){
        const _bigNavButtons = 120;
        const _smallNavButtons = 100;
        const _state = _menu.getPosState();
        let _cardCanMove = true;
        if(!_swapState.menu){
            if(_state === _menu.POS_STATE.moving_in){
                _scaleAndCheckNav(_navButtons[1], _bigNavButtons);
                if(_updateAndCheckPosition(_fiftiesMenu[0], new Vector3(_menu.pos.closedX, _menu.pos.visibleY, _menu.pos.staticZ), _menu.moveRules)){
                    _menu.setPosState(_menu.POS_STATE.visible);
                    _menu.setPageState(_menu.PAGE_STATE.front_to_main);
                    _menu.rotState.newRot = true;
                    _menu.rotState.menu = false;
                    _menu.rotState.front = false;
                }
            }
            else if(_state === _menu.POS_STATE.visible){
                if(_updateAndCheckMenuSelectMovement(_menu.getPageState()) && _scaleAndCheckNav(_navButtons[1], _bigNavButtons)){
                    if(_menu.getPageState() === _menu.PAGE_STATE.main){
                        _swapState.menu = true;
                    }
                }
            }
            else if(_state === _menu.POS_STATE.moving_out){
                _scaleAndCheckNav(_navButtons[1], _smallNavButtons);
                if(_updateAndCheckPosition(_menuSelections[0], new Vector3(_menu.pos.openX, _menu.pos.hiddenSelectY, _menu.pos.staticZ), _menu.moveRules)){
                    if(_updateAndCheckPosition(_fiftiesMenu[0], new Vector3(_menu.pos.closedX, _menu.pos.hiddenY, _menu.pos.staticZ), _menu.moveRules) &&
                    _scaleAndCheckNav(_navButtons[1], _smallNavButtons)){
                        if(_menu.getPageState() === _menu.PAGE_STATE.front){
                            _menu.setPosState(_menu.POS_STATE.out_of_frame);
                            _swapState.menu = true;
                        }
                    }
                }
                else{
                    _cardCanMove = false;
                    _updateAndCheckPosition(_fiftiesMenu[0], new Vector3(_menu.pos.hiddenX, _menu.pos.visibleY, _menu.pos.staticZ), _menu.moveRules);
                }
            }
        }
        if(!_swapState.home){
            const _state = _home.getPosState();
            if(_state === _home.POS_STATE.moving_in){
                _home.movement.moveNodes();
                if(_scaleAndCheckNav(_navButtons[0], _bigNavButtons) && _home.movement.getMoveStatus()){
                    _home.setPosState(_home.POS_STATE.visible);
                    _swapState.home = true;
                }
            }
            else if(_state === _home.POS_STATE.moving_out){
                _home.movement.moveNodes();
                if(_scaleAndCheckNav(_navButtons[0], _smallNavButtons) && _home.movement.getMoveStatus()){
                    _home.setPosState(_home.POS_STATE.out_of_frame);
                    _swapState.home = true;
                }
            }
            else if(_state === _home.POS_STATE.out_of_frame){
                _swapState.home = true;
            }
        }
        if(!_swapState.contact){
            const _state = _contact.getPosState();
            if(_state === _contact.POS_STATE.moving_in){
                _scaleAndCheckNav(_navButtons[2], _bigNavButtons);

                if(_cardCanMove){
                    if(_updateAndCheckPosition(_contactCardMesh, new Vector3(_contactCardMesh.position.x, _contact.pos.visibleY, _contactCardMesh.position.z), _contact.moveRules) &&
                    _scaleAndCheckNav(_navButtons[2], _bigNavButtons)){
                        _contact.setPosState(_contact.POS_STATE.visible);
                        _swapState.contact = true;
                    }
                }
            }
            else if(_state === _contact.POS_STATE.moving_out){
                _scaleAndCheckNav(_navButtons[2], _smallNavButtons);
                if(_updateAndCheckPosition(_contactCardMesh, new Vector3(_contactCardMesh.position.x, _contact.pos.hiddenY, _contactCardMesh.position.z), _contact.moveRules) &&
                _scaleAndCheckNav(_navButtons[2], _smallNavButtons)){
                    _contact.setPosState(_contact.POS_STATE.out_of_frame);
                    _swapState.contact = true;
                }
            }
            else if(_state === _contact.POS_STATE.out_of_frame){
                _swapState.contact = true;
            }
        }
        if(_swapState.contact && _swapState.home && _swapState.menu){
            _swapState.newSwap = false;
        }
    }
    function _updateAndCheckPosition(_obj, _target, _rules){
        let _dir = _target.subtract(_obj.position);
        const _dist = _dir.length();
        const _step = (_dist > _rules.maxDist) ? _rules.maxSpeed * (engine.getDeltaTime()*0.001) : (_dist < _rules.minDist) ?
              _rules.minSpeed * (engine.getDeltaTime()*0.001) :
              (_rules.minSpeed+(((_dist - _rules.minDist)/(_rules.maxDist - _rules.minDist))*(_rules.maxSpeed - _rules.minSpeed))) * (engine.getDeltaTime()*0.001);
        _dir = _dir.normalize();

        if( _step > _dist){
            _obj.position = _target;
            return true;
        }
        else{
            _obj.position = _obj.position.add(_dir.scale(_step));
            return false;
        }
    }
    function _setPageStatesForSwapping(){
        (_navLocation !== _menu) ? _beginPageHide(_menu, true) : _beginPageShow(_menu);
        (_navLocation !== _home) ? _beginPageHide(_home) : _beginPageShow(_home);
        (_navLocation !== _contact) ? _beginPageHide(_contact) : _beginPageShow(_contact);
        _pageSwapping = true;
    }
    function _beginPageHide(_page, _pageState = false){
        const _state = _page.getPosState();
        if(_state !== _page.POS_STATE.out_of_frame && _state !== _page.POS_STATE.moving_out){
            _page.setPosState(_page.POS_STATE.moving_out);
        }
        if(_pageState){
            _menu.setPageState((_menu.getPageState() === _menu.PAGE_STATE.dessert || _menu.getPageState() === _menu.PAGE_STATE.main_to_dessert) ?
            _menu.PAGE_STATE.dessert_to_front : _menu.PAGE_STATE.main_to_front);
            _menu.rotState.newRot = true;
            _menu.rotState.menu = false;
            _menu.rotState.front = false;
        }
    }
    function _beginPageShow(_page){
        const _state = _page.getPosState();
        if(_state === _page.POS_STATE.moving_out || _state === _page.POS_STATE.out_of_frame){
            _page.setPosState(_page.POS_STATE.moving_in);
        }
    }
    const scene = _createScene();

    return { scene, engine};
};

export { bodyFactory };