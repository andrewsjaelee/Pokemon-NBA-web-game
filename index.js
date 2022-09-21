const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const collisionMap = [];
for (let i = 0; i < collisionData.length; i += 70) {
  collisionMap.push(collisionData.slice(i, 70 + i));
}

const zoneMap = [];
for (let i = 0; i < zoneData.length; i += 70) {
  zoneMap.push(zoneData.slice(i, 70 + i));
}
const offset = {
  x: -590,
  y: -580,
};

const boundaries = [];
collisionMap.forEach((row, i) => {
  row.forEach((border, j) => {
    if (border === 1026)
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
  });
});

const zones = [];
zoneMap.forEach((row, i) => {
  row.forEach((border, j) => {
    if (border === 1026)
      zones.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
  });
});

const image = new Image();
image.src = "./game_assets/gamemap.png";

const playerDownImage = new Image();
playerDownImage.src = "./game_assets/img/playerDown.png";

const playerUpImage = new Image();
playerUpImage.src = "./game_assets/img/playerUp.png";

const playerLeftImage = new Image();
playerLeftImage.src = "./game_assets/img/playerLeft.png";

const playerRightImage = new Image();
playerRightImage.src = "./game_assets/img/playerRight.png";

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2,
    y: canvas.height / 2 - 68 / 2,
  },
  image: playerDownImage,
  frames: {
    max: 4,
  },
  sprites: {
    up: playerUpImage,
    left: playerLeftImage,
    right: playerRightImage,
    down: playerDownImage,
  },
});

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: image,
});

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

const movables = [background, ...boundaries, ...zones];

function rectangeCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  );
}

const game = {
    initiated: false
}

// the starting point in the game
function animate() {
  const animation = window.requestAnimationFrame(animate);
  background.draw();
  boundaries.forEach((boundary) => {
    boundary.draw();
  });
  zones.forEach((playZone) => {
    playZone.draw();
  });
  player.draw();

  // stops the player from moving after entering game
  let moving = true; 
  player.moving = false;

  if (game.initiated) return
  // activating the battle/game
  if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
    for (let i = 0; i < zones.length; i++) {
      const zone = zones[i];
      const overlappingArea =
        (Math.min(
          player.position.x + player.width,
          zone.position.x + zone.width
        ) -
          Math.max(player.position.x, zone.position.x)) *
        (Math.min(
          player.position.y + player.height,
          zone.position.y + zone.height
        ) -
          Math.max(player.position.y, zone.position.y));
      if (
        rectangeCollision({
          rectangle1: player,
          rectangle2: zone,
        }) &&
        overlappingArea > (player.width * player.height) / 2 &&
        Math.random() < 0.03
      ) {
        console.log("basketball time!!!");

        // deactivate animation loop
        window.cancelAnimationFrame(animation);
        game.initiated = true
        gsap.to('#overlap', {
            opacity: 1,
            repeat: 3,
            yoyo: true,
            duration: 0.4,
            onComplete() {
                gsap.to('#overlap', {
                    opacity: 1,
                    duration: 0.4,
                    onComplete() {
                        // start the animation and enter the arena
                        startGame()
                        animateGame()
                        gsap.to('#overlap', {
                            opacity: 0,
                            duration: 0.4,
                        })
                    }
                })
            }
        })
        break;
      }
    }
  }

  if (keys.w.pressed && lastKey === "w") {
    player.moving = true;
    player.image = player.sprites.up;
    // for collision borders
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangeCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + 3,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.y += 3;
      });
  } else if (keys.a.pressed && lastKey === "a") {
    player.moving = true;
    player.image = player.sprites.left;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangeCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x + 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movable) => {
        movable.position.x += 3;
      });
  } else if (keys.s.pressed && lastKey === "s") {
    player.moving = true;
    player.image = player.sprites.down;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangeCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - 3,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movable) => {
        movable.position.y -= 3;
      });
  } else if (keys.d.pressed && lastKey === "d") {
    player.moving = true;
    player.image = player.sprites.right;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangeCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x - 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movable) => {
        movable.position.x -= 3;
      });
  }
}

let lastKey = "";
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = true;
      lastKey = "w";
      break;
    case "a":
      keys.a.pressed = true;
      lastKey = "a";
      break;
    case "s":
      keys.s.pressed = true;
      lastKey = "s";
      break;
    case "d":
      keys.d.pressed = true;
      lastKey = "d";
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
  }
});
