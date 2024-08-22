const FLOOR_HEIGHT = 48;
const JUMP_FORCE = 850;
const SPEED = 480;

// initialize context
kaboom({
    background:[0,204,204]
});

// load assets
loadSprite("cat", "sprites/cat-2.png", {
    sliceX: 2, // Number of frames in the sprite sheet
    sliceY: 2, // Number of rows of frames (typically 1 for GIF-like sequences)
    anims: {
      "run": {
        from: 0,
        to: 3,
        loop: true
      },
      "jump":{
        from:3,
        to:3,
      }
    }
});

loadSprite("bird", "sprites/bird.png", {
    sliceX: 3, // Number of frames in the sprite sheet
    sliceY: 3, // Number of rows of frames (typically 1 for GIF-like sequences)
    anims: {
        "fly": {
            from: 0,
            to: 7,
            loop: true
        }
    }
});
loadSprite("dog", "sprites/dog-final.png", {
    sliceX: 3, // Number of frames in the sprite sheet
    sliceY: 4, // Number of rows of frames (typically 1 for GIF-like sequences)
    anims: {
        "chase": {
            from: 0,
            to: 11,
            loop: true
        }
    }
});
loadSprite("background", "sprites/sky.jpg");
loadSprite("cloud","sprites/cloud.png")


scene("game", () => {
    // define gravity
    setGravity(1600);
     add([
        sprite("background"),
        pos(0, 0),
        scale(width() / 120, height() / 200) // Adjust the scale as needed
      ]);  
    // add a game object to screen
    const player = add([
        // list of components
        sprite("cat"),
        pos(80, 40),
        scale(.5),
        area(),
        body(),
    ]);
    player.play('run')
    // floor
    add([
        rect(width(), FLOOR_HEIGHT),
        outline(4),
        pos(0, height()),
        anchor("botleft"),
        area(),
        body({ isStatic: true }),
        color(0, 0, 0),
    ]);

    function jump() {
        if (player.isGrounded()) {
            player.jump(JUMP_FORCE);
        }
    }

    // jump when user press space
    onKeyPress("space", jump);
    onClick(jump);

    function spawnCloud() {
        add([
            sprite('cloud'),
            area(),
            opacity(0.5),
            scale(rand(0.3 , 0.6)),
            outline(1),
            pos(width(), height() - FLOOR_HEIGHT),
            anchor("botleft"),
            move(LEFT, SPEED),
            "cloud",
        ]);
        // wait a random amount of time to spawn next tree
        wait(rand(0.5, 5), spawnCloud);

    }
    // start spawning trees
    spawnCloud();

    function flyingBird() {
        const bird = add([
            sprite("bird", { anim: "fly" }), // Use the defined animation
            scale(.15),
            pos(width(), height() - FLOOR_HEIGHT-150),
            area(),
            anchor("botleft"),
            move(LEFT, SPEED),
            "bird",
        ]);
    
        // Call flyingBird again after a random delay
        wait(rand(0, 5), flyingBird);
    }
    
    // Initial call to start spawning birds
    flyingBird();
    // spawning dogs

    function runningDogs() {
        const bird = add([
            sprite("dog", { anim: "chase" }), // Use the defined animation
            scale(1),
            pos(width(), height() - FLOOR_HEIGHT+50),
            area(),
            anchor("botleft"),
            move(LEFT, SPEED+300),
            "dog",
        ]);
    
        // Call flyingBird again after a random delay
        wait(rand(1, 2.5), runningDogs);
    }
    
    // Initial call to start spawning birds
    runningDogs();
    // lose if player collides with any game obj with tag "tree"
    player.onCollide("dog", () => {
        // go to "lose" scene and pass the score
        go("lose", score);
        burp();
        addKaboom(player.pos);
    });

    // keep track of score
    let score = 0;

    const scoreLabel = add([
        text(score),
        pos(24, 24),
    ]);
        // increment score every frame
    onUpdate(() => {
        score++;
        scoreLabel.text = score;
    });

    player.onCollide("bird",(bird) => {
        destroy(bird);
        addKaboom(bird.pos);
        score+=100;
    })
    
    

});

scene("lose", (score) => {

    add([
        sprite("cat",{anim:"run"}),
        pos(width() / 2, height() / 2 - 80),
        scale(1.5),
        anchor("center"),
    ]);

    // display score
    add([
        text("YOUR SCORE IS :" + score),
        pos(width() / 2, height() / 2 + 80),
        scale(2),
        anchor("center"),
    ]);

    add([
        text("CLICK AT SPACE TO RESART"),
        pos(width() / 2, height() / 2 + 140),
        scale(1),
        anchor("center"),
    ]);

    // go back to game with space is pressed
    onKeyPress("space", () => go("game"));
    onClick(() => go("game"));

});

go("game");

