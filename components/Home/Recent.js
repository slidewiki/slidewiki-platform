import React from 'react';
import DeckList from './DeckList';
import { NavLink } from 'fluxible-router';

class Recent extends React.Component {
    render() {


        return (
            <div className = "ui container">
            <div className="content">
                <div>
                <h2 className="ui header">Recent decks added by users</h2>
                    <DeckList scope="recent"/>
                    {/*<button className="ui right floated right labeled icon button">
                        <i className="right arrow icon"></i>
                        <NavLink href={'/recent'}>View All</NavLink>
                    </button>
                    <div className="ui divided list animated ">
                         <NavLink className="item" href="/deck/8">Try Sample Deck Imported from SlideWiki.org &raquo;</NavLink>
                         <NavLink className="item" href="/deck/5">Deck created from scratch &raquo;</NavLink>
                         <NavLink className="item" href="/deck/372">TODO:See documentation deck&raquo;</NavLink>
                     </div> */}
                </div>
            </div>
            </div>
        );
    }
}

export default Recent;
