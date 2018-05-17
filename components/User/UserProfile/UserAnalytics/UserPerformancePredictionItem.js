import React from 'react';
import { NavLink } from 'fluxible-router';
import {formatDate} from '../../../Deck/ActivityFeedPanel/util/ActivityFeedUtil';
import { Microservices } from '../../../../configs/microservices';
import Thumbnail from '../../../common/Thumbnail';

class UserPerformancePredictionItem extends React.Component {
    componentDidUpdate() {
        $('#progressbar_result' + this.props.index).progress('set percent', this.props.prediction.result);
    }
    componentDidMount() {
        $('#progressbar_result' + this.props.index).progress('set percent', this.props.prediction.result);
    }

    render() {
        const prediction = this.props.prediction;
        // const resultIcons = (!prediction.result) ? '' :
        //     (prediction.result < 50) ? (
        //         <div className="ui raised compact segment">
        //             <i className="icon certificate big red"/>
        //             <i className="icon circle outline large yellow"/>
        //             <i className="icon circle outline large green"/>
        //         </div>
        //     ) : (prediction.result < 80) ? (
        //         <div className="ui raised compact segment">
        //             <i className="icon circle outline large red"/>
        //             <i className="icon certificate big yellow"/>
        //             <i className="icon circle outline large green"/>
        //         </div>
        //     ) : (
        //         <div className="ui raised compact segment">
        //             <i className="icon circle outline large red"/>
        //             <i className="icon circle outline large yellow"/>
        //             <i className="icon certificate big green"/>
        //         </div>
        //     );
        const progressBarId = 'progressbar_result' + this.props.index;
        const resultProgress = (!prediction.result) ? '' :
            (
                <div className="ui indicating progress" ref="div_progress" id={progressBarId} role="progressbar" data-value={prediction.result} data-total="100" aria-valuenow={prediction.result} aria-valuemin="0" aria-valuemax="100" tabIndex="0">
                    <div className="bar"><div className="progress" /></div>
                </div>
            );
        let thumbnail = '';
        if (prediction.deckFirstSlide) {
            let thumbnailURL = `${Microservices.file.uri}/thumbnail/slide/` + prediction.deckFirstSlide;
            if (prediction.deckTheme) {
                thumbnailURL += '/' + prediction.deckTheme;
            }
            thumbnail = (
                <Thumbnail url={thumbnailURL} alt={''} slideId={prediction.deckId} />
            );
        }

        let additionalInfo = '';
        if (prediction.finished) {
            let duration = '';
            let msPerMinute = 60 * 1000;
            let elapsed = new Date(prediction.finished).getTime() - new Date(prediction.started).getTime();
            if (elapsed < msPerMinute) {
                duration = Math.round(elapsed/1000) + ' seconds';
            } else{
                duration = Math.round(elapsed/msPerMinute) + ' minutes';
            }

            additionalInfo = 'Prediction is based on data for 30 decks and 55 users; calculation lasted ' + duration;
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
                                {(prediction.result) ? 'Predicted result: ' + Math.round(prediction.result * 100) / 100  + ' %': ''}
                            </div>
                            <div className="four wide column">
                                {resultProgress}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="content">
                    <div className="ui grid">
                        <div className="eight wide column">
                            <NavLink className="ui medium centered spaced image" aria-hidden={'true'} tabIndex={'-1'} href={'/deck/' + prediction.deckId}>
                                {(prediction.deckId) ? 'Deck id: ' + prediction.deckId : ''}
                                {thumbnail}
                            </NavLink>
                        </div>
                        <div className="eight wide column">
                            {additionalInfo}
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

UserPerformancePredictionItem.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default UserPerformancePredictionItem;
