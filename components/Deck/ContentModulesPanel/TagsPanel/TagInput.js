import React from 'react';
import classNames from 'classnames';
import suggestTags from '../../../../actions/search/suggestTags';

class TagInput extends React.Component {
    initDropdown(){
        $('#tags_input_div').dropdown({
            fields: {
                name: 'defaultName',
                value: 'tagName'
            },
            minCharacters: 1,
            allowAdditions: true,
            hideAdditions: false,
            apiSettings:{
                responseAsync: function(settings, callback) {
                    const query = settings.urlData.query;

                    context.executeAction(suggestTags, {
                        query: encodeURIComponent(query),
                    }).then( (response) => {

                        // this is needed to mark tags that have tagNames
                        // in multi-select it is not possible to get objects selected, only string(!?)
                        response.results = response.results.map((t) => {
                            return {
                                defaultName: t.defaultName,
                                tagName: 'tagName:' + t.tagName
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

        let currentTags = $('#tags_input_div').dropdown('get value');

        return currentTags.filter( (t, pos) => {
            // check for string and uniqueness
            return (typeof t === 'string') && (currentTags.indexOf(t) === pos);
        }).map( (t) => {
            if(t.startsWith('tagName:')){
                return { tagName: t.replace(/^tagName:/, '') };
            } else {
                return { defaultName: t };
            }
        });
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

        let initialOptions = this.props.initialTags.map( (t) => {
            return <option key={t.tagName} value={'tagName:' + t.tagName}>{t.defaultName || t.tagName}</option>;
        });
        let initialOptionsValues = this.props.initialTags.map( (t) => {
            return 'tagName:' + t.tagName;
        });

        // followed the tip using timeout proposed here: https://github.com/Semantic-Org/Semantic-UI/issues/2247
        // nothing else seems to be working in multi-select
        $('#tags_input_div').dropdown('refresh');
        setTimeout( () => {
            $('#tags_input_div').dropdown('set selected', initialOptionsValues);
        }, 1);

        return (
            <div name="tag_input" id="tag_input">
                <select multiple id="tags_input_div" name="currentTags" className="ui fluid search multiple dropdown">
                    <option value="">Insert new tags</option>
                    {initialOptions}
                </select>
            </div>
        );
    }
}

TagInput.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
export default TagInput;
