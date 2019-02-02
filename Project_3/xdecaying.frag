#version 330 compatibility

in vec3  vMCposition;
in vec3  vLight;
in vec3  vEye;
in vec3  normal;
in vec2  vST;

uniform vec4 uColor, uSpecularColor;
uniform float uKa, uKd, uKs, uShininess;
uniform float uNoiseAmp, uNoiseFreq;

//Returns a vec4 color calculated from per fragment lighting equations
vec4
lighting()
{
    vec3 n = normalize(gl_NormalMatrix * normal);
    vec4 ambient, diffuse, spec;

    ambient = uKa * uColor;
    diffuse = uKd * max(dot(n, vLight), 0.) * uColor;

    if(dot(n, vLight) > 0.)
    {
        vec3 reflection = normalize(reflect(-vLight, n));
        spec = uKs * pow(max(dot(vEye, reflection), 0.), uShininess) * uSpecularColor;
    }

    return vec4(ambient.rgb + diffuse.rgb + spec.rgb, 1.);

}

void
main( ) 
{
    gl_FragColor = lighting();
}