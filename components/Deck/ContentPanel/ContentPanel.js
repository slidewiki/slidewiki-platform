import React from 'react';
import SlidePanel from './SlidePanel/SlidePanel';

class ContentPanel extends React.Component {
    render() {
        return (
            <div className="sw-content-panel" ref="contentPanel">
                <div className="ui top attached tabular menu">
                    <a className="item active">
                        View
                    </a>
                    <a className="item">
                        Edit
                    </a>
                    <a className="item">
                        Questions<span className="ui tiny label">12</span>
                    </a>
                    <div className="item">
                        <a title="Comments">
                            <i className="comments red large icon"></i><span>5</span>
                        </a>
                    </div>
                    <div className="item">
                        <a title="download">
                            <i className="download icon"></i>
                        </a>
                        <a title="print">
                            <i className="print icon"></i>
                        </a>
                        <a title="export">
                            <i className="share external icon"></i>
                        </a>
                            <a title="share">
                                <i className="share alternate icon"></i>
                            </a>
                            <a title="play">
                                <i className="right green play icon"></i>
                            </a>
                    </div>
                </div>

                <div className="ui segment">
                    <SlidePanel />
                </div>

             </div>
        );
    }
}

export default ContentPanel;
