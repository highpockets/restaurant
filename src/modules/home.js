'use strict';
import BurgerImg from '../images/homeBurger.png';
import SaxImg from '../images/homeSax.png';
import MilkshakeImg from '../images/homeMilkshake.png';

const homeModule = (() => {

    const _imgNodes = [];
    const _imgContNodes = [];
    
    const createNodes = (_parentNode) =>{

        const _imgs = [ BurgerImg, SaxImg, MilkshakeImg ];
    
        for(let i = 0; i < _imgs.length; i++){
            _imgContNodes.push(document.createElement('div'));
            _imgNodes.push(document.createElement('img'));
            
            _imgNodes[i].src = _imgs[i];
            _imgNodes[i].className = 'home-img';
            _imgNodes[i].id = `home-img-${i}`;
            _imgContNodes[i].className = 'home-img-cont';
            _imgContNodes[i].id = `home-img-cont-${i}`;
            _imgContNodes[i].appendChild(_imgNodes[i]);
            _parentNode.appendChild(_imgContNodes[i]);
        }
    };
    const movement = (() =>{
        
        let _t = 0.0, _destT = 1.0;
        let _moveComplete = false;

        const initializeMove = () =>{

            const _width = _imgContNodes[1].clientWidth;
            let _x;

            if(_imgNodes[1].style.right === ''){
                _x = (_posState === POS_STATE.moving_in) ? _width : 0.0;
            }
            else{
                _x = _imgNodes[1].style.right.split('px').join('');
            }
            if(_posState === POS_STATE.moving_out){
                _t = _getTStartVal(0.0, (_x <= 0));
                _destT = 1.0;
            }
            else if(_posState === POS_STATE.moving_in){
                _containerVisibility('visible');
                _t = _getTStartVal(1.0, (_x >= _width));
                _destT = 0.0;
            }
            function _getTStartVal(_start, _inRange){
                return (_inRange) ? _start :
                       _x/_width;
            }
            _imgNodes[1].style.right = `${_x}px`;
        };
        const moveNodes = () => {

            if(!getMoveStatus()){

                const _dest = _imgContNodes[1].clientWidth;
                const _xPos = _dest * _t;

                for(let i = 0; i < _imgNodes.length; i++){
                    (i === 1) ? _imgNodes[i].style.right = `${_xPos}px` : _imgNodes[i].style.left = `${_xPos}px`; 
                }

                const _dist = Math.abs(_t - _destT);
                const _step = (_dist > moveRules.maxDist) ? moveRules.maxSpeed :
                            (_dist < moveRules.minDist) ? moveRules.minSpeed :
                            (_dist - moveRules.minDist) / moveRules.maxDist * (moveRules.maxSpeed - moveRules.minSpeed) + moveRules.minSpeed;
                (_destT === 0.0) ? (_t + -_step > _destT) ? _t += -_step : _t = _destT :
                                   (_t + _step < _destT) ? _t += _step : _t = _destT;
                
                if(_t === _destT){
                    setMoveStatus(true);

                    if(_posState === POS_STATE.moving_out){
                        _containerVisibility('hidden');
                    }
                }
            }
        };
        function _containerVisibility(_vis){
            for(let i = 0; i < _imgContNodes.length; i++){
                _imgContNodes[i].style.visibility = _vis;
            }
        }
        const getMoveStatus = () =>{
            return _moveComplete;
        };
        const setMoveStatus = (_status) =>{
            _moveComplete = _status;
        };

        return{ initializeMove, moveNodes, setMoveStatus, getMoveStatus };
    })();

    const moveRules = {
        maxSpeed : 0.05, minSpeed : 0.005,
        maxDist : 0.5, minDist : 0.01
    };
    Object.freeze(moveRules);

    const POS_STATE = {
        out_of_frame : 1,
        moving_in : 2,
        visible : 3,
        moving_out : 4
    };
    Object.freeze(POS_STATE);

    let _posState = POS_STATE.visible;

    const setPosState = (_newState) =>{
        _posState = _newState;

        if(_newState === POS_STATE.moving_in || _newState === POS_STATE.moving_out){
            movement.initializeMove();
            movement.setMoveStatus(false);
        }
    };
    const getPosState = () =>{
        return _posState;
    };

    return{ POS_STATE, setPosState, getPosState, createNodes, movement };
})();

export { homeModule };