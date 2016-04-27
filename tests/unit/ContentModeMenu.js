var createMockComponentContext = require('fluxible/utils/createMockComponentContext');
var provideContext = require('fluxible-addons-react/provideContext');
var connectToStores = require('fluxible-addons-react/connectToStores');
var React = require('react/addons');
var expect = require('chai').expect;
var TestUtils = React.addons.TestUtils;
var TabLinksStore = require('../../stores/TabLinksStore');



describe('ContentModeMenu', function(){
  var component = null;
  beforeEach('render and locate element', function(done){

    let testStores = [TabLinksStore];
    let context = createMockComponentContext({
      stores : testStores
    });

    let testComponent = provideContext(connectToStores(component, testStores, function(){
      return {};
    }));

    component = TestUtils.renderIntoDocument(<testComponent context={context} />);

    done();

  });

  it('should render', function(){
    expect(component).to.exist;
  });
});
