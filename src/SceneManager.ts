import {
    THREE 
} from './Internal';

export class SceneManager {

    main : THREE.Scene;

    constructor() {

        this.main = new THREE.Scene();
    	this.main.background = new THREE.Color( 0xbfd1e5 );

        const geometry = new THREE.BoxGeometry( 1000, 1000, 1000 );
        const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
        const cube = new THREE.Mesh( geometry, material );
        this.Add( cube );

    }

    Add( object : THREE.Object3D, scene? : THREE.Scene ) {

        if ( !scene ) {

            scene = this.main;
        }

        scene.add( object );
    }
}