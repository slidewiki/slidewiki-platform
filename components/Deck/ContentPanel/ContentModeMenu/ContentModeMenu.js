import React from 'react';
import {NavLink} from 'fluxible-router';

class ContentModeMenu extends React.Component {
    render() {
        let contextPath = '', positionPath = '';
        if(this.props.ContentStore.contextID){
            //when it is in the deck page
            contextPath = '/deck/' + this.props.ContentStore.contextID;
            //handle it when a position is given
            if(this.props.ContentStore.contextPosition){
                positionPath =  '/' + this.props.ContentStore.contextPosition;
            }
        }else{
            //when loaded independently
            contextPath = '/content';
        }
        return (
            <div className="sw-content-panel" ref="contentModeMenu">
                <div className="ui top attached tabular menu">
                    <NavLink className={'item' + (this.props.ContentStore.mode === 'view' ? ' active' : '')} href={contextPath + '/' + this.props.ContentStore.contentType + '/' + this.props.ContentStore.contentID + positionPath + '/view'}>
                        View
                    </NavLink>
                    <NavLink className={'item' + (this.props.ContentStore.mode === 'edit' ? ' active' : '')} href={contextPath + '/' + this.props.ContentStore.contentType + '/' + this.props.ContentStore.contentID + positionPath + '/edit'}>
                        Edit
                    </NavLink>
                    <NavLink className={'item' + (this.props.ContentStore.mode === 'questions' ? ' active' : '')} href={contextPath + '/' + this.props.ContentStore.contentType + '/' + this.props.ContentStore.contentID + positionPath + '/questions'}>
                        Questions<span className="ui tiny label">12</span>
                    </NavLink>
                    <div className={'item' + (this.props.ContentStore.mode === 'discussion' ? ' active' : '')}>
                        <NavLink title="Comments" href={contextPath + '/' + this.props.ContentStore.contentType + '/' + this.props.ContentStore.contentID + positionPath + '/discussion'}>
                            <i className="comments red large icon"></i><span>5</span>
                        </NavLink>
                    </div>
                    <div className="item">
                        <a title="download">
                            <i className="download icon"></i>
                        </a>
                        <a title="print">
                            <i className="print icon"></i>
                        </a>
                        <a title="export">
                            <i className="share external icon"></i>
                        </a>
                            <a title="share">
                                <i className="share alternate icon"></i>
                            </a>
                            <a title="play">
                                <i className="right large green circle play icon"></i>
                            </a>
                    </div>
                </div>
             </div>
        );
    }
}

export default ContentModeMenu;
