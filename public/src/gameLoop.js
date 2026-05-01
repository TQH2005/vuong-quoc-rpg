let _gameRunning = true;

function loop(){
  if(!_gameRunning){ requestAnimationFrame(loop); return; }
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
  // Redraw battle ambient every frame
  if(gameState==='BATTLE'){
    drawBattleScene(0,0);
  }
  syncVControls();
  requestAnimationFrame(loop);
}
updateHUD();
loop();

// ═══════════════════════════════════════════
// RESPONSIVE CANVAS SCALING
// ═══════════════════════════════════════════