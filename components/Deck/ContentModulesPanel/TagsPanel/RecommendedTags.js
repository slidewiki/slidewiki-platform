import React from 'react';
import newTag from '../../../../actions/tags/newTag';
import { defineMessages } from 'react-intl';

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
            add: {
                id: 'RecommendedTags.add',
                defaultMessage: 'Add'
            }, 
            dismiss: {
                id: 'RecommendedTags.dismiss',
                defaultMessage: 'Dismiss'
            }, 
            ariaAdd: {
                id: 'RecommendedTags.aria.add',
                defaultMessage: 'Add recommended tag'
            }, 
            ariaDismiss: {
                id: 'RecommendedTags.aria.dismiss',
                defaultMessage: 'Dismiss recommended tag'
            },
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
            return <div id={index} key={index} className="ui fluid card">
                <div className="content">
                    <div className="header">
                        <a target="_blank" href={'/deckfamily/' + t.name} key={t.name} className="ui large tag label" tabIndex="0" aria-label={t.name}>
                            {t.name}
                        </a>
                    </div>
                    <div className="description">
                        <div className="ui two compact buttons">
                            <div className="ui basic green button" aria-label={this.context.intl.formatMessage(this.messages.ariaAdd)} onClick={this.handleAdd.bind(this, t.name, index)}>{this.context.intl.formatMessage(this.messages.add)}</div>
                            <div className="ui basic red button" aria-label={this.context.intl.formatMessage(this.messages.ariaDismiss)} onClick={this.handleDismiss.bind(this, t.name, index)}>{this.context.intl.formatMessage(this.messages.dismiss)}</div>
                        </div>
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
    intl: React.PropTypes.object.isRequired
};

export default RecommendedTags;
