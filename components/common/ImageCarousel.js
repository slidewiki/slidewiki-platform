import React from 'react';

class ImageCarousel extends React.Component {

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
            startAt: self.findImageIndex(self.props.initialImage, self.props.slides),
            autoplay: false,
            centered: true,
            keyboard: true,
            autoheight: true,
            afterTransition: function(data) {
                let imageIndex = (data.index !== 0) ? data.index - 1 : self.props.slides.length - 1;
                self.onSelectImage(self.props.slides[imageIndex].value, null);
                $('.gslide-header').removeClass('active');
                $('.gh' + data.index).addClass('active');
            }
        });
    }

    componentWillReceiveProps(newProps) {
        console.log('parent: ' + newProps.initialImage);
        if (!this.props.initialImage && newProps.initialImage) {
            console.log('setting initialImage');
            this.setStart(newProps.initialImage);
            this.initialImage = newProps.initialImage;
        }
    }

    setStart(theme) {
        let imageIndex = this.findImageIndex(theme, this.props.slides);
        this.slider.data('glide_api').go('=' + imageIndex);
    }

    findImageIndex(image, slides) {
        for (let i = 0; i < slides.length; i++) {
            console.log(slides[i].value, image);
            if (image === slides[i].value) return i + 1;
        }
    }

    onSelectTheme(imageValue, e) {
        console.log(imageValue);
        this.props.callback(imageValue);
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

export default ImageCarousel;
