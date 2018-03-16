import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {Core} from '../core/core';

const moment = Core.moment;
const dateFormat = Core.dateFormat;

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
        const dayColumnHandle = (day, employeeRow) => {
            if (employeeRow) {
                // When body day column is clicked, guide to left sidebar.
                this.props.dayClick(day, employeeRow);
            } else {
                // When header day column is clicked, expand day data.
            }
        };
        const isCurrentDate = (dayObject) => {
            if (!dayObject || dayObject.date !== moment().format(dateFormat)) {
                return false;
            }

            return true;
        };
        const dateChangeHandle = (number, isShiftColumn) => {
            this.setState({'directionValue': number});
            setDateRange(number, component);
        };
        /*
         *  Takes employee object, builds shift objects based on its' dates.
         *  Attached shift objects to corresponding days in week, if any.
         *  Returns array of React Component Symbols.
         *
         *  Used to build Calendar header columns, when no employee objects is passed.
         *
         *  @param optional / entry {Employee Object}
         *
         *  @return daysOfWeekArray {Array}
         */
        let daysOfWeekColumns = (entry) => {
            let daysOfWeekArray = [];

            // If employee object is passed, build Calendar body row.
            if (entry) {
                const shifts = entry.shifts;
                let shiftMapping = {};

                // Map shifts by its' dates.
                if (shifts) {
                    shifts.forEach((shiftObject) => {
                        shiftObject.dates.forEach((date) => {
                            shiftMapping[date] = shiftMapping[date] ? shiftMapping[date].push(shiftObject.shift) : [shiftObject.shift];
                        });
                    });
                }
                // If shift dates correspond to any day, create shift placeholder.
                component.state.dateRange.daysOfWeek.forEach((dayObject) => {
                    let shiftsList = [];

                    if (shiftMapping[dayObject.date]) {
                        shiftMapping[dayObject.date].forEach((shift) => {
                            shiftsList.push(<div className="shift-entry"
                                                 key={Core.getUniqueId()}
                                                 style={{'backgroundColor': shift.color}}
                                                 onClick={(e) => {
                                                     e.preventDefault();
                                                     e.stopPropagation();
                                                     component.props.shiftClick(shift)
                                                 }
                                                 }>{shift.name}</div>);
                        });
                    }
                    // If shift doesn't exist for this day, put day placeholder with empty shifts' array.
                    daysOfWeekArray.push(<div
                        className={isCurrentDate(dayObject) ? 'shift-column day-column current-day' : 'day-column shift-column'}
                        onClick={() => dayColumnHandle(dayObject, entry)}
                        key={Core.getUniqueId()}>
                        {shiftsList}
                    </div>);
                });
            } else {
                // If employee object doesn't exist build Calendar header row.
                component.state.dateRange.daysOfWeek.forEach((dayObject) => {
                    daysOfWeekArray.push(<div
                        className={isCurrentDate(dayObject) ? 'day-column current-day' : 'day-column'}
                        onClick={() => dayColumnHandle(dayObject, false)}
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
