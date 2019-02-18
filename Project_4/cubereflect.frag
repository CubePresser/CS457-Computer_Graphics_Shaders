#version 330 compatibility

in vec3  vMCposition;
in vec3  vECposition;
in vec3  vSurfaceNormal;

uniform samplerCube uReflectUnit;
uniform samplerCube uRefractUnit;
uniform float uEta;
uniform sampler3D Noise3; //3D noise textureuniform sampler3D Noise3
uniform float uNoiseAmp, uNoiseFreq;
uniform float uMix;

vec3
RotateNormal( vec3 n )
{
        //Calculate angle of noise in x direction
        vec4 nvx = texture( Noise3, uNoiseFreq*vMCposition );
	    float angx = nvx.r + nvx.g + nvx.b + nvx.a  -  2.;
	    angx *= uNoiseAmp;

        //Calculate angle of noise in y direction
        vec4 nvy = texture( Noise3, uNoiseFreq*vec3(vMCposition.xy,vMCposition.z+0.5) );
	    float angy = nvy.r + nvy.g + nvy.b + nvy.a  -  2.;
	    angy *= uNoiseAmp;

        float cx = cos( angx );
        float sx = sin( angx );
        float cy = cos( angy );
        float sy = sin( angy );

        // rotate about x:
        float yp =  n.y*cx - n.z*sx;    // y'
        n.z      =  n.y*sx + n.z*cx;    // z'
        n.y      =  yp;

        // rotate about y:
        float xp =  n.x*cy + n.z*sy;    // x'
        n.z      = -n.x*sy + n.z*cy;    // z'
        n.x      =  xp;

        return normalize( n );
}

void
main( ) 
{
    vec3 WHITE = vec3( 1.,1.,1. );
    vec3 Normal = normalize(vSurfaceNormal);
    Normal = RotateNormal(Normal);

    vec3 reflectVector = reflect( vECposition, Normal );
	vec3 reflectcolor = textureCube(uReflectUnit, reflectVector ).rgb;
	vec3 refractVector = refract( vECposition, Normal, uEta );
	vec3 refractcolor = textureCube( uRefractUnit, refractVector ).rgb;

	refractcolor = mix( refractcolor, WHITE, 0.30 );
	gl_FragColor = vec4( mix( reflectcolor, refractcolor, uMix ),  1. );
}