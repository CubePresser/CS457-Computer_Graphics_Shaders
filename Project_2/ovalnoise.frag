#version 330 compatibility

in vec3 vMCposition;
in float vLightIntensity;
in vec2 vST;
in vec4 vColor;

uniform float uAd;
uniform float uBd;
uniform float uNoiseAmp;
uniform float uNoiseFreq;
uniform float uAlpha;
uniform float uTol;

uniform bool uUseChromaDepth;
uniform float uChromaBlue;
uniform float uChromaRed;

const vec3 WHITE = vec3( 1., 1., 1. );
void

main( )
{
    float Ar = uAd / 2.;
    float Br = uBd / 2.;
    float s = vST.s;
    float t = vST.t;

    int numins = int(s / uAd);
    int numint = int(t / uBd);

    float s_c = (numins * uAd) + Ar;
    float t_c = (numint * uBd) + Br;

    float ellipse = (((s - s_c) / Ar) * ((s - s_c) / Ar)) +
                    (((t - t_c) / Br) * ((t - t_c) / Br));
    
    float d = smoothstep( 1. - uTol, 1. + uTol, ellipse );

    gl_FragColor = mix(vec4(vLightIntensity * vColor.rgb, 1.), vec4(vLightIntensity * WHITE, 1.), d);
}