import PropTypes from 'prop-types';
import React from 'react';
import {navigateAction} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import ContentQuestionsStore from '../../../../stores/ContentQuestionsStore';
import DeckViewStore from '../../../../stores/DeckViewStore';
import UserProfileStore from '../../../../stores/UserProfileStore';
import ContentModulesStore from '../../../../stores/ContentModulesStore';
import resetExamAnswers from '../../../../actions/questions/resetExamAnswers';
import invertAddQuestionBoxFlag from '../../../../actions/questions/invertAddQuestionBoxFlag';
import invertExamListFlag from '../../../../actions/questions/invertExamListFlag';
import ContentQuestionsList from './ContentQuestionsList';
import ExamQuestionsList from './ExamQuestionsList';
import ContentQuestionAdd from './ContentQuestionAdd';
import ContentQuestionEdit from './ContentQuestionEdit';
import PermissionsStore from '../../../../stores/PermissionsStore';
import QuestionDownloadModal from './Download/QuestionDownloadModal';

class ContentQuestionsPanel extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            pageNo: props.ContentModulesStore.selector.pageNum
        };
        // this.handlePageClick = this.handlePageClick.bind(this);
        // this.handlePreviousClick = this.handlePreviousClick.bind(this);
        // this.updateQuestionsList = this.updateQuestionsList.bind(this);
        this.handleAddButtonClick = this.handleAddButtonClick.bind(this);
        this.handleExamListButtonClick = this.handleExamListButtonClick.bind(this);
    }

    // updateQuestionsList(){
    //     let selector = this.props.ContentModulesStore.selector;
    //     selector.pageNum = this.state.pageNo;
    //     this.context.executeAction(loadContentQuestions, {params: selector});
    // }

    // handlePageClick(pageNo) {
    //     if(pageNo !== this.state.pageNo){
    //         this.setState({
    //             pageNo: pageNo,
    //         }, this.updateQuestionsList);
    //     }
    // }
    // 
    // handlePreviousClick(){
    //     if(this.state.pageNo !== 1){
    //         this.setState({
    //             pageNo: this.state.pageNo - 1,
    //         }, this.updateQuestionsList);
    //     }
    // }
    // 
    // handleNextClick(lastPageNo){
    //     if(this.state.pageNo < lastPageNo){
    //         this.setState({
    //             pageNo: this.state.pageNo + 1,
    //         }, this.updateQuestionsList);
    //     }
    // }

    handleAddButtonClick() {
        this.context.executeAction(invertAddQuestionBoxFlag, {});
    }
    
    handleExamListButtonClick() {
        this.context.executeAction(invertExamListFlag, {});
    }
    
    handleExamClick() {
        this.context.executeAction(resetExamAnswers, {});
        this.context.executeAction(navigateAction, {
            url: '/exam/' + this.props.ContentQuestionsStore.selector.stype + '/' + this.props.ContentQuestionsStore.selector.sid
        });
    }
    
    render() {
        const questions = this.props.ContentQuestionsStore.questions;
        const selector = this.props.ContentQuestionsStore.selector;
        const userId = this.props.UserProfileStore.userid;
        // const questionsCount = this.props.ContentQuestionsStore.questionsCount;
        // const itemsPerPage = this.props.ContentModulesStore.selector.maxQ;

        // Button bar differs for Slide and Folder
        let buttonBar = '';
        switch(selector.stype) {
            case 'slide':
                buttonBar = '';
                break;
            case 'deck':
                buttonBar = (userId !== '' && questions.length > 0) ? (
                    <div className='ui buttons'>
                        <button className='ui button blue' onClick={this.handleExamClick.bind(this)}>
                            <i className='clipboard outline icon'></i>
                            Exam mode
                        </button>
                    </div>
                ) : '';
                break;
        }

        let editPermission = (this.props.PermissionsStore.permissions.admin || this.props.PermissionsStore.permissions.edit);
        let visibleQuestions = [];
        questions.forEach((question) => {
            if (editPermission || !question.isExamQuestion) {
                visibleQuestions.push(question);
            }
        });

        let examQuestionsButton = (questions.length > 0 && this.props.ContentModulesStore.selector.stype === 'deck') ?
            <button className="ui right floated compact button primary" onClick={this.handleExamListButtonClick.bind(this)}>
                <i className="small check icon" />
                Select exam questions
            </button> : '';

        let addQuestionButton =
                <button className="ui right floated compact button primary" onClick={this.handleAddButtonClick.bind(this)}>
                    <i className="small plus icon"/>
                    Add question
                </button>
        ;

        let editButtons = (editPermission) ?
            <div className="column right aligned">
                {addQuestionButton}
                {examQuestionsButton}
            </div>
            : '';

        let downloadQuestionsButton = <QuestionDownloadModal />;

        /*
        let addQuestionButton = (
            <div className="column right aligned">
                <button className="ui right floated compact button primary" onClick={this.handleAddButtonClick.bind(this)}>
                    <i className="small plus icon"/>
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
            <div className="ui segment attached">
                <div className="ui bottom attached">
                    <div>
                        <div className="ui vertical segment">
                            <div className="ui two column stackable grid">
                                <div className="column">
                                    <h3 className="ui  header">Questions</h3>
                                </div>
                                {editButtons}
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        );

        // class PaginationItem extends React.Component {
        //     constructor(props){
        //         super(props);
        //         this._onClick = this._onClick.bind(this);
        //     }
        //     _onClick() {
        //         this.props.onItemClick(this.props.pageNo);
        //     }
        // 
        //     render() {
        //         let className = 'item';
        //         if(this.props.isActiveItem){
        //             className += ' active';
        //         }
        //         return (
        //           <a className={className} onClick={this._onClick} >
        //             {this.props.pageNo}
        //           </a>
        //         );
        //     }
        // }

        // let getItems = () => {
        //     let noOfQuestions = questionsCount;
        //     let items = [];
        //     let pageNo = 1;
        //     for(let i = 0; i < noOfQuestions; i+=itemsPerPage) {
        //         items.push(
        //           <PaginationItem key={pageNo} isActiveItem={this.state.pageNo === pageNo} pageNo={pageNo++} onItemClick={this.handlePageClick} />
        //         );
        //     }
        //     return items;
        // };

        // let lastPageNo = parseInt(questionsCount / itemsPerPage) + 1;
        // let pagination = (
        //     <div className="ui centered pagination menu">
        //         <a className="icon item" onClick={this.handlePreviousClick}>
        //             <i className="left chevron icon" />
        //         </a>
        //         {getItems()}
        //         <a className="icon item" onClick={() => this.handleNextClick(lastPageNo)}>
        //             <i className="right chevron icon" />
        //         </a>
        //     </div>
        // );
        let questionsList = (<ContentQuestionsList items={visibleQuestions} selector={selector} editPermission={editPermission}/>);
        let examQuestionsList = (<ExamQuestionsList items={questions} selector={selector} />);
        let questionAdd = (<ContentQuestionAdd selector={this.props.selector} userId={userId} />);
        let questionEdit = (<ContentQuestionEdit question={this.props.ContentQuestionsStore.question} selector={this.props.selector} userId={userId}/>);
        let content = (
            <div>
                {buttonBar}
                {questionsHeader}
                {visibleQuestions.length === 0 ? 'There are currently no questions for this ' + selector.stype + '.' : questionsList}
                {/* {pagination} */}
            </div>
        );

        return (
            <div ref="contentQuestionsPanel" className="ui bottom attached">
                { this.props.ContentQuestionsStore.showAddBox ? questionAdd : this.props.ContentQuestionsStore.question ? questionEdit : this.props.ContentQuestionsStore.showExamList ? examQuestionsList : content }
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
