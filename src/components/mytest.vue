<template>
    <div class="test">
        <div id="cont">

        </div>
    </div>
</template>

<script>

import * as THREE from 'three';
import { MapControls } from 'three/examples/jsm/controls/OrbitControls';


export default {
    name: 'test',
    data(){
        return {
            scene: null,
            camera: null,
            renderer: null,
            controls: null,
            mesh: null,
            mouse:{x:0,y:0},
            raycaster: null,
            color: null,
        }
    },
    mounted(){
        this.awake();
            let that = this;
        // when user resize window
        window.addEventListener('resize' , onWindowResize , false);

        function onWindowResize(){
        that.camera.aspect = window.innerWidth / window.innerHeight;
        that.camera.updateProjectionMatrix();
        that.renderer.setSize( window.innerWidth , window.innerHeight );
        }

        onWindowResize();

        document.addEventListener( 'mousemove', that.onMouseMove );
    },
    methods:{
        awake(){
            let cont = document.getElementById('cont');
            
            
            //init scene
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color( 0x222222 );

            //init camera
            this.camera = new THREE.PerspectiveCamera(25 , window.clientWidth/window.clientHeight , 1 , 1000);
            this.camera.position.set(8,4,0);
            
            //init light
            let light0 = new THREE.AmbientLight(0xfafafa , 0.25);

            let light1 = new THREE.PointLight(0xfafafa , 0.4);
            light1.position.set(200 , 90 , 40);

            let light2 = new THREE.PointLight(0xfafafa , 0.25);
            light2.position.set(200 , 90 , -40);

            this.scene.add(light0);
            this.scene.add(light1);
            this.scene.add(light2);

            let gh = new THREE.GridHelper(60 , 160 , new THREE.Color(0x555555) , new THREE.Color( 0x3333333 ) );
            this.scene.add(gh);

            // let boxGeometry = new THREE.BoxGeometry( 1, 1, 1 );
            // let boxMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
            // let box = new THREE.Mesh(boxGeometry , boxMaterial);
            // this.scene.add(box);
            
            //init renderer
            this.renderer = new THREE.WebGLRenderer({amtialias: true});
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(window.innerWidth , window.innerHeight);


            cont.append(this.renderer.domElement);
            
            //init control
            this.controls = new MapControls(this.camera , this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.25;
            this.controls.screenSpacePanning = false;
            this.controls.maxDistance = 800;

            this.raycaster = new THREE.Raycaster();

            const amount = parseInt( window.location.search.substr( 1 ) ) || 10;
            const count = Math.pow( amount, 3 );
            this.color = new THREE.Color();

            let geometry = new THREE.IcosahedronGeometry(0.5, 3);
            let material = new THREE.MeshPhongMaterial();
            this.mesh = new THREE.InstancedMesh(geometry , material , count);
            
            let i = 0;
            const offset = ( amount - 1 ) / 2;

            const matrix = new THREE.Matrix4();

            for ( let x = 0; x < amount; x ++ ) {

                for ( let y = 0; y < amount; y ++ ) {

                    for ( let z = 0; z < amount; z ++ ) {

                        matrix.setPosition( offset - x, offset - y, offset - z );

                        this.mesh.setMatrixAt( i, matrix );
                        this.mesh.setColorAt( i, this.color );

                        i ++;

                    }

                }

            }

            this.scene.add(this.mesh);

            this.controls.update();

            this.update();


        },
        update(){
            requestAnimationFrame(this.update);

            this.raycaster.setFromCamera( this.mouse, this.camera );

            const intersection = this.raycaster.intersectObject( this.mesh );

            if ( intersection.length > 0 ) {

                const instanceId = intersection[ 0 ].instanceId;

                this.mesh.setColorAt( instanceId, this.color.setHex( Math.random() * 0xffffff ) );
                this.mesh.instanceColor.needsUpdate = true;

            }

            this.renderer.render(this.scene , this.camera);
            this.controls.update();
        },

        onMouseMove(event){
            event.preventDefault();
            // let cont = document.getElementById('cont');
            // this.mouse.x = ( event.clientX / cont.offsetWidth ) * 2 - 1 ;
            // this.mouse.y = - ( event.clientY / cont.offsetHeight ) * 2 + 1;
            this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1 ;
            this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        },
    },
}
</script>