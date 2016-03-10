import React, { PropTypes } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

class ShadowScrollbars extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            scrollTop: 0,
            scrollHeight: 0,
            clientHeight: 0
        };
    }

    handleScrollFrame(values) {
        const { scrollTop, scrollHeight, clientHeight } = values;
        this.setState({ scrollTop, scrollHeight, clientHeight });
    }

    componentWillReceiveProps(props) {
        //recalculate scroll values and scroll to top
        const { scrollbars } = this.refs;
        const { scrollTop, scrollHeight, clientHeight } = scrollbars.getValues();
        this.setState({ scrollTop, scrollHeight, clientHeight });
        scrollbars.scrollToTop();
    }

    render() {
        const { style } = this.props;
        const { scrollTop, scrollHeight, clientHeight } = this.state;
        const containerStyle = {
            style,
            position: 'relative'
        };
        const shadowTopStyle = {
            opacity: (scrollTop - 20) / 20,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 10,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%,rgba(0,0,0,0) 100%)'
        };

        const shadowBottomStyle = {
            opacity: !clientHeight ? 1 : (scrollHeight - clientHeight - scrollTop - 20) / 20,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 10,
            background: 'linear-gradient(to top, rgba(0,0,0,0.2) 0%,rgba(0,0,0,0) 100%)'
        };

        return (
            <div style={containerStyle}>
                <Scrollbars
                    autoHide={true}
                    autoHideTimeout={1000}
                    ref="scrollbars"
                    onScrollFrame={this.handleScrollFrame.bind(this)}
                    {...this.props}/>
                <div style={shadowTopStyle}/>
                <div style={shadowBottomStyle}/>
            </div>
        );
    }
}

ShadowScrollbars.propTypes = {
    style: PropTypes.object
};

export default ShadowScrollbars;
