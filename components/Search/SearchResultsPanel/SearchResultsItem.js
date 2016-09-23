import React from 'react';
import classNames from 'classnames/bind';

class SearchResultsItem extends React.Component {



    render() {
        const result = this.props.data;
        const imgpath = '/assets/images/search/';

        // console.log('RESULT: '+JSON.stringify(result));

        let IconNode = '';
        let ResultNode = '';

        const contentStyles = {
            fontStyle: 'italic',
            fontWeight: 400
        };
        const infoStyles = {
            fontWeight: 600
        };

        let item = result.revisions.docs[result.revisions.docs.length-1];
        IconNode = (<img src={imgpath + result.kind + '.png'}   height={25} width={25}></img> );
        let resultLink = '';
        let resultContent = '';

        switch (result.kind) {
            case 'slide':
                resultLink = '/deck/' + item.parent_deck + '/slide/' + item.parent_id + '-' + item.id;
                resultContent = (item.content) ? item.content.substring(0, 100) + '...' : '';
                break;
            case 'deck':
                resultLink = '/deck/' + item.parent_id + '-' + item.id;
                resultContent = result.description.substring(0 ,100) + '...';
                break;
        }
        ResultNode = (
            <div className="info">
                <span style={infoStyles}>{result.kind} <a href={resultLink}>{item.title}</a></span>
                <br/>
                <span style={contentStyles}>{resultContent}</span>
            </div>
        );
        // switch (result.kind) {
        //     case 'slide':
        //
        //         ResultNode = (
        //             <div className="info">
        //                 <span style={infoStyles}>Slide <a href={'/slideview/' + result.id}>{result.revisions.docs[result.revisions.docs.length-1].title}</a></span>
        //                 <br/>
        //                 // <span style={contentStyles}>{result.content[0].substring(0,100)+'...'}</span>
        //             </div>
        //         );
        //
        //         break;
        //
        //     case 'deck':
        //         IconNode = (<img src={imgpath + 'deck.png'}   height={25} width={25}></img> );
        //         ResultNode = (
        //             <div className="info">
        //                 <span style={infoStyles}>Deck <a href={'/deck/' + result._id}>{result.revisions.docs[result.revisions.docs.length-1].title}</a></span>
        //                 <br/>
        //             </div>
        //         );
        //         break;
        // }


        return (
          <div className="ui feed">
              <div className="event">
                  <div className="result-icon" style={{marginLeft: '1em'}}>
                      {IconNode}
                  </div>
                  <div className="content" style={{marginLeft: '1em'}}>
                      {ResultNode}
                  </div>
              </div>
          </div>

        );
    }
}

export default SearchResultsItem;
