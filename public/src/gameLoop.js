let _gameRunning = true;
let _rafId = null;

function loop(){
  _rafId = requestAnimationFrame(loop);
  if(!_gameRunning) return;
  frameCount++;
  if(inOcean){ updateOcean(); }
  else { updatePhysics(); updateLakeSplashes(); }
  if(inOcean){
    renderOcean();
  } else if(gameState==='WORLD'||gameState==='DIALOG'&&!currentHouse){
    renderWorld();
  }
  if((gameState==='INDOOR'||(gameState==='DIALOG'&&currentHouse))&&currentHouse){
    renderIndoor(currentHouse);
  }
  if(gameState==='BATTLE'){
    drawBattleScene(0,0);
  }
  syncVControls();
}
updateHUD();
loop();

// Expose để login.js dùng
window._stopGameLoop  = ()=>{ if(_rafId){ cancelAnimationFrame(_rafId); _rafId=null; } };
window._startGameLoop = ()=>{ if(!_rafId) loop(); };

// ═══════════════════════════════════════════
// RESPONSIVE CANVAS SCALING
// ═══════════════════════════════════════════