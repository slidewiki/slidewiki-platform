import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import suggestTags from '../../../../actions/search/suggestTags';
import { defineMessages } from 'react-intl';

class TagInput extends React.Component {
    constructor(props){
        super(props);
        this.state = this.getStateFromProps(props);
        this.messages = this.getIntlMessages();
    }
    getIntlMessages(){
        return defineMessages({
        });
    }
    componentWillReceiveProps(newProps){

        if(this.props !== newProps){
            this.setState(this.getStateFromProps(newProps));

            // initialize pre-selected tags
            let values = this.state.initialTags.map( (tag) => `tagName:${tag.tagName}`);

            $(this.rootElement).dropdown('set exactly', values);
        }
    }
    getStateFromProps(props){
        return {
            initialTags: props.initialTags,
            recommendedTags: props.recommendedTags || [],
        };
    }
    initDropdown(){
        $(this.rootElement).dropdown({
            fields: {
                name: 'defaultName',
                value: 'tagName'
            },
            allowAdditions: this.props.allowAdditions,
            hideAdditions: false,
            apiSettings:{
                responseAsync: (settings, callback) => {
                    let queryString = settings.urlData.query;
                    let query = Object.assign({ q: queryString }, this.props.tagFilter);
                    context.executeAction(suggestTags, { query } ).then( (response) => {

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
            },
            onNoResults: () => {
                // replace the text: 'no results found' is no search terms is entered yet
                if ($(this.rootElement).find('input').val() === '') {
                    $(this.rootElement).find('.menu .message').text('Start typing to find results');
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
        let tags = $(this.rootElement).dropdown('get value');

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
        $(this.menuElement).append(newOption);

        // after this addition the dropdown needs to be initialized again
        this.initDropdown();

        // select the recommended tag
        $(this.rootElement).dropdown('set selected', `tagName:${value}`);
    }
    clear() {
        $(this.rootElement).dropdown('clear');
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
            return <div className="item" key={`tagName:${t.tagName}`} data-value={`tagName:${t.tagName}`}>{t.defaultName || t.tagName}</div>;
        });

        return (
            <div ref={(i) => (this.rootElement = i)} className={classes}>
              <i className="dropdown icon"></i>
              <div className="default text">{this.props.placeholder}</div>
              <div ref={(i) => (this.menuElement = i)} className="menu">
                {initialOptions}
              </div>
            </div>
        );
    }
}

TagInput.contextTypes = {
    executeAction: PropTypes.func.isRequired, 
    intl: PropTypes.object.isRequired
};
export default TagInput;
