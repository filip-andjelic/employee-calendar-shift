import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {Core} from '../core/core';

export const NewEntry = React.createClass({
    mixins: [PureRenderMixin],
    getInitialState() {
        return {
            entryModel: {},
            handlePickers: (value, key) => {
                let newModel = this.state.entryModel;

                if (key === 'color' || key === 'avatarClass') {
                    newModel[key] = newModel[key] === value ? '' : value;
                } else if (key === 'employees') {
                    if (newModel[key] && newModel[key].includes(value.id)) {
                        newModel[key] = newModel[key].filter((id) => {
                            return id !== value.id
                        });
                    } else {
                        newModel[key] = newModel[key] ? newModel[key].push(value.id) : [value.id];
                    }
                } else if (key === 'position') {
                    if (newModel[key] && newModel[key].id === value.id) {
                        newModel[key] = {};
                    } else {
                        newModel[key] = value;
                    }
                }

                let propsValue = newModel[key];

                this.props.modelChange(propsValue, key);

                this.setState({'entryModel': newModel});
                this.setState({'reloadRender': !this.state.reloadRender});
            },
            modelChange: (value, name) => {
                let newModel = this.state.entryModel;

                newModel[name] = value;
                this.setState({'entryModel': newModel});
                this.setState({'reloadRender': !this.state.reloadRender});
                this.props.modelChange(value, name);
            }
        };
    },
    componentWillReceiveProps(newProps) {
        if (newProps.refresh) {
            this.setState({'entryModel': {}});
        }
    },
    render: function() {
        function getColorPicker() {
            const colors = Core.getColors();
            let colorPlaceholders = [];

            colors.forEach((color) => {
                colorPlaceholders.push(<div className="color-placeholder" key={Core.getUniqueId()}
                                            onClick={() => component.state.handlePickers(color, 'color')}>
                    <div
                        className={component.state.entryModel.color === color ? 'picked-item background-' + color : 'background-' + color}
                        style={{'backgroundColor': color}} key={Core.getUniqueId()}/>
                </div>);
            });

            return <div className="color-picker">{colorPlaceholders}</div>;
        }

        function getEmployeePicker() {
            const entries = Core.getEmployees();
            let entryPlaceholders = [];

            entries.forEach((entry) => {
                entryPlaceholders.push(<div className={component.state.entryModel.employees &&
                component.state.entryModel.employees.includes(entry.id) ? 'picked-item employee-placeholder text-ellipsis' : 'employee-placeholder text-ellipsis'}
                                            key={Core.getUniqueId()}
                                            onClick={() => component.state.handlePickers(entry, 'employees')}>
                    <i className={'fa fa-' + entry.avatarClass} key={Core.getUniqueId()}/>{entry.name}</div>);
            });

            return <div className="employee-picker">{entryPlaceholders}</div>;
        }

        function getAvatarPicker() {
            const avatars = Core.getEmployeeAvatarClasses();
            let avatarPlaceholders = [];

            avatars.forEach((avatarClass) => {
                avatarPlaceholders.push(<div className="avatar-placeholder" key={Core.getUniqueId()}
                                             onClick={() => component.state.handlePickers(avatarClass, 'avatarClass')}>
                    <div
                        className={component.state.entryModel.avatarClass === avatarClass ? 'picked-item avatar' : 'avatar'}
                        key={Core.getUniqueId()}>
                        <i className={'fa fa-' + avatarClass} key={Core.getUniqueId()}/>
                    </div>
                </div>);
            });

            return <div className="avatar-picker">{avatarPlaceholders}</div>;
        }

        function getPositionPicker() {
            const positions = Core.getPositions();
            let positionPlaceholders = [];

            positions.forEach((position) => {
                positionPlaceholders.push(<div className={component.state.entryModel.position && component.state.entryModel.position.id === position.id ?
                    'picked-item position-placeholder text-ellipsis' :
                    'position-placeholder text-ellipsis'}
                                               style={{'backgroundColor': position.color}}
                                               onClick={() => component.state.handlePickers(position, 'position')}
                                               key={Core.getUniqueId()}>{position.name}</div>);
            });

            return <div className="position-picker">{positionPlaceholders}</div>;
        }

        function getNewEntry(type) {
            if (type === 'shift') {
                return <div className="entry-row">
                    {getColorPicker()}
                    <input type="text" placeholder="Shift name" value={component.state.entryModel.name}
                           onChange={(e) => component.state.modelChange(e.target.value, 'name')}/>
                    {getEmployeePicker()}
                    <input type="textarea" placeholder="Shift description" rows="3"
                           value={component.state.entryModel.description}
                           onChange={(e) => component.state.modelChange(e.target.value, 'description')}/>
                    <input type="date" onChange={(e) => component.state.modelChange(e.target.value, 'date')}
                           value={component.state.entryModel.date}/>
                </div>;
            } else if (type === 'employee') {
                return <div className="entry-row">
                    {getAvatarPicker()}
                    {getPositionPicker()}
                    <input type="text" placeholder="Employee Full Name" value={component.state.entryModel.name}
                           onChange={(e) => component.state.modelChange(e.target.value, 'name')}/>
                </div>;
            } else if (type === 'position') {
                return <div className="entry-row">
                    {getColorPicker()}
                    <input type="text" placeholder="Shift name" value={component.state.entryModel.name}
                           onChange={(e) => component.state.modelChange(e.target.value, 'name')}/>
                    {getEmployeePicker()}
                    <input type="textarea" placeholder="Shift description" rows="3"
                           value={component.state.entryModel.description}
                           onChange={(e) => component.state.modelChange(e.target.value, 'description')}/>
                    <input type="date" onChange={(e) => component.state.modelChange(e.target.value, 'date')}
                           value={component.state.entryModel.date}/>
                </div>;
            }
        }

        const component = this;

        return <div className={this.props.type + '-entry sidebar-entry'}>
            {getNewEntry(this.props.type)}
        </div>;
    }
});
