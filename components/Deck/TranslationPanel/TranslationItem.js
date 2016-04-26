import React from 'react';

class TranslationItem extends React.Component {
    render() {
        return (
        	<div className="item">
                {this.props.data.lang}
            </div>
        );
    }
}

export default TranslationItem;
