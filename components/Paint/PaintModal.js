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
};

class PaintModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalOpen: false,
            activeTrap: false
        };

        //
        this.reader = new FileReader();
        this.primaryColor = 'black';
        this.secondaryColor = 'black';
        this.drawingMode = false;
        this.canvas = null;

        // For undo - redo
        /*this.canvasState = {
            current: null,
            list: [],
            state: [],
            index: 0,
            index2: 0,
            action: false,
            refresh: true,
        };
*/
        this.objectsStack = [];
        this.clipboard = null;

        //
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.unmountTrap = this.unmountTrap.bind(this);
        this.startFabric = this.startFabric.bind(this);
        this.addRect = this.addRect.bind(this);
        this.addCircle = this.addCircle.bind(this);
        this.addTriangle = this.addTriangle.bind(this);
        this.downloadImg = this.downloadImg.bind(this);
        this.deleteElement = this.deleteElement.bind(this);
        this.setDrawingMode = this.setDrawingMode.bind(this);
        this.setLineWidth = this.setLineWidth.bind(this);
        this.loadImg = this.loadImg.bind(this);
        this.undo = this.undo.bind(this);
        this.redo = this.redo.bind(this);
        this.copyActiveObjects = this.copyActiveObjects.bind(this);
        this.paste = this.paste.bind(this);
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

        // Adding event listeners to the color inputs.

        let primaryColorInput = document.getElementById('primaryColor');
        let secondaryColorInput = document.getElementById('secondaryColor');

        if (primaryColorInput) {
            primaryColorInput.addEventListener('input', () => {
                this.primaryColor = primaryColorInput.value;
                this.canvas.freeDrawingBrush.color = this.primaryColor;
            });

            secondaryColorInput.addEventListener('input', () => {
                this.secondaryColor = secondaryColorInput.value;
            });
        }

        /*event handler for the file reader*/
        this.reader.onload = (event) => {
            let imgObj = new Image();
            imgObj.src = event.target.result;
            imgObj.onload = () => {
                let image = new fabric.Image(imgObj);
                image.set({
                    angle: 0,
                    padding: 0
                });
                this.canvas.centerObject(image);
                this.canvas.add(image);
                this.canvas.renderAll();
            };
        };

        /*
        // Event handlers for undo/redo
        this.canvas.on("object:added", (e) => {
            let object = e.target;
            //console.log('object:modified');

            if (this.canvasState.action === true) {
                this.canvasState.state = [this.canvasState.state[this.canvasState.index2]];
                this.canvasState.list = [this.canvasState.list[this.canvasState.index2]];
                this.canvasState.list = this.canvasState.list[];
                this.canvasState.action = false;
                this.canvasState.index = 1;
            }
            object.saveState();

            console.log(JSON.stringify(object.originalState));
            this.canvasState.state[this.canvasState.index] = object;
            this.canvasState.list[this.canvasState.index] = object;
            this.canvasState.index++;
            this.canvasState.index2 = this.canvasState.index - 1;
            this.canvasState.refresh = true;
        });

        this.canvas.on("object:modified", (e) => {
            let object = e.target;
            //console.log('object:modified');

            if (this.action === true) {
                this.canvasState.state = [this.canvasState.state[this.canvasState.index2]];
                this.canvasState.list = [this.canvasState.list[this.canvasState.index2]];

                this.canvasState.action = false;
                //console.log(state);
                this.canvasState.index = 1;
            }

            object.saveState();

            this.canvasState.state[this.canvasState.index] = object.originalState;
            this.list[this.canvasState.index] = object;
            this.canvasState.index++;
            this.canvasState.index2 = this.canvasState.index - 1;

            //console.log(state);
            this.canvasState.refresh = true;
        });*/

        // After each render save state of canvas

    }

    handleOpen(){
        $('#app').attr('aria-hidden', 'true');
        this.setState({
            modalOpen:true,
            activeTrap:true
        });
    }

    handleClose(){
        $('#app').attr('aria-hidden', 'false');
        this.setState({
            modalOpen: false,
            activeTrap: false
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
            fill: this.primaryColor,
            width: 50,
            height: 50,
            opacity: 1
        }));
    }

    addCircle() {
        let coord = {left: 10, top: 10};

        this.canvas.add(new fabric.Circle({
            left: coord.left,
            top: coord.top,
            fill: this.primaryColor,
            radius: 50,
            opacity: 1
        }));
    }

    addTriangle() {
        let coord = {left: 10, top: 10};

        this.canvas.add(new fabric.Triangle({
            left: coord.left,
            top: coord.top,
            fill: this.primaryColor,
            width: 50,
            height: 50,
            opacity: 1
        }));
    }

    deleteElement() {
        let activeObjects = this.canvas.getActiveObjects();
        this.canvas.discardActiveObject();
        if (activeObjects.length) {
            this.canvas.remove.apply(this.canvas, activeObjects);
        }
    }

    setDrawingMode() {
        this.drawingMode = !this.drawingMode;
        this.canvas.isDrawingMode = this.drawingMode;
    }

    setLineWidth(event) {
        let value = parseInt(event.target.value, 10) || 1;
        this.canvas.freeDrawingBrush.width = value;
    }

    loadImg(event) {
        this.reader.readAsDataURL(event.target.files[0]);
    }

    downloadImg() {
        let href = this.canvas.toDataURL({
            format: 'png',
            quality: 1
        });

        let url = href.replace(/^data:image\/[^;]+/, 'data:application/octet-stream');


        let a = document.createElement('a');
        a.style = 'display: none';
        a.href = url;
        a.download = 'image.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }


    undo() {
        let objects = this.canvas.getObjects();
        if (objects.length !== 0) {
            let last = objects[objects.length - 1];
            this.objectsStack.push(last);
            this.canvas.remove(last);
            this.canvas.renderAll();
        }
        /*
        if (this.canvasState.index <= 0) {
            this.canvasState.index = 0;
            return;
        }

        if (this.canvasState.refresh === true) {
            this.canvasState.index--;
            this.canvasState.refresh = false;
        }

        this.canvasState.index2 = this.canvasState.index - 1;
        this.canvasState.current = this.canvasState.list[this.canvasState.index2];
        console.log(this.canvasState.current);
        console.log(this.canvasState.state);
        this.canvasState.current = this.canvasState.state[this.canvasState.index2];

        this.canvasState.index--;

        this.canvasState.current.setCoords();
        this.canvas.renderAll();
        this.canvasState.action = true;
*/
    }

    redo() {

        if (this.objectsStack.length > 0) {
            let object = this.objectsStack.pop();
            this.canvas.add(object);
        }

        /*
        this.canvasState.action = true;
        if (this.canvasState.index >= this.canvasState.state.length - 1) {
            return;
        }

        this.canvasState.index2 = this.canvasState.index + 1;
        this.canvasState.current = this.canvasState.list[this.canvasState.index2];
        this.canvasState.current.setOptions(JSON.parse(this.canvasState.state[this.canvasState.index2]));

        this.canvasState.index++;
        this.canvasState.current.setCoords();
        this.canvas.renderAll();
        */
    }

    copyActiveObjects() {

        this.canvas.getActiveObject().clone((cloned) => {
            this.clipboard = cloned;
        });

    }

    paste() {

        this.clipboard.clone( (clonedObj) => {
            this.canvas.discardActiveObject();
            clonedObj.set({
                left: clonedObj.left + 10,
                top: clonedObj.top + 10,
                evented: true,
            });

            if (clonedObj.type === 'activeSelection') {
                // active selection needs a reference to the canvas.
                clonedObj.canvas = this.canvas;
                clonedObj.forEachObject((obj) => {
                    this.canvas.add(obj);
                });
                // this should solve the unselectability
                clonedObj.setCoords();
            } else {
                this.canvas.add(clonedObj);
            }
            this.clipboard.top += 10;
            this.clipboard.left += 10;
            this.canvas.setActiveObject(clonedObj);
            this.canvas.requestRenderAll();
        });
    }

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
                                    <button onClick={this.startFabric} onKeyPress={(evt) => this.handleKeyPress(evt, 'startFabric')}>Click and start drawing!</button>

                                    <canvas id="fabriccanvas" style={canvasStyle}/>
                                    <div>
                                        <button onClick={this.addRect}>Add Rectangle</button>
                                        <button onClick={this.addCircle}>Add Circle</button>
                                        <button onClick={this.addTriangle}>Add Triangle</button>
                                        <button onClick={this.downloadImg}>Download Image</button>
                                        <input type="color" id="primaryColor"/>
                                        <input type="color" id="secondaryColor"/>
                                        <button onClick={this.deleteElement}>Delete selected objects</button>
                                        <br/>
                                        <div className="ui slider checkbox">
                                            <input type="checkbox" name="newsletter" onClick={this.setDrawingMode}/>
                                            <label>Drawing mode</label>
                                        </div>
                                        <input type="range" min="0" max="50" onChange={this.setLineWidth}/>
                                        <p>Load Image! </p><input type="file" onChange={this.loadImg}/>

                                        <button onClick={this.undo}>Undo</button>
                                        <button onClick={this.redo}>Redo</button>
                                        <button onClick={this.copyActiveObjects}>Copy Selected Objects</button>
                                        <button onClick={this.paste}>Paste</button>
                                    </div>
                                </Segment>
                            </Segment>

                        </Container>
                        <div className="actions">
                            <button type="cancel" onClick={this.handleClose} className="ui cancel button">
                                <i className="remove icon"/>
                                Cancel
                            </button>
                        </div>
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
