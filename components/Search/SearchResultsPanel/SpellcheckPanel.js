import React from 'react';

class SpellcheckPanel extends React.Component {
    renderSpellcheckCollations(){
        if(this.props.spellcheckData === '')
            return;

        const suggestion = this.props.spellcheckData;

        return <div className="row">
            <h4>Do you mean <a href="#" key={suggestion} onClick={this.props.handleRedirect.bind(this, {keywords: suggestion})}>{suggestion}</a>?</h4>
        </div>;
    }
    render() {
        return (
            <div ref="spellcheckDiv">
                <h4>{this.renderSpellcheckCollations()}</h4>
            </div>
        );
    }
}

export default SpellcheckPanel;
