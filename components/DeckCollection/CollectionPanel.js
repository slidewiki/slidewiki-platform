import React from 'react';
import {NavLink, navigateAction} from 'fluxible-router';
import DeckCollectionStore from '../../stores/DeckCollectionStore';
import { connectToStores } from 'fluxible-addons-react';
import PopularDecks from '../User/UserProfile/PopularDecks';
import CustomDate from '../Deck/util/CustomDate';
import CollectionDecks from './CollectionDecks';

class CollectionPanel extends React.Component {
    constructor(props){
        super(props);
        this.sortBy = '3';
    }
    componentDidMount() {
        $(this.refs.sortDropdown).dropdown({onChange: this.dropdownSelect.bind(this)});
    }

    componentDidUpdate() {}

    dropdownSelect(value) {
        this.sortBy = value;
        this.forceUpdate();
    }
    loadMore(){
        context.executeAction(loadMoreDeckFamily, {
            params: {
                tag: this.props.DeckFamilyStore.tag
            },
            page: this.props.DeckFamilyStore.page + 1
        });
    }
    render() {

        let data = this.props.DeckCollectionStore.collectionDetails;
        let content = '';

        return (
            <div className = "ui vertically padded stackable grid container" >
                <div className = "four wide column" >
                    <div>
                        <h2>{data.title}</h2>
                        <h4>{data.description}</h4>
                        <div className = "ui divider" />
                            <b>Creator:</b> <NavLink href={`/user/${data.user.username}`}>{data.user.username}</NavLink><br/>
                            <b>Date:</b> {CustomDate.format(data.timestamp, 'Do MMMM YYYY')}<br/>

                        <div className = "ui divider" />
                    </div>
                </div>
                <div className = "twelve wide column" >
                    <div className="ui segments">
                        {(data === undefined) ? <div className="ui active dimmer"><div className="ui text loader">Loading</div></div> : ''}
                        <div className="ui secondary clearing segment">
                            <h2 className="ui left floated header">Decks</h2>
                            <div className="ui right floated pointing labeled icon dropdown button" ref="sortDropdown">
                                <i className="icon exchange"/>
                                <div className="text">First Added</div>
                                <div className="menu">
                                    <div className="item active selected" data-value={3}>First Added</div>
                                    <div className="item" data-value={2}>Last updated</div>
                                    <div className="item" data-value={1}>Creation date</div>
                                    <div className="item" data-value={0}>Title</div>
                                </div>
                            </div>
                        </div>
                        <div className="ui segment">
                            <CollectionDecks size={0} decks={data.decks} sort={this.sortBy}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

CollectionPanel.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

CollectionPanel = connectToStores(CollectionPanel, [DeckCollectionStore], (context, props) => {
    return {
        DeckCollectionStore: context.getStore(DeckCollectionStore).getState(),
    };
});

export default CollectionPanel;
