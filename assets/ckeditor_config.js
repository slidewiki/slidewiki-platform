/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

	// Define changes to default configuration here.
	// For complete reference see:
	// http://docs.ckeditor.com/#!/api/CKEDITOR.config

    //add        '/',
    // to add a line in the toolbar

CKEDITOR.editorConfig = function( config ) {
    config.toolbar = [
            { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat' ] },
            { name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
			{ name: 'colors', items: [ 'TextColor', 'BGColor' ] },
            { name: 'styles', items: [ 'FontSize' ] },
        '/',
            { name: 'document', items: [ 'Source', '-', 'Save', 'Preview', 'Print', '-', 'Templates' ] },
			{ name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
			{ name: 'editing', items: [ 'Find', 'Replace', '-', 'SelectAll', '-', 'Scayt' ] },
            { name: 'tools', items: [ 'Maximize', 'ShowBlocks' ] },
            { name: 'styles', items: [ 'Styles' ] },
        '/',
			{ name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl'] },
            { name: 'styles', items: [ 'Format'] },
        '/',
        '/',
			{ name: 'insert', items: [ 'Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe' ] },
            { name: 'styles', items: [ 'Font'] },
    ];
    //paragraph --> , 'Language'
    //document --> 'NewPage',

    //{ name: 'forms', items: [ 'Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField' ] },
    //{ name: 'about', items: [ 'About' ] }
    config.floatSpacePreferRight = true;
    //config.floatSpaceDockedOffsetX = 300;
    //config.floatSpaceDockedOffsetY = 100;
    //config.floatSpacePinnedOffsetX = 1000;
    ///config.toolbarLocation = 'bottom';

    config.uiColor = '#4183C4';
    config.extraPlugins = 'sourcedialog',
    // Show toolbar on startup (optional).
    //config.startupFocus = true

    //configuration to prevent lay-out change onload
    config.forcePasteAsPlainText = false; // default so content won't be manipulated on load
    config.basicEntities = true;
    config.entities = true;
    config.entities_latin = false;
    config.entities_greek = false;
    config.entities_processNumerical = false;
    config.allowedContent = true; // don't filter my data


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
		'div,' +
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
		'image,' +
		'iframe,' +
		'indentlist,' +
		'indentblock,' +
		'justify,' +
		'language,' +
		'link,' +
		'list,' +
		'liststyle,' +
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

	//config.removeButtons = 'Underline,Subscript,Superscript';

	// Set the most common block elements.
    config.format_tags = 'p;h1;h2;h3;pre';

	// Simplify the dialog windows.
	//config.removeDialogTabs = 'image:advanced;link:advanced';
};
