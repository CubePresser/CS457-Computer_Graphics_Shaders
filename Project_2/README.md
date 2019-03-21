
CS 457/557 -- Winter Quarter 2019
Project #2
Noisy Elliptical Dots
100 Points
Due: January 23

This page was last updated: January 1, 2019

Requirements:

    Create a GLIB file that produces parameter sliders for:

    Parameter	What It Does
    uAd	Ellipse diameter for s
    uBd	Ellipse diameter for t
    uNoiseAmp	Noise Amplitude
    uNoiseFreq	Noise Frequency
    uTol	Width of the blend between ellipse and non-ellipse areas

    The .glib file, including the Extra Credit parameters, might look like this:

    ##OpenGL GLIB
    LookAt  0 0 3  0 0 0  0 1 0
    Perspective 70

    Vertex   ovalnoise.vert
    Fragment ovalnoise.frag
    Program  OvalNoise                                              \
            uAd <.01 .05 .5>  uBd <.01 .05 .5>                      \
            uNoiseAmp <0. 0. 1.>  uNoiseFreq <0. 1. 10.>      	\
            uAlpha <0. 1. 1.>                                       \
            uTol <0. 0. 1.>						\
            uUseChromaDepth <false>                           \
            uChromaBlue <-5.  -3.8  0.>                             \
            uChromaRed  <-3.  -1.1  2.>

    Color 1. .9 0
    Sphere

    Remember that the border of an ellipse, defined in s and t coordinates is:
    (s-sc)2 / Ar2 + (t-tc)2 / Br2 = 1

    The NoiseFreq parameter is the frequency of the noise function, i.e., it multiplies what goes into the noise function.

    The NoiseAmp parameter is the amplitude of the noise function, i.e., it multiplies the noise value.

    The effects of the NoiseAmp and NoiseFreq parameters should look something like this:
    		
      	NoiseAmp 	NoiseFreq

    The uTol parameter is the width of a smoothstep( ) blend between the ellipse and non-ellipse areas, thus smoothing the abrupt color transition.


    float d = smoothstep( 1. - uTol, 1. + uTol );

    Then use d in the mix function.

    uTol

    You can have as many other slider-based uniform variables as you wish.

    Apply lighting. The easiest way to do this would be to just use diffuse in per-vertex lighting, looking at the cosine of the angle between the surface normal and the vector to the light source:

    out float	vLightIntensity;

    const vec3 LIGHTPOS   = vec3( -2., 0., 10. );
       . . .
    vec3 tnorm      = normalize( gl_NormalMatrix * gl_Normal );	// transformed normal
    vec3 ECposition = ( gl_ModelViewMatrix * gl_Vertex ).xyz;
    vLightIntensity  = abs(  dot( normalize(LIGHTPOS - ECposition), tnorm )  );

    Of course, you can make this as sophisticated as you want, including interpolating the transformed normal through the rasterizer and using per-fragment lighting.

    The ellipses must be created procedurally, i.e., with equations in a Fragment Shader program. (No texture images.)

    As we discussed in class, get a noise value based on the current fragment's model coordinates. Use all 4 octaves available. Then use that value to alter the ds and dt values. Then use those new ds and dt values to determine the correct color to use.

    // read the glman noise texture and convert it to a range of [-1.,+1.]:

    nv  = texture3D( Noise3, uNoiseFreq*vMCposition );
    float n = nv.r + nv.g + nv.b + nv.a;    //  1. -> 3.
    n = n - 2.;                             // -1. -> 1.

    // determine the color based on the noise-modified (s,t):

    float sc = float(numins) * uAd  +  Ar;
    float ds = st.s - sc;                   // wrt ellipse center
    float tc = float(numint) * uBd  +  Br;
    float dt = st.t - tc;                   // wrt ellipse center

    float oldDist = sqrt( ds*ds + dt*dt );
    float newDist = << use the noise value >>
    float scale = newDist / oldDist;        // this could be < 1., = 1., or > 1.

    ds *= scale;                            // scale by noise factor
    ds /= Ar;                               // ellipse equation

    dt *= scale;                            // scale by noise factor
    dt /= Br;                               // ellipse equation

    float d = ds*ds + dt*dt;

    The choice of geometry is up to you. You are allowed to contrive the size to make it work. 

Using Objects Other Than A Sphere

You can try this with any solid objects you want. However, be aware that not all solid objects have built-in s-t (texture) coordinates. In glman, the sphere, torus, and teapot have them. The others don't. (Blame this on GLUT...) Many of the hundreds of .obj files available on the net have them. (You can check this by editing the .obj file and ensuring that there are lines beginning with "vt".) Also, be aware that not all .obj objects have built-in surface normals (nx,ny,nz). (You can check this by editing the .obj file and ensuring that there are lines beginning with "vn".)

If you want to use the signature object, get the pig file, pigY.obj, here. Include it in your GLIB file like this:
Obj pigY.obj

Extra Credit #1 (+5 points)

Add uniform variable uAlpha that changes the opacity of the non-ellipse areas. When uAlpha == 0., do a discard; instead of setting alpha.

Parameter	What It Does
uAlpha	Opacity of non-ellipse areas

uAlpha

Extra Credit #2 (+5 points)

Add a ChromaDepth feature that colors the scene by eye coordinate depth: Red in the front, Blue in the back, and Green in the middle. Include a checkbox called uUseChromaDepth which turns ChromaDepth on and off.

Glasses are on the desk in the front of the CGEL. Please leave them there. Also, please do not touch the plastic lenses with your fingers. They are difraction gratings. Fingerprint grease is almost impossible to get out of them.

uChromaRed and uChromaBlue are meant to be the Z depths in eye coordinates at which the ChromaDepth color interpolation starts and ends.

I'd recommend putting them both on sliders, so that you can play with the values. Remember that, in eye coordinates, the eye is at the origin looking in -Z. Thus, uChromaRed and uChromaBlue need to be negative.

Checkboxes are added to the glman user interface like this:

. . . uUseChromaDepth <false> . . .

and are used in the shader program as:

uniform bool uUseChromaDepth;

. . .

	if( uUseChromaDepth )
	{
		float t = (2./3.) * ( Z - uChromaRed ) / ( uChromaBlue - uChromaRed );
		t = clamp( t, 0., 2./3. );
		TheColor = ChromaDepth( t );
	}
	else
	{
		. . .
	}

ChromaDepth

If you normalize a distance t so that it is t=0. in the front of the object and t=.667 in the back, here is code to assign the colors. (It is actually just the hue-only part of the rainbow color scale.)


vec3
Rainbow( float t )
{
	t = clamp( t, 0., 1. );

	float r = 1.;
	float g = 0.0;
	float b = 1.  -  6. * ( t - (5./6.) );

        if( t <= (5./6.) )
        {
                r = 6. * ( t - (4./6.) );
                g = 0.;
                b = 1.;
        }

        if( t <= (4./6.) )
        {
                r = 0.;
                g = 1.  -  6. * ( t - (3./6.) );
                b = 1.;
        }

        if( t <= (3./6.) )
        {
                r = 0.;
                g = 1.;
                b = 6. * ( t - (2./6.) );
        }

        if( t <= (2./6.) )
        {
                r = 1.  -  6. * ( t - (1./6.) );
                g = 1.;
                b = 0.;
        }

        if( t <= (1./6.) )
        {
                r = 1.;
                g = 6. * t;
        }

	return vec3( r, g, b );
}

Note that this code implements the full (H,S=1.,V=1.) to (R,G,B) conversion. You need to keep t between 0. and (2./3.) because you are only interested in the Red-Green-Blue color range. This code is good to keep around. There are lots of good visualization uses for it too.

Be sure to show the Extra Credit(s) in your video!

Hints:

    Once again, use the philosophy that you get the (model) coordinates of the current fragment, perturb them according to the noise parameters, then use the perturbed coordinates in the equation. 

The Turn-In Process:

Your turnin will be done at http://engr.oregonstate.edu/teach and will consist of:

    All source files (.glib, .vert, .frag). You can zip this all together if you want.
    A PDF report with a title, your name, your email address, nice screen shots from your program, and the link to the Kaltura video or YouTube video demonstrating that your project does what the requirements ask for. Narrate your video so that you can tell us what it is doing.
    Be sure your video's protection is set to unlisted.
    Do not put your PDF into your zip file. Leave it out separately so my collect-all-the-PDFs script can find it. 

Submissions are due at 23:59:59 on the listed due date.

Grading:

Feature	Points
Correct changes in uAd and uBd	20
Correct changes in uNoiseAmp	30
Correct changes in uNoiseFreq	30
Correct changes in uTol	20
EC #1: Correct changes in uAlpha	5
EC #2: Correct ChromaDepth	5
Potential Total	110
