import React from 'react';
import DeckCard from '../../User/UserProfile/DeckCard';

class MobileResultsList extends React.Component {
    initAccordion(){
        $('.ui.accordion').accordion({
            selector: {
                trigger: '.title .button'
            }
        });
    }
    componentDidMount(){
        this.initAccordion();
    }
    componentDidUpdate(){
        this.initAccordion();
    }
    render() {
        let list = this.props.items.map((node, index) => {
            node.index = index;
            return (
                <DeckCard key={index} cardContent={node} newTab={false}/>
            );
        });
        return (
            <div className="ui three stackable cards">                
                {list}
            </div>
        );
    }
}

export default MobileResultsList;
