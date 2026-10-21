import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

export class ModelLoader {

	constructor() {
		this.gltfLoader = new GLTFLoader();
		this.rgbeLoader = new RGBELoader();
	}

	loadGLB( url ) {
		return new Promise( ( resolve, reject ) => {
			this.gltfLoader.load( url, ( gltf ) => {
				const model = gltf.scene;
				const box = new THREE.Box3().setFromObject( model );
				const center = new THREE.Vector3();
				box.getCenter( center );
				model.position.x -= center.x;
				model.position.z -= center.z;
				model.position.y -= box.min.y;
				model.traverse( ( o ) => {
					if ( o.isMesh ) {
						o.castShadow = true;
						o.receiveShadow = true;
						if ( o.material && o.material.isMeshBasicMaterial ) {
							o.material = new THREE.MeshStandardMaterial( {
								color: o.material.color,
								map: o.material.map,
								roughness: 0.7,
								metalness: 0.1
							} );
						}
					}
				} );
				resolve( model );
			}, undefined, reject );
		} );
	}

	loadHDR( url ) {
		return new Promise( ( resolve, reject ) => {
			this.rgbeLoader.load( url, ( texture ) => {
				texture.mapping = THREE.EquirectangularReflectionMapping;
				resolve( texture );
			}, undefined, reject );
		} );
	}

}
