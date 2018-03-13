import React from 'react';

export default React.createClass({
    render: function() {
        return <div id="arch-layout-grid" className="arch-container">
            <div id="application-page-content" className="application-view-wrapper">
                {this.props.children}
            </div>
        </div>;
    }
});
