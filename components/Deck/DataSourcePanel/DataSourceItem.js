import React from 'react';
import {NavLink} from 'fluxible-router';
import classNames from 'classnames';

class DataSourceItem extends React.Component {
    static get urlRegEx() {
        //urlRegEx taken from http://blog.mattheworiordan.com/post/13174566389/url-regular-expression-for-links-with-or-without
        return /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-]*)?\??(?:[\-\+=&;%@\.\w]*)#?(?:[\.\!\/\\\w]*))?)/g;
    }

    isTextURL(text) {
        return (DataSourceItem.urlRegEx.test(text));
    }

    //shorten url label if it's longer then maxLength
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
        const selector = this.props.selector;

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

        //append origin of the datasource if it's not the current deck/slide
        const showOrigin = ((node.originType === selector.stype) && (node.originId === selector.sid)) ? false : true;
        const appendOrigin = (showOrigin) ? <span>(originally from <NavLink href={'/deck/' + selector.sid + '/' + node.originType + '/' + node.originId}> {node.originType + ' \'' + node.originTitle + ' \''}  </NavLink> ) </span> : '';

        return (
            <span> {y} {appendOrigin}</span>
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
        const nodeTitle = node.title;
        const nodeType = node.type;
        const nodeURL = node.url;

        //change the icon based on the text
        const iconClass = classNames({
            'ui icon': true,
            'linkify': nodeType === 'webpage' || (nodeType === 'plaintext' && this.isTextURL(nodeTitle)),
            'file outline': nodeType === 'webdocument' || (nodeType === 'plaintext' && !this.isTextURL(nodeTitle)),
            'user': nodeType === 'person',
            'newspaper': nodeType === 'publication',
            'pdf': nodeType === 'webdocument' && nodeURL.endsWith('pdf'),
            'powerpoint': nodeType === 'webdocument' && ((nodeURL.endsWith('ppt') || nodeURL.endsWith('pptx'))),
            'word': nodeType === 'webdocument' && ((nodeURL.endsWith('doc') || nodeURL.endsWith('docx'))),
            'excel': nodeType === 'webdocument' && ((nodeURL.endsWith('xls') || nodeURL.endsWith('xlsx'))),
            'image': nodeType === 'webdocument' && ((nodeURL.endsWith('jpg') || nodeURL.endsWith('jpeg') || nodeURL.endsWith('bmp') || nodeURL.endsWith('gif') || nodeURL.endsWith('png') || nodeURL.endsWith('svg')))
        });

        let SummaryNode = '';
        switch (node.type) {
            case 'plaintext':
                SummaryNode = (
                    this.insertTitle(node)
                );
                break;
            case 'webpage':
                if (nodeURL !== '') {
                    SummaryNode = (
                        <span><a href={this.addProtocolIfMissing(nodeURL)}>{nodeTitle}</a> {this.addComment(node.comment)}</span>
                    );
                } else {
                    SummaryNode = (
                        <span>{nodeTitle} {this.addComment(node.comment)}</span>
                    );
                }
                break;
            case 'webdocument':
                if (nodeURL !== '') {
                    SummaryNode = (
                        <span><a href={this.addProtocolIfMissing(nodeURL)}>{nodeTitle}</a> {this.addComment(node.comment)}</span>
                    );
                } else {
                    SummaryNode = (
                        <span>{nodeTitle} {this.addComment(node.comment)}</span>
                    );
                }
                break;
            case 'publication':
                if (nodeURL !== '') {
                    SummaryNode = (
                        <span><a href={this.addProtocolIfMissing(nodeURL)}>{nodeTitle}</a> {this.addAuthors(node.authors)} {this.addYear(node.year)} {this.addComment(node.comment)}</span>
                    );
                } else {
                    SummaryNode = (
                        <span>{nodeTitle} {this.addAuthors(node.authors)} {this.addYear(node.year)} {this.addComment(node.comment)}</span>
                    );
                }
                break;
            case 'person':
                if (nodeURL !== '') {
                    SummaryNode = (
                        <span><a href={this.addProtocolIfMissing(nodeURL)}>{nodeTitle}</a> {this.addComment(node.comment)}</span>
                    );
                } else {
                    SummaryNode = (
                        <span>{nodeTitle} {this.addComment(node.comment)}</span>
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
                <i className={this.getIconType(nodeType, nodeTitle, nodeURL)}></i>
                <div className="content">
                    {SummaryNode}
                </div>
            </div>
        );
    }
}

export default DataSourceItem;
