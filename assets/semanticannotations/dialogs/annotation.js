CKEDITOR.dialog.add( 'annotationDialog', function( editor ) {
    return {
        title: 'Annotation Properties',
        minWidth: 400,
        minHeight: 200,
        contents: [
            {
                id: 'tab-basic',
                label: 'Settings',
                elements: [
                    {
                        type: 'text',
                        id: 'timestamp',
                        label: 'Type',
                        validate: CKEDITOR.dialog.validate.notEmpty( "Abbreviation field cannot be empty." )
                    },
                    {
                        type: 'text',
                        id: 'title',
                        label: 'Explanation',
                        validate: CKEDITOR.dialog.validate.notEmpty( "Explanation field cannot be empty." )
                    }
                ]
            },
            {
                id: 'tab-adv',
                label: 'Advanced Settings',
                elements: [
                    {
                        type: 'text',
                        id: 'id',
                        label: 'Id'
                    }
                ]
            }
        ],
        onShow: function(e) {
            console.log(editor.plugins.semanticannotations);
            console.log(e);
            //this.getContentElement('tab-basic', 'timestamp').setValue(editor.plugins.semanticannotations.getAnnotationData(editor));
            //console.log(editor.plugins.semanticannotations.getAnnotationData(editor));
        },
        onOk: function() {
            var dialog = this;

            var abbr = editor.document.createElement( 'abbr' );
            abbr.setAttribute( 'title', dialog.getValueOf( 'tab-basic', 'title' ) );
            abbr.setText( dialog.getValueOf( 'tab-basic', 'abbr' ) );

            var id = dialog.getValueOf( 'tab-adv', 'id' );
            if ( id )
                abbr.setAttribute( 'id', id );

            editor.insertElement( abbr );
        }
    };
});