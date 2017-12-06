import React from 'react';

class DeckPropertyItemBigText extends React.Component {
    handleChange(event) {
        // TODO pass new value to DeckEditPanel to update store
    }
    render() {
        return (
            <div className="item">
                <span className="header">{this.props.fieldname}</span>
                <span className="description">
                    <textarea onChange={this.handleChange}>
                        {this.props.fieldcontent}
                    </textarea>
                </span>
            </div>
        );
    }
}

export default DeckPropertyItemBigText;
