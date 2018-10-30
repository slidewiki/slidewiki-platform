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
                defaultMessage: 'Explore the deck lorem ipsum'           // TODO: change lorem ipsums
            },
            findSlidesContent: {
                id: 'staticPage.findSlidesContent',
                defaultMessage: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eget elit sapien. Nunc semper urna in lectus consectetur fermentum. Vestibulum eu sem pulvinar, sollicitudin ipsum eu, porttitor elit. Maecenas bibendum congue lectus, viligula finibus, sit amet aliquam n ipsum eu, porttitor elit. Maecenas bibendum congue lectus, viligula finibus, sit amet.'           // TODO: change lorem ipsums
            },
            createSlides: {
                id: 'staticPage.createSlides',
                defaultMessage: 'Create slides'
            },
            createSlidesSubtitle: {
                id: 'staticPage.createSlidesSubtitle',
                defaultMessage: 'Learn how to create slides with SlideWiki'
            },
            createSlidesContent: {
                id: 'staticPage.createSlidesContent',
                defaultMessage: 'Create a new deck or import existing slides from PowerPoint (*.pptx) or OpenDocument Presentation (*.odp) files. Your imported slides will be converted into HTML slides to allow you to continue to edit and add new slides.'
            },
            sharingSlides: {
                id: 'staticPage.sharingSlides',
                defaultMessage: 'Sharing slides'
            },
            sharingSlidesSubtitle: {
                id: 'staticPage.sharingSlidesSubtitle',
                defaultMessage: 'Present, Share and Communicate'
            },
            sharingSlidesContent: {
                id: 'staticPage.sharingSlidesContent',
                defaultMessage: 'There are many ways that you and your students can engage and interact with slides and decks. Use the Slideshow mode to view a deck as a slideshow. Includes a timer and speaker notes\' view. Share decks via social media or email.'
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
			
            <div className='ui grid stackable container'>
                <div className='row'>
                    <div className='twelve wide column'>
                        <div className='ui content'>
							{this.props.children} 
						</div>
					</div>
                    <div className='four wide column'>
                        <div className='feature-content blue-block-terms'>
                            <div className='feature-left'>
                                <h2>{this.context.intl.formatMessage(this.messages.findSlides)}</h2>
                                <h4>{this.context.intl.formatMessage(this.messages.findSlidesSubtitle)}</h4>
                                <div className='text-div'>
                                    {/*}  <div className='text'>
                                                        <p>{this.context.intl.formatMessage(this.messages.findSlidesContent)}</p>
                                                    </div> */}
                                    <img src='/assets/images/home/search.jpg' className="ui tiny image" alt=''/>
                                </div>
                            </div>
                        </div>
                        <div className='feature-content green-block-terms'>
                            <div className='feature-left'>
                                <h2>{this.context.intl.formatMessage(this.messages.createSlides)}</h2>
                                <h4>{this.context.intl.formatMessage(this.messages.createSlidesSubtitle)}</h4>
                                <div className='text-div'>
                                    {/*    <div className='text'>
                                                        <p>{this.context.intl.formatMessage(this.messages.createSlidesContent)}</p>
                                                    </div> */}
                                    <img src='/assets/images/home/add.jpg' className="ui tiny image" alt=''/>
                                </div>
                            </div>
                        </div>
                        <div className='feature-content red-block-terms'>
                            <div className='feature-left'>
                                <h2>{this.context.intl.formatMessage(this.messages.sharingSlides)}</h2>
                                <h4>{this.context.intl.formatMessage(this.messages.sharingSlidesSubtitle)}</h4>
                                <div className='text-div'>
                                    {/*   <div className='text'>
                                                        <p>{this.context.intl.formatMessage(this.messages.sharingSlidesContent)}</p>
                                                    </div> */}
                                    <img src='/assets/images/home/share.jpg' className="ui tiny image" alt=''/>
                                </div>
                            </div>
                        </div>
                    </div>
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