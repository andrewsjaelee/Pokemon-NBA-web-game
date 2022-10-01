class Boundary {
  static width = 48;
  static height = 48;
  constructor({ position }) {
    this.position = position;
    this.width = 48;
    this.height = 48;
  }
  draw() {
    c.fillStyle = "rgba(255, 0, 0, 0.2)";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

class Sprite {
  constructor({ position, image, frames = { max: 1}, sprites }) {
    this.position = position;
    this.image = new Image();
    this.frames = { ...frames, val: 0, elapsed: 0 };
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    };
    this.image.src = image.src
    this.sprites = sprites;
    this.opacity = 1;
  }
  draw() {
    c.save();
    c.globalAlpha = this.opacity;
    c.drawImage(
      this.image,
      this.frames.val * this.width, // player animation
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max,
      this.image.height
    );
    c.restore();
    if (!this.moving) return;

    if (this.frames.max > 1) {
      this.frames.elapsed++;
    }
    if (this.frames.elapsed % 10 === 0) {
      if (this.frames.val < this.frames.max - 1) this.frames.val++;
      else this.frames.val = 0;
    }
  }
}

class Character extends Sprite {
  constructor({
    position,
    image,
    frames = { max: 1 },
    sprites,
    isEnemy = false,
    name,
    attacks,
  }) {
    super({
      position,
      image,
      frames,
      sprites,
    });
    this.health = 100;
    this.isEnemy = isEnemy;
    this.name = name;
    this.attacks = attacks
  }
  faint() {
    document.querySelector("#dialogue").innerHTML = this.name + ' got knocked out'
    gsap.to(this.position, {
        y: this.position.y + 20
    })
    gsap.to(this, {
        opacity: 0
    })
  }
  attack({ attack, target, renderedSprites }) {
    // initial variable set up
    document.querySelector("#dialogue").style.display = "block";
    document.querySelector("#dialogue").innerHTML =
      this.name + " used " + attack.name;

    const tl = gsap.timeline();
    target.health -= attack.damage;

    let movementDistance = 20;
    if (this.isEnemy) movementDistance = -20;

    let healthBar = "#enemyHealth";
    if (this.isEnemy) healthBar = "#playerHealth";

    switch (attack.name) {
      case "Shimmy":
        tl.to(this.position, {
          x: this.position.x + movementDistance,
        })
          .to(this.position, {
            x: this.position.x - movementDistance,
            yoyo: true,
            repeat: 3,
            duration: 0.1,
            onComplete: () => {
              gsap.to(healthBar, {
                width: target.health + "%",
              });

              gsap.to(target.position, {
                x: target.position.x + 5,
                yoyo: true,
                repeat: 3,
                duration: 0.08,
              });
              gsap.to(target, {
                opacity: 0,
                repeat: 3,
                yoyo: true,
                duration: 0.08,
              });
            },
          })
          .to(this.position, {
            y: this.position.y,
          });
        break;
      case "Pull up 3":
        const basketballImage = new Image();
        basketballImage.src = "./game_assets/img/basketball.png";
        const basketball = new Sprite({
          position: {
            x: this.position.x + 140,
            y: this.position.y,
          },
          image: basketballImage,
        });
        renderedSprites.splice(1, 0, basketball);

        // tl.to(basketball.position, {
        //     x: target.position.x,
        //     y: target.position.y,
        //     onComplete: () => {
        //         renderedSprites.pop()
        //     }
        // })

        tl.to(this.position, {
          y: this.position.y + movementDistance,
        })
          .to(this.position, {
            y: this.position.y - movementDistance * 2,
            onComplete: () => {
              gsap.to(basketball.position, {
                x: target.position.x,
                y: target.position.y,
                onComplete: () => {
                  renderedSprites.splice(1, 1),
                    gsap.to(healthBar, {
                      delay: 1,
                      width: target.health + "%",
                    });
                },
              });

              gsap.to(target.position, {
                delay: 1,
                x: target.position.x + 5,
                yoyo: true,
                repeat: 3,
                duration: 0.08,
              });
              gsap.to(target, {
                delay: 1,
                opacity: 0,
                repeat: 3,
                yoyo: true,
                duration: 0.08,
              });
            },
          })
          .to(this.position, {
            y: this.position.y,
          });
        break;
    }
  }
}
