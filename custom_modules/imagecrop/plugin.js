/**
 * Created by anndoc on 25.08.16.
 *
 * @fileOverview The Image Crop plugin.
 */

CKEDITOR.plugins.add('imagecrop', {
    requires: 'dialog,image',
    icons: 'imagecrop',
    lang: 'en',
    init: function (editor) {
        var pluginDirectory = this.path,
            style = document.createElement('link');

        editor.addCommand('imagecrop', new CKEDITOR.dialogCommand('cropDialog'));

        style.type = 'text/css';
        style.rel = 'stylesheet';
        style.href = editor.config.cropperCssUrl;
        document.getElementsByTagName("head")[0].appendChild(style);

        CKEDITOR.scriptLoader.load(editor.config.cropperJsUrl);
        editor.ui.addButton('ImageCrop', {
            label: editor.lang.imagecrop.title,
            command: 'imagecrop',
            toolbar: 'insert',
            icon: this.path + 'icons/imagecrop.png'
        });

        if (editor.contextMenu) {
            editor.addMenuGroup('cropGroup');
            editor.addMenuItem('cropItem', {
                label: 'Edit Image',
                icon: this.path + 'icons/imagecrop.png',
                command: 'imagecrop',
                group: 'cropGroup'
            });
            editor.contextMenu.addListener(function (element) {
                if (element.getAscendant('img', true)) {
                    return {cropItem: CKEDITOR.TRISTATE_OFF};
                }
            });
        }

        CKEDITOR.dialog.add('cropDialog', pluginDirectory + 'dialogs/imagecrop.js');
    }
});
