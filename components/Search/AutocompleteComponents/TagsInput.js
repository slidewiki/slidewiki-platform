import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import suggestTags from '../../../actions/search/suggestTags';
/**
 * Properties:
 *  placeholder: placeholder text
 */

class TagsInput extends React.Component {
    initDropdown(){
        $(this.rootElement).dropdown({
            fields: {
                name: 'defaultName',
                value: 'tagName'
            },
            //minCharacters: 1,
            allowAdditions: true,
            apiSettings:{
                responseAsync: (settings, callback) => {
                    let queryString = settings.urlData.query;
                    let query = Object.assign({ q: queryString }, this.props.tagFilter);
                    context.executeAction(suggestTags, { query } ).then( (response) => {
                        callback(response);
                    });
                }
            }
        });
    }
    componentDidMount(){
        this.initDropdown();
    }
    componentDidUpdate(){
        this.initDropdown();
    }
    getSelected(){
        return this.refs.tags_input.value;
    }
    clear() {
        $('#tags_input_div').dropdown('clear');
    }
    render(){
        let classes = classNames({
            'ui': true,
            'fluid': true,
            'multiple': true,
            'search': true,
            'selection': true,
            'dropdown': true

        });
        return (
            <div aria-labelledby={this.props.ariaLabelledby} className={classes} ref={(i) => (this.rootElement = i)}>
              <input type="hidden" name="tags_input" ref='tags_input' id='tags_input'></input>
              <div className="menu" ref="dropdown_menu"></div>
              <div className="default text" id='tags_input_field'>{this.props.placeholder}</div>
          </div>
        );
    }
}

TagsInput.contextTypes = {
    executeAction: PropTypes.func.isRequired
};
export default TagsInput;
