import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {WordsList} from '../components/WordsList';

export const DigitsInput = React.createClass({
    mixins: [PureRenderMixin],
    getInitialState() {
        return {
            value: this.props.value,
            realWords: this.props.realWords,
            showLabel: false,
            toggleRealWords: () => {
                this.setState({'realWords': !this.state.realWords});
                this.props.toggleRealWords();
            }
        };
    },
    render: function() {
        let changeHandle = (value) => {
            this.props.inputChange(value);
        };

        return <div className="digits-input user-input-element">
            <div className="history-button user-input-button" onClick={this.props.toggleHistoryList}>
                <i className="fa fa-angle-double-up placeholder"/>
                <span className="button-text"> Toggle Input History </span>
            </div>
            <div className="input-wrapper">
                <div className="words-button border-less user-input-button"
                     onClick={this.state.toggleRealWords}
                     onMouseOver={() => this.setState({'showLabel': true})}
                     onMouseLeave={() => this.setState({'showLabel': false})}>
                    <i className="fa fa-comment"/>
                </div>
                <input type="number"
                       min="0"
                       max="9"
                       placeholder="Only digits allowed ..."
                       onChange={(e) => changeHandle(e.target.value)}
                       value={this.props.value}/>
            </div>
            <div className={this.state.showLabel ? 'words-label show-label' : 'words-label'}>
                {this.state.realWords ? 'Only existing words' : 'Show all results'}
            </div>
            <WordsList wordsList={this.props.wordsList}
                       historyList={this.props.historyList}
                       clickHandle={this.props.inputChange}/>
        </div>;
    }
});
