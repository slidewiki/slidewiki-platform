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
                continue;
            }

            let data = null;
            let chart = null;

            let jsonChart = JSON.parse( charts[i].getAttribute('datum'));

            if (jsonChart === null) return;
            let chartID = jsonChart.chartID;
            let chartType = jsonChart.chartType;
            let chartData = jsonChart.chartData;

            switch (chartType) {
                case 'lineChart':
                    data = chartData;
                    chart = nv.models.lineChart()
                        .useInteractiveGuideline(true);
                    chart.xAxis.tickFormat( (d) => { return chartData[0].xlabels[d] || d; });
                    break;
                case 'barChart':
                    data = chartData;
                    chart = nv.models.multiBarChart();
                    chart.xAxis.tickFormat( (d) => { return chartData[0].xlabels[d] || d; });
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
                case 'pie3DChart':
                    chartData = chartData[0].values;
                    chart = nv.models.pieChart();
                    break;
                case 'areaChart':
                    data = chartData;
                    chart = nv.models.stackedAreaChart()
                        .clipEdge(true)
                        .useInteractiveGuideline(true);
                    chart.xAxis.tickFormat( (d) => { return chartData[0].xlabels[d] || d; });
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
            }

            if (chart !== null) {
                let h = $('#' + chartID).height();
                let w = $('#' + chartID).width();
                d3.select('#' + chartID)
                    .append('svg')
                    .datum(chartData)
                    // .transition().duration(500)
                    .call(chart)
                    .style({'width': w, 'height': h});
            }
        }

        if (resize) {
            window.dispatchEvent(new Event('resize'));
        }
    }
}

export default ChartRender;
