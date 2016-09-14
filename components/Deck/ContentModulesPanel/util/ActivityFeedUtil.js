import React from 'react';

class ActivityFeedUtil {
    // break text with \n line delimiters into html with span and br elements
    static breakLines(text) {
        return text.split('\n').map((line, key) => {
            return (
            <span key={key}>
                    {line}
                <br />
                </span>
            );
        });
    }

    // returns how many days there are in a given month of the given year
    static daysInMonth(month, year) {
        if (month <= 7) {
            if (month % 2 === 1) return 31;
            if (month === 2) return 28 + (year % 4 === 0 ? 1 : 0);
            return 30;
        } else {
            if (month % 2 === 0) return 31;
            return 30;
        }
    }

    static formatDateFromMillisAgo(millis) {
        const now = new Date();
        const nowTime = now.getTime();
        return ActivityFeedUtil.formatDate(nowTime - millis);
    }

    // turn time millis into a string such as '1 hour ago'
    static formatDate(date) {
        const now = new Date();
        const nowTime = now.getTime();

        if (nowTime < date) return 'in the future [dramatic music playing]';
        const then = new Date(date);
        const yearDiff = now.getFullYear() - then.getFullYear();
        const monthDiff = now.getMonth() - then.getMonth();
        if (yearDiff > 0 && monthDiff >= 0) return yearDiff + ' years ago';

        const trueMonthDiff = (monthDiff < 0) ? 12 + monthDiff : monthDiff;
        const dayDiff = now.getDate() - then.getDate();
        if (monthDiff > 0 && dayDiff >= 0) return trueMonthDiff + ' months ago';

        const trueDayDiff = (dayDiff < 0) ? ActivityFeedUtil.daysInMonth(then.getMonth(), then.getFullYear) + dayDiff : dayDiff;
        if (trueDayDiff > 1) return trueDayDiff + ' days ago';
        if (trueDayDiff === 1) return 'Yesterday';

        const diffInMillis = nowTime - then.getTime();
        const hours = Math.floor(diffInMillis / 3600000);
        if (hours > 0) return hours + ' hours ago';

        const minutes = Math.floor(diffInMillis / 60000);
        if (minutes > 0) return minutes + ' minutes ago';

        const seconds = Math.floor(diffInMillis / 1000);
        if (seconds > 0) return seconds + ' seconds ago';

        return 'moments ago';
    }

    //build node URL based on the context
    static makeNodeRevisionURL(selector, revisionId) {
        let nodeURL;
        let sidWithRevision = selector.sid.split('-')[0] + '-' + revisionId;

        if (selector.stype === 'deck' && selector.id === selector.sid) {
            nodeURL = '/deck/' + sidWithRevision;
        } else {
            nodeURL = '/deck/' + selector.id + '/' + selector.stype + '/' + sidWithRevision;
        }
        if (selector.spath) {
            nodeURL += '/' + selector.spath;
        }
        return nodeURL;
    }
}

export default ActivityFeedUtil;
