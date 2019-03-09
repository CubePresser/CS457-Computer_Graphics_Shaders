#version 400 compatibility

out vec3 vNormal;

void main() {
    vNormal = normalize(gl_NormalMatrix * gl_Vertex.xyz);
    gl_Position = gl_Vertex;
}