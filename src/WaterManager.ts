
import {
    AquaWeb,
    Constants,
    THREE
} from './Internal';

export class WaterManager {
    waterRenderTex: THREE.WebGLRenderTarget

    constructor() {

        // create water reflection camera
        this.waterRenderTex = new THREE.WebGLRenderTarget( 512, 512 );
        AquaWeb.Cameras.CreateCamera( "reflectionCamera", 60, window.innerWidth / window.innerHeight, 10, 20000 );

        // Add water
        const waterGeom = new THREE.PlaneGeometry( 7500, 7500, Constants.WORLD_WIDTH - 1, Constants.WORLD_DEPTH - 1 );
        waterGeom.rotateX( -Math.PI / 2 );
        const mesh = new THREE.Mesh( waterGeom, new THREE.MeshBasicMaterial( { color: 0xA0D7F5, map: this.waterRenderTex.texture } ) );
        mesh.position.y = 500;
        AquaWeb.Scenes.Add( mesh );
    }
}