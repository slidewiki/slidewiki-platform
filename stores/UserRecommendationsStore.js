import {BaseStore} from 'fluxible/addons';

class UserRecommendationsStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.recommendations = undefined;
        this.loading = true;
    }
    showLoading(payload){
        this.loading = true;
        this.emitChange();
    }
    loadRecommendations(payload) {
        // format the results of the service
        this.recommendations = payload.recommendations.map( (deck) => {

            // get the active revision of the deck
            let activeRevision = deck.revisions[deck.revisions.length-1];
            return {
                deckID: deck._id,
                title: activeRevision.title,
                firstSlide: activeRevision.firstSlide,
                theme: activeRevision.theme,
                updated: deck.lastUpdate,
                description: deck.description,
                creationDate: deck.timestamp,
                noOfLikes: deck.noOfLikes,
                recommendationWeight: deck.recommendationWeight
            };
        });

      // remove user owned decks?


        this.loading = false;

        this.emitChange();
    }
    getState() {
        return {
            recommendations: this.recommendations,
            loading: this.loading
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.recommendations = state.recommendations;
        this.loading = state.loading;
    }
}

UserRecommendationsStore.storeName = 'UserRecommendationsStore';
UserRecommendationsStore.handlers = {
    'LOAD_USER_RECOMMENDATIONS_SUCCESS': 'loadRecommendations',
    'SHOW_RECOMMENDATIONS_LOADING': 'showLoading'
};

export default UserRecommendationsStore;
