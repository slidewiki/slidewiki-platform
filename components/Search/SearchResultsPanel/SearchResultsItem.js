import React from 'react';
import classNames from 'classnames/bind';
import { NavLink } from 'fluxible-router';

class SearchResultsItem extends React.Component {



    render() {
        const result = this.props.data;

        // choose result icon
        let kindIcon =
            (result.kind === 'Slide')
                ?    <i className="large grey file text middle aligned icon" aria-label="slide"></i>
                :    <i className="large yellow folder open aligned icon" aria-label="deck"></i>;


        // form sublist items and expand button
        let expandButton = '';
        let subList = '';
        if(result.subItems && result.subItems.length > 0){
            expandButton = <button className="ui small button">Other versions</button>;

            subList = result.subItems.map( (item, index) => {
                if(result.kind === 'Deck'){
                    return <div className="row" key={item.id}><NavLink href={item.link}>Deck Version {index+1}: {item.title}</NavLink></div>;
                }
                else if(result.kind === 'Slide'){
                    return <div className="row" key={item.id}><NavLink href={item.link}>Also in Deck: {item.title}</NavLink></div>;
                }
            });
        }

        // form last line of the result item containing user info
        let userLine = (result.kind === 'Slide')
            ?   <span>in <NavLink href={result.deck.link}>{result.deck.title}</NavLink> by user <NavLink href={result.user.link}>{result.user.username}</NavLink></span>
            :   <span>Owner: <NavLink href={result.user.link}>{result.user.username}</NavLink></span>;


        return (
            <div className="accordionItem">
                <div className="title">
                    <div className="ui middle aligned centered grid">
                        <div className="row">
                            <div className="twelve wide column">
                                <div className="ui grid">
                                    <div className="sixteen wide left aligned column">
                                        <div className="row">
                                            <h3><NavLink href={result.link}>{kindIcon}{result.title}</NavLink></h3>
                                        </div>
                                        <div className="row">
                                            {result.description}
                                        </div>
                                        <div className="row">
                                            {result.kind} last modified: {result.lastUpdate}
                                        </div>
                                        <div className="row">
                                            {userLine}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="four wide column">
                                {expandButton}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="content">
                    <div className="ui centered grid">
                        <div className="fourteen wide left aligned column">
                            {subList}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SearchResultsItem;
