"use strict";

import * as shaderUtils from '../common/shaderUtils.js'
const mat4 = glMatrix.mat4;

let projectionMatrix;

let shaderVertexPositionAttribute, shaderVertexColorAttribute, shaderProjectionMatrixUniform, shaderModelViewMatrixUniform;

const duration = 10000; // ms

// in: Input variables used in the vertex shader. Since the vertex shader is called on each vertex, these will be different every time the vertex shader is invoked.
// Uniforms: Input variables for both the vertex and fragment shaders. These do not change values from vertex to vertex.

const vertexShaderSource = `#version 300 es

        in vec3 vertexPos; // Vertex from the buffer
        in vec4 vertexColor;

        out vec4 color;

        uniform mat4 modelViewMatrix; // Object's position
        uniform mat4 projectionMatrix; // Camera's position

        void main(void) {
    		// Return the transformed and projected vertex value
            gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPos, 1.0);
            color = vertexColor * 0.8;
        }`;

const fragmentShaderSource = `#version 300 es

        precision mediump float;
        in vec4 color;
        out vec4 fragColor;

        void main(void) {
        fragColor = color;
    }`;

function main() 
{
    const canvas = document.getElementById("webglcanvas");
    const gl = initWebGL(canvas);
    initViewport(gl, canvas);
    initGL(canvas);
    
   
    let octaedro = createOctaEdro(gl, [2 , 2, -6], [0, 1, 0]);
    let dodecaedro = createDodecaedro(gl, [-2 , -2, -6], [-0.4, 1, 0.1]);
    let escutoide = createEscutoide(gl, [-2 , 2, -6], [1.0 , 1.0, 0.2]);
    
    const shaderProgram = shaderUtils.initShader(gl, vertexShaderSource, fragmentShaderSource);
    bindShaderAttributes(gl, shaderProgram);

    update(gl, shaderProgram, [octaedro, dodecaedro, escutoide]);
}

function initWebGL(canvas)
{
    let gl = null;
    let msg = "Your browser does not support WebGL, or it is not enabled by default.";
    try {
        gl = canvas.getContext("webgl2");
    } 
    catch (e) {
        msg = "Error creating WebGL Context!: " + e.toString();
    }

    if (!gl) {
        throw new Error(msg);
    }

    return gl;        
}

function initViewport(gl, canvas)
{
    gl.viewport(0, 0, canvas.width, canvas.height);
}

function initGL(canvas)
{
    // Create a project matrix with 45 degree field of view
    projectionMatrix = mat4.create();
    
    mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 1, 100);
    // mat4.orthoNO(projectionMatrix, -4, 4, -3.5, 3.5, 1, 100)
    mat4.translate(projectionMatrix, projectionMatrix, [0, 0, -5]);
}

//CREATE octaedro:
function createOctaEdro(gl, translation, rotationAxis)
{    
    // Vertex Data
    let vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    let verts = [
       //Vertices piramide superior:
       -1.0, -1.0,  1.0, 
        1.0, -1.0,  1.0,  
        0,  1.0,  0, 
        0,  1.0,  0,   

       -1.0, -1.0, -1.0,
       0,  1.0, 0,
        0,  1.0, 0,
        1.0, -1.0, -1.0,

       0,  1.0, 0,
       0,  1.0,  0,
        0,  1.0,  0,
        0,  1.0, 0,

       -1.0, -1.0, -1.0,
        1.0, -1.0, -1.0,
        1.0, -1.0,  1.0,
       -1.0, -1.0,  1.0,

        1.0, -1.0, -1.0,
        0,  1.0, 0,
        0,  1.0,  0,
        1.0, -1.0,  1.0,

       -1.0, -1.0, -1.0,
       -1.0, -1.0,  1.0,
       -0,  1.0,  0,
       -0,  1.0, 0,

       // Vertices piramide inferior:
       -1.0, -1.0, 1.0,
       1.0, -1.0, 1.0,
       0, -2.5, 0,

       -1.0, -1.0, -1.0,
       -1.0, -1.0, 1.0,
       0, -2.5, 0,

       -1.0, -1.0, -1.0,
       1.0, -1.0, -1.0,
       0, -2.5, 0,

       1.0, -1.0, -1.0,
       1.0, -1.0, 1.0,
       0, -2.5, 0,
       ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    // Color data
    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

    let faceColors = [
        [1.0, 0.0, 0.0, 1.0], 
        [0.0, 1.0, 0.0, 1.0], 
        [0.0, 0.0, 1.0, 1.0], 
        [1.0, 1.0, 0.0, 1.0], 
        [1.0, 0.0, 1.0, 1.0], 
        [0.0, 1.0, 1.0, 1.0], 
        
    ];

    let faceColorsDown = [
        [1.0, 0.0, 1.0, 2.0], 
        [0.0, 1.0, 1.0, 2.0], 
        [1.0, 0.0, 0.0, 2.0], 
        [1.0, 1.0, 0.0, 2.0], 
        [1.0, 0.0, 0.0, 2.0], 
        [0.0, 1.0, 0.0, 2.0], 
        
    ];

    // Each vertex must have the color information, that is why the same color is concatenated 4 times, one for each vertex of the cube's face.
    let vertexColors = [];
    // for (const color of faceColors) 
    // {
    //     for (let j=0; j < 4; j++)
    //         vertexColors.push(...color);
    // }
    faceColors.forEach(color =>{
        for (let j=0; j < 4; j++)
            vertexColors.push(...color);
    });

    faceColorsDown.forEach(color =>{
        for (let j=0; j < 3; j++)
            vertexColors.push(...color);
    });

    

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    // Index data (defines the triangles to be drawn).
    let cubeIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);

    let cubeIndices = [
        0, 1, 2,      0, 2, 3,    
        4, 5, 6,      4, 6, 7,    
        8, 9, 10,     8, 10, 11, 
        12, 13, 14,   12, 14, 15, 
        16, 17, 18,   16, 18, 19,  
        20, 21, 22,   20, 22, 23,  
        24, 25, 26,   27, 28, 29,
        30, 31, 32,   33, 34, 35
    ];

    // gl.ELEMENT_ARRAY_BUFFER: Buffer used for element indices.
    // Uint16Array: Array of 16-bit unsigned integers.
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndices), gl.STATIC_DRAW);
    
    let octa = {
            buffer: vertexBuffer, colorBuffer:colorBuffer, indices:cubeIndexBuffer,
            vertSize:3, nVerts:36, colorSize:4, nColors: 27, nIndices:48,
            primtype:gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime : Date.now()
        };

    mat4.translate(octa.modelViewMatrix, octa.modelViewMatrix, translation);
    
  
    let directionFlag = 1;
    let speed = 0.03;
    const canvas = document.getElementById("webglcanvas");

    octa.update = function()
    {
        let now = Date.now();
        let deltat = now - this.currentTime;
        this.currentTime = now;
        let fract = deltat / duration;
        let angle = Math.PI * 2 * fract;
    
        // Rotates a mat4 by the given angle
        // mat4 out the receiving matrix
        // mat4 a the matrix to rotate
        // Number rad the angle to rotate the matrix by
        // vec3 axis the axis to rotate around
        //---ROTATE OBJECTS---
        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis);
        //mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [0,0,0]);
        //console.log(this.modelViewMatrix[13]);

        //Control para mover posicion:
        if(directionFlag == 1){
            mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [0,speed,0]);
            if(this.modelViewMatrix[13] >= canvas.height / 100){
                directionFlag = 0;
            }
        }else{
            mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [0,- speed,0]);
            if(this.modelViewMatrix[13] <= - (canvas.height) / 100){
                directionFlag = 1;
            }
        }
        
        
    };
    
    return octa;
}

//CREATE dodecaedro:
function createDodecaedro(gl, translation, rotationAxis)
{    
    // Vertex Data
    let vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    let verts = [
        0.809, 0.809, 0.809,
        0.809, 0.809, -0.809,
        0.5, 1.309, 0,
        1.309, 0, 0.5,
        1.309, 0, -0.5,

        0.809, 0.809, 0.809,
        0.809, -0.809, 0.809,
        0, 0.5, 1.309,
        0, -0.5, 1.309,
        1.309, 0, 0.5,

        0.809, 0.809, 0.809,
        -0.809, 0.809, 0.809,
        0, 0.5, 1.309,
        0.5, 1.309, 0,
        -0.5, 1.309, 0,

        0.809, 0.809, -0.809,
        -0.809, 0.809, -0.809,
        0, 0.5, -1.309,
        0.5, 1.309, 0,
        -0.5, 1.309, 0,

        0.809, 0.809, -0.809,
        0.809, -0.809, -0.809,
        0, 0.5, -1.309,
        0, -0.5, -1.309,
        1.309, 0, -0.5,

        0.809,-0.809,0.809,
        0.809,-0.809,-0.809,
        0.5, -1.309, 0,
        1.309, 0, 0.5,
        1.309, 0, -0.5,

        -0.809, 0.809, 0.809,
        -0.809, -0.809, 0.809,
        0, 0.5, 1.309,
        0, -0.5, 1.309,
        -1.309, 0, 0.5,

        -0.809, 0.809, 0.809,
        -0.809, 0.809, -0.809,
        -0.5, 1.309, 0,
        -1.309, 0, 0.5,
        -1.309, 0, -0.5,

        -0.809, 0.809, -0.809,
        -0.809, -0.809, -0.809,
        0, 0.5, -1.309,
        0, -0.5, -1.309,
        -1.309, 0, -0.5,

        0.809, -0.809, -0.809,
        -0.809, -0.809, -0.809,
        0, -0.5, -1.309,
        0.5, -1.309, 0,
        -0.5, -1.309, 0,

        0.809, -0.809, 0.809,
        -0.809, -0.809, 0.809,
        0, -0.5, 1.309,
        0.5, -1.309, 0,
        -0.5, -1.309, 0, 

        -0.809, -0.809, 0.809,
        -0.809, -0.809, -0.809,
        -0.5, -1.309, 0,
        -1.309, 0, 0.5,
        -1.309, 0, -0.5 
       ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    // Color data
    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

    let faceColors = [
        [1.0, 0.0, 0.0, 1.0], 
        [1.0, 1.0, 0.0, 1.0],
        [1.0, 1.0, 0.0, 2.0],
        [1.0, 1.0, 1.0, 2.0],
        [0.0, 1.0, 1.0, 1.0],
        [0.0, 1.0, 1.0, 2.0],
        [0.0, 1.0, 0.0, 1.0],
        [0.0, 1.0, 0.0, 2.0],
        [1.0, 1.0, 0.0, 2.0],
        [0.0, 0.0, 1.0, 2.0],
        [0.5, 1.0, 1.0, 2.0],
        [1.0, 0.0, 1.0, 2.0],
    ];

    // Each vertex must have the color information, that is why the same color is concatenated 4 times, one for each vertex of the cube's face.
    let vertexColors = [];
    // for (const color of faceColors) 
    // {
    //     for (let j=0; j < 4; j++)
    //         vertexColors.push(...color);
    // }
    faceColors.forEach(color =>{
        for (let j=0; j < 5; j++)
            vertexColors.push(...color);
    });

    

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    // Index data (defines the triangles to be drawn).
    let cubeIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);

    let cubeIndices = [
        2,3,4,  3,4,0,
        4,0,1,  0,1,2,

        5,6,7,  6,7,8,
        7,8,9,  9,5,6,

        12,13,14,   13,14,10,
        14,10,11,   10,11,12,

        17,18,19,   18,19,15,
        19,15,16,   15,16,17,

        23,24,20,   24,20,21,
        20,21,22,   21,22,23,

        27,28,29,   28,29,25,
        29,25,26,   25,26,27,

        33,34,30,   34,30,31,
        30,31,32,   31,32,33,

        37,38,39,   38,39,35,
        39,35,36,   35,36,37,

        43,44,40,   44,40,41,
        40,41,42,   41,42,43,

        47,48,49,   48,49,45,
        49,45,46,   45,46,47,

        52,53,54,   53,54,50,
        54,50,51,   50,51,52,

        57,58,59,   58,59,55,
        59,55,56,   55,56,57
    ];

    // gl.ELEMENT_ARRAY_BUFFER: Buffer used for element indices.
    // Uint16Array: Array of 16-bit unsigned integers.
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndices), gl.STATIC_DRAW);
    
    let dodeca = {
            buffer: vertexBuffer, colorBuffer:colorBuffer, indices:cubeIndexBuffer,
            vertSize:3, nVerts: verts.length / 3, colorSize:4, nColors: 27, nIndices: cubeIndices.length,
            primtype:gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime : Date.now()
        };

    mat4.translate(dodeca.modelViewMatrix, dodeca.modelViewMatrix, translation);

    dodeca.update = function()
    {
        let now = Date.now();
        let deltat = now - this.currentTime;
        this.currentTime = now;
        let fract = deltat / duration;
        let angle = Math.PI * 2 * fract;
    
        // Rotates a mat4 by the given angle
        // mat4 out the receiving matrix
        // mat4 a the matrix to rotate
        // Number rad the angle to rotate the matrix by
        // vec3 axis the axis to rotate around
        //---ROTATE OBJECTS---
        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis);
    };
    
    return dodeca;
}

//CREATE  escuatoide
function createEscutoide(gl, translation, rotationAxis)
{    
    // Vertex Data
    let vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    let verts = [
       // Base de pentagono
       0,0,1,   
       0.951,0,0.309,
       0.587,0,-0.809,
       -0.587,0,-0.809,
       -0.957, 0, 0.309,

       //Tapa de hexagono
       0.5,1,0.866,
       1,1,0,
       0.5,1,-0.866,
       -0.5,1,-0.866,
       -1,1,0,
       -0.5,1,0.866,
        
       //Rectangulo trasero
       0.587,0,-0.809,
       -0.587,0,-0.809,

       0.5,1,-0.866,
       -0.5,1,-0.866,

       //Rectangulo derecho
       0.951,0,0.309,
       0.587,0,-0.809,

       1,1,0,
       0.5,1,-0.866,

       //Rectangulo izquierdo
       -0.587,0,-0.809,
       -0.957, 0, 0.309,

       -0.5,1,-0.866,
       -1,1,0,

       //Frontal A:
       0,0,1,   
       0.951,0,0.309,

       0.5,1,0.866,
       1,1,0,

       //Triangulo
       0.25, 0.5, 0.933, //punta
       0.5,1,0.866,
       -0.5,1,0.866,

       //Pentagono final
       0,0,1,
       -0.957, 0, 0.309,
       -1,1,0,
       -0.5,1,0.866,
       0.25, 0.5, 0.933, //punta
       ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    // Color data
    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

    let faceColors = [
        [1.0, 0.0, 0.0, 1.0],
    ];

    let faceColorsHexa = [
        [1.0, 1.0, 0.0, 2.0],
    ];

    let faceColorsRecta = [
        [0.0, 0.0, 1.0, 2.0],
        [1.0, 0.0, 1.0, 1.0],
        [1.0, 0.0, 0.0, 2.0],
        [0.0, 1.0, 0.0, 1.0],
    ];

    let faceColorsTriangle = [
        [1.0, 0.0, 1.0, 0.5],
    ];

    let faceColorsFinal = [
        [1.0, 0.0, 1.0, 1.0],
    ];

    // Each vertex must have the color information, that is why the same color is concatenated 4 times, one for each vertex of the cube's face.
    let vertexColors = [];
    
    faceColors.forEach(color =>{
        for (let j=0; j < 5; j++)
            vertexColors.push(...color);
    });

    faceColorsHexa.forEach(color =>{
        for (let j=0; j < 6; j++)
            vertexColors.push(...color);
    });

    faceColorsRecta.forEach(color =>{
        for (let j=0; j < 4; j++)
            vertexColors.push(...color);
    });

    faceColorsTriangle.forEach(color =>{
        for (let j=0; j < 4; j++)
            vertexColors.push(...color);
    });

    faceColorsFinal.forEach(color =>{
        for (let j=0; j < 4; j++)
            vertexColors.push(...color);
    });

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    // Index data (defines the triangles to be drawn).
    let cubeIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);

    let cubeIndices = [
        0,1,4,  0,1,2,
        1,2,4,  2,3,4,

        5,6,7,  6,7,8,
        7,8,9,  8,9,10,
        9,10,5, 5,7,9,

        11,12,13,   13,14,12,
        15,16,17,   17,18,16,

        19,20,21,   21,22,20,

        23,24,25,   25,26,24,

        27,28,29,

        30,33,34,   31,32,33,
        31,33,30
        

    ];

    // gl.ELEMENT_ARRAY_BUFFER: Buffer used for element indices.
    // Uint16Array: Array of 16-bit unsigned integers.
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndices), gl.STATIC_DRAW);
    
    let escutoide = {
            buffer: vertexBuffer, colorBuffer:colorBuffer, indices:cubeIndexBuffer,
            vertSize:3, nVerts: verts.length / 3, colorSize:4, nColors: 27, nIndices: cubeIndices.length,
            primtype:gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime : Date.now()
        };

    mat4.translate(escutoide.modelViewMatrix, escutoide.modelViewMatrix, translation);

    escutoide.update = function()
    {
        let now = Date.now();
        let deltat = now - this.currentTime;
        this.currentTime = now;
        let fract = deltat / duration;
        let angle = Math.PI * 2 * fract;
    
        // Rotates a mat4 by the given angle
        // mat4 out the receiving matrix
        // mat4 a the matrix to rotate
        // Number rad the angle to rotate the matrix by
        // vec3 axis the axis to rotate around
        //---ROTATE OBJECTS---
        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis);
    };
    
    return escutoide;
}

function bindShaderAttributes(gl, shaderProgram)
{
    // get pointers to the shader params
    shaderVertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexPos");
    gl.enableVertexAttribArray(shaderVertexPositionAttribute);

    shaderVertexColorAttribute = gl.getAttribLocation(shaderProgram, "vertexColor");
    gl.enableVertexAttribArray(shaderVertexColorAttribute);
    
    shaderProjectionMatrixUniform = gl.getUniformLocation(shaderProgram, "projectionMatrix");
    shaderModelViewMatrixUniform = gl.getUniformLocation(shaderProgram, "modelViewMatrix");
}

function draw(gl, shaderProgram, objs) 
{
    // clear the background (with black)
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    // set the shader to use
    gl.useProgram(shaderProgram);

    for(let i = 0; i< objs.length; i++)
    {
        let obj = objs[i];
        // connect up the shader parameters: vertex position, color and projection/model matrices
        // set up the buffers
        gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer);
        gl.vertexAttribPointer(shaderVertexPositionAttribute, obj.vertSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, obj.colorBuffer);
        gl.vertexAttribPointer(shaderVertexColorAttribute, obj.colorSize, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indices);

        gl.uniformMatrix4fv(shaderProjectionMatrixUniform, false, projectionMatrix);
        gl.uniformMatrix4fv(shaderModelViewMatrixUniform, false, obj.modelViewMatrix);

        // Draw the object's primitives using indexed buffer information.
        // void gl.drawElements(mode, count, type, offset);
        // mode: A GLenum specifying the type primitive to render.
        // count: A GLsizei specifying the number of elements to be rendered.
        // type: A GLenum specifying the type of the values in the element array buffer.
        // offset: A GLintptr specifying an offset in the element array buffer.
        gl.drawElements(obj.primtype, obj.nIndices, gl.UNSIGNED_SHORT, 0);
    }
}

function update(gl, shaderProgram, objs) 
{
    // The window.requestAnimationFrame() method tells the browser that you wish to perform an animation and requests that the browser call a specified function to update an animation before the next repaint. The method takes a callback as an argument to be invoked before the repaint.
    requestAnimationFrame(()=> update(gl, shaderProgram, objs));

    draw(gl,shaderProgram, objs);

    objs.forEach(obj =>{
        obj.update();
    })
    // for(const obj of objs)
    //     obj.update();
    // for(let i = 0; i<objs.length; i++)
    //     objs[i].update();
}

main();