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
            type: 'carousel',
            autoplay: 4000,
            centered: true,
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
            <div className="ui fluid container two column grid" style={{minHeight: '200px'}}>

                <div className="twelve wide column center aligned">
                    <div className="glide" tabIndex="-1">
                      <div className="glide__arrows hide-element">
                          <button className="glide__arrow prev ui basic icon button" data-glide-dir="<" tabIndex="-1"><i className="ui big icon chevron left"></i></button>
                          <button className="glide__arrow next ui basic icon button" data-glide-dir=">" tabIndex="-1"><i className="ui big icon chevron right"></i></button>
                      </div>

                      <div className="glide__wrapper hide-element">
                          <ul className="glide__track">
                              <li className="glide__slide" >
                                <a href="http://slidewiki.org" className="ui medium image" tabIndex="-1">
                                  <img src="/assets/images/carousel/slide1.png" alt="multilingual" />
                                </a>
                              </li>
                              <li className="glide__slide" >
                                <a href="http://slidewiki.org" className="ui medium image" tabIndex="-1">
                                  <img src="/assets/images/carousel/slide2.png" alt="feature2" />
                                </a>
                              </li>
                              <li className="glide__slide" >
                                <a href="http://slidewiki.org" className="ui medium image" tabIndex="-1">
                                  <img src="/assets/images/carousel/slide3.png" alt="feature3" />
                                </a>
                              </li>
                              <li className="glide__slide" >
                                <a href="http://slidewiki.org" className="ui medium image" tabIndex="-1">
                                  <img src="/assets/images/carousel/slide4.png" alt="feature4" />
                                </a>
                              </li>
                          </ul>
                      </div>

                      <div className="glide__bullets"></div>
                    </div>
                    <button onClick={this.togglePause.bind(this)} className="ui tiny primary icon button" aria-label="pause carousel">{this.state.paused ? <i className="ui play small icon"></i> : <i className="ui pause small icon"></i>}</button>
                </div>

                <div className="four wide column">
                  <div className="ui fluid vertical divided menu">
                    <a className="item gslide-header gh1" tabIndex="0" data-glide-trigger='.glide' data-glide-dir='=1'>
                      Multilingual Content
                    </a>
                    <a className="item gslide-header gh2" tabIndex="0" data-glide-trigger='.glide' data-glide-dir='=2'>
                      Content Reuse and Repurpose
                    </a>
                    <a className="item gslide-header gh3" tabIndex="0" data-glide-trigger='.glide' data-glide-dir='=3'>
                      Collaborative Content Authoring
                    </a>
                    <a className="item gslide-header gh4" tabIndex="0" data-glide-trigger='.glide' data-glide-dir='=4'>
                      Knowledge Communities
                    </a>
                  </div>

                </div>
            </div>

          </div>
        );
    }
}


export default Carousel;
