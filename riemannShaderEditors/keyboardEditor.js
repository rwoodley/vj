
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
        console.log("Letter is " + letter + ", key code = " + e.keyCode + ", charCode " + e.charCode);

        if (letter == 'R') {
            that.extendedSequence = false;
            that.cs = '';
            that.codes =[];
            document.getElementById('wordText').innerHTML = '';
            return;
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
    this.other = function() {
        if (extraKey == 0 || extraKey == undefined) {
            if (e.keyCode == 39) {   // right arrow
                that.currentUniforms.textureUAdjustment.value += .0025;
                console.log("shift texture");
            }
            if (e.keyCode == 37) {   // left arrow
                that.currentUniforms.textureUAdjustment.value -= .0025;
                console.log("shift texture");
            }
            if (e.keyCode == 38) {   // up arrow
                that.currentUniforms.textureVAdjustment.value += .0025;
                console.log("shift texture");
            }
            if (e.keyCode == 40) {   // down arrow
                that.currentUniforms.textureVAdjustment.value -= .0025;
                console.log("shift texture");
            }
            if (e.keyCode == 83) {  // s - stop
                that.currentUniforms.textureVAdjustment.value = 0;
                console.log("shift texture");
            }
        }
        if (extraKey == 16) {       // shift
            if (e.keyCode == 37)    // right arrow
                that.rotateLeft();
            if (e.keyCode == 39)    // left arrow
                that.rotateRight();
            if (e.keyCode == 83)  // s - stop/reset
                that.rotationOff();
        }
        if (extraKey == 17) {       // ctrl
            if (e.keyCode == 39) {   // right arrow
                that.mediaUtils.cameraRight();
                console.log("move camera");
            }
            if (e.keyCode == 37) {   // left arrow
                that.mediaUtils.cameraLeft();
                console.log("move camera");
            }
            if (e.keyCode == 38) {   // up arrow
                that.mediaUtils.cameraUp();
                console.log("move camera");
            }
            if (e.keyCode == 40) {   // down arrow
                that.mediaUtils.cameraDown();
                console.log("move camera");
            }
            if (e.keyCode == 83) { // s - stop
                that.mediaUtils.cameraStop();
                console.log("move camera");
            }
        }
        if (extraKey == 18) {       // alt
            if (e.keyCode == 39) {   // right arrow
                that.detailsObject.aMobiusTransform =
                that.detailsObject.aMobiusTransform.mmult(_tXform);
            }
            if (e.keyCode == 37) {   // left arrow
                that.detailsObject.aMobiusTransform =
                that.detailsObject.aMobiusTransform.mmult(_inverseTXform);
            }
            if (e.keyCode == 38) {   // up arrow
                that.detailsObject.aMobiusTransform =
                that.detailsObject.aMobiusTransform.mmult(_sXform);
            }
            if (e.keyCode == 40) {   // down arrow
                that.detailsObject.aMobiusTransform =
                that.detailsObject.aMobiusTransform.mmult(_inverseSXform);
            }
            if (e.keyCode == 83) {      // reset
                that.detailsObject.aMobiusTransform = _one;
            }

            that.detailsObject.updateUniformsForMobiusTransform();
        }
        if (e.keyCode == 79) {  // o - stop zoom.
            that.mediaUtils.cameraZoom(1.0);
        }
        if (e.keyCode == 80) {  // p - pan.
            that.mediaUtils.cameraZoom(1.01);
        }
        if (e.keyCode == 81) {  // q - zoom.
            that.mediaUtils.cameraZoom(.99);
        }
        if (e.keyCode == 82) {  // r - tetrahedral symmetry over triangle group.
            that.currentUniforms.hyperbolicTilingEffectOnOff.value = 1; // turn on triangles...
            that.tetrahedralGroup(2);
        }
        if (e.keyCode == 84) {  // t - tetrahedral symmetry.
            that.tetrahedralGroup(1);
        }
        if (e.keyCode == 85) {  // u - take a snap.

            var cubeCamera = new THREE.CubeCamera( .1, 1000, 4096 );


            var equiUnmanaged = new CubemapToEquirectangular( _renderer, false );
            cubeCamera.updateCubeMap( _renderer, _scene );
            equiUnmanaged.convert( cubeCamera );
            _scene.remove(mirrorSphere);
        }

        var textureNumber = e.keyCode - 48;
        if ((extraKey == 17) && (textureNumber < 10 && textureNumber >= 0))
            that.currentUniforms.uTextureNumber.value = textureNumber;
    }
    this.textureLeft = function() { that.currentUniforms.textureUAdjustment.value += .1; }
    this.textureRight = function() { that.currentUniforms.textureUAdjustment.value -= .1; }
    this.textureUp = function() { that.currentUniforms.textureVAdjustment.value += .1; }
    this.textureDown = function() { that.currentUniforms.textureVAdjustment.value -= .1; }
    this.textureStop = function() {
        that.currentUniforms.textureUAdjustment.value = 0;
        that.currentUniforms.textureVAdjustment.value = 0;
    }
    this.textureSmaller = function() {
        that.currentUniforms.textureScaleX.value *= 1.5;
        that.currentUniforms.textureScaleY.value *= 1.5;
    }
    this.textureLarger = function() {
        that.currentUniforms.textureScaleX.value /= 1.5;
        that.currentUniforms.textureScaleY.value /= 1.5;
    }
    this.textureTrack = function() {
        that.currentUniforms.enableTracking.value = that.currentUniforms.enableTracking.value == 1 ? 0 : 1;
    }
    this.animationTrack = function() {
        that.currentUniforms.enableAnimationTracking.value = that.currentUniforms.enableAnimationTracking.value == 1 ? 0 : 1;
    }
    this.threePoint = function() {
        that.currentUniforms.uThreePointMappingOn.value = that.currentUniforms.uThreePointMappingOn.value == 1 ? 0 : 1;
    }
    this.changeAlpha = function() {
        that.currentUniforms.uAlpha.value += .25;
        that.currentUniforms.uAlpha.value = that.currentUniforms.uAlpha.value % 1.0;
        if (that.currentUniforms.uAlpha.value == 0.)
            that.currentUniforms.uAlpha.value = 1.0;
        console.log("alpha = "  + that.currentUniforms.uAlpha.value);
    }
    this.toggleColorVideo = function() {
        that.currentUniforms.uColorVideoMode.value++;
        that.currentUniforms.uColorVideoMode.value = that.currentUniforms.uColorVideoMode.value%7;
        console.log("uColorVideoMode = " + that.currentUniforms.uColorVideoMode.value);
    }
    this.tesselate = function() { that.currentUniforms.tesselate.value = that.currentUniforms.tesselate.value == 0 ? 1 : 0; }
    this.complexEffect1 = function() {
        that.currentUniforms.complexEffect1OnOff.value += 1;
    }
    this.complexEffect2 = function() {
        that.currentUniforms.complexEffect1OnOff.value -= 1;
    }
    this.complexEffect3 = function() {
        that.currentUniforms.complexEffect3OnOff.value = that.currentUniforms.complexEffect3OnOff.value == 0 ? 1 : 0;
    }
    this.complexEffect4 = function() {
        that.currentUniforms.complexEffect4OnOff.value = that.currentUniforms.complexEffect4OnOff.value == 0 ? 1 : 0;
    }
    this.complexEffect5 = function() {
        that.currentUniforms.complexEffect5OnOff.value = that.currentUniforms.complexEffect5OnOff.value == 0 ? 1 : 0;
    }
    this.schottkyEffect1 = function() {
        that.currentUniforms.schottkyEffectOnOff.value = that.currentUniforms.schottkyEffectOnOff.value == 0 ? 1 : 0;
    }
    this.schottkyEffect2 = function() {
        that.currentUniforms.schottkyEffectOnOff.value = that.currentUniforms.schottkyEffectOnOff.value == 0 ? 2 : 0;
    }
    this.schottkyEffect3 = function() {
        that.currentUniforms.schottkyEffectOnOff.value = that.currentUniforms.schottkyEffectOnOff.value == 0 ? 3 : 0;
    }
    this.fractalEffect = function() {
        that.currentUniforms.fractalEffectOnOff.value = that.currentUniforms.fractalEffectOnOff.value == 0 ? 1 : 0;
    }
    this.proximityEffect = function() {
        that.currentUniforms.proximityEffect.value++;
        that.currentUniforms.proximityEffect.value = (that.currentUniforms.proximityEffect.value)%3;
        console.log("prox effect = " + that.currentUniforms.proximityEffect.value )
    }
    this.toggleGeometryTiming = function() {
        that.currentUniforms.geometryTiming.value = that.currentUniforms.geometryTiming.value == 0 ? 1 : 0;
        console.log("that.currentUniforms.geometryTiming.value = " + that.currentUniforms.geometryTiming.value);
    }

    this.hyperbolicTilingEffect = function() {
        that.currentUniforms.hyperbolicTilingEffectOnOff.value++;
        that.currentUniforms.hyperbolicTilingEffectOnOff.value =
            that.currentUniforms.hyperbolicTilingEffectOnOff.value%5;
        console.log(that.currentUniforms.hyperbolicTilingEffectOnOff.value);
     }
    this.setFixedPointsIfUndefined = function() {
    	if (!that.detailsObject.point1Defined && !that.detailsObject.point2Defined) {
    		that.setFixedPoint(1);
    	}
    }
    this.useDelayMask = function() {
        that.currentUniforms.uMaskType.value++;
        that.currentUniforms.uMaskType.value = that.currentUniforms.uMaskType.value%6;
        showToast('uMaskType = ' + that.currentUniforms.uMaskType.value, 1000);
    }
    // these can be deleted:
    this.useGreenMask = function() {
            that.currentUniforms.uMaskType.value = that.currentUniforms.uMaskType.value == 2 ? 0 : 2;
            showToast('uMaskType = ' + that.currentUniforms.uMaskType.value, 1000);
    }
    this.useStillMask = function() {
            that.currentUniforms.uMaskType.value = that.currentUniforms.uMaskType.value == 3 ? 0 : 3;
            showToast('uMaskType = ' + that.currentUniforms.uMaskType.value, 1000);
    }
    this.blackMask = function() {
            that.currentUniforms.uBlackMask.value = that.currentUniforms.uBlackMask.value == 1 ? 0 : 1;
    }
    this.beigeMask = function() {
            that.currentUniforms.uHighPassFilter.value++;
            that.currentUniforms.uHighPassFilter.value = that.currentUniforms.uHighPassFilter.value%5;
            showToast('uHighPassFilter = ' + that.currentUniforms.uHighPassFilter.value, 500);
        }
    this.nadirMask = function() {
            that.currentUniforms.uNadirMask.value = that.currentUniforms.uNadirMask.value == 1 ? 0 : 1;
    }
    this.setFixedPoint1 = function() {that.setFixedPoint(1); }
    this.setFixedPoint2 = function() {that.setFixedPoint(2); }
    this.setFixedPoint = function(pointNumber, cameraLookAtComplexX, cameraLookAtComplexY) {
    	that.currentUniforms.mobiusEffectsOnOff.value = 1;
        if (cameraLookAtComplexX == undefined)
            cameraLookAtComplexX = that.detailsObject.cameraLookAtComplexX;
        if (cameraLookAtComplexY == undefined)
            cameraLookAtComplexY = that.detailsObject.cameraLookAtComplexY;
        var x = cameraLookAtComplexX;
    	var y = cameraLookAtComplexY;
    	if (pointNumber == 1) {
        	that.currentUniforms.e1x.value = x;
        	that.currentUniforms.e1y.value = y;
        	that.detailsObject.point1Defined = true;
        	if (!that.detailsObject.point2Defined) {
            	var ant = antipode(x,y);
            	that.currentUniforms.e2x.value = ant.x;
            	that.currentUniforms.e2y.value = ant.y;
        	}
        }
        else {
        	that.currentUniforms.e2x.value = x;
        	that.currentUniforms.e2y.value = y;
        	that.detailsObject.point2Defined = true;
        	if (!that.detailsObject.point1Defined) {
            	var ant = antipode(x,y);
            	that.currentUniforms.e1x.value = ant.x;
            	that.currentUniforms.e1y.value = ant.y;
        	}
        }
    	console.log("P1 = " + that.currentUniforms.e1x.value + "," + that.currentUniforms.e1y.value);
    	console.log("P2 = " + that.currentUniforms.e2x.value+ "," + that.currentUniforms.e2x.value);
        console.log("loxo point = " + that.currentUniforms.loxodromicX.value + "," + that.currentUniforms.loxodromicY.value);
    }
    this.setLoxoPointFromClick = function() {
        that.setLoxoPoint(that.detailsObject.cameraLookAtComplexX, that.detailsObject.cameraLookAtComplexY);
    }
    this.setLoxoPoint = function(x,y) {
        that.setFixedPointsIfUndefined();
        that.currentUniforms.loxodromicX.value = x;
        that.currentUniforms.loxodromicY.value = y;
        console.log("loxo point = " + that.currentUniforms.loxodromicX.value + "," + that.currentUniforms.loxodromicY.value);
        // showToast("loxo point is (" +
        //         that.currentUniforms.loxodromicX.value.toFixed(2) + "," +
        //         that.currentUniforms.loxodromicY.value.toFixed(2) + "i)"
        //     , 2000);
    }
    this.zoomIn = function() { that.zoom(.8); }
    this.zoomOut = function() { that.zoom(1.25); }
    this.zoomCancel = function() { that.setLoxoPoint(1.,0.); }
    this.zoom = function(factor) {
		that.setFixedPointsIfUndefined();
        that.setLoxoPoint(
            that.currentUniforms.loxodromicX.value * factor,
            that.currentUniforms.loxodromicY.value * factor);
    }
    this.showHelpPage = function() {
        window.location.href = 'info.html';
    }
    this.rotatePause = function() { that.rotate(0); }
    this.rotateLeft = function() { that.rotate(-1); }
    this.rotateRight = function() { that.rotate(1); }
    this.rotate = function(direction) {
		that.setFixedPointsIfUndefined();
    	if (direction == 0) {
    		that.detailsObject.rotateDirection = 0;
    	}
    	else {
        	that.detailsObject.rotateDirection += direction;
    	}
    }
    this.rotationOff = function() {
		that.detailsObject.rotateDirection = 0;
    	that.currentUniforms.iRotationAmount.value = 0;
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
    this.viewState = 0;
    this.toggleView = function() {
        that.viewState++;
        that.viewState = that.viewState % 4;
        if (that.viewState == 0) {
            that.cameraVectorLength = 1;
            that.mediaUtils.toggleView("sphere");
        }
        if (that.viewState == 1) {
            that.cameraVectorLength = 1;
            that.mediaUtils.toggleView("torus");
        }
        if (that.viewState == 2) {
            that.cameraVectorLength = -1;
            that.mediaUtils.toggleView("plane");
        }
        // if (that.viewState == 3) {
        //     that.cameraVectorLength = 15;
        //     that.mediaUtils.toggleView("sphere");
        // }
        if (that.viewState == 3) {
            that.cameraVectorLength = 15;
            that.mediaUtils.toggleView("catenoid");
        }
    }
    this.reset = function() {
    	that.detailsObject.rotateDirection = 0;
    	that.currentUniforms.iRotationAmount.value = 0;
    	that.currentUniforms.iGlobalTime.value = 0;
    	that.detailsObject.point1Defined = false;
    	that.detailsObject.point2Defined = false;
    	that.currentUniforms.mobiusEffectsOnOff.value = 0;
        that.currentUniforms.textureScaleX.value = 1;
        that.currentUniforms.textureScaleY.value = 1;
        that.currentUniforms.textureUAdjustment.value = 0;
        that.currentUniforms.textureVAdjustment.value = 0;
        that.currentUniforms.complexEffect1OnOff.value = 1;
        that.currentUniforms.uAnimationEffect.value = 0;
        // that.currentUniforms.complexEffect2OnOff.value = 0;
        that.currentUniforms.complexEffect3OnOff.value = 0;
        that.currentUniforms.complexEffect4OnOff.value = 0;
        that.currentUniforms.complexEffect5OnOff.value = 0;
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
    this.updateVariousNumbersForCamera = function() {
        if (that.detailsObject == undefined) return;
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
    	that.detailsObject.cameraLookAtComplexX = - x / (1.0 - negz);
    	that.detailsObject.cameraLookAtComplexY = - y / (1.0 - negz);

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
            	that.detailsObject.cameraLookAtComplexX.toFixed(2) + " + " +
            	that.detailsObject.cameraLookAtComplexY.toFixed(2) + "i";
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

    this.initUniformsEditor();  // set up GUI controls.
    this.setShaderDetails = function(detailsObject) {
        that.detailsObject = detailsObject;
        that.currentUniforms = detailsObject.currentUniforms;
        // that.detailsObject.cameraLookAtComplexX = 0;
        // that.detailsObject.cameraLookAtComplexY = 0;
        // that.detailsObject.point1Defined = false;
        // that.detailsObject.point2Defined = false;
    }
}