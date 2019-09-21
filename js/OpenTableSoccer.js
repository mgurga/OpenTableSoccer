
var engine = Matter.Engine.create();
var world = engine.world;
var cWidth = 720;
var cHeight = 1280;
var render = Matter.Render.create({
    element: document.getElementById("canvasDiv"),
    engine: engine,
    options: {
        width:cWidth,
        height:cHeight,
        background:"#00AA00",
        hasBounds: true,
        wireframe: false
    }
});

engine.world.gravity.y = 0;

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    var c = render.canvas;
    c.style.width = "100%";
}

var mouse = Matter.Mouse.create(render.canvas),
    mouseConstraint = Matter.MouseConstraint.create(engine,{
        mouse: mouse,
        constraint: {
            stiffness: 0,
            render: {
                visible: false
            }
        }
    });

Matter.World.add(world, mouseConstraint);

Matter.Events.on(mouseConstraint, 'mousedown', function(evt) {
    console.log(evt);
});

Matter.Events.on(mouseConstraint, 'startdrag', function(evt) {
    console.log(evt);
});

render.mouse = mouse;

var ball = Matter.Bodies.circle(cWidth/2, cHeight/2, 15, {
    density: 0.001,
    friction: 0.01,
    frictionAir: 0.00001,
    restitution: 0.8,
    render: {
        fillStyle: '#F35e66',
        strokeStyle: 'black',
        lineWidth: 1
    }
});

var walls = [
  Matter.Bodies.rectangle(360, 0, cWidth, 5, {isStatic: true}),
  Matter.Bodies.rectangle(105, 0, 3/10 * cWidth, 60, {isStatic: true}),
  Matter.Bodies.rectangle(105 + 7/10 * cWidth, 0, 4/10 * cWidth, 60, {isStatic: true}),
  Matter.Bodies.rectangle(360, cHeight + 50, cWidth, 110, {isStatic: true}),
  Matter.Bodies.rectangle(105, cHeight, 3/10 * cWidth, 60, {isStatic: true}),
  Matter.Bodies.rectangle(105 + 7/10 * cWidth, cHeight, 4/10 * cWidth, 60, {isStatic: true}),
  Matter.Bodies.rectangle(0, 640, 20, cHeight + 10, {isStatic: true}),
  Matter.Bodies.rectangle(cWidth, 640, 20, cHeight + 10, {isStatic: true})
];

var homePlayers = [
  Matter.Bodies.circle(1/3 * cWidth - (1/3 * cWidth)/2, cHeight * 2/3, 32),
  Matter.Bodies.circle(2/3 * cWidth - (1/3 * cWidth)/2, cHeight * 2/3, 40),
  Matter.Bodies.circle(3/3 * cWidth - (1/3 * cWidth)/2, cHeight * 2/3, 32)
];


homePlayers.forEach(function(obj) {
  Matter.World.add(engine.world, [obj]);
});
walls.forEach(function(obj) {
  Matter.World.add(engine.world, [obj]);
});
Matter.World.add(engine.world, ball);


Matter.Engine.run(engine);
Matter.Render.run(render);