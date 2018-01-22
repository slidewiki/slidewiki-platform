import React from 'react';
import newTag from '../../../../actions/tags/newTag';

class RecommendedTags extends React.Component {
    constructor(props){
        super(props);
        this.state = this.getStateFromProps(props);
    }
    componentWillReceiveProps(newProps){
        this.setState(this.getStateFromProps(newProps));
    }
    getStateFromProps(props){

        // exclude tags that are already used
        let existingTagNames = props.selectedTags.map( (t) => t.tagName); 
        return {
            tags: props.recommendedTags.filter( (t) => {
                return !existingTagNames.includes(t.name);
            })
        };
    }
    handleAdd(value, e){
        e.preventDefault();
        this.props.addRecommendedTag(value);

    }
    render() {
        let recommendedTagsList = this.state.tags.map( (t, index) => {
            return <div className="ui fluid card">
                <div className="content">
                    <div className="header">
                        <a target="_blank" href={'/deckfamily/' + t.name} key={t.name} className="ui large tag label" tabIndex="0" aria-label={t.name}>
                            {t.name}
                        </a>
                    </div>
                </div>
                <div className="extra content">
                    <div className="ui two buttons">
                        <div className="ui basic green button" onClick={this.handleAdd.bind(this, t.name)}>Add</div>
                        <div className="ui basic red button">Dismiss</div>
                    </div>
                </div>
            </div>;
        });

        return (
            <div ref="suggestedTags">
                <div className="row">
                    <div className="sixteen wide column">
                        <h4 className="ui header">Recommended Tags</h4>
                    </div>
                </div>
                <br/>
                <div className="row">
                    <div className="row">
                        <div className="sixteen wide column">
                            <div className="ui four stackable cards">
                              {recommendedTagsList}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

RecommendedTags.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default RecommendedTags;
