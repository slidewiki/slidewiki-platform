import React from 'react';
import {NavLink} from 'fluxible-router';

class ContentModeMenu extends React.Component {
    render() {
        let contextDeckURI = '', contextPathURI = '';
        if(this.props.ContentStore.contextID){
            //when it is in the deck page
            contextDeckURI = '/deck/' + this.props.ContentStore.contextID;
            //handle it when a path is given
            if(this.props.ContentStore.contextPath.length){
                contextPathURI =  '/' + this.props.ContentStore.contextPath.join('-');
            }
        }else{
            //when loaded independently
            contextDeckURI = '/content';
        }
        return (
            <div className="sw-content-panel" ref="contentModeMenu">
                <div className="ui top attached tabular menu">
                    <NavLink className={'item' + (this.props.ContentStore.mode === 'view' ? ' active' : '')} href={contextDeckURI + '/' + this.props.ContentStore.contentType + '/' + this.props.ContentStore.contentID + contextPathURI + '/view'}>
                        View
                    </NavLink>
                    <NavLink className={'item' + (this.props.ContentStore.mode === 'edit' ? ' active' : '')} href={contextDeckURI + '/' + this.props.ContentStore.contentType + '/' + this.props.ContentStore.contentID + contextPathURI + '/edit'}>
                        Edit
                    </NavLink>
                    <NavLink className={'item' + (this.props.ContentStore.mode === 'history' ? ' active' : '')} href={contextDeckURI + '/' + this.props.ContentStore.contentType + '/' + this.props.ContentStore.contentID + contextPathURI + '/history'}>
                        History
                    </NavLink>
                    <NavLink className={'item' + (this.props.ContentStore.mode === 'usage' ? ' active' : '')} href={contextDeckURI + '/' + this.props.ContentStore.contentType + '/' + this.props.ContentStore.contentID + contextPathURI + '/usage'}>
                        Usage
                    </NavLink>
                    <NavLink className={'item' + (this.props.ContentStore.mode === 'questions' ? ' active' : '')} href={contextDeckURI + '/' + this.props.ContentStore.contentType + '/' + this.props.ContentStore.contentID + contextPathURI + '/questions'}>
                        Questions<span className="ui tiny label">12</span>
                    </NavLink>
                    <div className={'item' + (this.props.ContentStore.mode === 'discussion' ? ' active' : '')}>
                        <NavLink title="Comments" href={contextDeckURI + '/' + this.props.ContentStore.contentType + '/' + this.props.ContentStore.contentID + contextPathURI + '/discussion'}>
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
