import React from 'react';
import StaticPage from './StaticPage';
import PropTypes from 'prop-types';
import {defineMessages} from 'react-intl';

class terms extends React.Component {
    constructor(props) {
        super(props);
        this.messages = defineMessages({
            mainTitle: {
                id: 'terms.mainTitle',
                defaultMessage: 'Terms of us of SlideWiki'
            },
            summary: {
                id: 'terms.summary',
                defaultMessage: 'This is a human-readable summary of the Terms of Use for SlideWiki (the project).'
            },
            disclaimer: {
                id: 'terms.disclaimer',
                defaultMessage: 'Disclaimer: This summary is not a part of the Terms of Use and is not a legal document. It is simply a handy reference for understanding the full terms. Think of it as the user-friendly interface to the legal language of our Terms of Use.'
            },
            missionTitle: {
                id: 'terms.missionTitle',
                defaultMessage: 'Part of our mission is to:'
            },
            mission1: {
                id: 'terms.mission1',
                defaultMessage: 'Empower and engage people around the world to collect and develop educational content and either publish it under a free license or dedicate it to the public   domain.'
            },
            mission2: {
                id: 'terms.mission2',
                defaultMessage: 'Disseminate this content effectively and globally, free of charge.'
            },
            freeTo: {
                id: 'terms.freeTo',
                defaultMessage: 'You are free to:'
            },
            free1: {
                id: 'terms.free1',
                defaultMessage: 'Read and Print our presentations and other media free of charge.'
            },
            free2: {
                id: 'terms.free2',
                defaultMessage: 'Share and Reuse our presentations and other media under free and open licenses.'
            },
            free3: {
                id: 'terms.free3',
                defaultMessage: 'Contribute To and Edit our various sites or projects.'
            },
            conditionsTitle: {
                id: 'terms.conditionsTitle',
                defaultMessage: 'Under the following conditions'
            },
            condition1: {
                id: 'terms.confition1',
                defaultMessage: 'Responsibility – You take responsibility for your edits (since we only host your content).'
            },
            condition2: {
                id: 'terms.condition2',
                defaultMessage: 'Civility – You support a civil environment and do not harass other users.'
            },
            condition3: {
                id: 'terms.condition3',
                defaultMessage: 'Lawful behaviour – You do not violate copyright or other laws.'
            },
            condition4: {
                id: 'terms.condition4',
                defaultMessage: 'No Harm – You do not harm our technology infrastructure.'
            },
            condition5: {
                id: 'terms.condition5',
                defaultMessage: 'Terms of Use and Policies – You adhere to the Terms of Use and to the applicable community policies when you visit our sites or participate in our communities.'
            },
            understandingTitle: {
                id: 'terms.understanding',
                defaultMessage: 'With the understanding that'
            },
            understanding1: {
                id: 'terms.understanding1',
                defaultMessage: 'This service may contain translations powered by third party services. Selecting to use the translate service will result in data being sent to third-party services. We disclaims all warranties related to the translations, expressed or implied, including any warranties of accuracy, reliability, and any implied warranties of  merchantability, fitness for a particular purpose and noninfringement.'
            },
            understanding2: {
                id: 'terms.understanding2',
                defaultMessage: 'You license freely your contributions – you generally must license your contributions and edits to our sites or projects under a free and open license (unless your contribution is in the public domain).'
            },
            understanding3: {
                id: 'terms.understanding3',
                defaultMessage: 'No professional advice – the content of presentations and other projects is for informational purposes only and does not constitute professional advice.'
            },
            paragraph1: {       // TODO: change lorem ipsums in the following paragraphs
                id: 'terms.paragraph1',
                defaultMessage: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus id nisl magna. Sed a metus vel dui vehicula viverra. Quisque sed tellus at justo semper dictum. Nullam at rutrum leo. Vivamus at aliquam metus. Aliquam nec nunc in libero posuere hendrerit nec at lacus. Nunc malesuada lobortis tortor nec porta. Cras vulputate mollis nisi, at sollicitudin quam eleifend ac. Nam sed venenatis turpis. Sed vestibulum malesuada nunc vitae ultricies. Donec bibendum ultrices facilisis. Mauris sollicitudin mi et vulputate rhoncus.'
            },
            paragraph2: {
                id: 'terms.paragraph2',
                defaultMessage: 'Mauris tincidunt, urna non aliquam dapibus, enim metus varius tellus, non dignissim urna odio ac augue. Fusce id lacinia ipsum, id egestas dui. Suspendisse nec quam vel mi tincidunt bibendum a vel mauris. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Proin magna elit, molestie eu libero ut, bibendum facilisis turpis. Mauris sem lorem, dignissim a ex sit amet, suscipit fermentum turpis. Integer porttitor arcu non porttitor faucibus. Fusce nisi risus, rutrum vitae vulputate vitae, consectetur et nunc. Aliquam placerat ipsum felis, nec fermentum arcu sagittis nec. Aenean imperdiet laoreet quam ac placerat. Ut accumsan tristique elementum. Etiam congue venenatis lorem, malesuada tristique mauris congue vel. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nam tincidunt libero a nisi consequat sodales.'
            },
            paragraph3: {
                id: 'terms.paragraph3',
                defaultMessage: 'Aliquam vitae velit iaculis, vestibulum felis eu, lacinia risus. Donec mollis enim nec accumsan tristique. Morbi dapibus condimentum erat quis placerat. Integer velit augue, sodales quis scelerisque nec, facilisis nec velit. Maecenas rhoncus sagittis lectus, vel feugiat nulla aliquet quis. Quisque condimentum sapien nec eros tristique, vitae pulvinar sem tempus. Nulla ut odio id elit accumsan interdum. Maecenas sagittis sed sem a malesuada. Vivamus venenatis ex sed ex pretium, et pellentesque purus vehicula. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egesta'
            }
        });
    }

    render() {
        return (
            <StaticPage>
                <div className='ui content'>
                    <h1 className='ui header'>{this.context.intl.formatMessage(this.messages.mainTitle)}</h1>
                    <p>{this.context.intl.formatMessage(this.messages.summary)}</p>
                    <p>{this.context.intl.formatMessage(this.messages.disclaimer)}</p>
                    <h2 className='ui small header'>{this.context.intl.formatMessage(this.messages.missionTitle)}</h2>
                    <ul>
                        <li>{this.context.intl.formatMessage(this.messages.mission1)}</li>
                        <li>{this.context.intl.formatMessage(this.messages.mission2)}</li>
                    </ul>
                    <h2 className='ui small header'>{this.context.intl.formatMessage(this.messages.freeTo)}</h2>
                    <ul>
                        <li>{this.context.intl.formatMessage(this.messages.free1)}</li>
                        <li>{this.context.intl.formatMessage(this.messages.free2)}</li>
                        <li>{this.context.intl.formatMessage(this.messages.free3)}</li>
                    </ul>
                    <h2 className='ui small header'>{this.context.intl.formatMessage(this.messages.conditionsTitle)}</h2>
                    <ul>
                        <li>{this.context.intl.formatMessage(this.messages.condition1)}</li>
                        <li>{this.context.intl.formatMessage(this.messages.condition2)}</li>
                        <li>{this.context.intl.formatMessage(this.messages.condition3)}</li>
                        <li>{this.context.intl.formatMessage(this.messages.condition4)}</li>
                        <li>{this.context.intl.formatMessage(this.messages.condition5)}</li>
                    </ul>
                    <h2 className='ui small header'>{this.context.intl.formatMessage(this.messages.understandingTitle)}</h2>
                    <ul>
                        <li>{this.context.intl.formatMessage(this.messages.understanding1)}</li>
                        <li>{this.context.intl.formatMessage(this.messages.understanding2)}</li>
                        <li>{this.context.intl.formatMessage(this.messages.understanding3)}</li>
                    </ul>
                </div>
            </StaticPage>
        );
    }
}

terms.contextTypes = {
    intl: PropTypes.object.isRequired
};

export default terms;