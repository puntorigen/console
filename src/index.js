/**
* Console: A class to help display information in the console.<br/><small>Note: You need to pass all arguments as an Object with keys.</small>
* @name 	console
* @module 	console
**/
export default class console {

	constructor({ config }={}) {
		let def_config = {
			silent:false,
			prefix:''
		};
		this.config = {...config, ...def_config};
	}

	/**
	* Sets visibility output
	* @param 		{Boolean}	value 	- if true, hides all output
	*/
	setSilent({ value=this.throwIfMissing('value') }={}) {
		this.config.silent = value;
	}

	/**
	* Sets output prefix
	* @param 		{String}	[prefix]	- prefix
	* @param 		{String}	[color]		- black,red,green,yellow,blue,purple,cyan,white
	*/
	setPrefix({ prefix,color }={}) {
		if (prefix) this.config.prefix=prefix;
		if (color && this.config.prefix!='') {
			let txt = `[${this.config.prefix}] `;
			let colors = require('colors/safe');
			this.config.prefix = colors[color](txt);
		} else {
			this.config.prefix = `[${this.config.prefix}] `;
		}
	}

	/**
	* Clears the console screen
	*/
	clear() {
		let clearConsole = require('clear-any-console');
		clearConsole();
	}

	/**
	* Output a message to the console screen, with an optional var with data
	* @param 		{String}	message		- message to output
	* @param 		{Object}	[data]		- var dump to include in output
	* @param 		{String}	[color]		- black,red,green,yellow,blue,purple,cyan,white
	*/
	out({ message=this.throwIfMissing('message'),data,color }={}) {
		let msg = message, colors = require('colors/safe');
		if (!this.config.silent) {
			if (color && msg!='') {
				if (color in colors) {
					console.log(this.config.prefix + colors[color](msg));
				} else {
					console.log(this.config.prefix + msg);
				}
			} else if (msg.indexOf('error:')!=-1) {
				console.error(this.config.prefix + colors.red(msg));
			}
			// data output
			if (data) {
				console.log('console.out():var=',data);
			}
		}
	}

	/**
	* Output a message to the console screen with timestamp, and an optional var with data
	* @param 		{String}	message		- message to output
	* @param 		{Object}	[data]		- var dump to include in output
	* @param 		{String}	[color]		- black,red,green,yellow,blue,purple,cyan,white
	*/
	outT({ message=this.throwIfMissing('message'),data,color }={}) {
		let msg = message, colors = require('colors/safe');
		if (!this.config.silent) {
			// timestamp prefix
			let d = new Date();
			let hr = d.getHours();
			if (hr < 10) {
			    hr = "0" + hr;
			}
			let min = d.getMinutes();
			if (min < 10) {
			    min = "0" + min;
			}
			let sec = d.getSeconds();
			if (sec < 10) {
			    sec = "0" + sec;
			}
			let timeStamp = `[${hr}:${min}:${sec}]: ${msg.trim()}`;
			// output
			if (data && color) {
				this.out({ message:timeStamp, data:data, color:color });
			} else if (data) {
				this.out({ message:timeStamp, data:data });
			} else if (color) {
				this.out({ message:timeStamp, color:color });
			} else {
				this.out({ message:timeStamp });
			}
		}
	}

	/**
	* Displays the given text as a title
	* @param 		{String}	title			- title to display
	* @param 		{String}	[color=white]	- color for box borders.
	* @param 		{String}	[titleColor]	- color for title. If undefined, uses the box color.
	* @param 		{Object}	[config]				- config overwrite params for boxen.
	* @param 		{String} 	[config.align=center]	- aligns the title by its value: left,center,right
	*/

	title({ title=this.throwIfMissing('title'), color, titleColor, config={} }={}) {
		const box = require('boxen'), colors = require('colors/safe');
		let textc = (titleColor)?titleColor:color;
		let resp = box(colors[textc](title),{
			borderColor:color,
			align:'center',
			padding: {
	    		left:2,
	    		right:2
	    	},
	    	borderStyle: {
	    		topLeft: '*',
	    		topRight: '*',
	    		bottomLeft: '*',
	    		bottomRight: '*',
	    		horizontal: '*',
	    		vertical: '*'
	    	}
		,...config});
		console.log(resp);
	}
	/**
	* Shows data array as table in the console
	* @param 		{String}	title			title for table
	* @param 		{Array}		data			array of objects for building the table.
	* @param 		{String}	[struct_sort]	sort data before displaying. Supports: field asc/desc.
	* @param 		{String}	[color]			color for table.
	*/
	table({ title=this.throwIfMissing('title'),data=this.throwIfMissing('data'),struct_sort,color }={}) {
		let info = data, colors = require('colors/safe');
		if (struct_sort) {
			let sortObjectsArray = require('sort-objects-array');
			if (struct_sort.split(' ').length>1) {
				// field desc, field asc
				info = sortObjectsArray(data, struct_sort.split(' ')[0], struct_sort.split(' ')[1]);
			} else {
				info = sortObjectsArray(data, struct_sort);
			}
		}
		let asciiTable = require('ascii-table');
		let table = new asciiTable(title);
		// heading
		let cols = Object.keys(info[0]);
		table.setHeading(cols);
		// data
		for (let row in info) {
			let jdata = [];
			for (let col in cols) {
				jdata.push(info[row][cols[col]]);
			}
			table.addRow(jdata).setJustify(true);
 		}
		//
		if (color) {
			console.log(colors[color](table.render()));
		} else {
			console.log(table.toString());
		}
	}

	// ********************
	// private methods
	// ********************

	throwIfMissing(name) {
        throw new Error('Missing '+name+' parameter!');
    }

}