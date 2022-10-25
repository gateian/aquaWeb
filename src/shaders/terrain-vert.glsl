#ifdef USE_LOGDEPTHBUF

	#ifdef USE_LOGDEPTHBUF_EXT

		varying float vFragDepth;

	#endif

	uniform float logDepthBufFC;

#endif

#define EPSILON 1e-6

varying vec2 vUv;
varying vec3 vClipPosition;
varying vec3 vWorldPos;

uniform float refractionStrength;

void main() {

    vUv = uv;
    vWorldPos = ( modelMatrix * vec4( position, 1. ) ).xyz;
   

    vec4 waterNormal = viewMatrix * vec4( 0., 1., 0., 1. );
    vec4 I = viewMatrix * vec4( vWorldPos - cameraPosition, 1. );

    vec3 R = refract( normalize( vWorldPos - cameraPosition ), vec3( 0.0, 1.0, 0.0 ), 1.0 / 1.33 );
    // pos.xy -= R.xy * _RefractionStrength * step(wPos.y, 0.0) * abs(wPos.y);
    vWorldPos = mix( vWorldPos, vWorldPos - ( R * refractionStrength ), vec3( vWorldPos.y < 0. ) );

    vec4 mvPosition = viewMatrix * vec4( vWorldPos, 1.);
    vClipPosition = - mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;

    #ifdef USE_LOGDEPTHBUF

	gl_Position.z = log2(max( EPSILON, gl_Position.w + 1.0 )) * logDepthBufFC;

        #ifdef USE_LOGDEPTHBUF_EXT

            vFragDepth = 1.0 + gl_Position.w;

        #else

		gl_Position.z = (gl_Position.z - 1.0) * gl_Position.w;

        #endif

	#endif
}