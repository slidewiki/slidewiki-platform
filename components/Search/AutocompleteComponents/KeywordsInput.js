import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import suggestKeywords from '../../../actions/search/suggestKeywords';
import { debounce } from 'lodash';

/**
 * Properties:
 *  placeholder: placeholder text
 */

class KeywordsInput extends React.Component {
    constructor(props) {
        super(props);
        this.autocomplete = debounce(this.autocomplete, 300);
    }
    initAutocomplete(){
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
        this.initAutocomplete();
    }
    componentDidUpdate(){
        this.initAutocomplete();
    }
    getSelected(){
        return this.refs.keywords.value;
    }
    focus(){
        this.refs.keywords.focus();
    }
    onSelect(result, response){
        this.props.onSelect(result.key);
    }
    blur(){
        this.refs.keywords.blur();
    }
    handleKeyPress(e){
        if(e.key === 'Enter'){
            this.autocomplete.cancel();
            this.props.handleRedirect(e);
        }
    }
    render(){
        let classes = classNames({
            'ui': true,
            'search': true,
            'fluid': true
        });

        let value = (this.props.value !== '*:*') ? this.props.value : '';
        
        return (
            <div className={classes} id="keywords_search_div">
                <input name='keywords' onChange={this.props.onChange} onKeyPress={this.handleKeyPress.bind(this)} value={value} id='SearchTerm' placeholder={this.props.placeholder} type='text' className="prompt" ref='keywords'></input>
                <div className="results"></div>
            </div>
        );
    }
}

KeywordsInput.contextTypes = {
    executeAction: PropTypes.func.isRequired
};
export default KeywordsInput;
