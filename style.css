:root {
    --negro-pizarra: #1C1E22;
    --blanco-hueso: #F5F4F0;
    --gris-codigo: #8B8D91;
    --plata-metalico: #E6E5E1;
    --rojo-chillon: #FF0004;
    --panel-bg: #111111;
    --stage-bg: #EAEAEA;
    --fuente-principal: 'Jost', sans-serif;
    --fuente-tecnica: 'JetBrains Mono', monospace;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
body { background-color: var(--negro-pizarra); color: var(--blanco-hueso); font-family: var(--fuente-principal); overflow: hidden; }
body, a, button, select { cursor: none !important; user-select: none; -webkit-touch-callout: none; }
::-webkit-scrollbar { display: none; }

/* EASTER EGG: MODO DIOS */
body.god-mode { filter: invert(1) hue-rotate(180deg) contrast(1.2) !important; animation: godFlicker 0.1s infinite !important; }
@keyframes godFlicker { 0% { transform: translate(1px, 1px); } 50% { transform: translate(-1px, -1px); } 100% { transform: translate(1px, -1px); } }

/* PRELOADER */
#preloader { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: var(--negro-pizarra); z-index: 999999; display: flex; flex-direction: column; justify-content: center; align-items: center; font-family: var(--fuente-tecnica); transition: opacity 0.5s ease; cursor: none; }
.term-text { max-width: 600px; width: 90%; font-size: 1.2rem; line-height: 1.8; color: var(--blanco-hueso); }
.blink { animation: blink 1s infinite; }
@keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
.start-btn { margin-top: 30px; color: var(--rojo-chillon); font-weight: bold; font-size: 1.2rem; display: none; padding: 10px; border: 1px dashed transparent; transition: 0.3s; }
.start-btn:hover { border-color: var(--rojo-chillon); background: rgba(255,0,4,0.1); }

/* CURSOR GLITCH */
#cursor-x-glitch { width: 25px; height: 25px; position: fixed; top: 0; left: 0; pointer-events: none; z-index: 9999999999; transform: translate(-50%, -50%); font-family: var(--fuente-tecnica); font-weight: bold; font-size: 1.5rem; display: flex; align-items: center; justify-content: center; mix-blend-mode: normal !important; color: #FFF; }
#cursor-x-glitch span { position: absolute; }
.c1 { animation: cursor-splitTop 0.6s steps(2) infinite; color: #FFF; }
.c2 { animation: cursor-splitBottom 0.6s steps(1) infinite; color: var(--rojo-chillon) !important; mix-blend-mode: normal !important; }

#cursor-ghost-container { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 9999999998; }
.cursor-ghost { position: absolute; width: 25px; height: 25px; font-family: var(--fuente-tecnica); font-weight: bold; font-size: 1.5rem; display: flex; align-items: center; justify-content: center; color: rgba(255, 255, 255, 0.5); transform: translate(-50%, -50%); animation: ghostFade 0.15s ease-out forwards; }
@keyframes ghostFade { 0% { opacity: 1; transform: translate(-50%, -50%) scale(1); } 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); } }
@keyframes cursor-splitTop { 0% { transform: translate(0); } 25% { transform: translate(-2px, -1px); } 50% { transform: translate(2px, 1px); } 75% { transform: translate(-2px, 1px); } 100% { transform: translate(0); } }
@keyframes cursor-splitBottom { 0% { transform: translate(0); } 25% { transform: translate(2px, 1px); } 50% { transform: translate(-2px, -1px); } 75% { transform: translate(2px, -1px); } 100% { transform: translate(0); } }
.visor-clic { transform: translate(-50%, -50%) scale(0.6) !important; }

/* LAYOUT PRINCIPAL DEL SAAS */
#app-container { display: flex; width: 100vw; height: 100vh; }

/* PANEL LATERAL (UI) */
#control-panel {
    width: 400px; height: 100vh; background-color: var(--panel-bg);
    border-right: 1px solid var(--gris-codigo);
    padding: 40px 30px; display: flex; flex-direction: column;
    overflow-y: auto; z-index: 100;
}
#control-panel::-webkit-scrollbar { display: none; }

.panel-header { margin-bottom: 50px; border-bottom: 1px solid #333; padding-bottom: 20px; }
.logo { font-size: 1.5rem; font-weight: 700; color: var(--blanco-hueso); letter-spacing: 2px; }
.version { font-family: var(--fuente-tecnica); color: var(--rojo-chillon); font-size: 0.8rem; margin-top: 5px; }

.control-module { margin-bottom: 35px; }
.control-module label { display: block; font-family: var(--fuente-tecnica); font-size: 0.8rem; color: var(--gris-codigo); margin-bottom: 15px; letter-spacing: 1px; text-transform: uppercase; }

.axioma-input, .axioma-btn {
    width: 100%; background: transparent; border: 1px solid #444; color: var(--blanco-hueso);
    padding: 12px 15px; font-family: var(--fuente-tecnica); font-size: 0.9rem; outline: none; transition: all 0.2s;
}
.axioma-input:hover, .axioma-btn:hover { border-color: var(--rojo-chillon); background: #1C1E22; }
.action-red { border-color: var(--rojo-chillon); color: var(--rojo-chillon); font-weight: bold; }
.action-red:hover { background: var(--rojo-chillon); color: var(--blanco-hueso); }

.btn-group { display: flex; gap: 10px; }
.btn-group .axioma-btn { flex: 1; font-size: 0.75rem; text-align: center; padding: 10px; }

.color-picker-grid { display: flex; gap: 15px; }
.color-picker-dot { width: 35px; height: 35px; border-radius: 4px; border: 2px solid transparent; transition: transform 0.2s, border-color 0.2s; }
.color-picker-dot:hover { transform: translateY(-3px); }
.color-picker-dot.active { border-color: #FFF; box-shadow: 0 0 10px rgba(255,255,255,0.2); }

.system-status-box { margin-top: auto; padding: 15px; background: #0A0A0A; border-left: 3px solid var(--rojo-chillon); }
#engine-status { font-family: var(--fuente-tecnica); font-size: 0.75rem; color: #00FF00; line-height: 1.4; white-space: pre-wrap; }

/* ESCENARIO DE RENDERIZADO 3D REAL (STAGE) */
#render-stage {
    flex: 1; position: relative; display: flex; justify-content: center; align-items: center;
    background-color: var(--stage-bg);
    background-image: 
        linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px);
    background-size: 40px 40px;
    overflow: hidden;
}

/* El Canvas 3D generado por WebGL */
#render-stage canvas {
    display: block;
    outline: none;
    cursor: grab;
}
#render-stage canvas:active { cursor: grabbing; }

.corner-btn { position: absolute; bottom: 30px; right: 30px; font-family: var(--fuente-tecnica); color: var(--gris-codigo); font-size: 0.9rem; transition: 0.3s; z-index: 10; }
.corner-btn:hover { color: var(--rojo-chillon); }

@media (max-width: 900px) {
    #app-container { flex-direction: column; }
    #control-panel { width: 100%; height: 40vh; border-right: none; border-bottom: 2px solid var(--rojo-chillon); padding: 20px; }
    #render-stage { height: 60vh; }
}
