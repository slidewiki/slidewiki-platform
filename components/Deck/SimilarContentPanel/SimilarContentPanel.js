import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import SimilarContentStore from '../../../stores/SimilarContentStore';
import SimilarContentList from './SimilarContentList';

class SimilarContentPanel extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        const panelDIVStyles = {
            maxHeight: this.props.maxHeight?this.props.maxHeight:800,
            overflowY: 'auto'
        };

        return (
            <div>
                <h5 className="ui small header">
                  <a href={'/similarcontent/' + this.props.SimilarContentStore.selector.stype + '/' + this.props.SimilarContentStore.selector.sid}>
                   Recomended Decks
                  </a>
                </h5>
                <div className="ui basic segment" style={panelDIVStyles}>
                        <SimilarContentList selector={this.props.SimilarContentStore.selector} items={this.props.SimilarContentStore.contents} />
                </div>

             </div>
        );
    }
}
SimilarContentPanel = connectToStores(SimilarContentPanel, [SimilarContentStore], (context, props) => {
    return {
        SimilarContentStore: context.getStore(SimilarContentStore).getState()
    };
});
export default SimilarContentPanel;
