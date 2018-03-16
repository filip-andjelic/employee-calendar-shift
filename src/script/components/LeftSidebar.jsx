import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {Map} from 'immutable';
import {NewEntry} from './NewEntry';
import {Core} from '../core/core';

function validateNewEntry(type, entry) {
    let message = '';

    switch(type) {
        case 'shift':
            if (!entry.name) {
                message += '`name`,';
            }
            if (!entry.date) {
                message += ' `date`,';
            }
            if (!entry.color) {
                message += ' `color`,';
            }
            if (!entry.employees || !entry.employees.size) {
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
    getInitialState() {
        return {
            isEditing: new Map(),
            positions: this.props.positions,
            employees: this.props.employees,
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
            errorMessage: '',
            sectionAccordionHandle: (section) => {
                let currentState = this.state.accordionState;

                currentState[section] = !currentState[section];

                this.setState({'accordionState': currentState});
                this.setState({'reloadRender': !this.state.reloadRender});
            },
            creationAccordionHandle: (section) => {
                let currentState = this.state.creationState;

                if (currentState) {
                    let validationMessage = validateNewEntry(section, this.state.newEntry);

                    if (currentState[section]) {
                        if (validationMessage) {
                            this.setState({'errorMessage': false});
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
                    let currentState = this.state.isEditing.set(entryType + '-' + entry.id, true);

                    this.setState({'isEditing': currentState});
                    this.setState({'reloadRender': !this.state.reloadRender});
                } else {
                    this.props.handlers[entryType](entry);
                }
            },
            handleDelete: (entryType, entry) => {
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
                        arrayOfChildren.push(<div className={parent + "-" + type + " employee-placeholder text-ellipsis icon-" + entry.avatarClass}
                                                  key={parent + "-" + type + id + entry.id}>{entry.name}</div>);
                        break;
                    case 'positions':
                        arrayOfChildren.push(<div className={parent + "-" + type + " position-placeholder text-ellipsis background-" + entry.color}
                                                  style={{'backgroundColor': entry.color}}
                                                  key={parent + "-" + type + id + entry.id}>{entry.name}</div>);
                        break;
                }
            });

            return arrayOfChildren;
        }
        function getShiftOptions() {
            let shiftOptions = [];

            shiftOptions.push(<option value="-1" key={Core.getUniqueId()}>Undo this action ...</option>);

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
                                   key={'employee-' + id}>
                <div className="entry-row" key={'employee-row' + id}>
                    <div className="avatar" key={'employee-avatar' + id}>
                        <i className={'fa fa-' + entry.avatarClass} key={'employee-image' + id}/>
                    </div>
                    <div className="actions-info" key={'employee-info' + id}>
                        <div className="entry-actions" key={'employee-actions' + id}>
                            <i className={component.state.isEditing.get('employee-' + id) ? 'fa fa-check success-status' : 'fa fa-pencil'}
                               onClick={() => component.state.handleEdit('employee', component.state.isEditing.get('employee-' + id), entry)}
                               key={'employee-edit' + id}/>
                            <i className="fa fa-trash"
                               onClick={() => component.state.handleDelete('employee', entry)}
                               key={'employee-delete' + id}/>
                        </div>
                        <div className="entry-info" key={'employee-position' + id}>
                            {makeArrayOfChildren([entry.position], 'positions', 'emplyee', id)}
                        </div>
                    </div>
                    <div className="entry-name" key={'employee-name' + id}>{entry.name}</div>
                </div>
            </div>);
        });
        component.props.shifts.forEach(function(entry, id) {
            shiftList.push(<div className={'shift-' + id + ' shift-entry sidebar-entry'} key={'shift-' + id}>
                <div className="entry-row" key={'shift-row' + id}>
                    <div className="shift-color" key={'shift-shift-color' + id}>
                        <div className={'picked-color background-' + entry.color}
                             style={{'backgroundColor': entry.color}}/>
                    </div>
                    <div className="entry-actions" key={'shift-actions' + id}>
                        <i className={component.state.isEditing.get('shift-' + id) ? 'fa fa-check success-status' : 'fa fa-pencil'}
                           onClick={() => component.state.handleEdit('shift', component.state.isEditing.get('shift-' + id), entry)}
                           key={'shift-edit' + id}/>
                        <i className="fa fa-trash"
                           onClick={() => component.state.handleDelete('shift', entry)}
                           key={'shift-delete' + id}/>
                    </div>
                    <div className="shift-positions-wrapper" key={'shift-positions' + id}>
                        {makeArrayOfChildren(entry.positions, 'positions', 'shift', id)}
                    </div>
                    <div className="shift-employees-wrapper" key={'shift-employees' + id}>
                        {makeArrayOfChildren(entry.employees, 'employees', 'shift', id)}
                    </div>
                    <div className="entry-name shift-name" key={'shift-name' + id}>{entry.name}</div>
                    <div className="shift-description" key={'shift-description' + id}>{entry.description}</div>
                </div>
            </div>);
        });
        component.props.positions.forEach(function(entry, id) {
            positionList.push(<div className={'position-' + id + ' position-entry sidebar-entry'}
                                   key={'position-' + id}>
                <div className="entry-row" key={'position-row' + id}>
                    <div className="position-color" key={'position-position-color' + id}>
                        <div className={'picked-color background-' + entry.color}
                             style={{'backgroundColor': entry.color}}/>
                    </div>
                    <div className="actions-info" key={'position-info' + id}>
                        <div className="entry-actions position-actions" key={'position-actions' + id}>
                            <i className={component.state.isEditing.get('position-' + id) ? 'fa fa-check success-status' : 'fa fa-pencil'}
                               onClick={() => component.state.handleEdit('position', component.state.isEditing.get('position-' + id), entry)}
                               key={'position-edit' + id}/>
                            <i className="fa fa-trash"
                               onClick={() => component.state.handleDelete('position', entry)}
                               key={'position-delete' + id}/>
                        </div>
                        <div className="entry-info position-employees" key={'position-employees' + id}>
                            {makeArrayOfChildren(entry.employees, 'employees', 'position', id)}
                        </div>
                    </div>
                    <div className="entry-name position-name" key={'position-name' + id}>{entry.name}</div>
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
                    <div className="entry-creation-wrapper employee-entry-creation">
                        <div className="section-header" onClick={() => this.state.creationAccordionHandle('employee')}>
                            <span>{!this.state.creationState.employee ? 'Create ' : 'Save '} Employee Entry</span>
                            <i className={this.state.creationState.employee ? 'fa fa-check success-status' : 'fa fa-plus'}/>
                        </div>
                        <div className="section-container"
                             style={{'display': this.state.creationState.employee ? 'block' : 'none'}}>
                            <NewEntry modelChange={this.state.updateModel} type="employee" refresh={this.props.refresh}/>
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
                        <select onChange={(e) => this.props.shiftPicker.handle(e.target.value)}>{getShiftOptions()}</select>
                        <input type="text" disabled value={this.props.shiftPicker.date.date + '/' + this.props.shiftPicker.date.name} />
                    </div>
                </div>
                <div className="section-container"
                     style={{'display': this.state.accordionState.shift ? 'block' : 'none'}}>
                    <div className="entry-creation-wrapper shift-entry-creation">
                        <div className="section-header" onClick={() => this.state.creationAccordionHandle('shift')}>
                            <span>{!this.state.creationState.shift ? 'Create ' : 'Save '} Shift Entry</span>
                            <i className={this.state.creationState.shift ? 'fa fa-check success-status' : 'fa fa-plus'}/>
                        </div>
                        <div className="section-container"
                             style={{'display': this.state.creationState.shift ? 'block' : 'none'}}>
                            <NewEntry modelChange={this.state.updateModel} type="shift" refresh={this.props.refresh}/>
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
                    <div className="entry-creation-wrapper position-entry-creation">
                        <div className="section-header" onClick={() => this.state.creationAccordionHandle('position')}>
                            <span>{!this.state.creationState.position ? 'Create ' : 'Save '} Position Entry</span>
                            <i className={this.state.creationState.position ? 'fa fa-check success-status' : 'fa fa-plus'}/>
                        </div>
                        <div className="section-container"
                             style={{'display': this.state.creationState.position ? 'block' : 'none'}}>
                            <NewEntry modelChange={this.state.updateModel} type="position" refresh={this.props.refresh}/>
                            <div className="error-message-wrapper">{this.state.errorMessage}</div>
                        </div>
                    </div>
                    {positionList}
                </div>
            </div>
        </div>;
    }
});
