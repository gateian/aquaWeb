#ifdef USE_LOGDEPTHBUF

	#ifdef USE_LOGDEPTHBUF_EXT

		varying float vFragDepth;

	#endif

	uniform float logDepthBufFC;

#endif

#define EPSILON 1e-6
#define WORLD_UP vec3( 0.0, 1.0, 0.0 )
#define FRESNEL_POWER 1.5
#define FRESNEL_SCALE 1.2

varying vec2 vUv;
varying vec3 vClipPosition;
varying vec3 vWorldPos;

uniform float refractionStrength;

void main() {

    vUv = uv;
    vWorldPos = ( modelMatrix * vec4( position, 1. ) ).xyz;
   

    vec4 waterNormal = viewMatrix * vec4( WORLD_UP, 1.0 );
    vec3 I = normalize( vWorldPos - cameraPosition );

    vec3 R = refract( normalize( vWorldPos - cameraPosition ), WORLD_UP, 1.0 / 1.33 );
    // pos.xy -= R.xy * _RefractionStrength * step(wPos.y, 0.0) * abs(wPos.y);
    float fresnel = FRESNEL_SCALE * pow( 1.0 + dot( normalize( I ), WORLD_UP ), FRESNEL_POWER );

    // vec3 eyeVec = normalize( cameraPosition - vWorldPos );
    // float angle = acos( dot( eyeVec, WORLD_UP ) );

    // float refractMag = abs( vWorldPos.y ) / cos( angle );
    // vec3 surfacePoint = vWorldPos + ( eyeVec * refractMag );
    // // vWorldPos = mix( vWorldPos, vWorldPos - ( R * refractMag * refractionStrength ), step( vWorldPos.y, 0. ) );
    // //vWorldPos = mix( vWorldPos, surfacePoint, step( vWorldPos.y, 0.0 ) );

    // vec3 refrOffsetPoint = surfacePoint + ( R * refractMag );
    // vec3 finalOffset = vWorldPos - refrOffsetPoint ;

    //vWorldPos = mix( vWorldPos, vWorldPos + finalOffset * refractionStrength, step( vWorldPos.y, 0.0 ) );
    //vWorldPos -= finalOffset * refractionStrength;

    vWorldPos.y = mix( vWorldPos.y, 0.0, step( vWorldPos.y, 0.0 ) * clamp( abs(  fresnel ), 0.0, 1.0 ) * refractionStrength );

    vec4 mvPosition = viewMatrix * vec4( vWorldPos, 1.0 );
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