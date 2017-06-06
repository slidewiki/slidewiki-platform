import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import classNames from 'classnames';
import DeckTreeStore from '../../../stores/SlideViewStore';
import UserProfileStore from '../../../stores/UserProfileStore';
import PermissionsStore from '../../../stores/PermissionsStore';
import ContributorsPanel from '../ContentModulesPanel/ContributorsPanel/ContributorsPanel';
import ContributorsStore from '../../../stores/ContributorsStore';


class InfoPanel extends React.Component {

    render() {
        const rootNodeStyles = {
            fontSize: '1.06em'
        };



        return (
            <div className="ui panel" ref="infoPanel" >

                <div className="ui top attached tabular icon stackable fluid  menu">
                    <a className="active item">
                        <i className="large info circle blue icon"></i>Info
                    </a>
{/*
                <a className="item">
                        <i className="large remove bookmark blue icon"></i>Suggest
                    </a>
                    <a className="item">
                        <i className="large grid layout blue icon"></i>Design
                    </a>
                    */}
                </div>

                <div className="ui bottom attached active tab segment">
                    <div className="ui segment">
                        <h4 className="header item" >This is the slide title </h4>
                    </div>


                    <div className="ui segment">
                        <h4 className="header item" >Contributors </h4>
                    </div>
                    <div className="ui segment">
                        <h4 className="header item" >Activity feed</h4>
                    </div>
                    <div className="ui segment">
                        <div className="item" >
                            <div className="ui image">
                                <img alt="Creative Commons License"  src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png"  href="http://creativecommons.org/licenses/by-sa/4.0/" />
                            </div>

                            <div className="description">
                                <p>This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International License</a>.</p>                                
                            </div>  
                        </div>
                    </div>
                </div>
            </div>





        );
    }
}

InfoPanel.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default InfoPanel;
