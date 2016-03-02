import React from 'react';

class SlideControl extends React.Component {
    componentDidMount() {
        key('right', 'slideControl', this.handleNextClick);
        key('shift+right', 'slideControl', this.handleForwardClick);
        key('left', 'slideControl', this.handlePreviousClick);
        key('shift+left', 'slideControl', this.handleBackwardClick);
    }
    componentWillUnmount() {
        key.unbind('right', 'slideControl');
        key.unbind('shift+right', 'slideControl');
        key.unbind('left', 'slideControl');
        key.unbind('shift+left', 'slideControl');
    }
    handleNextClick(){
        console.log('right key from slideControl');
        key.setScope('slideControl'); // will enable specific slideControl keyborad actions
    }
    handlePreviousClick(){
        console.log('left key from slideControl');
        key.setScope('slideControl'); // will enable specific slideControl keyborad actions
    }
    handleForwardClick(){
        console.log('shift+right key from slideControl');
        key.setScope('slideControl'); // will enable specific slideControl keyborad actions
    }
    handleBackwardClick(){
        console.log('shift+left key from slideControl');

        key.setScope('slideControl'); // will enable specific slideControl keyborad actions
    }
    render() {
        return (
            <div className="sw-slidercontrol" ref="slideControl">
                <div className="panel">
                    <div className="ui top blue small attached progress">
                      <div className="bar"></div>
                    </div>
                    <div className="ui bottom attached segment center aligned">
                        <div className="compact ui icon buttons">
                            <div className="ui button" onClick={this.handleBackwardClick.bind(this)}><i className="icon step backward"></i></div>
                            <div className="ui button" onClick={this.handlePreviousClick.bind(this)}><i className="caret left icon disabled"></i></div>
                            <div className="ui blue button">2/12</div>
                            <div className="ui button" onClick={this.handleNextClick.bind(this)}><i className="icon caret right disabled"></i></div>
                            <div className="ui button" onClick={this.handleForwardClick.bind(this)}><i className="icon step forward"></i></div>
                            <div className="ui teal button"><i className="icon expand"></i></div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default SlideControl;
