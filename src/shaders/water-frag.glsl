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
uniform mat4 projMatrix;
varying vec3 vWorldPos;
varying float vDepth;
uniform vec3 camPos;
uniform float frustumDepth;
uniform float cameraNear;
uniform float cameraFar;
uniform float reflPower;
uniform float reflScale;
uniform float extinctionCoeff;
uniform float waterDistance;
uniform float refracIndex;

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
    vec2 refractCoords = vCoords;
    

    // calculate the incidence vector
    vec3 I = normalize( vWorldPos - camPos );
    vec3 normWorld = vec3( 0.0, 1.0, 0.0 );

    vec3 rfracVec = refract( I, normWorld, 1. / refracIndex );
    float angle = dot( -I, vec3( 0.0, 1.0, 0.0 ) );

	float R = reflScale * pow(1.0 + dot(I, normWorld), reflPower );

    // flipping screen coords for reflection buffer
    vCoords.y = 1.0 - vCoords.y;
    vec4 ref = texture2D( surfaceTex, vCoords );
    gl_FragColor = texture2D( diffuseTex, vec2( vCoords.x, 1. - vCoords.y ) );
    float groundDepth = cameraFar * viewZ;
    vec3 groundPoint = vWorldPos + ( rfracVec * ( groundDepth - vDepth ) );
    float dist = dot( vec3( 0., 1., 0. ), vWorldPos - groundPoint  );
    vec3 projPoint = groundPoint - ( dist * normWorld );
    float waterDepth = 1.0 / pow( viewZ - ( vDepth / cameraFar ), extinctionCoeff ) * 4.0;

vec4 clipSpacePos = projMatrix * (viewMatrix * vec4( vWorldPos, 1.0));
vec4 clipSpacePos2 = projMatrix * (viewMatrix * vec4( projPoint, 1.0));
vec3 ndcSpacePos = clipSpacePos.xyz / clipSpacePos.w;
vec3 ndcSpacePos2 = clipSpacePos2.xyz / clipSpacePos2.w;

    gl_FragColor.rgb *= 1.5;
    gl_FragColor.rgb = mix( gl_FragColor.rgb, vec3( 0.11,0.23,0.28 ), clamp( waterDepth, 0.0, 1.0 ) );
    
    gl_FragColor.rgb = mix( gl_FragColor.rgb, ref.rgb, R );
    gl_FragColor.a = 1.0;

    float vStep =  step( waterDistance, groundDepth - vDepth );
    float gStep = step( groundDepth, waterDistance );
    // gl_FragColor.rgb = vec3( 0., 0., gStep );
    // dist = groundDepth - vDepth;
    // gl_FragColor.rgb = vec3( dist / waterDistance );
    vec2 sCoord1 = ( ndcSpacePos2.xy + 1. ) * .5;
    float sCoord2 = ( ndcSpacePos2.x + 1. ) * .5;
    // gl_FragColor.rgb = vec3( abs( sCoord1 - sCoord2 ) );

    //gl_FragColor = texture2D( diffuseTex, sCoord1 );// * 0.6;


    // if ( dist == 0. ) {
    //   gl_FragColor.rgb = vec3( 1., 0., 0. );
    // }
}