var demoShaderTextVert =
[
    'precision mediump float;',
    'attribute vec3 vertPositions;',
    'attribute vec3 vertColor;',
    '',
    'varying vec3 passColor;',
    '',
    'uniform mat4 worldMat;',
    'uniform mat4 viewMat;',
    'uniform mat4 projectionMat;',
    '',
    'void main() {',
    'gl_Position = projectionMat * viewMat * worldMat * vec4(vertPositions, 1.0);',
    'passColor = vertColor;',
    '}'
].join('\n');

var demoShaderTextFrag =
[
    'precision mediump float;',
    'varying vec3 passColor;',
    'void main() {',
    'gl_FragColor = vec4((passColor + vec3(1,1,1)) / vec3(2,2,2), 1.0);',
    '}'
].join('\n');

const FPS = 60

var InitDemo = function() {
    var canvas = document.getElementById('game-surface');
    var gl = canvas.getContext('webgl');

    if(!gl) {
        console.warn('WebGL not supported on this browser; falling back to experimental webgl.');
        gl = canvas.getContext('experimental-webgl');
    }

    if(!gl) {
        alert('Your browser does not support WebGL!!');
    }

    console.log(document.getElementsByClassName('game-box')[0])

    canvas.width = document.getElementsByClassName('game-box')[0].clientWidth;
    canvas.height = document.getElementsByClassName('game-box')[0].clientHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.clearColor(0.7, 0.2, 0.7, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.CULL_FACE)
    gl.frontFace(gl.CCW)
    gl.cullFace(gl.BACK)

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, demoShaderTextVert);
    gl.shaderSource(fragmentShader, demoShaderTextFrag);

    gl.compileShader(vertexShader);
    if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('ERROR: compiling vertex shader: ', gl.getShaderInfoLog(vertexShader));
        return;
    }

    gl.compileShader(fragmentShader);
    if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error('ERROR: compiling fragment shader: ', gl.getShaderInfoLog(fragmentShader));
        return;
    }

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('ERROR: linking program: ', gl.getProgramInfoLog(program));
        return;
    }

    gl.validateProgram(program);
    if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error('ERROR: validating program: ', gl.getProgramInfoLog(program));
        return;
    }
    
//     
//  Create Buffer
//     

var boxVertices = 
    [    // X, Y, Z           R, G, B
        // Top
        -1.0, 1.0, -1.0,   0.5, 0.5, 0.5,
        -1.0, 1.0, 1.0,    0.5, 0.5, 0.5,
        1.0, 1.0, 1.0,     0.5, 0.5, 0.5,
        1.0, 1.0, -1.0,    0.5, 0.5, 0.5,

        // Left
        -1.0, 1.0, 1.0,    0.75, 0.25, 0.5,
        -1.0, -1.0, 1.0,   0.75, 0.25, 0.5,
        -1.0, -1.0, -1.0,  0.75, 0.25, 0.5,
        -1.0, 1.0, -1.0,   0.75, 0.25, 0.5,

        // Right
        1.0, 1.0, 1.0,    0.25, 0.25, 0.75,
        1.0, -1.0, 1.0,   0.25, 0.25, 0.75,
        1.0, -1.0, -1.0,  0.25, 0.25, 0.75,
        1.0, 1.0, -1.0,   0.25, 0.25, 0.75,

        // Front
        1.0, 1.0, 1.0,    1.0, 0.0, 0.15,
        1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
        -1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
        -1.0, 1.0, 1.0,    1.0, 0.0, 0.15,

        // Back
        1.0, 1.0, -1.0,    0.0, 1.0, 0.15,
        1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
        -1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
        -1.0, 1.0, -1.0,    0.0, 1.0, 0.15,

        // Bottom
        -1.0, -1.0, -1.0,   0.5, 0.5, 1.0,
        -1.0, -1.0, 1.0,    0.5, 0.5, 1.0,
        1.0, -1.0, 1.0,     0.5, 0.5, 1.0,
        1.0, -1.0, -1.0,    0.5, 0.5, 1.0,
    ];


var boxIndices =
[
        // Top
        0, 1, 2,
        0, 2, 3,

        // Left
        5, 4, 6,
        6, 4, 7,

        // Right
        8, 9, 10,
        8, 10, 11,

        // Front
        13, 12, 14,
        15, 14, 12,

        // Back
        16, 17, 18,
        16, 18, 19,

        // Bottom
        21, 20, 22,
        22, 20, 23
    ];

    var boxVBO = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, boxVBO);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

    var boxEBA = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxEBA);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);

    var posAttribLocation = gl.getAttribLocation(program, 'vertPositions');
    var colAttribLocation = gl.getAttribLocation(program, 'vertColor');

    gl.vertexAttribPointer(
        posAttribLocation,
        3,
        gl.FLOAT,
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT,
        0
    );

    gl.vertexAttribPointer(
        colAttribLocation,
        3,
        gl.FLOAT,
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT,
        3 * Float32Array.BYTES_PER_ELEMENT
    );

    gl.useProgram(program)

    gl.enableVertexAttribArray(posAttribLocation);
    gl.enableVertexAttribArray(colAttribLocation);

    var matWorldUniformLocation = gl.getUniformLocation(program, 'worldMat');
    var viewWorldUniformLocation = gl.getUniformLocation(program, 'viewMat');
    var projWorldUniformLocation = gl.getUniformLocation(program, 'projectionMat');

    var worldMatrix = new Float32Array(16);
    var viewMatrix = new Float32Array(16);
    var projMatrix = new Float32Array(16);

    glMatrix.mat4.identity(worldMatrix)
    glMatrix.mat4.lookAt(viewMatrix, [0, 0, -5], [0, 0, 0], [0, 1, 0])
    glMatrix.mat4.perspective(projMatrix, 70, canvas.width / canvas.height, 0.01, 1000)

    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix)
    gl.uniformMatrix4fv(viewWorldUniformLocation, gl.FALSE, viewMatrix)
    gl.uniformMatrix4fv(projWorldUniformLocation, gl.FALSE, projMatrix)

    const identityMatrix = new Float32Array(16)
    glMatrix.mat4.identity(identityMatrix)
    var loop = function () {
        glMatrix.mat4.rotate(worldMatrix, identityMatrix, performance.now() / 1000 / 6 * 2 * Math.PI, [0.5, 1, 0.1])
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix)
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT)
        gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0)
    }

    setInterval(() => {
        requestAnimationFrame(loop)
    }, 1000 / FPS)
    requestAnimationFrame(loop)
};