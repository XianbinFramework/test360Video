/// <reference path="libs/threejs/three.d.ts"/>

class MainApp {
    renderer    : THREE.WebGLRenderer;
    scene       : THREE.Scene;
    camera      : THREE.Camera;

    video          : HTMLVideoElement;
    videoCanvas    : HTMLCanvasElement;
    videoCanvasCtx : CanvasRenderingContext2D;
    videoTexture   : THREE.Texture;

    videoButterfly          : HTMLVideoElement;
    videoCanvasButterfly    : HTMLCanvasElement;
    videoCanvasCtxButterfly : CanvasRenderingContext2D;
    videoTextureButterfly   : THREE.Texture;

    uniforms : any;

    vertexFunc = (`
      varying vec2 vUv;
       void main() {
         vUv = uv;
         gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
       }
       `);

    fragFunc = (`
      vec4 videoColor;
      vec4 butterColor;
      varying vec2 vUv;
      uniform sampler2D videoTexture;
      uniform sampler2D butterflyTexture;
      vec2 butterflyUV;
       void main() {
         videoColor = texture2D(videoTexture,vUv);
         if( (vUv.x > 0.5 && vUv.x< 0.75) && (vUv.y > 0.25 && vUv.y< 0.5)){
           butterflyUV.x = (vUv.x - 0.5) * 4.0;
           butterflyUV.y = (vUv.y - 0.25) * 4.0;
           butterColor= texture2D(butterflyTexture,butterflyUV);
          if(butterColor.r < 0.1 && butterColor.g < 0.1 && butterColor.b < 0.1 ){
            gl_FragColor = videoColor;
            // gl_FragColor = butterColor;
          } else {
            float alpha = (butterColor.r + butterColor.g + butterColor.b) / 3.0;
            gl_FragColor = mix(videoColor,butterColor,alpha);
          }
         } else {
             gl_FragColor = videoColor;
         }
       }
     `);


    screenW : number;
    screenH : number;
    videoW  : number;
    videoH  : number;
    videoButterflyW  : number;
    videoButterflyH  : number;


    constructor() {
      // Load coordinates
      // this.height = window.innerHeight;
      // this.width  = window.innerWidth;
      this.screenW = 900;
      this.screenH = 600;
      this.videoW  = 2048;
      this.videoH  = 1024;
      this.videoButterflyW  = 1280;
      this.videoButterflyH  = 720;


      // Create the renderer, in this case using WebGL, we want an alpha channel
      this.renderer = new THREE.WebGLRenderer({ alpha: true });
      // Set dimensions to 500x500 and background color to white
      this.renderer.setSize(this.screenW, this.screenH);
      // Bind the renderer to the HTML, parenting it to our 'content' DIV
      document.getElementById('content').appendChild(this.renderer.domElement);
      // Create camera
      var aspectRatio = this.screenW / this.screenH;
      var fieldOfView = 45;
      var nearPlane   = 0.1;
      var farPlane    = 10000000;
      this.camera     = new THREE.PerspectiveCamera(
        fieldOfView,
        aspectRatio,
        nearPlane,
        farPlane
      );
      this.camera.position.x = 0;
      this.camera.position.z = 500;
      this.camera.position.y = 0;
      // setup video
      this.video     = document.createElement('video');
      this.video.src = "Resources/3000.mp4";
      this.video.load();
      this.video.play();
      //add canvas to new texture
      this.videoTexture = new THREE.Texture(this.video);
      // setup second video
      this.videoButterfly     = document.createElement('video');
      this.videoButterfly.src = "Resources/Butterfly.mp4";
      this.videoButterfly.load();
      this.videoButterfly.play();
      // second video texture
      this.videoTextureButterfly = new THREE.Texture(this.videoButterfly);
      // Create a Scene
      this.scene       = new THREE.Scene();
      var cubeGeometry = new THREE.SphereGeometry(500, 60, 40);
      /////////////////////////   custom material
      // var sphereMat    = new THREE.MeshBasicMaterial({map: this.videoTexture});
      this.uniforms = {
        "videoTexture" : {type:"sampler2D",value:this.videoTexture},
        "butterflyTexture" : {type:"sampler2D",value:this.videoTextureButterfly},
      }
      var sphereMat =  new THREE.ShaderMaterial({
        uniforms        : this.uniforms,
        vertexShader    : this.vertexFunc,
        fragmentShader  : this.fragFunc
      });
      /////////////////////////   custom material
      sphereMat.side   = THREE.BackSide;
      var cube         = new THREE.Mesh(cubeGeometry, sphereMat);
      this.scene.add(cube);
      // Add control to camera
      var controls = new THREE.OrbitControls( this.camera);
      controls.enableDamping = true;
      controls.dampingFactor = 0.25;
      controls.enableZoom    = false;
      controls.maxDistance   = 500;
      controls.minDistance   = 500;
      // star rendering
      this.renderer.render(this.scene, this.camera);
    }

    render() {
      // Each frame we want to render the scene again
      requestAnimationFrame(()  => this.render());
      // resize screen
      // this.height               = window.innerHeight;
      // this.width                = window.innerWidth;
      // this.renderer.setSize(this.width, this.height);

      // update
      //check for vid data
      if( this.video.readyState === this.video.HAVE_ENOUGH_DATA ){
        this.videoTexture.needsUpdate = true;
      }
      if( this.videoButterfly.readyState === this.videoButterfly.HAVE_ENOUGH_DATA ){
        this.videoTextureButterfly.needsUpdate = true;
      }


      this.renderer.render(this.scene, this.camera);
    }

    start() {
      // Not so pointless now!
      this.render();
    }
  }

  window.onload                 = () => {
    var mainApp                 = new MainApp();
    mainApp.start();
  };
