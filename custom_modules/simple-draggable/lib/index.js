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
        var buttonsize = 50*options.ratio;

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
                if(cEl.style.width != '0px' && cEl.style.width != undefined && cEl.style.height != '0px' && cEl.style.height != undefined)
                {

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

                    //alert('test');
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

                    //===============KLAAS -> for drag button
                    //let div = document.createElement("div");
                    cEl.dragdiv = document.createElement("div");
                    cEl.dragdiv.style.position = "absolute";
                    cEl.dragdiv.style.zIndex = "9000000";
                    cEl.dragdiv.id = "dragdiv";
                    cEl.dragdiv.className = "dragdiv";
                    //cEl.dragdiv.class = "content";
                    //cEl.dragdiv.style.width = "50px";
                    //cEl.dragdiv.style.height = "50px";
                    cEl.dragdiv.style.width = buttonsize+"px";
                    cEl.dragdiv.style.height = buttonsize+"px";
                    cEl.dragdiv.style.top = "-"+(buttonsize*0.75)+"px";
                    cEl.dragdiv.style.left = "-"+(buttonsize*0.5)+"px";
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
                    //imgdrag.style.position = "absolute";
                    imgdrag.style.zIndex = "9000000";
                    imgdrag.src = '../../../../../assets/images/cursor_drag_arrow.png';
                    imgdrag.id = "imgdrag";
                    //imgdrag.style.width = "50px";
                    //imgdrag.style.height = "50px";
                    imgdrag.disabled = true;
                    imgdrag.draggable = false;
                    //imgdrag.contentEditable = false;
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
                        // Add warning of edition
                        window.onbeforeunload = () => {
                          return 'If you don\'t save the slide, it won\'t be updated. ' +
                            'Are you sure you want to exit this page?';
                        };

                        //fix to prevent scrolling
                        $('.pptx2html').css('overflow', 'hidden');
                        //$('.pptx2html').css('height', '100%');
                        $('body').css('overflow', 'hidden');
                        //$('body').css('height', '100%');

                        //cEl.style.overflow = 'hidden';


                        //move element to front to prevent conflict with handlers on elements with larger z-index (which then trigger)
                        cEl.style.zIndex = cEl.style.zIndex + 9000000;

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

                        //restore fix to prevent scrolling
                        $('.pptx2html').css('overflow', '');
                        //$('.pptx2html').css('height', '');
                        $('body').css('overflow', '');
                        //$('body').css('height', '');

                        //restore z-index - element was moved to front - to prevent conflict with handlers on elements with larger z-index (which then trigger)
                        cEl.style.zIndex = cEl.style.zIndex - 9000000;

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

                    //===============KLAAS -> for remove button
                    cEl.removediv = document.createElement("div");
                    cEl.removediv.style.position = "absolute";
                    cEl.removediv.style.zIndex = "9000000";
                    cEl.removediv.id = "removediv";
                    cEl.removediv.className = "removediv";
                    cEl.removediv.style.width = buttonsize+"px";
                    cEl.removediv.style.height = buttonsize+"px";
                    //assign to top right of parent div
                    cEl.removediv.style.top = "-"+ (buttonsize*0.75) +"px";
                    cEl.removediv.style.left = (parseInt(cEl.style.width) - (buttonsize*0.5))+"px";

                    let imgremove = document.createElement("IMG");
                    imgremove.style.zIndex = "9000000";
                    imgremove.src = '../../../../../assets/images/cursor_remove.png';
                    imgremove.id = "imgremove";
                    imgremove.disabled = true;
                    imgremove.draggable = false;
                    cEl.removediv.appendChild(imgremove);
                    cEl.removediv.contentEditable = false;

                    cEl.insertBefore( cEl.removediv, cEl.firstChild );
                    //cEl.appendChild(cEl.removediv);

                    cEl.removediv.addEventListener("mousedown", function (e) {

                        //KLAAS ADAPT -> prevent default drag and drop.
                        e.preventDefault ? e.preventDefault() : e.returnValue = false
                        //KLAAS NEW -> remove entire div
                        //cEl.parentNode.replaceChild(new_element, cEl);
                        if (confirm('Are you sure you want to delete this element?'))
                        {
                            //edition warning
                            window.onbeforeunload = () => {
                              return 'If you don\'t save the slide, it won\'t be updated. ' +
                                'Are you sure you want to exit this page?';
                            };
                            //alert(cEl.parentNode.className);
                            if (cEl.parentNode.childNodes.length === 1)
                            {
                                //add a div element to prevent empty PPTX element which gets removed by CKeditor
                                let emptydiv = document.createElement("div");
                                //emptydiv.innerHTML = "";
                                cEl.parentNode.appendChild(emptydiv);
                            }
                            //else{
                                cEl.parentNode.removeChild(cEl);
                            //}
                            //cEl.remove();
                        }
                    });

                    //===============KLAAS -> for send-to-back button
                    cEl.sendtobackdiv = document.createElement("div");
                    cEl.sendtobackdiv.style.position = "absolute";
                    cEl.sendtobackdiv.style.zIndex = "9000000";
                    cEl.sendtobackdiv.id = "sendtobackdiv";
                    cEl.sendtobackdiv.className = "sendtobackdiv";
                    cEl.sendtobackdiv.style.width = buttonsize+"px";
                    cEl.sendtobackdiv.style.height = buttonsize+"px";
                    //assign to bottom left of parent div
                    cEl.sendtobackdiv.style.top = (parseInt(cEl.style.height) - (buttonsize*0.75)) +"px";
                    cEl.sendtobackdiv.style.left = "-" + (buttonsize*0.5)+"px";
                    //cEl.movetofrontdiv.style.left = parseInt(cEl.style.width) - 70 + "px";
                    //cEl.sendtobackdiv.style.top = parseInt(cEl.style.height) - 50 + "px"; //bottomleft

                    let imgsendtoback = document.createElement("IMG");
                    imgsendtoback.style.zIndex = "9000000";
                    imgsendtoback.src = '../../../../../assets/images/cursor_send_to_back.png';
                    imgsendtoback.id = "imgremove";
                    imgsendtoback.disabled = true;
                    imgsendtoback.draggable = false;
                    imgsendtoback.contentEditable = false;
                    cEl.sendtobackdiv.appendChild(imgsendtoback);
                    cEl.sendtobackdiv.contentEditable = false;

                    cEl.insertBefore( cEl.sendtobackdiv, cEl.firstChild );
                    //cEl.appendChild(cEl.removediv);

                    cEl.sendtobackdiv.addEventListener("mousedown", function (e) {

                        //KLAAS ADAPT -> prevent default drag and drop.
                        e.preventDefault ? e.preventDefault() : e.returnValue = false

                        //alert('test');
                        //$(".pptx2html [style*='absolute']").css({'borderStyle': 'dashed dashed dashed dashed', 'borderColor': '#33cc33'});
                        let index_lowest = cEl.style.zIndex;
                        $(".pptx2html [style*='absolute']").each(function() {
                            var index_current = parseInt($(this).css("zIndex"), 10);
                            if(index_current < index_lowest) {
                                index_lowest = index_current;
                            }
                        });
                        cEl.style.zIndex = index_lowest - 10;
                    });

                    //===============KLAAS -> for move-to-front button
                    cEl.movetofrontdiv = document.createElement("div");
                    cEl.movetofrontdiv.style.position = "absolute";
                    cEl.movetofrontdiv.style.zIndex = "9000000";
                    cEl.movetofrontdiv.id = "movetofrontdiv";
                    cEl.movetofrontdiv.className = "movetofrontdiv";
                    cEl.movetofrontdiv.style.width = buttonsize+"px";
                    cEl.movetofrontdiv.style.height = buttonsize+"px";
                    //assign to bottom left of parent div
                    cEl.movetofrontdiv.style.top = (parseInt(cEl.style.height) - (buttonsize*0.75) )  +"px";
                    cEl.movetofrontdiv.style.left = "-" + (buttonsize*0.5)+"px";
                    //cEl.movetofrontdiv.style.left = parseInt(cEl.style.width) - 70 + "px";
                    //cEl.movetofrontdiv.style.top = parseInt(cEl.style.height) - 100 + "px"; //bottomleft

                    let imgmovetofront = document.createElement("IMG");
                    imgmovetofront.style.zIndex = "9000000";
                    imgmovetofront.src = '../../../../../assets/images/cursor_bring_to_front.png';
                    imgmovetofront.id = "imgremove";
                    imgmovetofront.disabled = true;
                    imgmovetofront.draggable = false;
                    imgmovetofront.contentEditable = false;
                    cEl.movetofrontdiv.appendChild(imgmovetofront);
                    cEl.movetofrontdiv.contentEditable = false;

                    cEl.insertBefore( cEl.movetofrontdiv, cEl.firstChild );
                    //cEl.appendChild(cEl.removediv);

                    cEl.movetofrontdiv.addEventListener("mousedown", function (e) {

                        //KLAAS ADAPT -> prevent default drag and drop.
                        e.preventDefault ? e.preventDefault() : e.returnValue = false

                        //alert('test');
                        //$(".pptx2html [style*='absolute']").css({'borderStyle': 'dashed dashed dashed dashed', 'borderColor': '#33cc33'});
                        let index_highest = cEl.style.zIndex;
                        $(".pptx2html [style*='absolute']").each(function() {
                        var index_current = parseInt($(this).css("zIndex"), 10);
                            if(index_current > index_highest) {
                                index_highest = index_current;
                            }
                        });
                        cEl.style.zIndex = index_highest + 10;
                    });

                    //===============KLAAS -> for resize button
                    cEl.resizediv = document.createElement("div");
                    cEl.resizediv.style.position = "absolute";
                    cEl.resizediv.id = "resizediv";
                    cEl.resizediv.className = "resizediv";
                    cEl.resizediv.style.width = "50px";
                    cEl.resizediv.style.height = "50px";
                    cEl.resizediv.style.zIndex = "9000000";
                    let imgresize = document.createElement("IMG");
                    imgresize.style.position = "absolute";
                    imgresize.style.zIndex = "9000000";
                    imgresize.src = '../../../../../assets/images/cursor_resize_arrow.png';
                    imgresize.disabled = true;
                    imgresize.draggable = false;
                    imgresize.contentEditable = false;
                    imgresize.id = "imgresize";
                    //imgresize.style.width = "50px";
                    //imgresize.style.height = "50px";
                    cEl.resizediv.appendChild(imgresize);
                    cEl.resizediv.contentEditable = false;
                    //cEl.insertAfter( cEl.resizediv, cEl.lastChild );
                    //position resize icon to bottom right of parent element
                    cEl.appendChild(cEl.resizediv);
                    //cEl.resizediv.style.left = parseInt(cEl.style.left) + parseInt(cEl.style.width) + "px";
                    //assign to bottom right of parent div
                    cEl.resizediv.style.left = parseInt(cEl.style.width) - 70 + "px";
                    cEl.resizediv.style.top = parseInt(cEl.style.height) - 50 + "px";
                    //alert(cEl.resizediv.style);
                    //cEl.resizediv.style.right = (cEl.style.right) + "px";
                    //alert(cEl.style.right + "px");
                    //alert(temp + "px");

                    //resize mousehandlers
                    cEl.resizediv.addEventListener("mousedown", function (e) {
                        //edition warning
                        window.onbeforeunload = () => {
                          return 'If you don\'t save the slide, it won\'t be updated. ' +
                            'Are you sure you want to exit this page?';
                        };

                        //fix to prevent scrolling
                        $('.pptx2html').css('overflow', 'hidden');
                        //$('.pptx2html').css('height', '100%');
                        $('body').css('overflow', 'hidden');
                        //$('body').css('height', '100%');

                        //move element to front to prevent conflict with handlers on elements with larger z-index (which then trigger)
                        cEl.style.zIndex = cEl.style.zIndex + 9000000;

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

                        //restore fix to prevent scrolling
                        $('.pptx2html').css('overflow', '');
                        //$('.pptx2html').css('height', '');
                        $('body').css('overflow', '');
                        //$('body').css('height', '');

                        //restore z-index - element was moved to front - to prevent conflict with handlers on elements with larger z-index (which then trigger)
                        cEl.style.zIndex = cEl.style.zIndex - 9000000;

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
                                //TODO: also prevent drag outside right side of pptx2html window
                                if ((cEl._simpleDraggable.elPos.x + ( e.clientX - cEl._simpleDraggable.mousePos.x)  / options.ratio ) > 0)
                                {
                                    cEl.style.left = (cEl._simpleDraggable.elPos.x + ( e.clientX - cEl._simpleDraggable.mousePos.x)  / options.ratio )  + "px";
                                }
                                //console.log(e.clientY - cEl._simpleDraggable.mousePos.y);
                            }

                            // move only on x axis
                            if (!options.onlyX) {
                                // use variable scale factor calculated from slide edit component size
                                //TODO: also prevent drag outside bottom of of pptx2html window
                                if ((cEl._simpleDraggable.elPos.y +  ( e.clientY - cEl._simpleDraggable.mousePos.y)  / options.ratio ) > 0)
                                {
                                    cEl.style.top = (cEl._simpleDraggable.elPos.y +  ( e.clientY - cEl._simpleDraggable.mousePos.y)  / options.ratio )  + "px";
                                }
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
                                //TODO: prevent resize outside left and right of pptx2html window
                                // compare mouse position?
                                cEl.style.width = (cEl._simpleDraggable.elDim.w  + ( e.clientX - cEl._simpleDraggable.mousePos.x)  / options.ratio )   + "px";
                            }

                            // resize only on x axis
                            if (!options.onlyX) {
                                ////calculate height as well:
                                //cEl.style.top = (cEl._simpleDraggable.elPos.y) + "px";
                                //console.log(e.clientY - cEl._simpleDraggable.mousePos.y);
                                //console.log(cEl.style.height);
                                // use variable scale factor calculated from slide edit component size
                                //TODO: prevent resize outside top and bottom of pptx2html window
                                // compare mouse position?
                                cEl.style.height = ((cEl._simpleDraggable.elDim.h + (e.clientY - cEl._simpleDraggable.mousePos.y) / options.ratio )  ) + "px";
                                //console.log(((cEl._simpleDraggable.elDim.w + e.clientY - cEl._simpleDraggable.mousePos.y) * 2) + "px");
                                //console.log(cEl.style.height);
                            }
                            //cEl.style.transform = 'scale(0.5)';
                            //move resize button with resized borders of element
                            cEl.resizediv.style.left = parseInt(cEl.style.width) - 70 + "px";
                            cEl.resizediv.style.top = parseInt(cEl.style.height) - 50 + "px";
                            //move remove button with resized borders of absolute element
                            cEl.removediv.style.left = parseInt(cEl.style.width) - 50 + "px";
                            cEl.sendtobackdiv.style.top = parseInt(cEl.style.height) - 50 + "px"; //bottomleft
                            cEl.movetofrontdiv.style.top = parseInt(cEl.style.height) - 100 + "px"; //bottomleft
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
            		//cEl.removeChild(cEl.dragdiv);
                    //cEl.removeChild(cEl.removediv);
                    //cEl.removeChild(cEl.resizediv);
                    $('.dragdiv').remove();
                    $('.removediv').remove();
                    $('.resizediv').remove();
                    $('.movetofrontdiv').remove();
                    $('.sendtobackdiv').remove();
                });
            }

            })(allElms[i])
        }
    };

    // export the function
    window.SimpleDraggable = SimpleDraggable;
})(window);
