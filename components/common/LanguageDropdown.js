import React from 'react';
import classNames from 'classnames';

/**
 * Properties:
 *   required: true|false
 *   country:  language short code, like en_EN or de_AT
 */

class LanguageDropdown extends React.Component {
    componentDidMount() {}

    componentDidUpdate() {}

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
            'required': this.props.required,
        });
        return (
            <div className={classes} data-tooltip="There will be more in the future" data-position="top center" data-inverted="">
                {this.props.required ? <input type="hidden" name="language" ref="language" defaultValue={this.props.language} required/> : <input type="hidden" name="language" ref="language" defaultValue={this.props.language}/>}
                <i className="dropdown icon"/>
                <div className="default text">Select your language</div>
                <div className="menu">
                    <div className="item" data-value="en_EN">English</div>
                </div>
            </div>
        );
    }
}

LanguageDropdown.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default LanguageDropdown;
