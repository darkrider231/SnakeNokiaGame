kaboom.import();

/* Tutorial Found at: https://replit.com/talk/learn/Kaboomjs-Tutorial/129011
*/

loadSprite("border", "/border.png");

init({
  width: 600,
  height: 400,
  scale: 2,
});

scene("menu", () => {

  add([
    text("Snake Nokia Game"),
    pos(300, 80),
    color(1, 1, 0),
    scale(3),
  ]);

  add([
    rect(160, 20),
    pos(300, 180),
    "button",
    {
      clickAction: () => go('game'),
    },
  ]);

  add([
    text("Play game"),
    pos(300, 180),
    color(0, 0, 0)
  ]);

  add([
    rect(160, 20),
    pos(300, 210),
    "button",
    {
      clickAction: () => window.open('https://kaboomjs.com/', '_blank'),
    },
  ]);

  add([
    text("Learn Kaboom.js"),
    pos(300, 210),
    color(0, 0, 0)
  ]);

  action("button", b => {

    if (b.isHovered()) {
      b.use(color(1.7, 0.7, 0.7));
    } else {
      b.use(color(1, 0, 0));
    }

    if (b.isClicked()) {
      b.clickAction();
    }

  });

  add([
    text("Edited by: Grant Patterson"),
    pos(300, 300),
    color(0, 1, 0),
  ]);

  add([
    text("Instructions:" + "\n" + "\n" + "Use arrow keys to move."),
    pos(300, 350),
    color(1, 1, 0),
    scale(1)
  ])

});

scene("game", () => {
  let tails = [];
  let score = 0;
  let lastInput = Date.now();

  add([
    rect(600, 400),
    color(0, 0.3, 0),
    pos(300, 200)
  ]);

  for (let x = 0; x < 600 / 20; x++) {
    for (let y = 0; y < 400 / 20; y++) {
      if (x == 0 || y == 0 || x == (600 / 20 - 1) || y == (400 / 20 - 1)) {
        add([
          sprite("border"),
          pos(10 + 20 * x, 10 + 20 * y),
          scale(0.5),
          "wall",
        ]);
      }
    }
  }

  let head = add([
    rect(10, 10),
    pos(240, 180),
    "head",
    "right"
  ]);

  for (let i = 0; i < 3; i++) {
    tails.push({
      obj: add([
        rect(10, 10),
        pos(230 - 10 * i, 180),
        color(0.5, 0.5, 0.5),
        "tail",
        "right"
      ]),
      turns: [],
      directions: []
    });
  }

  loop(0.75 - (score * 0.01), () => {
    if (head.is("right"))
      head.pos.x += 10;
    if (head.is("left"))
      head.pos.x -= 10;
    if (head.is("down"))
      head.pos.y += 10;
    if (head.is("up"))
      head.pos.y -= 10;

    for (let t of tails) {
      if (t.turns.length > 0) {
        if (t.directions[0] === 'left' || t.directions[0] === 'right') {
          if (t.turns[0].y === t.obj.pos.y) {
            t.obj.removeTag("up");
            t.obj.removeTag("down");
            t.obj.removeTag("left");
            t.obj.removeTag("right");
            t.turns.shift();
            t.obj.addTag(t.directions.shift());
          }
        }
        if (t.directions[0] === 'up' || t.directions[0] === 'down') {
          if (t.turns[0].x === t.obj.pos.x) {
            t.obj.removeTag("up");
            t.obj.removeTag("down");
            t.obj.removeTag("left");
            t.obj.removeTag("right");
            t.turns.shift();
            t.obj.addTag(t.directions.shift());
          }
        }
      }
      if (t.obj.is("right"))
        t.obj.pos.x += 10;
      if (t.obj.is("left"))
        t.obj.pos.x -= 10;
      if (t.obj.is("down"))
        t.obj.pos.y += 10;
      if (t.obj.is("up"))
        t.obj.pos.y -= 10;
    }
  });

  const makeTurn = (d, o) => {
    if (Date.now() - lastInput > 750) {
      if (head.is(o)) return;
      else {
        let turnPos = head.pos.clone();
        for (let t of tails) {
          t.turns.push(turnPos);
          t.directions.push(d);
        }
        head.removeTag("up");
        head.removeTag("down");
        head.removeTag("left");
        head.removeTag("right");
        head.addTag(d);
      }
    }
  }

  keyPress("left", () => makeTurn("left", "right"));
  keyPress("right", () => makeTurn("right", "left"));
  keyPress("up", () => makeTurn("up", "down"));
  keyPress("down", () => makeTurn("down", "up"));

  collides("wall", "head", () => {
    go('game-over', score);
  });

  collides("head", "tail", (h, t) => {
    if (h.isOverlapped(t)) go('game-over', score);
  });

  const spawnFruit = () => {
    let x = 30 + Math.floor(Math.random() * 42) * 10;
    let y = 30 + Math.floor(Math.random() * 30) * 10;

    if (head.pos.x === x && head.pos.y === y) spawnFruit();
    else {
      add([
        rect(10, 10),
        pos(x, y),
        color(1, 0, 0),
        "fruit"
      ]);
    }
  }

  spawnFruit();

  collides("fruit", "head", (f, h) => {
    if (h.isOverlapped(f)) {
      score++;
      destroy(f);
      spawnFruit();

      let lastTail = tails[tails.length - 1];
      let lastTailPos = lastTail.obj.pos.clone();
      let lastTailDirection = lastTail.obj.is("left") ? "left" : (lastTail.obj.is("right") ? "right" : (lastTail.obj.is("up") ? "up" : "down"));

      let newX = lastTailDirection === "left" ? lastTailPos.x + 10 : (lastTailDirection === "right" ? lastTailPos.x - 10 : lastTailPos.x);
      let newY = lastTailDirection === "up" ? lastTailPos.y + 10 : (lastTailDirection === "down" ? lastTailPos.y - 10 : lastTailPos.y);

      let newTail = {
        obj: add([
          rect(10, 10),
          pos(newX, newY),
          color(0.5, 0.5, 0.5),
          "tail",
          lastTailDirection
        ]),
        turns: [...lastTail.turns],
        directions: [...lastTail.directions]
      };
      tails.push(newTail);
    }
  });

  add([
    rect(100, 20),
    pos(50, 10),
    color(0, 0, 0)
  ]);

  add([
    text(`Score: ${score}`),
    pos(50, 10),
    "score-text"
  ]);

  action("score-text", txt => {
    txt.text = `Score: ${score}`;
  });
});

scene("game-over", (score) => {
  let highScore = localStorage.highScore || score;
  if (score >= highScore)
    localStorage.highScore = score;
  highScore = localStorage.highScore;

  add([
    text("GAME OVER!!"),
    pos(240, 80),
    color(1, 0, 0),
    scale(3)
  ]);

  add([
    text("Your Score: " + score),
    pos(240, 115),
    scale(1.5)
  ]);

  add([
    text("High Score:" + highScore),
    pos(240, 135),
    scale(1.5)
  ]);

  add([
    rect(160, 20),
    pos(240, 180),
    "button"
  ]);

  add([
    text("Play Again"),
    pos(240, 180),
    color(0, 0, 0)
  ]);

  add([
    rect(160, 20),
    pos(240, 210),
    color(1.7, 0, 0),
    "button"
  ]);

  add([
    text("Main Menu"),
    pos(240, 210),
    color(0, 0, 0)
  ]);

  action("button", (b) => {
    let position = mousePos();
    if (position.x > (b.pos.x - b.width / 2) && position.x < (b.pos.x + b.width / 2) && position.y > (b.pos.y - b.height / 2) && position.y < (b.pos.y + b.height / 2))
      b.use(color(1.7, 0.7, 0.7));
    else
      b.use(color(1, 0, 0));
  });

  mouseClick(() => {
    let position = mousePos();
    if (position.x > 160 && position.x < 320 && position.y > 170 && position.y < 190) {
      go('game');
    } else if (position.x > 160 && position.x < 320 && position.y > 200 && position.y < 220) {
      go('menu');
    }
  });
});

start("menu");