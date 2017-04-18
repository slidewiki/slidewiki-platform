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

class TagsPanel extends React.Component {
    constructor(props) {
        super(props);
    }

    onAddTag(e) {
        e.preventDefault();
        const val = this.refs.taginp.value;
        if (!val) {
            return false;
        }
        if (this.props.TagsStore.tags.findIndex((tag) => {return tag.tagName === val;}) !== -1) {
            //found duplicate tag
            swal({
                type: 'info',
                title: 'Information',
                text: 'This tag is already existing.',
                timer: 4000,
                showCloseButton: false,
                showCancelButton: false,
                allowEscapeKey: false,
                showConfirmButton: false
            })
            .then(() => {/* Confirmed */}, (reason) => {/* Canceled */});
            return false;
        }
        this.refs.taginp.value = '';

        this.context.executeAction(newTag, {
            tag: val
        });
    }

    onShowEditForm(e) {
        e.preventDefault();
        this.context.executeAction(changeEditMode, {isEditMode: true});
    }

    onRemoveTag(tag) {
        const { selector } = this.props;

        this.context.executeAction(removeTag, {
            tag: tag
        });
    }

    handleShowMore(e) {
        e.preventDefault();
        //this.context.executeAction(showMoreTags);
    }

    handleSave(e) {
        e.preventDefault();

        this.context.executeAction(saveTags, {
            tags: this.props.TagsStore.tags,
            selector: this.props.selector
        });
    }

    render() {
        const tags = this.props.TagsStore.tags;
        const arrayOfTagsIsLarge = tags.length > 10;
        const showAllTags = this.props.TagsStore.showAllTags;
        const displayTags = (arrayOfTagsIsLarge && !showAllTags) ? tags.slice(0, 9) : tags;

        let showMoreLink = (!showAllTags && arrayOfTagsIsLarge) ? <div><br/><a href="#" onClick={this.handleShowMore.bind(this)} >Show more ...</a></div> : '';
        let tagList = (tags.length === 0)
            ?
            <div>There are currently no tags.</div>
            :
            <div>
                <TagList items={displayTags}
                         editable={true}
                         isEditMode={(this.props.PermissionsStore.permissions.admin || this.props.PermissionsStore.permissions.edit)}
                         onTagDelete={this.onRemoveTag.bind(this)}
                />
                {showMoreLink}
            </div>
            ;

        let saveBtn_classes = classNames({
            'ui': true,
            'right': true,
            'primary': true,
            'disabled': !this.props.TagsStore.tagsHaveChanged,
            'button': true
        });
        let editForm = <div className="column right aligned">
            <div className="ui right labeled icon input">
                <label id="EnterTag">
                </label>
                <input ref="taginp" type="text" maxLength="60" placeholder="Enter tag" aria-labelledby="EnterTag"/>
                    <a className="ui tag label" role="button" tabIndex="0" onClick={this.onAddTag.bind(this)}>
                        Add Tag
                    </a>
            </div>
            &nbsp;
            <button className={saveBtn_classes}
                    onClick={this.handleSave.bind(this)}>Save all tags
            </button>
        </div>;
        let editSection = (this.props.PermissionsStore.permissions.admin || this.props.PermissionsStore.permissions.edit) ? editForm : '';

        return (
            <div className="ui bottom attached" ref="dataSourcePanel">
                <div className="ui two column stackable grid">
                    <div className="column">
                        <h3 className="ui header">Tags</h3>
                    </div>
                    { editSection }
                </div>
                { tagList }<br/>
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
