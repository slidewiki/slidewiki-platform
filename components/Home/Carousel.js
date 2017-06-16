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
                    <div className="glide">
                      <div className="glide__arrows">
                          <button className="glide__arrow prev ui basic icon button" data-glide-dir="<"><i className="ui big icon chevron left"></i></button>
                          <button className="glide__arrow next ui basic icon button" data-glide-dir=">"><i className="ui big icon chevron right"></i></button>
                      </div>

                      <div className="glide__wrapper">
                          <ul className="glide__track">
                              <li className="glide__slide">
                                <a href="http://slidewiki.org" className="ui medium image">
                                  <img src="/assets/images/carousel/slide1.png" alt="multilingual" />
                                </a>
                              </li>
                              <li className="glide__slide">
                                <a href="http://slidewiki.org" className="ui medium image">
                                  <img src="/assets/images/carousel/slide2.png" alt="feature2" />
                                </a>
                              </li>
                              <li className="glide__slide">
                                <a href="http://slidewiki.org" className="ui medium image">
                                  <img src="/assets/images/carousel/slide3.png" alt="feature3" />
                                </a>
                              </li>
                              <li className="glide__slide">
                                <a href="http://slidewiki.org" className="ui medium image">
                                  <img src="/assets/images/carousel/slide4.png" alt="feature4" />
                                </a>
                              </li>
                          </ul>
                      </div>

                      <div className="glide__bullets"></div>
                    </div>
                </div>

                <div className="four wide column">
                  <div className="ui fluid vertical divided menu">
                    <a className="item gslide-header gh1" data-glide-trigger='.glide' data-glide-dir='=1'>
                      Feature 1
                    </a>
                    <a className="item gslide-header gh2" data-glide-trigger='.glide' data-glide-dir='=2'>
                      Feature 2
                    </a>
                    <a className="item gslide-header gh3" data-glide-trigger='.glide' data-glide-dir='=3'>
                      Feature 3
                    </a>
                    <a className="item gslide-header gh4" data-glide-trigger='.glide' data-glide-dir='=4'>
                      Feature 4
                    </a>
                  </div>
                  <button onClick={this.togglePause.bind(this)} className="ui small icon button fluid">{this.state.paused ? <i className="ui play small icon"></i> : <i className="ui pause small icon"></i>}</button>
                </div>
            </div>

          </div>
        );
    }
}


export default Carousel;
