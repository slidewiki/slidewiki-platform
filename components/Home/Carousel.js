import React, {PropTypes} from 'react';
import {NavLink} from 'fluxible-router';

class Carousel extends React.Component {
    constructor(props) {
        super(props);
        this.slider = null;
        this.state = {paused: 0};
    }
    componentDidMount(){
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
                                                    <a href="http://slidewiki.org" className="ui medium image" tabIndex="-1">
                                                        <img src="/assets/images/carousel/slidewiki-300x106px.png" alt="Create slides with SlideWiki." />
                                                    </a>
                                                </li>
                                                <li className="glide__slide" >
                                                    <a href="http://slidewiki.org" className="ui medium image" tabIndex="-1">
                                                        <img src="/assets/images/carousel/OER_Logo_300x92px.png" alt="Repurpose & Reuse Educational Content through open educational resources." />
                                                    </a>
                                                </li>
                                                <li className="glide__slide" >
                                                    <a href="http://slidewiki.org" className="ui medium image" tabIndex="-1">
                                                        <img src="/assets/images/carousel/handshake_300x145px.png" alt="Collaborative Content Authoring." />
                                                    </a>
                                                </li>
                                                <li className="glide__slide" >
                                                    <a href="http://slidewiki.org" className="ui medium image" tabIndex="-1">
                                                        <img src="/assets/images/carousel/globe_300x134px.png" alt="Supporting Knowledge Communities." />
                                                    </a>
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
                                    <h2>Discover SlideWiki</h2>
                                    <div className="ui right vertical fluid compact menu">
                                        <NavLink className="item gslide-header gh1"  data-glide-trigger='.glide' href="/features" data-glide-dir='=1'>
                                            <div className="content">
                                                <div className="ui small header">
                                                    Create Online Slide Decks
                                                </div>
                                                <div className="description">description</div>
                                            </div>
                                        </NavLink>
                                        <NavLink className="item gslide-header gh2" data-glide-trigger='.glide' data-glide-dir='=2' href="/features" >
                                            <div className="content">
                                                <div className="ui small header">
                                                    Reuseable Educational Content
                                                </div>
                                                <div className="description">description</div>
                                            </div>
                                        </NavLink>
                                        <NavLink className="item gslide-header gh3"  data-glide-trigger='.glide' href="/features" href="/features" data-glide-dir='=3'>
                                            <div className="content">
                                                <div className="ui small header">Collaborative Content Authoring
                                                </div>
                                                <div className="description">description</div>
                                            </div>
                                        </NavLink>
                                        <NavLink className="item gslide-header gh4"  href="/features" data-glide-trigger='.glide' data-glide-dir='=4'>
                                            <div className="content">
                                                <div className="ui small header">Supporting Knowledge Communities
                                                </div>
                                                <div className="description">description</div>
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
