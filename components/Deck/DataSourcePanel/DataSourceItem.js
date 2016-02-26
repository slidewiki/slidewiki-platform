import React from 'react';

class DataSourceItem extends React.Component {
    static get urlRegEx() {
        //urlRegEx taken from http://blog.mattheworiordan.com/post/13174566389/url-regular-expression-for-links-with-or-without
        return /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-]*)?\??(?:[\-\+=&;%@\.\w]*)#?(?:[\.\!\/\\\w]*))?)/g;
    }

    isTextURL(text) {
        return (DataSourceItem.urlRegEx.test(text));
    }

    insertIcon(title) {
        if (this.isTextURL(title)) {
            return (
                <i className="ui icon linkify"></i>
            );
        } else {
            return (
                <i className="ui icon file"></i>
            );
        }
    }

    insertTitle(title) {
        let titleURLed = title.replace(DataSourceItem.urlRegEx, (url) => {
            return '###' + url + '###';
        });
        let titleSegments = titleURLed.split('###');
        let y = [];

        titleSegments.forEach((titleSegment, index) => {
            y.push(this.isTextURL(titleSegment) ? <a href={titleSegment} key={index}>{titleSegment}</a> : titleSegment);
        });

        return (
            <span> {y} </span>
        );
    }

    render() {
        let divStyle = {
            fontSize: 12
        };

        let nodeTitle = this.props.node.title;

        return (
            <div className="item" >
                {this.insertIcon(nodeTitle)}
                <div style={divStyle} className="content">{this.insertTitle(nodeTitle)} </div>
            </div>
        );
    }
}

export default DataSourceItem;
