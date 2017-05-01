enum XUniformType {
    f = 0,
    v2,
    v3,
    v4,
    t,
}

namespace XUniformType {
    export function toShaderType(type:XUniformType) {
        switch(type){
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
}


class XShaderGenerator{

  geometry:THREE.BufferGeometry;
  material:THREE.ShaderMaterial;

  attributes    : any;
  uniforms      : any;
  attributesCode: string;
  uniformsCode  : string;
  varyCode      : string;
  constCode     : string;
  vertexFunc:string = (`
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
    `);

  fragFunc:string = (`

    void main(){
      gl_FragColor = vec4(1.0,0.0,0.0,1.0);
    }
    `);

  constructor(){
    this.geometry       = new THREE.BufferGeometry();
    this.attributes     = {};
    this.uniforms       = {};
    this.attributesCode = '';
    this.uniformsCode   = '';
    this.varyCode       = '';
    this.constCode      = '';

  }

  setAttribute(name:string,item:number[],itemSize:number,type:XUniformType){
    var array = new Float32Array(item);
    this.attributes[name] = array;
    this.attributesCode += "attribute " + XUniformType.toShaderType(type) + " " + name + ";\n";
    var attribute = new THREE.BufferAttribute(array,itemSize);
    this.geometry.addAttribute(name,attribute);
  }

  setIndex(index:number[]){
    var vertexIndexArr = new Uint32Array(index);
    var indexAttr:THREE.BufferAttribute= new THREE.BufferAttribute(vertexIndexArr ,1);
    this.geometry.setIndex(indexAttr);
  }

  setUniform(name:string,value:any,type:XUniformType){
    this.uniforms[name] = {type:XUniformType[type],value:value};
    this.uniformsCode += "uniform " + XUniformType.toShaderType(type) + " " + name + ";\n";
  }

  setVarying(name:string,type:XUniformType){
    this.varyCode += "varying " + XUniformType.toShaderType(type) + " " + name + ";\n";
  }

  setConstant(name:string,value:number,type:XUniformType){
    this.constCode += "const " + XUniformType.toShaderType(type) + " " + name + " = " + String(value) + ";\n";
  }

  setVertFunc(func:string){
    this.vertexFunc = this.attributesCode + this.uniformsCode + this.varyCode + this.constCode + func ;

  }

  setFragFunc(func:string){
    this.fragFunc = this.uniformsCode + this.varyCode + this.constCode + func ;

  }

  getGeometry():THREE.BufferGeometry{
    return this.geometry;
  }

  getMaterial():THREE.ShaderMaterial{
    this.material = new THREE.ShaderMaterial({
      uniforms        : this.uniforms,
      vertexShader    : this.vertexFunc,
      fragmentShader  : this.fragFunc
    });
    this.material.side        = THREE.FrontSide
    this.material.transparent = true;
    this.material.depthTest   = false;
    return this.material;
  }

  ///////////////////////////////
  public static randomRange(min:number, max:number):number {
    return ((Math.random() * (max - min)) + min);
  }

  public static makeVertexWithFaceNumber(faceNumber:number) : number[]{
    var vertexBuf:number[] = [];
    for(var i = 0; i < faceNumber; i++ ){
      vertexBuf.push(-0.5,-0.5, i );
      vertexBuf.push(+0.5,-0.5, i );
      vertexBuf.push(-0.5,+0.5, i );
      vertexBuf.push(+0.5,+0.5, i );
    }
    return vertexBuf;
  }

  public static makeIndexWithFaceNumber(faceNumber:number):number[]{
    var vertexIndexBuf:number[] = [];
    var q = 0.0;
    for(var i = 0; i < faceNumber; i++ ){
      vertexIndexBuf.push(q+0, q+1, q+2, q+1, q+3, q+2);
      q += 4;
    }
    return vertexIndexBuf;
  }


}
