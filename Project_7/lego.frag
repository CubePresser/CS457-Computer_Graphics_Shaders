#version 400

in float gLightIntensity;

void main() {
    gl_FragColor = vec4(gLightIntensity * vec3(1.00, 0.65, 0.40), 1.);
}