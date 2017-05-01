/// <reference path="libs/threejs/three.d.ts"/>
var VideoRender = (function () {
    function VideoRender(texture, screenW, screenH, videoW, videoH) {
        // material parameters
        this.side = THREE.FrontSide;
        this.transparent = false;
        this.depthTest = false;
        // mouse control
        this.mouseTapped = false;
        this.tapPointY = 0;
        this.scale = 1;
        this.videoTexture = texture;
        this.screenW = screenW;
        this.screenH = screenH;
        this.videoW = videoW;
        this.videoH = videoH;
        this.updateVideoCenter = this.updateVideoCenter.bind(this);
        this.toogleMouseTaped = this.toogleMouseTaped.bind(this);
        this.shader = new XShaderGenerator();
        this.initGeometry();
        this.initMaterial();
        this.initRenderingObj();
    }
    VideoRender.prototype.initGeometry = function () {
        this.shader.setAttribute("xposition", this.makeVextexBufferForFaceNumber(1, this.screenW, this.screenH), 3, XUniformType.v3);
        this.shader.setIndex(XShaderGenerator.makeIndexWithFaceNumber(1));
        this.geometry = this.shader.getGeometry();
    };
    VideoRender.prototype.initMaterial = function () {
        this.shader.setVarying("vUv", XUniformType.v2);
        this.shader.setUniform("videoSize", new THREE.Vector2(this.videoW, this.videoH), XUniformType.v2);
        this.shader.setUniform("videoCenter", new THREE.Vector2(0, 0), XUniformType.v2);
        this.shader.setUniform("videoTexture", this.videoTexture, XUniformType.t);
        this.shader.setUniform("videoScale", this.scale, XUniformType.f);
        this.shader.setVertFunc(this.makeVertFunc());
        this.shader.setFragFunc(this.makeFragFunc());
        this.material = new THREE.ShaderMaterial({
            uniforms: this.shader.uniforms,
            vertexShader: this.shader.vertexFunc,
            fragmentShader: this.shader.fragFunc
        });
        this.material.side = this.side;
        this.material.transparent = this.transparent;
        this.material.depthTest = this.depthTest;
    };
    VideoRender.prototype.initRenderingObj = function () {
        // create renderingObj
        this.renderingObj = new THREE.Object3D();
        this.renderingObj.name = "renderingObj";
        var imageMesh = new THREE.Mesh(this.geometry, this.material);
        this.renderingObj.add(imageMesh);
    };
    VideoRender.prototype.updateVideoCenter = function (event) {
        if (this.mouseTapped) {
            // do scale action
            var maxDiffY_1 = 200;
            var yPercent = (event.y - this.tapPointY) / maxDiffY_1;
            yPercent = Math.max(-1, Math.min(1, yPercent)); // -1 -> 1
            this.scale *= Math.pow(2, yPercent); // 0.5 -> 2
            this.scale = Math.max(0.5, Math.min(2, this.scale));
            this.shader.uniforms.videoScale.value = this.scale;
        }
        else {
            // do move action
            var maxDiffX = 200;
            var maxDiffY = 100;
            var centerXPercent = (event.x - 450) / maxDiffX;
            var centerYPercent = (event.y - 200) / maxDiffY;
            centerXPercent = Math.max(-1, Math.min(1, centerXPercent));
            centerYPercent = Math.max(-1, Math.min(1, centerYPercent));
            var centerX = centerXPercent * (this.videoW - this.screenW * this.scale) / 2;
            var centerY = centerYPercent * (this.videoH - this.screenH * this.scale) / 2;
            centerY *= -1;
            this.shader.uniforms.videoCenter.value = new THREE.Vector2(centerX, centerY);
        }
    };
    VideoRender.prototype.toogleMouseTaped = function (event) {
        if (event.type == "mouseup") {
            this.mouseTapped = false;
        }
        else if (event.type == "mousedown") {
            this.mouseTapped = true;
            this.tapPointY = event.y;
        }
    };
    /// functions
    VideoRender.prototype.makeVertFunc = function () {
        var vertFunc = ("\n     vec4 finalPosition;\n     vec2 vUvPosition;\n     void main() {\n       vUvPosition = xposition.xy;\n       vUvPosition *= videoScale;\n       vUvPosition += videoCenter;\n       vUv = vUvPosition / videoSize;\n       vUv += 0.5;\n       finalPosition = vec4(xposition.xy,0.0,1.0);\n       gl_Position = projectionMatrix * modelViewMatrix * finalPosition;\n     }\n     ");
        return vertFunc;
    };
    VideoRender.prototype.makeFragFunc = function () {
        var fragFunc = ("\n\n     void main() {\n       gl_FragColor = texture2D(videoTexture,vUv);\n     }\n   ");
        return fragFunc;
    };
    VideoRender.prototype.makeVextexBufferForFaceNumber = function (faceNumber, w, h) {
        var vertexBuf = [];
        for (var i = 0; i < faceNumber; i++) {
            vertexBuf.push(-0.5 * w, -0.5 * h, i);
            vertexBuf.push(+0.5 * w, -0.5 * h, i);
            vertexBuf.push(-0.5 * w, +0.5 * h, i);
            vertexBuf.push(+0.5 * w, +0.5 * h, i);
        }
        return vertexBuf;
    };
    return VideoRender;
}());
//# sourceMappingURL=VideoRender.js.map