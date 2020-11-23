import React from 'react';
import ApplicationStore from '../stores/ApplicationStore';
//import ga from '../plugins/googleAnalytics/ga';

let hook = require('css-modules-require-hook');

hook({
    generateScopedName: '[hash:base64:5]',
});

class PresentationPrintHTMLLayout extends React.Component {
    render() {
        return (
            <html lang={ this.props.lang }>
              <head>
                  <meta charSet="utf-8" />
                  <title>{this.props.context.getStore(ApplicationStore).getPageTitle()}</title>
                  <meta name="viewport" content="width=device-width" />
                  <link href="/assets/css/custom.css" rel="stylesheet" type="text/css" />
                  <link href="/assets/custom-semantic-ui/dist/semantic.min.css" rel="stylesheet" type="text/css" />{/*NOTE needed, otherwise a horizontal scrollbar appears. TODO get rid of this*/}
                  <link href="/custom_modules/reveal.js/css/reveal.css" rel="stylesheet" type="text/css" />
                  <link href="/custom_modules/reveal.js/lib/css/zenburn.css" rel="stylesheet" type="text/css" />
                  {/*<link href="/custom_modules/reveal.js/css/print/pdf.css" rel="stylesheet" type="text/css" />*/}
                  {/* we add this config option for mathjax so we can better control when the typesetting will occur */}
                  <script type="text/x-mathjax-config" dangerouslySetInnerHTML={{__html:'MathJax.Hub.Config({skipStartupTypeset: true});'}}></script>
                  <script src="/mathjax/MathJax.js?config=TeX-AMS-MML_HTMLorMML" defer></script>
                  {/* Vendors css bundle */
                      this.props.addAssets ? <link href="/public/css/vendor.bundle.css" rel="stylesheet" type="text/css" />: <style></style>
                  }
              </head>
              <body>
                  <div id="app" aria-hidden="false" dangerouslySetInnerHTML={{__html: this.props.markup}}></div>
                  {/* Following are added only to support IE browser */}
                  <script src="/es5-shim/es5-shim.min.js"></script>
                  <script src="/es5-shim/es5-sham.min.js"></script>
                  <script src="/json3/lib/json3.min.js"></script>
                  <script src="/es6-shim/es6-shim.min.js"></script>
                  <script src="/es6-shim/es6-sham.min.js"></script>
                  {/* Above are added only to support IE browser */}
                  <script dangerouslySetInnerHTML={{__html: this.props.state}}></script>
                  <script src="/jquery/dist/jquery.min.js"></script>
                  <script src="/headjs/dist/1.0.0/head.min.js" defer></script>
                  {/* All external vendors bundle*/
                      this.props.addAssets ? <script src={'/public/js/vendor.bundle.js'} defer></script> : ''
                  }
                  {/* Adding for dependency loading with reveal.js*/}
                  <script src="/custom_modules/reveal.js/js/reveal.js" defer></script>
                  {/* Run-time settings */}
                  <script src="/public/js/settings.js" defer></script>
                  {/* Main app bundle */}
                  <script src={'/public/js/' + this.props.clientFile} defer></script>
                  {/* <script dangerouslySetInnerHTML={ {__html: ga} } />*/}
              </body>
            </html>
        );
    }
}

export default PresentationPrintHTMLLayout;
