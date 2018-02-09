import React from 'react';

class SpellcheckPanel extends React.Component {
    handleLink(suggestion, event){
        event.preventDefault();
        this.props.handleRedirect({
            keywords: suggestion 
        });
    }
    renderSpellcheckCollations(){
        if(this.props.spellcheckData.length === 0)
            return;

        // get the first suggestion
        const suggestion = this.props.spellcheckData[0];

        return <h4>Do you mean <a href="#" key={suggestion} onClick={this.handleLink.bind(this, suggestion)}>{suggestion}</a>?</h4>;
    }
    render() {
        return (
            <div ref="spellcheckDiv" className="ui grid">
                <div className="column">
                    {this.renderSpellcheckCollations()}
                </div>
            </div>
        );
    }
}

export default SpellcheckPanel;
