import PropTypes from 'prop-types';
import React from 'react';
import {getIntlLanguage} from '../../../common.js';
import CategoryBox from './CategoryBox';
import ChangePicture from './ChangePicture';
import ChangePassword from './ChangePassword';
import DeactivateAccount from './DeactivateAccount';
import ChangePersonalData from './ChangePersonalData';
import IntlStore from '../../../stores/IntlStore';
import UserGroups from './UserGroups';
import UserLTIs from './UserLTIs';
import UserLTIEdit from './UserLTIEdit';
import { connectToStores } from 'fluxible-addons-react';
import UserProfileStore from '../../../stores/UserProfileStore';
import UserStatsStore from '../../../stores/UserStatsStore';
import UserGroupsStore from '../../../stores/UserGroupsStore';
import UserPerformancePredictions from './UserAnalytics/UserPerformancePredictions';
import PrivatePublicUserProfile from './PrivatePublicUserProfile/PrivatePublicUserProfile';
import Integrations from './Integrations';
import {defineMessages, FormattedMessage} from 'react-intl';
import {categories} from '../../../actions/user/userprofile/chooseAction';
import UserStats from './UserStats';
import { Header } from 'semantic-ui-react';
import setDocumentTitle from '../../../actions/setDocumentTitle';

let MediaQuery = require ('react-responsive');

class UserProfile extends React.Component {
    constructor(props) {
        super(props);

        this.messages = defineMessages({
            swalTitle1: {
                id: 'UserProfile.swalTitle1',
                defaultMessage: 'Changes have been applied',
            },
            swalTitle2: {
                id: 'UserProfile.swalTitle2',
                defaultMessage: 'Your Account has been deleted',
            },
            swalTitle3: {
                id: 'UserProfile.swalTitle3',
                defaultMessage: 'Error',
            },
            swalText3: {
                id: 'UserProfile.swalText3',
                defaultMessage: 'Something went wrong',
            },
            swalButton3: {
                id: 'UserProfile.swalButton3',
                defaultMessage: 'Ok',
            },
            titleProfile: {
                id: 'UserProfile.titleProfile',
                defaultMessage: 'Profile',
            },
            titleAccount: {
                id: 'UserProfile.titleAccount',
                defaultMessage: 'Account',
            },
            titleIntegrations: {
                id: 'UserProfile.titleIntegrations',
                defaultMessage: 'Authorized Accounts & Services'
            },
            titleGroups: {
                id: 'UserProfile.titleGroups',
                defaultMessage: 'My Groups'
            },
            titleStats: {
                id: 'UserProfile.titleStats',
                defaultMessage: 'User Stats'
            },
            titlePerformancePrediction: {
                id: 'UserProfile.titlePerformancePrediction',
                defaultMessage: 'Performance Prediction'
            },
            titleMyDecks: {
                id: 'UserProfile.titleMyDecks',
                defaultMessage: 'My decks'
            },
            titleSharedDecks: {
                id: 'UserProfile.titleSharedDecks',
                defaultMessage: 'Shared decks'
            },
            titleRecommendedDecks: {
                id: 'UserProfile.titleRecommendedDecks',
                defaultMessage: 'Recommended decks'
            },
            titlePlaylists: {
                id: 'UserProfile.titlePlaylists',
                defaultMessage: 'Playlists'
            }
        });
    }

    componentDidMount() {
        this.setTitle();
    }

    componentDidUpdate(prevProps) {

        const { category, categoryItem } = this.props.UserProfileStore;
        const { category: prevCategory, categoryItem: prevCategoryItem } = prevProps.UserProfileStore;
        if (category !== prevCategory || categoryItem !== prevCategoryItem) {
            this.setTitle();
        }
        
        if (this.props.UserProfileStore.dimmer.success === true)
            swal({
                type: 'success',
                text: '',
                title: this.context.intl.formatMessage(this.messages.swalTitle1),
                timer: 2600,
                showCloseButton: false,
                showCancelButton: false,
                allowEscapeKey: false,
                showConfirmButton: false
            })
            .then(() => {
            },() => {//dismiss function
                if(this.props.IntlStore.currentLocale !== getIntlLanguage() ||
                (this.props.UserProfileStore.category === categories.categories[0] && this.props.UserProfileStore.categoryItem === categories.settings[0]) ) //user to reload page beacuse of cookie change or picture change
                    window.location.reload();
            }).catch(swal.noop);
        if (this.props.UserProfileStore.dimmer.userdeleted === true)
            swal({
                type: 'success',
                text: '',
                title: this.context.intl.formatMessage(this.messages.swalTitle2),
                timer: 4000,
                showCloseButton: false,
                showCancelButton: false,
                allowEscapeKey: false,
                showConfirmButton: false
            }) 
            .then(() => {}).catch(swal.noop);
        if (this.props.UserProfileStore.dimmer.failure === true)
            swal({
                title: this.context.intl.formatMessage(this.messages.swalTitle3),
                text: this.context.intl.formatMessage(this.messages.swalText3),
                type: 'error',
                allowEscapeKey: false,
                allowOutsideClick: false,
                confirmButtonText: this.context.intl.formatMessage(this.messages.swalButton3),
                confirmButtonClass: 'negative ui button',
                buttonsStyling: false
            })
            .then(() => {}).catch(swal.noop);
    }

    setTitle() {
        const { category, categoryItem } = this.props.UserProfileStore;
        let title = '';

        if (category === categories.categories[0]) {
            if (categoryItem === categories.settings[0]) {
                title = this.context.intl.formatMessage(this.messages.titleProfile);
            } else if (categoryItem === categories.settings[1]) {
                title = this.context.intl.formatMessage(this.messages.titleAccount);
            } else if (categoryItem === categories.settings[2]) {
                title = this.context.intl.formatMessage(this.messages.titleIntegrations);
            }
        } else if (category === categories.categories[1]) {
            if (categoryItem === categories.groups[0]) {
                title = this.context.intl.formatMessage(this.messages.titleGroups);
            }
        } else if(category === categories.categories[2]) {
            title = this.context.intl.formatMessage(this.messages.titlePlaylists);
        } else if (category === undefined || category === categories.categories[3]) {
            if (categoryItem === categories.decks[0]) {
                title = this.context.intl.formatMessage(this.messages.titleSharedDecks);
            } else {
                title = this.context.intl.formatMessage(this.messages.titleMyDecks);
            }
        } else if (category === categories.categories[4]) {
            title = this.context.intl.formatMessage(this.messages.titleRecommendedDecks);
        } else if (category === 'stats') {
            title = this.context.intl.formatMessage(this.messages.titleStats);
        } else if (category === categories.categories[7]) {
            if (categoryItem === categories.analytics[0]) {
                title = this.context.intl.formatMessage(this.messages.titlePerformancePrediction);
            }
        } else {
            title = this.context.intl.formatMessage(this.messages.titleProfile);
        }
        this.context.executeAction(setDocumentTitle, { 
            title: `${title}`
        });
    }

    chooseView() {
        switch(this.props.UserProfileStore.category){
            case categories.categories[0]:
                return this.addScaffold(() => {switch(this.props.UserProfileStore.categoryItem){
                    case categories.settings[0]:
                        return this.displayUserSettings();
                        break;
                    case categories.settings[1]:
                        return this.displayAccounts();
                        break;
                    case categories.settings[2]:
                        return this.displayIntegrations();
                        break;
                }});
            case categories.categories[1]:
                return this.addScaffold(() => {switch(this.props.UserProfileStore.categoryItem){
                    case categories.groups[0]:
                        return this.displayGroups();
                        break;
                }});
            case categories.categories[6]:
                return this.addScaffold(() => {switch(this.props.UserProfileStore.categoryItem){
                    case categories.ltis[0]:
                        return this.displayLTIs();
                        break;
                    case categories.ltis[1]:
                        return this.displayLTIedit();
                        break;
                }});
            case 'stats':
                return this.addScaffold(() => this.displayUserStats());
            case categories.categories[7]:
                return this.addScaffold(() => {switch(this.props.UserProfileStore.categoryItem){
                    case categories.analytics[0]:
                        return this.displayPerformancePredictions();
                        break;
                }});
            default:
                return this.displayUserProfile();
        };
    }

    addScaffold(toInsert){
        return (
            <div className = "ui vertically padded stackable grid container" >
                <div className = "four wide column" >
                    <CategoryBox highlight = { this.props.UserProfileStore.categoryItem } username = { this.props.UserProfileStore.username } />
                    <div className = "ui hidden divider" />
                </div>
                <MediaQuery minDeviceWidth={1024} values={{deviceWidth: 1600}}>
                    <div className = "twelve wide column" >
                        {toInsert()}
                    </div>
                </MediaQuery>
                <MediaQuery minDeviceWidth={768} maxDeviceWidth={1023}>
                    <div className = "eleven wide column" >
                        {toInsert()}
                    </div>
                </MediaQuery>
                <MediaQuery maxDeviceWidth={767}>
                    <div className = "twelve wide column" >
                        {toInsert()}
                    </div>
                </MediaQuery>

            </div>
        );
    }

    displayUserSettings() {
        return (
          <main>
              <div className="ui segments">
                  <div className="ui secondary segment" >
                    <Header as="h2" size="medium">
                        <FormattedMessage
                          id='UserProfile.exchangePicture'
                          defaultMessage='Exchange picture'
                        />
                      </Header>
                  </div>
                  <div className="ui segment">
                      <ChangePicture user={ this.props.UserProfileStore.user }/>
                  </div>

              </div>
              <div className="ui segments">
                  <div className="ui secondary segment">
                    <Header as="h2" size="medium">
                        <FormattedMessage
                          id='UserProfile.alterData'
                          defaultMessage='Alter my personal data'
                        />
                      </Header>
                  </div>
                  <div className="ui segment">
                      <ChangePersonalData user={ this.props.UserProfileStore.user } failures={ this.props.UserProfileStore.failures } saveProfileIsLoading={this.props.UserProfileStore.saveProfileIsLoading} />
                  </div>

              </div>
          </main>);
    }

    displayAccounts() {
        let changePassword = (this.props.UserProfileStore.user.hasPassword) ? (
                <div className="ui segments">
                  <div className="ui secondary segment">
                    <Header as="h2" size="medium">
                      <FormattedMessage
                        id='UserProfile.changePassword'
                        defaultMessage='Change password'
                      />
                    </Header>
                  </div>

                  <div className="ui segment">
                    <ChangePassword failures={ this.props.UserProfileStore.failures } dimmer={this.props.UserProfileStore.dimmer}/>
                  </div>
                </div>
            ) : '';
        return (
          <div>
            {changePassword}
            <div className="ui segments">
              <div className="ui red inverted segment">
                <Header as="h2" size="medium">
                  <FormattedMessage
                    id='UserProfile.deactivateAccount'
                    defaultMessage='Deactivate Account'
                  />
                </Header>
              </div>

              <div className="ui segment">
                <DeactivateAccount showModal={this.props.UserProfileStore.showDeactivateAccountModal} />
              </div>
            </div>
        </div>);
    }

    displayUserProfile() {
        return (<PrivatePublicUserProfile user={this.props.UserProfileStore.user}
                                          decks={this.props.UserProfileStore.userDecks}
                                          decksMeta={this.props.UserProfileStore.userDecksMeta}
                                          loadMoreLoading={this.props.UserProfileStore.nextUserDecksLoading}
                                          loadMoreError={this.props.UserProfileStore.nextUserDecksError}
                                          loggedinuser={this.props.UserProfileStore.username}
                                          loggedinUserId={this.props.UserProfileStore.userid}
                                          category={this.props.UserProfileStore.category}
                                          categoryItem={this.props.UserProfileStore.categoryItem}
                                          />);
    }

    displayIntegrations() {
        return (
            <Integrations removeProviderError={this.props.UserProfileStore.removeProviderError} addProviderError={this.props.UserProfileStore.addProviderError} addProviderAlreadyUsedError={this.props.UserProfileStore.addProviderAlreadyUsedError} providerAction={this.props.UserProfileStore.providerAction} providers={this.props.UserProfileStore.user.providers} hasPassword={this.props.UserProfileStore.user.hasPassword}/>
        );
    }

    displayGroups() {
        return (<UserGroups error={this.props.UserProfileStore.deleteUsergroupError} status={this.props.UserGroupsStore.usergroupsViewStatus} groups={this.props.UserProfileStore.user.groups} username={this.props.UserProfileStore.username} userid={this.props.UserProfileStore.userid} />);
    }

    displayUserStats(){
        return (<UserStats userStats={this.props.UserStatsStore} />);
    }
    
    displayPerformancePredictions() {
        return ( <UserPerformancePredictions /> );
    }


    displayLTIs() {
        return (<UserLTIs error={this.props.UserProfileStore.deleteUserltiError} status={this.props.UserProfileStore.userltsViewStatus} ltis={this.props.UserProfileStore.user.ltis} username={this.props.UserProfileStore.username} userid={this.props.UserProfileStore.userid} />);
    }

    displayLTIedit() {
        return (<UserLTIEdit saveUserltiError={this.props.UserProfileStore.saveUserltiError} username={this.props.UserProfileStore.username} currentUserlti={this.props.UserProfileStore.currentUserlti} userid={this.props.UserProfileStore.userid} saveUserltiIsLoading={this.props.UserProfileStore.saveUserltiIsLoading} picture={this.props.UserProfileStore.user.picture} />);
    }

    render() {
        return (this.chooseView());
    }
}

UserProfile.contextTypes = {
    executeAction: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired
};

UserProfile = connectToStores(UserProfile, [UserProfileStore, UserStatsStore, UserGroupsStore, IntlStore], (context, props) => {
    return {
        UserProfileStore: context.getStore(UserProfileStore).getState(),
        UserStatsStore: context.getStore(UserStatsStore).getState(),
        UserGroupsStore: context.getStore(UserGroupsStore).getState(),
        IntlStore: context.getStore(IntlStore).getState(),
    };
});

export default UserProfile;
