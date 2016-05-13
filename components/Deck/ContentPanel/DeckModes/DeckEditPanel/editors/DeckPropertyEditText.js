import React from 'react';
import InlineEdit from 'react-edit-inline';

class DeckPropertyItemText extends React.Component {
    handleChange(event) {
        let update = {
            fieldname: this.props.fieldname,
            fieldcontent: event.value
        };
        this.props.onChange(update);
    }
    render() {
        return (
            <div className="item">
                 <span className="header">{this.props.fieldname}</span>
                 <span className="description">
                    <InlineEdit
                        text={this.props.fieldcontent}
                        paramName="value"
                        change={this.handleChange}
                    />
                </span>
            </div>
        );
    }
}

export default DeckPropertyItemText;
