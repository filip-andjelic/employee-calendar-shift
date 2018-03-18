import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import {List} from 'immutable';
import {Actions} from '../core/action_creators';
import {Core} from '../core/core';
import {LeftSidebar} from '../components/LeftSidebar';
import {RightSidebar} from '../components/RightSidebar';
import {Calendar} from '../components/Calendar';

const moment = Core.moment;
const dateFormat = Core.dateFormat;

function mapStateToProps(state) {
    return {
        shifts: state.get('shifts'),
        positions: state.get('positions'),
        employees: state.get('employees'),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        handleShift: function(entry, shouldDelete, specificEmployee) {
            entry.date = entry.date ? moment(entry.date).format(dateFormat) : '';

            return dispatch(Actions.setShift(entry, shouldDelete, specificEmployee));
        },
        handlePosition: function(entry, shouldDelete) {
            return dispatch(Actions.setPosition(entry, shouldDelete));
        },
        handleEmployee: function(entry, shouldDelete) {
            return dispatch(Actions.setEmployee(entry, shouldDelete));
        }
    };
}

export const CalendarPage = React.createClass({
    mixins: [PureRenderMixin],
    componentWillReceiveProps(newProps) {
        if (newProps.shifts) {
            this.setState({'shifts': newProps.shifts});
            this.setState({'reloadCalendar': !this.state.reloadCalendar});
        }
        if (newProps.positions) {
            this.setState({'positions': newProps.positions});
            this.setState({'reloadCalendar': !this.state.reloadCalendar});
        }
        if (newProps.employees) {
            this.setState({'employees': newProps.employees});
            this.setState({'reloadCalendar': !this.state.reloadCalendar});
        }
    },
    getInitialState() {
        return {
            shifts: this.props.shifts,
            positions: this.props.positions,
            employees: this.props.employees,
            shiftPicker: {
                display: false,
                date: '',
                handle: (shiftId, save) => {
                    let picker = this.state.shiftPicker;

                    if (save) {
                        // When save button is clicked with shift selected
                        if (picker.shiftId) {
                            let entry = this.state.shifts.get(picker.shiftId);

                            entry.date = picker.date;
                            // If shift doesn't have employee attached to it, add it to the list.
                            if (entry.employees && !entry.employees.filter((emp) => {
                                    return emp.id === picker.employee.id
                                })[0]) {
                                entry.employees.push(picker.employee);
                            }
                            // Update selected shift with new date
                            this.props.handleShift(entry, false, picker.employee.id);
                        }
                        // Reset shift picker model
                        picker.display = false;
                        picker.date = '';
                        picker.shiftId = null;
                        picker.employee = null;

                        this.setState({'shiftPicker': picker});
                        this.setState({'refreshNewEntry': !this.state.refreshNewEntry});
                        this.setState({'reloadCalendar': !this.state.reloadCalendar});

                        return;
                    }
                    // When no shift is selected
                    if (shiftId === '-1') {
                        picker.shiftId = null;
                    } else if (shiftId) {
                        picker.shiftId = shiftId;
                    }

                    this.setState({'shiftPicker': picker});
                }
            },
            handlers: {
                shift: (shift, shouldDelete) => {
                    this.props.handleShift(shift, shouldDelete);
                    this.setState({'refreshNewEntry': !this.state.refreshNewEntry});
                },
                position: (position, shouldDelete) => {
                    this.props.handlePosition(position, shouldDelete);
                    this.setState({'refreshNewEntry': !this.state.refreshNewEntry});
                },
                employee: (employee, shouldDelete) => {
                    this.props.handleEmployee(employee, shouldDelete);
                    this.setState({'refreshNewEntry': !this.state.refreshNewEntry});
                }
            },
            filterHandlers: {
                shifts: (shift) => {
                    let filter = {
                        property: 'shift',
                        id: shift.id
                    };

                    if (this.state.calendarFilter && this.state.calendarFilter.id === filter.id) {
                        this.setState({'calendarFilter': null});

                        return;
                    }

                    this.setState({'calendarFilter': filter});
                },
                positions: (position) => {
                    let filter = {
                        property: 'position',
                        id: position.id
                    };

                    if (this.state.calendarFilter && this.state.calendarFilter.id === filter.id) {
                        this.setState({'calendarFilter': null});

                        return;
                    }

                    this.setState({'calendarFilter': filter});
                },
                employees: (employee) => {
                    let filter = {
                        property: 'employee',
                        id: employee.id
                    };

                    if (this.state.calendarFilter && this.state.calendarFilter.id === filter.id) {
                        this.setState({'calendarFilter': null});

                        return;
                    }

                    this.setState({'calendarFilter': filter});
                }
            },
            calendarHandlers: {
                employee: (entry) => {
                    // @TODO handle opening of left sidebar accordion on clicked entry
                },
                shift: (entry) => {
                    // @TODO handle opening of left sidebar accordion on clicked entry
                },
                day: (day, employee) => {
                    let shiftPicker = this.state.shiftPicker;

                    shiftPicker.display = true;
                    shiftPicker.date = day;
                    shiftPicker.employee = this.state.employees.get(employee.id);

                    this.setState({'shiftPicker': shiftPicker});
                    this.setState({'refreshNewEntry': !this.state.refreshNewEntry});
                }
            }
        };
    },
    render: function() {
        return <div className="calendar-page-wrapper page-wrapper">
            <div className="page-content horizontal-separation">
                <div className="border-less page-section">
                    <LeftSidebar shifts={this.state.shifts}
                                 positions={this.state.positions}
                                 employees={this.state.employees}
                                 handlers={this.state.handlers}
                                 shiftPicker={this.state.shiftPicker}
                                 refresh={this.state.refreshNewEntry}/>
                </div>
                <div className="border-less page-section central-page-section">
                    <Calendar employeeClick={this.state.calendarHandlers.employee}
                              shiftClick={this.state.calendarHandlers.shift}
                              dayClick={this.state.calendarHandlers.day}
                              employees={this.state.employees}
                              filter={this.state.calendarFilter}
                              reload={this.state.reloadCalendar}/>
                </div>
                <div className="border-less page-section">
                    <RightSidebar shifts={this.state.shifts}
                                  positions={this.state.positions}
                                  employees={this.state.employees}
                                  handlers={this.state.filterHandlers}/>
                </div>
            </div>
        </div>;
    }
});

export const CalendarPageWrapper = connect(
    mapStateToProps,
    mapDispatchToProps
)(CalendarPage);
