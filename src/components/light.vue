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
    name: 'light',
    data(){
        return {
            scene: null,
            camera: null,
            renderer: null,
            controls: null,
            loader : null,
            light : null,
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
        // let light0 = new THREE.AmbientLight(0xfafafa , 0.25);

        // let light1 = new THREE.PointLight(0xfafafa , 0.4);
        // light1.position.set(200 , 90 , 40);

        // let light2 = new THREE.PointLight(0xfafafa , 0.25);
        // light2.position.set(200 , 90 , -40);

        // this.scene.add(light0);
        // this.scene.add(light1);
        // this.scene.add(light2);

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
        this.renderer.setClearColor(0xEEEEEE , 1.0);
        this.renderer.shadowMapEnabled = true;


        cont.append(this.renderer.domElement);
        
        //init control
        this.controls = new MapControls(this.camera , this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.25;
        this.controls.screenSpacePanning = false;
        this.controls.maxDistance = 800;

        this.addPointLight();

        this.addBuilding();

        this.controls.update();

        this.update();

        },
        update(){
            this.light.position.x -= 0.01;
            requestAnimationFrame(this.update);
            this.renderer.render(this.scene , this.camera);
            this.controls.update();
        },
        addPointLight(){
            // const geometry = new THREE.BoxGeometry(10,0.1,10);
            // const material = new THREE.MeshLambertMaterial();
            // const space = new THREE.Mesh(geometry , material);
            // space.position.set(0,0,0);
            // space.receiveShadow = true;
            // this.scene.add(space);
            // var pointColor = "#ccffcc";
            // this.light = new THREE.PointLight(pointColor , 2 , 10);
            // const sphere = new THREE.SphereGeometry(0.1 , 10 , 10);
            // this.light.position.set(4,0.8,0);
            // this.light.add(new THREE.Mesh(sphere , new THREE.MeshBasicMaterial({color: 0x10FFBC})));
            // // this.light.color.setHSL( 5000, 0, - 1000 );
            // this.light.castShadow = true;
            // this.scene.add( this.light );

            const planeGeometry = new THREE.PlaneGeometry(60, 20, 20, 20);
            const planeMaterial = new THREE.MeshPhongMaterial({color: 0xffffff});
            const plane = new THREE.Mesh(planeGeometry, planeMaterial);
            plane.receiveShadow = true;
            this.scene.add(plane);
            var pointColor = "#ccffcc";
            this.light = new THREE.PointLight(pointColor , 2 , 10);
            // pointLight.distance = 100;
            this.scene.add(this.light);
            
        },
        addBuilding(){
            const geometry = new THREE.BoxGeometry(0.5,3,10);
            const material = new THREE.MeshLambertMaterial({color: 0xF5F5F5});
            const building = new THREE.Mesh(geometry , material);
            building.position.set(0,1.5,0);
            building.castShadow = true;
            this.scene.add(building);
        }
    }
}
</script>