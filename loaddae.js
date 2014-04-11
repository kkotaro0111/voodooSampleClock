var WineView = voodoo.View.extend({
  load: function(){
    this.loadWine();
    console.log("load");
  },
  unload: function(){
      this.scene.remove( this.wine );
  },
  loadWine: function(){
    var self = this;
    var loader = new THREE.ColladaLoader();
    loader.load( "./model/wine.dae", function( collada ){
      self.wine = collada.scene;
      self.scene.add( self.wine );
      console.log(self.wine);
      self.basePos = {
        x: 200 + 100 * self.model.num,
        y: 1000,
        z: -100};
      self.wine.position.set( self.basePos.x, self.basePos.y, self.basePos.z);
      self.wine.scale.set(10, 10, 10);
      self.wine.rotation.x = Math.PI /2;
    });

  },
  rotate: function(sec){
    if( this.wine ){
      this.wine.rotation[this.model.rotateTarget] = Math.PI * sec;
      this.dirty();
    }
  },
  move: function(sec){
    if( this.wine ){
      var rt = this.model.rotateTarget;
      var newPos = Math.sin(Math.PI * sec) * 100 + this.basePos[rt];
      this.wine.position[rt] = newPos;
      //console.log(sec, this.wine.position[rt], newPos, this.basePos, rt, this.basePos[rt]);
      this.dirty();
    }
  }
});

var Wine = voodoo.Model.extend({
  name: "Wine",
  viewType: WineView,
  initialize: function(options){
    this.num = options.num;
    this.rotateTarget = options.rt;
  },
  update: function(deltaTime){
    this.count = (this.count + 2 + deltaTime) % 2;
    if( (this.num % 6 ) >= 3){
      this.view.rotate(this.count);
    }else{
      this.view.move(this.count);
    }
  },
  count: 0
});

$(function(){
  if( ! Detector.webgl ) Detector.addGetWebGLMessage();

  //stats
  var stats = new Stats();
  stats.domElement.style.position = 'fixed';
  stats.domElement.style.top = '0px';
  $("#stats").append(stats.domElement);
  (function updt(){
    stats.update();
    requestAnimationFrame( updt );
  })();

  voodoo.engine = new voodoo.Engine({
    performanceScaling: false
  });

  //controller
  var ctl$ = $("#contrl");
  ctl$.on("click", "li", function(){
    var t$ = $(this);
    if( t$.hasClass("plus") ){
      var currentNumWine = wines.length;
      var rt = ["x", "y", "z"];
      var r = Math.floor(Math.random() * 3);

      var wine = new Wine({
        num: currentNumWine,
        rt: rt[currentNumWine % 3]
      });
      wines.push(wine);
    }else if( t$.hasClass("minus")){
      if( wines.length > 0){
        var wine = wines.pop(wine);
        wine.destroy();
      }
    }
  });
});

var wines = [];



