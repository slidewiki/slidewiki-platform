import React from 'react';
import FocusTrap from 'focus-trap-react';
import { Container, Modal, Segment } from 'semantic-ui-react';
const headerStyle = {
    'textAlign': 'center'
};

const canvasStyle = {
    'height': '0px',
    'width': '0px',
    'border': '1px solid #000000'
}

class PaintModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalOpen: false,
            activeTrap: false
        };

        this.canvas = null;
        this.handleOpen = this.handleOpen.bind(this);
        this.startFabric = this.startFabric.bind(this);
        this.addRect = this.addRect.bind(this);
        this.addCircle = this.addCircle.bind(this);
        this.addTriangle = this.addTriangle.bind(this);
    }

    componentDidMount() {
        this.startFabric();
    }

    componentDidUpdate() {

    }

    startFabric(){
        this.canvas = new fabric.Canvas('fabriccanvas');

        this.canvas.setHeight(500);
        this.canvas.setWidth(600);

    }

    handleOpen(){
        $('#app').attr('aria-hidden', 'true');
        this.setState({
            modalOpen:true,
            activeTrap:true
        });


    }

    unmountTrap() {
        if(this.state.activeTrap){
            this.setState({ activeTrap: false });
            $('#app').attr('aria-hidden','false');
        }
    }

    addRect() {
        let coord = {left: 10, top: 10};
        this.canvas.add(new fabric.Rect({
            left: coord.left,
            top: coord.top,
            fill: 'red',
            width: 50,
            height: 50,
            opacity: 1
        }));
    };

    addCircle() {
        let coord = {left: 10, top: 10};

        this.canvas.add(new fabric.Circle({
            left: coord.left,
            top: coord.top,
            fill: 'blue',
            radius: 50,
            opacity: 1
        }));
    };

    addTriangle() {
        let coord = {left: 10, top: 10};

        this.canvas.add(new fabric.Triangle({
            left: coord.left,
            top: coord.top,
            fill: 'yellow',
            width: 50,
            height: 50,
            opacity: 1
        }));
    };


    render() {

        return(

            <Modal
                trigger={
                    <a className="item" id="paintModalTrigger" role="button" onClick={this.handleOpen} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleOpen')}>
                        <i tabIndex="0" className="paint brush icon"></i> Paint
                    </a>
                }
                open={this.state.modalOpen}
                onOpen={this.handleOpen}
                onClose={this.handleClose}
                id="paintModal"
                aria-labelledby="paintModalHeader"
                aria-describedby="paintModalDescription"
                tabIndex="0"
            >
                <FocusTrap
                    id="focus-trap-paintModal"
                    className = "header"
                    active={this.state.activeTrap}
                    focusTrapOptions={{
                        onDeactivate:this.unmountTrap,
                        clickOutsideDeactivates:true,
                        initialFocus: '#paintModalDescription'
                    }}
                >
                    <Modal.Header className="ui center aligned" id="paintModalHeader">
                        <h1 style={headerStyle}>Draw and Paint</h1>
                    </Modal.Header>
                    <Modal.Content>
                        <Container>
                            <Segment color="blue" textAlign="left" padded>
                                <div id="paintModalDescription" tabIndex="0">Draw your own SVG image</div>

                                <Segment textAlign="center" >
                                    <p>Draw inside the canvas using the tools provided.</p>
                                    <button onClick={this.startFabric} onKeyPress={(evt) => this.handleKeyPress(evt, 'stratFabric')}>Click and start drawing!</button>

                                    <canvas id="fabriccanvas" style={canvasStyle}></canvas>
                                    <div>
                                        <button onClick={this.addRect}>Add Rectangle</button>
                                        <button onClick={this.addCircle}>Add Circle</button>
                                        <button onClick={this.addTriangle}>Add Triangle</button>
                                    </div>
                                </Segment>
                            </Segment>

                        </Container>

                    </Modal.Content>

                </FocusTrap>
            </Modal>

        );
    }
}

PaintModal.contextTypes = {
    executeAction: React.PropTypes.func.isRequired,
    intl: React.PropTypes.object.isRequired
};

export default PaintModal;
