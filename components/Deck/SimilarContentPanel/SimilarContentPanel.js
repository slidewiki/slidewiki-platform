import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import SimilarContentStore from '../../../stores/SimilarContentStore';
import SimilarContentList from './SimilarContentList';

class SimilarContentPanel extends React.Component {
    render() {
        return (
            <div ref="similarContentPanel">
                <div className="ui segments">
                    <div className="ui secondary segment">
                        <a href={'/similarcontent/' + this.props.SimilarContentStore.selector.stype + '/' + this.props.SimilarContentStore.selector.sid}>Recommended</a>
                    </div>
                    <div className="ui segment">
                        <SimilarContentList selector={this.props.SimilarContentStore.selector} items={this.props.SimilarContentStore.contents} />
                    </div>
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
