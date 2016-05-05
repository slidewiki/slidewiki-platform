import React from 'react';

class DeckPropertyItemList extends React.Component {
    render() {
        let list = this.props.fieldcontent.map( (val, index) => {
            return (
                <span className="ui tiny label">{val}</span>
            )
        });
        return (
            <div className="item">
                  <span className="header">{this.props.fieldname}</span>
                  <span className="description">{list}</span>
            </div>
        );
    }
}

export default DeckPropertyItemList;
