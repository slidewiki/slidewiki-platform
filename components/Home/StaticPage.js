import {connectToStores} from 'fluxible-addons-react';
import {defineMessages} from 'react-intl';
import {NavLink} from 'fluxible-router';
import PropTypes from 'prop-types';
import React from 'react';
import updateTrap from '../../actions/loginModal/updateTrap';
import UserProfileStore from '../../stores/UserProfileStore';

class StaticPage extends React.Component {
    constructor(props) {
        super(props);
        this.messages = defineMessages({
            findSlides: {
                id: 'staticPage.findSlides',
                defaultMessage: 'Find slides'
            },
            findSlidesSubtitle: {
                id: 'staticPage.findSlidesSubtitle',
                defaultMessage: 'Explore the deck'
            },
            findSlidesContent: {
                id: 'staticPage.findSlidesContent',
                defaultMessage: 'SlideWiki provides open educational resourcs and courses across a wide range of topics. '
            },
            createSlides: {
                id: 'staticPage.createSlides',
                defaultMessage: 'Create slides'
            },
            createSlidesSubtitle: {
                id: 'staticPage.createSlidesSubtitle',
                defaultMessage: 'Add and adapt course material'
            },
            createSlidesContent: {
                id: 'staticPage.createSlidesContent',
                defaultMessage: 'Create a new deck or import existing slides  to create HTML slide decks. '
            },
            sharingSlides: {
                id: 'staticPage.sharingSlides',
                defaultMessage: 'Share slides'
            },
            sharingSlidesSubtitle: {
                id: 'staticPage.sharingSlidesSubtitle',
                defaultMessage: 'Present, Share and Communicate'
            },
            sharingSlidesContent: {
                id: 'staticPage.sharingSlidesContent',
                defaultMessage: 'Collaborate on decks with peers. Group decks in playlists and share via social media or email.'
            },
            getStarted: {
                id: 'staticPage.getStarted',
                defaultMessage: 'Get started right away.  '
            },
            signIn: {
                id: 'staticPage.signIn',
                defaultMessage: 'Sign in'
            },
            getStartedDescription: {
                id: 'staticPage.getStartedDescription',
                defaultMessage: 'Create an account to start creating and sharing your decks. '
            },
            myDecks: {
                id: 'staticPage.myDecks',
                defaultMessage: 'My Decks.'
            }
        });
    }
	
    handleLoginButton() {
        this.context.executeAction(updateTrap,{activeTrap:true});
        //hidden the other page elements to readers
        $('#app').attr('aria-hidden','true');
        $('.ui.login.modal').modal('toggle');

        this.closeSidebar({target: '<a className="item"></a>'});
    }
	
    render() {
        let signInOrMyDecksElement = this.props.UserProfileStore.username === '' ?
            <a onClick={this.handleLoginButton.bind(this)}>{this.context.intl.formatMessage(this.messages.signIn)}</a>:
            <NavLink className="item" href={'/user/' + this.props.UserProfileStore.username}>
                {this.context.intl.formatMessage(this.messages.myDecks)}
            </NavLink>;	

        return (<div>		
			<div className='ui hidden divider'></div>

			<div className='ui grid centered stackable container'>
			<div className='row'>
			<div className='eleven wide column'>
			    <div className='ui content'>
					{this.props.children} 
				</div>
			</div>
			<aside className='four wide column'>
			    <div className='feature-content blue-block-terms'>
			        <div className='feature-left'>
			            <h3 className="ui header blue medium">{this.context.intl.formatMessage(this.messages.findSlides)}</h3>
                        <h4 className="ui header blue small">{this.context.intl.formatMessage(this.messages.findSlidesSubtitle)}</h4>
			            <div className='text-div'>
			                <div className='text'>
                                <p><img src='/assets/images/home/search.jpg' className="ui tiny left floated  image" alt=''/> {this.context.intl.formatMessage(this.messages.findSlidesContent)}</p>
                            </div> 
			               
			            </div>
			        </div>
			    </div>
			    <div className='feature-content green-block-terms'>
			        <div className='feature-left'>
                        <h3 className="ui header teal medium">{this.context.intl.formatMessage(this.messages.createSlides)}</h3>
			            <h4 className="ui header teal small">{this.context.intl.formatMessage(this.messages.createSlidesSubtitle)}</h4>
			            <div className='text-div'>
			                <div className='text'>
                                <p> <img src='/assets/images/home/add.jpg' className="ui tiny floated left image" alt=''/> {this.context.intl.formatMessage(this.messages.createSlidesContent)}</p>
                            </div> 
			               
			            </div>
			        </div>
			    </div>
			    <div className='feature-content red-block-terms'>
			        <div className='feature-left'>
                        <h3 className="ui header pink medium">{this.context.intl.formatMessage(this.messages.sharingSlides)}</h3>
			            <h4 className="ui header small pink">{this.context.intl.formatMessage(this.messages.sharingSlidesSubtitle)}</h4>
			            <div className='text-div'>
			                <div className='text'>
                                <p><img src='/assets/images/home/share.jpg' className="ui tiny floated left image" alt=''/> {this.context.intl.formatMessage(this.messages.sharingSlidesContent)}</p>
                            </div>
			                
			            </div>
			        </div>
			    </div>
			</aside>
			</div>
			<div className='row'>
			<div className='signin-blk wrapper'>
			    <span>{this.context.intl.formatMessage(this.messages.getStarted)}{'  '}{signInOrMyDecksElement}</span>
			    <p>{this.context.intl.formatMessage(this.messages.getStartedDescription)}</p>
			</div>
			</div>

			<div className='row'>
			{/*<div className='banner-container inner-image'>
			    <img src='/assets/images/home/banner.jpg' alt=''/>
			</div>*/}
			</div>
			</div>
			</div>);
    }
}

StaticPage.contextTypes = {
    intl: PropTypes.object.isRequired,
    getUser: PropTypes.func.isRequired,
    executeAction: PropTypes.func.isRequired
};

StaticPage = connectToStores(StaticPage, [UserProfileStore], (context, props) => {
    return {
        UserProfileStore: context.getStore(UserProfileStore).getState()
    };
});

export default StaticPage;
