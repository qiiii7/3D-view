<template>
    <div class="test">
        <div id="cont">

        </div>
    </div>
</template>

<script>

import * as THREE from 'three';
import { MapControls } from 'three/examples/jsm/controls/OrbitControls';
import { ImageLoader } from 'three';


export default {
    name: 'test',
    data(){
        return {
            scene: null,
            camera: null,
            renderer: null,
            controls: null,
            loader : null,
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

        this.loader = new ImageLoader();
        this.loader.load('./img/test2.jpg' , this.addImgCube , p => {console.log("p ---> ",p)} , e => {console.log("e ---> " , e)});
        this.addHouse();
        this.addExtrude();

        this.controls.update();

        this.update();


        },
        update(){
            requestAnimationFrame(this.update);
            this.renderer.render(this.scene , this.camera);
            this.controls.update();
        },
        addImgCube(img){
            const texture = new THREE.CanvasTexture( img );
            const material = new THREE.MeshBasicMaterial( {color: 0xff8888, map: texture} );
            const geometry = new THREE.BoxGeometry(9,0.1,9);
            const cube = new THREE.Mesh(geometry , material);
            cube.position.set(0,0,0);
            this.scene.add(cube);
        },
        addHouse(){
            const geometry = new THREE.BoxGeometry(0.8,4,0.5);
            const material = new THREE.MeshLambertMaterial();
            const house = new THREE.Mesh(geometry , material);
            house.position.set(0,2,0);
            this.scene.add(house);
        },
        addExtrude(){
            const setting = {
                steps: 1,
                depth: 1,
                bevelEnabled: false,
                bevelThickness: 1,
                bevelSize: 1,
                bevelOffset: 0,
                bevelSegments: 1
            };
            const shape = new THREE.Shape();
            shape.moveTo(0,0);
            shape.lineTo(0,2);
            shape.lineTo(-2,2);
            shape.lineTo(-1,1);
            shape.lineTo(-2,0);
            const geometry = new THREE.ExtrudeGeometry(shape , setting);
            const material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
            const mesh = new THREE.Mesh( geometry, material ) ;
            mesh.position.set(0,0,0);
            this.scene.add( mesh );
        },

    },
}
</script>