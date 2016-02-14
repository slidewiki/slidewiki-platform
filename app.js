import Fluxible from 'fluxible';
import fetchrPlugin from 'fluxible-plugin-fetchr';
import Application from './components/Application';
import ApplicationStore from './stores/ApplicationStore';
import RouteStore from './stores/RouteStore';
import ContributorsStore from './stores/ContributorsStore';
import ContentStore from './stores/ContentStore';
import DeckStore from './stores/DeckStore';
import SlideStore from './stores/SlideStore';

// create new fluxible instance & register all stores
const app = new Fluxible({
    component: Application,
    stores: [
        RouteStore,
        ApplicationStore,
        ContributorsStore,
        ContentStore,
        DeckStore,
        SlideStore
    ]
});

// register plugins
app.plug(fetchrPlugin({
    xhrPath: '/api' // Path for XHR to be served from
}));

module.exports = app;
