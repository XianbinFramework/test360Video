/// <reference path="libs/threejs/three.d.ts"/>
var MainApp = (function () {
    function MainApp() {
        // Load coordinates
        // this.height = window.innerHeight;
        // this.width  = window.innerWidth;
        this.screenW = 900;
        this.screenH = 600;
        this.videoW = 2048;
        this.videoH = 1024;
        ;
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
        this.videoCanvasCtx = this.videoCanvas.getContext('2d');
        //set its size
        this.videoCanvas.width = this.videoW;
        this.videoCanvas.height = this.videoH;
        //draw a black rectangle so that your spheres don't start out transparent
        this.videoCanvasCtx.fillStyle = "#000000";
        this.videoCanvasCtx.fillRect(0, 0, this.videoW, this.videoH);
        //add canvas to new texture
        this.videoTexture = new THREE.Texture(this.videoCanvas);
        // Create a Scene
        this.scene = new THREE.Scene();
        var cubeGeometry = new THREE.SphereGeometry(500, 60, 40);
        var sphereMat = new THREE.MeshBasicMaterial({ map: this.videoTexture });
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
    ;
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