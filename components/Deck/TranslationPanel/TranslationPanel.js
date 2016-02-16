import React from 'react';

class TranslationPanel extends React.Component {
    render() {
        return (
            <div className="ui center aligned segment" ref="translationPanel">
                Language: <b>EN</b>
             </div>
        );
    }
}

export default TranslationPanel;
