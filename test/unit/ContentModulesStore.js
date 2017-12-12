import React from 'react';
import createMockComponentContext from 'fluxible/utils/createMockComponentContext';
import provideContext from 'fluxible-addons-react/provideContext';
import connectToStores from 'fluxible-addons-react/connectToStores';
//import TestUtils from 'react-addons-test-utils';
import TestUtils from 'react-dom/test-utils';
import {expect} from 'chai';
import ContentModuleStore from '../../stores/ContentModulesStore';


describe('ContentModulesStore', () => {
    let component = null;


    beforeEach('render and locate element', (done) => {
        let testStores = [ContentModuleStore];
        let context = createMockComponentContext({
            stores: testStores
        });

        let testComponent = provideContext(connectToStores(component, testStores, () => {
            return {};
        }));
        let x = 42;
        component = TestUtils.renderIntoDocument(<testComponent context={context} abc={x}/>);

        done();
    });

    it('should render', () => {
        expect(component).to.exist;
    });
});
