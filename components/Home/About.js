import React from 'react';
import {FormattedMessage, defineMessages} from 'react-intl';

class About extends React.Component {
    render() {
        return (
            <div className="ui text container" ref="about">
            <div className="ui hidden divider"></div>
                <h2 className="ui header"><FormattedMessage id="about.header" defaultMessage="About SlideWiki"/></h2>
                <p>
                  <FormattedMessage id="about.p1" defaultMessage="SlideWiki aims to exploit the wisdom, creativity and productivity of the crowd for the creation of qualitative, rich,
                    engaging educational content. With SlideWiki users can create and collaborate on slides, diagrams, assessments and arrange this
                    content in richly-structured course presentations."/>
                </p>
                <p>
                  <FormattedMessage id="about.p2" defaultMessage="SlideWiki empowers communities of educators to author, share and re-use sophisticated educational content in a truly collaborative way.
                    Existing presentations can be imported and transformed into interactive courses using HTML and LaTeX.
                    All content in SlideWiki is versioned thereby allowing users to revise, adapt and re-mix all content.
                    Self-test questions can be attached to each individual slide and are aggregated on the presentation level into comprehensive
                    self-assessment tests. Users can create their own presentation themes.
                    SlideWiki supports the semi-automatic translation of courses in more than 50 languages, allowing synchronization of the content between the languages."/>
                </p>
                <p>
                  <FormattedMessage id="about.p3" defaultMessage="With SlideWiki we aim to make educational content dramatically more accessible, interactive, engaging and qualitative."/>
                </p>
                <p>
                  <FormattedMessage id="about.p4"
                    values={{
                        link_1: <a href="http://slidewiki.eu">
                            <FormattedMessage id="about.euwebsite" defaultMessage="SlideWiki EU project website"/>
                        </a>
                    }}
                    defaultMessage={"SlideWiki is an open-source platform, and all its content can be reused under CC-BY license. SlideWiki development, large-scale trials" +
                    "and underlying research is funded from Framework Programme for Research and Innovation Horizon 2020 under grant agreement no 688095. " +
                    "For more details, see {link_1}"}/>
                </p>
                <h3>
                  <FormattedMessage id="about.functionality" defaultMessage="The final-release functionality of the SlideWiki platform will include, but not limited to:"/>
                </h3>
                <ul>
                    <li><FormattedMessage id="about.functionality.wysiwig" defaultMessage="WYSIWYG slide authoring"/></li>
                    <li><FormattedMessage id="about.functionality.logicalRepresentation" defaultMessage="Logical slide and deck representation"/></li>
                    <li><FormattedMessage id="about.functionality.integration" defaultMessage="LaTeX/MathML integration"/></li>
                    <li>
                      <FormattedMessage id="about.functionality.frills"
                        defaultMessage="Multilingual decks / semi-automatic translation / synchronization of content between translated versions"/>
                    </li>
                    <li>
                      <FormattedMessage id="about.functionality.importExport"
                        defaultMessage="Import/export of the content into a number of formats (PDF, SCORM, ePUB, PowerPoint, OpenOffice and others)"/>
                    </li>
                    <li><FormattedMessage id="about.functionality.css" defaultMessage="Dynamic CSS themability and transitions"/></li>
                    <li><FormattedMessage id="about.functionality.socialNetworking" defaultMessage="Support of social networking activities"/></li>
                    <li><FormattedMessage id="about.functionality.revisioning" defaultMessage="Full revisioning and branching of slides and decks"/></li>
                    <li><FormattedMessage id="about.functionality.eLearning" defaultMessage="E-Learning with self-assessment questionnaires"/></li>
                    <li><FormattedMessage id="about.functionality.peronsalization" defaultMessage="Content recommendation and personalization"/></li>
                </ul>
            </div>

        );
    }
}

export default About;
