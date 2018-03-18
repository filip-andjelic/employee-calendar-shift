import {Map} from 'immutable';

let mockedEmployee = {
    id: 'employee2',
    name: 'Dijana Nikcevic',
    avatarClass: 'female',
    position: {},
    shifts: []
};
let mockedEmployee2 = {
    id: 'employee1',
    name: 'Marijana Kovac',
    avatarClass: 'ban',
    position: {},
    shifts: []
};
let mockedPosition = {
    id: 'position1',
    name: 'Menadzer',
    color: 'cyan',
    employees: []
};
let mockedPosition2 = {
    id: 'position2',
    name: 'IT Konsultant',
    color: 'dodgerblue',
    employees: [mockedEmployee2]
};

mockedEmployee.position = mockedPosition;
mockedEmployee2.position = mockedPosition2;
mockedPosition.employees.push(mockedEmployee);

export let Data = {
    shifts: new Map({
        shift1: {
            id: 'shift1',
            name: 'Prva smena',
            description: 'Ova smena radi od 8h do 15h.',
            color: 'crimson',
            positions: [mockedPosition],
            employees: [mockedEmployee],
        }
    }),
    positions: new Map({
        position1: mockedPosition,
        position2: mockedPosition2
    }),
    employees: new Map({
        employee1: mockedEmployee2,
        employee2: mockedEmployee
    })
};

mockedEmployee.shifts.push({
    shift: Data.shifts.get('shift1'),
    dates: ['20/03/2018', '22/03/2018']
});