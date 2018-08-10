import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import {FormattedMessage, defineMessages} from 'react-intl';
import {translationLanguages, getLanguageNativeName} from '../../common';

/**
 * Properties:
 *   required: true|false
 *   type: spoken/ui defines which languages are available
 *   tooltip
 *   onChange: Action which should be called on the change event
 *   arialabel: aria-labelledby attribute
 *   value: selected value of the dropdown
 */

class LanguageDropdown extends React.Component {
    constructor(props){
        super(props);
        this.messages = this.getIntlMessages();
    }
    componentDidMount() {
        $(this.refs.languageDropdown).dropdown({onChange: this.onChange.bind(this)});
    }

    componentDidUpdate() {
        $(this.refs.languageDropdown).dropdown({onChange: this.onChange.bind(this)});
    }

    getSelected() {
        return this.refs.language.value;
    }

    onChange(value) {
        if (this.props.onChange) {
            this.props.onChange({target: {value: value}});
        }
    }

    getIntlMessages(){
        return defineMessages({
            english: {
                id: 'LanguageDropdown.english',
                defaultMessage: 'English'
            },
            tooltip: {
                id: 'LanguageDropdown.tooltip',
                defaultMessage: 'There will be more in the future'
            },
            placeholder: {
                id: 'LanguageDropdown.placeholder',
                defaultMessage: 'Select your language'
            }
        });
    }

    render() {
        let classes = classNames({
            'ui': true,
            'field': true,
            'search': true,
            'selection': true,
            'dropdown': true,
            'required': this.props.required
        });

        let languageOptions = translationLanguages.reduce((arr, curr) => {
            arr.push(<div className="item" data-value={curr} key={curr} >
                    {getLanguageNativeName(curr)}
                </div>);
            return arr;
        }, []);
        let languageOptionsUI = <div className="menu">
            <div className="item" data-value="en_EN">{this.context.intl.formatMessage(this.messages.english)}</div>
        </div>;

        let tooltip = this.props.tooltip;
        if (tooltip === undefined || tooltip === null)
            tooltip = this.context.intl.formatMessage(this.messages.tooltip);

        return (
            <div className={classes} aria-labelledby={this.props.arialabel} data-tooltip={tooltip} data-position="top center" data-inverted="" ref="languageDropdown">
                {this.props.required ?
                    <input type="hidden" value={this.props.value} id="language" name="language" ref="language" defaultValue={this.props.language} aria-required="true" required/>
                    :
                    <input type="hidden" value={this.props.value} name="language" id="language" ref="language" defaultValue={this.props.language}/>}
                <i className="dropdown icon"/>
                <div className="default text">{this.context.intl.formatMessage(this.messages.placeholder)}</div>
                {this.props.type === 'spoken' ? (<div className="menu">{languageOptions}</div>) : languageOptionsUI}
            </div>
        );
    }
}

LanguageDropdown.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};

export default LanguageDropdown;
