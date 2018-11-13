
// This handles all user editing of uniforms.
// It sets up icons on construction.
// You can change the uniform being edited.
// API: Constructor, onkeydown, setShaderDetails
this.keyboardEditor = function(
    camera, mediaUtils
) {
    var that = this;
    this.camera = camera;
    this.mediaUtils = mediaUtils;
    this.keyboardHandlers = new keyboardHandlers(camera, mediaUtils);

	this.initUniformsEditor = function() {
        //showToast('Hit space bar to show/hide icons.', 2000);
	}
	this.cs = "";   // command sequence
	this.codes = [];
	this.extendedSequence = false;
    this.onkeydown = function(e, extraKey) {
        // normally a 2 letter code unless starts with Z. Then collects until next Z. R resets always.
        var x = event.charCode || event.keyCode;  // Get the Unicode value
        var letter = String.fromCharCode(x);  // Convert the value into a character

        if (letter == 'R') {
            that.extendedSequence = false;
            that.cs = '';
            that.codes =[];
            document.getElementById('wordText').innerHTML = '';
            return;
        }
        if (letter == 'Q') {
            that.fullReset();
        }
        if (letter == 'Z') {
            if (that.extendedSequence) {
                document.getElementById('wordText').innerHTML = '';
                that.keyboardHandlers.handleSequence(that.cs, that.codes);
                that.extendedSequence = false;
            }
            else {
                that.extendedSequence = true;
            }
            that.cs = '';
            that.codes =[];
            return;
        }
        that.cs += letter;
        that.codes.push(e.keyCode);
        if (that.cs.length == 2 && !that.extendedSequence) {
            document.getElementById('wordText').innerHTML = '';
            that.keyboardHandlers.handleSequence(that.cs, that.codes);
            that.cs = '';
            that.codes =[];
            return;
        }
        document.getElementById('wordText').innerHTML = that.cs;
    }
    this.setShaderDetails = function(detailsObject) {
        that.currentUniforms = detailsObject.currentUniforms;
        that.detailsObject = detailsObject;
        that.keyboardHandlers.setShaderDetails(detailsObject);
    }
    this.updateVariousNumbersForCamera = function() {
        if (that.keyboardHandlers.detailsObject == undefined) return;
        // Camera coordinates are in three.js space where Y is up.
        // We want to deal with traditional math coordinates where Z is up
    	var unitVector = (new THREE.Vector3()).copy(that.camera.position).normalize();
		// in three.js y is up. we want z to be up.
        // also we need to flip z and x.
		var y = unitVector.x;
		var x = unitVector.z;	// assign z to x.
		var z = unitVector.y;	// assign y to z.

    	// convert to point on complex plane
        // all the signs are flipped because the camera is not sitting at the origin.
        // it is sitting 1 unit away from the origin, looking thru the origin at the
        // opposite side of the sphere.
        var negz = -z;
    	var cameraLookAtComplexX = - x / (1.0 - negz);
    	var cameraLookAtComplexY = - y / (1.0 - negz);
    	this.keyboardHandlers.setCameraLookAtComplex(cameraLookAtComplexX, cameraLookAtComplexY);

    	try {
            _textElement = document.getElementById('cameraText');
            _textElement.innerHTML = "<nobr>Camera in three.js coords: (" + _camera.position.x.toFixed(1)
                + "," + _camera.position.y.toFixed(1) + ","
                + _camera.position.z.toFixed(1) + ") len: "
                + _camera.position.length().toFixed(1) + "</nobr>" ;

            var mess =
            "<nobr>Camera in Cartesian Space: (" +
            	x.toFixed(1) + "," +
            	y.toFixed(1) + "," +
                z.toFixed(1) + "" +
                ") len: "
				+ unitVector.length().toFixed(1) + "</nobr>" ;
            // console.log(mess);
            document.getElementById('unitVectorText').innerHTML = mess;

            mess = "Looking at " +
            	cameraLookAtComplexX.toFixed(2) + " + " +
            	cameraLookAtComplexY.toFixed(2) + "i";
            // console.log(mess);
            document.getElementById('complexPointText').innerHTML = mess;

            document.getElementById('windowSizeText').innerHTML = "Window (wxh): " +
            	window.innerWidth + " , " + window.innerHeight;

            document.getElementById('canvasSizeText').innerHTML = "Canvas (wxh): " +
            	        document.getElementsByTagName( 'canvas' )[0].style.width  +
                " , " +
            	        document.getElementsByTagName( 'canvas' )[0].style.height;

 		}
		catch (x) {}
    }
    this.fullReset = function() {
    	that.detailsObject.rotateDirection = 0;
    	that.currentUniforms.iRotationAmount.value = 0;
    	that.currentUniforms.iGlobalTime.value = 0;
    	that.detailsObject.point1Defined = false;
    	that.detailsObject.point2Defined = false;
    	that.currentUniforms.mobiusEffectsOnOff.value = 0;
        that.currentUniforms.textureScaleX.value = 1;
        that.currentUniforms.textureScaleY.value = 1;
        if (that.currentUniforms.enableTracking.value == 1) {
            that.detailsObject.trackerUtils.reset();
        }
        if (that.currentUniforms.enableAnimationTracking.value == 1) {
            console.log("noop");
            // that.detailsObject.trackerUtils.reset();
        }
        if (that.currentUniforms.uThreePointMappingOn.value == 1) {
            that.detailsObject.threePointTracker.reset();
        }
        that.currentUniforms.textureUAdjustment.value = 0;
        that.currentUniforms.textureVAdjustment.value = 0;
        that.currentUniforms.complexEffect1OnOff.value = 1;
        // that.currentUniforms.complexEffect2OnOff.value = 0;
        that.currentUniforms.complexEffect3OnOff.value = 0;
        that.currentUniforms.complexEffect4OnOff.value = 0;
        that.currentUniforms.schottkyEffectOnOff.value = 0;
        that.currentUniforms.fractalEffectOnOff.value = 0;
        that.currentUniforms.geometryTiming.value = 0;
        that.currentUniforms.hyperbolicTilingEffectOnOff.value = 0;
    	that.currentUniforms.e1x.value = that.currentUniforms.e1y.value = that.currentUniforms.e2x.value = that.currentUniforms.e2y.value = 0;
        that.currentUniforms.loxodromicX.value = 1;
        that.currentUniforms.loxodromicY.value = 0;
        that.currentUniforms.tesselate.value = 0;
        that.currentUniforms.uAlpha.value = 1.0;

        // reseting this can be confusing...
        // that.currentUniforms.uColorVideoMode.value = 1.0;      // need for outer texture.
    }
}