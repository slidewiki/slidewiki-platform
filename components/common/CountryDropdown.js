import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage, defineMessages} from 'react-intl';
import SWAutoComplete from './SWAutoComplete';

/**
 * Renders an accessible dropdown menu list of countries.
 */
class CountryDropdown extends React.Component {
    constructor(props){
        super(props);
        this.messages = this.getIntlMessages();
        this.state = {
            value: props.value
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    static propTypes = {
        /** Whether the input should be a required in the form. */
        required: PropTypes.bool,

        /** The initial value of the input. */
        value: PropTypes.string,
    };

    /**
     * Returns the currently selected item in the dropdown.
     *
     * @returns {string}
     */
    getSelected() {
        return this.state.value;
    }

    /**
     * The list of country names and associated values to be shown in the dropdown.
     * Translations of country names are later created using entries in getIntlMessages().
     *
     * @returns {array}
     */
    countriesToRender = [
        {
            key: 'AF',
            name: 'Afghanistan'
        }, {
            key: 'AL',
            name: 'Albania'
        }, {
            key: 'DZ',
            name: 'Algeria'
        }, {
            key: 'AS',
            name: 'American_Samoa'
        }, {
            key: 'AD',
            name: 'Andorra'
        }, {
            key: 'AG',
            name: 'Angola'
        }, {
            key: 'AI',
            name: 'Anguilla'
        }, {
            key: 'AG',
            name: 'Antigua_and_Barbuda'
        }, {
            key: 'AR',
            name: 'Argentina'
        }, {
            key: 'AA',
            name: 'Armenia'
        }, {
            key: 'AW',
            name: 'Aruba'
        }, {
            key: 'AU',
            name: 'Australia'
        }, {
            key: 'AT',
            name: 'Austria'
        }, {
            key: 'AZ',
            name: 'Azerbaijan'
        }, {
            key: 'BS',
            name: 'Bahamas'
        }, {
            key: 'BH',
            name: 'Bahrain'
        }, {
            key: 'BD',
            name: 'Bangladesh'
        }, {
            key: 'BB',
            name: 'Barbados'
        }, {
            key: 'BY',
            name: 'Belarus'
        }, {
            key: 'BE',
            name: 'Belgium'
        }, {
            key: 'BZ',
            name: 'Belize'
        }, {
            key: 'BJ',
            name: 'Benin'
        }, {
            key: 'BM',
            name: 'Bermuda'
        }, {
            key: 'BT',
            name: 'Bhutan'
        }, {
            key: 'BO',
            name: 'Bolivia'
        }, {
            key: 'BL',
            name: 'Bonaire'
        }, {
            key: 'BA',
            name: 'Bosnia_and_Herzegovina'
        }, {
            key: 'BW',
            name: 'Botswana'
        }, {
            key: 'BR',
            name: 'Brazil'
        }, {
            key: 'BC',
            name: 'British_Indian_Ocean_Ter'
        }, {
            key: 'BN',
            name: 'Brunei'
        }, {
            key: 'BG',
            name: 'Bulgaria'
        }, {
            key: 'BF',
            name: 'Burkina_Faso'
        }, {
            key: 'BI',
            name: 'Burundi'
        }, {
            key: 'KH',
            name: 'Cambodia'
        }, {
            key: 'CM',
            name: 'Cameroon'
        }, {
            key: 'CA',
            name: 'Canada'
        }, {
            key: 'IC',
            name: 'Canary_Islands'
        }, {
            key: 'CV',
            name: 'Cape_Verde'
        }, {
            key: 'KY',
            name: 'Cayman_Islands'
        }, {
            key: 'CF',
            name: 'Central_African_Republic'
        }, {
            key: 'TD',
            name: 'Chad'
        }, {
            key: 'CD',
            name: 'Channel_Islands'
        }, {
            key: 'CL',
            name: 'Chile'
        }, {
            key: 'CN',
            name: 'China'
        }, {
            key: 'CI',
            name: 'Christmas_Island'
        }, {
            key: 'CS',
            name: 'Cocos_Island'
        }, {
            key: 'CO',
            name: 'Colombia'
        }, {
            key: 'CC',
            name: 'Comoros'
        }, {
            key: 'CG',
            name: 'Congo'
        }, {
            key: 'CK',
            name: 'Cook_Islands'
        }, {
            key: 'CR',
            name: 'Costa_Rica'
        }, {
            key: 'HR',
            name: 'Croatia'
        }, {
            key: 'CU',
            name: 'Cuba'
        }, {
            key: 'CB',
            name: 'Curacao'
        }, {
            key: 'CY',
            name: 'Cyprus'
        }, {
            key: 'CZ',
            name: 'Czech_Republic'
        }, {
            key: 'DK',
            name: 'Denmark'
        }, {
            key: 'DJ',
            name: 'Djibouti'
        }, {
            key: 'DM',
            name: 'Dominica'
        }, {
            key: 'DO',
            name: 'Dominican_Republic'
        }, {
            key: 'TM',
            name: 'East_Timor'
        }, {
            key: 'EC',
            name: 'Ecuador'
        }, {
            key: 'EG',
            name: 'Egypt'
        }, {
            key: 'SV',
            name: 'El_Salvador'
        }, {
            key: 'GQ',
            name: 'Equatorial_Guinea'
        }, {
            key: 'ER',
            name: 'Eritrea'
        }, {
            key: 'EE',
            name: 'Estonia'
        }, {
            key: 'ET',
            name: 'Ethiopia'
        }, {
            key: 'FA',
            name: 'Falkland_Islands'
        }, {
            key: 'FO',
            name: 'Faroe_Islands'
        }, {
            key: 'FJ',
            name: 'Fiji'
        }, {
            key: 'FI',
            name: 'Finland'
        }, {
            key: 'FR',
            name: 'France'
        }, {
            key: 'GF',
            name: 'French_Guiana'
        }, {
            key: 'PF',
            name: 'French_Polynesia'
        }, {
            key: 'FS',
            name: 'French_Southern_Ter'
        }, {
            key: 'GA',
            name: 'Gabon'
        }, {
            key: 'GM',
            name: 'Gambia'
        }, {
            key: 'GE',
            name: 'Georgia'
        }, {
            key: 'DE',
            name: 'Germany'
        }, {
            key: 'GH',
            name: 'Ghana'
        }, {
            key: 'GI',
            name: 'Gibraltar'
        }, {
            key: 'GB',
            name: 'Great_Britain'
        }, {
            key: 'GR',
            name: 'Greece'
        }, {
            key: 'GL',
            name: 'Greenland'
        }, {
            key: 'GD',
            name: 'Grenada'
        }, {
            key: 'GP',
            name: 'Guadeloupe'
        }, {
            key: 'GU',
            name: 'Guam'
        }, {
            key: 'GT',
            name: 'Guatemala'
        }, {
            key: 'GN',
            name: 'Guinea'
        }, {
            key: 'GY',
            name: 'Guyana'
        }, {
            key: 'HT',
            name: 'Haiti'
        }, {
            key: 'HW',
            name: 'Hawaii'
        }, {
            key: 'HN',
            name: 'Honduras'
        }, {
            key: 'HK',
            name: 'Hong_Kong'
        }, {
            key: 'HU',
            name: 'Hungary'
        }, {
            key: 'IS',
            name: 'Iceland'
        }, {
            key: 'IN',
            name: 'India'
        }, {
            key: 'ID',
            name: 'Indonesia'
        }, {
            key: 'IA',
            name: 'Iran'
        }, {
            key: 'IQ',
            name: 'Iraq'
        }, {
            key: 'IR',
            name: 'Ireland'
        }, {
            key: 'IM',
            name: 'Isle_of_Man'
        }, {
            key: 'IL',
            name: 'Israel'
        }, {
            key: 'IT',
            name: 'Italy'
        }, {
            key: 'JM',
            name: 'Jamaica'
        }, {
            key: 'JP',
            name: 'Japan'
        }, {
            key: 'JO',
            name: 'Jordan'
        }, {
            key: 'KZ',
            name: 'Kazakhstan'
        }, {
            key: 'KE',
            name: 'Kenya'
        }, {
            key: 'KI',
            name: 'Kiribati'
        }, {
            key: 'NK',
            name: 'Korea_North'
        }, {
            key: 'KS',
            name: 'Korea_South'
        }, {
            key: 'KW',
            name: 'Kuwait'
        }, {
            key: 'KG',
            name: 'Kyrgyzstan'
        }, {
            key: 'LA',
            name: 'Laos'
        }, {
            key: 'LV',
            name: 'Latvia'
        }, {
            key: 'LB',
            name: 'Lebanon'
        }, {
            key: 'LS',
            name: 'Lesotho'
        }, {
            key: 'LR',
            name: 'Liberia'
        }, {
            key: 'LY',
            name: 'Libya'
        }, {
            key: 'LI',
            name: 'Liechtenstein'
        }, {
            key: 'LT',
            name: 'Lithuania'
        }, {
            key: 'LU',
            name: 'Luxembourg'
        }, {
            key: 'MO',
            name: 'Macau'
        }, {
            key: 'MK',
            name: 'Macedonia'
        }, {
            key: 'MG',
            name: 'Madagascar'
        }, {
            key: 'MY',
            name: 'Malaysia'
        }, {
            key: 'MW',
            name: 'Malawi'
        }, {
            key: 'MV',
            name: 'Maldives'
        }, {
            key: 'ML',
            name: 'Mali'
        }, {
            key: 'MT',
            name: 'Malta'
        }, {
            key: 'MH',
            name: 'Marshall_Islands'
        }, {
            key: 'MQ',
            name: 'Martinique'
        }, {
            key: 'MR',
            name: 'Mauritania'
        }, {
            key: 'MU',
            name: 'Mauritius'
        }, {
            key: 'ME',
            name: 'Mayotte'
        }, {
            key: 'MX',
            name: 'Mexico'
        }, {
            key: 'MI',
            name: 'Midway_Islands'
        }, {
            key: 'MD',
            name: 'Moldova'
        }, {
            key: 'MC',
            name: 'Monaco'
        }, {
            key: 'MN',
            name: 'Mongolia'
        }, {
            key: 'MS',
            name: 'Montserrat'
        }, {
            key: 'MA',
            name: 'Morocco'
        }, {
            key: 'MZ',
            name: 'Mozambique'
        }, {
            key: 'MM',
            name: 'Myanmar'
        }, {
            key: 'NA',
            name: 'Nambia'
        }, {
            key: 'NU',
            name: 'Nauru'
        }, {
            key: 'NP',
            name: 'Nepal'
        }, {
            key: 'AN',
            name: 'Netherland_Antilles'
        }, {
            key: 'NL',
            name: 'Netherlands_Holland_Europe'
        }, {
            key: 'NV',
            name: 'Nevis'
        }, {
            key: 'NC',
            name: 'New_Caledonia'
        }, {
            key: 'NZ',
            name: 'New_Zealand'
        }, {
            key: 'NI',
            name: 'Nicaragua'
        }, {
            key: 'NE',
            name: 'Niger'
        }, {
            key: 'NG',
            name: 'Nigeria'
        }, {
            key: 'NW',
            name: 'Niue'
        }, {
            key: 'NF',
            name: 'Norfolk_Island'
        }, {
            key: 'NO',
            name: 'Norway'
        }, {
            key: 'OM',
            name: 'Oman'
        }, {
            key: 'PK',
            name: 'Pakistan'
        }, {
            key: 'PW',
            name: 'Palau_Island'
        }, {
            key: 'PS',
            name: 'Palestine'
        }, {
            key: 'PA',
            name: 'Panama'
        }, {
            key: 'PG',
            name: 'Papua_New_Guinea'
        }, {
            key: 'PY',
            name: 'Paraguay'
        }, {
            key: 'PE',
            name: 'Peru'
        }, {
            key: 'PH',
            name: 'Philippines'
        }, {
            key: 'PO',
            name: 'Pitcairn_Island'
        }, {
            key: 'PL',
            name: 'Poland'
        }, {
            key: 'PT',
            name: 'Portugal'
        }, {
            key: 'PR',
            name: 'Puerto_Rico'
        }, {
            key: 'QA',
            name: 'Qatar'
        }, {
            key: 'ME',
            name: 'Republic_of_Montenegro'
        }, {
            key: 'RS',
            name: 'Republic_of_Serbia'
        }, {
            key: 'RE',
            name: 'Reunion'
        }, {
            key: 'RO',
            name: 'Romania'
        }, {
            key: 'RU',
            name: 'Russia'
        }, {
            key: 'RW',
            name: 'Rwanda'
        }, {
            key: 'NT',
            name: 'St_Barthelemy'
        }, {
            key: 'EU',
            name: 'St_Eustatius'
        }, {
            key: 'HE',
            name: 'St_Helena'
        }, {
            key: 'KN',
            name: 'St_Kitts_Nevis'
        }, {
            key: 'LC',
            name: 'St_Lucia'
        }, {
            key: 'MB',
            name: 'St_Maarten'
        }, {
            key: 'PM',
            name: 'St_Pierre_and_Miquelon'
        }, {
            key: 'VC',
            name: 'St_Vincent_and_Grenadines'
        }, {
            key: 'SP',
            name: 'Saipan'
        }, {
            key: 'SO',
            name: 'Samoa'
        }, {
            key: 'AS',
            name: 'Samoa_American'
        }, {
            key: 'SM',
            name: 'San_Marino'
        }, {
            key: 'ST',
            name: 'Sao_Tome_and_Principe'
        }, {
            key: 'SA',
            name: 'Saudi_Arabia'
        }, {
            key: 'SN',
            name: 'Senegal'
        }, {
            key: 'RS',
            name: 'Serbia'
        }, {
            key: 'SC',
            name: 'Seychelles'
        }, {
            key: 'SL',
            name: 'Sierra_Leone'
        }, {
            key: 'SG',
            name: 'Singapore'
        }, {
            key: 'SK',
            name: 'Slovakia'
        }, {
            key: 'SI',
            name: 'Slovenia'
        }, {
            key: 'SB',
            name: 'Solomon_Islands'
        }, {
            key: 'OI',
            name: 'Somalia'
        }, {
            key: 'ZA',
            name: 'South_Africa'
        }, {
            key: 'ES',
            name: 'Spain'
        }, {
            key: 'LK',
            name: 'Sri_Lanka'
        }, {
            key: 'SD',
            name: 'Sudan'
        }, {
            key: 'SR',
            name: 'Suriname'
        }, {
            key: 'SZ',
            name: 'Swaziland'
        }, {
            key: 'SE',
            name: 'Sweden'
        }, {
            key: 'CH',
            name: 'Switzerland'
        }, {
            key: 'SY',
            name: 'Syria'
        }, {
            key: 'TA',
            name: 'Tahiti'
        }, {
            key: 'TW',
            name: 'Taiwan'
        }, {
            key: 'TJ',
            name: 'Tajikistan'
        }, {
            key: 'TZ',
            name: 'Tanzania'
        }, {
            key: 'TH',
            name: 'Thailand'
        }, {
            key: 'TG',
            name: 'Togo'
        }, {
            key: 'TK',
            name: 'Tokelau'
        }, {
            key: 'TO',
            name: 'Tonga'
        }, {
            key: 'TT',
            name: 'Trinidad_and_Tobago'
        }, {
            key: 'TN',
            name: 'Tunisia'
        }, {
            key: 'TR',
            name: 'Turkey'
        }, {
            key: 'TU',
            name: 'Turkmenistan'
        }, {
            key: 'TC',
            name: 'Turks_and_Caicos_Is'
        }, {
            key: 'TV',
            name: 'Tuvalu'
        }, {
            key: 'UG',
            name: 'Uganda'
        }, {
            key: 'UA',
            name: 'Ukraine'
        }, {
            key: 'AE',
            name: 'United_Arab_Emirates'
        }, {
            key: 'GB',
            name: 'United_Kingdom'
        }, {
            key: 'US',
            name: 'United_States_of_America'
        }, {
            key: 'UY',
            name: 'Uruguay'
        }, {
            key: 'UZ',
            name: 'Uzbekistan'
        }, {
            key: 'VU',
            name: 'Vanuatu'
        }, {
            key: 'VS',
            name: 'Vatican_City_State'
        }, {
            key: 'VE',
            name: 'Venezuela'
        }, {
            key: 'VN',
            name: 'Vietnam'
        }, {
            key: 'VB',
            name: 'Virgin_Islands_Brit'
        }, {
            key: 'VA',
            name: 'Virgin_Islands_USA'
        }, {
            key: 'WK',
            name: 'Wake_Island'
        }, {
            key: 'WF',
            name: 'Wallis_and_Futana_Is'
        }, {
            key: 'YE',
            name: 'Yemen'
        }, {
            key: 'ZR',
            name: 'Zaire'
        }, {
            key: 'ZM',
            name: 'Zambia'
        }, {
            key: 'ZW',
            name: 'Zimbabwe'
        }
    ];

    /**
     * Returns an array of translation key/values for FormattedMessage.
     *
     * @returns {array}
     */
    getIntlMessages(){
        return defineMessages({
            placeholder: {
                id: 'CountryDropdown.placeholder',
                defaultMessage: 'Select your country'
            },
            Afghanistan: {
                id: 'CountryDropdown.Afghanistan',
                defaultMessage: 'Afghanistan'
            },
            Albania: {
                id: 'CountryDropdown.Albania',
                defaultMessage: 'Albania'
            },
            Algeria: {
                id: 'CountryDropdown.Algeria',
                defaultMessage: 'Algeria'
            },
            American_Samoa: {
                id: 'CountryDropdown.American_Samoa',
                defaultMessage: 'American Samoa'
            },
            Andorra: {
                id: 'CountryDropdown.Andorra',
                defaultMessage: 'Andorra'
            },
            Angola: {
                id: 'CountryDropdown.Angola',
                defaultMessage: 'Angola'
            },
            Anguilla: {
                id: 'CountryDropdown.Anguilla',
                defaultMessage: 'Anguilla'
            },
            Antigua_and_Barbuda: {
                id: 'CountryDropdown.Antigua_and_Barbuda',
                defaultMessage: 'Antigua & Barbuda'
            },
            Argentina: {
                id: 'CountryDropdown.Argentina',
                defaultMessage: 'Argentina'
            },
            Armenia: {
                id: 'CountryDropdown.Armenia',
                defaultMessage: 'Armenia'
            },
            Aruba: {
                id: 'CountryDropdown.Aruba',
                defaultMessage: 'Aruba'
            },
            Australia: {
                id: 'CountryDropdown.Australia',
                defaultMessage: 'Australia'
            },
            Austria: {
                id: 'CountryDropdown.Austria',
                defaultMessage: 'Austria'
            },
            Azerbaijan: {
                id: 'CountryDropdown.Azerbaijan',
                defaultMessage: 'Azerbaijan'
            },
            Bahamas: {
                id: 'CountryDropdown.Bahamas',
                defaultMessage: 'Bahamas'
            },
            Bahrain: {
                id: 'CountryDropdown.Bahrain',
                defaultMessage: 'Bahrain'
            },
            Bangladesh: {
                id: 'CountryDropdown.Bangladesh',
                defaultMessage: 'Bangladesh'
            },
            Barbados: {
                id: 'CountryDropdown.Barbados',
                defaultMessage: 'Barbados'
            },
            Belarus: {
                id: 'CountryDropdown.Belarus',
                defaultMessage: 'Belarus'
            },
            Belgium: {
                id: 'CountryDropdown.Belgium',
                defaultMessage: 'Belgium'
            },
            Belize: {
                id: 'CountryDropdown.Belize',
                defaultMessage: 'Belize'
            },
            Benin: {
                id: 'CountryDropdown.Benin',
                defaultMessage: 'Benin'
            },
            Bermuda: {
                id: 'CountryDropdown.Bermuda',
                defaultMessage: 'Bermuda'
            },
            Bhutan: {
                id: 'CountryDropdown.Bhutan',
                defaultMessage: 'Bhutan'
            },
            Bolivia: {
                id: 'CountryDropdown.Bolivia',
                defaultMessage: 'Bolivia'
            },
            Bonaire: {
                id: 'CountryDropdown.Bonaire',
                defaultMessage: 'Bonaire'
            },
            Bosnia_and_Herzegovina: {
                id: 'CountryDropdown.Bosnia_and_Herzegovina',
                defaultMessage: 'Bosnia & Herzegovina'
            },
            Botswana: {
                id: 'CountryDropdown.Botswana',
                defaultMessage: 'Botswana'
            },
            Brazil: {
                id: 'CountryDropdown.Brazil',
                defaultMessage: 'Brazil'
            },
            British_Indian_Ocean_Ter: {
                id: 'CountryDropdown.British_Indian_Ocean_Ter',
                defaultMessage: 'British Indian Ocean Ter'
            },
            Brunei: {
                id: 'CountryDropdown.Brunei',
                defaultMessage: 'Brunei'
            },
            Bulgaria: {
                id: 'CountryDropdown.Bulgaria',
                defaultMessage: 'Bulgaria'
            },
            Burkina_Faso: {
                id: 'CountryDropdown.Burkina_Faso',
                defaultMessage: 'Burkina Faso'
            },
            Burundi: {
                id: 'CountryDropdown.Burundi',
                defaultMessage: 'Burundi'
            },
            Cambodia: {
                id: 'CountryDropdown.Cambodia',
                defaultMessage: 'Cambodia'
            },
            Cameroon: {
                id: 'CountryDropdown.Cameroon',
                defaultMessage: 'Cameroon'
            },
            Canada: {
                id: 'CountryDropdown.Canada',
                defaultMessage: 'Canada'
            },
            Canary_Islands: {
                id: 'CountryDropdown.Canary_Islands',
                defaultMessage: 'Canary Islands'
            },
            Cape_Verde: {
                id: 'CountryDropdown.Cape_Verde',
                defaultMessage: 'Cape Verde'
            },
            Cayman_Islands: {
                id: 'CountryDropdown.Cayman_Islands',
                defaultMessage: 'Cayman Islands'
            },
            Central_African_Republic: {
                id: 'CountryDropdown.Central_African_Republic',
                defaultMessage: 'Central African Republic'
            },
            Chad: {
                id: 'CountryDropdown.Chad',
                defaultMessage: 'Chad'
            },
            Channel_Islands: {
                id: 'CountryDropdown.Channel_Islands',
                defaultMessage: 'Channel Islands'
            },
            Chile: {
                id: 'CountryDropdown.Chile',
                defaultMessage: 'Chile'
            },
            China: {
                id: 'CountryDropdown.China',
                defaultMessage: 'China'
            },
            Christmas_Island: {
                id: 'CountryDropdown.Christmas_Island',
                defaultMessage: 'Christmas Island'
            },
            Cocos_Island: {
                id: 'CountryDropdown.Cocos_Island',
                defaultMessage: 'Cocos Island'
            },
            Colombia: {
                id: 'CountryDropdown.Colombia',
                defaultMessage: 'Colombia'
            },
            Comoros: {
                id: 'CountryDropdown.Comoros',
                defaultMessage: 'Comoros'
            },
            Congo: {
                id: 'CountryDropdown.Congo',
                defaultMessage: 'Congo'
            },
            Cook_Islands: {
                id: 'CountryDropdown.Cook_Islands',
                defaultMessage: 'Cook Islands'
            },
            Costa_Rica: {
                id: 'CountryDropdown.Costa_Rica',
                defaultMessage: 'Costa Rica'
            },
            Croatia: {
                id: 'CountryDropdown.Croatia',
                defaultMessage: 'Croatia'
            },
            Cuba: {
                id: 'CountryDropdown.Cuba',
                defaultMessage: 'Cuba'
            },
            Curacao: {
                id: 'CountryDropdown.Curacao',
                defaultMessage: 'Curacao'
            },
            Cyprus: {
                id: 'CountryDropdown.Cyprus',
                defaultMessage: 'Cyprus'
            },
            Czech_Republic: {
                id: 'CountryDropdown.Czech_Republic',
                defaultMessage: 'Czech Republic'
            },
            Denmark: {
                id: 'CountryDropdown.Denmark',
                defaultMessage: 'Denmark'
            },
            Djibouti: {
                id: 'CountryDropdown.Djibouti',
                defaultMessage: 'Djibouti'
            },
            Dominica: {
                id: 'CountryDropdown.Dominica',
                defaultMessage: 'Dominica'
            },
            Dominican_Republic: {
                id: 'CountryDropdown.Dominican_Republic',
                defaultMessage: 'Dominican Republic'
            },
            East_Timor: {
                id: 'CountryDropdown.East_Timor',
                defaultMessage: 'East Timor'
            },
            Ecuador: {
                id: 'CountryDropdown.Ecuador',
                defaultMessage: 'Ecuador'
            },
            Egypt: {
                id: 'CountryDropdown.Egypt',
                defaultMessage: 'Egypt'
            },
            El_Salvador: {
                id: 'CountryDropdown.El_Salvador',
                defaultMessage: 'El Salvador'
            },
            Equatorial_Guinea: {
                id: 'CountryDropdown.Equatorial_Guinea',
                defaultMessage: 'Equatorial Guinea'
            },
            Eritrea: {
                id: 'CountryDropdown.Eritrea',
                defaultMessage: 'Eritrea'
            },
            Estonia: {
                id: 'CountryDropdown.Estonia',
                defaultMessage: 'Estonia'
            },
            Ethiopia: {
                id: 'CountryDropdown.Ethiopia',
                defaultMessage: 'Ethiopia'
            },
            Falkland_Islands: {
                id: 'CountryDropdown.Falkland_Islands',
                defaultMessage: 'Falkland Islands'
            },
            Faroe_Islands: {
                id: 'CountryDropdown.Faroe_Islands',
                defaultMessage: 'Faroe Islands'
            },
            Fiji: {
                id: 'CountryDropdown.Fiji',
                defaultMessage: 'Fiji'
            },
            Finland: {
                id: 'CountryDropdown.Finland',
                defaultMessage: 'Finland'
            },
            France: {
                id: 'CountryDropdown.France',
                defaultMessage: 'France'
            },
            French_Guiana: {
                id: 'CountryDropdown.French_Guiana',
                defaultMessage: 'French Guiana'
            },
            French_Polynesia: {
                id: 'CountryDropdown.French_Polynesia',
                defaultMessage: 'French Polynesia'
            },
            French_Southern_Ter: {
                id: 'CountryDropdown.French_Southern_Ter',
                defaultMessage: 'French Southern Ter'
            },
            Gabon: {
                id: 'CountryDropdown.Gabon',
                defaultMessage: 'Gabon'
            },
            Gambia: {
                id: 'CountryDropdown.Gambia',
                defaultMessage: 'Gambia'
            },
            Georgia: {
                id: 'CountryDropdown.Georgia',
                defaultMessage: 'Georgia'
            },
            Germany: {
                id: 'CountryDropdown.Germany',
                defaultMessage: 'Germany'
            },
            Ghana: {
                id: 'CountryDropdown.Ghana',
                defaultMessage: 'Ghana'
            },
            Gibraltar: {
                id: 'CountryDropdown.Gibraltar',
                defaultMessage: 'Gibraltar'
            },
            Great_Britain: {
                id: 'CountryDropdown.Great_Britain',
                defaultMessage: 'Great Britain'
            },
            Greece: {
                id: 'CountryDropdown.Greece',
                defaultMessage: 'Greece'
            },
            Greenland: {
                id: 'CountryDropdown.Greenland',
                defaultMessage: 'Greenland'
            },
            Grenada: {
                id: 'CountryDropdown.Grenada',
                defaultMessage: 'Grenada'
            },
            Guadeloupe: {
                id: 'CountryDropdown.Guadeloupe',
                defaultMessage: 'Guadeloupe'
            },
            Guam: {
                id: 'CountryDropdown.Guam',
                defaultMessage: 'Guam'
            },
            Guatemala: {
                id: 'CountryDropdown.Guatemala',
                defaultMessage: 'Guatemala'
            },
            Guinea: {
                id: 'CountryDropdown.Guinea',
                defaultMessage: 'Guinea'
            },
            Guyana: {
                id: 'CountryDropdown.Guyana',
                defaultMessage: 'Guyana'
            },
            Haiti: {
                id: 'CountryDropdown.Haiti',
                defaultMessage: 'Haiti'
            },
            Hawaii: {
                id: 'CountryDropdown.Hawaii',
                defaultMessage: 'Hawaii'
            },
            Honduras: {
                id: 'CountryDropdown.Honduras',
                defaultMessage: 'Honduras'
            },
            Hong_Kong: {
                id: 'CountryDropdown.Hong_Kong',
                defaultMessage: 'Hong Kong'
            },
            Hungary: {
                id: 'CountryDropdown.Hungary',
                defaultMessage: 'Hungary'
            },
            Iceland: {
                id: 'CountryDropdown.Iceland',
                defaultMessage: 'Iceland'
            },
            India: {
                id: 'CountryDropdown.India',
                defaultMessage: 'India'
            },
            Indonesia: {
                id: 'CountryDropdown.Indonesia',
                defaultMessage: 'Indonesia'
            },
            Iran: {
                id: 'CountryDropdown.Iran',
                defaultMessage: 'Iran'
            },
            Iraq: {
                id: 'CountryDropdown.Iraq',
                defaultMessage: 'Iraq'
            },
            Ireland: {
                id: 'CountryDropdown.Ireland',
                defaultMessage: 'Ireland'
            },
            Isle_of_Man: {
                id: 'CountryDropdown.Isle_of_Man',
                defaultMessage: 'Isle of Man'
            },
            Israel: {
                id: 'CountryDropdown.Israel',
                defaultMessage: 'Israel'
            },
            Italy: {
                id: 'CountryDropdown.Italy',
                defaultMessage: 'Italy'
            },
            Jamaica: {
                id: 'CountryDropdown.Jamaica',
                defaultMessage: 'Jamaica'
            },
            Japan: {
                id: 'CountryDropdown.Japan',
                defaultMessage: 'Japan'
            },
            Jordan: {
                id: 'CountryDropdown.Jordan',
                defaultMessage: 'Jordan'
            },
            Kazakhstan: {
                id: 'CountryDropdown.Kazakhstan',
                defaultMessage: 'Kazakhstan'
            },
            Kenya: {
                id: 'CountryDropdown.Kenya',
                defaultMessage: 'Kenya'
            },
            Kiribati: {
                id: 'CountryDropdown.Kiribati',
                defaultMessage: 'Kiribati'
            },
            Korea_North: {
                id: 'CountryDropdown.Korea_North',
                defaultMessage: 'Korea North'
            },
            Korea_South: {
                id: 'CountryDropdown.Korea_South',
                defaultMessage: 'Korea South'
            },
            Kuwait: {
                id: 'CountryDropdown.Kuwait',
                defaultMessage: 'Kuwait'
            },
            Kyrgyzstan: {
                id: 'CountryDropdown.Kyrgyzstan',
                defaultMessage: 'Kyrgyzstan'
            },
            Laos: {
                id: 'CountryDropdown.Laos',
                defaultMessage: 'Laos'
            },
            Latvia: {
                id: 'CountryDropdown.Latvia',
                defaultMessage: 'Latvia'
            },
            Lebanon: {
                id: 'CountryDropdown.Lebanon',
                defaultMessage: 'Lebanon'
            },
            Lesotho: {
                id: 'CountryDropdown.Lesotho',
                defaultMessage: 'Lesotho'
            },
            Liberia: {
                id: 'CountryDropdown.Liberia',
                defaultMessage: 'Liberia'
            },
            Libya: {
                id: 'CountryDropdown.Libya',
                defaultMessage: 'Libya'
            },
            Liechtenstein: {
                id: 'CountryDropdown.Liechtenstein',
                defaultMessage: 'Liechtenstein'
            },
            Lithuania: {
                id: 'CountryDropdown.Lithuania',
                defaultMessage: 'Lithuania'
            },
            Luxembourg: {
                id: 'CountryDropdown.Luxembourg',
                defaultMessage: 'Luxembourg'
            },
            Macau: {
                id: 'CountryDropdown.Macau',
                defaultMessage: 'Macau'
            },
            Macedonia: {
                id: 'CountryDropdown.Macedonia',
                defaultMessage: 'Macedonia'
            },
            Madagascar: {
                id: 'CountryDropdown.Madagascar',
                defaultMessage: 'Madagascar'
            },
            Malaysia: {
                id: 'CountryDropdown.Malaysia',
                defaultMessage: 'Malaysia'
            },
            Malawi: {
                id: 'CountryDropdown.Malawi',
                defaultMessage: 'Malawi'
            },
            Maldives: {
                id: 'CountryDropdown.Maldives',
                defaultMessage: 'Maldives'
            },
            Mali: {
                id: 'CountryDropdown.Mali',
                defaultMessage: 'Mali'
            },
            Malta: {
                id: 'CountryDropdown.Malta',
                defaultMessage: 'Malta'
            },
            Marshall_Islands: {
                id: 'CountryDropdown.Marshall_Islands',
                defaultMessage: 'Marshall Islands'
            },
            Martinique: {
                id: 'CountryDropdown.Martinique',
                defaultMessage: 'Martinique'
            },
            Mauritania: {
                id: 'CountryDropdown.Mauritania',
                defaultMessage: 'Mauritania'
            },
            Mauritius: {
                id: 'CountryDropdown.Mauritius',
                defaultMessage: 'Mauritius'
            },
            Mayotte: {
                id: 'CountryDropdown.Mayotte',
                defaultMessage: 'Mayotte'
            },
            Mexico: {
                id: 'CountryDropdown.Mexico',
                defaultMessage: 'Mexico'
            },
            Midway_Islands: {
                id: 'CountryDropdown.Midway_Islands',
                defaultMessage: 'Midway Islands'
            },
            Moldova: {
                id: 'CountryDropdown.Moldova',
                defaultMessage: 'Moldova'
            },
            Monaco: {
                id: 'CountryDropdown.Monaco',
                defaultMessage: 'Monaco'
            },
            Mongolia: {
                id: 'CountryDropdown.Mongolia',
                defaultMessage: 'Mongolia'
            },
            Montserrat: {
                id: 'CountryDropdown.Montserrat',
                defaultMessage: 'Montserrat'
            },
            Morocco: {
                id: 'CountryDropdown.Morocco',
                defaultMessage: 'Morocco'
            },
            Mozambique: {
                id: 'CountryDropdown.Mozambique',
                defaultMessage: 'Mozambique'
            },
            Myanmar: {
                id: 'CountryDropdown.Myanmar',
                defaultMessage: 'Myanmar'
            },
            Nambia: {
                id: 'CountryDropdown.Nambia',
                defaultMessage: 'Nambia'
            },
            Nauru: {
                id: 'CountryDropdown.Nauru',
                defaultMessage: 'Nauru'
            },
            Nepal: {
                id: 'CountryDropdown.Nepal',
                defaultMessage: 'Nepal'
            },
            Netherland_Antilles: {
                id: 'CountryDropdown.Netherland_Antilles',
                defaultMessage: 'Netherland Antilles'
            },
            Netherlands_Holland_Europe: {
                id: 'CountryDropdown.Netherlands_Holland_Europe',
                defaultMessage: 'Netherlands (Holland, Europe)'
            },
            Nevis: {
                id: 'CountryDropdown.Nevis',
                defaultMessage: 'Nevis'
            },
            New_Caledonia: {
                id: 'CountryDropdown.New_Caledonia',
                defaultMessage: 'New Caledonia'
            },
            New_Zealand: {
                id: 'CountryDropdown.New_Zealand',
                defaultMessage: 'New Zealand'
            },
            Nicaragua: {
                id: 'CountryDropdown.Nicaragua',
                defaultMessage: 'Nicaragua'
            },
            Niger: {
                id: 'CountryDropdown.Niger',
                defaultMessage: 'Niger'
            },
            Nigeria: {
                id: 'CountryDropdown.Nigeria',
                defaultMessage: 'Nigeria'
            },
            Niue: {
                id: 'CountryDropdown.Niue',
                defaultMessage: 'Niue'
            },
            Norfolk_Island: {
                id: 'CountryDropdown.Norfolk_Island',
                defaultMessage: 'Norfolk Island'
            },
            Norway: {
                id: 'CountryDropdown.Norway',
                defaultMessage: 'Norway'
            },
            Oman: {
                id: 'CountryDropdown.Oman',
                defaultMessage: 'Oman'
            },
            Pakistan: {
                id: 'CountryDropdown.Pakistan',
                defaultMessage: 'Pakistan'
            },
            Palau_Island: {
                id: 'CountryDropdown.Palau_Island',
                defaultMessage: 'Palau Island'
            },
            Palestine: {
                id: 'CountryDropdown.Palestine',
                defaultMessage: 'Palestine'
            },
            Panama: {
                id: 'CountryDropdown.Panama',
                defaultMessage: 'Panama'
            },
            Papua_New_Guinea: {
                id: 'CountryDropdown.Papua_New_Guinea',
                defaultMessage: 'Papua New Guinea'
            },
            Paraguay: {
                id: 'CountryDropdown.Paraguay',
                defaultMessage: 'Paraguay'
            },
            Peru: {
                id: 'CountryDropdown.Peru',
                defaultMessage: 'Peru'
            },
            Philippines: {
                id: 'CountryDropdown.Philippines',
                defaultMessage: 'Philippines'
            },
            Pitcairn_Island: {
                id: 'CountryDropdown.Pitcairn_Island',
                defaultMessage: 'Pitcairn Island'
            },
            Poland: {
                id: 'CountryDropdown.Poland',
                defaultMessage: 'Poland'
            },
            Portugal: {
                id: 'CountryDropdown.Portugal',
                defaultMessage: 'Portugal'
            },
            Puerto_Rico: {
                id: 'CountryDropdown.Puerto_Rico',
                defaultMessage: 'Puerto Rico'
            },
            Qatar: {
                id: 'CountryDropdown.Qatar',
                defaultMessage: 'Qatar'
            },
            Republic_of_Montenegro: {
                id: 'CountryDropdown.Republic_of_Montenegro',
                defaultMessage: 'Republic of Montenegro'
            },
            Republic_of_Serbia: {
                id: 'CountryDropdown.Republic_of_Serbia',
                defaultMessage: 'Republic of Serbia'
            },
            Reunion: {
                id: 'CountryDropdown.Reunion',
                defaultMessage: 'Reunion'
            },
            Romania: {
                id: 'CountryDropdown.Romania',
                defaultMessage: 'Romania'
            },
            Russia: {
                id: 'CountryDropdown.Russia',
                defaultMessage: 'Russia'
            },
            Rwanda: {
                id: 'CountryDropdown.Rwanda',
                defaultMessage: 'Rwanda'
            },
            St_Barthelemy: {
                id: 'CountryDropdown.St_Barthelemy',
                defaultMessage: 'St Barthelemy'
            },
            St_Eustatius: {
                id: 'CountryDropdown.St_Eustatius',
                defaultMessage: 'St Eustatius'
            },
            St_Helena: {
                id: 'CountryDropdown.St_Helena',
                defaultMessage: 'St Helena'
            },
            St_Kitts_Nevis: {
                id: 'CountryDropdown.St_Kitts_Nevis',
                defaultMessage: 'St Kitts-Nevis'
            },
            St_Lucia: {
                id: 'CountryDropdown.St_Lucia',
                defaultMessage: 'St Lucia'
            },
            St_Maarten: {
                id: 'CountryDropdown.St_Maarten',
                defaultMessage: 'St Maarten'
            },
            St_Pierre_and_Miquelon: {
                id: 'CountryDropdown.St_Pierre_and_Miquelon',
                defaultMessage: 'St Pierre & Miquelon'
            },
            St_Vincent_and_Grenadines: {
                id: 'CountryDropdown.St_Vincent_and_Grenadines',
                defaultMessage: 'St Vincent & Grenadines'
            },
            Saipan: {
                id: 'CountryDropdown.Saipan',
                defaultMessage: 'Saipan'
            },
            Samoa: {
                id: 'CountryDropdown.Samoa',
                defaultMessage: 'Samoa'
            },
            Samoa_American: {
                id: 'CountryDropdown.Samoa_American',
                defaultMessage: 'Samoa American'
            },
            San_Marino: {
                id: 'CountryDropdown.San_Marino',
                defaultMessage: 'San Marino'
            },
            Sao_Tome_and_Principe: {
                id: 'CountryDropdown.Sao_Tome_and_Principe',
                defaultMessage: 'Sao Tome & Principe'
            },
            Saudi_Arabia: {
                id: 'CountryDropdown.Saudi_Arabia',
                defaultMessage: 'Saudi Arabia'
            },
            Senegal: {
                id: 'CountryDropdown.Senegal',
                defaultMessage: 'Senegal'
            },
            Serbia: {
                id: 'CountryDropdown.Serbia',
                defaultMessage: 'Serbia'
            },
            Seychelles: {
                id: 'CountryDropdown.Seychelles',
                defaultMessage: 'Seychelles'
            },
            Sierra_Leone: {
                id: 'CountryDropdown.Sierra_Leone',
                defaultMessage: 'Sierra Leone'
            },
            Singapore: {
                id: 'CountryDropdown.Singapore',
                defaultMessage: 'Singapore'
            },
            Slovakia: {
                id: 'CountryDropdown.Slovakia',
                defaultMessage: 'Slovakia'
            },
            Slovenia: {
                id: 'CountryDropdown.Slovenia',
                defaultMessage: 'Slovenia'
            },
            Solomon_Islands: {
                id: 'CountryDropdown.Solomon_Islands',
                defaultMessage: 'Solomon Islands'
            },
            Somalia: {
                id: 'CountryDropdown.Somalia',
                defaultMessage: 'Somalia'
            },
            South_Africa: {
                id: 'CountryDropdown.South_Africa',
                defaultMessage: 'South Africa'
            },
            Spain: {
                id: 'CountryDropdown.Spain',
                defaultMessage: 'Spain'
            },
            Sri_Lanka: {
                id: 'CountryDropdown.Sri_Lanka',
                defaultMessage: 'Sri Lanka'
            },
            Sudan: {
                id: 'CountryDropdown.Sudan',
                defaultMessage: 'Sudan'
            },
            Suriname: {
                id: 'CountryDropdown.Suriname',
                defaultMessage: 'Suriname'
            },
            Swaziland: {
                id: 'CountryDropdown.Swaziland',
                defaultMessage: 'Swaziland'
            },
            Sweden: {
                id: 'CountryDropdown.Sweden',
                defaultMessage: 'Sweden'
            },
            Switzerland: {
                id: 'CountryDropdown.Switzerland',
                defaultMessage: 'Switzerland'
            },
            Syria: {
                id: 'CountryDropdown.Syria',
                defaultMessage: 'Syria'
            },
            Tahiti: {
                id: 'CountryDropdown.Tahiti',
                defaultMessage: 'Tahiti'
            },
            Taiwan: {
                id: 'CountryDropdown.Taiwan',
                defaultMessage: 'Taiwan'
            },
            Tajikistan: {
                id: 'CountryDropdown.Tajikistan',
                defaultMessage: 'Tajikistan'
            },
            Tanzania: {
                id: 'CountryDropdown.Tanzania',
                defaultMessage: 'Tanzania'
            },
            Thailand: {
                id: 'CountryDropdown.Thailand',
                defaultMessage: 'Thailand'
            },
            Togo: {
                id: 'CountryDropdown.Togo',
                defaultMessage: 'Togo'
            },
            Tokelau: {
                id: 'CountryDropdown.Tokelau',
                defaultMessage: 'Tokelau'
            },
            Tonga: {
                id: 'CountryDropdown.Tonga',
                defaultMessage: 'Tonga'
            },
            Trinidad_and_Tobago: {
                id: 'CountryDropdown.Trinidad_and_Tobago',
                defaultMessage: 'Trinidad & Tobago'
            },
            Tunisia: {
                id: 'CountryDropdown.Tunisia',
                defaultMessage: 'Tunisia'
            },
            Turkey: {
                id: 'CountryDropdown.Turkey',
                defaultMessage: 'Turkey'
            },
            Turkmenistan: {
                id: 'CountryDropdown.Turkmenistan',
                defaultMessage: 'Turkmenistan'
            },
            Turks_and_Caicos_Is: {
                id: 'CountryDropdown.Turks_and_Caicos_Is',
                defaultMessage: 'Turks & Caicos Is'
            },
            Tuvalu: {
                id: 'CountryDropdown.Tuvalu',
                defaultMessage: 'Tuvalu'
            },
            Uganda: {
                id: 'CountryDropdown.Uganda',
                defaultMessage: 'Uganda'
            },
            Ukraine: {
                id: 'CountryDropdown.Ukraine',
                defaultMessage: 'Ukraine'
            },
            United_Arab_Emirates: {
                id: 'CountryDropdown.United_Arab_Emirates',
                defaultMessage: 'United Arab Emirates'
            },
            United_Kingdom: {
                id: 'CountryDropdown.United_Kingdom',
                defaultMessage: 'United Kingdom'
            },
            United_States_of_America: {
                id: 'CountryDropdown.United_States_of_America',
                defaultMessage: 'United States of America'
            },
            Uruguay: {
                id: 'CountryDropdown.Uruguay',
                defaultMessage: 'Uruguay'
            },
            Uzbekistan: {
                id: 'CountryDropdown.Uzbekistan',
                defaultMessage: 'Uzbekistan'
            },
            Vanuatu: {
                id: 'CountryDropdown.Vanuatu',
                defaultMessage: 'Vanuatu'
            },
            Vatican_City_State: {
                id: 'CountryDropdown.Vatican_City_State',
                defaultMessage: 'Vatican City State'
            },
            Venezuela: {
                id: 'CountryDropdown.Venezuela',
                defaultMessage: 'Venezuela'
            },
            Vietnam: {
                id: 'CountryDropdown.Vietnam',
                defaultMessage: 'Vietnam'
            },
            Virgin_Islands_Brit: {
                id: 'CountryDropdown.Virgin_Islands_Brit',
                defaultMessage: 'Virgin Islands (Brit)'
            },
            Virgin_Islands_USA: {
                id: 'CountryDropdown.Virgin_Islands_USA',
                defaultMessage: 'Virgin Islands (USA)'
            },
            Wake_Island: {
                id: 'CountryDropdown.Wake_Island',
                defaultMessage: 'Wake Island'
            },
            Wallis_and_Futana_Is: {
                id: 'CountryDropdown.Wallis_and_Futana_Is',
                defaultMessage: 'Wallis & Futana Is'
            },
            Yemen: {
                id: 'CountryDropdown.Yemen',
                defaultMessage: 'Yemen'
            },
            Zaire: {
                id: 'CountryDropdown.Zaire',
                defaultMessage: 'Zaire'
            },
            Zambia: {
                id: 'CountryDropdown.Zambia',
                defaultMessage: 'Zambia'
            }, 
            Zimbabwe: {
                id: 'CountryDropdown.Zimbabwe',
                defaultMessage: 'Zimbabwe'
            }
        });
    }

    /**
     * Handles the value change event for this component.
     * Sets the internal value of the input.
     *
     * @returns {void}
     */
    handleInputChange(event) {
        this.setState({
            value: event.target.value
        });
    }

    render() {
        return (
            <SWAutoComplete
                label={<FormattedMessage
                    id='ChangePersonalData.country'
                    defaultMessage='Country' />
                }
                defaultValue={this.state.value}
                options={this.countriesToRender.map((country) => ({
                    value: country.key,
                    name: this.context.intl.formatMessage(this.messages[country.name])
                }))}
                onChange={this.handleInputChange}
                required={this.props.required}
                width={this.props.width}
            />
        );
    }
}

CountryDropdown.contextTypes = {
    executeAction: PropTypes.func.isRequired, 
    intl: PropTypes.object.isRequired
};

export default CountryDropdown;
