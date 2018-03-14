import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {Core} from '../core/core';

const moment = require('../../../node_modules/moment/min/moment.min.js');
const dateFormat = 'DD/MM/YYYY';

function setDateRange(number, component) {
    let pickedWeekNumber = 0;
    let daysOfWeek = [];
    const daysMap = {
        1: 'Monday',
        2: 'Tuesday',
        3: 'Wednesday',
        4: 'Thursday',
        5: 'Friday',
        6: 'Saturday',
        7: 'Sunday'
    };

    if (number === 0) {
        pickedWeekNumber = moment().isoWeek();
    } else {
        pickedWeekNumber = moment().isoWeek() + (number);
    }

    let pickedWeek = moment().isoWeek(pickedWeekNumber);

    for (let i = 1; i < 8; i++) {
        let dayObject = {
            name: '',
            date: ''
        };

        dayObject.name = daysMap[i];
        dayObject.date = pickedWeek.day(i).format(dateFormat);

        daysOfWeek.push(dayObject);
    }

    if (component) {
        let newDateRange = component.state.dateRange;

        newDateRange.daysOfWeek = daysOfWeek;
        component.setState({'dateRange': newDateRange});
    }

    return daysOfWeek;
}

export const Calendar = React.createClass({
    mixins: [PureRenderMixin],
    getInitialState() {
        return {
            employees: this.props.employees,
            directionValue: 0,
            dateRange: {
                currentDate: moment().format(dateFormat),
                daysOfWeek: setDateRange(0)
            },
            currentDay: () => {
                // @TODO return moment current day
            },
            directionsHandle: (direction) => {
                // @TODO handle next/prev week loading
            }
        };
    },
    render: function() {
        const component = this;
        const dayColumnHandle = (day) => {
            // When header column is clicked expand the day

            // When shift entry is clicked open edit sidebar accordion
        };
        const isCurrentDate = (dayObject) => {

        };
        const dateChangeHandle = (number, isShiftColumn) => {
            this.setState({'directionValue': number});
            setDateRange(number, component);
        };
        let daysOfWeekColumns = (entry) => {
            let daysOfWeekArray = [];

            if (entry) {
                const shifts = entry.shifts;
                let shiftMapping = {};

                shifts.forEach((shiftObject) => {
                    shiftObject.dates.forEach((date) => {
                        shiftMapping[date] = shiftMapping[date] ? shiftMapping[date].push(shiftObject.shift) : [shiftObject.shift];
                    });
                });

                component.state.dateRange.daysOfWeek.forEach((dayObject, index) => {
                    let shiftsList = [];

                    if (shiftMapping[dayObject.date]) {
                        shiftMapping[dayObject.date].forEach((shift) => {
                            shiftsList.push(<div className="shift-entry"
                                                 key={Core.getUniqueId()}
                                                 style={{'backgroundColor': shift.color}}
                                                 onClick={() => component.props.shiftClick(shift)}>{shift.name}</div>);
                        });
                    }

                    daysOfWeekArray.push(<div
                        className={isCurrentDate(dayObject) ? 'shift-column day-column current-day' : 'day-column shift-column'}
                        onClick={() => dayColumnHandle(dayObject, true)}
                        key={Core.getUniqueId()}>
                        {shiftsList}
                    </div>);
                });
            } else {
                component.state.dateRange.daysOfWeek.forEach((dayObject, index) => {
                    daysOfWeekArray.push(<div
                        className={isCurrentDate(dayObject) ? 'day-column current-day' : 'day-column'}
                        onClick={() => dayColumnHandle(dayObject)}
                        key={Core.getUniqueId()}>
                        <div className="day-name"
                             key={Core.getUniqueId()}>{dayObject.name}</div>
                        <div className="day-date"
                             key={Core.getUniqueId()}>{dayObject.date}</div>
                    </div>);
                });
            }

            return daysOfWeekArray;
        };
        let employeesRows = () => {
            let employees = [];

            component.props.employees.forEach((entry, index) => {
                employees.push(<div className="entry-calendar-row"
                                    key={Core.getUniqueId()}>
                    <div className="entry-placeholder employee-column"
                         key={Core.getUniqueId()}>
                        <div className="avatar"
                             key={Core.getUniqueId()}>
                            <i className={'fa fa-' + entry.avatarClass}
                               key={Core.getUniqueId()}/>
                        </div>
                        <div className={"position-placeholder text-ellipsis background-" + entry.position.color}
                             style={{'backgroundColor': entry.position.color}}
                             key={Core.getUniqueId()}>{entry.position.name}</div>
                        <div className="entry-name"
                             key={Core.getUniqueId()}>{entry.name}</div>
                    </div>
                    {daysOfWeekColumns(entry)}
                </div>);
            });

            return employees;
        };

        return <div className="calendar">
            <div className="calendar-header">
                <div className="entry-placeholder directions-wrapper">
                    <i className="fa fa-chevron-left"
                       onClick={() => dateChangeHandle(component.state.directionValue - 1)}/>
                    <i className="fa fa-chevron-right"
                       onClick={() => dateChangeHandle(component.state.directionValue + 1)}/>
                </div>
                {daysOfWeekColumns()}
            </div>
            <div className="calendar-body">
                {employeesRows()}
            </div>
        </div>;
    }
});
