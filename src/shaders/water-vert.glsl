varying vec4 vPos;
varying vec3 vWorldPos;

void main() {

    vPos = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    vWorldPos = (modelMatrix * vec4( position, 1.0 )).xyz;
    gl_Position = vPos;

}