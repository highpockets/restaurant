'use strict';

const menuModule = (() => {
    
    const POS_STATE = {
        out_of_frame : 1,
        moving_in : 2,
        visible : 3,
        moving_out : 4
    };
    Object.freeze(POS_STATE);

    const PAGE_STATE = {
        front : 1,
        main : 2,
        dessert : 3,
        front_to_main : 4,
        main_to_front : 5,
        main_to_dessert : 6,
        dessert_to_main : 7,
        dessert_to_front : 8
    };
    Object.freeze(PAGE_STATE);

    const pos = {
        closedX : -0.4, openX : 0.0, dessertX : 0.4,
        hiddenY : -2, visibleY : 0.1,
        staticZ : -13.4,
        hiddenSelectY : -1, visibleSelectY : -0.73
    };
    Object.freeze(pos);

    const moveRules = {
        maxSpeed : 3.0, minSpeed : 0.1,
        maxDist : 0.5, minDist : 0.01
    };
    Object.freeze(moveRules);

    const rotState = {
        newRot : false,
        menu : false, front : false
    }

    let _posState = POS_STATE.out_of_frame;
    let _pageState = PAGE_STATE.front;

    const setPosState = (_newState) =>{
        _posState = _newState;
    };
    const getPosState = () =>{
        return _posState;
    };
    const setPageState = (_newState) =>{
        _pageState = _newState;
    };
    const getPageState = () =>{
        return _pageState;
    };

    return{ POS_STATE, PAGE_STATE, setPosState, getPosState, setPageState, getPageState, pos, moveRules, rotState };
})();

export { menuModule };