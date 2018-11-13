this.keyboardHandlerComplex = function(camera, mediaUtils) {
    this.camera = camera;
    this.mediaUtils = mediaUtils;
    var that = this;
    this.lastDeltaX = 0;
    this.e1 = [0,0];
    this.e2 = [100,100];
    this.cameraLookAt = [1,0];
    this.shiftPressed = false;
    this.setShaderDetails = function(detailsObject) {
        that.detailsObject = detailsObject;
        that.currentUniforms = detailsObject.currentUniforms;
    }
    this.setShiftPressed = function(shiftPressed) {
        if (shiftPressed != that.shiftPressed)
            console.log(shiftPressed ? "Shift pressed" : "Shift not pressed");
        that.shiftPressed = shiftPressed;
    }

    that.MouseWheelHandler = function(e) {
        if (that.shiftPressed && that.currentUniforms.mobiusEffectsOnOff.value == 1) {
            if (e.deltaX < that.lastDeltaX)
                that.zoom(.8);
            else
                that.zoom(1.25);
            that.lastDeltaX = e.deltaX;
            e.preventDefault();
        }
    }

    this.setCameraLookAtComplex = function(x, y) {
        if (that.shiftPressed && that.currentUniforms.mobiusEffectsOnOff.value == 1)
            that.setLoxoPoint(x,y);
        that.cameraLookAt = [x,y];
    }

    var sq = document.getElementsByTagName("BODY")[0];
	if (sq.addEventListener) {
		sq.addEventListener("mousewheel", that.MouseWheelHandler, false);
		sq.addEventListener("DOMMouseScroll", that.MouseWheelHandler, false);
	}
	else sq.attachEvent("onmousewheel", that.MouseWheelHandler);

    that.setUniformsFromPoints = function() {
        that.currentUniforms.e1x.value = that.e1[0];
        that.currentUniforms.e1y.value = that.e1[1];
        that.currentUniforms.e2x.value = that.e2[0];
        that.currentUniforms.e2y.value = that.e2[1];
    }

    that.handleSequence = function(seq, codes) {
        var opts = seq.substring(1);
        that.currentUniforms.showFixedPoints.value = 0;
        switch (seq[0]) {
            case 'L':   // loxo points
                that.currentUniforms.mobiusEffectsOnOff.value = 1
                break;
            case '1':
                that.currentUniforms.mobiusEffectsOnOff.value = 1
                that.e1 = [that.cameraLookAt[0], that.cameraLookAt[1]];
                that.setUniformsFromPoints();
                break;
            case '2':
                that.currentUniforms.mobiusEffectsOnOff.value = 1
                that.e2 = [that.cameraLookAt[0], that.cameraLookAt[1]];
                break;
            case 'X':   // RESET
                that.currentUniforms.mobiusEffectsOnOff.value = 0;
                that.e1 = [0,0];
                that.e2 = [100,100];
                that.setLoxoPoint(1,0);
                break;
            case 'T':   // TINY PLANET
                that.currentUniforms.mobiusEffectsOnOff.value = 1
                that.e1 = [0,0];
                that.e2 = [100,100];
                that.setUniformsFromPoints();
                that.zoom(.8);
                break;
            case 'G':   // GIANT PLANET
                that.currentUniforms.mobiusEffectsOnOff.value = 1
                that.e1 = [0,0];
                that.e2 = [100,100];
                that.setUniformsFromPoints();
                that.zoom(1.25);
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
            that.currentUniforms.loxodromicX.value * factor,
            that.currentUniforms.loxodromicY.value * factor);
    }
    this.setLoxoPoint = function(x,y) {
        that.currentUniforms.loxodromicX.value = x;
        that.currentUniforms.loxodromicY.value = y;
        console.log("loxo point = " + that.currentUniforms.loxodromicX.value + "," + that.currentUniforms.loxodromicY.value);
    }
}
