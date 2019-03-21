
CS 457/557 -- Winter Quarter 2019
Project #3
Displacement Mapping, Bump Mapping, and Lighting
100 Points
Due: February 1

This page was last updated: January 22, 2019

Requirements:

The goals of this project are to use displacement mapping to turn a simple shape into a more interesting one, re-compute its normals, bump-map it, and light it. Simple! What could possibly go wrong?

The turnin for this project will be all of the source files and a PDF report containing:

    What you did and explaining why it worked this way
    Side-by-side images showing different values for the input parameters
    Per-fragment lighted image(s) showing that your normal computation is correct.
    Per-fragment lighted image(s) showing that your bump-mapping is correct.
    A link to your video 

This needs to be a PDF file turned into Teach with your other files. Be sure to keep your PDF outside your .zip file so I can gather up all the PDF files at once with a script.

Cosine Flowing in X, Decaying in X and Y

This shape is a decaying cosine wave like this:

The surface spreads across X and Y, rising in Z, flowing in X, and decaying in X and Y separately according to:

Z = A * [ cos(2πBx+C) * e-Dx ] * [ e-Ey ]

Hint: add +1. to both x and y before using these equations. That way, each is > 0. which makes decaying exponentials nicer. Don't displace anything by +1., just add +1. before computing Z and the derivatives.

Getting the Normal:

Bad news: you have to do it yourself.
Good news: in this case, it's not too hard.

Remember that the cross product of two vectors gives you a third vector that is perpendicular to both. So, all you have to do to get the normal is determine 2 vectors that lie on the surface at the point in question (these are called tangent lines) and then take their cross product, and then normalize it.

Each tangent is determined by taking calculus derivatives:

float dzdx = A * [ -sin(2.*π*B*x+C) * 2.*π*B * exp(-D*x) + cos(2.*π*B*x+C) * -D * exp(-Dx) ] * [ exp(-E*y) ];

float dzdy = A * [ cos(2.*π*B*x+C) * exp(-D*x) ] * [ -E * exp(-E*y) ];

The tangent vectors are then formed like this:
vec3 Tx = vec3(1., 0., dzdx );
and
vec3 Ty = vec3(0., 1., dzdy );

The normal is then formed like this:
vec3 normal = normalize( cross( Tx, Ty ) );

Lighting

Start with the per-fragment lighting shader we looked at in class. Feel free to use it as-is or as a starting point, or feel free to make your own. At a minumim, you must be able to adjust Ka, Kd, Ks, shininess, and the light position.

Because we are doing bump-mapping, it must be per-fragment, not per-vertex!

Shader Flow

Sample .glib File


##OpenGL GLIB

Perspective 70
LookAt 0 0 3  0 0 0  0 1 0

Vertex	  xdecaying.vert
Fragment  xdecaying.frag
Program   XDecaying                                     \
                uA <-1.0 0.00 1.0>                      \
                uB <0.0 2.0 5.0>                        \
                uC <0.0 0.0 12.56>                      \
                uD <0. 0. 5.>                           \
                uE <0. 0. 5.>                           \
                uNoiseAmp  <0.0 0. 5.>                  \
                uNoiseFreq <0.1 1. 5.>                  \
                uKa <0. 0.1 1.0>                        \
                uKd <0. 0.6 1.0>                        \
                uKs <0. 0.3 1.0>                        \
                uShininess <1. 10. 50.>                 \
                uLightX <-20. 5. 20.>                   \
                uLightY <-20. 10. 20.>                  \
                uLightZ <-20. 20. 20.>                  \
                uColor {1. .7 0. 1.}                    \
                uSpecularColor {1. 1. 1. 1.}


QuadXY  -0.2  1.  200 200






Note that you need to break the quad down into many sub-quads (the "200 200" above) so that there are enough vertices to create a smooth displacement function.

Bump-Mapping

You've determined the normal. Now you want to perturb it in a seemingly random, yet coherent, way. Sounds like a job for noise, right?

Use the glman noise capability to get two noise values. These will be treated as an angle to rotate the normal about x and an angle to rotate the normal about y. Create at least two more sliders: uNoiseAmp and uNoiseFreq.

        vec4 nvx = texture( Noise3, uNoiseFreq*vMC );
	float angx = nvx.r + nvx.g + nvx.b + nvx.a  -  2.;
	angx *= uNoiseAmp;
        vec4 nvy = texture( Noise3, uNoiseFreq*vec3(vMC.xy,vMC.z+0.5) );
	float angy = nvy.r + nvy.g + nvy.b + nvy.a  -  2.;
	angy *= uNoiseAmp;

Rotate the normal like this:

vec3
RotateNormal( float angx, float angy, vec3 n )
{
        float cx = cos( angx );
        float sx = sin( angx );
        float cy = cos( angy );
        float sy = sin( angy );

        // rotate about x:
        float yp =  n.y*cx - n.z*sx;    // y'
        n.z      =  n.y*sx + n.z*cx;    // z'
        n.y      =  yp;
        // n.x      =  n.x;

        // rotate about y:
        float xp =  n.x*cy + n.z*sy;    // x'
        n.z      = -n.x*sy + n.z*cy;    // z'
        n.x      =  xp;
        // n.y      =  n.y;

        return normalize( n );
}

Extra Credit (+10 points)

Instead of decaying in X and Y separately, decay in a radius around a center point. This will look like the ripples you get from throwing a rock in a pond.

The surface spreads across R, decaying in R and rising in Z according to:
Z = A * cos(2πBr+C) * e-Dr
where:
r2 = x2 + y2

This is worth 10 extra points because the normal is harder to compute.
Hint: in this case, implicit differentiation will be more straightforward than explicit.
Compute dzdx and dzdy, but where you need drdx and drdy, do this:
2r(drdx) = 2x
2r(drdy) = 2y
drdx = x/r;
drdy = y/r;

Be sure your video shows this to be the correct normal.

Grading:

Feature	Points
Correctly show the effect of changing uA, uB, uC, uD, uE	30
Correctly show the effects of changing uNoiseAmp	15
Correctly show the effect of changing uNoiseFreq	15
Use lighting to show that you have computed the normal correctly	20
Use lighting to show that you have computed the bump-mapping correctly	20
Extra Credit	10
Potential Total	110
