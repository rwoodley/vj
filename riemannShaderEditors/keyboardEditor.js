
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

            document.getElementById('windowSizeText').innerHTML = "Window (wxh): " +
            	window.innerWidth + " , " + window.innerHeight;

            document.getElementById('canvasSizeText').innerHTML = "Canvas (wxh): " +
            	        document.getElementsByTagName( 'canvas' )[0].style.width  +
                " , " +
            	        document.getElementsByTagName( 'canvas' )[0].style.height;

 		}
		catch (x) {}
    }
}