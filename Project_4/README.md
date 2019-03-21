
CS 457/557 -- Winter Quarter 2019
Project #4
Cube Mapping Reflective and Refractive Bump-mapped Surfaces
100 Points
Due: February 12

This page was last updated: January 30, 2019

Requirements:

    The goal of this project is to use cube-mapping to create a reflective and refractive display of a bump-mapped math function.

    Use the same math function you used in Project #3. You can either use the default surface equation or the Extra Credit equation.

    You need to put the parameters for the math function you use (A, B,, C, D, and E) on sliders.

    Use a Mix slider variable to blend the reflective and refractive versions of the scene as we did with the cube-mapping example in class.

    Also put the index of refraction, Eta, on a slider.

    Don't do any lighting. Just use the output from the cube map.

    You can use the NVIDIA cube map, the Kelley cube map, or any other cube maps you find.

    You can have as many other < > uniform variables as you wish. 

A Sample Glib File

##OpenGL GLIB

Perspective 70
LookAt 0 0 3  0 0 0  0 1 0

Vertex texture.vert
Fragment texture.frag
Program Texture  TexUnit 6

Texture2D  6  nvposx.bmp
QuadYZ 5. 5. 10 10

Texture2D  6  nvnegx.bmp
QuadYZ -5. 5. 10 10


Texture2D  6  nvposy.bmp
QuadXZ 5. 5. 10 10

Texture2D  6  nvnegy.bmp
QuadXZ -5. 5. 10 10


Texture2D  6  nvposz.bmp
QuadXY 5. 5. 10 10

Texture2D  6  nvnegz.bmp
QuadXY -5. 5. 10 10


CubeMap 6 nvposx.bmp nvnegx.bmp  nvposy.bmp nvnegy.bmp   nvposz.bmp nvnegz.bmp

CubeMap 7 nvposx.bmp nvnegx.bmp  nvposy.bmp nvnegy.bmp   nvposz.bmp nvnegz.bmp

Vertex  	xdecaying.vert
Fragment        xdecaying.frag
Program XDecaying                                       \
                uReflectUnit 6                          \
                uRefractUnit 7                          \
                uA <-1.0 0.00 1.0>                      \
                uB <0.0 2.0 5.0>                        \
                uC <0.0 0.0 12.56>                      \
                uD <0. 0. 5.>                           \
                uE <0. 0. 5.>                           \
                uEta <0. 1.4 4.0>                       \
                uNoiseAmp <0. 0. 5.>                    \
                uNoiseFreq <0.1 1. 5.>                  \
                uMix <0. 0. 1.>


QuadXY  -0.2  1.  200 200

The Turn-In Process:

The turnin for this project will be all of the source files and a PDF report containing:

    What you did and explaining why it worked this way
    Side-by-side images showing different values for the input parameters
    Image(s) showing that your normal computation is correct.
    Image(s) showing that your bump-mapping is correct.
    An image showing that you can mix the reflective and refractive outputs.
    A link to your video 

This needs to be a PDF file turned into Teach with your other files. Be sure to keep your PDF outside your .zip file so I can gather up all the PDF files at once with a script.

Grading:

Feature	Points
Reflects correctly	30
Refracts correctly	30
Bump-maps correctly	30
Mixes the reflective and refractive correctly	10
Potential Total	100
