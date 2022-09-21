const arenaImage = new Image();
arenaImage.src = './game_assets/img/arena.png'
const arenaBackground = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    image: arenaImage
})

let enemy
let steph
let renderedSprites
let queue
let gameAnimation

function startGame() {
    document.querySelector('#interface').style.display = 'block'
    document.querySelector('#dialogue').style.display = 'none'
    document.querySelector('#enemyHealth').style.width = '100%'
    document.querySelector('#playerHealth').style.width = '100%'
    document.querySelector('#attackBox').replaceChildren()

    enemy = new Character(characters.enemy)
    steph = new Character(characters.steph)
    renderedSprites = [enemy, steph]
    queue = []

    steph.attacks.forEach(attack => {
        const button = document.createElement('button')
        button.innerHTML = attack.name 
        document.querySelector('#attackBox').append(button)
    })

    // event listeners for attacks
    document.querySelectorAll('button').forEach((button) => {
        button.addEventListener('click', (e) => {
            const selectedAttack = attacks[e.currentTarget.innerHTML];
            steph.attack({
                attack: selectedAttack,
                target: enemy,
                renderedSprites
            })

            if (enemy.health <= 0) {
                queue.push(() => {
                    enemy.faint()
                })
                queue.push(() => {
                    gsap.to('#overlap', {
                        opacity: 1,
                        onComplete: () => {
                            cancelAnimationFrame(gameAnimation)
                            animate()
                            document.querySelector('#interface').style.display = 'none'
                            gsap.to('#overlap', {
                                opacity: 0
                            })
                            game.initiated = false
                        }
                    })
                })
            }

            const randomAttack = enemy.attacks[Math.floor(Math.random() * enemy.attacks.length)]

            queue.push(() => {
                enemy.attack({
                    attack: randomAttack,
                    target: steph,
                    renderedSprites
                })
                if (steph.health <= 0) {
                    queue.push(() => {
                        steph.faint()
                    })
                    queue.push(() => {
                        gsap.to('#overlap', {
                            opacity: 1,
                            onComplete: () => {
                                cancelAnimationFrame(gameAnimation)
                                animate()
                                document.querySelector('#interface').style.display = 'none'
                                gsap.to('#overlap', {
                                    opacity: 0
                                })
                                game.initiated = false
                            }
                        })
                    })
                }
            })
        })
        button.addEventListener('mouseenter', (e) => {
            const selectedAttack = attacks[e.currentTarget.innerHTML];
            document.querySelector('#attackType').innerHTML = selectedAttack.type
            document.querySelector('#attackType').style.color = selectedAttack.color
        })
    })
}

function animateGame() {
    gameAnimation = window.requestAnimationFrame(animateGame)
    arenaBackground.draw()
    renderedSprites.forEach(sprite => {
        sprite.draw()
    })
}

animate()
// startGame()
// animateGame()

document.querySelector('#dialogue').addEventListener('click', (e) => {
    if (queue.length > 0) {
        queue[0]()
        queue.shift()
    } else e.currentTarget.style.display = 'none'
})