import React from 'react';
import { connectToStores } from 'fluxible-addons-react';

import { locales } from '../../configs/general';
import { writeCookie } from '../../common';

import { Dropdown, Menu, Flag } from 'semantic-ui-react';


import IntlStore from '../../stores/IntlStore';

import Iso from 'iso-639-1';

class LocaleSwitcher extends React.Component {
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


    renderLocaleLink(locale) {
        let flag = locale;
        if (locale === 'en'){
            flag = 'gb';
        }
        if (locale === this.state.currentLocale){
            return (
                <Dropdown.Item
                key = {locale}
                onClick={ this.handleLocaleClick.bind(this, locale) }
                href={ `?locale=${locale}` }
                className = 'active'
                >
                <Flag name={flag}/>{ Iso.getName(locale) }
                </Dropdown.Item>
            );
        } else{
            return (
                <Dropdown.Item
                key = {locale}
                onClick={ this.handleLocaleClick.bind(this, locale) }
                href={ `?locale=${locale}` }
                >
                <Flag name={flag}/>{ Iso.getName(locale) }
                </Dropdown.Item>
            );
        }

    }

    render() {

        let currentFlag = this.state.currentLocale;
        if (this.state.currentLocale === 'en'){
            currentFlag = 'gb';
        }
        let switcher, current_header = '';
        switch (this.props.mode) {
            case 'icon':
                current_header = <Flag name={currentFlag}/>;
                return (
                    <Dropdown trigger={current_header}>
                      <Dropdown.Menu>{ locales.map(this.renderLocaleLink, this) }</Dropdown.Menu>
                    </Dropdown>
                );
            case 'menu':
                current_header = <span><i className='icon comments'/>Language</span>;
                return (
                    <Dropdown item trigger={current_header}>
                      <Dropdown.Menu>{ locales.map(this.renderLocaleLink, this) }</Dropdown.Menu>
                    </Dropdown>
                );
            default:
                current_header = <span><i className='icon comments'/>Language</span>;
                return (
                    <Dropdown item trigger={current_header}>
                      <Dropdown.Menu>{ locales.map(this.renderLocaleLink, this) }</Dropdown.Menu>
                    </Dropdown>
                );
        }
    }

}

LocaleSwitcher = connectToStores(LocaleSwitcher, [IntlStore], (context, props) => {
    return {
        IntlStore: context.getStore(IntlStore).getState()
    };
});
export default LocaleSwitcher;
