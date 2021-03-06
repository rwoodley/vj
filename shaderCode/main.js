SHADERCODE = {
    mathUtils: "",
    schottkyUtils: "",
    mobiusTransformUtils: ""
};
SHADERCODE.uniformsAndGlobals = function() {
var x = `  

    // ===== shader control variables
    uniform sampler2D iChannel0;
    uniform sampler2D iChannelDelayMask1;
    uniform sampler2D iChannelDelayMask2;
    uniform sampler2D iChannelDelayMask3;
    uniform sampler2D iChannelStillMask1;

    uniform sampler2D iChannelAnimation;

    varying vec2 vUv;  
    uniform float iRotationAmount;
    uniform float iGlobalTime;
    uniform float startTime;
    uniform float loxodromicX;
    uniform float loxodromicY;
    uniform float e1x;
    uniform float e1y;
    uniform float e2x;
    uniform float e2y;
    uniform int mobiusEffectsOnOff; 
    uniform float textureScaleX;
    uniform float textureScaleY;
    uniform float tesselate;
    uniform float uAlpha;
    uniform int uColorVideoMode;
    uniform int enableTracking;
    uniform float trackingX;
    uniform float trackingY;
    uniform bool flipTexture;
    uniform float textureUAdjustment;
    uniform float textureVAdjustment;
    uniform bool uSyntheticTexture;
    uniform float uSyntheticTextureQuadrant;
    uniform int complexEffect1OnOff;
    uniform int complexEffect2OnOff;
    uniform int complexEffect3OnOff;
    uniform int complexEffect4OnOff;
    uniform int complexEffect5OnOff;
    uniform int uPolygonalGroups;
    uniform int schottkyEffectOnOff;
    uniform int fractalEffectOnOff;
    uniform int proximityEffect;
    uniform int geometryTiming;
    uniform int hyperbolicTilingEffectOnOff;
    uniform int uNumCircles;

    uniform int  uBlackMask;
    uniform int uHighPassFilter;
    uniform vec3 uHighPassFilterThreshold;
    uniform vec3 uLowPassFilterThreshold;
    uniform vec3 uHighPassFilterThreshold2;
    uniform vec3 uLowPassFilterThreshold2;
    uniform int  uNadirMask;
    uniform int uApplyMobiusTransform;
    uniform vec2 uXformA;
    uniform vec2 uXformB;
    uniform vec2 uXformC;
    uniform vec2 uXformD;
    uniform vec2 uXform2A;
    uniform vec2 uXform2B;
    uniform vec2 uXform2C;
    uniform vec2 uXform2D;
    uniform int uSymmetryIndex;
    uniform int  uMaskType;

    // === for 3 point mapping..
    uniform bool uThreePointMappingOn;
    uniform vec2 u3p1;
    uniform vec2 u3q1;
    uniform vec2 u3r1;
    uniform vec2 u3p2;
    uniform vec2 u3q2;
    uniform vec2 u3r2;

    uniform bool showFixedPoints;
    vec2 two = vec2(2.0, 0.0);
    vec2 one = vec2(1.0, 0.0);
    vec2 zero = vec2(0.0, 0.0);
    vec2 i = vec2(0., 1.);
    uniform vec4 uColor0;
    uniform vec4 uColor1;
    uniform vec4 uColor2;
    uniform vec4 uColor3;
    uniform vec4 uColor4;
    uniform vec4 uColorScale;
    uniform vec4 uColorBlack;
    `;
return x;
}
