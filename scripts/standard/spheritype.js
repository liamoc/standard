/* 
Spheritype v1.1 

Allows for advanced Object Oriented Programming in Sphere 1.13 JS. Also includes a library registry function.

Developed by Kamatsu, based on the Base library by Dean Edwards.

License: http://creativecommons.org/licenses/LGPL/2.1/

This library will later be released under the MIT license as soon as Dean changes it.
*/

// This file is included as part of Kamatsu's Class Library v0.41 and later.

/* Changelog:

   1.0 - Initial Release
   1.1 - Added Library Registry

*/




var Class = function() { };



Class.prototype = {
	extend: function(source, value) {
		var extend = Class.prototype.extend;
		if (arguments.length == 2) {
			var ancestor = this[source];
			
			if ((ancestor instanceof Function) && (value instanceof Function) &&
				ancestor.valueOf() != value.valueOf() && /\bbase\b/.test(value)) {
				var method = value;
				value = function() {
					var previous = this.base;
					this.base = ancestor;
					var returnValue = method.apply(this, arguments);
					this.base = previous;
					return returnValue;
				};
				value.valueOf = function() {
					return method;
				};
				value.toString = function() {
					return String(method);
				};
			}
			return this[source] = value;
		} else if (source) {
			var _prototype = {toSource: null};
			var _protected = ["toString", "valueOf"];
			if (Class._prototyping) _protected[2] = "constructor";
			for (var i = 0; (name = _protected[i]); i++) {
				if (source[name] != _prototype[name]) {
					extend.call(this, name, source[name]);
				}
			}
			for (var name in source) {
				if (!_prototype[name]) {
					extend.call(this, name, source[name]);
				}
			}
		}
		return this;
	},

	base: function() {
	}
};

Class.extend = function(_instance, _static) {
	var extend = Class.prototype.extend;
	if (!_instance) _instance = {};
	// build the prototype
	Class._prototyping = true;
	var _prototype = new this;
	extend.call(_prototype, _instance);
	var constructor = _prototype.constructor;
	_prototype.constructor = this;
	delete Class._prototyping;
	// create the wrapper for the constructor function
	var klass = function() {
		if (!Class._prototyping) constructor.apply(this, arguments);
		this.constructor = klass;
	};
	klass.prototype = _prototype;
	// build the class interface
	klass.extend = this.extend;
	klass.implement = this.implement;
	klass.toString = function() {
		return String(constructor);
	};
	extend.call(klass, _static);
	var object = constructor ? klass : _prototype;
	if (object.init instanceof Function) object.init();
	return object;
};

Class.implement = function(_interface) {
	if (_interface instanceof Function) _interface = _interface.prototype;
	this.prototype.extend(_interface);
};


var LibraryRegistry = Class.extend({

    constructor: null,
    
    addLibraryData: function (library, version) { 
        this.libraries.push([library,version]);
    },
    
    isLibraryInstalled: function (library, version, strict) {
        for (var i=0;i<this.libraries.length;i++) {
            if (strict) {
                if (this.libraries[i][0] == library && this.libraries[i][1] == version) {
                    return true;
                    break;
                }
                
            }
            else {
                if (this.libraries[i][0] == library && this.libraries[i][1] >= version) {
                    return true;
                    break;
                }
            }
        }
        return false;
    
    },
    
    abortIfNotInstalled: function (library,version,strict) {
        if (!this.isLibraryInstalled(library,version,strict)) Abort("Library " + library + " not found, or incorrect version is installed.");
    
    },
    
    getLibraryVersion: function (library) {
        for (var i=0;i<this.libraries.length;i++) {
            if (this.libraries[i][0] == library) {
                return this.libraries[i][1];
                break;
            }
        
        }
        return false;
    },
    
    libraries: new Array()
    
    

});
LibraryRegistry.addLibraryData('Spheritype',1.1);    