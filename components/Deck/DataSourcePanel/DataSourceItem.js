import React from 'react';
import classNames from 'classnames';

class DataSourceItem extends React.Component {
    static get urlRegEx() {
        //urlRegEx taken from http://blog.mattheworiordan.com/post/13174566389/url-regular-expression-for-links-with-or-without
        return /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-]*)?\??(?:[\-\+=&;%@\.\w]*)#?(?:[\.\!\/\\\w]*))?)/g;
    }

    isTextURL(text) {
        return (DataSourceItem.urlRegEx.test(text));
    }

    shortenText(text) {
        const maxLength = 80, startLength = 25, endLength = 50;
        const textLength = text.length;
        return (textLength <  maxLength) ? text : text.substring(0, startLength - 1) + '...' + text.substring(textLength - endLength - 1, textLength - 1);
    }

    addProtocolIfMissing(url) {
        return url.includes('://') ? url : 'http://' + url;
    }

    insertTitle(title) {
        let titleURLed = title.replace(DataSourceItem.urlRegEx, (url) => {
            return '###' + url + '###';
        });
        let titleSegments = titleURLed.split('###');
        let y = [];

        titleSegments.forEach((titleSegment, index) => {
            y.push(this.isTextURL(titleSegment) ? <a href={this.addProtocolIfMissing(titleSegment)} key={index}>{this.shortenText(titleSegment)}</a> : titleSegment);
        });

        return (
            <span> {y} </span>
        );
    }

    render() {
        let nodeTitle = this.props.node.title;

        //change the icon based on the text
        let iconClass = classNames({
            'ui icon': true,
            'linkify': this.isTextURL(nodeTitle),
            'file': !this.isTextURL(nodeTitle)
        });

        return (
            <div className="item" >
                <i className={iconClass}></i>
                <div className="content">
                    {this.insertTitle(nodeTitle)}
                </div>
            </div>
        );
    }
}

export default DataSourceItem;
