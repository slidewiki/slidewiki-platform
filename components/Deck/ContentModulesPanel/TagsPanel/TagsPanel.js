import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import TagsStore from '../../../../stores/TagsStore';
import TagList from './TagList';
// import EditTag from './EditTag';
// import newTag from '../../../../actions/tags/newTag';
// import showMoreTags from '../../../../actions/tags/showMoreTags';

class TagsPanel extends React.Component {
    handleNewTag() {
        //this.context.executeAction(newTag);
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
        const tag = this.props.TagsStore.tag;
        const selector = this.props.TagsStore.selector;

        let newTagButton =
            <button tabIndex="0" onClick={this.handleNewTag.bind(this)} className="ui blue labeled icon button">
                <i className="icon plus"></i> Add Tag
            </button>;

        let tagsHeader = <h3 className="ui dividing header">Tags</h3>;
        //
        let showMoreLink = (!showAllTags && arrayOfTagsIsLarge) ? <div><br/><a href="#" onClick={this.handleShowMore.bind(this)} >Show more ...</a></div> : '';
        let tagList = (tags.length === 0)
            ?
            <div>There are currently no tags for this {this.props.DataSourceStore.selector.stype}.</div>
            :
            <div>
                <TagList items={displayTags} editable ={true} selector={selector}/>
                {showMoreLink}
            </div>
            ;
        // let editForm = <EditTag tag={tag}/>;

        return (
            <div className="ui bottom attached" ref="dataSourcePanel">

                {(tag === undefined) ? tagsHeader : ''}
                {(tag === undefined) ? tagList : editForm}<br/>
                {(tag === undefined) ? newTagButton : ''}
            </div>
        );
    }
}

TagsPanel.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

TagsPanel = connectToStores(TagsPanel, [TagsStore], (context, props) => {
    return {
        TagsStore: context.getStore(TagsStore).getState(),
    };
});

export default TagsPanel;
