import React from 'react';
import classNames from 'classnames/bind';

class SearchResultsItem extends React.Component {



    render() {
        const result = this.props.data;

        let IconNode = '';
        let ContentNode = '';

        // results are sorted by relevance
        let item = result.revisions.docs[0];
        let resultLink = '';
        let resultContent = '';

        switch (result.kind) {
            case 'slide':
                if(item.parent_deck && item.parent_deck !== 'undefined'){
                    resultLink = '/deck/' + item.parent_deck + '/slide/' + item.parent_id + '-' + item.id;
                }
                else{
                    resultLink = '/slideview/' + item.parent_id + '-' + item.id;
                }

                resultContent = (item.content) ? item.content.substring(0, 100) + '...' : '';
                IconNode = <i className="big square outline middle aligned icon"></i>;
                break;
            case 'deck':
                resultLink = '/deck/' + item.parent_id + '-' + item.id;
                resultContent = (result.description) ? result.description.substring(0 ,100) + '...' : '';
                IconNode = <i className="big block layout middle aligned icon"></i>;
                break;
        }

        ContentNode = (
            <div className="content">
                <span className="left floated header">{result.kind} <a href={resultLink} >{item.title}</a></span><br />
                <div className="left floated description">{resultContent}</div>
            </div>
        );

        return (
            <div className="item">
                {IconNode}
                {ContentNode}
            </div>
        );
    }
}

export default SearchResultsItem;
