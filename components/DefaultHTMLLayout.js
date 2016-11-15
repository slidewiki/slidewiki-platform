import React from 'react';
import ApplicationStore from '../stores/ApplicationStore';

class DefaultHTMLLayout extends React.Component {
    render() {
        return (
            <html>
            <head>
                <meta charSet="utf-8" />
                <title>{this.props.context.getStore(ApplicationStore).getPageTitle()}</title>
                <meta name="viewport" content="width=device-width, user-scalable=no" />
                <link href="/custom_modules/custom-semantic-ui/dist/semantic.min.css" rel="stylesheet" type="text/css" />
                <link href="/assets/css/custom.css" rel="stylesheet" type="text/css" />
                <link href="/sweetalert2/dist/sweetalert2.min.css" rel="stylesheet" type="text/css" />
                <link href="/custom_modules/reveal.js/css/reveal.css" rel="stylesheet" type="text/css" />
                <link href="/custom_modules/reveal.js/css/theme/white.css" rel="stylesheet" type="text/css" />
                {/* Vendors css bundle */
                    this.props.addAssets ? <link href="/public/css/vendor.bundle.css" rel="stylesheet" type="text/css" />: <style></style>
                }
                {/*<link href="/custom_modules/reveal.js/css/print/pdf.css" rel="stylesheet" type="text/css" />*/}
                {/*<link href="/custom_modules/ckeditor/plugins/codesnippet/lib/highlight/styles/github.css" rel="stylesheet" />*/}
            </head>
            <body>
                <div id="app" dangerouslySetInnerHTML={{__html: this.props.markup}}></div>
                {/* Following are added only to support IE browser */}
                <script src="/es5-shim/es5-shim.min.js"></script>
                <script src="/es5-shim/es5-sham.min.js"></script>
                <script src="/json3/lib/json3.min.js"></script>
                <script src="/es6-shim/es6-shim.min.js"></script>
                <script src="/es6-shim/es6-sham.min.js"></script>
                {/* Above are added only to support IE browser */}
                <script dangerouslySetInnerHTML={{__html: this.props.state}}></script>
                <script src="/jquery/dist/jquery.min.js"></script>
                <script src="/custom_modules/custom-semantic-ui/dist/components/progress.min.js"></script>
                <script src="/custom_modules/custom-semantic-ui/dist/components/accordion.min.js"></script>
                <script src="/custom_modules/custom-semantic-ui/dist/components/transition.min.js"></script>
                <script src="/custom_modules/custom-semantic-ui/dist/components/popup.min.js"></script>
                <script src="/custom_modules/custom-semantic-ui/dist/components/dropdown.min.js"></script>
                <script src="/custom_modules/custom-semantic-ui/dist/components/checkbox.min.js"></script>
                <script src="/custom_modules/custom-semantic-ui/dist/components/dimmer.min.js"></script>
                <script src="/custom_modules/custom-semantic-ui/dist/components/modal.min.js"></script>
                <script src="/custom_modules/custom-semantic-ui/dist/components/form.min.js"></script>
                <script src="/custom_modules/custom-semantic-ui/dist/components/tab.min.js"></script>
                <script src="/custom_modules/custom-semantic-ui/dist/components/search.min.js"></script>
                <script src="/custom_modules/custom-semantic-ui/dist/components/api.min.js"></script>

                {/* All external vendors bundle*/
                    this.props.addAssets ? <script src={'/public/js/vendor.bundle.js'}></script> : ''
                }
                <script src="/custom_modules/ckeditor/ckeditor.js"></script>
                <script src="/custom_modules/simple-draggable/lib/index.js"></script>
                <script type="javascript">
                    //CKEDITOR.disableAutoInline = false; //need to disable auto-initate to config inline toolbars
                    CKEDITOR.disableAutoInline = true; //need to disable auto-initate to config inline toolbars
                </script>
                <script src="/headjs/dist/1.0.0/head.min.js"></script>
                {/* Adding for dependency loading with reveal.js*/}
                <script src="/custom_modules/reveal.js/js/reveal.js"></script>
                {/* Main app bundle */}
                <script src={'/public/js/' + this.props.clientFile}></script>
                <script type="text/javascript" src="https://slidewiki.atlassian.net/s/5e2fc7b2a8ba40bc00a09a4f81a301c8-T/rfg5q6/100012/c/1000.0.9/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector.js?locale=en-UK&collectorId=241c9e18"></script>
                <script src="/sweetalert2/dist/sweetalert2.min.js"></script>
                {/*<script src="/custom_modules/ckeditor/plugins/codesnippet/lib/highlight/highlight.pack.js"></script>*/}
                {/*<script>hljs.initHighlightingOnLoad();</script>*/}
            </body>
            </html>
        );
    }
}

export default DefaultHTMLLayout;
