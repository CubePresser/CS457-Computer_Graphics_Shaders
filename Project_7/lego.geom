#version 400 compatibility
#extension GL_EXT_gpu_shader4: enable
#extension GL_EXT_geometry_shader4: enable

layout( triangles )  in;
layout( triangle_strip, max_vertices=204 )  out;

uniform bool uModelCoords;
uniform int uLevel;
uniform float uQuantize;

in vec3		vNormal[3];
out float	gLightIntensity;
//Also make sure to out the gl_Position thats built in

const vec3 LIGHTPOS = vec3( 0., 10., 0. );
vec3 V0, V01, V02;
vec3 N0, N01, N02;

float
Quantize( float f )
{
	f *= uQuantize;
	f += .5;		// round-off
	int fi = int( f );
	f = float( fi ) / uQuantize;
	return f;
}

vec3
QuantizeVec3( vec3 v )
{
	vec3 vv;
	vv.x = Quantize( v.x );
	vv.y = Quantize( v.y );
	vv.z = Quantize( v.z );
	return vv;
}

void ProduceVertex(float s, float t) {
    //Create normal from s,t
    vec3 n = N0 + (s*N01) + (t*N02);
    n = normalize(gl_NormalMatrix * n);

    //Get new vertex
    vec3 v = V0 + (s*V01) + (t*V02);
    if(!uModelCoords) v = (gl_ModelViewMatrix * vec4(v, 1.)).xyz;
    v = QuantizeVec3(v);
    if(uModelCoords) v = (gl_ModelViewMatrix * vec4(v, 1.)).xyz;

    //Update gLightIntensity
    gLightIntensity = abs(dot(normalize(LIGHTPOS - v), n));

    gl_Position = gl_ProjectionMatrix * vec4(v, 1.);
    EmitVertex();
}

void main() {
    //Get original vertices of triangle
    V01 = (gl_PositionIn[1] - gl_PositionIn[0]).xyz;
    V02 = (gl_PositionIn[2] - gl_PositionIn[0]).xyz;
    V0  = gl_PositionIn[0].xyz;

    //Get original normals of triangle
    N01 = vNormal[1] - vNormal[0];
    N02 = vNormal[2] - vNormal[0];
    N0 = vNormal[0];

    int numLayers = 1 << uLevel;

    float dt = 1./float(numLayers);

    float t_top = 1.;

    for(int it = 0; it < numLayers; it++) {
        float t_bot = t_top - dt;
        float smax_top = 1. - t_top;
        float smax_bot = 1. - t_bot;

        int nums = it + 1;
        float ds_top = smax_top / float( nums - 1 );
        float ds_bot = smax_bot / float( nums );
        float s_top = 0.;
        float s_bot = 0.;

        for( int is = 0; is < nums; is++ ) {
            ProduceVertex( s_bot, t_bot );
            ProduceVertex( s_top, t_top );
            s_top += ds_top;s_bot += ds_bot;
        }
        
        ProduceVertex( s_bot, t_bot );

        EndPrimitive( );
        t_top = t_bot;
        t_bot -= dt;
    }
}