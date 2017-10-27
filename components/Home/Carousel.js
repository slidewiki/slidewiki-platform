import React, {PropTypes} from 'react';
import { NavLink } from 'fluxible-router';
import { FormattedMessage, defineMessages} from 'react-intl';

class Carousel extends React.Component {
    constructor(props) {
        super(props);
        this.slider = null;
        this.state = {paused: 0};
    }
    componentDidMount(){
        let self = this;
        $('.gslide-header').removeClass('active');
        $('.gh1').addClass('active');
        //display carousel
        $('.hide-element').removeClass('hide-element');
        this.slider = $('.glide').glide({
            type: 'slideshow',
            autoplay: 6000,
            centered: true,
            keyboard: true,
            autoheight: true,
            centered: true,
            afterTransition: function(data){
                $('.gslide-header').removeClass('active');
                $('.gh' + data.index).addClass('active');
                //in case a user manually runs the carousel in pause mode
                if(self.state.paused){
                    self.setState({paused: 0});
                }
            },
        });
    }
    togglePause() {
        if(this.state.paused){
            this.slider.data('glide_api').start(4000);
        }else{
            this.slider.data('glide_api').pause();
        }
        this.setState({paused: !this.state.paused});
    }
    render() {
        const PauseStyle = {
            backgroundColor: '#FFFFFF',
            opacity: '1.0',
            boxShadow: '0 0 0 1px rgba(34,36,38,.15) inset',
            borderColor: '#1E78BB'
        };
        return (
            <div ref="carousel">
                <div className="ui grid " >
                    <div className="one wide column"></div>
                    <div className="fourteen wide column center aligned">
                        <div className="ui segment" >
                            <div className="ui two column fluid stackable grid">
                                <div className="eleven wide column">
                                    <div className="glide" tabIndex="-1">
                                        <div className="glide__arrows hide-element">
                                            <button className="glide__arrow prev ui basic icon button" data-glide-dir="<" tabIndex="-1"><i className="ui big icon chevron left"></i></button>
                                            <button className="glide__arrow next ui basic icon button" data-glide-dir=">" tabIndex="-1"><i className="ui big icon chevron right"></i></button>
                                        </div>

                                        <div className="glide__wrapper hide-element">
                                            <ul className="glide__track" style={{minHeight: '300px'}}>
                                                <li className="glide__slide">
                                                    <NavLink href="/discover" className="ui large image" tabIndex="-1">
                                                    <FormattedMessage id="carousel.create_alt" defaultMessage='Create slides with SlideWiki.'>
                                                    {
                                                        (alt) => <img
                                                                    src="/assets/images/carousel/SW-logo-squ.png"
                                                                    alt={alt}
                                                                 />
                                                    }
                                                    </FormattedMessage>
                                                    </NavLink>
                                                </li>
                                                <li className="glide__slide" >
                                                    <NavLink href="/discover" className="ui large image" tabIndex="-1">
                                                        <FormattedMessage id="carousel.reuse_alt" defaultMessage='Repurpose & Reuse Educational Content through open educational resources.'>
                                                        {
                                                            (alt) => <img
                                                                        src="/assets/images/carousel/OER-Logo.png"
                                                                        alt={alt}
                                                                     />
                                                        }
                                                        </FormattedMessage>
                                                    </NavLink>
                                                </li>
                                                <li className="glide__slide" >
                                                    <NavLink href="/discover" className="ui large image" tabIndex="-1">
                                                        <FormattedMessage id="carousel.collaborative_alt" defaultMessage='Collaborative Content Authoring.'>
                                                        {
                                                            (alt) => <img
                                                                        src="/assets/images/carousel/hands-1926704_640.png"
                                                                        alt={alt}
                                                                     />
                                                        }
                                                        </FormattedMessage>
                                                    </NavLink>
                                                </li>
                                                <li className="glide__slide" >
                                                    <NavLink href="/discover" className="ui large  image" tabIndex="-1">
                                                        <FormattedMessage id="carousel.communities_alt" defaultMessage='Supporting Knowledge Communities.'>
                                                        {
                                                            (alt) => <img
                                                                        src="/assets/images/carousel/globe-squ-transparent.png"
                                                                        alt={alt}
                                                                     />
                                                        }
                                                        </FormattedMessage>
                                                    </NavLink>
                                                </li>
                                            </ul>

                                        </div>

                                        <div onClick={this.togglePause.bind(this)} className="ui icon button" style={PauseStyle} role="button" tabIndex="0" aria-label= {this.state.paused ? 'Play'
                                            : 'Pause'}>
                                            {this.state.paused ? <i className="play blue icon"></i> : <i className="pause blue icon"></i>}
                                        </div>

                                    </div>

                                </div>

                                <div className="left aligned five wide column">
                                    <h2><FormattedMessage id="carousel.menu.title" defaultMessage='Discover SlideWiki'/></h2>
                                    <div className="ui right vertical fluid compact menu">
                                        <NavLink className="item gslide-header gh1"  data-glide-trigger='.glide' href="/discover" data-glide-dir='=1'>
                                            <div className="content">
                                                <div className="ui small header">
                                                    <FormattedMessage id="carousel.menu.1" defaultMessage='Create Online Slide Decks'/>
                                                </div>
                                                <div className="description"><FormattedMessage id="carousel.menu.1_desc" defaultMessage='Use our  slide creator or import your existing slides to form online HTML slide decks.'/>
                                                </div>
                                            </div>
                                        </NavLink>
                                        <NavLink className="item gslide-header gh2" data-glide-trigger='.glide' data-glide-dir='=2' href="/discover" >
                                            <div className="content">
                                                <div className="ui small header">
                                                    <FormattedMessage id="carousel.menu.2" defaultMessage='Reuseable Educational Content'/>
                                                </div>
                                                <div className="description"><FormattedMessage id="carousel.menu.2_desc" defaultMessage='Discover a wide range of open educational slides and courses.'/></div>
                                            </div>
                                        </NavLink>
                                        <NavLink className="item gslide-header gh3"  data-glide-trigger='.glide' href="/discover" href="/discover" data-glide-dir='=3'>
                                            <div className="content">
                                                <div className="ui small header"><FormattedMessage id="carousel.menu.3" defaultMessage='Collaborative Content Authoring'/>
                                                </div>
                                                <div className="description"><FormattedMessage id="carousel.menu.3_desc" defaultMessage='Create slides online together with peers and colleagues through our collaborative editing features.'/></div>
                                            </div>
                                        </NavLink>
                                        <NavLink className="item gslide-header gh4"  href="/discover" data-glide-trigger='.glide' data-glide-dir='=4'>
                                            <div className="content">
                                                <div className="ui small header"><FormattedMessage id="carousel.menu.4" defaultMessage='Supporting Knowledge Communities'/>
                                                </div>
                                                <div className="description"><FormattedMessage id="carousel.menu.4_desc" defaultMessage='Using our search and tags features discover content and authors who share your interests.'/></div>
                                            </div>
                                        </NavLink>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="one wide column"></div>
                </div>
            </div>

        );
    }
}


export default Carousel;
