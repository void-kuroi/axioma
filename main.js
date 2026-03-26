// =========================================
// 1. CURSOR GLOBAL
// =========================================
const cursorX = document.getElementById('cursor-x-glitch');
let mouse = { x: window.innerWidth/2, y: window.innerHeight/2 };
document.addEventListener('mousemove', (e) => { 
    mouse.x = e.clientX; mouse.y = e.clientY;
    cursorX.style.left = e.clientX + 'px'; cursorX.style.top = e.clientY + 'px'; 
});
document.addEventListener('mousedown', () => cursorX.classList.add('visor-clic'));
document.addEventListener('mouseup', () => cursorX.classList.remove('visor-clic'));

// =========================================
// 2. MALLA DE PUNTOS CON OPTIMIZACIÓN DE ENERGÍA
// =========================================
const canvas = document.getElementById('mesh-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let isTabActive = true; // Control de energía

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
    if (isTabActive) { // Solo dibuja si el usuario está en la pestaña (Ahorro de batería)
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
// 3. EFECTO CIFRADO (SCRAMBLE) EN TÍTULOS
// =========================================
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
// 4. TERMINAL DE CONTACTO INTERACTIVO
// =========================================
const btnTerminal = document.getElementById('lanzar-terminal');
const termOverlay = document.getElementById('contact-terminal');
const termInput = document.getElementById('contact-input');
const termOutput = document.getElementById('contact-output');
const termClose = document.getElementById('term-close');

let termStep = 0;
let userData = { nombre: '', asunto: '', mensaje: '' };

btnTerminal.addEventListener('click', (e) => {
    e.preventDefault();
    termOverlay.style.display = 'flex';
    termOutput.innerHTML = "> INICIANDO PROTOCOLO DE CONEXIÓN...<br>> ESTABLECIENDO CANAL SEGURO... [OK]<br><br>> POR FAVOR, INTRODUZCA IDENTIFICACIÓN (Nombre):";
    termStep = 0;
    setTimeout(() => termInput.focus(), 100);
});

termClose.addEventListener('click', () => { termOverlay.style.display = 'none'; });

termInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && termInput.value.trim() !== '') {
        const val = termInput.value.trim();
        playSound('click');
        termOutput.innerHTML += `<br><span style="color:#F5F4F0">${val}</span>`;
        termInput.value = '';

        if (termStep === 0) {
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
            
            // Simulación de envío
            setTimeout(() => {
                termOutput.innerHTML += `<br><br><span style="color:#00FF00">> PAQUETE ENVIADO CON ÉXITO. FIN DE LA CONEXIÓN.</span>`;
                playSound('click');
                // Aquí podrías conectar una API real (como EmailJS o Formspree) usando los datos de userData
                setTimeout(() => { termOverlay.style.display = 'none'; }, 2000);
            }, 1500);
        }
        termOverlay.querySelector('.terminal-window').scrollTop = termOverlay.querySelector('.terminal-window').scrollHeight;
    }
});

// =========================================
// 5. NÚCLEO, AUDIO, EASTER EGG Y PRELOADER
// =========================================
// (Todo lo demás se mantiene idéntico, estructurado para funcionar modularmente)

// Easter Egg
let secretCode = ['a', 'x', 'i', 'o', 'm', 'a']; let keyHistory = [];
document.addEventListener('keydown', (e) => {
    keyHistory.push(e.key.toLowerCase()); keyHistory.splice(-secretCode.length - 1, keyHistory.length - secretCode.length);
    if (keyHistory.join('') === secretCode.join('')) { document.body.classList.toggle('god-mode'); playSound('click'); document.getElementById('sys-status').innerText = '[ MODO DIOS: ACTIVADO ]'; }
});

// Menú Contextual
const ctxMenu = document.getElementById('context-menu');
document.addEventListener('contextmenu', (e) => { e.preventDefault(); ctxMenu.style.display = 'flex'; ctxMenu.style.left = e.clientX + 'px'; ctxMenu.style.top = e.clientY + 'px'; playSound('hover'); });
document.addEventListener('click', (e) => { if(!ctxMenu.contains(e.target)) ctxMenu.style.display = 'none'; });
document.querySelector('.ctx-copy').addEventListener('click', () => { navigator.clipboard.writeText(window.location.href); ctxMenu.style.display = 'none'; });
document.querySelector('.ctx-audio').addEventListener('click', () => { document.getElementById('audio-toggle').click(); ctxMenu.style.display = 'none'; });
document.querySelector('.ctx-reload').addEventListener('click', () => { location.reload(); });

// Telemetría
const hudTime = document.getElementById('hud-time'); const hudNode = document.getElementById('hud-node');
try { hudNode.innerText = Intl.DateTimeFormat().resolvedOptions().timeZone.split('/')[1].toUpperCase() || "UNKNOWN"; } catch(e) { hudNode.innerText = "LOCAL_NODE"; }
setInterval(() => { hudTime.innerText = new Date().toTimeString().split(' ')[0]; }, 1000);

// Audio
let audioCtx; let soundEnabled = true;
function initAudio() { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); if (audioCtx.state === 'suspended') audioCtx.resume(); }
function playSound(type) {
    if (!soundEnabled || !audioCtx) return;
    const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain(); osc.connect(gain); gain.connect(audioCtx.destination);
    if (type === 'hover') { osc.type = 'sine'; osc.frequency.setValueAtTime(800, audioCtx.currentTime); gain.gain.setValueAtTime(0.05, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1); osc.start(); osc.stop(audioCtx.currentTime + 0.1); } 
    else if (type === 'click') { osc.type = 'square'; osc.frequency.setValueAtTime(150, audioCtx.currentTime); osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.15); gain.gain.setValueAtTime(0.1, audioCtx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15); osc.start(); osc.stop(audioCtx.currentTime + 0.15); }
}
document.getElementById('audio-toggle').addEventListener('click', () => { soundEnabled = !soundEnabled; document.getElementById('audio-toggle').innerText = soundEnabled ? '[ SOUND: ON ]' : '[ SOUND: OFF ]'; });

// Preloader & Init
const preloader = document.getElementById('preloader'); const termText = document.getElementById('term-text'); const startBtn = document.getElementById('start-btn');
const lines = ["> CONECTANDO CON SERVIDOR CENTRAL...", "> VERIFICANDO SINTAXIS_FÍSICA... [OK]", "> COMPILANDO LÓGICA_APLICADA... [OK]", "> CARGANDO MÓDULOS_GRÁFICOS... [OK]", "> SISTEMA AXIOMA LISTO."];
let lineIdx = 0;
function typeTerminal() { if (lineIdx < lines.length) { termText.innerHTML += lines[lineIdx] + "<br>"; lineIdx++; setTimeout(typeTerminal, 400); } else { startBtn.style.display = 'block'; } }
window.addEventListener('load', () => { setTimeout(typeTerminal, 500); });
startBtn.addEventListener('click', () => { initAudio(); playSound('click'); preloader.style.opacity = '0'; setTimeout(() => { preloader.style.display = 'none'; iniciarSistema(); }, 500); });

function iniciarSistema() {
    window.addEventListener('scroll', () => { document.getElementById('scroll-progress').style.height = `${document.documentElement.scrollTop / (document.documentElement.scrollHeight - document.documentElement.clientHeight) * 100}%`; });
    const sections = document.querySelectorAll('section'); const navDots = document.querySelectorAll('.radar-dot');
    window.addEventListener('scroll', () => { let current = ''; sections.forEach(sec => { if (pageYOffset >= sec.offsetTop - 200) current = sec.getAttribute('id'); }); navDots.forEach(dot => { dot.classList.remove('active'); if (dot.getAttribute('href').includes(current)) dot.classList.add('active'); }); });
    const grain = document.getElementById('grain-filter');
    window.addEventListener('scroll', () => { grain.style.opacity = '0.08'; clearTimeout(grain.timer); grain.timer = setTimeout(() => { grain.style.opacity = '0.04'; }, 150); });
    
    let isPaused = false; let systemHalted = false; const sysStatus = document.getElementById('sys-status'); const isMobile = window.innerWidth <= 768;
    function autoScroll() {
        if (Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 2) { systemHalted = true; sysStatus.innerText = '[ EXEC_COMPLETE ]'; sysStatus.style.color = 'var(--gris-codigo)'; }
        if (!isPaused && !systemHalted && !isMobile) window.scrollBy({ top: 1, left: 0, behavior: 'auto' }); requestAnimationFrame(autoScroll);
    }
    if(!isMobile) setTimeout(() => { requestAnimationFrame(autoScroll); }, 1500);
    
    // Pausas del scroll añadidas a la nueva Galería de Proyectos
    document.querySelectorAll('.hover-pause').forEach(el => { el.addEventListener('mouseenter', () => { isPaused = true; playSound('hover'); }); el.addEventListener('mouseleave', () => isPaused = false); });
    document.querySelectorAll('.text-stop, p, h1, h2, h3, h4').forEach(el => { el.addEventListener('click', () => { if(!systemHalted) { document.body.classList.add('flash-override'); playSound('click'); setTimeout(() => document.body.classList.remove('flash-override'), 100); } systemHalted = true; sysStatus.innerText = '[ SYS_MANUAL_OVERRIDE ]'; sysStatus.style.color = 'var(--gris-codigo)'; }); });
    
    const observer = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('in-view'); }); }, { threshold: 0.1 }); 
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    
    if(!isMobile) {
        document.querySelectorAll('.magnetic').forEach(btn => { btn.addEventListener('mousemove', function(e) { const rect = btn.getBoundingClientRect(); btn.querySelector('.mag-text').style.transform = `translate(${(e.clientX - rect.left - rect.width / 2) * 0.15}px, ${(e.clientY - rect.top - rect.height / 2) * 0.25}px)`; }); btn.addEventListener('mouseleave', function() { btn.querySelector('.mag-text').style.transform = `translate(0px, 0px)`; }); });
    }
}

// Seguridad
document.addEventListener('dragstart', e => { if (e.target.tagName === 'IMG') e.preventDefault(); });