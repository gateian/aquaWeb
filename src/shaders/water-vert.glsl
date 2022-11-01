#ifdef USE_LOGDEPTHBUF

	#ifdef USE_LOGDEPTHBUF_EXT

		varying float vFragDepth;

	#endif

	uniform float logDepthBufFC;

#endif

varying vec4 vPos;
varying vec3 vWorldPos;
varying float vDepth;
varying vec3 vNormal;

#define EPSILON 1e-6

void main() {

    vec4 csPos = vec4( position, 1.0 );
	csPos.y = sin( csPos.x ) * 10.0;

	vec3 tangent = normalize( vec3( 1.0, cos( csPos.x ), 0.0 ) );
	vNormal = vec3( -tangent.y, tangent.x, 0.0 );

    vPos = projectionMatrix * modelViewMatrix * csPos;
    vDepth = -csPos.z;
    vWorldPos = (modelMatrix * vec4( position, 1.0 )).xyz;
    gl_Position = vPos;


    #ifdef USE_LOGDEPTHBUF

	gl_Position.z = log2(max( EPSILON, gl_Position.w + 1.0 )) * logDepthBufFC;

	#ifdef USE_LOGDEPTHBUF_EXT

		vFragDepth = 1.0 + gl_Position.w;

	#else

		gl_Position.z = (gl_Position.z - 1.0) * gl_Position.w;

	#endif

#endif
}