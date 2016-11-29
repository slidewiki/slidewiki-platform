import React from 'react';
import classNames from 'classnames/bind';
import SubList from './SearchResultsSubList';

class SearchResultsItem extends React.Component {



    render() {
        const result = this.props.data;
        let kindIcon =
            (result.kind === 'Slide')
                ?    <i className="big square outline middle aligned icon"></i>
                :    <i className="big block layout middle aligned icon"></i>;

        // form accordion title node

        // contentNode = <SubList data={result.revisions.docs}/>;
        //
        // let revisionsLength = result.revisions.docs.length - 1;
        //
        // // form list of rest revisions
        // let contentNode = (revisionsLength > 0) ? <SubList data={result.revisions.docs}/> : '';
        //
        // // form expand button
        // let expandButton = (revisionsLength > 0) ? <button className="ui button">{revisionsLength} more</button> : '';
        // console.log(result);
        let expandButton = '';
        if(result.subItems && result.subItems.length > 0){
            expandButton = <button className="ui small button">Other revisions</button>;
        }

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
                                            <em>Owner: {result.user}</em>
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
            </div>
        );
    }
}

export default SearchResultsItem;
