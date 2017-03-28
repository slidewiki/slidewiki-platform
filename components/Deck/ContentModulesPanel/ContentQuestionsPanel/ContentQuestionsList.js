import React from 'react';
import ContentQuestionsItem from './ContentQuestionsItem';

class ContentQuestionsList extends React.Component {
    render() {
        let list = this.props.items.map((node, index) => {
            return (
                <ContentQuestionsItem question={node} key={index}/>
            );
        });

    //     let questionItem1 = (
    //     <div>
    //     <div className="active title">
    //       <i className="dropdown icon" />
    //       What is the super exciting question?
    //       <div
    //         className="ui star rating"
    //         data-rating={3}
    //         aria-label="difficulty level 1"
    //         tabIndex={0} />
    //       <i className="ui small yellow star icon" />
    //     </div>
    //     <div
    //       className="active content"
    //       data-reactid={653}>
    //       <div className="ui two column stackable grid">
    //         <div className="column">
    //           <div className="ui grouped fields">
    //             <fieldset>
    //               <div className="field">
    //                 <div className="ui checkbox">
    //                   <input
    //                     type="checkbox"
    //                     name="example2"
    //                     id="answer1"
    //                     defaultChecked="checked" />
    //                   <label htmlFor="answer1">
    //                     Once a week
    //                   </label>
    //                 </div>
    //               </div>
    //               <div className="field">
    //                 <div className="ui checkbox">
    //                   <input
    //                     type="checkbox"
    //                     name="answer2"
    //                     id="answer2"
    //                     tabIndex={0} />
    //                   <label htmlFor="answer2">
    //                     2-3 times a week
    //                   </label>
    //                 </div>
    //               </div>
    //               <div className="field">
    //                 <div className="ui checkbox">
    //                   <input
    //                     type="checkbox"
    //                     name="answer3"
    //                     id="answer3"
    //                     tabIndex={0} />
    //                   <label htmlFor="answer3">
    //                     Once a day
    //                   </label>
    //                 </div>
    //               </div>
    //               <div className="field">
    //                 <div className="ui checkbox">
    //                   <input
    //                     type="checkbox"
    //                     name="answer4"
    //                     id="answer4"
    //                     tabIndex={0} />
    //                   <label htmlFor="answer4">
    //                     Twice a day
    //                   </label>
    //                 </div>
    //               </div>
    //             </fieldset>
    //           </div>
    //         </div>
    //         <div className="column">
    //           <button className="ui compact button primary">
    //             <i className=" help circle icon" />
    //             Show answer
    //           </button>
    //           <div className="ui item">
    //             <div className="content">
    //               <a className="header">
    //                 Once a day
    //               </a>
    //               <div className="description">
    //                 <p>
    //                   This is an explanation of the answer
    //                 </p>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //     </div>
    //     );
    //
    //     let questionItem2 = (
    //     <div>
    //     <div className="active title">
    //       <i className="dropdown icon" />
    //       Can I solve the next exciting question?
    //       <div
    //         className="ui star rating"
    //         data-rating={2}
    //         aria-label="difficulty level 2"
    //         tabIndex={0} />
    //       <i className="ui small orange star icon" />
    //       <i className="ui small orange star icon" />
    //     </div>
    //     <div className="content" data-reactid={653}>
    //       <div className="ui two column stackable grid">
    //         <div className="column">
    //           <div className="ui grouped fields">
    //             <fieldset>
    //               <div className="field">
    //                 <div className="ui checkbox">
    //                   <input
    //                     type="checkbox"
    //                     name="example2"
    //                     id="answer1"
    //                     defaultChecked="checked" />
    //                   <label htmlFor="answer1">
    //                     Once a week
    //                   </label>
    //                 </div>
    //               </div>
    //               <div className="field">
    //                 <div className="ui checkbox">
    //                   <input
    //                     type="checkbox"
    //                     name="answer2"
    //                     id="answer2"
    //                     tabIndex={0} />
    //                   <label htmlFor="answer2">
    //                     2-3 times a week
    //                   </label>
    //                 </div>
    //               </div>
    //               <div className="field">
    //                 <div className="ui checkbox">
    //                   <input
    //                     type="checkbox"
    //                     name="answer3"
    //                     id="answer3"
    //                     tabIndex={0} />
    //                   <label htmlFor="answer3">
    //                     Once a day
    //                   </label>
    //                 </div>
    //               </div>
    //               <div className="field">
    //                 <div className="ui checkbox">
    //                   <input
    //                     type="checkbox"
    //                     name="answer4"
    //                     id="answer4"
    //                     tabIndex={0} />
    //                   <label htmlFor="answer4">
    //                     Twice a day
    //                   </label>
    //                 </div>
    //               </div>
    //             </fieldset>
    //           </div>
    //         </div>
    //         <div className="column">
    //           <button className="ui compact button primary">
    //             <i className=" help circle icon" />
    //             Show answer
    //           </button>
    //           <div className="ui item">
    //             <div className="content">
    //               <a className="header">
    //                 Once a day
    //               </a>
    //               <div className="description">
    //                 <p>
    //                   This is an explanation of the answer
    //                 </p>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //     </div>
    //     );
    //
    //     let questionItem3 = (
    //   <div>
    //     <div className="active title">
    //       <i className="dropdown icon" />
    //       Do you find this question really hard?
    //       <div
    //         className="ui star rating"
    //         data-rating={3}
    //         aria-label="difficulty label 3"
    //         tabIndex={0} />
    //       <i className="ui small red star icon" />
    //       <i className="ui small red star icon" />
    //       <i className="ui small red star icon" />
    //     </div>
    //     <div className="content" data-reactid={653}>
    //       <div className="ui two column stackable grid">
    //         <div className="column">
    //           <div className="ui grouped fields">
    //             <fieldset>
    //               <div className="field">
    //                 <div className="ui checkbox">
    //                   <input
    //                     type="checkbox"
    //                     name="example2"
    //                     id="answer1"
    //                     defaultChecked="checked" />
    //                   <label htmlFor="answer1">
    //                     Once a week
    //                   </label>
    //                 </div>
    //               </div>
    //               <div className="field">
    //                 <div className="ui checkbox">
    //                   <input
    //                     type="checkbox"
    //                     name="answer2"
    //                     id="answer2"
    //                     tabIndex={0} />
    //                   <label htmlFor="answer2">
    //                     2-3 times a week
    //                   </label>
    //                 </div>
    //               </div>
    //               <div className="field">
    //                 <div className="ui checkbox">
    //                   <input
    //                     type="checkbox"
    //                     name="answer3"
    //                     id="answer3"
    //                     tabIndex={0} />
    //                   <label htmlFor="answer3">
    //                     Once a day
    //                   </label>
    //                 </div>
    //               </div>
    //               <div className="field">
    //                 <div className="ui checkbox">
    //                   <input
    //                     type="checkbox"
    //                     name="answer4"
    //                     id="answer4"
    //                     tabIndex={0} />
    //                   <label htmlFor="answer4">
    //                     Twice a day
    //                   </label>
    //                 </div>
    //               </div>
    //             </fieldset>
    //           </div>
    //         </div>
    //         <div className="column">
    //           <button className="ui compact button primary">
    //             <i className=" help circle icon" />
    //             Show answer
    //           </button>
    //           <div className="ui item">
    //             <div className="content">
    //               <a className="header">
    //                 Once a day
    //               </a>
    //               <div className="description">
    //                 <p>
    //                   This is an explanation of the answer
    //                 </p>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // );


        return (
            <div ref="contentquestionsList">
                <div className="ui styled fluid accordion">
                    {/* {questionItem1}
                    {questionItem2}
                    {questionItem3} */}
                    {list}
                </div>
             </div>
        );
    }
}

export default ContentQuestionsList;
