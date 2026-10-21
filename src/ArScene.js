import * as THREE from 'three';

export class ArScene {

	constructor() {
		this.container = document.createElement( 'div' );
		document.body.appendChild( this.container );

		this.scene = new THREE.Scene();

		this.camera = new THREE.PerspectiveCamera(
			70,
			window.innerWidth / window.innerHeight,
			0.01,
			20
		);

		const hemi = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1.5 );
		hemi.position.set( 0.5, 1, 0.25 );
		this.scene.add( hemi );

		this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.renderer.xr.enabled = true;
		this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
		this.renderer.toneMappingExposure = 1.0;
		this.container.appendChild( this.renderer.domElement );

		window.addEventListener( 'resize', () => this.onResize() );
	}

	setEnvironment( hdrTexture ) {
		this.scene.environment = hdrTexture;
	}

	onResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize( window.innerWidth, window.innerHeight );
	}

}
