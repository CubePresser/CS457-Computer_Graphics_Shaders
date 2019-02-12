#version 330 compatibility

#define M_PI 3.14159

out vec3  vMCposition;
out vec3  vSurfaceNormal;
out vec2  vST;

// Wave deformation equation constants
uniform float uA, uB, uC, uD, uE;

float
calculateZ( )
{
	float x = gl_Vertex.x + 1;
	float y = gl_Vertex.y + 1;

	return uA * ( cos(2.*M_PI*uB*x+uC) * exp(-uD*x) ) * ( exp(-uE*y) );
}

vec3
getSurfaceNormal( vec3 vertex ) 
{
	float x = vertex.x + 1;
	float y = vertex.y + 1;

	//Calculate slopes on x-z and y-z axis
	float dzdx = uA * ( -sin(2.*M_PI*uB*x+uC) * 2.*M_PI*uB * exp(-uD*x) + cos(2.*M_PI*uB*x+uC) * -uD * exp(-uD*x) ) * ( exp(-uE*y) );
	float dzdy = uA * ( cos(2.*M_PI*uB*x+uC) * exp(-uD*x) ) * ( -uE * exp(-uE*y) ); 

	//Tangent Vectors
	vec3 Tx = vec3(1., 0., dzdx );
	vec3 Ty = vec3(0., 1., dzdy );

	//Generate normal vector using the cross product between the two tangent vectors
	return normalize( cross( Tx, Ty ) );
}

void
main( )
{
    //Get ST coordinates
	vST = gl_MultiTexCoord0.st;

	//Calculate new vertex position
    float x, y, z, w;
    x = gl_Vertex.x;
    y = gl_Vertex.y;
    z = calculateZ();
    w = gl_Vertex.w;

	vec4 vertex = vec4(x, y, z, w);

	vMCposition  = vertex.xyz;

    vSurfaceNormal = normalize(gl_NormalMatrix * getSurfaceNormal(vertex.xyz));
	gl_Position = gl_ModelViewProjectionMatrix * vertex;
}