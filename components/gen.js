var extendDeep = AFRAME.utils.extendDeep;
var meshMixin = AFRAME.primitives.getMeshMixin();

AFRAME.registerPrimitive("z-map", {
	defaultComponents: {
		map: {},
	},
	mappings: {},
});

AFRAME.registerComponent("map", {
	schema: {
		xSize: { type: "int", default: 50 },
		zSize: { type: "int", default: 50 },
	},
	init: function () {
		var data = this.data;
		const parent = this.el;
		// perlin.noiseSeed(Math.floor(Math.random() * 100000));
		const simplex = new window.SimplexNoise();
		for (let x = 0; x < data.xSize; x++) {
			for (let z = 0; z < data.zSize; z++) {
				const vox = document.createElement("z-vox");
				vox.setAttribute("position", `${x} ${0} ${z}`);
				// vox.setAttribute("dirt", Math.round((Math.random() % 1) * 100) / 100);
				vox.setAttribute("dirt", simplex.noise3D(x / 2, 0, z / 2));
				// vox.setAttribute("turf", Math.round((Math.random() % 1) * 100) / 100);
				// vox.setAttribute("turf", simplex.noise3D(x, 0, z));
				parent.appendChild(vox);
			}
		}
	},
});

AFRAME.registerPrimitive(
	"z-vox",
	extendDeep({}, meshMixin, {
		defaultComponents: {
			rotation: "-90 0 0",
			geometry: { primitive: "plane" },
			material: { shader: "voxelres" },
			res: {},
		},
		mappings: {
			height: "geometry.height",
			width: "geometry.width",
			dirt: "res.dirt",
			turf: "res.turf",
		},
	})
);

AFRAME.registerComponent("res", {
	schema: {
		dirt: { type: "number", default: 0.0 },
		turf: { type: "number", default: 0.0 },
	},
	init: function () {
		var data = this.data;
		this.el.setAttribute("material", "dirt", data.dirt);
		this.el.setAttribute("material", "turf", data.turf);
	},
});

var VERTEX_SHADER = [
	"precision highp float;",
	"uniform float va;",
	"attribute vec3 position;",
	"uniform mat4 projectionMatrix;",
	"uniform mat4 modelViewMatrix;",
	"void main(void) {",
	"  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y, position.z, 1.0);",
	"}",
].join("\n");

var FRAGMENT_SHADER = [
	"precision highp float;",
	"uniform float va;",
	"uniform float dirt;",
	"uniform float turf;",
	"void main() {",
	// "  vec3 stone_col = vec3(0.37, 0.37, 0.37);",
	"  vec3 stone_col = vec3(0.0, 0.0, 0.0);",
	// "  vec3 dirt_col = vec3(0.45, 0.24, 0.13);",
	"  vec3 dirt_col = vec3(1.0, 1.0, 1.0);",
	"  vec3 turf_col = vec3(0.37, 0.46, 0.34);",
	"  float time = va / 1000.0;",
	"  gl_FragColor = vec4(mix(mix(stone_col,dirt_col,dirt),turf_col,turf), 1.0);",
	"}",
].join("\n");

AFRAME.registerShader("voxelres", {
	schema: {
		dirt: { type: "number", is: "uniform", default: 0.0 },
		turf: { type: "number", is: "uniform", default: 0.0 },
		va: { type: "time", is: "uniform", default: 0.0 },
	},
	raw: true,
	vertexShader: VERTEX_SHADER,
	fragmentShader: FRAGMENT_SHADER,
});
