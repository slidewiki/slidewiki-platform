import React from 'react';
import classNames from 'classnames';
import {FormattedMessage, defineMessages} from 'react-intl';

/**
 * Properties:
 *   required: true|false
 *   ?country:  language short code, like en_EN or de_AT
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
            german: {
                id: 'LanguageDropdown.german',
                defaultMessage: 'German'
            },
            dutch: {
                id: 'LanguageDropdown.dutch',
                defaultMessage: 'Dutch'
            },
            greek: {
                id: 'LanguageDropdown.greek',
                defaultMessage: 'Greek'
            },
            italian: {
                id: 'LanguageDropdown.italian',
                defaultMessage: 'Italian'
            },
            portuguese: {
                id: 'LanguageDropdown.portuguese',
                defaultMessage: 'Portuguese'
            },
            serbian: {
                id: 'LanguageDropdown.serbian',
                defaultMessage: 'Serbian'
            },
            spanish: {
                id: 'LanguageDropdown.spanish',
                defaultMessage: 'Spanish'
            },
            lithuanian: {
                id: 'LanguageDropdown.lithuanian',
                defaultMessage: 'Lithuanian'
            },
            french: {
                id: 'LanguageDropdown.french',
                defaultMessage: 'French'
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

        let languageOptions = <div className="menu">

            <div className="item" data-value="en_GB" >
                {this.context.intl.formatMessage(this.messages.english)}
            </div>
            <div className="item" data-value="de_DE" >
                {this.context.intl.formatMessage(this.messages.german)}
            </div>
            <div className="item" data-value="fr_FR" >
                {this.context.intl.formatMessage(this.messages.french)}
            </div>
            <div className="item" data-value="it_IT" >
                {this.context.intl.formatMessage(this.messages.italian)}
            </div>
            <div className="item" data-value="es_ES" >
                {this.context.intl.formatMessage(this.messages.spanish)}
            </div>
            <div className="item" data-value="nl_NL" >
                {this.context.intl.formatMessage(this.messages.dutch)}
            </div>
            <div className="item" data-value="el_GR" >
                {this.context.intl.formatMessage(this.messages.greek)}
            </div>
            <div className="item" data-value="pt_PT" >
                {this.context.intl.formatMessage(this.messages.portuguese)}
            </div>
            <div className="item" data-value="sr_RS" >
                {this.context.intl.formatMessage(this.messages.serbian)}
            </div>
            <div className="item" data-value="lt_LT" >
                {this.context.intl.formatMessage(this.messages.lithuanian)}
            </div>
        </div>;
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
                {this.props.type === 'spoken' ? languageOptions : languageOptionsUI}
            </div>
        );
    }
}

LanguageDropdown.contextTypes = {
    executeAction: React.PropTypes.func.isRequired,
    intl: React.PropTypes.object.isRequired
};

export default LanguageDropdown;
