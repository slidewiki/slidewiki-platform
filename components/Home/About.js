import React from 'react';

class About extends React.Component {
    render() {
        return (
            <div className="ui container grid" ref="about">
                <div className="ui row">
                    <div className="column">
                        <div className="ui content">
                            <h2 className="ui header">About SlideWiki</h2>
                            <p>

                                <p>SlideWiki aims to exploit the wisdom, creativity and productivity of the crowd for the creation of qualitative, rich,
                                engaging educational content. With SlideWiki users can create and collaborate on slides, diagrams, assessments and arrange this
                                content in richly-structured course presentations.</p>
                                <p>SlideWiki empowers communities of educators to author, share and re-use sophisticated educational content in a truly collaborative way.
                                Existing presentations can be imported and transformed into interactive courses using HTML and LaTeX.
                                All content in SlideWiki is versioned thereby allowing users to revise, adapt and re-mix all content.
                                Self-test questions can be attached to each individual slide and are aggregated on the presentation level into comprehensive
                                self-assessment tests. Users can create their own presentation themes.
                                Slidewiki supports the semi-automatic translation of courses in more than 50 languages, allowing synchronization of the content between the languages.</p>
                                <p>With SlideWiki we aim to make educational content dramatically more accessible, interactive, engaging and qualitative.</p>
                                <p>Slidewiki is an open-source platform, and all its content can be reused under CC-BY license. SlideWiki development, large-scale trials
                                and underlying reseach is funded from Framework Programme for Research and Innovation Horizon 2020 under grant agreement no 688095.
                                For more details, see <a href="http://slidewiki.eu">SlideWiki EU project website</a></p>
                                <h3> The final-release functionality of the SlideWiki platform will include, but not limited to: </h3>
                                <ul>
                                    <li>WYSIWYG slide authoring</li>
                                    <li>Logical slide and deck representation</li>
                                    <li>LaTeX/MathML integration</li>
                                    <li>Multilingual decks / semi-automatic translation / synchronization of content between translated versions</li>
                                    <li>Import/export of the content into a number of formats (PDF, SCORM, ePUB, PowerPoint, OpenOffice and others)</li>
                                    <li>Dynamic CSS themability and transitions</li>
                                    <li>Support of social networking activities</li>
                                    <li>Full revisioning and branching of slides and decks</li>
                                    <li>E-Learning with self-assessment questionnaires</li>
                                    <li>Content recommendation and personalization</li>
                                </ul>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default About;
