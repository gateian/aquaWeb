varying vec4 vPos;
uniform sampler2D surfaceTex;
  
void main() {

  	vec2 vCoords = vPos.xy;
	vCoords /= vPos.w;
	vCoords = vCoords * 0.5 + 0.5;
    vCoords.y = 1.0 - vCoords.y;

    gl_FragColor = texture2D( surfaceTex, vCoords );
    gl_FragColor *= 1.1;
}