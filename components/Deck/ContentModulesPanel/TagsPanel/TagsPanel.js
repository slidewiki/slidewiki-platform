import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import classNames from 'classnames';
import TagsStore from '../../../../stores/TagsStore';
import PermissionsStore from '../../../../stores/PermissionsStore';
import TagList from './TagList';
import newTag from '../../../../actions/tags/newTag';
import changeEditMode from '../../../../actions/tags/changeEditMode';
import removeTag from '../../../../actions/tags/removeTag';
import saveTags from '../../../../actions/tags/saveTags';
import TagInput from './TagInput';

class TagsPanel extends React.Component {
    // constructor(props) {
    //     super(props);
    // }

    // onAddTag(e) {
    //     e.preventDefault();
    //     const val = this.refs.taginp.value;
    //     if (!val) {
    //         return false;
    //     }
    //     if (this.props.TagsStore.tags.findIndex((tag) => {return tag.tagName === val;}) !== -1) {
    //         //found duplicate tag
    //         swal({
    //             type: 'info',
    //             title: 'Information',
    //             text: 'This tag is already existing.',
    //             timer: 4000,
    //             showCloseButton: false,
    //             showCancelButton: false,
    //             allowEscapeKey: false,
    //             showConfirmButton: false
    //         })
    //         .then(() => {/* Confirmed */}, (reason) => {/* Canceled */});
    //         return false;
    //     }
    //     this.refs.taginp.value = '';
    //
    //     this.context.executeAction(newTag, {
    //         tag: val
    //     });
    // }

    onShowEditForm(e) {
        e.preventDefault();
        this.context.executeAction(changeEditMode, {isEditMode: true});
    }

    // onRemoveTag(tag) {
    //     const { selector } = this.props;
    //
    //     this.context.executeAction(removeTag, {
    //         tag: tag
    //     });
    // }

    handleShowMore(e) {
        e.preventDefault();
        //this.context.executeAction(showMoreTags);
    }

    handleSave(e) {
        e.preventDefault();

        let tagsToSave = this.refs.tags_input.getSelected();
        this.context.executeAction(saveTags, {
            tags: tagsToSave,
            selector: this.props.selector
        });
    }
    render() {

        const tags = this.props.TagsStore.tags;

        const arrayOfTagsIsLarge = tags.length > 10;
        const showAllTags = this.props.TagsStore.showAllTags;
        const displayTags = (arrayOfTagsIsLarge && !showAllTags) ? tags.slice(0, 9) : tags;

        let showMoreLink = (!showAllTags && arrayOfTagsIsLarge) ? <div><br/><a href="#" onClick={this.handleShowMore.bind(this)} >Show more ...</a></div> : '';
        let tagViewPanel = (tags.length === 0)
            ? <div>There are currently no tags.</div>
            : <div>
                <TagList items={displayTags} editable={false}/>
                {showMoreLink}
            </div>;

        let tagEditPanel = <TagInput initialTags={tags} ref="tags_input"/> ;

        let editPermission = (this.props.PermissionsStore.permissions.admin || this.props.PermissionsStore.permissions.edit);
        
        let tagPanel = '';
        let actionBtn = '';
        if(this.props.TagsStore.isEditMode){
            tagPanel = tagEditPanel;
            if(editPermission){
                actionBtn = <button tabIndex="0" className="ui small blue button" onClick={this.handleSave.bind(this)}>Save Tags</button>;
            }
        } else {
            tagPanel = tagViewPanel;
            if(editPermission){
                actionBtn = <button tabIndex="0" className="ui small blue button" onClick={this.onShowEditForm.bind(this)}>Edit Tags</button>;
            }
        }

        return (
            <div className="ui bottom attached" ref="tagsPanel">
                <h3 className="ui header">Tags {actionBtn}</h3>
                { tagPanel }
                <br/>
                {(this.props.TagsStore.isLoading === true) ? <div className="ui active dimmer"><div className="ui text loader">Loading</div></div> : ''}
            </div>
        );
    }
}

TagsPanel.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

TagsPanel = connectToStores(TagsPanel, [TagsStore, PermissionsStore], (context, props) => {
    return {
        TagsStore: context.getStore(TagsStore).getState(),
        PermissionsStore: context.getStore(PermissionsStore).getState()
    };
});

export default TagsPanel;
