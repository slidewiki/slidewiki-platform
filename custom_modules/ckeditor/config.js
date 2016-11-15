/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

	// Define changes to default configuration here.
	// For complete reference see:
	// http://docs.ckeditor.com/#!/api/CKEDITOR.config

    //add        '/',
    // to add a line in the toolbar
CKEDITOR.disableAutoInline = true;
CKEDITOR.editorConfig = function( config ) {
    config.disableAutoInline = true;
    CKEDITOR.disableAutoInline = true;

    config.uiColor = '#4183C4';
    //config.extraPlugins = 'sourcedialog',
    //config.extraPlugins = 'sourcedialog';
    config.line_height=";0.5;0.75;0.9;1;1.2;1.5;2.0;3.0;";

    config.toolbar = [
            { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat' ] },
			{ name: 'colors', items: [ 'TextColor', 'BGColor' ] },
            { name: 'links', items: [ 'Link', 'Unlink' ] },
        '/',
            { name: 'styles', items: [ 'Font'] },
            { name: 'styles', items: [ 'FontSize' ] },
            { name: 'styles', items: [ 'lineheight' ] },
            { name: 'styles', items: [ 'Styles' ] },
            { name: 'styles', items: [ 'Format'] },
        '/',
            //{ name: 'insert', items: [ 'Image', 'Table', 'SpecialChar', 'MathJax'] },
            { name: 'insert', items: [ 'Image', 'Table', 'SpecialChar', 'Youtube'] },
            //{ name: 'formula', items: [ 'Mathjax'] },
            { name: 'source', items: [ 'texzilla'] },
			{ name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
        '/',
            { name: 'document', items: [ 'Sourcedialog'] },
            { name: 'document', items: [ 'CodeSnippet'] },
			{ name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
        '/',
    ];
    //{ name: 'document', items: ['Templates' ] },
    //{ name: 'paragraph', items: ['CreateDiv']},
    //{ name: 'tools', items: [ 'Maximize', 'ShowBlocks' ] },
    //'HorizontalRule',
    //, 'Anchor'
    //'Smiley',
    //, '-', 'BidiLtr', 'BidiRtl' //text direction
    //, 'Iframe'
    //'PageBreak',
    //{ name: 'editing', items: [ 'Find', 'Replace', '-', 'SelectAll', '-', 'Scayt' ] },
    //paragraph --> , 'Language'
    //document --> 'NewPage',

    //{ name: 'insert', items: [ 'Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe' ] },
    //{ name: 'forms', items: [ 'Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField' ] },
    //{ name: 'about', items: [ 'About' ] }
    config.floatSpacePreferRight = true;
    //config.floatSpaceDockedOffsetX = 300;
    //config.floatSpaceDockedOffsetY = 100;
    //config.floatSpacePinnedOffsetX = 1000;
    ///config.toolbarLocation = 'bottom';

    //Klaas edit -> remove CKeditor red magicline overlay for enter by mouse
    config.removePlugins = 'magicline';
    CKEDITOR.config.magicline_color = '#0000FF';

    //configuration to prevent lay-out change onload
    config.forcePasteAsPlainText = false; // default so content won't be manipulated on load
    config.basicEntities = true; //Klaas -> do we need this?
    config.entities = true;
    config.entities_latin = false;
    config.entities_greek = false;
    config.entities_processNumerical = false;
    config.allowedContent = true; // don't filter my data


    //'div,' +
    config.plugins =
		'about,' +
		'a11yhelp,' +
		'basicstyles,' +
		'bidi,' +
		'blockquote,' +
		'clipboard,' +
		'colorbutton,' +
		'colordialog,' +
		'contextmenu,' +
		'dialogadvtab,' +
		'elementspath,' +
		'enterkey,' +
		'entities,' +
		'filebrowser,' +
		'find,' +
		'flash,' +
		'floatingspace,' +
		'font,' +
		'format,' +
		'forms,' +
		'horizontalrule,' +
		'htmlwriter,' +
        'image2,' +
		'iframe,' +
		'indentlist,' +
		'indentblock,' +
		'justify,' +
		'language,' +
		'link,' +
		'list,' +
		'liststyle,' +
        'lineheight,' +
		'magicline,' +
		'maximize,' +
		'newpage,' +
		'pagebreak,' +
		'pastefromword,' +
		'pastetext,' +
		'preview,' +
		'print,' +
		'removeformat,' +
		'resize,' +
		'save,' +
		'selectall,' +
		'showblocks,' +
		'showborders,' +
		'smiley,' +
		'sourcearea,' +
		'sourcedialog,' +
        'specialchar,' +
		'stylescombo,' +
		'tab,' +
		'table,' +
		'tabletools,' +
		'templates,' +
		'toolbar,' +
		'undo,' +
'wysiwygarea';
	// Remove some buttons provided by the standard plugins, which are
	// not needed in the Standard(s) toolbar.

    //klaas adapt: extra right-click menu options
    //config.extraPlugins = 'dialogadvtab';

	//config.removeButtons = 'Underline,Subscript,Superscript';

	// Set the most common block elements.
    config.format_tags = 'p;h1;h2;h3;pre';

    //#####Image upload via CKeditor - TODO//
    //config.uploadUrl;
    //config.uploadUrl = 'http://importservice.experimental.slidewiki.org/importImage/2';
    //config.filebrowserUploadUrl = 'http://importservice.experimental.slidewiki.org/importImage/2';
    //config.codeSnippet_theme = 'github';
    //config.codeSnippet_theme = 'pojoaque';
    config.extraPlugins = 'uploadimage,uploadwidget,codesnippet,texzilla,youtube';
    //config.codeSnippet_theme = 'pojoaque';
    //CKEDITOR.config.codeSnippet_theme = 'monokai_sublime';
    //config.extraPlugins = 'uploadimage';
    //config.extraPlugins = 'uploadwidget';
    //config.extraPlugins = 'codesnippet,texzilla,youtube';
    //config.extraPlugins = 'codesnippet';
    //config.extraPlugins = 'texzilla';
    //config.extraPlugins = 'youtube';


    // does not work and conflicts with codesnippet
    //config.extraPlugins = 'mathjax';
    //config.mathJaxLib = 'https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML';

    //config.filebrowserUploadUrl = 'http://localhost:8880/importImage'; //make importservice.manfredfris.ch/importImage when finished
    /*
    //config.uploadUrl = '../';
    //config.uploadUrl = 'http://kdi-student.de/webauftritt/kurt/';
    //config.filebrowserBrowseUrl = 'http://kdi-student.de/webauftritt/kurt/';
    //config.filebrowserUploadUrl = 'http://kdi-student.de/webauftritt/kurt/';
    //config.filebrowserUploadUrl = './../upload';
    //http://docs.ckeditor.com/#!/guide/dev_file_browse_upload
    //config.filebrowserUploadUrl = 'http://platform.manfredfris.ch/importfile';
    //config.filebrowserUploadUrl = 'http://platform.manfredfris.ch/importfile';
    //config.filebrowserUploadUrl = 'http://localhost:8880/importPPTX';
    config.filebrowserUploadUrl = 'http://localhost:8880/importImage'; //make importservice.manfredfris.ch/importImage when finished
    //config.imageUploadUrl = 'http://localhost:8880/importPPTX';
    //config.uploadUrl = 'http://localhost:8880/importImage?type=Images';
    //config.imageUploadUrl = 'http://localhost:8880/importImage?type=Images';
    //config.uploadUrl = 'http://platform.manfredfris.ch/importfile';
    */
    //TODO - create platform page, or importservice URL,
    //       or media-service-url (copy import docker) for uploading?!
    //       reuse superagent work??
    //TODO - return JSON -> http://docs.ckeditor.com/#!/api/CKEDITOR.editor-event-fileUploadResponse
    //       and see http://stackoverflow.com/questions/30087440/ckeditor-4-5-0-beta-fileupload-api-issue
    //       !!and http://docs.ckeditor.com/#!/guide/dev_file_upload

    //http://ckeditor.com/addon/uploadimage -->This plugin enables support for uploading images that were dropped or pasted into the editor.
    //depends on http://ckeditor.com/addon/uploadwidget
    // needs configuration: http://sdk.ckeditor.com/samples/fileupload.html +
    // http://sdk.ckeditor.com/samples/fileupload.html#uploading-dropped-and-pasted-images
    // Show toolbar on startup (optional).
    //config.startupFocus = true

	// Simplify the dialog windows.
	//config.removeDialogTabs = 'image:advanced;link:advanced';

};
CKEDITOR.disableAutoInline = true;


//######in import-service/application/controllers/handler.js:
/*
,importImage: function(request, reply) { // Klaas added this to test image upload
  //console.log('request.params.CKEditorFuncNum' + request.params.CKEditorFuncNum); // {}
  console.log('request.query.CKEditorFuncNum' +request.query.CKEditorFuncNum);
  /*
  let saveTo = './' + request.payload.filename;
  let fileStream = fs.createWriteStream(saveTo);
  //fileStream.write(request.payload.file.data);
  fileStream.write(request.payload.file, 'binary');
  fileStream.end();
  fileStream.on('error', (err) => {
    reply('error in upload!');
    console.log('error', err);
  });
  fileStream.on('finish', (res) => {
  */
    //let response;
    //response.writeHead(200, {'Content-Type': 'application/json'});
    //let json = JSON.stringify({
      //'uploaded': 1,
      //'fileName': 'logo_full.png',
      //'url': 'http://platform.manfredfris.ch/assets/images/logo_full.png'
    //});
    //response.end(json);
    //console.log(json);
    //reply (json);
    // JSON ONLY FOR DRAGGING and dropping  - http://stackoverflow.com/questions/33197058/ckeditor-can-not-parse-json-response
    //reply ({
      //'uploaded': '1',
      //'fileName': 'logo_full.png',
      //'url': 'http://platform.manfredfris.ch/assets/images/logo_full.png'
      //});
      /*
      let content = "<script type=\"text/javascript\">\n";
      //content += "window.parent.CKEDITOR.tools.callFunction(1, 'http://platform.manfredfris.ch/assets/images/logo_full.png', '' );\n";
      //content += "window.opener.CKEDITOR.tools.callFunction(1, 'http://platform.manfredfris.ch/assets/images/logo_full.png', '' );\n";
      //content += "CKEDITOR.instances.inlineContent.tools.callFunction(1, 'http://platform.manfredfris.ch/assets/images/logo_full.png', '' );\n";
      //content += "window.parent.CKEDITOR.instances.inlineContent.tools.callFunction(1, 'http://platform.manfredfris.ch/assets/images/logo_full.png', '' );\n";
      //window.parent.CKEDITOR

      //content += request.params.CKEditor + ".tools.callFunction("+ request.params.CKEditorFuncNum + " , 'http://platform.manfredfris.ch/assets/images/logo_full.png', '' );\n";
      //content += "window.parent.CKEDITOR.tools.callFunction("+ request.query.CKEditorFuncNum + " , 'http://platform.manfredfris.ch/assets/images/logo_full.png', '' );\n";
      content += "window.parent.CKEDITOR.tools.callFunction("+ request.query.CKEditorFuncNum + " , 'http://platform.manfredfris.ch/assets/images/logo_full.png', '' );\n";

      //CKEDITOR.instances.inlineContent
      //content += "alert('test');\n"; //WORKS!

      //SEARCH FOR ALTERNATIVES!!

      content += "</script>";
      //reply('<script type="text/javascript">window.parent.CKEDITOR.tools.callFunction(1, "http://platform.manfredfris.ch/assets/images/logo_full.png", "");</script>);');
      reply(content);
    // reply('upload completed!');
    //reply(response);
    //reply (pptx2html.convert(request.payload.file));

    //SEE http://docs.ckeditor.com/#!/guide/dev_file_browser_api
    console.log('upload completed');
  //});

}
//######in import-service/application/routes.js:
server.route({
  //will be POST
  method: 'POST',
  path: '/importPPTX',
  handler: handlers.importPPTX,
  config: {
    cors: true,
    payload: {
      parse: true,
      //allow: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' - works!
      //allow: 'application/x-www-form-urlencoded'
      allow: 'multipart/form-data'
    },
    //validate: {
  //    params: {
  //      payload: Joi.object().keys({
  //        file: Joi.string()
  //      }).requiredKeys('file')
  //    },
   // },
    tags: ['api'],
    description: 'Import PPTX presentation file to SlideWiki'
  }
});
*/
