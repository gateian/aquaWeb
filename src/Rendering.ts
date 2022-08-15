import { AquaWeb, Constants, THREE } from './Internal';

import ShaderPostVert from './shaders/post-vert.glsl';
import ShaderPostFrag from './shaders/post-frag.glsl';

const params = {
    format: THREE.DepthFormat,
    type: THREE.UnsignedShortType
};

export class Rendering {

    depthTarget : THREE.WebGLRenderTarget;
    renderer : THREE.WebGLRenderer;
    postCamera: THREE.OrthographicCamera;
    postMaterial: THREE.ShaderMaterial;
    postScene: THREE.Scene;

    constructor() {

        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
	    this.renderer.setPixelRatio( window.devicePixelRatio );
	    this.renderer.setSize( window.innerWidth, window.innerHeight );

    	AquaWeb.DOM.AddChild( this.renderer.domElement );
    }

    Init() {
        this.SetupDepthRenderTarget();
        this.SetupPost();
    }

    SetupPost() {

        // Setup post processing stage
        this.postCamera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
        this.postMaterial = new THREE.ShaderMaterial( {
            vertexShader: ShaderPostVert,
            fragmentShader: ShaderPostFrag,
            uniforms: {
                cameraNear: { value: AquaWeb.Cameras.active.near },
                cameraFar: { value: AquaWeb.Cameras.active.far },
                tDiffuse: { value: null },
                tDepth: { value: null }
            }
        } );
        const postPlane = new THREE.PlaneGeometry( 2, 2 );
        const postQuad = new THREE.Mesh( postPlane, this.postMaterial );
        this.postScene = new THREE.Scene();
        this.postScene.add( postQuad );

    }

    SetupDepthRenderTarget() {

        if ( this.depthTarget ) this.depthTarget.dispose();

        const format = parseFloat( params.format.toString() );
        const type = parseFloat( params.type.toString() );

        this.depthTarget = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight );
        this.depthTarget.texture.minFilter = THREE.NearestFilter;
        this.depthTarget.texture.magFilter = THREE.NearestFilter;
        this.depthTarget.stencilBuffer = ( format === THREE.DepthStencilFormat ) ? true : false;
        this.depthTarget.depthTexture = new THREE.DepthTexture( window.innerWidth, window.innerHeight, type );
        this.depthTarget.depthTexture.format = format;

    }



    Render() {
        
        AquaWeb.Cameras.MirrorYPlane( Constants.REFLECTION_CAM_NAME, "main", 0 );
        //reflectionCamera.matrixWorldNeedsUpdate = true;
        var normal = new THREE.Vector3( 0, 1, 0 );
        var constant = 0;
        var plane = new THREE.Plane( normal, constant );
        this.renderer.clippingPlanes = [plane];

        AquaWeb.Water.mesh.visible = false;
        this.renderer.setRenderTarget( AquaWeb.Water.waterRenderTex );
        this.renderer.render( AquaWeb.Scenes.main, AquaWeb.Cameras.Get( Constants.REFLECTION_CAM_NAME ) );


        this.renderer.clippingPlanes = [];
        

        AquaWeb.Water.mesh.visible = true;
        this.renderer.setRenderTarget( this.depthTarget );
        this.renderer.render( AquaWeb.Scenes.main, AquaWeb.Cameras.active );

        // render post FX
        this.postMaterial.uniforms.tDiffuse.value = this.depthTarget.texture;
        this.postMaterial.uniforms.tDepth.value = this.depthTarget.depthTexture;

        this.renderer.setRenderTarget( null );
        this.renderer.render( this.postScene, this.postCamera );
    
    }
}