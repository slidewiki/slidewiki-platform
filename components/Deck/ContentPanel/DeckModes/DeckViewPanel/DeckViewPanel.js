import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import DeckViewStore from '../../../../../stores/DeckViewStore';
import SlideThumbnail from '../../DeckModes/DeckViewPanel/SlideThumbnail';
import CustomDate from '../../../util/CustomDate';

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
        let slideThumbnail = [];
        //for (let i=0; i < 1; i++) {
    //        slideThumbnail.push(<SlideThumbnail />);
//        }
        const activeVersion = this.props.DeckViewStore.deckData.active;
        const deckTitle = this.props.DeckViewStore.deckData.revisions[activeVersion - 1].title;
        const deckDate = CustomDate.format(this.props.DeckViewStore.deckData.timestamp, 'Do MMMM YYYY');
        const deckDescription = this.props.DeckViewStore.deckData.description;
        const deckCreator = this.props.DeckViewStore.userData.username;

        return (
            /*
            <div ref="deckViewPanel" className="ui bottom attached segment">
                <div dangerouslySetInnerHTML={{__html:this.props.DeckViewStore.content}} />
            </div>
            */
            <div ref="deckViewPanel" className="ui container bottom attached" style={heightStyle}>
                Below is the content:
                <div className="ui segment" style={heightStyle}>
                    <div className="ui two column grid container">

                        <div className="column">
                            <div className="content">
                                <h3 className="ui header">{deckTitle}</h3>
                                <div className="meta">Creater: {deckCreator}</div>
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
                                        <i className="gb flag" aria-label="Language"></i>English</div>
                                    <div className="ui large label" tabIndex="0" >
                                        <i className="block layout icon" aria-label="Number of slides"></i>23</div>
                                    <div className="ui large label" tabIndex="0" >
                                        <i className="theme icon" aria-label="Theme"></i>Simple</div>
                                    <div className="ui large label" tabIndex="0" >
                                        <i className="fork icon" aria-label="Number of versions"></i>5</div>
                                </div>
                                <div className="ui  divider"></div>
                                <div className="meta">
                                    <div className="ui tag labels large">
                                        <a className="ui label" tabIndex="0" >elearning</a>
                                        <a className="ui label" tabIndex="0" >semantic</a>
                                        <a className="ui label" tabIndex="0">presentation</a>
                                        <a className="ui label" tabIndex="0">skills</a>
                                        <a className="ui label" tabIndex="0">school</a>

                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
                    <div className="ui  divider"></div>

                    <div className="ui four column grid container">
                        //<SlideThumbnail />
                    </div>
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
