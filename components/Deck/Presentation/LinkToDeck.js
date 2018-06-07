import React from 'react';
import ReactDOM from 'react-dom';
import ResizeAware from 'react-resize-aware';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';

class LinkToDeck extends React.Component{
    constructor(props) {
        super(props);
        this.href = this.getHref();
    }

    getHref(){
        let href = '/deck/' + this.props.deck;
        href += '/slide/' + this.props.slide.replace('slide-', '');
        //href += this.props.spath + '/view';
        return href;
    }

    handleClick(e){
        if(process.env.BROWSER){
            e.preventDefault();
            window.open(this.href);
        }
    }

    render(){

        return (
          <div>
            <NavLink  onClick={this.handleClick.bind(this)} href={this.href} target="_blank">Back to deck</NavLink>
          </div>
        );

    }
}





export default LinkToDeck;
