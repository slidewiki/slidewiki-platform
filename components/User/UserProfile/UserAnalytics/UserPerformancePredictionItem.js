import React from 'react';
import { NavLink } from 'fluxible-router';
import {formatDate} from '../../../Deck/ActivityFeedPanel/util/ActivityFeedUtil';
import { Microservices } from '../../../../configs/microservices';
import Thumbnail from '../../../common/Thumbnail';
import deletePerformancePredictionJob from '../../../../actions/analytics/deletePerformancePredictionJob';

class UserPerformancePredictionItem extends React.Component {
    componentDidUpdate() {
        $('#progressbar_result' + this.props.index).progress('set percent', this.props.prediction.result);
    }
    componentDidMount() {
        $('#progressbar_result' + this.props.index).progress('set percent', this.props.prediction.result);
    }

    handleDeletePrediction() {
        swal({
            title: 'Delete prediction',
            text: 'Are you sure you want to delete this prediction?',
            type: 'warning',
            showCloseButton: false,
            showCancelButton: true,
            allowEscapeKey: true,
            showConfirmButton: true
        })
        .then(() => {
            this.context.executeAction(deletePerformancePredictionJob, this.props.prediction);
        }, (reason) => { // canceled
        });
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
        const resultProgress = (prediction.result === undefined) ? '' :
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

            additionalInfo = ((prediction.accuracy < 0) ? '' : ((prediction.noOfDecks === 0 && prediction.noOfUsers === 0) ? 'Prediction is based on DEMO DATA' : 'Prediction is based on data for ' + prediction.noOfDecks + ' decks and ' + prediction.noOfUsers + ' users') + '; calculation lasted ' + duration);
        }

        return (
            <div className="accordionItem">
                <div className="title">
                    <i className="dropdown icon"></i>
                    <div className="ui vertical segment" >
                        <div className="ui grid">
                            <div className="five wide column ui header">
                                {prediction.title}
                            </div>
                            <div className="four wide column">
                                {(prediction.finished) ? 'Executed ' : 'Started '}
                                {formatDate(prediction.started)}
                            </div>
                            <div className="three wide column">
                                {(prediction.result !== undefined) ? 'Predicted result: ' + Math.round(prediction.result * 100) / 100  + ' %': ''}
                            </div>
                            <div className="four wide column">
                                {resultProgress}
                                {(prediction.accuracy < 0) ? 'Prediction was not possible due to insufficient data' : ''} 
                            </div>

                        </div>
                    </div>
                </div>
                <div className="content">
                    <div className="ui grid">
                        <div className="nine wide column">
                            <NavLink className="ui medium centered spaced image" aria-hidden={'true'} tabIndex={'-1'} href={'/deck/' + prediction.deckId}>
                                {(prediction.deckId) ? 'Deck id: ' + prediction.deckId : ''}
                                {thumbnail}
                            </NavLink>
                        </div>
                        <div className="five wide column">
                            {additionalInfo}
                        </div>
                        <div className="right aligned column">
                            {(prediction.id !== undefined) ? (
                                <div>
                                    <button className="ui basic icon button" data-tooltip='Delete prediction job' aria-label='Delete prediction job' onClick={this.handleDeletePrediction.bind(this)} >
                                        <i className="remove icon" name={'deletePrediction_' + prediction.id} ></i>
                                    </button>
                                </div>
                            ) : ''}
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
