import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import DeckTreeStore from '../../../stores/DeckTreeStore';
class PresentationSlide extends React.Component {


}

PresentationSlide = connectToStores(PresentationSlide, [DeckTreeStore], (context, props) => {
    return {
        DeckTreeStore: context.getStore(DeckTreeStore).getState()
    };
});


export default PresentationSlide;
