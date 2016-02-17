import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import TranslationStore from '../../../stores/TranslationStore';

class TranslationPanel extends React.Component {
    render() {
        return (
            <div className="ui center aligned segment" ref="translationPanel">
                Language: <a href={'/translations/deck/' + this.props.TranslationStore.currentLang.id}><b>{this.props.TranslationStore.currentLang.lang}</b></a>
             </div>
        );
    }
}

TranslationPanel = connectToStores(TranslationPanel, [TranslationStore], (context, props) => {
    return {
        TranslationStore: context.getStore(TranslationStore).getState()
    };
});
export default TranslationPanel;
