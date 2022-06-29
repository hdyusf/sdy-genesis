<template>
  <div class="ThreeBanner">
    <div id="ThreeBannerCanvas" />
    <div class="base" />
  </div>
</template>
<script setup>
import { onMounted } from 'vue';
import defaultImage from '@/assets/images/a5.png';
import { pxToPxRatio } from '@/utils/common';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.127.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.127.0/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'https://cdn.jsdelivr.net/npm/three@0.127.0/examples/jsm/loaders/FBXLoader.js';
let camera, scene, renderer;
const clock = new THREE.Clock();
let T0 = new Date();
let touchStart = false;
onMounted(() => {
  init();
  animate();
});
function init() {
  const container = document.createElement('div');
  document
    .querySelector('#ThreeBannerCanvas')
    .appendChild(container);
  camera = new THREE.PerspectiveCamera(
    45,
    375 / 417,
    1,
    2000,
  );
  // camera.position.set(100, 100, 500);
  camera.position.set(100, 100, 430);
  scene = new THREE.Scene();
  // scene.background = new THREE.Color(0xffffff);
  // 迷雾
  // scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);
  // 环境光
  // const light = new THREE.AmbientLight(0xffffff);
  // scene.add(light);
  // 定向光
  const dirLight = new THREE.DirectionalLight(0xffffff);
  dirLight.position.set(0, 200, 100);
  dirLight.castShadow = true;
  dirLight.shadow.camera.top = 180;
  dirLight.shadow.camera.bottom = -100;
  dirLight.shadow.camera.left = -120;
  dirLight.shadow.camera.right = 120;
  scene.add(dirLight);
  const loader = new FBXLoader();
  loader.load('./banner.fbx', (object) => {
    let texture = new THREE.TextureLoader().load(
      defaultImage,
    );
    object.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.material.emissive = obj.material.color;
        obj.material.emissiveIntensity = 1;
        obj.material.emissiveMap = obj.material.map;
        if (obj.material.name === 'imageBox') {
          const geometry = new THREE.PlaneGeometry(
            199,
            199,
          );
          const material = new THREE.MeshBasicMaterial({
            map: texture,
          });
          const plane = new THREE.Mesh(geometry, material);
          plane.translateZ(3);
          plane.translateY(105);
          scene.add(plane);
        }
      }

      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
    scene.add(object);
  });
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  renderer.setClearAlpha(0.0);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, pxToPxRatio(417));
  // 立体阴影
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);
  // 相机
  const controls = new OrbitControls(
    camera,
    renderer.domElement,
  );
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.target.set(0, 100, 0);
  controls.maxPolarAngle = Math.PI / 2;
  controls.minPolarAngle = Math.PI / 2;
  controls.update();
  controls.domElement.addEventListener('click', () => {
    touchStart = true;
  });
  controls.domElement.addEventListener('touchstart', () => {
    touchStart = true;
  });
  controls.domElement.addEventListener('touchend', () => {
    touchStart = false;
  });

  // window.addEventListener('resize', onWindowResize, false);
}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
function animate() {
  let T1 = new Date();
  let t = T1 - T0;
  T0 = T1;
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  if (!touchStart) {
    scene.rotateY(0.001 * t);
  }
  renderer.render(scene, camera);
}
</script>
<style lang="less" scoped>
.ThreeBanner {
  background: url('@/assets/images/c4.png') no-repeat center top;
  background-size: cover;
  padding-top: 10px;
}
.base {
  margin-top: -30px;
  background: url('@/assets/images/c6.png') no-repeat center;
  background-size: cover;
  height: 109px;
}
</style>
