import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames/bind';
import { NavLink } from 'fluxible-router';
import { FormattedMessage, defineMessages } from 'react-intl';
import { Segment, Grid, Image, Label, Icon, Divider, List } from 'semantic-ui-react';
import { Microservices } from '../../../configs/microservices';
import { getLanguageName }  from '../../../common';

class SearchResultsItem extends React.Component {

    constructor(props){
        super(props);
        this.messages = this.getIntlMessages();
        this.state = {
            expanded: false
        };
    }
    toggleExpanded() {
        this.setState({
            expanded: !this.state.expanded
        });
    }
    getIntlMessages(){
        return defineMessages({
            otherDeckVersion: {
                id: 'SearchResultsItem.otherVersions.deck',
                defaultMessage: 'Deck Version {index}: {title}'
            },
            otherSlideVersion: {
                id: 'SearchResultsItem.otherVersions.slide',
                defaultMessage: 'Also in Deck: {title}'
            },
            by: {
                id: 'SearchResultsItem.by',
                defaultMessage: 'by'
            },
            lastModified: {
                id: 'SearchResultsItem.lastModified',
                defaultMessage: 'Last modified'
            },
            description: {
                id: 'SearchResultsItem.description', 
                defaultMessage: 'Description'
            },
            otherVersionsMsg: {
                id: 'SearchResultsItem.otherVersionsMsg',
                defaultMessage: 'Other versions available'
            },
            otherVersionsHeader: {
                id: 'SearchResultsItem.otherVersionsHeader',
                defaultMessage: 'Other matching versions'
            }

        });
    }
    getLanguageName(languageCode) {
        let language = languageCode === undefined ? '' : getLanguageName(languageCode);
        return (language === '' ? 'English' : language);
    }
    handleOtherVersionsClick(e) {
        e.preventDefault();
        this.toggleExpanded();
    }
    render() {
        const result = this.props.data;

        // form sublist items and expand button
        let subList = '';
        let otherVersions;
        if(result.subItems && result.subItems.length > 0){
            otherVersions = <NavLink href="#" onClick={this.handleOtherVersionsClick.bind(this)}>{this.context.intl.formatMessage(this.messages.otherVersionsMsg)}</NavLink>;

            subList = result.subItems.map( (item, index) => {
                return <div className="row" key={item.id}>
                    <NavLink href={item.link}>
                        {
                            this.context.intl.formatMessage(this.messages.otherDeckVersion, {
                                index: index+1,
                                title: item.title
                            })
                        }
                    </NavLink>
                </div>;
            });
        }

        return (
            <Grid.Row id={`result_${result.index}`} role="listitem" className="item" tabIndex="0">
                <Grid.Column width={16} className="ui segment">
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={3}>
                                <NavLink href={result.link}>
                                    <Image bordered src={`${Microservices.file.uri}/thumbnail/slide/${result.firstSlide}${(result.theme) ? '/' + result.theme : ''}`} alt={result.title} size="small"/>
                                </NavLink>
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <div className="ui header"><NavLink href={result.link}>{result.title}</NavLink></div>
                                <div className="meta"><strong><FormattedMessage {...this.messages.by} /></strong>
                                    <NavLink href={result.user.link}>{result.user.displayName || result.user.username}</NavLink>
                                </div>
                                <div className="meta"><strong><FormattedMessage {...this.messages.lastModified} />:</strong> {result.lastUpdate}</div>
                                <div className="meta"><strong>{this.context.intl.formatMessage(this.messages.description)}:</strong> {result.description}</div>
                            </Grid.Column>
                             <Grid.Column width={5}>
                                <div className="ui labels">
                                    <Label  size="small">
                                       <Icon name="fork" aria-label="Number of forks"/>1
                                    </Label>
                                     <Label  size="small">
                                       <Icon name="thumbs up" aria-label="Number of likes"/>1
                                    </Label>
                                    <Label  size="small">
                                       <Icon name="share alternate" aria-label="Number of shares"/>1
                                    </Label>
                                    <Label  size="small">
                                       <Icon name="download" aria-label="Number of downloads"/>1
                                    </Label>
                                </div>

                                <Label  size="small">
                                   <Icon name="comments" aria-label="Language"/>{ this.getLanguageName(result.language) }
                                </Label>
                                <Divider hidden />
                                <div>
                                    { otherVersions } 
                                </div>
                             </Grid.Column>
                        </Grid.Row>
                        {
                            (this.state.expanded) && 
                            <Grid.Row>
                                <Grid.Column width={16}>
                                    <h4>{this.context.intl.formatMessage(this.messages.otherVersionsHeader)}</h4>
                                        <List divided relaxed>
                                            <List.Item>
                                                <List.Header as='a'>Fork 1</List.Header>
                                                <List.Description>
                                                    Last Modified: [date] by <a>[username]</a>
                                                </List.Description>
                                            </List.Item>
                                                <List.Item>
                                                <List.Header as='a'>Fork 2</List.Header>
                                                <List.Description>
                                                    Last Modified: [date] by <a>[username]</a>
                                                </List.Description>
                                            </List.Item>
                                        </List>
                                </Grid.Column>
                                
                            </Grid.Row>
                        }
                    </Grid>
                </Grid.Column>
            </Grid.Row>
        );
    }
}

SearchResultsItem.contextTypes = {
    intl: PropTypes.object.isRequired,
};

export default SearchResultsItem;
