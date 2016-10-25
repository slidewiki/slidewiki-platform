import React from 'react';
import classNames from 'classnames';

/**
 * Properties:
 *   required: true|false
 *   country:  language short code, like en_EN or de_AT
 */

class UsersInput extends React.Component {
    componentDidMount() {
        // $(this.refs.usersInput).dropdown();
        $('.ui.search')
            .search({
                apiSettings: {
                  url: 'http://localhost:4000/suggest/users/{query}',
                  onResponse: function(resp) {
                      let response = {
                          results: []
                      };
                      $.each(resp.docs, function(index, item) {
                          console.log(JSON.stringify(item));
                          response.results.push({
                              title: item.username
                          });
                      });
                      return response;
                  }
                },
                // fields: {
                //   results : 'username',
                //   title   : 'username',
                // //   url     : 'html_url'
                // },
                minCharacters : 1
            });
    }

    componentDidUpdate() {
        // $(this.refs.usersInput).dropdown();
        $('.ui.search')
            .search({
                apiSettings: {
                  url: 'http://localhost:4000/suggest/users/{query}',
                  onResponse: function(resp) {
                      let response = {
                          results: []
                      };
                      $.each(resp.docs, function(index, item) {
                          console.log(JSON.stringify(item));
                          response.results.push({
                              title: item.username
                          });
                      });
                      return response;
                  }
                },
                // fields: {
                //   results : 'username',
                //   title   : 'username',
                // //   url     : 'html_url'
                // },
                minCharacters : 1
            });
    }

    getSelected() {
        return this.refs.users.value;
    }

    render() {


        return (
            <div className="ui fluid search">
              <div className="ui icon input">
                <input className="prompt" type="text" placeholder="Search a user..."></input>
                <i className="search icon"></i>
              </div>
              <div className="results"></div>
            </div>
        );
    }
}

UsersInput.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default UsersInput;
