this.keyboardHandlerComplex = function(context) {
    this.context = context;
    var that = this;
    this.lastDeltaX = 0;
    this.e1 = [0,0];
    this.e2 = [100,100];

    that.MouseWheelHandler = function(e) {
        if (that.context.shiftPressed && that.context.currentUniforms.mobiusEffectsOnOff.value == 1) {
            console.log(e.deltaX, e.deltaY, e.deltaZ, that.lastDeltaX);
            if (e.deltaX < that.lastDeltaX)
                that.zoom(.8);
            else
                that.zoom(1.25);
            that.lastDeltaX = e.deltaX;
            e.preventDefault();
        }
    }

    this.animate = function() {
        if (that.context.ctrlPressed)
            that.setLoxoPoint(that.context.cameraLookAt[0],that.context.cameraLookAt[1]);
    }

    var sq = document.getElementsByTagName("BODY")[0];
	if (sq.addEventListener) {
		sq.addEventListener("mousewheel", that.MouseWheelHandler, false);
		sq.addEventListener("DOMMouseScroll", that.MouseWheelHandler, false);
	}
	else sq.attachEvent("onmousewheel", that.MouseWheelHandler);

    that.setUniformsFromPoints = function() {
        that.context.currentUniforms.e1x.value = that.e1[0];
        that.context.currentUniforms.e1y.value = that.e1[1];
        that.context.currentUniforms.e2x.value = that.e2[0];
        that.context.currentUniforms.e2y.value = that.e2[1];
    }

    that.handleSequence = function(seq, codes) {
        var opts = seq.substring(1);
        that.context.currentUniforms.showFixedPoints.value = 0;
        switch (seq[0]) {
            case '1':
                that.context.currentUniforms.mobiusEffectsOnOff.value = 1
                that.e1 = [that.context.cameraLookAt[0], that.context.cameraLookAt[1]];
                that.setUniformsFromPoints();
                break;
            case '2':
                that.context.currentUniforms.mobiusEffectsOnOff.value = 1
                that.e2 = [that.context.cameraLookAt[0], that.context.cameraLookAt[1]];
                break;
            case 'Q':   // RESET
                that.context.currentUniforms.mobiusEffectsOnOff.value = 0;
                that.e1 = [0,0];
                that.e2 = [100,100];
                that.setLoxoPoint(1,0);
                break;
            case 'G':   // GIANT PLANET
                that.context.currentUniforms.mobiusEffectsOnOff.value = 1
                that.e1 = [0,0];
                that.e2 = [100,100];
                that.setUniformsFromPoints();
                that.zoom(.8);
                that.context.lookAtComplex(100,100);
                break;
            case 'T':   // TINY PLANET
                that.context.currentUniforms.mobiusEffectsOnOff.value = 1
                that.e1 = [0,0];
                that.e2 = [100,100];
                that.setUniformsFromPoints();
                that.zoom(1.25);
                that.context.lookAtComplex(0,0);
               break;
        }
    }
    this.zoomAmount = 1;
    this.zoom = function(factor) {
        console.log("Zoom factor = ", factor);
        if (that.zoomAmount * factor > 50) factor = 1;
        if (that.zoomAmount * factor < .05) factor = 1;
        that.zoomAmount *= factor;
        that.setLoxoPoint(
            that.context.currentUniforms.loxodromicX.value * factor,
            that.context.currentUniforms.loxodromicY.value * factor);
    }
    this.setLoxoPoint = function(x,y) {
        that.context.currentUniforms.loxodromicX.value = x;
        that.context.currentUniforms.loxodromicY.value = y;
        console.log("loxo point = " + that.context.currentUniforms.loxodromicX.value + "," + that.context.currentUniforms.loxodromicY.value);
    }
}
