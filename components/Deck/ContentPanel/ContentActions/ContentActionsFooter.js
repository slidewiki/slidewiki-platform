import React from 'react';
import {NavLink} from 'fluxible-router';
import ContentUtil from '../util/ContentUtil';
import {connectToStores} from 'fluxible-addons-react';
import SlideControl from '../SlideModes/SlideControl';
import expandContentPanel from '../../../../actions/deckpagelayout/expandContentPanel';
import ReportModal from '../../../Report/ReportModal';
import restoreDeckPageLayout from '../../../../actions/deckpagelayout/restoreDeckPageLayout';
import {Microservices} from '../../../../configs/microservices';
import ContentActionsFooterStore from '../../../../stores/ContentActionsFooterStore.js';
import likeActivity from '../../../../actions/activityfeed/likeActivity.js';
import dislikeActivity from '../../../../actions/activityfeed/dislikeActivity.js';
import UserProfileStore from '../../../../stores/UserProfileStore';
import ContentLikeStore from '../../../../stores/ContentLikeStore';


class ContentActionsFooter extends React.Component {
    constructor(props) {
        super(props);
        //this.state={expanded: 0};
        this.state = this.props.ContentActionsFooterStore.state; //expanded: 0
        this.visible = true;
        // this.modal_classes = (this.visible) ? 'ui small modal transition visible active' : 'ui small modal transition hidden';
    }
    handleExpandClick(){
        this.context.executeAction(expandContentPanel, {});
        this.state.expanded = 1;
        return false;
    }
    handleCollapseClick(){
        this.context.executeAction(restoreDeckPageLayout, {});
        this.state.expanded = 0;
        return false;
    }
    getPresentationHref(){
        let presLocation = '/Presentation/' + this.props.ContentStore.selector.id + '/';
        if(this.props.ContentStore.selector.stype === 'slide'){
            // presLocation += this.props.ContentStore.selector.sid + '/';
            presLocation += '#/slide-' + this.props.ContentStore.selector.sid;
        }
        return presLocation;
    }
    handlePresentationClick(e){
        if(process.env.BROWSER){
            e.preventDefault();
            window.open(this.getPresentationHref());
        }
    }
    /*
    getPrintHref(){
        return '/PresentationPrint/' + this.props.ContentStore.selector.id + '/?print-pdf';
    }
    handlePrintClick(e){
        if(process.env.BROWSER){
            e.preventDefault();
            window.open(this.getPrintHref());
        }
    }*/

    handlePrintClick(e){

        if(process.env.BROWSER){
            e.preventDefault();
            window.open(this.getExportHref('PDF'));
        }

    }

    handleReportClick(){
        // Toggle Modal and so on...
        $('.ui.report.modal')
            .modal('toggle');
    }

    getExportHref(type){
        if (type !== 'EPub' && type !== 'PDF') {
            return;
        }
        if (this.props.ContentStore.selector.id !== undefined && this.props.ContentStore.selector.id !== '' && this.props.ContentStore.selector.id !== 0)
        {
            //console.log(this.props.ContentStore.selector.id);
            let splittedId =  this.props.ContentStore.selector.id.split('-'); //separates deckId and revision
            let pdfHref = Microservices.pdf.uri + '/export' + type + '/' + splittedId[0];
            return pdfHref;
        }
        else
        {
            // in adddeck this.props.ContentStore.selector.id is 0
            return Microservices.pdf.uri + '/export' + type + '/';
        }
    }

    handleDownloadClick(e){

        if(process.env.BROWSER){
            e.preventDefault();
            window.open(this.getExportHref('EPub'));
        }

    }

    handleLikeClick(e){
      if (this.props.ContentLikeStore.usersWhoLikedDeck.indexOf(String(this.props.UserProfileStore.userid)) != -1) {
        // dislike activity
        this.context.executeAction(dislikeActivity, {
            selector: this.props.ContentStore.selector,
            userid: this.props.UserProfileStore.userid
        });
      } else {
        this.context.executeAction(likeActivity, {
            selector: this.props.ContentStore.selector,
            userid: this.props.UserProfileStore.userid
        });
      }
    }

    render() {
        let reportButton = <div ref="reportButton" onClick={this.handleReportClick.bind(this)} target="_blank">
                            <button className="ui button" type="button" aria-label="Report" data-tooltip="Report" >
                                <i className="warning circle large icon"></i>
                            </button>
                        </div>;

        let likeButton = "ui button";
        let classNameLikeButton = "thumbs up alternate large icon";
        let tooltipLikeButton = "Like this deck";
        if (this.props.UserProfileStore.userid == "") {
            //undefined user
            likeButton = "ui disabled button";
        } else if (this.props.ContentLikeStore.usersWhoLikedDeck.indexOf(String(this.props.UserProfileStore.userid)) != -1) {
            //already liked
            classNameLikeButton = "thumbs up alternate large blue icon";
            tooltipLikeButton = "Dislike this deck";
        }

        return (
            <div className="ui">
                <div className="ui teal top attached progress slide-progress-bar" ref="slide-progressbar">
                    {this.props.ContentStore.selector.stype === 'slide' ? <div className="bar"></div> : ''}
                </div>
                <div className="ui bottom attached tabular menu" style={{'background': '#DCDDDE'}}>
                    {this.props.ContentStore.selector.stype === 'slide' ? <SlideControl mode={this.props.ContentStore.mode}/> : ''}
                    <div className="right menu">
                        <div className="ui icon buttons large right floated">

                            <NavLink onClick={this.handlePresentationClick.bind(this)} href={this.getPresentationHref()} target="_blank">
                                <button className="ui button" type="button" aria-label="Presentation Mode" data-tooltip="Presentation Mode">
                                    <i className="circle play large icon"></i>
                                </button>
                            </NavLink>
                           <NavLink onClick={this.handlePrintClick.bind(this)} href={this.getExportHref('PDF')} target="_blank">
                            <button className="ui button" type="button" aria-label="Print" data-tooltip="Print" >
                                <i className="print large icon"></i>
                            </button>
                            </NavLink>
                            <NavLink onClick={this.handleDownloadClick.bind(this)} href={this.getExportHref('EPub')} target="_blank">
                                <button className="ui button" type="button" aria-label="Download" data-tooltip="Download" >
                                    <i className="download large icon"></i>
                                </button>
                            </NavLink>
                            {(this.props.UserProfileStore.userid !== '') ? reportButton : ''}
                            <ReportModal/>
                            <button className="ui disabled button" type="button" aria-label="Share" data-tooltip="Share">
                                <i className="share alternate large icon"></i>
                            </button>
                            <button className={likeButton} type="button" aria-label="Like" data-tooltip={tooltipLikeButton} onClick={this.handleLikeClick.bind(this)}>
                                <i className={classNameLikeButton}></i>
                            </button>
                            {/* {this.state.expanded ? <button className="ui button" onClick={this.handleCollapseClick.bind(this)} title="Reset Layout"><i className="large icon compress"></i></button> : <button className="ui button" onClick={this.handleExpandClick.bind(this)} title="Expand Content"><i className="large icon expand"></i></button>} */}
                            {this.state.expanded ? <button className="ui button" onClick={this.handleCollapseClick.bind(this)}  aria-label="Reset Layout" data-tooltip="Reset Layout"><i className="large icon compress"></i></button> : <button className="ui button" onClick={this.handleExpandClick.bind(this)} aria-label="Expand Content" data-tooltip="Expand Content"><i className="large icon expand"></i></button>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
/*                            <NavLink onClick={this.handlePrintClick.bind(this)} href={this.getPrintHref()} target="_blank">
                                <button className="ui button">
                                    <i className="print large icon"></i>
                                </button>
                            </NavLink>
                            */

ContentActionsFooter.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

ContentActionsFooter = connectToStores(ContentActionsFooter, [ContentActionsFooterStore, UserProfileStore, ContentLikeStore], (context, props) => {
    return {
        ContentActionsFooterStore: context.getStore(ContentActionsFooterStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        ContentLikeStore: context.getStore(ContentLikeStore).getState()
    };
});
export default ContentActionsFooter;
