## ImageCrop

A CKEditor plugin to add simple crop for images.
Upload image file file, crop it using [cropper.js](https://fengyuanchen.github.io/cropperjs/) and save to server.

## Installation
1. Download the `imagecrop` plugin from repository
2. Place the `imagecrop` folder into the plugins folder of CKEditor ( *{Path to CKEDitor}/plugins/* )
3. Open the config.js file and add the following lines:

```
    CKEDITOR.editorConfig = function( config ) {
        config.extraPlugins = 'imagecrop';
        config.allowedContent = true;
        config.toolbar = "Custom";
        config.toolbar_Custom = [{'name': 'insert', 'items': ['ImageCrop']}];

        // Setup file browser urls (See CKEditor documentation http://docs.ckeditor.com/#!/guide/dev_file_browser_api)
        config.filebrowserBrowseUrl = '/browser/browse.php';
        config.filebrowserUploadUrl = '/uploader/upload.php';

        // Setup cropper options. (See cropper.js documentation https://github.com/fengyuanchen/cropperjs)
        config.cropperOption = {
            "aspectRatio": 1.8,
            "autoCropArea": 1,
            "background": false,
            "cropBoxResizable": false,
            "dragMode": "move"
        };

        // Add js and css urls to cropper.js
        config.cropperJsUrl = "https://cdnjs.cloudflare.com/ajax/libs/cropperjs/0.8.1/cropper.min.js";
        config.cropperCssUrl = "https://cdnjs.cloudflare.com/ajax/libs/cropperjs/0.8.1/cropper.min.css"
    };
```

### To configure plugin for django-ckeditor-upload use following lines

* Make sure that you login as staff member or rewrite default ckeditor-upload urls.
  Because by default views for file uploads are staff_member_required.
  See [Django CKEditor documentation](https://github.com/django-ckeditor/django-ckeditor)

```
    {
        'default': {
            'toolbar_Custom': [
                {'name': 'insert', 'items': ['ImageCrop']}
            ],
            'toolbar': 'Custom',
            'extraPlugins': 'imagecrop',
            'allowedContent': True,
            'cropperCssUrl': 'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/0.8.1/cropper.min.css',
            'cropperJsUrl': 'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/0.8.1/cropper.min.js',
            'cropperOption': {
                'aspectRatio': 16 / 9,
                'autoCropArea': 1,
                'cropBoxResizable': False,
                'dragMode': 'move',
                'background': False
            },
            'resultOption': {
                'width': 300
            }
        }
    }
```