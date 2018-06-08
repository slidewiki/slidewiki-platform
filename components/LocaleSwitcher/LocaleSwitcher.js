import React from 'react';
import Iso from 'iso-639-1';
import { writeCookie } from '../../common';
import IntlStore from '../../stores/IntlStore';
import { locales } from '../../configs/locales';
import { connectToStores } from 'fluxible-addons-react';
import { Dropdown, Menu, Flag } from 'semantic-ui-react';

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

    renderLocaleLink(locale) {
        let flag = (locale === 'en') ? 'gb' : locale;
        let className = (locale === this.state.currentLocale) ? 'active' : '';
        switch (this.props.mode) {
            case 'sidebar':
                return(
                  <div key={locale} onClick={this.handleLocaleClick.bind(this, locale)} href={`?locale=${locale}`} className="item">
                    <Flag name={flag}/>
                    {Iso.getName(locale)}
                  </div>
                );
                break;
            default:
                return (
                    <Dropdown.Item key={locale} onClick={this.handleLocaleClick.bind(this, locale)} href={`?locale=${locale}`} className={className}>
                      {(this.props.mode === 'icon') ? <Flag name={flag}/> : ''}
                      {Iso.getName(locale)}
                    </Dropdown.Item>
                );
        }
    }

    render() {
        let currentFlag = (this.state.currentLocale === 'en') ? 'gb' : this.state.currentLocale;
        let current_header = <Flag name={currentFlag}/>;

        switch (this.props.mode) {
            case 'icon':
                return (
                    <Dropdown trigger={current_header}>
                      <Dropdown.Menu>{ locales.map(this.renderLocaleLink, this) }</Dropdown.Menu>
                    </Dropdown>
                );
                break;
            case 'headeronly':
                return(
                    <div>
                      <span>{Iso.getName(this.state.currentLocale)}  </span>
                      {current_header}
                    </div>);
                break;
            case 'sidebar':
                return (
                      <div>
                      { locales.map(this.renderLocaleLink, this) }
                      </div>
                );
                break;
            default:
                current_header = <span><i className='icon comments'/>{Iso.getName(this.state.currentLocale)}</span>;
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
