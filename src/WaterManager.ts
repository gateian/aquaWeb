
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

    material : THREE.ShaderMaterial;
    scene : THREE.Scene;

    constructor() {

        // create water reflection camera
        this.waterRenderTex = new THREE.WebGLRenderTarget( 1024, 1024 );
        var camera = AquaWeb.Cameras.CreateCamera( "reflectionCamera", 60, window.innerWidth / window.innerHeight, 10, 20000 );
        camera.layers.set( 0 );

        this.material = new THREE.ShaderMaterial( {

            uniforms: {
        
                _Time: new THREE.Uniform( 0.0 ),
                resolution: new THREE.Uniform( new THREE.Vector2() ),
                surfaceTex: new THREE.Uniform( this.waterRenderTex.texture ),
                camPos: new THREE.Uniform( AquaWeb.Cameras.active.position ),
                cameraNear: new THREE.Uniform( AquaWeb.Cameras.active.near ),
                cameraFar: new THREE.Uniform( AquaWeb.Cameras.active.far ),
                diffuseTex: new THREE.Uniform( AquaWeb.Render.depthTarget.texture ),
                depthTex: new THREE.Uniform( AquaWeb.Render.depthTarget.depthTexture ),                
                _Amplitude: new THREE.Uniform( 10.0 ),
                _Speed: new THREE.Uniform( 1.0 ),
                _Wavelength: new THREE.Uniform( 1.0 ),
                waterDistance: new THREE.Uniform( 1.0 ),
                refracIndex: new THREE.Uniform( 1.333 ),
                projMatrix: new THREE.Uniform( AquaWeb.Cameras.active.projectionMatrix )
            },
            vertexShader: ShaderWaterVert,
            fragmentShader: ShaderWaterFrag,
            wireframe: false
        } );

        // Add water
        const waterGeom = new THREE.PlaneGeometry( 75000, 75000, Constants.WORLD_WIDTH - 1, Constants.WORLD_DEPTH - 1 );
        waterGeom.rotateX( -Math.PI / 2 );
        this.mesh = new THREE.Mesh( waterGeom, this.material );
        this.mesh.position.y = 0;
        this.mesh.layers.set( Constants.LAYERS.Water );
        AquaWeb.Scenes.Add( this.mesh );
    }

    UpdateShader() {

        this.material.uniforms._Time = new THREE.Uniform( AquaWeb.Time );
        this.material.uniforms.camPos =  new  THREE.Uniform( AquaWeb.Cameras.active.position );
        this.material.uniforms.cameraNear =  new  THREE.Uniform( AquaWeb.Cameras.active.near );
        this.material.uniforms.cameraFar =  new  THREE.Uniform( AquaWeb.Cameras.active.far );
    }
}