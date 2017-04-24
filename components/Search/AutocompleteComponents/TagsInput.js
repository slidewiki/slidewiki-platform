import React from 'react';
import classNames from 'classnames';
import suggestUsers from '../../../actions/search/suggestTags';
/**
 * Properties:
 *  placeholder: placeholder text
 */

class TagsInput extends React.Component {
    initDropdown(){
        $('#tags_input_div').dropdown({
            fields: {
                name: 'tagName',
                value: 'tagName'
            },
            minCharacters: 1,
            allowAdditions: true,
            apiSettings:{
                responseAsync: function(settings, callback) {
                    const query = settings.urlData.query;

                    context.executeAction(suggestUsers, {
                        query: encodeURIComponent(query),
                    }).then( (response) => {
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
            <div className={classes} id='tags_input_div'>
              <input type="hidden" name="tags_input" ref='tags_input' id='tags_input'></input>
              <div className="menu" ref="dropdown_menu"></div>
              <div className="default text" id='tags_input_field'>{this.props.placeholder}</div>
          </div>
        );
    }
}

TagsInput.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
export default TagsInput;
