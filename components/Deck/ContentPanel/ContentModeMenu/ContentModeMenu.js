import React from 'react';
import {NavLink} from 'fluxible-router';

class ContentModeMenu extends React.Component {
    render() {
        let contextDeckURI = '', contextPathURI = '';
        if(this.props.ContentStore.selector.id){
            //when it is in the deck page
            contextDeckURI = '/deck/' + this.props.ContentStore.selector.id;
            //handle it when a path is given
            if(this.props.ContentStore.selector.spath){
                contextPathURI =  '/' + this.props.ContentStore.selector.spath;
            }
        }else{
            //when loaded independently
            contextDeckURI = '/content';
        }
        return (
            <div className="sw-content-panel" ref="contentModeMenu">
                <div className="ui top attached tabular menu">
                    <NavLink className={'item' + (this.props.ContentStore.mode === 'view' ? ' active' : '')} href={contextDeckURI + '/' + this.props.ContentStore.selector.stype + '/' + this.props.ContentStore.selector.sid + contextPathURI + '/view'}>
                        View
                    </NavLink>
                    <NavLink className={'item' + (this.props.ContentStore.mode === 'edit' ? ' active' : '')} href={contextDeckURI + '/' + this.props.ContentStore.selector.stype + '/' + this.props.ContentStore.selector.sid + contextPathURI + '/edit'}>
                        Edit
                    </NavLink>
                    <NavLink className={'item' + (this.props.ContentStore.mode === 'questions' ? ' active' : '')} href={contextDeckURI + '/' + this.props.ContentStore.selector.stype + '/' + this.props.ContentStore.selector.sid + contextPathURI + '/questions'}>
                        Questions<span className="ui tiny label">12</span>
                    </NavLink>
                    <NavLink className={'item' + (this.props.ContentStore.mode === 'datasources' ? ' active' : '')} href={contextDeckURI + '/' + this.props.ContentStore.selector.stype + '/' + this.props.ContentStore.selector.sid + contextPathURI + '/datasources'}>
                        Data Sources<span className="ui tiny circular label">2</span>
                    </NavLink>
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
