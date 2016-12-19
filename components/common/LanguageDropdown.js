import React from 'react';
import classNames from 'classnames';

/**
 * Properties:
 *   required: true|false
 *   ?country:  language short code, like en_EN or de_AT
 *   type: spoken/ui defines which languages are available
 *   tooltip
 */

class LanguageDropdown extends React.Component {
    componentDidMount() {
        $(this.refs.languageDropdown).dropdown();
    }

    componentDidUpdate() {
        $(this.refs.languageDropdown).dropdown();
    }

    getSelected() {
        return this.refs.language.value;
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
                English
            </div>
            <div className="item" data-value="de_DE" >
                German
            </div>
            <div className="item" data-value="el_GR" >
                Greek
            </div>
            <div className="item" data-value="it_IT" >
                Italian
            </div>
            <div className="item" data-value="pt_PT" >
                Portugese
            </div>
            <div className="item" data-value="sr_RS" >
                Serbian
            </div>
            <div className="item" data-value="es_ES" >
                Spanish
            </div>
        </div>;
        let languageOptionsUI = <div className="menu">
            <div className="item" data-value="en_EN">English</div>
        </div>;

        let tooltip = this.props.tooltip;
        if (tooltip === undefined || tooltip === null)
            tooltip = 'There will be more in the future';

        return (
            <div className={classes} data-tooltip={tooltip} data-position="top center" data-inverted="" ref="languageDropdown">
                {this.props.required ? <input type="hidden" id="language" name="language" ref="language" defaultValue={this.props.language} required/> : <input type="hidden" name="language" id="language" ref="language" defaultValue={this.props.language}/>}
                <i className="dropdown icon"/>
                <div className="default text">Select your language</div>
                {this.props.type === 'spoken' ? languageOptions : languageOptionsUI}
            </div>
        );
    }
}

LanguageDropdown.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default LanguageDropdown;
