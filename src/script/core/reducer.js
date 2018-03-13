import {Core} from './core';
import {Actions} from './action_creators';

export default function(state, action) {
    switch (action.type) {
        case Actions.ACTION_TYPES.state:
            return Core.setState(action.state);
        case Actions.ACTION_TYPES.employee:
            return Core.setEmployee(action.state, action.employee, action.shouldDelete);
        case Actions.ACTION_TYPES.shift:
            return Core.setShift(action.state, action.shift, action.shouldDelete);
        case Actions.ACTION_TYPES.position:
            return Core.setPosition(action.state, action.position, action.shouldDelete);
        default:
            return state;
    }
}
