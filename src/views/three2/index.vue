<template>
  <div>
    <canvas id="three" ref="three_container"></canvas>
  </div>
</template>
      
      <script>
import { gsap } from "gsap";
// 现在浏览器支持ES6语法，自然包括import方式引入js文件
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
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
      material: null,
      points: null,
      clock: null,
      stats: null,
      animationId: null,
    };
  },
  created() {},
  mounted() {
    this.stats = new Stats();
    this.clock = new THREE.Clock();
    document.body.appendChild(this.stats.domElement);
    this.start();
    window.addEventListener("resize", this.onWindowResize);
  },
  beforeDestroy() {
    console.log("销毁了three");
    cancelAnimationFrame(this.animationId);
    while (this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0]);
    }
    this.scene.traverse((object) => {
      if (object.isMesh) {
        object.geometry.dispose();
        object.material.dispose();
      }
    });
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  },
  activated() {
    this.stats = new Stats();
    this.clock = new THREE.Clock();
    document.body.appendChild(this.stats.domElement);
    this.start();
    // onresize 事件会在窗口被调整大小时发生
    window.addEventListener("resize", this.onWindowResize);
  },
  // deactivated() {
  //   console.log("销毁了three");
  //   cancelAnimationFrame(this.animationId);
  //   while (this.scene.children.length > 0) {
  //     this.scene.remove(this.scene.children[0]);
  //   }
  //   this.scene.traverse((object) => {
  //     if (object.isMesh) {
  //       object.geometry.dispose();
  //       object.material.dispose();
  //     }
  //   });
  //   this.renderer.dispose();
  //   this.renderer.forceContextLoss();
  // },
  methods: {
    onWindowResize() {
      // 重置渲染器输出画布canvas尺寸
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      // 全屏情况下：设置观察范围长宽比aspect为窗口宽高比
      this.camera.aspect = window.innerWidth / window.innerHeight;
      // 渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
      // 但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
      // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
      this.camera.updateProjectionMatrix();
    },

    toThree1() {
      this.$router.push("/three1");
    },
    shader1() {
      const vertex = `precision mediump float;
      uniform float uTime;
  varying vec2 vUv;
  attribute float aSize;
  attribute vec4 aShift;
  varying vec3 vColor;

  const float PI = 3.141592653589793238;

  void main() {
    vUv = uv;
    vec3 color1 = vec3(227., 155., 0.);
    vec3 color2 = vec3(100., 50., 255.);
    // float d = fract(length(abs(position) / vec3(40., 10., 40.))*1000.0);
    float d = length(abs(position) / vec3(40., 10., 40.));
    d = clamp(d, 0., 1.);
    vColor = mix(color1, color2, d) / 255.0;

    vec3 transformed = position;
  float theta = mod(aShift.x + aShift.z * uTime, PI * 2.);
  float phi = mod(aShift.y + aShift.z * uTime, PI * 2.);
  transformed += vec3(sin(phi) * cos(theta), cos(phi), sin(phi) * sin(theta)) * aShift.w;


    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
    gl_PointSize = 50.0 / -mvPosition.z*aSize;
    gl_Position = projectionMatrix * mvPosition;

  }`;
      const fragment = `  precision mediump float;
      varying vec2 vUv;
  varying vec3 vColor;

  void main() {
  //   float mask = step(length(gl_PointCoord - 0.5),0.5);
  // if(mask < 0.5) discard;
  // gl_FragColor = vec4(vColor, 1.0);

  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  gl_FragColor = vec4(vColor, smoothstep(1.0, 0.1, d));
  }`;
      this.material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
        },
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        // wireframe: true,
        // wireframe: true,
      });
      const count1 = 50000;
      const count2 = 100000;
      const geometry = new THREE.BufferGeometry();
      const positions = [];
      const sizes = [];
      const shifts = [];
      for (let i = 0; i < count1 + count2; i++) {
        let theta = Math.random() * Math.PI * 2;
        // let phi = Math.random() * Math.PI; // 两极密集
        let phi = Math.acos(Math.random() * 2 - 1); // 分布更均匀
        let size = Math.random() * 1.5 + 0.5; // 0.5-2.0
        let angle = (Math.random() * 0.9 + 0.1) * Math.PI * 0.1;
        let strength = Math.random() * 0.9 + 0.1; // 0.1-1
        shifts.push(theta, phi, angle, strength);

        sizes.push(size);
        if (i < count1) {
          // let r = 10;
          let r = Math.random() * 0.5 + 9.5;
          // let x = r * Math.sin(phi) * Math.cos(theta);
          // let y = r * Math.cos(phi);
          // let z = r * Math.sin(phi) * Math.sin(theta);
          let { x, y, z } = new THREE.Vector3()
            .randomDirection()
            .multiplyScalar(r);
          positions.push(x, y, z);
        } else {
          // 圆盘/圆柱部分
          let r = 10;
          let R = 40;
          let rand = Math.pow(Math.random(), 1.5);
          let radius = Math.sqrt(R * R * rand + (1 - rand) * r * r);
          let { x, y, z } = new THREE.Vector3().setFromCylindricalCoords(
            radius,
            Math.random() * 2 * Math.PI,
            (Math.random() - 0.5) * 2
          );
          positions.push(x, y, z);
        }
      }

      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3)
      );
      geometry.setAttribute(
        "aSize",
        new THREE.Float32BufferAttribute(sizes, 1)
      );
      geometry.setAttribute(
        "aShift",
        new THREE.Float32BufferAttribute(shifts, 4)
      );

      this.points = new THREE.Points(geometry, this.material);
      this.points.rotation.order = "ZYX";
      this.points.rotation.z = 0.2;
      this.scene.add(this.points);
    },
    // 初始化场景
    initScene() {
      this.scene = new THREE.Scene();
      //给场景添加烟雾效果
      // 参数：烟雾颜色，烟雾范围near，烟雾范围far
      this.scene.background = new THREE.Color(0x111111);
      // this.scene.background = new THREE.Color(0xffffff);
      this.scene.fog = new THREE.Fog(0x000000, 0, 3000);
      // 给场景添加坐标轴
      //   var axes = new THREE.AxesHelper(100);
      //   this.scene.add(axes);
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
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setClearColor(0xeeeeee);
      document.body.appendChild(this.renderer.domElement);
    },
    // 初始化相机
    initCamera() {
      this.camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      this.camera.position.set(30, 8, 30);
    }, // 初始化控制器
    initControls() {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      // 阻尼效果
      this.controls.enableDamping = true;
      // 摄像机自动旋转
      this.controls.autoRotate = false;
      // 控制垂直角度的旋转范围
      // controls;

      this.controls.enableZoom = false;
      // to disable rotation
      this.controls.enableRotate = false;
      // to disable pan
      this.controls.enablePan = false;
    },
    //初始化光源
    initLight() {
      const directionalLight = new THREE.DirectionalLight(0xe8eaeb, 0.2);
      directionalLight.position.set(0, 10, 5);
      this.scene.add(directionalLight);
    },
    render() {
      if (!this.renderer) {
        return;
      }
      // 触底弹跳
      // circle.position.y = Math.abs(Math.sin(elapsedTime * 3));
      const time = this.clock.getElapsedTime();
      this.points.rotation.y = time * 0.01;
      this.material.uniforms.uTime.value = time;
      // mesh.rotation.y = time;
      this.animationId = requestAnimationFrame(this.render);
      this.renderer.render(this.scene, this.camera);
      this.controls.update();
      this.stats.update(); //更新性能插件
    },
    ownFun() {
      this.shader1();
    },
    start() {
      console.log("运行了start()");
      this.initRenderer();
      //   // 设置 WebGL 上下文
      //   let gl = this.renderer.getContext();
      //   gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      //   gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      this.initScene();
      this.initCamera();
      this.initControls();
      this.initLight();
      this.ownFun();
      this.render();
    },
  },
};
</script>
      <style src="@/assets/style/three.css"  scoped></style>