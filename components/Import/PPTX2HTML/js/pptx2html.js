'use strict';
//require ('worker');
//import worker from 'worker';
//let worker = require('worker');
import Convertor from './convertor';
//let worker = require('./worker');
//import fs from 'fs';
//var FileReader = require('filereader');
//import React from 'react';
//import {connectToStores} from 'fluxible-addons-react';
//import {NavLink, navigateAction} from 'fluxible-router';
//var FileReader = require('filereader');
//var fs = require('fs');
//import FileReader from 'filereader';
//const fs = require('fs');
//var FileReader = require('filereader')
 // , fileReader = new FileReader()
//  ;
//import importFrontEnd from '../../../../actions/importFrontEnd';

module.exports = {
//$(document).ready(function() {
    convert(file)
    {
        //TODO remove dependency on worker (worker runs in separate thread. Perhaps use node.js worker for performance?)
        //if (window.Worker) {

    		//var $result = $('#result');
            let result = '';
            let isDone = false;

    		//$("#uploadBtn").on("change", function(evt) {

            isDone = false;

			//result.html("");
			//$("#load-progress").text("0%").attr("aria-valuenow", 0).css("width", "0%");
			//$("#result_block").removeClass("hidden").addClass("show");

			//var fileName = evt.target.files[0];
			//	var fileName = "test.pptx";
			//let fileName = file[0];
            //let fileName = file;

			// Read the file
            let reader = new FileReader();
            /*
            reader.onload = (function(theFile) {
                return function(e) {

					// Web Worker
                    //var worker = new Worker('./js/worker.js');
                    //var worker = new Worker('worker.js');
                    //var worker = new Worker('wasdasorker.js');
                    console.log('testwindowworker');
                    worker.processPPTX(file);
                    //TODO - later on achieve same behaviour by sending messages to front end with progress and information about the convertion progress
                    worker.addEventListener('message', function(e) {
                    //    worker.addEventListener('message',false).then((e) => {

                        let msg = e.data;
                        console.log('testwindowworker');

                        switch(msg.type) {
                            case 'progress-update':
							//	$('#load-progress').text(msg.data.toFixed(2) + '%')
							//		.attr('aria-valuenow', msg.data.toFixed(2))
							//		.css('width', msg.data.toFixed(2) + '%');
                                break;
                            case 'slide':
								//$result.append(msg.data);
								//result += msg.data;
                                console.log('testwindowworkerinloop');
                                console.log(msg.data);
                                break;
                            case 'processMsgQueue':
                                processMsgQueue(msg.data);
                                break;
                            case 'pptx-thumb':
								//$('#pptx-thumb').attr('src', 'data:image/jpeg;base64,' + msg.data);
                                break;
                            case 'ExecutionTime':
								//$('#info_block').html('Execution Time: ' + msg.data + ' (ms)');
                                isDone = true;
                                worker.postMessage({
                                    'type': 'getMsgQueue'
                                });
                                break;
                            case 'WARN':
                                console.warn('Worker: ', msg.data);
                                break;
                            case 'ERROR':
                                console.error('Worker: ', msg.data);
                                //$('#error_block').text(msg.data);
                                result += msg.data;
                                break;
                            case 'DEBUG':
                                console.debug('Worker: ', msg.data);
                                break;
                            case 'INFO':
                            default:
                                console.info('Worker: ', msg.data);
								//$('#info_block').html($('#info_block').html() + '<br><br>' + msg.data);
                        }

                    }, false);

                    worker.postMessage({
                        'type': 'processPPTX',
                        'data': e.target.result
                    });

                //};
                };
            })(file);
            */
            reader.onload = function(e) {
                //let arrayBuffer = reader.result;
                //e.target.result
                //worker.processPPTX(arrayBuffer);
                //console.log('reader result' + reader.result)
                //let worker = new Worker('test');
                //let convertor = new Convertor(reader.result);
                let convertor = new Convertor();
                let test = convertor.processPPTX(reader.result);
                //console.log(test);
                $('#test').html(test);
                //return test;
                //this.context.executeAction(loadImportFile, {file: htmlConvert});
                //return worker.processPPTX(reader.result);
            };
            //worker.processPPTX(arrayBuffer);
            reader.readAsArrayBuffer(file);


		//});
		/*
		$('#slideContentModel').on('show.bs.modal', function (e) {
			if (!isDone) { return; }
			$('#slideContentModel .modal-body textarea').text($result.html());
		});

		$('#download-btn').click(function () {
			if (!isDone) { return; }
			var cssText = '';
			$.get('css/pptx2html.css', function (data) {
				cssText = data;
			}).done(function () {
				var headHtml = '<style>' + cssText + '</style>';
				var bodyHtml = $result.html();
				var html = '<!DOCTYPE html><html><head>' + headHtml + '</head><body>' + bodyHtml + '</body></html>';
				var blob = new Blob([html], {type: 'text/html;charset=utf-8'});
				saveAs(blob, 'slides_p.html');
			});
		});

		$('#download-reveal-btn').click(function () {
			if (!isDone) { return; }
			var cssText = '';
			$.get('css/pptx2html.css', function (data) {
				cssText = data;
			}).done(function () {
				var revealPrefix =
'<script type='text/javascript'>\
Reveal.initialize({\
	controls: true,\
	progress: true,\
	history: true,\
	center: true,\
	keyboard: true,\
	slideNumber: true,\
	\
	theme: Reveal.getQueryHash().theme,\
	transition: Reveal.getQueryHash().transition || 'default',\
	\
	dependencies: [\
		{ src: 'lib/js/classList.js', condition: function() { return !document.body.classList; } },\
		{ src: 'plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },\
		{ src: 'plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },\
		{ src: 'plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } },\
		{ src: 'plugin/zoom-js/zoom.js', async: true, condition: function() { return !!document.body.classList; } },\
		{ src: 'plugin/notes/notes.js', async: true, condition: function() { return !!document.body.classList; } }\
	]\
});\
</script>';
				var headHtml = '<style>' + cssText + '</style>';
				var bodyHtml = '<div id='slides' class='slides'>' + $result.html() + '</div>';
				var html = revealPrefix + headHtml + bodyHtml;
				var blob = new Blob([html], {type: 'text/html;charset=utf-8'});
				saveAs(blob, 'slides.html');
			});
		});

		$('#to-reveal-btn').click(function () {
			if (localStorage) {
				localStorage.setItem('slides', LZString.compressToUTF16($result.html()));
				window.open('./reveal/demo.html', '_blank');
			} else {
				alert('Browser don't support Web Storage!');
			}
		});
		*/
        //} else {

        //    console.log('Browser does not support Web Worker!');

        //}
    },

//});

    processMsgQueue(queue)
    {
        for (let i=0; i<queue.length; i++) {
            processSingleMsg(queue[i].data);
        }
    },

    processSingleMsg(d) {

        let chartID = d.chartID;
        let chartType = d.chartType;
        let chartData = d.chartData;

        let data =  [];

        let chart = null;
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
            case 'pie3DChart':
                data = chartData[0].values;
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

			//data = chartData;
                chart = nv.models.scatterChart()
						.showDistX(true)
						.showDistY(true)
						.color(d3.scale.category10().range());
                chart.xAxis.axisLabel('X').tickFormat(d3.format('.02f'));
                chart.yAxis.axisLabel('Y').tickFormat(d3.format('.02f'));
                break;
            default:
        }

        if (chart !== null) {

            d3.select('#' + chartID)
            .append('svg')
			.datum(data)
			.transition().duration(500)
			.call(chart);

            nv.utils.windowResize(chart.update);

        }

    }
};
