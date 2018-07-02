import PropTypes from 'prop-types';
import React from 'react';
import newTag from '../../../../actions/tags/newTag';
import { defineMessages } from 'react-intl';
import { navigateAction } from 'fluxible-router';

class RecommendedTags extends React.Component {
    constructor(props){
        super(props);
        this.state = this.getStateFromProps(props);
        this.messages = this.getIntlMessages();
    }
    getIntlMessages(){
        return defineMessages({
            header:{
                id: 'RecommendedTags.header',
                defaultMessage: 'Recommended Tags'
            }, 
            ariaAdd: {
                id: 'RecommendedTags.aria.add',
                defaultMessage: 'Add recommended tag'
            }, 
            ariaDismiss: {
                id: 'RecommendedTags.aria.dismiss',
                defaultMessage: 'Dismiss recommendation'
            },
            ariaViewDecksWithTag: {
                id: 'RecommendedTags.aria.viewDecksWithTag', 
                defaultMessage: 'View decks with this tag'
            }
        });
    }
    componentWillReceiveProps(newProps){
        if(this.props !== newProps){
            this.setState(this.getStateFromProps(newProps));
        }
    }
    getStateFromProps(props){
        // TODO: exlude tagNames or defaultNames ?
        let existingTagNames = props.selectedTags.map( (t) => t.defaultName); 
        let unusedTags = props.recommendedTags.filter( (t) => {
            return !existingTagNames.includes(t.name);
        });
        
        let tagsToShow = unusedTags.splice(0, 4);

        return {
            unusedTags: unusedTags, 
            tagsToShow: tagsToShow
        };
    }
    handleAdd(value, index, e){
        e.preventDefault();
        this.props.addRecommendedTag(value);
        this.replaceCard(index);
    }
    handleDismiss(value, index, e){
        e.preventDefault();
        this.replaceCard(index);
    }
    replaceCard(index){
        // hide current card
        $(`#${index}`).transition({
            animation: 'scale',
            onComplete: () => {
                // change state of suggested cards when transition is complete
                let newState = Object.assign({}, this.state);
                let nextUnused = newState.unusedTags.splice(0, 1)[0];

                // if there is another available suggested tag
                if(nextUnused){
                    // replace the current one
                    newState.tagsToShow[index] = nextUnused;
                } else {
                    // else just reduce the suggested tags to show
                    newState.tagsToShow.splice(index, 1);
                }

                // show card when state has changed
                this.setState(newState, () => {
                    $(`#${index}`).transition('scale');
                });
            }
        });
    }
    render() {
        let recommendedTagsList = this.state.tagsToShow.map( (t, index) => { 
            return <div id={index} key={index} className="ui card">
                <div className="content">
                    <a href="#" key={t.name} title={t.name} className="ui large tag label" tabIndex="0" aria-label={t.name} onClick={this.handleAdd.bind(this, t.name, index)}>
                        {t.name}
                    </a>
                </div>
                <div className="bottom attached menu">
                    <div className="ui tiny basic icon fluid buttons">
                        <button className="ui button" aria-label={this.context.intl.formatMessage(this.messages.ariaAdd)} data-tooltip={this.context.intl.formatMessage(this.messages.ariaAdd)} data-position='bottom center' onClick={this.handleAdd.bind(this, t.name, index)}><i className="plus icon"></i></button>
                        <a href={'/deckfamily/' + t.name} target="_blank" type="button" role="button" className="ui button" aria-label={this.context.intl.formatMessage(this.messages.ariaViewDecksWithTag)} data-tooltip={this.context.intl.formatMessage(this.messages.ariaViewDecksWithTag)} data-position='bottom center'><i className="unhide icon"></i></a>
                        <button className="ui button" aria-label={this.context.intl.formatMessage(this.messages.ariaDismiss)} data-tooltip={this.context.intl.formatMessage(this.messages.ariaDismiss)} data-position='bottom center' onClick={this.handleDismiss.bind(this, t.name, index)}><i className="remove icon"></i></button>
                    </div>
                </div>
            </div>;
        });

        return (
            <div className="row" ref="suggestedTags">
                { (recommendedTagsList.length > 0) && 
                    <div className="sixteen wide column">
                        <div className="row">
                            <div className="sixteen wide column">
                                <h4 className="ui header">{this.context.intl.formatMessage(this.messages.header)}</h4>
                            </div>
                        </div>
                        <br/>
                        <div className="row">
                            <div className="row">
                                <div className="sixteen wide column">
                                    <div className="ui four stackable doubling cards">
                                        {recommendedTagsList}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

RecommendedTags.contextTypes = {
    intl: PropTypes.object.isRequired,
    executeAction: PropTypes.func.isRequired,
};

export default RecommendedTags;
