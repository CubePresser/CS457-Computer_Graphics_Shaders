#version 330 compatibility

in vec3  vMCposition;
in vec3  vECposition;
in vec3  vSurfaceNormal;

in vec3  vLight;
in vec3  vEye;

//Returns a vec4 color calculated from per fragment lighting equations
vec4
lighting()
{
    vec4 ambient, diffuse, spec;

	float a = 0.1;
	float d = 0.6;
	float s = 0.3;

	vec4 color = vec4(0., .2, 1., 1.);

    ambient = a * color;
    diffuse = d * max(dot(vSurfaceNormal, vLight), 0.) * color;

    if(dot(vSurfaceNormal, vLight) > 0.)
    {
        vec3 reflection = normalize(reflect(-vLight, vSurfaceNormal));
        spec = s * pow(max(dot(vEye, reflection), 0.), 10.) * vec4(1., 1., 1., 1.);
    }

    return vec4(ambient.rgb + diffuse.rgb + spec.rgb, 1.);

}

void
main( ) 
{
	gl_FragColor = lighting();
}