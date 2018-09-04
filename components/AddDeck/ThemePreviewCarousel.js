import React from 'react';

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
            startAt: self.findThemeIndex(self.props.initialTheme, self.props.slides),
            autoplay: false,
            centered: true,
            keyboard: true,
            autoheight: true,
            afterTransition: function(data) {
                let themeIndex = (data.index !== 0) ? data.index - 1 : self.props.slides.length - 1;
                self.onSelectTheme(self.props.slides[themeIndex].value, null);
                $('.gslide-header').removeClass('active');
                $('.gh' + data.index).addClass('active');
            }
        });
    }

    componentWillReceiveProps(newProps) {
        console.log('parent: ' + newProps.initialTheme);
        if (!this.props.initialTheme && newProps.initialTheme) {
            console.log('setting initialTheme');
            this.setStart(newProps.initialTheme);
            this.initialTheme = newProps.initialTheme;
        }
    }

    setStart(theme) {
        let themeIndex = this.findThemeIndex(theme, this.props.slides);
        this.slider.data('glide_api').go('=' + themeIndex);
    }

    findThemeIndex(theme, slides) {
        for (let i = 0; i < slides.length; i++) {
            console.log(slides[i].value, theme);
            if (theme === slides[i].value) return i + 1;
        }
    }

    onSelectTheme(themeValue, e) {
        console.log(themeValue);
        this.props.callback(themeValue);
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
            <ul className="glide__track" data-glide-el="track" style={{minHeight: '300px'}}>
                {slides}
            </ul>
        );
    }

    render() {
        return (
            <div ref="theme-preview-carousel">
                <div className="ui grid">
                    <div className="column center aligned">
                        <div className="ui segment">
                                <div className="glide" tabIndex="-1">
                                    <div className="glide__arrows hide-element">
                                        <button className="glide__arrow prev ui basic icon button" data-glide-dir="<" tabIndex="-1"><i className="ui big icon chevron left"></i></button>
                                        <button className="glide__arrow next ui basic icon button" data-glide-dir=">" tabIndex="-1"><i className="ui big icon chevron right"></i></button>
                                    </div>
                                    { this.createSlides() }
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ThemePreviewCarousel;
