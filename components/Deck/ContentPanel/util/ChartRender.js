import d3 from 'd3';
import nv from 'nvd3';

class ChartRender {

    static renderCharts(resize){

        let charts = $('div[id^=chart]');

        if (charts.length === 0 ) {
            return 0;
        }

        for (let i = 0; i < charts.length; i++){

            let id = charts[i].getAttribute('id');

            if ($('#' + id).has('svg').length) { // case when some svg is already created inside the chart.
                $('#' + id).children('svg').remove(); // re-render just in case for resizing.
            }

            let data = null;
            let chart = null;

            let jsonChart = JSON.parse( charts[i].getAttribute('datum'));

            if (jsonChart === null) return;
            let chartID = jsonChart.chartID;
            let chartType = jsonChart.chartType;
            let chartData = jsonChart.chartData;
            let title = null;

            switch (chartType) {
                case 'areaChart':
                    data = chartData;
                    chart = nv.models.stackedAreaChart()
                        .clipEdge(true)
                        .useInteractiveGuideline(true);
                    chart.xAxis.tickFormat( (d) => { return chartData[0].xlabels[d] || d; });
                    break;
                case 'barChart':
                    data = chartData;
                    chart = nv.models.multiBarChart();
                    chart.xAxis.tickFormat( (d) => { return chartData[0].xlabels[d] || d; });
                    break;
                case 'doughnutChart':
                    title = chartData[0].key;
                    let data = [];
                    for (let k = 0; k < chartData[0].values.length; k++) {
                        data.push({
                            label: chartData[0].xlabels[k][0],
                            value: chartData[0].values[k].y
                        });
                    }
                    chartData = data;
                    chart = nv.models.pieChart()
                        .x((d) => { return d.label })
                        .y((d) => { return d.value })
                        .showLabels(true)
                        .labelThreshold(.05)
                        .labelType("percent")
                        .donut(true)
                        .donutRatio(0.35);
                    break;
                case 'lineChart':
                    data = chartData;
                    chart = nv.models.lineChart()
                        .useInteractiveGuideline(true);
                    chart.xAxis.tickFormat( (d) => { return chartData[0].xlabels[d] || d; });
                    break;
                case 'pie3DChart':
                    data = [];
                    for (let k = 0; k < chartData[0].values.length; k++) {
                        data.push({
                            label: chartData[0].xlabels[k][0],
                            value: chartData[0].values[k].y
                        });
                    }
                    chart = nv.models.pieChart()
                        .x((d) => { return d.label; })
                        .y((d) => { return d.value; })
                        .showLabels(true);
                    chartData = data;
                    break;
                case 'pieChart':
                    data = [];
                    for (let k = 0; k < chartData[0].values.length; k++) {
                        data.push({
                            label: chartData[0].xlabels[k][0],
                            value: chartData[0].values[k].y
                        });
                    }
                    chart = nv.models.pieChart()
                        .x((d) => { return d.label; })
                        .y((d) => { return d.value; })
                        .showLabels(true);
                    chartData = data;
                    break;
                case 'scatterChart':
                    data = [];
                    for (let k = 0; k < chartData.length; k++) {
                        data.push({
                            key: chartData[k].key,
                            values: []
                        });

                        for (let h = 0; h < chartData[k].values.length; h++) {
                            data[k].values.push({
                                x: chartData[k].values[h].x,
                                y: chartData[k].values[h].y
                            });
                        }
                    }

                    chart = nv.models.scatterChart()
                        .showDistX(true)
                        .showDistY(true)
                        .color(d3.scale.category10().range());

                    chart.xAxis.axisLabel('X').tickFormat(d3.format('.02f'));
                    chart.yAxis.axisLabel('Y').tickFormat(d3.format('.02f'));
                    chartData = data;
                    break;
                default:
                    break;
            }

            if (chart !== null) {
                let h = $('#' + chartID).height();
                let w = $('#' + chartID).width();
                // Auxiliar sleep function for the asynchronous rendering.
                let sleep = (ms) => {
                    return new Promise((resolve) => setTimeout(resolve,ms));
                };
                // Async function that waits one second to render the charts, so that the component mounts properly all
                // its components.
                let renderChart = async () => {
                    // Black Magic Trick to avoid multiple rendering of charts due to multiple updates in the component.
                    let ghostDiv = '<div id="' + chartID + 'ghost" style="display: none;"></div>';
                    let ghostDivExists = $('#' + chartID + 'ghost').length;
                    if (ghostDivExists) return;
                    // Black Magic Ends here.
                    $('#' + chartID).append(ghostDiv);
                    await sleep(1000);
                    let titleExists = $('#' + chartID + 'title').length;
                    if (title && !titleExists) {
                        let $chartDiv = $('#' + chartID);
                        $chartDiv.append('<div style="text-align:center;" id="' + chartID + 'title">' + title + '</div>');
                    }
                    d3.select('#' + chartID)
                        .append('svg')
                        .datum(chartData)
                        .call(chart)
                        .style({'width': w, 'height': h});
                };
                renderChart();
            }
        }

        if (resize) {
            window.dispatchEvent(new Event('resize'));
        }
    }
}

export default ChartRender;
