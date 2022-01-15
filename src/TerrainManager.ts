import { ImprovedNoise } from '../node_modules/three/examples/jsm/math/ImprovedNoise.js';
import { AquaWeb, THREE } from './Internal';


const worldWidth = 256, worldDepth = 256,
	worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2;
    
export class TerrainManager {
    data: Uint8Array;
    texture : THREE.CanvasTexture;
    vertices : number[];
    mesh: THREE.Mesh;
    helperMesh: THREE.Mesh;

    constructor() {

	    this.data = this.GenerateHeight( worldWidth, worldDepth );
        
        const geometry = new THREE.PlaneGeometry( 7500, 7500, worldWidth - 1, worldDepth - 1 );
        geometry.rotateX( - Math.PI / 2 );
    
        this.vertices = Array.from( geometry.attributes.position.array );
    
        for ( let i = 0, j = 0, l = this.vertices.length; i < l; i ++, j += 3 ) {
    
            this.vertices[ j + 1 ] = this.data[ i ] * 10;    
        }
        
        this.texture = new THREE.CanvasTexture( this.GenerateTexture( this.data, worldWidth, worldDepth ) );
        this.texture.wrapS = THREE.ClampToEdgeWrapping;
        this.texture.wrapT = THREE.ClampToEdgeWrapping;
    
        this.mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { map: this.texture } ) );
        AquaWeb.Scenes.Add( this.mesh );

        const geometryHelper = new THREE.ConeGeometry( 20, 100, 3 );
        geometryHelper.translate( 0, 50, 0 );
        geometryHelper.rotateX( Math.PI / 2 );
        this.helperMesh = new THREE.Mesh( geometryHelper, new THREE.MeshNormalMaterial() );
        AquaWeb.Scenes.Add( this.helperMesh );
    }    

    GenerateHeight( width, height ) {

        const size = width * height;
        const data = new Uint8Array( size );
        const perlin = new ImprovedNoise()
        const z = Math.random() * 100;
    
        let quality = 1;
    
        for ( let j = 0; j < 4; j ++ ) {
    
            for ( let i = 0; i < size; i ++ ) {
    
                const x = i % width, y = ~ ~ ( i / width );
                data[ i ] += Math.abs( perlin.noise( x / quality, y / quality, z ) * quality * 1.75 );
    
            }
    
            quality *= 5;
    
        }
    
        return data;
    
    }

    GenerateTexture( data, width, height ) {

        // bake lighting into texture
    
        let context, image, imageData, shade;
    
        const vector3 = new THREE.Vector3( 0, 0, 0 );
    
        const sun = new THREE.Vector3( 1, 1, 1 );
        sun.normalize();
    
        const canvas = document.createElement( 'canvas' );
        canvas.width = width;
        canvas.height = height;
    
        context = canvas.getContext( '2d' );
        context.fillStyle = '#000';
        context.fillRect( 0, 0, width, height );
    
        image = context.getImageData( 0, 0, canvas.width, canvas.height );
        imageData = image.data;
    
        for ( let i = 0, j = 0, l = imageData.length; i < l; i += 4, j ++ ) {
    
            vector3.x = data[ j - 2 ] - data[ j + 2 ];
            vector3.y = 2;
            vector3.z = data[ j - width * 2 ] - data[ j + width * 2 ];
            vector3.normalize();
    
            shade = vector3.dot( sun );
    
            imageData[ i ] = ( 96 + shade * 128 ) * ( 0.5 + data[ j ] * 0.007 );
            imageData[ i + 1 ] = ( 32 + shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );
            imageData[ i + 2 ] = ( shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );
    
        }
    
        context.putImageData( image, 0, 0 );
    
        // Scaled 4x
    
        const canvasScaled = document.createElement( 'canvas' );
        canvasScaled.width = width * 4;
        canvasScaled.height = height * 4;
    
        context = canvasScaled.getContext( '2d' );
        context.scale( 4, 4 );
        context.drawImage( canvas, 0, 0 );
    
        image = context.getImageData( 0, 0, canvasScaled.width, canvasScaled.height );
        imageData = image.data;
    
        for ( let i = 0, l = imageData.length; i < l; i += 4 ) {
    
            const v = ~ ~ ( Math.random() * 5 );
    
            imageData[ i ] += v;
            imageData[ i + 1 ] += v;
            imageData[ i + 2 ] += v;
    
        }
    
        context.putImageData( image, 0, 0 );
    
        return canvasScaled;
    
    }

    GetTerrainCentreHeight() {

        return this.data[ worldHalfWidth + worldHalfDepth * worldWidth ];
    }
}