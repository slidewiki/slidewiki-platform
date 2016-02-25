import React from 'react';
import {NavLink} from 'fluxible-router';

class SingleTreeNode extends React.Component {
    makeSelectorPath(nodePath) {
        let out = [], slectorPath = '';
        nodePath.forEach((element, index) => {
            out.push(element.join(':'));
        });
        slectorPath = '/' + out.join(';');
        return slectorPath;
    }
    render() {
        let slectorPath = this.makeSelectorPath(this.props.nodePath);
        let isSelected = '';
        if(slectorPath === ('/' + this.props.selector.spath)){
            isSelected = ' ->';
        }
        return (
            <div className="item">
                <NavLink href={'/deck/' + this.props.rootNode.id + '/' + this.props.item.type + '/' + this.props.item.id + slectorPath}>
                    {this.props.item.type === 'slide' ? <i className="ui file icon"></i> : <i className="ui folder open icon"></i>}
                    {this.props.item.title}
                </NavLink>
                <b>{isSelected}</b>
            </div>
        );
    }
}

export default SingleTreeNode;
