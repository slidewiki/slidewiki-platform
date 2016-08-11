import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {NavLink, navigateAction} from 'fluxible-router';
import TranslationStore from '../../../stores/TranslationStore';
import TranslationList from './TranslationList';
import Error from '../../../components/Error/Error';

class TranslationPanel extends React.Component {
    componentDidMount() {
        this.enableDropdown();
    }
    componentDidUpdate(){
        this.enableDropdown();
    }
    enableDropdown(status) {
        let panelDIV = this.refs.translationPanel;
        $(panelDIV).find('.ui.selection.dropdown').dropdown({
            onChange: (value) => {
                this.context.executeAction(navigateAction, {
                    //todo: define how we are going to handle URIs for translations
                    url: '/deck/' + value
                });
            }
        });
    }
    render() {
        if(this.props.TranslationStore.error) {
            return (
                <div ref="translationPanel">
                    <Error error={this.props.TranslationStore.error} />
                </div>
            );
        }
        else {
            return (
                <div className="ui left aligned" ref="translationPanel">
                    <div className="ui fluid search selection dropdown">
                        <div className="default text">{this.props.TranslationStore.currentLang.lang}</div>
                        <i className="dropdown icon"></i>
                            <TranslationList items={this.props.TranslationStore.translations} />
                    </div>
                </div>
            );
        }
    }
}

TranslationPanel.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
TranslationPanel = connectToStores(TranslationPanel, [TranslationStore], (context, props) => {
    return {
        TranslationStore: context.getStore(TranslationStore).getState()
    };
});
export default TranslationPanel;
