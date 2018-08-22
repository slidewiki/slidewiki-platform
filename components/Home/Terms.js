import React from 'react';
import {FormattedMessage, defineMessages} from 'react-intl';

class terms extends React.Component {
    render() {
        return (
            <div className="ui text container" ref="terms">
                <div className="hidden divider"></div>
                <h1 className="ui header"><FormattedMessage id="terms.header" defaultMessage="Terms of use of SlideWiki"/></h1>
                <p>
                  <FormattedMessage id="terms.p1"
                    values={{
                        summary: <b><FormattedMessage id="terms.p1.summary" defaultMessage="summary"/></b>
                    }}
                    defaultMessage="This is a human-readable {summary} of the Terms of Use for SlideWiki (the project)."/>
                </p>
                <p><FormattedMessage id="terms.p2" defaultMessage="Disclaimer: This summary is not a part of the Terms of Use and is not a legal document. It is simply a handy reference for understanding the full terms. Think of it as the user-friendly interface to the legal language of our Terms of Use."/></p>
                <h2 className="ui header"><FormattedMessage id="terms.1.header" defaultMessage="Part of our mission is to:"/></h2>
                <ul className="ui list">
                    <li>
                      <FormattedMessage id="terms.1.ul.empowerAndEngageLi"
                        values={{
                            empowerAndEngage: <b><FormattedMessage id="terms.1.ul.empowerAndEngage" defaultMessage="Empower and engage"/></b>
                        }}
                        defaultMessage="{empowerAndEngage} people around the world to collect and develop educational content and either publish it under a free license or dedicate it to the public domain."
                      />
                    </li>

                    <li>
                      <FormattedMessage id="terms.1.ul.disseminateLi"
                        values={{
                            disseminate: <b><FormattedMessage id="terms.1.ul.disseminate" defaultMessage="Disseminate"/></b>
                        }}
                        defaultMessage="{disseminate} this content effectively and globally, free of charge"
                      />
                    </li>
                </ul>
                <h2 className="ui header"><FormattedMessage id="terms.2.header" defaultMessage="You are free to:"/></h2>
                <ul className="ui list">
                    <li>
                      <FormattedMessage id="terms.2.ul.readAndPrintLi"
                        values={{
                            readAndPrint: <b><FormattedMessage id="terms.2.ul.readAndPrint" defaultMessage="Read and Print"/></b>
                        }}
                        defaultMessage="{readAndPrint} our presentations and other media free of charge."
                      />
                    </li>
                    <li>
                      <FormattedMessage id="terms.2.ul.shareAndReuseLi"
                        values={{
                            shareAndReuse: <b><FormattedMessage id="terms.2.ul.shareAndReuse" defaultMessage="Share and Reuse"/></b>
                        }}
                        defaultMessage="{shareAndReuse} our presentations and other media under free and open licenses."
                      />
                    </li>
                    <li>
                      <FormattedMessage id="terms.2.ul.contributeToAndEditLi"
                        values={{
                            contributeToAndEdit: <b><FormattedMessage id="terms.2.ul.contributeToAndEdit" defaultMessage="Contribute To and Edit"/></b>
                        }}
                        defaultMessage="{contributeToAndEdit} our various sites or projects."
                      />
                    </li>
                </ul>
                <h2 className="ui header"><FormattedMessage id="terms.3.header" defaultMessage="Under the following conditions"/></h2>
                <ul className="ui list">
                    <li>
                      <FormattedMessage id="terms.3.ul.responsibilityLi"
                        values={{
                            responsibility: <b><FormattedMessage id="terms.3.ul.responsibility" defaultMessage="Responsibility"/></b>,
                            host: <i><FormattedMessage id="terms.3.ul.host" defaultMessage="host"/></i>
                        }}
                        defaultMessage="{responsibility} &#8211; You take responsibility for your edits (since we only {host} your content)."
                      />
                    </li>
                    <li>
                      <FormattedMessage id="terms.3.ul.civilityLi"
                        values={{
                            civility: <b><FormattedMessage id="terms.3.ul.civility" defaultMessage="Civility"/></b>
                        }}
                        defaultMessage="{civility} &#8211; You support a civil environment and do not harass other users."
                      />
                    </li>
                    <li>
                      <FormattedMessage id="terms.3.ul.lawfulBehaviourLi"
                        values={{
                            lawfulBehaviour: <b><FormattedMessage id="terms.3.ul.lawfulBehaviour" defaultMessage="Lawful behaviour"/></b>
                        }}
                        defaultMessage="{lawfulBehaviour} &#8211; You do not violate copyright or other laws."
                      />
                    </li>
                    <li>
                      <FormattedMessage id="terms.3.ul.noHarmLi"
                        values={{
                            noHarm: <b><FormattedMessage id="terms.3.ul.noHarm" defaultMessage="No Harm"/></b>
                        }}
                        defaultMessage="{noHarm} &#8211; You do not harm our technology infrastructure."
                      />
                    </li>
                    <li>
                      <FormattedMessage id="terms.3.ul.touAndPoliciesLi"
                        values={{
                            touAndPolicies: <b><FormattedMessage id="terms.3.ul.touAndPolicies" defaultMessage="Terms of Use and Policies"/></b>
                        }}
                        defaultMessage="{touAndPolicies} &#8211; You adhere to the Terms of Use and to the applicable community policies when you visit our sites or participate in our communities."
                      />
                    </li>
                </ul>
                <h2 className="ui header"><FormattedMessage id="terms.4.header" defaultMessage="With the understanding that"/></h2>
                <ul className="ui list">
                    <li>
                      <FormattedMessage id="terms.4.ul.translationsLi"
                        values={{
                            translations: <b><FormattedMessage id="terms.4.ul.translations" defaultMessage="translations"/></b>
                        }}
                        defaultMessage="This service may contain {translations} powered by third party services. Selecting to use the translate service will result in data being sent to third-party services. We disclaims all warranties related to the translations, expressed or implied, including any warranties of accuracy, reliability, and any implied warranties of merchantability, fitness for a particular purpose and noninfringement."
                      />
                    </li>
                    <li>
                      <FormattedMessage id="terms.4.ul.contributionLicenceLi"
                        values={{
                            contributionLicence: <b><FormattedMessage id="temrs.4.ul.contributionLicenceLi" defaultMessage="You license freely your contributions"/></b>
                        }}
                        defaultMessage="{contributionLicence} &#8211; you generally must license your contributions and edits to our sites or projects under a free and open license (unless your contribution is in the public domain)."
                      />
                    </li>
                    <li>
                      <FormattedMessage id="terms.4.ul.noProfessionalAdviceLi"
                        values={{
                            noProfessionalAdvice: <b><FormattedMessage id="terms.4.ul.noProfessionalAdvice" defaultMessage="No professional advice"/></b>
                        }}
                        defaultMessage="{noProfessionalAdvice} &#8211; the content of presentations and other projects is for informational purposes only and does not constitute professional advice or commercial advertisement. However, you can contact the SlideWiki foundation to support you in creating your own installation of SlideWiki on a website or webserver for commercial, educational, hybrid, or other purposes."
                      />
                    </li>
                </ul>

                <h2 className="ui header"><FormattedMessage id="terms.5.header" defaultMessage="Refraining from Certain Activities"/></h2>
                <p><FormattedMessage id="terms.5.p1" defaultMessage="We reserve the rights to remove content that we consider to be inappropriate, offensive or spam. Certain activities, whether legal or illegal, may be harmful to other users and violate our rules, and some activities may also subject you to liability. Therefore, for your own protection and for that of other users, you may not engage in such activities on our sites. These activities include:"/></p>

                <h3 className="ui header"><FormattedMessage id="terms.5.1.header" defaultMessage="Harassing and Abusing Others"/></h3>
                <ul className="ui list">
                    <li><FormattedMessage id="terms.5.1.ul.misconduct" defaultMessage="Engaging in harassment, threats, stalking, spamming, or vandalism; and"/></li>
                    <li><FormattedMessage id="terms.5.1.ul.spam" defaultMessage="Transmitting chain mail, junk mail, or spam to other users."/></li>
                </ul>
                <h3 className="ui header"><FormattedMessage id="terms.5.2.header" defaultMessage="Violating the Privacy of Others"/></h3>
                <ul className="ui list">
                    <li><FormattedMessage id="terms.5.2.ul.privacyInfringement" defaultMessage="Infringing the privacy rights of others under the laws of Germany or other applicable laws (which may include the laws where you live or where you view or edit content);"/></li>
                    <li><FormattedMessage id="terms.5.2.ul.indentifiableInfoSolicitationHarrasment" defaultMessage="Soliciting personally identifiable information for purposes of harassment, exploitation, violation of privacy, or any promotional or commercial purpose not explicitly approved by the project; and"/></li>
                    <li><FormattedMessage id="terms.5.2.ul.indentifiableInfoSolicitationUnderAge" defaultMessage="Soliciting personally identifiable information from anyone under the age of 18 for an illegal purpose or violating any applicable law regarding the health or well-being of minors."/></li>
                </ul>
                <h3 className="ui header"><FormattedMessage id="terms.5.3.header" defaultMessage="Engaging in False Statements, Impersonation, or Fraud"/></h3>
                <ul className="ui list">
                    <li><FormattedMessage id="terms.5.3.ul.libelContent" defaultMessage="Intentionally or knowingly posting content that constitutes libel or defamation;"/></li>
                    <li><FormattedMessage id="terms.5.3.ul.falseContent" defaultMessage="With the intent to deceive, posting content that is false or inaccurate;"/></li>
                    <li><FormattedMessage id="terms.5.3.ul.impersonation" defaultMessage="Attempting to impersonate another user or individual, misrepresenting your affiliation with any individual or entity, or using the username of another user with the intent to deceive; and"/></li>
                    <li><FormattedMessage id="terms.5.3.ul.fraud" defaultMessage="Engaging in fraud."/></li>
                </ul>
                <h3 className="ui header"><FormattedMessage id="terms.5.4.header" defaultMessage="Committing Infringement"/></h3>
                <ul className="ui list">
                    <li><FormattedMessage id="terms.5.4.ul.infringement" defaultMessage="Infringing copyrights, trademarks, patents, or other proprietary rights under applicable law."/></li>
                </ul>
                <h3 className="ui header"><FormattedMessage id="terms.5.5.header" defaultMessage="Misusing Our Services for Other Illegal Purposes"/></h3>
                <ul className="ui list">
                    <li><FormattedMessage id="terms.5.5.ul.childPorn" defaultMessage="Posting child pornography or any other content that violates applicable law concerning child pornography;"/></li>
                    <li><FormattedMessage id="terms.5.5.ul.obsceneMaterial" defaultMessage="Posting or trafficking in obscene material that is unlawful under applicable law; and"/></li>
                    <li><FormattedMessage id="terms.5.5.ul.inconsistentUsage" defaultMessage="Using the services in a manner that is inconsistent with applicable law."/></li>
                </ul>
                <h3 className="ui header"><FormattedMessage id="terms.5.6.header" defaultMessage="Engaging in Disruptive and Illegal Misuse of Facilities"/></h3>
                <ul className="ui list">
                    <li><FormattedMessage id="terms.5.6.ul.viruses" defaultMessage="Posting or distributing content that contains any viruses, malware, worms, Trojan horses, malicious code, or other device that could harm our technical infrastructure or system or that of our users;"/></li>
                    <li><FormattedMessage id="terms.5.6.ul.disruptiveUses" defaultMessage="Engaging in automated uses of the site that are abusive or disruptive of the services and have not been approved by the project community;"/></li>
                    <li><FormattedMessage id="terms.5.6.ul.disruptingByBurden" defaultMessage="Disrupting the services by placing an undue burden on a project website or the networks or servers connected with a project website;"/></li>
                    <li><FormattedMessage id="terms.5.6.ul.disruptingByTraffic" defaultMessage="Disrupting the services by inundating any of the project websites with communications or other traffic that suggests no serious intent to use the project website for its stated purpose;"/></li>
                    <li><FormattedMessage id="terms.5.6.ul.nonPublicAreasUsage" defaultMessage="Knowingly accessing, tampering with, or using any of our non-public areas in our computer systems without authorization; and"/></li>
                    <li><FormattedMessage id="terms.5.6.ul.vulnerabilityTesting" defaultMessage="Probing, scanning, or testing the vulnerability of any of our technical systems or networks unless all the following conditions are met:"/></li>
                    <ul className="ui list">
                        <li><FormattedMessage id="terms.5.6.ul.ul.noAbuse" defaultMessage="such actions do not unduly abuse or disrupt our technical systems or networks;"/></li>
                        <li><FormattedMessage id="terms.5.6.ul.ul.noGain" defaultMessage="such actions are not for personal gain (except for credit for your work);"/></li>
                        <li><FormattedMessage id="terms.5.6.ul.ul.reportVulnerabilities" defaultMessage="you report any vulnerabilities to SlideWiki developers or administrators of this SlideWiki website (i.e., server on which SlideWiki is installed), or fix it yourself; and"/></li>
                        <li><FormattedMessage id="terms.5.6.ul.ul.noMaliciousIntent" defaultMessage="you do not undertake such actions with malicious or destructive intent."/></li>
                    </ul>
                </ul>
                <h3 className="ui header"><FormattedMessage id="terms.5.7.titile" defaultMessage="Compatibility with Wikipedia&apo;s terms of use"/></h3>
                <p>
                  <FormattedMessage id="terms.5.7.p1"
                    values={{
                        link1: <a href="http://wikimediafoundation.org/wiki/Terms_of_Use"><FormattedMessage id="terms.5.7.p1.wikipediaTou" defaultMessage="Wikipedia terms of use"/></a>,
                        link2: <a href="http://creativecommons.org/licenses/by-sa/3.0/"><FormattedMessage id="ccAttribution" defaultMessage="Creative Commons Attribution/Share-Alike"/></a>
                    }}
                    defaultMessage="Our terms are adapted from the {link1}, which are available under the {link2} License."
                  />
                </p>
                <p><FormattedMessage id="terms." defaultMessage="For full terms and conditions please read our Imprint page."/></p>
            </div>

        );
    }
}

export default terms;
