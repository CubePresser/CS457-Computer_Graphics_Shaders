
CS 457/557 -- Winter Quarter 2019
Project #1
Step- and Blended-edged Elliptical Dots
60 Points
Due: January 16

This page was last updated: January 16, 2019

Requirements:

    Use glman and GLSL to render some geometry (your choice), covered with elliptical dots.

    Remember that the border of an ellipse, defined in s and t coordinates is:
    (s-sc)2 / Ar2 + (t-tc)2 / Br2 = 1
    Be sure you compute sc and tc correctly.

    The ellipse parameters must be set as uniform variables from glman sliders, like this:

    ##OpenGL GLIB

    Perspective 90
    LookAt 0 0 2  0 0 0  0 1 0


    Vertex   oval.vert
    Fragment oval.frag
    Program  Oval				\
    	uAd <.001 .1 .5>		\
    	uBd <.001 .1 .5>		\
    	uTol <0. 0. 1.>

    Color 1. .9 0
    Sphere 1 50 50

    This will produce sliders for

    Parameter	What It Does
    uAd	Ellipse diameter for s
    uBd	Ellipse diameter for t
    uTol	Width of the blend between ellipse and non-ellipse areas

    Apply lighting. You can do this simply in the vertex shader, like this:

    #version 330 compatibility

    out vec3  vMCposition;
    out float vLightIntensity; 

    vec3 LIGHTPOS   = vec3( -2., 0., 10. );

    void
    main( )
    {
    	vST = gl_MultiTexCoord0.st;

    	vec3 tnorm      = normalize( gl_NormalMatrix * gl_Normal );
    	vec3 ECposition = vec3( gl_ModelViewMatrix * gl_Vertex );
    	vLightIntensity  = abs( dot( normalize(LIGHTPOS - ECposition), tnorm ) );

    	vMCposition  = gl_Vertex.xyz;
    	gl_Position = gl_ModelViewProjectionMatrix * aVertex;
    }

    or, you can do the full per-fragment-lighting thing.

    The uTol parameter is the width of a smoothstep( ) blend between the ellipse and non-ellipse areas, thus smoothing the abrupt color transition.


    float d = smoothstep( 1. - uTol, 1. + uTol, results_of_ellipse_equation );

    Then use d in the mix function.

    The choice of geometry is up to you. Keep it simple at first, then, if there is still time, feel free to get more creative. To try out the pig model, use the GLIB line:

    Obj pigY.obj

    where the file pigY.obj needs to be in the same folder as your .glib, .vert, and .frag files. 

Hints:

    Use the ellipse equation found in the Stripes, Rings,and Dots notes.

    You can key off of anything you like. (s,t) works well. (x,y,z) works well too, depending on the geometry.

    For some shapes, strange things happen in (s,t) and (x,y,z) around the North and South Poles. Don't worry about this. (This also happens in visualization with longitude-latitude Mercador map projections.)


The Turn-In Process:

Your turnin will be done at http://engr.oregonstate.edu/teach and will consist of:

    All source files (.glib, .vert, .frag). You can zip this all together if you want.
    A PDF report with a title, your name, your email address, nice screen shots from your program, and the link to the Kaltura video or YouTube video demonstrating that your project does what the requirements ask for. Narrate your video so that you can tell us what it is doing.
    Be sure your video's protection is set to unlisted.
    Do not put your PDF into your zip file. Leave it out separately so my collect-all-the-PDFs script can find it. 

Submissions are due at 23:59:59 on the listed due date.

Grading:

Feature	Points
Hard-edged elliptical dots	10
Smooth-edged elliptical dots	20
Correct elongation	30
Potential Total	60
