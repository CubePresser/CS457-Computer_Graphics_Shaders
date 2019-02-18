#version 330 compatibility

uniform sampler2D uTexUnit;

uniform float uScenter;
uniform float uTcenter;
uniform float uDs;
uniform float uDt;
uniform float uMagFactor;
uniform float uRotAngle;
uniform float uSharpFactor;

in vec2 vST;

void main ( ) {
    vec2 st = vST;

    //Check if st is inside of magic window rectangle
    if(
        (uScenter - uDs <= st.s && st.s <= uScenter + uDs)
        &&
        (uTcenter - uDt <= st.t && st.t <= uTcenter + uDt)
    ) {
        //Respect to center
        st.s -= uScenter;
        st.t -= uTcenter;

        //Scale
        st.s /= uMagFactor;
        st.t /= uMagFactor;

        //Rotate
        float s = st.s;
        float t = st.t;
        st.s = s*cos(uRotAngle) + t*sin(uRotAngle);
        st.t = -s*sin(uRotAngle) + t*cos(uRotAngle);

        //Bring back to global coordinates
        st.s += uScenter;
        st.t += uTcenter;

        ivec2 ires = textureSize(uTexUnit, 0);
        float ResS = float(ires.s);
        float ResT = float(ires.t);

        vec2 stp0 = vec2(1. / ResS, 0.);
        vec2 st0p = vec2(0., 1. / ResT);
        vec2 stpp = vec2(1. / ResS, 1. / ResT);
        vec2 stpm = vec2(1. / ResS, -1. / ResT);

        vec3 i00    = texture2D( uTexUnit, st ).rgb;
        vec3 im1m1  = texture2D( uTexUnit, st - stpp ).rgb;
        vec3 ip1p1  = texture2D( uTexUnit, st + stpp ).rgb;
        vec3 im1p1  = texture2D( uTexUnit, st - stpm ).rgb;
        vec3 ip1m1  = texture2D( uTexUnit, st + stpm ).rgb;
        vec3 im10   = texture2D( uTexUnit, st - stp0 ).rgb;
        vec3 ip10   = texture2D( uTexUnit, st + stp0 ).rgb;
        vec3 i0m1   = texture2D( uTexUnit, st - st0p ).rgb;
        vec3 i0p1   = texture2D( uTexUnit, st + st0p ).rgb;

        vec3 target = vec3(0., 0., 0.);
        target += 1.* (im1m1 + ip1m1 + ip1p1 + im1p1);
        target += 2.* (im10 + ip10 + i0m1 + i0p1);
        target += 4. * (i00);
        target /= 16.;

        gl_FragColor = vec4( mix( target, i00, uSharpFactor ), 1. );

    } else {
        gl_FragColor = vec4(texture2D(uTexUnit, st).rgb, 1.);
    }
}