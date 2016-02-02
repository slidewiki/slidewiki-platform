import React from 'react';

class Deck extends React.Component {
    render() {
        return (
            <div className="ui page grid" ref="deck">
                <div className="ui row">
                    <div className="column">
                        <div className="ui content">
                            <h2 className="ui header">Deck</h2>
                            <p>deck page will come here!</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Deck;
