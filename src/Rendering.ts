import { AquaWeb, Constants, THREE } from './Internal';




export class Rendering {

    renderer : THREE.WebGLRenderer;

    constructor() {

        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
	    this.renderer.setPixelRatio( window.devicePixelRatio );
	    this.renderer.setSize( window.innerWidth, window.innerHeight );

    	AquaWeb.DOM.AddChild( this.renderer.domElement );
    }

    Render() {

        
        AquaWeb.Cameras.MirrorYPlane( Constants.REFLECTION_CAM_NAME, "main", 0 );
        //reflectionCamera.matrixWorldNeedsUpdate = true;
    
        AquaWeb.Water.mesh.visible = false;
        this.renderer.setRenderTarget( AquaWeb.Water.waterRenderTex );
        this.renderer.render( AquaWeb.Scenes.main, AquaWeb.Cameras.Get( Constants.REFLECTION_CAM_NAME ) );

        AquaWeb.Water.mesh.visible = true;
        this.renderer.setRenderTarget( null );
        this.renderer.render( AquaWeb.Scenes.main, AquaWeb.Cameras.active );
    
    }
}