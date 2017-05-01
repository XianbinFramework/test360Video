var XUniformType;
(function (XUniformType) {
    XUniformType[XUniformType["f"] = 0] = "f";
    XUniformType[XUniformType["v2"] = 1] = "v2";
    XUniformType[XUniformType["v3"] = 2] = "v3";
    XUniformType[XUniformType["v4"] = 3] = "v4";
    XUniformType[XUniformType["t"] = 4] = "t";
})(XUniformType || (XUniformType = {}));
(function (XUniformType) {
    function toShaderType(type) {
        switch (type) {
            case XUniformType.f:
                return "float";
            case XUniformType.v2:
                return "vec2";
            case XUniformType.v3:
                return "vec3";
            case XUniformType.v4:
                return "vec4";
            case XUniformType.t:
                return "sampler2D";
        }
    }
    XUniformType.toShaderType = toShaderType;
})(XUniformType || (XUniformType = {}));
var XShaderGenerator = (function () {
    function XShaderGenerator() {
        this.vertexFunc = ("\n    void main() {\n      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n    }\n    ");
        this.fragFunc = ("\n\n    void main(){\n      gl_FragColor = vec4(1.0,0.0,0.0,1.0);\n    }\n    ");
        this.geometry = new THREE.BufferGeometry();
        this.attributes = {};
        this.uniforms = {};
        this.attributesCode = '';
        this.uniformsCode = '';
        this.varyCode = '';
        this.constCode = '';
    }
    XShaderGenerator.prototype.setAttribute = function (name, item, itemSize, type) {
        var array = new Float32Array(item);
        this.attributes[name] = array;
        this.attributesCode += "attribute " + XUniformType.toShaderType(type) + " " + name + ";\n";
        var attribute = new THREE.BufferAttribute(array, itemSize);
        this.geometry.addAttribute(name, attribute);
    };
    XShaderGenerator.prototype.setIndex = function (index) {
        var vertexIndexArr = new Uint32Array(index);
        var indexAttr = new THREE.BufferAttribute(vertexIndexArr, 1);
        this.geometry.setIndex(indexAttr);
    };
    XShaderGenerator.prototype.setUniform = function (name, value, type) {
        this.uniforms[name] = { type: XUniformType[type], value: value };
        this.uniformsCode += "uniform " + XUniformType.toShaderType(type) + " " + name + ";\n";
    };
    XShaderGenerator.prototype.setVarying = function (name, type) {
        this.varyCode += "varying " + XUniformType.toShaderType(type) + " " + name + ";\n";
    };
    XShaderGenerator.prototype.setConstant = function (name, value, type) {
        this.constCode += "const " + XUniformType.toShaderType(type) + " " + name + " = " + String(value) + ";\n";
    };
    XShaderGenerator.prototype.setVertFunc = function (func) {
        this.vertexFunc = this.attributesCode + this.uniformsCode + this.varyCode + this.constCode + func;
    };
    XShaderGenerator.prototype.setFragFunc = function (func) {
        this.fragFunc = this.uniformsCode + this.varyCode + this.constCode + func;
    };
    XShaderGenerator.prototype.getGeometry = function () {
        return this.geometry;
    };
    XShaderGenerator.prototype.getMaterial = function () {
        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: this.vertexFunc,
            fragmentShader: this.fragFunc
        });
        this.material.side = THREE.FrontSide;
        this.material.transparent = true;
        this.material.depthTest = false;
        return this.material;
    };
    ///////////////////////////////
    XShaderGenerator.randomRange = function (min, max) {
        return ((Math.random() * (max - min)) + min);
    };
    XShaderGenerator.makeVertexWithFaceNumber = function (faceNumber) {
        var vertexBuf = [];
        for (var i = 0; i < faceNumber; i++) {
            vertexBuf.push(-0.5, -0.5, i);
            vertexBuf.push(+0.5, -0.5, i);
            vertexBuf.push(-0.5, +0.5, i);
            vertexBuf.push(+0.5, +0.5, i);
        }
        return vertexBuf;
    };
    XShaderGenerator.makeIndexWithFaceNumber = function (faceNumber) {
        var vertexIndexBuf = [];
        var q = 0.0;
        for (var i = 0; i < faceNumber; i++) {
            vertexIndexBuf.push(q + 0, q + 1, q + 2, q + 1, q + 3, q + 2);
            q += 4;
        }
        return vertexIndexBuf;
    };
    return XShaderGenerator;
}());
//# sourceMappingURL=XShaderGenerator.js.map