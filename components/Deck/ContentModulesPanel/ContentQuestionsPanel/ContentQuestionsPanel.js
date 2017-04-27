import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import ContentQuestionsStore from '../../../../stores/ContentQuestionsStore';
import ContentQuestionsList from './ContentQuestionsList';
// import ContentQuestionForm from './ContentQuestionForm';

const itemsPerPage = 5; //variable for changing pagination behaviour
class ContentQuestionsPanel extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            pageNo: 0,
        };
        this.handlePageClick = this.handlePageClick.bind(this);
        this.handlePreviousClick = this.handlePreviousClick.bind(this);

    }

    handlePageClick(pageNo) {
        this.setState({
            pageNo: pageNo,
        });
    }

    handlePreviousClick(){
        if(this.state.pageNo !== 0){
            this.setState({
                pageNo: this.state.pageNo - 1,
            });
        }
    }

    handleNextClick(lastPageNo){
        if(this.state.pageNo < lastPageNo)
            this.setState({
                pageNo: this.state.pageNo + 1,
            });
    }

    render() {
        const questions = this.props.ContentQuestionsStore.questions;
        const question = this.props.ContentQuestionsStore.question;
        const selector = this.props.ContentQuestionsStore.selector;


    // Button bar differs for Slide and Folder
        let buttonBar = '';
        switch(selector.stype){
            case 'slide':
                buttonBar = (
        <button className='ui button blue'>
          <i className='plus icon'>
          </i>
          Add question
        </button>
      );
                break;
            case 'deck':
                buttonBar = (
        <div className='ui buttons'>
          <button className='ui button'>
            Exam mode
          </button>
          <button className='ui button'>
            Test mode
          </button>
          <button className='ui button blue'>
            <i className='file pdf outline icon'>
            </i>
            Export to PDF
          </button>
        </div>
      );
                break;
        }

        let questionsHeader = (
      <div
        className="ui segment attached"
        data-reactid={636}>
        <div
          className="ui bottom attached"
          data-reactid={637}>
          <div data-reactid={638}>
            <div className="ui vertical segment">
              <div className="ui two column stackable grid">
                <div className="column">
                  <h3 className="ui  header">Questions
            <div className="ui label red">Prototype interface - not functional</div></h3>
                </div>
                <div className="column right aligned">
                  <button className="ui right floated compact button primary">
                    <i
                      className="small plus icon"
                      data-reactid={640} />
                    {/* react-text: 641 */}Add question{/* /react-text */}
                  </button>
                </div>
              </div>
            </div>
            {content}
          </div>
        </div>
      </div>

    );

        class PaginationItem extends React.Component
        {
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
                  <a
                    className={className}
                    onClick={this._onClick}
                  >
                  {this.props.pageNo+1}
                  </a>
                );
            }
        }

        let getItems = () => {
            let noOfQuestions = questions.length;
            let items = [];
            let pageNo = 0;
            for(let i = 0; i < noOfQuestions; i+=itemsPerPage) {
                items.push(
                  <PaginationItem
                    key={pageNo}
                    isActiveItem={this.state.pageNo === pageNo}
                    pageNo={pageNo++}
                    onItemClick={this.handlePageClick}
                    />
                  );
            }
            return items;
        };

        let lastPageNo = parseInt(questions.length / itemsPerPage);
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

        let lowerBound = this.state.pageNo * itemsPerPage;
        let upperBound = lowerBound + itemsPerPage;
        if (upperBound > questions.length){
            upperBound = questions.length;
        }

        let content = (
      <div>
        {buttonBar}
        {questionsHeader}
        <ContentQuestionsList items={questions.slice(lowerBound, upperBound)} />
        {pagination}
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
      <div
        ref="contentQuestionsPanel"
        className="ui bottom attached">
        {content}
      </div>
        );
    }
}

ContentQuestionsPanel = connectToStores(ContentQuestionsPanel, [ContentQuestionsStore], (context, props) => {
    return {
        ContentQuestionsStore: context.getStore(ContentQuestionsStore).getState()
    };
});
export default ContentQuestionsPanel;
