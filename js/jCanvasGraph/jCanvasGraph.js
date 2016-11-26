$.widget("custom.canvasGraph", {
    
    // default options
    options: {
	    "language" : 'en',
	    "width" : null,
	    "height" : null,
	    "defaultWidth" : 300,
	    "defaultWheight" : 300,
	    "lines" : {},
	    "backgroundColor" : "#000000",
	    "axisEnabled" : true,
	    "axisColor" : "#999999",
	    "axisLineWidth" : 1,
	    "gridEnabled" : true,
	    "gridColor" : "#999999",
	    "gridSize" : 10,
	    "gridLineWidth" : 1,
	    "padding" : 5,
	    "defaultLineColor" : "#ffffff"
    },
    
    // the constructor
    _create: function () {
        
        this.attach();
        this._refresh();
    },
    
    // called when created, and later when changing options
    _refresh : function () {
        
        this.repaint();
        this._trigger("refreshEvent");
    },

    // revert modifications here
    _destroy : function () {
        
        this.detach();
    },

    // _setOptions is called with a hash of all options that are changing
    _setOptions : function () {
        
        this._superApply(arguments);
        this._refresh();
    },

    // _setOption is called for each individual option that is changing
    _setOption : function (key, value) {
        
        switch (key) {
            case "lines":
                this.resize(value,this.options.height);
                break;
            case "width":
                this.resize(value,this.options.height);
                break;
            case "height":
                this.resize(this.options.width,value);
                break;
            default:
                this._super(key,value);
        }
    },
    
    // add the multi select
    attach : function () {
        
        if (!this.element.hasClass("canvasGraph")) {
            this.element.addClass("canvasGraph");
            
            if (this.options.width == null) {
                var width = this.element.width();
                if (width) {
                    this.options.width = width;
                } else {
                    this.options.width = this.options.defaultWidth;
                }
            } else {
                this.element.attr({"width" : this.options.width});
            }
            if (this.options.height == null) {
                var height = this.element.height();
                if (height) {
                    this.options.height = height;
                } else {
                    this.options.height = this.options.defaultHeight;
                }
            } else {
                this.element.attr({"height" : this.options.height});
            }
        }
    },
    
    // remove the multi select
    detach : function () {
        
        this.element.removeClass("canvasGraph");
    },
    
    // resize the multi select
    resize : function (width, height) {
        
        // save width and height
        this.options.width = width;
        this.options.height = height;
    },
    
    // repaint
    repaint : function () {
        
        if (this.element[0].getContext) {
            
            var thisObject = this;
            
            var context = this.element[0].getContext("2d");
            this.paintBackground(context);
            
            $.each(this.options.lines, function (index, line) {
                thisObject.drawLine(context, line);
            });
        }
    },
    
    // paint the background, axis and grid
    paintBackground : function (context) {
	    
	    context.lineWidth = 1;
	    
	    // background
	    context.fillStyle = this.options.backgroundColor;
	    context.fillRect(0,0,this.options.width,this.options.height);
	    
	    // axis
	    if (this.options.axisEnabled) {
	        context.strokeStyle = this.options.axisColor;
	        context.lineWidth = this.options.axisLineWidth;
    	    context.moveTo(this.options.padding,this.options.height - this.options.padding);
    	    context.lineTo(this.options.padding,this.options.padding);
    	    context.moveTo(this.options.padding,this.options.height - this.options.padding);
    	    context.lineTo(this.options.width - this.options.padding,this.options.height - this.options.padding);
    	    context.stroke();
	    }
	    
	    // grid lines
	    if (this.options.gridEnabled) {
	        context.strokeStyle = this.options.gridColor;
	        context.lineWidth = this.options.gridLineWidth;
    	    var graphStepWidth = (this.options.width - this.options.padding * 2) / this.options.gridSize;
    	    var graphStepHeight = (this.options.height - this.options.padding * 2) / this.options.gridSize;
    	    for (var i=1; i<=this.options.gridSize; i++) {
    	        // vertical
    	        context.moveTo(this.options.padding + graphStepWidth * i, this.options.height - this.options.padding + 1);
    	        context.lineTo(this.options.padding + graphStepWidth * i, this.options.padding);
    	        // horizontal
    	        context.moveTo(this.options.padding, this.options.height - (this.options.padding + (i * graphStepHeight)));
    	        context.lineTo(this.options.width - this.options.padding, this.options.height - (this.options.padding + (i * graphStepHeight)));
    	        
    	    }
    	    context.stroke();
	    }
	    
    },
    
    // draws a line by evaluating the function
    drawLine : function (context, line) {
        
        if (line.function != undefined) {
            
            if (line.color == undefined) {
                context.strokeStyle = this.options.defaultLineColor;
            } else {
                context.strokeStyle = line.color;
            }
            
            var graphStepWidth = (this.options.width - (this.options.padding * 2)) / line.resolution;
        	var graphStepHeight = line.range[1] / (this.options.height - (this.options.padding * 2));
        	var rangeStep = line.range[0] / line.resolution;
        	
        	for (var i=0; i<line.resolution; i++) {
        		
        		var value = line["function"](rangeStep * i) * graphStepHeight;
        		
        		if (i == 0) {
        		    context.moveTo(graphStepWidth * i, value);
        		} else {
        		    context.lineTo(graphStepWidth * i, value);
        		}
    		}
    		context.stroke();
    	}
    }
});