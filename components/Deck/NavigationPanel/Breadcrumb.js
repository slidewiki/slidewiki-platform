import React from 'react';
import {NavLink} from 'fluxible-router';
import slugify from 'slugify';
import cheerio from 'cheerio';
import Util from '../../common/Util';

class Breadcrumb extends React.Component {
    render() {
        let self = this;
        let nodes = [];
        let list, output = '';
        let urlStandard = Util.makeNodeURL({
            id: self.props.selector.get('id'),
            stype: 'deck',
            sid: self.props.selector.get('id'),
        }, 'deck', '', slugify(this.props.rootDeckName || '').toLowerCase() || '');

        if(this.props.selector.get('spath')){
            nodes = this.props.selector.get('spath').split(';');
            list = nodes.map((node, index) => {
                if(index === (nodes.length - 1)){
                    return (
                        <div key={index} className="section">
                            {cheerio.load(this.props.pathNames[index]).text()}
                        </div>
                    );
                }else{
                    let url = Util.makeNodeURL({
                        id: self.props.selector.get('id'),
                        stype: 'deck',
                        sid: self.props.selector.get('sid'),
                        spath: (nodes[index - 1] ? (nodes[index - 1] + ';') : '') + node
                    }, 'deck', '', slugify(this.props.rootDeckName || '').toLowerCase() || '_');
                    return (
                        <div key={index} className="section">
                            <NavLink href={url}>{this.props.pathNames[index]}</NavLink>
                            <i className="right chevron icon divider"></i>
                        </div>
                    );
                }

            });
        }
        /*
        return (

            <div className="sw-breadcrumb" ref="breadcrumb">
                <div className="ui large breadcrumb">
                    <div className="section">
                        <NavLink className="ui header" href={'/deck/' + self.props.selector.get('id')}> {this.props.rootDeckName} </NavLink>
                        <i className="right chevron icon divider"></i>
                    </div>
                    {list}
                </div>
             </div>
        );
        */
        return (
            <div className="ui top attached compact segment">
                <h2 className="ui large breadcrumb">
                <i className="small yellow open folder icon"></i>
                    <NavLink href={urlStandard}> {this.props.rootDeckName} </NavLink>
                    <i className="right chevron icon divider"></i>
                    {list}
                </h2>
            </div>
        );
    }
}

export default Breadcrumb;
