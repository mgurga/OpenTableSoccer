
var engine = Matter.Engine.create();
var world = engine.world;
var cWidth = 720;
var cHeight = 1280;
var render = Matter.Render.create({
    element: document.getElementById("canvasDiv"),
    engine: engine,
    options: {
        width: cWidth,
        height: cHeight,
        background: "#00AA00",
        hasBounds: true,
        wireframe: false
    }
});
var dragging = false;
var draggingBody;
var ctx = render.context;
var hasTouchedBall = -1;
var maxdiff = 100;

engine.world.gravity.y = 0;

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    var c = render.canvas;
    c.style.width = "100%";
}

var mouse = Matter.Mouse.create(render.canvas),
    mouseConstraint = Matter.MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0,
            render: {
                visible: false
            }
        }
    });

Matter.World.add(world, mouseConstraint);

Matter.Events.on(mouseConstraint, 'startdrag', function (evt) {
    //console.log(evt);
    dragging = true;
    draggingBody = evt.body;
    //console.log("started dragging. draggingBody :");
    //console.log(draggingBody);

});

Matter.Events.on(mouseConstraint, 'enddrag', function (evt) {
    var mousediffx = mouse.absolute.x - draggingBody.position.x;
    var mousediffy = mouse.absolute.y - draggingBody.position.y;
    var forceDamp = maxdiff * 6;

    if(mousediffx > maxdiff) { mousediffx = maxdiff; }
    if(mousediffx < -maxdiff) { mousediffx = -maxdiff; }
    if(mousediffy > maxdiff) { mousediffy = maxdiff; }
    if(mousediffy < -maxdiff) { mousediffy = -maxdiff; }

    draggingBody.force.x = -mousediffx / forceDamp;
    draggingBody.force.y = -mousediffy / forceDamp;

    dragging = false;
    draggingBody = undefined;
    //console.log("stopped dragging");

});

render.mouse = mouse;

var ball = Matter.Bodies.circle(cWidth / 2, cHeight / 2, 15, {
    density: 0.0005,
    friction: 0.01,
    frictionAir: 0.01,
    restitution: 0.8,
    label: "ball",
    render: {
        fillStyle: '#F35e66',
        strokeStyle: 'black',
        lineWidth: 1
    }
});

var walls = [
    Matter.Bodies.rectangle(360, 0, cWidth, 5, { isStatic: true, label: "wall" }),
    Matter.Bodies.rectangle(120, 0, 3 / 10 * cWidth, 60, { isStatic: true }),
    Matter.Bodies.rectangle(120 + 7 / 10 * cWidth, 0, 4 / 10 * cWidth, 60, { isStatic: true, label: "wall" }),
    Matter.Bodies.rectangle(360, cHeight + 50, cWidth, 110, { isStatic: true, label: "wall" }),
    Matter.Bodies.rectangle(120, cHeight, 3 / 10 * cWidth, 60, { isStatic: true, label: "wall" }),
    Matter.Bodies.rectangle(120 + 7 / 10 * cWidth, cHeight, 4 / 10 * cWidth, 60, { isStatic: true, label: "wall" }),
    Matter.Bodies.rectangle(0, 640, 20, cHeight + 10, { isStatic: true, label: "wall" }),
    Matter.Bodies.rectangle(cWidth, 640, 20, cHeight + 10, { isStatic: true, label: "wall" })
];

var homePlayers = [
    Matter.Bodies.circle(1 / 3 * cWidth - (1 / 3 * cWidth) / 2, cHeight * 2 / 3, 32, {restitution : 0.2, label: "homePlayer"}),
    Matter.Bodies.circle(2 / 3 * cWidth - (1 / 3 * cWidth) / 2, cHeight * 2 / 3, 32, {restitution : 0.2, label: "homePlayer"}),
    Matter.Bodies.circle(3 / 3 * cWidth - (1 / 3 * cWidth) / 2, cHeight * 2 / 3, 32, {restitution : 0.2, label: "homePlayer"}),
    Matter.Bodies.circle(2 / 3 * cWidth - (1 / 3 * cWidth) / 2, cHeight * 29 / 30, 40, {restitution : 0.2, label: "homeGoalie"})
];
homePlayers.forEach(function (obj) { Matter.World.add(engine.world, [obj]);});
walls.forEach(function (obj) { Matter.World.add(engine.world, [obj]);});
Matter.World.add(engine.world, ball);

//Start engine and run game
Matter.Engine.run(engine);
Matter.Render.run(render);

Matter.Events.on(engine, "collisionEnd", function(evt) {
    //console.log(evt);
    //console.log(Matter.Detector.collisions(evt.source.broadphase, engine));
});

Matter.Events.on(render, 'afterRender', function(evt) {
    if(dragging) {
        var mousediffx = mouse.absolute.x - draggingBody.position.x;
        var mousediffy = mouse.absolute.y - draggingBody.position.y;

        if(mousediffx > maxdiff) { mousediffx = maxdiff; }
        if(mousediffx < -maxdiff) { mousediffx = -maxdiff; }
        if(mousediffy > maxdiff) { mousediffy = maxdiff; }
        if(mousediffy < -maxdiff) { mousediffy = -maxdiff; }

        //console.log("diffx: " + mousediffx + " diffy: " + mousediffy);

        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(draggingBody.position.x, draggingBody.position.y);
        ctx.lineTo(draggingBody.position.x - mousediffx, draggingBody.position.y - mousediffy);
        ctx.stroke();

        //console.log("dragging");
    }

    if(Matter.Query.collides(ball, homePlayers).length != 0) {
        var objs = Matter.Query.collides(ball, homePlayers)[0];
        if(objs.bodyA.label == "ball") {
            hasTouchedBall = objs.bodyB.id;
        } else {
            hasTouchedBall = objs.bodyA.id;
        }

        var hitter = undefined;
        var hitterBody = undefined;
        if(objs.bodyA.label == "ball") {
            hitter = objs.bodyB.id;
            hitterBody = objs.bodyB;
        } else {
            hitter = objs.bodyA.id;
            hitterBody = objs.bodyA;
        }

        console.log("hasTouchedBall = " + hitterBody.label);

        if(hitter.id != hasTouchedBall) {
            var passConstraint = Matter.Constraint.create({
                bodyA: hitterBody,
                bodyB: ball,
                damping: 0.1,
                length: 60
            });
            Matter.World.add(engine.world, [passConstraint]);
        }

    }

    // for(var i = 0; i < homePlayerCollisions.length; i++) {
    //     if(homePlayerCollisions[i].collides) {
    //         hasTouchedBall = i;
    //         console.log("player touched ball");
    //     }
    //     if(hasTouchedBall != i && homePlayerCollisions[i].collides) {
    //         
    //     }
    // }
});