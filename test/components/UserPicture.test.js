import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';

import UserPicture from '../../components/common/UserPicture';

describe('(Component) UserPicture', () => {

    it('renders without exploding', () => {
        const wrapper = shallow(<UserPicture/>);

        expect(wrapper).to.have.length(1);
    });

    it('renders a <div> with <Identicon> if picture prop IS NOT passed', () => {
        const wrapper = shallow(<UserPicture/>);

        expect(wrapper.find('Identicons')).to.have.length(1);
        expect(wrapper.find('img')).to.have.length(0);
    });

    it('renders an <img> if picture prop IS passed', () => {
        let props = {
            picture: 'https://www.gravatar.com/test'
        };

        const wrapper = shallow(<UserPicture {...props}/>);

        expect(wrapper.find('img')).to.have.length(1);
        expect(wrapper.find('Identicons')).to.have.length(0);
    });

    it('wraps the picture inside an <a> if link prop IS passed', () => {
        let props = {
            picture: 'https://www.gravatar.com/test',
            link: 'https://a.link.com/'
        };
        const wrapper = shallow(<UserPicture {...props}/>);

        expect(wrapper.find('a')).to.have.length(1);
    });

});
