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

        //for each text segment create a link if it's a url or display as is
        titleSegments.forEach((titleSegment, index) => {
            y.push(this.isTextURL(titleSegment) ? <a href={this.addProtocolIfMissing(titleSegment)} key={index}>{this.shortenText(titleSegment)}</a> : titleSegment);
        });

        //append origin of the datasource if it's not the current deck/slide
        const showOrigin = ((node.originType === node.nodeType) && (node.originId === node.nodeId)) ? false : true;
        const appendOrigin = (showOrigin) ? <span>(originally from <NavLink href={'/deck/' + node.nodeId + '/' + node.originType + '/' + node.originId}> {node.originType + ' \'' + node.originTitle + ' \''}  </NavLink> ) </span> : '';

        return (
            <span> {y} {appendOrigin}</span>
        );
    }

    render() {
        const nodeTitle = this.props.node.title;

        //change the icon based on the text
        const iconClass = classNames({
            'ui icon': true,
            'linkify': this.isTextURL(nodeTitle),
            'file': !this.isTextURL(nodeTitle)
        });

        return (
            <div className="item" >
                <i className={iconClass}></i>
                <div className="content">
                    {this.insertTitle(this.props.node)}
                </div>
            </div>
        );
    }
}

export default DataSourceItem;
