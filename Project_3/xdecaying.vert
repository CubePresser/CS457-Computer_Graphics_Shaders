#version 330 compatibility

#define M_PI 3.14159

out vec3  vMCposition;
out vec3  vLight;
out vec3  vEye;
out vec3  normal;
out vec2  vST;


uniform float uLightX, uLightY, uLightZ;
uniform float uNoiseAmp, uNoiseFreq;
uniform sampler3D Noise3; //3D noise texture

// TODO: Find out what the heck these values mean
uniform float uA, uB, uC, uD, uE;

float
calculateZ( )
{
	float x = gl_Vertex.x + 1;
	float y = gl_Vertex.y + 1;

	return uA * ( cos(2.*M_PI*uB*x+uC) * exp(-uD*x) ) * ( exp(-uE*y) );
}

void
lighting( vec4 glVertex )
{
	vec3 vEyePosition = vec3( gl_ModelViewMatrix * glVertex );
	vec3 vLightPosition = vec3(uLightX, uLightY, uLightZ);

	//Vector from eye to light
	vLight = normalize(vLightPosition - vEyePosition);

	vEye = normalize(vec3(0.0, 0.0, 0.0) - vEyePosition);
}

vec3
calculateNormal( vec3 glVertex ) 
{
	float x = glVertex.x + 1;
	float y = glVertex.y + 1;

	//Calculate slopes on x-z and y-z axis
	float dzdx = uA * ( -sin(2.*M_PI*uB*x+uC) * 2.*M_PI*uB * exp(-uD*x) + cos(2.*M_PI*uB*x+uC) * -uD * exp(-uD*x) ) * ( exp(-uE*y) );
	float dzdy = uA * ( cos(2.*M_PI*uB*x+uC) * exp(-uD*x) ) * ( -uE * exp(-uE*y) ); 

	//Tangent Vectors
	vec3 Tx = vec3(1., 0., dzdx );
	vec3 Ty = vec3(0., 1., dzdy );

	//Generate normal vector using the cross product between the two tangent vectors
	return normalize( cross( Tx, Ty ) );
}

vec3
RotateNormal( float angx, float angy, vec3 n )
{
        float cx = cos( angx );
        float sx = sin( angx );
        float cy = cos( angy );
        float sy = sin( angy );

        // rotate about x:
        float yp =  n.y*cx - n.z*sx;    // y'
        n.z      =  n.y*sx + n.z*cx;    // z'
        n.y      =  yp;
        // n.x      =  n.x;

        // rotate about y:
        float xp =  n.x*cy + n.z*sy;    // x'
        n.z      = -n.x*sy + n.z*cy;    // z'
        n.x      =  xp;
        // n.y      =  n.y;

        return normalize( n );
}

void
main( )
{
	vST = gl_MultiTexCoord0.st;

	//Calculate new vertex position
	vec4 glVertex = vec4(gl_Vertex.x, gl_Vertex.y, calculateZ(), gl_Vertex.w);

	vMCposition  = glVertex.xyz;
	gl_Position = gl_ModelViewProjectionMatrix * glVertex;

	vec4 nvx = texture( Noise3, uNoiseFreq*vMCposition );
	float angx = nvx.r + nvx.g + nvx.b + nvx.a  -  2.;
	angx *= uNoiseAmp;
    vec4 nvy = texture( Noise3, uNoiseFreq*vec3(vMCposition.xy,vMCposition.z+0.5) );
	float angy = nvy.r + nvy.g + nvy.b + nvy.a  -  2.;
	angy *= uNoiseAmp;

    normal = RotateNormal(angx, angy, calculateNormal(glVertex.xyz));

	lighting( glVertex );
}