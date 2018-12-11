import React from 'react';
import {FormattedMessage, defineMessages} from 'react-intl';
import StaticPage from './StaticPage';

class About extends React.Component {
    render() {
        return (
            <StaticPage>
                <div className="ui container" ref="about">
                    <h1 className="ui header" id="main"><FormattedMessage id="about.header" defaultMessage="About SlideWiki"/></h1>
                    <p>
                        <FormattedMessage id="about.p1" defaultMessage="SlideWiki is an online slideshow tool that offers users the chance to create and collaborate on slides, assessments and to share content as structured open educational resources using a Creative Commons licence. With SlideWiki you can engage with your audience by collaborating with colleagues to co-design and co-create course materials and share your knowledge across the world."/>
                    </p>
                    <p>
                        <FormattedMessage id="about.p2" defaultMessage="SlideWiki empowers communities of educators to author, share and re-use sophisticated educational content in a truly collaborative way. Existing presentations can be imported and transformed into interactive courses using HTML. Slides can be supplements with comments, links to sources and materials as well as questions to help learners."/>
                    </p>
                    <p>
                        <FormattedMessage id="about.p3" defaultMessage="With SlideWiki we aim to make open educational content dramatically more accessible, interactive and engaging.    All the content published on SlideWiki is made available under the Creative Common CC-BY-SA 4.0 licence which means that you can share, repurpose and reuse content for your own purposes. This means that you can revise, adapt and re-mix any slides and decks on SlideWiki. If you like a deck, simply Fork it to create your own copy; if you are looking for new content you can attached slides or embed decks created by others. All changes to slides within SlideWiki are tracked, making it easy to see who has created the materials and aid collaboration with co-authors."/>
                    </p>

                    <h3>
                        <FormattedMessage id="about.functionality" defaultMessage="With SlideWiki you can:"/>
                    </h3>
                    <ul>
                        <li><FormattedMessage id="about.functionality.import" defaultMessage="Import existing slide decks from PowerPoint and OpenOffice formats."/></li>
                        <li><FormattedMessage id="about.functionality.wysiwig" defaultMessage="Use the online, collaborative WYSIWYG slide authoring tools."/></li>
                        <li><FormattedMessage id="about.functionality.collaborate" defaultMessage="Create and edit decks collaborative with colleagues."/></li>
                        <li><FormattedMessage id="about.functionality.socialNetworking" defaultMessage="Share decks  through social networking platforms."/></li>
                        <li><FormattedMessage id="about.functionality.revisioning" defaultMessage="Track the history and changes to your content."/></li>
                        <li><FormattedMessage id="about.functionality.groups" defaultMessage="Use tags and groups to collate content for a course."/></li>
                        <li><FormattedMessage id="about.functionality.rooms" defaultMessage="Set up a Presentation Room to broadcast your slideshow."/></li> 
                        <li><FormattedMessage id="about.functionality.accessible" defaultMessage="Create inclusive slides and decks that will accessible to assistive technology users."/>
                        </li>
                    </ul>
                    <h3>
                        <FormattedMessage id="about.future" defaultMessage="Features coming soon:"/>
                    </h3>
                    <ul>
                        <li><FormattedMessage id="about.functionality.frills" defaultMessage="Multilingual decks / semi-automatic translation / synchronization of content between translated versions."/></li>
                        <li><FormattedMessage id="about.functionality.eLearning" defaultMessage="E-Learning with self-assessment questionnaires."/></li>
                        <li><FormattedMessage id="about.functionality.integration" defaultMessage="Learning analytics and LTI support."/></li>
                        <li><FormattedMessage id="about.functionality.peronsalization" defaultMessage="Content recommendation and personalization."/></li>
                    </ul>
                    <p>
                        <FormattedMessage id="about.p5"
                            values={{
                                link_3: <a href="https://github.com/slidewiki/slidewiki-platform" target="_blank">
                                    <FormattedMessage id="about.github" defaultMessage="GitHub"/>
                                </a>
                            }}
                            defaultMessage={'SlideWiki is an open-source development project available on {link_3}. You are free to use or adapt our source code (and in most cases the code of the third party libraries we use) to install your own version of SlideWiki for your organisation or on your website.'}/>
                    </p>

                    <p>
                        <FormattedMessage id="about.p6"
                            values={{
                                link_2: <a href="/license">
                                    <FormattedMessage id="about.license" defaultMessage="Creative Commons CC-BY-SA license"/>
                                </a>
                            }}
                            defaultMessage={'SlideWiki is an open-source platform, and all its content can be reused under {link_2}. '}/>
                        
                        <FormattedMessage id="about.p4"
                            values={{
                                link_1: <a href="http://slidewiki.eu" target="_blank">
                                    <FormattedMessage id="about.euwebsite" defaultMessage="SlideWiki EU project website"/>
                                </a>
                            }}
                            defaultMessage={'SlideWiki development, large-scale trials and underlying research is funded from Framework Programme for Research and Innovation Horizon 2020 under grant agreement no 688095. ' + 'For more details, see {link_1}'}/>
                    </p>
                </div>
            </StaticPage>
        );
    }
}

export default About;
