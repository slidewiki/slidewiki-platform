//const _order = 1;
let _order = 1;

"use strict";
//module.exports = {
//function tXml(S) {
class tXml {
    constructor (S)
    {
        this.S = S;
        this.openBracket = "<";
        this.openBracketCC = "<".charCodeAt(0);
        this.closeBracket = ">";
        this.closeBracketCC = ">".charCodeAt(0);
        this.minus = "-";
        this.minusCC = "-".charCodeAt(0);
        this.slash = "/";
        this.slashCC = "/".charCodeAt(0);
    	this.exclamation = '!';
    	this.exclamationCC = '!'.charCodeAt(0);
    	this.singleQuote = "'";
    	this.singleQuoteCC = "'".charCodeAt(0);
    	this.doubleQuote = '"';
    	this.doubleQuoteCC = '"'.charCodeAt(0);
    	this.questionMark = '?';
    	this.questionMarkCC = '?'.charCodeAt(0);

    	/**
         *    returns text until the first nonAlphebetic letter
         */
        this.nameSpacer = "\r\n\t>/= ";

    	this.pos = 0;

        //from end of file
        this._order = 1;

        //return this.simplefy(this.parseChildren());
        //return simplefy(parseChildren());
    }


    /**
     * Parsing a list of entries
     */
    parseChildren() {
        var children = [];
        while (this.S[this.pos]) {
            if (this.S.charCodeAt(this.pos) == this.openBracketCC) {
                if (this.S.charCodeAt(this.pos+1) === this.slashCC) { // </
                    //while (this.S[this.pos]!=='>') { this.pos++; }
                    this.pos = this.S.indexOf(this.closeBracket, this.pos);
                    return children;
                } else if (this.S.charCodeAt(this.pos+1) === this.exclamationCC) { // <! or <!--
                    if (this.S.charCodeAt(this.pos+2) == this.minusCC) {
						// comment support
                        while (!(this.S.charCodeAt(this.pos) === this.closeBracketCC && this.S.charCodeAt(this.pos-1) == this.minusCC &&
								this.S.charCodeAt(this.pos-2) == this.minusCC && this.pos != -1)) {
							this.pos = this.S.indexOf(this.closeBracket, this.pos+1);
						}
                        if (this.pos === -1) {
							this.pos = this.S.length;
						}
                    } else {
						// doctype support
                        this.pos += 2;
                        for (; this.S.charCodeAt(this.pos) !== this.closeBracketCC; this.pos++) {}
                    }
                    this.pos++;
                    continue;
                } else if (this.S.charCodeAt(this.pos+1) === this.questionMarkCC) { // <?
					// XML header support
					this.pos = this.S.indexOf(this.closeBracket, this.pos);
					this.pos++;
                    continue;
				}
				this.pos++;
				var startNamepos = this.pos;
				for (; this.nameSpacer.indexOf(this.S[this.pos]) === -1; this.pos++) {}
				var node_tagName = this.S.slice(startNamepos, this.pos);

				// Parsing attributes
				var attrFound = false;
				var node_attributes = {};
				for (; this.S.charCodeAt(this.pos) !== this.closeBracketCC; this.pos++) {
					var c = this.S.charCodeAt(this.pos);
					if ((c > 64 && c < 91) || (c > 96 && c < 123)) {
						startNamepos = this.pos;
						for (; this.nameSpacer.indexOf(this.S[this.pos]) === -1; this.pos++) {}
						var name = this.S.slice(startNamepos, this.pos);
						// search beginning of the string
						var code = this.S.charCodeAt(this.pos);
						while (code !== this.singleQuoteCC && code !== this.doubleQuoteCC) {
							this.pos++;
							code = this.S.charCodeAt(this.pos);
						}

						var startChar = this.S[this.pos];
						var startStringpos= ++this.pos;
						this.pos = this.S.indexOf(startChar, startStringpos);
						var value = this.S.slice(startStringpos, this.pos);
						if (!attrFound) {
							node_attributes = {};
							attrFound = true;
						}
						node_attributes[name] = value;
					}
				}

				// Optional parsing of children
				if (this.S.charCodeAt(this.pos-1) !== this.slashCC) {
					this.pos++;
					var node_children = this.parseChildren();
				}

                children.push({
					"children": node_children,
					"tagName": node_tagName,
					"attrs": node_attributes
				});

            } else {
				var startTextpos = this.pos;
				this.pos = this.S.indexOf(this.openBracket, this.pos) - 1; // Skip characters until '<'
				if (this.pos === -2) {
					this.pos = this.S.length;
				}
                var text = this.S.slice(startTextpos, this.pos + 1);
                if (text.trim().length > 0) {
					children.push(text);
				}
            }
            this.pos++;
        }
        //return children;
        return tXml.simplify(children);
    };


    //tempfunction (children){
    //    return simplify(children);
    //};

    //getXML() {
	//var this._order = 1;
    //return simplefy(parseChildren());
    //return this.simplefy(this.parseChildren());
    //return simplefy(this.parseChildren());
    //}
};

//simplefy(children) {
/**
 * transform the DomObject to an object that is like the object of PHPs simplexmp_load_*() methods.
 * this format helps you to write that is more likely to keep your programm working, even if there a small changes in the XML schema.
 * be aware, that it is not possible to reproduce the original xml from a simplified version, because the order of elements is not saved.
 * therefore your programm will be more flexible and easyer to read.
 *
 * @param {array} the childrenList
 */
tXml.simplify = function simplify(children) {
    var node = {};
    //let node;
    //let node = [];

    if (children === undefined) {
        return {};
    }

    // Text node (e.g. <t>This is text.</t>)
    if (children.length === 1 && typeof children[0] == 'string') {
        //console.log(children[0]);
        //console.log(children.attrs);
        children["attrs"] = children[0];
        //return children[0];
        return children;
    }

    // map each object
    children.forEach(function (child) {

        if (!node[child.tagName]) {
            node[child.tagName] = [];
        }

        if (typeof child === 'object') {
            var kids = simplify(child.children);
            //var kids = tXml.simplify(child.children);
            //var self = this;
            //var kids = _self.simplify(child.children);
            //var kids = this.simplify(child.children);
            //var kids = child.children => tXml.simplefy(child.children);
            //this.simplify.bind(this);
            //let xtemp = new tXml();
            //let kids = xtemp.simplify(child.children);
            //let kids = this.tempfunction(child.children);

            //requestAnimationFrame(this.startAnimate); //this does not work, type error

            //SceneBuddy.prototype.startAnimate = function() {
            //    requestAnimationFrame(this.startAnimate.bind(this));
            //    this.render();
            //};

            if (child.attrs) {
                //console.log(child.attrs);
                kids.attrs = child.attrs;

                //kids.attrs = child.attrs;
                //kids["attrs"] = child.attrs;
                //kids.attrs = child["attrs"];
            }
            //from newer library:
            //if (child.attributes) {
            //    console.log(child.attributes);
            //	kids._attributes = child.attributes;
            //}

            if (kids["attrs"] === undefined) {
                kids["attrs"] = {"order": _order}; //used to be constant
            } else {
                kids["attrs"]["order"] = _order; //used to be constant
            }
            _order++; //used to be constant
            node[child.tagName].push(kids);
        }
    });

    for (var i in node) {
        if (node[i].length == 1) {
            node[i] = node[i][0];
        }
    }

    return node;
};


if ('object' === typeof module) {
    module.exports = tXml;
};
//console.clear();
//console.log('here:',tXml.getElementById('<some><xml id="test">dada</xml><that id="test">value</that></some>','test'));
//console.log('here:',tXml.getElementsByClassName('<some><xml id="test" class="sdf test jsalf">dada</xml><that id="test">value</that></some>','test'));

/*
console.clear();
tXml(d,'content');
 //some testCode
var s = document.body.innerHTML.toLowerCase();
var start = new Date().getTime();
var o = tXml(s,'content');
var end = new Date().getTime();
//console.log(JSON.stringify(o,undefined,'\t'));
console.log("MILLISECONDS",end-start);
var nodeCount=document.querySelectorAll('*').length;
console.log('node count',nodeCount);
console.log("speed:",(1000/(end-start))*nodeCount,'Nodes / second')
//console.log(JSON.stringify(tXml('<html><head><title>testPage</title></head><body><h1>TestPage</h1><p>this is a <b>test</b>page</p></body></html>'),undefined,'\t'));
var p = new DOMParser();
var s2='<body>'+s+'</body>'
var start2= new Date().getTime();
var o2 = p.parseFromString(s2,'text/html').querySelector('#content')
var end2=new Date().getTime();
console.log("MILLISECONDS",end2-start2);
// */
