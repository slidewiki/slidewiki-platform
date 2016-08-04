import React from 'react';
import {NavLink} from 'fluxible-router';
import classNames from 'classnames';
import loadDataSource from '../../../../actions/datasource/loadDataSource';

class DataSourceItem extends React.Component {
    handleEdit() {
        this.context.executeAction(loadDataSource, {
            dsid: this.props.node.id
        });
    }

    static get urlRegEx() {
        //urlRegEx taken from http://blog.mattheworiordan.com/post/13174566389/url-regular-expression-for-links-with-or-without
        return /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-]*)?\??(?:[\-\+=&;%@\.\w]*)#?(?:[\.\!\/\\\w]*))?)/g;
    }

    isTextURL(text) {
        return (DataSourceItem.urlRegEx.test(text));
    }

    //shorten url label if it is longer then maxLength
    shortenText(text) {
        const maxLength = 80, startLength = 25, endLength = 50;
        const textLength = text.length;
        return (textLength <  maxLength) ? text : text.substring(0, startLength - 1) + '...' + text.substring(textLength - endLength - 1, textLength - 1);
    }

    addComment(comment) {
        if (comment !== '') {
            return '(' + comment + ')';
        } else {
            return '';
        }
    }

    addAuthors(authors) {
        if (authors !== '') {
            return ',' + authors;
        } else {
            return '';
        }
    }

    addYear(year) {
        if (year !== '') {
            return ',' + year;
        } else {
            return '';
        }
    }

    //add http protocol to the url if it's missing
    addProtocolIfMissing(url) {
        return url.includes('://') ? url : 'http://' + url;
    }

    insertTitle(node) {
        const title = node.title;

        //mark beginning and end of each url found and then split the text into segments
        const titleURLed = title.replace(DataSourceItem.urlRegEx, (url) => {
            return '###' + url + '###';
        });
        const titleSegments = titleURLed.split('###');
        let y = [];

        titleSegments.forEach((titleSegment, index) => {
            //create a link if it's a url or display as is
            y.push(this.isTextURL(titleSegment) ? <a href={this.addProtocolIfMissing(titleSegment)} key={index}>{this.shortenText(titleSegment)}</a> : titleSegment);
        });

        return (
            y
        );
    }

    getIconType(nodeType, nodeTitle, nodeURL) {
        const image = nodeType === 'webdocument' && ((nodeURL.endsWith('jpg') || nodeURL.endsWith('jpeg') || nodeURL.endsWith('bmp') || nodeURL.endsWith('gif') || nodeURL.endsWith('png') || nodeURL.endsWith('svg')));
        const pdf = nodeType === 'webdocument' && nodeURL.endsWith('pdf');
        const powerpoint = nodeType === 'webdocument' && ((nodeURL.endsWith('ppt') || nodeURL.endsWith('pptx')));
        const word = nodeType === 'webdocument' && ((nodeURL.endsWith('doc') || nodeURL.endsWith('docx')));
        const excel = nodeType === 'webdocument' && ((nodeURL.endsWith('xls') || nodeURL.endsWith('xlsx')));
        const link = nodeType === 'webpage' || (nodeType === 'plaintext' && this.isTextURL(nodeTitle)) || (nodeType === 'webdocument') && (!image) && (!pdf) && (!powerpoint) && (!word) && (!excel);
        const file = (nodeType === 'plaintext' && !this.isTextURL(nodeTitle)) || (nodeType === 'webdocument') && (image || pdf || powerpoint || word || excel);
        const person = nodeType === 'person';
        const publication = nodeType === 'publication';

        return classNames({
            'ui icon': true,
            'linkify': link,
            'file outline': file,
            'user': person,
            'newspaper': publication,
            'pdf': pdf,
            'powerpoint': powerpoint,
            'word': word,
            'excel': excel,
            'image': image
        });
    }

    render() {
        const node = this.props.node;

        //append origin of the datasource
        const selector = this.props.selector;
        const appendOrigin = (selector.stype === 'deck') ? <span><i>(originally from slide <NavLink href={'/deck/' + selector.sid + '/slide/' + node.sid}> {node.stitle}  </NavLink> )</i> </span> : '';

        const appendEdit = (
            <a className="edit" onClick={this.handleEdit.bind(this)} title="Edit">
                <i tabIndex="0" className="edit icon" />
            </a>
        );

        let SummaryNode = '';
        switch (node.type) {
            case 'plaintext':
                SummaryNode = (
                    this.insertTitle(node)
                );
                break;
            case 'webpage':
                if (node.url !== '') {
                    SummaryNode = (
                        <span><a href={this.addProtocolIfMissing(node.url)}>{node.title}</a> {this.addComment(node.comment)}</span>
                    );
                } else {
                    SummaryNode = (
                        <span>{node.title} {this.addComment(node.comment)}</span>
                    );
                }
                break;
            case 'webdocument':
                if (node.url !== '') {
                    SummaryNode = (
                        <span><a href={this.addProtocolIfMissing(node.url)}>{node.title}</a> {this.addComment(node.comment)}</span>
                    );
                } else {
                    SummaryNode = (
                        <span>{node.title} {this.addComment(node.comment)}</span>
                    );
                }
                break;
            case 'publication':
                if (node.url !== '') {
                    SummaryNode = (
                        <span><a href={this.addProtocolIfMissing(node.url)}>{node.title}</a> {this.addAuthors(node.authors)} {this.addYear(node.year)} {this.addComment(node.comment)}</span>
                    );
                } else {
                    SummaryNode = (
                        <span>{node.title} {this.addAuthors(node.authors)} {this.addYear(node.year)} {this.addComment(node.comment)}</span>
                    );
                }
                break;
            case 'person':
                if (node.url !== '') {
                    SummaryNode = (
                        <span><a href={this.addProtocolIfMissing(node.url)}>{node.title}</a> {this.addComment(node.comment)}</span>
                    );
                } else {
                    SummaryNode = (
                        <span>{node.title} {this.addComment(node.comment)}</span>
                    );
                }
                break;
            default:
                SummaryNode = (
                    this.insertTitle(node)
                );
        }

        return (
            <div className="item" >
                <i className={this.getIconType(node.type, node.title, node.url)}></i>
                <div className="content">
                    {SummaryNode} {appendOrigin} {appendEdit}
                </div>
            </div>
        );
    }
}

DataSourceItem.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default DataSourceItem;
