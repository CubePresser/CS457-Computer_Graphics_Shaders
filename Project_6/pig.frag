#version 330 compatibility

#define M_PI 3.14159

uniform sampler2D uTexUnit;
uniform float Timer;

in vec2 vST;

void main ( ) {
    float x, y, u, v, w, a, r, pi = M_PI;

    x = vST.s - 0.5;
    y = vST.t - 0.5;

    a = atan( y, x );
    r = sqrt( x * x + y * y );

    u = a / pi + 0.005 * r;
    v = 40 * pow( r, 0.01 );

    v += (Timer);
    
    gl_FragColor = vec4(texture2D(uTexUnit, vec2(u, v)).rgb, 1.);
}