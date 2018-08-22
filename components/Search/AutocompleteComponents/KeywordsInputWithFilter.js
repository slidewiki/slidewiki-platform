import PropTypes from 'prop-types';
import React from 'react';
import suggestKeywords from '../../../actions/search/suggestKeywords';
import { debounce } from 'lodash';
import { Button, Select, Input, Search } from 'semantic-ui-react';
import { defineMessages } from 'react-intl';

/**
 * Properties:
 *  placeholder: placeholder text
 */

class KeywordsInputWithFilter extends React.Component {
    constructor(props) {
        super(props);
        this.autocomplete = debounce(this.autocomplete, 300);
        this.messages = this.getIntlMessages();
    }
    getIntlMessages(){
        return defineMessages({
            allContentOption: {
                id: 'KeywordsInputWithFilter.allContentOption',
                defaultMessage: 'All Content'
            },
            titleOption: {
                id: 'KeywordsInputWithFilter.titleOption',
                defaultMessage: 'Title'
            },
            descriptionOption: {
                id: 'KeywordsInputWithFilter.descriptionOption',
                defaultMessage: 'Description'
            },
            contentOption: {
                id: 'KeywordsInputWithFilter.contentOption',
                defaultMessage: 'Content'
            },
        });
    }
    init(){
        $('#keywords_search_div').search({
            fields: {
                title: 'key'
            },
            minCharacters: 1,
            maxResults: 5,
            showNoResults: false,
            cache: false,
            onSelect: this.onSelect.bind(this),
            apiSettings:{
                responseAsync: this.autocomplete.bind(this)
            }
        });

        $('#kindDropdown').dropdown();
    }
    autocomplete(settings, callback) {
        const query = settings.urlData.query;

        context.executeAction(suggestKeywords, {
            query: encodeURIComponent(query)
        }).then( (response) => {
            callback(response);
        });
    }
    componentDidMount(){
        this.init();
    }
    focus(){
        this.keywordsInput.focus();
    }
    onSelect(result, response){
        this.props.onSelect(result.key);
    }
    blur(){
        this.keywordsInput.blur();
    }
    _onClick(e) {
        this.props.handleRedirect();
    }
    render(){
        return (
            <div id='keywords_search_div' className="ui search action fluid input">
                <input name='keywords' onChange={this.props.onChange} onKeyPress={this.props.onKeyPress} value={this.props.value} id='SearchTerm' placeholder={this.props.placeholder} type='text' className="prompt" ref={(el) => { this.keywordsInput = el;}}></input>
                <div className="results"></div>
                <select id="kindDropdown" name="field" className="ui compact selection dropdown" onChange={this.props.onChange} value={this.props.fieldValue}>
                    <option value=" ">{this.context.intl.formatMessage(this.messages.allContentOption)}</option>
                    <option value="title">{this.context.intl.formatMessage(this.messages.titleOption)}</option>
                    <option value="description">{this.context.intl.formatMessage(this.messages.descriptionOption)}</option>
                    <option value="content">{this.context.intl.formatMessage(this.messages.contentOption)}</option>
                </select>
                <div className="ui primary submit button" tabIndex="0" onClick={this._onClick.bind(this)} onKeyPress={this.props.onKeyPress}>{this.props.buttonText}</div>
            </div>
        );
    }
}

KeywordsInputWithFilter.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
};
export default KeywordsInputWithFilter;
