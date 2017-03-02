import React from 'react';
import classNames from 'classnames';
import suggestKeywords from '../../../actions/search/suggestKeywords';
/**
 * Properties:
 *  placeholder: placeholder text
 */

class KeywordsInput extends React.Component {
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
    render(){
        let classes = classNames({
            'ui': true,
            'search': true,
            'fluid': true
        });

        let value = (this.props.value !== '*:*') ? this.props.value : '';
        
        return (
            <div className={classes} id="keywords_search_div">
                <input name='keywords' onChange={this.props.onChange} onKeyPress={this.props.onKeyPress} value={value} id='SearchTerm' placeholder={this.props.placeholder} type='text' className="prompt" ref='keywords'></input>
                <div className="results"></div>
            </div>
        );
    }
}

KeywordsInput.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
export default KeywordsInput;
