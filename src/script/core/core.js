import {List, Map} from 'immutable';
import {createStore} from 'redux';
import io from 'socket.io-client';
import reducer from './reducer';
import {Actions} from './action_creators';

// Merges new state into a current
function setState(newState) {
    currentState = currentState.merge(newState);

    return currentState;
}

// Updates employee entry or deletes it
// Emits event to server to mirror state update
function setEmployee(state, employee, shouldDelete) {
    let updatedEmployees = new Map();

    if (shouldDelete) {
        updatedEmployees = employeeApi.deleteEmployee(state, employee);
    } else {
        updatedEmployees = employeeApi.updateEmployee(state, employee);
    }

    currentState.set('employees', updatedEmployees);
    socket.emit(Actions.API_ACTION_KEYS.client_employee_update, updatedEmployees);

    return currentState;
}

// Updates shift entry or deletes it
// Emits event to server to mirror state update
function setShift(state, shift, shouldDelete) {
    let updatedShifts = new Map();

    if (shouldDelete) {
        updatedShifts = shiftApi.deleteShift(state, shift);
    } else {
        updatedShifts = shiftApi.updateShift(state, shift);
    }

    currentState.set('shifts', updatedShifts);
    socket.emit(Actions.API_ACTION_KEYS.client_shift_update, updatedShifts);

    return currentState;

}

// Updates position entry or deletes it
// Emits event to server to mirror state update
function setPosition(state, position, shouldDelete) {
    let updatedPositions = new Map();

    if (shouldDelete) {
        updatedPositions = positionApi.deletePosition(state, position);
    } else {
        updatedPositions = positionApi.updatePosition(state, position);
    }

    currentState.set('positions', updatedPositions);
    socket.emit(Actions.API_ACTION_KEYS.client_position_update, updatedPositions);

    return currentState;

}

function getCurrentState() {
    return currentState;
}

function getColors() {
    return [
        'brown',
        'cyan',
        'darkorange',
        'crimson',
        'darkgray',
        'dodgerblue'
    ];
}

function getEmployeeAvatarClasses() {
    return [
        'product-hunt',
        'user-md',
        'user-circle',
        'male',
        'female',
        'ban'
    ];
}

function getPositions() {
    return currentState.get('positions');
}

function getShifts() {
    return currentState.get('shifts');
}

const employeeApi = {
    updateEmployee: (state, employee) => {
        const employees = state.get('employees');

        return employees.set(employee.id, employee);
    },
    deleteEmployee: (state, employee) => {
        const employees = state.get('employees');

        return employees.delete(employee.id);
    }
};
const shiftApi = {
    updateShift: (state, shift) => {
        const shifts = state.get('shifts');

        return shifts.set(shift.id, shift);
    },
    deleteShift: (state, shift) => {
        const shifts = state.get('shifts');

        return shifts.delete(shift.id);
    }
};
const positionApi = {
    updatePosition: (state, position) => {
        const positions = state.get('positions');

        return positions.set(position.id, position);
    },
    deletePosition: (state, position) => {
        const positions = state.get('positions');

        return positions.delete(position.id);
    }
};

const mockShiftData = new Map({
    shift1: {
        id: 'shift1',
        name: 'Prva smena',
        description: 'Tralalalalalalaalalalalal',
        positions: [{
            id: 'position1',
            name: 'Pozicija Prva',
            color: 'cyan',
            employees: [{
                id: 'employee1',
                name: 'Prvi zaposleni',
                avatarClass: 'male',
                position: new Map()
            }]
        }, {
            id: 'position2',
            name: 'Pozicija Druga',
            color: 'darkgray',
            employees: [{
                id: 'employee2',
                name: 'Drugi zaposleni',
                avatarClass: 'female',
                position: {},
                shift: new Map()
            }]
        }],
        employees: [{
            id: 'employee1',
            name: 'Prvi zaposleni',
            avatarClass: 'male',
            position: {},
            shift: new Map()
        }, {
            id: 'employee2',
            name: 'Drugi zaposleni',
            avatarClass: 'female',
            position: {},
            shift: new Map()
        }],
        dates: new List(),
        color: 'crimson'
    }
});
const mockPositionData = new Map({
    position1: {
        id: 'position1',
        name: 'Pozicija Prva',
        color: 'cyan',
        employees: [{
            id: 'employee1',
            name: 'Prvi zaposleni',
            avatarClass: 'male',
            position: new Map()
        }, {
            id: 'employee2',
            name: 'Drugi zaposleni',
            avatarClass: 'female',
            position: {},
            shift: new Map()
        }]
    },
    position2: {
        id: 'position2',
        name: 'Pozicija Druga',
        color: 'dodgerblue',
        employees: [{
            id: 'employee2',
            name: 'Drugi zaposleni',
            avatarClass: 'female',
            position: {},
            shift: new Map()
        }]
    }
});
const mockEmployeeData = new Map({
    employee1: {
        id: 'employee1',
        name: 'Prvi zaposleni',
        avatarClass: 'male',
        position: mockPositionData.get('position1'),
        shift: new Map()
    },
    employee2: {
        id: 'employee2',
        name: 'Drugi zaposleni',
        avatarClass: 'female',
        position: mockPositionData.get('position2'),
        shift: new Map()
    }
});


const INITIAL_STATE = new Map({
    'employees': new Map(),
    'shifts': new Map(),
    'positions': new Map()
});
let currentState = INITIAL_STATE.set('employees', mockEmployeeData).set('shifts', mockShiftData).set('positions', mockPositionData);

const socket = io(`${location.protocol}//${location.hostname}:7171`);
const store = createStore(reducer, currentState);

export const Core = {
    setState: setState,
    setEmployee: setEmployee,
    setShift: setShift,
    setPosition: setPosition,
    getCurrentState: getCurrentState,
    getEmployeeAvatarClasses: getEmployeeAvatarClasses,
    getColors: getColors,
    socket: socket,
    store: store
};