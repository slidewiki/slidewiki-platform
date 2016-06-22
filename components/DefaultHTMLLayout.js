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
            </head>
            <body>
                <div id="app" dangerouslySetInnerHTML={{__html: this.props.markup}}></div>
                {/* Following are added only to support IE browser */}
                <script src="/bower_components/es5-shim/es5-shim.min.js" async></script>
                <script src="/bower_components/es5-shim/es5-sham.min.js" async></script>
                <script src="/bower_components/json3/lib/json3.min.js" async></script>
                <script src="/bower_components/es6-shim/es6-shim.min.js" async></script>
                <script src="/bower_components/es6-shim/es6-sham.min.js" async></script>
                {/* Above are added only to support IE browser */}
                <script dangerouslySetInnerHTML={{__html: this.props.state}} async></script>
                <script src="/bower_components/jquery/dist/jquery.min.js" async></script>
                <script src="/custom_modules/custom-semantic-ui/dist/components/progress.min.js" async></script>
                <script src="/custom_modules/custom-semantic-ui/dist/components/accordion.min.js" async></script>
                <script src="/custom_modules/custom-semantic-ui/dist/components/transition.min.js" async></script>
                <script src="/custom_modules/custom-semantic-ui/dist/components/popup.min.js" async></script>
                <script src="/custom_modules/custom-semantic-ui/dist/components/dropdown.min.js" async></script>
                <script src="/custom_modules/custom-semantic-ui/dist/components/checkbox.min.js" async></script>
                <script src="/custom_modules/custom-semantic-ui/dist/components/dimmer.min.js" async></script>
                <script src="/custom_modules/custom-semantic-ui/dist/components/modal.min.js" async></script>
                {/* All external vendors bundle*/}
                <script src="/public/js/vendor.bundle.js" async></script>
                <script src="/bower_components/ckeditor/ckeditor.js" async></script>
                <script type="javascript">
                    CKEDITOR.disableAutoInline = true; //need to disable auto-initate to config inline toolbars
                </script>
                {/* Main app bundle */}
                <script src={'/public/js/' + this.props.clientFile} defer></script>
            </body>
            </html>
        );
    }
}

export default DefaultHTMLLayout;
