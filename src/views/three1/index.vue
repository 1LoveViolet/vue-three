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
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module.js";
import * as d3 from "d3";
import axios from "network/axios";
import ouyang from "assets/images/ouyang.js";
3;
export default {
  data() {
    return {
      renderer: null,
      scene: null,
      camera: null,
      controls: null,
      v: null,
      material: null,
      particleMaterial: null,
      firefliesMaterial: null,
      textMaterial: null,
      clock: null,
      //外层圆圈
      particles: null,
      stats: null,
    };
  },
  created() {},
  mounted() {
    this.stats = new Stats();
    this.clock = new THREE.Clock();
    document.body.appendChild(this.stats.domElement);
    this.start();
  },
  destroyed() {
    // this.clearScene();
    // this.destroyThreejs();
    console.log("执行destroyed钩子函数");
  },
  methods: {
    templateshader() {
      const vertex = ``;
      const fragment = ``;
      this.material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
        },
        vertexShader: vertex,
        fragmentShader: fragment,
        // wireframe: true,
        // wireframe: true,
      });
      const geometry = new THREE.SphereGeometry(1, 128, 128);
      const mesh = new THREE.Mesh(geometry, this.material);
      this.scene.add(mesh);
    },
    //黄色毛球
    shader1() {
      const vertex = `vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
      float permute(float x){return floor(mod(((x*34.0)+1.0)*x, 289.0));}
      vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
      float taylorInvSqrt(float r){return 1.79284291400159 - 0.85373472095314 * r;}

      vec4 grad4(float j, vec4 ip){
        const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
        vec4 p,s;

        p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
        p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
        s = vec4(lessThan(p, vec4(0.0)));
        p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;

        return p;
      }

      float snoise(vec4 v){
        const vec2  C = vec2( 0.138196601125010504,  // (5 - sqrt(5))/20  G4
                              0.309016994374947451); // (sqrt(5) - 1)/4   F4
      // First corner
        vec4 i  = floor(v + dot(v, C.yyyy) );
        vec4 x0 = v -   i + dot(i, C.xxxx);

      // Other corners

      // Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)
        vec4 i0;

        vec3 isX = step( x0.yzw, x0.xxx );
        vec3 isYZ = step( x0.zww, x0.yyz );
      //  i0.x = dot( isX, vec3( 1.0 ) );
        i0.x = isX.x + isX.y + isX.z;
        i0.yzw = 1.0 - isX;

      //  i0.y += dot( isYZ.xy, vec2( 1.0 ) );
        i0.y += isYZ.x + isYZ.y;
        i0.zw += 1.0 - isYZ.xy;

        i0.z += isYZ.z;
        i0.w += 1.0 - isYZ.z;

        // i0 now contains the unique values 0,1,2,3 in each channel
        vec4 i3 = clamp( i0, 0.0, 1.0 );
        vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
        vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );

        //  x0 = x0 - 0.0 + 0.0 * C
        vec4 x1 = x0 - i1 + 1.0 * C.xxxx;
        vec4 x2 = x0 - i2 + 2.0 * C.xxxx;
        vec4 x3 = x0 - i3 + 3.0 * C.xxxx;
        vec4 x4 = x0 - 1.0 + 4.0 * C.xxxx;

      // Permutations
        i = mod(i, 289.0);
        float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
        vec4 j1 = permute( permute( permute( permute (
                   i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
                 + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
                 + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
                 + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));
      // Gradients
      // ( 7*7*6 points uniformly over a cube, mapped onto a 4-octahedron.)
      // 7*7*6 = 294, which is close to the ring size 17*17 = 289.

        vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

        vec4 p0 = grad4(j0,   ip);
        vec4 p1 = grad4(j1.x, ip);
        vec4 p2 = grad4(j1.y, ip);
        vec4 p3 = grad4(j1.z, ip);
        vec4 p4 = grad4(j1.w, ip);

      // Normalise gradients
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;
        p4 *= taylorInvSqrt(dot(p4,p4));

      // Mix contributions from the five corners
        vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
        vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
        m0 = m0 * m0;
        m1 = m1 * m1;
        return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
                     + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;
      }


      varying vec3 vNormal;
      varying float vNoise;
      varying vec2 vUv;
      uniform float uTime;
      void main() {
        vec3 newPos = position;
        float noise = snoise(vec4(position * 10.0, uTime));
        newPos += normal * noise *1.0;
        vNoise = noise;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
      }`;
      const fragment = `float hue2rgb(float f1, float f2, float hue) {
          if (hue < 0.0)
              hue += 1.0;
          else if (hue > 1.0)
              hue -= 1.0;
          float res;
          if ((6.0 * hue) < 1.0)
              res = f1 + (f2 - f1) * 6.0 * hue;
          else if ((2.0 * hue) < 1.0)
              res = f2;
          else if ((3.0 * hue) < 2.0)
              res = f1 + (f2 - f1) * ((2.0 / 3.0) - hue) * 6.0;
          else
              res = f1;
          return res;
      }

      vec3 hsl2rgb(vec3 hsl) {
          vec3 rgb;

          if (hsl.y == 0.0) {
              rgb = vec3(hsl.z); // Luminance
          } else {
              float f2;

              if (hsl.z < 0.5)
                  f2 = hsl.z * (1.0 + hsl.y);
              else
                  f2 = hsl.z + hsl.y - hsl.y * hsl.z;

              float f1 = 2.0 * hsl.z - f2;

              rgb.r = hue2rgb(f1, f2, hsl.x + (1.0/3.0));
              rgb.g = hue2rgb(f1, f2, hsl.x);
              rgb.b = hue2rgb(f1, f2, hsl.x - (1.0/3.0));
          }
          return rgb;
      }

      vec3 hsl2rgb(float h, float s, float l) {
          return hsl2rgb(vec3(h, s, l));
      }

            vec3 rgb(float r, float g, float b) {
        return vec3(r, g, b) / 255.;
      }
            varying vec2 vUv;
            uniform float uTime;
            varying vec3 vNormal;
            varying float vNoise;
            void main() {
              vec3 color = hsl2rgb(0.1 + vNoise * 0.1, 1.0, 0.5);
        gl_FragColor = vec4(color, 1.0);
      }`;
      this.material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
        },
        vertexShader: vertex,
        fragmentShader: fragment,
        // wireframe: true,
        // wireframe: true,
      });
      const geometry = new THREE.SphereGeometry(1, 128, 128);
      const mesh = new THREE.Mesh(geometry, this.material);
      this.scene.add(mesh);
    },
    //外围圆圈
    shader2() {
      const vertex = `  uniform float uTime;
  varying vec3 vColor;
  const float PI = 3.141592653589793238;
  void main() {
    vec3 newPos = position;
   newPos.y += 0.1 * sin(newPos.y * 3.0 + uTime*5.0);
  newPos.z += 0.05 * sin(newPos.y * 3.0 + uTime*5.0);
  vColor=newPos;
    vec4 mvPosition = modelViewMatrix * vec4(newPos, 1.0);
    gl_PointSize = 20.0 / -mvPosition.z;
    gl_Position = projectionMatrix * mvPosition;
  }`;
      const fragment = `      uniform float uTime;
      varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
    // gl_FragColor = vec4(vec3(1.0), 1.0);
    gl_FragColor = vec4(vColor, 1.0);
  }`;
      this.particleMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
        },
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        blending: THREE.AdditiveBlending,
        // wireframe: true,
        // wireframe: true,
      });

      const particleGeometry = new THREE.BufferGeometry();
      const N = 4000;
      const positions = new Float32Array(N * 3);

      const inc = Math.PI * (3 - Math.sqrt(5));
      const off = 2 / N;
      //   for (let i = 0; i < N; i++) {
      //     const y = i * off - 1 + off / 2;
      //     const r = Math.sqrt(1 - y * y);
      //     const phi = i * inc;

      //     positions[3 * i] = radius * Math.cos(phi) * r;
      //     positions[3 * i + 1] = radius * y;
      //     positions[3 * i + 2] = radius * Math.sin(phi) * r;
      //   }
      const radius = 2.2;
      for (let i = 0; i < N; i++) {
        const k = i + 0.5;
        const phi = Math.acos(1 - (2 * k) / N);
        const theta = Math.PI * (1 + Math.sqrt(5)) * k;
        const x = Math.cos(theta) * Math.sin(phi) * radius;
        const y = Math.sin(theta) * Math.sin(phi) * radius;
        const z = Math.cos(phi) * radius;

        positions.set([x, y, z], i * 3);
      }
      particleGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      this.particles = new THREE.Points(
        particleGeometry,
        this.particleMaterial
      );
      this.scene.add(this.particles);
    },
    //浮动字体
    shader3() {
      const vertex = `  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vUv = uv;

    vec3 newPos = position;
    // newPos.y += 0.06 * sin(newPos.x + uTime);
    // newPos.x += 0.1 * sin(newPos.x * 2.0 + uTime);
    newPos.y += 0.1 * sin(newPos.y * 3.0 + uTime*5.0);
  newPos.z += 0.05 * sin(newPos.y * 3.0 + uTime*5.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
  }`;
      const fragment = `  uniform sampler2D uTexture;
  varying vec2 vUv;

  void main() {
    vec4 color = texture2D(uTexture, vUv);
    gl_FragColor = color;
  }`;
      this.textMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uTexture: {
            value: new THREE.TextureLoader().load(ouyang),
          },
        },
        transparent: true,
        vertexShader: vertex,
        fragmentShader: fragment,
        // wireframe: true,
        // wireframe: true,
      });

      const textGeometry = new THREE.PlaneGeometry(2, 1, 100, 100);
      const text = new THREE.Mesh(textGeometry, this.textMaterial);
      text.position.z = 2;
      this.scene.add(text);
    },
    //环境粒子
    shader4() {
      const vertex = `uniform float uTime;
    attribute float aSize;
      
    void main() {
        vec3 newPos = position;
        newPos.y += sin(uTime * 0.5 + newPos.x * 100.0) * aSize * 0.2;
        newPos.x += sin(uTime * 0.5 + newPos.x * 200.0) * aSize * 0.1;
        
        vec4 mvPosition = modelViewMatrix * vec4(newPos, 1.0);
        gl_PointSize = 70.0 * aSize / -mvPosition.z;
        gl_Position = projectionMatrix * mvPosition;
    }`;
      const fragment = `void main() {
      float d = length(gl_PointCoord - vec2(0.5));
      float strength = clamp(0.05 / d - 0.05 * 2.0, 0.0, 1.0);
      gl_FragColor = vec4(vec3(1.0), strength);
  }`;
      this.firefliesMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
        },
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        // wireframe: true,
        // wireframe: true,
      });

      const firefliesGeometry = new THREE.BufferGeometry();
      const firefliesCount = 300;
      const positions1 = new Float32Array(firefliesCount * 3);
      const sizes = new Float32Array(firefliesCount);

      for (let i = 0; i < firefliesCount; i++) {
        const r = Math.random() * 5 + 5;
        positions1[i * 3 + 0] = (Math.random() - 0.5) * r;
        positions1[i * 3 + 1] = (Math.random() - 0.5) * r;
        positions1[i * 3 + 2] = (Math.random() - 0.5) * r;

        sizes[i] = Math.random() + 1.0;
      }

      firefliesGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions1, 3)
      );
      firefliesGeometry.setAttribute(
        "aSize",
        new THREE.BufferAttribute(sizes, 1)
      );

      const fireflies = new THREE.Points(
        firefliesGeometry,
        this.firefliesMaterial
      );
      this.scene.add(fireflies);
    },
    snake() {
      window.addEventListener("mousemove", (e) => {
        const x = (e.clientX / innerWidth) * 2 - 1;
        const y = ((innerHeight - e.clientY) / innerHeight) * 2 - 1;
        gsap.to(this.camera.position, {
          duration: 1,
          x: x,
        });
        gsap.to(this.camera.position, {
          duration: 1,
          y: y,
        });
        // xQuickTo(cameraPosition.x + x).play();
        // yQuickTo(cameraPosition.y + y).play();
      });
    },
    gsapFun() {
      gsap.to("#three", { duration: 2, x: 300 });
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
      this.scene.background = new THREE.Color(0x000000);
      // this.scene.background = new THREE.Color(0xffffff);
      this.scene.fog = new THREE.Fog(0xffffff, 0, 3000);
      // 给场景添加坐标轴
      // var axes = new THREE.AxesHelper(100);
      // this.scene.add(axes);
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
      this.camera.position.set(0, 0, 8);
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
      // 触底弹跳
      const time = this.clock.getElapsedTime();
      this.material.uniforms.uTime.value = time;
      this.particleMaterial.uniforms.uTime.value = time;
      this.firefliesMaterial.uniforms.uTime.value = time;
      this.textMaterial.uniforms.uTime.value = time;
      this.particles.rotation.y = time;
      // mesh.rotation.y = time;
      requestAnimationFrame(this.render);
      this.renderer.render(this.scene, this.camera);
      this.controls.update();
      this.stats.update(); //更新性能插件
    },
    ownFun() {
      this.shader1();
      this.shader2();
      this.shader3();
      this.shader4();
    },
    start() {
      this.initRenderer();
      this.initScene();
      this.initCamera();
      this.initControls();
      this.initLight();
      this.ownFun();
      this.snake();
      this.render();
    },
  },
};
</script>
  <style src="@/assets/style/three.css"  scoped></style>