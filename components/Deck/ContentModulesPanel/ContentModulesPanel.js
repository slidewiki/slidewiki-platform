import PropTypes from 'prop-types';
import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import classNames from 'classnames/bind';
import restoreDeckPageLayout from '../../../actions/deckpagelayout/restoreDeckPageLayout';
import loadContentDiscussion from '../../../actions/contentdiscussion/loadContentDiscussion';
import loadCommentsCount from '../../../actions/contentdiscussion/loadCommentsCount';
import loadContentHistory from '../../../actions/history/loadContentHistory';
import loadContentUsage from '../../../actions/loadContentUsage';
import loadContentQuestions from '../../../actions/loadContentQuestions';
import loadDataSources from '../../../actions/datasource/loadDataSources';
import loadTags from '../../../actions/tags/loadTags';
//import loadContributors from '../../../actions/loadContributors';
import ContentHistoryPanel from './ContentHistoryPanel/ContentHistoryPanel';
import ContentUsagePanel from './ContentUsagePanel/ContentUsagePanel';
import ContentDiscussionPanel from './ContentDiscussionPanel/ContentDiscussionPanel';
import ContentQuestionsPanel from './ContentQuestionsPanel/ContentQuestionsPanel';
import DataSourcePanel from './DataSourcePanel/DataSourcePanel';
import TagsPanel from './TagsPanel/TagsPanel';
//import ContributorsPanel from './ContributorsPanel/ContributorsPanel';
import ContentModulesStore from '../../../stores/ContentModulesStore';
import PermissionsStore from '../../../stores/PermissionsStore';
import { isLocalStorageOn } from '../../../common.js';
import loadCollectionsTab from '../../../actions/collections/loadCollectionsTab';
import CollectionsPanel from './CollectionsPanel/CollectionsPanel';
import {  Dropdown } from 'semantic-ui-react';

class ContentModulesPanel extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            showMobileMenu: false
        };
    }

    componentWillMount() {
        let selector = this.props.ContentModulesStore.selector;
        //check localStorage to see if invalid data have been read from the browser cache
        if (selector !== undefined && isLocalStorageOn()) {
            const sourcesCountFromLocalStorage = localStorage.getItem('sourcesCount');
            if (sourcesCountFromLocalStorage !== undefined && sourcesCountFromLocalStorage !== null) {
                if (String(sourcesCountFromLocalStorage) !== String(this.props.ContentModulesStore.moduleCount.datasource)) {// wrong data read from browser cache
                    let date = new Date().getTime();
                    this.context.executeAction(loadDataSources, {params: {date: date, id: selector.id, spath: selector.spath, stype: selector.stype, sid: selector.sid, smode: selector.smode}});
                }
                localStorage.removeItem('sourcesCount');// reset the state in localStorage
            }
            const commentsCountFromLocalStorage = localStorage.getItem('commentsCount');
            if (commentsCountFromLocalStorage !== undefined && commentsCountFromLocalStorage !== null) {
                if (String(commentsCountFromLocalStorage) !== String(this.props.ContentModulesStore.moduleCount.comments)) {// wrong data read from browser cache
                    let date = new Date().getTime();
                    this.context.executeAction(loadCommentsCount, {params: {date: date, id: selector.id, spath: selector.spath, stype: selector.stype, sid: selector.sid, smode: selector.smode}});
                }
                localStorage.removeItem('commentsCount');// reset the state in localStorage
            }
        }
    }
    
    componentDidMount(){
        $(this.refs.selectTab).dropdown({selectOnKeydown: false});
        this.checkOverflowingChildren();
    }
    
    componentDidUpdate() {
        this.checkOverflowingChildren();
    }
    
    checkOverflowingChildren() {
        const element = this.refs.pointerMenu;
        
        const hasOverflowingChildren = element.offsetWidth < element.scrollWidth; //only check the width
                
        if (this.state.showMobileMenu !== hasOverflowingChildren) {
            this.setState({showMobileMenu: hasOverflowingChildren}); // show the mobile menu if menu items are overflowing
        }
    }

    handleTabClick(type, e) {
        switch (type) {
            case 'questions':
                let editPermission = (this.props.PermissionsStore && this.props.PermissionsStore.permissions && (this.props.PermissionsStore.permissions.admin || this.props.PermissionsStore.permissions.edit));
                let params = this.props.ContentModulesStore.selector;
                this.context.executeAction(loadContentQuestions, {params: params});
                
                break;
            case 'datasource':
                this.context.executeAction(loadDataSources, {params: this.props.ContentModulesStore.selector});
                break;
            case 'tags':
                this.context.executeAction(loadTags, {params: this.props.ContentModulesStore.selector});
                break;
            case 'history':
                this.context.executeAction(loadContentHistory, {params: this.props.ContentModulesStore.selector});
                break;
            case 'usage':
                this.context.executeAction(loadContentUsage, {params: this.props.ContentModulesStore.selector});
                break;
            case 'discussion':
                this.context.executeAction(loadContentDiscussion, {params: this.props.ContentModulesStore.selector});
                break;
            case 'playlists': 
                this.context.executeAction(loadCollectionsTab, {params: this.props.ContentModulesStore.selector});
                break;
            //case 'contributors':
            //    this.context.executeAction(loadContributors, {params: this.props.ContentModulesStore.selector});
            //    break;
            default:
        }
    }
    handleKeyPress(type, e) {
        this.handleTabClick(type);
        e.preventDefault();
    }
    
    handleDropdownChange(e, dropdown) {
        let selectedItem = dropdown.value;
        this.handleTabClick(selectedItem);
    }
    
    getContentModuleOptions(showLabels) {
        let labelClasses = 'ui tiny circular label';
        
        return [
            {
                text: <span>Sources {showLabels ? 
                        <span className={labelClasses}>{this.props.ContentModulesStore.moduleCount.datasource}</span> : 
                        <span> ({this.props.ContentModulesStore.moduleCount.datasource})</span>}
                    </span>,
                value: 'datasource'
            },
            {
                text: <span>Tags {showLabels ? 
                        <span className={labelClasses}>{this.props.ContentModulesStore.moduleCount.tags}</span> : 
                        <span> ({this.props.ContentModulesStore.moduleCount.tags})</span>}
                    </span>,
                value: 'tags'
            },
            { // TODO add correct moduleCount
                text: <span>Comments {showLabels ? 
                        <span className={labelClasses}>{this.props.ContentModulesStore.moduleCount.comments}</span> : 
                        <span> ({this.props.ContentModulesStore.moduleCount.comments})</span>}
                    </span>,
                value: 'discussion'
            },
            {
                text: 'History',
                value: 'history'
            },
            {
                text: 'Usage',
                value: 'usage'
            },
            /*{
                text: 'Contributors',
                value: 'contributors'
            },*/
            {
                text: <span>Questions {showLabels ? 
                        <span className={labelClasses}>{this.props.ContentModulesStore.moduleCount.questions}</span> : 
                        <span> ({this.props.ContentModulesStore.moduleCount.questions})</span>}
                    </span>,
                value: 'questions'
            },
            {
                text: <span>Playlists {showLabels ? 
                        <span className={labelClasses}>{this.props.ContentModulesStore.moduleCount.playlists}</span> : 
                        <span> ({this.props.ContentModulesStore.moduleCount.playlists})</span>}
                    </span>,
                value: 'playlists'
            }
        ];
    }
    
    render() {
        
        let pointingMenu = '';
        let activityDIV = '';
        const hrefPath = '/activities/' + this.props.ContentModulesStore.selector.stype + '/' + this.props.ContentModulesStore.selector.sid;
        //set activityDIV
        switch (this.props.ContentModulesStore.moduleType) {
            case 'history':
                activityDIV = <ContentHistoryPanel selector={this.props.ContentModulesStore.selector} />;
                break;
            case 'discussion':
                activityDIV = <ContentDiscussionPanel selector={this.props.ContentModulesStore.selector} />;
                break;
            case 'usage':
                activityDIV = <ContentUsagePanel selector={this.props.ContentModulesStore.selector} />;
                break;
            //case 'contributors':
            //    activityDIV = <ContributorsPanel selector={this.props.ContentModulesStore.selector} />;
            //    break;
            case 'questions':
                activityDIV = <ContentQuestionsPanel selector={this.props.ContentModulesStore.selector} id="questions_panel" aria-labelledby="questions_label"/>;
                break;
            case 'datasource':
                activityDIV = <DataSourcePanel selector={this.props.ContentModulesStore.selector} id="sources_panel" aria-labelledby="sources_label"/>;
                break;
            case 'tags':
                activityDIV = <TagsPanel selector={this.props.ContentModulesStore.selector} id="tags_panel" aria-labelledby="tags_label"/>;
                break;
            case 'playlists': 
                activityDIV = <CollectionsPanel selector={this.props.ContentModulesStore.selector} id="playlist_panel" aria-labelledby="playlist_label"/>;
                break;
            default:
                activityDIV = <ContentDiscussionPanel selector={this.props.ContentModulesStore.selector} id="comments_panel" aria-labelledby="comments_label"/>;
        }
        
        //hide focused outline
        let compStyle = {
            outline: 'none'
        };
        
        pointingMenu = (
            <div className="ui top attached pointing menu" ref="pointerMenu" role="tablist" aria-label="Additional deck tools">
                {this.getContentModuleOptions(true).map((item) => {
                    let active = this.props.ContentModulesStore.moduleType === item.value;
                    
                    let classes = classNames({
                        'item': true,
                        'active': active && !this.state.showMobileMenu
                    });
                    
                    //hide tags and playlists for slide view
                    if (this.props.ContentModulesStore.selector.stype !== 'deck' && (item.value === 'tags' || item.value === 'playlists' || item.value === 'questions')) {
                        return;
                    }
                    
                    return (<a tabIndex="0" className={classes} style={compStyle} 
                        onClick={this.handleTabClick.bind(this, item.value)} onKeyPress={this.handleKeyPress.bind(this, item.value)} 
                        key={item.value} aria-controls={`${item.value}_panel`} id={`${item.value}_label`} role="button">{item.text}</a>);
                        
                    {/*
                    <a className="item">
                        <img src="/assets/images/mock-avatars/helen.jpg" className="ui mini image circular"/>
                        <img src="/assets/images/mock-avatars/elliot.jpg" className="ui mini image circular" />
                        <img src="/assets/images/mock-avatars/jenny.jpg" className="ui mini image circular" />
                        <img src="/assets/images/mock-avatars/joe.jpg" className="ui mini image circular" />
                    </a>*/}
                })}                
            </div>
        );
        
        let mobileMenu = (
            <Dropdown fluid pointing button text='Tools' value={this.props.ContentModulesStore.moduleType} options={this.getContentModuleOptions(false)} onChange={this.handleDropdownChange.bind(this)}/>
        );
        
        //make sure element is still rendered by the browser, in order to get the dimensions to detect overflowing children
        let pointingMenuStyle = this.state.showMobileMenu ? { 
            visibility: 'hidden',
            height: 0
        } : {};
        
        let mobileMenuStyle = {
            display: this.state.showMobileMenu  ? 'block' : 'none' 
        };
        
        let activityDIVClasses = classNames({
            'ui': true,
            'segment': true,
            'attached': !this.state.showMobileMenu
        });
        
        return (
            <div ref="contentModulesPanel" >
                <div style={pointingMenuStyle} role="tabpanel">
                    {pointingMenu}
                </div>
                <div style={mobileMenuStyle}>
                    {mobileMenu}
                </div>
                <div className={activityDIVClasses}>
                    {activityDIV}
                </div>
            </div>
        );
    }
}

ContentModulesPanel.contextTypes = {
    executeAction: PropTypes.func.isRequired
};
ContentModulesPanel = connectToStores(ContentModulesPanel, [ContentModulesStore, PermissionsStore], (context, props) => {
    return {
        ContentModulesStore: context.getStore(ContentModulesStore).getState(),
        PermissionsStore: context.getStore(PermissionsStore).getState()
    };
});
export default ContentModulesPanel;
