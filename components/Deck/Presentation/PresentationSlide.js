import React from 'react';
import ReactDOM from 'react-dom';
import {NavLink} from 'fluxible-router';
import {connectToStores, provideContext } from 'fluxible-addons-react';
import PresentationStore from '../../../stores/PresentationStore';
import SlideViewStore from '../../../stores/SlideViewStore';

let sectionStyle = { 'top': 'unset !important'};

class PresentationSlide extends React.Component {
    render(){
        let dataTrans = '';
        let dataTransSpeed = '';
        let dataTransTemp = this.props.content.search(/data-transition\=\"/);
        if (dataTransTemp !== -1){
            let dataTransTempStr = this.props.content.substr(dataTransTemp+17, 20);
            dataTrans = dataTransTempStr.substr(0, dataTransTempStr.search(/\"/));
            console.log(dataTrans);
        } else {dataTrans = 'none';}
        // none, default, convex-in fade-out, zoom, slide, slide-in fade-out, fade-in slide-out, zoom-in fade-out, convex, convex-in concave-out, concave
        let dataTransSpeedTemp = this.props.content.search(/data-transition-speed\=\"/);
        if (dataTransSpeedTemp !== -1){
            let dataTransSpeedTempStr = this.props.content.substr(dataTransSpeedTemp+23, 8);
            dataTransSpeed = dataTransSpeedTempStr.substr(0, dataTransSpeedTempStr.search(/\"/));
            console.log(dataTransSpeed);
        } else {dataTransSpeed = 'default';}
        //default, fast or slow
        return (
            <section data-transition={dataTrans} data-transition-speed={dataTransSpeed} dangerouslySetInnerHTML={{__html:this.props.content}} id={this.props.id} />
        );
    }

}

export default PresentationSlide;
