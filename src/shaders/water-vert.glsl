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
#define PI 3.1415926538

uniform float _Wavelength;
uniform float _Speed;
uniform float _Amplitude;
uniform float _Time;


void main() {
	
	vec4 p = vec4( position, 1.0 );

	// vec3 tangent = normalize( vec3( 1.0, cos( p.x ), 0.0 ) );
	// vNormal = vec3( -tangent.y, tangent.x, 0.0 );
	// vNormal = vec3( 0.0, p.y, 0.0 );

	// Gerstner Wave
	float k = 2.0 * PI / _Wavelength;
	float f = k * (p.x - _Speed * _Time);
	p.x += _Amplitude * cos(f);
	p.y = _Amplitude * sin(f);

	vec3 tangent = normalize( vec3(
				1.0 - k * _Amplitude * sin( f ),
				k * _Amplitude * cos( f ),
				0.0
			));
	vNormal = vec3( -tangent.y, tangent.x, 0.0 );

	p = modelViewMatrix * p;
    vDepth = -p.z;

    vPos = projectionMatrix * p;
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