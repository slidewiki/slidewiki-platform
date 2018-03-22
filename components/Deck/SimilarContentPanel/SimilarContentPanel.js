import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import SimilarContentStore from '../../../stores/SimilarContentStore';
import SimilarContentList from './SimilarContentList';
import {defineMessages} from 'react-intl';

class SimilarContentPanel extends React.Component {
    constructor(props){
        super(props);
        this.messages = defineMessages({
            panel_header:{
                id: 'similarContentPanel.panel_header',
                defaultMessage:'Recomended Decks'
            },
        });
    }
    render() {
        const panelDIVStyles = {
            maxHeight: this.props.maxHeight?this.props.maxHeight:800,
            overflowY: 'auto'
        };
        let header = this.props.inPanel?<h5 className="ui small header">
                                          <a href={'/similarcontent/' + this.props.SimilarContentStore.selector.stype + '/' + this.props.SimilarContentStore.selector.sid}>
                                            {this.context.intl.formatMessage(this.messages.panel_header)}
                                          </a>
                                        </h5>
                                        : <div className="ui secondary clearing segment">
                                            <h1 className="ui left floated header">
                                              {this.context.intl.formatMessage(this.messages.panel_header)}
                                            </h1>
                                          </div>;

        return (
            <div>
                {header}
                <div className="ui basic segment" style={panelDIVStyles}>
                        <SimilarContentList selector={this.props.SimilarContentStore.selector} items={this.props.SimilarContentStore.contents} />
                </div>

             </div>
        );
    }
}

SimilarContentPanel.contextTypes = {
    intl: React.PropTypes.object.isRequired
};
SimilarContentPanel = connectToStores(SimilarContentPanel, [SimilarContentStore], (context, props) => {
    return {
        SimilarContentStore: context.getStore(SimilarContentStore).getState()
    };
});
export default SimilarContentPanel;
