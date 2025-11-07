window.onload = function () {
	'use strict';
	var canvas = document.getElementById('world'),
    context = true,
		make3DPoint = function (x, y, z) {
			var point = {};
			point.x = x;
			point.y = y;
			point.z = z;
			return point;
		},
		object = [
			make3DPoint(-50, -50, -50),
		  make3DPoint(-50, 50, -50),
			make3DPoint(-50, 50, 50),
			make3DPoint(50, 50, 50),
			make3DPoint(50, 50, -50),
			make3DPoint(50, -50, -50),
			make3DPoint(50, -50, 50),
			make3DPoint(-50, -50, 50)
		],
		cubeAxisRotations = make3DPoint(0, 0, 0),
		focalLength = 300;
	
	function drawBackground(color) {
		context.fillStyle = 'transparent';
		context.fillRect(0, 0, canvas.width, canvas.height);
	}
	
	function clearCanvas() {
		context.clearRect(0, 0, canvas.width, canvas.height);
		drawBackground();
	}
	function transform3dTo2DPoints(points, axisRotations) {
		var transformedPointsArray = [],
			sx = Math.sin(axisRotations.x),
			cx = Math.cos(axisRotations.x),
			sy = Math.sin(axisRotations.y),
			cy = Math.cos(axisRotations.y),
			sz = Math.sin(axisRotations.z),
			cz = Math.cos(axisRotations.z),
			x,
			y,
			z,
			xy,
			xz,
			yx,
			yz,
			zx,
			zy,
			scaleFactor,
			i = points.length;
		
		function make2DPoint(x, y, depth, scaleFactor) {
			var point = {};
		
		// Nullpunkt in die Mitte setzen
			point.x = x + (canvas.width / 2);
			point.y = y + (canvas.height / 2);
			point.depth = depth;
			point.scaleFactor = scaleFactor;
			return point;
		}
		while (i--) {
			x = points[i].x;
			y = points[i].y;
			z = points[i].z;

			// Rotation um x
			xy = cx * y - sx * z;
			xz = sx * y + cx * z;
			
			// Rotation um y
			yz = cy * xz - sy * x;
			yx = sy * xz + cy * x;
			
			// Rotation um z
			zx = cz * yx - sz * xy;
			zy = sz * yx + cz * xy;

			scaleFactor = focalLength / (focalLength + yz);
			x = zx * scaleFactor;
			y = zy * scaleFactor;
			z = yz;

			transformedPointsArray[i] = make2DPoint(x, y, -z, scaleFactor);
		}
		
		return transformedPointsArray;
	}
	function drawLine(start, end, color) {
		// color || (color = "#333");
		color = 'dodgerblue';
		
		// Linie
		context.beginPath();
		context.moveTo(start.x, start.y);
		context.lineTo(end.x, end.y);
		
		// Linien zeichnen
		context.strokeStyle = color;
		context.stroke();
	}
	function drawTetra() {
		var points = transform3dTo2DPoints(object, cubeAxisRotations);
		drawLine(points[0], points[7]);
		drawLine(points[1], points[0]);
		drawLine(points[2], points[1]);
		drawLine(points[2], points[7]);
	}
	function drawCube() {
		var points = transform3dTo2DPoints(object, cubeAxisRotations);
		drawLine(points[0], points[1]);
		drawLine(points[0], points[5]);
		drawLine(points[1], points[2]);
		drawLine(points[1], points[4]);
		drawLine(points[2], points[3]);
		drawLine(points[2], points[7]);
		drawLine(points[3], points[4]);
		drawLine(points[3], points[6]);
		drawLine(points[4], points[3]);
		drawLine(points[4], points[1]);
		drawLine(points[5], points[4]);
		drawLine(points[5], points[6]);
		drawLine(points[6], points[7]);
		drawLine(points[0], points[7]);
	}
	function animate() {
		var interval = setInterval(function () {
			cubeAxisRotations.x += 0.01;
			cubeAxisRotations.y -= 0.005;
			clearCanvas();
			drawCube();
			//drawTetra();
		}, 32);
	}
	
	
	
	function init() {
		if (canvas && canvas.getContext) {
			context = canvas.getContext('2d');
			drawBackground();
			animate();
		}
	}
	init();
};

document.getElementById('year').textContent = new Date().getFullYear();

        // Mobile menu
        const mobileBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Portfolio filter
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => {
                    b.classList.remove('active', 'text-accent', 'border-accent');
                    b.classList.add('text-white/70', 'border-white/30');
                });
                btn.classList.add('active', 'text-accent', 'border-accent');
                btn.classList.remove('text-white/70', 'border-white/30');

                const filter = btn.getAttribute('data-filter');
                document.querySelectorAll('.portfolio-item').forEach(item => {
                    const cats = item.getAttribute('data-category').split(' ');
                    if (filter === 'all' || cats.includes(filter)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });

        // Hero Canvas – Floating Tetrahedron
        const heroCanvas = document.getElementById('hero-canvas');
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, heroCanvas.clientWidth / heroCanvas.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: heroCanvas, alpha: true });
        renderer.setSize(heroCanvas.clientWidth, heroCanvas.clientHeight);

        const geometry = new THREE.TetrahedronGeometry(2, 0);
        const material = new THREE.MeshBasicMaterial({ color: 0x00c8ff, wireframe: true });
        const tetra = new THREE.Mesh(geometry, material);
        scene.add(tetra);
        camera.position.z = 5;

        function animateHero() {
            requestAnimationFrame(animateHero);
            tetra.rotation.x += 0.01;
            tetra.rotation.y += 0.01;
            renderer.render(scene, camera);
        }
        animateHero();

        // Geometrie Lab Canvas
        const geoCanvas = document.getElementById('geometrie-canvas');
        const geoScene = new THREE.Scene();
        const geoCamera = new THREE.PerspectiveCamera(75, geoCanvas.clientWidth / geoCanvas.clientHeight, 0.1, 1000);
        const geoRenderer = new THREE.WebGLRenderer({ canvas: geoCanvas, antialias: true });
        geoRenderer.setSize(geoCanvas.clientWidth, geoCanvas.clientHeight);
        geoRenderer.setClearColor(0x000000);

        const geoGeo = new THREE.DodecahedronGeometry(1.5, 0);
        const geoMat = new THREE.MeshStandardMaterial({ color: 0xffd700, wireframe: false, metalness: 0.8, roughness: 0.2 });
        const dodeca = new THREE.Mesh(geoGeo, geoMat);
        geoScene.add(dodeca);

        const light = new THREE.PointLight(0xffffff, 2);
        light.position.set(5, 5, 5);
        geoScene.add(light);

        geoCamera.position.z = 5;

        let mouseX = 0, mouseY = 0;
        geoCanvas.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        function animateGeo() {
            requestAnimationFrame(animateGeo);
            dodeca.rotation.x += 0.005 + mouseY * 0.02;
            dodeca.rotation.y += 0.005 + mouseX * 0.02;
            geoRenderer.render(geoScene, geoCamera);
        }
        animateGeo();

        // Responsive canvases
        window.addEventListener('resize', () => {
            // Hero
            camera.aspect = heroCanvas.clientWidth / heroCanvas.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(heroCanvas.clientWidth, heroCanvas.clientHeight);

            // Geo
            geoCamera.aspect = geoCanvas.clientWidth / geoCanvas.clientHeight;
            geoCamera.updateProjectionMatrix();
            geoRenderer.setSize(geoCanvas.clientWidth, geoCanvas.clientHeight);
        });
