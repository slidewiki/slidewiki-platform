import React from 'react';
import ContentModePanel from './ContentModePanel/ContentModePanel';
import SlidePanel from './SlidePanel/SlidePanel';

class ContentPanel extends React.Component {
    render() {
        return (
            <div className="sw-content-panel" ref="contentPanel">
                <ContentModePanel />
                <SlidePanel />
             </div>
        );
    }
}

export default ContentPanel;
