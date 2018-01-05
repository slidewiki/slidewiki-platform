import React from 'react';
import ApplicationStore from '../stores/ApplicationStore';
import ga from '../plugins/googleAnalytics/ga';
import { Microservices } from '../configs/microservices';

let hook = require('css-modules-require-hook');

hook({
    generateScopedName: '[hash:base64:5]',
});

class DefaultHTMLLayout extends React.Component {
    render() {
        let user = this.props.context.getUser();
        return (
            <html lang={ this.props.lang }>
            <head>
                <meta charSet="utf-8" />
                <title>{this.props.context.getStore(ApplicationStore).getPageTitle()}</title>
                <meta name="viewport" content="width=device-width, user-scalable=no" />
                <link href="/custom_modules/custom-semantic-ui/dist/semantic.min.css" rel="stylesheet" type="text/css" />
                <link href="/assets/css/custom.css" rel="stylesheet" type="text/css" />
                <link href="/sweetalert2/dist/sweetalert2.min.css" rel="stylesheet" type="text/css" />
                <link href="/custom_modules/reveal.js/css/reveal.css" rel="stylesheet" type="text/css" />
                <link href="/glidejs/dist/css/glide.core.min.css" rel="stylesheet" type="text/css" />
                <link href="/glidejs/dist/css/glide.theme.min.css" rel="stylesheet" type="text/css" />
                { user ?
                  <link href="/jquery-ui-dist/jquery-ui.min.css" rel="stylesheet" type="text/css" />
                  : <meta name="placeholder" content="jquery-ui" />
                }
                { user ?
                  <link href="/font-awesome/css/font-awesome.css" rel="stylesheet" type="text/css" />
                  : <meta name="placeholder" content="font-awesome" />
                }
                { user ?
                  <link href="/jquery-contextmenu/dist/jquery.contextMenu.min.css" rel="stylesheet" type="text/css" />
                  : <meta name="placeholder" content="jquery.contextMenu" />
                }
                {/* Vendors css bundle */
                    this.props.addAssets ? <link href="/public/css/vendor.bundle.css" rel="stylesheet" type="text/css" />: <style></style>
                }
                {/*<link href="/custom_modules/reveal.js/css/print/pdf.css" rel="stylesheet" type="text/css" />*/}
                {/* we add this config option for mathjax so we can better control when the typesetting will occur */}
                <script type="text/x-mathjax-config" dangerouslySetInnerHTML={{__html:'MathJax.Hub.Config({skipStartupTypeset: true});'}} defer></script>
                <script src="/mathjax/MathJax.js?config=TeX-AMS-MML_HTMLorMML" defer></script>
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
                {/* TODO: load specific parts of jquery UI for performance */}
                { user ?
                  <script src="/jquery-ui-dist/jquery-ui.min.js" defer></script>
                  : ''
                }
                <script src="/glidejs/dist/glide.min.js" defer></script>
                <script src="/custom_modules/custom-semantic-ui/dist/components/progress.min.js" defer></script>
                <script src="/custom_modules/custom-semantic-ui/dist/components/accordion.min.js" defer></script>
                <script src="/custom_modules/custom-semantic-ui/dist/components/transition.min.js" defer></script>
                <script src="/custom_modules/custom-semantic-ui/dist/components/popup.min.js" defer></script>
                <script src="/custom_modules/custom-semantic-ui/dist/components/dropdown.min.js" defer></script>
                <script src="/custom_modules/custom-semantic-ui/dist/components/checkbox.min.js" defer></script>
                <script src="/custom_modules/custom-semantic-ui/dist/components/dimmer.min.js" defer></script>
                <script src="/custom_modules/custom-semantic-ui/dist/components/modal.min.js" defer></script>
                <script src="/custom_modules/custom-semantic-ui/dist/components/form.min.js" defer></script>
                <script src="/custom_modules/custom-semantic-ui/dist/components/tab.min.js" defer></script>
                <script src="/custom_modules/custom-semantic-ui/dist/components/search.min.js" defer></script>
                <script src="/custom_modules/custom-semantic-ui/dist/components/api.min.js" defer></script>
                <script src="/custom_modules/custom-semantic-ui/dist/components/sidebar.min.js" defer></script>
                {/* All external vendors bundle*/
                    this.props.addAssets ? <script src={'/public/js/vendor.bundle.js'} defer></script> : ''
                }
                { user ?
                  <script src="/ckeditor/ckeditor.js" defer></script>
                  : ''
                }
                <script src={ Microservices.webrtc.uri + '/socket.io/socket.io.js' }></script>
                <script src="https://webrtc.github.io/adapter/adapter-latest.js"></script>
                <script src="/headjs/dist/1.0.0/head.min.js"></script>
                {/* Adding for dependency loading with reveal.js*/}
                <script src="/custom_modules/reveal.js/js/reveal.js" defer></script>
                {/* Main app bundle */}
                <script src={'/public/js/' + this.props.clientFile} defer></script>
                <script type="text/javascript" src="https://slidewiki.atlassian.net/s/5e2fc7b2a8ba40bc00a09a4f81a301c8-T/rfg5q6/100012/c/1000.0.9/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector.js?locale=en-UK&collectorId=241c9e18" defer></script>
                <script src="/sweetalert2/dist/sweetalert2.min.js" defer></script>
                { user ?
                  <script src="/jquery-contextmenu/dist/jquery.contextMenu.min.js"  defer></script>
                  : ''
                }
                {/*<script src="/custom_modules/simple-draggable/lib/index.js"></script>
                <script src="/custom_modules/slide-edit-input-controls/lib/index.js"></script>*/}
                {/*<script>hljs.initHighlightingOnLoad();</script>*/}
                <script dangerouslySetInnerHTML={ {__html: ga} } />
            </body>
            </html>
        );
    }
}

export default DefaultHTMLLayout;
