import React, { Component, PropTypes } from 'react';
import {styles, properties} from './base';

const ensureThisOnly = (typeCheck, notAllowed) => {
    return (props, propName, componentName) => {
        if (typeCheck(props, propsName, componentName) === true) {
            return notAllowed
             .filter((notAllowedPropName) => props[notAllowedPropName] !== undefined ).length > 0 ?
             new Error(`${componentName}: if ${propsName} is set ${notAllowed.join(',')} aren't allowed.`) :
             true;
        }
    };
};

export default class Thumbnail extends Component {

    static propTypes = {
        style: PropTypes.object,

        page: PropTypes.string,
        sandbox: PropTypes.string,

        width: PropTypes.number,
        height: PropTypes.number,

        pageWidth: ensureThisOnly(PropTypes.number, ['scale']),
        pageHeight: ensureThisOnly(PropTypes.number, ['scale']),

        scale: ensureThisOnly(PropTypes.number, ['pageWidth', 'pageHeight']),

        interactive: PropTypes.bool,

        keepAspectRatio: PropTypes.string,

        showWhileLoading: PropTypes.bool,
    }

    static defaultProps = {
        interactive: false,
        showWhileLoading: true,
    }

    doLayout() {
        window.requestAnimationFrame(function onNextDraw() {
            const {width, height} = React.findDOMNode(this).getBoundingClientRect();
            this.setState({
                width: width,
                height: height,
            });
        }); //TODO: previosly   }.bind(this)); Lint suggested use this without bind
    }

    showWhenReady(element) {
        element.getDOMNode().addEventListener('load', (e) => {
            e.srcElement.style.visibility = 'visible';
        });
    }

    renderDummy() {
        return <div ref={this.doLayout.bind(this)}></div>;
    }

    getScaleBasedStyles( scale ) {
        return {
            width: `${100 * scale}%`,
            height: `${100 * scale}%`,
            transform: `scale(${1 / scale})`,
        };
    }

    getDimensionBasedStyles( state, pageWidth, pageHeight, keepAspectRatio ) {
        let scaleW = state.width  / pageWidth;
        let scaleH = state.height / pageHeight;

        if (keepAspectRatio === 'width') scaleH = scaleW;
        if (keepAspectRatio === 'height') scaleW = scaleH;

        return {
            width: pageWidth,
            height: pageHeight,
            transform: `scale(${scaleW}, ${scaleH})`,
        };
    }

    renderThumbnail({ children, page, scale, interactive, pageWidth, pageHeight, keepAspectRatio, showWhileLoading, state}) {
        const baseStyle = scale !== undefined ?
                        this.getScaleBasedStyles( scale ) :
                        this.getDimensionBasedStyles( state, pageWidth, pageHeight, keepAspectRatio );

        const interactiveStyle = interactive ? styles.interactive : styles.noninteractive;

        const sourceProps = page !== undefined ?
                        { src: page } :
                        { srcDoc: React.renderToStaticMarkup(children) };

        const interactiveProps = interactive ? {} : properties.noninteractive;

        const showWhileLoadingStyle = showWhileLoading ? {} : { visibility: 'hidden' };

        const propWidthHeightStyle = {
            width: this.props.width,
            height: this.props.height,
        };

        const containerStyle = { ...styles.container, ...showWhileLoadingStyle, ...propWidthHeightStyle, ...this.props.style };
        const iFrameStyle    = { ...styles.frame,     ...baseStyle,             ...interactiveStyle };
        const iFrameProps    = { ...sourceProps,      ...interactiveProps};

        return (
          <div style={ containerStyle }>
            <iframe ref={this.showWhenReady.bind(this)} style={ iFrameStyle } { ...iFrameProps } />
          </div>
        );
    }

    componentWillMount() {
        const { width, height } = this.props;
        if (width !== undefined && height !== undefined) {
            this.setState({
                width,
                height,
            });
        }
    }

    render() {
        return  this.state === null ?
            this.renderDummy() :  // On first render pass
            this.renderThumbnail({ // on second render pass
                ...this.props,
                state: this.state,
            });
    }
}
