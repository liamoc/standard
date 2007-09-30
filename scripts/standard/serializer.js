/*
 * Serializer - by engine #100
 * ==========
 * Serializer serializes objects to file. Then reads them back.
 * Version 1.2 / 29 July 2007
 */

 
// Serializer modes

SERIALIZER_MODE_WRITE = 1;
SERIALIZER_MODE_READ = 2;
 
// Signatures.

SERIALIZER_SIG_SHORT    = 0x10;    // A short (2 byte) number
SERIALIZER_SIG_INT      = 0x11;    // An int (4 byte) number
SERIALIZER_SIG_BIGINT   = 0x12;    // A bit int. Stored as a string.
SERIALIZER_SIG_FLOAT    = 0x13;    // A float. Stored as a string.
SERIALIZER_SIG_STRING   = 0x14;    // A string.
SERIALIZER_SIG_REGEXP   = 0x15;    // A regular expression object.
SERIALIZER_SIG_BOOLEAN_FALSE  = 0x16;    // A boolean false.
SERIALIZER_SIG_BOOLEAN_TRUE   = 0x17;    // A boolean true.
SERIALIZER_SIG_DATE     = 0x18;
SERIALIZER_SIG_ARRAY    = 0x20;    // An array.
SERIALIZER_SIG_OBJECT   = 0x21;    // A generic object.
SERIALIZER_SIG_FUNCTION = 0x30;    // A function.
SERIALIZER_SIG_CUSTOM   = 0x80;    // A custom object.

// Creates a new Serializer object.

var Serializer = Class.extend({

	// The path
	path: false,

	// The mode this Serializer is in.
	mode: false,
	
	// The raw_file we're working with.
	file: false,
	
	// Self.
	self: false,
	
	customTypes: [],
	
	// Serializer version bytes. 2 major, 2 minor.
	versionBytes: CreateByteArray(4),
	
	constructor: function(path)
	{
		// This is version 1.2
		this.versionBytes[0] = 0x00;
		this.versionBytes[1] = 0x01;
		this.versionBytes[2] = 0x00;
		this.versionBytes[3] = 0x02;
		this.self = this;
		this.path = path;
	},
	
	// Write an object to the file. This sets the mode to SERIALIZER_MODE_WRITE.
	write : function(object)
	{
		if (this.mode == SERIALIZER_MODE_READ)
		{
			throw new SerializerException("Cannot write to a Serializer in read mode.");
		}
		if (!this.mode)
		{
			this.mode = SERIALIZER_MODE_WRITE;
			this.file = new SerializerFileWrapper(this.path, true);
			this.writeFileSignature();
		}
		this.writeObject(object);
	},
	
	// Read an object from the file. This sets the mode to SERIALIZER_MODE_READ.
	read : function()
	{
		if (this.mode == SERIALIZER_MODE_WRITE)
		{
			throw new SerializerException("Cannot read from a Serializer in write mode.");
		}
		if (!this.mode)
		{
			this.mode = SERIALIZER_MODE_READ;
			this.file = new SerializerFileWrapper(this.path);
			this.checkFileSignature();
		}
		return this.readObject();
	},
	
	close : function()
	{
		this.file.close();
	},
	
	// Writes a file signature.
	writeFileSignature: function()
	{
		// signature is 8 bytes
		// 4 bytes "E1S0"
		var sig = CreateByteArrayFromString("E1S0").concat(this.versionBytes);
		this.file.write(sig);
	},
	
	// Writes an object recursively.
	writeObject: function(object)
	{
		if (object.save)
		{
			this.writeCustom(object);
			return;
		}
		switch (object.constructor)
		{
			case Number:
				this.writeNumber(object);
				break;
			case String:
				this.writeString(object);
				break;
			case Array:
				this.writeArray(object);
				break;
			case RegExp:
				this.writeRegExp(object);
				break;
			case Object:
				this.writeFObject(object);
				break;
			case Function:
				this.writeFunction(object);
				break;
			case Boolean:
				this.writeBoolean(object);
				break;
			case Date:
				this.writeDate(object);
				break;
			default:
				if (object instanceof Object)
				{
					this.writeFObject(object);
				}
				else
				{
					throw new SerializableException("Unserializable object passed.");
				}
				break;
		}
	},
	
	writeNumber: function(object)
	{
		// Is this number a floating point number?
		if (Math.floor(object) != object)
		{
			// We can only store this as a string since I'm not going to write
			// something to do it in IEEE
			writeFloat(object);
		}
		else
		{
			// How BIG is this number?

			var abs = Math.abs(object);
			
			// Store negative numbers as BigInts because fuck JavaScript and bit fiddling
			if (object < 0)
			{
				this.writeBigInt(object);
			}
			if (abs <= 0xFFFF)
			{
				this.writeShort(object);
			}
			
			else if (abs <= 16777215)
			{
				this.writeInt(object);
			}
			
			else
			{
				this.writeBigInt(object);
			}
		}
	},
	
	// Write a short.
	writeShort: function(object)
	{
		var bytes = CreateByteArray(3);
		
		bytes[0] = SERIALIZER_SIG_SHORT;
		bytes[1] = (object & 0xff00) >> 8;
		bytes[2] = (object & 0x00FF);
		
		this.file.write(bytes);
	},
	
	// Write an integer.
	writeInt: function(object)
	{
		var bytes = CreateByteArray(5);
		
		bytes[0] = SERIALIZER_SIG_INT;
		bytes[1] = (object & 0xff000000) >> 24;
		bytes[2] = (object & 0x00FF0000) >> 16;
		bytes[3] = (object & 0x0000FF00) >> 8;
		bytes[4] = (object & 0x000000FF);
		
		this.file.write(bytes);
	},
	
	// Write a very large integer.
	writeBigInt: function(object)
	{
		var bytes = CreateByteArray(1);
		bytes[0] = SERIALIZER_SIG_BIGINT;
		this.file.write(bytes);
		this.writeRawString(object.toString());
	},
	
	// This is used in multiple places, so it's seperate from writeString.
	writeRawString: function(string)
	{
		this.writeNumber(string.length);
		var bytes = CreateByteArray(string.length);
		for (var i = 0; i < string.length; i++)
		{
			bytes[i] = string.charCodeAt(i);
		}
		this.file.write(bytes);
	},
	
	// Writes a string
	writeString: function(object)
	{
		var bytes = CreateByteArray(1);
		bytes[0] = SERIALIZER_SIG_STRING;
		this.file.write(bytes);
		this.writeRawString(object);
	},
	
	// Writes an array
  writeArray: function(object)
	{
		var bytes = CreateByteArray(1);
		bytes[0] = SERIALIZER_SIG_ARRAY;
		this.file.write(bytes);
		this.writeNumber(object.length);
		for (var i = 0; i < object.length; i++)
		{
			this.writeObject(object[i]);
		}
	},
	
	writeDate: function(object)
	{
		var bytes = CreateByteArray(1);
		bytes[0] = SERIALIZER_SIG_DATE;
		this.file.write(bytes);
		this.writeNumber(object.getTime());
	},
	
	writeRegExp: function(object)
	{
		var bytes = CreateByteArray(1);
		bytes[0] = SERIALIZER_SIG_REGEXP;
		this.file.write(bytes);
		this.writeRawString(object.toSource());
	},
	
	writeBoolean: function(object)
	{
		var bytes = CreateByteArray(1);
		if (object)
		{
			bytes[0] = SERIALIZER_SIG_BOOLEAN_TRUE;
		}
		else
		{
			bytes[0] = SERIALIZER_SIG_BOOLEAN_FALSE;
		}
		this.file.write(bytes);
	},
	
	// Writes an object
	writeFObject: function(object)
	{
		var bytes = CreateByteArray(1);
		bytes[0] = SERIALIZER_SIG_OBJECT;
		this.file.write(bytes);
		// Hack. Why can't these things have a count property?
		var object_count = 0;
		for (var item in object)
			object_count++;
			
		this.writeNumber(object_count);
		for (var item in object)
		{
			this.writeRawString(item);
			this.writeObject(object[item]);
		}
	},
	
	// Writes a function
	writeFunction: function(object)
	{
		var bytes = CreateByteArray(1);
		bytes[0] = SERIALIZER_SIG_FUNCTION;
		this.file.write(bytes);
		
		var source = object.toSource();
		// Is this native?
		if ((/function (.*) \{\[native code\]\}/i).test(source))
		{
			throw new SerializerException("Cannot serialize native code.");
		}
		
		this.writeRawString(source);
	},
	
	// Writes a custom object.
	writeCustom: function(object)
	{
		var bytes = CreateByteArray(1);
		bytes[0] = SERIALIZER_SIG_CUSTOM;
		this.file.write(bytes);
		// Can't get the constructor name properly, let's regex it outta there!
	
			var name = object.className;
			if (this.customTypes.contains(name))
			{
				this.writeBoolean(true);
				this.writeNumber(this.customTypes.indexOf(name));
			}
			else
			{
				this.writeBoolean(false);
				this.writeRawString(name);
				this.customTypes.push(name);
			}
			object.save(this.self);
	},
	
	checkFileSignature: function()
	{
		var sig_str = CreateStringFromByteArray(this.file.read(4));
		if (sig_str != "E1S0")
		{
			throw new SerializerException("Incorrect file signature.");
		}
		var sig_ver = this.file.read(4);
		if (!this.checkVersion(sig_ver))
		{
			throw new SerializerException("Incorrect file version.");
		}
	},
	
	checkVersion: function(v)
	{
		for (var i = 0; i < v.length; i++)
		{
			if (v[i] != this.versionBytes[i]) return false;
		}
		return true;
	},
	
	readObject: function()
	{
		// get object type
		var type = this.file.read(1)[0];
		switch (type)
		{
			case SERIALIZER_SIG_SHORT:
				return this.readShort();
			case SERIALIZER_SIG_INT:
				return this.readInt();
			case SERIALIZER_SIG_BIGINT:
				return this.readBigInt();
			case SERIALIZER_SIG_FLOAT:
				return this.readFloat();
			case SERIALIZER_SIG_STRING:
				return this.readString();
			case SERIALIZER_SIG_REGEXP:
				return this.readRegExp();
			case SERIALIZER_SIG_ARRAY:
				return this.readArray();
			case SERIALIZER_SIG_OBJECT:
				return this.readFObject();
			case SERIALIZER_SIG_FUNCTION:
				return this.readFunction();
			case SERIALIZER_SIG_CUSTOM:
				return this.readCustom();
			case SERIALIZER_SIG_BOOLEAN_FALSE:
				return false;
			case SERIALIZER_SIG_BOOLEAN_TRUE:
				return true;
			case SERIALIZER_SIG_DATE:
				return this.readDate();
			default:
				throw new SerializerException("Corrupt stream.");
		}
	},
	
	readNumber: function()
	{
		var type = this.file.read(1)[0];
		switch (type)
		{
			case SERIALIZER_SIG_SHORT:
				return this.readShort();
			case SERIALIZER_SIG_INT:
				return this.readInt();
			case SERIALIZER_SIG_BIGINT:
				return this.readBigInt();
		}
	},
	
	readShort: function()
	{
		var bytes = this.file.read(2);
		return (bytes[0] << 8) | bytes[1];
	},
	
	readInt: function()
	{
		var bytes = this.file.read(4);
		return (bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3];
	},
	
	readBigInt: function()
	{
		return parseInt(this.readString());
	},
	
	readFloat: function()
	{
		return parseFloat(this.readString());
	},
	
	readString: function()
	{
		var length = this.readNumber();
		return CreateStringFromByteArray(this.file.read(length));
	},
	
	readDate: function()
	{
		var date = this.readNumber();
		return new Date(date);
	},
	
	readRegExp: function()
	{
		var str = this.readString();
		var pattern = str.substring(1, str.lastIndexOf("/"));
		var flags = str.substring(str.lastIndexOf("/") + 1);
		return new RegExp(pattern, flags);
	},
	
	readArray: function()
	{
		var length = this.readNumber();
		var array = [];
		for (var i = 0; i < length; i++)
		{
			array.push(this.readObject());
		}
		
		return array;
	},
	
	readFObject: function()
	{
		var length = this.readNumber();
		var obj = {};
		for (var i = 0; i < length; i++)
		{
			var n = this.readString();
			obj[n] = this.readObject();
		}
		return obj;
	},
	
	readFunction: function()
	{
		return eval(this.readString());
	},
	
	readCustom: function()
	{
		var c_type = this.readObject();
		if (c_type)
		{
			var constructor = this.customTypes[this.readObject()];
		}
		else
		{
			var constructor = this.readString();
			this.customTypes.push(constructor);
		}
		var c = eval(constructor);
		var o = c.load(this.self);
		return o;
	}
});

SerializerException = Class.extend({
	message: false,
	constructor: function(message)
	{
		this.message = message;
	}
});

SerializerFileWrapper = Class.extend({
	file: false,
	
	constructor: function(path, write)
	{
		this.file = OpenRawFile(path, write || false);
	},
	
	write : function(bytearray)
	{
		if (SerializerFileWrapper.writeFilter)
		{
			bytearray = SerializerFileWrapper.writeFilter(bytearray);
		}
		
		this.file.write(bytearray);
	},
	
	read : function(len)
	{
		if (SerializerFileWrapper.readFilter)
		{
			return SerializerFileWrapper.readFilter(this.file.read(len));
		}
		
		return this.file.read(len);
	},
	
	close : function()
	{
		this.file.close();
	}
});

SerializerFileWrapper.writeFilter = false;
SerializerFileWrapper.readFilter = false;

var SerializedImage = Class.extend({
	constructor: function(fn) { this.filename = fn; },
	
	save: function(s)
	{
		s.writeRawString(this.filename);
	},
	className: "SerializedImage"
});

SerializedImage.load = function(s)
{
	return Cache.getImage(s.readString());
}