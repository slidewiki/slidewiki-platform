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
        return this.refs.searchstring.value;
    }
    focus(){
        this.refs.searchstring.focus();
    }
    render(){
        let classes = classNames({
            'ui': true,
            'search': true,
            'fluid': true
        });

        return (
            <div className={classes} id="keywords_search_div">
                <input name='searchstring' onChange={this.props.onChange} onKeyPress={this.props.onKeyPress} value={this.props.value} id='SearchTerm' placeholder={this.props.placeholder} type='text' className="prompt" ref='searchstring'></input>
                <div className="results"></div>
            </div>
        );
    }
}

KeywordsInput.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
export default KeywordsInput;
