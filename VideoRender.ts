/// <reference path="libs/threejs/three.d.ts"/>

class VideoRender{

  screenW      : number;
  screenH      : number;
  videoW       : number;
  videoH       : number;
  videoTexture : THREE.Texture;
  shader       : XShaderGenerator;

  geometry     : THREE.BufferGeometry;try;
  material     : THREE.ShaderMaterial;
  renderingObj : THREE.Object3D;

  // material parameters
  side        : THREE.Side = THREE.FrontSide;
  transparent : boolean    = false;
  depthTest   : boolean    = false;alse;

  // mouse control
  mouseTapped : boolean = false;
  tapPointY   : number  = 0;
  scale       : number  = 1;

  constructor(texture:THREE.Texture, screenW:number, screenH:number, videoW:number, videoH:number){
    this.videoTexture      = texture;
    this.screenW           = screenW;
    this.screenH           = screenH;
    this.videoW            = videoW;
    this.videoH            = videoH;
    this.updateVideoCenter = this.updateVideoCenter.bind(this);
    this.toogleMouseTaped  = this.toogleMouseTaped.bind(this);
    this.shader            = new XShaderGenerator();

    this.initGeometry();
    this.initMaterial();
    this.initRenderingObj();
  }

  initGeometry(){
    this.shader.setAttribute(
      "xposition",
      this.makeVextexBufferForFaceNumber(1,this.screenW,this.screenH),
      3,
      XUniformType.v3
    );
    this.shader.setIndex(XShaderGenerator.makeIndexWithFaceNumber(1));
    this.geometry = this.shader.getGeometry();
  }

  initMaterial(){
    this.shader.setVarying("vUv",XUniformType.v2);
    this.shader.setUniform("videoSize",new THREE.Vector2(this.videoW,this.videoH),XUniformType.v2);
    this.shader.setUniform("videoCenter",new THREE.Vector2(0,0),XUniformType.v2);
    this.shader.setUniform("videoTexture",this.videoTexture,XUniformType.t);
    this.shader.setUniform("videoScale",this.scale,XUniformType.f);
    this.shader.setVertFunc(this.makeVertFunc());
    this.shader.setFragFunc(this.makeFragFunc());

    this.material = new THREE.ShaderMaterial({
      uniforms        : this.shader.uniforms,
      vertexShader    : this.shader.vertexFunc,
      fragmentShader  : this.shader.fragFunc
    });
    this.material.side = this.side;
    this.material.transparent = this.transparent;
    this.material.depthTest = this.depthTest;
  }

  initRenderingObj(){
    // create renderingObj
    this.renderingObj = new THREE.Object3D();
    this.renderingObj.name = "renderingObj";
    let imageMesh = new THREE.Mesh(this.geometry,this.material);
    this.renderingObj.add(imageMesh);
  }

  updateVideoCenter(event: MouseEvent){
    if(this.mouseTapped){
      // do scale action
      let maxDiffY = 200;
      var yPercent = (event.y - this.tapPointY) / maxDiffY;
      yPercent = Math.max(-1, Math.min(1, yPercent));  // -1 -> 1
      this.scale *= Math.pow(2,yPercent);  // 0.5 -> 2
      this.scale = Math.max(0.5, Math.min(2, this.scale));
      this.shader.uniforms.videoScale.value = this.scale;
    } else {
      // do move action
      var maxDiffX       = 200;
      var maxDiffY       = 100;
      var centerXPercent = (event.x - 450) / maxDiffX;
      var centerYPercent = (event.y - 200) / maxDiffY;
      centerXPercent     = Math.max(-1, Math.min(1, centerXPercent));
      centerYPercent     = Math.max(-1, Math.min(1, centerYPercent));
      var centerX        = centerXPercent * (this.videoW - this.screenW*this.scale)/2;
      var centerY        = centerYPercent * (this.videoH - this.screenH*this.scale)/2;
      centerY           *= -1;
      this.shader.uniforms.videoCenter.value = new THREE.Vector2(centerX,centerY);
    }

  }

  toogleMouseTaped(event: MouseEvent){
    if(event.type == "mouseup") {
      this.mouseTapped = false;
    } else if(event.type == "mousedown"){
      this.mouseTapped = true;
      this.tapPointY = event.y;
    }
  }


  /// functions
  makeVertFunc():string{
    let vertFunc = (`
     vec4 finalPosition;
     vec2 vUvPosition;
     void main() {
       vUvPosition = xposition.xy;
       vUvPosition *= videoScale;
       vUvPosition += videoCenter;
       vUv = vUvPosition / videoSize;
       vUv += 0.5;
       finalPosition = vec4(xposition.xy,0.0,1.0);
       gl_Position = projectionMatrix * modelViewMatrix * finalPosition;
     }
     `);
     return vertFunc;
  }

  makeFragFunc():string{
    let fragFunc = (`

     void main() {
       gl_FragColor = texture2D(videoTexture,vUv);
     }
   `);
   return fragFunc;
  }

  makeVextexBufferForFaceNumber(faceNumber:number, w:number,h:number) : number[]{
    var vertexBuf:number[] = [];
    for(var i = 0; i < faceNumber; i++ ){
      vertexBuf.push(-0.5*w,-0.5*h, i );
      vertexBuf.push(+0.5*w,-0.5*h, i );
      vertexBuf.push(-0.5*w,+0.5*h, i );
      vertexBuf.push(+0.5*w,+0.5*h, i );
    }
    return vertexBuf;
  }

}
