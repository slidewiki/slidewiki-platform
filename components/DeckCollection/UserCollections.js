import React from 'react';
import {NavLink, navigateAction} from 'fluxible-router';
import DeckCollectionStore from '../../stores/DeckCollectionStore';
import deleteCollection from '../../actions/collections/deleteCollection';
import { connectToStores } from 'fluxible-addons-react';


class UserCollections extends React.Component {
    constructor(props){
        super(props);

        this.styles = {'backgroundColor': '#2185D0', 'color': 'white'};
    }

    componentWillReceiveProps(nextProps) {
        // if (nextProps.error.action !== undefined && this.props.error === '') {
        //     let message = 'Error while deleting the group: ';
        //     if (nextProps.error.action === 'leave')
        //         message = 'Error while leaving the group: ';
        //     swal({
        //         title: 'Error',
        //         text: message + nextProps.error.message,
        //         type: 'error',
        //         confirmButtonText: 'Close',
        //         confirmButtonClass: 'negative ui button',
        //         allowEscapeKey: false,
        //         allowOutsideClick: false,
        //         buttonsStyling: false
        //     })
        //     .then(() => {
        //         this.context.executeAction(updateUsergroup, {group: {}, offline: true});

        //         return true;
        //     })
        //     .catch();
        //     return;
        // }
    }

    handleClickOnEditGroup(e) {
        // e.preventDefault();
        // console.log('handleClickOnEditGroup:', e.target.attributes.name.nodeValue);

        // const action = e.target.attributes.name.nodeValue;  //eg. changeGroup_2
        // const groupid = action.split('_')[1];

        // let group = this.props.groups.find((group) => {
        //     return group._id.toString() === groupid;
        // });

        // console.log('handleClickOnEditGroup: use group', group);

        // this.context.executeAction(updateUsergroup, {group: group, offline: false});

        // this.context.executeAction(navigateAction, {
        //     url: '/user/' + this.props.username + '/groups/edit'
        // });
    }

    handleDeleteCollection(colId) {
        this.context.executeAction(deleteCollection, {
            id: colId
        });
    }

    handleCLickNewGroup(e) {
        // e.preventDefault();
        // this.context.executeAction(updateUsergroup, {group: {}, offline: true});
        // this.context.executeAction(navigateAction, {
        //     url: '/user/' + this.props.username + '/groups/edit'
        // });
    }

    showErrorPopup(text){
        swal({
            title: 'Error',
            text: text,
            type: 'error',
            timer: 2000,
            showCloseButton: false,
            showCancelButton: false,
            allowEscapeKey: false,
            showConfirmButton: false
        })
        .then(() => {/* Confirmed */}, (reason) => {/* Canceled */});
    }

    render() {
        let content = '';
        let loadingDiv = '';
        let collections = this.props.DeckCollectionStore.collections;

        // error loading deck collections
        if(this.props.DeckCollectionStore.updateCollectionsError){
            content = (
                <h3>An error occurred while fetching deck collections. Please try again later.</h3>
            );
        
        } else if(this.props.DeckCollectionStore.deleteDeckCollectionError){
            this.showErrorPopup('An error occurred while deleting collection...');
        }
        
        // just show loading indicator
        if (collections === undefined){
            loadingDiv = (this.props.DeckCollectionStore.loading) ? <div className="ui active dimmer"><div className="ui text loader">Loading</div></div> : '';

        // collections is undefined when loading indicator is shown
        } else {

            if(collections.documents.length === 0){
                content = (
                    <center><h3>No deck collections available</h3></center>
                );
            } else {

                content = collections.documents.map( (col) => {
                    return (
                        <div key={col._id} className="ui vertical segment">
                            <div className="ui two column stackable grid container">
                                <div className="column">
                                    <div className="ui header"><h3><NavLink href={`/collection/${col._id}`}>{col.title}</NavLink></h3></div>
                                    <div className="meta">{col.description} {(col.description) ? '\u00b7' : ''} {col.decks.length} deck{((col.decks.length) !== 1) ? 's': ''} {(col.userGroup) ? '\u00b7' : ''} {(col.userGroup) ? <i className="users icon" title="Shared Collection"></i> : ''}</div>
                                </div>

                                <div className="right aligned column">
                                    {(this.props.loggedinUserId === col.user) ? (
                                      <div>
                                          <button className="ui large basic icon button" data-tooltip="Delete Collection" aria-label="Delete Collection" onClick={this.handleDeleteCollection.bind(this, col._id)} >
                                              <i className="remove icon" name={'deleteCollection_' + col._id} ></i>
                                          </button>
                                          <button className="ui large basic icon button" data-tooltip="Collection Settings" aria-label="Collection Settings" name={col._id} onClick={this.handleClickOnEditGroup.bind(this)} >
                                              <i className="setting icon" name={'editCollection' + col._id} ></i>
                                          </button>
                                      </div>
                                    ) : ''}
                                </div>
                            </div>
                        </div>
                    );
                });
            }
        }
        return (
            <div className="ui segments">
                {loadingDiv}
                <div className="ui secondary clearing segment">
                    <h2 className="ui left floated header">{(this.props.loggedinuser === this.props.user.uname) ? 'My Deck Collections' : 'Owned Deck Collections' }</h2>
                    <button className="ui right floated button" role="button" tabIndex="0" onClick={this.handleCLickNewGroup.bind(this)}>
                      <p>Create new collection</p>
                    </button>
                </div>
                <div className="ui vertical segment">
                    {content}
                </div>
            </div>
        );
    }
}

UserCollections.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

UserCollections = connectToStores(UserCollections, [DeckCollectionStore], (context, props) => {
    return {
        DeckCollectionStore: context.getStore(DeckCollectionStore).getState(),
    };
});

export default UserCollections;
