import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import Actions from '../core/action_creators';
import {Core} from '../core/core';
import {LeftSidebar} from '../components/LeftSidebar';

//import {DigitsInput} from '../components/DigitsInput';

function bindListerToLocalState(component) {
    isListenerAttached = true;

    Core.store.subscribe(() => {
        let newState = Core.getCurrentState();
        console.log(Core.store.getState());
        console.log(Core.getCurrentState());

        component.state.shifts = newState.get('shifts');
        component.state.positions = newState.get('positions');
        component.state.employees = newState.get('employees');
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
        handleShift: function(entry, shouldDelete) {
            return dispatch(Actions.setShift(entry, shouldDelete));
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
            handlers: {
                shift: (shift, shouldDelete) => {
                    this.props.handleShift(shift, shouldDelete);
                },
                position: (position, shouldDelete) => {
                    this.props.handlePosition(position, shouldDelete);
                },
                employee: (employee, shouldDelete) => {
                    this.props.handleEmployee(employee, shouldDelete);
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
                                 handlers={this.state.handlers}/>
                </div>
                <div className="page-section central-page-section">
                </div>
                <div className="border-less page-section">
                </div>
            </div>
        </div>;
    }
});

export const CalendarPageWrapper = connect(
    mapStateToProps,
    mapDispatchToProps
)(CalendarPage);
