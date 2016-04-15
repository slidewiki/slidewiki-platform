import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import TranslationStore from '../../../stores/TranslationStore';
import TranslationList from './TranslationList';

class TranslationPanel extends React.Component {
    render() {
        return (
            <div className="ui left aligned segment" ref="translationPanel">
                Language: <a href={'/translations/deck/' + this.props.TranslationStore.currentLang.id}><b>{this.props.TranslationStore.currentLang.lang}</b></a>
                <br />
                <div className="translation-div">Translations:</div>
                <div className="translation-div"><TranslationList items={this.props.TranslationStore.translations} /></div>
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
