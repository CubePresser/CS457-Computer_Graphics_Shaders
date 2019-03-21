#version 330 compatibility

#define M_PI 3.14159

out vec3  vMCposition;
out vec3  vECposition;
out vec3  vSurfaceNormal;

out vec3  vLight;
out vec3  vEye;

// Wave deformation equation constants
uniform float uX1, uY1, uAmp1, uFreq1, uDecay1;
uniform float uX2, uY2, uAmp2, uFreq2, uDecay2;
uniform float uX3, uY3, uAmp3, uFreq3, uDecay3;

uniform float Timer;
float Time = Timer > 0.5 ? 1. - Timer : Timer;

float
calculateZ( float offsetX, float offsetY, float amp, float freq, float decay, float phase)
{
	float x = gl_Vertex.x + offsetX;
	float y = gl_Vertex.y + offsetY;

	float r = sqrt(x*x + y*y);

	return amp * (cos(2*M_PI*freq*r + phase) * exp(-decay*r));
}

vec3
getSurfaceNormal( float derivative ) 
{
	//Tangent Vectors
	vec3 Tx = vec3(1., 0., derivative );
	vec3 Ty = vec3(0., 1., derivative );

	//Generate normal vector using the cross product between the two tangent vectors
	return normalize( cross( Tx, Ty ) );
}

float calculateDerivative(float offsetX, float offsetY, float amp, float freq, float decay, float phase) {
	float x = gl_Vertex.x + offsetX;
	float y = gl_Vertex.y + offsetY;

	// Get derivative
	return amp * exp(-decay * sqrt((x * x) + (y * y))) * cos(2*M_PI * freq * sqrt((x * x) + (y * y)) + phase);
}

void
lighting( vec4 vertex )
{
	vec3 vEyePosition = vec3( gl_ModelViewMatrix * vertex );
	vec3 vLightPosition = vec3(5., 10., 20.);

	//Vector from eye to light
	vLight = normalize(vLightPosition - vEyePosition);

	vEye = normalize(vec3(0.0, 0.0, 0.0) - vEyePosition);
}


void
main( )
{
	//Calculate new vertex position
    float x, y, z, w;
    x = gl_Vertex.x;
    y = gl_Vertex.y;
    z = (
		calculateZ(uX1, uY1, uAmp1, uFreq1, uDecay1, -Timer * 25) +
		calculateZ(uX2, uY2, uAmp2, uFreq2, uDecay2, -Timer * 25) +
		calculateZ(uX3, uY3, uAmp3, uFreq3, uDecay3, -Timer * 25)

	);
    w = gl_Vertex.w;

	vec4 vertex = vec4(x, y, z, w);

	lighting(vertex);

	vMCposition  = vertex.xyz;
	vECposition  = (gl_ModelViewMatrix * vertex).xyz;

	float derivative = (
		calculateDerivative(uX1, uY1, uAmp1, uFreq1, uDecay1, -Timer * 25) +
		calculateDerivative(uX2, uY2, uAmp2, uFreq2, uDecay2, -Timer * 25) +
		calculateDerivative(uX3, uY3, uAmp3, uFreq3, uDecay3, -Timer * 25)
	);

    vSurfaceNormal = normalize(gl_NormalMatrix * getSurfaceNormal(derivative));
	gl_Position = gl_ModelViewProjectionMatrix * vertex;
}