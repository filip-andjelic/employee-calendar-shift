import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import {List} from 'immutable';
import {Actions}  from '../core/action_creators';
import {Core} from '../core/core';
import {LeftSidebar} from '../components/LeftSidebar';
import {RightSidebar} from '../components/RightSidebar';
import {Calendar} from '../components/Calendar';

const moment = Core.moment;
const dateFormat = Core.dateFormat;

function handleUpdate() {

}
function bindListerToLocalState(component) {
    isListenerAttached = true;

    Core.store.subscribe(() => {
        let newState = Core.getCurrentState();

        component.setState({'shifts': newState.get('shifts')});
        component.setState({'positions': newState.get('positions')});
        component.setState({'employees': newState.get('employees')});
        component.setState({'reloadRender': !component.state.reloadRender});
        component.setState({'refreshNewEntry': false});
    });
}

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
            entry.date = moment(entry.date).format(dateFormat);

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

let isListenerAttached = false;

export const CalendarPage = React.createClass({
    mixins: [PureRenderMixin],
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
                        if (picker.shiftId) {
                            let entry = this.state.shifts.get(picker.shiftId);

                            entry.date = picker.date;
                            if (entry.employees && !entry.employees.filter((emp) => {return emp.id === picker.employee.id})[0]) {
                                entry.employees.push(picker.employee);
                            }

                            this.props.handleShift(entry, false, picker.employee.id);
                        }

                        picker.display = false;
                        picker.date = '';
                        picker.shiftId = null;
                        picker.employee = null;

                        this.setState({'shiftPicker': picker});

                        return;
                    }

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
                    this.setState({'refreshNewEntry': true});
                    this.setState({'refreshNewEntry': false});
                },
                position: (position, shouldDelete) => {
                    this.props.handlePosition(position, shouldDelete);
                    this.setState({'refreshNewEntry': true});
                    this.setState({'refreshNewEntry': false});
                },
                employee: (employee, shouldDelete) => {
                    this.props.handleEmployee(employee, shouldDelete);
                    this.setState({'refreshNewEntry': true});
                    this.setState({'refreshNewEntry': false});
                }
            },
            filterHandlers: {
                shift: (shift) => {
                    // @TODO handle filtering of left sidebar accordion on clicked entry
                },
                position: (position) => {
                    // @TODO handle opening of left sidebar accordion on clicked entry;
                },
                employee: (employee) => {
                    // @TODO handle opening of left sidebar accordion on clicked entry
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
                    shiftPicker.employee = Core.getEmployees().get(employee.id);

                    this.setState({'shiftPicker': shiftPicker});
                    this.setState({'refreshNewEntry': true});
                }
            }
        };
    },
    render: function() {
        if (!isListenerAttached) {
            bindListerToLocalState(this);
        }

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
                              reload={this.state.reloadRender}/>
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
