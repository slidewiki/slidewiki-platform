import {BaseStore} from 'fluxible/addons';

class UserPerformancePredictionsStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.predictions = undefined;
        this.loading = true;
    }
    showLoading(){
        this.loading = true;
        this.emitChange();
    }
    loadPredictions(payload) {
        this.predictions = payload.predictions;
        this.loading = false;
        this.emitChange();
    }
    addPredictionJob(payload) {
        this.predictions.unshift(payload.prediction);//add to the beginning
        // this.showAddBox = false;
        this.emitChange();
    }
    performancePredictionCompleted(payload) {
        if (payload.predictions && payload.predictions.length > 0) {
            const newPrediction = payload.predictions[0];
            let index = this.predictions.findIndex((prediction) => {return (prediction.id === newPrediction.relatedPredictionActivityId);});
            if (index !== -1) {
                this.predictions[index].finished = newPrediction.finished;
                this.predictions[index].result = newPrediction.result;
                this.predictions[index].accuracy = newPrediction.accuracy;
                this.predictions[index].noOfUsers = newPrediction.noOfUsers;
                this.predictions[index].noOfDecks = newPrediction.noOfDecks;
            }
            this.emitChange();
        }
    }
    deletePredictionJob(payload) {
        let index = this.predictions.findIndex((prediction) => {return (prediction.id === payload.id);});
        if (index !== -1) {
            this.predictions.splice(index, 1);
        }
        this.emitChange();
    }
    getState() {
        return {
            predictions: this.predictions,
            loading: this.loading
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.predictions = state.predictions;
        this.loading = state.loading;
    }
}

UserPerformancePredictionsStore.storeName = 'UserPerformancePredictionsStore';
UserPerformancePredictionsStore.handlers = {
    'LOAD_USER_PERFORMANCE_PREDICTIONS_SUCCESS': 'loadPredictions',
    'SHOW_PERFORMANCE_PREDICTIONS_LOADING': 'showLoading',
    'ADD_PERFORMANCE_PREDICTION_SUCCESS': 'addPredictionJob',
    'DELETE_PERFORMANCE_PREDICTION_SUCCESS': 'deletePredictionJob',
    'PERFORMANCE_PREDICTION_COMPLETED': 'performancePredictionCompleted'
};

export default UserPerformancePredictionsStore;
