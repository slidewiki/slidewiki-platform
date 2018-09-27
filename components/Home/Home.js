import PropTypes from 'prop-types';
import React from 'react';
import DeckList from './DeckList';
import Carousel from './Carousel';
import {NavLink, navigateAction} from 'fluxible-router';
import { FormattedMessage, defineMessages} from 'react-intl';
import LocaleSwitcher from '../LocaleSwitcher/LocaleSwitcher';
import {Button} from 'semantic-ui-react';

class Home extends React.Component {

    openFeatured(e){
        this.context.executeAction(navigateAction, {
            url: '/featured'
        });
    };
    render() {


        return (
            <div ref='home'>
                {/*<!-- presentation starts -->*/}
                <section className='banner-container'>
                    <img src='/assets/images/home/banner.jpg' alt=''/>
                        <div className='banner-content'>
                            <div className='ui container'>
                                <div className='ui  column  grid'>
                                    <div className='column '>
                                        <div className='ui fluid category search'>
                                            <div className='ui fluid icon input'>
                                                <input className='prompt' type='text' placeholder='Search for decks or people'/>
                                                    <i className='search icon'/>
                                            </div>
                                            <div className='results'/>
                                        </div>
                                        <div className='button-blk'>
                                            <button className='ui primary button'>
                                                Sign up
                                            </button>
                                            <button className='ui secondary  button'>
                                                Learn more
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                </section>

                {/*<!-- presentation End -->*/}

                <section className='content-container'>
                    <div className='feature-block'>
                        <div className='wrapper'>
                            <div className='ui three column  stackable  grid'>
                                <div className='row'>
                                    <div className='column'>
                                        <div className='feature-content blue-block'>
                                            <div className='feature-left'>
                                                <h2>Find slides</h2>
                                                <h4>Explore the decks lorem ipsum</h4>
                                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eget elit sapien. Nunc semper urna in lectus consectetur fermentum. Vestibulum eu sem pulvinar, sollicitudin ipsum eu, porttitor elit. Maecenas bibendum congue lectus, viligula finibus, sit amet aliquam n ipsum eu, porttitor elit. Maecenas bibendum congue lectus, viligula finibus, sit amet.</p>
                                            </div>
                                            <div className='feature-right'><img src='/assets/images/home/search.jpg' alt=''/></div>
                                        </div>
                                    </div>
                                    <div className='column'>
                                        <div className='feature-content green-block'>
                                            <div className='feature-left'>
                                                <h2>Create slides</h2>
                                                <h4>Learn how to create slides with SlideWiki
                                                </h4>
                                                <p>Create a new deck or import existing slides from PowerPoint (*.pptx) or OpenDocument Presentation (*.odp) files. Your imported slides will be converted into HTML slides to allow you to continue to edit and add new slides.</p>
                                            </div>
                                            <div className='feature-right'><img src='/assets/images/home/add.jpg' alt=''/></div>
                                        </div>
                                    </div>
                                    <div className='column'>
                                        <div className='feature-content red-block'>
                                            <div className='feature-left'>
                                                <h2>Sharing slides
                                                </h2>
                                                <h4>Present, Share and Communicate</h4>
                                                <p>There are many ways that you and your students can engage and interact with slides and decks. Use the Slideshow mode to view a deck as a slideshow. Includes a timer and speaker notes' view. Share decks via social media or email.</p>
                                            </div>
                                            <div className='feature-right'><img src='/assets/images/home/share.jpg' alt=''/></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='signin-outer'>
                        <div className='wrapper'>
                            <div className='signin-blk'>
                                <span>Get started right away.  <a href='#'>Sign in</a></span>
                                <p>Create an account to start creating and sharing your decks. </p>
                            </div>
                        </div>
                    </div>

                   {/* <!-- category starts -->*/}
                    <div className='category-outer'>
                        <div className='ui container'>
                            <div className='ui column '>
                                <div className='row'>
                                    <div className='column'>
                                        <h3>Decks, lorem ipsum dolor sit amet, consectetur adipiscing elit</h3>
                                    </div>
                                </div>
                            </div>
                            <div className='category-list'>
                                <div className='ui three column  stackable grid'>
                                    <div className='row'>
                                        <div className='column'>
                                            <div className='single-category'>
                                                <img src='/assets/images/home/category-img1.svg' alt='img'/>
                                                    <div className='text-blk'>
                                                        <a href='#'>Schools</a>
                                                        <p>Decks for teachers and students. Proin ultricies malesuada mi, id tincidunt ligula imperdiet non. Etiam tristique, odio vitae accumsan hendrerit, libero augue.</p>
                                                    </div>
                                            </div>
                                        </div>
                                        <div className='column'>
                                            <div className='single-category'>
                                                <img src='/assets/images/home/category-img2.svg' alt='img'/>
                                                    <div className='text-blk'>
                                                        <a href='#'>Colleges</a>
                                                        <p>Decks for teachers and students. Proin ultricies malesuada mi, id tincidunt ligula imperdiet non. Etiam tristique, odio vitae accumsan hendrerit, libero augue.</p>
                                                    </div>
                                            </div>
                                        </div>
                                        <div className='column'>
                                            <div className='single-category'>
                                                <img src='/assets/images/home/category-img3.svg' alt='img'/>
                                                    <div className='text-blk'>
                                                        <a href='#'>Training</a>
                                                        <p>Decks for teachers and students. Proin ultricies malesuada mi, id tincidunt ligula imperdiet non. Etiam tristique, odio vitae accumsan hendrerit, libero augue.</p>
                                                    </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*<!-- category End -->*/}

                    {/*<!-- presentation Start -->*/}

                    <div className='presentation-block'>
                        <div className='ui container'>
                            <div className='ui one column grid'>
                                <div className='column'>
                                    <h2>SlideWiki...Create, Share and Enjoy Presentations</h2>
                                    <div className='featured-deck'>
                                        <div className='featured-img'>
                                            <img src='/assets/images/home/featured-img.jpg' alt='Featured Image'/>
                                        </div>
                                        <div className='featured-content'>
                                            <h4>Featured deck</h4>
                                            <div className='featured-post'>
                                                <h5>Introduction to Algebra</h5>
                                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur egestas in sapien in bibendum. Nam vulputate nunc a dictum aliquet. Morbi hendrerit enim in dolor condimentum faucibus. </p>
                                                <a href='#'>Read more...</a>
                                            </div>
                                            <div className='post-desc'>
                                                <p>Creator&#58;<a href='#'>soeren</a></p>
                                                <p>Date&#58;<span>20/08/2018</span></p>
                                            </div>
                                            <div className='post-button'>
                                                <a href='#' className='left-btn'><i className='comments icon'/>24</a>
                                                <a href='#' className='right-btn'><i className='share alternate icon'/>7</a>
                                            </div>
                                        </div>
                                        <div className='deck-link'>
                                            <a href='#'>See  all decks</a>
                                        </div>
                                    </div>
                                    <div className='column'>
                                        <div className='about-block'>
                                            <h4>About SlideWiki</h4>
                                            <p>SlideWiki is an open source development project, funded from the European Union's Horizon 2020 research and innovation programme. The project involves 17 partners to develop, test and trial SlideWiki. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eget elit sapien. Nunc semper urna in lectus consectetur fermentum. Vestibulum eu sem pulvinar, sollicitudin ipsum eu, porttitor elit. Maecenas bibendum congue lectus, vitae. SlideWiki is an open source development project, funded from the European Union's Horizon 2020 research and innovation programme. The project involves 17 partners to develop, test and trial SlideWiki. To find out more or get involved <a href='#'>visit the project webiste.</a></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*<!-- presentation End -->*/}
                </section>

                {/*<!-- content ends -->*/}

            </div>
        );
    }
}

Home.contextTypes = {
    intl: PropTypes.object.isRequired,
    getUser: PropTypes.func.isRequired,
    executeAction: PropTypes.func.isRequired
};


export default Home;



//export default Home;
