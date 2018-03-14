import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {Core} from '../core/core';

export const RightSidebar = React.createClass({
    mixins: [PureRenderMixin],
    render: function() {
        function makeArrayOfChildren(collection, type, parent, id) {
            let arrayOfChildren = [];

            collection.forEach((entry) => {
                switch (type) {
                    case 'employees':
                        arrayOfChildren.push(<div className={parent + "-" + type + " employee-placeholder text-ellipsis icon-" + entry.avatarClass}
                                                  key={Core.getUniqueId()}><i className={'fa fa-' + entry.avatarClass} key={Core.getUniqueId()}/>{entry.name}</div>);
                        break;
                    case 'positions':
                        arrayOfChildren.push(<div className={parent + "-" + type + " position-placeholder text-ellipsis background-" + entry.color}
                                                  style={{'backgroundColor': entry.color}}
                                                  key={Core.getUniqueId()}>{entry.name}</div>);
                        break;
                    case 'shifts':
                        arrayOfChildren.push(<div className={parent + "-" + type + " shift-placeholder text-ellipsis background-" + entry.color}
                                                  style={{'backgroundColor': entry.color}}
                                                  key={Core.getUniqueId()}>{entry.name}</div>);
                        break;
                }
            });

            return arrayOfChildren;
        }

        let component = this;

        return <div className="right-sidebar">
            <div className="sidebar-header">Apply Filters</div>
            <div className="sidebar-section employees-section">
                <div className="section-header">
                    Employees
                </div>
                <div className="section-container">
                    {makeArrayOfChildren(this.props.employees, 'employees', 'filter', 'employees')}
                </div>
            </div>
            <div className="sidebar-section shifts-section">
                <div className="section-header">
                    Shifts
                </div>
                <div className="section-container">
                    {makeArrayOfChildren(this.props.shifts, 'shifts', 'filter', 'shifts')}
                </div>
            </div>
            <div className="sidebar-section positions-section">
                <div className="section-header">
                    Positons
                </div>
                <div className="section-container">
                    {makeArrayOfChildren(this.props.positions, 'positions', 'filter', 'positions')}
                </div>
            </div>
        </div>;
    }
});
