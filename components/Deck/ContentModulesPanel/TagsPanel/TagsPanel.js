import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import TagsStore from '../../../../stores/TagsStore';
import TagList from './TagList';
import newTag from '../../../../actions/tags/newTag';
import changeEditMode from '../../../../actions/tags/changeEditMode';
import removeTag from '../../../../actions/tags/removeTag';

class TagsPanel extends React.Component {
    constructor(props) {
        super(props);
    }

    onAddTag(e) {
        e.preventDefault();
        const val = this.refs.taginp.value;
        const { selector } = this.props;
        if (!val) {
            return false;
        }
        this.refs.taginp.value = '';

        this.context.executeAction(newTag, {
            'tag': val,
            'selector': selector
        });
    }

    onShowEditForm(e) {
        e.preventDefault();
        this.context.executeAction(changeEditMode, {isEditMode: true});
    }

    onRemoveTag(tag) {
        const { selector } = this.props;

        this.context.executeAction(removeTag, {
            'tag': tag,
            'selector': selector
        });
    }

    handleShowMore(e) {
        e.preventDefault();
        //this.context.executeAction(showMoreTags);
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
                         isEditMode={this.props.TagsStore.isEditMode}
                         onTagDelete={this.onRemoveTag.bind(this)}
                />
                {showMoreLink}
            </div>
            ;

        let editBtn = <div className="column right aligned">
            <button className="ui right floated button blue" onClick={this.onShowEditForm.bind(this)}>
                <i className="edit icon" data-reactid="640"></i>Edit Tags
            </button>
        </div>;

        let editForm = <div className="column right aligned">
            <div className="ui right labeled left icon input">
                <label id="EnterTags">
                </label>
                <input ref="taginp" type="text" placeholder="Enter tags" aria-labelledby="EnterTags"/>
                    <a className="ui tag label" role="button" tabIndex="0" onClick={this.onAddTag.bind(this)}>
                        Add Tag
                    </a>
            </div>
        </div>;
        let editSection = this.props.TagsStore.isEditMode? editForm : editBtn;

        return (
            <div className="ui bottom attached" ref="dataSourcePanel">
                <div className="ui two column stackable grid">
                    <div className="column">
                        <h3 className="ui header">Tags</h3>
                    </div>
                    { editSection }
                </div>
                { tagList }<br/>
            </div>
        );
    }
}

TagsPanel.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

TagsPanel = connectToStores(TagsPanel, [TagsStore], (context, props) => {
    return {
        TagsStore: context.getStore(TagsStore).getState()
    };
});

export default TagsPanel;
