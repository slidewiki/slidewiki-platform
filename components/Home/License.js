import React from 'react';
import {FormattedMessage, defineMessages} from 'react-intl';

class license extends React.Component {
    render() {
        return (
            <div className="ui text container" ref="license">
                <div className="hidden divider"></div>
                <h1 className="ui header"><FormattedMessage id="licence.header" defaultMessage="Creative Commons Licenses and SlideWiki"/></h1>
                <p><FormattedMessage id="licence.p1" defaultMessage="SlideWiki is an open platform allowing you to publish educational content under a Creative Commons license. By publishing content under a Creative Commons license, SlideWiki intends to empower educational communities to author, share and reuse educational content in order to improve the availability of educational materials. This page will explain how SlideWiki uses Creative Common licenses."/></p>
                <h2 className="ui header"><FormattedMessage id="licence.1.header" defaultMessage="Creative Commons Attribution ShareAlike 4.0 CC BY-SA"/></h2>
                <div className="ui right floated medium image">
                  <FormattedMessage id="licence.ccBySaLicenceLogo" defaultMessage="Creative Commons BY-SA License logo">
                    {
                      (alt) => <img alt={alt}  src="http://mirrors.creativecommons.org/presskit/buttons/88x31/png/by-sa.png" />
                    }
                  </FormattedMessage>
                </div>
                <p><FormattedMessage id="licence.1.p1" defaultMessage="Decks and slides in SlideWiki are published under the Creative Common Attribution ShareAlike licence. This license lets others reuse, alter and build on slides and decks as long as the user credit the orginial author and license their new creations under identical terms. Any external works that is is based on SlideWiki content must carry the same license. This means that any derivatives will also allow for commercial use, but still need to attribute the orginal author and publish under the same license."/></p>
                <p>
                  <FormattedMessage id="licence.1.p2"
                    values={{
                        link_1: <a href="https://creativecommons.org/licenses/by-sa/4.0/">
                            <FormattedMessage id="licence.summary" defaultMessage="Human readable summary of the CC-BY-SA license from Creative Commons"/>
                        </a>
                    }}
                    defaultMessage="Find out more about the CC BY-SA and access the full license text by viewing the {link_1}."
                  />
                </p>
                <h3 className="ui header"><FormattedMessage id="licence.1.1.header" defaultMessage="Why do we use the CC BY-SA license for SlideWiki decks and slides?"/></h3>
                <p><FormattedMessage id="licence.1.1.p1" defaultMessage="The CC BY-SA license is used by Wikipedia and similar resources, which means you can include material from Wikipedia in your decks as long as you include the original source. It also ensures that material created by SlideWiki users is always attributed to the orginal author, which we believe enhances the quality and probity of educational resources."/></p>
                <p><FormattedMessage id="licence.1.1.p2" defaultMessage="By using this license, everyone will be free to copy and redistribute the materials from any SlideWiki deck in any medium or format as long as they are published under the same license. SlideWiki material can also be adapted, including remixing, transforming and building on the material for any purpose, including commercial activities."/></p>
                <h3 className="ui header"><FormattedMessage id="licence.1.2.header" defaultMessage="Can I add any materials to my slides and decks under the CC BY-SA licence?"/></h3>
                <p><FormattedMessage id="licence.1.2.p1" defaultMessage="When adding content to your slides, it is your responsibility to ensure that it can be shared under a Creative Commons Attribution ShareAlike license. This means that the content you create must also have a similar license so that it can be adapted and used by anyone (including for commercial activities). Materials that are in the public domain (sometimes referred to as CC0) or licensed under Creative Commons Attribution (CC BY) can be included in your slides as well as those already publised under Creative Commons Attribution ShareAlike license (CC BY-SA)."/></p>
                <h3 className="ui header"><FormattedMessage id="license.1.3.header" defaultMessage="Where can I find material that I can use under this license in my decks and slides?"/></h3>
                <p><FormattedMessage id="licence.1.3.p1" defaultMessage="As all decks and slides are published under a license that allows content to be adapted and reused, you can reuse content from any decks in your own slides. The Append Deck and Append Slides function allows you to find and attach  decks and slide as you are creating your own work."/></p>
                <p>
                  <FormattedMessage id="licence.1.3.p2"
                    values={{
                        link_1: <a href="https://search.creativecommons.org"><FormattedMessage id="license.ccSearch" defaultMessage="Creative Commons Search"/></a>
                    }}
                    defaultMessage="{link_1} lists sources of materials published under creative commons licenses. Some media services such as Flickr, YouTube and Vimeo publish some content under creative commons licenses. Content marked “All rights reserved” cannot be included in SlideWiki."
                  />
                </p>
                <p><FormattedMessage id="licence.1.3.p3" defaultMessage="If you add content to your slides that is published under a Creative Common Attribution ShareAlike licence then you must ensure you add the attribution information into the Sources for the slide. [You can find out more about adding Sources to slides in our Guide]. Images published under a Creative Commons Attribution ShareAlike licence can be uploaded and incorporated into SlideWiki slides. However, it is your responsibility to ensure that you provide credit or attribution to the creator within the image upload dialog."/></p>
                <p><FormattedMessage id="licence.1.3.p4" defaultMessage="If a video or content has an Embed function provided by the video’s owner, then it is possible to add the code to embed the video into your slides. However, caution should be taken with videos that could have been posted without the copyright owner’s permission. [You can find out more about embedding videos in slides in our Guide.]"/></p>
                <p>
                  <FormattedMessage id="licence.1.3.p5"
                    values={{
                        link_1: <a href="https://www.theedublogger.com/2017/01/20/copyright-fair-use-and-creative-commons/">
                            <FormattedMessage id="licence.copyrightGuide" defaultMessage="“The Educator’s Guide To Copyright, Fair Use, And Creative Commons”"/>
                        </a>
                    }}
                    defaultMessage="If you would like to find out more about copyright issues then you may find this article helpful: {link_1}."
                  />
                </p>
                <h2 className="ui header"><FormattedMessage id="licence.2.header" defaultMessage="Creative Commons Attribution 4.0 CC BY"/></h2>
                <div className="ui right floated medium image">
                  <FormattedMessage id="licence.ccByLicenceLogo" defaultMessage="Creative Commons CC BY License logo">
                    {
                      (alt) => <img alt={alt} src="http://mirrors.creativecommons.org/presskit/buttons/88x31/png/by.png"/>
                    }
                  </FormattedMessage>
                </div>
                <p><FormattedMessage id="licence.2.p1" defaultMessage="This license allows materials to be copied and redistributed in any medium or format as long as they are attributed to the original creator and copyright notices. Images published under a Creative Commons Attribution licence can be uploaded and incorporated into SlideWiki slides. However, it is your responsibility to ensure that you provide credit or attribution to the creator within the image upload dialog."/></p>
                <p>
                  <FormattedMessage id="licence.2.p2"
                    values={{
                        link_1: <a href="https://creativecommons.org/licenses/by/4.0/">
                            <FormattedMessage id="licence.ccSummary" defaultMessage="Human readable summary of the CC BY license from Creative Commons"/>
                        </a>
                    }}
                    defaultMessage="Find out more about the CC BY and access the full license text by viewing the {link_1}."
                  />
                </p>
                <h2 className="ui header"><FormattedMessage id="licence.3.header" defaultMessage="Work in the Public Domain, free of copyright or CC0"/></h2>
                <div className="ui right floated medium image">
                  <FormattedMessage id="licence.ccPdlLogo" defaultMessage="Creative Commons CC 0 public domain License logo">
                    {
                      <img alt={alt}  src="http://mirrors.creativecommons.org/presskit/buttons/88x31/png/cc-zero.png" />
                    }
                  </FormattedMessage>
                </div>
                <p><FormattedMessage id="licence.3.p1" defaultMessage="Work in the Public domain is free of copyright restrictions. This is usually for works that are free from copyright restrictions. This includes works where the copyright has expired or the creator has assigned their work to the public domain. While it is not always necessary to attribute the source of public domain work. However, it is good practice to attribute works to the creator or source to add provienance to your decks and slides. CCO is the Creative Commons license that enables authors and creators to waive their rights to their work and place it in the public domain."/></p>
                <h2 className="ui header"><FormattedMessage id="licence.4.header" defaultMessage="Notices"/></h2>
                <p><FormattedMessage id="licence.4.p1" defaultMessage="The SlideWiki website and its content are provided &quot;as is&quot;. We offer no warranties, explicit or implied regarding any content, the webiste or the accuracy of any information.  These license may not give you all of the permissions necessary for your intended use. For example, other rights such as publicity, privacy, or moral rights may limit how you use the material. We reserve the right to remove materials and content that we believe to infringe copyright and license requirements."/></p>
            </div>

        );
    }
}

export default license;
