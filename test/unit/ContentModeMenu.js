import React from 'react';
import createMockComponentContext from 'fluxible/utils/createMockComponentContext';
import provideContext from 'fluxible-addons-react/provideContext';
import connectToStores from 'fluxible-addons-react/connectToStores';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';
import TabLinksStore from '../../stores/TabLinksStore';
import TabLinksStore from '../../stores/ContentStore';
import createStore from 'fluxible/addons/createStore';


describe('ContentModeMenu', function(){
  var component = null;

  let MockContentStore = createStore(
      selector = {'id': 0, 'spath': '', 'sid': 0, 'stype': '', page: 'content'};
  );


  beforeEach('render and locate element', function(done){

    let testStores = [TabLinksStore];

    let context = createMockComponentContext({
      stores : testStores
    });

    let testComponent = provideContext(connectToStores(component, testStores, function(){
      return {};
    }));
    let x = 42;
    component = TestUtils.renderIntoDocument(<testComponent context={context} abc={x} />);

    done();

  });

  it('should render', function(){
    expect(component).to.exist;
  });
  it('should have x==42', function(){

  })
});
