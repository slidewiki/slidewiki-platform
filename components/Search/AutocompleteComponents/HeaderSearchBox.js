import React from 'react';
import classNames from 'classnames';
import {NavLink, navigateAction} from 'fluxible-router';
import suggestKeywords from '../../../actions/search/suggestKeywords';

class HeaderSearchBox extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            searchstring: ''
        };
    }
    initAutocomplete(){
        $('#header_search_box_div').search({
            fields: {
                title: 'key'
            },
            minCharacters: 1,
            maxResults: 5,
            showNoResults: false,
            cache: false,
            onSelect: this.onSelect.bind(this),
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
        let querystring = (searchstring) ? searchstring : this.refs.searchstring.value;

        let searchstr = 'keywords=';
        if(querystring.trim() === ''){
            return;
        }
        else{
            searchstr += encodeURIComponent(querystring);
        }
        // searchstr += '&revisions=false';

        this.context.executeAction(navigateAction, {
            url: '/search/' + searchstr
        });

        // this.refs.searchstring.value = '';

        // unfocus input element
        this.refs.searchstring.blur();

        this.setState({searchstring: ''});

        return false;
    }
    handleKeyPress(event){
        if(event.key === 'Enter'){
            this.handleRedirect();
        }
    }
    onChange(){
        this.setState({searchstring: this.refs.searchstring.value});
    }
    onSelect(result, response){
        this.handleRedirect(result.key);
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
                <label htmlFor="searchString" hidden>Search</label>
                <input type="text" placeholder="Search..." ref="searchstring" id="searchString" value={this.state.searchstring} onChange={this.onChange.bind(this)} onKeyPress={this.handleKeyPress.bind(this)} className="prompt" />
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
