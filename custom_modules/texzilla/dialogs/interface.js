// CKEditor TeXZilla Plugin
// Copyright (C) 2014  Raniere Silva
//
// This Source Code Form is subject to the terms of the
// Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed
// with this file, You can obtain one at http://mozilla.org/MPL/2.0/.

/* global CKEDITOR:false */
/* global TeXZilla:false */

function update_preview() {
    var dialog = CKEDITOR.dialog.getCurrent();

    var preview = document.getElementById("Preview");
    // Clean previous preview
    var previous = preview.childNodes;
    for (var i = 0; i < previous.length; i++) {
        preview.removeChild(previous[i]);
    }

    var mathElement;
    try {
        mathElement = TeXZilla.toMathML(
            dialog.getValueOf("basic", "tex"),
            dialog.getValueOf("basic", "display"),
            dialog.getValueOf("basic", "direction"),
            true);
        dialog.enableButton("ok");
    }
    catch (error) {
        // Disable button if errer
        mathElement = document.createElement("p");
        mathElement.setAttribute("style", "color:red;");
        mathElement.innerHTML = dialog.getValueOf("basic", "tex");
        dialog.disableButton("ok");
    }

    preview.appendChild(mathElement);
}

CKEDITOR.dialog.add("texzillaDialog", function(editor) {
    return {
        title: "TeXZilla Edit Box",
        minWidth: 300,
        minHeight: 300,
        contents: [{
            id: "basic",
            label: "Basic Settings",
            elements: [{
                id: "tex",
                type: "textarea",
                label: "Please insert your (LaTex) code:",
                setup: function(insertMode, element) {
                    if (!insertMode) {
                        this.setValue(TeXZilla.getTeXSource(element.$));
                    }
                },
                onInput: function() {
                    update_preview();
                },
                onChange: function() {
                    update_preview();
                }
            }, {
                id: "instruction",
                type: "html",
                html: "<div>(Clicking outside of the textarea updates the preview)</div>"
            }, {
                id: "options",
                type: "html",
                html: "<div><strong>Options:</strong></div>"
            }, {
                id: "display",
                type: "checkbox",
                label: "Display",
                setup: function(insertMode, element) {
                    var display = element.getAttribute("display");
                    if (display === "block") {
                        this.setValue(true);
                    }
                    else {
                        this.setValue(false);
                    }
                },
                onChange: function() {
                    update_preview();
                }
            }, {
                id: "direction",
                type: "checkbox",
                label: "RTL",
                setup: function(insertMode, element) {
                    var direction = element.getAttribute("dir");
                    if (direction === "rtl") {
                        this.setValue(true);
                    }
                    else {
                        this.setValue(false);
                    }
                },
                onChange: function() {
                    update_preview();
                }
            }, {
                id: "preview",
                type: "html",
                label: "Preview",
                // Width of the preview box is based on the minWidth of the dialog window.
                html: "<div><p><strong>Preview</strong>:</p><p id=\"Preview\"></p></div>",
                setup: function(insertMode, element) {
                    var preview = document.getElementById("Preview");
                    // Clean previous preview
                    var previous = preview.childNodes;
                    for (var i = 0; i < previous.length; i++) {
                        preview.removeChild(previous[i]);
                    }
                    if (!insertMode) {
                        preview.appendChild(element.$.cloneNode(true));
                    }
                }
            }]
        }],
        onShow: function() {
            var selection = editor.getSelection();
            var element = selection.getStartElement();
            // Try to locate a `math` or `body` tag.
            while (element.getName() !== "math" &&
                element.getName() !== "body") {
                element = element.getParent();
            }
            if (!element || element.getName() !== "math") {
                this.insertMode = true;
            }
            else {
                this.insertMode = false;
                this.mathRoot = element;
            }
            // invoke the setup functions for the element
            this.setupContent(this.insertMode, element);
        },
        onOk: function() {
            var dialog = this;

            // This is the better way to insert the MathML, although we got
            //
            //     TypeError: element.getName is not a function
            //
            // when using it.
            //
            // var mathElement = TeXZilla.toMathML(
            //     dialog.getValueOf("basic", "tex"));

            // This is a hack found at
            // http://stackoverflow.com/a/17339275/1802726.
            var math = TeXZilla.toMathMLString(
                dialog.getValueOf("basic", "tex"),
                dialog.getValueOf("basic", "display"),
                dialog.getValueOf("basic", "direction"),
                true);
            var mathElement = CKEDITOR.dom.element.createFromHtml(math,
                editor.document);

            if (!this.insertMode) {
                // Remove old equation
                this.mathRoot.$.parentNode.removeChild(this.mathRoot.$);
            }
            editor.insertElement(mathElement);
        }
    };
});
