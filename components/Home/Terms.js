import {connectToStores} from 'fluxible-addons-react';
import {defineMessages} from 'react-intl';
import {NavLink} from 'fluxible-router';
import PropTypes from 'prop-types';
import React from 'react';
import updateTrap from '../../actions/loginModal/updateTrap';
import UserProfileStore from '../../stores/UserProfileStore';

class terms extends React.Component {
    constructor(props) {
        super(props);
        this.messages = defineMessages({
            mainTitle: {
                id: 'terms.mainTitle',
                defaultMessage: 'Terms of us of SlideWiki'
            },
            summary: {
                id: 'terms.summary',
                defaultMessage: 'This is a human-readable summary of the Terms of Use for SlideWiki (the project).'
            },
            disclaimer: {
                id: 'terms.disclaimer',
                defaultMessage: 'Disclaimer: This summary is not a part of the Terms of Use and is not a legal document. It is simply a handy reference for understanding the full terms. Think of it as the user-friendly interface to the legal language of our Terms of Use.'
            },
            missionTitle: {
                id: 'terms.missionTitle',
                defaultMessage: 'Part of our mission is to:'
            },
            mission1: {
                id: 'terms.mission1',
                defaultMessage: 'Empower and engage people around the world to collect and develop educational content and either publish it under a free license or dedicate it to the public   domain.'
            },
            mission2: {
                id: 'terms.mission2',
                defaultMessage: 'Disseminate this content effectively and globally, free of charge.'
            },
            freeTo: {
                id: 'terms.freeTo',
                defaultMessage: 'You are free to:'
            },
            free1: {
                id: 'terms.free1',
                defaultMessage: 'Read and Print our presentations and other media free of charge.'
            },
            free2: {
                id: 'terms.free2',
                defaultMessage: 'Share and Reuse our presentations and other media under free and open licenses.'
            },
            free3: {
                id: 'terms.free3',
                defaultMessage: 'Contribute To and Edit our various sites or projects.'
            },
            conditionsTitle: {
                id: 'terms.conditionsTitle',
                defaultMessage: 'Under the following conditions'
            },
            condition1: {
                id: 'terms.confition1',
                defaultMessage: 'Responsibility – You take responsibility for your edits (since we only host your content).'
            },
            condition2: {
                id: 'terms.condition2',
                defaultMessage: 'Civility – You support a civil environment and do not harass other users.'
            },
            condition3: {
                id: 'terms.condition3',
                defaultMessage: 'Lawful behaviour – You do not violate copyright or other laws.'
            },
            condition4: {
                id: 'terms.condition4',
                defaultMessage: 'No Harm – You do not harm our technology infrastructure.'
            },
            condition5: {
                id: 'terms.condition5',
                defaultMessage: 'Terms of Use and Policies – You adhere to the Terms of Use and to the applicable community policies when you visit our sites or participate in our communities.'
            },
            understandingTitle: {
                id: 'terms.understanding',
                defaultMessage: 'With the understanding that'
            },
            understanding1: {
                id: 'terms.understanding1',
                defaultMessage: 'This service may contain translations powered by third party services. Selecting to use the translate service will result in data being sent to third-party services. We disclaims all warranties related to the translations, expressed or implied, including any warranties of accuracy, reliability, and any implied warranties of  merchantability, fitness for a particular purpose and noninfringement.'
            },
            understanding2: {
                id: 'terms.understanding2',
                defaultMessage: 'You license freely your contributions – you generally must license your contributions and edits to our sites or projects under a free and open license (unless your contribution is in the public domain).'
            },
            understanding3: {
                id: 'terms.understanding3',
                defaultMessage: 'No professional advice – the content of presentations and other projects is for informational purposes only and does not constitute professional advice.'
            },
            paragraph1: {       // TODO: change lorem ipsums in the following paragraphs
                id: 'terms.paragraph1',
                defaultMessage: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus id nisl magna. Sed a metus vel dui vehicula viverra. Quisque sed tellus at justo semper dictum. Nullam at rutrum leo. Vivamus at aliquam metus. Aliquam nec nunc in libero posuere hendrerit nec at lacus. Nunc malesuada lobortis tortor nec porta. Cras vulputate mollis nisi, at sollicitudin quam eleifend ac. Nam sed venenatis turpis. Sed vestibulum malesuada nunc vitae ultricies. Donec bibendum ultrices facilisis. Mauris sollicitudin mi et vulputate rhoncus.'
            },
            paragraph2: {
                id: 'terms.paragraph2',
                defaultMessage: 'Mauris tincidunt, urna non aliquam dapibus, enim metus varius tellus, non dignissim urna odio ac augue. Fusce id lacinia ipsum, id egestas dui. Suspendisse nec quam vel mi tincidunt bibendum a vel mauris. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Proin magna elit, molestie eu libero ut, bibendum facilisis turpis. Mauris sem lorem, dignissim a ex sit amet, suscipit fermentum turpis. Integer porttitor arcu non porttitor faucibus. Fusce nisi risus, rutrum vitae vulputate vitae, consectetur et nunc. Aliquam placerat ipsum felis, nec fermentum arcu sagittis nec. Aenean imperdiet laoreet quam ac placerat. Ut accumsan tristique elementum. Etiam congue venenatis lorem, malesuada tristique mauris congue vel. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nam tincidunt libero a nisi consequat sodales.'
            },
            paragraph3: {
                id: 'terms.paragraph3',
                defaultMessage: 'Aliquam vitae velit iaculis, vestibulum felis eu, lacinia risus. Donec mollis enim nec accumsan tristique. Morbi dapibus condimentum erat quis placerat. Integer velit augue, sodales quis scelerisque nec, facilisis nec velit. Maecenas rhoncus sagittis lectus, vel feugiat nulla aliquet quis. Quisque condimentum sapien nec eros tristique, vitae pulvinar sem tempus. Nulla ut odio id elit accumsan interdum. Maecenas sagittis sed sem a malesuada. Vivamus venenatis ex sed ex pretium, et pellentesque purus vehicula. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egesta'
            },
            findSlides: {
                id: 'terms.findSlides',
                defaultMessage: 'Find slides'
            },
            findSlidesSubtitle: {
                id: 'terms.findSlidesSubtitle',
                defaultMessage: 'Explore the deck lorem ipsum'           // TODO: change lorem ipsums
            },
            findSlidesContent: {
                id: 'terms.findSlidesContent',
                defaultMessage: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eget elit sapien. Nunc semper urna in lectus consectetur fermentum. Vestibulum eu sem pulvinar, sollicitudin ipsum eu, porttitor elit. Maecenas bibendum congue lectus, viligula finibus, sit amet aliquam n ipsum eu, porttitor elit. Maecenas bibendum congue lectus, viligula finibus, sit amet.'           // TODO: change lorem ipsums
            },
            createSlides: {
                id: 'terms.createSlides',
                defaultMessage: 'Create slides'
            },
            createSlidesSubtitle: {
                id: 'terms.createSlidesSubtitle',
                defaultMessage: 'Learn how to create slides with SlideWiki'
            },
            createSlidesContent: {
                id: 'terms.createSlidesContent',
                defaultMessage: 'Create a new deck or import existing slides from PowerPoint (*.pptx) or OpenDocument Presentation (*.odp) files. Your imported slides will be converted into HTML slides to allow you to continue to edit and add new slides.'
            },
            sharingSlides: {
                id: 'terms.sharingSlides',
                defaultMessage: 'Sharing slides'
            },
            sharingSlidesSubtitle: {
                id: 'terms.sharingSlidesSubtitle',
                defaultMessage: 'Present, Share and Communicate'
            },
            sharingSlidesContent: {
                id: 'terms.sharingSlidesContent',
                defaultMessage: 'There are many ways that you and your students can engage and interact with slides and decks. Use the Slideshow mode to view a deck as a slideshow. Includes a timer and speaker notes\' view. Share decks via social media or email.'
            },
            getStarted: {
                id: 'terms.getStarted',
                defaultMessage: 'Get started right away.  '
            },
            signIn: {
                id: 'terms.signIn',
                defaultMessage: 'Sign in'
            },
            getStartedDescription: {
                id: 'terms.getStartedDescription',
                defaultMessage: 'Create an account to start creating and sharing your decks. '
            },
            myDecks: {
                id: 'terms.myDecks',
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

        return (
            <div>
            <section className='inner-container'>
                <div className='inner-content-block'>
                    <div className='wrapper'>
                        <div className='ui grid'>
                            <div className='row'>
                                <div className='column'>
                                    <div className='content-left'>
                                        <h1>{this.context.intl.formatMessage(this.messages.mainTitle)}</h1>
                                        <p>{this.context.intl.formatMessage(this.messages.summary)}</p>
                                        <p>{this.context.intl.formatMessage(this.messages.disclaimer)}</p>
                                        <h5>{this.context.intl.formatMessage(this.messages.missionTitle)}</h5>
                                        <ul>
                                            <li>{this.context.intl.formatMessage(this.messages.mission1)}</li>
                                            <li>{this.context.intl.formatMessage(this.messages.mission2)}</li>
                                        </ul>
                                        <h5>{this.context.intl.formatMessage(this.messages.freeTo)}</h5>
                                        <ul>
                                            <li>{this.context.intl.formatMessage(this.messages.free1)}</li>
                                            <li>{this.context.intl.formatMessage(this.messages.free2)}</li>
                                            <li>{this.context.intl.formatMessage(this.messages.free3)}</li>
                                        </ul>
                                        <h5>{this.context.intl.formatMessage(this.messages.conditionsTitle)}</h5>
                                        <ul>
                                            <li>{this.context.intl.formatMessage(this.messages.condition1)}</li>
                                            <li>{this.context.intl.formatMessage(this.messages.condition2)}</li>
                                            <li>{this.context.intl.formatMessage(this.messages.condition3)}</li>
                                            <li>{this.context.intl.formatMessage(this.messages.condition4)}</li>
                                            <li>{this.context.intl.formatMessage(this.messages.condition5)}</li>
                                        </ul>
                                        <h5>{this.context.intl.formatMessage(this.messages.understandingTitle)}</h5>
                                        <ul>
                                            <li>{this.context.intl.formatMessage(this.messages.understanding1)}</li>
                                            <li>{this.context.intl.formatMessage(this.messages.understanding2)}</li>
                                            <li>{this.context.intl.formatMessage(this.messages.understanding3)}</li>
                                        </ul>
                                        <p>{this.context.intl.formatMessage(this.messages.paragraph1)}</p>
                                        <p>{this.context.intl.formatMessage(this.messages.paragraph2)}</p>
                                        <p>{this.context.intl.formatMessage(this.messages.paragraph3)}</p>
                                    </div>
                                    <div className='content-right'>
                                        <ul>
                                            <li>
                                                <div className='feature-content blue-block'>
                                                    <div className='feature-left'>
                                                        <h2>{this.context.intl.formatMessage(this.messages.findSlides)}</h2>
                                                        <h4>{this.context.intl.formatMessage(this.messages.findSlidesSubtitle)}</h4>
                                                        <div className='text-div'>
                                                            <div className='text'>
                                                                <p>{this.context.intl.formatMessage(this.messages.findSlidesContent)}</p>
                                                            </div>
                                                            <img src='/assets/images/home/search.jpg' alt=''/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className='feature-content green-block'>
                                                    <div className='feature-left'>
                                                        <h2>{this.context.intl.formatMessage(this.messages.createSlides)}</h2>
                                                        <h4>{this.context.intl.formatMessage(this.messages.createSlidesSubtitle)}</h4>
                                                        <div className='text-div'>
                                                            <div className='text'>
                                                                <p>{this.context.intl.formatMessage(this.messages.createSlidesContent)}</p>
                                                            </div>
                                                            <img src='/assets/images/home/add.jpg' alt=''/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className='feature-content red-block'>
                                                    <div className='feature-left'>
                                                        <h2>{this.context.intl.formatMessage(this.messages.sharingSlides)}</h2>
                                                        <h4>{this.context.intl.formatMessage(this.messages.sharingSlidesSubtitle)}</h4>
                                                        <div className='text-div'>
                                                            <div className='text'>
                                                                <p>{this.context.intl.formatMessage(this.messages.sharingSlidesContent)}</p>
                                                            </div>
                                                            <img src='/assets/images/home/share.jpg' alt=''/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                        <div className='signin-blk'>
                                            <span>{this.context.intl.formatMessage(this.messages.getStarted)}{'  '}{signInOrMyDecksElement}</span>
                                            <p>{this.context.intl.formatMessage(this.messages.getStartedDescription)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className='banner-container inner-image'>
                <img src='/assets/images/home/banner.jpg' alt=''/>
            </section>
            </div>
        );
    }
}

terms.contextTypes = {
    intl: PropTypes.object.isRequired,
    getUser: PropTypes.func.isRequired,
    executeAction: PropTypes.func.isRequired
};

terms = connectToStores(terms, [UserProfileStore], (context, props) => {
    return {
        UserProfileStore: context.getStore(UserProfileStore).getState()
    };
});

export default terms;
