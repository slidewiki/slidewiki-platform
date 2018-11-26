import React from 'react';
import {getLanguageName, getLanguageNativeName, writeCookie} from '../../common';
import IntlStore from '../../stores/IntlStore';
import {flagForLocale, locales} from '../../configs/locales';
import {connectToStores} from 'fluxible-addons-react';
import {Dropdown} from 'semantic-ui-react';
import AriaMenuButton from 'react-aria-menubutton';

class LocaleSwitcher extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            currentLocale: this.props.IntlStore.currentLocale,
            locales: this.props.IntlStore.locales
        };
    }

    /**
     * Sets the app Locale (UI language) to the selected value and reloads the page.
     *
     * @param {string} [locale] The Locale to change to.
     * @returns {void}
     */
    handleLocaleClick(locale, e) {

        // Prevent navigation when this is called from an <a> element.
        e.preventDefault();

        // If the newly-selected Locale is the same as the currentLocale, stop here.
        if (locale === this.state.currentLocale) return;

        // Otherwise, the Locale has changed so set the new Locale and reload the page.
        writeCookie('locale', locale, 365);
        this.setState({currentLocale: locale});
        window.location.reload();
    }

    /**
     * Builds and returns an array of AriaMenuButtons from the list of Locales.
     *
     * @returns {array}
     */
    getAriaLocaleOptions() {
        return locales.map((locale, i) => {
            let flag = flagForLocale(locale) || 'icon';
            return <AriaMenuButton.MenuItem
                className='item'
                value={locale}
                key={i}
                tag='li'
                //onSelection={this.handleLocaleClick.bind(this, locale)}
                text={getLanguageName(locale)}>
                    <span style={{color:'black'}}>
                        <i className={`flag ${flag}`} aria-hidden={true}/>{getLanguageName(locale)}
                    </span>
            </AriaMenuButton.MenuItem>;
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
        let currentFlag = flagForLocale(this.state.currentLocale);

        switch (this.props.mode) {
            // Mobile sidebar: Button showing current locale.
            case 'sidebarLocaleChangeButton':
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
                return (
                    <AriaMenuButton.Wrapper
                    onSelection={this.handleLocaleClick.bind(this)}>
                        <AriaMenuButton.Button aria-label={'Language menu: '+getLanguageName(this.state.currentLocale)}>
                            <div style={{'display': 'inline-flex'}} >
                                <span>{getLanguageName(this.state.currentLocale)}</span>
                                <i className={currentFlag ? `flag ${currentFlag}` : 'icon flag'}/>
                                <i className="ui caret down icon" style={{'marginTop':'0.5em'}}/>
                            </div>
                        </AriaMenuButton.Button>
                        <AriaMenuButton.Menu className='ui menu vertical'
                                             style={{'position':'absolute', 'zIndex':'3', 'right':'0px', 'display': 'flex !important'}} >
                            {this.getAriaLocaleOptions()}
                        </AriaMenuButton.Menu>
                    </AriaMenuButton.Wrapper>
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
