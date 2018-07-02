import React from 'react';

class GuidesHelp extends React.Component {
    render() {
        return (
            this.context.executeAction(navigateAction, {
                url: '/playlist/26?sort=order'
            })
        );
    }
}

export default GuidesHelp;
