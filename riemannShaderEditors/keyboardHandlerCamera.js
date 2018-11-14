this.keyboardHandlerCamera = function(camera, mediaUtils) {
    this.camera = camera;
    this.mediaUtils = mediaUtils;
    var that = this;
    this.setShaderDetails = function(detailsObject) {
        that.detailsObject = detailsObject;
        that.currentUniforms = detailsObject.currentUniforms;
    }
    this.setShiftPressed = function(shiftPressed) {
        if (shiftPressed != that.shiftPressed)
            console.log(shiftPressed ? "Shift pressed" : "Shift not pressed");
        that.shiftPressed = shiftPressed;
    }

}
