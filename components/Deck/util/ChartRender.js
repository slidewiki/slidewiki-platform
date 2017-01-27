import nv from 'nvd3';

class ChartRender {
  //Render the chart according to its type and data, it uses nvd3
  static createCharts () {
    $("div[id^=chart]").each(function(){
        // In case the chart is already rendered, it doesn't need to be rendered again.
        if ($(this).has('svg').length) return '';
        // Extract the data of the chartID
        let chart = JSON.parse($(this).attr('datum'));
        let chartID = chart.data['this.chartID'];
        let chartType =  chart.data.chartType;
        let chartData = chart.data.chartData;
        let data = [];
        chart = null;
        switch (chartType) {
          case 'lineChart':
              data = chartData;
              chart = nv.models.lineChart()
                .useInteractiveGuideline(true);
              chart.xAxis.tickFormat(function(d) { return chartData[0].xlabels[d] || d; });
              break;
          case 'barChart':
              data = chartData;
              chart = nv.models.multiBarChart();
              chart.xAxis.tickFormat(function(d) { return chartData[0].xlabels[d] || d; });
              break;
          case 'pieChart':
              chartData = chartData[0].values;
              chart = nv.models.pieChart();
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
              chart.xAxis.tickFormat(function(d) { return chartData[0].xlabels[d] || d; });
              break;
          case 'scatterChart':

              for (let i=0; i<chartData.length; i++) {
                  let arr = [];
                  for (let j=0; j<chartData[i].length; j++) {
                      arr.push({x: j, y: chartData[i][j]});
                  }
                  data.push({key: 'data' + (i + 1), values: arr});
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
        d3.select('#' + chartID)
          .append('svg')
          .datum(chartData)
          .transition().duration(500)
          .call(chart);

        nv.utils.windowResize(chart.update);
      }
    });
  }
}

export default ChartRender;
