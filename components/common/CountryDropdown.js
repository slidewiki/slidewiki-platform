import React from 'react';
import classNames from 'classnames';

/**
 * Properties:
 *   required: true|false
 *   country:  country short code, like US or GB
 */

class CountryDropdown extends React.Component {
    componentDidMount() {}

    componentDidUpdate() {}

    getSelected() {
        return this.refs.country.value;
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
            <div className={classes} >
                {this.props.required ? <input type="hidden" name="country" ref="country" defaultValue={this.props.country} required/> : <input type="hidden" name="country" ref="country" defaultValue={this.props.country}/>}
                <i className="dropdown icon"/>
                <div className="default text">Select your country</div>
                <div className="menu">
                    <div className="item" data-value="AF">Afghanistan</div>
                    <div className="item" data-value="AL">Albania</div>
                    <div className="item" data-value="DZ">Algeria</div>
                    <div className="item" data-value="AS">American Samoa</div>
                    <div className="item" data-value="AD">Andorra</div>
                    <div className="item" data-value="AG">Angola</div>
                    <div className="item" data-value="AI">Anguilla</div>
                    <div className="item" data-value="AG">Antigua &amp; Barbuda</div>
                    <div className="item" data-value="AR">Argentina</div>
                    <div className="item" data-value="AA">Armenia</div>
                    <div className="item" data-value="AW">Aruba</div>
                    <div className="item" data-value="AU">Australia</div>
                    <div className="item" data-value="AT">Austria</div>
                    <div className="item" data-value="AZ">Azerbaijan</div>
                    <div className="item" data-value="BS">Bahamas</div>
                    <div className="item" data-value="BH">Bahrain</div>
                    <div className="item" data-value="BD">Bangladesh</div>
                    <div className="item" data-value="BB">Barbados</div>
                    <div className="item" data-value="BY">Belarus</div>
                    <div className="item" data-value="BE">Belgium</div>
                    <div className="item" data-value="BZ">Belize</div>
                    <div className="item" data-value="BJ">Benin</div>
                    <div className="item" data-value="BM">Bermuda</div>
                    <div className="item" data-value="BT">Bhutan</div>
                    <div className="item" data-value="BO">Bolivia</div>
                    <div className="item" data-value="BL">Bonaire</div>
                    <div className="item" data-value="BA">Bosnia &amp; Herzegovina</div>
                    <div className="item" data-value="BW">Botswana</div>
                    <div className="item" data-value="BR">Brazil</div>
                    <div className="item" data-value="BC">British Indian Ocean Ter</div>
                    <div className="item" data-value="BN">Brunei</div>
                    <div className="item" data-value="BG">Bulgaria</div>
                    <div className="item" data-value="BF">Burkina Faso</div>
                    <div className="item" data-value="BI">Burundi</div>
                    <div className="item" data-value="KH">Cambodia</div>
                    <div className="item" data-value="CM">Cameroon</div>
                    <div className="item" data-value="CA">Canada</div>
                    <div className="item" data-value="IC">Canary Islands</div>
                    <div className="item" data-value="CV">Cape Verde</div>
                    <div className="item" data-value="KY">Cayman Islands</div>
                    <div className="item" data-value="CF">Central African Republic</div>
                    <div className="item" data-value="TD">Chad</div>
                    <div className="item" data-value="CD">Channel Islands</div>
                    <div className="item" data-value="CL">Chile</div>
                    <div className="item" data-value="CN">China</div>
                    <div className="item" data-value="CI">Christmas Island</div>
                    <div className="item" data-value="CS">Cocos Island</div>
                    <div className="item" data-value="CO">Colombia</div>
                    <div className="item" data-value="CC">Comoros</div>
                    <div className="item" data-value="CG">Congo</div>
                    <div className="item" data-value="CK">Cook Islands</div>
                    <div className="item" data-value="CR">Costa Rica</div>
                    <div className="item" data-value="HR">Croatia</div>
                    <div className="item" data-value="CU">Cuba</div>
                    <div className="item" data-value="CB">Curacao</div>
                    <div className="item" data-value="CY">Cyprus</div>
                    <div className="item" data-value="CZ">Czech Republic</div>
                    <div className="item" data-value="DK">Denmark</div>
                    <div className="item" data-value="DJ">Djibouti</div>
                    <div className="item" data-value="DM">Dominica</div>
                    <div className="item" data-value="DO">Dominican Republic</div>
                    <div className="item" data-value="TM">East Timor</div>
                    <div className="item" data-value="EC">Ecuador</div>
                    <div className="item" data-value="EG">Egypt</div>
                    <div className="item" data-value="SV">El Salvador</div>
                    <div className="item" data-value="GQ">Equatorial Guinea</div>
                    <div className="item" data-value="ER">Eritrea</div>
                    <div className="item" data-value="EE">Estonia</div>
                    <div className="item" data-value="ET">Ethiopia</div>
                    <div className="item" data-value="FA">Falkland Islands</div>
                    <div className="item" data-value="FO">Faroe Islands</div>
                    <div className="item" data-value="FJ">Fiji</div>
                    <div className="item" data-value="FI">Finland</div>
                    <div className="item" data-value="FR">France</div>
                    <div className="item" data-value="GF">French Guiana</div>
                    <div className="item" data-value="PF">French Polynesia</div>
                    <div className="item" data-value="FS">French Southern Ter</div>
                    <div className="item" data-value="GA">Gabon</div>
                    <div className="item" data-value="GM">Gambia</div>
                    <div className="item" data-value="GE">Georgia</div>
                    <div className="item" data-value="DE">Germany</div>
                    <div className="item" data-value="GH">Ghana</div>
                    <div className="item" data-value="GI">Gibraltar</div>
                    <div className="item" data-value="GB">Great Britain</div>
                    <div className="item" data-value="GR">Greece</div>
                    <div className="item" data-value="GL">Greenland</div>
                    <div className="item" data-value="GD">Grenada</div>
                    <div className="item" data-value="GP">Guadeloupe</div>
                    <div className="item" data-value="GU">Guam</div>
                    <div className="item" data-value="GT">Guatemala</div>
                    <div className="item" data-value="GN">Guinea</div>
                    <div className="item" data-value="GY">Guyana</div>
                    <div className="item" data-value="HT">Haiti</div>
                    <div className="item" data-value="HW">Hawaii</div>
                    <div className="item" data-value="HN">Honduras</div>
                    <div className="item" data-value="HK">Hong Kong</div>
                    <div className="item" data-value="HU">Hungary</div>
                    <div className="item" data-value="IS">Iceland</div>
                    <div className="item" data-value="IN">India</div>
                    <div className="item" data-value="ID">Indonesia</div>
                    <div className="item" data-value="IA">Iran</div>
                    <div className="item" data-value="IQ">Iraq</div>
                    <div className="item" data-value="IR">Ireland</div>
                    <div className="item" data-value="IM">Isle of Man</div>
                    <div className="item" data-value="IL">Israel</div>
                    <div className="item" data-value="IT">Italy</div>
                    <div className="item" data-value="JM">Jamaica</div>
                    <div className="item" data-value="JP">Japan</div>
                    <div className="item" data-value="JO">Jordan</div>
                    <div className="item" data-value="KZ">Kazakhstan</div>
                    <div className="item" data-value="KE">Kenya</div>
                    <div className="item" data-value="KI">Kiribati</div>
                    <div className="item" data-value="NK">Korea North</div>
                    <div className="item" data-value="KS">Korea South</div>
                    <div className="item" data-value="KW">Kuwait</div>
                    <div className="item" data-value="KG">Kyrgyzstan</div>
                    <div className="item" data-value="LA">Laos</div>
                    <div className="item" data-value="LV">Latvia</div>
                    <div className="item" data-value="LB">Lebanon</div>
                    <div className="item" data-value="LS">Lesotho</div>
                    <div className="item" data-value="LR">Liberia</div>
                    <div className="item" data-value="LY">Libya</div>
                    <div className="item" data-value="LI">Liechtenstein</div>
                    <div className="item" data-value="LT">Lithuania</div>
                    <div className="item" data-value="LU">Luxembourg</div>
                    <div className="item" data-value="MO">Macau</div>
                    <div className="item" data-value="MK">Macedonia</div>
                    <div className="item" data-value="MG">Madagascar</div>
                    <div className="item" data-value="MY">Malaysia</div>
                    <div className="item" data-value="MW">Malawi</div>
                    <div className="item" data-value="MV">Maldives</div>
                    <div className="item" data-value="ML">Mali</div>
                    <div className="item" data-value="MT">Malta</div>
                    <div className="item" data-value="MH">Marshall Islands</div>
                    <div className="item" data-value="MQ">Martinique</div>
                    <div className="item" data-value="MR">Mauritania</div>
                    <div className="item" data-value="MU">Mauritius</div>
                    <div className="item" data-value="ME">Mayotte</div>
                    <div className="item" data-value="MX">Mexico</div>
                    <div className="item" data-value="MI">Midway Islands</div>
                    <div className="item" data-value="MD">Moldova</div>
                    <div className="item" data-value="MC">Monaco</div>
                    <div className="item" data-value="MN">Mongolia</div>
                    <div className="item" data-value="MS">Montserrat</div>
                    <div className="item" data-value="MA">Morocco</div>
                    <div className="item" data-value="MZ">Mozambique</div>
                    <div className="item" data-value="MM">Myanmar</div>
                    <div className="item" data-value="NA">Nambia</div>
                    <div className="item" data-value="NU">Nauru</div>
                    <div className="item" data-value="NP">Nepal</div>
                    <div className="item" data-value="AN">Netherland Antilles</div>
                    <div className="item" data-value="NL">Netherlands (Holland, Europe)</div>
                    <div className="item" data-value="NV">Nevis</div>
                    <div className="item" data-value="NC">New Caledonia</div>
                    <div className="item" data-value="NZ">New Zealand</div>
                    <div className="item" data-value="NI">Nicaragua</div>
                    <div className="item" data-value="NE">Niger</div>
                    <div className="item" data-value="NG">Nigeria</div>
                    <div className="item" data-value="NW">Niue</div>
                    <div className="item" data-value="NF">Norfolk Island</div>
                    <div className="item" data-value="NO">Norway</div>
                    <div className="item" data-value="OM">Oman</div>
                    <div className="item" data-value="PK">Pakistan</div>
                    <div className="item" data-value="PW">Palau Island</div>
                    <div className="item" data-value="PS">Palestine</div>
                    <div className="item" data-value="PA">Panama</div>
                    <div className="item" data-value="PG">Papua New Guinea</div>
                    <div className="item" data-value="PY">Paraguay</div>
                    <div className="item" data-value="PE">Peru</div>
                    <div className="item" data-value="PH">Philippines</div>
                    <div className="item" data-value="PO">Pitcairn Island</div>
                    <div className="item" data-value="PL">Poland</div>
                    <div className="item" data-value="PT">Portugal</div>
                    <div className="item" data-value="PR">Puerto Rico</div>
                    <div className="item" data-value="QA">Qatar</div>
                    <div className="item" data-value="ME">Republic of Montenegro</div>
                    <div className="item" data-value="RS">Republic of Serbia</div>
                    <div className="item" data-value="RE">Reunion</div>
                    <div className="item" data-value="RO">Romania</div>
                    <div className="item" data-value="RU">Russia</div>
                    <div className="item" data-value="RW">Rwanda</div>
                    <div className="item" data-value="NT">St Barthelemy</div>
                    <div className="item" data-value="EU">St Eustatius</div>
                    <div className="item" data-value="HE">St Helena</div>
                    <div className="item" data-value="KN">St Kitts-Nevis</div>
                    <div className="item" data-value="LC">St Lucia</div>
                    <div className="item" data-value="MB">St Maarten</div>
                    <div className="item" data-value="PM">St Pierre &amp; Miquelon</div>
                    <div className="item" data-value="VC">St Vincent &amp; Grenadines</div>
                    <div className="item" data-value="SP">Saipan</div>
                    <div className="item" data-value="SO">Samoa</div>
                    <div className="item" data-value="AS">Samoa American</div>
                    <div className="item" data-value="SM">San Marino</div>
                    <div className="item" data-value="ST">Sao Tome &amp; Principe</div>
                    <div className="item" data-value="SA">Saudi Arabia</div>
                    <div className="item" data-value="SN">Senegal</div>
                    <div className="item" data-value="RS">Serbia</div>
                    <div className="item" data-value="SC">Seychelles</div>
                    <div className="item" data-value="SL">Sierra Leone</div>
                    <div className="item" data-value="SG">Singapore</div>
                    <div className="item" data-value="SK">Slovakia</div>
                    <div className="item" data-value="SI">Slovenia</div>
                    <div className="item" data-value="SB">Solomon Islands</div>
                    <div className="item" data-value="OI">Somalia</div>
                    <div className="item" data-value="ZA">South Africa</div>
                    <div className="item" data-value="ES">Spain</div>
                    <div className="item" data-value="LK">Sri Lanka</div>
                    <div className="item" data-value="SD">Sudan</div>
                    <div className="item" data-value="SR">Suriname</div>
                    <div className="item" data-value="SZ">Swaziland</div>
                    <div className="item" data-value="SE">Sweden</div>
                    <div className="item" data-value="CH">Switzerland</div>
                    <div className="item" data-value="SY">Syria</div>
                    <div className="item" data-value="TA">Tahiti</div>
                    <div className="item" data-value="TW">Taiwan</div>
                    <div className="item" data-value="TJ">Tajikistan</div>
                    <div className="item" data-value="TZ">Tanzania</div>
                    <div className="item" data-value="TH">Thailand</div>
                    <div className="item" data-value="TG">Togo</div>
                    <div className="item" data-value="TK">Tokelau</div>
                    <div className="item" data-value="TO">Tonga</div>
                    <div className="item" data-value="TT">Trinidad &amp; Tobago</div>
                    <div className="item" data-value="TN">Tunisia</div>
                    <div className="item" data-value="TR">Turkey</div>
                    <div className="item" data-value="TU">Turkmenistan</div>
                    <div className="item" data-value="TC">Turks &amp; Caicos Is</div>
                    <div className="item" data-value="TV">Tuvalu</div>
                    <div className="item" data-value="UG">Uganda</div>
                    <div className="item" data-value="UA">Ukraine</div>
                    <div className="item" data-value="AE">United Arab Emirates</div>
                    <div className="item" data-value="GB">United Kingdom</div>
                    <div className="item" data-value="US">United States of America</div>
                    <div className="item" data-value="UY">Uruguay</div>
                    <div className="item" data-value="UZ">Uzbekistan</div>
                    <div className="item" data-value="VU">Vanuatu</div>
                    <div className="item" data-value="VS">Vatican City State</div>
                    <div className="item" data-value="VE">Venezuela</div>
                    <div className="item" data-value="VN">Vietnam</div>
                    <div className="item" data-value="VB">Virgin Islands (Brit)</div>
                    <div className="item" data-value="VA">Virgin Islands (USA)</div>
                    <div className="item" data-value="WK">Wake Island</div>
                    <div className="item" data-value="WF">Wallis &amp; Futana Is</div>
                    <div className="item" data-value="YE">Yemen</div>
                    <div className="item" data-value="ZR">Zaire</div>
                    <div className="item" data-value="ZM">Zambia</div>
                    <div className="item" data-value="ZW">Zimbabwe</div>
                </div>
            </div>
        );
    }
}

CountryDropdown.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default CountryDropdown;
