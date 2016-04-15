import React from 'react';

class TranslationItem extends React.Component {
    render() {
        return (
        		
        		<span className="translation-item">
        			<a href={'/translations/deck/' + this.props.data.id}><b>{this.props.data.lang}</b></a>
        	    </span>
        	      
        );
    }
}

export default TranslationItem;