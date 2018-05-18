import React from "react";
import { StyleSheet, View } from "react-native";
import Files from "./Files";
import * as THREE from "three"; // 0.88.0
import { Group, Node, Sprite, SpriteView } from "./GameKit";
import {Text} from 'react-native';

const SPEED = 1.6;
const GRAVITY = 1100;
const FLAP = 320;
const SPAWN_RATE = 2600;
const OPENING = 120;
const GROUND_HEIGHT = 64;

export default class Game extends React.Component {

  gameStarted = false;
  pipes = new Group();
  deadPipeTops = [];
  deadPipeBottoms = [];
  gameOver = false;
  velocity = 0;
  state = {
    score: 0
  };
  
  setupPipe = async ({ key, y }) => {
    const size = {
      width: 52,
      height: 320,
    };
  
    // 1
    const tbs = {
      top: Files.sprites.rocket_top,
      bottom: Files.sprites.rocket_bottom,
    };
    const pipe = await this.setupStaticNode({
      image: tbs[key],
      size,
      name: key,
    });
    // 2
    pipe.size = size;
    pipe.y = y;
  
    return pipe;
  };

  spawnPipe = async (openPos, flipped) => {
    // 1
    let pipeY;
    if (flipped) {
      pipeY = Math.floor(openPos - OPENING / 2 - 320);
    } else {
      pipeY = Math.floor(openPos + OPENING / 2);
    }
    // 2
    let pipeKey = flipped ? 'bottom' : 'top';
    let pipe;
  
    // 3
    const end = this.scene.bounds.right + 26;
    // 4
    if (this.deadPipeTops.length > 0 && pipeKey === 'top') {
      pipe = this.deadPipeTops.pop().revive();
      pipe.reset(end, pipeY);
    } else if (this.deadPipeBottoms.length > 0 && pipeKey === 'bottom') {
      pipe = this.deadPipeBottoms.pop().revive();
      pipe.reset(end, pipeY);
    } else {
      // 5
      pipe = await this.setupPipe({
        y: pipeY,
        key: pipeKey,
      });
      pipe.x = end;
      this.pipes.add(pipe);
    }
    // Set the pipes velocity so it knows how fast to go
    pipe.velocity = -SPEED;
    return pipe;
  };
  
  spawnPipes = () => {
    this.pipes.forEachAlive(pipe => {
      // 1
      if (pipe.size && pipe.x + pipe.size.width < this.scene.bounds.left) {
        if (pipe.name === 'top') {
          this.deadPipeTops.push(pipe.kill());
        }
        if (pipe.name === 'bottom') {
          this.deadPipeBottoms.push(pipe.kill());
        }
      }
    });

    // 2
    const pipeY =
      this.scene.size.height / 2 +
      (Math.random() - 0.5) * this.scene.size.height * 0.2;
    // 3
    this.spawnPipe(pipeY);
    this.spawnPipe(pipeY, true);
  };

  componentWillMount() {
    this.setupAudio();
  };

  setupAudio = async () => {
    // 2
    Expo.Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        interruptionModeIOS: Expo.Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Expo.Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX
    });


    // 3
    this.audio = {};
    Object.keys(Files.audio).map(async key => {
        const res = Files.audio[key];
        const { sound } = await Expo.Audio.Sound.create(res);
        await sound.setStatusAsync({
            volume: 1
        });
        this.audio[key] = async () => {
            // 4
            try {
                await sound.setPositionAsync(0);
                await sound.playAsync();
            } catch (error) {
                console.warn("sound error", { error });
                // An error occurred!
            }
        };
    });
};

  onSetup = async ({ scene }) => {
    // Give us global reference to the scene
    this.scene = scene;
    this.scene.add(this.pipes);
    await this.setupBackground();
    await this.setupPlayer();
    // 1
    await this.setupGround();
    this.reset();
  };

  setupGround = async () => {
    const { scene } = this;
    const size = {
        width: scene.size.width,
        height: scene.size.width * 0.333333333
    };
    this.groundNode = new Group();

    // 2
    const node = await this.setupStaticNode({
        image: Files.sprites.surface,
        size,
        name: "ground"
    });

    const nodeB = await this.setupStaticNode({
        image: Files.sprites.surface,
        size,
        name: "ground"
    });
    nodeB.x = size.width;

    this.groundNode.add(node);
    this.groundNode.add(nodeB);

    // 3
    this.groundNode.position.y =
    (scene.size.height + (size.height - GROUND_HEIGHT)) * -0.5;

    // 4
    this.groundNode.top = this.groundNode.position.y + size.height / 2;

    this.groundNode.position.z = 0.01;
    scene.add(this.groundNode);
  };

  setupBackground = async () => {
    // 1
  const { scene } = this;
  const { size } = scene;
  // 2
  const bg = await this.setupStaticNode({
    image: Files.sprites.space,
    size,
    name: 'bg',
  });
  // 3
  scene.add(bg);
  };

  setupPlayer = async () => {
    // 1
    const size = {
      width: 26,
      height: 36
    };

    // 2
    const sprite = new Sprite();
    await sprite.setup({
        image: Files.sprites.andreB,
        tilesHoriz: 1,
        tilesVert: 1,
        numTiles: 1,
        tileDispDuration: 75,
        size
    });

    // 3
    this.player = new Node({
        sprite
    });
    this.scene.add(this.player);
  };

  setupStaticNode = async ({ image, size, name }) => {
    // 1
    const sprite = new Sprite();
  
    await sprite.setup({
      image,
      size,
    });
  
    // 2
    const node = new Node({
      sprite,
    });
    node.name = name;
  
    return node;
  };

  addScore = () => {
    this.setState({ score: this.state.score + 1 });
    this.audio.point();
  }

  setGameOver = () => {
    this.gameOver = true;

    clearInterval(this.pillarInterval);

    this.audio.hit();
  };

  updateGame = delta => {
    if (this.gameStarted) {
      this.velocity -= GRAVITY * delta;
      const target = this.groundNode.top;

      if (!this.gameOver) {
        const playerBox = new THREE.Box3().setFromObject(this.player);

        //@(Evan Bacon) Here we iterate over all of the active pipes and move them to the left.
        this.pipes.forEachAlive(pipe => {
          pipe.x += pipe.velocity;
          const pipeBox = new THREE.Box3().setFromObject(pipe);

          //@(Evan Bacon) We check if the user collided with any of the pipes.
          if (pipeBox.intersectsBox(playerBox)) {
            this.setGameOver();
          }

          //@(Evan Bacon) We check to see if a user has passed a pipe, if so then we update the score!
          if (
            pipe.name === 'bottom' &&
            !pipe.passed &&
            pipe.x < this.player.x
          ) {
            pipe.passed = true;
            this.addScore();
          }
        });

        //@(Evan Bacon) Here we set the player rotation (in radians). Notice how we clamp it with min/max.
        this.player.angle = Math.min(
          Math.PI / 4,
          Math.max(-Math.PI / 2, (FLAP + this.velocity) / FLAP)
        );

        //@(Evan Bacon) Check to see if the user's y position is lower than the floor, if so then we end the game.
        if (this.player.y <= target) {
          this.setGameOver();
        }
        //@(Evan Bacon) Update the player sprite animation.
        this.player.update(delta);
      }

      //@(Evan Bacon) If the game is over than let the player continue to fall until they hit the floor.
      if (this.player.y <= target) {
        this.player.angle = -Math.PI / 2;
        this.player.y = target;
        this.velocity = 0;
      } else {
        this.player.y += this.velocity * delta;
      }
    } else {
      //@(Evan Bacon) This is the dope bobbing bird animation before we start. Notice the cool use of Math.cos
      this.player.update(delta);
      this.player.y = 8 * Math.cos(Date.now() / 200);
      this.player.angle = 0;
    }

    if (!this.gameOver) {
      //@(Evan Bacon) This is where we do the floor looping animation
      this.groundNode.children.map((node, index) => {
        node.x -= SPEED;
        //@(Evan Bacon) If the floor component is off screen then get the next item and move it behind that.
        if (node.x < this.scene.size.width * -1) {
          let nextIndex = index + 1;
          if (nextIndex === this.groundNode.children.length) {
            nextIndex = 0;
          }
          const nextNode = this.groundNode.children[nextIndex];
          node.x = nextNode.x + this.scene.size.width - 1.55;
        }
      });
    }
  };

  reset = () => {
    this.gameStarted = false;
    this.gameOver = false;
    this.setState({ score: 0 });
    
    this.player.reset(this.scene.size.width * -0.3, 0);
    this.player.angle = 0;
    this.pipes.removeAll();
    };

    tap = () => {
      // @(Evan Bacon) on the first tap we start the game
      if (!this.gameStarted) {
        this.gameStarted = true;
        // @(Evan Bacon) here we build a timer to spawn pipes
        this.pillarInterval = setInterval(this.spawnPipes, SPAWN_RATE);
      }
  
      if (!this.gameOver) {
        // @(Evan Bacon) These are in-game taps for making the bird flap
        this.velocity = FLAP;
        this.audio.wing();
      } else {
        // @(Evan Bacon) This is an end-game tap to reset the game
        this.reset();
      }
    };

  renderScore = () => (
    <Text
        style={{
            textAlign: "center",
            fontSize: 64,
            position: "absolute",
            left: 0,
            right: 0,
            color: "white",
            top: 64,
            backgroundColor: "transparent"
        }}>
    {this.state.score}
    </Text>
  );

  

  render() {
    // 3
    return (
      <View style={StyleSheet.absoluteFill}>
          <SpriteView
          touchDown={({ x, y }) => this.tap()}
          touchMoved={({ x, y }) => {}}
          touchUp={({ x, y }) => {}}
          update={this.updateGame}
          onSetup={this.onSetup}
          />
          {this.renderScore()}
      </View>
  );
  }
}


