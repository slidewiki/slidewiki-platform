import React from 'react';
import classNames from 'classnames/bind';
import SubList from './SearchResultsSubList';

class SearchResultsItem extends React.Component {



    render() {
        const result = this.props.data;

        let iconNode = '';
        let item = result.revisions.docs[0];
        let resultLink = '';
        let description = '';

        // form icon, link, description according to result kind
        switch (result.kind) {
            case 'slide':
                if(item.parent_deck && item.parent_deck !== 'undefined'){
                    resultLink = '/deck/' + item.parent_deck + '/slide/' + item.parent_id + '-' + item.id;
                }
                else{
                    resultLink = '/slideview/' + item.parent_id + '-' + item.id;
                }

                description = (item.content) ? item.content.substring(0, 100) + '...' : '';
                iconNode = <i className="big square outline middle aligned icon"></i>;
                break;
            case 'deck':
                resultLink = '/deck/' + item.parent_id + '-' + item.id;
                description = (result.description) ? result.description.substring(0 ,100) + '...' : '';
                iconNode = <i className="big block layout middle aligned icon"></i>;
                break;
        }

        // form accordion title node
        let titleNode = (
            <div className="ui grid">
                <div className="sixteen wide left aligned column">
                    <div className="row"><b>{result.kind} <a href={resultLink} >{item.title}</a></b></div>
                    <div className="row">{description}</div>
                </div>
            </div>
        );
        contentNode = <SubList data={result.revisions.docs}/>;

        let revisionsLength = result.revisions.docs.length - 1;

        // form list of rest revisions
        let contentNode = (revisionsLength > 0) ? <SubList data={result.revisions.docs}/> : '';

        // form expand button
        let expandButton = (revisionsLength > 0) ? <button className="ui button">{revisionsLength} more</button> : '';

        return (
            <div className="accordionItem">
                <div className="title">
                    <div className="ui middle aligned centered grid">
                        <div className="row">
                            <div className="one wide column">
                                {iconNode}
                            </div>
                            <div className="eleven wide column">
                                {titleNode}
                            </div>
                            <div className="four wide column">
                                {expandButton}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="content">
                    {contentNode}
                </div>
            </div>
        );
    }
}

export default SearchResultsItem;
