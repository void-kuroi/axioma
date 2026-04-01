/**
 * =======================================================================
 * AXIOMA HARDWARE ENGINE | v1.0.0 | CORE SYSTEM LOGIC (WebGL 3D REAL)
 * =======================================================================
 */

document.addEventListener("DOMContentLoaded", () => {

    // =========================================
    // 1. ESTADO GLOBAL Y SELECTORES
    // =========================================
    const engineStatusText = document.getElementById('engine-status');
    const isMobile = window.innerWidth <= 768;
    
    let isTabActive = true; 
    let selectedDevice = 'ip17pm';

    document.addEventListener("visibilitychange", () => { isTabActive = !document.hidden; });

    // =========================================
    // 2. MOTOR DEL CURSOR CUSTOM
    // =========================================
    const cursorX = document.getElementById('cursor-x-glitch');
    const ghostContainer = document.getElementById('cursor-ghost-container');
    let mouse = { x: window.innerWidth/2, y: window.innerHeight/2 };
    let lastPos = { x: mouse.x, y: mouse.y };
    let speed = 0;

    if (cursorX && !isMobile) {
        document.addEventListener('mousemove', (e) => {
            lastPos.x = mouse.x; lastPos.y = mouse.y;
            mouse.x = e.clientX; mouse.y = e.clientY;
            
            speed = Math.sqrt(Math.pow(mouse.x - lastPos.x, 2) + Math.pow(mouse.y - lastPos.y, 2));
            cursorX.style.left = mouse.x + 'px'; cursorX.style.top = mouse.y + 'px'; 
            
            if (speed > 5) createGhost();
        });

        document.addEventListener('mousedown', () => cursorX.classList.add('visor-clic'));
        document.addEventListener('mouseup', () => cursorX.classList.remove('visor-clic'));
    }

    function createGhost() {
        const ghost = document.createElement('div');
        ghost.classList.add('cursor-ghost');
        ghost.innerHTML = "X";
        ghost.style.left = mouse.x + 'px';
        ghost.style.top = mouse.y + 'px';
        ghostContainer.appendChild(ghost);
        setTimeout(() => { ghost.remove(); }, 150);
    }

    // =========================================
    // 3. MOTOR WEBGL 3D REAL (THREE.JS)
    // =========================================
    const stage = document.getElementById('render-stage');
    let scene, camera, renderer, controls;
    let phoneGroup, baseMaterial, bumpMaterial, cameraBump;

    if (typeof THREE !== 'undefined' && stage) {
        // Escena
        scene = new THREE.Scene();
        
        // Cámara
        camera = new THREE.PerspectiveCamera(45, stage.clientWidth / stage.clientHeight, 0.1, 1000);
        camera.position.set(0, 0, 15); 

        // Renderizador (Inyectado en tu HTML)
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(stage.clientWidth, stage.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        stage.appendChild(renderer.domElement);

        // Controles Orbitales (Para rotar con el ratón)
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true; 
        controls.dampingFactor = 0.05;
        controls.enablePan = false; 
        controls.minDistance = 5;
        controls.maxDistance = 25;

        // Iluminación Técnica
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); 
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8); 
        dirLight.position.set(5, 5, 5);
        scene.add(dirLight);

        const backLight = new THREE.DirectionalLight(0xffffff, 0.4); 
        backLight.position.set(-5, -5, -5);
        scene.add(backLight);

        // --- CONSTRUCCIÓN DEL MODELO 3D (El iPhone) ---
        phoneGroup = new THREE.Group();

        // Material 1: La funda principal (Mate)
        baseMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x1C1E22, // Pizarra inicial
            roughness: 0.6,  
            metalness: 0.1   
        });

        // Geometría 1: El cuerpo del teléfono
        const baseGeometry = new THREE.BoxGeometry(3.5, 7.2, 0.4); 
        const phoneBase = new THREE.Mesh(baseGeometry, baseMaterial);
        phoneGroup.add(phoneBase);

        // Material 2: El bulto de la cámara (Metálico)
        bumpMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x111111, 
            roughness: 0.2, 
            metalness: 0.8 
        });

        // Geometría 2: El bulto de la cámara
        const bumpGeometry = new THREE.BoxGeometry(1.4, 1.4, 0.1);
        cameraBump = new THREE.Mesh(bumpGeometry, bumpMaterial);
        cameraBump.position.set(-0.8, 2.6, 0.25); // Arriba a la izquierda (Estilo Pro)
        phoneGroup.add(cameraBump);

        scene.add(phoneGroup);

        // Bucle de Animación
        function animate() {
            requestAnimationFrame(animate);
            controls.update(); 
            renderer.render(scene, camera);
        }
        animate();

        // Responsive
        window.addEventListener('resize', () => {
            if(stage) {
                camera.aspect = stage.clientWidth / stage.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(stage.clientWidth, stage.clientHeight);
            }
        });
        console.log("AXIOMA: Motor WebGL 3D Real Inicializado [OK]");
    }

    // =========================================
    // 4. PANEL DE CONTROL MODULAR (CONECTADO AL 3D REAL)
    // =========================================
    
    // Módulo 00_HARDWARE (Cambia el bulto de la cámara en 3D)
    const hardwareSelect = document.getElementById('hardware-select');
    if (hardwareSelect && cameraBump) {
        hardwareSelect.addEventListener('change', (e) => {
            selectedDevice = e.target.value;
            engineStatusText.innerText = `> 3D_MODEL_UPDATE: ${selectedDevice.toUpperCase()}... [OK]`;
            playSound('click');

            // Actualización Física en Three.js
            if (selectedDevice === 'ip17pm' || selectedDevice === 'ip16pm') {
                cameraBump.scale.set(1, 1, 1);
                cameraBump.position.set(-0.8, 2.6, 0.25);
            } else if (selectedDevice === 'ip17air') {
                cameraBump.scale.set(0.8, 0.5, 1); // Más delgado
                cameraBump.position.set(0, 3.0, 0.25); // Centrado arriba
            } else if (selectedDevice === 'ip16std') {
                cameraBump.scale.set(0.6, 1.2, 1); // Vertical estrecho
                cameraBump.position.set(-0.9, 2.5, 0.25);
            } else {
                cameraBump.scale.set(0.9, 0.9, 1);
                cameraBump.position.set(-0.8, 2.6, 0.25);
            }
        });
    }

    // Módulo 01_BASE (Cambia el color del material 3D)
    const colorPickers = document.querySelectorAll('.color-picker-dot');
    colorPickers.forEach(dot => {
        dot.addEventListener('click', () => {
            colorPickers.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
            
            const hexColor = dot.dataset.colorHex;
            engineStatusText.innerText = `> BASE_MATERIAL_UPDATE: ${hexColor}... [OK]`;
            playSound('click');

            // Actualización del Material en Three.js
            if(baseMaterial) {
                baseMaterial.color.set(hexColor);
                baseMaterial.map = null; // Quitamos textura si cambia de color
                baseMaterial.needsUpdate = true;
            }
        });
    });

    // Módulo 02_MOD_CÁMARA (Cambia el acabado metálico del bulto 3D)
    const finishSelectors = document.querySelectorAll('.finish-selector-btn');
    finishSelectors.forEach(btn => {
        btn.addEventListener('click', () => {
            const finishColor = btn.dataset.finish; 
            engineStatusText.innerText = `> CAMERA_MOD_UPDATE: ${finishColor}... [OK]`;
            playSound('click');

            if(bumpMaterial) {
                bumpMaterial.color.set(finishColor);
                bumpMaterial.needsUpdate = true;
            }
        });
    });

    // Módulo 05_GRAF_INYEC (Mapeo UV Real en Three.js)
    const uploadBtn = document.getElementById('upload-graphic-btn');
    const fileInput = document.getElementById('graphic-upload-input');

    if (uploadBtn && fileInput) {
        uploadBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                engineStatusText.innerText = `> WEBGL_TEXTURE_MAPPING: ${file.name}... [PROCESSING]`;
                const reader = new FileReader();
                reader.addEventListener('load', function() {
                    
                    // Magia de Three.js: Convertimos la imagen en una textura 3D
                    const textureLoader = new THREE.TextureLoader();
                    textureLoader.load(this.result, function(texture) {
                        if(baseMaterial) {
                            baseMaterial.color.set(0xffffff); // Ponemos base blanca para que la foto se vea bien
                            baseMaterial.map = texture;
                            baseMaterial.needsUpdate = true;
                            engineStatusText.innerText = `> WEBGL_TEXTURE_MAPPING: COMPLETED [OK]`;
                        }
                    });

                });
                reader.readAsDataURL(file);
            }
        });
    }

    // =========================================
    // 5. MOTOR DE AUDIO UX
    // =========================================
    let audioCtx; 
    let soundEnabled = true;
    const btnAudioToggle = document.getElementById('audio-toggle');

    function initAudio() { if (!audioCtx) { const AudioContext = window.AudioContext || window.webkitAudioContext; audioCtx = new AudioContext(); } if (audioCtx.state === 'suspended') audioCtx.resume(); }

    function playSound(type) {
        if (!soundEnabled || !audioCtx) return;
        try {
            const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain(); 
            osc.connect(gain); gain.connect(audioCtx.destination);
            if (type === 'hover') { osc.type = 'sine'; osc.frequency.setValueAtTime(800, audioCtx.currentTime); gain.gain.setValueAtTime(0.05, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1); osc.start(); osc.stop(audioCtx.currentTime + 0.1);
            } else if (type === 'click') { osc.type = 'square'; osc.frequency.setValueAtTime(150, audioCtx.currentTime); osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.15); gain.gain.setValueAtTime(0.1, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15); osc.start(); osc.stop(audioCtx.currentTime + 0.15); }
        } catch(e) {}
    }

    if (btnAudioToggle) { btnAudioToggle.addEventListener('click', () => { soundEnabled = !soundEnabled; btnAudioToggle.innerText = soundEnabled ? '[ SOUND: ON ]' : '[ SOUND: OFF ]'; }); }

    // =========================================
    // 6. ARRANQUE DEL SISTEMA
    // =========================================
    const preloader = document.getElementById('preloader'); 
    const termText = document.getElementById('term-text'); 
    const startBtn = document.getElementById('start-btn');
    const bootLines = ["> INICIALIZANDO ENTORNO WEBGL...", "> COMPILANDO SHADERS... [OK]", "> GENERANDO GEOMETRÍA 3D... [OK]", "> SISTEMA AXIOMA ENGINE LISTO."];
    let bootIdx = 0;

    function typeBootSequence() { 
        if (bootIdx < bootLines.length && termText) { termText.innerHTML += bootLines[bootIdx] + "<br>"; bootIdx++; setTimeout(typeBootSequence, 400); 
        } else if (startBtn) { startBtn.style.display = 'block'; } 
    }

    let hasVisited = false; try { hasVisited = localStorage.getItem('axioma_engine_visited') === 'true'; } catch(e) {}

    if (hasVisited && preloader) {
        preloader.style.display = 'none';
        iniciarSistema();
    } else {
        setTimeout(typeBootSequence, 500); 
    }

    if(startBtn && preloader) {
        startBtn.addEventListener('click', () => { initAudio(); playSound('click'); preloader.style.opacity = '0'; try { localStorage.setItem('axioma_engine_visited', 'true'); } catch(e) {} setTimeout(() => { preloader.style.display = 'none'; iniciarSistema(); }, 500); });
    }

    function iniciarSistema() {
        if(engineStatusText) { engineStatusText.innerText = `> MOTOR WEBGL ONLINE.\n> ESPERANDO INTERACCIÓN...`; engineStatusText.style.color = 'var(--blanco-hueso)'; }
        document.querySelectorAll('.control-module').forEach(el => { el.addEventListener('mouseenter', () => { playSound('hover'); }); });
    }

    document.addEventListener('contextmenu', e => e.preventDefault());
});
