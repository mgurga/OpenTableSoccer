

var engine = Matter.Engine.create();
engine.world.gravity.y = 0;

var render = Matter.Render.create({
    element: document.getElementById("canvasDiv"),
    engine: engine,
    options: {
        width:1080,
        height:1920,
        background:"#00AA00",
        hasBounds: true
    }
});

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    var c = render.canvas;
    c.style.width = "100%";
    c.style.height = "100vh";
}

var homePlayers = Matter.Bodies.circle(100, 700, 20);

Matter.World.add(engine.world, [homePlayers]);

Matter.Engine.run(engine);
Matter.Render.run(render);