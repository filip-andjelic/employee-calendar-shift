const ACTION_TYPES = {
    state: 'SET_STATE',
    employee: 'SET_EMPLOYEE',
    shift: 'SET_SHIFT',
    position: 'SET_POSITION'
};

const API_ACTION_KEYS = {
    server_state_update: 'SERVER.STATE_UPDATE',
    client_employee_update: 'CLIENT.EMPLOYEE_UPDATE',
    client_shift_update: 'CLIENT.SHIFT_UPDATE',
    client_position_update: 'CLIENT.POSITION_UPDATE'
};

// Complete state update
function setState(state) {
    return {
        type: ACTION_TYPES.state,
        state
    };
}
// Employee data update
function setEmployee(state, employee, shouldDelete) {
    return {
        type: ACTION_TYPES.employee,
        employee,
        shouldDelete,
        state
    };
}
// Shift data update
function setShift(state, shift, shouldDelete) {
    return {
        type: ACTION_TYPES.shift,
        shift,
        shouldDelete,
        state
    };
}
// Position data update
function setPosition(state, position, shouldDelete) {
    return {
        type: ACTION_TYPES.position,
        position,
        shouldDelete,
        state
    };
}

export const Actions = {
    ACTION_TYPES: ACTION_TYPES,
    API_ACTION_KEYS: API_ACTION_KEYS,
    setState: setState,
    setEmployee: setEmployee,
    setShift: setShift,
    setPosition: setPosition
};