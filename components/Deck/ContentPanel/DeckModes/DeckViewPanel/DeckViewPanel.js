import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import DeckViewStore from '../../../../../stores/DeckViewStore';
//import SlideThumbnail from '../../DeckModes/DeckViewPanel/SlideThumbnail';
import ThumbnailShow from '../../../../Thumbnail/ThumbnailShow';

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
        // Uncomment the below line if you want to test with sample tags
        //this.props.DeckViewStore.deckData.tags = ['linked data', 'information extraction', 'presentation'];

        const activeVersion = this.props.DeckViewStore.deckData.active;
        const totalRevisions = this.props.DeckViewStore.deckData.revisions.length;
        const deckTitle = this.props.DeckViewStore.deckData.revisions[activeVersion - 1].title;
        const deckDate = CustomDate.format(this.props.DeckViewStore.deckData.timestamp, 'Do MMMM YYYY');
        const deckDescription = this.props.DeckViewStore.deckData.description;
        const deckCreator = this.props.DeckViewStore.userData.username;
        const deckLanguageCode = this.props.DeckViewStore.deckData.language;
        let deckLanguage = ISO6391.getName(deckLanguageCode);
        deckLanguage = deckLanguage === '' && deckLanguageCode.substr(0, 2) === 'en'? 'English': deckLanguage;
        const totalSlides = this.props.DeckViewStore.slidesData.children.length;
        const maxSlideThumbnails = 4;

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
                                        <i className="fork icon" aria-label="Number of versions"></i>{totalRevisions}</div>
                                </div>
                                {this.props.DeckViewStore.deckData.tags.length > 0 ? <div className="ui divider"></div>: ''}
                                <div className="ui tag labels large meta">
                                    {this.props.DeckViewStore.deckData.tags.map((tag, index) => {
                                        return <a className="ui label" key={index} tabIndex="0" >{tag}</a>;
                                    })}
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="ui  divider"></div>
                    {this.props.DeckViewStore.slidesData.children.map((slide, index) => {
                        if (index < maxSlideThumbnails) {
                            return <ThumbnailShow key={index} slideId={slide.id}
                                                  slideTitle={slide.title}
                                                  slideContent={slide.content}
                                                  slideIndex={index}
                                                  totalSlides={totalSlides}
                            />;
                        }
                    })}
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
