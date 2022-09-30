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
uniform float reflPower;
uniform float reflScale;

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

    // Working out screen coords
  	vec2 vCoords = vPos.xy;
	vCoords /= vPos.w;
	vCoords = vCoords * 0.5 + 0.5;

    // getting depth from depth texture
    float viewZ = readLogDepth2( depthTex, vCoords );
    gl_FragColor = texture2D( diffuseTex, vCoords ) * 0.6;

    
    // working out a reflection angle
    vec3 I = normalize( vWorldPos - camPos );
    float angle = dot( -I, vec3( 0.0, 1.0, 0.0 ) );

    float _Bias = 0.0;
    // float _Power = 2.0;
    //float _Scale = 1.0;
    vec3 normWorld = vec3( 0.0, 1.0, 0.0 );
	float R = _Bias + reflScale * pow(1.0 + dot(I, normWorld), reflPower );

    // flipping screen coords for reflection buffer
    vCoords.y = 1.0 - vCoords.y;
    vec4 ref = texture2D( surfaceTex, vCoords );
    // ref = mix ( ref, vec4( 0.0 ), R );
    // float waterDepth = ( viewZ - ( distToCamera / cameraFar ) ) * 50.0;
    float waterDepth = pow( viewZ - ( distToCamera / cameraFar ), -0.6 );

    gl_FragColor *= 1.1;
    gl_FragColor.rgb = mix( gl_FragColor.rgb, vec3( 0. ), clamp( waterDepth, 0.0, 1.0 ) );

    
    gl_FragColor.rgb = mix( gl_FragColor.rgb, ref.rgb, R );
    // gl_FragColor.rgb = vec3( R );
    gl_FragColor.a = 1.0;
}