import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js';

import {
    AquaWeb,
    THREE
} from './Internal';

export class InputManager {

    controls : OrbitControls;
    raycaster: THREE.Raycaster;

    constructor() {

        this.raycaster = new THREE.Raycaster();

        this.controls = new OrbitControls( AquaWeb.Cameras.active, AquaWeb.Render.renderer.domElement );
        this.controls.minDistance = 1000;
        this.controls.maxDistance = 10000;
        this.controls.maxPolarAngle = Math.PI / 2;

        this.controls.target.y = AquaWeb.Terrain.GetTerrainCentreHeight() + 500;
        AquaWeb.Cameras.active.position.y = this.controls.target.y + 2000;
        AquaWeb.Cameras.active.position.x = 2000;
        this.controls.update();

        let self = this;

	    AquaWeb.DOM.container.addEventListener( 'pointermove', this.OnPointerMove( self ) );
        window.addEventListener( 'resize', this.OnWindowResize );
    }

    OnPointerMove( self : InputManager ) {
    
        return ( event : MouseEvent ) => {

            const pointer = new THREE.Vector2();
            pointer.x = ( event.clientX / AquaWeb.Render.renderer.domElement.clientWidth ) * 2 - 1;
            pointer.y = - ( event.clientY / AquaWeb.Render.renderer.domElement.clientHeight ) * 2 + 1;
            self.raycaster.setFromCamera( pointer, AquaWeb.Cameras.active );
        
            // See if the ray from the camera into the world hits one of our meshes
            const intersects = this.raycaster.intersectObject( AquaWeb.Terrain.mesh );
        
            // Toggle rotation bool for meshes that we clicked
            if ( intersects.length > 0 ) {
        
                AquaWeb.Terrain.helperMesh.position.set( 0, 0, 0 );
                AquaWeb.Terrain.helperMesh.lookAt( intersects[ 0 ].face.normal );
        
                AquaWeb.Terrain.helperMesh.position.copy( intersects[ 0 ].point );
        
            }
        
        }
    }

    OnWindowResize() {

        AquaWeb.Cameras.active.aspect = window.innerWidth / window.innerHeight;
        AquaWeb.Cameras.active.updateProjectionMatrix();
    
        AquaWeb.Render.renderer.setSize( window.innerWidth, window.innerHeight );
    
    }
}