

const canvas = document.getElementById("canvasz");
const c = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight-50;
addEventListener("keydown", ({ key }) => {
    if (game.over) return
    switch (key) {
        case "ArrowLeft":
            keys.a.pressed = true;
            break;
        case "ArrowRight":
            keys.d.pressed = true;
            break;
        case " ":
            keys.Space.pressed = true;
            shoot.play();
            projectiles.push(
                new Projectile({
                    position: {
                        x: player.position.x + player.width / 2 - 2,
                        y: player.position.y - 30,
                    },
                    velocity: {
                        x: 0,
                        y: -12,
                    },
                })
            );
            break;
    }
});
addEventListener("keyup", ({ key }) => {
    switch (key) {
        case "ArrowLeft":
            keys.a.pressed = false;
            break;
        case "ArrowRight":
            keys.d.pressed = false;
            break;
        case " ":
            keys.Space.pressed = false;
            break;
    }
});
class Projectile {
    constructor({ position, velocity }) {
        this.width = 5;
        this.height = 21;
        this.position = position;
        this.velocity = velocity;
    }
    draw() {
        c.fillStyle = "rgb(251, 111, 144)";
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
    update() {
        this.draw();
        // this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}
class Particle {
    colors = [
        "rgb(239, 78, 239)",
        "rgb(239, 78, 115)",
        "rgb(132, 216, 251)"
    ]
    constructor({ position, velocity, radius }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = radius;
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
        this.opacity = 1;
    }
    draw() {
        c.save();
        c.globalAlpha = this.opacity;
        c.beginPath();
        c.fillStyle = this.color;
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fill();
        c.closePath();
        c.restore();
    }
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.opacity -= 0.01;
    }
}
class SquareParticle {
    colors2 = [
        "rgb(250, 46, 100)",
        "rgb(245, 182, 203)"

    ]
    constructor({ position, velocity, width, height }) {
        this.position = position;
        this.velocity = velocity;
        this.width = width;
        this.height = height;
        this.color = this.colors2[Math.floor(Math.random() * this.colors2.length)];
        this.opacity = 1;
    }
    draw() {
        c.save();
        c.globalAlpha = this.opacity;
        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
        c.restore();
    }
    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.opacity -= 0.01;
    }
}
class InvaderProjectile {
    color4 = [
        "rgb(242, 243, 242)",//white
        "rgb(78, 231, 101)",//green
        "rgb(26, 255, 202)"//blue
    ]
    constructor({ position, velocity }) {
        this.width = 12;
        this.height = 25;
        this.position = position;
        this.velocity = velocity;
        this.color = this.color4[Math.floor(Math.random() * this.color4.length)];

    }
    draw() {
        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
    update() {
        this.draw();
        // this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}
class Player {
    constructor() {
        this.width = 60;
        this.height = 60;
        this.position = {
            x: canvas.width / 2 - this.width,
            y: canvas.height - this.height - 6,
        };
        this.velocity = {
            x: 0,
            y: 0,
        };
        this.rotation = 0;
        this.opacity = 1;
    }
    draw() {
        c.save();
        c.globalAlpha = this.opacity
        c.translate(
            this.position.x + this.width / 2,
            this.position.y + this.height / 2
        );
        c.rotate(this.rotation);
        c.translate(
            -this.position.x - this.width / 2,
            -this.position.y - this.height / 2
        );
        c.strokeStyle = "rgb(229, 37, 110)";
        c.strokeRect(this.position.x, this.position.y, this.width, this.height);
        c.fillStyle = "rgb(22, 22, 22)";
        c.fillRect(this.position.x, this.position.y, this.width, this.height);

        c.restore();

        // c.shadowBlur = 465;
        c.shadowColor = "#d53";
        c.lineWidth = 7;


    }
    update() {
        this.draw();
        this.position.x += this.velocity.x;
    }
}
class Invader {
    constructor({ position }) {
        this.velocity = {
            x: 0,
            y: 0,
        };
        const image = new Image();
        image.src = "images/ghostinvader4.png";
        image.onload = () => {
            // const scale = 1.5;
            this.image = image;
            this.width = image.width;
            this.height = image.height;
            this.position = {
                x: position.x,
                y: position.y,
            };
        };
    }
    draw() {
        c.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
    }
    update({ velocity }) {
        if (this.image) {
            this.draw();
            this.position.x += velocity.x;
            this.position.y += velocity.y;
        }
    }
    shoot(invaderProjectiles) {
        invaderProjectiles.push(
            new InvaderProjectile({
                position: {
                    x: this.position.x + this.width / 2,
                    y: this.position.y + this.height,
                },
                velocity: {
                    x: 0,
                    y: 5,
                },
            })
        );
    }
}
class Grid {
    constructor() {
        this.position = {
            x: 0,
            y: 0,
        };
        this.velocity = {
            x: 2,
            y: 0,
        };
        this.invaders = [];
        const columns = Math.floor(Math.random() * 3 + 16);
        const rows = Math.floor(Math.random() * 2 + 1);
        this.width = columns * 70;
        for (let i = 0; i <= columns; i++) {
            //columns
            for (let j = 0; j <= rows; j++) {
                //rows
                this.invaders.push(
                    new Invader({
                        position: {
                            x: i * 70,
                            y: j * 77,
                        },
                    })
                );
            }
        }
    }
    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.velocity.y = 0;
        if (
            this.position.x + this.width >= canvas.width - 70 ||
            this.position.x < 0
        ) {
            this.velocity.x = -this.velocity.x;
            this.velocity.y += 25;
        }
    }
}
let keys = {
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
    Space: {
        pressed: false,
    },
};
let player = new Player();
let projectiles = [];
let grids = [];
let invaderProjectiles = [];
let particles = [];
let particles2 = [];
let frames = 0;
let randominterval = Math.floor(Math.random() * 400 + 300);
let randombullet = Math.floor(Math.random() * 20 + 25);
let game = {
    over: false
}
let shoot = new Audio("audio/sh.wav");
let explosion = new Audio("audio/explosions.mp3");
let explosionpl = new Audio("audio/playerex.wav");
function Restart() {
    player = new Player();
    projectiles = [];
    grids = [];
    invaderProjectiles = [];
    particles = [];
    particles2 = [];
    frames = 0;
    randominterval = Math.floor(Math.random() * 400 + 300);
    randombullet = Math.floor(Math.random() * 20 + 25);
    game = {
        over: false
    }
 
}



function createcircleparticles({ object }) { //Circle particles
    for (let i = 0; i <= 20; i++) {
        particles.push(
            new Particle({
                position: {
                    x: object.position.x + object.width / 2,
                    y: object.position.y + object.height / 2,
                },
                velocity: {
                    x: (Math.random() - 0.5) * 7,
                    y: (Math.random() - 0.5) * 5
                },
                radius: Math.random() * 3 + 5

            })
        );
    }
}
//Square particles
function createsquareparticle({ object }) {
    for (let i = 0; i <= 60; i++) {
        particles2.push(
            new SquareParticle({
                position: {
                    x: object.position.x + object.width / 2,
                    y: object.position.y + object.height / 2,
                },
                velocity: {
                    x: (Math.random() - 0.5) * 5,
                    y: (Math.random() - 0.5) * 5
                },
                width: Math.random() * 5 + 10,
                height: Math.random() * 5 + 10,

            })
        );
    }
}

function animate() {

    c.clearRect(0, 0, canvas.width, canvas.height);
    requestAnimationFrame(animate);
    c.fillStyle = "rgb(22, 22, 22)";
    c.fillRect(0, 0, canvas.width, canvas.height);
    //player update//
    player.update();
    // invader shooting//
    particles.forEach((particle, particlesplice) => {
        if (particle.opacity <= 0) {
            setTimeout(() => {
                particles.splice(particlesplice, 1)
            }, 0)
        }
        else {
            particle.update();
        }
    });
    particles2.forEach((particle2, particlesplice2) => {
        if (particle2.opacity <= 0) {
            setTimeout(() => {
                particles2.splice(particlesplice2, 1)
            }, 0)
        }
        else {
            particle2.update();
        }
    });

    invaderProjectiles.forEach((invaderProjectile, ip) => {
        if (
            invaderProjectile.position.y + invaderProjectile.height >=
            canvas.height
        ) {
            setTimeout(() => {
                invaderProjectiles.splice(ip, 1);
            }, 0);
        } else {
            invaderProjectile.update();
        }
        //bullet hit player
        if (
            invaderProjectile.position.y + invaderProjectile.height >=
            player.position.y &&
            invaderProjectile.position.x + invaderProjectile.width >=
            player.position.x &&
            invaderProjectile.position.x <= player.position.x + player.width
        ) {
            explosionpl.play();
            setTimeout(() => {
                invaderProjectiles.splice(ip, 1);
                player.opacity = 0;
                game.over = true;
            }, 0);
            setTimeout(() => {
                alert("you lose")
            }, 1400)
            createsquareparticle({ object: player });
            setTimeout(() => {
                Restart();
            }, 1800)

        }
    });

    //grid and invader
    grids.forEach((grid, gi) => {
        grid.update();
        if (frames % randombullet === 0 && grid.invaders.length > 0) {
            grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(
                invaderProjectiles
            );
        }

        grid.invaders.forEach((invader, i) => {
           
            invader.update({ velocity: grid.velocity });
            if (invader.position.y  >= canvas.height) {
                setTimeout(() => {
                    game.over = true;
                }, 0);
                setTimeout(() => {
                    Restart();
                }, 300)
            }
            //bullet hit invader
            projectiles.forEach((projectile, p) => {
                if (
                    projectile.position.y <= invader.position.y + invader.height &&
                    projectile.position.x + projectile.width >= invader.position.x &&
                    projectile.position.x <= invader.position.x + invader.width
                ) {

                    explosion.play();
                    setTimeout(() => {
                        const invaderfound = grid.invaders.find(
                            (invader2) => invader2 === invader
                        );
                        const projectilefound = projectiles.find(
                            (projectile2) => projectile2 === projectile
                        );
                        //projectile and invader spliced
                        if (invaderfound && projectilefound) {
                            createcircleparticles({ object: invader });
                            grid.invaders.splice(i, 1);
                            projectiles.splice(p, 1);
                            if (grid.invaders.length > 0) {
                                const firstin = grid.invaders[0];
                                const lastin = grid.invaders[grid.invaders.length - 1];
                                grid.width = lastin.position.x - firstin.position.x - 50;
                                grid.position.x = firstin.position.x;
                            } else {
                                grids.splice(gi, 1);
                            }
                        }
                    }, 0);
                }
            });

        });
    });
    //player movement//
    if (keys.a.pressed && player.position.x > 0) {
        player.velocity.x = -10;
        player.rotation = -0.18;
    } else if (
        keys.d.pressed &&
        player.position.x + player.width < canvas.width
    ) {
        player.velocity.x = 10;
        player.rotation = 0.18;
    } else {
        player.velocity.x = 0;
        player.rotation = 0;
    }



    //Calling projectile//
    projectiles.forEach((projectile, pi) => {
        if (projectile.position.y + projectile.width < 0) {
            setTimeout(() => {
                projectiles.splice(pi, 1);
            }, 0);
        } else {
            projectile.update();
        }
    });
    if (frames % randominterval === 0) {
        grids.push(new Grid());
        randominterval = Math.floor(Math.random() * 400 + 300);
        frames = 0;
    }
    //spawn projectle

    frames++;
}

animate();


