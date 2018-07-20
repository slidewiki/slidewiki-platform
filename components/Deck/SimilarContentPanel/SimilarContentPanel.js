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
                defaultMessage:'Recommended Decks'
            },
            panel_loading:{
                id: 'similarContentPanel.panel_loading',
                defaultMessage:'Loading'
            }
        });
        this.state = {
            similarContents: this.props.SimilarContentStore.contents,
            selector: this.props.SimilarContentStore.selector

        };
    }
    componentWillReceiveProps(nextProps){

        this.setState({
            similarContents: nextProps.SimilarContentStore.contents,
            selector: nextProps.SimilarContentStore.selector

        });

    }
    render() {
        const panelDIVStyles = {
            maxHeight: this.props.maxHeight?this.props.maxHeight:'800px',
            minHeight: '80px',
            overflowY: 'auto'
        };
        let header = this.props.inPanel?<h5 className="ui small header">
                                          <a href={'/similarcontent/' + this.state.selector.stype + '/' + this.state.selector.sid}>
                                            {this.context.intl.formatMessage(this.messages.panel_header)}
                                          </a>
                                        </h5>
                                        : <div className="ui secondary clearing segment">
                                            <h1 className="ui left floated header">
                                              {this.context.intl.formatMessage(this.messages.panel_header)}
                                            </h1>
                                          </div>;

        let similarsPanel;
        if(this.state.similarContents.length === 0){ //loading
            similarsPanel = <div className="ui active inverted dimmer">
                                <div className="ui indeterminate text loader">{this.context.intl.formatMessage(this.messages.panel_loading)}</div>

                            </div>;
        }else{
            similarsPanel = <SimilarContentList selector={this.state.selector} items={this.state.similarContents}/>;

        }


        return (
            <div>
                {header}
                <div className="ui basic segment" style={panelDIVStyles}>
                   {similarsPanel}
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
