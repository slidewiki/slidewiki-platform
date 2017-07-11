import React, {PropTypes} from 'react';
import {NavLink} from 'fluxible-router';

class Carousel extends React.Component {
    constructor(props) {
        super(props);
        this.slider = null;
        this.state = {paused: 0};
    }
    componentDidMount(){
        this.slider = $('.glide').glide({
            type: 'slideshow',
            autoplay: 8000,
            centered: true,
            keyboard: true,
            afterTransition: function(data){
                $('.gslide-header').removeClass('active');
                $('.gh' + data.index).addClass('active');
            },
        });
        //display carousel
        $('.hide-element').removeClass('hide-element');
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
        return (
            <div ref="carousel">
                <div className="ui fluid container grid " style={{minHeight: '200px'}}>       
                        <div className="twelve wide column center aligned">
                            <div className="glide" tabIndex="-1">
                                <div className="glide__arrows hide-element">
                                    <button className="glide__arrow prev ui basic icon button" data-glide-dir="<" tabIndex="-1"><i className="ui big icon chevron left"></i></button>
                                    <button className="glide__arrow next ui basic icon button" data-glide-dir=">" tabIndex="-1"><i className="ui big icon chevron right"></i></button>
                                </div>

                                <div className="glide__wrapper hide-element">
                                    <ul className="glide__track">
                                        <li className="glide__slide" >
                                            <a href="http://slidewiki.org" className="ui big image" tabIndex="-1">
                                                <img src="/assets/images/carousel/SW-deck.png" alt="Create slides with SlideWiki." />
                                            </a>
                                        </li>
                                        <li className="glide__slide" >
                                            <a href="http://slidewiki.org" className="ui big image" tabIndex="-1">
                                                <img src="/assets/images/carousel/OER-Logo.png" alt="Repurpose & Reuse Educational Content through open educational resources." />
                                            </a>
                                        </li>
                                        <li className="glide__slide" >
                                            <a href="http://slidewiki.org" className="ui big image" tabIndex="-1">
                                                <img src="/assets/images/carousel/collaborative-hands.png" alt="Collaborative Content Authoring." />
                                            </a>
                                        </li>
                                        <li className="glide__slide" >
                                            <a href="http://slidewiki.org" className="ui big image" tabIndex="-1">
                                                <img src="/assets/images/carousel/globe-smartphone.png" alt="Supporting Knowledge Communities." />
                                            </a>
                                        </li>
                                    </ul>
                                </div>

                                <div className="glide__bullets"></div>
                            </div>
                            <div onClick={this.togglePause.bind(this)} className="ui lightGrey right labeled icon button" role="button" tabIndex="0" >{this.state.paused ? <i className="ui play icon">Play</i> : <i className="ui pause icon">Pause</i>}</div>

                        </div>

                        <div className="four wide column">
                            <div className="ui fluid vertical divided menu">
                                <a className="item gslide-header gh1" tabIndex="0" data-glide-trigger='.glide' data-glide-dir='=1'>
                                    Create Online Slide Decks
                                </a>
                                <a className="item gslide-header gh2" tabIndex="0" data-glide-trigger='.glide' data-glide-dir='=2'>
                                    Repurpose and Reuse Educational Content
                                </a>
                                <a className="item gslide-header gh3" tabIndex="0" data-glide-trigger='.glide' data-glide-dir='=3'>
                                    Collaborative Content Authoring
                                </a>
                                <a className="item gslide-header gh4" tabIndex="0" data-glide-trigger='.glide' data-glide-dir='=4'>
                                    Supporting Knowledge Communities
                                </a>
                            </div>


                        </div>
                        <div className="one wide column"></div>
                    </div>
                </div>
       
        );
    }
}


export default Carousel;
