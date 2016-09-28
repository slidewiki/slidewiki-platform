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

                //http://stackoverflow.com/questions/9251837/how-to-remove-all-listeners-in-an-element
                //var old_element = document.getElementById("btn");
                //var new_element = old_element.cloneNode(true);
                //old_element.parentNode.replaceChild(new_element, old_element);

                //var old_element = document.getElementById("btn");
                var new_element = cEl.cloneNode(true);
                cEl.parentNode.replaceChild(new_element, cEl);
                var cEl = new_element;

                // create _simpleDraggable object for this dom element
                // KLAAS -> added resize
                cEl._simpleDraggable = {
                   drag: false,
                   resize: false
                }

                //TODO: remove previous event listeners:
                //cEl.removeEventListener("mouseenter", <function>);
                //Note: To remove event handlers, the function specified with the addEventListener() method must be an external function, like in the example above (myFunction).
                //Anonymous functions, like "element.removeEventListener("event", function(){ myScript });" will not work.



                //ondragstart="return false;" ondrop="return false;"

                // listen for mousedown
                // KLAAS ADAPT -> first event listener for showin resize elements onclick
                //cEl.addEventListener("mousedown", function (e) {
                //cEl.addEventListener("mouseover", function (e) {
                //cEl.addEventListener("onclick", function (e) {

                //for showing only when element is selected
                //mousein / mouseout
                //onfocusout / onfoucusin
                //onfocus / onblur
                //mouseenter / mouseleave
                cEl.addEventListener("mouseenter", function (e) {

                    // TODO
                    // document.body.appendChild(cEl);
                    //KLAAS ADAPT
                    //cEl.style.position = "absolute";


                    //KLAAS ADAPT

                    //disable firefox resize and drag
                    //this is an DOM element property -> is different from internal class variable -> cEl._simpleDraggable.resize
                    cEl.resize = 'none';
                    // fetch our section element
                    //var section = document.querySelector("section");

                    //KLAAS -> for drag button
                    //let div = document.createElement("div");
                    cEl.dragdiv = document.createElement("div");
                    cEl.dragdiv.style.position = "absolute";
                    cEl.dragdiv.style.zIndex = "90000";
                    //div.style.top = cEl.style.top - 20 ;
                    //div.style.top = "-20" ;
                    //div.style.left = cEl.style.left - 20 ;
                    /*
                    var textnode = document.createTextNode("##");         // Create a text node
                    //textnode.style.position = "absolute";
                    textnode.contentEditable = false;
                    div.appendChild(textnode);
                    div.contentEditable = false;
                    */

                    let imgdrag = document.createElement("IMG");
                    imgdrag.style.position = "absolute";
                    imgdrag.style.zIndex = "90000";
                    imgdrag.src = '../../../../../assets/images/cursor_drag_arrow.png';
                    imgdrag.disabled = true;
                    imgdrag.draggable = false;
                    imgdrag.contentEditable = false;
                    cEl.dragdiv.appendChild(imgdrag);
                    cEl.dragdiv.contentEditable = false;

                    // prepend our span eleement to our section element
                    //alert(cEl.style.top);
                    //alert(cEl.style.top -20);
                    //alert(cEl.style);
                    //alert(cEl.offsetLeft); //css style declaration
                    //alert(cEl.offsetLeft - 20); //css style declaration
                    //textnode.offsetLeft = cEl.offsetLeft - 20 ;
                    //textnode.offsetTop = cEl.offsetTop - 20 ;

                    //position drag icon in topleft corner of parent element
                    //cEl.dragdiv.style.left = parseInt(cEl.style.left) - 30 + "px";
                    //cEl.dragdiv.style.top = parseInt(cEl.style.top) - 30 + "px";
                    cEl.insertBefore( cEl.dragdiv, cEl.firstChild );
                    //cEl._simpleDraggable.elPos.x
                    //KLAAS ADAPT END
                    //cEl.style.left = (cEl._simpleDraggable.elPos.x + e.clientX - cEl._simpleDraggable.mousePos.x) + "px";


                    //drag mousehandlers
                    //KLAAS ADAPT -> applies to dragdiv in top-left corner only
                    cEl.dragdiv.addEventListener("mousedown", function (e) {

                        //KLAAS ADAPT -> prevent default drag and drop.
                        e.preventDefault ? e.preventDefault() : e.returnValue = false

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
                    //cEl.addEventListener("mouseup", function (e) {
                    //KLAAS ADAPT -> apply to div in top-left corner only
                    cEl.dragdiv.addEventListener("mouseup", function (e) {
                        //alert('test');

                        //KLAAS ADAPT -> prevent default drag and drop.
                        e.preventDefault ? e.preventDefault() : e.returnValue = false

                        // drag: false
                        cEl._simpleDraggable.drag = false;

                        // call stop handler
                        options.onStop.call(this, e, cEl);
                    });

                    // listen for mouse out of body
                    //KLAAS ADAPT -> disable listener
                    /*
                    document.body.addEventListener("mouseout", function (e) {

                        // drag: false
                        cEl._simpleDraggable.drag = false;

                        // call stop hanlder
                        options.onStop.call(this, e, cEl);
                    });
                    */

                    //KLAAS -> for resize button
                    cEl.resizediv = document.createElement("div");
                    cEl.resizediv.style.position = "absolute";
                    let imgresize = document.createElement("IMG");
                    imgresize.style.position = "absolute";
                    imgresize.style.zIndex = "90000";
                    imgresize.src = '../../../../../assets/images/cursor_resize_arrow.png';
                    imgresize.disabled = true;
                    imgresize.draggable = false;
                    imgresize.contentEditable = false;
                    cEl.resizediv.appendChild(imgresize);
                    cEl.resizediv.contentEditable = false;
                    //cEl.insertAfter( cEl.resizediv, cEl.lastChild );
                    //position resize icon to bottom right of parent element
                    cEl.appendChild(cEl.resizediv);
                    //cEl.resizediv.style.left = parseInt(cEl.style.left) + parseInt(cEl.style.width) + "px";
                    cEl.resizediv.style.left = parseInt(cEl.style.width) - 50 + "px";
                    cEl.resizediv.style.top = parseInt(cEl.style.height) - 50 + "px";
                    //alert(cEl.resizediv.style);
                    //cEl.resizediv.style.right = (cEl.style.right) + "px";
                    //alert(cEl.style.right + "px");
                    //alert(temp + "px");

                    //resize mousehandlers
                    cEl.resizediv.addEventListener("mousedown", function (e) {

                        //KLAAS ADAPT -> prevent default drag and drop.
                        e.preventDefault ? e.preventDefault() : e.returnValue = false

                        // set true for drag field
                        cEl._simpleDraggable.resize = true;

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

                        // get current element width and height
                        cEl._simpleDraggable.elDim = {
                            w: cEl.offsetWidth
                          , h: cEl.offsetHeight
                        }

                        // call start handler
                        options.onStart.call(this, e, cEl);
                    });


                    // listen for mouse up
                    //cEl.addEventListener("mouseup", function (e) {
                    //KLAAS ADAPT -> apply to div in top-left corner only
                    cEl.resizediv.addEventListener("mouseup", function (e) {
                        //alert('test');

                        //KLAAS ADAPT -> prevent default drag and drop.
                        e.preventDefault ? e.preventDefault() : e.returnValue = false

                        // drag: false
                        cEl._simpleDraggable.resize = false;

                        // call stop handler
                        options.onStop.call(this, e, cEl);
                    });

                    // listen for mouse move
                    // Klaas: 2 parts -> 1 for dragging, 1 for resize
                    document.body.addEventListener("mousemove", function (e) {

                        //DRAGGING
                        // if drag is NOT true, return
                        //if drag is true
                        if (cEl._simpleDraggable.drag === true) {

                            // if drag handler returns false, don't do anything
                            if (options.onDrag.call(this, e, cEl) === false) {
                                return;
                            }
                            //console.log('drag');
                            // move only on y axis
                            if (!options.onlyY) {
                                // use variable scale factor calculated from slide edit component size
                                //cEl.style.left = (cEl._simpleDraggable.elPos.x + ( e.clientX - cEl._simpleDraggable.mousePos.x)  / 0.5 )  + "px";
                                cEl.style.left = (cEl._simpleDraggable.elPos.x + ( e.clientX - cEl._simpleDraggable.mousePos.x)  / options.ratio )  + "px";
                                //console.log(e.clientY - cEl._simpleDraggable.mousePos.y);
                            }

                            // move only on x axis
                            if (!options.onlyX) {
                                // use variable scale factor calculated from slide edit component size
                                cEl.style.top = (cEl._simpleDraggable.elPos.y +  ( e.clientY - cEl._simpleDraggable.mousePos.y)  / options.ratio )  + "px";
                            }
                        } else if (cEl._simpleDraggable.resize === true)
                        {
                            //KLAAS ADDED -> resize
                            // if drag handler returns false, don't do anything
                            // KLAAS -> did not set this callack -> CAN BE REMOVED?
                            if (options.onDrag.call(this, e, cEl) === false) {
                                return;
                            }
                            //console.log('resize');

                            // resize only on y axis
                            if (!options.onlyY) {
                                //calculate width as well
                                //cEl.style.left = (cEl._simpleDraggable.elPos.x) + "px";
                                // use variable scale factor calculated from slide edit component size
                                cEl.style.width = (cEl._simpleDraggable.elDim.w  + ( e.clientX - cEl._simpleDraggable.mousePos.x)  / options.ratio )   + "px";
                            }

                            // resize only on x axis
                            if (!options.onlyX) {
                                ////calculate height as well:
                                //cEl.style.top = (cEl._simpleDraggable.elPos.y) + "px";
                                //console.log(e.clientY - cEl._simpleDraggable.mousePos.y);
                                //console.log(cEl.style.height);
                                // use variable scale factor calculated from slide edit component size
                                cEl.style.height = ((cEl._simpleDraggable.elDim.h + (e.clientY - cEl._simpleDraggable.mousePos.y) / options.ratio )  ) + "px";
                                //console.log(((cEl._simpleDraggable.elDim.w + e.clientY - cEl._simpleDraggable.mousePos.y) * 2) + "px");
                                //console.log(cEl.style.height);
                            }
                            //cEl.style.transform = 'scale(0.5)';
                            //move resize button with resized borders of element
                            cEl.resizediv.style.left = parseInt(cEl.style.width) - 50 + "px";
                            cEl.resizediv.style.top = parseInt(cEl.style.height) - 50 + "px";
                        }
                        else
                        { return; }
                    });
                });
                //mousein / mouseout
                //onfocusout / onfoucusin
                //onfocus / onblur
                //mouseenter / mouseleave
                //for removing when element is not selected
                cEl.addEventListener("mouseleave", function (e) {
                    //alert('test');
                    //remove div for drag
                    //cEl.insertBefore( div, cEl.firstChild ); //inverse of this
            		cEl.removeChild(cEl.dragdiv);
                    cEl.removeChild(cEl.resizediv);
                });

            })(allElms[i])
        }
    };

    // export the function
    window.SimpleDraggable = SimpleDraggable;
})(window);
