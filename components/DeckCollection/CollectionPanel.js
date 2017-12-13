import React from 'react';
import {NavLink, navigateAction} from 'fluxible-router';
import DeckCollectionStore from '../../stores/DeckCollectionStore';
import { connectToStores } from 'fluxible-addons-react';
import CustomDate from '../Deck/util/CustomDate';
import CollectionDecks from './CollectionDecks';
import CollectionDecksReorder from './CollectionDecksReorder';
import {Button, Icon} from 'semantic-ui-react';

class CollectionPanel extends React.Component {
    constructor(props){
        super(props);
        this.sortBy = '3';
        this.state = {
            editMode: false, 
            decksOrder: this.props.DeckCollectionStore.collectionDetails.decks || []
        };
    }
    componentDidMount() {
        $(this.refs.sortDropdown).dropdown({onChange: this.dropdownSelect.bind(this)});
    }

    componentDidUpdate() {
        $(this.refs.sortDropdown).dropdown({onChange: this.dropdownSelect.bind(this)});
    }

    dropdownSelect(value) {
        this.sortBy = value;
        this.forceUpdate();
    }
    setEditMode(value){
        this.setState({
            editMode: value
        });
    }
    handleSaveDeckOrder(){
        console.log('save order');
        console.log(this.state.decksOrder);
    }
    handleMoveUp(index){
        let newState = Object.assign({}, this.state);
        let tmp = newState.decksOrder[index];
        newState.decksOrder[index] = newState.decksOrder[index - 1];
        newState.decksOrder[index - 1] = tmp;
        this.setState(newState);
    }
    handleMoveDown(index){
        let newState = Object.assign({}, this.state);
        let tmp = newState.decksOrder[index];
        newState.decksOrder[index] = newState.decksOrder[index + 1];
        newState.decksOrder[index + 1] = tmp;
        this.setState(newState);
    }
    render() {

        let data = this.props.DeckCollectionStore.collectionDetails;
        let content = (!this.state.editMode) 
        ? <CollectionDecks size={0} decks={data.decks} sort={this.sortBy}/>
        : <CollectionDecksReorder size={0} decks={this.state.decksOrder} moveUp={this.handleMoveUp.bind(this)} moveDown={this.handleMoveDown.bind(this)} />;

        return (
            <div className = "ui vertically padded stackable grid container" >
                <div className = "four wide column" >
                    <div>
                        <h3>Collection</h3>
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
                            <h2 className="ui left floated header">{ (!this.state.editMode) ? 'Decks in collection' : 'Reorder Decks'}</h2>
                            { (!this.state.editMode && data.decks.length > 0) && 
                                <div className="ui small button" onClick={this.setEditMode.bind(this, true)}>
                                    Reorder Decks
                                </div>
                            }
                            { (this.state.editMode) && 
                                <div className="ui right floated">
                                    <Button primary size='small' as='button' onClick={this.handleSaveDeckOrder.bind(this)}><Icon name='save'/>Save</Button>
                                    <Button as='button' size='small' onClick={this.setEditMode.bind(this, false)}><Icon name='close'/>Close</Button>
                                </div>
                            }
                            { (!this.state.editMode) && 
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
                            }
                        </div>
                        <div className="ui segment">
                            {content}
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
