// =========================================
// 1. CURSOR GLOBAL & 4. ESTELAS FANTASMA
// =========================================
const cursorX = document.getElementById('cursor-x-glitch');
const ghostContainer = document.getElementById('cursor-ghost-container');
let mouse = { x: window.innerWidth/2, y: window.innerHeight/2 };
let lastPos = { x: mouse.x, y: mouse.y };
let speed = 0;

document.addEventListener('mousemove', (e) => { 
    lastPos.x = mouse.x; lastPos.y = mouse.y;
    mouse.x = e.clientX; mouse.y = e.clientY;
    
    // Calculamos velocidad para la estela
    speed = Math.sqrt(Math.pow(mouse.x - lastPos.x, 2) + Math.pow(mouse.y - lastPos.y, 2));

    cursorX.style.left = mouse.x + 'px'; cursorX.style.top = mouse.y + 'px'; 
    
    // Solo creamos estela si el ratón se mueve lo suficientemente rápido
    if (speed > 5) {
        createGhost();
    }
});

function createGhost() {
    const ghost = document.createElement('div');
    ghost.classList.add('cursor-ghost');
    ghost.innerHTML = "X";
    ghost.style.left = mouse.x + 'px';
    ghost.style.top = mouse.y + 'px';
    ghostContainer.appendChild(ghost);
    
    // Eliminamos la estela tras la animación
    setTimeout(() => { ghost.remove(); }, 150);
}

document.addEventListener('mousedown', () => cursorX.classList.add('visor-clic'));
document.addEventListener('mouseup', () => cursorX.classList.remove('visor-clic'));

// =========================================
// 2. MALLA DE PUNTOS CON OPTIMIZACIÓN
// =========================================
const canvas = document.getElementById('mesh-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let isTabActive = true; 
let meshActive = true; // Control extra para Matrix

document.addEventListener("visibilitychange", () => { isTabActive = !document.hidden; });

function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5; this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
    }
    update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
        
        let dx = mouse.x - this.x; let dy = mouse.y - this.y;
        if (Math.sqrt(dx * dx + dy * dy) < 120) { this.x -= dx * 0.04; this.y -= dy * 0.04; }
    }
    draw() {
        ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(139, 141, 145, 0.8)'; ctx.fill();
    }
}

for (let i = 0; i < 240; i++) particles.push(new Particle());

function animateMesh() {
    if (isTabActive && meshActive) { // Solo si pestaña activa y Matrix apagada
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update(); particles[i].draw();
            for (let j = i; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x; let dy = particles[i].y - particles[j].y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(139, 141, 145, ${0.6 - dist/120})`; 
                    ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke();
                }
            }
        }
    }
    requestAnimationFrame(animateMesh);
}
animateMesh();

// =========================================
// 3.1 MOTOR MATRIX RED RAIN (Roja chillona)
// =========================================
const mCanvas = document.getElementById('matrix-canvas');
const mCtx = mCanvas.getContext('2d');
const mCharSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$#@%&*";
let mRainActive = false;
let mColumns;
let mDrops = [];

function resizeMatrix() { mCanvas.width = window.innerWidth; mCanvas.height = window.innerHeight; mColumns = Math.floor(mCanvas.width / 16); mDrops = new Array(mColumns).fill(1); }
window.addEventListener('resize', resizeMatrix);
resizeMatrix();

function animateMatrix() {
    if (mRainActive) {
        mCtx.fillStyle = 'rgba(0, 0, 0, 0.05)'; // Transparencia para efecto estela
        mCtx.fillRect(0, 0, mCanvas.width, mCanvas.height);
        
        mCtx.fillStyle = '#FF0004'; // Rojo Chillón
        mCtx.font = '16px "JetBrains Mono"';
        
        for (let i = 0; i < mDrops.length; i++) {
            const char = mCharSet[Math.floor(Math.random() * mCharSet.length)];
            mCtx.fillText(char, i * 16, mDrops[i] * 16);
            
            if (mDrops[i] * 16 > mCanvas.height && Math.random() > 0.98) {
                mDrops[i] = 0;
            }
            mDrops[i]++;
        }
        requestAnimationFrame(animateMatrix);
    }
}

// EFECTO CIFRADO (SCRAMBLE)
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
document.querySelectorAll('.scramble-text').forEach(el => {
    el.addEventListener('mouseenter', () => {
        if(el.dataset.scrambling === "true") return;
        el.dataset.scrambling = "true";
        let iteration = 0;
        if(!el.dataset.original) el.dataset.original = el.innerText;
        clearInterval(el.interval);
        playSound('hover');
        
        el.interval = setInterval(() => {
            el.innerText = el.dataset.original.split("").map((letter, index) => {
                if(index < iteration || letter === " ") return el.dataset.original[index];
                return letters[Math.floor(Math.random() * 42)];
            }).join("");
            
            if(iteration >= el.dataset.original.length){ 
                clearInterval(el.interval); el.dataset.scrambling = "false";
            }
            iteration += 1 / 2; 
        }, 30);
    });
});

// =========================================
// 3. TERMINAL CON COMANDOS OCULTOS
// =========================================
const btnTerminal = document.getElementById('lanzar-terminal');
const termOverlay = document.getElementById('contact-terminal');
const termInput = document.getElementById('contact-input');
const termOutput = document.getElementById('contact-output');
const termClose = document.getElementById('term-close');
const autoScrollText = document.getElementById('sys-status');

let termStep = 0;
let userData = { nombre: '', asunto: '', mensaje: '' };

btnTerminal.addEventListener('click', (e) => {
    e.preventDefault();
    termOverlay.style.display = 'flex';
    termOutput.innerHTML = "> INICIANDO CONEXIÓN SEGURA... [OK]<br>> PROTOCOLO AXIOMA ACTIVO.<br><br>> IDENTIFICACIÓN DE VECTOR (Nombre):";
    termStep = 0;
    setTimeout(() => termInput.focus(), 100);
});

termClose.addEventListener('click', () => { termOverlay.style.display = 'none'; });

termInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && termInput.value.trim() !== '') {
        const val = termInput.value.trim();
        playSound('click');
        termOutput.innerHTML += `<br><span style="color:#F5F4F0">>_ ${val}</span>`;
        termInput.value = '';
        
        // COMANDOS OCULTOS
        if (val.toLowerCase() === '/help') {
            termOutput.innerHTML += `<br><br>> COMANDOS DISPONIBLES:<br>> /matrix - Inicia Lluvia Roja.<br>> /stop - Detiene Matrix.<br>> /clear - Limpia la consola.<br>> /exit - Cierra el Terminal.`;
        } else if (val.toLowerCase() === '/clear') {
            termOutput.innerHTML = `> CONSOLA LIMPIADA.<br>> SISTEMA AXIOMA LISTO.`;
            termStep = 3; // Estado neutral
        } else if (val.toLowerCase() === '/exit') {
            termClose.click();
        } else if (val.toLowerCase() === '/matrix') {
            termOutput.innerHTML += `<br><br>> EJECUTANDO PROTOCOLO_RED_RAIN... [OK]`;
            mRainActive = true;
            meshActive = false; // Paramos la red de puntos (Optimización)
            mCanvas.style.display = 'block';
            systemHalted = true; // Paramos el auto-scroll UX
            autoScrollText.innerText = '[ SYS_OVERRIDE: MATRIX ]';
            animateMatrix();
        } else if (val.toLowerCase() === '/stop') {
            termOutput.innerHTML += `<br><br>> DETENIENDO PROTOCOLO_RED_RAIN... [OK]`;
            mRainActive = false;
            meshActive = true; // Reiniciamos red
            mCanvas.style.display = 'none';
        }
        
        // FLUJO DE CONTACTO NORMAL
        else if (termStep === 0) {
            userData.nombre = val;
            termOutput.innerHTML += `<br><br>> VERIFICADO: ${userData.nombre}.<br>> DEFINA VECTOR DE ASUNTO:`;
            termStep++;
        } else if (termStep === 1) {
            userData.asunto = val;
            termOutput.innerHTML += `<br><br>> ASUNTO REGISTRADO.<br>> INSERTE DATOS (Mensaje):`;
            termStep++;
        } else if (termStep === 2) {
            userData.mensaje = val;
            termOutput.innerHTML += `<br><br>> ENCRIPTANDO PAQUETE DE DATOS...<br>> TRANSMITIENDO A SERVIDOR CENTRAL...`;
            setTimeout(() => {
                termOutput.innerHTML += `<br><br><span style="color:#00FF00">> PAQUETE ENVIADO CON ÉXITO. FIN DE LA CONEXIÓN.</span>`;
                playSound('click');
                setTimeout(() => { termOverlay.style.display = 'none'; }, 2000);
            }, 1500);
        }
        termOverlay.querySelector('.terminal-window').scrollTop = termOverlay.querySelector('.terminal-window').scrollHeight;
    }
});

// =========================================
// MOTOR DE AUDIO
// =========================================
let audioCtx; let soundEnabled = true;
function initAudio() { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); if (audioCtx.state === 'suspended') audioCtx.resume(); }
function playSound(type) {
    if (!soundEnabled || !audioCtx) return;
    const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain(); osc.connect(gain); gain.connect(audioCtx.destination);
    if (type === 'hover') { osc.type = 'sine'; osc.frequency.setValueAtTime(800, audioCtx.currentTime); gain.gain.setValueAtTime(0.05, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1); osc.start(); osc.stop(audioCtx.currentTime + 0.1);
    } else if (type === 'click') { osc.type = 'square'; osc.frequency.setValueAtTime(150, audioCtx.currentTime); osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.15); gain.gain.setValueAtTime(0.1, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15); osc.start(); osc.stop(audioCtx.currentTime + 0.15); }
}
document.getElementById('audio-toggle').addEventListener('click', () => { soundEnabled = !soundEnabled; document.getElementById('audio-toggle').innerText = soundEnabled ? '[ SOUND: ON ]' : '[ SOUND: OFF ]'; });

// =========================================
// 5. BOTÓN DE TEMA CLARO/OSCURO
// =========================================
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    initAudio(); playSound('click');
    document.body.classList.toggle('light-mode');
    themeToggle.innerText = document.body.classList.contains('light-mode') ? '[ THEME: DARK ]' : '[ THEME: LIGHT ]';
});

// =========================================
// 2. PRELOADER & MEMORIA DE USUARIO (LocalStorage)
// =========================================
const preloader = document.getElementById('preloader'); const termText = document.getElementById('term-text'); const startBtn = document.getElementById('start-btn');
const lines = ["> CONECTANDO CON SERVIDOR CENTRAL...", "> VERIFICANDO SINTAXIS_FÍSICA... [OK]", "> COMPILANDO LÓGICA_APLICADA... [OK]", "> CARGANDO MÓDULOS_GRÁFICOS... [OK]", "> SISTEMA AXIOMA LISTO."];
let lineIdx = 0;

function typeTerminal() { if (lineIdx < lines.length) { termText.innerHTML += lines[lineIdx] + "<br>"; lineIdx++; setTimeout(typeTerminal, 400); } else { startBtn.style.display = 'block'; } }

window.addEventListener('load', () => { 
    initAudio(); // Intento de desbloqueo táctico
    
    // Comprobar memoria de sistema
    if (localStorage.getItem('axioma_visted_today') === 'true') {
        // Saltar Intro
        preloader.style.display = 'none';
        iniciarSistema();
        document.getElementById('sys-status').innerText = '[ RECONEXIÓN RÁPIDA ESTABLECIDA ]';
        document.getElementById('sys-status').style.color = 'var(--gris-codigo)';
    } else {
        // Primera vez o caché limpia
        setTimeout(typeTerminal, 500); 
    }
});

startBtn.addEventListener('click', () => {
    initAudio(); playSound('click'); preloader.style.opacity = '0';
    // Guardar memoria para hoy
    localStorage.setItem('axioma_visted_today', 'true');
    setTimeout(() => { preloader.style.display = 'none'; iniciarSistema(); }, 500);
});

// =========================================
// CONTROL GLOBAL DE SCROLL
// =========================================
let isPaused = false; let systemHalted = false; 
const isMobile = window.innerWidth <= 768;

function autoScroll() {
    if (Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 2) { systemHalted = true; autoScrollText.innerText = '[ EXEC_COMPLETE ]'; autoScrollText.style.color = 'var(--gris-codigo)'; }
    if (!isPaused && !systemHalted && !isMobile) window.scrollBy({ top: 1, left: 0, behavior: 'auto' }); requestAnimationFrame(autoScroll);
}

function iniciarSistema() {
    window.addEventListener('scroll', () => { document.getElementById('scroll-progress').style.height = `${document.documentElement.scrollTop / (document.documentElement.scrollHeight - document.documentElement.clientHeight) * 100}%`; });
    const sections = document.querySelectorAll('section'); const navDots = document.querySelectorAll('.radar-dot');
    window.addEventListener('scroll', () => { let current = ''; sections.forEach(sec => { if (pageYOffset >= sec.offsetTop - 200) current = sec.getAttribute('id'); }); navDots.forEach(dot => { dot.classList.remove('active'); if (dot.getAttribute('href').includes(current)) dot.classList.add('active'); }); });
    const grain = document.getElementById('grain-filter');
    window.addEventListener('scroll', () => { grain.style.opacity = '0.08'; clearTimeout(grain.timer); grain.timer = setTimeout(() => { grain.style.opacity = '0.04'; }, 150); });
    
    if(!isMobile) setTimeout(() => { requestAnimationFrame(autoScroll); }, 1500);
    
    document.querySelectorAll('.hover-pause').forEach(el => { el.addEventListener('mouseenter', () => { isPaused = true; playSound('hover'); }); el.addEventListener('mouseleave', () => isPaused = false); });
    document.querySelectorAll('.text-stop, p, h1, h2, h3, h4').forEach(el => {
        el.addEventListener('click', () => { if(!systemHalted) { document.body.classList.add('flash-override'); playSound('click'); setTimeout(() => document.body.classList.remove('flash-override'), 100); } systemHalted = true; autoScrollText.innerText = '[ SYS_MANUAL_OVERRIDE ]'; autoScrollText.style.color = 'var(--gris-codigo)'; });
    });
    
    const observer = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('in-view'); }); }, { threshold: 0.1 }); 
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    
    if(!isMobile) {
        document.querySelectorAll('.magnetic').forEach(btn => { btn.addEventListener('mousemove', function(e) { const rect = btn.getBoundingClientRect(); btn.querySelector('.mag-text').style.transform = `translate(${(e.clientX - rect.left - rect.width / 2) * 0.15}px, ${(e.clientY - rect.top - rect.height / 2) * 0.25}px)`; }); btn.addEventListener('mouseleave', function() { btn.querySelector('.mag-text').style.transform = `translate(0px, 0px)`; }); });
        
        // =========================================
        // 1. MOTOR TILT 3D (HOLOGRÁFICO)
        // =========================================
        const tiltCards = document.querySelectorAll('.3d-tilt');
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left; const y = e.clientY - rect.top;
                const centerX = rect.width / 2; const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / 15) * -1; const rotateY = (x - centerX) / 15;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                card.style.transition = 'none';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
                card.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
            });
        });
    }
}

// Seguridad
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => { if (e.target.tagName === 'IMG') e.preventDefault(); });