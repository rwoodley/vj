
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
    this.setShaderDetails = function(detailsObject) {
        that.keyboardHandlers.setShaderDetails(detailsObject);
    }
    this.updateVariousNumbersForCamera = function() {
    }
}