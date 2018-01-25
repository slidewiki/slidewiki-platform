import React from 'react';
import classNames from 'classnames';
import suggestTags from '../../../../actions/search/suggestTags';

class TagInput extends React.Component {
    constructor(props){
        super(props);
        this.state = this.getStateFromProps(props);
    }
    componentWillReceiveProps(newProps){

        if(this.props !== newProps){
            this.setState(this.getStateFromProps(newProps));

            // initialize pre-selected tags
            let values = this.state.initialTags.map( (tag) => `tagName:${tag.tagName}`);

            $('#tags_input_div').dropdown('set selected', values);
        }
    }
    getStateFromProps(props){
        return {
            initialTags: props.initialTags,
            recommendedTags: props.recommendedTags
        };
    }
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
                                tagName: `tagName:${t.tagName}`
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
        // selected tags are return as string (!), so we split to ','
        let tags = $('#tags_input_div').dropdown('get value');

        if(tags.trim() === ''){
            return [];
        }

        return tags.split(',').map( (t) => {

            // comes from dropdown or it is a recommended tag
            if(t.startsWith('tagName:')){
                let tag = {
                    tagName: t.replace(/^tagName:/, '')
                };

                // we check if this tagName comes from recommended tags
                let recommendedTag = this.state.recommendedTags.find( (t) => {
                    return t.name === tag.tagName;
                });

                // if it is from recommended tags and has a link, 
                // we also add the link
                if(recommendedTag && recommendedTag.link){
                    tag.uri = recommendedTag.link;
                }

                return tag;
            // is new and was inserted by the user
            } else {
                return { defaultName: t };
            }
        });
    }
    addRecommendedTag(value){
        // add the recommended tag as an option to the dropdown
        let newOption = `<div class="item" key="tagName:${value}" data-value="tagName:${value}">${value}</div>`;
        $('#tags_menu').append(newOption);

        // after this addition the dropdown needs to be initialized again
        this.initDropdown();

        // select the recommended tag
        $('#tags_input_div').dropdown('set selected', `tagName:${value}`);
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

        // selection options are concatenated pre-selected tags and recommended tags 
        let initialOptions = this.props.initialTags.map( (t) => {
            return <div className="item" key={`tagName:${t.tagName}`} data-value={`tagName:${t.tagName}`}>{t.defaultName}</div>;
        });

        return (
            <div id="tags_input_div" className={classes}>
              <i className="dropdown icon"></i>
              <div className="default text">Insert new tags</div>
              <div id="tags_menu" className="menu">
                {initialOptions}
              </div>
            </div>
        );
    }
}

TagInput.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
export default TagInput;
