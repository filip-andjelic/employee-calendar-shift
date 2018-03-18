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
    return new Map(currentState);
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

/***** APIs for manipulating Entries *******/

const employeeApi = {
    updateEmployee: (state, employee) => {
        let existingEmployee = state.get('employees').get(employee.id);
        const employees = state.get('employees');

        // Add ID for new Entries
        if (!employee.id) {
            employee.id = generateRandom() + '_employee_id';
        }
        // When employee's position is changed, delete employee from previous position's employee list
        if (existingEmployee && existingEmployee.position.id !== employee.position.id) {
            positionApi.updateEmployeePosition(existingEmployee, existingEmployee.position, true);
        }

        employee.shifts = employee.shifts ? employee.shifts : [];
        employee.position = positionApi.updateEmployeePosition(employee, employee.position);
        // Update employee data in shifts' employee list
        employee.shifts.forEach((object) => {
            shiftApi.updateShiftEmployee(object.shift, employee);
        });

        return employees.set(employee.id, employee);
    },
    updateEmployeeShifts: (state, shift, employee) => {
        let isShiftUpdated = false;

        // Update edited shifts' dates and info
        employee.shifts.forEach((object) => {
            if (object.shift && object.shift.id === shift.id) {
                isShiftUpdated = true;

                if (shift.date) {
                    object.dates.push(shift.date);
                }
                object.shift = shift;
            }
        });
        // When new shift is added, map it to the employee's entry
        if (!isShiftUpdated) {
            let newShiftObject = {
                shift: shift,
                dates: shift.date ? [shift.date] : []
            };

            employee.shifts.push(newShiftObject);
        }

        let employees = state.get('employees').set(employee.id, employee);

        return state.set('employees', employees);
    },
    updateEmployeePosition: (state, position, employee) => {
        let employees = state.get('employees');

        employee.position = position;
        // Update employee data in shifts' employee list
        employee.shifts.forEach((object) => {
            shiftApi.updateShiftEmployee(object.shift, employee);
        });
        employees.set(employee.id, employee);

        return state.set('employees', employees);
    },
    deleteEmployee: (state, employee) => {
        const employees = state.get('employees');

        positionApi.updateEmployeePosition(employee, employee.position, true);
        employee.shifts.forEach((object) => {
            shiftApi.updateShiftEmployee(object.shift, employee, true);
        });

        return employees.delete(employee.id);
    },
    deleteShiftEmployee: (employee, shift) => {
        let employees = currentState.get('employees');

        employee.shifts = employee.shifts.filter((object) => {
            if (object.shift && object.shift.id !== shift.id) {
                return object;
            }
        });
        employees.set(employee.id, employee);

        currentState.set('employees', employees);
    }
};
const shiftApi = {
    updateShift: (state, shift, existingEmployee) => {
        const shifts = state.get('shifts');
        let existingShift = false;
        let employees = [];
        let positions = [];

        // Add ID for new Entries
        if (!shift.id) {
            shift.id = generateRandom() + '_shift_id';
        } else {
            existingShift = shifts.get(shift.id);
        }
        // When employee day column from calendar is clicked
        if (existingEmployee) {
            let existingEmployeeId = typeof existingEmployee === 'object' ? existingEmployee.id : existingEmployee;
            let updatedEmployee = shift.employees.filter((emp) => { return emp.id === existingEmployeeId })[0];

            employees = shift.employees;
            positions = shift.positions;
            // Add employee's position if it doesn't exist in shift's position list
            if (!positions.filter((pos) => { return pos.id === updatedEmployee.position.id })[0]) {
                positions.push(updatedEmployee.position);
            }
            // Update employee's shift data list
            state = employeeApi.updateEmployeeShifts(state, shift, updatedEmployee);
        } else {
            shift.employees.forEach((entry) => {
                let employee = typeof entry === 'object' ? entry : state.get('employees').get(entry);

                // When shift's employee list is changed, compare it to previous one
                if (existingShift && existingShift.employees) {
                    existingShift.employees = existingShift.employees.filter((emp) => { return emp.id !== employee.id });
                }
                employees.push(employee);
                positions.push(employee.position);
                // Update employee's shift list data
                state = employeeApi.updateEmployeeShifts(state, shift, employee);
            });
            // When shift is deleted from employee's list
            if (existingShift && existingShift.employees) {
                existingShift.employees.forEach((emp) => {
                    employeeApi.deleteShiftEmployee(emp, existingShift);
                });
            }
        }

        shift.employees = new List(employees).toArray();
        shift.positions = new List(positions).toArray();

        return shifts.set(shift.id, shift);
    },
    updateShiftEmployee: (shift, employee, shouldDelete) => {
        shift = currentState.get('shifts').get(shift.id);
        let employees = [];
        let positions = [];

        // When employee changed, replace it's data in shift's employee list
        shift.employees.forEach((emp) => {
            if (shouldDelete && emp.id === employee.id) {
                return;
            }
            if (emp.id === employee.id) {
                employees.push(employee);
                positions.push(employee.position);
            } else {
                employees.push(emp);
                positions.push(emp.position);
            }
        });

        shift.employees = employees;
        shift.positions = positions;
    },
    deleteShift: (state, shift) => {
        const shifts = state.get('shifts');

        shift.employees.forEach((emp) => {
            employeeApi.deleteShiftEmployee(emp, shift);
        });

        return shifts.delete(shift.id);
    }
};
const positionApi = {
    updatePosition: (state, position) => {
        const positions = state.get('positions');
        let employees = [];

        // Add ID for new Entries
        if (!position.id) {
            position.id = generateRandom() + '_position_id';
        }
        if (position.employees) {
            position.employees.forEach((employee) => {
                if (typeof employee !== 'object') {
                    employee = getEmployees().get(employee);
                }
                if (typeof employee === 'object') {
                    state = employeeApi.updateEmployeePosition(state, position, employee);
                    employees.push(employee);
                }
            });
        }

        position.employees = employees;

        return positions.set(position.id, position);
    },
    updateEmployeePosition: (employee, position, shouldDelete) => {
        let updatedPosition = currentState.get('positions').get(position.id);

        if (shouldDelete && updatedPosition.employees) {
            updatedPosition.employees = updatedPosition.employees.filter((emp) => { return emp.id !== employee.id });

            return updatedPosition;
        }
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
// Set mocked data for a start. :)
let currentState = INITIAL_STATE.set('employees', Data.employees).set('shifts', Data.shifts).set('positions', Data.positions);

//const socket = io(`${location.protocol}//${location.hostname}:7171`);
const store = createStore(reducer, currentState);
const moment = require('../../../node_modules/moment/min/moment.min.js');
const dateFormat = 'DD/MM/YYYY';

export const Core = {
    setState: setState,
    setEmployee: setEmployee,
    setShift: setShift,
    setPosition: setPosition,
    getEmployeeAvatarClasses: getEmployeeAvatarClasses,
    getColors: getColors,
    getUniqueId: generateRandom,
    store: store,
    moment: moment,
    dateFormat: dateFormat
};