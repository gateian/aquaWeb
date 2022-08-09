varying vec4 vPos;
  
void main() {

  	vec2 vCoords = vPos.xy;
	vCoords /= vPos.w;
	vCoords = vCoords * 0.5 + 0.5;
  
  	vec2 uv = fract( vCoords * 10.0 );
    gl_FragColor = vec4( uv, 0.0, 1.0 );
}