import React from 'react';
import classNames from 'classnames';
import {NavLink, navigateAction} from 'fluxible-router';
import suggestKeywords from '../../../actions/search/suggestKeywords';

class HeaderSearchBox extends React.Component {
    initAutocomplete(){
        $('#header_search_box_div').search({
            fields: {
                title: 'key'
            },
            minCharacters: 1,
            maxResults: 5,
            showNoResults: false,
            cache: false,
            apiSettings:{
                responseAsync: function(settings, callback) {
                    const query = settings.urlData.query;

                    context.executeAction(suggestKeywords, {
                        query: encodeURIComponent(query)
                    }).then( (response) => {
                        callback(response);
                    });
                }
            }
        });
    }
    componentDidMount(){
        this.initAutocomplete();
    }
    componentDidUpdate(){
        this.initAutocomplete();
    }
    handleRedirect(searchstring){

        let searchstr = 'q=';
        if(this.refs.searchstring.value.trim() === ''){
            // searchstr += encodeURIComponent('*:*');
            return;
        }
        else{
            searchstr += encodeURIComponent(this.refs.searchstring.value);
        }
        searchstr += '&revisions=false';

        this.context.executeAction(navigateAction, {
            url: '/search/' + searchstr
        });

        this.refs.searchstring.value = '';
        return false;
    }
    handleKeyPress(event){
        if(event.key === 'Enter'){
            this.handleRedirect();
        }
    }
    render() {
        let classes = classNames({
            'ui': true,
            'small': true,
            'icon': true,
            'input': true,
            'search': true
        });
        // "ui small icon input
        return (
            <div className={classes} ref="headerSearchBox" id="header_search_box_div">
                <input type="text" placeholder="Search..." ref="searchstring" onKeyPress={this.handleKeyPress.bind(this)} className="prompt"/>
                <i className="search link icon" onClick={this.handleRedirect.bind(this)} onChange={this.handleRedirect.bind(this)}></i>
                <div className="results"></div>
            </div>
        );
    }
}
HeaderSearchBox.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default HeaderSearchBox;
