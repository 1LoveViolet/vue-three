<template>
  <div>
    <canvas id="three"></canvas>
  </div>
</template>
    
    <script>
import { gsap } from "gsap";
// 现在浏览器支持ES6语法，自然包括import方式引入js文件
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import * as d3 from "d3";
import axios from "network/axios";
export default {
  data() {
    return {
      renderer: null,
      scene: null,
      camera: null,
      controls: null,
      v: null,
    };
  },
  created() {},
  mounted() {
    this.start();
  },
  destroyed() {
    this.clearScene();
    this.destroyThreejs();
    this.removeEventListeners();
    console.log("执行destroyed钩子函数");
  },
  methods: {
    shader() {
      const vertex = "";
      const fragment = "";
      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
        },
        vertexShader: this.vertex,
        fragmentShader: this.fragment,
        // wireframe: true,
        // wireframe: true,
      });
      const geometry = new THREE.SphereGeometry(1, 128, 128);
      const mesh = new THREE.Mesh(geometry, material);
      this.scene.add(mesh);
    },
    clearScene() {
      cancelAnimationFrame(this.render);
      this.scene.traverse((child) => {
        if (child.material) {
          child.material.dispose();
        }
        if (child.geometry) {
          child.geometry.dispose();
        }
        child = null;
      });
      // this.sceneDomElement.innerHTML = "";
      this.renderer.dispose();
      this.renderer.forceContextLoss();
      this.renderer.clear();
      this.scene.clear();
      console.log("clearScene");
    },
    destroyThreejs() {
      try {
        this.renderer.dispose();
        this.renderer.forceContextLoss();
        this.renderer.content = null;
        let gl = this.renderer.domElement.getContext("webgl");
        if (gl && gl.getExtension("WEBGL_lose_context")) {
          gl.getExtension("WEBGL_lose_context").loseContext();
        }
        this.renderer = null;
        this.camera = null;
        this.scene.traverse((child) => {
          if (child.material) {
            child.material.dispose();
          }
          if (child.geometry) {
            child.geometry.dispose();
          }
          child = null;
        });
        this.scene = null;
      } catch (e) {
        console.error("Failed to destroy threejs", e);
      }
    },
    // 初始化场景
    initScene() {
      this.scene = new THREE.Scene();
      //给场景添加烟雾效果
      // 参数：烟雾颜色，烟雾范围near，烟雾范围far
      this.scene.background = new THREE.Color(0x203d4e);
      // this.scene.background = new THREE.Color(0xffffff);
      this.scene.fog = new THREE.Fog(0x000000, 0, 3000);
      // 给场景添加坐标轴
      // var axes = new THREE.AxesHelper(100);
      // scene.add(axes);
    },
    // 初始化渲染器
    initRenderer() {
      // antialias是否开启抗锯齿
      const canvas = document.querySelector("#three");
      this.renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
      });
      this.renderer.setClearAlpha(0.2);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.physicallyCorrectLights = true;
    },
    // 初始化相机
    initCamera() {
      this.v = new THREE.Vector3(32.499207496643066, 38.21255111694336, 0);
      this.camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      this.camera.position.set(0, -100, 100);
      this.camera.lookAt(this.v);
    }, // 初始化控制器
    initControls() {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      // 阻尼效果
      this.controls.enableDamping = true;
      // 摄像机自动旋转
      this.controls.autoRotate = false;
      // 控制垂直角度的旋转范围
      // controls;
    },
    //初始化光源
    initLight() {
      const directionalLight = new THREE.DirectionalLight(0xe8eaeb, 0.2);
      directionalLight.position.set(0, 10, 5);
      this.scene.add(directionalLight);
    },
    render() {
      // 触底弹跳
      // circle.position.y = Math.abs(Math.sin(elapsedTime * 3));
      const clock = new THREE.Clock();
      const time = clock.getElapsedTime();
      this.material.uniforms.uTime.value = time;
      this.particleMaterial.uniforms.uTime.value = time;
      this.firefliesMaterial.uniforms.uTime.value = time;
      this.textMaterial.uniforms.uTime.value = time;
      // mesh.rotation.y = time;
      requestAnimationFrame(render);
      this.renderer.render(scene, camera);
      this.controls.update();
      this.stats.update(); //更新性能插件
    },

    start() {
      this.initRenderer();
      this.initScene();
      this.initCamera();
      this.initControls();
      this.initLight();
      this.render();
    },
  },
};
</script>
    <style src="@/assets/style/three.css"  scoped></style>