const characters = {
    enemy: {
        position: {
            x: 700,
            y: 140
        },
        image: {
            src: './game_assets/img/lebron_better.png'
        },
        moving: true,
        isEnemy: true,
        name: 'LeGM',
        attacks: [attacks.Shimmy, attacks["Pull up 3"]]
    },
    steph: {
        position: {
            x: 200,
            y: 160 
        },
        image: {
            src: './game_assets/img/steph_better.png'
        },
        moving: true,
        name: 'Stephanie Biryani',
        attacks: [attacks["Pull up 3"], attacks.Shimmy]
    }
}