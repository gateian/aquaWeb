#ifdef USE_LOGDEPTHBUF

	#ifdef USE_LOGDEPTHBUF_EXT

		varying float vFragDepth;

	#endif

	uniform float logDepthBufFC;

#endif

varying vec4 vPos;
varying vec3 vWorldPos;
varying float distToCamera;

#define EPSILON 1e-6

void main() {

    vec4 csPos = modelViewMatrix * vec4( position, 1.0 );
    vPos = projectionMatrix * csPos;
    distToCamera = -csPos.z;
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