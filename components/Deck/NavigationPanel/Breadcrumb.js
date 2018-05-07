import React from 'react';
import {NavLink} from 'fluxible-router';
import slug from 'slug';
import cheerio from 'cheerio';


class Breadcrumb extends React.Component {
    render() {
        let self = this;
        let nodes = [];
        let list, output = '';
        let urlPrefix = '/deck/' + self.props.selector.get('id') + '/' + (slug(this.props.rootDeckName || '').toLowerCase() || '_');
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
                    return (
                        <div key={index} className="section">
                            <NavLink href={urlPrefix + '/deck/' + self.props.selector.get('sid') + '/' + (nodes[index - 1] ? (nodes[index - 1] + ';') : '') + node}>{this.props.pathNames[index]}</NavLink>
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
                    <NavLink href={urlPrefix}> {this.props.rootDeckName} </NavLink>
                    <i className="right chevron icon divider"></i>
                    {list}
                </h2>
            </div>
        );
    }
}

export default Breadcrumb;
