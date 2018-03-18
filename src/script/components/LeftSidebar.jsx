import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {Map} from 'immutable';
import {NewEntry} from './NewEntry';
import {Core} from '../core/core';

function validateNewEntry(type, entry) {
    let message = '';

    switch (type) {
        case 'shift':
            if (!entry.name) {
                message += '`name`,';
            }
            if (!entry.color) {
                message += ' `color`,';
            }
            if (!entry.employees || !entry.employees.length) {
                message += ' `employees`,';
            }
            if (message) {
                message += ' field(s) can\'t be empty!';
            }
            break;
        case 'employee':
            if (!entry.name) {
                message += '`name`,';
            }
            if (!entry.avatarClass) {
                message += ' `avatar class`,';
            }
            if (!entry.position || !entry.position.id) {
                message += ' `position`,';
            }
            if (message) {
                message += ' field(s) can\'t be empty!';
            }
            break;
        case 'position':
            if (!entry.name) {
                message += '`name`,';
            }
            if (!entry.color) {
                message += ' `color`,';
            }
            if (message) {
                message += ' field(s) can\'t be empty!';
            }
            break;
    }

    return message;
}

export const LeftSidebar = React.createClass({
    mixins: [PureRenderMixin],
    componentWillReceiveProps(newProps) {
        if (newProps.refresh !== this.state.refresh) {
            this.setState({'entryForEditing':  {
                shift: {},
                employee: {},
                position: {}
            }});
            this.setState({'refresh': newProps.refresh});
        }
    },
    getInitialState() {
        return {
            isEditing: new Map(),
            accordionState: {
                employee: false,
                shift: false,
                position: false
            },
            creationState: {
                employee: false,
                shift: false,
                position: false
            },
            newEntry: {},
            entryForEditing: {
                shift: {},
                employee: {},
                position: {}
            },
            errorMessage: '',
            sectionAccordionHandle: (section) => {
                // Handles opening of accordion for section list
                let currentState = this.state.accordionState;

                currentState[section] = !currentState[section];

                this.setState({'accordionState': currentState});
                this.setState({'reloadRender': !this.state.reloadRender});
            },
            creationAccordionHandle: (section) => {
                // Handles opening of creation accordion for section
                let currentState = this.state.creationState;

                if (currentState) {
                    let validationMessage = validateNewEntry(section, this.state.newEntry);

                    if (currentState[section]) {
                        if (validationMessage) {
                            this.setState({'errorMessage': validationMessage});

                            return;
                        } else {
                            this.props.handlers[section](this.state.newEntry);
                        }
                    }

                    currentState[section] = !currentState[section];

                    this.setState({'errorMessage': ''});
                    this.setState({'newEntry': {}});
                    this.setState({'creationState': currentState});
                    this.setState({'reloadRender': !this.state.reloadRender});
                }
            },
            updateModel: (value, property) => {
                let currentModel = this.state.newEntry;

                currentModel[property] = value;

                this.setState({'newEntry': currentModel});
            },
            handleEdit: (entryType, isEditingFinished, entry) => {
                if (!isEditingFinished) {
                    let creationState = this.state.creationState;
                    let entryForEditing = this.state.entryForEditing;
                    let clonedEntry = Object.assign({}, entry);

                    creationState[entryType] = true;
                    entryForEditing[entryType] = clonedEntry;

                    this.setState({'newEntry': clonedEntry});
                    this.setState({'creationState': creationState});
                    this.setState({'entryForEditing': entryForEditing});
                    this.setState({'reloadRender': !this.state.reloadRender});
                }
            },
            handleDelete: (entryType, entry) => {
                if (entryType === 'position' && entry.employees && entry.employees.length) {
                    this.setState({'errorDeletingMessage': 'You can\'t delete this position, for it is assigned to employee(s).'});

                    return;
                }

                this.setState({'errorDeletingMessage': false});
                this.props.handlers[entryType](entry, true);
            }
        };
    },
    render: function() {
        function makeArrayOfChildren(collection, type, parent, id) {
            let arrayOfChildren = [];

            collection.forEach((entry) => {
                switch (type) {
                    case 'employees':
                        arrayOfChildren.push(<div
                            className={parent + "-" + type + " employee-placeholder text-ellipsis icon-" + entry.avatarClass}
                            key={Core.getUniqueId()}>{entry.name}</div>);
                        break;
                    case 'positions':
                        arrayOfChildren.push(<div
                            className={parent + "-" + type + " position-placeholder text-ellipsis background-" + entry.color}
                            style={{'backgroundColor': entry.color}}
                            key={Core.getUniqueId()}>{entry.name}</div>);
                        break;
                }
            });

            return arrayOfChildren;
        }

        function getShiftOptions() {
            let shiftOptions = [];

            shiftOptions.push(<option value="-1" key={Core.getUniqueId()}>No shift picked</option>);

            component.props.shifts.forEach(function(entry) {
                shiftOptions.push(<option value={entry.id} key={Core.getUniqueId()}>{entry.name}</option>);
            });

            return shiftOptions;
        }

        let component = this;
        let employeeList = [];
        let shiftList = [];
        let positionList = [];

        component.props.employees.forEach(function(entry, id) {
            employeeList.push(<div className={'employee-' + id + ' employee-entry sidebar-entry'}
                                   key={Core.getUniqueId()}>
                <div className="entry-row" key={Core.getUniqueId()}>
                    <div className="avatar" key={Core.getUniqueId()}>
                        <i className={'fa fa-' + entry.avatarClass} key={Core.getUniqueId()}/>
                    </div>
                    <div className="actions-info" key={Core.getUniqueId()}>
                        <div className="entry-actions" key={Core.getUniqueId()}>
                            <i className={component.state.isEditing.get('employee-' + id) ? 'fa fa-check success-status' : 'fa fa-pencil'}
                               onClick={() => component.state.handleEdit('employee', component.state.isEditing.get('employee-' + id), entry)}
                               key={Core.getUniqueId()}/>
                            <i className="fa fa-trash"
                               onClick={() => component.state.handleDelete('employee', entry)}
                               key={Core.getUniqueId()}/>
                        </div>
                        <div className="entry-info" key={Core.getUniqueId()}>
                            {makeArrayOfChildren([entry.position], 'positions', 'emplyee', id)}
                        </div>
                    </div>
                    <div className="entry-name" key={Core.getUniqueId()}>{entry.name}</div>
                </div>
            </div>);
        });
        component.props.shifts.forEach(function(entry, id) {
            shiftList.push(<div className={'shift-' + id + ' shift-entry sidebar-entry'} key={Core.getUniqueId()}>
                <div className="entry-row" key={Core.getUniqueId()}>
                    <div className="shift-color" key={Core.getUniqueId()}>
                        <div className={'picked-color background-' + entry.color}
                             style={{'backgroundColor': entry.color}}
                             key={Core.getUniqueId()}/>
                    </div>
                    <div className="entry-actions" key={Core.getUniqueId()}>
                        <i className={component.state.isEditing.get('shift-' + id) ? 'fa fa-check success-status' : 'fa fa-pencil'}
                           onClick={() => component.state.handleEdit('shift', component.state.isEditing.get('shift-' + id), entry)}
                           key={Core.getUniqueId()}/>
                        <i className="fa fa-trash"
                           onClick={() => component.state.handleDelete('shift', entry)}
                           key={Core.getUniqueId()}/>
                    </div>
                    <div className="list-references-wrapper">
                        <div className="shift-positions-wrapper" key={Core.getUniqueId()}>
                            {makeArrayOfChildren(entry.positions, 'positions', 'shift', id)}
                        </div>
                        <div className="shift-employees-wrapper" key={Core.getUniqueId()}>
                            {makeArrayOfChildren(entry.employees, 'employees', 'shift', id)}
                        </div>
                    </div>
                    <div className="entry-name shift-name" key={Core.getUniqueId()}>{entry.name}</div>
                    <div className="shift-description" key={Core.getUniqueId()}>{entry.description}</div>
                </div>
            </div>);
        });
        component.props.positions.forEach(function(entry, id) {
            positionList.push(<div className={'position-' + id + ' position-entry sidebar-entry'}
                                   key={Core.getUniqueId()}>
                <div className="entry-row" key={Core.getUniqueId()}>
                    <div className="position-color" key={Core.getUniqueId()}>
                        <div className={'picked-color background-' + entry.color}
                             style={{'backgroundColor': entry.color}}
                             key={Core.getUniqueId()}/>
                    </div>
                    <div className="actions-info" key={Core.getUniqueId()}>
                        <div className="entry-actions position-actions" key={Core.getUniqueId()}>
                            <i className={component.state.isEditing.get('position-' + id) ? 'fa fa-check success-status' : 'fa fa-pencil'}
                               onClick={() => component.state.handleEdit('position', component.state.isEditing.get('position-' + id), entry)}
                               key={Core.getUniqueId()}/>
                            <i className="fa fa-trash"
                               onClick={() => component.state.handleDelete('position', entry)}
                               key={Core.getUniqueId()}/>
                        </div>
                        <div className="entry-info position-employees" key={Core.getUniqueId()}>
                            {makeArrayOfChildren(entry.employees, 'employees', 'position', id)}
                        </div>
                    </div>
                    <div className="entry-name position-name" key={Core.getUniqueId()}>{entry.name}</div>
                </div>
            </div>);
        });

        return <div className="left-sidebar">
            <div className="sidebar-section employees-section">
                <div className="section-header" onClick={() => this.state.sectionAccordionHandle('employee')}>
                    Edit Employee Entries <i
                    className={this.state.accordionState.employee ? 'fa fa-chevron-down' : 'fa fa-chevron-right'}/>
                </div>
                <div className="section-container"
                     style={{'display': this.state.accordionState.employee ? 'block' : 'none'}}>
                    <div
                        className={(this.state.creationState.employee ? "opened-accordion " : "") + "entry-creation-wrapper employee-entry-creation"}>
                        <div className="section-header" onClick={() => this.state.creationAccordionHandle('employee')}>
                            <span>{!this.state.creationState.employee ? 'Create ' : 'Save '} Employee Entry</span>
                            <i className={this.state.creationState.employee ? 'fa fa-check success-status' : 'fa fa-plus'}/>
                        </div>
                        <div className="section-container"
                             style={{'display': this.state.creationState.employee ? 'block' : 'none'}}>
                            <NewEntry modelChange={this.state.updateModel}
                                      type="employee"
                                      refresh={this.props.refresh}
                                      existingEntry={this.state.entryForEditing.employee}
                                      shifts={component.props.shifts}
                                      positions={component.props.positions}
                                      employees={component.props.employees}
                            />
                            <div className="error-message-wrapper">{this.state.errorMessage}</div>
                        </div>
                    </div>
                    {employeeList}
                </div>
            </div>
            <div className="sidebar-section shifts-section">
                <div className="section-header" onClick={() => this.state.sectionAccordionHandle('shift')}>
                    Edit Shift Entries <i
                    className={this.state.accordionState.shift ? 'fa fa-chevron-down' : 'fa fa-chevron-right'}/>
                </div>
                <div className="section-container"
                     style={{'display': this.props.shiftPicker.display ? 'block' : 'none'}}>
                    <div className="entry-creation-wrapper shift-entry-creation shift-picker-wrapper">
                        <select
                            onChange={(e) => this.props.shiftPicker.handle(e.target.value)}>{getShiftOptions()}</select>
                        <div className="shift-picker-button" onClick={(e) => this.props.shiftPicker.handle(null, true)}>
                            Pick this shift
                        </div>
                        <input type="text" disabled
                               value={this.props.shiftPicker.date.date + ' - ' + this.props.shiftPicker.date.name}/>
                    </div>
                </div>
                <div className="section-container"
                     style={{'display': this.state.accordionState.shift ? 'block' : 'none'}}>
                    <div
                        className={(this.state.creationState.shift ? "opened-accordion " : "") + "entry-creation-wrapper shift-entry-creation"}>
                        <div className="section-header" onClick={() => this.state.creationAccordionHandle('shift')}>
                            <span>{!this.state.creationState.shift ? 'Create ' : 'Save '} Shift Entry</span>
                            <i className={this.state.creationState.shift ? 'fa fa-check success-status' : 'fa fa-plus'}/>
                        </div>
                        <div className="section-container"
                             style={{'display': this.state.creationState.shift ? 'block' : 'none'}}>
                            <NewEntry modelChange={this.state.updateModel}
                                      type="shift"
                                      refresh={this.props.refresh}
                                      existingEntry={this.state.entryForEditing.shift}
                                      shifts={component.props.shifts}
                                      positions={component.props.positions}
                                      employees={component.props.employees}/>
                            <div className="error-message-wrapper">{this.state.errorMessage}</div>
                        </div>
                    </div>
                    {shiftList}
                </div>
            </div>
            <div className="sidebar-section positions-section">
                <div className="section-header" onClick={() => this.state.sectionAccordionHandle('position')}>
                    Edit Positions Entries <i
                    className={this.state.accordionState.position ? 'fa fa-chevron-down' : 'fa fa-chevron-right'}/>
                </div>
                <div className="section-container"
                     style={{'display': this.state.accordionState.position ? 'block' : 'none'}}>
                    <div
                        className={(this.state.creationState.position ? "opened-accordion " : "") + "entry-creation-wrapper position-entry-creation"}>
                        <div className="section-header" onClick={() => this.state.creationAccordionHandle('position')}>
                            <span>{!this.state.creationState.position ? 'Create ' : 'Save '} Position Entry</span>
                            <i className={this.state.creationState.position ? 'fa fa-check success-status' : 'fa fa-plus'}/>
                        </div>
                        <div className="section-container"
                             style={{'display': this.state.creationState.position ? 'block' : 'none'}}>
                            <NewEntry modelChange={this.state.updateModel}
                                      type="position"
                                      refresh={this.props.refresh}
                                      shifts={component.props.shifts}
                                      positions={component.props.positions}
                                      employees={component.props.employees}
                                      existingEntry={this.state.entryForEditing.position}/>
                            <div className="error-message-wrapper">{this.state.errorMessage}</div>
                        </div>
                    </div>
                    <div className="error-deleting-wrapper">{this.state.errorDeletingMessage}</div>
                    {positionList}
                </div>
            </div>
        </div>;
    }
});
