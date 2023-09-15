AFRAME.registerComponent("gizmo", {
	dependency: ["arrow", "axis"],
	schema: {
		size: { type: "int", default: 10 },
		divisions: { type: "int", default: 10 },
		colorCenterLine: { type: "color", default: "#444444" },
		colorGrid: { type: "color", default: "#888888" },
		xAxisColor: { type: "color", default: "red" },
		yAxisColor: { type: "color", default: "green" },
		zAxisColor: { type: "color", default: "blue" },
	},
	init: function () {
		var data = this.data;
		const scene = this.el;

		// generating main axis lines
		const gizmo = document.createElement("a-entity");
		const axis = document.createElement("a-entity");
		axis.setAttribute("axis", "size", data.size);
		axis.setAttribute("axis", "xAxisColor", data.xAxisColor);
		axis.setAttribute("axis", "yAxisColor", data.yAxisColor);
		axis.setAttribute("axis", "zAxisColor", data.zAxisColor);

		// generating grid lines
		const grid = document.createElement("a-entity");
		grid.setAttribute("position", { x: data.size / 2, y: 0, z: data.size / 2 });
		grid.setAttribute("grid", "size", data.size);
		grid.setAttribute("grid", "divisions", data.divisions);
		grid.setAttribute("grid", "colorCenterLine", data.colorCenterLine);
		grid.setAttribute("grid", "colorGrid", data.colorGrid);

		gizmo.appendChild(grid);
		gizmo.appendChild(axis);
		scene.appendChild(gizmo);
	},
	update: function () {},
	tick: function () {},
	remove: function () {},
	pause: function () {},
	play: function () {},
});

AFRAME.registerComponent("arrow", {
	schema: {
		dir: { type: "vec3", default: { x: 0, y: 0, z: 0 } },
		origin: { type: "vec3", default: { x: 0, y: 0, z: 0 } },
		length: { type: "number", default: 1 },
		color: { type: "color", default: "#74BEC1" },
		opacity: { type: "number", default: 1 },
		visible: { default: true },
		headlength: { type: "number", default: 0 },
		headwidth: { type: "number", default: 0 },
	},

	multiple: true,

	init: function () {
		var data = this.data;
		this.arrow = new THREE.ArrowHelper(
			new THREE.Vector3(data.dir.x, data.dir.y, data.dir.z).normalize(),
			new THREE.Vector3(data.origin.x, data.origin.y, data.origin.z),
			data.length,
			data.color,
			data.headlength === 0 ? undefined : data.headlength,
			data.headwidth === 0 ? undefined : data.headwidth
		);

		this.el.setObject3D(this.attrName, this.arrow);
	},
	update: function (oldData) {
		var data = this.data;

		if (data.color !== oldData.color) this.arrow.setColor(data.color);

		if (!isEqualVec3(data.dir, oldData.dir))
			this.arrow.setDirection(new THREE.Vector3(data.dir.x, data.dir.y, data.dir.z).normalize());
		console.log(data.origin, oldData.origin);
		if (!isEqualVec3(data.origin, oldData.origin)) {
			this.arrow.position.x = data.origin.x;
			this.arrow.position.y = data.origin.y;
			this.arrow.position.z = data.origin.z;
		}
	},
	remove: function () {
		this.el.removeObject3D("arrow", this.arrow);
	},
});

AFRAME.registerComponent("grid", {
	schema: {
		size: { type: "int", default: 10 },
		divisions: { type: "int", default: 10 },
		colorCenterLine: { type: "color", default: "#444444" },
		colorGrid: { type: "color", default: "#888888" },
	},
	multiple: true,
	init: function () {
		var data = this.data;
		this.grid = new THREE.GridHelper(
			data.size,
			data.divisions,
			data.colorCenterLine,
			data.colorGrid
		);

		this.el.setObject3D(this.attrName, this.grid);
	},
	update: function (oldData) {
		var data = this.data;

		// update size
		// update divisions
		// update colorCenterLine
		// update colorGrid
		if (
			data.size !== oldData.size ||
			data.divisions !== oldData.divisions ||
			data.colorCenterLine !== oldData.colorCenterLine ||
			data.colorGrid !== oldData.colorGrid
		) {
			this.el.removeObject3D("grid", this.grid);
			this.grid = new THREE.GridHelper(
				data.size,
				data.divisions,
				data.colorCenterLine,
				data.colorGrid
			);
			this.el.setObject3D(this.attrName, this.grid);
		}
	},
	remove: function () {
		this.el.removeObject3D("grid", this.grid);
	},
});

AFRAME.registerComponent("axis", {
	schema: {
		size: { type: "int", default: 1 },
		xAxisColor: { type: "color", default: "red" },
		yAxisColor: { type: "color", default: "green" },
		zAxisColor: { type: "color", default: "blue" },
	},
	multiple: true,
	init: function () {
		var data = this.data;
		this.axis = new THREE.AxesHelper(data.size);

		this.axis.setColors(data.xAxisColor, data.yAxisColor, data.zAxisColor);
		this.el.setObject3D(this.attrName, this.axis);
	},
	update: function (oldData) {
		var data = this.data;

		//updating colors
		if (
			data.xAxisColor !== oldData.xAxisColor ||
			data.yAxisColor !== oldData.yAxisColor ||
			data.zAxisColor !== oldData.zAxisColor
		) {
			this.axis.setColors(data.xAxisColor, data.yAxisColor, data.zAxisColor);
		}

		// updating size
		if (data.size !== oldData.size) {
			this.axis.dispose();
			this.el.removeObject3D("axis", this.axis);
			this.axis = new THREE.AxesHelper(data.size);
			this.el.setObject3D(this.attrName, this.axis);
		}
	},
	remove: function () {
		this.el.dispose();
		this.el.removeObject3D("axis", this.axis);
	},
});

function isEqualVec3(a, b) {
	if (!a || !b) {
		return false;
	}
	return a.x === b.x && a.y === b.y && a.z === b.z;
}
