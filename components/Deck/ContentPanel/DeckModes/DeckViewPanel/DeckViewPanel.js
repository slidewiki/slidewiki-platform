import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import DeckViewStore from '../../../../../stores/DeckViewStore';
import SlideThumbnail from '../../DeckModes/DeckViewPanel/SlideThumbnail';
import CustomDate from '../../../util/CustomDate';
let ISO6391 = require('iso-639-1');

class DeckViewPanel extends React.Component {
    render() {
        const heightStyle = {
            height: '450px'
        };
        const bottomTabularMenu = {
            background: '#DCDDDE'
        };
        const bottomTabularMenuOutline = {
            outline: 'none'
        };
        const transitionDuration = {
            transitionDuration: '300ms',
            width: '9%'
        };
        let deckTags = [];

        const activeVersion = this.props.DeckViewStore.deckData.active;
        const deckTitle = this.props.DeckViewStore.deckData.revisions[activeVersion - 1].title;
        const deckDate = CustomDate.format(this.props.DeckViewStore.deckData.timestamp, 'Do MMMM YYYY');
        const deckDescription = this.props.DeckViewStore.deckData.description;
        const deckCreator = this.props.DeckViewStore.userData.username;
        const deckLanguageCode = this.props.DeckViewStore.deckData.language;
        const deckLanguage = ISO6391.getName(deckLanguageCode);
        const totalSlides = this.props.DeckViewStore.slidesData.children.length;
        const maxSlideThumbnails = 4;

        // TODO remove hard coded tags before submtting pull request.
        this.props.DeckViewStore.deckData.tags = ['linked data', 'information extraction', 'presentation'];

        return (
            <div ref="deckViewPanel" className="ui container bottom attached" style={heightStyle}>
                <div className="ui segment" style={heightStyle}>
                    <div className="ui two column grid container">

                        <div className="column">
                            <div className="content">
                                <h3 className="ui header">{deckTitle}</h3>
                                <div className="meta">Creator: {deckCreator}</div>
                                <div className="meta">Date: {deckDate}</div>
                                <div className="description">
                                    <p></p>
                                    <p>{deckDescription}</p>
                                </div>

                            </div>
                        </div>

                        <div className="column">

                            <div className="content">
                                <div className="ui hidden divider"></div>
                                <div className="meta">
                                    <div className="ui large label" >
                                        <i className="gb flag" aria-label="Language"></i>{deckLanguage}</div>
                                    <div className="ui large label" tabIndex="0" >
                                        <i className="block layout icon" aria-label="Number of slides"></i>{totalSlides}</div>
                                    <div className="ui large label" tabIndex="0" >
                                        <i className="theme icon" aria-label="Theme"></i>Simple</div>
                                    <div className="ui large label" tabIndex="0" >
                                        <i className="fork icon" aria-label="Number of versions"></i>5</div>
                                </div>
                                {this.props.DeckViewStore.deckData.tags.length > 0 ? <div className="ui divider"></div>: ''}
                                <div className="ui tag labels large meta">
                                    {this.props.DeckViewStore.deckData.tags.map((tag) => {
                                        return <a className="ui label" tabIndex="0" >{tag}</a>;
                                    })}
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="ui  divider"></div>
                    <SlideThumbnail slidesData={this.props.DeckViewStore.slidesData} maxSlideThumbnails={maxSlideThumbnails} />
                </div>
            </div>

        );
    }
}

DeckViewPanel = connectToStores(DeckViewPanel, [DeckViewStore], (context, props) => {
    return {
        DeckViewStore: context.getStore(DeckViewStore).getState()
    };
});
export default DeckViewPanel;
