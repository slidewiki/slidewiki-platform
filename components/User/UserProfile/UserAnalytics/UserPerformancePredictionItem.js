import React from 'react';
import {List, Icon, Button} from 'semantic-ui-react';
import { NavLink } from 'fluxible-router';
import {formatDate} from '../../../Deck/ActivityFeedPanel/util/ActivityFeedUtil';
import { Microservices } from '../../../../configs/microservices';
import Thumbnail from '../../../common/Thumbnail';

class UserpPerformancePredictionItem extends React.Component {

    render() {
        const prediction = this.props.prediction;
        const resultIcons = (!prediction.result) ? '' :
            (prediction.result < 50) ? (
                <div className="ui raised compact segment">
                    <i className="icon certificate big red"/>
                    <i className="icon circle outline large yellow"/>
                    <i className="icon circle outline large green"/>
                </div>
            ) : (prediction.result < 80) ? (
                <div className="ui raised compact segment">
                    <i className="icon circle outline large red"/>
                    <i className="icon certificate big yellow"/>
                    <i className="icon circle outline large green"/>
                </div>
            ) : (
                <div className="ui raised compact segment">
                    <i className="icon circle outline large red"/>
                    <i className="icon circle outline large yellow"/>
                    <i className="icon certificate big green"/>
                </div>
            );
        let thumbnailURL = `${Microservices.file.uri}/thumbnail/slide/`;
        if (prediction.deckFirstSlide) {
            thumbnailURL += prediction.deckFirstSlide;
            if (prediction.deckTheme) {
                thumbnailURL += '/' + prediction.deckTheme;
            }
        } else {
            thumbnailURL = '';
        }

        let duration = '';
        let msPerMinute = 60 * 1000;
        let elapsed = new Date(prediction.finished).getTime() - new Date(prediction.started).getTime();
        if (elapsed < msPerMinute) {
            duration = Math.round(elapsed/1000) + ' seconds';
        } else{
            duration = Math.round(elapsed/msPerMinute) + ' minutes';
        }
        return (
            <div className="accordionItem">
                <div className="title">
                    <i className="dropdown icon"></i>
                    <div className="ui vertical segment" >
                        <div className="ui grid">

                            <div className="four wide column ui header">
                                {prediction.title}
                            </div>
                            <div className="four wide column">
                                {(prediction.finished) ? 'Executed ' : 'Started '}
                                {formatDate(prediction.started)}
                            </div>
                            <div className="four wide column">
                                {(prediction.result) ? 'Predicted result: ' + Math.round(prediction.result * 100) / 100 : ''}
                            </div>
                            <div className="three wide column">
                                {resultIcons}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="content">
                    <div className="ui grid">
                        <div className="four wide column">
                            {(prediction.deckId) ? 'Deck id: ' + prediction.deckId : ''}
                            <NavLink className="ui medium centered spaced image" aria-hidden={'true'}  tabIndex={'-1'} href={'/deck/' + prediction.deckId}>
                                <Thumbnail url={thumbnailURL} alt={''}
                                    slideId={prediction.deckId} />
                            </NavLink>
                        </div>
                        <div className="four wide column">
                            {(prediction.started) ? 'Started: ' + prediction.started : ''}
                        </div>
                        <div className="four wide column">
                            {(prediction.finished) ? 'Duration: ' + duration : ''}
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}
UserpPerformancePredictionItem.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default UserpPerformancePredictionItem;
