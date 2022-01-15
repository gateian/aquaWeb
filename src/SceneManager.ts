import {
    THREE 
} from './Internal';

export class SceneManager {

    main : THREE.Scene;

    constructor() {

        this.main = new THREE.Scene();
    	this.main.background = new THREE.Color( 0xbfd1e5 );

    }

    Add( object : THREE.Object3D, scene? : THREE.Scene ) {

        if ( !scene ) {

            scene = this.main;
        }

        scene.add( object );
    }
}