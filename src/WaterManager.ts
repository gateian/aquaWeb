
import {
    AquaWeb,
    Constants,
    THREE
} from './Internal';

import ShaderWaterVert from "./shaders/water-vert.glsl";
import ShaderWaterFrag from "./shaders/water-frag.glsl";

export class WaterManager {
    waterRenderTex: THREE.WebGLRenderTarget
    mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;

    constructor() {

        // create water reflection camera
        this.waterRenderTex = new THREE.WebGLRenderTarget( 512, 512 );
        AquaWeb.Cameras.CreateCamera( "reflectionCamera", 60, window.innerWidth / window.innerHeight, 10, 20000 );

        const material = new THREE.ShaderMaterial( {

            uniforms: {
        
                time: { value: 1.0 },
                resolution: { value: new THREE.Vector2() },
                surfaceTex: new THREE.Uniform( this.waterRenderTex.texture )
        
            },
            vertexShader: ShaderWaterVert,
            fragmentShader: ShaderWaterFrag
        } );

        // Add water
        const waterGeom = new THREE.PlaneGeometry( 7500, 7500, Constants.WORLD_WIDTH - 1, Constants.WORLD_DEPTH - 1 );
        waterGeom.rotateX( -Math.PI / 2 );
        this.mesh = new THREE.Mesh( waterGeom, material );
        this.mesh.position.y = 0;
        AquaWeb.Scenes.Add( this.mesh );
    }
}