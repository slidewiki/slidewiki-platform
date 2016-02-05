import React from 'react';

class SlideControl extends React.Component {
    render() {
        return (
            <div className="sw-slidercontrol" ref="slideControl">
                <div className="panel">
                    <div className="ui top blue small attached progress">
                      <div className="bar"></div>
                    </div>
                    <div className="ui bottom attached segment center aligned">
                        <div className="compact ui icon buttons">
                            <div className="ui button"><i className="icon step backward"></i></div>
                            <div className="ui button"><i className="caret left icon disabled"></i></div>
                            <div className="ui blue button">2/12</div>
                            <div className="ui button"><i className="icon caret right disabled"></i></div>
                            <div className="ui button"><i className="icon step forward"></i></div>
                            <div className="ui teal button"><i className="icon expand"></i></div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default SlideControl;
