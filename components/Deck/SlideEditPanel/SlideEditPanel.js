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
        //console.log('clicked');
        this.showTemplate = true;
        this.forceUpdate();
    }
    handleTemplatechange(templateID){
        if(templateID !== ''){
            this.showTemplate = false;
            this.context.executeAction(changeTemplate, {
                //template: this.refs.template.value
                template: templateID
            });
            this.forceUpdate();
        }
    }
    handleHTMLEditorClick(){}
    handleBack(){
        this.showTemplate = false;
        this.forceUpdate();
    }
    handleKeyPress = (event, param, template) => {
        //console.log(event.key);
        if(event.key === 'Enter' || event.key === ' '){
            switch (param) {
                case 'handleBack':
                    this.handleBack();
                    break;
                case 'handleAddInputBox':
                    this.handleAddInputBox();
                    break;
                case 'handleUploadMediaClick':
                    this.handleUploadMediaClick();
                    break;
                case 'handleUploadVideoClick':
                    this.handleUploadVideoClick();
                    break;
                case 'handleOtherClick':
                    this.handleOtherClick();
                    break;
                case 'handleEmbedClick':
                    this.handleEmbedClick();
                    break;
                case 'handleTemplateClick':
                    this.handleTemplateClick();
                    break;
                case 'handleTemplatechange':
                    this.handleTemplatechange(template);
                    break;
                case 'handleHTMLEditorClick':
                    this.handleHTMLEditorClick();
                    break;
                default:
            }
        }
    }

    render() {
        const dropDownItemStyle = {
            //minWidth: '100%',
            minHeight: '100px',
            //borderStyle: 'dashed dashed none dashed',
            //borderColor: '#e7e7e7',
        };

        //id="handleTemplatechange" className="ui field search selection dropdown" data-position="top center" data-inverted="" ref="templateList"
        let templateList = (
                <div >
                  <a className="item" id="handleBack" tabIndex="0" onClick={this.handleBack.bind(this)} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleBack')}>
                      <i tabIndex="0" className="reply icon"></i>back
                  </a>
                  <a className="item" tabIndex="0" onClick={this.handleTemplatechange.bind(this, '1')} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleTemplatechange', '1')}>
                      Title and bullets <br/>
                      <br/>
                      <img tabIndex="0"  style={dropDownItemStyle} className="ui image small bordered fluid" src="/assets/images/templates/1.png" alt="template - Title and bullets" />
                  </a>
                  <a className="item" tabIndex="0" onClick={this.handleTemplatechange.bind(this, '2')} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleTemplatechange', '2')}>
                      Empty document <br/><br/>
                      <img tabIndex="0" style={dropDownItemStyle} className="ui image small bordered fluid" src="/assets/images/templates/2.png" alt="template - Empty document" />
                  </a>
                  <a className="item" tabIndex="0" onClick={this.handleTemplatechange.bind(this, '11')} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleTemplatechange', '11')}>
                      1 row 1 column <br/><br/>
                      <img tabIndex="0"  style={dropDownItemStyle} className="ui image small bordered fluid" src="/assets/images/templates/11.png" alt="template - 1 row 1 column" />
                  </a>
                  <a className="item" tabIndex="0" tabIndex="0"  onClick={this.handleTemplatechange.bind(this, '12')}>
                      1 row 2 columns <br/><br/>
                      <img tabIndex="0" style={dropDownItemStyle} className="ui image small bordered fluid" src="/assets/images/templates/12.png" alt="template - 1 row 2 columns" />
                  </a>
                  <a className="item" tabIndex="0" onClick={this.handleTemplatechange.bind(this, '22')}>
                      2 rows 2 columns <br/><br/>
                      <img tabIndex="0" style={dropDownItemStyle} className="ui image small bordered fluid" src="/assets/images/templates/22.png" alt="template - 2 rows 2 columns" />
                  </a>
                  <a className="item" tabIndex="0" onClick={this.handleTemplatechange.bind(this, '21')}>
                      2 rows 1 column <br/><br/>
                      <img tabIndex="0" style={dropDownItemStyle} className="ui image small bordered fluid" src="/assets/images/templates/21.png" alt="template - 2 rows 1 column" />
                  </a>
                  <a className="item" tabIndex="0" onClick={this.handleTemplatechange.bind(this, '11img')}>
                      1 row 1 column image <br/><br/>
                      <img tabIndex="0" style={dropDownItemStyle} className="ui image small bordered fluid" src="/assets/images/templates/11img.png" alt="template - 1 row 1 column image" />
                  </a>
                  <a className="item" tabIndex="0" onClick={this.handleTemplatechange.bind(this, '3')}>
                      Document with title <br/><br/>
                      <img tabIndex="0" style={dropDownItemStyle} className="ui image small bordered fluid" src="/assets/images/templates/3.png" alt="template - Document with title" />
                  </a>
                  <a className="item" tabIndex="0" onClick={this.handleTemplatechange.bind(this, 'outitleslide')}>
                      Open University Theme Title Page <br/><br/>
                      <img tabIndex="0" style={dropDownItemStyle} className="ui image small bordered fluid" src="/assets/images/templates/outitleslide.png" alt="template - Open University Theme Title Page" />
                  </a>
                  <a className="item" tabIndex="0" onClick={this.handleTemplatechange.bind(this, 'oegtitleslide')}>
                      OEG Theme Title Page <br/><br/>
                      <img tabIndex="0" style={dropDownItemStyle} className="ui image small bordered fluid" src="/assets/images/templates/oegtitleslide.png" alt="template - OEG Theme Title Page" />
                  </a>
                  <a className="item" tabIndex="0" onClick={this.handleTemplatechange.bind(this, 'slidewikislide')}>
                      SlideWiki template <br/><br/>
                      <img tabIndex="0" style={dropDownItemStyle} className="ui image small bordered fluid" src="/assets/images/templates/slidewikislide.png" alt="template - SlideWiki template" />
                  </a>
                  <a className="item" tabIndex="0" onClick={this.handleTemplatechange.bind(this, 'EKDDA')}>
                      EKDDA template <br/><br/>
                      <img tabIndex="0" style={dropDownItemStyle} className="ui image small bordered fluid" src="/assets/images/templates/EKDDA.png" alt="template - EKDDA template" />
                  </a>
                  <a className="item" tabIndex="0" onClick={this.handleTemplatechange.bind(this, 'EKDDAeng')}>
                      EKDDA template - English <br/><br/>
                      <img tabIndex="0" style={dropDownItemStyle} className="ui image small bordered fluid" src="/assets/images/templates/EKDDAeng.png" alt="template - EKDDA template - English" />
                  </a>
                  <a className="item" tabIndex="0" onClick={this.handleTemplatechange.bind(this, 'EKDDAengNofooter')}>
                      EKDDA template - English no footer <br/><br/>
                      <img tabIndex="0" style={dropDownItemStyle} className="ui image small bordered fluid" src="/assets/images/templates/EKDDAengNofooter.png" alt="template - EKDDA template - English no footer" />
                  </a>
                </div>);

        let normalContent = (
          <div>
            <a className="item" id="handleAddInputBox" tabIndex="0" onClick={this.handleAddInputBox.bind(this)} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleAddInputBox')}>
                <i tabIndex="0" className="font icon"></i>Text
            </a>
            <a  className="item" id="handleUploadMediaClick" tabIndex="0" onClick={this.handleUploadMediaClick.bind(this)} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleUploadMediaClick')}>
                <i tabIndex="0" className="photo icon"></i>Image
            </a>
            <a  className="item" id="handleUploadVideoClick" tabIndex="0" onClick={this.handleUploadVideoClick.bind(this)} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleUploadVideoClick')}>
                <i tabIndex="0"  className="film icon"></i>Video
            </a>
            <a  className="item" id="handleOtherClick" tabIndex="0" onClick={this.handleOtherClick.bind(this)} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleOtherClick')}>
                <i tabIndex="0"  className="ellipsis horizontal icon"></i>Other
            </a>
            <a  className="item" id="handleEmbedClick" tabIndex="0" onClick={this.handleEmbedClick.bind(this)} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleEmbedClick')}>
                <i tabIndex="0"  className="plus square outline icon"></i>Embed
            </a>
            <a  className="item" id="handleTemplateClick" role="button" tabIndex="0" onClick={this.handleTemplateClick.bind(this)} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleTemplateClick')}>
                <i tabIndex="0"  className="grid layout icon"></i>Template
            </a>
            <a className="item" id="handleHTMLEditorClick" role="button" tabIndex="0" onClick={this.handleHTMLEditorClick.bind(this)} onKeyPress={(evt) => this.handleKeyPress(evt, 'handleHTMLEditorClick')}>
                <i tabIndex="0"  className="code icon"></i>HTML editor
            </a>
            </div>
          );

        let panelcontent;
        if(this.showTemplate){
            panelcontent = templateList;
        }else {
            panelcontent = normalContent;
        }
        return (
          <div className="ui container" ref="treePanel" role="navigation" onFocus={this.handleFocus} onBlur={this.handleBlur}>
              <NavigationPanel mode='edit' />
              <div className="ui grey inverted segment bottom attached active tab">
                <div className="ui center aligned grid">
                    <div className="ui vertical labeled icon grey inverted large menu">
                          {panelcontent}
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
