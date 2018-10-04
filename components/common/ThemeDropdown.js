import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import {FormattedMessage, defineMessages} from 'react-intl';

/**
 * Properties:
 *   value: selected theme name
 *   onChange: Action which should be called on the change event
 */

class ThemeDropdown extends React.Component {
    constructor(props){
        super(props);
    }
    
    componentDidMount() {
        this.handleDropdown();
        $(this.refs.ThemeDropdown).dropdown('set value', 'default');
    }

    componentDidUpdate() {
        this.handleDropdown();
    }

    handleDropdown() {
        $(this.refs.ThemeDropdown)
            .dropdown({
                preserveHTML: false,
                onChange: this.onChange.bind(this)
            });
    }
    
    onChange(value) {
        if (this.props.onChange) {
            this.props.onChange({target: {value: value}});
        }
    }
    
    getSelected() {
        return $(this.refs.ThemeDropdown).dropdown('get value');
    }
    
    render() {
        const availableThemes = {
            'default':  'White - Default',
            'beige': 'Cream',
            'black': 'Black',
            'league': 'Dark Grey',
            'sky': 'Pale Blue',
            'solarized': 'Beige',
            'moon': 'Dark Slate Blue',
            'night': 'High Contrast 1',
            'blood': 'High Contrast 2',
            'simple': 'Simple',
            'openuniversity': 'Open University',
            'odimadrid': 'ODI Madrid',
            'oeg': 'OEG'
        };

        return (<div className="ui selection dropdown" aria-labelledby="themes" id="theme" ref="ThemeDropdown">
                <input type="hidden" name="theme" value={this.props.value} ref="selectedTheme" />
                <i className="dropdown icon"></i>
                <div className="default text">Select theme</div>
                <div className="menu">
                    <div className="ui two column grid padded">
                        {Object.keys(availableThemes).map(theme => 
                            <div className="column" key={theme}>
                                <div className="ui segment item" data-value={theme} style={{cursor: 'pointer'}}>
                                    <div className="ui bottom attached label">{availableThemes[theme]}</div>
                                    <img className="ui wireframe image" src={'/assets/images/themes/' + theme + '.jpeg'} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>);
    }
}

ThemeDropdown.contextTypes = {
    executeAction: PropTypes.func.isRequired, 
    intl: PropTypes.object.isRequired
};

export default ThemeDropdown;
