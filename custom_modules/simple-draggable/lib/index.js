/*!
 *  Simple Draggable
 *  simple-draggable.js
 *  -------------------
 *
 *  This is a very minimalistic JavaScript library for dragging elements on the page.
 *  It's not based on jQuery or anything like this. Just pure JavaScript.
 *
 *  Example
 *  -------
 *  SimpleDraggable(".cursor", {});
 */
(function (window) {
    /**
     * SimpleDraggable
     * Initializes the draggable state.
     *
     * @name SimpleDraggable
     * @function
     * @param {String} selector The element query selector.
     * @param {Object} options An object containing:
     *
     *  - `onStart` (Function): A function to run on drag start.
     *  - `onStop` (Function): A function to run on drag stop.
     *  - `onDrag` (Function): A function to run on drag move.
     *  - `onlyX` (Boolean): Drag the element only on the X axis.
     *  - `onlyY` (Boolean): Drag the element only on the Y axis.
     */
    var SimpleDraggable = function (selector, options) {

        options = Object(options);

        // Handlers
        options.onStart = options.onStart || function () {};
        options.onStop = options.onStop || function () {};
        options.onDrag = options.onDrag || function () {};

        // Query the elements
        var allElms = document.querySelectorAll (selector);

        // Each element
        for (var i = 0; i < allElms.length; ++i) {
            (function (cEl) {

                // TODO
                // document.body.appendChild(cEl);
                cEl.style.position = "absolute";

                // create _simpleDraggable object for this dom element
                cEl._simpleDraggable = {
                   drag: false
                }

                // listen for mousedown
                cEl.addEventListener("mousedown", function (e) {

                    // set true for drag field
                    cEl._simpleDraggable.drag = true;

                    // set the mouse position on the page
                    cEl._simpleDraggable.mousePos = {
                        x: e.clientX
                      , y: e.clientY
                    };

                    // set the element position
                    cEl._simpleDraggable.elPos = {
                        x: cEl.offsetLeft
                      , y: cEl.offsetTop
                    }

                    // call start handler
                    options.onStart.call(this, e, cEl);
                });

                // listen for mouse up
                cEl.addEventListener("mouseup", function (e) {

                    // drag: false
                    cEl._simpleDraggable.drag = false;

                    // call stop handler
                    options.onStop.call(this, e, cEl);
                });

                // listen for mouse out of body
                document.body.addEventListener("mouseout", function (e) {

                    // drag: false
                    cEl._simpleDraggable.drag = false;

                    // call stop hanlder
                    options.onStop.call(this, e, cEl);
                });

                // listen for mouse move
                document.body.addEventListener("mousemove", function (e) {

                    // if drag is NOT true, return
                    if (!cEl._simpleDraggable.drag) { return; }

                    // if drag handler returns false, don't do anything
                    if (options.onDrag.call(this, e, cEl) === false) {
                        return;
                    }

                    // move only on y axis
                    if (!options.onlyY) {
                        cEl.style.left = (cEl._simpleDraggable.elPos.x + e.clientX - cEl._simpleDraggable.mousePos.x) + "px";
                    }

                    // move only on x axis
                    if (!options.onlyX) {
                        cEl.style.top = (cEl._simpleDraggable.elPos.y + e.clientY - cEl._simpleDraggable.mousePos.y) + "px";
                    }
                })
            })(allElms[i])
        }
    };

    // export the function
    window.SimpleDraggable = SimpleDraggable;
})(window);
