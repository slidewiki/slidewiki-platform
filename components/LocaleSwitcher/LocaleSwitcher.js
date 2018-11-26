import React from 'react';
import {getLanguageName, getLanguageNativeName, writeCookie} from '../../common';
import IntlStore from '../../stores/IntlStore';
import {flagForLocale, locales} from '../../configs/locales';
import {connectToStores} from 'fluxible-addons-react';
import {Dropdown} from 'semantic-ui-react';

class LocaleSwitcher extends React.Component {
    //HACK This component is reused but also reimplemented in User/UserProfile/ChangePersonalData.js for better integration reasons.
    constructor(props){
        super(props);
        this.state = {
            currentLocale: this.props.IntlStore.currentLocale,
            locales: this.props.IntlStore.locales
        };
    }

    handleLocaleClick(locale, e) {
        e.preventDefault();
        writeCookie('locale', locale, 365);
        this.setState({currentLocale: locale});
        window.location.reload();
    }

    handleLocaleChange(e, localeDropdown) {
        writeCookie('locale', localeDropdown.value, 365);
        this.setState({currentLocale: localeDropdown.value});
        window.location.reload();
    }

    getLocaleOptions() {
        return locales.map((locale) => {
            let flag = flagForLocale(locale) || 'icon';
            return {
                key: locale,
                text: <span><i className={`flag ${flag}`}/>{getLanguageName(locale)}</span>,
                value: locale
            };
        });
    }

    renderLocaleLink(locale) {
        let flag = flagForLocale(locale);
        let className = (locale === this.state.currentLocale) ? 'active' : '';
        switch (this.props.mode) {
            case 'sidebar':
                return(
                    <a
                        key={locale}
                        onClick={this.handleLocaleClick.bind(this, locale)}
                        href={`?locale=${locale}`} className="item">
                            {flag ? <i className={`flag ${flag}`} /> : <span><i className='flag icon' /></span>}
                            {getLanguageName(locale)}
                    </a>
                );
            default:
                return (
                    <Dropdown.Item key={locale} onClick={this.handleLocaleClick.bind(this, locale)} href={`?locale=${locale}`} className={className}>
                      <i className={`flag ${flag || 'icon'}`}/>
                      {getLanguageName(locale)}
                    </Dropdown.Item>
                );
        }
    }

    render() {

        switch (this.props.mode) {
            // Mobile sidebar: Button showing current locale.
            case 'sidebarLocaleChangeButton':
                let currentFlag = flagForLocale(this.state.currentLocale);
                return(
                    <div>
                        <span>{getLanguageName(this.state.currentLocale)}</span>
                        <i className={currentFlag ? `flag ${currentFlag}` : 'icon flag'}/>
                    </div>);

            // Mobile sidebar: List of locale options.
            case 'sidebarLocalesMenu':
                return (
                      <div>
                      { locales.map(this.renderLocaleLink, this) }
                      </div>
                );

            // Default renders the desktop UX.
            default:
                return (<Dropdown
                    item
                    selectOnNavigation={false}
                    value={this.state.currentLocale}
                    options={ this.getLocaleOptions() }
                    onChange={this.handleLocaleChange.bind(this)}
                />);
        }
    }
}

LocaleSwitcher = connectToStores(LocaleSwitcher, [IntlStore], (context, props) => {
    return {
        IntlStore: context.getStore(IntlStore).getState()
    };
});

export default LocaleSwitcher;
