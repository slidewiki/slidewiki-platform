import React from 'react';
import {NavLink, navigateAction} from 'fluxible-router';
//import classNames from 'classnames/bind';
import {connectToStores} from 'fluxible-addons-react';
//import DeckTreeStore from '../../../stores/SlideViewStore';
//import UserProfileStore from '../../../stores/UserProfileStore';
//import PermissionsStore from '../../../stores/PermissionsStore';



class InfoPanelHeader extends React.Component {
    handleInfoClick(){

    }

    handleDesignClick(){

    }

    render(){
        return (
            <div className="ui top attached tabular menu">
                <a className="active item">
                    <i className="large info circle icon"></i>Info
                </a>
                {/* <NavLink className="item" href="#" onClick={this.handleDesignClick.bind(this)}>
                  <i className="very large grid layout icon"></i>Design
              </NavLink> */}
            </div>

        );
    }
}

//InfoPanelHeader = connectToStores(InfoPanelHeader, [DeckTreeStore, UserProfileStore, PermissionsStore], (context, props) => {
InfoPanelHeader = connectToStores(InfoPanelHeader, [], (context, props) => {
    return {
        //DeckTreeStore: context.getStore(DeckTreeStore).getState(),
        //UserProfileStore: context.getStore(UserProfileStore).getState(),
        //PermissionsStore: context.getStore(PermissionsStore).getState()
    };
});
export default InfoPanelHeader;
