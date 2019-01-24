#version 330 compatibility

in vec3 vMCposition;
in float vLightIntensity;
in vec2 vST;
in vec4 vColor;
in float Z;

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

vec3 ChromaDepth(float);

void
main( )
{
    //Set color
    vec3 color = vColor.rgb;
    if(uUseChromaDepth)
    {
        float t = (2./3.) * ( Z - uChromaRed ) / ( uChromaBlue - uChromaRed );
		t = clamp( t, 0., 2./3. );
		color = ChromaDepth(t);
    }

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

    gl_FragColor = mix(vec4(vLightIntensity * color, 1.), vec4(vLightIntensity * WHITE, uAlpha), d);
    if(gl_FragColor.a == 0)
        discard;
}

vec3
ChromaDepth( float t )
{
	t = clamp( t, 0., 1. );

	float r = 1.;
	float g = 0.0;
	float b = 1.  -  6. * ( t - (5./6.) );

        if( t <= (5./6.) )
        {
                r = 6. * ( t - (4./6.) );
                g = 0.;
                b = 1.;
        }

        if( t <= (4./6.) )
        {
                r = 0.;
                g = 1.  -  6. * ( t - (3./6.) );
                b = 1.;
        }

        if( t <= (3./6.) )
        {
                r = 0.;
                g = 1.;
                b = 6. * ( t - (2./6.) );
        }

        if( t <= (2./6.) )
        {
                r = 1.  -  6. * ( t - (1./6.) );
                g = 1.;
                b = 0.;
        }

        if( t <= (1./6.) )
        {
                r = 1.;
                g = 6. * t;
        }

	return vec3( r, g, b );
}