import React from 'react';

class TranslationPanel extends React.Component {
    render() {
        return (
            <div className="ui secondary menu" ref="translationPanel">
                <div className="ui dropdown item">
                  Translate to
                  <i className="dropdown icon"></i>
                  <div className="menu">
                    <div className="item">English</div>
                    <div className="item">German</div>
                    <div className="item">Dutch</div>
                    <div className="item">Persian</div>
                  </div>
                </div>
             </div>
        );
    }
}

export default TranslationPanel;
