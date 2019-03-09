#version 400 core

uniform vec3 uColor;

in float gLightIntensity;

void main() {
    gl_FragColor = vec4(gLightIntensity * uColor, 1.);
}