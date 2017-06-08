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

        // if (nowTime < date) return 'in the future [dramatic music playing]';
        const thenTime = new Date(date).getTime();
        // const yearDiff = now.getFullYear() - then.getFullYear();
        // const monthDiff = now.getMonth() - then.getMonth();
        // if (yearDiff > 0 && monthDiff >= 0) return yearDiff + ' years ago';
        //
        // const trueMonthDiff = (monthDiff < 0) ? 12+monthDiff : monthDiff ;
        // const dayDiff = now.getDate() - then.getDate();
        // if (monthDiff > 0 && dayDiff >= 0) return trueMonthDiff + ' months ago';
        //
        // const trueDayDiff = (dayDiff < 0) ? ActivityFeedUtil.daysInMonth(then.getMonth(), then.getFullYear) + dayDiff : dayDiff;
        // if (trueDayDiff > 1) return trueDayDiff + ' days ago';
        // if (trueDayDiff === 1) return 'Yesterday';
        //
        // const diffInMillis = nowTime - then.getTime();
        // const hours = Math.floor(diffInMillis / 3600000);
        // if (hours > 0) return hours + ' hours ago';
        //
        // const minutes = Math.floor(diffInMillis / 60000);
        // if (minutes > 0) return minutes + ' minutes ago';
        //
        // const seconds = Math.floor(diffInMillis / 1000);
        // if (seconds > 0) return seconds + ' seconds ago';
        //
        // return 'moments ago';
        //
        let msPerMinute = 60 * 1000;
        let msPerHour = msPerMinute * 60;
        let msPerDay = msPerHour * 24;
        let msPerMonth = msPerDay * 30;
        let msPerYear = msPerDay * 365;

        let elapsed = nowTime - thenTime;

        if (elapsed < msPerMinute) {
            return Math.round(elapsed/1000) + ' seconds ago';
        }

        else if (elapsed < msPerHour) {
            return Math.round(elapsed/msPerMinute) + ' minutes ago';
        }

        else if (elapsed < msPerDay ) {
            return Math.round(elapsed/msPerHour ) + ' hours ago';
        }

        else if (elapsed < msPerMonth) {
            return Math.round(elapsed/msPerDay) + ' days ago';
        }

        else if (elapsed < msPerYear) {
            return Math.round(elapsed/msPerMonth) + ' months ago';
        }

        else {
            return Math.round(elapsed/msPerYear ) + ' years ago';
        }
    }
}

export default ActivityFeedUtil;
