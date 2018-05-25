import React from 'react';
import FocusTrap from 'focus-trap-react';
import { Button, Divider, Dropdown, Input, Modal, Popup, Segment } from 'semantic-ui-react';
import { Image as Img}  from 'semantic-ui-react';
import uploadMediaFiles from '../../actions/media/uploadMediaFile';
import { fabric } from 'fabric';

const headerStyle = {
    'textAlign': 'center'
};

const canvasStyle = {
    'height': '0px',
    'width': '0px'
};

class PaintModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalOpen: false,
            activeTrap: false,
            canvasDirty: false,
            license: false,
            licenseValue: 'CC0',
            copyrightHolder: '',
            alt: '',
            title: ''
        };

        //
        this.reader = new FileReader();
        this.primaryColor = 'black';
        this.secondaryColor = 'black';
        this.drawingMode = false;
        this.canvas = null;

        // For undo - redo
        // TODO: properly store the object's modifications for undo-redo, also deletions.
        this.canvas_config = {
            canvasState             : [],
            currentStateIndex       : -1,
            undoStatus              : false,
            redoStatus              : false,
            undoFinishedStatus      : 1,
            redoFinishedStatus      : 1,
            undoDisabled            : true,
            redoDisabled            : true
        };

        this.updateCanvasState = this.updateCanvasState.bind(this);

        this.clipboard = null;
        this.canvasOpen = false;

        //
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.unmountTrap = this.unmountTrap.bind(this);
        this.startFabric = this.startFabric.bind(this);
        this.addRect = this.addRect.bind(this);
        this.addCircle = this.addCircle.bind(this);
        this.addTriangle = this.addTriangle.bind(this);
        //this.getRandomInt = fabric.util.getRandomInt;
        this.addArrow = this.addArrow.bind(this);
        this.addText = this.addText.bind(this);
        this.downloadImg = this.downloadImg.bind(this);
        this.deleteElement = this.deleteElement.bind(this);
        this.setDrawingMode = this.setDrawingMode.bind(this);
        this.setLineWidth = this.setLineWidth.bind(this);
        this.loadImg = this.loadImg.bind(this);
        this.undo = this.undo.bind(this);
        this.redo = this.redo.bind(this);
        this.copyActiveObjects = this.copyActiveObjects.bind(this);
        this.paste = this.paste.bind(this);
        this.showLicense = this.showLicense.bind(this);
        this.submitPressed = this.submitPressed.bind(this);
    }

    componentDidUpdate() {
        let ele = document.querySelector('#fabriccanvas');
        if (ele && !this.canvasOpen) {
            this.startFabric();
            this.canvasOpen = true;
        }
    }

    startFabric(){
        this.canvas = new fabric.Canvas('fabriccanvas');

        $('#fabriccanvas').css('border', '1px solid #000000');
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


        this.canvas.on('object:added', (e) => {
            this.setState({canvasDirty: true});
            this.updateCanvasState();
        });

        this.canvas.on('object:modified', (e) => {
            this.updateCanvasState();
        });

        this.canvas.on('object:removed', (e) => {
            this.updateCanvasState();
        });
    }

    updateCanvasState() {

        if (this.canvas_config.undoStatus === false && this.canvas_config.redoStatus === false) {
            let jsonData = this.canvas.toJSON();
            let canvasAsJson = JSON.stringify(jsonData);
            if (this.canvas_config.currentStateIndex < this.canvas_config.canvasState.length - 1) {
                let indexToBeInserted = this.canvas_config.currentStateIndex + 1;
                this.canvas_config.canvasState[indexToBeInserted] = canvasAsJson;
                let numberOfElementsToRetain = indexToBeInserted + 1;
                this.canvas_config.canvasState = this.canvas_config.canvasState.splice(0, numberOfElementsToRetain);
                this.canvas_config.redoDisabled = true;
            } else {
                this.canvas_config.canvasState.push(canvasAsJson);
                this.canvas_config.undoDisabled = false;
            }
            this.canvas_config.currentStateIndex = this.canvas_config.canvasState.length - 1;
            if ((this.canvas_config.currentStateIndex === this.canvas_config.canvasState.length - 1 ) && this.canvas_config.currentStateIndex !== -1){
                this.canvas_config.redoDisabled = true; ///// ojo
            }
        }

        if (this.canvas_config.currentStateIndex >= 0) {
            this.canvas_config.undoDisabled = false;
        }
    }

    handleOpen(){
        $('#app').attr('aria-hidden', 'true');
        this.setState({
            modalOpen:true,
            activeTrap:true
        });

        this.setState({canvasDirty: false});

    }

    handleClose(){
        $('#app').attr('aria-hidden', 'false');
        this.setState({
            modalOpen: false,
            activeTrap: false,
            license: false,
            licenseValue: 'CC0',
            copyrightHolder: '',
            alt: '',
            title: ''
        });

        this.canvas = null;
        this.canvasOpen = false;
        this.drawingMode = false;
        this.primaryColor = 'black';
        this.secondaryColor = 'black';
        this.setState({canvasDirty: false});
        this.canvas_config = {
            canvasState             : [],
            currentStateIndex       : -1,
            undoStatus              : false,
            redoStatus              : false,
            undoFinishedStatus      : 1,
            redoFinishedStatus      : 1,
            undoDisabled            : true,
            redoDisabled            : true
        };

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
            opacity: 1,
            stroke: this.secondaryColor,
            strokeWidth: this.canvas.freeDrawingBrush.width
        }));
    }

    addCircle() {
        let coord = {left: 10, top: 10};

        this.canvas.add(new fabric.Circle({
            left: coord.left,
            top: coord.top,
            fill: this.primaryColor,
            radius: 50,
            opacity: 1,
            stroke: this.secondaryColor,
            strokeWidth: this.canvas.freeDrawingBrush.width
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
            opacity: 1,
            stroke: this.secondaryColor,
            strokeWidth: this.canvas.freeDrawingBrush.width
        }));
    }

    addText(){
        //let text = 'Insert your text\n   here';

        let textSample = new fabric.IText('Insert your text\n   here', {
            left: 55,
            top: 30,
            fontFamily: 'helvetica',
            angle: 0,
            fill: this.primaryColor,
            scaleX: 0.5,
            scaleY: 0.5,
            fontWeight: '',
            originX: 'left',
            hasRotatingPoint: true,
            centerTransform: true
        });

        this.canvas.add(textSample);
        this.canvas.renderAll();

    }

    addArrow() {
        let path = new fabric.Path('M121.32,0L44.58,0C36.67,0,29.5,3.22,24.31,8.41\
            c-5.19,5.19-8.41,12.37-8.41,20.28c0,15.82,12.87,28.69,28.69,28.69c0,0,4.4,\
            0,7.48,0C36.66,72.78,8.4,101.04,8.4,101.04C2.98,106.45,0,113.66,0,121.32\
            c0,7.66,2.98,14.87,8.4,20.29l0,0c5.42,5.42,12.62,8.4,20.28,8.4c7.66,0,14.87\
            -2.98,20.29-8.4c0,0,28.26-28.25,43.66-43.66c0,3.08,0,7.48,0,7.48c0,15.82,\
            12.87,28.69,28.69,28.69c7.66,0,14.87-2.99,20.29-8.4c5.42-5.42,8.4-12.62,8.4\
            -20.28l0-76.74c0-7.66-2.98-14.87-8.4-20.29C136.19,2.98,128.98,0,121.32,0z');

        this.canvas.add(path.set({ left: 30,
            top: 30,
            fill: this.primaryColor,
            width: 50,
            height: 50,
            opacity: 1,
            stroke: this.secondaryColor,
            strokeWidth: this.canvas.freeDrawingBrush.width
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
        this.forceUpdate();
    }

    setLineWidth(event) {
        let value = parseInt(event.target.value, 10) || 1;
        this.canvas.freeDrawingBrush.width = value;
        this.forceUpdate();
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
        this.canvas_config.redoStatus = false;
        if (this.canvas_config.undoFinishedStatus) {
            if (this.canvas_config.currentStateIndex === -1) {
                this.canvas_config.undoStatus = false;
                this.canvas_config.undoDisabled = true;
            } else {
                if (this.canvas_config.canvasState.length >= 1) {
                    this.canvas_config.undoFinishedStatus = 0;
                    if(this.canvas_config.currentStateIndex !== 0) {
                        this.canvas_config.undoStatus = true;
                        this.canvas.loadFromJSON(this.canvas_config.canvasState[this.canvas_config.currentStateIndex - 1], () => {
                            let jsonData = JSON.parse(this.canvas_config.canvasState[this.canvas_config.currentStateIndex - 1]);
                            this.canvas.renderAll();
                            this.canvas_config.undoStatus = false;
                            this.canvas_config.currentStateIndex -= 1;
                            this.canvas_config.undoDisabled = false;
                            this.canvas_config.redoDisabled = false;
                            this.canvas_config.undoFinishedStatus = 1;
                        });
                    } else if (this.canvas_config.currentStateIndex === 0) {
                        this.canvas.clear();
                        this.canvas_config.undoFinishedStatus = 1;
                        this.canvas_config.undoDisabled = true;
                        //this.canvas_config.undoButton.disabled = 'disabled';
                        this.canvas_config.currentStateIndex -= 1;
                    }
                }
            }
        }
        if (this.canvas_config.currentStateIndex === -1) {
            this.canvas_config.undoDisabled = true;
        }
        this.forceUpdate();
    }

    redo() {

        if(this.canvas_config.redoFinishedStatus) {
            if((this.canvas_config.currentStateIndex === this.canvas_config.canvasState.length - 1) && this.canvas_config.currentStateIndex !== -1) {
                this.canvas_config.redoDisabled = true;
            } else {
                if (this.canvas_config.canvasState.length >= this.canvas_config.currentStateIndex && this.canvas_config.canvasState.length !== 0) {
                    this.canvas_config.redoFinishedStatus = 0;
                    this.canvas_config.redoStatus = true;
                    this.canvas.loadFromJSON(this.canvas_config.canvasState[this.canvas_config.currentStateIndex + 1], () => {
                        let jsonData = JSON.parse(this.canvas_config.canvasState[this.canvas_config.currentStateIndex + 1]);
                        this.canvas.renderAll();
                        this.canvas_config.redoStatur = false;
                        this.canvas_config.currentStateIndex += 1;
                        if(this.canvas_config.currentStateIndex !== -1) {
                            this.canvas_config.undoDisabled = false;
                        }
                        this.canvas_config.redoFinishedStatus = 1;
                        if((this.canvas_config.currentStateIndex === this.canvas_config.canvasState.length - 1) && this.canvas_config.currentStateIndex !== -1) {
                            this.canvas_config.redoDisabled = true;
                            this.canvas_config.redoStatus = false;
                        }
                    });
                }
            }
        }
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

    showLicense() {

        let href = this.canvas.toDataURL({
            format: 'png',
            quality: 1
        });

        let file = this.dataURLtoBlob(href);

        this.setState({
            license: true,
            file: {
                url: href,
                format: 'png',
                name: 'Image',
                size: file.size
            }
        });
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    changeLicense(event, data) {
        this.setState({
            licenseValue: data.value,

        });
    }

    dataURLtoBlob(dataURL) {
        //http://mitgux.com/send-canvas-to-server-as-file-using-ajax
        // Decode the dataURL
        let binary = atob(dataURL.split(',')[1]);
        // Create 8-bit unsigned array
        let array = [];
        for(let i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        // Return our Blob object
        return new Blob([new Uint8Array(array)], {type: 'image/png'});
    }

    submitPressed(e) {
        e.preventDefault();
        if(this.state.copyrightHolder === undefined || this.state.copyrightHolder === ''){this.state.copyrightHolder = this.props.userFullName;}

        let payload = {
            type: 'image/png',
            license: this.state.licenseValue,
            copyrightHolder: this.state.copyrightHolder,
            title: this.state.title || 'Image',
            text: this.state.alt,
            filesize: this.state.file.size,
            filename: 'Image.png',
            bytes: this.state.file.url
        };

        this.context.executeAction(uploadMediaFiles, payload);
        this.handleClose();
        return false;
    }

    render() {
        this.context.getUser().username;
        let submitButtonText = 'Add to Slide';
        let submitButtonIcon = 'arrow right';

        let saveHandler= this.showLicense;

        let heading = 'Draw and Paint';
        let licenseBoxes = '';
        let content = <div>
            <div id="paintModalDescription" tabIndex="0">Draw your own SVG image</div>

            <Segment textAlign="center" >
                <p>Draw inside the canvas using the tools provided.</p>
                <canvas id="fabriccanvas" style={canvasStyle}/>
                <div>
                    <Button onClick={this.addRect}>Add Rectangle</Button>
                    <Button onClick={this.addCircle}>Add Circle</Button>
                    <Button onClick={this.addTriangle}>Add Triangle</Button>
                    {/*<button onClick={this.addText}>Add Text</button>*/}
                    <Button onClick={this.addArrow}>Add Arrow</Button>
                    <Button onClick={this.downloadImg} disabled={!this.state.canvasDirty}>Download Image</Button>
                    <div>
                        <p>Primary color: <input type="color" id="primaryColor"/></p>
                        <p>Border color: <input type="color" id="secondaryColor"/></p>
                    </div>

                    <div className="ui slider checkbox">
                        <input type="checkbox" id="drawing" defaultChecked={this.drawingMode} value={this.drawingMode} onClick={this.setDrawingMode}/>
                        <label htmlFor="drawing">{this.drawingMode ? 'Drawing Mode' : 'Select Mode'}</label>
                    </div>
                    <br/>
                    <Button color="blue" onClick={() => {$('#uploadImage').click();}}> Upload Image</Button>
                    <input type="file" id="uploadImage" style={{ display: 'none' }} onChange={this.loadImg}/>
                    <div>
                        <p>Line/Border Width: </p>
                        <input type="range" min="0" max="50" step="5" onChange={this.setLineWidth} defaultValue={0}/>
                    </div>
                    <Button onClick={this.deleteElement}>Delete selected objects</Button>
                    <Button onClick={this.undo} disabled={this.canvas_config.undoDisabled}>Undo</Button>
                    <Button onClick={this.redo} disabled={this.canvas_config.redoDisabled}>Redo</Button>
                    <Button onClick={this.copyActiveObjects}>Copy Selected Objects</Button>
                    <Button onClick={this.paste}>Paste</Button>
                </div>
            </Segment>
        </div>;

        if(this.state.license){
            heading = 'License information';
            //licenseBoxes = (this.state.licenseValue !== 'CC0') ? <div className="required field"><label htmlFor="copyrightHolder">Image created by/ attributed to:</label><Input id="copyrightHolder" aria-required="true" ref="copyrightHolder" name="copyrightHolder" onChange={this.handleChange.bind(this)} required defaultValue={this.props.userFullName}/></div> : '';
            licenseBoxes = (this.state.licenseValue !== 'CC0') ? <div className="required field"><label htmlFor="copyrightHolder">Image created by/ attributed to:</label><Input id="copyrightHolder" ref="copyrightHolder" name="copyrightHolder" onChange={this.handleChange.bind(this)} aria-label="Copyrightholder" aria-required="true" required defaultValue={this.props.userFullName}/></div> : '';
            content = <div>
                <Img src={this.state.file.url} size="large" centered={true}/>
                <Divider/>
                <form className="ui form" onSubmit={this.submitPressed.bind(this)}>
                    <div className="required field">
                        <label htmlFor="mediaTitle">Title:</label>
                        <Input defaultValue={this.state.file.name} id="mediaTitle" ref="mediaTitle" name="title" onChange={this.handleChange.bind(this)} aria-label="Title of the image" aria-required="true"required autoFocus/>
                    </div>
                    <div className="required field">
                        <label htmlFor="mediaAltText">Description/Alt Text:</label>
                        <Popup trigger={<input id="mediaAltText" ref="mediaAltText" id="UploadMediaModal_input_mediaAltText" name="alt" onChange={this.handleChange.bind(this)} aria-label="Description of the image" aria-required="true" required/>} content='What does the picture mean?' position='top center'/>
                    </div>
                    <div className="required field">
                        <label htmlFor="mediaLicense">Choose a license:</label>
                        <Dropdown id="mediaLicense" selection options={[{text: 'CC0 Public Domain', value: 'CC0'},{text: 'CC-BY Creative Commons Attribution 4.0', value: 'CC BY 4.0'},{text: 'CC-BY-SA Creative Common Attribution Share-Alike 4.0', value: 'CC BY SA 4.0'}]} defaultValue='CC0' onChange={this.changeLicense.bind(this)} ref="mediaLicense" aria-label="Select a license" aria-required="true" required/>
                    </div>
                    {licenseBoxes}
                    <div className="required field">
                        <div className="ui checkbox">
                            <input id="terms" type="checkbox" aria-label="Agree to terms and conditions" aria-required="true" required/>
                            <label htmlFor="terms">I confirm that I have the rights to upload this image as per the SlideWiki <a href="/imprint">terms and conditions</a> and that the <a href="/license">license information</a> I have provided is correct.</label>{/*TODO Add a link to the slidewiki terms/cond site, currently not exising*/}
                        </div>
                    </div>
                    <Button type='submit' id="UploadFormSubmitButton" style={{display: 'none'}}>Submit</Button> {/*black magic hack to trigger the form from the outside*/}
                </form>
            </div>;
            saveHandler = (() => {$('#UploadFormSubmitButton').click();});
            submitButtonText = 'Upload';
            submitButtonIcon = 'upload';
        }


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
                        <h1 style={headerStyle}>{heading}</h1>
                    </Modal.Header>
                    <Modal.Content>
                        <Divider/>
                                {content}
                        <Divider/>
                    </Modal.Content>
                    <Modal.Actions>
                        <button type="cancel" onClick={this.handleClose} className="ui cancel button">
                            <i className="remove icon"/>
                            Cancel
                        </button>
                        <Button id="PaintModalSaveButton" ref="PaintModalSaveButton" color="green" tabIndex="0" type="button"
                                aria-label="Upload" icon={submitButtonIcon} labelPosition='left' content={submitButtonText}
                                disabled={!this.state.canvasDirty}
                                onClick={saveHandler}
                        />
                    </Modal.Actions>
                </FocusTrap>
            </Modal>

        );
    }
}

PaintModal.contextTypes = {
    executeAction: React.PropTypes.func.isRequired,
    intl: React.PropTypes.object.isRequired,
    getUser: React.PropTypes.func
};

export default PaintModal;
