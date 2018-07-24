import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import {FormattedMessage, defineMessages} from 'react-intl';

/**
 * Properties:
 *   required: true|false
 *   country:  country short code, like US or GB
 */

class CountryDropdown extends React.Component {
    constructor(props){
        super(props);
        this.messages = this.getIntlMessages();
    }
    componentDidMount() {
        $(this.refs.countryDropdown).dropdown();
    }

    componentDidUpdate() {
        $(this.refs.countryDropdown).dropdown();
    }

    getSelected() {
        return this.refs.country.value;
    }

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

    render() {
        let classes = classNames({
            'ui': true,
            'fluid': true,
            'search': true,
            'selection': true,
            'dropdown': true,
            'required': this.props.required,
        });
        return (
            <div className={classes} ref="countryDropdown">
                {this.props.required ? <input type="hidden" name="country" ref="country" defaultValue={this.props.country} required/> : <input type="hidden" name="country" ref="country" defaultValue={this.props.country}/>}
                <i className="dropdown icon"/>
                <div className="default text" >{this.context.intl.formatMessage(this.messages.placeholder)}</div>
                <div className="menu" id="country">
                    <div className="item" data-value="AF"><FormattedMessage {...this.messages.Afghanistan} /></div>
                    <div className="item" data-value="AL"><FormattedMessage {...this.messages.Albania} /></div>
                    <div className="item" data-value="DZ"><FormattedMessage {...this.messages.Algeria} /></div>
                    <div className="item" data-value="AS"><FormattedMessage {...this.messages.American_Samoa} /></div>
                    <div className="item" data-value="AD"><FormattedMessage {...this.messages.Andorra} /></div>
                    <div className="item" data-value="AG"><FormattedMessage {...this.messages.Angola} /></div>
                    <div className="item" data-value="AI"><FormattedMessage {...this.messages.Anguilla} /></div>
                    <div className="item" data-value="AG"><FormattedMessage {...this.messages.Antigua_and_Barbuda} /></div>
                    <div className="item" data-value="AR"><FormattedMessage {...this.messages.Argentina} /></div>
                    <div className="item" data-value="AA"><FormattedMessage {...this.messages.Armenia} /></div>
                    <div className="item" data-value="AW"><FormattedMessage {...this.messages.Aruba} /></div>
                    <div className="item" data-value="AU"><FormattedMessage {...this.messages.Australia} /></div>
                    <div className="item" data-value="AT"><FormattedMessage {...this.messages.Austria} /></div>
                    <div className="item" data-value="AZ"><FormattedMessage {...this.messages.Azerbaijan} /></div>
                    <div className="item" data-value="BS"><FormattedMessage {...this.messages.Bahamas} /></div>
                    <div className="item" data-value="BH"><FormattedMessage {...this.messages.Bahrain} /></div>
                    <div className="item" data-value="BD"><FormattedMessage {...this.messages.Bangladesh} /></div>
                    <div className="item" data-value="BB"><FormattedMessage {...this.messages.Barbados} /></div>
                    <div className="item" data-value="BY"><FormattedMessage {...this.messages.Belarus} /></div>
                    <div className="item" data-value="BE"><FormattedMessage {...this.messages.Belgium} /></div>
                    <div className="item" data-value="BZ"><FormattedMessage {...this.messages.Belize} /></div>
                    <div className="item" data-value="BJ"><FormattedMessage {...this.messages.Benin} /></div>
                    <div className="item" data-value="BM"><FormattedMessage {...this.messages.Bermuda} /></div>
                    <div className="item" data-value="BT"><FormattedMessage {...this.messages.Bhutan} /></div>
                    <div className="item" data-value="BO"><FormattedMessage {...this.messages.Bolivia} /></div>
                    <div className="item" data-value="BL"><FormattedMessage {...this.messages.Bonaire} /></div>
                    <div className="item" data-value="BA"><FormattedMessage {...this.messages.Bosnia_and_Herzegovina} /></div>
                    <div className="item" data-value="BW"><FormattedMessage {...this.messages.Botswana} /></div>
                    <div className="item" data-value="BR"><FormattedMessage {...this.messages.Brazil} /></div>
                    <div className="item" data-value="BC"><FormattedMessage {...this.messages.British_Indian_Ocean_Ter} /></div>
                    <div className="item" data-value="BN"><FormattedMessage {...this.messages.Brunei} /></div>
                    <div className="item" data-value="BG"><FormattedMessage {...this.messages.Bulgaria} /></div>
                    <div className="item" data-value="BF"><FormattedMessage {...this.messages.Burkina_Faso} /></div>
                    <div className="item" data-value="BI"><FormattedMessage {...this.messages.Burundi} /></div>
                    <div className="item" data-value="KH"><FormattedMessage {...this.messages.Cambodia} /></div>
                    <div className="item" data-value="CM"><FormattedMessage {...this.messages.Cameroon} /></div>
                    <div className="item" data-value="CA"><FormattedMessage {...this.messages.Canada} /></div>
                    <div className="item" data-value="IC"><FormattedMessage {...this.messages.Canary_Islands} /></div>
                    <div className="item" data-value="CV"><FormattedMessage {...this.messages.Cape_Verde} /></div>
                    <div className="item" data-value="KY"><FormattedMessage {...this.messages.Cayman_Islands} /></div>
                    <div className="item" data-value="CF"><FormattedMessage {...this.messages.Central_African_Republic} />c</div>
                    <div className="item" data-value="TD"><FormattedMessage {...this.messages.Chad} /></div>
                    <div className="item" data-value="CD"><FormattedMessage {...this.messages.Channel_Islands} /></div>
                    <div className="item" data-value="CL"><FormattedMessage {...this.messages.Chile} /></div>
                    <div className="item" data-value="CN"><FormattedMessage {...this.messages.China} /></div>
                    <div className="item" data-value="CI"><FormattedMessage {...this.messages.Christmas_Island} /></div>
                    <div className="item" data-value="CS"><FormattedMessage {...this.messages.Cocos_Island} /></div>
                    <div className="item" data-value="CO"><FormattedMessage {...this.messages.Colombia} /></div>
                    <div className="item" data-value="CC"><FormattedMessage {...this.messages.Comoros} /></div>
                    <div className="item" data-value="CG"><FormattedMessage {...this.messages.Congo} /></div>
                    <div className="item" data-value="CK"><FormattedMessage {...this.messages.Cook_Islands} /></div>
                    <div className="item" data-value="CR"><FormattedMessage {...this.messages.Costa_Rica} /></div>
                    <div className="item" data-value="HR"><FormattedMessage {...this.messages.Croatia} /></div>
                    <div className="item" data-value="CU"><FormattedMessage {...this.messages.Cuba} /></div>
                    <div className="item" data-value="CB"><FormattedMessage {...this.messages.Curacao} /></div>
                    <div className="item" data-value="CY"><FormattedMessage {...this.messages.Cyprus} /></div>
                    <div className="item" data-value="CZ"><FormattedMessage {...this.messages.Czech_Republic} /></div>
                    <div className="item" data-value="DK"><FormattedMessage {...this.messages.Denmark} /></div>
                    <div className="item" data-value="DJ"><FormattedMessage {...this.messages.Djibouti} /></div>
                    <div className="item" data-value="DM"><FormattedMessage {...this.messages.Dominica} /></div>
                    <div className="item" data-value="DO"><FormattedMessage {...this.messages.Dominican_Republic} /></div>
                    <div className="item" data-value="TM"><FormattedMessage {...this.messages.East_Timor} /></div>
                    <div className="item" data-value="EC"><FormattedMessage {...this.messages.Ecuador} /></div>
                    <div className="item" data-value="EG"><FormattedMessage {...this.messages.Egypt} /></div>
                    <div className="item" data-value="SV"><FormattedMessage {...this.messages.El_Salvador} /></div>
                    <div className="item" data-value="GQ"><FormattedMessage {...this.messages.Equatorial_Guinea} /></div>
                    <div className="item" data-value="ER"><FormattedMessage {...this.messages.Eritrea} /></div>
                    <div className="item" data-value="EE"><FormattedMessage {...this.messages.Estonia} /></div>
                    <div className="item" data-value="ET"><FormattedMessage {...this.messages.Ethiopia} /></div>
                    <div className="item" data-value="FA"><FormattedMessage {...this.messages.Falkland_Islands} /></div>
                    <div className="item" data-value="FO"><FormattedMessage {...this.messages.Faroe_Islands} /></div>
                    <div className="item" data-value="FJ"><FormattedMessage {...this.messages.Fiji} /></div>
                    <div className="item" data-value="FI"><FormattedMessage {...this.messages.Finland} /></div>
                    <div className="item" data-value="FR"><FormattedMessage {...this.messages.France} /></div>
                    <div className="item" data-value="GF"><FormattedMessage {...this.messages.French_Guiana} /></div>
                    <div className="item" data-value="PF"><FormattedMessage {...this.messages.French_Polynesia} /></div>
                    <div className="item" data-value="FS"><FormattedMessage {...this.messages.French_Southern_Ter} /></div>
                    <div className="item" data-value="GA"><FormattedMessage {...this.messages.Gabon} /></div>
                    <div className="item" data-value="GM"><FormattedMessage {...this.messages.Gambia} /></div>
                    <div className="item" data-value="GE"><FormattedMessage {...this.messages.Georgia} /></div>
                    <div className="item" data-value="DE"><FormattedMessage {...this.messages.Germany} /></div>
                    <div className="item" data-value="GH"><FormattedMessage {...this.messages.Ghana} /></div>
                    <div className="item" data-value="GI"><FormattedMessage {...this.messages.Gibraltar} /></div>
                    <div className="item" data-value="GB"><FormattedMessage {...this.messages.Great_Britain} /></div>
                    <div className="item" data-value="GR"><FormattedMessage {...this.messages.Greece} /></div>
                    <div className="item" data-value="GL"><FormattedMessage {...this.messages.Greenland} /></div>
                    <div className="item" data-value="GD"><FormattedMessage {...this.messages.Grenada} /></div>
                    <div className="item" data-value="GP"><FormattedMessage {...this.messages.Guadeloupe} /></div>
                    <div className="item" data-value="GU"><FormattedMessage {...this.messages.Guam} /></div>
                    <div className="item" data-value="GT"><FormattedMessage {...this.messages.Guatemala} /></div>
                    <div className="item" data-value="GN"><FormattedMessage {...this.messages.Guinea} /></div>
                    <div className="item" data-value="GY"><FormattedMessage {...this.messages.Guyana} /></div>
                    <div className="item" data-value="HT"><FormattedMessage {...this.messages.Haiti} /></div>
                    <div className="item" data-value="HW"><FormattedMessage {...this.messages.Hawaii} /></div>
                    <div className="item" data-value="HN"><FormattedMessage {...this.messages.Honduras} /></div>
                    <div className="item" data-value="HK"><FormattedMessage {...this.messages.Hong_Kong} /></div>
                    <div className="item" data-value="HU"><FormattedMessage {...this.messages.Hungary} /></div>
                    <div className="item" data-value="IS"><FormattedMessage {...this.messages.Iceland} /></div>
                    <div className="item" data-value="IN"><FormattedMessage {...this.messages.India} /></div>
                    <div className="item" data-value="ID"><FormattedMessage {...this.messages.Indonesia} /></div>
                    <div className="item" data-value="IA"><FormattedMessage {...this.messages.Iran} /></div>
                    <div className="item" data-value="IQ"><FormattedMessage {...this.messages.Iraq} /></div>
                    <div className="item" data-value="IR"><FormattedMessage {...this.messages.Ireland} /></div>
                    <div className="item" data-value="IM"><FormattedMessage {...this.messages.Isle_of_Man} /></div>
                    <div className="item" data-value="IL"><FormattedMessage {...this.messages.Israel} /></div>
                    <div className="item" data-value="IT"><FormattedMessage {...this.messages.Italy} /></div>
                    <div className="item" data-value="JM"><FormattedMessage {...this.messages.Jamaica} /></div>
                    <div className="item" data-value="JP"><FormattedMessage {...this.messages.Japan} /></div>
                    <div className="item" data-value="JO"><FormattedMessage {...this.messages.Jordan} /></div>
                    <div className="item" data-value="KZ"><FormattedMessage {...this.messages.Kazakhstan} /></div>
                    <div className="item" data-value="KE"><FormattedMessage {...this.messages.Kenya} /></div>
                    <div className="item" data-value="KI"><FormattedMessage {...this.messages.Kiribati} /></div>
                    <div className="item" data-value="NK"><FormattedMessage {...this.messages.Korea_North} /></div>
                    <div className="item" data-value="KS"><FormattedMessage {...this.messages.Korea_South} /></div>
                    <div className="item" data-value="KW"><FormattedMessage {...this.messages.Kuwait} /></div>
                    <div className="item" data-value="KG"><FormattedMessage {...this.messages.Kyrgyzstan} /></div>
                    <div className="item" data-value="LA"><FormattedMessage {...this.messages.Laos} /></div>
                    <div className="item" data-value="LV"><FormattedMessage {...this.messages.Latvia} /></div>
                    <div className="item" data-value="LB"><FormattedMessage {...this.messages.Lebanon} /></div>
                    <div className="item" data-value="LS"><FormattedMessage {...this.messages.Lesotho} /></div>
                    <div className="item" data-value="LR"><FormattedMessage {...this.messages.Liberia} /></div>
                    <div className="item" data-value="LY"><FormattedMessage {...this.messages.Libya} /></div>
                    <div className="item" data-value="LI"><FormattedMessage {...this.messages.Liechtenstein} /></div>
                    <div className="item" data-value="LT"><FormattedMessage {...this.messages.Lithuania} /></div>
                    <div className="item" data-value="LU"><FormattedMessage {...this.messages.Luxembourg} /></div>
                    <div className="item" data-value="MO"><FormattedMessage {...this.messages.Macau} /></div>
                    <div className="item" data-value="MK"><FormattedMessage {...this.messages.Macedonia} /></div>
                    <div className="item" data-value="MG"><FormattedMessage {...this.messages.Madagascar} /></div>
                    <div className="item" data-value="MY"><FormattedMessage {...this.messages.Malaysia} /></div>
                    <div className="item" data-value="MW"><FormattedMessage {...this.messages.Malawi} /></div>
                    <div className="item" data-value="MV"><FormattedMessage {...this.messages.Maldives} /></div>
                    <div className="item" data-value="ML"><FormattedMessage {...this.messages.Mali} /></div>
                    <div className="item" data-value="MT"><FormattedMessage {...this.messages.Malta} /></div>
                    <div className="item" data-value="MH"><FormattedMessage {...this.messages.Marshall_Islands} /></div>
                    <div className="item" data-value="MQ"><FormattedMessage {...this.messages.Martinique} /></div>
                    <div className="item" data-value="MR"><FormattedMessage {...this.messages.Mauritania} /></div>
                    <div className="item" data-value="MU"><FormattedMessage {...this.messages.Mauritius} /></div>
                    <div className="item" data-value="ME"><FormattedMessage {...this.messages.Mayotte} /></div>
                    <div className="item" data-value="MX"><FormattedMessage {...this.messages.Mexico} /></div>
                    <div className="item" data-value="MI"><FormattedMessage {...this.messages.Midway_Islands} /></div>
                    <div className="item" data-value="MD"><FormattedMessage {...this.messages.Moldova} /></div>
                    <div className="item" data-value="MC"><FormattedMessage {...this.messages.Monaco} /></div>
                    <div className="item" data-value="MN"><FormattedMessage {...this.messages.Mongolia} /></div>
                    <div className="item" data-value="MS"><FormattedMessage {...this.messages.Montserrat} /></div>
                    <div className="item" data-value="MA"><FormattedMessage {...this.messages.Morocco} /></div>
                    <div className="item" data-value="MZ"><FormattedMessage {...this.messages.Mozambique} /></div>
                    <div className="item" data-value="MM"><FormattedMessage {...this.messages.Myanmar} /></div>
                    <div className="item" data-value="NA"><FormattedMessage {...this.messages.Nambia} /></div>
                    <div className="item" data-value="NU"><FormattedMessage {...this.messages.Nauru} /></div>
                    <div className="item" data-value="NP"><FormattedMessage {...this.messages.Nepal} /></div>
                    <div className="item" data-value="AN"><FormattedMessage {...this.messages.Netherland_Antilles} /></div>
                    <div className="item" data-value="NL"><FormattedMessage {...this.messages.Netherlands_Holland_Europe} /></div>
                    <div className="item" data-value="NV"><FormattedMessage {...this.messages.Nevis} /></div>
                    <div className="item" data-value="NC"><FormattedMessage {...this.messages.New_Caledonia} /></div>
                    <div className="item" data-value="NZ"><FormattedMessage {...this.messages.New_Zealand} /></div>
                    <div className="item" data-value="NI"><FormattedMessage {...this.messages.Nicaragua} /></div>
                    <div className="item" data-value="NE"><FormattedMessage {...this.messages.Niger} /></div>
                    <div className="item" data-value="NG"><FormattedMessage {...this.messages.Nigeria} /></div>
                    <div className="item" data-value="NW"><FormattedMessage {...this.messages.Niue} /></div>
                    <div className="item" data-value="NF"><FormattedMessage {...this.messages.Norfolk_Island} /></div>
                    <div className="item" data-value="NO"><FormattedMessage {...this.messages.Norway} /></div>
                    <div className="item" data-value="OM"><FormattedMessage {...this.messages.Oman} /></div>
                    <div className="item" data-value="PK"><FormattedMessage {...this.messages.Pakistan} /></div>
                    <div className="item" data-value="PW"><FormattedMessage {...this.messages.Palau_Island} /></div>
                    <div className="item" data-value="PS"><FormattedMessage {...this.messages.Palestine} /></div>
                    <div className="item" data-value="PA"><FormattedMessage {...this.messages.Panama} /></div>
                    <div className="item" data-value="PG"><FormattedMessage {...this.messages.Papua_New_Guinea} /></div>
                    <div className="item" data-value="PY"><FormattedMessage {...this.messages.Paraguay} /></div>
                    <div className="item" data-value="PE"><FormattedMessage {...this.messages.Peru} /></div>
                    <div className="item" data-value="PH"><FormattedMessage {...this.messages.Philippines} /></div>
                    <div className="item" data-value="PO"><FormattedMessage {...this.messages.Pitcairn_Island} /></div>
                    <div className="item" data-value="PL"><FormattedMessage {...this.messages.Poland} /></div>
                    <div className="item" data-value="PT"><FormattedMessage {...this.messages.Portugal} /></div>
                    <div className="item" data-value="PR"><FormattedMessage {...this.messages.Puerto_Rico} /></div>
                    <div className="item" data-value="QA"><FormattedMessage {...this.messages.Qatar} /></div>
                    <div className="item" data-value="ME"><FormattedMessage {...this.messages.Republic_of_Montenegro} /></div>
                    <div className="item" data-value="RS"><FormattedMessage {...this.messages.Republic_of_Serbia} /></div>
                    <div className="item" data-value="RE"><FormattedMessage {...this.messages.Reunion} /></div>
                    <div className="item" data-value="RO"><FormattedMessage {...this.messages.Romania} /></div>
                    <div className="item" data-value="RU"><FormattedMessage {...this.messages.Russia} /></div>
                    <div className="item" data-value="RW"><FormattedMessage {...this.messages.Rwanda} /></div>
                    <div className="item" data-value="NT"><FormattedMessage {...this.messages.St_Barthelemy} /></div>
                    <div className="item" data-value="EU"><FormattedMessage {...this.messages.St_Eustatius} /></div>
                    <div className="item" data-value="HE"><FormattedMessage {...this.messages.St_Helena} /></div>
                    <div className="item" data-value="KN"><FormattedMessage {...this.messages.St_Kitts_Nevis} /></div>
                    <div className="item" data-value="LC"><FormattedMessage {...this.messages.St_Lucia} /></div>
                    <div className="item" data-value="MB"><FormattedMessage {...this.messages.St_Maarten} /></div>
                    <div className="item" data-value="PM"><FormattedMessage {...this.messages.St_Pierre_and_Miquelon} /></div>
                    <div className="item" data-value="VC"><FormattedMessage {...this.messages.St_Vincent_and_Grenadines} /></div>
                    <div className="item" data-value="SP"><FormattedMessage {...this.messages.Saipan} /></div>
                    <div className="item" data-value="SO"><FormattedMessage {...this.messages.Samoa} /></div>
                    <div className="item" data-value="AS"><FormattedMessage {...this.messages.Samoa_American} /></div>
                    <div className="item" data-value="SM"><FormattedMessage {...this.messages.San_Marino} /></div>
                    <div className="item" data-value="ST"><FormattedMessage {...this.messages.Sao_Tome_and_Principe} /></div>
                    <div className="item" data-value="SA"><FormattedMessage {...this.messages.Saudi_Arabia} /></div>
                    <div className="item" data-value="SN"><FormattedMessage {...this.messages.Senegal} /></div>
                    <div className="item" data-value="RS"><FormattedMessage {...this.messages.Serbia} /></div>
                    <div className="item" data-value="SC"><FormattedMessage {...this.messages.Seychelles} /></div>
                    <div className="item" data-value="SL"><FormattedMessage {...this.messages.Sierra_Leone} /></div>
                    <div className="item" data-value="SG"><FormattedMessage {...this.messages.Singapore} /></div>
                    <div className="item" data-value="SK"><FormattedMessage {...this.messages.Slovakia} /></div>
                    <div className="item" data-value="SI"><FormattedMessage {...this.messages.Slovenia} /></div>
                    <div className="item" data-value="SB"><FormattedMessage {...this.messages.Solomon_Islands} /></div>
                    <div className="item" data-value="OI"><FormattedMessage {...this.messages.Somalia} /></div>
                    <div className="item" data-value="ZA"><FormattedMessage {...this.messages.South_Africa} /></div>
                    <div className="item" data-value="ES"><FormattedMessage {...this.messages.Spain} /></div>
                    <div className="item" data-value="LK"><FormattedMessage {...this.messages.Sri_Lanka} /></div>
                    <div className="item" data-value="SD"><FormattedMessage {...this.messages.Sudan} /></div>
                    <div className="item" data-value="SR"><FormattedMessage {...this.messages.Suriname} /></div>
                    <div className="item" data-value="SZ"><FormattedMessage {...this.messages.Swaziland} /></div>
                    <div className="item" data-value="SE"><FormattedMessage {...this.messages.Sweden} /></div>
                    <div className="item" data-value="CH"><FormattedMessage {...this.messages.Switzerland} /></div>
                    <div className="item" data-value="SY"><FormattedMessage {...this.messages.Syria} /></div>
                    <div className="item" data-value="TA"><FormattedMessage {...this.messages.Tahiti} /></div>
                    <div className="item" data-value="TW"><FormattedMessage {...this.messages.Taiwan} /></div>
                    <div className="item" data-value="TJ"><FormattedMessage {...this.messages.Tajikistan} /></div>
                    <div className="item" data-value="TZ"><FormattedMessage {...this.messages.Tanzania} /></div>
                    <div className="item" data-value="TH"><FormattedMessage {...this.messages.Thailand} /></div>
                    <div className="item" data-value="TG"><FormattedMessage {...this.messages.Togo} /></div>
                    <div className="item" data-value="TK"><FormattedMessage {...this.messages.Tokelau} /></div>
                    <div className="item" data-value="TO"><FormattedMessage {...this.messages.Tonga} /></div>
                    <div className="item" data-value="TT"><FormattedMessage {...this.messages.Trinidad_and_Tobago} /></div>
                    <div className="item" data-value="TN"><FormattedMessage {...this.messages.Tunisia} /></div>
                    <div className="item" data-value="TR"><FormattedMessage {...this.messages.Turkey} /></div>
                    <div className="item" data-value="TU"><FormattedMessage {...this.messages.Turkmenistan} /></div>
                    <div className="item" data-value="TC"><FormattedMessage {...this.messages.Turks_and_Caicos_Is} /></div>
                    <div className="item" data-value="TV"><FormattedMessage {...this.messages.Tuvalu} /></div>
                    <div className="item" data-value="UG"><FormattedMessage {...this.messages.Uganda} /></div>
                    <div className="item" data-value="UA"><FormattedMessage {...this.messages.Ukraine} /></div>
                    <div className="item" data-value="AE"><FormattedMessage {...this.messages.United_Arab_Emirates} /></div>
                    <div className="item" data-value="GB"><FormattedMessage {...this.messages.United_Kingdom} /></div>
                    <div className="item" data-value="US"><FormattedMessage {...this.messages.United_States_of_America} /></div>
                    <div className="item" data-value="UY"><FormattedMessage {...this.messages.Uruguay} /></div>
                    <div className="item" data-value="UZ"><FormattedMessage {...this.messages.Uzbekistan} /></div>
                    <div className="item" data-value="VU"><FormattedMessage {...this.messages.Vanuatu} /></div>
                    <div className="item" data-value="VS"><FormattedMessage {...this.messages.Vatican_City_State} /></div>
                    <div className="item" data-value="VE"><FormattedMessage {...this.messages.Venezuela} /></div>
                    <div className="item" data-value="VN"><FormattedMessage {...this.messages.Vietnam} /></div>
                    <div className="item" data-value="VB"><FormattedMessage {...this.messages.Virgin_Islands_Brit} /></div>
                    <div className="item" data-value="VA"><FormattedMessage {...this.messages.Virgin_Islands_USA} /></div>
                    <div className="item" data-value="WK"><FormattedMessage {...this.messages.Wake_Island} /></div>
                    <div className="item" data-value="WF"><FormattedMessage {...this.messages.Wallis_and_Futana_Is} /></div>
                    <div className="item" data-value="YE"><FormattedMessage {...this.messages.Yemen} /></div>
                    <div className="item" data-value="ZR"><FormattedMessage {...this.messages.Zaire} /></div>
                    <div className="item" data-value="ZM"><FormattedMessage {...this.messages.Zambia} /></div>
                    <div className="item" data-value="ZW"><FormattedMessage {...this.messages.Zimbabwe} /></div>
                </div>
            </div>
        );
    }
}

CountryDropdown.contextTypes = {
    executeAction: PropTypes.func.isRequired, 
    intl: PropTypes.object.isRequired
};

export default CountryDropdown;
