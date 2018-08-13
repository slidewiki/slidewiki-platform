import React from 'react';
import { NavLink } from 'fluxible-router';

class ThemePreviewCarousel extends React.Component {

    constructor(props) {
        super(props);
        this.slider = null;
        this.state = {paused: 0};
    }

    componentDidMount() {
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

    createSlides() {
        let slides = [];

        for (let i=0; i<this.props.slides.length; i++) {
            slides.push(
                <li className="glide__slide" key={i}>
                    <img src={this.props.slides[i].img}/>
                </li>
            );
        }
        return (
            <div className="glide__wrapper hide-element">
                <ul className="glide__track" style={{minHeight: '300px'}}>
                    {slides}
                </ul>
            </div>
        );
    }

    render() {
        const PauseStyle = {
            backgroundColor: '#FFFFFF',
            opacity: '1.0',
            boxShadow: '0 0 0 1px rgba(34,36,38,.15) inset',
            borderColor: '#1E78BB'
        };
        return (
            <div ref="theme-preview-carousel">
                <div className="ui grid">
                    <div className="column center aligned">
                        <div className="ui segment">
                            {/*<div className="ui fluid stackable grid">*/}
                                <div className="glide" tabIndex="-1">
                                    <div className="glide__arrows hide-element">
                                        <button className="glide__arrow prev ui basic icon button" data-glide-dir="<" tabIndex="-1"><i className="ui big icon chevron left"></i></button>
                                        <button className="glide__arrow next ui basic icon button" data-glide-dir=">" tabIndex="-1"><i className="ui big icon chevron right"></i></button>
                                    </div>

                                    { this.createSlides() }

                                    {/*<div onClick={this.togglePause.bind(this)} className="ui icon button" style={PauseStyle} role="button" tabIndex="0" aria-label= {this.state.paused ? 'Play':'Pause'}>*/}
                                        {/*{this.state.paused ? <i className="play blue icon"/> : <i className="pause blue icon"/>}*/}
                                    {/*</div>*/}
                                </div>
                            {/*</div>*/}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ThemePreviewCarousel;
