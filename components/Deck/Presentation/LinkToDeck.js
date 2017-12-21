import React from 'react';
import ReactDOM from 'react-dom';
import ResizeAware from 'react-resize-aware';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';

class LinkToDeck extends React.Component{
    getHref(){
        let href = '/deck/' + this.props.deck;
        href += '/slide/' + this.props.slide.replace('slide-', '');
        //href += this.props.spath + '/view';
        return href;
    }

    render(){
        let href = this.getHref();
        return (
          <div>
            <NavLink href={href}>Back to deck</NavLink>
          </div>
        );

    }
}

export default LinkToDeck;
