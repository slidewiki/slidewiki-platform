import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames/bind';
import { NavLink } from 'fluxible-router';
import { FormattedMessage, defineMessages } from 'react-intl';
import { Segment, Grid, Image, Label, Icon, Divider, List } from 'semantic-ui-react';
import { Microservices } from '../../../configs/microservices';
import { getLanguageName }  from '../../../common';
import { getEducationLevel } from '../../../lib/isced.js';

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
                defaultMessage: 'Other versions available ({count})'
            },
            otherVersionsHeader: {
                id: 'SearchResultsItem.otherVersionsHeader',
                defaultMessage: 'Other matching versions'
            },
            thumbnailAlt: {
                id: 'SearchResultsItem.thumbnailAlt',
                defaultMessage: 'Example of presentation: {title}'
            },

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
        let forksList = '';
        let otherVersions;
        if(result.forks && result.forks.length > 0){
            otherVersions = <NavLink href="#" onClick={this.handleOtherVersionsClick.bind(this)}>{this.context.intl.formatMessage(this.messages.otherVersionsMsg, { count: result.forks.length})} { (this.state.expanded) ? <Icon name="angle up" aria-label="expand other versions"/> : <Icon name="angle down" aria-label="expand other versions"/>}</NavLink>;

            forksList = <List divided relaxed>
                {
                    result.forks.map( (fork, index) => {
                        return <List.Item key={`result_${result.index}_fork_${index}`}>
                            <List.Header><NavLink href={fork.link}>{ fork.title }</NavLink></List.Header>
                            <List.Description>
                                <FormattedMessage {...this.messages.lastModified} />: {fork.lastUpdate} <FormattedMessage {...this.messages.by} /> <NavLink href={fork.user.link}>{fork.user.displayName || fork.user.username}</NavLink>
                            </List.Description>
                        </List.Item>;
                    })
                }
            </List>;
        }

        return (
            <Grid.Row id={`result_${result.index}`} role="listitem" className="item">
                <Grid.Column width={16} className="ui segment">
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={3}>
                                <NavLink href={result.link} aria-hidden="true" tabIndex="-1">
                                    <Image bordered src={`${Microservices.file.uri}/thumbnail/slide/${result.firstSlide}${(result.theme) ? '/' + result.theme : ''}`} alt={this.context.intl.formatMessage(this.messages.thumbnailAlt, { title: result.title })} size="small" />
                                </NavLink>
                            </Grid.Column>
                            <Grid.Column width={8}>
                                <h3 className="ui header"><NavLink href={result.link}>{result.title}</NavLink></h3>
                                <div className="meta"><strong><FormattedMessage {...this.messages.by} /></strong>
                                    <NavLink href={result.user.link}>{result.user.displayName || result.user.username}</NavLink>
                                </div>
                                <div className="meta"><strong><FormattedMessage {...this.messages.lastModified} />:</strong> {result.lastUpdate}</div>
                                <div className="meta"><strong>{this.context.intl.formatMessage(this.messages.description)}:</strong> {result.description}</div>
                            </Grid.Column>
                             <Grid.Column width={5}>
                                <div className="ui labels">
                                    <Label size="small">
                                        <Icon name="comments" aria-label="Language"/>{ this.getLanguageName(result.language) }
                                    </Label>
                                    {/*<Label size="small">
                                       <Icon name="block layout" aria-label="Number of slides"/>{result.noOfSlides}
                                    </Label>*/}
                                    { result.educationLevel &&
                                    <div className="ui label" >
                                        <i className="university icon" aria-label="Education Level"></i>{getEducationLevel(result.educationLevel)}
                                    </div>
                                    }
                                </div>
                                <div className="ui labels">
                                    <Label  size="small">
                                       <Icon name="fork" aria-label="Number of forks"/>{result.fork_count - 1}
                                    </Label>
                                     <Label  size="small">
                                       <Icon name="thumbs up" aria-label="Number of likes"/>{result.noOfLikes}
                                    </Label>
                                    <Label  size="small">
                                       <Icon name="share alternate" aria-label="Number of shares"/>{result.sharesCount}
                                    </Label>
                                    <Label  size="small">
                                       <Icon name="download" aria-label="Number of downloads"/>{result.downloadsCount}
                                    </Label>
                                </div>

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
                                    { forksList }
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
