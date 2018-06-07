import React from 'react';
import ApplicationStore from '../stores/ApplicationStore';
//import ga from '../plugins/googleAnalytics/ga';

let hook = require('css-modules-require-hook');

hook({
    generateScopedName: '[hash:base64:5]',
});

class BasicHTMLLayout extends React.Component {
    render() {
        let user = this.props.context.getUser();
        return (
            <html lang={ this.props.lang }>
            <head>
                <meta charSet="utf-8" />
                <title>{this.props.context.getStore(ApplicationStore).getPageTitle()}</title>
                <meta name="viewport" content="width=device-width, user-scalable=no" />
                <link href="/assets/css/custom.css" rel="stylesheet" type="text/css" />
                {/* Vendors css bundle */
                    this.props.addAssets ? <link href="/public/css/vendor.bundle.css" rel="stylesheet" type="text/css" />: <style></style>
                }
            </head>
            <body>
                <div id="app" aria-hidden="false" dangerouslySetInnerHTML={{__html: this.props.markup}}></div>
            </body>
            </html>
        );
    }
}

export default BasicHTMLLayout;
