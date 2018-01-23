import React from 'react';
import newTag from '../../../../actions/tags/newTag';

class RecommendedTags extends React.Component {
    constructor(props){
        super(props);
        this.state = this.getStateFromProps(props);
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
                </div>
                <div className="extra content">
                    <div className="ui two buttons">
                        <div className="ui basic green button" onClick={this.handleAdd.bind(this, t.name, index)}>Add</div>
                        <div className="ui basic red button" onClick={this.handleDismiss.bind(this, t.name, index)}>Dismiss</div>
                    </div>
                </div>
            </div>;
        });

        return (
            <div ref="suggestedTags">
                { (recommendedTagsList.length > 0) && 
                    <div> 
                        <div className="row">
                            <div className="sixteen wide column">
                                <h4 className="ui header">Recommended Tags</h4>
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
    executeAction: React.PropTypes.func.isRequired
};

export default RecommendedTags;
