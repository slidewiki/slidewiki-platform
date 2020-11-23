import React from 'react';
import {FormattedMessage, defineMessages} from 'react-intl';
import PropTypes from 'prop-types';
import setDocumentTitle from '../../actions/setDocumentTitle';

class DataProtection extends React.Component {
    componentDidMount() {
        this.context.executeAction(setDocumentTitle, { 
            title: this.context.intl.formatMessage({
                id: 'DataProtection.title',
                defaultMessage: 'Data Protection Policy'
            })
        });
    }

    render() {
        return (
            <div className="ui container grid" ref="about">
                <div className="ui row">
                    <div className="twelve wide centered column">
                        <div className="ui content">
                            <h1 className="ui header" id="main"><FormattedMessage id="dataProtection.header" defaultMessage="Statement of Data Protection Conditions"/></h1>
                            <p>When you use this website, we process your personal data as data controllers and save them for the duration required to fulfill­ the defined purposes and legal obligations. The sections below provide further details about the data this involves, how they will be processed and which rights you have in this regard.</p>
                            <p></p>
                            <p>Personal data, as defined by Article 4 (1) General Data Protection Regulation (GDPR) include all information related to an identified or identifiable natural person.</p>
                            <h2>1. Name and Contact Information of Controller and Corporate Data Protection Officer</h2>
                            <p>This data protection information applies to data processing on our website slidewiki.org by the controller:</p>
                            <p>Technische Informationsbibliothek (TIB)<br />Welfengarten 1 B<br />30167 Hannover<br />Deutschland<br /></p>
                            <p>(hereinafter referred to as “TIB”)</p>
                            <p>Tel.: 0511 762-8989<br />E-Mail: <a href="mailto:information@tib.eu">information@tib.eu</a><br />Website: <a href="https://www.tib.eu">https://www.tib.eu</a></p>
                            <p>The corporate data protection officer at TIB can be reached at the following address</p>
                            <p>Elke Brehm<br />Technische Informationsbibliothek (TIB)<br />Welfengarten 1 B<br />30167 Hannover<br />Deutschland</p>
                            <p>Tel.: 0511 762-8138<br />E-Mail: <a href="mailto:datenschutz@tib.eu">datenschutz@tib.eu</a></p>
                            <p>Please feel free to contact the data protection officer directly at any time with your questions concerning your data protection rights and/or your rights as data subject.</p>
                            <h2>2. Personal Data Processing and Purposes of Data Processing</h2>
                            <p>a) When visiting the website</p>
                            <p>You may access our website without having to disclose any details of your identity. The browser installed on your terminal device automatically transmits information to the server of our website (e.g. browser type and version, date and time of access) to enable connection with the website, including the IP address of your requesting terminal device. This information is temporarily stored in a so-called log file and deleted after 14 days.</p>
                            <p>Your IP address is processed for technical and administrative purposes regarding connection set-up and stability, to guarantee the security and functioning of our website and to be able to track any illegal attacks on the website, if required.</p>
                            <p>The legal basis for processing the IP address is Art. 6 (1) lit. f GDPR. Our legitimate interest ensues from said security interest and the necessity of the unobstructed availability of our website.</p>
                            <p>We cannot draw any direct conclusions about your identity from processing the IP address and other information in the log file.</p>
                            <p>Moreover, we use cookies when you visit our website. Further details can be found further below in this data protection information.</p>
                            <p>b) When creating a user account</p>
                            <p>You can contribute content to SlideWiki after you have created a password-protected user account on our website.</p>
                            <p>Setting up the user account requires the following information:</p>
                            <ul>
                                <li>User name</li>
                                <li>First and last name</li>
                                <li>Valid email address</li>
                            </ul>
                            <p>These data are processed in order to identify you as a user and create your user account.</p>
                            <p>To set up the user account, you must also enter a password you choose yourself. To access your user account, you will need to enter your email address and this password. In your user account, you can view the data saved in your user profile and change it at any time.</p>
                            <p>In addition, you may voluntarily provide the following information:</p>
                            <ul>
                                <li>Country you currently reside in</li>
                                <li>Interests</li>
                                <li>Description of yourself</li>
                                <li>Birth Date</li>
                                <li>Organisation you are affiliated with</li>
                                <li>Languages you speak</li>
                            </ul>
                            <p>This information is voluntary and is not required to set up the user account. The information is displayed on your public user profile page to give other users more information about your person.</p>
                            <p>We process data at your request and for the purposes described by Article 6 (1) lit. b GDPR for the setup and usage of your user account and to meet the precontractual conditions. We will also use your email address for notification functions, if these are activated as well as for sending an account activation email and password reset emails.</p>
                            <p>After your user account is deleted, your data will be deleted to prevent further use except if we are required pursuant to Article 6 (1) lit. c GDPR to observe a longer storage period due to retention and documentation obligations pursuant to tax and commercial law (in particular Se. 147 AO or if you have consented to longer storage pursuant to Article 6 (1) lit. a GDPR.</p>
                            <p>c) when creating or editing content of SlideWiki</p>
                            <p>Registered users can create and edit content on SlideWiki. When you work on content in SlideWiki, certain aspects of your activity are registered by the system, saved to the database and processed to implement the collaborative functionalities of SlideWiki.</p>
                            <p>The following aspects of your activity on SlideWiki are recorded when you are logged in:</p>
                            <ul>
                                <li>Translate Slide</li>
                                <li>Share Slide or Deck</li>
                                <li>Add Slide to a Deck</li>
                                <li>Edit Deck information or Slide</li>
                                <li>View a Deck or Slide</li>
                                <li>Move a Slide in a Deck or between Decks</li>
                                <li>Post comment</li>
                                <li>Reply to a comment</li>
                                <li>Use a Deck or Slide in another Deck</li>
                                <li>Attach a Deck or Slide from another Deck</li>
                                <li>Like a Deck</li>
                                <li>Download a Deck (as HTML presentation or other format)</li>
                                <li>Submit answers to a self-test Deck exam</li>
                                <li>Fork a Deck</li>
                                <li>Delete a Slide or Deck</li>
                                <li>Join User Group</li>
                                <li>Leave User Group</li>
                            </ul>
                            <p>SlideWiki processes this information in order to be able to provide the collaborative Opencourseware experience for its users. For example for displaying the activity stream for a Deck or Slide, so that other users can see what happened on a resource and who was working on that resource.  Those are concepts that belong to the core concept of SlideWiki as an open and collaborative system. SlideWiki is a platform for the creation of publicly available educational material and thus authors activity must be transparent.</p>
                            <h2>3. Transfer of Data</h2>
                            <p>We will not forward data collected through slidewiki.org to any third-party processor. We will only transfer data to the respective authorities if we are legally obligated to do so.</p>
                            <h2>4. Cookies</h2>
                            <p>This website uses cookies. Cookies are small files that your browser automatically generates and stores on your device (laptop, tablet, smartphone, etc.) when you visit our site. Cookies do not harm your device nor do they contain viruses, Trojans or other malware.</p>
                            <p>Cookies store information associated with the specific device used. That does not mean that we can directly identify you.</p>
                            <p>We use cookies for the purpose of making the use of our offers more convenient and pleasant for you. For example, we use so-called session cookies to allow session controls or to save data entries in forms or shopping carts during the session. At the latest, session cookies are deleted when you close your browser.</p>
                            <p>We also use temporary cookies to optimize user-friendliness; these cookies are stored on your device for 14 days. When you visit our site again to use our services, these cookies will automatically detect that you have visited in the past and will reapply your previous entries and settings (such as preferred language) so that you do not have to enter them again.</p>
                            <p>The data processed by the cookies are necessary for the above-mentioned purposes to protect our legitimate interests and those of third parties pursuant to Art. 6 (1) lit. f GDPR.</p>
                            <p>Most browsers automatically accept cookies. However, you can configure your browser to not save any cookies on your computer or to display a notice before new cookies are saved. Completely disabling cookies may mean that you cannot fully use all functions of our website.</p>
                            <h2>5. Rights of the Data Subject</h2>
                            <p>You have the following rights: </p>
                            <ul>
                                <li>pursuant to Art. 7(3) GDPR, to withdraw your consent at any time. This means that we may not continue the data processing based on this consent in the future;</li>
                                <li>pursuant to Art. 15 GDPR, to obtain access to your personal data processed by us. In particular, you may request information about the purposes of the processing, the categories of personal data concerned, the categories of recipients to whom the personal data have been or will be disclosed, and the envisaged period for which the data will be stored. Moreover, you have the right to request rectification, erasure, or restriction of processing, to object to processing, the right to lodge a complaint, and to obtain information about the source of your data if they were not collected by us, as well as about the existence of automated decision-making, including profiling, and, if applicable, meaningful information about the logic involved;</li>
                                <li>pursuant to Art. 16 GDPR, to obtain the rectification of inaccurate data or the completion of your personal data without undue delay;</li>
                                <li>pursuant to Art. 17 GDPR, to obtain the erasure of personal data saved by us unless processing is necessary to exercise the right of freedom of expression and information, to comply with a legal obligation, for reasons of public interest, or to establish, exercise or defend legal claims;</li>
                                <li>pursuant to Art. 18 GDPR, to obtain restriction of processing of your personal data if you contest the accuracy of the data, the processing is unlawful but you oppose the erasure of the personal data, or if we no longer need the personal data while you still require it for establishing, exercising or defending legal claims, or if you have filed an objection to the processing pursuant to Art. 21 GDPR;</li>
                                <li>pursuant to Art. 20 GDPR, to receive your personal data that you have provided to us, in a structured, commonly used and machine-readable format or to transmit those data to another controller and</li>
                                <li>pursuant to Art. 77 GDPR, the right to lodge a complaint with a supervisory authority. Generally, you may contact the supervisory authority of your habitual residence, place of work or the registered offices of our organization.</li>
                            </ul>
                            <p><b>Information on your right to object pursuant to Art. 21 GDPR</b></p>
                            <p>You have the right to object, on grounds relating to your particular situation, at any time to processing of your personal data pursuant to Art. 6 (1) lit. e GDPR (data processing carried out in the public interest) and Art. 6 (1) lit. f GDPR (data processing for purposes of legitimate interests).</p>
                            <p>If you file an objection, we will no longer process your personal data unless we can demonstrate compelling legitimate grounds for processing which override your interests, rights and freedoms, or unless the processing serves the establishment, exercise or defense of legal claims.</p>
                            <p>If your objection is directed against the processing of data for the purpose of direct marketing, we will stop the processing immediately. In this case, citing a special situation is not necessary. This includes profiling to the extent that it is related to such direct marketing.</p>
                            <p>If you would like to assert your right to object, please send an email to</p>
                            <p><a href="datenschutz@tib.eu">datenschutz@tib.eu</a></p>
                            <h2>6. Data Security</h2>
                            <p>All your personal data are transmitted in encrypted format, using the widely used and secure TLS (Transport Layer Security) standard. TLS is a secure and proven standard that is also used, for instance, in online banking. You will recognize a secure TLS connection by the additional s after http (i.e., https://..) in the address bar of your browser or by the lock icon in the lower part of your browser.</p>
                            <p>In all other regards, we use suitable technical and organizational security measures to protect your data against accidental or intentional manipulations, partial or complete loss, destruction, or the unauthorized access of third parties. We continuously improve our security measures in accordance with the state of the art.</p>
                            <h2>7. Timeliness and Amendments to this Data Protection Information</h2>
                            <p>The further development of our website and the products and services offered or changed due to statutory or regulatory requirements, respectively, may make it necessary to amend this data protection information. You may access and print out the latest data protection information at any time from our website.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

DataProtection.contextTypes = {
    intl: PropTypes.object.isRequired,
    executeAction: PropTypes.func.isRequired
};


export default DataProtection;
