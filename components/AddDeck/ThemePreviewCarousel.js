import React from 'react';
import { NavLink } from 'fluxible-router';

class ThemePreviewCarousel extends React.Component {

    constructor(props) {
        super(props);
        this.slider = null;
    }

    componentDidMount() {
        let self = this;
        $('.gslide-header').removeClass('active');
        $('.gh1').addClass('active');
        //display carousel
        $('.hide-element').removeClass('hide-element');
        this.slider = $('.glide').glide({
            type: 'slideshow',
            autoplay: false,
            centered: true,
            keyboard: true,
            autoheight: true,
            afterTransition: function(data){
                $('.gslide-header').removeClass('active');
                $('.gh' + data.index).addClass('active');
            },
        });
    }

    onSelectTheme(themeValue, e) {
        this.props.callback(themeValue);
    }

    createSlides() {
        let slides = [];

        for (let i=0; i<this.props.slides.length; i++) {
            slides.push(
                <li className="glide__slide" key={i}>
                    <img src={this.props.slides[i].img}
                         onClick={(e) => this.onSelectTheme(this.props.slides[i].value, e)}/>
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
