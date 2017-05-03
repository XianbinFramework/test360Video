/// <reference path="libs/threejs/three.d.ts"/>
var MainApp = (function () {
    function MainApp() {
        this.vertexFunc = ("\n      varying vec2 vUv;\n       void main() {\n         vUv = uv;\n         gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);\n       }\n       ");
        this.fragFunc = ("\n      vec4 videoColor;\n      vec4 butterColor;\n      varying vec2 vUv;\n      uniform sampler2D videoTexture;\n      uniform sampler2D butterflyTexture;\n      vec2 butterflyUV;\n       void main() {\n         videoColor = texture2D(videoTexture,vUv);\n         if( (vUv.x > 0.5 && vUv.x< 0.75) && (vUv.y > 0.25 && vUv.y< 0.5)){\n           butterflyUV.x = (vUv.x - 0.5) * 4.0;\n           butterflyUV.y = (vUv.y - 0.25) * 4.0;\n           butterColor= texture2D(butterflyTexture,butterflyUV);\n          if(butterColor.r < 0.1 && butterColor.g < 0.1 && butterColor.b < 0.1 ){\n            gl_FragColor = videoColor;\n            // gl_FragColor = butterColor;\n          } else {\n            float alpha = (butterColor.r + butterColor.g + butterColor.b) / 3.0;\n            gl_FragColor = mix(videoColor,butterColor,alpha);\n          }\n         } else {\n             gl_FragColor = videoColor;\n         }\n       }\n     ");
        // Load coordinates
        // this.height = window.innerHeight;
        // this.width  = window.innerWidth;
        this.screenW = 900;
        this.screenH = 600;
        this.videoW = 2048;
        this.videoH = 1024;
        this.videoButterflyW = 1280;
        this.videoButterflyH = 720;
        // Create the renderer, in this case using WebGL, we want an alpha channel
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        // Set dimensions to 500x500 and background color to white
        this.renderer.setSize(this.screenW, this.screenH);
        // Bind the renderer to the HTML, parenting it to our 'content' DIV
        document.getElementById('content').appendChild(this.renderer.domElement);
        // Create camera
        var aspectRatio = this.screenW / this.screenH;
        var fieldOfView = 45;
        var nearPlane = 0.1;
        var farPlane = 10000000;
        this.camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
        this.camera.position.x = 0;
        this.camera.position.z = 500;
        this.camera.position.y = 0;
        // setup video
        this.video = document.createElement('video');
        this.video.src = "Resources/3000.mp4";
        this.video.load();
        this.video.play();
        //make your video canvas
        this.videoCanvas = document.createElement('canvas');
        this.videoCanvas.id = "videoCanvas";
        this.videoCanvasCtx = this.videoCanvas.getContext('2d');
        //set its size
        this.videoCanvas.width = this.videoW;
        this.videoCanvas.height = this.videoH;
        //draw a black rectangle so that your spheres don't start out transparent
        this.videoCanvasCtx.fillStyle = "#000000";
        this.videoCanvasCtx.fillRect(0, 0, this.videoW, this.videoH);
        //add canvas to new texture
        this.videoTexture = new THREE.Texture(this.videoCanvas);
        // setup video
        this.videoButterfly = document.createElement('video');
        this.videoButterfly.src = "Resources/Butterfly.mp4";
        this.videoButterfly.load();
        this.videoButterfly.play();
        //make your video canvas
        this.videoCanvasButterfly = document.createElement('canvas');
        this.videoCanvasButterfly.id = "videoCanvasButterfly";
        this.videoCanvasCtxButterfly = this.videoCanvasButterfly.getContext('2d');
        //set its size
        this.videoCanvasButterfly.width = this.videoButterflyW;
        this.videoCanvasButterfly.height = this.videoButterflyH;
        //draw a black rectangle so that your spheres don't start out transparent
        this.videoCanvasCtxButterfly.fillStyle = "#000000";
        this.videoCanvasCtxButterfly.fillRect(0, 0, this.videoButterflyW, this.videoButterflyH);
        //add canvas to new texture
        this.videoTextureButterfly = new THREE.Texture(this.videoCanvasButterfly);
        // Create a Scene
        this.scene = new THREE.Scene();
        var cubeGeometry = new THREE.SphereGeometry(500, 60, 40);
        /////////////////////////   custom material
        // var sphereMat    = new THREE.MeshBasicMaterial({map: this.videoTexture});
        this.uniforms = {
            "videoTexture": { type: "sampler2D", value: this.videoTexture },
            "butterflyTexture": { type: "sampler2D", value: this.videoTextureButterfly },
        };
        var sphereMat = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: this.vertexFunc,
            fragmentShader: this.fragFunc
        });
        /////////////////////////   custom material
        sphereMat.side = THREE.BackSide;
        var cube = new THREE.Mesh(cubeGeometry, sphereMat);
        this.scene.add(cube);
        // Add control to camera
        var controls = new THREE.OrbitControls(this.camera);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.enableZoom = false;
        controls.maxDistance = 500;
        controls.minDistance = 500;
        // star rendering
        this.renderer.render(this.scene, this.camera);
    }
    MainApp.prototype.render = function () {
        var _this = this;
        // Each frame we want to render the scene again
        requestAnimationFrame(function () { return _this.render(); });
        // resize screen
        // this.height               = window.innerHeight;
        // this.width                = window.innerWidth;
        // this.renderer.setSize(this.width, this.height);
        // update
        //check for vid data
        if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
            //draw video to canvas starting from upper left corner
            this.videoCanvasCtx.drawImage(this.video, 0, 0, this.videoW, this.videoH);
            //tell texture object it needs to be updated
            this.videoTexture.needsUpdate = true;
        }
        //check for vid data
        if (this.videoButterfly.readyState === this.videoButterfly.HAVE_ENOUGH_DATA) {
            //draw video to canvas starting from upper left corner
            this.videoCanvasCtxButterfly.drawImage(this.videoButterfly, 0, 0, this.videoButterflyW, this.videoButterflyH);
            //tell texture object it needs to be updated
            this.videoTextureButterfly.needsUpdate = true;
        }
        this.renderer.render(this.scene, this.camera);
    };
    MainApp.prototype.start = function () {
        // Not so pointless now!
        this.render();
    };
    return MainApp;
}());
window.onload = function () {
    var mainApp = new MainApp();
    mainApp.start();
};
//# sourceMappingURL=mainApp.js.map