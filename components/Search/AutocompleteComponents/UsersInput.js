import React from 'react';
import classNames from 'classnames';
import {connectToStores} from 'fluxible-addons-react';
import SuggestionsStore from '../../../stores/SuggestionsStore';
import suggestUsers from '../../../actions/search/suggestUsers';
/**
 * Properties:
 *   required: true|false
 *   country:  language short code, like en_EN or de_AT
 */

class UsersInput extends React.Component {

    componentDidMount() {
        console.log('edw1 ');
        // $(this.refs.usersInput).dropdown();
        $('#users_input').dropdown({
            fields: {
                name: 'username',
                value: 'username'
            },
            minCharacters: 1,
            allowAdditions: false,
            apiSettings:{
                responseAsync: function(settings, callback) {
                    const query = settings.urlData.query;

                    context.executeAction(suggestUsers, {
                        query: query,
                    }).then( (response) => {
                        callback(response);
                    });
                }
            }
        });

        // $('#users_input').bind('keypress', function(event) {
        //     console.log($('#users_input').getValue());
        //  });
    }

    componentDidUpdate() {
        console.log('edw');
        // $(this.refs.usersInput).dropdown();
        $('#users_input').dropdown({
            fields: {
                name: 'username',
                value: 'username'
            },
            minCharacters: 1,
            allowAdditions: false,
            apiSettings:{
                responseAsync: function(settings, callback) {
                    const query = settings.urlData.query;

                    context.executeAction(suggestUsers, {
                        query: query,
                    }).then( (response) => {
                        callback(response);
                    });
                }
            }
        });

        // $('#users_input').bind('keypress', function(event) {
        //     console.log($('#users_input').getValue());
        //  });
    }
    getSelected() {
        return this.refs.users_input.value;
    }

    render() {
        // console.log('edw w' + JSON.stringify(this.props.SuggestionsStore.userSuggestions));
        // let menuItems = '';
        // let userSuggestions = this.props.SuggestionsStore.userSuggestions;
        // for(let i in userSuggestions){
        //     menuItems += '<div className="item" data-value="' + userSuggestions[i].username + '">' + userSuggestions[i].username + '</div>';
        // }
        // console.log('items: ' + menuItems);
        return (
            <div className="ui fluid multiple search selection dropdown" id='users_input' tabIndex="1">
              <input type="hidden" name="users_input" ref='users_input'></input>

              <div className="menu"></div>
              <div className="default text">Search Users</div>
          </div>
        );
    }
}

UsersInput.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
// UsersInput = connectToStores(UsersInput, [SuggestionsStore], (context, props) => {
//     return {
//         SuggestionsStore: context.getStore(SuggestionsStore).getState(),
//     };
// });
export default UsersInput;
