import React from 'react';

class QuestionDownloadItem extends React.Component {
    
    render() {
        const question = this.props.question;
        
        let difficultyStars = (difficulty) => {
            let difficultyClass = '';
            switch (difficulty) {
                case 1:
                    difficultyClass = 'ui small yellow star icon';
                    break;
                case 2:
                    difficultyClass = 'ui small orange star icon';
                    break;
                case 3:
                    difficultyClass = 'ui small red star icon';
                    break;
            }
            let difficultyStars = [];
            for(let i = 0; i < difficulty; i++){
                difficultyStars.push(<i key={i} className={difficultyClass} />);
            }
            return difficultyStars;
    
        };
        
        return (
                <div className="ui two column vertically divided" tabIndex={-1}>
                    <div className="ui checkbox">
                        <input type="checkbox" onChange={this.props.onClick.bind(this)} onKeyPress={this.props.onKeyPress.bind(this)} checked={this.props.selectedQ} ref={name} name={name} id={name} /> 
                        <label htmlFor='name'>
                            {question.title}
                        </label>
                    </div>
                    <div className="ui star rating" data-rating={question.difficulty} >
                        {difficultyStars(question.difficulty)}
                    </div>
                </div>
        );
    }

//////////////
}

export default QuestionDownloadItem;