import PropTypes from 'prop-types';
import React from 'react';
import StaticPage from './StaticPage';
import {FormattedMessage, defineMessages} from 'react-intl';


class Imprint extends React.Component {
    render() {
        //<FormattedMessage id="accessibility.2.header" defaultMessage="Technologies used in the SlideWiki Platform"/>

        return (
            <StaticPage>
                <div className="ui container grid" ref="imprint">
                    <div className="ui row">
                        <div className="ui content">
                        
                            <h1 className="ui header"><FormattedMessage id="imprint.header" defaultMessage="Imprint – also serves as provider identification according to &sect; 5 Telemediengesetz (TMG)"/></h1>
                            <h3><FormattedMessage id="imprint.provider" defaultMessage="Provider"/>:</h3>
                            <p>Technische Informationsbibliothek (TIB)<br/>Welfengarten 1 B, 30167 Hannover<br/><br/>Postfach 6080, 30060 Hannover</p>
                            <h3><FormattedMessage id="imprint.representative" defaultMessage="Authorised Representative"/>:</h3>
                            <p><FormattedMessage id="imprint.representative.text" defaultMessage="Prof. Dr. Sören Auer (Director of TIB)"/>
                            <br/><br/>
                            <FormattedMessage id="imprint.representative.text2" defaultMessage="Technische Informationsbibliothek (TIB) is a foundation of public law of the state of Lower Saxony."/></p>
                            <h4><FormattedMessage id="imprint.authority" defaultMessage="Responsible Supervisory Authority"/>:</h4>
                            <p><FormattedMessage id="imprint.authority.text" defaultMessage="Ministry for Science and Culture of Lower Saxony"/></p>
                            <h4><FormattedMessage id="imprint.contact" defaultMessage="Contact"/>:</h4>
                            <p>Customer service phone:&nbsp;+49 511 762-8989<br/>Central information desk phone: +49 511 762-2268<br/>Fax: +49 511 762-4076<br/>Email: <a>information@tib.eu</a></p>
                            <h3><FormattedMessage id="imprint.VAT" defaultMessage="VAT (sales tax) registration number"/>:</h3>
                            <p>DE 214931803</p>
                            <h3><FormattedMessage id="imprint.editorialOffice" defaultMessage="Editorial Office"/>:</h3>
                            <p>Dr. Sandra Niemeyer; email: <a>sandra.niemeyer@tib.eu</a></p>
                            <h3><FormattedMessage id="imprint.copyright" defaultMessage="Copyright"/>:</h3>
                            <p><FormattedMessage id="imprint.copyright.text" defaultMessage="The layout of this website is protected under copyright, as are the graphics and all other contents contained in the website."/></p>
                            <h3><FormattedMessage id="imprint.content" defaultMessage="Content Available"/>:</h3>
                            <p><b><FormattedMessage id="imprint.content.text1" defaultMessage="Provided as-is:"/></b>&nbsp;
                            <FormattedMessage id="imprint.content.text2" defaultMessage="You acknowledge that we do not make any representations or warranties about the material, data, and information, such as data files, text, computer software, code, music, audio files or other sounds, photographs, videos, or other images (collectively, the “Content”) which you may have access to through your use of SlideWiki. Under no circumstances are we liable in any way for any Content, including, but not limited to: any infringing Content, any errors or omissions in Content, or for any loss or damage of any kind incurred as a result of the use of any Content posted, transmitted, linked from, or otherwise accessible through or made available via SlideWiki. You understand that by using SlideWiki, you may be exposed to Content that is offensive, indecent, or objectionable. You agree that you are solely responsible for your reuse of Content made available through SlideWiki. You should review the terms of the applicable license before you use the Content so that you know what you can and cannot do."/></p>
                            <p><b><FormattedMessage id="imprint.licensing" defaultMessage="Licensing"/>:</b>&nbsp;
                            <FormattedMessage id="imprint.licensing.text" 
                                values={{link_licenses: <a href="https://creativecommons.org/licenses/?lang=en">
                                    <FormattedMessage id="imprint.licenses.page" defaultMessage="licenses page"/></a> 
                                }}
                                defaultMessage="Content on the SlideWiki OCW Authoring platform is licensed under the Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0), Creative Commons Attribution 4.0 International (CC BY 4.0), or Creative Commons 1.0 Universal Public Domain Dedication (CC0 1.0) – unless otherwise marked. See the CC {link_licenses} for more information."/></p>
                            <p><b><FormattedMessage id="imprint.software" defaultMessage="SlideWiki Software"/>:</b>&nbsp;
                            <FormattedMessage id="imprint.software.text" 
                                values={{
                                    link_repository: <a href="http://github.com/slidewiki">
                                    <FormattedMessage id="imprint.repository" defaultMessage="repository"/></a>
                                }}
                                defaultMessage="All of SlideWiki’s software code is Open Source software; please check our code repository."/></p>
                            <h3><FormattedMessage id="imprint.content2" defaultMessage="Content Supplied by You"/></h3>
                            <p><FormattedMessage id="imprint.content2.text" defaultMessage="Your responsibility: You represent, warrant, and agree that no Content posted or otherwise shared by you on or through SlideWiki (“Your Content”), violates or infringes upon the rights of any third party, including copyright, trademark, privacy, publicity, or other personal or proprietary rights, breaches or conflicts with any obligation, such as a confidentiality obligation, or contains libelous, defamatory, or otherwise unlawful material."/></p>
                            <p><FormattedMessage id="imprint.licensing.2" defaultMessage='Licensing Your Content: You retain any copyright that you may have in Your Content. You hereby agree that Your Content: (a) is hereby licensed under the Creative Commons Attribution 4.0 License and may be used under the terms of that license or any later version of a Creative Commons Attribution License, or (b) is in the public domain (such as Content that is not copyrightable or Content you make available under CC0), or \u00A9 if not owned by you, (i) is available under a Creative Commons Attribution 4.0 License or (ii) is a media file that is available under any Creative Commons license.'/></p>
                            <h3><FormattedMessage id="imprint.disclaimer" defaultMessage="Disclaimer"/></h3>
                            <p><FormattedMessage id="imprint.disclaimer.text" defaultMessage="We cannot assume any liability for the content of external pages. Solely the operators of those linked pages are responsible for their content."/></p>
                        </div>
                    </div>
                </div>
            </StaticPage>
        );
    }
}

Imprint.contextTypes = {
    intl: PropTypes.object.isRequired
};

export default Imprint;
