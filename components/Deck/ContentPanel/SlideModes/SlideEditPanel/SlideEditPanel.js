import React from 'react';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import SlideEditStore from '../../../../../stores/SlideEditStore';
import SlideContentEditor from './SlideContentEditor';

class SlideEditPanel extends React.Component {
    render() {
        //need mechanism to ensure that slide content is known/rendering before Alloy Editor is called
        this.props.SlideEditStore.content = `
        <h1> Slide #test</h1>
        <div>
            <p style="font-size: 1.16em;">
                Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. Donec id elit non mi porta gravida at eget metus.
            </p>
            <ul>
                <li>item 1 from slide test</li>
                <li>item 2 from slide test</li>
                <li>item 3 from slide test</li>
            </ul>
            <p style="font-size: 1.2em;">
                Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.
            </p>
            <p style="text-align:center">
                <svg xmlns="http://www.w3.org/2000/svg"
                     xmlns:xlink="http://www.w3.org/1999/xlink">
                    <text x="20"  y="40"
                          style="font-family: Arial;
                                 font-size  : 25;
                                 stroke     : #000000;
                                 fill       : #6a79dc;
                                "
                          > SVG Image test</text>
                </svg>
            </p>
        </div>
        `;
        return (
            <div ref="slideEditPanel" className="ui bottom attached segment">
                <SlideContentEditor content={this.props.SlideEditStore.content} selector={this.props.selector} />
            </div>
        );
    }
}

SlideEditPanel = connectToStores(SlideEditPanel, [SlideEditStore], (context, props) => {
    return {
        SlideEditStore: context.getStore(SlideEditStore).getState()
    };
});
export default SlideEditPanel;
