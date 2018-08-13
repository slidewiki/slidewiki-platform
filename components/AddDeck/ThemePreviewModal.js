import React from 'react';
import ThemePreviewCarousel from './ThemePreviewCarousel';
import {Modal} from 'semantic-ui-react';
import classNames from 'classnames';

class ThemePreviewModal extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Modal trigger={<div className={classNames({'ui': true, 'primary': true, 'button': true})} aria-label='Theme Preview' role="button" tabIndex="0" >Theme Preview</div>}>
                <Modal.Header>Choose a theme</Modal.Header>
                <Modal.Content>
                    <ThemePreviewCarousel slides={this.props.slides}/>
                </Modal.Content>
            </Modal>
        );
    }
}

export default ThemePreviewModal;
