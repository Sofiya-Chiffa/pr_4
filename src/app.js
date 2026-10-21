import * as THREE from 'three';
import { ARButton } from 'three/addons/webxr/ARButton.js';

import { ArScene } from './ArScene.js';
import { ModelLoader } from './ModelLoader.js';
import { HitTestController } from './HitTestController.js';
import { ObjectManager } from './ObjectManager.js';
import { UIManager } from './UIManager.js';

async function main() {

	const ar = new ArScene();
	const loader = new ModelLoader();
	const hitTest = new HitTestController( ar.scene, ar.renderer );
	const objects = new ObjectManager( ar.scene );
	const ui = new UIManager( objects );

	try {
		const hdr = await loader.loadHDR( 'environment.hdr' );
		ar.setEnvironment( hdr );
	} catch ( e ) {
		console.warn( 'HDR не загрузился, используем только HemisphereLight', e );
	}

	try {
		const model = await loader.loadGLB( 'plant.glb' );
		objects.setTemplate( model );
	} catch ( e ) {
		console.error( 'plant.glb не загрузился', e );
	}

	document.body.appendChild(
		ARButton.createButton( ar.renderer, { requiredFeatures: [ 'hit-test' ] } )
	);

	const onSelect = () => {
		const matrix = hitTest.getPlacementMatrix();
		if ( matrix ) objects.place( matrix );
	};

	[ 0, 1 ].forEach( ( i ) => {
		const c = ar.renderer.xr.getController( i );
		c.addEventListener( 'select', onSelect );
		ar.scene.add( c );
	} );

	ar.renderer.setAnimationLoop( ( timestamp, frame ) => {
		hitTest.update( frame );
		ar.renderer.render( ar.scene, ar.camera );
	} );

}

main();
