import {List, Map} from 'immutable';
import {createStore} from 'redux';
import io from 'socket.io-client';
import reducer from './reducer';
import {Actions} from './action_creators';
import {Data} from './mockData';

/***** SETTER FUNCTIONS *******/

// Merges new state into a current
function setState(newState) {
    currentState = currentState.merge(newState);

    return currentState;
}

// Updates employee entry or deletes it
// Emits event to server to mirror state update
function setEmployee(employee, shouldDelete) {
    let updatedEmployees = new Map();

    if (shouldDelete) {
        updatedEmployees = employeeApi.deleteEmployee(currentState, employee);
    } else {
        updatedEmployees = employeeApi.updateEmployee(currentState, employee);
    }

    currentState = currentState.set('employees', updatedEmployees);
    //socket.emit(Actions.API_ACTION_KEYS.client_employee_update, updatedEmployees);

    return currentState;
}

// Updates shift entry or deletes it
// Emits event to server to mirror state update
function setShift(shift, shouldDelete, specificEmployee) {
    let updatedShifts = new Map();

    if (shouldDelete) {
        updatedShifts = shiftApi.deleteShift(currentState, shift);
    } else {
        updatedShifts = shiftApi.updateShift(currentState, shift, specificEmployee);
    }

    currentState = currentState.set('shifts', updatedShifts);
    //socket.emit(Actions.API_ACTION_KEYS.client_shift_update, updatedShifts);

    return currentState;
}

// Updates position entry or deletes it
// Emits event to server to mirror state update
function setPosition(position, shouldDelete) {
    let updatedPositions = new Map();

    if (shouldDelete) {
        updatedPositions = positionApi.deletePosition(currentState, position);
    } else {
        updatedPositions = positionApi.updatePosition(currentState, position);
    }

    currentState = currentState.set('positions', updatedPositions);
    //socket.emit(Actions.API_ACTION_KEYS.client_position_update, updatedPositions);

    return currentState;

}

/***** GETTER FUNCTIONS *******/

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

function getEmployees() {
    return currentState.get('employees');
}

function getPositions() {
    return currentState.get('positions');
}

function getShifts() {
    return currentState.get('shifts');
}

function generateRandom() {
    return new Date().valueOf() * Math.random();
}

const employeeApi = {
    updateEmployee: (state, employee) => {
        const employees = state.get('employees');

        if (!employee.id) {
            employee.id = generateRandom() + '_employee_id';
        }

        employee.shifts = employee.shifts ? employee.shifts : [];
        employee.position = positionApi.updateEmployeePosition(employee, employee.position);

        currentState = setPosition(employee.position);

        return employees.set(employee.id, employee);
    },
    updateEmployeeShifts: (state, shift, employee) => {
        let isShiftUpdated = false;

        employee.shifts.forEach((object) => {
            if (object.shift && object.shift.id === shift.id) {
                isShiftUpdated = true;

                object.dates.push(shift.date);
            }
        });

        if (!isShiftUpdated) {
            let newShiftObject = {
                shift: shift,
                dates: [shift.date]
            };

            employee.shifts.push(newShiftObject);
        }

        let employees = state.get('employees').set(employee.id, employee);

        return state.set('employees', employees);
    },
    deleteEmployee: (state, employee) => {
        const employees = state.get('employees');

        return employees.delete(employee.id);
    }
};
const shiftApi = {
    updateShift: (state, shift, existingEmployee) => {
        const shifts = state.get('shifts');
        let employees = [];
        let positions = [];

        if (!shift.id) {
            shift.id = generateRandom() + '_shift_id';
        } else {
            shift = shifts.get(shift.id);
        }

        if (existingEmployee) {
            let existingEmployeeId = typeof existingEmployee === 'object' ? existingEmployee.id : existingEmployee;
            let updatedEmployee = shift.employees.filter((emp) => {return emp.id === existingEmployeeId})[0];

            employees = shift.employees;
            positions = shift.positions;

            if (!positions.filter((pos) => {return pos.id === updatedEmployee.position.id})[0]) {
                positions.push(updatedEmployee.position);
            }

            state = employeeApi.updateEmployeeShifts(state, shift, updatedEmployee);
        } else {
            shift.employees.forEach((entry) => {
                let employee = typeof entry === 'object' ? entry : state.get('employees').get(entry);
                employees.push(employee);
                positions.push(employee.position);

                state = employeeApi.updateEmployeeShifts(state, shift, employee);
            });
        }

        shift.employees = new List(employees).toArray();
        shift.positions = new List(positions).toArray();

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

        if (!position.id) {
            position.id = generateRandom() + '_position_id';
        }

        position.employees = position.employees ? position.employees : [];

        return positions.set(position.id, position);
    },
    updateEmployeePosition: (employee, position) => {
        let updatedPosition = currentState.get('positions').get(position.id);

        if (updatedPosition.employees) {
            updatedPosition.employees.push(employee);
        } else {
            updatedPosition.employees = [employee];
        }

        return updatedPosition;
    },
    deletePosition: (state, position) => {
        const positions = state.get('positions');

        return positions.delete(position.id);
    }
};

const INITIAL_STATE = new Map({
    'employees': new Map(),
    'shifts': new Map(),
    'positions': new Map()
});
let currentState = INITIAL_STATE.set('employees', Data.employees).set('shifts', Data.shifts).set('positions', Data.positions);

const socket = io(`${location.protocol}//${location.hostname}:7171`);
const store = createStore(reducer, currentState);
const moment = require('../../../node_modules/moment/min/moment.min.js');
const dateFormat = 'DD/MM/YYYY';

export const Core = {
    setState: setState,
    setEmployee: setEmployee,
    setShift: setShift,
    setPosition: setPosition,
    getCurrentState: getCurrentState,
    getEmployeeAvatarClasses: getEmployeeAvatarClasses,
    getPositions: getPositions,
    getShifts: getShifts,
    getColors: getColors,
    getEmployees: getEmployees,
    getUniqueId: generateRandom,
    socket: socket,
    store: store,
    moment: moment,
    dateFormat: dateFormat
};