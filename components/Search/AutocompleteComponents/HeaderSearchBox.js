import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { navigateAction } from 'fluxible-router';
import suggestKeywords from '../../../actions/search/suggestKeywords';
import {FormattedMessage, defineMessages} from 'react-intl';
import { debounce } from 'lodash';

class HeaderSearchBox extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            searchString: '',
            searchHomeString: ''
        };
        this.messages = this.getIntlMessages();
        this.autoComplete = debounce(this.autoComplete, 300);
    }
    getIntlMessages(){
        return defineMessages({
            placeholder: {
                id: 'HeaderSearchBox.placeholder',
                defaultMessage: 'Search'
            }
        });
    }
    initAutoComplete(){
        let componentId = this.props.type === 'home' ? 'home_search_box_div' : 'header_search_box_div';

        $('#' + componentId).search({
            fields: {
                title: 'key'
            },
            minCharacters: 1,
            maxResults: 5,
            showNoResults: false,
            cache: false,
            onSelect: this.onSelect.bind(this),
            apiSettings:{
                responseAsync: this.autoComplete.bind(this)
            }
        });
    }
    autoComplete(settings, callback) {
        const query = settings.urlData.query;

        context.executeAction(suggestKeywords, {
            query: encodeURIComponent(query)
        }).then( (response) => {
            callback(response);
        });
    }
    componentDidMount(){
        this.initAutoComplete();
    }
    componentDidUpdate(){
        this.initAutoComplete();
    }
    handleRedirect(){
        let keywords = '';
        if (this.props.type === 'home') {
            keywords = (this.state.searchHomeString.trim() !== '')
                ? this.state.searchHomeString : '*:*';
        } else {
            // when no keywords are given, fetch all results
            keywords = (this.state.searchString.trim() !== '')
                ? this.state.searchString : '*:*';
        }

        this.context.executeAction(navigateAction, {
            url: '/search/keywords=' + encodeURIComponent(keywords)
        });

        // unfocus input element
        if (this.props.type === 'home') {
            this.refs.searchHomeString.blur();
        } else {
            this.refs.searchstring.blur();
        }


        this.setState({
            searchString: '',
            searchHomeString: ''
        });

        return false;
    }
    handleKeyPress(event){
        if(event.key === 'Enter'){
            this.handleRedirect();
        }
    }
    onChangeHome(){
        this.setState({searchHomeString: this.refs.searchHomeString.value});
    }
    onChange(){
        this.setState({searchString: this.refs.searchString.value});
    }
    onSelect(result, response){
        if( this.props.type === 'home') {
            this.setState({
                searchHomeString: result.key
            });
        } else {
            this.setState({
                searchString: result.key
            });
        }


        this.handleRedirect();
    }
    render() {

        if (this.props.type === 'home') {
            return (
                <div className='ui fluid category search'>
                    <div id='home_search_box_div' className='ui fluid icon input'>
                        <label htmlFor="searchHomeString" hidden/>
                        <input className='prompt' placeholder='Search for decks or people' ref='searchHomeString' type='text' value={this.state.searchHomeString} onChange={this.onChangeHome.bind(this)} onKeyPress={this.handleKeyPress.bind(this)}/>
                        <i className='search link icon' onClick={this.handleRedirect.bind(this)}/>
                    </div>
                    <div className='results'/>
                </div>
            );
        } else {
            let classes = classNames({
                'ui': true,
                'small': true,
                'icon': true,
                'input': true,
                'search': true
            });
            // "ui small icon input
            return (
                <div className={classes} ref="headerSearchBox" role="search" id="header_search_box_div" style={{borderRadius: '0.286rem'}} aria-label={this.context.intl.formatMessage(this.messages.placeholder)} >
                    <label htmlFor="searchString" hidden><FormattedMessage {...this.messages.placeholder} /></label>
                    <input type="text" placeholder="Search..." ref="searchString" id="searchString" value={this.state.searchString} onChange={this.onChange.bind(this)} onKeyPress={this.handleKeyPress.bind(this)} className="prompt" />
                    <i className="search link icon" onClick={this.handleRedirect.bind(this)}/>
                    <div className="results"/>
                </div>
            );
        }
    }
}
HeaderSearchBox.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};

export default HeaderSearchBox;
