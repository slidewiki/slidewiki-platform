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
    handleAddInputBox(){
        this.context.executeAction(addInputBox, {});
    }
    handleUploadMediaClick(){
        this.context.executeAction(uploadMediaClick, {});
    }
    handleUploadVideoClick(){
        this.context.executeAction(uploadVideoClick, {});
    }
    componentDidMount() {
        $(this.refs.TemplateDropdown).dropdown();
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
        let templateOptions = <div className="menu">
            <div className="item" data-value="1" onClick={this.handleTemplatechange.bind(this)}>
                Title and bullets <br/>
                <br/>
                <img style={dropDownItemStyle} className="ui image small bordered fluid" src="/assets/images/templates/1.png" alt="template - Title and bullets" />
            </div>
            <div className="item" data-value="2" onClick={this.handleTemplatechange.bind(this)}>
                Empty document <br/><br/>
                <img style={dropDownItemStyle} className="ui image small bordered fluid" src="/assets/images/templates/2.png" alt="template - Empty document" />
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
                <div className="ui field search selection dropdown" data-position="top center" data-inverted="" ref="TemplateDropdown" >
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
                      <div className="ui vertical labeled icon grey inverted massive  menu">

                          <a className="item" role="button" tabIndex="1" onClick={this.handleAddInputBox.bind(this)}>
                              <i className="font icon"></i>Text
                          </a>
                          <a className="item" role="button" tabIndex="1" onClick={this.handleUploadMediaClick.bind(this)}>
                              <i className="photo icon"></i>Image
                          </a>
                          <a className="item" role="button" tabIndex="1" onClick={this.handleUploadVideoClick.bind(this)}>
                              <i className="film icon"></i>Video
                          </a>
                          <a className="item">
                              <i className="ellipsis horizontal icon"></i>Other
                          </a>
                          <a className="item">
                              <i className="plus square outline icon"></i>Embed
                          </a>
                          <a className="item" role="button" tabIndex="1" onClick={this.handleTemplateClick.bind(this)}>
                              <i className="grid layout icon"></i>Template
                          </a>
                          {templateDropDown}
                          <div className="ui divider"></div>
                          <a className="item">
                              <i className="code icon"></i>HTML editor
                          </a>
                          <div className="ui divider"></div>
                          <a className="item">
                              <i className="linkify icon"></i>Sources
                          </a>
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
