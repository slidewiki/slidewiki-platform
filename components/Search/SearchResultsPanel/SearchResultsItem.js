import React from 'react';
import classNames from 'classnames/bind';

class SearchResultsItem extends React.Component {



    render() {
        const result = this.props.data;

        // choose result icon
        let kindIcon =
            (result.kind === 'Slide')
                ?    <i className="big square outline middle aligned icon"></i>
                :    <i className="big block layout middle aligned icon"></i>;


        // form sublist items and expand button
        let expandButton = '';
        let subList = '';
        if(result.subItems && result.subItems.length > 0){
            expandButton = <button className="ui small button">Other versions</button>;

            subList = result.subItems.map( (item) => {
                if(result.kind === 'Deck'){
                    return <div className="row" key={item.id}><a href={item.link}>Deck Revision {item.id}: {item.title}</a></div>;
                }
                else if(result.kind === 'Slide'){
                    return <div className="row" key={item.id}><a href={item.link}>Deck: {item.title}</a></div>;
                }
            });
        }

        // form last line of the result item containing user info
        let userLine = (result.kind === 'Slide')
            ?   <em>in <a href={result.deck.link}>{result.deck.title}</a> by user <a href={result.user.link}>{result.user.username}</a></em>
            :   <em>Owner: <a href={result.user.link}>{result.user.username}</a></em>;


        return (
            <div className="accordionItem">
                <div className="title">
                    <div className="ui middle aligned centered grid">
                        <div className="row">
                            <div className="twelve wide column">
                                <div className="ui grid">
                                    <div className="sixteen wide left aligned column">
                                        <div className="row">
                                            <h3>{kindIcon}<a href={result.link}>{result.title}</a></h3>
                                        </div>
                                        <div className="row">
                                            {result.description}
                                        </div>
                                        <div className="row">
                                            <em>{result.kind} last modified: {result.lastModified}</em>
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
