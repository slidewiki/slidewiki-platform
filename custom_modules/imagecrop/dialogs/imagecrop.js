CKEDITOR.dialog.add('cropDialog', function (editor) {
    var cropper,
        imageType = 'image/jpeg',
        width = parseInt(window.innerWidth * 80 / 100),
        height = parseInt(window.innerHeight * 80 / 100),
        options = editor.config.cropperOption,
        uploadOnChange = function (e) {
            var URL = window.URL || window.webkitURL,
                blobURL,
                file = e.target.files[0],
                canvas = CKEDITOR.document.getElementsByTag('img').$[0];

            if (!cropper)
                cropper = new Cropper(canvas, options);

            if (/^image\/\w+/.test(file.type)) {
                blobURL = URL.createObjectURL(file);
                cropper.reset().replace(blobURL);
            } else {
                window.alert(editor.lang.imagecrop.wrongImageType);
            }
        },
        ref = CKEDITOR.tools.addFunction(function (url) {
            var dialog = editor._.filebrowserSe.getDialog(),
                abbr = dialog.element;

            abbr.setAttribute('src', url);
            abbr.setAttribute('data-cke-saved-src', url);
            dialog.commitContent(abbr);
            if (dialog.insertMode)
                editor.insertElement(abbr);
        });

    if (!HTMLCanvasElement.prototype.toBlob) {
        Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
            value: function (callback, type, quality) {

                var binStr = atob(this.toDataURL(type, quality).split(',')[1]),
                    len = binStr.length,
                    arr = new Uint8Array(len);

                for (var i = 0; i < len; i++) {
                    arr[i] = binStr.charCodeAt(i);
                }

                callback(new Blob([arr], {type: type || imageType}));
            }
        });
    }

    return {
        title: editor.lang.imagecrop.title,
        width: width,
        height: height,
        contents: [
            {
                id: 'base',
                label: editor.lang.imagecrop.cropTab,
                filebrowser: 'uploadButton',
                elements: [
                    {
                        type: 'hbox',
                        widths: ['80%', '20%'],
                        children: [
                            {
                                type: 'html',
                                html: '<img>',
                                id: 'img',
                                label: editor.lang.common.image,
                                style: 'width: 100%; height: ' + parseInt(window.innerHeight * 80 / 100) + 'px; border-color:#CECECE',
                                setup: function(element) {
                                    cropper.reset().replace(element.getAttribute('src'));
                                }
                            },
                            {
                                type: 'vbox',
                                align: 'right',
                                children: [
                                    {
                                        type: 'file',
                                        id: 'upload',
                                        label: editor.lang.common.browseServer,
                                        onClick: function (e) {
                                            e.sender.$.removeEventListener('change', uploadOnChange, false);
                                            e.sender.$.addEventListener('change', uploadOnChange, false);
                                        }
                                    }, {
                                        type: 'fileButton',
                                        style: 'display: none',
                                        id: 'uploadButton',
                                        label: editor.lang.imagecrop.btnUpload,
                                        for: ['base', 'upload'],
                                        filebrowser: {
                                            action: 'QuickUpload'
                                        },
                                        onClick: function () {
                                            var dialog = this.getDialog(),
                                                form = dialog.getContentElement('base', 'upload').getInputElement().$.form,
                                                fileName = dialog.getContentElement('base', 'upload').getInputElement().$.value.replace(/^.*[\\\/]/, '') || 'upload.jpg',
                                                formData,
                                                xhr = new XMLHttpRequest();

                                            editor._.filebrowserSe = this;

                                            xhr.onreadystatechange = function (response) {
                                                if (xhr.readyState == 4 && xhr.status == 200) {
                                                    form.ownerDocument.write(response.target.responseText);
                                                    cropper.destroy();
                                                    CKEDITOR.document.getElementsByTag('img').$[0].removeAttribute('src');
                                                }
                                            };

                                            if (form) {
                                                cropper.getCroppedCanvas(editor.config.resultOption).toBlob(function (blob) {
                                                    formData = new FormData();
                                                    formData.append('upload', blob, fileName);
                                                    xhr.open('POST', (form.action + '&CKEditorFuncNum=' + ref), true); // todo
                                                    xhr.send(formData);
                                                });
                                            }
                                            return false;
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        onShow: function () {
            var selection = editor.getSelection();
            var element = selection.getStartElement();

            if (element)
                element = element.getAscendant('img', true);

            if (!element || element.getName() != 'img') {
                element = editor.document.createElement('img');
                this.insertMode = true;
            }
            else
                this.insertMode = false;

            this.element = element;
            if (!this.insertMode)
                this.setupContent(this.element);
        },
        onOk: function () {
            var dialog = this,
                uploadButton = dialog.getContentElement('base', 'uploadButton');
            uploadButton.click();
        }
    }
});
