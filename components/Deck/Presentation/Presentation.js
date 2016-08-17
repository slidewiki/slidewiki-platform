import React from 'react';
import ReactDOM from 'react-dom'
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import PresentationSlideList from './PresentationSlideList';
import DeckTreeStore from '../../../stores/DeckTreeStore';
import loadPresentation from '../../../actions/loadPresentation';

var playerCss = {
    height: '100%',
    fontSize: '100%',
    position: 'absolute',
    top: '0',
    backgroundColor: '#ffffff'
};


class Presentation extends React.Component{

  componentWillMount(){

    this.context.executeAction(loadPresentation, {
		  deck: this.props.DeckTreeStore.flatTree
		});

  }
	render(){
        return(
            <div className="reveal" style={playerCss}>
            <PresentationSlideList flatTree={this.props.DeckTreeStore.flatTree} />
            </div>
        );

	}

}

Presentation.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

Presentation = connectToStores(Presentation, [DeckTreeStore], (context, props) => {
    return {
        DeckTreeStore: context.getStore(DeckTreeStore).getState()
    };
});


export default Presentation;
