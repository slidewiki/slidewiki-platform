import React from 'react';
import { connectToStores } from 'fluxible-addons-react';

import { locales } from '../../configs/general';
import { writeCookie } from '../../common';


import IntlStore from '../../stores/IntlStore';

class LocaleSwitcher extends React.Component {

    handleLocaleClick(locale, e) {
        e.preventDefault();
        writeCookie('locale', locale, 365);
        window.location.reload();
    }

    renderLocaleLink(locale) {
        const { currentLocale } = this.props;

        let className = 'LocaleSwitcher-link';
        if (locale === currentLocale) {
            className = `${className} ${className}--active`;
        }

        return (
            <a key={ locale }
            className={ className }
            onClick={ this.handleLocaleClick.bind(this, locale) }
            href={ `?locale=${locale}` }>
            { locale }
            </a>
        );
    }

    render() {
        return (
            <div className="LocaleSwitcher">
            { locales.map(this.renderLocaleLink, this) }
            </div>
        );
    }

}

LocaleSwitcher = connectToStores(LocaleSwitcher, [IntlStore], (context, props) => {
    return {
        currentLocale: context.getStore(IntlStore).getCurrentLocale()
    };
});
export default LocaleSwitcher;
