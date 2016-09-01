import React from 'react';
import { NavLink } from 'fluxible-router';

class Preview extends React.Component {
    componentDidMount() {
        this.enableAccordion();
    }

    componentDidUpdate() {
        this.refreshAccordion();
    }

    enableAccordion(status) {
        $(this.refs.accordion).accordion();
    }

    refreshAccordion(status) {
        $(this.refs.accordion).accordion('refresh');
    }

    render() {
        let content = {
            picture: 'https://cdn1.iconfinder.com/data/icons/iconnice-vector-icon/31/Vector-icons_23-256.png',
            title: 'Deck 53: Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat',
            description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
            updated: '53 mins',
            deckID: 53,
        };
        content.title = content.title.slice(0,90);
        content.description = content.description.slice(0,50);
        return (
            <div className="ui styled fluid accordion" ref="accordion">
                <div className="title active">
                    <i className="dropdown icon"/>
                    <img className="ui tiny top aligned spaced right floated image" src={ content.picture }/>
                    {content.title}<br/>
                    <div clasName="grey"><i className="hidden dropdown icon"/>{content.title}</div>
                </div>
                <div className="content active">

                </div>
                <div className="title">
                    <i className="dropdown icon"/>
                    <img className="ui tiny middle aligned spaced image" src={ content.picture }/>
                    {content.title}
                </div>
                <div className="content">

                </div>
                <div className="title">
                    <i className="dropdown icon"/>
                    <img className="ui tiny middle aligned spaced image" src={ content.picture }/>
                    {content.title}
                </div>
                <div className="content">
                    <p className="transition hidden">Three common ways for a prospective owner to acquire a dog is from pet shops, private owners, or shelters.</p>
                    <p className="transition hidden">A pet shop may be the most convenient way to buy a dog. Buying a dog from a private owner allows you to assess the pedigree and upbringing of your dog before choosing to take it home. Lastly, finding your dog from a shelter, helps give a good home to a dog who may not find one so readily.</p>
                </div>
            </div>
        );
    }
}

Preview.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default Preview;
