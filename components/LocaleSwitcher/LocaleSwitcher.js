import React from 'react';
import Iso from 'iso-639-1';
import { writeCookie } from '../../common';
import IntlStore from '../../stores/IntlStore';
import { locales } from '../../configs/general';
import { connectToStores } from 'fluxible-addons-react';
import { Dropdown, Menu, Flag } from 'semantic-ui-react';

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
        let flag = (locale === 'en') ? 'gb' : locale;
        let className = (locale === this.state.currentLocale) ? 'active' : '';
        return (
            <Dropdown.Item key={locale} onClick={this.handleLocaleClick.bind(this, locale)} href={`?locale=${locale}`} className={className}>
              <Flag name={flag}/>
              {Iso.getName(locale)}
            </Dropdown.Item>
        );

    }

    render() {
        let currentFlag = (this.state.currentLocale === 'en') ? 'gb' : this.state.currentLocale;
        let current_header = <span><i className='icon comments'/>Language</span>;
        switch (this.props.mode) {
            case 'icon':
                current_header = <Flag name={currentFlag}/>;
                return (
                    <Dropdown trigger={current_header}>
                      <Dropdown.Menu>{ locales.map(this.renderLocaleLink, this) }</Dropdown.Menu>
                    </Dropdown>
                );
                break;
            default:
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
