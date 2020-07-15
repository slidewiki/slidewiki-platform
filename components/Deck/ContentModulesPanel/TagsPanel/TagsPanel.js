import PropTypes from 'prop-types';
import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import classNames from 'classnames';
import TagsStore from '../../../../stores/TagsStore';
import PermissionsStore from '../../../../stores/PermissionsStore';
import TagList from './TagList';
import newTag from '../../../../actions/tags/newTag';
import removeTag from '../../../../actions/tags/removeTag';
import saveTags from '../../../../actions/tags/saveTags';
import TagInput from './TagInput';
import RecommendedTags from './RecommendedTags';
import showMoreTags from '../../../../actions/tags/showMoreTags';
import showLessTags from '../../../../actions/tags/showLessTags';
import loadRecommendedTags from '../../../../actions/tags/loadRecommendedTags';
import { defineMessages } from 'react-intl';
import { Form } from 'semantic-ui-react';

class TagsPanel extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            editMode: false,
            tags: [],
            tagsOptions: []
        };
        this.messages = this.getIntlMessages();
    }
    componentDidMount() {
        this.getStateFromProps();
    }
    componentDidUpdate(prevProps) {
        if (this.props.TagsStore.tags !== prevProps.TagsStore.tags) {
            this.getStateFromProps();
        }
    }
    getStateFromProps = () => {
        this.setState({
            tags: this.props.TagsStore.tags ? this.props.TagsStore.tags.map((tag) => tag.tagName) : [],
            tagsOptions: this.props.TagsStore.tags
        });
    }
    
    getIntlMessages(){
        return defineMessages({
            header:{
                id: 'TagsPanel.header',
                defaultMessage: 'Tags'
            },
            edit:{
                id: 'TagsPanel.edit',
                defaultMessage: 'Edit'
            },
            save:{
                id: 'TagsPanel.save',
                defaultMessage: 'Save'
            },
            cancel:{
                id: 'TagsPanel.cancel',
                defaultMessage: 'Cancel'
            },
            ariaEdit: {
                id: 'TagsPanel.aria.edit',
                defaultMessage: 'Edit tags'
            }, 
            ariaSave: {
                id: 'TagsPanel.aria.save',
                defaultMessage: 'Save tags'
            }, 
            ariaCancel: {
                id: 'TagsPanel.aria.cancel',
                defaultMessage: 'Cancel tags'
            },
            tagInputPlaceholder:{
                id: 'TagsPanel.TagInput.placeholder',
                defaultMessage: 'Insert new tags'
            },
            tagLabel: {
                id: 'TagsPanel.TagInput.Choose',
                defaultMessage: 'Choose Tags'
            }
        });
    }
    onShowEditForm(e) {
        e.preventDefault();
        this.context.executeAction(loadRecommendedTags, {
            selector: this.props.TagsStore.selector
        });
        this.setState({editMode: true});
    }
    handleShowMore(e) {
        e.preventDefault();
        this.context.executeAction(showMoreTags);
    }
    handleShowLess(e){
        e.preventDefault();
        this.context.executeAction(showLessTags);
    }
    handleSave(e) {
        e.preventDefault();

        // we need to add the existing topics tags in this list, otherwise we'll lose them
        let tags = this.state.tags;

        tags = tags.map((tag) => {
            const isExistingTag = tag.startsWith('existing:');
            const label = isExistingTag ? tag.replace(/^(existing\:)/, '') : tag;

            if (isExistingTag) {
                return {
                    tagName: label
                };
            }
            
            return {
                defaultName: label
            };
        });

        //tagsToSave.push(...this.props.TagsStore.topics.map((t) => ({ tagName: t.tagName })));

        this.context.executeAction(saveTags, {
            tags,
            selector: this.props.selector
        });
        this.setState({editMode: false});
    }
    handleCancel(e){
        e.preventDefault();
        this.setState({editMode: false});
    }
    addRecommendedTag(value){
        // call function of child component
        this.tags_input.addRecommendedTag(value);
    }

    handleDropdownChange = (e, dropdown) => {
        this.setState({
            [dropdown.id]: dropdown.value
        });
    }

    render() {

        const tags = this.props.TagsStore.tags;
        
        const arrayOfTagsIsLarge = tags.length > 10;
        const showAllTags = this.props.TagsStore.showAllTags;
        const displayTags = (arrayOfTagsIsLarge && !showAllTags) ? tags.slice(0, 9) : tags;

        let expandLink = '';
        if(arrayOfTagsIsLarge){
            expandLink = (!showAllTags) ? <div><br/><a href="#" onClick={this.handleShowMore.bind(this)} >Show more ...</a></div>
            : <div><br/><a href="#" onClick={this.handleShowLess.bind(this)} >Show less ...</a></div>;
        }
        let tagViewPanel = (tags.length === 0)
            ? <div>There are currently no tags.</div>
            : <div>
                <TagList items={displayTags} editable={false}/>
                {expandLink}
            </div>;

        let tagEditPanel = <Form>
            <Form.Group widths='equal'>
                <TagInput 
                    id="tags"
                    initialOptions={this.state.tagsOptions} 
                    recommendedTags={this.props.TagsStore.recommendedTags}
                    tagFilter={{}}
                    value={this.state.tags}
                    onChange={this.handleDropdownChange}
                    label={this.context.intl.formatMessage(this.messages.tagLabel)}
                    allowAdditions={true}
                    placeholder={this.context.intl.formatMessage(this.messages.tagInputPlaceholder)}
                />
            </Form.Group>
        </Form>;

        let editPermission = (this.props.PermissionsStore.permissions.admin || this.props.PermissionsStore.permissions.edit);

        return (
            <div className="ui bottom attached" ref="tagsPanel">
                <div className="ui stackable grid">
                    <div className="row">
                        <div className="eight wide column">
                            <h3 className="ui header">{this.context.intl.formatMessage(this.messages.header)}</h3>
                        </div>
                        <div className="eight wide right aligned column">
                            { (!this.state.editMode && editPermission) && 
                                <button tabIndex="0" className="ui right floated compact primary button" aria-label={this.context.intl.formatMessage(this.messages.ariaEdit)} onClick={this.onShowEditForm.bind(this)}><i className="edit icon"></i>
 {this.context.intl.formatMessage(this.messages.edit)}</button>
                            }
                        </div>
                    </div>
                    <div className="row">
                        <div className="sixteen wide column">
                            { (this.state.editMode) ? tagEditPanel : tagViewPanel }
                         </div>
                    </div>
                    { (this.state.editMode) && 
                        <div>
                            <button tabIndex="0" className="ui floated compact primary button" aria-label={this.context.intl.formatMessage(this.messages.ariaSave)} onClick={this.handleSave.bind(this)}><i className="check icon"></i> {this.context.intl.formatMessage(this.messages.save)}</button>
                            <button tabIndex="0" className="ui compact button" aria-label={this.context.intl.formatMessage(this.messages.ariaCancel)} onClick={this.handleCancel.bind(this)}><i className="close icon"></i> {this.context.intl.formatMessage(this.messages.cancel)}</button>
                        </div>
                    }
                    { (this.state.editMode && editPermission && this.props.TagsStore.recommendedTags.length > 0) &&
                        <RecommendedTags recommendedTags={this.props.TagsStore.recommendedTags} selectedTags={tags} addRecommendedTag={this.addRecommendedTag.bind(this)} />
                    }
                </div>
                <br/>
                {(this.props.TagsStore.isLoading === true || this.props.TagsStore.recommendationsLoading === true) ? <div className="ui active dimmer"><div className="ui text loader">Loading</div></div> : ''}
            </div>
        );
    }
}

TagsPanel.contextTypes = {
    executeAction: PropTypes.func.isRequired, 
    intl: PropTypes.object.isRequired
};

TagsPanel = connectToStores(TagsPanel, [TagsStore, PermissionsStore], (context, props) => {
    return {
        TagsStore: context.getStore(TagsStore).getState(),
        PermissionsStore: context.getStore(PermissionsStore).getState()
    };
});

export default TagsPanel;
