this.keyboardHandlers = function(camera, mediaUtils) {
    this.camera = camera;
    this.mediaUtils = mediaUtils;
    var that = this;
    this.keyboardHandlerComplex = new keyboardHandlerComplex(camera, mediaUtils);

    this.setShaderDetails = function(detailsObject) {
        that.detailsObject = detailsObject;
        that.currentUniforms = detailsObject.currentUniforms;
        that.keyboardHandlerComplex.setShaderDetails(detailsObject);
    }
    this.setCameraLookAtComplex = function(x, y) {
        that.keyboardHandlerComplex.setCameraLookAtComplex(x,y);
    }
    this.setShiftPressed = function(shiftPressed) {
        that.keyboardHandlerComplex.setShiftPressed(shiftPressed);
    }

    this.handleSequence = function(seq, codes, extraKey) {
        console.log("SEQUENCE: " + seq);
        var opts = seq.substring(1);
        switch(seq[0]) {
            case 'D':
                that.toggleDebugInfo();
                break;
            case 'G':
                that.handleGeo(opts, codes);
                break;
            case 'M':
                that.handleMask(opts, codes);
                break;
            case 'C':
                that.handleCamera(opts, codes);
                break;
            case 'E':
                that.handleEffects(opts, codes);
                break;
            case 'X':
                that.keyboardHandlerComplex.handleSequence(opts, codes);
                break;
            case 'T':
                that.handleTexture(opts, codes);
                break;
        }
    }
    that.handleCamera = function(seq, codes) {
    }
    that.handleEffects = function(seq, codes) {
    }
    that.handleTexture = function(seq, codes) {
    }

    that.handleMask = function(seq, codes) {
        var opts = seq.substring(1);
        switch (seq[0]) {
            case 'M':   // reset
                that.currentUniforms.uBlackMask.value = 0;
                that.currentUniforms.uMaskType.value = 0;
                break;
            case 'B':
                 that.currentUniforms.uBlackMask.value++;
                 that.currentUniforms.uBlackMask.value = that.currentUniforms.uBlackMask.value%5 ;
               break;
            default:
                that.currentUniforms.uMaskType.value = parseInt(seq[0]);
                break;
        }
    }
    that.handleGeo = function(seq, codes) {
        switch (seq[0]) {
            case 'S':
                that.cameraVectorLength = 1;
                that.mediaUtils.toggleView("sphere");
                break;
            case 'T':
                that.camera.position.set(-15.0, 1.0, 0.0);
                that.cameraVectorLength = -1;
                that.mediaUtils.toggleView("torus");
                break;
            case 'P':
                that.cameraVectorLength = 1;
                that.mediaUtils.toggleView("plane");
                break;
        }

    }
    this.toggleDebugInfo = function() {
    	that.currentUniforms.showFixedPoints.value = that.currentUniforms.showFixedPoints.value == 0 ? 1 : 0;
    	if (that.currentUniforms.showFixedPoints.value == 0) {
            $('.statusText').hide();
		}
		else {
            $('.statusText').show();
		}

    }

}