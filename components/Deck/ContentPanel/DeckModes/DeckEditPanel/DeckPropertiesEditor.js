import React from 'react';
import DeckPropertyEditText from './editors/DeckPropertyEditText.js'
import DeckPropertyEditBigText from './editors/DeckPropertyEditBigText.js'
import DeckPropertyEditList from './editors/DeckPropertyEditList.js'

class DeckPropertyList extends React.Component {
    handleChange(update) {
        this.props.onChange(update);
    }
    render() {
        let list = Object.keys(this.props.items).map((key) => {
            let value = this.props.items[key];
            if (value instanceof Array) {
                return (<DeckPropertyEditList onChange={this.handleChange}
                    fieldname={key} fieldcontent={value} />);
            } else {
                let strVal = String(value)
                if (strVal.length < 300)    // TODO find a good value (depend on screen mode?)
                    return (<DeckPropertyEditText  onChange={this.handleChange}
                        fieldname={key} fieldcontent={value} />);
                else
                    return (<DeckPropertyEditBigText  onChange={this.handleChange}
                        fieldname={key} fieldcontent={value} />);
            }
        });

        return (
            <div ref="deckPropertiesEditor">
                <div className="ui relaxed divided list">
                    {list}
                </div>
            </div>
        );
    }
}

export default DeckPropertyList;
