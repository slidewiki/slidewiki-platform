import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import classNames from 'classnames/bind';
import restoreDeckPageLayout from '../../../actions/deckpagelayout/restoreDeckPageLayout';
import loadActivities from '../../../actions/activityfeed/loadActivities';
import loadContentDiscussion from '../../../actions/activityfeed/contentdiscussion/loadContentDiscussion';
import loadContentHistory from '../../../actions/loadContentHistory';
import loadContentUsage from '../../../actions/loadContentUsage';
import loadContentQuestions from '../../../actions/loadContentQuestions';
import loadDataSources from '../../../actions/datasource/loadDataSources';
import loadContributors from '../../../actions/loadContributors';
import ContentHistoryPanel from './ContentHistoryPanel/ContentHistoryPanel';
import ContentUsagePanel from './ContentUsagePanel/ContentUsagePanel';
import ContentDiscussionPanel from './ContentDiscussionPanel/ContentDiscussionPanel';
import ContentQuestionsPanel from './ContentQuestionsPanel/ContentQuestionsPanel';
import DataSourcePanel from './DataSourcePanel/DataSourcePanel';
import ContributorsPanel from './ContributorsPanel/ContributorsPanel';
import ContentModulesStore from '../../../stores/ContentModulesStore';

class ContentModulesPanel extends React.Component {
    handleTabClick(type, e) {
        switch (type) {
            case 'questions':
                this.context.executeAction(loadContentQuestions, {params: this.props.ContentModulesStore.selector});
                break;
            case 'datasource':
                this.context.executeAction(loadDataSources, {params: this.props.ContentModulesStore.selector});
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
            case 'contributors':
                this.context.executeAction(loadContributors, {params: this.props.ContentModulesStore.selector});
                break;
            default:
        }
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
            case 'contributors':
                activityDIV = <ContributorsPanel selector={this.props.ContentModulesStore.selector} />;
                break;
            case 'questions':
                activityDIV = <ContentQuestionsPanel selector={this.props.ContentModulesStore.selector} />;
                break;
            case 'datasource':
                activityDIV = <DataSourcePanel selector={this.props.ContentModulesStore.selector} />;
                break;
            default:
                activityDIV = <ContentQuestionsPanel selector={this.props.ContentModulesStore.selector} />;
        }
        //set pointingMenu
        let historyTabClass = classNames({
            'item': true,
            'active': (this.props.ContentModulesStore.moduleType === 'history')
        });
        let usageTabClass = classNames({
            'item': true,
            'active': (this.props.ContentModulesStore.moduleType === 'usage')
        });
        let discussionTabClass = classNames({
            'item': true,
            'active': (this.props.ContentModulesStore.moduleType === 'discussion')
        });
        let questionsTabClass = classNames({
            'item': true,
            'active': (this.props.ContentModulesStore.moduleType === 'questions')
        });
        let datasourceTabClass = classNames({
            'item': true,
            'active': (this.props.ContentModulesStore.moduleType === 'datasource')
        });
        let contributorsTabClass = classNames({
            'item': true,
            'active': (this.props.ContentModulesStore.moduleType === 'contributors')
        });
        //hide focused outline
        let compStyle = {
            outline: 'none'
        };
        pointingMenu = (
            <div className="ui top attached pointing menu">
                <a tabIndex="0" className={questionsTabClass} style={compStyle} onClick={this.handleTabClick.bind(this, 'questions')}>Questions<span className="ui tiny circular label">{this.props.ContentModulesStore.moduleCount.questions}</span></a>
                <a tabIndex="0" className={datasourceTabClass} style={compStyle} onClick={this.handleTabClick.bind(this, 'datasource')}>Sources<span className="ui tiny circular label">{this.props.ContentModulesStore.moduleCount.datasource}</span></a>
                <a tabIndex="0" className={discussionTabClass} style={compStyle} onClick={this.handleTabClick.bind(this, 'discussion')}>Comments</a>
                <a tabIndex="0" className={historyTabClass} style={compStyle} onClick={this.handleTabClick.bind(this, 'history')}>History</a>
                <a tabIndex="0" className={usageTabClass} style={compStyle} onClick={this.handleTabClick.bind(this, 'usage')}>Usage</a>
                <a tabIndex="0" className={contributorsTabClass} style={compStyle} onClick={this.handleTabClick.bind(this, 'contributors')}>Contributors</a>

                <a className="item">
                    <img src="/assets/images/mock-avatars/helen.jpg" className="ui mini image circular"/>
                    <img src="/assets/images/mock-avatars/elliot.jpg" className="ui mini image circular" />
                    <img src="/assets/images/mock-avatars/jenny.jpg" className="ui mini image circular" />
                    <img src="/assets/images/mock-avatars/joe.jpg" className="ui mini image circular" />
                </a>
            </div>
        );

        return (
            <div ref="contentModulesPanel">
                {pointingMenu}
                <div className="ui segment attached">
                    {activityDIV}
                </div>
            </div>
        );
    }
}

ContentModulesPanel.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
ContentModulesPanel = connectToStores(ContentModulesPanel, [ContentModulesStore], (context, props) => {
    return {
        ContentModulesStore: context.getStore(ContentModulesStore).getState()
    };
});
export default ContentModulesPanel;
