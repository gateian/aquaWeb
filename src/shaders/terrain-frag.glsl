#ifdef USE_LOGDEPTHBUF

	uniform float logDepthBufFC;

	#ifdef USE_LOGDEPTHBUF_EXT

		varying float vFragDepth;

	#endif

#endif

uniform vec4 clippingPlanes[ 1 ];
uniform sampler2D map;
uniform bool clipUnderwater;
varying vec2 vUv;
varying vec3 vClipPosition;
varying vec3 vWorldPos;

void main() {

    vec4 plane = clippingPlanes[ 0 ];

    if ( vWorldPos.y < 0. && clipUnderwater ) discard;

    #if defined(USE_LOGDEPTHBUF) && defined(USE_LOGDEPTHBUF_EXT)

        gl_FragDepthEXT = log2(vFragDepth) * logDepthBufFC * 0.5;

    #endif

    gl_FragColor = texture2D( map, vUv );
    gl_FragColor.a = 1.;
}