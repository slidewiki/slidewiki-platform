import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import SlideEditStore from '../../../../../stores/SlideEditStore';
import DataSourceStore from '../../../../../stores/DataSourceStore';
import SlideViewStore from '../../../../../stores/SlideViewStore';
import addSlide from '../../../../../actions/slide/addSlide';
import saveSlide from '../../../../../actions/slide/saveSlide';
import loadSlideAll from '../../../../../actions/slide/loadSlideAll';
import ResizeAware from 'react-resize-aware';
import { findDOMNode } from 'react-dom';
import UserProfileStore from '../../../../../stores/UserProfileStore';
import {Microservices} from '../../../../../configs/microservices';
import DeckTreeStore from '../../../../../stores/DeckTreeStore';
//import TemplateDropdown from '../../../../common/TemplateDropdown';
import {HotKeys} from 'react-hotkeys';

let ReactDOM = require('react-dom');

class SlideContentEditor extends React.Component {
    constructor(props) {
        super(props);
        this.currentcontent;
        this.refresh = 'false';
        this.CKEDitor_loaded = false;
        this.scaleratio = 1;
        this.inputBoxButtonTitle;
        //if(this.props.content.indexOf('pptx2html') !== -1)
        if (this.props.content.includes('pptx2html'))
        { // if pptx2html element with absolute content is in slide content (underlying HTML)
            this.inputBoxButtonTitle = 'Add input box';
        } else { //if slide does not have pptx2html/canvas/absolute positioning
            this.inputBoxButtonTitle = 'Switch to canvas with input boxes';
        }
        this.refs.template;
        this.showTemplates = false;
        this.menuFocus;
        this.previousCaretRange;
        this.CKeditorMode = 'advanced toolbar';
        this.loading = '';
    }

    keymapInfoButton(){
        let message = '&#8226; Enter text in input box: control + enter <br/>'+
                '&#8226; Move input box around: press control + alt and then the up, down, left, right keys <br/>' +
                '&#8226; Bring input box to front or back: press control+shift and then the plus or minus key <br/>' +
                '&#8226; Duplicate an input box: control + d <br/>'+
                '&#8226; Delete an input box: control + delete <br/>'+
                '&#8226; See <a href="https://sdk.ckeditor.com/samples/accessibility.html" target="_blank">https://sdk.ckeditor.com/samples/accessibility.html</a> for more (CKeditor) keyboard shortcuts <br/>' +
                '&#8226; When using Firefox, the selection of text via mouse cursor does not work well. Use keyboard selection or another browser instead. We are working to solve this problem. <br/>';
        swal({
            title: 'Keyboard shortcuts',
            html: message,
            type: 'question',
            showCloseButton: true,
            showCancelButton: false,
            confirmButtonText: 'ok',
            confirmButtonClass: 'ui olive button',
            cancelButtonText: 'No',
            cancelButtonClass: 'ui red button',
            buttonsStyling: false
        }).then((accepted) => {
            //this.applyTemplate(template);
        }, (reason) => {
            //done(reason);
        });

    }

    handleTemplatechange(){
        /*
        if (this.showTemplates === false){
            this.refs.template.showOptions();
            this.showTemplates = true;
        }
        else{*/
        //let template = this.refs.template.getSelected();
        let template = this.refs.template.value;
        if (template !== '')
        {
            //overwrite content with templates from
            //http://stable.slidewiki.org/deck/9319-3/
            swal({
                title: 'Apply template',
                text: 'This action will overwrite existing slide content with the template. Recent changes (after pressing the save button) are lost. You can always revert to an earlier version of the slide or decide to not save after applying the template. Do you want to continue?',
                type: 'question',
                showCloseButton: true,
                showCancelButton: true,
                confirmButtonText: 'Yes, apply template',
                confirmButtonClass: 'ui olive button',
                cancelButtonText: 'No',
                cancelButtonClass: 'ui red button',
                buttonsStyling: false
            }).then((accepted) => {
                this.applyTemplate(template);
            }, (reason) => {
                //done(reason);
            });
        }
        //}
    }

    applyTemplate(template){
        switch (template) {
            case '1':
                //TODO replace with this.refs.inlineContent.innerHTML + cases below
                //CKEDITOR.instances.inlineContent.setData(
                this.refs.inlineContent.innerHTML = '<div class="pptx2html" style="position: relative; width: 960px; height: 720px;">'+
                    '<div _id="2" _idx="undefined" _name="Title 1" _type="title" class="block content v-mid h-mid" style="position: absolute; top: 38.3334px; left: 66px; width: 828px; height: 139.167px; z-index: 23488;">'+
                    '<h3>Title</h3></div>'+
                    '<div _id="3" _idx="1" _name="Content Placeholder 2" _type="body" class="block content v-up" style="position: absolute; top: 191.667px; left: 66px; width: 828px; height: 456.833px; z-index: 23520;">'+
                    '<ul>'+
                    '	<li class="h-left">Text bullet 1</span>'+
                    '	<li class="h-left">Text bullet 2</span></li>'+
                    '</ul>'+
                    '<div class="h-left">&nbsp;</div>'+
                    '</div></div>';
                this.inputBoxButtonTitle = 'Add input box';
                break;
            case '2':
                //CKEDITOR.instances.inlineContent.setData('');
                this.refs.inlineContent.innerHTML = '';
                this.inputBoxButtonTitle = 'Switch to canvas with input boxes';
                break;
            case '3':
                this.refs.inlineContent.innerHTML =  '<div class="h-mid"><h3>Title</h3></div>'+
                    '<p>text</p>';
                this.inputBoxButtonTitle = 'Switch to canvas with input boxes';
                break;
            case '11':
                this.refs.inlineContent.innerHTML = '<div class="pptx2html" style="width: 960px; height: 720px; position: relative;  transform-origin: left top 0px;">'+
                    '<div _id="2" _idx="undefined" _name="Title 1" _type="title" class="block content v-mid" style="left: 0px; top: 0px; width: 940.59px; height: 64.33px; position: absolute; z-index: 2138483647; "><h3>Heading</h3></div>'+
                    '<div _id="3" _idx="1" _name="Content Placeholder 2" _type="body" class="block content v-up" style="left: 0px; top: 65.14px; width: 941.77px; height: 610px; text-align: left; position: absolute; z-index: 2120483647; ">'+
                    '<p>Row 1 - Column 1</p></div>'+
                    '<div _id="3" _idx="1" _name="Content Placeholder 2" _type="body" class="block content v-up h-mid" style="left: 0px; top: 675.14px; width: 941.77px; height: 43.44px; position: absolute; z-index: 2138483647; ">Footer</div>' +
                    '</div>';
                this.inputBoxButtonTitle = 'Add input box';
                break;
            case '12':
                this.refs.inlineContent.innerHTML = '<div class="pptx2html" style="width: 960px; height: 720px; position: relative;  transform-origin: left top 0px;">'+
                    '<div _id="2" _idx="undefined" _name="Title 1" _type="title" class="block content v-mid" style="left: 0px; top: 0px; width: 940.59px; height: 64.33px; position: absolute; z-index: 2138483647; "><h3>Heading</h3></div>'+
                    '<div _id="3" _idx="1" _name="Content Placeholder 2" _type="body" class="block content v-up h-mid" style="left: 0px; top: 64.11px; width: 661px; height: 613.14px; position: absolute; z-index: 2138483647; ">'+
                    '<p>Row 1 - Column&nbsp;1</p>'+
                    '</div>'+
                    '<div _id="3" _idx="1" _name="Content Placeholder 2" _type="body" class="block content v-up" style="left: 0px; top: 675.14px; width: 941.77px; height: 43.44px; text-align: center; position: absolute; z-index: 2138483647; ">Footer</div>'+
                    '<div style="left: 660.87px; top: 63.85px; width: 282.49px; height: 611.39px; position: absolute; z-index: 2138483647; ">'+
                    '<div class="h-mid">'+
                    '<p>Row 1 - Column&nbsp;2</p>'+
                    '</div></div></div>';
                this.inputBoxButtonTitle = 'Add input box';
                break;
            case '22':
                this.refs.inlineContent.innerHTML = '<div class="pptx2html" style="width: 960px; height: 720px; position: relative;  transform-origin: left top 0px;">'+
                    '<div _id="2" _idx="undefined" _name="Title 1" _type="title" class="block content v-mid" style="left: 0px; top: 0px; width: 940.59px; height: 64.33px; position: absolute; z-index: 2138483647; ">Header</div>'+
                    '<div _id="3" _idx="1" _name="Content Placeholder 2" _type="body" class="block content v-up h-mid" style="left: 0px; top: 202.48px; width: 661.48px; height: 476.18px; text-align: left; position: absolute; z-index: 2138483647; ">'+
                    '<p>Row 2 - Column&nbsp;1</p>'+
                    '</div>'+
                    '<div _id="3" _idx="1" _name="Content Placeholder 2" _type="body" class="block content v-up h-mid" style="left: 0px; top: 675.14px; width: 941.77px; height: 43.44px; position: absolute; z-index: 2138483647; ">Footer</div>'+
                    '<div style="left: 0.44px; top: 65.4px; width: 940.44px; height: 137.18px; position: absolute; z-index: 2138483647; ">'+
                    '<div class="h-mid">&nbsp;</div>'+
                    '<div class="h-mid"><p>Row 1</p></div></div>'+
                    '<div style="left: 660px; top: 201px; width: 279px; height: 476.18px; position: absolute; z-index: 80000; ">'+
                    '<div class="h-mid">'+
                    '<p>Row 2 - Column&nbsp;2</p>'+
                    '</div></div></div>';
                this.inputBoxButtonTitle = 'Add input box';
                break;
            case '21':
                this.refs.inlineContent.innerHTML = '<div class="pptx2html" style="width: 960px; height: 720px; position: relative;  transform-origin: left top 0px;">'+
                    '<div _id="2" _idx="undefined" _name="Title 1" _type="title" class="block content v-mid" style="left: 0px; top: 0px; width: 940.59px; height: 64.33px; position: absolute; z-index: 2138483647; "><h3>Header</h3></div>'+
                    '<div _id="3" _idx="1" _name="Content Placeholder 2" _type="body" class="block content v-up h-mid" style="left: 0.87px; top: 267.64px; width: 941.62px; height: 409px; text-align: left; position: absolute; z-index: 2138483647; ">'+
                    '<p>Row 2 - Column 1</p>'+
                    '</div>'+
                    '<div _id="3" _idx="1" _name="Content Placeholder 2" _type="body" class="block content v-up h-mid" style="left: 0px; top: 675.14px; width: 941.77px; height: 43.44px; position: absolute; z-index: 2138483647; ">Footer</div>'+
                    '<div style="left: 0.44px; top: 65.4px; width: 941.74px; height: 203.38px; position: absolute; z-index: 2138483647; ">'+
                    '<div class="h-mid">&nbsp;</div>'+
                    '<div class="h-mid">Row 1 - Column 1</div>'+
                    '</div></div>';

                this.inputBoxButtonTitle = 'Add input box';
                break;
            case '11img':
                this.refs.inlineContent.innerHTML = '<div class="pptx2html" style="width: 960px; height: 720px; position: relative;  transform-origin: left top 0px;">'+
                    '<div _id="2" _idx="undefined" _name="Title 1" _type="title" class="block content v-mid" style="left: 0px; top: 0px; width: 940.59px; height: 64.33px; position: absolute; z-index: 2138483647; "><h3>Header</h3></div>'+
                    '<div _id="3" _idx="1" _name="Content Placeholder 2" _type="body" class="block content v-up" style="left: 0px; top: 65.14px; width: 940.85px; height: 228.78px; text-align: left; position: absolute; z-index: 2138483647; ">'+
                    '<p>Row 1 - Column 1 - <br/> Insert the image by pasting the url in the HTML code in the last div section after source=</p>'+
                    '</div>'+
                    '<div _id="3" _idx="1" _name="Content Placeholder 2" _type="body" class="block content v-up" style="left: 2.02366px; top: 667.247px; width: 941.77px; height: 43.44px; text-align: center; position: absolute; z-index: 2138483647; ">Footer</div>'+
                    '<div style="left: 1.25px; top: 304px; width: 938.96px; height: 360.72px; position: absolute; z-index: 2138483647; ">'+
                    '<div class="h-mid">'+
                    '<p><img alt="" height="322" src="http://fileservice.stable.slidewiki.org/2355/a5527130-f9b1-11e6-8593-f7fb03f4bfc1.jpg" width="408" /></p>'+
                    '<p>&nbsp;</p></div></div></div>', 'Add input box';
                this.inputBoxButtonTitle = 'Add input box';
                break;
            // case 'title':
            //     this.refs.inlineContent.innerHTML =
            //       '<div class="pptx2html" style="width: 960px; height: 720px; position: relative;  transform-origin: left top 0px;">' +
            //       ' <div class="titleSlide>' +
            //       '   <div class="titlePageHeading"><h3>Title</h3></div>' +
            //       '   <div class="titlePageSubHeading"><h4>Subtitle</h4></div>' +
            //       ' </div>' +
            //       '</div>';
            //
            //     this.inputBoxButtonTitle = 'Add input box';
            //     this.emitChange();
            //     break;
            case 'outitleslide':
                this.refs.inlineContent.innerHTML =
                '<div class="pptx2html" style="width: 960px; height: 720px; position: relative;  transform-origin: left top 0px;">' +
                '<div class="titleSlide" style="background-image: url(/custom_modules/reveal.js/img/outitlepage.png);background-repeat: no-repeat;background-position: center; height:100%; width:100%">' +
                '<div style="position:absolute; left:100px; top: 200px; width:300px; height: 200px;">' +
                '<h3>Title</h3>' +
                '<h4>[Subtitle]</h4>' +
                '</div></div></div>';
                this.inputBoxButtonTitle = 'Add input box';
                break;
            case 'oegtitleslide':
                this.refs.inlineContent.innerHTML =
                '<div class="pptx2html" style="width: 960px; height: 720px; position: relative;  transform-origin: left top 0px;">' +
                '<div class="titleSlide" style="background-image: url(/custom_modules/reveal.js/img/oeglargelogo.png), url(/custom_modules/reveal.js/img/ccimage.png), url(/custom_modules/reveal.js/img/upmlogo.png), url(/custom_modules/reveal.js/img/oeglogo.png); background-position: top left, bottom left, top center, top right; background-repeat: no-repeat;">' +
                '<div style="position:absolute; left:100px; top: 200px; width:300px; height: 200px;">' +
                '<h3>Title</h3>' +
                '<h4>[Subtitle]</h4>' +
                '</div></div></div>';
                this.inputBoxButtonTitle = 'Add input box';
                break;
            case 'slidewikislide':
                this.refs.inlineContent.innerHTML =
                    '<div class="pptx2html" id="56826" style="position: relative; width: 960px; height: 720px; transform: scale(0.859406, 0.859406); transform-origin: left top 0px; border-style: double; border-color: rgba(218, 102, 25, 0.5);">' +
                    '<div _id="2" _idx="undefined" _name="Title 1" _type="title" class="block content v-mid h-mid" id="79445" style="position: absolute; top: 144.275px; left: 1.43937px; width: 950.596px; height: 78.9953px; z-index: 23488; cursor: auto;" tabindex="0">' +
                    '<h3 id="4651"><span id="93000" style="color:#1e78bb;"><span id="80895"><span id="13770" style="font-family:Tahoma,Geneva,sans-serif;">SlideWiki</span></span></span></h3>' +
                    '</div>' +
                    '' +
                    '<div _id="3" _idx="1" _name="Content Placeholder 2" _type="body" class="block content v-up" id="70846" style="position: absolute; top: 313.978px; left: 4.17467px; width: 944.8px; height: 314.665px; z-index: 23520; cursor: auto;" tabindex="0">' +
                    '<p id="52813" style="text-align: center;"><span id="984">Content</span></p>' +
                    '</div>' +
                    '' +
                    '<div _id="3" _idx="1" _name="Content Placeholder 2" _type="body" class="block content v-up" id="49382" style="position: absolute; top: 225.751px; left: 5.0175px; width: 945.964px; height: 59.8476px; z-index: 23520; cursor: auto;" tabindex="0">' +
                    '<p id="72233" style="text-align: center;"><span id="23985" style="color:#1e78bb;">Subtitle</span></p>' +
                    '</div>'+
                    '' +
                    '<div id="19340" style="position: absolute; top: 2.96545px; left: 2.9309px; width: 322.038px; height: 127.848px; z-index: 23530; cursor: auto;" tabindex="0">' +
                    '<div class="h-left" id="51275"><img alt="" height="100" id="20263" src="https://fileservice.stable.slidewiki.org/2346/08d55130-688b-11e7-b72f-6963e22f1150.png" width="316" /></div>' +
                    '</div>' +
                    '' +
                    '<div id="84757" style="position: absolute; top: 1.15979px; left: 806.461px; width: 150.15px; height: 120.182px; z-index: 23540; cursor: auto;" tabindex="0">' +
                    '<div class="h-left" id="47372"><img alt="" height="100" id="29851" src="https://fileservice.stable.slidewiki.org/2346/41eb9330-688b-11e7-b72f-6963e22f1150.png" width="136" /></div>' +
                    '</div>' +
                    '' +
                    '<div id="38573" style="position: absolute; top: 655.409px; left: 11.9155px; width: 936.411px; height: 52.2163px; z-index: 23550; cursor: auto;" tabindex="0">' +
                    '<h4 class="h-left" id="45263" style="text-align: center;"><span id="34455" style="color:#ffffff;"><span class="text-block" id="27908"><span id="54919" style="background-color:#1e78bb;">Footer</span></span></span></h4>' +
                    '</div>' +
                    '</div>';
                this.inputBoxButtonTitle = 'Add input box';
                break;
            case 'EKDDA':
                this.refs.inlineContent.innerHTML =
                '<div class="pptx2html" id="65156" style="position: relative; width: 1280px; height: 720px; border-style: double; border-color: rgb(218, 102, 25); transform: scale(0.630665, 0.630665); transform-origin: left top 0px;">'+
                '<div id="42107">&nbsp;</div>'+
                '<div _id="20482" _idx="undefined" _name="Τίτλος 1" _type="title" class="block content v-up ui-resizable context-menu-disabled" id="26254" style="position: absolute; top: 73.2377px; left: 344.517px; width: 744.816px; height: 107.833px; border-width: 1pt; border-image: initial; z-index: 2147383647; cursor: auto;" tabindex="0"><span id="40205" style="font-size:33.0pt"><span id="46007" style="font-family:Lucida Sans Unicode,Lucida Grande,sans-serif;"><span id="1426"><span id="86565" style="color:#44546a"><span id="33758">Στυλ κύριου τίτλου</span></span></span></span></span></div>'+
                '<div _id="20483" _idx="1" _name="Θέση περιεχομένου 7" _type="body" class="block content v-up context-menu-disabled" id="35446" style="position: absolute; top: 193.667px; left: 254.5px; width: 874.4px; height: 352.992px; border-width: 1pt; border-image: initial; z-index: 2147483647; cursor: auto;" tabindex="0">'+
                '<div class="O0" id="52252" style="margin-top:7.5pt; margin-bottom:1.5pt; margin-left:.31in; text-align:left"><span id="52705" style="font-family:Lucida Sans Unicode,Lucida Grande,sans-serif;"><span id="63239" style="line-height:94%"><span id="50131" style="unicode-bidi:embed"><span id="13440" style="vertical-align:baseline"><span id="24254"><span id="39451" style="font-size:15.0pt"><span id="1683">■</span></span><span id="68631" style="font-size:15.0pt"><span id="84651"><span id="32068" style="color:#44546a"><span id="27527">Επεξεργασία στυλ υποδείγματος κειμένου</span></span></span></span></span></span></span></span></span></div>'+
                '<div class="O1" id="97828" style="margin-top:3.75pt; margin-bottom:1.5pt; margin-left:.75in; text-align:left"><span id="3427" style="font-family:Lucida Sans Unicode,Lucida Grande,sans-serif;"><span id="37790" style="line-height:94%"><span id="46388" style="unicode-bidi:embed"><span id="28392" style="vertical-align:baseline"><span id="80346"><span id="58669" style="font-size:15.0pt"><span id="43350">–</span></span><span id="19009" style="font-size:15.0pt"><span id="1917"><span id="55809" style="color:#44546a"><span id="97967"><span id="93492" style="font-style:italic">Δεύτερου επιπέδου</span></span></span></span></span></span></span></span></span></span></div>'+
                '<div class="O2" id="47360" style="margin-top:3.75pt; margin-bottom:1.5pt; margin-left:1.13in; text-align:left"><span id="43904" style="font-family:Lucida Sans Unicode,Lucida Grande,sans-serif;"><span id="35348" style="line-height:94%"><span id="25844" style="unicode-bidi:embed"><span id="88898" style="vertical-align:baseline"><span id="34086"><span id="85847" style="font-size:13.0pt"><span id="5433">■</span></span><span id="88667" style="font-size:13.0pt"><span id="22977"><span id="91060" style="color:#44546a"><span id="63567">Τρίτου επιπέδου</span></span></span></span></span></span></span></span></span></div>'+
                '<div class="O3" id="95692" style="margin-top:3.75pt; margin-bottom:1.5pt; margin-left:1.5in; text-align:left"><span id="59126" style="font-family:Lucida Sans Unicode,Lucida Grande,sans-serif;"><span id="19780" style="line-height:94%"><span id="63156" style="unicode-bidi:embed"><span id="94918" style="vertical-align:baseline"><span id="51569"><span id="47155" style="font-size:13.0pt"><span id="17715">–</span></span><span id="5499" style="font-size:13.0pt"><span id="94774"><span id="2878" style="color:#44546a"><span id="14908"><span id="54673" style="font-style:italic">Τέταρτου επιπέδου</span></span></span></span></span></span></span></span></span></span></div>'+
                '<div class="O4" id="39182" style="margin-top:3.75pt; margin-bottom:1.5pt; margin-left:1.88in; text-align:left"><span id="94468" style="font-family:Lucida Sans Unicode,Lucida Grande,sans-serif;"><span id="74893" style="line-height:94%"><span id="23192" style="unicode-bidi:embed"><span id="73743" style="vertical-align:baseline"><span id="29433"><span id="98602" style="font-size:12.0pt"><span id="15240">■</span></span><span id="67631" style="font-size:12.0pt"><span id="8611"><span id="53659" style="color:#44546a"><span id="28991">Πέμπτου επιπέδου</span></span></span></span></span></span></span></span></span></div>'+
                '</div>'+
                '<div _id="20484" _idx="4294967295" _name="Θέση αριθμού διαφάνειας 6" _type="sldNum" class="drawing-container context-menu-disabled" id="57453" style="position: absolute; top: 478.794px; left: 1226.01px; width: 73.3333px; height: 42.4999px; z-index: 2147383647; cursor: auto;" tabindex="0"><svg _id="20484" _idx="4294967295" _name="Θέση αριθμού διαφάνειας 6" _type="sldNum" class="drawing context-menu-disabled" id="23417" style="position: absolute; top: 0px; left: 0px; width: 73.3333px; height: 42.4999px; z-index: 29882; cursor: auto;"><rect fill="none" height="42.49994750656168" id="14813" stroke="none" stroke-dasharray="0" stroke-width="1" width="73.33333333333333" x="0" y="0"></rect></svg></div>'+
                '<div class="context-menu-disabled" id="42079" style="position: absolute; top: -14.7607px; left: 104.576px; width: 31.2555px; height: 723.158px; z-index: 2147483647; cursor: auto;" tabindex="0">'+
                '<div class="h-left" id="79727"><img alt="" data-widget="image" id="99176" src="https://fileservice.stable.slidewiki.org/2346/88588ad0-a481-11e7-a346-5db6696affe9.png" style="width: 23.25px; height: 715.158px;" width="26" height="722"></div>'+
                '</div>'+
                '<div class="context-menu-disabled" id="69723" style="position: absolute; top: 585.05px; left: 168.866px; width: 1172.12px; height: 124.833px; z-index: 29872; cursor: auto;" tabindex="0">'+
                '<div class="h-left" id="11016"><img alt="" data-widget="image" id="77810" src="https://fileservice.stable.slidewiki.org/2346/43b00690-a483-11e7-a346-5db6696affe9.png" style="width: 1164.12px; height: 114.719px;" width="1161" height="134"></div>'+
                '</div>'+
                '<div class="context-menu-disabled" id="18921" style="position: absolute; top: 635.895px; left: 174.382px; width: 111.703px; height: 70.7775px; z-index: 2147383647; cursor: auto;" tabindex="0">'+
                '<div class="h-left" id="36912">&nbsp;</div>'+
                '</div>'+
                '<div class="context-menu-disabled" id="54829" style="position: absolute; top: 25.9078px; left: 145.666px; width: 185.596px; height: 116.33px; z-index: 2147383647; cursor: auto;" tabindex="0">'+
                '<div class="h-left" id="93035"><img alt="" id="27106" src="https://fileservice.stable.slidewiki.org/2346/11870fd0-a481-11e7-a346-5db6696affe9.png" style="width: 177.596px; height: 108.33px;" width="155" height="102"></div>'+
                '</div>'+
                '<div class="ui-resizable context-menu-disabled" id="10793" style="position: absolute; top: 49.3611px; left: 1085.84px; width: 174.514px; height: 67.8675px; z-index: 2147383647; cursor: auto;" tabindex="0">'+
                '<div class="h-left" id="34717"><img alt="" id="9225" src="https://fileservice.stable.slidewiki.org/2346/24fbd5f0-a481-11e7-a346-5db6696affe9.png" style="width: 166.514px; height: 59.8675px;" width="191" height="78"></div>'+
                '</div>'+
                '</div>';
                this.inputBoxButtonTitle = 'Add input box';
                break;
            case 'EKDDAeng':
                this.refs.inlineContent.innerHTML =
                '<div class="pptx2html" id="65156" style="position: relative; width: 1280px; height: 720px; border-style: double; border-color: rgb(218, 102, 25); transform: scale(0.630665, 0.630665); transform-origin: left top 0px;">'+
                '<div id="42107">&nbsp;</div>'+
                '<div _id="20483" _idx="1" _name="Θέση περιεχομένου 7" _type="body" class="block content v-up context-menu-disabled" id="35446" style="position: absolute; top: 193.667px; left: 254.5px; width: 780.914px; height: 352.992px; border-width: 1pt; border-image: initial; z-index: 2147483647; cursor: auto;" tabindex="0">'+
                '<div class="O0" id="52252" style="margin-top:7.5pt; margin-bottom:1.5pt; margin-left:.31in; text-align:left">'+
                '<div id="61964" style="margin-top:7.5pt; margin-bottom:1.5pt; margin-left:.31in; text-align:justify"><span id="92002" style="language:nl"><span id="32406" style="line-height:94%"><span id="30401" style="text-justify:inter-ideograph"><span id="37831" style="unicode-bidi:embed"><span id="32845" style="vertical-align:baseline"><span id="36756" style="punctuation-wrap:hanging"><span id="19931" style="font-size:20.0pt"><span id="8447" style="font-family:&quot;Franklin Gothic Book&quot;">■</span></span><span id="33158" style="font-size:20.0pt"><span id="22940" style="font-family:&quot;Franklin Gothic Book&quot;"><span id="28349" style="color:#44546a"><span id="28833" style="language:en-US"><span id="26176" style="font-weight:bold">Bold Text (A)</span></span></span></span></span><span id="35225" style="font-size:20.0pt"><span id="15107" style="font-family:&quot;Franklin Gothic Book&quot;"><span id="55716" style="color:#44546a"><span id="95236" style="language:en-US">: Normal Text 1</span></span></span></span> </span></span></span></span></span></span></div>'+
                '<div id="12702" style="margin-top:7.5pt; margin-bottom:1.5pt; margin-left:.31in; text-align:justify"><span id="3373" style="language:nl"><span id="60220" style="line-height:94%"><span id="17319" style="text-justify:inter-ideograph"><span id="69555" style="unicode-bidi:embed"><span id="65166" style="vertical-align:baseline"><span id="53339" style="punctuation-wrap:hanging"><span id="69614" style="font-size:20.0pt"><span id="99563" style="font-family:&quot;Franklin Gothic Book&quot;">■</span></span><span id="91266" style="font-size:20.0pt"><span id="15725" style="font-family:&quot;Franklin Gothic Book&quot;"><span id="54575" style="color:#44546a"><span id="51611" style="language:en-US"><span id="49242" style="font-weight:bold">Bold Text (B)</span></span></span></span></span><span id="66190" style="font-size:20.0pt"><span id="94200" style="font-family:&quot;Franklin Gothic Book&quot;"><span id="88177" style="color:#44546a"><span id="47184" style="language:en-US">: Lorem ipsum dolor sit </span></span></span></span><span id="50438" style="font-size:20.0pt"><span id="44226" style="font-family:&quot;Franklin Gothic Book&quot;"><span id="48715" style="color:#44546a"><span id="17560" style="language:en-US">amet</span></span></span></span><span id="66870" style="font-size:20.0pt"><span id="42576" style="font-family:&quot;Franklin Gothic Book&quot;"><span id="30399" style="color:#44546a"><span id="92581" style="language:en-US">, </span></span></span></span><span id="78342" style="font-size:20.0pt"><span id="50497" style="font-family:&quot;Franklin Gothic Book&quot;"><span id="97546" style="color:#44546a"><span id="8525" style="language:en-US">consectetur</span></span></span></span> <span id="70697" style="font-size:20.0pt"><span id="17650" style="font-family:&quot;Franklin Gothic Book&quot;"><span id="67446" style="color:#44546a"><span id="27444" style="language:en-US">adipiscing</span></span></span></span> <span id="45543" style="font-size:20.0pt"><span id="87683" style="font-family:&quot;Franklin Gothic Book&quot;"><span id="98836" style="color:#44546a"><span id="45195" style="language:en-US">elit</span></span></span></span><span id="11770" style="font-size:20.0pt"><span id="80300" style="font-family:&quot;Franklin Gothic Book&quot;"><span id="95102" style="color:#44546a"><span id="65730" style="language:en-US">, </span></span></span></span><span id="89161" style="font-size:20.0pt"><span id="72649" style="font-family:&quot;Franklin Gothic Book&quot;"><span id="48374" style="color:#44546a"><span id="41831" style="language:en-US">sed</span></span></span></span><span id="70471" style="font-size:20.0pt"><span id="72674" style="font-family:&quot;Franklin Gothic Book&quot;"><span id="75527" style="color:#44546a"><span id="10594" style="language:en-US"> do </span></span></span></span><span id="22477" style="font-size:20.0pt"><span id="41860" style="font-family:&quot;Franklin Gothic Book&quot;"><span id="15058" style="color:#44546a"><span id="55217" style="language:en-US">eiusmod</span></span></span></span> <span id="25539" style="font-size:20.0pt"><span id="62315" style="font-family:&quot;Franklin Gothic Book&quot;"><span id="67083" style="color:#44546a"><span id="26331" style="language:en-US">tempor</span></span></span></span> <span id="85623" style="font-size:20.0pt"><span id="44318" style="font-family:&quot;Franklin Gothic Book&quot;"><span id="59355" style="color:#44546a"><span id="52690" style="language:en-US">incididunt</span></span></span></span> <span id="80730" style="font-size:20.0pt"><span id="11025" style="font-family:&quot;Franklin Gothic Book&quot;"><span id="17979" style="color:#44546a"><span id="70012" style="language:en-US">ut</span></span></span></span> <span id="85909" style="font-size:20.0pt"><span id="8542" style="font-family:&quot;Franklin Gothic Book&quot;"><span id="39626" style="color:#44546a"><span id="50669" style="language:en-US">labore</span></span></span></span><span id="3835" style="font-size:20.0pt"><span id="55467" style="font-family:&quot;Franklin Gothic Book&quot;"><span id="77352" style="color:#44546a"><span id="92606" style="language:en-US"> et </span></span></span></span><span id="8225" style="font-size:20.0pt"><span id="40112" style="font-family:&quot;Franklin Gothic Book&quot;"><span id="97016" style="color:#44546a"><span id="33027" style="language:en-US">dolore</span></span></span></span><span id="98523" style="font-size:20.0pt"><span id="97881" style="font-family:&quot;Franklin Gothic Book&quot;"><span id="19447" style="color:#44546a"><span id="46837" style="language:en-US"> magna </span></span></span></span><span id="48541" style="font-size:20.0pt"><span id="87982" style="font-family:&quot;Franklin Gothic Book&quot;"><span id="71554" style="color:#44546a"><span id="15324" style="language:en-US">aliqua</span></span></span></span><span id="28308" style="font-size:20.0pt"><span id="3931" style="font-family:&quot;Franklin Gothic Book&quot;"><span id="6876" style="color:#44546a"><span id="73068" style="language:en-US">;</span></span></span></span></span></span></span></span></span></span></div>'+
                '<div id="72688" style="margin-top:7.5pt; margin-bottom:1.5pt; margin-left:.31in; text-align:justify"><span id="19467" style="language:nl"><span id="94513" style="line-height:94%"><span id="8249" style="text-justify:inter-ideograph"><span id="87225" style="unicode-bidi:embed"><span id="7607" style="vertical-align:baseline"><span id="13939" style="punctuation-wrap:hanging"><span id="58364" style="font-size:20.0pt"><span id="4805" style="font-family:&quot;Franklin Gothic Book&quot;">■</span></span><span id="90516" style="font-size:20.0pt"><span id="37822" style="font-family:&quot;Franklin Gothic Book&quot;"><span id="95505" style="color:#44546a"><span id="78006" style="language:en-US"><span id="71046" style="font-weight:bold">Lorem Ipsum</span></span></span></span></span><span id="30205" style="font-size:20.0pt"><span id="13555" style="font-family:&quot;Franklin Gothic Book&quot;"><span id="29805" style="color:#44546a"><span id="58193" style="language:en-US">: </span></span></span></span><span id="87088" style="font-size:20.0pt"><span id="64314" style="font-family:&quot;Franklin Gothic Book&quot;"><span id="40896" style="color:#44546a"><span id="87682" style="language:en-GB">is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</span></span></span></span> </span></span></span></span></span></span></div>'+
                '</div>'+
                '</div>'+
                '<div _id="20484" _idx="4294967295" _name="Θέση αριθμού διαφάνειας 6" _type="sldNum" class="drawing-container context-menu-disabled" id="57453" style="position: absolute; top: 478.794px; left: 1226.01px; width: 73.3333px; height: 42.4999px; z-index: 2147383647; cursor: auto;" tabindex="0"><svg _id="20484" _idx="4294967295" _name="Θέση αριθμού διαφάνειας 6" _type="sldNum" class="drawing context-menu-disabled" id="23417" style="position: absolute; top: 0px; left: 0px; width: 73.3333px; height: 42.4999px; z-index: 29882; cursor: auto;"><rect fill="none" height="42.49994750656168" id="14813" stroke="none" stroke-dasharray="0" stroke-width="1" width="73.33333333333333" x="0" y="0"></rect></svg></div>'+
                '<div class="context-menu-disabled" id="42079" style="position: absolute; top: -14.7607px; left: 104.576px; width: 31.2555px; height: 723.158px; z-index: 2147483647; cursor: auto;" tabindex="0">'+
                '<div class="h-left" id="79727"><img alt="" data-widget="image" id="99176" src="https://fileservice.stable.slidewiki.org/2346/88588ad0-a481-11e7-a346-5db6696affe9.png" style="width: 23.25px; height: 715.158px;" width="26" height="722"></div>'+
                '</div>'+
                '<div class="context-menu-disabled" id="69723" style="position: absolute; top: 563.049px; left: 168.353px; width: 1172.12px; height: 122.721px; z-index: 29872; cursor: auto;" tabindex="0">'+
                '<div class="h-left" id="11016"><img alt="" src="https://fileservice.stable.slidewiki.org/2346/43b00690-a483-11e7-a346-5db6696affe9.png" id="84865" width="1161" height="134"></div>'+
                '</div>'+
                '<div class="context-menu-disabled" id="18921" style="position: absolute; top: 635.895px; left: 174.382px; width: 111.703px; height: 70.7775px; z-index: 2147383647; cursor: auto;" tabindex="0">'+
                '<div class="h-left" id="36912">&nbsp;</div>'+
                '</div>'+
                '<div class="context-menu-disabled" id="54829" style="position: absolute; top: 25.9078px; left: 145.666px; width: 185.596px; height: 116.33px; z-index: 2147383647; cursor: auto;" tabindex="0">'+
                '<div class="h-left" id="93035"><img alt="" id="27106" src="https://fileservice.stable.slidewiki.org/2346/11870fd0-a481-11e7-a346-5db6696affe9.png" style="width: 177.596px; height: 108.33px;" width="155" height="102"></div>'+
                '</div>'+
                '<div class="context-menu-disabled" id="10793" style="position: absolute; top: 49.3611px; left: 1085.84px; width: 174.514px; height: 67.8675px; z-index: 2147383647; cursor: auto;" tabindex="0">'+
                '<div class="h-left" id="34717"><img alt="" id="9225" src="https://fileservice.stable.slidewiki.org/2346/24fbd5f0-a481-11e7-a346-5db6696affe9.png" style="width: 166.514px; height: 59.8675px;" width="191" height="78"></div>'+
                '</div>'+
                '</div>';
                break;
            case 'EKDDAengNofooter':
                this.refs.inlineContent.innerHTML =
                '<div class="pptx2html" id="65156" style="position: relative; width: 1280px; height: 720px; border-style: double; border-color: rgb(218, 102, 25); transform: scale(0.630665, 0.630665); transform-origin: left top 0px;">'+
                '<div id="42107">&nbsp;</div>'+
                '<div _id="20482" _idx="undefined" _name="Τίτλος 1" _type="title" class="block content v-up context-menu-disabled" id="26254" style="position: absolute; top: 73.2377px; left: 344.517px; width: 744.816px; height: 107.833px; border-width: 1pt; border-image: initial; z-index: 2147383647; cursor: auto;" tabindex="0"><span id="40205" style="font-size:33.0pt"><span id="46007" style="font-family:Lucida Sans Unicode,Lucida Grande,sans-serif;"><span id="1426"><span id="86565" style="color:#44546a"><span id="33758">Questionnaire structure</span></span></span></span></span></div>'+
                '<div _id="20483" _idx="1" _name="Θέση περιεχομένου 7" _type="body" class="block content v-up context-menu-disabled" id="35446" style="position: absolute; top: 193.667px; left: 254.5px; width: 780.914px; height: 352.992px; border-width: 1pt; border-image: initial; z-index: 2147483647; cursor: auto;" tabindex="0">'+
                '<div class="O0" id="52252" style="margin-top:7.5pt; margin-bottom:1.5pt; margin-left:.31in; text-align:left">'+
                '<div id="61964" style="margin-top:7.5pt; margin-bottom:1.5pt; margin-left:.31in; text-align:justify"><span id="92002" style="language:nl"><span id="32406" style="line-height:94%"><span id="30401" style="text-justify:inter-ideograph"><span id="37831" style="unicode-bidi:embed"><span id="32845" style="vertical-align:baseline"><span id="36756" style="punctuation-wrap:hanging"><span id="19931" style="font-size:20.0pt"><span id="8447" style="font-family:&quot;Franklin Gothic Book&quot;">■</span></span><span id="33158" style="font-size:20.0pt"><span id="22940" style="font-family:&quot;Franklin Gothic Book&quot;"><span id="28349" style="color:#44546a"><span id="28833" style="language:en-US"><span id="26176" style="font-weight:bold">Bold Text (A)</span></span></span></span></span><span id="35225" style="font-size:20.0pt"><span id="15107" style="font-family:&quot;Franklin Gothic Book&quot;"><span id="55716" style="color:#44546a"><span id="95236" style="language:en-US">: Normal Text 1</span></span></span></span> </span></span></span></span></span></span></div>'+
                '<div id="12702" style="margin-top:7.5pt; margin-bottom:1.5pt; margin-left:.31in; text-align:justify"><span id="3373" style="language:nl"><span id="60220" style="line-height:94%"><span id="17319" style="text-justify:inter-ideograph"><span id="69555" style="unicode-bidi:embed"><span id="65166" style="vertical-align:baseline"><span id="53339" style="punctuation-wrap:hanging"><span id="69614" style="font-size:20.0pt"><span id="99563" style="font-family:&quot;Franklin Gothic Book&quot;">■</span></span><span id="91266" style="font-size:20.0pt"><span id="15725" style="font-family:&quot;Franklin Gothic Book&quot;"><span id="54575" style="color:#44546a"><span id="51611" style="language:en-US"><span id="49242" style="font-weight:bold">Bold Text (B)</span></span></span></span></span><span id="66190" style="font-size:20.0pt"><span id="94200" style="font-family:&quot;Franklin Gothic Book&quot;"><span id="88177" style="color:#44546a"><span id="47184" style="language:en-US">: Lorem ipsum dolor sit </span></span></span></span><span id="50438" style="font-size:20.0pt"><span id="44226" style="font-family:&quot;Franklin Gothic Book&quot;"><span id="48715" style="color:#44546a"><span id="17560" style="language:en-US">amet</span></span></span></span><span id="66870" style="font-size:20.0pt"><span id="42576" style="font-family:&quot;Franklin Gothic Book&quot;"><span id="30399" style="color:#44546a"><span id="92581" style="language:en-US">, </span></span></span></span><span id="78342" style="font-size:20.0pt"><span id="50497" style="font-family:&quot;Franklin Gothic Book&quot;"><span id="97546" style="color:#44546a"><span id="8525" style="language:en-US">consectetur</span></span></span></span> <span id="70697" style="font-size:20.0pt"><span id="17650" style="font-family:&quot;Franklin Gothic Book&quot;"><span id="67446" style="color:#44546a"><span id="27444" style="language:en-US">adipiscing</span></span></span></span> <span id="45543" style="font-size:20.0pt"><span id="87683" style="font-family:&quot;Franklin Gothic Book&quot;"><span id="98836" style="color:#44546a"><span id="45195" style="language:en-US">elit</span></span></span></span><span id="11770" style="font-size:20.0pt"><span id="80300" style="font-family:&quot;Franklin Gothic Book&quot;"><span id="95102" style="color:#44546a"><span id="65730" style="language:en-US">, </span></span></span></span><span id="89161" style="font-size:20.0pt"><span id="72649" style="font-family:&quot;Franklin Gothic Book&quot;"><span id="48374" style="color:#44546a"><span id="41831" style="language:en-US">sed</span></span></span></span><span id="70471" style="font-size:20.0pt"><span id="72674" style="font-family:&quot;Franklin Gothic Book&quot;"><span id="75527" style="color:#44546a"><span id="10594" style="language:en-US"> do </span></span></span></span><span id="22477" style="font-size:20.0pt"><span id="41860" style="font-family:&quot;Franklin Gothic Book&quot;"><span id="15058" style="color:#44546a"><span id="55217" style="language:en-US">eiusmod</span></span></span></span> <span id="25539" style="font-size:20.0pt"><span id="62315" style="font-family:&quot;Franklin Gothic Book&quot;"><span id="67083" style="color:#44546a"><span id="26331" style="language:en-US">tempor</span></span></span></span> <span id="85623" style="font-size:20.0pt"><span id="44318" style="font-family:&quot;Franklin Gothic Book&quot;"><span id="59355" style="color:#44546a"><span id="52690" style="language:en-US">incididunt</span></span></span></span> <span id="80730" style="font-size:20.0pt"><span id="11025" style="font-family:&quot;Franklin Gothic Book&quot;"><span id="17979" style="color:#44546a"><span id="70012" style="language:en-US">ut</span></span></span></span> <span id="85909" style="font-size:20.0pt"><span id="8542" style="font-family:&quot;Franklin Gothic Book&quot;"><span id="39626" style="color:#44546a"><span id="50669" style="language:en-US">labore</span></span></span></span><span id="3835" style="font-size:20.0pt"><span id="55467" style="font-family:&quot;Franklin Gothic Book&quot;"><span id="77352" style="color:#44546a"><span id="92606" style="language:en-US"> et </span></span></span></span><span id="8225" style="font-size:20.0pt"><span id="40112" style="font-family:&quot;Franklin Gothic Book&quot;"><span id="97016" style="color:#44546a"><span id="33027" style="language:en-US">dolore</span></span></span></span><span id="98523" style="font-size:20.0pt"><span id="97881" style="font-family:&quot;Franklin Gothic Book&quot;"><span id="19447" style="color:#44546a"><span id="46837" style="language:en-US"> magna </span></span></span></span><span id="48541" style="font-size:20.0pt"><span id="87982" style="font-family:&quot;Franklin Gothic Book&quot;"><span id="71554" style="color:#44546a"><span id="15324" style="language:en-US">aliqua</span></span></span></span><span id="28308" style="font-size:20.0pt"><span id="3931" style="font-family:&quot;Franklin Gothic Book&quot;"><span id="6876" style="color:#44546a"><span id="73068" style="language:en-US">;</span></span></span></span></span></span></span></span></span></span></div>'+
                '<div id="72688" style="margin-top:7.5pt; margin-bottom:1.5pt; margin-left:.31in; text-align:justify"><span id="19467" style="language:nl"><span id="94513" style="line-height:94%"><span id="8249" style="text-justify:inter-ideograph"><span id="87225" style="unicode-bidi:embed"><span id="7607" style="vertical-align:baseline"><span id="13939" style="punctuation-wrap:hanging"><span id="58364" style="font-size:20.0pt"><span id="4805" style="font-family:&quot;Franklin Gothic Book&quot;">■</span></span><span id="90516" style="font-size:20.0pt"><span id="37822" style="font-family:&quot;Franklin Gothic Book&quot;"><span id="95505" style="color:#44546a"><span id="78006" style="language:en-US"><span id="71046" style="font-weight:bold">Lorem Ipsum</span></span></span></span></span><span id="30205" style="font-size:20.0pt"><span id="13555" style="font-family:&quot;Franklin Gothic Book&quot;"><span id="29805" style="color:#44546a"><span id="58193" style="language:en-US">: </span></span></span></span><span id="87088" style="font-size:20.0pt"><span id="64314" style="font-family:&quot;Franklin Gothic Book&quot;"><span id="40896" style="color:#44546a"><span id="87682" style="language:en-GB">is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</span></span></span></span> </span></span></span></span></span></span></div>'+
                '</div>'+
                '</div>'+
                '<div _id="20484" _idx="4294967295" _name="Θέση αριθμού διαφάνειας 6" _type="sldNum" class="drawing-container context-menu-disabled" id="57453" style="position: absolute; top: 478.794px; left: 1226.01px; width: 73.3333px; height: 42.4999px; z-index: 2147383647; cursor: auto;" tabindex="0"><svg _id="20484" _idx="4294967295" _name="Θέση αριθμού διαφάνειας 6" _type="sldNum" class="drawing context-menu-disabled" id="23417" style="position: absolute; top: 0px; left: 0px; width: 73.3333px; height: 42.4999px; z-index: 29882; cursor: auto;"><rect fill="none" height="42.49994750656168" id="14813" stroke="none" stroke-dasharray="0" stroke-width="1" width="73.33333333333333" x="0" y="0"></rect></svg></div>'+
                '<div class="context-menu-disabled" id="42079" style="position: absolute; top: -14.7607px; left: 104.576px; width: 31.2555px; height: 723.158px; z-index: 2147483647; cursor: auto;" tabindex="0">'+
                '<div class="h-left" id="79727"><img alt="" data-widget="image" id="99176" src="https://fileservice.stable.slidewiki.org/2346/88588ad0-a481-11e7-a346-5db6696affe9.png" style="width: 23.25px; height: 715.158px;" width="26" height="722"></div>'+
                '</div>'+
                '<div class="context-menu-disabled" id="69723" style="position: absolute; top: 614.595px; left: 154.33px; width: 1172.12px; height: 122.721px; z-index: 29872; cursor: auto;" tabindex="0">'+
                '<div class="h-left" id="11016"><img alt="" src="https://fileservice.stable.slidewiki.org/2346/1a75d390-a483-11e7-a346-5db6696affe9.png" id="40924" width="1427" height="79"></div>'+
                '</div>'+
                '<div class="context-menu-disabled" id="18921" style="position: absolute; top: 469.457px; left: 141.164px; width: 111.703px; height: 70.7775px; z-index: 2147383647; cursor: auto;" tabindex="0">'+
                '<div class="h-left" id="36912">&nbsp;</div>'+
                '</div>'+
                '<div class="context-menu-disabled" id="54829" style="position: absolute; top: 25.9078px; left: 145.666px; width: 185.596px; height: 116.33px; z-index: 2147383647; cursor: auto;" tabindex="0">'+
                '<div class="h-left" id="93035"><img alt="" id="27106" src="https://fileservice.stable.slidewiki.org/2346/11870fd0-a481-11e7-a346-5db6696affe9.png" style="width: 177.596px; height: 108.33px;" width="155" height="102"></div>'+
                '</div>'+
                '<div class="context-menu-disabled" id="10793" style="position: absolute; top: 49.3611px; left: 1085.84px; width: 174.514px; height: 67.8675px; z-index: 2147383647; cursor: auto;" tabindex="0">'+
                '<div class="h-left" id="34717"><img alt="" id="9225" src="https://fileservice.stable.slidewiki.org/2346/24fbd5f0-a481-11e7-a346-5db6696affe9.png" style="width: 166.514px; height: 59.8675px;" width="191" height="78"></div>'+
                '</div>'+
                '</div>';
                break;


        }
        this.emitChange(); //confirm non-save on-leave
        //this.addBorders();
        this.uniqueIDAllElements();
        this.resize();
        $('.pptx2html').css({'borderStyle': 'double', 'borderColor': 'rgba(218,102,25,0.5)'});
        this.resizeDrag();
        this.forceUpdate();
    }
    refreshCKeditor(){
        if (CKEDITOR.instances.inlineContent != null) {
            //console.log('destroy CKEDITOR instance');
            CKEDITOR.instances.inlineContent.destroy();
        }
        CKEDITOR.inline('inlineContent', {
            customConfig: '/assets/ckeditor_config.js',
            filebrowserUploadUrl: Microservices.import.uri + '/importImage/' + this.props.UserProfileStore.userid,
            uploadUrl: Microservices.import.uri + '/importImagePaste/' + this.props.UserProfileStore.userid}); //leave all buttons

        CKEDITOR.instances.inlineContent.on('instanceReady', (evt) => {
            if (this.refs.inlineContent.innerHTML.includes('pptx2html'))
            {
                this.forceUpdate();
                //this.addBorders();
                this.resizeDrag();
                //ugly fix for SWIK-1218-After using source dialog in CKeditor - input box controls (and template + input box button) do not work
                $('.cke_button__sourcedialog_label').mousedown((evt) => { //detect click on source dialog button
                    //remove resize and drag interaction because it generates HTML in slide editor content
                    this.disableResizeDrag();
                    console.log('====ckeditor on change====');
                    //add time because dialog needs to be generate/added to page before mousedown handler can be assigned to "OK" button with class cke_dialog_ui_button_ok
                    setTimeout(() => {
                        $('.cke_dialog_ui_button_ok').mouseup((evt) => { //detect click on "OK" in source dialog button
                            console.log('====ckeditor save button ok==== - refresh drag and menus');
                            //this.addBorders();
                            setTimeout(() => {
                                this.resizeDrag();
                                this.emitChange();
                                //this.forceUpdate();
                            }, 500);
                        });
                    }, 500);
                });
            }
            //ugly fix for SWIK-1348- Image dialog not appearing once image added to slide
            $('.cke_button__image_icon').mousedown((evt) => { //detect click on image dialog button
                console.log('====ckeditor image dialog onclick====');
                //add time because image dialog needs to be generate/added to page before mousedown handler can be assigned to "OK" button with class cke_dialog_ui_button_ok
                setTimeout(() => {
                    $('.cke_dialog_ui_button_ok').mouseup((evt) => { //detect click on "OK" in image dialog button
                        console.log('====ckeditor image save button ok==== refresh CKeditor');
                        //this.addBorders();
                        setTimeout(() => {
                            this.refreshCKeditor();
                            this.resizeDrag();
                            this.forceUpdate();
                            this.emitChange();
                        }, 500);
                    });
                }, 500);
            });
        });
    }
    //uniqueIDAllElements(givenContext){
    uniqueIDAllElements(){
        let allElements;
        //if(givenContext !== undefined){allElements = givenContext.refs.inlineContent.getElementsByTagName('*');}
        //else{
        //allElements = this.refs.inlineContent.getElementsByTagName('*');
        allElements = document.getElementsByTagName('*');
        //}
        let allIds = [];
        for (let i = 0, n = allElements.length; i < n; ++i) {
            let random = Math.floor((Math.random() * 100000) + 1);
            let el = allElements[i];
            if (el.id )
            {
                if(allIds.indexOf(el.id) !== -1)
                {//if duplicate entry:
                    while (allIds.indexOf(random) !== -1) {random = Math.floor((Math.random() * 100000) + 1);}
                    el.id = random; allIds.push(random);
                } else{
                    allIds.push(el.id);
                }
            }
            else {
                while (allIds.indexOf(random) !== -1){random = Math.floor((Math.random() * 100000) + 1);}
                el.id = random; allIds.push(random);
            }
        }
    }
    handleSaveButton(){
        if (this.props.UserProfileStore.username !== '') {
            // Replace the onbeforeunload function by a Blank Function because it is not neccesary when saved.
            // TODO: wait for successfull save signal from
            /*
            swal({
                title: 'Saving Content...',
                text: '',
                type: 'success',
                timer: 1000,
                showCloseButton: false,
                showCancelButton: false,
                allowEscapeKey: false,
                showConfirmButton: false
            });
            */
            this.loading = 'loading';
            //remove editing borders input boxes:
            $('.pptx2html [style*="absolute"]')
            .css({'borderStyle': '', 'borderColor': ''});
            $('.pptx2html')
            .css({'borderStyle': '', 'borderColor': '', 'box-shadow': ''});
            //reset scaling of pptx2html element to get original size
            $('.pptx2html').css({'transform': '', 'transform-origin': ''});
            //this.removeEditMode();
            $('.pptx2html [style*="absolute"]').find('.cke_widget_drag_handler_container').remove();
            $('.pptx2html [style*="absolute"]').find('.widget').remove();
            //if (CKEDITOR.instances.inlineContent != null) {
            //    console.log('destroy previous CKEDITOR instance');
            CKEDITOR.instances.inlineContent.destroy();
            //}
            //if (CKEDITOR.instances.inlineSpeakerNotes != null)  {
            //    console.log('destroy previous CKEDITOR instance');
            CKEDITOR.instances.inlineSpeakerNotes.destroy();
            //}
            //this.refreshCKeditor();
            this.disableResizeDrag();
            this.contextMenuAndDragDivAllRemove();
            //remove all ui-resizable-handles
            let elements = document.getElementsByClassName('ui-resizable-handle');
            while(elements.length > 0){
                elements[0].parentNode.removeChild(elements[0]);
            }

            this.uniqueIDAllElements();
            let title = (this.props.SlideEditStore.title !== '') ? this.props.SlideEditStore.title : ' ';
            let content = (this.refs.inlineContent.innerHTML !== '') ? this.refs.inlineContent.innerHTML : ' ';
            let speakernotes = (this.refs.inlineSpeakerNotes.innerHTML !== '') ? this.refs.inlineSpeakerNotes.innerHTML : ' ';
            //update store
            this.props.SlideEditStore.title = title;
            this.props.SlideEditStore.content = content;
            this.props.SlideEditStore.speakernotes = speakernotes;
            let currentSelector = this.props.selector;
            let deckID = currentSelector.id;
            let dataSources = (this.props.DataSourceStore.dataSources !== undefined) ? this.props.DataSourceStore.dataSources : [];
            let tags = this.props.SlideViewStore.tags? this.props.SlideViewStore: [];

            //setTimeout(function() {
            this.context.executeAction(saveSlide, {
                id: currentSelector.sid,
                deckID: deckID,
                title: title,
                content: content,
                speakernotes: speakernotes,
                dataSources: dataSources,
                selector: currentSelector,
                tags: tags
            });
            //},500);

            this.resize();
            this.forceUpdate();
        }
        return false;
    }
    disableResizeDrag(){
        $('.pptx2html [style*="absolute"]').each(function () {
            if($(this).draggable( 'instance' )){$(this).draggable('destroy');}
            if($(this).resizable( 'instance' )){$(this).resizable('destroy');}
            $(this).css('cursor', 'auto');
            $(this).css('box-shadow','');
        });
    }
    getHighestZIndex(){
        let index_highest = 0;
        $('.pptx2html [style*="absolute"]').each(function() {
            let index_current = parseInt($(this).css('zIndex'), 10);
            if(index_current > index_highest) {
                index_highest = index_current;
            }
        });
        //cEl.style.zIndex = index_highest + 10;
        console.log(index_highest);
        return index_highest;
    }
    getLowestZIndex(){
        let index_lowest = 9999999999;
        $('.pptx2html [style*="absolute"]').each(function() {
            let index_current = parseInt($(this).css('zIndex'), 10);
            if(index_current < index_lowest) {
                index_lowest = index_current;
            }
        });
        //cEl.style.zIndex = index_highest + 10;
        console.log(index_lowest);
        return index_lowest;
    }
    addAbsoluteDiv() {
        //absolutediv
        //Check if content already has canvas/absolute positioning
        //TODO replace with this.refs.inlineContent.innerHTML
        //if (typeof(CKEDITOR.instances.inlineContent) !== 'undefined' && CKEDITOR.instances.inlineContent.getData().indexOf('pptx2html') !== -1)
        if (this.refs.inlineContent.innerHTML.includes('pptx2html'))
        { // if pptx2html element with absolute content is in slide content (underlying HTML)
            //$('.pptx2html').append(this.getAbsoluteDiv(index_highest + 10));
            $('.pptx2html').append(this.getAbsoluteDiv(this.getHighestZIndex() + 10));
            //.css({'borderStyle': 'dashed dashed dashed dashed', 'borderColor': '#33cc33'});
            this.emitChange(); //confirm non-save on-leave
            this.uniqueIDAllElements();
            this.resizeDrag();
            this.forceUpdate();
        } else { //if slide does not have pptx2html/canvas/absolute positioning
            swal({
                title: 'Switch to canvas style layout',
                text: 'This will add input boxes to your slide which can be moved and resized. Your existing content will be placed in one input box. You will then be able to add new input boxes to separate existing content or add new boxes. Do you wish to continue?',
                type: 'question',
                showCloseButton: true,
                showCancelButton: true,
                confirmButtonText: 'Yes, switch to canvas-style with input boxes',
                confirmButtonClass: 'ui olive button',
                cancelButtonText: 'No',
                cancelButtonClass: 'ui red button',
                buttonsStyling: false
            }).then((accepted) => {
                //TODO replace with this.refs.inlineContent.innerHTML
                //let currentContent = CKEDITOR.instances.inlineContent.getData();
                //let newContent =
                this.refs.inlineContent.innerHTML = '<div class="pptx2html" style="width: 960px; height: 720px; position: relative; ">' +
                '<p></p><p></p><p></p><p></p><p></p><div _id="3" _idx="1" _name="Content Placeholder 2" _type="body" class="block content v-up" style="position: absolute; top: 10px; left: 10px; width: 940px; height: 700px; z-index: 2138483647; ">' +
                '<div class="h-left">' + this.refs.inlineContent.innerHTML + '</div>' +
                '</div>' +
                '</div>';
                //update content
                //TODO replace with this.refs.inlineContent.innerHTML
                //CKEDITOR.instances.inlineContent.setData(newContent);
                this.inputBoxButtonTitle = 'Add input box';
                this.emitChange(); //confirm non-save on-leave
                this.forceUpdate();
                this.resizeDrag();
                this.resize();
                $('.pptx2html').css({'borderStyle': 'double', 'borderColor': 'rgba(218,102,25,0.5)'});
            }, (reason) => {
                //done(reason);
            });
        }

    }
    getAbsoluteDiv(zindex){
        //return '<div style="position: absolute; top: 50px; left: 100px; width: 400px; height: 200px; z-index: '+zindex+';"><div class="h-mid" style="text-align: center;"><span class="text-block h-mid" style="color: #000; font-size: 44pt; font-family: Calibri; font-weight: initial; font-style: normal; ">New content</span></div></div>';
        return '<div style="position: absolute; top: 50px; left: 100px; width: 400px; height: 200px; z-index: '+zindex+';"><div class="h-left"><span class="text-block">New content</span></div></div>';
    }
    componentDidMount() {
        //todo: do testing and if it works remove these libs from default layout
        //if(process.env.BROWSER){
            //require('../../../../../node_modules/jquery-ui-dist/jquery-ui.min.js');
          //  require('../../../../../node_modules/ckeditor/ckeditor.js');
        //}
        $(this.refs.TemplateDropdown).dropdown();

        //TODO replace with context.getUser();
        const userId = this.props.UserProfileStore.userid;
        //TODO: needs sharedspace plugin for proper positioning of inline toolbars + http://ckeditor.com/addon/closebtn plugin for closing inline editor

        //destroy previous ckeditor-plugins
        if (CKEDITOR.instances.inlineContent != null) {
            console.log('destroy previous CKEDITOR instance');
            CKEDITOR.instances.inlineContent.destroy();
        }
        if (CKEDITOR.instances.inlineSpeakerNotes != null)  {
            console.log('destroy previous CKEDITOR instance');
            CKEDITOR.instances.inlineSpeakerNotes.destroy();
        }

        //TODO: takes some time before font-size and other drop-downs work... or immediately when clicking in inline input
        CKEDITOR.disableAutoInline = true;
        //if (typeof(CKEDITOR.instances.inlineSpeakerNotes) === 'undefined'){
        CKEDITOR.inline('inlineSpeakerNotes', {
            customConfig: '/assets/ckeditor_config_basic.js',
            toolbarGroups: [
                //needed for Chrome initialization
                { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline'] },
                { name: 'styles', items: [ 'FontSize' ] },
                { name: 'insert', items: [ 'Image'] },
                { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'JustifyLeft', 'JustifyCenter'] },
            ],
            //floatSpacePreferRight: true,
            //uiColor: '#4183C4',
            //removeButtons: 'Youtube,MathJax,Sourcedialog,CodeSnippet,Source,Save,NewPage,Preview,Print,Templates,Find,Replace,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Button,Select,HiddenField,ImageButton,Subscript,Superscript,RemoveFormat,NumberedList,Outdent,BulletedList,Indent,Blockquote,CreateDiv,BidiLtr,BidiRtl,Language,Image,Flash,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Styles,Maximize,ShowBlocks,About',
            filebrowserUploadUrl: Microservices.import.uri + '/importImage/' + userId,
            uploadUrl: Microservices.import.uri + '/importImagePaste/' + userId
        });

        CKEDITOR.inline('inlineContent', {
            //CKEDITOR.replace('inlineContent', {
            //customConfig: '/assets/ckeditor_config.js',
            customConfig: '/assets/ckeditor_config.js',
            toolbarGroups: [
                //needed for Chrome initialization
                { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline'] },
                { name: 'styles', items: [ 'FontSize' ] },
                { name: 'insert', items: [ 'Image'] },
                { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'JustifyLeft', 'JustifyCenter'] },
            ],
            filebrowserUploadUrl: Microservices.import.uri + '/importImage/' + userId,
            uploadUrl: Microservices.import.uri + '/importImagePaste/' + userId
        }); //leave all buttons
        //this.currentcontent = this.props.content;

        CKEDITOR.instances.inlineContent.on('instanceReady', (evt) => {
            this.resize();
            this.uniqueIDAllElements();
            if (this.refs.inlineContent.innerHTML.includes('pptx2html'))
            {
                this.forceUpdate();
                //this.addBorders();
                this.resizeDrag();

                //console.log('resizeDrag and borders');
                //show that content is outside of pptx2html box
                //$('.pptx2html').css({'borderStyle': 'none none double none', 'borderColor': '#3366ff', 'box-shadow': '0px 100px 1000px #ff8787'});
                $('.pptx2html').css({'borderStyle': 'double', 'borderColor': 'rgba(218,102,25,0.5)'});

                //ugly fix for SWIK-1218-After using source dialog in CKeditor - input box controls (and template + input box button) do not work
                $('.cke_button__sourcedialog_label').mousedown((evt) => { //detect click on source dialog button
                    //remove resize and drag interaction because it generates HTML in slide editor content
                    this.disableResizeDrag();
                    console.log('====ckeditor on change====');
                    //add time because dialog needs to be generate/added to page before mousedown handler can be assigned to "OK" button with class cke_dialog_ui_button_ok
                    setTimeout(() => {
                        $('.cke_dialog_ui_button_ok').mouseup((evt) => { //detect click on "OK" in source dialog button
                            console.log('====ckeditor save button ok==== - refresh drag and menus');
                            //this.addBorders();
                            setTimeout(() => {
                                this.resizeDrag();
                                this.emitChange();
                                //this.forceUpdate();
                            }, 500);
                        });
                    }, 500);
                });
            }
            //ugly fix for SWIK-1348- Image dialog not appearing once image added to slide
            $('.cke_button__image_icon').mousedown((evt) => { //detect click on image dialog button
                console.log('====ckeditor image dialog onclick====');
                //add time because image dialog needs to be generate/added to page before mousedown handler can be assigned to "OK" button with class cke_dialog_ui_button_ok
                setTimeout(() => {
                    $('.cke_dialog_ui_button_ok').mouseup((evt) => { //detect click on "OK" in image dialog button
                        console.log('====ckeditor image save button ok==== refresh CKeditor');
                        //this.addBorders();
                        setTimeout(() => {
                            this.refreshCKeditor();
                            this.resizeDrag();
                            this.forceUpdate();
                            this.emitChange();
                        }, 500);
                    });
                }, 500);
            });
            if(document.domain !== 'localhost')
            {
                document.domain = 'slidewiki.org';
            }
        });
        //fix bug with speakernotes overlapping soure dialog/other elements - SWIK-832
        $('#inlineSpeakerNotes [style*="absolute"]').css({'position': 'relative', 'zIndex': '0'});

        ReactDOM.findDOMNode(this.refs.container).addEventListener('resize', (evt) => {
            if(process.env.BROWSER){
                this.resize();
                //this.forceUpdate();
            }
        });

        this.correctImageBoxes();
    }
    correctImageBoxes(){
        $('.pptx2html [style*="absolute"]').each(function () {
            if($(this).find('img:first').length)
            { //find boxes with images inside
                //console.log('adjust image');
                //console.log('image width' + $(this).find('img:first').width());
                //console.log('image width attr' + $(this).find('img:first').attr('width'));
                //console.log('box width' + $(this).width());
                if($(this).width() < $(this).find('img:first').width()+8)
                { //check if box width is smaller than image width/height
                    $(this).width($(this).find('img:first').width() + 8);
                //    console.log('adjust image width');
                }
                if($(this).height() < $(this).find('img:first').height()+8)
                { //check if box height is smaller than image width/height
                    $(this).height($(this).find('img:first').height() + 8);
                //    console.log('adjust image height');
                }
            }
        });
    }

    resizeDrag(){
        //http://jqueryui.com/resizable/
        //http://interface.eyecon.ro/docs/resizable

        // TODO -> create SVG around draggable element with points/blocks for resize handlers
        // OR by emulating textarea - http://stackoverflow.com/questions/18427555/jquery-textarea-draggable
        // or: make images JQUERY draggable, and have original button for text input  - too complex
        //<g><path fill="#000" fill-opacity="0" stroke="#000" stroke-opacity="0" stroke-width="10550.76923076923" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" pointer-events="visiblePainted" d="M 4331 28073 L 318671 28073 318671 170081 4331 170081 Z"></path></g>
        // TODO: Make background outside slide grey!

        //***************position mode - default/start//***************

        let slideEditorContext = this; //set slideEditorContext inside doubleclick callbacks

        //$('.pptx2html [style*="absolute"]').not('.drawing').css('cursor', 'move');
        $('.pptx2html [style*="absolute"]').not('.drawing').css('cursor', 'auto');
        $('.pptx2html [style*="absolute"]').not('.drawing').hover(function() { //no dragging of SVG - makes them go away
            if (!$(this).hasClass('editMode')) {
                //console.log('resize/drag? ' + $('.pptx2html').find('ui-resizable-resizing').length);
                if (!(
                    $('.ui-resizable-resizing')[0]
                    || $('.ui-draggable-dragging')[0])
                   ){
                    //if there is nothing being dragged/resized currently
                    $('.'+$(this).attr('id')).show();
                    $('.'+$(this).attr('id')+'dragdiv').show();
                    //$(this).css({'box-shadow':'0 0 15px 5px rgba(81, 203, 238, 1)'});
                    $(this).css({'box-shadow':'0 0 15px 5px rgba(0, 150, 253, 1)'});
                }
                //if(!$('.editMode').draggable( 'instance' )){$(this).draggable({cursor: 'move'});}
                if(!$('.editMode').draggable( 'instance' )){
                    $(this).draggable({
                        cursor: 'move',
                        //handle: '.drag-handle',
                        //handle: '.move',
                        handle: '.dragdiv',
                        //handle: '#'+$(this).attr('id')+'dragdiv',
                        //handle: '.'+$(this).attr('id'),
                        //handle: '.'+$(this).attr('id')+'dragdiv',
                        start: function(event, ui) {
                            ui.position.left = 0;
                            ui.position.top = 0;
                            let zIndex = $('.ui-draggable-dragging').css('z-index');
                            $('.ui-draggable-dragging').css('z-index', zIndex + 100000);
                        },
                        drag: function(event, ui) {
                            let changeLeft = ui.position.left - ui.originalPosition.left; // find change in left
                            let newLeft = ui.originalPosition.left + changeLeft / (( slideEditorContext.scaleratio)); // adjust new left by our zoomScale
                            let changeTop = ui.position.top - ui.originalPosition.top; // find change in top
                            let newTop = ui.originalPosition.top + changeTop / slideEditorContext.scaleratio; // adjust new top by our zoomScale
                            ui.position.left = newLeft;
                            ui.position.top = newTop;
                        },
                        stop: function(event, ui) {
                            slideEditorContext.emitChange();
                            let zIndex = $('.ui-draggable-dragging').css('z-index');
                            $('.ui-draggable-dragging').css('z-index', zIndex - 100000);
                        }
                    });
                }
                //if(!$('.editMode').resizable( 'instance' )){$(this).resizable({handles: 'all', scroll: true});}
                if(!$('.editMode').resizable( 'instance' )){
                    $(this).resizable({
                        handles: 'all',
                        scroll: true,
                        minWidth: -($(this).width()) * 10,  // these need to be large and negative
                        minHeight: -($(this).width()) * 10, // so we can shrink our resizable while scaled
                        start: function(event, ui) {
                            let zIndex = $('.ui-resizable-resizing').css('z-index');
                            $('.ui-resizable-resizing').css('z-index', zIndex + 100000);
                        },
                        resize: function(event, ui) {
                            let changeWidth = ui.size.width - ui.originalSize.width; // find change in width
                            let newWidth = ui.originalSize.width + changeWidth / slideEditorContext.scaleratio; // adjust new width by our zoomScale
                            let changeHeight = ui.size.height - ui.originalSize.height; // find change in height
                            let newHeight = ui.originalSize.height + changeHeight / slideEditorContext.scaleratio; // adjust new height by our zoomScale
                            //console.log(ui.size.width + ' ' + newWidth + ' ' + ui.size.height + ' ' + newHeight);
                            ui.size.width = newWidth;
                            ui.size.height = newHeight;
                            if($(this).find('img:first').length)
                            {
                                $(this).find('img:first').width(newWidth - 8);
                                $(this).find('img:first').height(newHeight - 8);
                            }
                        },
                        stop: function(event, ui) {
                            let zIndex = $('.ui-resizable-resizing').css('z-index');
                            $('.ui-resizable-resizing').css('z-index', zIndex - 100000);
                            slideEditorContext.emitChange();
                        }
                    });
                };
            }
            else {
                $(this).css({'box-shadow':'0 0 15px 5px rgba(218, 102, 25, 1)'});
            }
        }, function() {
            if (!$(this).hasClass('editMode')
            && !$(this).hasClass('ui-resizable-resizing')
            && !$(this).hasClass('ui-draggable-dragging')
            && !$('.context-menu-list')[0])
            {
                //if this class is not being dragged/resized currently
                $('.'+$(this).attr('id')).hide(); //hide contextmenu for this element
                $('.'+$(this).attr('id') +'dragdiv').hide(); //hide move button for this element
                $(this).css('box-shadow','');
            }
            //$(this).not('.drawing-container').css({'borderStyle': '', 'borderWidth': '', 'borderColor': ''});
        });
        $('.pptx2html [style*="absolute"]').not('.drawing').keyup((event) => {
            if( event.which === 9 ) { //if tabkey
                console.log( event.target.id );
                console.log('tabFocus');
                //let id = $(':focus').attr('id');
                let id = event.target.id;
                if (!id || id === 'inlineContent'){id = this.menuFocus; console.log('used menuFocus');}
                if (id && id !== 'inlineContent')
                {
                    /*
                    if(!$('#'+id).hasClass('editMode')){
                        if($('.editMode').length)
                        {   //there is one or more editMode element (earlier via doubleclick)
                            //we disable edit mode from the(se) element(s).
                            this.removeEditMode();
                        }
                    }*/
                    this.menuFocus = id;
                    //console.log('tabFocus set to: ' + id + ' - this.menufocus:'+ this.menuFocus + 'slideEditorContext.menufocus:'+  slideEditorContext.menuFocus);
                    $('.pptx2html [style*="absolute"]').css({'box-shadow':''}); //remove existing box-shadows
                    //$('#' + id).css({'box-shadow':'0 0 15px 5px rgba(81, 203, 238, 1)'});
                    $('#' + id).css({'box-shadow':'0 0 15px 5px rgba(0, 150, 253, 1)'});
                }
            }
        });
        //TODO: http://chrispearce.co/exploring-hotkeys-and-focus-in-react/

        /*
        $('.pptx2html [style*="absolute"]').focusin(function(event) {
            event.preventDefault();
        }, function() {
        });
        */

        //$('.pptx2html [style*="absolute"]').click(function() {
        /*
        $('.pptx2html [style*="absolute"]').not('.drawing').mousedown(function(event) {
            switch (event.which) {
                case 1:
                    console.log('Left Mouse button pressed.');
                    //$('.cke_menu').hide();
                    if ($(this).attr('id') !== 'inlineContent')
                    {
                        slideEditorContext.menuFocus = $(this).attr('id');
                        console.log('this.menuFocus: ' + slideEditorContext.menuFocus + 'should be ' + $(this).attr('id'));
                        if (!$(this).hasClass('editMode'))
                        { //the clicked element is not editMode
                            console.log('hide ckeditor context menu');
                            $('.cke_menu').hide();
                            /*
                            if($('.editMode').length)
                            {   //there is one or more editMode element (earlier via doubleclick)
                                //we disable edit mode from the(se) element(s).
                                slideEditorContext.removeEditMode();
                            }
                            *//*
                        }
                    }
                    break;
                case 2:
                    console.log('Middle Mouse button pressed.');
                    break;
                case 3:
                    console.log('Right Mouse button pressed.');
                    //event.preventDefault();
                    if ($(this).attr('id') !== 'inlineContent')
                    {
                        slideEditorContext.menuFocus = $(this).attr('id');
                        console.log('this.menuFocus: ' + slideEditorContext.menuFocus + 'should be ' + $(this).attr('id'));
                        if (!$(this).hasClass('editMode'))
                        {
                            $('.pptx2html [style*="absolute"]').css({'box-shadow':''}); //remove existing box-shadows
                            //$(this).css({'box-shadow':'0 0 15px 5px rgba(81, 203, 238, 1)'});
                            $(this).css({'box-shadow':'0 0 15px 5px rgba(0, 150, 253, 1)'});
                            console.log('hide ckeditor context menu');
                            $('.cke_menu').hide();
                            //set cursor to
                            slideEditorContext.previousCaretRange = slideEditorContext.getMouseEventCaretRange(event);
                            //slideEditorContext.selectRange(caretRange);
                            //also need to get + store previous caretrange for context menu
                            //console.log('caretrange: ' + caretRange + evt.clientX + evt.clientY);
                            //let caretRange = this.getMouseEventCaretRange(evt);
                            // Set a timer to allow the selection to happen and the dust settle first
                            //window.setTimeout(function() {
                            //CKEDITOR.instances.inlineContent.destroy();
                            //slideEditorContext.refs.inlineContent.contentEditable = false;
                            //CKEDITOR.instances.inlineContent.hide();
                        }
                        else {
                            slideEditorContext.removeEditMode();
                        }
                        //$(this).focus();
                    }
                    break;
                default:
                    break;
            }

        });
        */


        //give each input element a tab index
        //$('.pptx2html [style*="absolute"]').each(function (i) { $(this).attr('tabindex', i + 1); });
        //$('.pptx2html [style*="absolute"]').each(function () { if ($(this).attr('tabindex') !== ''){$(this).attr('tabindex', 0);} });
        $('.pptx2html [style*="absolute"]').not('.drawing').each(function () { if ($(this).attr('tabindex') !== ''){$(this).attr('tabindex', 0);} });
        //give each input box element a context menu (hide/overlap CKeditor context menu)
        this.contextMenuAll();

        //***************content mode//***************
        //TODO: on undo (ctr-l Z) - restore resize/drag elements previously removed
        //TODO: on editing source in CKeditor - restore resize/drag elements
        //TODO: caret position is reset in firefox, except for when typing
        //TODO: call emitChange() for new actions
        //TODO: if you select an element and starty typing: then directly switch to edit mode

        //set double click event for input box - ondoubleclick - remove dragable and set cursor to auto for editing content
        /*
        $('.pptx2html [style*="absolute"]').not('.drawing').dblclick(function(evt) {
            if (!$(this).hasClass('editMode'))
            {
                slideEditorContext.setEditMode(evt, slideEditorContext, $(this).attr('id'), false);
            }
        });
        */
    }
    /*
    removeEditMode(){
        //$(this).focus();
        // re-apply draggable to editMode element
        if ($('.editMode').length){
            if(!$('.editMode').draggable( 'instance' )){$('.editMode').draggable({cursor: 'move'});}
            $('.editMode').css('cursor', 'pointer');
            $('.editMode').css('box-shadow','');
            //$('.cke_menu').show();
            $('.cke_menu').hide();
            $('.editMode').contextMenu(true);
            $('.editMode').removeClass('editMode');
        }
    }
    */
    enterEditKey(evt, slideEditorContext, clickMenuFocus, previousCaret){
        console.log('editmode with event: ' + evt);
        let id = $(':focus').attr('id');
        //let id = this.currentfocus;
        //let id = $('.currentFocus').attr('id');
        if (slideEditorContext.menuFocus) {
            id = slideEditorContext.menuFocus;
            console.log('menufocus via shortkey and/or tabindex - clickMenuFocusId: ' + id);
        }
        //id on which edit mode is applied
        console.log('enterEditKey with id: ' + id);
        if(id !== 'inlineContent')
        {

            if(!$('#'+id).hasClass('.editMode') &&
               !$('#'+id).hasClass('drawing-container') &&
                id !== 'inlineContent')
            { //if not already in edit mode or is not SVG in drawing-container
                $('.cke_menu').show();

                if (evt)
                {//if not already in input mode
                    if(evt.keyCode){ //if keyboard event
                        evt.preventDefault(); //do not fire enter key for changing content via contenteditable/Ckeditor
                        //set caret to start of text (span) in last selected div element
                        slideEditorContext.placeCaretAtStart(id);
                    }
                }
                else {

                    //set caret to start of text (span) in last selected div element
                    slideEditorContext.placeCaretAtStart(id);
                }
                $('#' + id).css('cursor', 'auto');
                $('#' + id).css({'box-shadow':'0 0 15px 5px rgba(218, 102, 25, 1)'});
                console.log('set edit mode end, with currentfocus: ' + id);
            }
        }
        else {
            console.log('editmode canceled due to selection of inlineContent');
        }
    }
    /*
    setEditMode(evt, slideEditorContext, clickMenuFocus, previousCaret){
        console.log('editmode with event: ' + evt);
        let id = $(':focus').attr('id');
        //let id = this.currentfocus;
        //let id = $('.currentFocus').attr('id');
        if (clickMenuFocus){
            //if right-click context menu has selected an input box object
            id = clickMenuFocus;
            console.log('right-click context menu or dblclick has selected an input box - clickMenuFocusId: ' + id);
            if($('#'+id).css('position') === 'absolute'){
                console.log('position of menufocus' + $('#'+clickMenuFocus).css('position'));
            }
        } else if (slideEditorContext.menuFocus) {
            id = slideEditorContext.menuFocus;
            console.log('menufocus via shortkey and/or tabindex - clickMenuFocusId: ' + id);
        }
        //id on which edit mode is applied
        console.log('seteditmode with id: ' + id);
        if(id !== 'inlineContent')
        {
            $('.context-menu-list').trigger('contextmenu:hide'); //hide any active context menu
            slideEditorContext.removeEditMode(); //remove existing edit mode from existing elements

            if(!$('#'+id).hasClass('.editMode') &&
               !$('#'+id).hasClass('drawing-container') &&
                id !== 'inlineContent')
            { //if not already in edit mode or is not SVG in drawing-container
                $('.cke_menu').show();
                console.log('disable extra context menu with id: ' + id );
                $('#'+id).contextMenu(false);

                if (evt)
                {//if not already in input mode
                    if(evt.keyCode){ //if keyboard event
                        evt.preventDefault(); //do not fire enter key for changing content via contenteditable/Ckeditor
                        //set caret to start of text (span) in last selected div element
                        slideEditorContext.placeCaretAtStart(id);
                    }
                    else {
                        let caretRange = slideEditorContext.getMouseEventCaretRange(evt);
                        //console.log('caretrange: ' + caretRange + evt.clientX + evt.clientY);
                        //let caretRange = this.getMouseEventCaretRange(evt);
                        // Set a timer to allow the selection to happen and the dust settle first
                        //window.setTimeout(function() {
                        slideEditorContext.selectRange(caretRange);
                        //this.selectRange(caretRange);
                        //}, 10);
                    }
                }
                else {
                    //event is false = right-click context menu was used
                    if (previousCaret){
                        slideEditorContext.selectRange(previousCaret);
                    } else {
                        //set caret to start of text (span) in last selected div element
                        slideEditorContext.placeCaretAtStart(id);
                    }
                }
                if($('#' + id).draggable( 'instance' )){$('#' + id).draggable('destroy');}
                $('#' + id).css('cursor', 'auto');
                $('#' + id).addClass('editMode');
                // TODO:  restore draggable after pressing 'esc' key
                $('#' + id).css({'box-shadow':'0 0 15px 5px rgba(218, 102, 25, 1)'});
                console.log('set edit mode end, with currentfocus: ' + id);
            }
        }
        else {
            console.log('editmode canceled due to selection of inlineContent');
        }
    }*/
    placeCaretAtStart(id) {
        console.log('placeCaretAtStart');
        let el = $('#'+id).find('span:first').not('.cke_widget_wrapper')[0];
        console.log(el);
        if(!el){el = $('#'+id).find('p:first')[0];console.log('id + find first span not found'); console.log('try id + find first p');}
        if(!el){el = $('#'+id).find('div:first').not('.ui-resizable-handle')[0];console.log('try id + find first div not ui-resizable');}
        if(!el){el = $('#'+id).find('img:first')[0];console.log('try id + find first img');
        //if ($('#'+id).find('img:first')[0])
            if (el)
            {console.log('create surrounding div so image can be selected with keyboard');
                let emptySpan = document.createElement('span');
                emptySpan.innerHTML = '';
                $('#'+id).prepend(emptySpan);
                el = $('#'+id).find('span:first').not('.cke_widget_wrapper')[0];
            }
        }
        if(!el){el = $('#'+id)[0];console.log('id directly');}
        if(!el){el = $(':focus').find('span:first')[0];console.log('try focus find span first 0');}
        //if(!el){el = $(':focus');console.log('id of focus');}
        if(!el){console.log('nothing found, create span element');
            let emptySpan = document.createElement('span');
            emptySpan.innerHTML = '';
            $('#'+id).prepend(emptySpan);
            el = $('#'+id).find('span:first').not('.cke_widget_wrapper')[0];
        }
        el.focus();
        if (typeof window.getSelection != 'undefined'
                && typeof document.createRange != 'undefined') {
            let range = document.createRange();
            try{
                range.selectNodeContents(el);
            } catch(error){
                console.log('selectNodeContents - error');
                console.log('reset context menu');
                $('#'+id).contextMenu(true);
                return false;
            }
            //range.collapse(false);
            range.collapse(true);
            let sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        } else if (typeof document.body.createTextRange != 'undefined') {
            let textRange = document.body.createTextRange();
            textRange.moveToElementText(el);
            textRange.collapse(false);
            textRange.select();
        }
    }
    /*
    getMouseEventCaretRange(evt) {
        let range, x = evt.clientX, y = evt.clientY;
        // Try the simple IE way first
        if (document.body.createTextRange) {
            range = document.body.createTextRange();
            range.moveToPoint(x, y);
        }
        else if (typeof document.createRange != 'undefined') {
            // Try Mozilla's rangeOffset and rangeParent properties,
            // which are exactly what we want
            if (typeof evt.rangeParent != 'undefined') {
                range = document.createRange();
                range.setStart(evt.rangeParent, evt.rangeOffset);
                range.collapse(true);
            }
            // Try the standards-based way next
            else if (document.caretPositionFromPoint) {
                let pos = document.caretPositionFromPoint(x, y);
                range = document.createRange();
                range.setStart(pos.offsetNode, pos.offset);
                range.collapse(true);
            }
            // Next, the WebKit way
            else if (document.caretRangeFromPoint) {
                range = document.caretRangeFromPoint(x, y);
            }
        }
        return range;
    }
    selectRange(range) {
        if (range) {
            if (typeof range.select != 'undefined') {
                range.select();
            } else if (typeof window.getSelection != 'undefined') {
                let sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    }
    */
    contextMenuAndDragDivAllRemove(){
        $('.pptx2html [style*="absolute"]').each(function () {
            $(this).contextMenu(false);
            $('.'+$(this).attr('id')+'dragdiv').remove();
            $('.'+$(this).attr('id')).remove();
            //$(this).find('.cke_widget_wrapper').remove();
        });
    }
    contextMenuAll(){
        let slideEditorContext = this;
        //https://github.com/swisnl/jQuery-contextMenu
        //http://swisnl.github.io/jQuery-contextMenu/
        $('.pptx2html [style*="absolute"]').each(function () {
            this.innerHTML = '<div tabIndex="-1"  style="top: -32px; left: 0px; position: absolute; z-index: 90000000;" class="'+  $(this).attr('id')+'dragdiv dragdiv ui button orange outline"><i tabIndex="-1" class="move icon"></i></div>' + this.innerHTML;
            $('.'+$(this).attr('id')+'dragdiv').hide();
            this.innerHTML = '<div tabIndex="-1" style="top: -32px; left: 60px; position: absolute; z-index: 90000000;"  class="context-menu-one ui button blue outline '+  $(this).attr('id')+'" id="'+  $(this).attr('id')+'"><i tabIndex="-1" class="tasks icon"></i></div>' + this.innerHTML;
            $('.'+$(this).attr('id')).hide();
            //this.innerHTML = '<div><button tabIndex="0" class="'+  $(this).attr('id')+'dragdiv ui button orange outline '+  $(this).attr('id')+'"  style="left: 50px; position: absolute; z-index: 90000000;"><i class="move icon small"></i></button></div>' + this.innerHTML;
            //let menuID = $(this).attr('id');
            //if(!$(this).draggable( 'instance' )){
            //console.log('menu for: ' + $(this).attr('id'));
            $.contextMenu({
            //$('.pptx2html').contextMenu({
                // define which elements trigger this menu
                //selector: '.pptx2html [style*="absolute"]',
                //selector: '#'+$(this).attr('id'),
                selector: '.context-menu-one',
                trigger: 'left',
                build: function($trigger, e) {
                    //let id = $trigger.attr('id');
                    let id = $trigger.attr('id');
                    console.log('menu for: ' + id);
                    return {
                        // define the elements + functions of the menu
                        callback: function(key, options) {
                            console.log('context menu clicked: ' + key +  'on'  + id);
                            //console.log('context menu clicked: ' + key +  'on'  + $(this).attr('id')+ $(this).text());
                            $('.'+$(this).attr('id')).show();
                            switch (key) {
                                //case 'edit':
                                    //slideEditorContext.setEditMode(key, slideEditorContext, slideEditorContext.menuFocus);
                                    //slideEditorContext.setEditMode(false, slideEditorContext, slideEditorContext.menuFocus, slideEditorContext.previousCaretRange);
                                    //break;
                                case 'front':
                                    slideEditorContext.bringToFront(slideEditorContext, false, $(this).attr('id'));
                                    break;
                                case 'back':
                                    slideEditorContext.sendToBack(slideEditorContext, false, $(this).attr('id'));
                                    break;
                                case 'duplicate':
                                    slideEditorContext.duplicateNode(slideEditorContext, false, $(this).attr('id'));
                                    break;
                                case 'delete':
                                    slideEditorContext.deleteNode(slideEditorContext, false, $(this).attr('id'));
                                    break;
                                case 'quit':
                                    break;
                                default:
                            }
                        },
                        items: {
                            //'edit': {name: 'Edit (key: Ctrl enter)', icon: 'edit'},
                            //'move': {name: 'Move around', icon: 'fa-arrows',},
                            'front': {name: 'Bring to front (Ctrl shift +)', icon: 'fa-arrow-circle-up'},
                            'back': {name: 'Send to back (Ctrl shift -)', icon: 'fa-arrow-circle-o-down'},
                            'duplicate': {name: 'Duplicate (Ctrl d)', icon: 'copy'},
                            'delete': {name: 'Delete (ctrl Del)', icon: 'delete'},
                            //'sep1': '---------',
                            'quit': {name: 'Close menu (Esc)', icon: 'quit', accesskey: 'esc'}
                            //'quit': {name: 'Send to back', icon: 'quit'},
                        }
                    };
                },

            });
            $(this).contextMenu(true);
            //}
        });
    }

    componentDidUpdate() {
        $(this.refs.TemplateDropdown).dropdown();
        if(typeof(CKEDITOR.instances.inlineContent) !== 'undefined' && CKEDITOR.instances.inlineContent.getData().indexOf('pptx2html') !== -1)
        { // if pptx2html element with absolute content is in slide content (underlying HTML)
            this.inputBoxButtonTitle = 'Add input box';
        } else { //if slide does not have pptx2html/canvas/absolute positioning
            this.inputBoxButtonTitle = 'Switch to canvas with input boxes';
        }
    }
    addBorders() { //not used at the moment
        //do not put borders around empty divs containing SVG elements
        //if ($('.pptx2html [style*="absolute"]').not('.drawing-container').css('borderStyle') !== 'dashed') {
        if ($('.pptx2html [style*="absolute"]').not('.drawing-container').css('borderStyle') !== 'solid') {
            //$('.pptx2html [style*="absolute"]').not('.drawing-container').css({'borderStyle': 'dashed', 'borderColor': '#33cc33'});
            $('.pptx2html [style*="absolute"]').not('.drawing-container').css({'borderStyle': 'solid', 'borderWidth': '1px', 'borderColor': 'rgba(30,120,187,0.5)'});
        }
    }
    keyContextMenu(event, context){
        let id = $(':focus').attr('id');
        if (!id || id === 'inlineContent'){id = context.menuFocus;}
        console.log('keyContextMenu id: ' + id);
        if(event){event.preventDefault();}
        //$('#'+id).contextMenu(true);
        //$('.context-menu-list').trigger('contextmenu:show');
        $('.'+id).show();
        $('#'+id).contextMenu(true);
        $('.'+id).contextMenu(true);
        $('#'+id).contextMenu();
        $('.'+id).contextMenu();
        //$('#'+id).trigger('contextmenu:show');
    }
    keyMoveUp(context, event){
        let id = $(':focus').attr('id');
        if (!id || id === 'inlineContent'){id = context.menuFocus;}
        if(!$('.editMode').length && !$('#'+id).hasClass('context-menu-active') && id !== 'inlineContent'){
            //console.log('keyup not in edit mode + preventdefault');
            if(event){event.preventDefault();}
            $('#'+id).css('top', '-=10');
            context.emitChange(); //confirm non-save on-leave
        }
    }
    keyMoveDown(context, event){
        let id = $(':focus').attr('id');
        if (!id || id === 'inlineContent'){id = context.menuFocus;}
        if(!$('.editMode').length && !$('#'+id).hasClass('context-menu-active') && id !== 'inlineContent'){
            if(event){event.preventDefault();}
            //console.log('keyup not in edit mode + preventdefault');
            $('#'+id).css('top', '+=10');
            context.emitChange(); //confirm non-save on-leave
        }
    }
    keyMoveLeft(context, event){
        let id = $(':focus').attr('id');
        if (!id || id === 'inlineContent'){id = context.menuFocus;}
        if(!$('.editMode').length && !$('#'+id).hasClass('context-menu-active') && id !== 'inlineContent'){
            if(event){event.preventDefault();}
            $('#'+id).css('left', '-=10');
            context.emitChange(); //confirm non-save on-leave
        }
    }
    keyMoveRight(context, event){
        let id = $(':focus').attr('id');
        if (!id || id === 'inlineContent'){id = context.menuFocus;}
        if(!$('.editMode').length && !$('#'+id).hasClass('context-menu-active') && id !== 'inlineContent'){
            if(event){event.preventDefault();}
            $('#'+id).css('left', '+=10');
            context.emitChange(); //confirm non-save on-leave
        }
    }
    bringToFront(context, event, idContext){
        $('.context-menu-list').trigger('contextmenu:hide'); //hide any active context menu
        let id = idContext;
        if (!id){id = $(':focus').attr('id');}
        if (!id || id === 'inlineContent'){id = context.menuFocus;}
        if(!$('#'+id).hasClass('editMode') &&  id !== 'inlineContent'){
            if(event){event.preventDefault();}
            $('#'+id).css('zIndex', context.getHighestZIndex() + 10);
            context.emitChange(); //confirm non-save on-leave
        }
    }
    sendToBack(context, event, idContext){
        $('.context-menu-list').trigger('contextmenu:hide'); //hide any active context menu
        let id = idContext;
        if (!id){id = $(':focus').attr('id');}
        if (!id || id === 'inlineContent'){id = context.menuFocus;}
        if(!$('#'+id).hasClass('editMode')){
            if(event){event.preventDefault();}
            $('#'+id).css('zIndex', context.getLowestZIndex() - 10);
            context.emitChange(); //confirm non-save on-leave
        }
    }
    duplicateNode(context, event, idContext){
        let localContext = context;
        $('.context-menu-list').trigger('contextmenu:hide'); //hide any active context menu
        let id = idContext;
        if (!id){id = $(':focus').attr('id');}
        if (!id || id === 'inlineContent'){id = context.menuFocus;}
        console.log('duplicate node' + id);
        if(!$('#'+id).hasClass('editMode') && !$('.editMode').length){
            if(event){event.preventDefault();}
            context.contextMenuAndDragDivAllRemove();
            $('#'+id).clone().appendTo('.pptx2html');
            $('#'+id).css('top', '+=50');
            context.emitChange(); //confirm non-save on-leave
            //context.uniqueIDAllElements(localContext);
            context.uniqueIDAllElements();
            context.resizeDrag();
            //this.forceUpdate();
        }
    }
    deleteNode(context, event, idContext){
        $('.context-menu-list').trigger('contextmenu:hide'); //hide any active context menu
        let id = idContext;
        if (!id){id = $(':focus').attr('id');}
        if (!id){id = context.menuFocus;}
        if(!$('#'+id).hasClass('editMode') && !$('.editMode').length && !$('#'+id).hasClass('pptx2html') && id !== 'inlineContent'){
            if(event){event.preventDefault();}
            swal({
                title: 'Remove element',
                text: 'Are you sure you want to delete this element?',
                type: 'question',
                showCloseButton: true,
                showCancelButton: true,
                confirmButtonText: 'Yes',
                confirmButtonClass: 'ui olive button',
                cancelButtonText: 'No',
                cancelButtonClass: 'ui red button',
                buttonsStyling: false
            }).then((accepted) => {
                //if (!$(this).hasClass('pptx2html')){
                //if (!$('#'+id).hasClass('pptx2html') && id !== 'inlineContent'){
                console.log('delete node with id:' + id);
                if ($('.pptx2html [style*="absolute"]').length === 1)
                {
                    console.log('last element');
                    //add a div element to prevent empty PPTX element which gets removed by CKeditor
                    let emptydiv = document.createElement('div');
                    emptydiv.innerHTML = '';
                    //$('#'+id).parentNode.appendChild(emptydiv);
                    $('#'+id).parent().append(emptydiv);
                }
                //$(this).remove();
                $('#'+id).remove();
                context.emitChange(); //confirm non-save on-leave
                //}
            }, (reason) => {
                //done(reason);
            });
        }
    }
    /*
    menuOptionsPreventDefault(event, context){
        let id = $(':focus').attr('id');
        if (context.menuFocus){
            id = context.menuFocus;
        }
        console.log('prevent default 1-5 key if in context menu' + !$('.editMode').length + $('#'+id).hasClass('context-menu-active') + id);
        //if(!$('.editMode').length && $('#'+id).hasClass('context-menu-active')){
        //if(!$('.editMode').length){
        if(!$('.editMode').length && $('#'+id).hasClass('context-menu-active')){
            if(event){event.preventDefault();}
            console.log('prevent default 1-5 key');
        }
    }

    keyEnter(context, event){
        //$('.context-menu-list').trigger('contextmenu:hide'); //hide any active context menu
        let id = $(':focus').attr('id');
        if (!id){id = context.menuFocus;}
        console.log('prevent default enter key when context menu shows' +  $('#'+id).hasClass('context-menu-active') + id);
        //if(!$('.editMode').length && $('#'+id).hasClass('context-menu-active')){
        //if(!$('.editMode').length){
        if($('#'+id).hasClass('context-menu-active')){
            if(event){event.preventDefault();}
            console.log('prevent default enter key');
        }
    }
    */
    resize() {
        if($('.pptx2html').length)
        {
            let containerwidth = document.getElementById('container').offsetWidth;
            let containerheight = document.getElementById('container').offsetHeight;
            //reset scaling of pptx2html element to get original size
            $('.pptx2html').css({'transform': '', 'transform-origin': ''});
            //Function to fit contents in edit and view component
            let pptxwidth = $('.pptx2html').width();
            let pptxheight = $('.pptx2html').height();
            //TODO - change to get right!
            this.scaleratio = containerwidth / (pptxwidth+50);
            //this.scaleratio = containerwidth / (pptxwidth+120);
            $('.pptx2html').css({'transform': '', 'transform-origin': ''});
            $('.pptx2html').css({'transform': 'scale('+this.scaleratio+','+this.scaleratio+')', 'transform-origin': 'top left'});
            //$('.pptx2html').animate({
            //    transform: 'scale(2)'
            //});
            console.log('scale with ratio: ' + this.scaleratio);

            //set height of content panel to at least size of pptx2html + (100 pixels * scaleratio).
            this.refs.slideEditPanel.style.height = ((pptxheight + 5 + 20) * this.scaleratio) + 'px';
            this.refs.inlineContent.style.height = ((pptxheight + 0 + 20) * this.scaleratio) + 'px';
        }
    }
    componentWillUnmount() {
        // Remove the warning window.
        window.onbeforeunload = () => {};
        if (CKEDITOR.instances.inlineContent != null) {
            //console.log('destroy CKEDITOR instance');
            CKEDITOR.instances.inlineContent.destroy();
        }
        if (CKEDITOR.instances.inlineSpeakerNotes != null)  {
            //console.log('destroy CKEDITOR instance');
            CKEDITOR.instances.inlineSpeakerNotes.destroy();
        }
    }
    render() {
        //TODO: offer option to switch between inline-editor (alloy) and permanent/full editor (CKeditor)
        //TODO - remove use of id - Only use 'ref=' for React. Find CKeditor create function(s) that do not require id.
        //styles should match slideViewPanel for consistency
        //TODO - add zoomin button + restore button - see other slide editors
        //TODO - center editable screen + space above + below
        // When the component is rendered the confirmation is configured.
        // TODO: copy-paste elements based on ctrl-c / ctrl-v
        // TODO: keyboard focus and arrows to move; enter to start editing
        // TODO: move elements based on key-up / key-down / etc..

        const keyMap = {
            //'menuOptions': ['1', '2', '3', '4', '5', ],
            //'tabFocus': ['tab'],
            //'contextmenu': ['ctrl+alt+shift', 'alt+ctrl+shift', 'shift+alt+ctrl'],
            'deleteNode': ['ctrl+del',
                'shift+del', 'shift+backspace',
                'ctrl+del', 'ctrl+backspace',
                'alt+del', 'alt+backspace'],
            'moveUp': ['ctrl+alt+up'],
            'moveDown': ['ctrl+alt+down'],
            'moveLeft': ['ctrl+alt+left'],
            'moveRight': ['ctrl+alt+right'],
            'bringToFront': [ 'ctrl+shift+plus'],
            'bringToBack': ['ctrl+shift+-'],
            'duplicate': ['ctrl+d'],
            'enter': ['ctrl+enter']
            //'defaultEnter': ['enter'],
            //'escape': ['ctrl+escape']
        };
        let slideEditorContext = this;
        const handlers = {
            //'menuOptions': (event) => this.menuOptionsPreventDefault(event, slideEditorContext),
            //'contextmenu': (event) => this.keyContextMenu(event, slideEditorContext),
            //'tabFocus': (event) => this.setTabFocus(event, slideEditorContext),
            //'enter': (event) => this.setEditMode(event, slideEditorContext, false , false),
            'enter': (event) => this.enterEditKey(event, slideEditorContext, false , false),
            //'defaultEnter': (event) => this.keyEnter(slideEditorContext, event),
            'deleteNode': (event) => this.deleteNode(slideEditorContext),
            'moveUp': (event) => this.keyMoveUp(slideEditorContext, event),
            'moveDown': (event) => this.keyMoveDown(slideEditorContext, event),
            'moveLeft': (event) => this.keyMoveLeft(slideEditorContext, event),
            'moveRight': (event) => this.keyMoveRight(slideEditorContext, event),
            'bringToFront': (event) => this.bringToFront(slideEditorContext, event),
            'bringToBack': (event) => this.sendToBack(slideEditorContext, event),
            'duplicate': (event) => this.duplicateNode(slideEditorContext, event),
            //'escape': (event) => {this.removeEditMode(); $('#' + this.menuFocus).focus(); $('#' + this.menuFocus).css({'box-shadow':'0 0 15px 5px rgba(0, 150, 253, 1)'});}
        };
        const dropDownItemStyle = {
            //minWidth: '100%',
            minHeight: '100px',
            //borderStyle: 'dashed dashed none dashed',
            //borderColor: '#e7e7e7',
        };
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
        const headerStyle = {
            //minWidth: '100%',
            height: '0px',
            overflowY: 'auto',
            //borderStyle: 'dashed dashed none dashed',
            //borderColor: '#e7e7e7',
            position: 'relative'
        };
        const compStyle = {
            // maxHeight: 450,
            //minHeight: 450,
            //overflowY: 'auto',
            //position: 'relative'
            //minWidth: '100%',
            // maxHeight: 450,
            //padding: 20,
            minHeight: 600,
            //minHeight: '100%',
            overflowY: 'auto',
            //overflowX: 'hidden',
            overflowX: 'auto',
            //overflowY: 'visible',
            //overflow: 'hidden,'
            position: 'relative'
        };
        const sectionElementStyle = {
            overflowY: 'hidden',
            overflowX: 'auto',
            //padding: 10,
            paddingTop: 40,
            height: '100%'
        };
        const contentStyle = {
            minWidth: '100%',
            // maxHeight: 450,
            //padding: 10,
            /*paddingLeft: 50,
            paddingRight: 50,
            paddingTop: 10,
            xpaddingBottom: 10,*/
            minHeight: 610,
            overflowY: 'auto',
            overflowX: 'auto',
            //borderStyle: 'dashed',
            //borderColor: '#e7e7e7',
        };
        const speakernotesStyle = {
            maxHeight: 50,
            minHeight: 50,
            overflowY: 'auto',
            position: 'relative'
        };

        const buttonColorBlack = {
            color: 'black'
        };


        //<textarea style={compStyle} name='nonInline' ref='nonInline' id='nonInline' value={this.props.content} rows="10" cols="80" onChange={this.handleEditorChange}></textarea>
        //                <div style={headerStyle} contentEditable='true' name='inlineHeader' ref='inlineHeader' id='inlineHeader' dangerouslySetInnerHTML={{__html:'<h1>SLIDE ' + this.props.selector.sid + ' TITLE</h1>'}}></div>
        /*
         <div style={headerStyle} contentEditable='true' name='inlineHeader' ref='inlineHeader' id='inlineHeader' dangerouslySetInnerHTML={{__html:this.props.title}}></div>
         Slide title (in deck): <label htmlFor='title' hidden>Slide title (in deck)</label>
         <input type='title' id='title' name='title' ref='title' defaultValue={this.props.title} placeholder='Slide title (in deck)' autoFocus tabIndex='0' aria-required='true' required size='50'/>
         <hr/>
         <input type='text' id='title' name='title' ref='title' defaultValue={this.props.title} placeholder='Slide title (in deck)' autoFocus tabIndex='0' aria-required='true' required size='50'/>
            <input type="text" name="deck-title" placeholder="Title" aria-required="true" ref="title" />
            Slide title (in deck): <label htmlFor='title' hidden>Slide title (in deck)</label>
            <input type='text' id='title' name='title' ref='title' value={this.props.title} placeholder='Slide title (in deck)' autoFocus tabIndex='0' aria-required='true' required size='50' onChange='' />
                    */

        // Add the CSS dependency for the theme
        // Get the theme information, and download the stylesheet
        let styleName = 'default';
        if(this.props.selector.theme && typeof this.props.selector.theme !== 'undefined'){
            styleName = this.props.selector.theme;
        }
        else if(this.props.DeckTreeStore.theme && typeof this.props.DeckTreeStore.theme !== 'undefined'){
            styleName = this.props.DeckTreeStore.theme;
        }
        if (styleName === '' || typeof styleName === 'undefined' || styleName === 'undefined')
        {
            //if none of above yield a theme they will be legacy decks:
            styleName = 'white';
        }
        let style = require('../../../../../custom_modules/reveal.js/css/theme/' + styleName + '.css');
        //<div style={headerStyle} contentEditable='true' name='inlineHeader' ref='inlineHeader' id='inlineHeader' onInput={this.emitChange} dangerouslySetInnerHTML={{__html:this.props.title}}></div>
        return (
            <ResizeAware ref='container' id='container' style={{position: 'relative'}}>
            {(this.loading === 'loading') ? <div className="ui active dimmer"><div className="ui text loader">Loading</div></div> : ''}
                <button tabIndex="0" ref="submitbutton" className="ui button blue primary " onClick={this.handleSaveButton.bind(this)} onChange={this.handleSaveButton.bind(this)}>
                 <i className="save icon large"></i>
                 Save
                </button>
                <button tabIndex="0" ref="submitbutton" className="ui orange button " onClick={this.addAbsoluteDiv.bind(this)} onChange={this.addAbsoluteDiv.bind(this)}>
                    <i className="plus square outline icon black large"></i>
                    <a style={buttonColorBlack}>{this.inputBoxButtonTitle}</a>
                </button>
                <div className="ui field search selection dropdown" data-position="top center" data-inverted="" ref="TemplateDropdown" >
                    <input type="hidden" name="template" id="template" ref="template" defaultValue={this.props.template} />
                    <i className="dropdown icon large"/>
                    <div className="default text">Use template</div>
                    {templateOptions}
                </div>
                <button tabIndex="0" ref="helpbutton" className="ui orange button " onClick={this.keymapInfoButton.bind(this)} onChange={this.keymapInfoButton.bind(this)}>
                    <i className="help circle icon black large"></i>
                    <a style={buttonColorBlack}>keys</a>
                </button>

                {/*
                    'ui': true,
                    'field': true,
                    'search': true,
                    'selection': true,
                    'dropdown': true

                <button tabIndex="0" ref="templatebutton" className="ui orange button " onClick={this.handleTemplatechange.bind(this)} >
                    <i className="browser icon black"> </i>
                    <a style={buttonColorBlack}>Use template</a>
                </button>
                <TemplateDropdown name="template" ref="template" id="template" onClick={this.handleTemplatechange.bind(this)}/> */}
                <div className="ui" style={compStyle} ref='slideEditPanel'>
                    <div className={[style.reveal, 'reveal'].join(' ')}>
                        <div className={[style.slides, 'slides'].join(' ')}>
                            <section className="present"  style={sectionElementStyle}>
                                <HotKeys keyMap={keyMap} handlers={handlers}>
                                    <div style={contentStyle} contentEditable='true' name='inlineContent' ref='inlineContent' id='inlineContent' onInput={this.emitChange} dangerouslySetInnerHTML={{__html:this.props.content}}></div>
                                </HotKeys>
                            </section>
                        </div>
                    </div>
                </div>
                <b>Speaker notes:</b><br />
                <div style={speakernotesStyle} contentEditable='true' name='inlineSpeakerNotes' ref='inlineSpeakerNotes' id='inlineSpeakerNotes' onInput={this.emitChange} dangerouslySetInnerHTML={{__html:this.props.speakernotes}}></div>
            </ResizeAware>
        );
    }

    // To detect changes in the editable content.
/*
    shouldComponentUpdate(nextProps) {
        console.log(ReactDOM.findDOMNode(this));
        console.log('shouldComponentUpdate');
        return false;
        // return nextProps.html !== ReactDOM.findDOMNode(this).innerHTML;
    }*/

    emitChange() {
        window.onbeforeunload = () => {
            return 'If you don\'t save the slide, it won\'t be updated. ' +
            'Are you sure you want to exit this page?';
        };
    }
}

SlideContentEditor.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

SlideContentEditor = connectToStores(SlideContentEditor, [SlideEditStore, UserProfileStore, DataSourceStore, SlideViewStore, DeckTreeStore], (context, props) => {

    return {
        SlideEditStore: context.getStore(SlideEditStore).getState(),
        SlideViewStore: context.getStore(SlideViewStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        DataSourceStore: context.getStore(DataSourceStore).getState(),
        DeckTreeStore: context.getStore(DeckTreeStore).getState()
    };
});
export default SlideContentEditor;
