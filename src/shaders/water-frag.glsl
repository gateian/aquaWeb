#ifdef USE_LOGDEPTHBUF

	uniform float logDepthBufFC;

	#ifdef USE_LOGDEPTHBUF_EXT

		varying float vFragDepth;

	#endif

#endif

#include <packing>

varying vec4 vPos;
uniform sampler2D surfaceTex;
uniform sampler2D depthTex;
varying vec3 vWorldPos;
varying float distToCamera;
uniform vec3 camPos;
uniform float frustumDepth;
uniform float cameraNear;
uniform float cameraFar;

float readDepth( sampler2D depthSampler, vec2 coord ) {
    float fragCoordZ = texture2D( depthSampler, coord ).x;
    float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
    return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
}
  
void main() {



#if defined(USE_LOGDEPTHBUF) && defined(USE_LOGDEPTHBUF_EXT)

	gl_FragDepthEXT = log2(vFragDepth) * logDepthBufFC * 0.5;

#endif

    // float fragZ = distance( camPos, vWorldPos );

    // float viewZ = perspectiveDepthToViewZ( fragZ, cameraNear, cameraFar );
    // float depth = viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );

  	vec2 vCoords = vPos.xy;
	vCoords /= vPos.w;
	vCoords = vCoords * 0.5 + 0.5;
    vCoords.y = 1.0 - vCoords.y;

    gl_FragColor = texture2D( surfaceTex, vCoords );
    gl_FragColor *= 1.1;
    // gl_FragColor = vec4( depth, depth, depth, 1.0 );

    // viewZ = distToCamera / cameraFar;// step( 0.0, distToCamera );
    // gl_FragColor = vec4( viewZ, viewZ, viewZ, 1.0 );
    // float depth = readDepth( depthTex, vCoords );
    // gl_FragColor.rgb = 1.0 - vec3( depth );
}