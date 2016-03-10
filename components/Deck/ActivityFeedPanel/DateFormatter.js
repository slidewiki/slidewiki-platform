function daysInMonth(month, year) {
    if (month <= 7) {
        if (month % 2 === 1) return 31;
        if (month === 2) return 28 + (year % 4 === 0 ? 1 : 0);
        return 30;
    } else {
        if (month % 2 === 0) return 31;
        return 30;
    }
}
function formatDate(date) {
    const now = new Date();
    const nowTime = now.getTime();
    if (nowTime < date) return 'in the future [dramatic music playing]';
    const then = new Date(date);

    const yearDiff = now.getFullYear() - then.getFullYear();
    const monthDiff = now.getMonth() - then.getMonth();
    if (yearDiff > 0 && monthDiff >= 0) return yearDiff + ' years ago';

    const trueMonthDiff = (monthDiff < 0) ? 12+monthDiff : monthDiff ;
    const dayDiff = now.getDate() - then.getDate();
    if (monthDiff > 0 && dayDiff >= 0) return trueMonthDiff + ' months ago';

    const trueDayDiff = (dayDiff < 0) ? daysInMonth(then.getMonth(), then.getFullYear) + dayDiff : dayDiff;
    if (trueDayDiff > 1) return trueDayDiff + ' days ago';
    if (trueDayDiff === 1) return 'Yesterday';

    const diffInMillis = nowTime - date;
    const hours = Math.floor(diffInMillis / 3600000);
    if (hours > 0) return hours + ' hours ago';

    const minutes = Math.floor(diffInMillis / 60000);
    if (minutes > 0) return minutes + ' minutes ago';

    const seconds = Math.floor(diffInMillis / 1000);
    if (seconds > 0) return seconds + ' seconds ago';

    return 'moments ago';
}

export default formatDate;
