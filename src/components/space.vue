<template>
  <div class="space">
      <div id="cont"></div>
  </div>
</template>

<script>

import * as THREE from 'three';
import { MapControls } from 'three/examples/jsm/controls/OrbitControls';
import * as GEOLIB from 'geolib';
import Stats from 'three/examples/jsm/libs/stats.module';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export default {
  name: 'space',
  data(){
    return{
      scene: null,
      camera: null,
      renderer: null,
      controls: null,
      center: [106.5413324,29.5560128],
      COM_MATERIAL: null,
      stats: null,

      geoBuilding: [],
      //interactive Root
      iR : null,

      //collider
      colliderBuiding: [],
      raycaster: null,
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

    document.getElementById('cont').addEventListener('click' , event => {
        let mouse = {
            x: ( event.clientX / window.innerWidth ) * 2 - 1,
            y: - ( event.clientY / window.innerHeight ) * 2 + 1,
        };

        let hitted = that.fire(mouse);
        console.log(mouse)
        console.log(hitted);
    });
  },
  methods: {
    awake(){
      let cont = document.getElementById('cont');
      
      //init scene
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color( 0x222222 );

      //init camera
      this.camera = new THREE.PerspectiveCamera(25 , window.clientWidth/window.clientHeight , 1 , 1000);
      this.camera.position.set(8,4,0);

      this.raycaster = new THREE.Raycaster();

      //init group
      this.iR = new THREE.Group();
      this.iR.name = "interactive Root";
      this.$nextTick(()=>{
        this.scene.add(this.iR);
      })
      
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

      this.controls.update();

      //add fps checker
      this.stats = new Stats();
      cont.appendChild(this.stats.domElement);

      this.update();

      this.COM_MATERIAL = new THREE.MeshPhongMaterial();

      this.getGeoJson();

    },

    update(){
      requestAnimationFrame(this.update);
      this.stats.update();
      this.renderer.render(this.scene , this.camera);
      this.controls.update();
    },

    getGeoJson(){
      fetch("./assets/edinburgh.geojson").then(res =>{
        res.json().then(data => {
          this.loadBuilding(data);
        })
      })
    },

    loadBuilding(data){
        let features = data.features;

        for(let i=0 ; i<features.length; i++){
          let fel = features[i];
          if ( !fel['properties'] ) return;

          if ( fel.properties['building'] ){
            this.addBuiding(fel.geometry.coordinates , fel.properties , fel.properties['building:levels']);
          }
        }

        let that = this;
        this.$nextTick(() => {
            let mergeGeometery = BufferGeometryUtils.mergeBufferGeometries(that.geoBuilding);
            let mesh = new THREE.Mesh(mergeGeometery , that.COM_MATERIAL);
            that.iR.add(mesh);
        });
    },

    addBuiding(data, info, height=1){

        let shape, geometry;
        let holes = [];

      for(let i = 0; i < data.length ; i++){
        let el = data[i];
        el.add(new THREE.append)

        if( i== 0 ){
          shape = this.getShape(el , this.center);
        }else{
          holes.push( this.getShape(el , this.center) );
        }
      }

      for(let i = 0; i < holes.length; i++){
        shape.holes.push(holes[i]);
      }
        
      geometry = this.genGeometry(shape , {
                                          curveSegment: 1,
                                          depth: 0.1*height,
                                          bevelEnabled: false,
                                        }
                                  );
      geometry.rotateX(Math.PI / 2);
      geometry.rotateZ(Math.PI);

      // let mesh = new THREE.Mesh(geometry , this.COM_MATERIAL);

      // this.scene.add(mesh);
      this.geoBuilding.push(geometry);
      
      let helper = this.genHelper(geometry);

      if(helper){
        helper.name = info['name'] ? info['name'] : 'buiding';
        helper.info = info;
        this.colliderBuiding.push(helper);
      }

    },

    genHelper(geometry){
        if(!geometry.boundingBox){
          geometry.computeBoundingBox();
        }

        let box3 = geometry.boundingBox;
        if( !isFinite(box3.max.x) ){
          return false;
        }

        let helper = new THREE.Box3Helper(box3 , 0xffff00);
        helper.updateMatrixWorld();
        return helper;
    },

    fire(mouse){

      this.raycaster.setFromCamera(mouse , this.camera);
      let intersects = this.raycaster.intersectObjects(this.colliderBuiding , true);

      if( intersects.length >= 1 ){
        let buiding = intersects[0].object;
        console.log(buiding)
        return buiding;
      }else{
        return false;
      }

    },

    getShape(points , center){
        let shape = new THREE.Shape();

        for(let i = 0 ; i < points.length ; i++){
          let elp = points[i];

          elp = this.GPSRelaticePosition(elp , center);

          if ( i== 0){
            shape.moveTo(elp[0] , elp[1]);
          } else{
            shape.lineTo(elp[0] , elp[1]);
          }
        }

        return shape;
    },

    genGeometry(shape , config){
        let geometry = new THREE.ExtrudeGeometry(shape , config);
        geometry.computeBoundingBox();
        return geometry;
    },

    GPSRelaticePosition(objposi , centerPosi){
      //get gps distance
      let dis = GEOLIB.getDistance(objposi , centerPosi);

      //get bearing angle
      let bearing = GEOLIB.getRhumbLineBearing(objposi , centerPosi);

      //calculate x by centerPosi.x + distance * cos(rad)
      let x = centerPosi[0] + (dis * Math.cos(bearing * Math.PI / 100));

      //calculate y by centerPosi.x + distance * cos(rad)
      let y = centerPosi[1] + (dis * Math.sin(bearing * Math.PI / 100));

      return [-x/100 , y/100];

    }
  }
}
</script>


<style scoped>

</style>
