import PropTypes from 'prop-types';
import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import FocusTrap from 'focus-trap-react';
import { Button, Divider, Dropdown, Icon, Input, Modal, Popup, Segment } from 'semantic-ui-react';
import { Image as Img}  from 'semantic-ui-react';
import uploadMediaFiles from '../../actions/media/uploadMediaFile';
import updateGraphic from '../../actions/media/updateGraphic';
import finishPaintEdition from '../../actions/paint/finishPaintEdition';
import PaintModalStore from '../../stores/PaintModalStore';
import { fabric } from 'fabric';
import {FormattedMessage, defineMessages} from 'react-intl';

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
        this.transparency = 1;
        this.noActiveObject = true;
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
        this.addArrow = this.addArrow.bind(this);
        this.addText = this.addText.bind(this);
        this.downloadImg = this.downloadImg.bind(this);
        this.deleteElement = this.deleteElement.bind(this);
        this.setDrawingMode = this.setDrawingMode.bind(this);
        this.setLineWidth = this.setLineWidth.bind(this);
        this.setTransparency = this.setTransparency.bind(this);
        this.sendBackwards = this.sendBackwards.bind(this);
        this.bringForwards= this.bringForwards.bind(this);
        this.loadImg = this.loadImg.bind(this);
        this.undo = this.undo.bind(this);
        this.redo = this.redo.bind(this);
        this.copyActiveObjects = this.copyActiveObjects.bind(this);
        this.paste = this.paste.bind(this);
        this.getDrawedCoordinates = this.getDrawedCoordinates.bind(this);
        this.showLicense = this.showLicense.bind(this);
        this.submitPressed = this.submitPressed.bind(this);

        // Messages
        this.messages = defineMessages({
            paintTitle: {
                id: 'paintModal.title',
                defaultMessage: 'Draw your own SVG image'
            },
            primaryColourInput: {
                id: 'paintModal.primaryColourInput',
                defaultMessage: 'Primary colour: '
            },
            secondaryColourInput: {
                id: 'paintModal.secondaryColourInput',
                defaultMessage: 'Secondary colour: '
            },
            lineBorderWidthInput: {
                // <FormattedMessage id="paintModal.lineBorderWidth" defaultMessage="Line/Border Width:"/>
                id: 'paintModal.lineBorderWidthInput',
                defaultMessage: 'Line/Border Width:'
            },
            transparencyInput: {
                id: 'paintModal.transparencyInput',
                defaultMessage: 'Object Transparency:'
            },
            drawingMode: {
                id: 'paintModal.drawingMode',
                defaultMessage: 'Drawing Mode'
            },
            selectMode: {
                id: 'paintModal.selectMode',
                defaultMessage: 'Select Mode'
            },
            addToSlide: {
                id: 'paintModal.addToSlide',
                defaultMessage: 'Add to Slide'
            },
            paintHeading: {
                id: 'oaintModal.paintHeading',
                defaultMessage: 'Draw and Paint'
            },
            licenseHeading: {
                id: 'paintModal.licenseHeading',
                defaultMessage: 'License information'
            },
            undo: {
                id: 'paintModal.undo',
                defaultMessage: 'Undo'
            },
            redo: {
                id: 'paintModal.redo',
                defaultMessage: 'Redo'
            },
            bringForwards: {
                id: 'paintModal.bringForwards',
                defaultMessage: 'Bring Forwards'
            },
            sendBackwards: {
                id: 'paintModal.sendBackwards',
                defaultMessage: 'Send Backwards'
            },
            uploadImage: {
                id: 'paintModal.uploadImage',
                defaultMessage: 'Upload Image'
            },
            downloadImage: {
                id: 'paintModal.downloadImage',
                defaultMessage: 'Download Image'
            },
            clone: {
                id: 'paintModal.clone',
                defaultMessage: 'Clone Selected Objects'
            },
            delete: {
                id: 'paintModal.delete',
                defaultMessage: 'Delete Selected Objects'
            },
            addCircle: {
                id: 'paintModal.addCircle',
                defaultMessage: 'Add Circle'
            },
            addRectangle: {
                id: 'paintModal.addRectangle',
                defaultMessage: 'Add Rectangle'
            },
            addTriangle: {
                id: 'paintModal.addTriangle',
                defaultMessage: 'Add Triangle'
            },
            addArrow: {
                id: 'paintModal.addArrow',
                defaultMessage: 'Add Arrow'
            },
            paintInstruction: {
                id: 'paintModal.instruction',
                defaultMessage: 'Draw inside the canvas using the tools provided.'
            },
            copyrightholder: {
                id: 'paintModal.copyrightholder',
                defaultMessage: 'Copyrightholder'
            },
            imageAttribution: {
                id: 'paintModal.imageAttribution',
                defaultMessage: 'Image created by/ attributed to:'
            },
            imageTitle: {
                id: 'paintModal.imageTitle',
                defaultMessage: 'Title:'
            },
            imageTitleAria: {
                id: 'paintModal.imageTitleAria',
                defaultMessage: 'Title of the image'
            },
            imageDescription: {
                id: 'paintModal.imageDescription',
                defaultMessage: 'Description/Alt Text:'
            },
            imageDescriptionAria: {
                id: 'paintModal.imageDescriptionAria',
                defaultMessage: 'Description of the image'
            },
            imageDescriptionQuestion: {
                id: 'paintModal.imageDescriptionQuestion',
                defaultMessage: 'What does the picture mean?'
            },
            chooseLicense: {
                id: 'paintModal.chooseLicense',
                defaultMessage: 'Choose a license:'
            },
            selectLicense: {
                id: 'paintModal.selectLicense',
                defaultMessage: 'Select a license'
            },
            agreementAria: {
                id: 'paintModal.agreementAria',
                defaultMessage: 'Agree to terms and conditions'
            },
            agreement1: {
                id: 'paintModal.agreement1',
                defaultMessage: 'I confirm that I have the rights to upload this image as per the SlideWiki '
            },
            agreement2: {
                id: 'paintModal.agreement2',
                defaultMessage: 'terms and conditions'
            },
            agreement3: {
                id: 'paintModal.agreement3',
                defaultMessage: 'and that the'
            },
            agreement4: {
                id: 'paintModal.agreement4',
                defaultMessage: 'license information'
            },
            agreement5: {
                id: 'paintModal.agreement5',
                defaultMessage: 'I have provided is correct.'
            },
            paintButton: {
                id: 'paintModal.paintButton',
                defaultMessage: 'Paint'
            },
            upload: {
                id: 'paintModal.upload',
                defaultMessage: 'Upload'
            },
            cancel: {
                id: 'paintModal.cancel',
                defaultMessage: 'Cancel'
            }
        });
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
                    padding: 0,
                    opacity: this.transparency
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

        this.canvas.on('selection:created', (e) => {
            this.noActiveObject = false;
            this.forceUpdate();
        });

        this.canvas.on('selection:cleared', (e) => {
            this.noActiveObject = true;
            this.forceUpdate();
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

        this.context.executeAction(finishPaintEdition);

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
            opacity: this.transparency,
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
            opacity: this.transparency,
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
            opacity: this.transparency,
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
        let points = [
            {x: 0, y: 20},
            {x: 60, y: 20},
            {x: 60, y: 10},
            {x: 80, y: 40},
            {x: 60, y: 70},
            {x: 60, y: 60},
            {x: 0, y: 60},
            {x: 0, y: 20}
        ];

        this.canvas.add(new fabric.Polygon(points, {
            left: 30,
            top: 30,
            fill: this.primaryColor,
            stroke: this.secondaryColor,
            opacity: this.transparency,
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

    setTransparency(event) {
        let value = parseInt(event.target.value, 10) || 1;
        if( value !== 0 ) {
            this.transparency = 1 - value/100;
        } else {
            this.transparency = 1;
        }
        this.forceUpdate();
    }

    sendBackwards() {
        let actObjects = this.canvas.getActiveObject();
        if (actObjects) {
            this.canvas.sendBackwards(actObjects);
        }
    }

    bringForwards(){
        let actObjects = this.canvas.getActiveObject();
        if (actObjects) {
            this.canvas.bringForward(actObjects);
        }
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
        this.paste();

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

    getDrawedCoordinates(objects) {
        let coordinates = {
            minX: 10000,
            minY: 10000,
            maxX: 0,
            maxY: 0
        };

        for (let i = 0; i < objects.length; i++){
            let coords = objects[i].aCoords;
            for (let coord in coords) {
                if (coords[coord].x > coordinates.maxX) coordinates.maxX = coords[coord].x;
                if (coords[coord].y > coordinates.maxY) coordinates.maxY = coords[coord].y;
                if (coords[coord].x < coordinates.minX) coordinates.minX = coords[coord].x;
                if (coords[coord].y < coordinates.minY) coordinates.minY = coords[coord].y;
            }
        }

        return coordinates;
    }

    showLicense() {

        let coordinates = this.getDrawedCoordinates(this.canvas.getObjects());
        let href = this.canvas.toSVG({
            suppressPreamble: true,
            width: coordinates.maxX - coordinates.minX,
            height: coordinates.maxY - coordinates.minY,
            viewBox: {
                x: coordinates.minX,
                y: coordinates.minY,
                width: coordinates.maxX - coordinates.minX,
                height: coordinates.maxY - coordinates.minY
            }
        });

        this.setState({
            license: true,
            file: {
                url: href,
                format: 'svg+xml',
                name: 'Image',
                size: href.length
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

    /*dataURLtoBlob(dataURL) {
        //http://mitgux.com/send-canvas-to-server-as-file-using-ajax
        // Decode the dataURL
        let binary = atob(dataURL.split(',')[1]);
        // Create 8-bit unsigned array
        let array = [];
        for(let i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        // Return our Blob object
        return new Blob([new Uint8Array(array)], {type: 'image/svg+xml'});
    }*/

    submitPressed(e) {
        e.preventDefault();
        if(this.state.copyrightHolder === undefined || this.state.copyrightHolder === ''){this.state.copyrightHolder = this.props.userFullName;}

        let paintModalState = this.props.PaintModalStore;

        if(paintModalState.toEdit === 'SVG') {
            let payload = {
                url: this.props.PaintModalStore.url,
                type: 'image/svg+xml',
                license: this.state.licenseValue,
                copyrightHolder: this.state.copyrightHolder,
                title: this.state.title || 'Image',
                text: this.state.alt,
                filesize: this.state.file.size,
                filename: 'Image.svg',
                bytes: this.state.file.url
            };
            this.context.executeAction(updateGraphic, payload);
        } else {
            let payload = {
                type: 'image/svg+xml',
                license: this.state.licenseValue,
                copyrightHolder: this.state.copyrightHolder,
                title: this.state.title || 'Image',
                text: this.state.alt,
                filesize: this.state.file.size,
                filename: 'Image.svg',
                bytes: this.state.file.url
            };
            this.context.executeAction(uploadMediaFiles, payload);

        }

        this.handleClose();
        return false;
    }

    componentWillReceiveProps(nextProps) {
        let src = nextProps.PaintModalStore.url;
        let ext = null;
        if (src) ext = src.split('.')[src.split('.').length - 1];
        let title = nextProps.PaintModalStore.title ? nextProps.PaintModalStore.title : '';
        let alt = nextProps.PaintModalStore.altText ? nextProps.PaintModalStore.altText : '';

        this.setState({
            title: title,
            alt: alt
        });
        if(nextProps.PaintModalStore.toEdit && nextProps.PaintModalStore.toEdit !== 'Image'){
            this.handleOpen();
            let str = nextProps.PaintModalStore.svg;
            fabric.loadSVGFromString(str, (objects) => {
                for (let i = 0; i < objects.length; i++){
                    this.canvas.add(objects[i]);
                }
                // Black Magic to render correctly imported SVGs from a Slide... please don't remove, unless
                // you find a better solution (real solution)
                let dummy = new fabric.Rect({ width: 20, height: 20, left: 30, top:0 });
                this.canvas.add(dummy);
                this.undo();
                // Black Magic ends here.
                this.canvas.renderAll();
            });
        } else if (nextProps.PaintModalStore.toEdit) {
            this.handleOpen();
            fabric.Image.fromURL(nextProps.PaintModalStore.url, (oImg) => {
                this.canvas.add(oImg);
                this.canvas.renderAll();
            });
        }
    }

    handleKeyPress = (event, param) => {
        if(event.key === 'Enter'){
           // console.log('enter key');
            if(param === 'handlePaintOpen') {
                this.handleOpen();
            }
        }
    }

    render() {
        this.context.getUser().username;
        let submitButtonText = this.context.intl.formatMessage(this.messages.addToSlide);
        let submitButtonIcon = 'arrow right';
        let modePadding = {'paddingBottom': '1.5em', 'paddingTop': '1.5em'};

        let saveHandler= this.showLicense;

        let mode = this.drawingMode ? (<div><Icon name="pencil"/> {this.context.intl.formatMessage(this.messages.drawingMode)}</div>) : (<div><Icon name="hand point up outline"/>{this.context.intl.formatMessage(this.messages.selectMode)}</div>);

        let heading = this.context.intl.formatMessage(this.messages.paintHeading);
        let licenseBoxes = '';
        let content = <div>
            <div id="paintModalDescription" tabIndex="0">{this.context.intl.formatMessage(this.messages.paintTitle)}</div>

            <Segment textAlign="center" >
                <div className="ui padded grid">
                    <div className="four wide column">
                        <div className="ui grid">
                            <div className="sixteen wide column">
                                <Button className="icon button" onClick={this.undo} disabled={this.canvas_config.undoDisabled} data-tooltip={this.context.intl.formatMessage(this.messages.undo)} aria-label={this.context.intl.formatMessage(this.messages.undo)}><Icon name="reply"/></Button>
                                <Button className="icon button" onClick={this.redo} disabled={this.canvas_config.redoDisabled} data-tooltip={this.context.intl.formatMessage(this.messages.redo)} aria-label={this.context.intl.formatMessage(this.messages.redo)}><Icon name="share"/></Button>
                                <Button className="icon button" onClick={this.bringForwards} disabled={this.noActiveObject} data-tooltip={this.context.intl.formatMessage(this.messages.bringForwards)} aria-label={this.context.intl.formatMessage(this.messages.bringForwards)}><Icon name="arrow up"/></Button>
                                <Button className="icon button" onClick={this.sendBackwards} disabled={this.noActiveObject} data-tooltip={this.context.intl.formatMessage(this.messages.sendBackwards)} aria-label={this.context.intl.formatMessage(this.messages.sendBackwards)}><Icon name="arrow down"/></Button>
                            </div>
                        </div>
                        <div className="ui grid">
                            <div className="sixteen wide column">
                                <Button className="icon button" onClick={() => {$('#uploadImage').click();}} data-tooltip={this.context.intl.formatMessage(this.messages.uploadImage)} aria-label={this.context.intl.formatMessage(this.messages.uploadImage)}><Icon name="upload"/></Button>
                                <input type="file" id="uploadImage" style={{ display: 'none' }} onChange={this.loadImg}/>
                                <Button className="icon button" onClick={this.downloadImg} disabled={!this.state.canvasDirty} data-tooltip={this.context.intl.formatMessage(this.messages.downloadImage)} aria-label={this.context.intl.formatMessage(this.messages.downloadImage)}><Icon name="download"/></Button>
                                <Button className="icon button" onClick={this.copyActiveObjects} data-tooltip={this.context.intl.formatMessage(this.messages.clone)} aria-label={this.context.intl.formatMessage(this.messages.clone)}><Icon name="copy"/></Button>
                                <Button className="icon button" onClick={this.deleteElement} data-tooltip={this.context.intl.formatMessage(this.messages.delete)} aria-label={this.context.intl.formatMessage(this.messages.delete)}><Icon name="trash"/></Button>
                            </div>
                        </div><br/>
                        <Button className="icon button" onClick={this.addRect} data-tooltip={this.context.intl.formatMessage(this.messages.addRectangle)} aria-label={this.context.intl.formatMessage(this.messages.addRectangle)}><Icon name="stop"/></Button>
                        <Button className="icon button" onClick={this.addCircle} data-tooltip={this.context.intl.formatMessage(this.messages.addCircle)} aria-label={this.context.intl.formatMessage(this.messages.addCircle)}><Icon name="circle"/></Button>
                        <Button className="icon button" onClick={this.addTriangle} data-tooltip={this.context.intl.formatMessage(this.messages.addTriangle)} aria-label={this.context.intl.formatMessage(this.messages.addTriangle)}><Icon name="caret up"/></Button>
                        {/*<button onClick={this.addText}>Add Text</button>*/}
                        <Button className="icon button" onClick={this.addArrow} data-tooltip={this.context.intl.formatMessage(this.messages.addArrow)} aria-label={this.context.intl.formatMessage(this.messages.addArrow)}><Icon name="arrow right"/></Button>
                        <br/>
                        <div className="ui slider checkbox" style={modePadding}>
                            <input type="checkbox" id="drawing" defaultChecked={this.drawingMode} value={this.drawingMode} onClick={this.setDrawingMode} aria-label={this.drawingMode ? this.context.intl.formatMessage(this.messages.drawingMode) : this.context.intl.formatMessage(this.messages.selectMode)}/>
                            <label htmlFor="drawing">{mode}</label>
                            {/*<label htmlFor="drawing">{this.drawingMode ? '<Icon name="pencil alternate"/> Drawing Mode' : '<Icon name="mouse pointer"/> Select Mode'}</label>*/}
                        </div>
                        <br/>
                        <div>
                            <p><label htmlFor="primaryColor">{this.context.intl.formatMessage(this.messages.primaryColourInput)}</label> <input type="color" id="primaryColor"/></p>
                            <p><label htmlFor="secondaryColor">{this.context.intl.formatMessage(this.messages.secondaryColourInput)}</label> <input type="color" id="secondaryColor"/></p>
                        </div>
                        <br/>
                        <div>
                            <p><label htmlFor="widthInput">{this.context.intl.formatMessage(this.messages.lineBorderWidthInput)}</label> </p>
                            <input type="range" min="0" max="50" step="5" onChange={this.setLineWidth} defaultValue={0} id="widthInput"/>
                        </div>
                        <div>
                            <p><label htmlFor="widthInput">{this.context.intl.formatMessage(this.messages.transparencyInput)}</label> </p>
                            <input type="range" min="0" max="100" step="5" onChange={this.setTransparency} defaultValue={0} id="widthInput"/>
                        </div>
                    </div>
                    <div className="twelve wide column">
                        <p>{this.context.intl.formatMessage(this.messages.paintInstruction)}</p>
                        <canvas id="fabriccanvas" style={canvasStyle}/>
                    </div>
                </div>
            </Segment>
        </div>;

        if(this.state.license){
            heading = this.context.intl.formatMessage(this.messages.licenseHeading);
            let innerSvg = '<svg' + this.state.file.url.split('<svg')[1];
            //licenseBoxes = (this.state.licenseValue !== 'CC0') ? <div className="required field"><label htmlFor="copyrightHolder">Image created by/ attributed to:</label><Input id="copyrightHolder" aria-required="true" ref="copyrightHolder" name="copyrightHolder" onChange={this.handleChange.bind(this)} required defaultValue={this.props.userFullName}/></div> : '';
            licenseBoxes = (this.state.licenseValue !== 'CC0') ? <div className="required field"><label htmlFor="copyrightHolder">{this.context.intl.formatMessage(this.messages.imageAttribution)}</label><Input id="copyrightHolder" ref="copyrightHolder" name="copyrightHolder" onChange={this.handleChange.bind(this)} aria-label={this.context.intl.formatMessage(this.messages.copyrightholder)} aria-required="true" required defaultValue={this.props.userFullName}/></div> : '';
            content = <div>
                {/*<Img src={this.state.file.url} size="large" centered={true}/>*/}
                <div style={{ textAlign: 'center' }} dangerouslySetInnerHTML={{ __html: innerSvg }} />
                <Divider/>
                <form className="ui form" onSubmit={this.submitPressed.bind(this)}>
                    <div className="required field">
                        <label htmlFor="mediaTitle">{this.context.intl.formatMessage(this.messages.imageTitle)}</label>
                        <Input defaultValue={this.state.title ? this.state.title : 'Image'} id="mediaTitle" ref="mediaTitle" name="title" onChange={this.handleChange.bind(this)} aria-label={this.context.intl.formatMessage(this.messages.imageTitleAria)} aria-required="true"required autoFocus/>
                    </div>
                    <div className="required field">
                        <label htmlFor="mediaAltText">{this.context.intl.formatMessage(this.messages.imageDescription)}</label>
                        <Popup trigger={<input id="mediaAltText" ref="mediaAltText" id="UploadMediaModal_input_mediaAltText" name="alt" onChange={this.handleChange.bind(this)} aria-label={this.context.intl.formatMessage(this.messages.imageDescriptionAria)} aria-required="true" defaultValue={this.state.alt ? this.state.alt : ''} required/>} content={this.context.intl.formatMessage(this.messages.imageDescriptionQuestion)} position='top center'/>
                    </div>
                    <div className="required field">
                        <label htmlFor="mediaLicense">{this.context.intl.formatMessage(this.messages.chooseLicense)}</label>
                        <Dropdown id="mediaLicense" selection options={[{text: 'CC0 Public Domain', value: 'CC0'},{text: 'CC-BY Creative Commons Attribution 4.0', value: 'CC BY 4.0'},{text: 'CC-BY-SA Creative Common Attribution Share-Alike 4.0', value: 'CC BY SA 4.0'}]} defaultValue='CC0' onChange={this.changeLicense.bind(this)} ref="mediaLicense" aria-label={this.context.intl.formatMessage(this.messages.selectLicense)} aria-required="true" required/>
                    </div>
                    {licenseBoxes}
                    <div className="required field">
                        <div className="ui checkbox">
                            <input id="terms" type="checkbox" aria-label={this.context.intl.formatMessage(this.messages.agreementAria)} aria-required="true" required/>
                            <label htmlFor="terms">{this.context.intl.formatMessage(this.messages.agreement1)}<a href="/imprint" target="_blank"> {this.context.intl.formatMessage(this.messages.agreement2)} </a>{this.context.intl.formatMessage(this.messages.agreement3)}<a href="/license" target="_blank"> {this.context.intl.formatMessage(this.messages.agreement4)} </a>{this.context.intl.formatMessage(this.messages.agreement5)}</label>{/*TODO Add a link to the slidewiki terms/cond site, currently not exising*/}
                        </div>
                    </div>
                    <Button type='submit' id="UploadFormSubmitButton" style={{display: 'none'}}>Submit</Button> {/*black magic hack to trigger the form from the outside*/}
                </form>
            </div>;
            saveHandler = (() => {$('#UploadFormSubmitButton').click();});
            submitButtonText = this.context.intl.formatMessage(this.messages.upload);
            submitButtonIcon = 'upload';
        }
        return(

            <Modal
                trigger={
                    <a className="item" id="paintModalTrigger" role="button" onClick={this.handleOpen} onKeyPress={(evt) => this.handleKeyPress(evt, 'handlePaintOpen')}>
                        <i tabIndex="0" className="paint brush icon"></i>{this.context.intl.formatMessage(this.messages.paintButton)}
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
                        <button onClick={this.handleClose} className="ui cancel button">
                            <i className="remove icon"/>
                            {this.context.intl.formatMessage(this.messages.cancel)}
                        </button>
                        <Button id="PaintModalSaveButton" ref="PaintModalSaveButton" color="green" tabIndex="0" type="button"
                                aria-label={this.context.intl.formatMessage(this.messages.upload)} icon={submitButtonIcon} labelPosition='left' content={submitButtonText}
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
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    getUser: PropTypes.func
};

PaintModal = connectToStores(PaintModal, [PaintModalStore], (context, props) => {
    return {
        PaintModalStore: context.getStore(PaintModalStore).getState()
    };
});
export default PaintModal;
