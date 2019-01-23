#version 330 compatibility

in vec3 vMCposition;
in float vLightIntensity;
in vec2 vST;
in vec4 vColor;

uniform float uAd;
uniform float uBd;
uniform float uNoiseAmp; //Multiplies the noise level
uniform float uNoiseFreq; //Multiplies what goes into the noise function
uniform sampler3D Noise3; //3D noise texture
uniform float uAlpha;
uniform float uTol;

uniform bool uUseChromaDepth;
uniform float uChromaBlue;
uniform float uChromaRed;

const vec3 WHITE = vec3( 1., 1., 1. );
void

main( )
{
    vec4 nv = texture3D(Noise3, uNoiseFreq*vMCposition);
    float n = (nv.r + nv.g + nv.b + nv.a) - 2.;
    n *= uNoiseAmp;

    float Ar = uAd / 2.;
    float Br = uBd / 2.;
    float s = vST.s;
    float t = vST.t;

    int numins = int(s / uAd);
    int numint = int(t / uBd);

    float s_c = (float(numins) * uAd) + Ar;
    float t_c = (float(numint) * uBd) + Br;

    float ds = s - s_c;
    float dt = t - t_c;

    float oldDist = sqrt((ds*ds) + (dt*dt));
    float newDist = n + oldDist;
    float scale = newDist / oldDist;

    ds *= scale;
    ds /= Ar;

    dt *= scale;
    dt /= Br;

    float d = smoothstep( 1. - uTol, 1. + uTol, (ds * ds) + (dt * dt) );

    gl_FragColor = mix(vec4(vLightIntensity * vColor.rgb, 1.), vec4(vLightIntensity * WHITE, uAlpha), d);
    if(gl_FragColor.a == 0)
        discard;
}