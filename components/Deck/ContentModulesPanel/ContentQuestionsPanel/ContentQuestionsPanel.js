import PropTypes from 'prop-types';
import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import fetchUser from '../../../../actions/user/userprofile/fetchUser';
import ContentQuestionsStore from '../../../../stores/ContentQuestionsStore';
import DeckViewStore from '../../../../stores/DeckViewStore';
import UserProfileStore from '../../../../stores/UserProfileStore';
import ContentModulesStore from '../../../../stores/ContentModulesStore';
import loadContentQuestions from '../../../../actions/loadContentQuestions';
import invertAddQuestionBoxFlag from '../../../../actions/questions/invertAddQuestionBoxFlag';
import ContentQuestionsList from './ContentQuestionsList';
import ContentQuestionAdd from './ContentQuestionAdd';
import ContentQuestionEdit from './ContentQuestionEdit';
// import ContentQuestionForm from './ContentQuestionForm';
import PermissionsStore from '../../../../stores/PermissionsStore';

class ContentQuestionsPanel extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            pageNo: props.ContentModulesStore.selector.pageNum
        };
        this.handlePageClick = this.handlePageClick.bind(this);
        this.handlePreviousClick = this.handlePreviousClick.bind(this);
        this.updateQuestionsList = this.updateQuestionsList.bind(this);
        this.handleAddButtonClick = this.handleAddButtonClick.bind(this);
    }

    updateQuestionsList(){
        let selector = this.props.ContentModulesStore.selector;
        selector.pageNum = this.state.pageNo;
        this.context.executeAction(loadContentQuestions, {params: selector});
    }

    handlePageClick(pageNo) {
        if(pageNo !== this.state.pageNo){
            this.setState({
                pageNo: pageNo,
            }, this.updateQuestionsList);
        }
    }

    handlePreviousClick(){
        if(this.state.pageNo !== 1){
            this.setState({
                pageNo: this.state.pageNo - 1,
            }, this.updateQuestionsList);
        }
    }

    handleNextClick(lastPageNo){
        if(this.state.pageNo < lastPageNo){
            this.setState({
                pageNo: this.state.pageNo + 1,
            }, this.updateQuestionsList);
        }
    }

    handleAddButtonClick() {
        this.context.executeAction(invertAddQuestionBoxFlag, {});
    }

    render() {
        const questions = this.props.ContentQuestionsStore.questions;
        const question = this.props.ContentQuestionsStore.question;
        const selector = this.props.ContentQuestionsStore.selector;
        const creatorId = this.props.DeckViewStore.creatorData._id;
        const userId = this.props.UserProfileStore.userid;
        const questionsCount = this.props.ContentQuestionsStore.questionsCount;
        const itemsPerPage = this.props.ContentModulesStore.selector.maxQ;

        // Button bar differs for Slide and Folder
        let buttonBar = '';
        switch(selector.stype) {
            case 'slide':
                buttonBar = '';
                /* (
                    <button className='ui button blue'>
                        <i className='plus icon'></i>
                        Add question
                    </button>
                );*/
                break;
            case 'deck':
                buttonBar = (
                    <div className='ui buttons'>
                        <button className='ui button'>Exam mode</button>
                        <button className='ui button'>Test mode</button>
                        <button className='ui button blue'>
                            <i className='file pdf outline icon'></i>
                            Export to PDF
                        </button>
                    </div>
                );
                break;
        }

        let editPermission = (this.props.PermissionsStore.permissions.admin || this.props.PermissionsStore.permissions.edit);
        // console.log(editPermission);
        let addQuestionButton = (editPermission) ?
            <div className="column right aligned" data-reactid={655}>
                <button className="ui right floated compact button primary" onClick={this.handleAddButtonClick.bind(this)}>
                    <i className="small plus icon" data-reactid={640} />
                    Add question
                </button>
            </div>
            : '';
        // console.log(addQuestionButton);

        /*
        let addQuestionButton = (
            <div className="column right aligned" data-reactid={655}>
                <button className="ui right floated compact button primary" onClick={this.handleAddButtonClick.bind(this)}>
                    <i className="small plus icon" data-reactid={640} />
                    Add question
                </button>
            </div>
        );

        const getUserButton = () => {
        console.log(creatorId);
            if(userId && creatorId === userId) {
            if (editPermission){
                return addQuestionButton;
            }
            return null;
        };
        */

        let questionsHeader = (
            <div className="ui segment attached" data-reactid={636}>
                <div className="ui bottom attached" data-reactid={637}>
                    <div data-reactid={638}>
                        <div className="ui vertical segment">
                            <div className="ui two column stackable grid">
                                <div className="column">
                                    <h3 className="ui  header">Questions</h3>
                                </div>
                                {addQuestionButton}
                            </div>
                        </div>
                        {content}
                    </div>
                </div>
            </div>
        );

        class PaginationItem extends React.Component {
            constructor(props){
                super(props);
                this._onClick = this._onClick.bind(this);
            }
            _onClick() {
                this.props.onItemClick(this.props.pageNo);
            }

            render() {
                let className = 'item';
                if(this.props.isActiveItem){
                    className += ' active';
                }
                return (
                  <a className={className} onClick={this._onClick} >
                    {this.props.pageNo}
                  </a>
                );
            }
        }

        let getItems = () => {
            let noOfQuestions = questionsCount;
            let items = [];
            let pageNo = 1;
            for(let i = 0; i < noOfQuestions; i+=itemsPerPage) {
                items.push(
                  <PaginationItem key={pageNo} isActiveItem={this.state.pageNo === pageNo} pageNo={pageNo++} onItemClick={this.handlePageClick} />
                );
            }
            return items;
        };

        let lastPageNo = parseInt(questionsCount / itemsPerPage) + 1;
        let pagination = (
            <div className="ui centered pagination menu">
                <a className="icon item" onClick={this.handlePreviousClick}>
                    <i className="left chevron icon" />
                </a>
                {getItems()}
                <a className="icon item" onClick={() => this.handleNextClick(lastPageNo)}>
                    <i className="right chevron icon" />
                </a>
            </div>
        );
        let questionsList = (<ContentQuestionsList items={questions} selector={selector} editPermission={editPermission}/>);
        let content = (
            <div>
                {/* {buttonBar} */}
                {questionsHeader}
                {questions.length === 0 ? 'There are currently no questions for this ' + selector.stype + '.' : questionsList}
                {/* {pagination} */}
            </div>
        );

        //   if (question !== undefined && question !== null) {
        // //Question is selected -> show its data
        //       content = (
        //   <div>
        //     <ContentQuestionForm question={question} />
        //   </div>
        // );
        //   }

        return (
            <div ref="contentQuestionsPanel" className="ui bottom attached">
                { this.props.ContentQuestionsStore.showAddBox ? <ContentQuestionAdd selector={this.props.selector} userId={userId} /> : this.props.ContentQuestionsStore.question ? <ContentQuestionEdit question={this.props.ContentQuestionsStore.question} selector={this.props.selector} userId={userId}/> : content }
            </div>
        );
    }
}

ContentQuestionsPanel.contextTypes = {
    executeAction: PropTypes.func.isRequired
};
ContentQuestionsPanel = connectToStores(ContentQuestionsPanel, [ContentQuestionsStore, DeckViewStore, UserProfileStore, PermissionsStore], (context, props) => {
    return {
        ContentQuestionsStore: context.getStore(ContentQuestionsStore).getState(),
        DeckViewStore: context.getStore(DeckViewStore).getState(),
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        ContentModulesStore: context.getStore(ContentModulesStore).getState(),
        PermissionsStore: context.getStore(PermissionsStore).getState()
    };
});
export default ContentQuestionsPanel;
