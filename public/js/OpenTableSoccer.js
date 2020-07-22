
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
var ce = React.createElement;
const socket = io(this.window);

function searchforgame() {
	socket.emit("searchforgame");
	socket.on("usersreadyup", () => {
		if(confirm("are you ready?") == true) {
			console.log("sending ready");
			socket.emit("ready");
			socket.on("lockedin", () => {
				alert("locked in!");
			});
		} else {
			console.log("sending notready");
			socket.emit("notready");
		}
	});
	socket.on("cancelled", (resp) => {
		alert("game cancelled, " + resp.reason);
	});
}

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
    console.log(evt);
    dragging = true;
    draggingBody = evt.body;
    console.log("started dragging. draggingBody :");
    console.log(draggingBody);

});

Matter.Events.on(mouseConstraint, 'enddrag', function (evt) {
    var mousediffx = mouse.absolute.x - draggingBody.position.x;
    var mousediffy = mouse.absolute.y - draggingBody.position.y;
    var forceDamp = 300;

    var maxdiff = 50;

    if(mousediffx > maxdiff) { mousediffx = maxdiff; }
    if(mousediffx < -maxdiff) { mousediffx = -maxdiff; }
    if(mousediffy > maxdiff) { mousediffy = maxdiff; }
    if(mousediffy < -maxdiff) { mousediffy = -maxdiff; }

    draggingBody.force.x = -mousediffx / forceDamp;
    draggingBody.force.y = -mousediffy / forceDamp;

    dragging = false;
    draggingBody = undefined;
    console.log("stopped dragging");


});

render.mouse = mouse;

var ball = Matter.Bodies.circle(cWidth / 2, cHeight / 2, 15, {
    density: 0.0005,
    friction: 0.01,
    frictionAir: 0.01,
    restitution: 0.9,
    render: {
        fillStyle: '#F35e66',
        strokeStyle: 'black',
        lineWidth: 1
    }
});

var walls = [
    Matter.Bodies.rectangle(360, 0, cWidth, 5, { isStatic: true }),
    Matter.Bodies.rectangle(120, 0, 3 / 10 * cWidth, 60, { isStatic: true }),
    Matter.Bodies.rectangle(120 + 7 / 10 * cWidth, 0, 4 / 10 * cWidth, 60, { isStatic: true }),
    Matter.Bodies.rectangle(360, cHeight + 50, cWidth, 110, { isStatic: true }),
    Matter.Bodies.rectangle(120, cHeight, 3 / 10 * cWidth, 60, { isStatic: true }),
    Matter.Bodies.rectangle(120 + 7 / 10 * cWidth, cHeight, 4 / 10 * cWidth, 60, { isStatic: true }),
    Matter.Bodies.rectangle(0, 640, 20, cHeight + 10, { isStatic: true }),
    Matter.Bodies.rectangle(cWidth, 640, 20, cHeight + 10, { isStatic: true })
];

var homePlayers = [
    Matter.Bodies.circle(1 / 3 * cWidth - (1 / 3 * cWidth) / 2, cHeight * 2 / 3, 32, {restitution : 0.2}),
    Matter.Bodies.circle(2 / 3 * cWidth - (1 / 3 * cWidth) / 2, cHeight * 2 / 3, 32, {restitution : 0.2}),
    Matter.Bodies.circle(3 / 3 * cWidth - (1 / 3 * cWidth) / 2, cHeight * 2 / 3, 32, {restitution : 0.2}),
    Matter.Bodies.circle(2 / 3 * cWidth - (1 / 3 * cWidth) / 2, cHeight * 29 / 30, 40, {restitution : 0.2})
];


homePlayers.forEach(function (obj) {
    Matter.World.add(engine.world, [obj]);
});
walls.forEach(function (obj) {
    Matter.World.add(engine.world, [obj]);
});
Matter.World.add(engine.world, ball);


Matter.Engine.run(engine);
Matter.Render.run(render);

Matter.Events.on(render, 'afterRender', function(evt) {
    if(dragging) {
        var mousediffx = mouse.absolute.x - draggingBody.position.x;
        var mousediffy = mouse.absolute.y - draggingBody.position.y;

        var maxdiff = 50;

        if(mousediffx > maxdiff) { mousediffx = maxdiff; }
        if(mousediffx < -maxdiff) { mousediffx = -maxdiff; }
        if(mousediffy > maxdiff) { mousediffy = maxdiff; }
        if(mousediffy < -maxdiff) { mousediffy = -maxdiff; }

        console.log("diffx: " + mousediffx + " diffy: " + mousediffy);

        ctx.beginPath();
        ctx.moveTo(draggingBody.position.x, draggingBody.position.y);
        ctx.lineTo(draggingBody.position.x - mousediffx, draggingBody.position.y - mousediffy);
        ctx.stroke();

        console.log("dragging");
    }
});

draw();

function draw() {

    if(dragging) {
        
    }

    requestAnimationFrame(draw);
}
