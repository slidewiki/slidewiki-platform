class CustomDate {
    static format(date_string, pattern) {
        const months = ['January', 'February', 'March', 'April', 'May', 'June',  'July', 'August', 'September', 'October', 'November', 'December'];
        const dateObj = new Date(date_string);
        if (pattern === 'Do MMMM YYYY')
            return dateObj.getDate() + this.dateOrdinal(dateObj.getDate()) + ' ' + months[dateObj.getMonth()] + ' ' + dateObj.getFullYear();
        else if (pattern === 'MMMM')
            return months[dateObj.getMonth()];
        else if (pattern === 'MMM Do YY')
            return months[dateObj.getMonth()].substring(0, 3) + ' ' + dateObj.getDate() + this.dateOrdinal(dateObj.getDate()) + ' ' + dateObj.getFullYear.slice(-2);
    }

    static dateOrdinal(date) {
        if (date > 3 && date < 21)
            return 'th';
        switch (date % 10) {
            case 1:  return 'st';
            case 2:  return 'nd';
            case 3:  return 'rd';
            default: return 'th';
        }
    }
}

export default CustomDate;
