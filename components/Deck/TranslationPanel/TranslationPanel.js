import React from 'react';

class TranslationPanel extends React.Component {
    render() {
        return (
            <div className="ui center aligned segment" ref="translationPanel">
                Language: <a href="/translations/deck/57"><b>EN</b></a>
             </div>
        );
    }
}

export default TranslationPanel;
