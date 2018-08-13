import React from 'react';
import PropTypes from 'prop-types';
import {Button, Icon, Flag} from 'semantic-ui-react';
import {navigateAction} from 'fluxible-router';
import qs from 'querystring';
import {getLanguageName} from '../../../common';
import {flagForLocale} from '../../../configs/locales';

class TranslationItem extends React.Component {
    directToTranslation(href, e) {
        e.preventDefault();
        this.context.executeAction(navigateAction, { url: href });
    }

    render() {
        let href = '';
        if (this.props.clickable) {
            // build the href!
            let routeName = 'deck';
            let navParams = Object.assign({ slug: this.props.slug || '_' }, this.props.selector);
            let queryParams = { language: this.props.language };

            href = ['', routeName, navParams.id, navParams.slug, navParams.stype, navParams.sid, navParams.spath].join('/');
            href += '?' + qs.stringify(queryParams);
        }

        let flagName = flagForLocale(this.props.language);
        let iconName = flagName ? flagName + ' flag': 'flag icon';
        let text = getLanguageName(this.props.language) + (this.props.primary ? ' (primary)' : '');

        let node = (this.props.clickable === true) ?

          <Button role="button" data-tooltip={text}
            onClick={this.directToTranslation.bind(this, href)}
            aria-label={text} aria-required
            tabIndex="0" attached basic >
              {iconName === 'flag icon' ? <Icon name='flag' /> : <Flag name={flagName} />}{text}
          </Button>
          :
          <div className="content">
              <div className="header">
                  {iconName === 'flag icon' ? <Icon name='flag' /> : <Flag name={flagName} />}{text}
              </div>
          </div>;

        return (
            <div className="item">
              {node}
            </div>
        );
    }
}

TranslationItem.contextTypes = {
    executeAction: PropTypes.func.isRequired
};

export default TranslationItem;
