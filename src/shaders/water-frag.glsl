#ifdef USE_LOGDEPTHBUF

	uniform float logDepthBufFC;

	#ifdef USE_LOGDEPTHBUF_EXT

		varying float vFragDepth;

	#endif

#endif

#include <packing>

varying vec4 vPos;
uniform sampler2D surfaceTex;
uniform sampler2D diffuseTex;
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

float readLogDepth( sampler2D depthSampler, vec2 coord ) {

    vec4 fragCoord = texture2D( depthSampler, coord );
    float logDepthBufFC = 2.0 / ( log( cameraFar + 1.0 ) / log( 2.0 ) );
    float viewZ = -1.0 * ( exp2( fragCoord.x / ( logDepthBufFC * 0.5 ) ) - 1.0 );
    return viewZ;
}

float readLogDepth2( sampler2D depthSampler, vec2 coord ) {
    vec4 fragCoord = texture2D( depthSampler, coord );

    #ifdef USE_LOGDEPTHBUF

      float logDepthBufFC = 2.0 / ( log( cameraFar + 1.0 ) / log(2.0) );

      #ifdef USE_LOGDEPTHBUF_EXT

        float invViewZ = exp2(fragCoord.x / (logDepthBufFC * 0.5)) - 1.0;
        // float invViewZ = cameraWasPerspective == 0.0 ? fragCoord.x : exp2(fragCoord.x / (logDepthBufFC * 0.5)) - 1.0;

      #else

        //TODO: check if correct
        // float invViewZ = cameraWasPerspective == 0.0 ? fragCoord.x : exp2((fragCoord.x + 1.0) / logDepthBufFC) - 1.0;
        float invViewZ =  exp2((fragCoord.x + 1.0) / logDepthBufFC) - 1.0;

      #endif

      return viewZToOrthographicDepth( -invViewZ, cameraNear, cameraFar );

    #else

      float invClipZ = fragCoord.x;
      float viewZ = perspectiveDepthToViewZ( invClipZ, cameraNear, cameraFar );
      return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );

    #endif
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

    float viewZ = readLogDepth2( depthTex, vCoords );// * 100.0;
    //viewZ = step( 0.0, viewZToOrthographicDepth( viewZ, cameraNear, cameraFar ) );
    gl_FragColor = texture2D( diffuseTex, vCoords ) * 0.6;

    vCoords.y = 1.0 - vCoords.y;

    vec3 dir = normalize( vWorldPos - camPos );
    float angle = dot( -dir, vec3( 0.0, 1.0, 0.0 ) );

    vec4 ref = texture2D( surfaceTex, vCoords );
    ref = mix ( ref, vec4( 0.0 ), angle );

    gl_FragColor *= 1.1;

    float waterDepth = ( viewZ - ( distToCamera / cameraFar ) ) * 50.0;

    // waterDepth = viewZToOrthographicDepth( distToCamera, cameraNear, cameraFar ); 
    // waterDepth = distToCamera / cameraFar;
    
    gl_FragColor.rgb = mix( gl_FragColor.rgb, ref.rgb, clamp( waterDepth, 0.0, 1.0 ) );
    gl_FragColor.a = 1.0;





    // gl_FragColor.rgb = vec3(  );
}