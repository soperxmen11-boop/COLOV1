/* Colorinka UPGRADE */
import { $, on, session } from './utils.js';
const musicEl=$('#music');   // <audio id="music" src="assets/music/theme.mp3" loop></audio>
const clickEl=$('#sfxClick'); // <audio id="sfxClick" src="assets/sfx/click.mp3"></audio>
const DEFAULTS={music:true,sfx:true,musicVol:0.35,sfxVol:0.6};
let state=Object.assign({},DEFAULTS,session.get('settings',{}));
function applyVolumes(){ if(musicEl) musicEl.volume=state.music?state.musicVol:0; if(clickEl) clickEl.volume=state.sfx?state.sfxVol:0; }
export function sfxClick(){ if(!clickEl||!state.sfx) return; try{clickEl.currentTime=0;}catch{} clickEl.play&&clickEl.play().catch(()=>{}); }
export function musicStart(){ if(!musicEl||!state.music) return; musicEl.play&&musicEl.play().catch(()=>{}); }
export function musicStop(){ musicEl&&musicEl.pause&&musicEl.pause(); }
export function toggleMusic(onOff){ state.music=onOff??!state.music; session.set('settings',state); applyVolumes(); state.music?musicStart():musicStop(); }
export function toggleSfx(onOff){ state.sfx=onOff??!state.sfx; session.set('settings',state); applyVolumes(); }
export function initAudioUI(){ applyVolumes(); on($('#toggleMusic'),'click',()=>toggleMusic()); on($('#toggleSfx'),'click',()=>toggleSfx()); }
document.addEventListener('DOMContentLoaded',()=>{ initAudioUI(); /* Colorinka UPGRADE */ });
