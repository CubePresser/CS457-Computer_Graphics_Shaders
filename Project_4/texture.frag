#version 330 compatibility

uniform sampler2D uTexUnit;

in vec2 vST;

void main () {
    gl_FragColor = vec4(texture2D(uTexUnit, vST).rgb, 1.);
}