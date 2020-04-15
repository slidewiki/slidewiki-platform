import PropTypes from 'prop-types';
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
        $('#users_input_div').dropdown({
            fields: {
                name: 'displayName',
                value: 'userId',
            },
            minCharacters: 1,
            allowAdditions: false,
            apiSettings:{
                responseAsync: function(settings, callback) {
                    const query = settings.urlData.query;

                    context.executeAction(suggestUsers, {
                        query: encodeURIComponent(query),
                    }).then( (response) => {

                        response.results = response.results.map( (user) => {
                            return {
                                displayName: user.name,
                                userId: JSON.parse(decodeURIComponent(user.value)).userid,
                            };
                        });

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
    clear() {
        $('#users_input_div').dropdown('clear');
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
            <div aria-labelledby={this.props.ariaLabelledby} className={classes} id='users_input_div'>
              <input type="hidden" name="users_input" ref='users_input' id='users_input'></input>
              <div className="menu" ref="dropdown_menu"></div>
              <div className="default text" id='users_input_field'>{this.props.placeholder}</div>
          </div>
        );
    }
}

UsersInput.contextTypes = {
    executeAction: PropTypes.func.isRequired
};
export default UsersInput;
