import * as THREE from 'three';

export class HitTestController {

	constructor( scene, renderer ) {
		this.scene = scene;
		this.renderer = renderer;

		this.hitTestSource = null;
		this.hitTestSourceRequested = false;

		this.reticle = new THREE.Mesh(
			new THREE.RingGeometry( 0.15, 0.2, 32 ).rotateX( - Math.PI / 2 ),
			new THREE.MeshBasicMaterial( { color: 0x00ff88, side: THREE.DoubleSide } )
		);
		this.reticle.matrixAutoUpdate = false;
		this.reticle.visible = false;
		scene.add( this.reticle );

		this._onPlaceCallbacks = [];
	}

	onPlace( callback ) {
		this._onPlaceCallbacks.push( callback );
	}

	update( frame ) {

		if ( ! frame ) return;

		const session = this.renderer.xr.getSession();
		const referenceSpace = this.renderer.xr.getReferenceSpace();

		if ( this.hitTestSourceRequested === false ) {

			session.requestReferenceSpace( 'viewer' ).then( ( space ) => {
				session.requestHitTestSource( { space } ).then( ( source ) => {
					this.hitTestSource = source;
				} );
			} );

			session.addEventListener( 'end', () => {
				this.hitTestSourceRequested = false;
				this.hitTestSource = null;
			} );

			this.hitTestSourceRequested = true;
		}

		if ( this.hitTestSource ) {

			const results = frame.getHitTestResults( this.hitTestSource );

			if ( results.length ) {
				const hit = results[ 0 ];
				this.reticle.visible = true;
				this.reticle.matrix.fromArray(
					hit.getPose( referenceSpace ).transform.matrix
				);
			} else {
				this.reticle.visible = false;
			}

		}

	}

	getPlacementMatrix() {
		if ( ! this.reticle.visible ) return null;
		return this.reticle.matrix.clone();
	}

}
