import React from 'react';
import classNames from 'classnames';
import suggestUsers from '../../../actions/search/suggestUsers';
/**
 * Properties:
 *  placeholder: placeholder text
 *  returnType: username if specified else user _id
 */

class UsersInput extends React.Component {
    initDropdown(){
        let returnType = (this.props.returnType === 'username') ? 'username' : '_id';

        $('#users_input_div').dropdown({
            fields: {
                name: 'username',
                value: returnType
            },
            minCharacters: 1,
            allowAdditions: false,
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
        return this.refs.users_input.value;
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
            <div className={classes} id='users_input_div'>
              <input type="hidden" name="users_input" ref='users_input' id='users_input'></input>
              <div className="menu" ref="dropdown_menu"></div>
              <div className="default text" id='users_input_field'>{this.props.placeholder}</div>
          </div>
        );
    }
}

UsersInput.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
export default UsersInput;
