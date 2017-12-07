import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import classNames from 'classnames';
import NavigationPanel from './../NavigationPanel/NavigationPanel';
import changeTemplate from '../../../actions/slide/changeTemplate';
import addInputBox from '../../../actions/slide/addInputBox';
import uploadMediaClick from '../../../actions/slide/uploadMediaClick';
import uploadVideoClick from '../../../actions/slide/uploadVideoClick';

class SlideEditPanel extends React.Component {

    constructor(props) {
        super(props);
        this.showTemplate = false;
        this.state = {
        };
    }
    handleAddInputBox(){
        this.context.executeAction(addInputBox, {});
    }
    handleUploadMediaClick(){
        this.context.executeAction(uploadMediaClick, {});
    }
    handleUploadVideoClick(){
        this.context.executeAction(uploadVideoClick, {});
    }
    handleOtherClick(){}
    handleEmbedClick(){}

    handleTemplateClick(){
        console.log('clicked');
        this.showTemplate = true;
        this.forceUpdate();
    }
    handleTemplatechange(){
        this.context.executeAction(changeTemplate, {
            template: this.refs.template.value
        });
    }
    handleHTMLEditorClick(){}

    componentDidMount() {
        $(this.refs.TemplateDropdown).dropdown();
        $('#handleAddInputBox').on('keyup', (e) => {if (e.keyCode === 13 || e.keyCode === 32) {this.handleAddInputBox();}});
        $('#handleUploadMediaClick').on('keyup', (e) => {if (e.keyCode === 13 || e.keyCode === 32) {this.handleUploadMediaClick();}});
        $('#handleUploadVideoClick').on('keyup', (e) => {if (e.keyCode === 13 || e.keyCode === 32) {this.handleUploadVideoClick();}});
        $('#handleOtherClick').on('keyup', (e) => {if (e.keyCode === 13 || e.keyCode === 32) {this.handleOtherClick();}});
        $('#handleEmbedClick').on('keyup', (e) => {if (e.keyCode === 13 || e.keyCode === 32) {this.handleEmbedClick();}});
        $('#handleTemplatechange').on('keyup', (e) => {if (e.keyCode === 13 || e.keyCode === 32) {this.handleTemplatechange();}});
        $('#handleHTMLEditorClick').on('keyup', (e) => {if (e.keyCode === 13 || e.keyCode === 32) {this.handleHTMLEditorClick();}});
    }
    componentDidUpdate() {
        $(this.refs.TemplateDropdown).dropdown();
    }
    render() {
        const dropDownItemStyle = {
            //minWidth: '100%',
            minHeight: '100px',
            //borderStyle: 'dashed dashed none dashed',
            //borderColor: '#e7e7e7',
        };
        //TODO: put in separate component
        let templateOptions = <div className="menu" tabIndex="0" >
            <div className="item" tabIndex="0"  data-value="1" onClick={this.handleTemplatechange.bind(this)}>
                Title and bullets <br/>
                <br/>
                <img tabIndex="0"  style={dropDownItemStyle} className="ui image small bordered fluid" src="/assets/images/templates/1.png" alt="template - Title and bullets" />
            </div>
            <div className="item" tabIndex="0"  data-value="2" onClick={this.handleTemplatechange.bind(this)}>
                Empty document <br/><br/>
                <img tabIndex="0"  style={dropDownItemStyle} className="ui image small bordered fluid" src="/assets/images/templates/2.png" alt="template - Empty document" />
            </div>
            <div className="item" data-value="11" onClick={this.handleTemplatechange.bind(this)}>
                1 row 1 column <br/><br/>
                <img style={dropDownItemStyle} className="ui image small bordered fluid" src="/assets/images/templates/11.png" alt="template - 1 row 1 column" />
            </div>
            <div className="item" data-value="12" onClick={this.handleTemplatechange.bind(this)}>
                1 row 2 columns <br/><br/>
                <img style={dropDownItemStyle} className="ui image small bordered fluid" src="/assets/images/templates/12.png" alt="template - 1 row 2 columns" />
            </div>
            <div className="item" data-value="22" onClick={this.handleTemplatechange.bind(this)}>
                2 rows 2 columns <br/><br/>
                <img style={dropDownItemStyle} className="ui image small bordered fluid" src="/assets/images/templates/22.png" alt="template - 2 rows 2 columns" />
            </div>
            <div className="item" data-value="21" onClick={this.handleTemplatechange.bind(this)}>
                2 rows 1 column <br/><br/>
                <img style={dropDownItemStyle} className="ui image small bordered fluid" src="/assets/images/templates/21.png" alt="template - 2 rows 1 column" />
            </div>
            <div className="item" data-value="11img" onClick={this.handleTemplatechange.bind(this)}>
                1 row 1 column image <br/><br/>
                <img style={dropDownItemStyle} className="ui image small bordered fluid" src="/assets/images/templates/11img.png" alt="template - 1 row 1 column image" />
            </div>
            <div className="item" data-value="3" onClick={this.handleTemplatechange.bind(this)}>
                Document with title <br/><br/>
                <img style={dropDownItemStyle} className="ui image small bordered fluid" src="/assets/images/templates/3.png" alt="template - Document with title" />
            </div>
            <div className="item" data-value="outitleslide" onClick={this.handleTemplatechange.bind(this)}>
                Open University Theme Title Page <br/><br/>
                <img style={dropDownItemStyle} className="ui image small bordered fluid" src="/assets/images/templates/outitleslide.png" alt="template - Open University Theme Title Page" />
            </div>
            <div className="item" data-value="oegtitleslide" onClick={this.handleTemplatechange.bind(this)}>
                OEG Theme Title Page <br/><br/>
                <img style={dropDownItemStyle} className="ui image small bordered fluid" src="/assets/images/templates/oegtitleslide.png" alt="template - OEG Theme Title Page" />
            </div>
            <div className="item" data-value="slidewikislide" onClick={this.handleTemplatechange.bind(this)}>
                SlideWiki template <br/><br/>
                <img style={dropDownItemStyle} className="ui image small bordered fluid" src="/assets/images/templates/slidewikislide.png" alt="template - SlideWiki template" />
            </div>
            <div className="item" data-value="EKDDA" onClick={this.handleTemplatechange.bind(this)}>
                EKDDA template <br/><br/>
                <img style={dropDownItemStyle} className="ui image small bordered fluid" src="/assets/images/templates/EKDDA.png" alt="template - EKDDA template" />
            </div>
            <div className="item" data-value="EKDDAeng" onClick={this.handleTemplatechange.bind(this)}>
                EKDDA template - English <br/><br/>
                <img style={dropDownItemStyle} className="ui image small bordered fluid" src="/assets/images/templates/EKDDAeng.png" alt="template - EKDDA template - English" />
            </div>
            <div className="item" data-value="EKDDAengNofooter" onClick={this.handleTemplatechange.bind(this)}>
                EKDDA template - English no footer <br/><br/>
                <img style={dropDownItemStyle} className="ui image small bordered fluid" src="/assets/images/templates/EKDDAengNofooter.png" alt="template - EKDDA template - English no footer" />
            </div>
        </div>;
        let templateDropDown;
        if(this.showTemplate){
            templateDropDown = (
                <div tabIndex="0" className="ui field search selection dropdown" data-position="top center" data-inverted="" ref="TemplateDropdown" >
                    <input type="hidden" name="template" id="template" ref="template" defaultValue={this.props.template} />
                    <i className="dropdown icon large"/>
                    <div className="default text">Use template</div>
                    {templateOptions}
                </div>);
        }else {
            templateDropDown = '';
        }
        return (
            <div className="ui container" ref="treePanel" role="navigation" onFocus={this.handleFocus} onBlur={this.handleBlur}>
                <NavigationPanel mode='edit' />
                {/*
                    give mode='edit' to navigationpane
                    <div className="four wide column">
                    <button className="ui small basic right floated icon button"><i className="edit icon"></i></button>
                </div>
                */}
                <div className="ui grey inverted segment bottom attached active tab">
                  <div className="ui center aligned grid">
                      <div className="ui vertical labeled icon grey inverted large menu">

                          <a className="item" id="handleAddInputBox" tabIndex="0" onClick={this.handleAddInputBox.bind(this)}>
                              <i tabIndex="0" className="font icon"></i>Text
                          </a>
                          <a  className="item" id="handleUploadMediaClick" tabIndex="0" onClick={this.handleUploadMediaClick.bind(this)}>
                              <i tabIndex="0" className="photo icon"></i>Image
                          </a>
                          <a  className="item" id="handleUploadVideoClick" tabIndex="0" onClick={this.handleUploadVideoClick.bind(this)}>
                              <i tabIndex="0"  className="film icon"></i>Video
                          </a>
                          <a  className="item" id="handleOtherClick" tabIndex="0" onClick={this.handleOtherClick.bind(this)}>
                              <i tabIndex="0"  className="ellipsis horizontal icon"></i>Other
                          </a>
                          <a  className="item" id="handleEmbedClick" tabIndex="0" onClick={this.handleEmbedClick.bind(this)}>
                              <i tabIndex="0"  className="plus square outline icon"></i>Embed
                          </a>
                          <a  className="item" id="handleTemplateClick" role="button" tabIndex="0" onClick={this.handleTemplateClick.bind(this)}>
                              <i tabIndex="0"  className="grid layout icon"></i>Template
                          </a>
                          {templateDropDown}
                          <a className="item" id="handleHTMLEditorClick" role="button" tabIndex="0" onClick={this.handleHTMLEditorClick.bind(this)}>
                              <i tabIndex="0"  className="code icon"></i>HTML editor
                          </a>
                          { /*<div className="ui divider"></div>
                            <a className="item">
                              <i className="linkify icon"></i>Sources
                          </a>*/}
                      </div>
                  </div>
              </div>
            </div>
        );
    }
}

SlideEditPanel.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
export default SlideEditPanel;
