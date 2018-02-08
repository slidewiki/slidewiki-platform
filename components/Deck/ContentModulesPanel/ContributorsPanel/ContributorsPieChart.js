import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import classNames from 'classnames/bind';
import ContributorsStore from '../../../../stores/ContributorsStore';
import ContributorsList from './ContributorsList';
import PieChart from 'react-svg-piechart';


class ContributorsPieChart extends React.Component {
    componentDidMount() {
        //this.enableAccordion();
    }

    componentDidUpdate() {
        //this.refreshAccordion();
    }

    // enableAccordion(status) {
    //     let accordionDIV = this.refs.contributorsPanel;
    //     $(accordionDIV).find('.ui.accordion').accordion({
    //         exclusive: false
    //     });
    // }

    // refreshAccordion(status) {
    //     let accordionDIV = this.refs.contributorsPanel;
    //     $(accordionDIV).find('.ui.accordion').accordion('refresh');
    // }

    render() {
        const colors = [ '#253494', '#2c7fb8', '#41b6c4', '#a1dab4', '#B6B69C',  ];
        let data = this.props.ContributorsStore.contributors.concat(this.props.ContributorsStore.creator);
        let legend = [];
        let pie = {};
        let first_contributors = [];

        if (data.length){
            data.sort((a, b) => {return (a.count < b.count) ? 1 : ((b.count > a.count) ? -1 : 0);} );
            let i = 0;
            first_contributors = data.map((contributor) => { //getting the first five contributors
                if (i < colors.length){
                    contributor.color = colors[i];
                    contributor.title = contributor.username;
                    contributor.value = contributor.count;
                    i++;
                    return contributor;
                }else{
                    return;
                }
            });
            legend = data.map((contributor) => {
                return <li type='square' key={contributor.color} style={{color: contributor.color}} ><span style={{color: 'black'}}>{contributor.username}</span></li>; //creating the legend
            });
        }
        return (
            <div className="sw-contributors-panel" ref="contributorsPanel">
                <div className="ui">
                    <h5 className="ui small header" tabIndex="0">
                        Creator
                    </h5>
                    <ContributorsList items={this.props.ContributorsStore.creator  }></ContributorsList>
                    <h5 className="ui small header" tabIndex="0">
                        Contributions
                    </h5>
                    <div className="content">
                        {this.props.ContributorsStore.contributors.length === 0 ?
                            <div>There are no contributors for this {this.props.ContributorsStore.selector.stype}.</div> :
                            <PieChart data={first_contributors} expandOnHover={true}/>
                        }
                    </div>
                    <div className="content">
                        {this.props.ContributorsStore.contributors.length === 0 ?
                            '' :
                            <ul>{legend}</ul>
                        }
                    </div>

                </div>
            </div>

        );
    }
}

ContributorsPieChart.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};
ContributorsPieChart = connectToStores(ContributorsPieChart, [ContributorsStore], (context, props) => {
    return {
        ContributorsStore: context.getStore(ContributorsStore).getState()
    };
});

export default ContributorsPieChart;
