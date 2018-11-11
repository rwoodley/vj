this.keyboardHandlers = function(camera, mediaUtils) {
    this.camera = camera;
    this.mediaUtils = mediaUtils;
    var that = this;

    this.handleSequence = function(seq, codes) {
        console.log("SEQUENCE: " + seq);
        var opts = seq.substring(1);
        switch(seq[0]) {
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
                that.handleComplex(opts, codes);
                break;
            case 'T':
                that.handleTexture(opts, codes);
                break;
        }
    }
    that.handleMask = function(opts, codes) {

    }
}