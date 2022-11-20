/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GameStates = exports.fixedTimeMS = exports.fixedTime = void 0;
/**
 * 2017-08-29
 * -First.
 * -Player,States,Input,PlayerInputGraphics,PlayerGraphics
 * -Player moving, jumping etc
 * -Pretty much copied whatever is relevant from beatemup.
 *
 * 2017-08-30
 * -Made a tiled map. A screen is 16 tiles wide and 15 tiles high (16 x 15).
 *
 * 2017-08-31
 * -Did a lot.
 *
 * 2017-09-01
 * -The tile sprites are 16 by 16. A screen consists of 16 tiles horizontally and 15 tiles vertically. This means
 *      the screen is 256 x 240. The screen is small.
 * -CSS controls the size of the canvas through max-width and max-height properties. The game is still 256 x 240 but
 *      the screen scale is set to SHOW_ALL to expand the overall size yet keep the same "aspect ratio" or some shit.
 * -Animations are annoying as fuck to get right.
 *
 * 2017-09-03
 * -Using a Phaser.Rectangle for hitbox. Phaser.Sprite is too heavy.
 *
 * 2017-09-04
 * -Rooms!
 *
 * 2017-09-05
 * -Player now goes into fall anim when falling.
 * -Resized jump sprite.
 * -Tested vertical levels 480 px or more. Up and down.
 * -Added mega man blinking animation during idle.
 * -Timer to allow player to jump when walking off the ground.
 * -Added correct mega-man jumping logic.
 * -Player must be close to ladder to get on.
 * -Added met and met bullet.
 * -(my)world now creates entityManager and collisionManager - access managers from (my)world
 * -enemies/Tiled redesigned to use enemy spawners - enemies spawn from spawners instead of just being created outright
 *      the nature of mega man dictates this is needed because of the way enemies respawn when culled by the camera
 *      basically, you can infinitely respawn enemies if you move the camera off their spawn point and then move it back
 *      we need to keep track of the camera and enemy spawners to determine when to spawn enemies and when not to.
 *
 * 2017-09-05
 * -I am moving my todo's and done's to Trello. I've had it for a long time and keep forgetting to use it!
 * -Fixed determining if spawner is within camera view - all spawners are 32x32 large.
 * -Now able to set initial camera position.
 * -Refactored how entities are created - entities created only by EntityManager, send signals to let world know to create
 *      entities. Entity now takes world instead of EntityManager and CollisionManager, since world has both.
 *
 * 2017-09-06
 * -Added sliding.
 *
 * 2017-09-07
 * -Added spike entity.
 *
 * 2017-09-08
 * -Mega Man death effect.
 *
 * TODO: Fix: GutsMan doors graphics do not animate
 * TODO: Fix: When defeating GutsMan the game doesnt go to stage select ('freeze')
 * TODO: Fix: FireMan stage doesnt start
 * TODO: Fix: ElecMan stage doesnt start
 * TODO: Make debug keys global; can be used in any screen/state (like reset to stage select)
 * TODO: Is there a key to reset the save state for defeated bosses?
 * TODO: Show hotkey legend in HTML.
 */
const boot_1 = __webpack_require__(1);
const title_1 = __webpack_require__(8);
const stageSelect_1 = __webpack_require__(9);
const game_1 = __webpack_require__(12);
exports.fixedTime = (1 / 60);
exports.fixedTimeMS = (1 / 60) * 1000;
var GameStates;
(function (GameStates) {
    GameStates["Boot"] = "boot";
    GameStates["Title"] = "title";
    GameStates["StageSelect"] = "stageSelect";
    GameStates["Game"] = "game";
})(GameStates = exports.GameStates || (exports.GameStates = {}));
class Main extends Phaser.Game {
    constructor(config) {
        super(config);
        // console.log('fuck');
        this.state.add(GameStates.Boot, boot_1.Boot);
        this.state.add(GameStates.Title, title_1.Title);
        this.state.add(GameStates.StageSelect, stageSelect_1.StageSelect);
        this.state.add(GameStates.Game, game_1.Game);
        this.state.start(GameStates.Boot);
    }
}
window.onload = () => {
    let config = {
        width: 256,
        height: 240,
        renderer: Phaser.AUTO,
        parent: 'content',
        antialias: false,
        transparent: false,
    };
    let m = new Main(config);
};


/***/ }),
/* 1 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Boot = void 0;
const konstants_1 = __webpack_require__(2);
const main_1 = __webpack_require__(0);
const saveGame_1 = __webpack_require__(3);
const debug_1 = __webpack_require__(5);
const gameData_1 = __webpack_require__(6);
const levelManager_1 = __webpack_require__(7);
class Boot extends Phaser.State {
    init() {
        console.log("Boot::init()");
    }
    preload() {
        console.log("Boot::preload()");
        //******************************
        // STAGE SELECT & TITLE
        //******************************
        // title_screen
        this.load.json('title_screen', 'assets/data/title_screen.json');
        // cut_man
        this.load.atlasJSONHash(konstants_1.SpriteSheets.stage_select_and_title, 'assets/stage_select_and_title_screen/stage_select_and_title.png', 'assets/stage_select_and_title_screen/stage_select_and_title.json');
        // player
        this.load.atlasJSONHash(konstants_1.Konstants.mega_man, 'assets/mega_man.png', 'assets/mega_man.json');
        // lemon
        this.load.image(konstants_1.Konstants.lemon, 'assets/lemon.png');
        // standard bullet
        this.load.image(konstants_1.EntityType.bullet, 'assets/enemies/bullet/bullet.png');
        // rolling_cutter
        this.load.image(konstants_1.Konstants.rolling_cutter, 'assets/rolling_cutter.png');
        // blader
        this.load.atlasJSONHash(konstants_1.EntityType.blader, 'assets/enemies/blader.png', 'assets/enemies/blader.json');
        // met
        this.load.atlasJSONHash(konstants_1.EntityType.met, 'assets/enemies/met.png', 'assets/enemies/met.json');
        // beak
        this.load.atlasJSONHash(konstants_1.EntityType.beak, 'assets/enemies/beak.png', 'assets/enemies/beak.json');
        // beak
        this.load.atlasJSONHash(konstants_1.Konstants.sniper_joe, 'assets/enemies/sniper_joe.png', 'assets/enemies/sniper_joe.json');
        // bombomb
        this.load.atlasJSONHash(konstants_1.EntityType.bombomb, 'assets/enemies/bombomb.png', 'assets/enemies/bombomb.json');
        // spine
        this.load.atlasJSONHash(konstants_1.EntityType.spine, 'assets/enemies/spine.png', 'assets/enemies/spine.json');
        // octopus_battery
        this.load.atlasJSONHash(konstants_1.EntityType.octopus_battery, 'assets/enemies/octopus_battery.png', 'assets/enemies/octopus_battery.json');
        // killer_bullet
        this.load.atlasJSONHash(konstants_1.EntityType.killer_bullet, 'assets/enemies/killer_bullet.png', 'assets/enemies/killer_bullet.json');
        // explosion (from killer_bullet)
        this.load.atlasJSONHash(konstants_1.EntityType.explosion_from_killer_bullet, 'assets/enemies/explosion.png', 'assets/enemies/explosion.json');
        // big_eye
        this.load.atlasJSONHash(konstants_1.EntityType.big_eye, 'assets/enemies/big_eye.png', 'assets/enemies/big_eye.json');
        // peng
        this.load.atlasJSONHash(konstants_1.EntityType.peng, 'assets/enemies/peng.png', 'assets/enemies/peng.json');
        // screw_bomber
        this.load.atlasJSONHash(konstants_1.EntityType.screw_bomber, 'assets/enemies/screw_bomber.png', 'assets/enemies/screw_bomber.json');
        // super_cutter
        this.load.atlasJSONHash(konstants_1.EntityType.super_cutter, 'assets/enemies/super_cutter.png', 'assets/enemies/super_cutter.json');
        // flea
        this.load.atlasJSONHash(konstants_1.EntityType.flea, 'assets/enemies/flea.png', 'assets/enemies/flea.json');
        // flying_shell
        this.load.atlasJSONHash(konstants_1.EntityType.flying_shell, 'assets/enemies/flying_shell.png', 'assets/enemies/flying_shell.json');
        // watcher
        this.load.atlasJSONHash(konstants_1.EntityType.watcher, 'assets/enemies/watcher.png', 'assets/enemies/watcher.json');
        // laser_beam
        this.load.atlasJSONHash(konstants_1.EntityType.laser_beam, 'assets/enemies/laser_beam.png', 'assets/enemies/laser_beam.json');
        // picket_man
        this.load.atlasJSONHash(konstants_1.EntityType.picket_man, 'assets/enemies/picket_man.png', 'assets/enemies/picket_man.json');
        // picket_man_weapon
        this.load.atlasJSONHash(konstants_1.EntityType.picket_man_weapon, 'assets/enemies/picket_man.png', 'assets/enemies/picket_man.json');
        // spike
        this.load.image(konstants_1.Konstants.spike, 'assets/objects/spike/spike.png');
        // drop_lift
        this.load.atlasJSONHash(konstants_1.EntityType.drop_lift, 'assets/enemies/drop_lift.png', 'assets/enemies/drop_lift.json');
        // vanishing_block
        this.load.atlasJSONHash(konstants_1.Konstants.vanishing_block, 'assets/enemies/vanishing_block.png', 'assets/enemies/vanishing_block.json');
        // explosion
        this.load.atlasJSONHash(konstants_1.Konstants.explosion, 'assets/objects/explosion.png', 'assets/objects/explosion.json');
        // healthbar
        this.load.atlasJSONHash(konstants_1.Konstants.meter, 'assets/objects/healthbar.png', 'assets/objects/healthbar.json');
        // items
        this.load.atlasJSONHash(konstants_1.Konstants.items, 'assets/items/items.png', 'assets/items/items.json');
        // crazy_razy
        this.load.atlasJSONHash(konstants_1.EntityType.crazy_razy, 'assets/enemies/crazy_razy.png', 'assets/enemies/crazy_razy.json');
        // foot_holder
        this.load.atlasJSONHash(konstants_1.EntityType.foot_holder, 'assets/enemies/foot_holder.png', 'assets/enemies/foot_holder.json');
        this.load.tilemap('test_level', 'assets/levels/test_level.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('cut_man', 'assets/levels/cut_man.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('guts_man', 'assets/levels/guts_man.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('ice_man', 'assets/levels/ice_man.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('bomb_man', 'assets/levels/bomb_man.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('fire_man', 'assets/levels/fire_man.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('elec_man', 'assets/levels/elec_man.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.image('cut_man_tiles', 'assets/tiles/mm1cuttiles.gif');
        this.load.image('guts_man_tiles', 'assets/tiles/mm1gutstiles.png');
        this.load.image('ice_man_tiles', 'assets/tiles/mm1icetiles.png');
        this.load.image('bomb_man_tiles', 'assets/tiles/mm1bombtiles.png');
        this.load.image('fire_man_tiles', 'assets/tiles/mm1firetiles.png');
        this.load.image('elec_man_tiles', 'assets/tiles/mm1electiles.png');
        this.load.image('all_tiles', 'assets/tiles/all_tiles.png');
        //******************************
        // BOSS
        //******************************
        this.load.atlasJSONHash(konstants_1.EntityType.cut_man, 'assets/enemies/bosses/cut_man.png', 'assets/enemies/bosses/cut_man.json');
        this.load.atlasJSONHash(konstants_1.EntityType.guts_man, 'assets/enemies/bosses/guts_man.png', 'assets/enemies/bosses/guts_man.json');
        this.load.atlasJSONHash(konstants_1.EntityType.ice_man, 'assets/enemies/bosses/ice_man.png', 'assets/enemies/bosses/ice_man.json');
        this.load.atlasJSONHash(konstants_1.EntityType.bomb_man, 'assets/enemies/bosses/bomb_man.png', 'assets/enemies/bosses/bomb_man.json');
        this.load.atlasJSONHash(konstants_1.EntityType.fire_man, 'assets/enemies/bosses/fire_man.png', 'assets/enemies/bosses/fire_man.json');
        this.load.atlasJSONHash(konstants_1.EntityType.elec_man, 'assets/enemies/bosses/elec_man.png', 'assets/enemies/bosses/elec_man.json');
        //******************************
        // AUDIO
        //******************************
        this.load.audio(konstants_1.AudioName.game_start, 'assets/audio/' + konstants_1.AudioName.game_start + '.wav', true);
        this.load.audio(konstants_1.AudioName.pause_menu, 'assets/audio/' + konstants_1.AudioName.pause_menu + '.wav', true);
        this.load.audio(konstants_1.AudioName.menu_select, 'assets/audio/' + konstants_1.AudioName.menu_select + '.wav', true);
        this.load.audio(konstants_1.AudioName.megaman_warp, 'assets/audio/' + konstants_1.AudioName.megaman_warp + '.wav', true);
        this.load.audio(konstants_1.AudioName.mega_buster, 'assets/audio/' + konstants_1.AudioName.mega_buster + '.wav', true);
        this.load.audio(konstants_1.AudioName.megaman_land, 'assets/audio/' + konstants_1.AudioName.megaman_land + '.wav', true);
        this.load.audio(konstants_1.AudioName.megaman_damage, 'assets/audio/' + konstants_1.AudioName.megaman_damage + '.wav', true);
        this.load.audio(konstants_1.AudioName.megaman_defeat, 'assets/audio/' + konstants_1.AudioName.megaman_defeat + '.wav', true);
        this.load.audio(konstants_1.AudioName.enemy_damage, 'assets/audio/' + konstants_1.AudioName.enemy_damage + '.wav', true);
        this.load.audio(konstants_1.AudioName.enemy_shoot, 'assets/audio/' + konstants_1.AudioName.enemy_shoot + '.wav', true);
        this.load.audio(konstants_1.AudioName.dink, 'assets/audio/' + konstants_1.AudioName.dink + '.wav', true);
        this.load.audio(konstants_1.AudioName.big_eye, 'assets/audio/' + konstants_1.AudioName.big_eye + '.wav', true);
        this.load.audio(konstants_1.AudioName.explosion, 'assets/audio/' + konstants_1.AudioName.explosion + '.wav', true);
        this.load.audio(konstants_1.AudioName.super_arm, 'assets/audio/' + konstants_1.AudioName.super_arm + '.wav', true);
        this.load.audio(konstants_1.AudioName.guts_quake, 'assets/audio/' + konstants_1.AudioName.guts_quake + '.wav', true);
        this.load.audio(konstants_1.AudioName.thunder_beam, 'assets/audio/' + konstants_1.AudioName.thunder_beam + '.wav', true);
        this.load.audio(konstants_1.AudioName.beam, 'assets/audio/' + konstants_1.AudioName.beam + '.wav', true);
        this.load.audio(konstants_1.AudioName.rolling_cutter, 'assets/audio/' + konstants_1.AudioName.rolling_cutter + '.wav', true);
        this.load.audio(konstants_1.AudioName.cut_man_snip, 'assets/audio/' + konstants_1.AudioName.cut_man_snip + '.wav', true);
        this.load.audio(konstants_1.AudioName.ice_slasher, 'assets/audio/' + konstants_1.AudioName.ice_slasher + '.wav', true);
        this.load.audio(konstants_1.AudioName.water_splash, 'assets/audio/' + konstants_1.AudioName.water_splash + '.wav', true);
        this.load.audio(konstants_1.AudioName.fire_storm_1, 'assets/audio/' + konstants_1.AudioName.fire_storm_1 + '.wav', true);
        this.load.audio(konstants_1.AudioName.fire_storm_2, 'assets/audio/' + konstants_1.AudioName.fire_storm_2 + '.wav', true);
        this.load.audio(konstants_1.AudioName.energy_fill, 'assets/audio/' + konstants_1.AudioName.energy_fill + '.wav', true);
        this.load.audio(konstants_1.AudioName.one_up, 'assets/audio/' + konstants_1.AudioName.one_up + '.wav', true);
        this.load.audio(konstants_1.AudioName.bonus_ball, 'assets/audio/' + konstants_1.AudioName.bonus_ball + '.wav', true);
        this.load.audio(konstants_1.AudioName.point_tally, 'assets/audio/' + konstants_1.AudioName.point_tally + '.wav', true);
        this.load.audio(konstants_1.AudioName.vanishing_blocks, 'assets/audio/' + konstants_1.AudioName.vanishing_blocks + '.wav', true);
        this.load.audio(konstants_1.AudioName.conveyor_lift, 'assets/audio/' + konstants_1.AudioName.conveyor_lift + '.wav', true);
        this.load.audio(konstants_1.AudioName.boss_gate, 'assets/audio/' + konstants_1.AudioName.boss_gate + '.wav', true);
        this.load.audio(konstants_1.AudioName.wily_ship, 'assets/audio/' + konstants_1.AudioName.wily_ship + '.wav', true);
        this.load.audio(konstants_1.AudioName.rushing_water, 'assets/audio/' + konstants_1.AudioName.rushing_water + '.wav', true);
        this.load.audio(konstants_1.AudioName.err, 'assets/audio/' + konstants_1.AudioName.err + '.wav', true);
        this.load.audio(konstants_1.AudioName.pipipi, 'assets/audio/' + konstants_1.AudioName.pipipi + '.wav', true);
        this.load.audio(konstants_1.AudioName.music_game_over, 'assets/audio/' + konstants_1.AudioName.music_game_over + '.ogg', true);
        this.load.audio(konstants_1.AudioName.music_stage_clear, 'assets/audio/' + konstants_1.AudioName.music_stage_clear + '.ogg', true);
        this.load.audio(konstants_1.AudioName.music_boss, 'assets/audio/' + konstants_1.AudioName.music_boss + '.ogg', true);
        this.load.audio(konstants_1.AudioName.music_cut_man_stage, 'assets/audio/' + konstants_1.AudioName.music_cut_man_stage + '.ogg', true);
        this.load.audio(konstants_1.AudioName.music_guts_man_stage, 'assets/audio/' + konstants_1.AudioName.music_guts_man_stage + '.ogg', true);
        this.load.audio(konstants_1.AudioName.music_ice_man_stage, 'assets/audio/' + konstants_1.AudioName.music_ice_man_stage + '.ogg', true);
        this.load.audio(konstants_1.AudioName.music_bomb_man_stage, 'assets/audio/' + konstants_1.AudioName.music_bomb_man_stage + '.ogg', true);
        this.load.audio(konstants_1.AudioName.music_fire_man_stage, 'assets/audio/' + konstants_1.AudioName.music_fire_man_stage + '.ogg', true);
        this.load.audio(konstants_1.AudioName.music_elec_man_stage, 'assets/audio/' + konstants_1.AudioName.music_elec_man_stage + '.ogg', true);
        // this.load.audio(AudioName.music_dr_wily_1_stage, 'assets/audio/' + AudioName.music_dr_wily_1_stage + '.ogg', true);
        // this.load.audio(AudioName.music_dr_wily_2_stage, 'assets/audio/' + AudioName.music_dr_wily_2_stage + '.ogg', true);
        // this.load.audio(AudioName.music_dr_wily_3_stage, 'assets/audio/' + AudioName.music_dr_wily_1_stage + '.ogg', true);
        // this.load.audio(AudioName.music_dr_wily_4_stage, 'assets/audio/' + AudioName.music_dr_wily_2_stage + '.ogg', true);
        this.load.audio(konstants_1.AudioName.music_stage_select, 'assets/audio/' + konstants_1.AudioName.music_stage_select + '.ogg', true);
        this.load.audio(konstants_1.AudioName.music_boss_loop, 'assets/audio/' + konstants_1.AudioName.music_boss_loop + '.ogg', true);
        this.load.audio(konstants_1.AudioName.music_stage_chosen, 'assets/audio/' + konstants_1.AudioName.music_stage_chosen + '.ogg', true);
        //******************************
        // STAGE SELECT
        //******************************
        this.load.json('stage_select', 'assets/data/stage_select.json');
        //******************************
        // MENU
        //******************************
        this.load.atlasJSONHash('grayscale_menu', 'assets/menu/grayscale_menu.png', 'assets/menu/grayscale_menu.json');
        //******************************
        // FONT
        //******************************
        this.game.load.bitmapFont('myfont', 'assets/font/font.png', 'assets/font/font.fnt');
        //******************************
        // LOAD GAME DATA
        //******************************
        gameData_1.GameData.loadData(this);
        //******************************
        // LOAD SAVE GAME DATA
        //******************************
        saveGame_1.SaveGame.loadAllData();
        //******************************
        // LOAD DEBUG DATA
        //******************************
        debug_1.Debug.loadData(this);
    }
    create() {
        console.log("Boot::create()");
        this.game.renderer.renderSession.roundPixels = true;
        Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
        this.game.scale.minWidth = 256;
        this.game.scale.minHeight = 240;
        this.game.scale.maxWidth = 768;
        this.game.scale.maxHeight = 720;
        this.game.stage.backgroundColor = 0;
        this.game.forceSingleUpdate = true;
        this.game.sound.volume = 0.05;
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; // keep current resolution but 'blow-up' the canvas size evenly
        this.game.scale.refresh();
        this.game.stage.smoothed = false;
        this.game.renderer.autoResize = true;
        debug_1.Debug.createData(this.game);
        gameData_1.GameData.createData(this.game);
        // Starts the game at this level. Only happens once at start-up. Remove for release.
        levelManager_1.LevelManager.CURR_LEVEL = debug_1.Debug.StartingLevel;
        if (debug_1.Debug.StartLevelImmediatelly) {
            this.state.start(main_1.GameStates.Game);
        }
        else {
            this.state.start(main_1.GameStates.Title);
        }
    }
}
exports.Boot = Boot;


/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PowerUpType = exports.DropType = exports.EntityType = exports.TagType = exports.AudioName = exports.SpriteSheets = exports.Konstants = void 0;
var Konstants;
(function (Konstants) {
    Konstants["mega_man"] = "mega_man";
    Konstants["met"] = "met";
    Konstants["spine"] = "spine";
    Konstants["beak"] = "beak";
    Konstants["sniper_joe"] = "sniper_joe";
    Konstants["spike"] = "spike";
    Konstants["octopus_battery"] = "octopus_battery";
    Konstants["vanishing_block"] = "vanishing_block";
    Konstants["moving_platform"] = "moving_platform";
    Konstants["meter"] = "healthbar";
    Konstants["bullet"] = "bullet";
    Konstants["met_bullet"] = "met_bullet";
    Konstants["sniper_joe_bullet"] = "sniper_joe_bullet";
    Konstants["beak_bullet"] = "beak_bullet";
    Konstants["idle"] = "idle";
    Konstants["active"] = "active";
    Konstants["blink"] = "blink";
    Konstants["run"] = "run";
    Konstants["jump"] = "jump";
    Konstants["run_shoot"] = "run_shoot";
    Konstants["idle_shoot"] = "idle_shoot";
    Konstants["jump_shoot"] = "jump_shoot";
    Konstants["climb_ladder_shoot"] = "climb_ladder_shoot";
    Konstants["climb_ladder_idle"] = "climb_ladder_idle";
    Konstants["climb_ladder"] = "climb_ladder";
    Konstants["climb_ladder_start"] = "climb_ladder_start";
    Konstants["climb_ladder_end"] = "climb_ladder_end";
    Konstants["hurt"] = "hurt";
    Konstants["slide"] = "slide";
    Konstants["spawn_effect"] = "spawn_effect";
    Konstants["warp_in_effect"] = "warp_in_effect";
    Konstants["lemon"] = "lemon";
    Konstants["rolling_cutter"] = "rolling_cutter";
    Konstants["explosion"] = "explosion";
    Konstants["items"] = "items";
})(Konstants = exports.Konstants || (exports.Konstants = {}));
var SpriteSheets;
(function (SpriteSheets) {
    SpriteSheets["stage_select_and_title"] = "stage_select_and_title";
    SpriteSheets["items"] = "items";
})(SpriteSheets = exports.SpriteSheets || (exports.SpriteSheets = {}));
var AudioName;
(function (AudioName) {
    AudioName["game_start"] = "01 - GameStart";
    AudioName["pause_menu"] = "02 - PauseMenu";
    AudioName["menu_select"] = "03 - MenuSelect";
    AudioName["megaman_warp"] = "04 - MegamanWarp";
    AudioName["mega_buster"] = "05 - MegaBuster";
    AudioName["megaman_land"] = "06 - MegamanLand";
    AudioName["megaman_damage"] = "07 - MegamanDamage";
    AudioName["megaman_defeat"] = "08 - MegamanDefeat";
    AudioName["enemy_damage"] = "09 - EnemyDamage";
    AudioName["enemy_shoot"] = "10 - EnemyShoot";
    AudioName["dink"] = "11 - Dink";
    AudioName["big_eye"] = "12 - BigEye";
    AudioName["explosion"] = "13 - Explosion";
    AudioName["super_arm"] = "14 - SuperArm";
    AudioName["guts_quake"] = "15 - GutsQuake";
    AudioName["thunder_beam"] = "16 - ThunderBeam";
    AudioName["beam"] = "17 - Beam";
    AudioName["rolling_cutter"] = "18 - RollingCutter";
    AudioName["cut_man_snip"] = "19 - CutManSnip";
    AudioName["ice_slasher"] = "20 - IceSlasher";
    AudioName["water_splash"] = "21 - WaterSplash";
    AudioName["fire_storm_1"] = "22 - FireStorm1";
    AudioName["fire_storm_2"] = "23 - FireStorm2";
    AudioName["energy_fill"] = "24 - EnergyFill";
    AudioName["one_up"] = "25 - 1up";
    AudioName["bonus_ball"] = "26 - BonusBall";
    AudioName["point_tally"] = "27 - PointTally";
    AudioName["vanishing_blocks"] = "28 - VanishingBlocks";
    AudioName["conveyor_lift"] = "29 - ConveyorLift";
    AudioName["boss_gate"] = "30 - BossGate";
    AudioName["wily_ship"] = "31 - WilyShip";
    AudioName["rushing_water"] = "32 - RushingWater";
    AudioName["err"] = "33 - Err";
    AudioName["pipipi"] = "34 - PiPiPi";
    AudioName["music_game_over"] = "music_game_over";
    AudioName["music_stage_clear"] = "music_stage_clear";
    AudioName["music_boss"] = "music_boss";
    AudioName["music_cut_man_stage"] = "music_cut_man_stage";
    AudioName["music_guts_man_stage"] = "music_guts_man_stage";
    AudioName["music_ice_man_stage"] = "music_ice_man_stage";
    AudioName["music_bomb_man_stage"] = "music_bomb_man_stage";
    AudioName["music_fire_man_stage"] = "music_fire_man_stage";
    AudioName["music_elec_man_stage"] = "music_elec_man_stage";
    AudioName["music_dr_wily_1_stage"] = "music_dr_wily_1_stage";
    AudioName["music_dr_wily_2_stage"] = "music_dr_wily_2_stage";
    AudioName["music_dr_wily_3_stage"] = "music_dr_wily_3_stage";
    AudioName["music_dr_wily_4_stage"] = "music_dr_wily_4_stage";
    AudioName["music_stage_select"] = "music_stage_select";
    AudioName["music_boss_loop"] = "music_boss_loop";
    AudioName["music_stage_chosen"] = "music_stage_chosen";
})(AudioName = exports.AudioName || (exports.AudioName = {}));
var TagType;
(function (TagType) {
    TagType["player"] = "player";
    TagType["enemy"] = "enemy";
    TagType["bullet"] = "bullet";
    TagType["power_up"] = "power_up";
    TagType["platform"] = "platforms";
})(TagType = exports.TagType || (exports.TagType = {}));
var EntityType;
(function (EntityType) {
    EntityType["player"] = "player";
    EntityType["bullet_lemon"] = "bullet_lemon";
    EntityType["bullet_cut_man"] = "bullet_cut_man";
    EntityType["bullet_guts_man"] = "bullet_guts_man";
    EntityType["bullet"] = "bullet";
    EntityType["met_bullet"] = "met_bullet";
    EntityType["sniper_joe_bullet"] = "sniper_joe_bullet";
    EntityType["beak_bullet"] = "beak_bullet";
    EntityType["screw_bomber_bullet"] = "screw_bomber_bullet";
    EntityType["foot_holder_bullet"] = "foot_holder_bullet";
    EntityType["laser_beam"] = "laser_beam";
    EntityType["throwable_object"] = "throwable_object";
    EntityType["ice_man_bullet"] = "ice_man_bullet";
    EntityType["blader"] = "blader";
    EntityType["met"] = "met";
    EntityType["beak"] = "beak";
    EntityType["spine"] = "spine";
    EntityType["octopus_battery"] = "octopus_battery";
    EntityType["sniper_joe"] = "sniper_joe";
    EntityType["bombomb"] = "bombomb";
    EntityType["bombomb_shrapnel"] = "bombomb_shrapnel";
    EntityType["killer_bullet"] = "killer_bullet";
    EntityType["explosion_from_killer_bullet"] = "explosion_from_killer_bullet";
    EntityType["peng"] = "peng";
    EntityType["screw_bomber"] = "screw_bomber";
    EntityType["super_cutter"] = "super_cutter";
    EntityType["big_eye"] = "big_eye";
    EntityType["flea"] = "flea";
    EntityType["flying_shell"] = "flying_shell";
    EntityType["watcher"] = "watcher";
    EntityType["picket_man"] = "picket_man";
    EntityType["picket_man_weapon"] = "picket_man_weapon";
    EntityType["dust"] = "dust";
    EntityType["spike"] = "spike";
    EntityType["drop_lift"] = "drop_lift";
    EntityType["crazy_razy"] = "crazy_razy";
    EntityType["crazy_razy_fly"] = "crazy_razy_fly";
    EntityType["foot_holder"] = "foot_holder";
    EntityType["energy_pellet_small"] = "energy_pellet_small";
    EntityType["energy_pellet_large"] = "energy_pellet_large";
    EntityType["weapon_energy_small"] = "weapon_energy_small";
    EntityType["weapon_energy_large"] = "weapon_energy_large";
    EntityType["robot_crystal"] = "robot_crystal";
    EntityType["energy_tank"] = "energy_tank";
    EntityType["one_up"] = "one_up";
    EntityType["vanishing_block"] = "vanishing_block";
    EntityType["moving_platform"] = "moving_platform";
    EntityType["cut_man"] = "cut_man";
    EntityType["guts_man"] = "guts_man";
    EntityType["ice_man"] = "ice_man";
    EntityType["bomb_man"] = "bomb_man";
    EntityType["fire_man"] = "fire_man";
    EntityType["elec_man"] = "elec_man";
    EntityType["cut_man_boss_item"] = "cut_man_boss_item";
    EntityType["guts_man_boss_item"] = "guts_man_boss_item";
    EntityType["ice_man_boss_item"] = "ice_man_boss_item";
    EntityType["bomb_man_boss_item"] = "bomb_man_boss_item";
    EntityType["fire_man_boss_item"] = "fire_man_boss_item";
    EntityType["elec_man_boss_item"] = "elec_man_boss_item";
})(EntityType = exports.EntityType || (exports.EntityType = {}));
var DropType;
(function (DropType) {
    DropType["none"] = "";
    DropType["energy_pellet_small"] = "energy_pellet_small";
    DropType["energy_pellet_large"] = "energy_pellet_large";
    DropType["weapon_energy_small"] = "weapon_energy_small";
    DropType["weapon_energy_large"] = "weapon_energy_large";
    DropType["robot_crystal"] = "robot_crystal";
    DropType["energy_tank"] = "energy_tank";
    DropType["one_up"] = "one_up";
})(DropType = exports.DropType || (exports.DropType = {}));
var PowerUpType;
(function (PowerUpType) {
    PowerUpType["energy_pellet_small"] = "energy_pellet_small";
    PowerUpType["energy_pellet_large"] = "energy_pellet_large";
    PowerUpType["weapon_energy_small"] = "weapon_energy_small";
    PowerUpType["weapon_energy_large"] = "weapon_energy_large";
    PowerUpType["robot_crystal"] = "robot_crystal";
    PowerUpType["energy_tank"] = "energy_tank";
    PowerUpType["one_up"] = "one_up";
})(PowerUpType = exports.PowerUpType || (exports.PowerUpType = {}));


/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SaveGame = void 0;
const weapon_1 = __webpack_require__(4);
class SaveGame {
    static saveAllData(weaponList) {
        console.log('Saving all data...');
        this.saveDefeatedLevels();
        this.saveInventoryData(weaponList);
        this.logData();
    }
    static saveDefeatedLevels() {
        window.localStorage.setItem('cut_man', SaveGame.HasDefeatedCutMan == true ? '1' : '0');
        window.localStorage.setItem('guts_man', SaveGame.HasDefeatedGutsMan == true ? '1' : '0');
        window.localStorage.setItem('ice_man', SaveGame.HasDefeatedIceMan == true ? '1' : '0');
        window.localStorage.setItem('bomb_man', SaveGame.HasDefeatedBombMan == true ? '1' : '0');
        window.localStorage.setItem('fire_man', SaveGame.HasDefeatedFireMan == true ? '1' : '0');
        window.localStorage.setItem('elec_man', SaveGame.HasDefeatedElecMan == true ? '1' : '0');
    }
    static saveInventoryData(weaponList) {
        console.log('Saving inventory data...');
        weaponList.forEach(weapon => {
            window.localStorage.setItem(weapon.type, weapon.currEnergy.toString());
        });
    }
    static loadAllData() {
        console.log('Loading all data...');
        SaveGame.loadDefeatedLeveData();
        SaveGame.loadInventoryData();
        SaveGame.logData();
    }
    static loadDefeatedLeveData() {
        console.log('Loading defeated level data...');
        SaveGame.HasDefeatedCutMan = window.localStorage.getItem('cut_man') == '1' ? true : false;
        SaveGame.HasDefeatedGutsMan = window.localStorage.getItem('guts_man') == '1' ? true : false;
        SaveGame.HasDefeatedIceMan = window.localStorage.getItem('ice_man') == '1' ? true : false;
        SaveGame.HasDefeatedBombMan = window.localStorage.getItem('bomb_man') == '1' ? true : false;
        SaveGame.HasDefeatedFireMan = window.localStorage.getItem('fire_man') == '1' ? true : false;
        SaveGame.HasDefeatedElecMan = window.localStorage.getItem('elec_man') == '1' ? true : false;
    }
    static loadInventoryData() {
        console.log('Loading inventory data...');
        SaveGame.HasCutManWeapon = SaveGame.HasDefeatedCutMan ? true : false;
        SaveGame.CutManWeaponEnergy = SaveGame.HasCutManWeapon ? parseInt(window.localStorage.getItem(weapon_1.WeaponType.CutMan)) : 0;
        SaveGame.HasGutsManWeapon = SaveGame.HasDefeatedGutsMan ? true : false;
        SaveGame.GutsManWeaponEnergy = SaveGame.HasGutsManWeapon ? parseInt(window.localStorage.getItem(weapon_1.WeaponType.GutsMan)) : 0;
        SaveGame.HasIceManWeapon = SaveGame.HasDefeatedIceMan ? true : false;
        SaveGame.IceManWeaponEnergy = SaveGame.HasIceManWeapon ? parseInt(window.localStorage.getItem(weapon_1.WeaponType.IceMan)) : 0;
        SaveGame.HasBombManWeapon = SaveGame.HasDefeatedBombMan ? true : false;
        SaveGame.BombManWeaponEnergy = SaveGame.HasBombManWeapon ? parseInt(window.localStorage.getItem(weapon_1.WeaponType.BombMan)) : 0;
        SaveGame.HasFireManWeapon = SaveGame.HasDefeatedFireMan ? true : false;
        SaveGame.FireManWeaponEnergy = SaveGame.HasFireManWeapon ? parseInt(window.localStorage.getItem(weapon_1.WeaponType.FireMan)) : 0;
        SaveGame.HasElecManWeapon = SaveGame.HasDefeatedElecMan ? true : false;
        SaveGame.ElecManWeaponEnergy = SaveGame.HasElecManWeapon ? parseInt(window.localStorage.getItem(weapon_1.WeaponType.ElecMan)) : 0;
    }
    static resetSaveData() {
        window.localStorage.clear();
    }
    static logData() {
        console.log("\nHas Defeated:");
        console.log('cut_man: ' + SaveGame.HasDefeatedCutMan);
        console.log('guts_man: ' + SaveGame.HasDefeatedGutsMan);
        console.log('ice_man: ' + SaveGame.HasDefeatedIceMan);
        console.log('bomb_man: ' + SaveGame.HasDefeatedBombMan);
        console.log('fire_man: ' + SaveGame.HasDefeatedFireMan);
        console.log('elec_man: ' + SaveGame.HasDefeatedElecMan);
        console.log("\nHas Weapon:");
        console.log('HasCutManWeapon: ' + SaveGame.HasCutManWeapon);
        console.log('HasGutsManWeapon: ' + SaveGame.HasGutsManWeapon);
        console.log('HasIceManWeapon: ' + SaveGame.HasIceManWeapon);
        console.log('HasBombManWeapon: ' + SaveGame.HasBombManWeapon);
        console.log('HasFireManWeapon: ' + SaveGame.HasFireManWeapon);
        console.log('HasElecManWeapon: ' + SaveGame.HasElecManWeapon);
        console.log("\nWeapon Energy:");
        console.log('CutManWeaponEnergy: ' + SaveGame.CutManWeaponEnergy);
        console.log('GutsManWeaponEnergy: ' + SaveGame.GutsManWeaponEnergy);
        console.log('IceManWeaponEnergy: ' + SaveGame.IceManWeaponEnergy);
        console.log('BombManWeaponEnergy: ' + SaveGame.BombManWeaponEnergy);
        console.log('FireManWeaponEnergy: ' + SaveGame.FireManWeaponEnergy);
        console.log('ElecManWeaponEnergy: ' + SaveGame.ElecManWeaponEnergy);
    }
    static clearLocalStorage() {
        console.log("Clearing local storage.");
        localStorage.clear();
    }
}
exports.SaveGame = SaveGame;
SaveGame.HasDefeatedCutMan = false;
SaveGame.HasDefeatedGutsMan = false;
SaveGame.HasDefeatedIceMan = false;
SaveGame.HasDefeatedBombMan = false;
SaveGame.HasDefeatedFireMan = false;
SaveGame.HasDefeatedElecMan = false;
SaveGame.HasCutManWeapon = false;
SaveGame.CutManWeaponEnergy = 0;
SaveGame.HasGutsManWeapon = false;
SaveGame.GutsManWeaponEnergy = 0;
SaveGame.HasIceManWeapon = false;
SaveGame.IceManWeaponEnergy = 0;
SaveGame.HasBombManWeapon = false;
SaveGame.BombManWeaponEnergy = 0;
SaveGame.HasFireManWeapon = false;
SaveGame.FireManWeaponEnergy = 0;
SaveGame.HasElecManWeapon = false;
SaveGame.ElecManWeaponEnergy = 0;


/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WeaponType = void 0;
var WeaponType;
(function (WeaponType) {
    WeaponType["BombMan"] = "BombMan";
    WeaponType["ElecMan"] = "ElecMan";
    WeaponType["GutsMan"] = "GutsMan";
    WeaponType["IceMan"] = "IceMan";
    WeaponType["CutMan"] = "CutMan";
    WeaponType["FireMan"] = "FireMan";
    WeaponType["MegaBuster"] = "MegaBuster";
})(WeaponType = exports.WeaponType || (exports.WeaponType = {}));


/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Debug = void 0;
class Debug {
    static loadData(state) {
        state.load.json('debug', 'assets/data/debug.json');
    }
    static createData(game) {
        Debug.DebugCache = game.cache.getJSON('debug');
        Debug.AllowDrawHitboxes = Debug.DebugCache.debug.world.allow_draw_hitboxes;
        Debug.AllowDrawOutlines = Debug.DebugCache.debug.world.allow_draw_outlines;
        Debug.AllowDrawGrid = Debug.DebugCache.debug.world.allow_draw_grid;
        Debug.SpikesVisible = Debug.DebugCache.debug.world.spikesVisible;
        Debug.BackgroundVisible = Debug.DebugCache.debug.world.backgroundVisible;
        Debug.ForegroundVisible = Debug.DebugCache.debug.world.foregroundVisible;
        Debug.StartLevelImmediatelly = Debug.DebugCache.debug.world.startLevelImmediately;
        Debug.StartingLevel = Debug.DebugCache.debug.world.startingLevel;
        Debug.EnableMusic = Debug.DebugCache.debug.world.enableMusic;
        Debug.IsPlayerInvincible = Debug.DebugCache.debug.world.isPlayerInvincible;
        Debug.ShowDebugTestLevelInStageSelect = Debug.DebugCache.debug.world.show_debug_test_level_in_stage_select;
        Debug.logData();
    }
    static logData() {
        console.log('Debug.DebugCache: ' + Debug.DebugCache);
        console.log('Debug.AllowDrawHitboxes: ' + Debug.AllowDrawHitboxes);
        console.log('Debug.AllowDrawOutlines: ' + Debug.AllowDrawOutlines);
        console.log('Debug.SpikesVisible: ' + Debug.SpikesVisible);
        console.log('Debug.BackgroundVisible: ' + Debug.BackgroundVisible);
        console.log('Debug.ForegroundVisible: ' + Debug.ForegroundVisible);
        console.log('Debug.StartLevelImmediatelly: ' + Debug.StartLevelImmediatelly);
        console.log('Debug.StartingLevel: ' + Debug.StartingLevel);
        console.log('Debug.EnableMusic: ' + Debug.EnableMusic);
        console.log('Debug.IsPlayerInvincible: ' + Debug.IsPlayerInvincible);
        console.log('Debug.ShowDebugTestLevelInStageSelect: ' + Debug.ShowDebugTestLevelInStageSelect);
    }
}
exports.Debug = Debug;


/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GameData = void 0;
class GameData {
    static loadData(state) {
        state.load.json('bosses', 'assets/data/bosses.json');
    }
    static createData(game) {
        this.fetchBossesData(game);
        GameData.logData();
    }
    static fetchBossesData(game) {
        GameData.BossesCache = game.cache.getJSON('bosses');
        this.BossDatas.push({
            name: GameData.BossesCache.test_level.name,
            spawnPosition: new Phaser.Point(GameData.BossesCache.test_level.spawn_pos[0], GameData.BossesCache.test_level.spawn_pos[1]),
            bossItemSpawnPosition: new Phaser.Point(GameData.BossesCache.test_level.boss_item_spawn_pos[0], GameData.BossesCache.test_level.boss_item_spawn_pos[1]),
            doorTile: GameData.BossesCache.test_level.door_tile,
            spikeTile: GameData.BossesCache.test_level.spike_tile,
        });
        this.BossDatas.push({
            name: GameData.BossesCache.cut_man.name,
            spawnPosition: new Phaser.Point(GameData.BossesCache.cut_man.spawn_pos[0], GameData.BossesCache.cut_man.spawn_pos[1]),
            bossItemSpawnPosition: new Phaser.Point(GameData.BossesCache.cut_man.boss_item_spawn_pos[0], GameData.BossesCache.cut_man.boss_item_spawn_pos[1]),
            doorTile: GameData.BossesCache.cut_man.door_tile,
            spikeTile: GameData.BossesCache.cut_man.spike_tile,
        });
        this.BossDatas.push({
            name: GameData.BossesCache.guts_man.name,
            spawnPosition: new Phaser.Point(GameData.BossesCache.guts_man.spawn_pos[0], GameData.BossesCache.guts_man.spawn_pos[1]),
            bossItemSpawnPosition: new Phaser.Point(GameData.BossesCache.guts_man.boss_item_spawn_pos[0], GameData.BossesCache.guts_man.boss_item_spawn_pos[1]),
            doorTile: GameData.BossesCache.guts_man.door_tile,
            spikeTile: GameData.BossesCache.guts_man.spike_tile,
        });
        this.BossDatas.push({
            name: GameData.BossesCache.ice_man.name,
            spawnPosition: new Phaser.Point(GameData.BossesCache.ice_man.spawn_pos[0], GameData.BossesCache.ice_man.spawn_pos[1]),
            bossItemSpawnPosition: new Phaser.Point(GameData.BossesCache.ice_man.boss_item_spawn_pos[0], GameData.BossesCache.ice_man.boss_item_spawn_pos[1]),
            doorTile: GameData.BossesCache.ice_man.door_tile,
            spikeTile: GameData.BossesCache.ice_man.spike_tile,
        });
        this.BossDatas.push({
            name: GameData.BossesCache.bomb_man.name,
            spawnPosition: new Phaser.Point(GameData.BossesCache.bomb_man.spawn_pos[0], GameData.BossesCache.bomb_man.spawn_pos[1]),
            bossItemSpawnPosition: new Phaser.Point(GameData.BossesCache.bomb_man.boss_item_spawn_pos[0], GameData.BossesCache.bomb_man.boss_item_spawn_pos[1]),
            doorTile: GameData.BossesCache.bomb_man.door_tile,
            spikeTile: GameData.BossesCache.bomb_man.spike_tile,
        });
        this.BossDatas.push({
            name: GameData.BossesCache.fire_man.name,
            spawnPosition: new Phaser.Point(GameData.BossesCache.fire_man.spawn_pos[0], GameData.BossesCache.fire_man.spawn_pos[1]),
            bossItemSpawnPosition: new Phaser.Point(GameData.BossesCache.fire_man.boss_item_spawn_pos[0], GameData.BossesCache.fire_man.boss_item_spawn_pos[1]),
            doorTile: GameData.BossesCache.fire_man.door_tile,
            spikeTile: GameData.BossesCache.fire_man.spike_tile,
        });
        this.BossDatas.push({
            name: GameData.BossesCache.elec_man.name,
            spawnPosition: new Phaser.Point(GameData.BossesCache.elec_man.spawn_pos[0], GameData.BossesCache.elec_man.spawn_pos[1]),
            bossItemSpawnPosition: new Phaser.Point(GameData.BossesCache.elec_man.boss_item_spawn_pos[0], GameData.BossesCache.elec_man.boss_item_spawn_pos[1]),
            doorTile: GameData.BossesCache.elec_man.door_tile,
            spikeTile: GameData.BossesCache.elec_man.spike_tile,
        });
    }
    static logData() {
    }
}
exports.GameData = GameData;
GameData.BossDatas = new Array();


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LevelManager = exports.LevelId = void 0;
const debug_1 = __webpack_require__(5);
const konstants_1 = __webpack_require__(2);
var BossMusicMarker;
(function (BossMusicMarker) {
    BossMusicMarker["intro"] = "intro";
    BossMusicMarker["loop"] = "loop";
})(BossMusicMarker || (BossMusicMarker = {}));
var LevelId;
(function (LevelId) {
    LevelId["TEST_LEVEL"] = "test_level";
    LevelId["CUT_MAN"] = "cut_man";
    LevelId["GUTS_MAN"] = "guts_man";
    LevelId["ICE_MAN"] = "ice_man";
    LevelId["BOMB_MAN"] = "bomb_man";
    LevelId["FIRE_MAN"] = "fire_man";
    LevelId["ELEC_MAN"] = "elec_man";
    LevelId["DR_WILY_1"] = "dr_wily_1";
    LevelId["DR_WILY_2"] = "dr_wily_2";
    LevelId["DR_WILY_3"] = "dr_wily_3";
    LevelId["DR_WILY_4"] = "dr_wily_4";
})(LevelId = exports.LevelId || (exports.LevelId = {}));
class LevelManager {
    constructor(world) {
        this.world = world;
        this.maps = new Array();
        this.levelInfos = new Array();
        this.game = world.game;
        this.bossMusic = this.game.sound.add(konstants_1.AudioName.music_boss);
        this.bossMusic.addMarker(BossMusicMarker.intro, 0, 3.25);
        this.bossMusic.addMarker(BossMusicMarker.loop, 3.25, 9.7 - 3.25);
    }
    createLevels() {
        let levelInfo = {
            index: 0,
            id: LevelId.TEST_LEVEL,
            map: this.game.add.tilemap('test_level'),
            tiledImageName: 'cut_man_tiles',
            tilesetImageKey: 'cut_man_tiles',
            stageMusic: konstants_1.AudioName.music_cut_man_stage,
            bossMusic: konstants_1.AudioName.music_boss_loop,
        };
        this.levelInfos.push(levelInfo);
        levelInfo = {
            index: 1,
            id: LevelId.CUT_MAN,
            map: this.game.add.tilemap('cut_man'),
            tiledImageName: 'cut_man_tiles',
            tilesetImageKey: 'cut_man_tiles',
            stageMusic: konstants_1.AudioName.music_cut_man_stage,
            bossMusic: konstants_1.AudioName.music_boss_loop,
        };
        this.levelInfos.push(levelInfo);
        levelInfo = {
            index: 2,
            id: LevelId.GUTS_MAN,
            map: this.game.add.tilemap('guts_man'),
            tiledImageName: 'guts_man_tiles',
            tilesetImageKey: 'guts_man_tiles',
            stageMusic: konstants_1.AudioName.music_guts_man_stage,
            bossMusic: konstants_1.AudioName.music_boss_loop,
        };
        this.levelInfos.push(levelInfo);
        levelInfo = {
            index: 3,
            id: LevelId.ICE_MAN,
            map: this.game.add.tilemap('ice_man'),
            tiledImageName: 'ice_man_tiles',
            tilesetImageKey: 'ice_man_tiles',
            stageMusic: konstants_1.AudioName.music_ice_man_stage,
            bossMusic: konstants_1.AudioName.music_boss_loop,
        };
        this.levelInfos.push(levelInfo);
        levelInfo = {
            index: 4,
            id: LevelId.BOMB_MAN,
            map: this.game.add.tilemap('bomb_man'),
            tiledImageName: 'bomb_man_tiles',
            tilesetImageKey: 'bomb_man_tiles',
            stageMusic: konstants_1.AudioName.music_bomb_man_stage,
            bossMusic: konstants_1.AudioName.music_boss_loop,
        };
        this.levelInfos.push(levelInfo);
        levelInfo = {
            index: 5,
            id: LevelId.FIRE_MAN,
            map: this.game.add.tilemap('fire_man'),
            tiledImageName: 'fire_man_tiles',
            tilesetImageKey: 'fire_man_tiles',
            stageMusic: konstants_1.AudioName.music_fire_man_stage,
            bossMusic: konstants_1.AudioName.music_boss_loop,
        };
        this.levelInfos.push(levelInfo);
        levelInfo = {
            index: 6,
            id: LevelId.ELEC_MAN,
            map: this.game.add.tilemap('elec_man'),
            tiledImageName: 'elec_man_tiles',
            tilesetImageKey: 'elec_man_tiles',
            stageMusic: konstants_1.AudioName.music_elec_man_stage,
            bossMusic: konstants_1.AudioName.music_boss_loop,
        };
        this.levelInfos.push(levelInfo);
    }
    makeLevel() {
        this.levelInfos.filter((value) => {
            if (value.id == LevelManager.CURR_LEVEL) {
                this.map = value.map; // set the current map
                this.map.addTilesetImage(value.tiledImageName, value.tilesetImageKey); // ex. 'tiles' , 'cut_man_tiles'
                this.background = this.map.createLayer('background');
                this.spikes = this.map.createLayer('spikes');
                this.foreground = this.map.createLayer('foreground');
            }
        });
    }
    playStageMusic() {
        if (!debug_1.Debug.EnableMusic) {
            return;
        }
        console.log('Play stage music.');
        this.levelInfos.filter((value) => {
            if (value.id == LevelManager.CURR_LEVEL) {
                console.log('value.id: ' + value.id);
                console.log('value.stageMusic: ' + value.stageMusic);
                this.stageMusic = this.game.sound.add(value.stageMusic);
                this.stageMusic.loop = true;
                this.stageMusic.play();
            }
        });
    }
    stopStageMusic() {
        if (this.stageMusic != null || this.stageMusic != undefined) {
            console.log('Stop stage music.');
            this.stageMusic.stop();
        }
    }
    playBossIntroMusic() {
        if (!debug_1.Debug.EnableMusic) {
            return;
        }
        console.log("Play boss intro music.");
        this.bossMusic.play(BossMusicMarker.intro);
    }
    playBossLoopMusic() {
        if (!debug_1.Debug.EnableMusic) {
            return;
        }
        this.bossMusic.play(BossMusicMarker.loop).loop = true;
    }
    stopBossMusic() {
        if (!debug_1.Debug.EnableMusic) {
            return;
        }
        console.log("Stop boss intro music.");
        if (this.bossMusic != null || this.bossMusic != undefined) {
            this.bossMusic.stop();
        }
    }
    destroy() {
        if (this.stageMusic != null || this.stageMusic != undefined) {
            this.stageMusic.destroy();
        }
    }
}
exports.LevelManager = LevelManager;
LevelManager.CURR_LEVEL = LevelId.TEST_LEVEL; // this will be set by the StageSelect state


/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Title = void 0;
const konstants_1 = __webpack_require__(2);
const main_1 = __webpack_require__(0);
class Title extends Phaser.State {
    preload() {
        console.log("Title::preload()");
    }
    create() {
        console.log("Title::create()");
        this.titleScreenCache = this.game.cache.getJSON('title_screen');
        console.log(this.titleScreenCache);
        this.title = this.game.add.sprite(this.titleScreenCache.title_screen.title.position[0], this.titleScreenCache.title_screen.title.position[1], konstants_1.SpriteSheets.stage_select_and_title, 'mega_man_title');
        this.title.anchor.setTo(0.5, 0.5);
        // tm_text
        this.tm_text = this.game.add.bitmapText(this.titleScreenCache.title_screen.tm.position[0], this.titleScreenCache.title_screen.tm.position[1], 'myfont', 'tm', 8);
        this.tm_text.anchor.setTo(0.5, 0.5);
        this.tm_text.smoothed = false;
        // title
        this.press_start_text = this.game.add.bitmapText(this.titleScreenCache.title_screen.press_start.position[0], this.titleScreenCache.title_screen.press_start.position[1], 'myfont', 'PRESS START', 8);
        this.press_start_text.anchor.setTo(0.5, 0.5);
        this.press_start_text.smoothed = false;
        // eula1
        this.eula1_text = this.game.add.bitmapText(this.titleScreenCache.title_screen.eula1.position[0], this.titleScreenCache.title_screen.eula1.position[1], 'myfont', 'TM AND 1987 CAPCOM U.S.A., INC.', 8);
        this.eula1_text.smoothed = false;
        this.eula1_text.align = 'center';
        // eula2
        this.eula2_text = this.game.add.bitmapText(this.titleScreenCache.title_screen.eula2.position[0], this.titleScreenCache.title_screen.eula2.position[1], 'myfont', '\t\t\t\t\t\t\t\t\tLICENSED BY', 8);
        this.eula2_text.smoothed = false;
        this.eula2_text.align = 'center';
        // eula3
        this.eula3_text = this.game.add.bitmapText(this.titleScreenCache.title_screen.eula3.position[0], this.titleScreenCache.title_screen.eula3.position[1], 'myfont', '\t\t\tNINTENDO OF AMERICA INC.', 8);
        this.eula3_text.smoothed = false;
        this.eula3_text.align = 'center';
        this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.add(() => {
            let timer = this.game.time.create(true);
            let count = 0;
            let visible = true;
            timer.repeat(150, 17, () => {
                count++;
                visible = !visible;
                this.press_start_text.visible = visible;
                if (count == 17) {
                    this.state.start(main_1.GameStates.StageSelect);
                }
            }, this);
            timer.start(0);
        }, this);
    }
}
exports.Title = Title;


/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StageSelect = void 0;
const konstants_1 = __webpack_require__(2);
const main_1 = __webpack_require__(0);
const v2_1 = __webpack_require__(10);
const catmull_1 = __webpack_require__(11);
const saveGame_1 = __webpack_require__(3);
const levelManager_1 = __webpack_require__(7);
const debug_1 = __webpack_require__(5);
var StageID;
(function (StageID) {
    StageID[StageID["Cut_Man"] = 0] = "Cut_Man";
    StageID[StageID["Guts_Man"] = 1] = "Guts_Man";
    StageID[StageID["Ice_Man"] = 2] = "Ice_Man";
    StageID[StageID["Bomb_Man"] = 3] = "Bomb_Man";
    StageID[StageID["Fire_Man"] = 4] = "Fire_Man";
    StageID[StageID["Elec_Man"] = 5] = "Elec_Man";
    StageID[StageID["Dr_Wily"] = 6] = "Dr_Wily";
})(StageID || (StageID = {}));
class StageSelect extends Phaser.State {
    constructor() {
        super(...arguments);
        this.currIdx = 0;
        this.currStageBtn = null;
        this.stageBtns = new Array();
        this.isReady = false;
        this.isGameStarting = false;
        this.catmull = null;
        this.points = new Array();
    }
    preload() {
        console.log("StageSelect::preload()");
    }
    create() {
        console.log("StageSelect::create()");
        if (!StageSelect.hasRunOnce) {
            this.createDefaults();
        }
        this.currIdx = 0;
        this.resetCamera();
        this.createInput();
        this.createStageButtons();
        this.createDarkBackground();
        this.createWhiteBackground();
        this.createText();
        this.playStageSelectMusic();
        this.catmull = new catmull_1.Catmull(this.points);
        this.game.stage.backgroundColor = 0x0070EC;
        this.isReady = true;
    }
    createText() {
        this.selectStageText = this.game.add.bitmapText(106, 96, 'myfont', 'SELECT \nSTAGE', 8);
        this.selectStageText.smoothed = false;
        this.pressStartText = this.game.add.bitmapText(106, 120, 'myfont', 'PRESS \nSTART', 8);
        this.pressStartText.smoothed = false;
        this.stageText = this.game.add.bitmapText(134, 96, 'myfont', 'CUTMAN', 8);
        this.stageText.smoothed = false;
        this.stageText.visible = false;
        this.clearPointsText = this.game.add.bitmapText(134, 110, 'myfont', 'CLEAR POINTS', 8);
        this.clearPointsText.smoothed = false;
        this.clearPointsText.visible = false;
        this.pointsText = this.game.add.bitmapText(134, 124, 'myfont', '80000', 8);
        this.pointsText.smoothed = false;
        this.pointsText.visible = false;
    }
    playStageSelectMusic() {
        if (!debug_1.Debug.EnableMusic) {
            return;
        }
        this.game.sound.play(konstants_1.AudioName.music_stage_select);
    }
    createDefaults() {
        this.stageSelectJson = this.game.cache.getJSON('stage_select');
    }
    resetCamera() {
        this.game.camera.bounds.x = 0;
        this.game.camera.bounds.y = 0;
        this.game.camera.bounds.width = 256;
        this.game.camera.bounds.height = 240;
        this.game.camera.setPosition(0, 0);
    }
    createInput() {
        StageSelect.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        StageSelect.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        StageSelect.dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        StageSelect.eKey = this.game.input.keyboard.addKey(Phaser.Keyboard.E);
        StageSelect.leftKey.onDown.add(() => {
            if (this.isGameStarting)
                return;
            if (!this.isReady)
                return;
            let prevIdx = this.currIdx;
            this.currIdx--;
            if (this.currIdx < 0) {
                this.currIdx = this.stageBtns.length - 1;
            }
            this.hoverThisStage(prevIdx, this.currIdx);
        }, this);
        StageSelect.rightKey.onDown.add(() => {
            if (this.isGameStarting)
                return;
            if (!this.isReady)
                return;
            let prevIdx = this.currIdx;
            this.currIdx++;
            if (this.currIdx >= this.stageBtns.length) {
                this.currIdx = 0;
            }
            this.hoverThisStage(prevIdx, this.currIdx);
        }, this);
        StageSelect.dKey.onDown.add(() => {
            if (this.isGameStarting)
                return;
            if (!this.isReady)
                return;
            this.selectThisStage();
        }, this);
        StageSelect.eKey.onDown.add(() => {
            if (this.isGameStarting)
                return;
            if (!this.isReady)
                return;
            this.selectThisStage();
        }, this);
    }
    createStageButtons() {
        let stage_select = this.stageSelectJson.stage_select;
        let props = Object.getOwnPropertyNames(stage_select);
        props.map((key) => {
            let bossName = key;
            let stageID = stage_select[key].stageID;
            let selected = stage_select[key].selected;
            let stage_sprite = stage_select[key].stage_sprite;
            let stage_sprite_completed = stage_select[key].stage_sprite_completed;
            let stage_name = stage_select[key].stage_name;
            let portraitX = stage_select[key].portrait_position[0];
            let portraitY = stage_select[key].portrait_position[1];
            let portraitFrameX = stage_select[key].portrait_frame_position[0];
            let portraitFrameY = stage_select[key].portrait_frame_position[1];
            let scaleX = stage_select[key].scaleX;
            let portraitName = '';
            if (stageID == -1) {
                if (!debug_1.Debug.ShowDebugTestLevelInStageSelect) {
                    return;
                }
            }
            else if (stageID == 0) {
                portraitName = saveGame_1.SaveGame.HasDefeatedCutMan == true ? stage_sprite_completed : stage_sprite;
            }
            else if (stageID == 1) {
                portraitName = saveGame_1.SaveGame.HasDefeatedGutsMan == true ? stage_sprite_completed : stage_sprite;
            }
            else if (stageID == 2) {
                portraitName = saveGame_1.SaveGame.HasDefeatedIceMan == true ? stage_sprite_completed : stage_sprite;
            }
            else if (stageID == 3) {
                portraitName = saveGame_1.SaveGame.HasDefeatedBombMan == true ? stage_sprite_completed : stage_sprite;
            }
            else if (stageID == 4) {
                portraitName = saveGame_1.SaveGame.HasDefeatedFireMan == true ? stage_sprite_completed : stage_sprite;
            }
            else if (stageID == 5) {
                portraitName = saveGame_1.SaveGame.HasDefeatedElecMan == true ? stage_sprite_completed : stage_sprite;
            }
            this.stageBtns.push(this.createStageButton(stageID, stage_name, portraitName, portraitX, portraitY, portraitFrameX, portraitFrameY, selected));
        });
        this.stageBtns.forEach(element => {
            if (element.isSelected) {
                element.portraitFrame.play('blink');
                element.isSelected = true;
            }
        });
    }
    createDarkBackground() {
        this.darkBackground = this.game.add.graphics(0, 80);
        this.darkBackground.beginFill(0x183c5c, 1);
        this.darkBackground.drawRect(0, 0, 256, 65);
        this.darkBackground.endFill();
        this.darkBackground.alpha = 0;
    }
    createWhiteBackground() {
        this.whiteBackground = this.game.add.graphics(0, 0);
        this.whiteBackground.beginFill(0xffffff, 1);
        this.whiteBackground.drawRect(0, 0, 256, 240);
        this.whiteBackground.endFill();
        this.whiteBackground.alpha = 0;
    }
    hoverThisStage(prevIdx, currIdx) {
        this.stageBtns[prevIdx].isSelected = false;
        this.stageBtns[prevIdx].portraitFrame.animations.stop('blink', true);
        this.stageBtns[currIdx].isSelected = true;
        this.stageBtns[currIdx].portraitFrame.play('blink').setFrame(1, true);
        this.game.sound.play(konstants_1.AudioName.menu_select);
    }
    selectThisStage() {
        this.isGameStarting = true;
        this.updateCurrentStage();
        this.hideStageSelect();
        this.showStageChosenDarkBackground();
        this.flashScreen();
        this.playStartGameAudio();
        if (levelManager_1.LevelManager.CURR_LEVEL == levelManager_1.LevelId.TEST_LEVEL) {
            this.showAndAnimateStageText();
            return;
        }
        this.createBoss();
        this.playBossJump();
    }
    // TODO: Fix layer. These numbers do not exist yet.
    updateCurrentStage() {
        switch (this.stageBtns[this.currIdx].stageId) {
            // case -1:
            //     LevelManager.CURR_LEVEL = LevelId.TEST_LEVEL;
            //     break;
            case 0:
                levelManager_1.LevelManager.CURR_LEVEL = levelManager_1.LevelId.CUT_MAN;
                break;
            case 1:
                levelManager_1.LevelManager.CURR_LEVEL = levelManager_1.LevelId.GUTS_MAN;
                break;
            case 2:
                levelManager_1.LevelManager.CURR_LEVEL = levelManager_1.LevelId.ICE_MAN;
                break;
            case 3:
                levelManager_1.LevelManager.CURR_LEVEL = levelManager_1.LevelId.BOMB_MAN;
                break;
            case 4:
                levelManager_1.LevelManager.CURR_LEVEL = levelManager_1.LevelId.FIRE_MAN;
                break;
            case 5:
                levelManager_1.LevelManager.CURR_LEVEL = levelManager_1.LevelId.ELEC_MAN;
                break;
            case 6:
                levelManager_1.LevelManager.CURR_LEVEL = levelManager_1.LevelId.DR_WILY_1;
                break;
            // case 7:
            //     LevelManager.CURR_LEVEL = LevelId.DR_WILY_2;
            //     break;
            // case 8:
            //     LevelManager.CURR_LEVEL = LevelId.DR_WILY_3;
            //     break;
            // case 9:
            //     LevelManager.CURR_LEVEL = LevelId.DR_WILY_4;
            //     break;
            default:
                break;
        }
        console.log("Stage selected: " + levelManager_1.LevelManager.CURR_LEVEL);
    }
    playStartGameAudio() {
        this.game.sound.stopAll();
        this.game.sound.play(konstants_1.AudioName.game_start);
        if (!debug_1.Debug.EnableMusic) {
            return;
        }
        this.game.sound.play(konstants_1.AudioName.music_stage_chosen);
    }
    createBoss() {
        let boss_animation = this.stageSelectJson.boss_animation;
        let props = Object.getOwnPropertyNames(boss_animation);
        let sprite_sheet;
        let positionX;
        let positionY;
        let scaleX;
        let initial_frame;
        let jump = new Array();
        let taunt = new Array();
        let tauntFrameSpeed;
        let path;
        props.map((key) => {
            if (boss_animation[key].stageID != this.stageBtns[this.currIdx].stageId) {
                return;
            }
            sprite_sheet = boss_animation[key].sprite_sheet;
            positionX = boss_animation[key].position[0];
            positionY = boss_animation[key].position[1];
            scaleX = boss_animation[key].scaleX;
            initial_frame = boss_animation[key].initial_frame;
            jump = boss_animation[key].jump;
            taunt = boss_animation[key].taunt;
            tauntFrameSpeed = boss_animation[key].tauntFrameSpeed;
            path = new Array();
            for (let i = 0; i < boss_animation[key].path.length; i++) {
                path.push(new Phaser.Point(boss_animation[key].path[i][0], boss_animation[key].path[i][1]));
            }
        });
        this.boss = this.game.add.sprite(positionX, positionY, sprite_sheet, initial_frame);
        this.game.add.existing(this.boss);
        this.boss.anchor.setTo(0.5);
        this.boss.scale.x = scaleX;
        this.boss.animations.add('jump', jump, 7);
        this.boss.animations.add('taunt', taunt, tauntFrameSpeed);
        path.forEach(element => {
            this.points.push(new v2_1.v2(element.x, element.y));
        });
    }
    playBossJump() {
        this.boss.play('jump');
        let marker = 0;
        let animateBoss = this.game.time.create(true);
        animateBoss.loop(1 / 60, () => {
            marker += 2.2 * (1 / 60);
            if (marker > this.points.length - 1) {
                this.boss.scale.x = -1;
                animateBoss.stop();
                this.playBossTaunt();
                return;
            }
            let pos = this.catmull.getSplinePoint(marker, true);
            this.boss.x = pos.x;
            this.boss.y = pos.y;
        }, this);
        animateBoss.start();
    }
    playBossTaunt() {
        this.boss.animations.play('taunt');
        let bossTauntTimer = this.game.time.create(true);
        bossTauntTimer.loop(1 / 60, () => {
            if (this.boss.animations.currentAnim.isFinished) {
                bossTauntTimer.stop();
                this.showAndAnimateStageText();
            }
        }, this);
        bossTauntTimer.start();
    }
    showAndAnimateStageText() {
        this.stageText.text = "";
        this.stageText.visible = true;
        let stageTextTimer = this.game.time.create(true);
        let index = 0;
        let length = this.stageBtns[this.currIdx].stageName.length;
        stageTextTimer.loop(100, () => {
            if (index == length) {
                stageTextTimer.stop();
                this.showAndAnimateClearPointsText();
                return;
            }
            this.stageText.text += this.stageBtns[this.currIdx].stageName[index];
            index++;
        }, this);
        stageTextTimer.start(0);
    }
    showAndAnimateClearPointsText() {
        this.clearPointsText.text = "";
        this.clearPointsText.visible = true;
        let cpTextTimer = this.game.time.create(true);
        let index = 0;
        let length = 12;
        let cp = "CLEAR POINTS";
        cpTextTimer.loop(100, () => {
            if (index == length) {
                cpTextTimer.stop();
                this.showAndAnimatePointsText();
                return;
            }
            this.clearPointsText.text += cp[index];
            index++;
        }, this);
        cpTextTimer.start(0);
    }
    showAndAnimatePointsText() {
        this.pointsText.text = "";
        this.pointsText.visible = true;
        let pointsTextTimer = this.game.time.create(true);
        let index = 0;
        let length = 5;
        let cp = "80000";
        pointsTextTimer.loop(200, () => {
            if (index == length) {
                pointsTextTimer.stop();
                this.game.time.events.add(1200, () => {
                    this.startGame();
                });
                return;
            }
            this.pointsText.text += cp[index].toString();
            index++;
        }, this);
        pointsTextTimer.start(0);
    }
    startGame() {
        StageSelect.hasRunOnce = true;
        this.whiteBackground.alpha = 0;
        this.darkBackground.alpha = 0;
        this.game.input.keyboard.removeKey(Phaser.Keyboard.LEFT);
        this.game.input.keyboard.removeKey(Phaser.Keyboard.RIGHT);
        this.game.input.keyboard.removeKey(Phaser.Keyboard.D);
        this.game.input.keyboard.removeKey(Phaser.Keyboard.ENTER);
        if (this.boss != null || this.boss != undefined) {
            this.boss.visible = false;
        }
        this.isReady = false;
        this.isGameStarting = false;
        for (let i = this.catmull.points.length - 1; i >= 0; i--) {
            this.catmull.points.splice(i, 1);
        }
        for (let i = this.stageBtns.length - 1; i >= 0; i--) {
            this.stageBtns.splice(i, 1);
        }
        this.whiteBackground.destroy();
        this.darkBackground.destroy();
        this.stageText.visible = false;
        this.clearPointsText.visible = false;
        this.game.state.start(main_1.GameStates.Game);
    }
    createStageButton(stageId, stageName, portraitName, portraitX, portraitY, portraitFrameX, portraitFrameY, selected) {
        let stageButton = {
            stageId: stageId,
            stageName: stageName,
            portrait: this.game.add.sprite(portraitX, portraitY, konstants_1.SpriteSheets.stage_select_and_title, portraitName),
            portraitFrame: this.game.add.sprite(portraitFrameX, portraitFrameY, konstants_1.SpriteSheets.stage_select_and_title, 'cursor_normal'),
            stageText: this.game.add.bitmapText(portraitX, portraitFrameY, "myfont", "", 8),
            isSelected: selected,
        };
        stageButton.portraitFrame.animations.add('blink', ['cursor_normal', 'cursor_blink'], 5, true);
        stageButton.stageText.text = stageButton.stageName;
        stageButton.stageText.anchor.setTo(0.5, 0.5);
        stageButton.stageText.x += 17;
        stageButton.stageText.y += 55;
        return stageButton;
    }
    hideStageSelect() {
        this.stageBtns.forEach(stage => {
            stage.isSelected = false;
            stage.portrait.visible = false;
            stage.portraitFrame.animations.stop();
            stage.portraitFrame.visible = false;
            stage.stageText.visible = false;
        });
        this.selectStageText.visible = false;
        this.pressStartText.visible = false;
    }
    showStageChosenDarkBackground() {
        this.darkBackground.alpha = 1;
    }
    flashScreen() {
        let flashCount = 0;
        let isWhiteBackgroundShowing = true;
        this.whiteBackground.alpha = 1;
        let flashTimer = this.game.time.create(true);
        flashTimer.loop(120, () => {
            if (flashCount == 10) {
                flashTimer.stop();
            }
            flashCount++;
            this.whiteBackground.alpha = isWhiteBackgroundShowing ? 0 : 1;
            isWhiteBackgroundShowing = !isWhiteBackgroundShowing;
        }, this);
        flashTimer.start();
    }
}
exports.StageSelect = StageSelect;
StageSelect.hasRunOnce = false;


/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.v2 = void 0;
/**
 * @author mrdoob / http://mrdoob.com/
 * @author philogb / http://blog.thejit.org/
 * @author egraether / http://egraether.com/
 * @author zz85 / http://www.lab4games.net/zz85/blog
 */
class v2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    clone() {
        return new v2(this.x, this.y);
    }
    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }
    multiplyScalar(s) {
        this.x *= s;
        this.y *= s;
        return this;
    }
    divideScalar(s) {
        this.x /= s;
        this.y /= s;
        return this;
    }
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }
    lengthSq() {
        return this.x * this.x + this.y * this.y;
    }
    length() {
        return Math.sqrt(this.lengthSq());
    }
    normalize() {
        this.x /= this.length();
        this.y /= this.length();
        return this;
    }
    perp() {
        var temp = this.x;
        this.x = -this.y;
        this.y = temp;
        return this;
    }
    static add(a, b) {
        return new v2(a.x + b.x, a.y + b.y);
    }
    static sub(a, b) {
        return new v2(a.x - b.x, a.y - b.y);
    }
    static multiplyScalar(a, s) {
        return new v2(a.x * s, a.y * s);
    }
    static divideScalar(a, s) {
        return new v2(a.x / s, a.y / s);
    }
    static dot(a, b) {
        return a.x * b.x + a.y * b.y;
    }
    static staticLengthSq(a) {
        return a.x * a.x + a.y * a.y;
    }
    static staticLength(a) {
        return v2.staticLengthSq(a);
    }
    static normalize(v) {
        return new v2(v.x / v.length(), v.y / v.length());
    }
    static perp(v) {
        return new v2(-v.y, v.x);
    }
    static crossVV(a, b) {
        return a.x * b.y - a.y * b.x;
    }
    static crossVS(v, s) {
        return new v2(s * v.y, -s * v.x);
    }
    static crossSV(s, v) {
        return new v2(-s * v.y, s * v.x);
    }
}
exports.v2 = v2;


/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Catmull = void 0;
const v2_1 = __webpack_require__(10);
class Catmull {
    constructor(points) {
        this.points = points;
    }
    /**
     * doYoutube()
     * This generates the path.
     * For this to be looped you must modify the for loop in doYouTube(). It must not have - 3. It has to
     * go through all the points.
     * @param t
     * @param looped
     */
    getSplinePoint(t, looped = false) {
        let p1 = 0;
        let p2 = 0;
        let p3 = 0;
        let p0 = 0;
        if (!looped) {
            p1 = Math.floor(t) + 1;
            p2 = p1 + 1;
            p3 = p1 + 2;
            p0 = p1 - 1;
        }
        else {
            p1 = Math.floor(t);
            p2 = (p1 + 1) % this.points.length;
            p3 = (p1 + 2) % this.points.length;
            p0 = p1 >= 1 ? p1 - 1 : this.points.length - 1;
        }
        // HACK: Since we are looping through all points now we must make sure that p3 is not greater than the total points
        //          or we get an error. Alternatively, if you do not use looping you can add this.points.length - 3 to the for loop.
        //          for(let i = 0; i < this.points.length - 3; i += 0.05)
        //          This is only if you will never use looping, EVER.
        if (p3 > this.points.length - 1) {
            return new v2_1.v2();
        }
        t = t - Math.floor(t);
        let tt = t * t;
        let ttt = tt * t;
        let q1 = -ttt + 2 * tt - t;
        let q2 = 3 * ttt - 5 * tt + 2;
        let q3 = -3 * ttt + 4 * tt + t;
        let q4 = ttt - tt;
        let tx = 0.5 * (this.points[p0].x * q1 + this.points[p1].x * q2 + this.points[p2].x * q3 + this.points[p3].x * q4);
        let ty = 0.5 * (this.points[p0].y * q1 + this.points[p1].y * q2 + this.points[p2].y * q3 + this.points[p3].y * q4);
        return new v2_1.v2(tx, ty);
    }
    /**
    * doYoutube();
    * This generates the tangent. Use this to rotate characters in the direction of spline. I think this is the tangent
    * or normal...
    * @param t
    * @param looped
    */
    getSplineGradient(t, looped = false) {
        let p1 = 0;
        let p2 = 0;
        let p3 = 0;
        let p0 = 0;
        if (!looped) {
            p1 = Math.floor(t) + 1;
            p2 = p1 + 1;
            p3 = p1 + 2;
            p0 = p1 - 1;
        }
        else {
            p1 = Math.floor(t);
            p2 = (p1 + 1) % this.points.length;
            p3 = (p1 + 2) % this.points.length;
            p0 = p1 >= 1 ? p1 - 1 : this.points.length - 1;
        }
        // HACK: Since we are looping through all points now we must make sure that p3 is not greater than the total points
        //          or we get an error. Alternatively, if you do not use looping you can add this.points.length - 3 to the for loop.
        //          for(let i = 0; i < this.points.length - 3; i += 0.05)
        //          This is only if you will never use looping, EVER.
        if (p3 > this.points.length - 1) {
            return new v2_1.v2();
        }
        t = t - Math.floor(t);
        let tt = t * t;
        let ttt = tt * t;
        let q1 = -3 * tt + 4 * t - 1;
        let q2 = 9 * tt - 10 * t;
        let q3 = -9 * tt + 8 * t + 1;
        let q4 = 3 * tt - 2 * t;
        let tx = 0.5 * (this.points[p0].x * q1 + this.points[p1].x * q2 + this.points[p2].x * q3 + this.points[p3].x * q4);
        let ty = 0.5 * (this.points[p0].y * q1 + this.points[p1].y * q2 + this.points[p2].y * q3 + this.points[p3].y * q4);
        return new v2_1.v2(tx, ty);
    }
}
exports.Catmull = Catmull;


/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Game = void 0;
const main_1 = __webpack_require__(0);
const world_1 = __webpack_require__(13);
const saveGame_1 = __webpack_require__(3);
class Game extends Phaser.State {
    preload() {
        console.log("Game::preload()");
    }
    create() {
        console.log("Game::create()");
        this.game.stage.backgroundColor = 0;
        this.createStepping(false);
        this.myWorld = new world_1.World(this.game);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.myWorld.game.input.keyboard.addKey(Phaser.Keyboard.D).onDown.add(() => {
            if (this.myWorld.canGoBackToStageSelect) {
                this.myWorld.levelManager.stopBossMusic();
                this.myWorld.levelManager.stopStageMusic();
                this.myWorld.levelManager.destroy();
                this.game.state.start(main_1.GameStates.StageSelect);
            }
        }, this);
        this.myWorld.game.input.keyboard.addKey(Phaser.Keyboard.Q).onDown.add(() => {
            this.myWorld.levelManager.stopBossMusic();
            this.myWorld.levelManager.stopStageMusic();
            this.myWorld.levelManager.destroy();
            this.game.state.start(main_1.GameStates.StageSelect);
        }, this);
        this.myWorld.game.input.keyboard.addKey(Phaser.Keyboard.U).onDown.add(() => {
            this.myWorld.debugDrawManager.toggleGridDrawing();
        }, this);
        this.myWorld.game.input.keyboard.addKey(Phaser.Keyboard.I).onDown.add(() => {
            this.myWorld.toggleTiles();
        }, this);
        this.myWorld.game.input.keyboard.addKey(Phaser.Keyboard.O).onDown.add(() => {
            this.myWorld.debugDrawManager.toggleHitboxDrawing();
        }, this);
        this.myWorld.game.input.keyboard.addKey(Phaser.Keyboard.P).onDown.add(() => {
            this.myWorld.debugDrawManager.toggleOutlineDrawing();
        }, this);
        this.myWorld.game.input.keyboard.addKey(Phaser.Keyboard.M).onDown.add(() => {
            saveGame_1.SaveGame.clearLocalStorage();
        }, this);
    }
    update() {
        this.myWorld.update();
        this.showDebug();
    }
    createStepping(pauseOnStart = false) {
        // let toggleBtn = document.getElementById('toggle');
        // let stepBtn = document.getElementById('step');
        // toggleBtn.onclick = () => {
        //     if (!this.game.stepping) {
        //         this.game.sound.pauseAll();
        //         this.game.enableStep();
        //     }
        //     else {
        //         this.game.sound.resumeAll();
        //         this.game.disableStep();
        //     }
        // }
        // stepBtn.onclick = () => {
        //     this.game.step();
        // }
        // if (pauseOnStart) {
        //     this.game.enableStep();
        // }
    }
    showDebug() {
        // this.game.debug.inputInfo(10, 10);
        // this.game.debug.body(this.player);
        // this.game.debug.bodyInfo(this.player, 10, 10);
        // this.game.debug.spriteInfo(this.player, 10, 10);
        // this.game.debug.spriteBounds(this.player); // mega man sprite bounds
        // this.game.debug.spriteBounds(this.player.hitbox); // mega man hitbox
    }
}
exports.Game = Game;


/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.World = void 0;
const entityManager_1 = __webpack_require__(14);
const collisionManager_1 = __webpack_require__(69);
const levelManager_1 = __webpack_require__(7);
const dropManager_1 = __webpack_require__(71);
const inventoryManager_1 = __webpack_require__(72);
const vanishingBlockManager_1 = __webpack_require__(81);
const debugDrawManager_1 = __webpack_require__(82);
const konstants_1 = __webpack_require__(2);
const camera_1 = __webpack_require__(83);
const spawner_1 = __webpack_require__(84);
const stateMachine_1 = __webpack_require__(33);
const mathutil_1 = __webpack_require__(34);
const saveGame_1 = __webpack_require__(3);
const debug_1 = __webpack_require__(5);
const gameData_1 = __webpack_require__(6);
const vector2_1 = __webpack_require__(20);
const weapon_1 = __webpack_require__(4);
var WorldState;
(function (WorldState) {
    WorldState["spawning"] = "spawning";
    WorldState["running"] = "running";
    WorldState["giving_energy"] = "giving_energy";
    WorldState["waiting_for_reset"] = "waiting_for_reset";
    WorldState["game_over"] = "game_over";
    WorldState["waiting"] = "waiting";
})(WorldState || (WorldState = {}));
/**
 * Surface collisions are not checked when on ladders so dont put doors on ladders.
 */
class World {
    constructor(game) {
        this.walls = new Array();
        this.surfaces = new Array();
        this.ladders = new Array();
        this.deathZones = new Array();
        this.doors = new Array();
        this.vanishingBlockTriggers = new Array();
        this.crazyRazyTriggers = new Array();
        this.spawners = new Array();
        this.isPaused = false;
        this.isStandardPaused = false;
        this.pausedWarpSpeed = 200;
        this.initialSpawn = true; // True, if the game has just started.
        this.currBoss = null;
        this.levelCheckpoints = new Array();
        this.checkPointRoomIndex = 0; // The room index set in Tiled.
        this.checkpointArrayIndex = 0; // The index of the checkpoint in the LevelCheckPoint array.
        this.startingSpawnPos = new Phaser.Point();
        this.playerStartX = 0;
        this.playerStartY = 0;
        this.playerEndX = 0;
        this.playerEndY = 0;
        this.startLerp = false;
        this.lerpElapsedTime = 0;
        this.lerpEndTime = 1500;
        this.levelCompleted = false;
        this.canGoBackToStageSelect = false;
        this.game = game;
        this.entityManager = new entityManager_1.EntityManager(this.game, this);
        this.collisionManager = new collisionManager_1.CollisionManager(this.game, this);
        this.collisionManager.createEntityFromSpawner.add(this.createEntityFromSpawner, this);
        this.levelManager = new levelManager_1.LevelManager(this);
        this.levelManager.createLevels();
        this.levelManager.makeLevel();
        this.dropManager = new dropManager_1.DropManager(this.game, this);
        this.inventoryManager = new inventoryManager_1.InventoryManager(this);
        this.inventoryManager.initialize();
        this.vanishingBlockManager = new vanishingBlockManager_1.VanishingBlockManager(this);
        this.debugDrawManager = new debugDrawManager_1.DebugDrawManager(this);
        this.graphicsDebug = this.game.add.graphics();
        this.game.add.existing(this.graphicsDebug);
        this.createSpikes();
        this.showSpikeTiles = debug_1.Debug.SpikesVisible;
        this.showBackgroundTiles = debug_1.Debug.BackgroundVisible;
        this.showForegroundTiles = debug_1.Debug.ForegroundVisible;
        this.showDebug = debug_1.Debug.AllowDrawOutlines;
        this.levelManager.spikes.visible = this.showSpikeTiles;
        this.levelManager.background.visible = this.showBackgroundTiles;
        this.levelManager.foreground.visible = this.showForegroundTiles;
        let objects = this.levelManager.map.objects;
        this.parsePlayerStartingPos(objects);
        this.parseCheckpoints(objects);
        this.parseItems(objects);
        this.parseVanishingBlocks(objects);
        this.parseDropLifts(objects);
        this.parseFootHolders(objects);
        this.parseDeathZones(objects);
        this.parseDoors(objects);
        this.parseWalls(objects);
        this.parseLadders(objects);
        this.parseEnemies(objects);
        this.parseCrazyRazyTriggers(objects);
        this.surfaces.forEach((surface) => {
            this.entityManager.addSurface(surface);
        });
        this.ladders.forEach((ladder) => {
            this.entityManager.addLadder(ladder);
        });
        this.createPlayer();
        this.createCamera(objects);
        // this.checkCheckpoint();
        this.createDustPool();
        this.createHurtDustPool();
        this.createMegaManDeathEffectPool();
        this.createExplosionPool();
        this.debugTestSetInitialMegaManPosition(objects); // must execute after camera and getting initial player pos
        this.createFiniteStateMachine();
        this.dropManager.initialize();
        this.sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
        this.eKey = this.game.input.keyboard.addKey(Phaser.Keyboard.E);
        this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    }
    /**
     * DEBUG
     *
     * This will be used to set Mega Man's starting position based on Tiled player position.
     * This is primarily used for debugging and testing levels.
     */
    debugTestSetInitialMegaManPosition(objects) {
        for (let i = 0; i < objects.camera_bounds.length; i++) {
            let topLeft = new Phaser.Point(objects.camera_bounds[i].x, objects.camera_bounds[i].y);
            let camera_bounds = new Phaser.Rectangle(topLeft.x, topLeft.y, objects.camera_bounds[i].width, objects.camera_bounds[i].height);
            let playerPos = new Phaser.Rectangle(this.startingSpawnPos.x, this.startingSpawnPos.y, 16, 16);
            if (playerPos.intersects(camera_bounds, 0)) {
                this.camera.setCurrentRoom(objects.camera_bounds[i].properties.index);
                break;
            }
        }
        this.checkCheckpoint();
    }
    createSpikes() {
        let spikeIndex = gameData_1.GameData.BossDatas.filter((value) => {
            return (value.name == levelManager_1.LevelManager.CURR_LEVEL);
        })[0].spikeTile;
        for (let i = 0; i < this.levelManager.spikes.layer.data.length; i++) {
            for (let j = 0; j < this.levelManager.spikes.layer.data[i].length; j++) {
                if (this.levelManager.spikes.layer.data[i][j].index == spikeIndex) {
                    let entity = this.entityManager.createEntity(konstants_1.EntityType.spike, this.levelManager.spikes.layer.data[i][j].worldX + 8, this.levelManager.spikes.layer.data[i][j].worldY + 16);
                    this.game.add.existing(entity);
                    this.entityManager.addEntity(entity);
                    // entity.visible = false;
                }
            }
        }
    }
    parsePlayerStartingPos(objects) {
        // Get and set the player's starting spawn position.
        for (let i = 0; i < objects.player.length; i++) {
            if (objects.player[i].name == 'player') {
                this.startingSpawnPos.x = objects.player[i].x;
                this.startingSpawnPos.y = objects.player[i].y;
            }
        }
    }
    parseCheckpoints(objects) {
        let index = new Array();
        let checkPointsRoomIndex = new Array();
        let spawnPos = new Array();
        let active = new Array();
        for (let i = 0; i < objects.checkpoints.length; i++) {
            // console.log('objects.checkpoints[i].properties.index: ' + objects.checkpoints[i].properties.index)
            // console.log('objects.checkpoints[i].properties.roomIndex: ' + objects.checkpoints[i].properties.roomIndex)
            index.push(objects.checkpoints[i].properties.index);
            checkPointsRoomIndex.push(objects.checkpoints[i].properties.roomIndex);
            spawnPos.push(new Phaser.Point(objects.checkpoints[i].x / 16, objects.checkpoints[i].y / 16));
            active.push(false);
        }
        this.levelCheckpoints.push({
            levelNum: 1,
            checkpointsRoomIndex: checkPointsRoomIndex,
            spawnPos: spawnPos,
            active: active
        });
    }
    parseItems(objects) {
        for (let i = 0; i < objects.items.length; i++) {
            let x = objects.items[i].x;
            let y = objects.items[i].y;
            let entity = this.entityManager.createPowerUp(objects.items[i].type, x, y, true);
            this.game.add.existing(entity);
            this.entityManager.addEntity(entity);
        }
    }
    parseVanishingBlocks(objects) {
        if (objects.vanishing_blocks_trigger == undefined) {
            console.warn('vanishing_blocks_trigger does not exist. Intended? - Some level don\'t need this.');
            return;
        }
        for (let i = 0; i < objects.vanishing_blocks_trigger.length; i++) {
            let x = objects.vanishing_blocks_trigger[i].x;
            let y = objects.vanishing_blocks_trigger[i].y;
            let width = objects.vanishing_blocks_trigger[i].width;
            let height = objects.vanishing_blocks_trigger[i].height;
            this.vanishingBlockTriggers.push({
                groupIndex: objects.vanishing_blocks_trigger[i].properties.group,
                trigger: new Phaser.Rectangle(x, y, width, height)
            });
        }
        for (let i = 0; i < objects.vanishing_blocks.length; i++) {
            let x = objects.vanishing_blocks[i].x;
            let y = objects.vanishing_blocks[i].y;
            let entity = this.entityManager.createEntity(objects.vanishing_blocks[i].type, x, y);
            this.game.add.existing(entity);
            this.entityManager.addEntity(entity);
            let width = objects.vanishing_blocks[i].width;
            let height = objects.vanishing_blocks[i].height;
            let v0 = new Phaser.Point(x, y - 16); // top-left
            let v1 = new Phaser.Point(x + width, y - 16); // top-right
            let v2 = new Phaser.Point(x + width, y + height - 16); // bottom-right
            let v3 = new Phaser.Point(x, y + height - 16); // bottom-left
            let dir1 = v1.clone().subtract(v0.x, v0.y).normalize(); // top face
            let dir2 = v2.clone().subtract(v1.x, v1.y).normalize(); // right face
            let dir3 = v3.clone().subtract(v2.x, v2.y).normalize(); // bottom face
            let dir4 = v0.clone().subtract(v3.x, v3.y).normalize(); // left face
            let line1 = { p1: v0, p2: v1, dir: dir1, collidable: true, isMovingPlatform: false, targetSpeed: null };
            let line2 = { p1: v1, p2: v2, dir: dir2, collidable: true, isMovingPlatform: false, targetSpeed: null };
            let line3 = { p1: v2, p2: v3, dir: dir3, collidable: true, isMovingPlatform: false, targetSpeed: null };
            let line4 = { p1: v3, p2: v0, dir: dir4, collidable: true, isMovingPlatform: false, targetSpeed: null };
            this.surfaces.push(line1);
            this.surfaces.push(line2);
            this.surfaces.push(line3);
            this.surfaces.push(line4);
            entity.groupIndex = objects.vanishing_blocks[i].properties.group;
            entity.index = objects.vanishing_blocks[i].properties.index;
            entity.startDelay = objects.vanishing_blocks[i].properties.startDelay;
            entity.appearFor = objects.vanishing_blocks[i].properties.appearFor;
            entity.surfaces.push(line1);
            entity.surfaces.push(line2);
            entity.surfaces.push(line3);
            entity.surfaces.push(line4);
            entity.surfaces.forEach(element => {
                element.collidable = false;
            });
            // (<VanishingBlock>entity).startDelay = objects.vanishing_blocks[i].properties.startDelay;
            // (<VanishingBlock>entity).appearFor = objects.vanishing_blocks[i].properties.appearFor;
            // (<VanishingBlock>entity).hideFor = objects.vanishing_blocks[i].properties.hideFor;
            // (<VanishingBlock>entity).initialize();
            this.vanishingBlockManager.addToGroup(entity.groupIndex, entity);
        }
    }
    parseDropLifts(objects) {
        for (let i = 0; i < objects.drop_lifts.length; i++) {
            if (objects.drop_lifts[i].type == 'drop_lift_path') {
                continue;
            }
            let x = objects.drop_lifts[i].x;
            let y = objects.drop_lifts[i].y;
            let dropLift = this.entityManager.createDropLift(x, y, objects.drop_lifts[i].properties.path, objects.drop_lifts[i].properties.delay);
            this.game.add.existing(dropLift);
            this.entityManager.addEntity(dropLift);
            let width = objects.drop_lifts[i].width;
            let height = objects.drop_lifts[i].height;
            let v0 = new Phaser.Point(x, y - 16); // top-left
            let v1 = new Phaser.Point(x + width, y - 16); // top-right
            let dir1 = v1.clone().subtract(v0.x, v0.y).normalize(); // top face
            let line1 = { p1: v0, p2: v1, dir: dir1, collidable: true, isMovingPlatform: true, targetSpeed: new Phaser.Point() };
            this.surfaces.push(line1);
            let tempSurfaces = new Array();
            dropLift.setSurface(line1);
            dropLift.initialize();
        }
    }
    parseFootHolders(objects) {
        for (let i = 0; i < objects.foot_holders.length; i++) {
            let tiledCustomProps = {
                numLeftTiles: objects.foot_holders[i].properties.numLeftTiles,
                numRightTiles: objects.foot_holders[i].properties.numRightTiles
            };
            let x = objects.foot_holders[i].x;
            let y = objects.foot_holders[i].y;
            let footHolder = this.entityManager.createEntity(konstants_1.EntityType.foot_holder, x, y, tiledCustomProps);
            this.game.add.existing(footHolder);
            this.entityManager.addEntity(footHolder);
        }
    }
    parseDeathZones(objects) {
        // console.log('death_zones length: ' + objects.death_zones.length);
        for (let i = 0; i < objects.death_zones.length; i++) {
            let tempRect = new Phaser.Rectangle(0, 0, 1, 1);
            tempRect.x = objects.death_zones[i].x;
            tempRect.y = objects.death_zones[i].y;
            tempRect.width = objects.death_zones[i].width;
            tempRect.height = objects.death_zones[i].height;
            this.deathZones.push(tempRect);
            // console.log('deathzone ' + i);
            // console.log(tempRect);
        }
    }
    parseDoors(objects) {
        for (let i = 0; i < objects.doors.length; i++) {
            // Door surface is collidable to prevent player from going back
            // NOTE: Collidable does nothing currently.
            if (objects.doors[i].name == 'door') {
                let door = {
                    isOpen: false, hitbox: null, surfaces: new Array(), tileCoordinates: new Array(),
                    doorDirection: 'right', firstDoorIntoBossRoom: false, secondDoorIntoBossRoom: false,
                };
                door.doorDirection = objects.doors[i].properties.doorDirection;
                door.firstDoorIntoBossRoom = objects.doors[i].properties.firstDoorIntoBossRoom;
                door.secondDoorIntoBossRoom = objects.doors[i].properties.secondDoorIntoBossRoom;
                let x = objects.doors[i].x;
                let y = objects.doors[i].y;
                let width = objects.doors[i].width;
                let height = objects.doors[i].height;
                let v0 = new Phaser.Point(x, y); // top-left
                let v1 = new Phaser.Point(x + width, y); // top-right
                let v2 = new Phaser.Point(x + width, y + height); // bottom-right
                let v3 = new Phaser.Point(x, y + height); // bottom-left
                let dir1 = v1.clone().subtract(v0.x, v0.y).normalize(); // top face
                let dir2 = v2.clone().subtract(v1.x, v1.y).normalize(); // right face
                let dir3 = v3.clone().subtract(v2.x, v2.y).normalize(); // bottom face
                let dir4 = v0.clone().subtract(v3.x, v3.y).normalize(); // left face
                let line1 = { p1: v0, p2: v1, dir: dir1, collidable: true, isMovingPlatform: false, targetSpeed: null };
                let line2 = { p1: v1, p2: v2, dir: dir2, collidable: true, isMovingPlatform: false, targetSpeed: null };
                let line3 = { p1: v2, p2: v3, dir: dir3, collidable: true, isMovingPlatform: false, targetSpeed: null };
                let line4 = { p1: v3, p2: v0, dir: dir4, collidable: true, isMovingPlatform: false, targetSpeed: null };
                // When the player goes through a door this surface will block them from going back.
                if (door.doorDirection == 'left') {
                    door.surfaces.push(line4); // Redundant...leaving in...future might want to disable/enable blockage.
                    this.surfaces.push(line4);
                }
                else if (door.doorDirection == 'right') {
                    door.surfaces.push(line2);
                    this.surfaces.push(line2);
                }
                else if (door.doorDirection == 'up') {
                    door.surfaces.push(line1);
                    this.surfaces.push(line1);
                }
                else if (door.doorDirection == 'down') {
                    door.surfaces.push(line3);
                    this.surfaces.push(line3);
                }
                door.hitbox = new Phaser.Rectangle(x, y, width, height);
                let tiles = this.levelManager.foreground.getTiles(x, y, width, height);
                for (let i = 0; i < tiles.length; i++) {
                    door.tileCoordinates.push(new Phaser.Point(tiles[i].x, tiles[i].y));
                }
                this.doors.push(door);
                if (door.secondDoorIntoBossRoom) {
                    this.hideDoor(door); // Hide the boss door that will be controlled from cut-scene.
                }
            }
        }
    }
    parseWalls(objects) {
        let temp_v0 = new vector2_1.Vector2();
        let temp_v1 = new vector2_1.Vector2();
        let temp_v2 = new vector2_1.Vector2();
        let temp_v3 = new vector2_1.Vector2();
        for (let i = 0; i < objects.walls.length; i++) {
            let x = objects.walls[i].x;
            let y = objects.walls[i].y;
            let width = objects.walls[i].width;
            let height = objects.walls[i].height;
            let v0 = new Phaser.Point(x, y); // top-left
            let v1 = new Phaser.Point(x + width, y); // top-right
            let v2 = new Phaser.Point(x + width, y + height); // bottom-right
            let v3 = new Phaser.Point(x, y + height); // bottom-left
            let dir1 = v1.clone().subtract(v0.x, v0.y).normalize(); // top face
            let dir2 = v2.clone().subtract(v1.x, v1.y).normalize(); // right face
            let dir3 = v3.clone().subtract(v2.x, v2.y).normalize(); // bottom face
            let dir4 = v0.clone().subtract(v3.x, v3.y).normalize(); // left face
            let line1 = { p1: v0, p2: v1, dir: dir1, collidable: true, isMovingPlatform: false, targetSpeed: null };
            let line2 = { p1: v1, p2: v2, dir: dir2, collidable: true, isMovingPlatform: false, targetSpeed: null };
            let line3 = { p1: v2, p2: v3, dir: dir3, collidable: true, isMovingPlatform: false, targetSpeed: null };
            let line4 = { p1: v3, p2: v0, dir: dir4, collidable: true, isMovingPlatform: false, targetSpeed: null };
            this.surfaces.push(line1);
            this.surfaces.push(line2);
            this.surfaces.push(line3);
            this.surfaces.push(line4);
            temp_v0.x = v0.x;
            temp_v0.y = v0.y;
            temp_v1.x = v1.x;
            temp_v1.y = v1.y;
            temp_v2.x = v2.x;
            temp_v2.y = v2.y;
            temp_v3.x = v3.x;
            temp_v3.y = v3.y;
            let rect = new Phaser.Rectangle(x, y, width, height);
            this.walls.push({ top: line1, left: line2, right: line4, bottom: line3, rect: rect });
        }
    }
    parseLadders(objects) {
        for (let i = 0; i < objects.ladders.length; i++) {
            let x = objects.ladders[i].x; // top-left x position of ladder
            let y = objects.ladders[i].y; // top-left y position of ladder
            let width = objects.ladders[i].width;
            let height = objects.ladders[i].height;
            // Create ladder line
            // The ladder line is the 'floor' at the top of the ladder the player stands on.
            // Without the floor the player falls through the gap created by the ladder.
            // Player ignores this floor when on ladder.
            let startX = x; // start x for the top of the ladder 'floor'
            let startY = y + 16; // start y for the top of the ladder 'floor'
            let endX = x + 16; // end x for the top of the ladder 'floor'
            let endY = y + 16; // end y for the top of the ladder 'floor'
            let v0 = new Phaser.Point(startX, startY);
            let v1 = new Phaser.Point(endX, endY);
            let dir1 = v1.clone().subtract(v0.x, v0.y).normalize();
            let ladderLine = { p1: v0, p2: v1, dir: dir1, collidable: true, isMovingPlatform: false, targetSpeed: null };
            this.surfaces.push(ladderLine);
            // The ladder hitbox.
            let rect = new Phaser.Rectangle(x, y, width, height);
            this.ladders.push(rect);
        }
    }
    parseEnemies(objects) {
        for (let i = 0; i < objects.enemies.length; i++) {
            let width = objects.enemies[i].width;
            let height = objects.enemies[i].height;
            let x = objects.enemies[i].x + width * 0.5;
            let y = objects.enemies[i].y - height * 0.5; // subtract because Tiled uses bottom left corner...
            let rotation = objects.enemies[i].rotation == undefined ? 0 : objects.enemies[i].rotation;
            let canLoop = objects.enemies[i].type == konstants_1.EntityType.bombomb;
            let loopTime = 0;
            let respawnLocation = spawner_1.RespawnLocation.Original;
            let maxEntitiesAllowedPerLoop = 1; // default always 1
            let useDistanceCheck = false;
            let withinPlayerDistanceX = 99999;
            let withinPlayerDistanceY = 99999;
            let tiledCustomProps = null;
            switch (objects.enemies[i].type) {
                case konstants_1.EntityType.octopus_battery:
                    tiledCustomProps = {
                        speed: objects.enemies[i].properties.speed,
                        horizontal: objects.enemies[i].properties.horizontal,
                        vertical: objects.enemies[i].properties.vertical,
                    };
                    break;
                case konstants_1.EntityType.bombomb:
                    loopTime = 3000;
                    // Needs to be pushed UP slightly to prevent bombomb activating when the player is
                    // a screen below the actual spawner.
                    y -= 2;
                    break;
                case konstants_1.EntityType.killer_bullet:
                    canLoop = objects.enemies[i].properties.loop;
                    loopTime = objects.enemies[i].properties.loopTime;
                    break;
                case konstants_1.EntityType.screw_bomber:
                    tiledCustomProps = {
                        // rotation is not a custom property for screw_bomber in Tiled.
                        // However, we need it to properly set whether or not the screw_bomber
                        // is mounted to the floor or ceiling. We don't use custom properties here
                        // because it is simpler to use rotation. No need to remember to set a custom property.
                        rotation: rotation,
                    };
                    break;
                case konstants_1.EntityType.super_cutter:
                    canLoop = true;
                    loopTime = 600;
                    maxEntitiesAllowedPerLoop = 999999;
                    useDistanceCheck = true;
                    withinPlayerDistanceX = 70;
                    break;
                case konstants_1.EntityType.flying_shell:
                    canLoop = true;
                    loopTime = 300;
                    break;
                case konstants_1.EntityType.peng:
                    canLoop = true;
                    loopTime = 500;
                    respawnLocation = spawner_1.RespawnLocation.RightSideOfScreen;
                    tiledCustomProps = {
                        xDistance: objects.enemies[i].properties.xDistance,
                    };
                    break;
                case konstants_1.EntityType.beak:
                    tiledCustomProps = {
                        rotation: rotation,
                    };
                    break;
                case konstants_1.EntityType.watcher:
                    tiledCustomProps = {
                        spawnDelay: objects.enemies[i].properties.spawnDelay,
                        direction: objects.enemies[i].properties.direction,
                    };
                    // Needs to be pushed UP slightly to prevent watcher being detected by the collision manager
                    // camera intersection test that enables/disables its spawner.
                    y -= 2;
                    break;
            }
            this.spawners.push({
                game: this.game,
                entityManager: this.entityManager,
                collisionManager: this.collisionManager,
                x: x,
                y: y,
                width: width,
                height: height,
                rotation: rotation,
                entityType: objects.enemies[i].type,
                isSpawnerOnScreen: false,
                entities: new Array(),
                canLoop: canLoop,
                loopElapsedTime: loopTime,
                loopEndTime: loopTime,
                respawnLocation: respawnLocation,
                useDistanceCheck: useDistanceCheck,
                withinPlayerDistanceX: withinPlayerDistanceX,
                withinPlayerDistanceY: withinPlayerDistanceY,
                maxEntitiesAllowedPerLoop: maxEntitiesAllowedPerLoop,
                properties: tiledCustomProps,
            });
        }
    }
    parseCrazyRazyTriggers(objects) {
        // Doesn't exist in this map.
        if (objects.crazy_razy_trigger == undefined) {
            console.warn('crazy_razy_trigger does not exist. Intended? - Some level don\'t need this.');
            return;
        }
        for (let i = 0; i < objects.crazy_razy_trigger.length; i++) {
            let width = objects.crazy_razy_trigger[i].width;
            let height = objects.crazy_razy_trigger[i].height;
            let x = objects.crazy_razy_trigger[i].x;
            let y = objects.crazy_razy_trigger[i].y;
            this.crazyRazyTriggers.push(new Phaser.Rectangle(x, y, width, height));
        }
    }
    update() {
        if (!this.canGoBackToStageSelect) {
            this.fsm.currentState.update();
            this.checkPlayerNeedsLerp();
        }
    }
    showDoor(door) {
        let tiles = this.levelManager.foreground.getTiles(door.hitbox.x, door.hitbox.y, door.hitbox.width, door.hitbox.height);
        let counter = tiles.length - 1;
        let doorTileIndex = gameData_1.GameData.BossDatas.filter((value) => {
            return (value.name == levelManager_1.LevelManager.CURR_LEVEL);
        })[0].doorTile;
        for (let i = 0; i <= counter; i++) {
            this.levelManager.map.replace(-1, doorTileIndex, tiles[i].x, tiles[i].y, 1, 1, this.levelManager.foreground);
        }
    }
    hideDoor(door) {
        let tiles = this.levelManager.foreground.getTiles(door.hitbox.x, door.hitbox.y, door.hitbox.width, door.hitbox.height);
        let counter = tiles.length - 1;
        let doorTileIndex = gameData_1.GameData.BossDatas.filter((value) => {
            return (value.name == levelManager_1.LevelManager.CURR_LEVEL);
        })[0].doorTile;
        for (let i = 0; i <= counter; i++) {
            this.levelManager.map.replace(doorTileIndex, -1, tiles[i].x, tiles[i].y, 1, 1, this.levelManager.foreground);
        }
    }
    openDoor(door) {
        this.game.sound.play(konstants_1.AudioName.boss_gate);
        // Stop shit so the door can open
        this.entityManager.stop = true;
        this.collisionManager.stop = true;
        // Get the door tiles so we can fucking make them invisible.
        let tiles = this.levelManager.foreground.getTiles(door.hitbox.x, door.hitbox.y, door.hitbox.width, door.hitbox.height);
        let counter = tiles.length - 1;
        this.doorTimer = this.game.time.create(true);
        console.log('This door index is located at: ' + tiles[0].index);
        this.doorTimer.loop(80, () => {
            // Invisible? Just replace them with nothing dumbass.
            // Breakdown: Replace tile 6 (the gay ass door tile) with -1 aka nothing at the x & y. (tile 6 is cut_man door)
            let doorTileIndex = gameData_1.GameData.BossDatas.filter((value) => {
                return (value.name == levelManager_1.LevelManager.CURR_LEVEL);
            })[0].doorTile;
            this.levelManager.map.replace(doorTileIndex, -1, tiles[counter].x, tiles[counter].y, 1, 1, this.levelManager.foreground);
            counter--;
            if (counter == -1) {
                door.isOpen = true;
                this.doorTimer.stop();
                this.camera.forceCameraGo(door.doorDirection);
            }
        }, this);
        this.doorTimer.start(0);
    }
    closeDoor(door) {
        this.game.sound.play(konstants_1.AudioName.boss_gate);
        // Get the door tiles so we can fucking make them invisible.
        let tiles = this.levelManager.foreground.getTiles(door.hitbox.x, door.hitbox.y, door.hitbox.width, door.hitbox.height);
        let counter = 0;
        this.doorTimer = this.game.time.create(true);
        this.doorTimer.loop(80, () => {
            // Invisible? Just replace them with nothing dumbass.
            // Breakdown: Replace tile 6 (the gay ass door tile) with -1 aka nothing at the x & y.
            let doorTileIndex = gameData_1.GameData.BossDatas.filter((value) => {
                return (value.name == levelManager_1.LevelManager.CURR_LEVEL);
            })[0].doorTile;
            this.levelManager.map.replace(-1, doorTileIndex, tiles[counter].x, tiles[counter].y, 1, 1, this.levelManager.foreground);
            counter++;
            if (counter == tiles.length) {
                door.isOpen = false;
                this.doorTimer.stop();
            }
        }, this);
        this.doorTimer.start(0);
    }
    resetDoors() {
        for (let i = 0; i < this.doors.length; i++) {
            // Mega Man has opened this door.
            if (this.doors[i].isOpen) {
                // If boss doors are open (Mega Man went in) mark them as closed now.
                if (this.doors[i].firstDoorIntoBossRoom || this.doors[i].secondDoorIntoBossRoom) {
                    this.doors[i].isOpen = false;
                }
            }
            if (this.doors[i].secondDoorIntoBossRoom) {
                this.hideDoor(this.doors[i]);
            }
            else {
                this.showDoor(this.doors[i]);
            }
        }
    }
    pickedUpBossItem(type) {
        console.log('Picked up: ' + type);
        switch (type) {
            case konstants_1.EntityType.cut_man_boss_item:
                saveGame_1.SaveGame.HasDefeatedCutMan = true;
                saveGame_1.SaveGame.HasCutManWeapon = true;
                this.entityManager.player.getInventoryManager().unlockWeapon(weapon_1.WeaponType.CutMan);
                break;
            case konstants_1.EntityType.guts_man_boss_item:
                saveGame_1.SaveGame.HasDefeatedGutsMan = true;
                saveGame_1.SaveGame.HasGutsManWeapon = true;
                this.entityManager.player.getInventoryManager().unlockWeapon(weapon_1.WeaponType.GutsMan);
                break;
            case konstants_1.EntityType.ice_man_boss_item:
                saveGame_1.SaveGame.HasDefeatedIceMan = true;
                saveGame_1.SaveGame.HasIceManWeapon = true;
                this.entityManager.player.getInventoryManager().unlockWeapon(weapon_1.WeaponType.IceMan);
                break;
            case konstants_1.EntityType.bomb_man_boss_item:
                saveGame_1.SaveGame.HasDefeatedBombMan = true;
                saveGame_1.SaveGame.HasBombManWeapon = true;
                this.entityManager.player.getInventoryManager().unlockWeapon(weapon_1.WeaponType.BombMan);
                break;
            case konstants_1.EntityType.fire_man_boss_item:
                saveGame_1.SaveGame.HasDefeatedFireMan = true;
                saveGame_1.SaveGame.HasFireManWeapon = true;
                this.entityManager.player.getInventoryManager().unlockWeapon(weapon_1.WeaponType.FireMan);
                break;
            case konstants_1.EntityType.elec_man_boss_item:
                saveGame_1.SaveGame.HasDefeatedElecMan = true;
                saveGame_1.SaveGame.HasElecManWeapon = true;
                this.entityManager.player.getInventoryManager().unlockWeapon(weapon_1.WeaponType.ElecMan);
                break;
            default:
                console.error('Boss item error or not implemented yet.');
                break;
        }
        saveGame_1.SaveGame.saveAllData(this.inventoryManager.weaponList);
        this.entityManager.stop = true;
        this.collisionManager.stop = true;
        if (debug_1.Debug.EnableMusic) {
            this.game.sound.play(konstants_1.AudioName.music_stage_clear);
        }
        this.game.time.events.add(6070 /*100*/, () => {
            this.canGoBackToStageSelect = true;
        }, this);
    }
    createPlayer() {
        console.log('Create Player.');
        let player = this.entityManager.createPlayer(0, 0);
        player.setInventoryManager(this.inventoryManager);
        player.destroyed.add(() => {
            this.levelManager.stopStageMusic();
            this.levelManager.stopBossMusic();
            this.disableBoss();
            this.fsm.changeState(WorldState.waiting_for_reset);
        }, this);
        player.getPosition().x = this.startingSpawnPos.x + 8;
        player.getPosition().y = this.startingSpawnPos.y + 16;
        player.position.x = player.getPosition().x;
        player.position.y = player.getPosition().y;
        // We don't show the player yet. Don't use visible - camera won't move to player if invisible.
        player.alpha = 0;
        player.healthMeter.activateEnergyState.add(() => {
            this.fsm.changeState(WorldState.giving_energy);
        }, this);
        player.healthMeter.deactivateEnergyState.add(() => {
            this.fsm.changeState(WorldState.running);
        }, this);
        player.getAllWeapons().forEach(element => {
            if (element.energyMeter == null) {
                return;
            }
            element.energyMeter.activateEnergyState.add(() => {
                this.fsm.changeState(WorldState.giving_energy);
            });
            element.energyMeter.deactivateEnergyState.add(() => {
                this.fsm.changeState(WorldState.running);
            });
        }, this);
        this.entityManager.addPlayer(player);
    }
    createCamera(objects) {
        this.camera = new camera_1.Camera(this.game, this, objects.camera_bounds);
        this.camera.setTarget(this.entityManager.player);
        this.camera.setCurrentRoom(0);
        // Shift the player to the new room as the camera is shifting.
        this.camera.cameraStateShifting.add(() => {
            this.entityManager.stop = true;
            this.vanishingBlockManager.pause();
            this.collisionManager.stop = true;
            this.playerStartX = this.entityManager.player.getPosition().x;
            this.playerStartY = this.entityManager.player.getPosition().y;
            switch (this.camera.goingTo) {
                case camera_1.GoingTo.Left:
                    this.playerEndX = this.camera.currentRoom.bounds.x - 24;
                    this.playerEndY = this.entityManager.player.getPosition().y;
                    break;
                case camera_1.GoingTo.Right:
                    this.playerEndX = this.camera.currentRoom.bounds.x + this.camera.currentRoom.bounds.width + 24;
                    this.playerEndY = this.entityManager.player.getPosition().y;
                    break;
                case camera_1.GoingTo.Up:
                    this.playerEndX = this.camera.currentRoom.bounds.x;
                    this.playerEndY = this.camera.currentRoom.bounds.y;
                    break;
                case camera_1.GoingTo.Down:
                    this.playerEndX = this.camera.currentRoom.bounds.x;
                    // Mega man bounds checking is based on his center so his real position is passed the bounds Y. We
                    // need an extra buffer compared to the X.
                    this.playerEndY = this.camera.currentRoom.bounds.y + this.camera.currentRoom.bounds.height + 32;
                    break;
                default:
                    console.error("GoingTo went terribly wrong!");
                    break;
            }
            // console.log(this.playerStartX, this.playerStartY);
            // console.log(this.playerEndX, this.playerEndY);
            this.lerpElapsedTime = 0;
            this.startLerp = true;
        }, this);
        this.camera.camersStateBackToNormal.add(() => {
            this.startLerp = false;
            this.entityManager.stop = false;
            this.entityManager.removeAllEntitiesExceptPlayer();
            this.vanishingBlockManager.reset();
            this.vanishingBlockManager.unpause();
            this.collisionManager.stop = false;
            this.checkCheckpoint();
            this.checkIfBossRoom();
        }, this);
        // Must remove any listeners first since the game.camera is GLOBAL and may have
        // listeners already attached.
        this.game.camera.onFadeComplete.removeAll();
        this.game.camera.onFlashComplete.removeAll();
        this.game.camera.onFadeComplete.add(this.fadeComplete, this);
        this.game.camera.onFlashComplete.add(this.flashComplete, this);
    }
    // Fading out...player died?
    fadeComplete() {
        this.clearLevel();
        this.game.camera.flash(0, 100);
    }
    // Fading in...time to respawn?
    flashComplete() {
        // Reset camera back to the last checkpoint room.
        this.camera.setCurrentRoom(this.checkPointRoomIndex);
        this.fsm.changeState(WorldState.spawning);
    }
    checkIfBossRoom() {
        if (!this.camera.currentRoom.isBossRoom) {
            return;
        }
        this.levelManager.stopStageMusic();
        this.levelManager.playBossIntroMusic();
        this.entityManager.player.playerInput.preventControl = true;
        this.entityManager.player.stopAllMovement();
        this.currBoss = this.createBossForThisLevel();
        this.entityManager.addEntity(this.currBoss);
        this.game.add.existing(this.currBoss);
        this.currBoss.events.onKilled.add(() => {
            this.currBoss.healthMeter.hide();
            this.levelCompleted = true;
            this.levelManager.stopBossMusic();
        }, this);
        this.game.time.events.add(3250 /*100*/, () => {
            this.doors.forEach(element => {
                if (element.secondDoorIntoBossRoom) {
                    this.closeDoor(element);
                }
            }, this);
            this.game.sound.play(konstants_1.AudioName.boss_gate);
            this.levelManager.playBossLoopMusic();
            this.game.time.events.add(500, () => {
                this.currBoss.visible = true;
                this.currBoss.healthMeter.restoreSpeed = 25;
                this.currBoss.healthMeter.restoreEnergy(28);
                this.currBoss.performTaunt();
                this.currBoss.healthMeter.deactivateEnergyState.add(() => {
                    this.currBoss.healthMeter.restoreSpeed = 75;
                    this.entityManager.player.playerInput.preventControl = false;
                    this.currBoss.disableLogic = false;
                }, this);
            }, this);
        }, this);
    }
    createBossForThisLevel() {
        let spawnPos = gameData_1.GameData.BossDatas.filter((value) => {
            return value.name == levelManager_1.LevelManager.CURR_LEVEL;
        })[0].spawnPosition;
        switch (levelManager_1.LevelManager.CURR_LEVEL) {
            case levelManager_1.LevelId.CUT_MAN:
                return this.entityManager.createEntity(konstants_1.EntityType.cut_man, spawnPos.x * 16, spawnPos.y * 16);
            case levelManager_1.LevelId.GUTS_MAN:
                let gm = this.entityManager.createEntity(konstants_1.EntityType.guts_man, spawnPos.x * 16, spawnPos.y * 16);
                let shakeElapsedTime = 0;
                this.shakeScreenTimer = this.game.time.create(false);
                let shakeFor = 550;
                gm.slamGround.add((gm) => {
                    this.game.camera.shake(0.02, shakeFor, true, Phaser.Camera.SHAKE_BOTH);
                    this.shakeScreenTimer.repeat(1 / 60, 9999, () => {
                        shakeElapsedTime += this.game.time.elapsedMS;
                        if (shakeElapsedTime >= shakeFor) {
                            shakeElapsedTime = 0;
                            this.shakeScreenTimer.stop();
                            return;
                        }
                        this.entityManager.player.loseControl();
                    });
                    this.shakeScreenTimer.start();
                });
                return gm;
            case levelManager_1.LevelId.ICE_MAN:
                return this.entityManager.createEntity(konstants_1.EntityType.ice_man, spawnPos.x * 16, spawnPos.y * 16);
            case levelManager_1.LevelId.BOMB_MAN:
            // return <BombMan>this.entityManager.createEntity(EntityType.bomb_man, spawnPos.x * 16, spawnPos.y * 16);
            case levelManager_1.LevelId.FIRE_MAN:
            // return <FireMan>this.entityManager.createEntity(EntityType.fire_man, spawnPos.x * 16, spawnPos.y * 16);
            case levelManager_1.LevelId.ELEC_MAN:
            // return <ElecMan>this.entityManager.createEntity(EntityType.elec_man, spawnPos.x * 16, spawnPos.y * 16);
            default:
                console.error('Cannot create boss for this level.');
                break;
        }
    }
    disableBoss() {
        if (this.currBoss == null || this.currBoss == undefined) {
            return;
        }
        this.currBoss.disableLogic = true;
    }
    /**
     * Checks to see if the player entered a room that is a checkpoint. If so, it saves that room index and array index locaiton.
     * This only saves the furthest checkpoint.
     */
    checkCheckpoint() {
        console.log('num checkpoints: ' + this.levelCheckpoints[0].checkpointsRoomIndex.length);
        for (let i = 0; i < this.levelCheckpoints[0].checkpointsRoomIndex.length; i++) {
            console.log('checkpointsRoomIndex: ' + this.levelCheckpoints[0].checkpointsRoomIndex[i]);
            if (this.camera.currentRoom.index == this.levelCheckpoints[0].checkpointsRoomIndex[i]) {
                this.levelCheckpoints[0].active[i] = true;
                this.checkPointRoomIndex = this.camera.currentRoom.index;
                this.checkpointArrayIndex = i;
                console.log('curr checkpoint room index: ' + this.checkPointRoomIndex);
                break;
            }
        }
    }
    clearLevel() {
        this.camera.setTarget(null);
        this.spawners.forEach((element) => {
            element.isSpawnerOnScreen = false;
            for (let j = element.entities.length - 1; j >= 0; j--) {
                element.entities.splice(j, 1);
            }
        }, this);
        this.entityManager.removeAllEntitiesExceptPlayer();
        this.entityManager.player.removeDeathEffect();
    }
    spawnPlayer() {
        console.log("Spawning player from initial Tiled position.");
        this.entityManager.player.getPosition().x = this.startingSpawnPos.x + 8;
        this.entityManager.player.getPosition().y = this.startingSpawnPos.y + 16;
        this.entityManager.player.position.x = this.entityManager.player.getPosition().x;
        this.entityManager.player.position.y = this.entityManager.player.getPosition().y;
        this.entityManager.player.alpha = 1;
        this.entityManager.player.setDefaults();
    }
    spawnPlayerAtLastCheckpoint() {
        console.log("Spawning player at last checkpoint.");
        // Set the player spawn pos to the last checkpoint location.
        this.entityManager.player.getPosition().x = this.getCheckpointSpawnPosition().x + 8;
        this.entityManager.player.getPosition().y = this.getCheckpointSpawnPosition().y + 16;
        // Immediately set the position otherwise we see mega man at his last position.
        this.entityManager.player.x = this.entityManager.player.getPosition().x;
        this.entityManager.player.y = this.entityManager.player.getPosition().y;
        this.entityManager.player.revive();
        this.entityManager.player.setDefaults();
    }
    getCheckpointSpawnPosition() {
        let x = this.levelCheckpoints[0].spawnPos[this.checkpointArrayIndex].x * 16;
        let y = this.levelCheckpoints[0].spawnPos[this.checkpointArrayIndex].y * 16;
        return new Phaser.Point(x, y);
    }
    /**
     * Creates a dust particle at a location.
     * @param x The x position to create the dust particle.
     * @param y The y position to create the dust particle.
     */
    createDust(x, y) {
        let dust = this.dustPool.getFirstDead(true);
        dust.revive();
        dust.x = x;
        dust.y = y;
        dust.animations.play('slide_dust');
    }
    /**
     * Creates a hurt dust particle at a location.
     * @param x The x position to create the hurt dust particle.
     * @param y The y position to create the hurt dust particle.
     */
    createHurtDust(x, y) {
        let hurtDust = this.hurtDustPool.getFirstDead(true);
        hurtDust.revive();
        hurtDust.x = x;
        hurtDust.y = y;
        hurtDust.animations.play('hurt_dust');
    }
    /**
     * Creates a mega man death effect particle at a location.
     * @param x The x position to create the man death effect particle.
     * @param y The y position to create the man death effect particle.
     */
    createMegaManDeathEffect(x, y) {
        var deathEffect = this.megaManDeathEffectPool.getFirstDead();
        deathEffect.revive();
        deathEffect.position.x = x;
        deathEffect.position.y = y;
        deathEffect.animations.play('mega_man_death_effect');
        return deathEffect;
    }
    /**
     * Creates an explosion effect particle at a location.
     * @param x The x position to create the explosion effect particle.
     * @param y The y position to create the explosion effect particle.
     */
    createExplosionEffect(x, y) {
        var explosionEffect = this.explosionEffectPool.getFirstDead();
        explosionEffect.revive();
        explosionEffect.position.x = x;
        explosionEffect.position.y = y;
        explosionEffect.animations.play(konstants_1.Konstants.explosion);
        return explosionEffect;
    }
    /**
     * Turns the sprite background on/off.
     */
    toggleTiles() {
        this.showSpikeTiles = !this.showSpikeTiles;
        this.showBackgroundTiles = !this.showBackgroundTiles;
        this.showForegroundTiles = !this.showForegroundTiles;
        this.levelManager.spikes.visible = this.showSpikeTiles;
        this.levelManager.background.visible = this.showBackgroundTiles;
        this.levelManager.foreground.visible = this.showForegroundTiles;
    }
    toggleShowDebug() {
        this.showDebug = !this.showDebug;
        this.graphicsDebug.clear();
    }
    /**
     * Standard pause is when the user presses s. It doesn't bring up the menu.
     */
    executeStandardPauseEvent() {
        if (this.levelCompleted) {
            return;
        }
        if (!this.isPaused) {
            this.game.sound.play(konstants_1.AudioName.pause_menu);
        }
        this.isPaused = !this.isPaused;
        this.isStandardPaused = !this.isStandardPaused;
        if (!this.isPaused) {
            if (this.entityManager.player.isOnGround) {
                this.entityManager.player.stopAllMovement();
            }
            this.entityManager.player.isWarpingIn = true;
            let warpTimer = this.game.time.create(true);
            warpTimer.add(this.pausedWarpSpeed, () => {
                this.game.sound.play(konstants_1.AudioName.megaman_warp);
                this.entityManager.player.isWarpingIn = false;
                this.entityManager.entities.forEach(element => {
                    element.togglePause();
                });
            }, this);
            warpTimer.start();
        }
        else {
            this.entityManager.entities.forEach(element => {
                element.togglePause();
            });
        }
    }
    /**
     * Shows/hides the menu. Even during standard pause.
     */
    executeMenuPauseEvent() {
        if (this.levelCompleted) {
            return;
        }
        if (this.isStandardPaused) {
            this.pauseWithMenu();
        }
        else {
            this.isPaused == true ? this.unpauseWithMenu() : this.pauseWithMenu();
        }
    }
    playStageMusic() {
        this.levelManager.playStageMusic();
    }
    pauseWithMenu() {
        this.isPaused = true;
        this.isStandardPaused = false; // no longer in standard pause; important
        this.entityManager.player.toggleMeter();
        this.entityManager.entities.forEach(element => {
            element.togglePause();
            element.toggleVisibility();
        });
        this.inventoryManager.toggleInventory();
    }
    unpauseWithMenu() {
        this.inventoryManager.inventoryMenuFullyClosed.addOnce(() => {
            this.waitForUnpauseEffect();
        }, this);
        this.inventoryManager.toggleInventory();
    }
    /**
     * Game doesn't actually unpause until mega man's warp-in animation is complete.
     * Fucking dumb animations don't work while paused or some retarded shit.
     * I disable pause on animations and it still doesn't work. wtf you fucking faggots.
     * *UPDATE*
     * I'm the biggest retard. Animations were working but I fucking enabled visiblity after...
     * so I couldn't see the animation. Retard fuck.
     */
    waitForUnpauseEffect() {
        this.entityManager.player.isWarpingIn = true;
        this.isPaused = false;
        // Mega man looks retarded if we stop him in air.
        if (this.entityManager.player.isOnGround) {
            this.entityManager.player.stopAllMovement();
        }
        this.entityManager.entities.forEach(element => {
            element.togglePause();
            element.toggleVisibility();
        });
        let warpTimer = this.game.time.create(true);
        warpTimer.add(this.pausedWarpSpeed, () => {
            this.game.sound.play(konstants_1.AudioName.megaman_warp);
            this.entityManager.player.isWarpingIn = false;
            this.entityManager.player.toggleMeter();
            this.entityManager.entities.forEach(element => {
                element.togglePause();
            });
        }, this);
        warpTimer.start();
    }
    createEntityFromSpawner(spawner) {
        let xPos = spawner.x;
        let yPos = spawner.y;
        if (spawner.respawnLocation == spawner_1.RespawnLocation.RightSideOfScreen) {
            xPos = this.game.camera.x + this.game.camera.width;
        }
        if (spawner.respawnLocation == spawner_1.RespawnLocation.LeftSideOfScreen) {
            xPos = this.game.camera.x;
        }
        let entity = this.entityManager.createEntity(spawner.entityType, xPos, yPos, spawner.properties);
        this.game.add.existing(entity);
        this.entityManager.addEntity(entity);
    }
    /**
     * Dust is a simple sprite with a simple animations. It's not needed as an entity so we'll just use it in a Group (pool)
     * and revive it when needed.
     */
    createDustPool() {
        this.dustPool = this.game.add.group();
        this.dustPool.createMultiple(10, konstants_1.Konstants.mega_man, 'slide_dust_01.png', false);
        this.dustPool.forEachDead((element) => {
            element.animations.add('slide_dust', Phaser.Animation.generateFrameNames('slide_dust_', 1, 3, '.png', 2), 7, false, false);
            element.animations.getAnimation('slide_dust').killOnComplete = true;
        }, this);
    }
    createHurtDustPool() {
        this.hurtDustPool = this.game.add.group();
        this.hurtDustPool.createMultiple(10, konstants_1.Konstants.mega_man, 'hurt_dust_01.png', false);
        this.hurtDustPool.forEachDead((element) => {
            element.animations.add('hurt_dust', Phaser.Animation.generateFrameNames('hurt_dust_', 1, 3, '.png', 2), 7, false, false);
            element.animations.getAnimation('hurt_dust').killOnComplete = true;
        }, this);
    }
    createMegaManDeathEffectPool() {
        this.megaManDeathEffectPool = this.game.add.group();
        this.megaManDeathEffectPool.createMultiple(20, konstants_1.Konstants.mega_man, 'mega_man_death_effect_01.png', false);
        this.game.physics.arcade.enable(this.megaManDeathEffectPool);
        this.megaManDeathEffectPool.forEachDead((element) => {
            element.animations.add('mega_man_death_effect', Phaser.Animation.generateFrameNames('mega_man_death_effect_', 1, 4, '.png', 2), 7, true, false);
            element.anchor.setTo(0.5, 0.5);
        }, this);
    }
    createExplosionPool() {
        this.explosionEffectPool = this.game.add.group();
        this.explosionEffectPool.createMultiple(20, konstants_1.Konstants.explosion, 'explosion_01', false);
        this.explosionEffectPool.forEachDead((element) => {
            element.animations.add(konstants_1.Konstants.explosion, ['explosion_01', 'explosion_04', 'explosion_03', 'explosion_02'], 10, false, false);
            element.anchor.setTo(0.5, 0.5);
            element.animations.getAnimation(konstants_1.Konstants.explosion).killOnComplete = true;
        }, this);
    }
    createFiniteStateMachine() {
        this.fsm = new stateMachine_1.StateMachine();
        this.fsm.addState(WorldState.spawning, new WorldSpawningState(this));
        this.fsm.addState(WorldState.running, new WorldRunningState(this));
        this.fsm.addState(WorldState.giving_energy, new WorldGivingEnergyState(this));
        this.fsm.addState(WorldState.waiting_for_reset, new WorldWaitingForResetState(this));
        this.fsm.addState(WorldState.waiting, new WorldWaitingState(this));
        this.fsm.changeState(WorldState.spawning);
    }
    checkPlayerNeedsLerp() {
        if (this.startLerp) {
            this.lerpElapsedTime += this.game.time.elapsedMS;
            switch (this.camera.goingTo) {
                case camera_1.GoingTo.Left:
                    this.entityManager.player.getPosition().x = mathutil_1.MathUtil.lerp(this.playerStartX, this.playerEndX, this.lerpElapsedTime / this.lerpEndTime);
                    this.entityManager.player.position.x = this.entityManager.player.getPosition().x;
                    break;
                case camera_1.GoingTo.Right:
                    this.entityManager.player.getPosition().x = mathutil_1.MathUtil.lerp(this.playerStartX, this.playerEndX, this.lerpElapsedTime / this.lerpEndTime);
                    this.entityManager.player.position.x = this.entityManager.player.getPosition().x;
                    break;
                case camera_1.GoingTo.Up:
                    this.entityManager.player.getPosition().y = mathutil_1.MathUtil.lerp(this.playerStartY, this.playerEndY, this.lerpElapsedTime / this.lerpEndTime);
                    this.entityManager.player.position.y = this.entityManager.player.getPosition().y;
                    break;
                case camera_1.GoingTo.Down:
                    this.entityManager.player.getPosition().y = mathutil_1.MathUtil.lerp(this.playerStartY, this.playerEndY, this.lerpElapsedTime / this.lerpEndTime);
                    this.entityManager.player.position.y = this.entityManager.player.getPosition().y;
                    break;
                default:
                    console.error("GoingTo went terribly wrong!");
                    break;
            }
        }
    }
}
exports.World = World;
class WorldSpawningState {
    constructor(actor) {
        this.name = WorldState.spawning;
        this.elapsedTime = 0;
        this.endTime = 1000;
        this.startX = 0;
        this.startY = 0;
        this.endX = 0;
        this.endY = 0;
        this.showingSpawnEffect = false;
        this.warpDownElapsedTime = 0;
        this.warpDownEndTime = 200;
        this.showingWarpInEffect = false;
        this.spawnPos = new Phaser.Point();
        this.actor = actor;
        this.readyBitmapText = this.actor.game.make.bitmapText(0, 0, 'myfont', 'READY', 8);
        this.actor.game.add.existing(this.readyBitmapText);
        this.spawnEffect = this.actor.game.add.sprite(0, 0, konstants_1.Konstants.mega_man, 'spawn_effect.png');
        this.actor.game.add.existing(this.spawnEffect);
        this.spawnEffect.kill();
        this.warpInEffect = this.actor.game.add.sprite(0, 0, konstants_1.Konstants.mega_man, 'warp_in_effect_01.png');
        this.warpInEffect.animations.add(konstants_1.Konstants.warp_in_effect, ['warp_in_effect_01.png', 'warp_in_effect_02.png', 'warp_in_effect_01.png'], 13, false, false);
        this.warpInEffect.anchor.setTo(0.5);
        this.actor.game.add.existing(this.warpInEffect);
        this.warpInEffect.kill();
    }
    enter() {
        console.log("ENTER: " + this.name);
        this.initialized = true;
        this.populateSpawnPosition();
        this.readyBitmapText.x = this.actor.camera.currentRoom.bounds.x + 128;
        this.readyBitmapText.y = this.actor.camera.currentRoom.bounds.y + 100;
        this.startY = 0;
        this.endY = this.spawnPos.y - 8;
        this.readyBitmapText.visible = true;
        this.actor.playStageMusic();
        this.actor.resetDoors();
    }
    update() {
        this.elapsedTime += this.actor.game.time.elapsedMS;
        if (this.elapsedTime >= this.endTime && !this.showingSpawnEffect && !this.showingWarpInEffect) {
            this.spawnEffect.position.x = this.spawnPos.x;
            this.spawnEffect.revive();
            this.showingSpawnEffect = true;
            this.readyBitmapText.visible = false;
            this.elapsedTime = 0;
            return;
        }
        if (this.showingSpawnEffect && !this.showingWarpInEffect) {
            this.warpDownElapsedTime += this.actor.game.time.elapsedMS;
            this.spawnEffect.position.y = mathutil_1.MathUtil.lerp(this.startY, this.endY, this.warpDownElapsedTime / this.warpDownEndTime);
            if (this.warpDownElapsedTime >= this.warpDownEndTime) {
                this.warpDownElapsedTime = 0;
                this.spawnEffect.kill();
                this.warpInEffect.revive();
                this.warpInEffect.play(konstants_1.Konstants.warp_in_effect);
                this.warpInEffect.position.x = this.spawnPos.x + 8;
                this.warpInEffect.position.y = this.spawnPos.y;
                this.showingSpawnEffect = false;
                this.showingWarpInEffect = true;
            }
        }
        if (this.showingWarpInEffect) {
            if (this.warpInEffect.animations.currentAnim.isFinished) {
                this.actor.game.sound.play(konstants_1.AudioName.megaman_warp);
                this.showingSpawnEffect = false;
                this.showingWarpInEffect = false;
                this.warpInEffect.kill();
                if (this.actor.initialSpawn) {
                    this.actor.spawnPlayer();
                    this.actor.initialSpawn = false;
                }
                else {
                    this.actor.spawnPlayerAtLastCheckpoint();
                    this.actor.camera.setTarget(this.actor.entityManager.player);
                }
                this.actor.fsm.changeState(WorldState.running);
                return;
            }
        }
    }
    exit() {
        console.log("EXIT: " + this.name);
        this.initialized = false;
        this.elapsedTime = 0;
        this.showingSpawnEffect = false;
        this.showingWarpInEffect = false;
        this.warpInEffect.kill();
        this.warpInEffect.animations.stop();
        this.warpDownElapsedTime = 0;
        this.spawnEffect.kill();
    }
    populateSpawnPosition() {
        if (this.actor.initialSpawn) {
            this.spawnPos.x = this.actor.startingSpawnPos.x;
            this.spawnPos.y = this.actor.startingSpawnPos.y;
        }
        else {
            this.spawnPos.x = this.actor.getCheckpointSpawnPosition().x;
            this.spawnPos.y = this.actor.getCheckpointSpawnPosition().y;
        }
    }
}
class WorldRunningState {
    constructor(actor) {
        this.name = WorldState.running;
        this.actor = actor;
    }
    enter() {
        console.log("ENTER: " + this.name);
        this.initialized = true;
    }
    update() {
        if (this.actor.sKey.justDown) {
            this.actor.executeStandardPauseEvent();
        }
        if (this.actor.eKey.justDown) {
            this.actor.executeMenuPauseEvent();
        }
        if (this.actor.upKey.justDown) {
            if (this.actor.inventoryManager.isOpen)
                this.actor.inventoryManager.cycleInventoryUp();
        }
        if (this.actor.downKey.justDown) {
            if (this.actor.inventoryManager.isOpen)
                this.actor.inventoryManager.cycleInventoryDown();
        }
        if (this.actor.isPaused) {
            return;
        }
        this.actor.entityManager.update();
        this.actor.vanishingBlockManager.update();
        this.actor.collisionManager.update();
        this.actor.entityManager.clean();
        this.actor.camera.update();
        this.actor.debugDrawManager.update();
    }
    exit() {
        console.log("EXIT: " + this.name);
        this.initialized = false;
    }
}
class WorldGivingEnergyState {
    constructor(actor) {
        this.name = WorldState.giving_energy;
        this.actor = actor;
    }
    enter() {
        console.log('ENTER: ' + this.name);
        this.initialized = true;
    }
    update() {
    }
    exit() {
        console.log("EXIT: " + this.name);
        this.initialized = false;
    }
}
class WorldWaitingForResetState {
    constructor(actor) {
        this.name = WorldState.waiting_for_reset;
        this.elapsedTime = 0;
        this.endTime = 3000;
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
        console.log('ENTER: ' + this.name);
    }
    update() {
        this.actor.entityManager.update();
        this.actor.debugDrawManager.update();
        this.actor.collisionManager.update();
        this.elapsedTime += this.actor.game.time.elapsedMS;
        if (this.elapsedTime >= this.endTime) {
            this.actor.fsm.changeState(WorldState.waiting);
        }
    }
    exit() {
        console.log("EXIT: " + this.name);
        this.initialized = false;
        this.elapsedTime = 0;
    }
}
class WorldWaitingState {
    constructor(actor) {
        this.name = WorldState.waiting;
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
        console.log('ENTER: ' + this.name);
        this.actor.game.camera.fade(0, 100, true);
    }
    update() {
        this.actor.entityManager.update();
        this.actor.debugDrawManager.update();
    }
    exit() {
        console.log("EXIT: " + this.name);
        this.initialized = false;
    }
}


/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EntityManager = void 0;
const player_1 = __webpack_require__(15);
const playerInput_1 = __webpack_require__(26);
const playerGraphics_1 = __webpack_require__(28);
const konstants_1 = __webpack_require__(2);
const blader_1 = __webpack_require__(30);
const met_1 = __webpack_require__(35);
const beak_1 = __webpack_require__(36);
const sniperJoe_1 = __webpack_require__(37);
const bombomb_1 = __webpack_require__(38);
const bombomb_shrapnel_1 = __webpack_require__(39);
const spine_1 = __webpack_require__(40);
const octopusBattery_1 = __webpack_require__(41);
const killerBullet_1 = __webpack_require__(42);
const explosion_1 = __webpack_require__(43);
const screw_bomber_1 = __webpack_require__(44);
const super_cutter_1 = __webpack_require__(45);
const watcher_1 = __webpack_require__(46);
const peng_1 = __webpack_require__(47);
const big_eye_1 = __webpack_require__(48);
const flea_1 = __webpack_require__(50);
const flying_shell_1 = __webpack_require__(51);
const spike_1 = __webpack_require__(52);
const cut_man_1 = __webpack_require__(53);
const guts_man_1 = __webpack_require__(57);
const ice_man_1 = __webpack_require__(58);
const powerup_1 = __webpack_require__(59);
const vanishingBlock_1 = __webpack_require__(60);
const bullet_1 = __webpack_require__(49);
const pick_1 = __webpack_require__(61);
const pickBulletMovement_1 = __webpack_require__(62);
const debug_1 = __webpack_require__(5);
const gameData_1 = __webpack_require__(6);
const levelManager_1 = __webpack_require__(7);
const throwableObject_1 = __webpack_require__(63);
const drop_lift_1 = __webpack_require__(64);
const picket_man_1 = __webpack_require__(65);
const crazy_razy_1 = __webpack_require__(66);
const crazy_razy_fly_1 = __webpack_require__(67);
const foot_holder_1 = __webpack_require__(68);
class EntityManager {
    constructor(game, world) {
        this.game = game;
        this.world = world;
        this.entities = new Array();
        this.surfaces = new Array();
        this.ladders = new Array();
        this.stop = false;
        this.tempEntity = null;
        this.tempRect = new Phaser.Rectangle(0, 0, 0, 0);
        this.game = game;
        this.world = world;
        this.g = this.game.add.graphics();
        this.game.add.existing(this.g);
        this.allowDrawHitboxes = debug_1.Debug.AllowDrawHitboxes;
    }
    update() {
        if (this.stop) {
            return;
        }
        this.entities.forEach((entity) => {
            if (entity.alive) {
                entity.manualUpdate();
            }
        });
    }
    drawHitboxes(entity) {
        if (!this.allowDrawHitboxes) {
            return;
        }
        this.g.clear();
        if (entity.myEntityType == konstants_1.EntityType.player) {
            this.g.lineStyle(1);
            this.g.beginFill(0x00ff00, 0.5);
            this.g.drawRect(entity.hitbox.x, entity.hitbox.y, entity.hitbox.width, entity.hitbox.height);
        }
    }
    clean() {
        for (let i = 0; i < this.entities.length; i++) {
            if (this.entities[i].tag == konstants_1.TagType.player) {
                continue;
            }
            if (!this.entities[i].alive) {
                this.entities.splice(i, 1);
            }
        }
    }
    addPlayer(player) {
        if (this.player != null) {
            return;
        }
        this.player = player;
        this.addEntity(player);
    }
    createPlayer(x, y) {
        let playerInput = new playerInput_1.PlayerInput(this.game);
        let playerGraphics = new playerGraphics_1.PlayerGraphics(this.game);
        return new player_1.Player(playerInput, playerGraphics, this.world, konstants_1.TagType.player, konstants_1.EntityType.player, this.game, x, y, konstants_1.Konstants.mega_man, '');
    }
    createEntity(entityType, x, y, properties = null) {
        console.log("Create: " + entityType);
        switch (entityType) {
            case konstants_1.EntityType.cut_man:
                let cm = new cut_man_1.CutMan(this.world, konstants_1.TagType.enemy, entityType, this.game, x, y, entityType, 'throw_01');
                cm.contactDamage = 4000;
                cm.bossData = gameData_1.GameData.BossDatas.filter((value) => {
                    return value.name == levelManager_1.LevelId.CUT_MAN;
                })[0];
                return cm;
            case konstants_1.EntityType.guts_man:
                let gm = new guts_man_1.GutsMan(this.world, konstants_1.TagType.enemy, entityType, this.game, x, y, entityType, '');
                gm.contactDamage = 4000;
                gm.bossData = gameData_1.GameData.BossDatas.filter((value) => {
                    return value.name == levelManager_1.LevelId.GUTS_MAN;
                })[0];
                return gm;
            case konstants_1.EntityType.ice_man:
                let im = new ice_man_1.IceMan(this.world, konstants_1.TagType.enemy, entityType, this.game, x, y, entityType, '');
                im.contactDamage = 4000;
                im.bossData = gameData_1.GameData.BossDatas.filter((value) => {
                    return value.name == levelManager_1.LevelId.ICE_MAN;
                })[0];
                return im;
            case konstants_1.EntityType.bomb_man:
                break;
            case konstants_1.EntityType.fire_man:
                break;
            case konstants_1.EntityType.elec_man:
                break;
            case konstants_1.EntityType.met:
                let met = new met_1.Met(this.world, konstants_1.TagType.enemy, entityType, this.game, x, y, entityType, '');
                met.contactDamage = 1;
                return met;
            case konstants_1.EntityType.blader:
                let b = new blader_1.Blader(this.world, konstants_1.TagType.enemy, entityType, this.game, x, y, entityType, '');
                b.contactDamage = 1000;
                return b;
            case konstants_1.EntityType.beak:
                let beak = new beak_1.Beak(this.world, konstants_1.TagType.enemy, entityType, this.game, x, y, entityType, '');
                beak.contactDamage = 1;
                beak.setDirectionFromRotation(properties.rotation);
                return beak;
            case konstants_1.EntityType.sniper_joe:
                let sj = new sniperJoe_1.SniperJoe(this.world, konstants_1.TagType.enemy, entityType, this.game, x, y, entityType, '');
                sj.contactDamage = 1;
                return sj;
            case konstants_1.EntityType.bombomb:
                let bombomb = new bombomb_1.Bombomb(this.world, konstants_1.TagType.enemy, entityType, this.game, x, y, entityType, '');
                bombomb.contactDamage = 1;
                return bombomb;
            case konstants_1.EntityType.bombomb_shrapnel:
                let shrap = new bombomb_shrapnel_1.BombombShrapnel(this.world, konstants_1.TagType.enemy, entityType, this.game, x, y, konstants_1.EntityType.bombomb, ''); // we pass bombomb_blue explicity because thats the spritesheet atlas
                shrap.contactDamage = 1;
                return shrap;
            case konstants_1.EntityType.spine:
                let spine = new spine_1.Spine(this.world, konstants_1.TagType.enemy, entityType, this.game, x, y, entityType, '');
                spine.contactDamage = 1;
                return spine;
            case konstants_1.EntityType.octopus_battery:
                let ob = new octopusBattery_1.OctopusBattery(this.world, konstants_1.TagType.enemy, entityType, this.game, x, y, entityType, '');
                ob.contactDamage = 1;
                ob.speed = properties.speed;
                ob.horizontal = properties.horizontal;
                ob.vertical = properties.vertical;
                return ob;
            case konstants_1.EntityType.spike:
                let spike = new spike_1.Spike(this.world, konstants_1.TagType.enemy, entityType, this.game, x, y, entityType, '');
                spike.contactDamage = 9999;
                return spike;
            case konstants_1.EntityType.killer_bullet:
                let kb = new killerBullet_1.KillerBullet(this.world, konstants_1.TagType.enemy, entityType, this.game, x, y, entityType, '');
                kb.contactDamage = 1;
                return kb;
            case konstants_1.EntityType.explosion_from_killer_bullet:
                let explosion = new explosion_1.Explosion(this.world, konstants_1.TagType.enemy, entityType, this.game, x, y, entityType, '');
                explosion.contactDamage = 4;
                return explosion;
            case konstants_1.EntityType.screw_bomber:
                let sb = new screw_bomber_1.ScrewBomber(this.world, konstants_1.TagType.enemy, entityType, this.game, x, y, entityType, '');
                sb.contactDamage = 2;
                sb.setMountByRotation(properties.rotation);
                return sb;
            case konstants_1.EntityType.super_cutter:
                let sc = new super_cutter_1.SuperCutter(this.world, konstants_1.TagType.enemy, entityType, this.game, x, y, entityType, '');
                sc.contactDamage = 4;
                return sc;
            case konstants_1.EntityType.big_eye:
                let be = new big_eye_1.BigEye(this.world, konstants_1.TagType.enemy, entityType, this.game, x, y, entityType, '');
                be.contactDamage = 4;
                return be;
            case konstants_1.EntityType.flea:
                let flea = new flea_1.Flea(this.world, konstants_1.TagType.enemy, entityType, this.game, x, y, entityType, '');
                flea.contactDamage = 4;
                return flea;
            case konstants_1.EntityType.flying_shell:
                let fs = new flying_shell_1.FlyingShell(this.world, konstants_1.TagType.enemy, entityType, this.game, x, y, entityType, '');
                fs.contactDamage = 4;
                return fs;
            case konstants_1.EntityType.watcher:
                let w = new watcher_1.Watcher(this.world, konstants_1.TagType.enemy, entityType, this.game, x, y, entityType, '');
                w.spawnDelay = properties.spawnDelay;
                w.direction = properties.direction;
                w.initialize();
                w.contactDamage = 4;
                return w;
            case konstants_1.EntityType.peng:
                let p = new peng_1.Peng(this.world, konstants_1.TagType.enemy, entityType, this.game, x, y, entityType, '');
                p.contactDamage = 4;
                return p;
            case konstants_1.EntityType.picket_man:
                let pm = new picket_man_1.PicketMan(this.world, konstants_1.TagType.enemy, konstants_1.EntityType.picket_man, this.game, x, y, konstants_1.EntityType.picket_man, 'picket_man_01');
                pm.contactDamage = 4;
                return pm;
            case konstants_1.EntityType.crazy_razy:
                let cr = new crazy_razy_1.CrazyRazy(this.world, konstants_1.TagType.enemy, entityType, this.game, x, y, entityType, 'crazy_razy_walk_01');
                cr.contactDamage = 4;
                cr.events.onKilled.addOnce(() => {
                    cr.killLegs();
                }, this);
                cr.horizontalSpeed = 80;
                return cr;
            case konstants_1.EntityType.crazy_razy_fly:
                let crf = new crazy_razy_fly_1.CrazyRazyFly(this.world, konstants_1.TagType.enemy, entityType, this.game, x, y, konstants_1.EntityType.crazy_razy, 'crazy_razy_fly');
                crf.contactDamage = 4;
                crf.horizontalSpeed = 80;
                return crf;
            case konstants_1.EntityType.vanishing_block:
                this.tempEntity = new vanishingBlock_1.VanishingBlock(this.world, konstants_1.TagType.platform, entityType, this.game, x, y, entityType, 'vanishing_block_01');
                this.tempEntity.hitbox = new Phaser.Rectangle(x, y, 16, 16);
                return this.tempEntity;
            case konstants_1.EntityType.foot_holder:
                this.tempEntity = new foot_holder_1.FootHolder(this.world, konstants_1.TagType.platform, entityType, this.game, x, y, entityType, 'foot_holder_01');
                let width = 24;
                let v0 = new Phaser.Point(x - 12, y - 12); // top-left
                let v1 = new Phaser.Point(x - 12 + width, y - 12); // top-right
                let dir1 = v1.clone().subtract(v0.x, v0.y).normalize(); // top face
                let surface = { p1: v0, p2: v1, dir: dir1, collidable: true, isMovingPlatform: true, targetSpeed: new Phaser.Point() };
                this.surfaces.push(surface);
                this.tempEntity.horizontalSpeed = 30;
                this.tempEntity.setSurface(surface);
                this.tempEntity.setNumTiles(properties.numLeftTiles, properties.numRightTiles);
                this.tempEntity.initialize();
                return this.tempEntity;
            case konstants_1.EntityType.cut_man_boss_item:
            case konstants_1.EntityType.bomb_man_boss_item:
            case konstants_1.EntityType.fire_man_boss_item:
            case konstants_1.EntityType.elec_man_boss_item:
                this.tempEntity = new powerup_1.PowerUp(this.world, konstants_1.TagType.power_up, entityType, this.game, x, y, konstants_1.Konstants.items, 'base_boss_item');
                this.tempEntity.hitbox = new Phaser.Rectangle(x, y, 16, 16);
                this.tempEntity.hitboxOffset.x = 0;
                this.tempEntity.hitboxOffset.y = -16;
                this.tempEntity.animations.add('glow', ['base_boss_item', 'red_boss_item'], 10, true);
                this.tempEntity.animations.play('glow');
                return this.tempEntity;
            case konstants_1.EntityType.guts_man_boss_item:
                this.tempEntity = new powerup_1.PowerUp(this.world, konstants_1.TagType.power_up, entityType, this.game, x, y, konstants_1.Konstants.items, 'base_boss_item');
                this.tempEntity.hitbox = new Phaser.Rectangle(x, y, 16, 16);
                this.tempEntity.hitboxOffset.x = 0;
                this.tempEntity.hitboxOffset.y = -16;
                this.tempEntity.animations.add('glow', ['base_boss_item', 'orange_boss_item'], 10, true);
                this.tempEntity.animations.play('glow');
                return this.tempEntity;
            case konstants_1.EntityType.ice_man_boss_item:
                this.tempEntity = new powerup_1.PowerUp(this.world, konstants_1.TagType.power_up, entityType, this.game, x, y, konstants_1.Konstants.items, 'base_boss_item');
                this.tempEntity.hitbox = new Phaser.Rectangle(x, y, 16, 16);
                this.tempEntity.hitboxOffset.x = 0;
                this.tempEntity.hitboxOffset.y = -16;
                this.tempEntity.animations.add('glow', ['base_boss_item', 'blue_boss_item'], 10, true);
                this.tempEntity.animations.play('glow');
                return this.tempEntity;
            default:
                console.error("This type does not exist: " + entityType);
                break;
        }
    }
    createDropLift(x, y, path, delay) {
        console.log('Create ' + konstants_1.EntityType.drop_lift);
        let dropLift = new drop_lift_1.DropLift(this.world, konstants_1.TagType.platform, konstants_1.EntityType.drop_lift, this.game, x, y, konstants_1.EntityType.drop_lift, 'drop_lift_01');
        dropLift.health = 1;
        dropLift.maxHealth = 1;
        dropLift.isShielded = false;
        dropLift.hitbox = new Phaser.Rectangle(x, y, 32, 16);
        dropLift.updateRect();
        dropLift.setPath(path.split(',')); // string[]
        dropLift.horizontalSpeed = 50;
        dropLift.setDelay(delay);
        return dropLift;
    }
    createBasicBullet(owner, startX, startY, width, height, key, bulletEntityType, frame) {
        console.log('Create ' + bulletEntityType);
        let bullet = new bullet_1.Bullet(owner, this.world, konstants_1.TagType.bullet, bulletEntityType, this.game, startX, startY, key, frame);
        this.game.add.existing(bullet);
        this.addEntity(bullet);
        bullet.hitbox = new Phaser.Rectangle(startX, startY, width, height);
        bullet.hitbox.width = width;
        bullet.hitbox.height = height;
        bullet.hitboxOffset.x = -width * 0.5;
        bullet.hitboxOffset.y = -height * 0.5;
        bullet.updateRect();
        this.game.add.existing(bullet);
        this.addEntity(bullet);
        return bullet;
    }
    /**
     * Bullets that use bitmapdata so that you can easily use a different color.
     * @param owner
     * @param startX
     * @param startY
     * @param width
     * @param height
     * @param key
     * @param bulletEntityType
     */
    createBitmapBullet(owner, startX, startY, width, height, key, bulletEntityType) {
        console.log('Create ' + bulletEntityType);
        let bmd = this.game.make.bitmapData(width, height);
        let standardBullet = this.game.make.sprite(0, 0, key);
        bmd.copy(standardBullet, 0, 0, width, height);
        bmd.update();
        bmd.processPixelRGB((color, x, y) => {
            switch (bulletEntityType) {
                case konstants_1.EntityType.met_bullet:
                    return this.changeColor(color, 255, 164, 64);
                case konstants_1.EntityType.sniper_joe_bullet:
                    return this.changeColor(color, 88, 220, 80);
                case konstants_1.EntityType.beak_bullet:
                    return this.changeColor(color, 228, 0, 88);
                case konstants_1.EntityType.foot_holder_bullet:
                    return this.changeColor(color, 255, 164, 64);
            }
        }, this);
        let bullet = new bullet_1.Bullet(owner, this.world, konstants_1.TagType.bullet, bulletEntityType, this.game, startX, startY, bmd);
        bullet.hitbox = new Phaser.Rectangle(startX, startY, width, height);
        bullet.hitboxOffset.x = -width * 0.5;
        bullet.hitboxOffset.y = -height * 0.5;
        bullet.updateRect();
        this.game.add.existing(bullet);
        this.addEntity(bullet);
        return bullet;
    }
    createLaserBullet(owner, startX, startY, width, height, key, bulletEntityType) {
        console.log('Create ' + bulletEntityType);
        let laser = new bullet_1.Bullet(owner, this.world, konstants_1.TagType.bullet, bulletEntityType, this.game, startX, startY, key);
        this.game.add.existing(laser);
        this.addEntity(laser);
        laser.animations.add('idle', ['laser_beam_01', 'laser_beam_02'], 10, true, false);
        laser.animations.play('idle');
        laser.hitbox = new Phaser.Rectangle(startX, startY, width, height);
        laser.hitbox.width = width;
        laser.hitbox.height = height;
        laser.hitboxOffset.x = -width * 0.5;
        laser.hitboxOffset.y = -height * 0.5;
        laser.updateRect();
        return laser;
    }
    createThrowableObject(owner, startX, startY, width, height, offsetX, offsetY, largeKey, largeStartFrame, smallKey, smallStartFrame, entityType) {
        // console.log('Create ' + entityType);
        let to = new throwableObject_1.ThrowableObject(owner, this.world, konstants_1.TagType.bullet, entityType, this.game, startX, startY, largeKey, largeStartFrame);
        to.setHitboxAsRect(startX, startY, width, height, offsetX, offsetY);
        to.updateRect();
        to.setBreakableParameters(smallKey, smallStartFrame);
        // to.contactDamage=4;
        this.addEntity(to);
        this.game.add.existing(to);
        return to;
    }
    createPick(owner, startX, startY, targetX, targetY, width, height, key, entityType) {
        let pick = new pick_1.Pick(owner, this.world, konstants_1.TagType.bullet, entityType, this.game, startX, startY, key);
        pick.animations.add('spin', ['picket_man_weapon_01', 'picket_man_weapon_02', 'picket_man_weapon_03', 'picket_man_weapon_04'], 10, true, false);
        pick.animations.play('spin');
        pick.hitbox = new Phaser.Rectangle(startX, startX, width, height);
        pick.hitboxOffset.x = -width * 0.5;
        pick.hitboxOffset.y = -height * 0.5;
        pick.updateRect();
        pick.bulletMovement = new pickBulletMovement_1.PickBulletMovement(pick, new Phaser.Point(startX, startY), new Phaser.Point(targetX, targetY), 1, -450);
        this.game.add.existing(pick);
        this.addEntity(pick);
        return pick;
    }
    createPowerUp(type, x, y, isGlobal) {
        console.log('Create: ' + type);
        switch (type) {
            case konstants_1.EntityType.energy_pellet_small:
                this.tempEntity = new powerup_1.PowerUp(this.world, konstants_1.TagType.power_up, type, this.game, x, y, konstants_1.Konstants.items, 'energy_pellet_small');
                this.tempEntity.energyRestore = 3;
                this.tempEntity.animations.add('idle', ['energy_pellet_small'], 10, false, false);
                this.tempEntity.animations.play('idle');
                if (isGlobal) {
                    this.tempEntity.isGlobal = isGlobal;
                    this.tempEntity.getPosition().x = x + 8;
                    this.tempEntity.getPosition().y = y - 8;
                    this.tempEntity.position.x = this.tempEntity.getPosition().x;
                    this.tempEntity.position.y = this.tempEntity.getPosition().y;
                }
                this.tempEntity.setHitboxAsRect(x, y, 10, 12, -5, -6);
                this.tempEntity.updateRect();
                return this.tempEntity;
            case konstants_1.EntityType.energy_pellet_large:
                this.tempEntity = new powerup_1.PowerUp(this.world, konstants_1.TagType.power_up, type, this.game, x, y, konstants_1.Konstants.items, 'energy_pellet_large_02');
                this.tempEntity.energyRestore = 9;
                this.tempEntity.animations.add('idle', ['energy_pellet_large_01', 'energy_pellet_large_02'], 10, true, false);
                this.tempEntity.animations.play('idle');
                if (isGlobal) {
                    this.tempEntity.isGlobal = isGlobal;
                    this.tempEntity.getPosition().x = x + 8;
                    this.tempEntity.getPosition().y = y - 8;
                    this.tempEntity.position.x = this.tempEntity.getPosition().x;
                    this.tempEntity.position.y = this.tempEntity.getPosition().y;
                }
                this.tempEntity.setHitboxAsRect(x, y, 16, 16, -8, -8);
                this.tempEntity.updateRect();
                return this.tempEntity;
            case konstants_1.EntityType.weapon_energy_small:
                this.tempEntity = new powerup_1.PowerUp(this.world, konstants_1.TagType.power_up, type, this.game, x, y, konstants_1.Konstants.items, 'weapon_energy_small');
                this.tempEntity.energyRestore = 3;
                this.tempEntity.animations.add('idle', ['weapon_energy_small'], 10, false, false);
                this.tempEntity.animations.play('idle');
                if (isGlobal) {
                    this.tempEntity.isGlobal = isGlobal;
                    this.tempEntity.getPosition().x = x + 8;
                    this.tempEntity.getPosition().y = y - 8;
                    this.tempEntity.position.x = this.tempEntity.getPosition().x;
                    this.tempEntity.position.y = this.tempEntity.getPosition().y;
                }
                this.tempEntity.setHitboxAsRect(x, y, 12, 8, -6, 0);
                this.tempEntity.updateRect();
                return this.tempEntity;
            case konstants_1.EntityType.weapon_energy_large:
                this.tempEntity = new powerup_1.PowerUp(this.world, konstants_1.TagType.power_up, type, this.game, x, y, konstants_1.Konstants.items, 'weapon_energy_large_02');
                this.tempEntity.energyRestore = 9;
                this.tempEntity.animations.add('idle', ['weapon_energy_large_01', 'weapon_energy_large_02'], 10, true, false);
                this.tempEntity.animations.play('idle');
                if (isGlobal) {
                    this.tempEntity.isGlobal = isGlobal;
                    this.tempEntity.getPosition().x = x + 8;
                    this.tempEntity.getPosition().y = y - 8;
                    this.tempEntity.position.x = this.tempEntity.getPosition().x;
                    this.tempEntity.position.y = this.tempEntity.getPosition().y;
                }
                this.tempEntity.setHitboxAsRect(x, y, 16, 12, -8, -4);
                this.tempEntity.updateRect();
                return this.tempEntity;
            case konstants_1.EntityType.robot_crystal:
                this.tempEntity = new powerup_1.PowerUp(this.world, konstants_1.TagType.power_up, type, this.game, x, y, konstants_1.Konstants.items, 'robot_crystal');
                if (isGlobal) {
                    this.tempEntity.isGlobal = isGlobal;
                    this.tempEntity.getPosition().x = x + 8;
                    this.tempEntity.getPosition().y = y - 8;
                    this.tempEntity.position.x = this.tempEntity.getPosition().x;
                    this.tempEntity.position.y = this.tempEntity.getPosition().y;
                }
                this.tempEntity.setHitboxAsRect(x, y, 8, 8, -4, -0);
                this.tempEntity.updateRect();
                return this.tempEntity;
            case konstants_1.EntityType.one_up:
                this.tempEntity = new powerup_1.PowerUp(this.world, konstants_1.TagType.power_up, type, this.game, x, y, konstants_1.Konstants.items, 'one_up');
                if (isGlobal) {
                    this.tempEntity.isGlobal = isGlobal;
                    this.tempEntity.getPosition().x = x + 8;
                    this.tempEntity.getPosition().y = y - 8;
                    this.tempEntity.position.x = this.tempEntity.getPosition().x;
                    this.tempEntity.position.y = this.tempEntity.getPosition().y;
                }
                this.tempEntity.setHitboxAsRect(x, y, 16, 16, -8, -8);
                this.tempEntity.updateRect();
                return this.tempEntity;
            default:
                console.error('This power up does not exist!');
                break;
        }
    }
    /**
     * Changes the passed in color to the r,g,b.
     * @param color
     * @param r
     * @param g
     * @param b
     */
    changeColor(color, r, g, b) {
        color.r = color.r == 160 ? r : color.r;
        color.g = color.g == 160 ? g : color.g;
        color.b = color.b == 160 ? b : color.b;
        return color;
    }
    addEntity(entity) {
        this.entities.push(entity);
    }
    removeAllEntitiesExceptPlayer() {
        for (let i = this.entities.length - 1; i >= 0; i--) {
            if (this.entities[i].myEntityType == konstants_1.EntityType.player) {
                continue;
            }
            // Don't remove spike...until I figure out a smarter way to cull this shit.
            if (this.entities[i].myEntityType == konstants_1.EntityType.spike) {
                continue;
            }
            // Don't remove vanishing block...its not a spawner...maybe I should make it one.
            if (this.entities[i].tag == konstants_1.TagType.platform) {
                continue;
            }
            if (this.entities[i].tag == konstants_1.TagType.power_up) {
                if (this.entities[i].isGlobal) {
                    continue;
                }
            }
            this.entities[i].kill();
            this.entities.splice(i, 1);
        }
    }
    addSurface(surface) {
        this.surfaces.push(surface);
    }
    addLadder(ladder) {
        this.ladders.push(ladder);
    }
}
exports.EntityManager = EntityManager;


/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Player = exports.MegaManAnimations = void 0;
const konstants_1 = __webpack_require__(2);
const entity_1 = __webpack_require__(16);
const sat2d_1 = __webpack_require__(17);
const ray_1 = __webpack_require__(19);
const ray_2 = __webpack_require__(19);
const vector2_1 = __webpack_require__(20);
const helper_1 = __webpack_require__(24);
const weapon_1 = __webpack_require__(4);
const meter_1 = __webpack_require__(25);
const main_1 = __webpack_require__(0);
const debug_1 = __webpack_require__(5);
var MegaManAnimations;
(function (MegaManAnimations) {
    MegaManAnimations["idle"] = "idle";
    MegaManAnimations["run"] = "run";
    MegaManAnimations["jump"] = "jump";
    MegaManAnimations["slide"] = "slide";
    MegaManAnimations["blink"] = "blink";
    MegaManAnimations["hurt"] = "hurt";
    MegaManAnimations["idle_shoot"] = "idle_shoot";
    MegaManAnimations["run_shoot"] = "run_shoot";
    MegaManAnimations["jump_shoot"] = "jump_shoot";
    MegaManAnimations["ladder_shoot"] = "ladder_shoot";
    MegaManAnimations["ladder"] = "ladder";
    MegaManAnimations["ladder_idle"] = "ladder_idle";
    MegaManAnimations["throw"] = "throw";
    MegaManAnimations["jump_throw"] = "jump_throw";
    MegaManAnimations["ladder_throw"] = "ladder_throw";
    MegaManAnimations["unpause_effect"] = "unpause_effect";
    MegaManAnimations["lose_control"] = "lose_control";
})(MegaManAnimations = exports.MegaManAnimations || (exports.MegaManAnimations = {}));
/**
 * The player's position is the bottom middle center. The anchor point.
 */
class Player extends entity_1.Entity {
    // private pGraphicsDebug: Phaser.Graphics;
    constructor(input, graphics, myWorld, tag, e, game, x, y, key, frame) {
        super(myWorld, tag, e, game, x, y, key, frame);
        this.switchedWeapon = new Phaser.Signal();
        this.isWarpingIn = false;
        this.horizontalSpeed = 90;
        this.isRunning = false;
        this.idleElapsedTime = 0;
        this.blinkStartTime = 2500; // After some time player will play idle animation after (ms) passed.
        this.isIdle = false; // The player has not moved for some time.
        this.isJumping = false;
        this.canJumpInAir = true;
        this.jumpInAirElapsedTime = 0;
        this.jumpInAirEndTime = 500;
        this.airJumpWindow = false;
        this.isFalling = false;
        this.useGravity = true;
        this.targetSpeed = new Phaser.Point(0, 0);
        this.jumpSpeed = 100;
        this.isOnGround = false;
        this.isSliding = false;
        this.slideSpeed = 160;
        this.slideElapsedTime = 0;
        this.slideEndTime = 400;
        this.isHurt = false;
        this.hurtElapsedTime = 0;
        this.hurtEndTime = 500;
        this.damageDir = new Phaser.Point;
        this.isInvincible = false;
        this.invincibleElapsedTime = 0;
        this.invincibleEndTime = 1300;
        this.isBlinking = false;
        this.blinkingElapsedTime = 0;
        this.blinkingEndTime = 1300;
        this.blinkRate = 2;
        this.blinkCounter = 0;
        this.whiteEffectMaxCounter = 12;
        this.deathEffects = new Array();
        this.isTouchingLadder = false;
        this.isOnLadder = false;
        this.ladderShootingDir = -1;
        this.ladderSpeed = 65;
        this.facingDirection = 1;
        this.isShooting = false;
        this.shootElapsedTime = 0;
        this.shootEndTime = 225;
        this.groundRays = new Array();
        this.ceilRays = new Array();
        this.leftRays = new Array();
        this.rightRays = new Array();
        this.skinWidth = 5;
        this.isShootingImmobileWeapon = false; // Player cannot move when shooting weapons like Rolling Cutter.
        this.inventoryManager = null; // local access - for convenience
        //******************************
        // JUMP SETTINGS
        //******************************
        this.minJumpHeight = 1;
        this.maxJumpHeight = 60;
        this.timeToJumpApex = 0.35;
        this.gravityX = 0;
        this.gravityY = 0;
        this.maxJumpVelocity = 0;
        this.minJumpVelocity = 0;
        this.tempRay_1 = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_2.RayType.not_infinite);
        this.tempRay_2 = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_2.RayType.not_infinite);
        //******************************
        // DISRUPT SETTINGS
        //******************************
        this.isDisrupted = false;
        this.disruptionElapsedTime = 0;
        this.disruptionEndTime = 400;
        this.isPlayerInvincible_Debug = debug_1.Debug.IsPlayerInvincible;
        this.playerInput = input;
        this.playerGraphics = graphics;
        this.game.add.existing(this);
        this.getPosition().x = x;
        this.getPosition().y = y;
        this.anchor.setTo(0.5, 1);
        this.smoothed = true;
        this.animations.add(MegaManAnimations.idle, ['idle.png'], 10, false, false);
        this.animations.add(MegaManAnimations.blink, Phaser.Animation.generateFrameNames('blink_', 1, 3, '.png', 2), 3, true, false);
        this.animations.add(MegaManAnimations.run, Phaser.Animation.generateFrameNames('run_', 1, 4, '.png', 2), 10, false, false);
        this.animations.add(MegaManAnimations.jump, ['jump.png'], 10, false, false);
        this.animations.add(MegaManAnimations.idle_shoot, ['idle_shoot.png'], 10, false, false);
        this.animations.add(MegaManAnimations.jump_shoot, ['jump_shoot.png'], 10, false, false);
        this.animations.add(MegaManAnimations.run_shoot, Phaser.Animation.generateFrameNames('run_shoot_', 1, 4, '.png', 2), 10, true, false);
        this.animations.add(MegaManAnimations.ladder_shoot, ['climb_ladder_shoot.png'], 10, false, false);
        this.animations.add(MegaManAnimations.ladder, ['climb_ladder_01.png', 'climb_ladder_02.png'], 8, false, false);
        this.animations.add(MegaManAnimations.ladder_idle, ['climb_ladder_01.png'], 10, false, false);
        this.animations.add(MegaManAnimations.hurt, ['hurt.png'], 10, false, false);
        this.animations.add(MegaManAnimations.slide, ['slide.png'], 10, false, false);
        this.animations.add(MegaManAnimations.throw, ['throw.png'], 10, false, false);
        this.animations.add(MegaManAnimations.jump_throw, ['jump_throw.png'], 10, false, false);
        this.animations.add(MegaManAnimations.ladder_throw, ['ladder_throw.png'], 10, false, false);
        this.animations.add(MegaManAnimations.unpause_effect, ['spawn_effect.png', 'warp_in_effect_01.png', 'warp_in_effect_02.png', 'spawn_effect.png'], 20, false, false);
        this.animations.add(MegaManAnimations.lose_control, ['lose_control.png',], 10, false, false);
        this.animations.play(MegaManAnimations.idle);
        this.hitbox = new Phaser.Rectangle(this.getPosition().x, this.getPosition().y, 16, 20);
        this.hitboxOffset.x = -8;
        this.hitboxOffset.y = -20;
        this.updateRect();
        this.midGroundCheck = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_2.RayType.not_infinite);
        this.leftGroundCheck = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_2.RayType.not_infinite);
        this.rightGroundCheck = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_2.RayType.not_infinite);
        this.midCeilCheck = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_2.RayType.not_infinite);
        this.leftCeilCheck = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_2.RayType.not_infinite);
        this.rightCeilCheck = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_2.RayType.not_infinite);
        this.leftCheck1 = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_2.RayType.not_infinite);
        this.leftCheck2 = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_2.RayType.not_infinite);
        this.rightCheck1 = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_2.RayType.not_infinite);
        this.rightCheck2 = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_2.RayType.not_infinite);
        this.groundRays.push(this.midGroundCheck);
        this.groundRays.push(this.leftGroundCheck);
        this.groundRays.push(this.rightGroundCheck);
        this.ceilRays.push(this.midCeilCheck);
        this.ceilRays.push(this.leftCeilCheck);
        this.ceilRays.push(this.rightCeilCheck);
        this.leftRays.push(this.leftCheck1);
        this.leftRays.push(this.leftCheck2);
        this.rightRays.push(this.rightCheck1);
        this.rightRays.push(this.rightCheck2);
        this.wallContact = { left: false, right: false, up: false, down: false };
        this.calculateRegularJumpSettings();
        this.whiteEffect = this.game.add.sprite(0, 0, konstants_1.Konstants.mega_man, 'white_effect.png');
        this.whiteEffect.alpha = 0.5;
        this.whiteEffect.visible = false;
        this.addChild(this.whiteEffect);
        this.healthMeter = new meter_1.Meter(this.game, 16, 15, meter_1.MeterDirection.Vertical);
        this.health = this.healthMeter.totalEnergy;
        // this.health = 1;
        this.maxHealth = this.healthMeter.totalEnergy;
        // this.maxHealth = 1;
        // this.pGraphicsDebug = this.game.add.graphics();
        // this.game.add.existing(this.pGraphicsDebug);
    }
    manualUpdate() {
        // this.pGraphicsDebug.clear();
        if (!this.enabled) {
            return;
        }
        if (!this.alive) {
            return;
        }
        this.playerInput.update(this);
        this.checkMovingPlatform();
        if (this.useGravity && !this.isOnLadder) {
            this.targetSpeed.x += Math.abs(this.gravityX) * main_1.fixedTime;
            this.targetSpeed.y += Math.abs(this.gravityY) * main_1.fixedTime;
        }
        if (this.targetSpeed.y >= 300) {
            this.targetSpeed.y = 300;
        }
        this.velocity.x = this.targetSpeed.x;
        this.velocity.y = this.targetSpeed.y;
        this.previousPosition.x = this.getPosition().x;
        this.previousPosition.y = this.getPosition().y;
        this.getPosition().x += this.velocity.x * main_1.fixedTime;
        this.getPosition().y += this.velocity.y * main_1.fixedTime;
        // This ensures that the sprite sits at an integer value to prevent pixel smoothing.
        // The sprite.position must be separated from the actual positional movement logic, hence why
        // this.myPosition is used instead of 'this.position' - 'this.position' is inherited from Phaser.Sprite
        // and automatically updates the sprites location and we don't want that. We want the sprite X to sit at
        // an integer value but the actual position to be the float value.
        this.position.x = (this.getPosition().x + 0.5) | 0;
        this.position.y = this.getPosition().y;
        this.checkBlink();
        this.checkShooting();
        this.checkSliding();
        this.checkInvincible();
        this.checkHurt();
        this.checkIdle();
        this.checkFalling();
        this.checkLadderPosition();
        this.checkIfDisrupted();
        this.updateRect();
        this.playerGraphics.update(this);
        this.castRays();
        // this.showDebugRays();
    }
    loseControl() {
        if (!this.isOnGround) {
            return;
        }
        if (this.isDisrupted) {
            return;
        }
        this.isDisrupted = true;
        this.getVelocity().x = this.getVelocity().y = 0;
        this.targetSpeed.x = 8 * -this.getFacingDirection();
        this.targetSpeed.y = 0;
    }
    regainControl() {
        this.isDisrupted = false;
        this.disruptionElapsedTime = 0;
    }
    switchWeapon(direction) {
    }
    takeDamage(damage, damageDir = new Phaser.Point(0, 0)) {
        if (!this.alive) {
            return;
        }
        if (this.isPlayerInvincible_Debug) {
            return;
        }
        if (this.health <= 0) {
            return;
        }
        this.healthMeter.takeEnergy(damage);
        this.health -= damage;
        this.targetSpeed.x = 30 * damageDir.x;
        this.targetSpeed.y = 0;
        if (this.health <= 0) {
            this.game.sound.play(konstants_1.AudioName.megaman_defeat);
            this.health = 0;
            let speed = 14;
            this.addDeathEffect(0, -speed); // top
            this.addDeathEffect(speed, 0); // right
            this.addDeathEffect(0, speed); // bottom
            this.addDeathEffect(-speed, 0); // left
            speed = 40;
            this.addDeathEffect(0, -speed); // top
            this.addDeathEffect(Math.cos(45 * (Math.PI / 180)) * speed, Math.sin(-45 * (Math.PI / 180)) * speed); // top-right
            this.addDeathEffect(speed, 0); // right
            this.addDeathEffect(Math.cos(45 * (Math.PI / 180)) * speed, Math.sin(45 * (Math.PI / 180)) * speed); // bottom-right
            this.addDeathEffect(0, speed); // bottom
            this.addDeathEffect(Math.cos(135 * (Math.PI / 180)) * speed, Math.sin(45 * (Math.PI / 180)) * speed); // bottom-left
            this.addDeathEffect(-speed, 0); // left
            this.addDeathEffect(Math.cos(135 * (Math.PI / 180)) * speed, Math.sin(-45 * (Math.PI / 180)) * speed); // top-left
            this.kill();
            this.destroyed.dispatch(this);
        }
        else {
            this.game.sound.play(konstants_1.AudioName.megaman_damage);
            this.isHurt = true;
            this.isInvincible = true;
            this.isBlinking = true;
            this.myWorld.createHurtDust(this.getPosition().x - 2, this.getPosition().y - 40);
            this.myWorld.createHurtDust(this.getPosition().x - 12, this.getPosition().y - 36);
            this.myWorld.createHurtDust(this.getPosition().x + 8, this.getPosition().y - 36);
            this.isOnLadder = false;
            this.currLadder = null;
            this.whiteEffect.visible = true;
            this.whiteEffect.position.x = -12;
            this.whiteEffect.position.y = -24;
        }
    }
    checkSurfaceCollisions(surfaces) {
        this.wallContact.left = false;
        this.wallContact.right = false;
        this.wallContact.up = false;
        this.wallContact.down = false;
        this.isTouchingLadder = false; // todo: is this necessary?
        this.currLadder = null; // todo: is this necessary?
        this.isOnGround = false;
        this.isOnMovingPlatform = false;
        this.tempInto = null;
        for (let j = 0; j < surfaces.length; j++) {
            if (this.isOnLadder) {
                continue;
            }
            this.tempSuface = surfaces[j];
            if (!this.tempSuface.collidable) {
                continue;
            }
            let nx = this.tempSuface.dir.y;
            let ny = -this.tempSuface.dir.x;
            // Check floors
            if (ny == -1 && this.getVelocity().y > 0) {
                for (let k = 0; k < this.groundRays.length; k++) {
                    this.tempRay_2.start.x = this.tempSuface.p1.x;
                    this.tempRay_2.start.y = this.tempSuface.p1.y;
                    this.tempRay_2.end.x = this.tempSuface.p2.x;
                    this.tempRay_2.end.y = this.tempSuface.p2.y;
                    this.tempRay_2.dir.x = this.tempRay_2.end.x - this.tempRay_2.start.x;
                    this.tempRay_2.dir.x = this.tempRay_2.end.y - this.tempRay_2.start.y;
                    this.tempInto = sat2d_1.SAT2D.testRayVsRay(this.groundRays[k], this.tempRay_2, this.tempInto);
                    if (this.tempInto != null) {
                        let dx = this.tempInto.ray1.end.x - this.tempInto.ray1.start.x;
                        let dy = this.tempInto.ray1.end.y - this.tempInto.ray1.start.y;
                        let distance = Math.sqrt(dx * dx + dy * dy);
                        let trueDistance = distance * this.tempInto.u1;
                        let contactX = this.tempInto.ray1.start.x + this.tempInto.ray1.dir.x * this.tempInto.u1;
                        let contactY = this.tempInto.ray1.start.y + trueDistance;
                        // this.pGraphicsDebug.drawCircle(contactX, contactY, 3);
                        if (trueDistance > this.hitbox.height * 0.5) {
                            continue;
                        }
                        if (this.isFalling) {
                            this.game.sound.play(konstants_1.AudioName.megaman_land);
                        }
                        this.getPosition().y = contactY;
                        this.setVelocity(this.getVelocity().x, 0);
                        this.targetSpeed.y = 0;
                        this.isOnGround = true;
                        this.isJumping = false;
                        this.isFalling = false;
                        this.wallContact.down = true;
                        this.airJumpWindow = false;
                        this.jumpInAirElapsedTime = 0;
                        if (this.tempSuface.isMovingPlatform) {
                            this.isOnMovingPlatform = true;
                            this.currMovingPlatform = this.tempSuface;
                        }
                        continue;
                    }
                }
            }
            // Check ceilings
            if (ny == 1 && this.getVelocity().y < 0) {
                for (let k = 0; k < this.ceilRays.length; k++) {
                    this.tempRay_2.start.x = this.tempSuface.p1.x;
                    this.tempRay_2.start.y = this.tempSuface.p1.y;
                    this.tempRay_2.end.x = this.tempSuface.p2.x;
                    this.tempRay_2.end.y = this.tempSuface.p2.y;
                    this.tempRay_2.dir.x = this.tempRay_2.end.x - this.tempRay_2.start.x;
                    this.tempRay_2.dir.x = this.tempRay_2.end.y - this.tempRay_2.start.y;
                    this.tempInto = sat2d_1.SAT2D.testRayVsRay(this.ceilRays[k], this.tempRay_2, this.tempInto);
                    if (this.tempInto != null) {
                        let dx = this.tempInto.ray1.end.x - this.tempInto.ray1.start.x;
                        let dy = this.tempInto.ray1.end.y - this.tempInto.ray1.start.y;
                        let distance = Math.sqrt(dx * dx + dy * dy);
                        let trueDistance = distance * this.tempInto.u1;
                        let contactX = this.tempInto.ray1.start.x + this.tempInto.ray1.dir.x * this.tempInto.u1;
                        let contactY = this.tempInto.ray1.start.y - trueDistance;
                        // this.pGraphicsDebug.drawCircle(contactX, contactY, 3);
                        if (trueDistance > this.hitbox.height * 0.5) {
                            continue;
                        }
                        this.getPosition().y = contactY + this.hitbox.height;
                        this.setVelocity(this.getVelocity().x, 0);
                        this.targetSpeed.y = 0;
                        this.isFalling = true;
                        this.wallContact.up = true;
                        continue;
                    }
                }
            }
            // Check right walls
            if (nx == -1 && this.getVelocity().x > 0) {
                for (let k = 0; k < this.rightRays.length; k++) {
                    this.tempRay_2.start.x = this.tempSuface.p1.x;
                    this.tempRay_2.start.y = this.tempSuface.p1.y;
                    this.tempRay_2.end.x = this.tempSuface.p2.x;
                    this.tempRay_2.end.y = this.tempSuface.p2.y;
                    this.tempRay_2.dir.x = this.tempRay_2.end.x - this.tempRay_2.start.x;
                    this.tempRay_2.dir.x = this.tempRay_2.end.y - this.tempRay_2.start.y;
                    this.tempInto = sat2d_1.SAT2D.testRayVsRay(this.rightRays[k], this.tempRay_2, this.tempInto);
                    if (this.tempInto != null) {
                        let dx = this.tempInto.ray1.end.x - this.tempInto.ray1.start.x;
                        let dy = this.tempInto.ray1.end.y - this.tempInto.ray1.start.y;
                        let distance = Math.sqrt(dx * dx + dy * dy);
                        let trueDistance = distance * this.tempInto.u1;
                        let contactX = this.tempInto.ray1.start.x + trueDistance;
                        let contactY = this.tempInto.ray1.start.y;
                        // this.pGraphicsDebug.lineStyle(1, 0);
                        // this.pGraphicsDebug.beginFill(0xff0000, 0.5);
                        // this.pGraphicsDebug.drawCircle(contactX, contactY, 5);
                        if (trueDistance > this.hitbox.width * 0.5) {
                            continue;
                        }
                        this.getPosition().x = contactX - this.hitbox.width * 0.5;
                        this.wallContact.right = true;
                        continue;
                    }
                }
            }
            // Check left walls
            if (nx == 1 && this.getVelocity().x < 0) {
                for (let k = 0; k < this.leftRays.length; k++) {
                    this.tempRay_2.start.x = this.tempSuface.p1.x;
                    this.tempRay_2.start.y = this.tempSuface.p1.y;
                    this.tempRay_2.end.x = this.tempSuface.p2.x;
                    this.tempRay_2.end.y = this.tempSuface.p2.y;
                    this.tempRay_2.dir.x = this.tempRay_2.end.x - this.tempRay_2.start.x;
                    this.tempRay_2.dir.x = this.tempRay_2.end.y - this.tempRay_2.start.y;
                    this.tempInto = sat2d_1.SAT2D.testRayVsRay(this.leftRays[k], this.tempRay_2, this.tempInto);
                    if (this.tempInto != null) {
                        let dx = this.tempInto.ray1.end.x - this.tempInto.ray1.start.x;
                        let dy = this.tempInto.ray1.end.y - this.tempInto.ray1.start.y;
                        let distance = Math.sqrt(dx * dx + dy * dy);
                        let trueDistance = distance * this.tempInto.u1;
                        let contactX = this.tempInto.ray1.start.x - trueDistance;
                        let contactY = this.tempInto.ray1.start.y;
                        // this.pGraphicsDebug.lineStyle(1, 0);
                        // this.pGraphicsDebug.beginFill(0xff0000, 0.5);
                        // this.pGraphicsDebug.drawCircle(contactX, contactY, 5);
                        if (trueDistance > this.hitbox.width * 0.5) {
                            continue;
                        }
                        this.getPosition().x = contactX + this.hitbox.width * 0.5;
                        this.wallContact.left = true;
                        continue;
                    }
                }
            }
        }
    }
    checkLadderCollisions(ladders) {
        for (let j = 0; j < ladders.length; j++) {
            if (Phaser.Rectangle.intersects(this.hitbox, ladders[j])) {
                this.isTouchingLadder = true;
                this.currLadder = ladders[j];
            }
        }
    }
    checkCollideWith(entity) {
        if (helper_1.Helper.distanceTo(entity, this) > 21) {
            return;
        }
        if (entity.tag == konstants_1.TagType.bullet) {
            return;
        }
    }
    move(x, y, facingDir = 1) {
        if (this.isHurt) {
            return;
        }
        if (this.isOnLadder) {
            this.setFacingDirection(facingDir);
            return;
        }
        // Player cannot move while sliding. Slide has a pre-set time.
        if (this.isSliding) {
            return;
        }
        if (this.isShootingImmobileWeapon) {
            x = 0;
        }
        this.targetSpeed.x = x;
        this.targetSpeed.y = y;
        this.setFacingDirection(facingDir);
        if (this.targetSpeed.x > 0 || this.targetSpeed.x < 0) {
            this.isRunning = true;
        }
        if (this.targetSpeed.x == 0) {
            this.isRunning = false;
        }
    }
    jump() {
        if (this.isHurt) {
            return;
        }
        if (this.isOnGround) {
            this.jumpOnGround();
        }
        else {
            if (this.isOnLadder) {
                this.jumpOnLadder();
            }
            else {
                this.jumpInAir();
            }
        }
    }
    jumpReleased() {
        if (this.isHurt) {
            return;
        }
        if (this.isOnGround) {
            return;
        }
        if (this.velocity.y < this.minJumpVelocity) {
            this.targetSpeed.y = -this.minJumpVelocity;
        }
    }
    shoot() {
        if (this.isHurt) {
            return;
        }
        if (this.isSliding) {
            return;
        }
        if (this.isShootingImmobileWeapon) {
            return;
        }
        let xPos = 0;
        let yPos = 0;
        if (this.isJumping) {
            xPos = this.getPosition().x + 16 * this.getFacingDirection();
            yPos = this.getPosition().y - 19;
        }
        else if (this.isOnLadder) {
            xPos = this.getPosition().x + 16 * this.getFacingDirection();
            yPos = this.getPosition().y - 18;
        }
        else { // idle
            xPos = this.getPosition().x + 16 * this.getFacingDirection();
            yPos = this.getPosition().y - 13;
        }
        if (!this.getCurrentWeapon().doAction(xPos, yPos)) {
            return;
        }
        this.isShooting = true;
        if (this.getCurrentWeapon().type == weapon_1.WeaponType.CutMan && this.isOnGround) {
            this.targetSpeed.x = 0;
            this.isRunning = false;
            this.isShootingImmobileWeapon = true;
            this.game.time.events.add(150, () => {
                this.isShootingImmobileWeapon = false;
            });
        }
    }
    /**
     * Attempts to climb a ladder.
     * @param upPressed - up key is pressed.
     */
    getOnLadder(upPressed = false) {
        if (this.isHurt) {
            return;
        }
        if (!this.isTouchingLadder || this.isOnLadder) { // runs once to get on the ladder
            return;
        }
        // If the player is too far horizontally don't get on ladder. This prevents ugly snapping.
        if (Math.abs((this.currLadder.topLeft.x + 8) - this.getPosition().x) > 15) {
            return;
        }
        let ladderTopY = this.currLadder.topLeft.y + 16;
        // Don't get on ladder if pressing down and on ground and below ladder.
        if (!upPressed && this.isOnGround && this.getPosition().y - this.hitbox.height > ladderTopY) {
            return;
        }
        // Don't get on ladder is pressing up and on ground and at the top of the ladder.
        if (upPressed && this.isOnGround && this.getPosition().y - this.hitbox.height < ladderTopY) {
            return;
        }
        this.targetSpeed.x = 0;
        // Stop sliding when we have determined we can get on ladder.
        if (this.isSliding) {
            this.slideElapsedTime = 0;
            this.isSliding = false;
        }
        if (this.getPosition().y - this.hitbox.height * 0.5 < ladderTopY) { // above ladder
            // If up is pressed and we are on top of a ladder; don't do anything.
            if (upPressed) {
                return;
            }
            this.animations.play(MegaManAnimations.ladder);
            let centerX = this.currLadder.topLeft.x + this.currLadder.width * 0.5;
            let ladderY = this.currLadder.topLeft.y + 16 + this.hitbox.height * 0.5;
            this.getPosition().x = centerX;
            this.getPosition().y = ladderY;
            this.isOnLadder = true;
        }
        else { // below ladder
            this.animations.play(MegaManAnimations.ladder_idle);
            let centerX = this.currLadder.topLeft.x + this.currLadder.width * 0.5;
            let ladderY = this.getPosition().y;
            this.getPosition().x = centerX;
            this.getPosition().y = ladderY;
            this.isOnLadder = true;
        }
    }
    moveOnLadder(speed) {
        if (this.isHurt) {
            return;
        }
        if (!this.isOnLadder) {
            return;
        }
        if (this.isShooting) {
            this.targetSpeed.y = 0;
            return;
        }
        this.targetSpeed.y = speed;
        // if (this.targetSpeed.x > 0 || this.targetSpeed.x < 0) {
        //     this.isRunning = true;
        // }
        // if (this.targetSpeed.x == 0) {
        //     this.isRunning = false;
        // }
    }
    slide() {
        if (this.isHurt) {
            return;
        }
        if (!this.isOnGround) {
            return;
        }
        if (this.isSliding) {
            return;
        }
        this.myWorld.createDust(this.getPosition().x - 10 * this.getFacingDirection(), this.getPosition().y - 5);
        this.isSliding = true;
        this.targetSpeed.x = this.slideSpeed * this.getFacingDirection();
    }
    removeDeathEffect() {
        for (let i = this.deathEffects.length - 1; i >= 0; i--) {
            this.deathEffects[i].kill();
            this.deathEffects.splice(i, 1);
        }
    }
    giveHealth(amount) {
        this.health += amount;
        if (this.health > this.maxHealth) {
            this.health = this.maxHealth;
        }
    }
    setHealth(value) {
        this.health = value;
        if (this.health > this.maxHealth) {
            this.health = this.maxHealth;
        }
        if (this.health < 0) {
            this.health = 0;
        }
    }
    setDefaults() {
        this.animations.stop();
        this.animations.play(MegaManAnimations.idle);
        this.targetSpeed.x = 0;
        this.targetSpeed.y = 0;
        this.isJumping = false;
        this.isOnGround = false;
        this.isFalling = false;
        this.isHurt = false;
        this.isInvincible = false;
        this.isWarpingIn = false;
        this.isBlinking = false;
        this.isIdle = false;
        this.isOnLadder = false;
        this.isShielded = false;
        this.isIdle = false;
        this.isSliding = false;
        this.isShootingImmobileWeapon = false;
        this.health = this.maxHealth;
        this.healthMeter.setEnergy(this.health);
        this.healthMeter.reset();
    }
    stopAllMovement() {
        this.targetSpeed.x = 0;
        this.targetSpeed.y = 0;
        this.getVelocity().x = 0;
        this.getVelocity().y = 0;
        this.isRunning = false;
        this.isJumping = false;
    }
    getCurrentWeapon() {
        return this.inventoryManager.getCurrentlySelectedWeapon();
    }
    getAllWeapons() {
        return this.inventoryManager.weaponList;
    }
    getInventoryManager() {
        return this.inventoryManager;
    }
    setInventoryManager(im) {
        this.inventoryManager = im;
        this.inventoryManager.selectedWeapon.add((weapon) => {
        }, this);
    }
    toggleMeter() {
        this.healthMeter.isVisible == true ? this.healthMeter.hide() : this.healthMeter.show();
        if (this.inventoryManager.getCurrentlySelectedItem().weapon.energyMeter == null) {
            return;
        }
        this.inventoryManager.getCurrentlySelectedItem().weapon.energyMeter.isVisible == true ?
            this.inventoryManager.getCurrentlySelectedItem().weapon.energyMeter.hide() :
            this.inventoryManager.getCurrentlySelectedItem().weapon.energyMeter.show();
    }
    calculateRegularJumpSettings() {
        this.gravityY = -(2 * this.maxJumpHeight) / Math.pow(this.timeToJumpApex, 2);
        this.maxJumpVelocity = Math.abs(this.gravityY) * this.timeToJumpApex;
        this.minJumpVelocity = Math.sqrt(2 * Math.abs(this.gravityY) * this.minJumpHeight);
        // console.log('gravity: ' + this._gravity);
        // console.log('maxJumpVelocity: ' + this._maxJumpVelocity);
        // console.log('minJumpVelocity: ' + this._minJumpVelocity);
    }
    addDeathEffect(vx, vy) {
        let s = this.myWorld.createMegaManDeathEffect(this.getPosition().x, this.getPosition().y - 12);
        s.body.velocity.x = vx;
        s.body.velocity.y = vy;
        this.deathEffects.push(s);
    }
    checkMovingPlatform() {
        if (!this.isOnMovingPlatform) {
            return;
        }
        // Use the targetSpeed from hurt instead of from moving platform.
        if (!this.isHurt) {
            this.targetSpeed.x += this.currMovingPlatform.targetSpeed.x;
        }
        // Only set the targetSpeed when the moving platform is going down.
        // This prevents the player from constantly falling.
        // Going up is fine because the raycasts re-position the player automatically.
        if (this.currMovingPlatform.targetSpeed.y > 0) {
            this.targetSpeed.y += this.currMovingPlatform.targetSpeed.y;
        }
    }
    checkBlink() {
        if (!this.isBlinking) {
            return;
        }
        this.blinkCounter++;
        if (this.blinkCounter % this.blinkRate == 0) {
            this.alpha == 1 ? this.alpha = 0 : this.alpha = 1;
        }
        if (this.blinkCounter > this.whiteEffectMaxCounter) {
            this.whiteEffect.visible = false;
        }
        this.blinkingElapsedTime += this.game.time.elapsedMS;
        if (this.blinkingElapsedTime > this.blinkingEndTime) {
            this.blinkingElapsedTime = 0;
            this.isBlinking = false;
            this.alpha = 1;
            this.blinkCounter = 0;
        }
    }
    checkShooting() {
        if (this.isShooting) {
            this.shootElapsedTime += this.game.time.elapsedMS;
            if (this.shootElapsedTime > this.shootEndTime) {
                this.shootElapsedTime = 0;
                this.isShooting = false;
            }
        }
    }
    checkSliding() {
        if (this.isSliding) {
            this.slideElapsedTime += this.game.time.elapsedMS;
            if (this.slideElapsedTime > this.slideEndTime) {
                this.slideElapsedTime = 0;
                this.isSliding = false;
            }
            if (!this.isOnGround) {
                if (this.slideElapsedTime < this.slideEndTime - 200) {
                    this.slideElapsedTime = this.slideEndTime - 200;
                }
            }
        }
    }
    checkInvincible() {
        if (!this.isInvincible) {
            return;
        }
        this.invincibleElapsedTime += this.game.time.elapsedMS;
        if (this.invincibleElapsedTime > this.invincibleEndTime) {
            this.invincibleElapsedTime = 0;
            this.isInvincible = false;
        }
    }
    checkHurt() {
        if (!this.isHurt) {
            return;
        }
        this.hurtElapsedTime += this.game.time.elapsedMS;
        if (this.hurtElapsedTime > this.hurtEndTime) {
            this.hurtElapsedTime = 0;
            this.isHurt = false;
        }
    }
    checkIdle() {
        if (this.isOnGround && this.velocity.x == 0 && !this.isShooting) {
            this.idleElapsedTime += this.game.time.elapsedMS;
            if (this.idleElapsedTime > this.blinkStartTime) {
                this.isIdle = true;
            }
        }
        else {
            this.isIdle = false;
            this.idleElapsedTime = 0;
        }
    }
    checkFalling() {
        if (!this.isOnGround && this.velocity.y > 0) {
            this.isFalling = true;
            // When falling we give the player some time to jump again; after that time jumping isnt possible while in air.
            this.airJumpWindow = true;
            this.jumpInAirElapsedTime += this.game.time.elapsedMS;
            if (this.jumpInAirElapsedTime > this.jumpInAirEndTime) {
                this.airJumpWindow = false;
            }
        }
    }
    checkLadderPosition() {
        if (!this.isOnLadder) {
            return;
        }
        if (this.currLadder == null) {
            return;
        }
        let bottomY = this.currLadder.bottomLeft.y; // bottom y pos of the ladder
        let topY = this.currLadder.topLeft.y + 16 + 10; // top y pos of the ladder
        // Player reached the bottom of the ladder; force them off.
        if (this.getPosition().y > bottomY) {
            this.isOnLadder = false;
            this.currLadder = null;
        }
        // Player reached the top of the ladder; force them off.
        if (this.getPosition().y < topY) {
            this.getPosition().y = this.currLadder.topLeft.y + 16;
            this.isOnLadder = false;
            this.currLadder = null;
            this.targetSpeed.y = 0;
        }
    }
    checkIfDisrupted() {
        if (!this.isDisrupted) {
            return;
        }
        this.disruptionElapsedTime += this.game.time.elapsedMS;
        if (this.disruptionElapsedTime > this.disruptionEndTime) {
            this.regainControl();
        }
    }
    /**
     * Using the current position moves the rays a frame even though the player may be running into a wall. By using
     * previous position the rays don't move for that frame. They use the previous frame. Think about it, when the player
     * is running into a wall, its 'bounds' should not move.
     */
    castRays() {
        let centerX = this.getPosition().x;
        let centerY = this.getPosition().y - this.hitbox.height * 0.5;
        if (this.wallContact.left || this.wallContact.right) {
            centerX = this.previousPosition.x;
        }
        // cast ground rays
        this.midGroundCheck.start.x = centerX;
        this.midGroundCheck.start.y = centerY;
        this.midGroundCheck.end.x = centerX;
        this.midGroundCheck.end.y = centerY + this.hitbox.height * 0.5 + this.skinWidth + 100;
        this.leftGroundCheck.start.x = centerX - this.hitbox.width * 0.5 + 3;
        this.leftGroundCheck.start.y = centerY;
        this.leftGroundCheck.end.x = centerX - this.hitbox.width * 0.5 + 3;
        this.leftGroundCheck.end.y = centerY + this.hitbox.height * 0.5 + this.skinWidth + 100;
        this.rightGroundCheck.start.x = centerX + this.hitbox.width * 0.5 - 3;
        this.rightGroundCheck.start.y = centerY;
        this.rightGroundCheck.end.x = centerX + this.hitbox.width * 0.5 - 3;
        this.rightGroundCheck.end.y = centerY + this.hitbox.height * 0.5 + this.skinWidth + 100;
        // cast ceil rays
        this.midCeilCheck.start.x = centerX;
        this.midCeilCheck.start.y = centerY;
        this.midCeilCheck.end.x = centerX;
        this.midCeilCheck.end.y = centerY - this.hitbox.height * 0.5 - this.skinWidth;
        this.leftCeilCheck.start.x = centerX - this.hitbox.width * 0.5 + 3;
        this.leftCeilCheck.start.y = centerY;
        this.leftCeilCheck.end.x = centerX - this.hitbox.width * 0.5 + 3;
        this.leftCeilCheck.end.y = centerY - this.hitbox.height * 0.5 - this.skinWidth;
        this.rightCeilCheck.start.x = centerX + this.hitbox.width * 0.5 - 3;
        this.rightCeilCheck.start.y = centerY;
        this.rightCeilCheck.end.x = centerX + this.hitbox.width * 0.5 - 3;
        this.rightCeilCheck.end.y = centerY - this.hitbox.height * 0.5 - this.skinWidth;
        // cast left rays
        let offsetY = 8;
        this.leftCheck1.start.x = centerX;
        this.leftCheck1.start.y = centerY - offsetY;
        this.leftCheck1.end.x = centerX - this.hitbox.width * 0.5 - this.skinWidth;
        this.leftCheck1.end.y = centerY - offsetY;
        this.leftCheck2.start.x = centerX;
        this.leftCheck2.start.y = centerY + offsetY;
        this.leftCheck2.end.x = centerX - this.hitbox.width * 0.5 - this.skinWidth;
        this.leftCheck2.end.y = centerY + offsetY;
        // cast right rays
        offsetY = 8;
        this.rightCheck1.start.x = centerX;
        this.rightCheck1.start.y = centerY - offsetY;
        this.rightCheck1.end.x = centerX + this.hitbox.width * 0.5 + this.skinWidth;
        this.rightCheck1.end.y = centerY - offsetY;
        this.rightCheck2.start.x = centerX;
        this.rightCheck2.start.y = centerY + offsetY;
        this.rightCheck2.end.x = centerX + this.hitbox.width * 0.5 + this.skinWidth;
        this.rightCheck2.end.y = centerY + offsetY;
    }
    showDebugRays() {
        // this.pGraphicsDebug.lineStyle(1, 0);
        // this.groundRays.forEach((ray) => {
        //     this.pGraphicsDebug.moveTo(ray.start.x, ray.start.y);
        //     this.pGraphicsDebug.lineTo(ray.end.x, ray.end.y);
        // });
        // this.ceilRays.forEach((ray) => {
        //     this.pGraphicsDebug.moveTo(ray.start.x, ray.start.y);
        //     this.pGraphicsDebug.lineTo(ray.end.x, ray.end.y);
        // });
        // this.leftRays.forEach((ray) => {
        //     this.pGraphicsDebug.moveTo(ray.start.x, ray.start.y);
        //     this.pGraphicsDebug.lineTo(ray.end.x, ray.end.y);
        // });
        // this.rightRays.forEach((ray) => {
        //     this.pGraphicsDebug.moveTo(ray.start.x, ray.start.y);
        //     this.pGraphicsDebug.lineTo(ray.end.x, ray.end.y);
        // });
    }
    jumpOnGround() {
        this.targetSpeed.y = -this.maxJumpVelocity;
        this.isOnGround = false;
        this.isJumping = true;
        this.isFalling = false;
    }
    jumpInAir() {
        // The player can only jump in the air when walking off a platform.
        if (this.canJumpInAir && !this.isJumping && this.airJumpWindow) {
            this.jumpOnGround();
        }
    }
    jumpOnLadder() {
        this.isOnLadder = false;
        this.currLadder = null;
    }
}
exports.Player = Player;


/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Entity = void 0;
class Entity extends Phaser.Sprite {
    constructor(myWorld, tag, myEntityType, game, x, y, key, frame) {
        super(game, x, y, key, frame);
        this.myWorld = myWorld;
        this.tag = tag;
        this.myEntityType = myEntityType;
        this.destroyed = new Phaser.Signal();
        this.currPosition = new Phaser.Point();
        this.velocity = new Phaser.Point();
        this.hitboxOffset = new Phaser.Point();
        this.isShielded = false;
        this.contactDamage = 1;
        this.enabled = true;
    }
    manualUpdate() { }
    takeDamage(damage, damageDir = new Phaser.Point(0, 0)) { }
    checkSurfaceCollisions(surfaces) { }
    setHitboxAsRect(x, y, width, height, offsetX, offsetY) {
        this.hitbox = new Phaser.Rectangle(x, y, width, height);
        this.hitboxOffset.x = offsetX;
        this.hitboxOffset.y = offsetY;
    }
    enable() {
        this.enabled = true;
        this.visible = true;
    }
    disable() {
        this.enabled = false;
        this.visible = false;
    }
    getVelocity() {
        return this.velocity;
    }
    setVelocity(x, y) {
        this.velocity.x = x;
        this.velocity.y = y;
    }
    getPosition() {
        return this.currPosition;
    }
    getFacingDirection() {
        return this.scale.x >= 0 ? 1 : -1;
    }
    setFacingDirection(dir) {
        this.scale.x = dir;
    }
    updateRect() {
        this.hitbox.x = this.getPosition().x + this.hitboxOffset.x;
        this.hitbox.y = this.getPosition().y + this.hitboxOffset.y;
    }
    togglePause() {
        if (!this.animations.currentAnim) {
            return;
        }
        this.animations.currentAnim.paused = !this.animations.currentAnim.paused;
    }
    toggleVisibility() {
        this.visible = !this.visible;
    }
}
exports.Entity = Entity;


/***/ }),
/* 17 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SAT2D = void 0;
const rayIntersection_1 = __webpack_require__(18);
const ray_1 = __webpack_require__(19);
const rayCollision_1 = __webpack_require__(21);
const shapeCollision_1 = __webpack_require__(23);
class SAT2D {
    /**
     *
     * @param {Ray} ray
     * @param {Polygon} polygon
     * @param {RayCollision} into
     * @return {RayCollision}
     */
    static testRayVsPolygon(ray, polygon, into) {
        var min_u = Number.POSITIVE_INFINITY;
        var max_u = Number.NEGATIVE_INFINITY;
        var startX = ray.start.x;
        var startY = ray.start.y;
        var deltaX = ray.end.x - startX;
        var deltaY = ray.end.y - startY;
        var verts = polygon.getTransformedVertices();
        var v1 = verts[verts.length - 1];
        var v2 = verts[0];
        var ud = (v2.y - v1.y) * deltaX - (v2.x - v1.x) * deltaY;
        var ua = SAT2D.rayU(ud, startX, startY, v1.x, v1.y, v2.x - v1.x, v2.y - v1.y);
        var ub = SAT2D.rayU(ud, startX, startY, v1.x, v1.y, deltaX, deltaY);
        if (ud != 0.0 && ub >= 0.0 && ub <= 1.0) {
            if (ua < min_u)
                min_u = ua;
            if (ua > max_u)
                max_u = ua;
        }
        for (var i = 1; i < verts.length; i++) {
            v1 = verts[i - 1];
            v2 = verts[i];
            ud = (v2.y - v1.y) * deltaX - (v2.x - v1.x) * deltaY;
            ua = SAT2D.rayU(ud, startX, startY, v1.x, v1.y, v2.x - v1.x, v2.y - v1.y);
            ub = SAT2D.rayU(ud, startX, startY, v1.x, v1.y, deltaX, deltaY);
            if (ud != 0.0 && ub >= 0.0 && ub <= 1.0) {
                if (ua < min_u)
                    min_u = ua;
                if (ua > max_u)
                    max_u = ua;
            }
        } //each vert
        var valid = false;
        switch (ray.infinite) {
            case ray_1.RayType.not_infinite: // not infinite
                valid = (min_u >= 0.0 && min_u <= 1.0);
                break;
            case ray_1.RayType.infinite: // infinite
                valid = (min_u != Number.POSITIVE_INFINITY);
                break;
            case ray_1.RayType.infinite_from_start: // infinite from start
                valid = (min_u != Number.POSITIVE_INFINITY && min_u >= 0.0);
                break;
        }
        if (valid) {
            into = (into == null) ? new rayCollision_1.RayCollision() : into.reset();
            into.shape = polygon;
            into.ray = ray;
            into.start = min_u;
            into.end = max_u;
            return into;
        }
        return null;
    }
    /**
     *
     * @param {Ray} ray1
     * @param {Ray} ray2
     * @param {RayIntersection} into
     * @return {RayIntersection}
     */
    static testRayVsRay(ray1, ray2, into) {
        let delta1X = ray1.end.x - ray1.start.x;
        let delta1Y = ray1.end.y - ray1.start.y;
        let delta2X = ray2.end.x - ray2.start.x;
        let delta2Y = ray2.end.y - ray2.start.y;
        let diffX = ray1.start.x - ray2.start.x;
        let diffY = ray1.start.y - ray2.start.y;
        let ud = delta2Y * delta1X - delta2X * delta1Y;
        if (ud == 0.0)
            return null;
        let u1 = (delta2X * diffY - delta2Y * diffX) / ud;
        let u2 = (delta1X * diffY - delta1Y * diffX) / ud;
        // :todo: ask if ray hit condition difference is intentional (> 0 and not >= 0 like other checks)
        let valid1 = false;
        switch (ray1.infinite) {
            case ray_1.RayType.not_infinite:
                valid1 = (u1 > 0.0 && u1 <= 1.0);
                break;
            case ray_1.RayType.infinite:
                valid1 = true;
                break;
            case ray_1.RayType.infinite_from_start:
                valid1 = u1 > 0.0;
                break;
        }
        var valid2 = false;
        switch (ray2.infinite) {
            case ray_1.RayType.not_infinite:
                valid2 = (u2 > 0.0 && u2 <= 1.0);
                break;
            case ray_1.RayType.infinite:
                valid2 = true;
                break;
            case ray_1.RayType.infinite_from_start:
                valid2 = u2 > 0.0;
                break;
        }
        if (valid1 && valid2) {
            into = (into == null) ? SAT2D.tempRayIntersection : into.reset();
            into.ray1 = ray1;
            into.ray2 = ray2;
            into.u1 = u1;
            into.u2 = u2;
            return into;
        } //both valid 
        return null;
    }
    /**
     *
     * @param {Polygon} polygon1
     * @param {Polygon} polygon2
     * @param {ShapeCollision} into
     * @param {Bool} flip
     * @return {ShapeCollision}
     */
    static testPolygonVsPolygon(polygon1, polygon2, into, flip = false) {
        into = (into == null) ? new shapeCollision_1.ShapeCollision() : into.reset();
        let tmp1 = SAT2D.tmp1;
        let tmp2 = SAT2D.tmp2;
        if (SAT2D.checkPolygons(polygon1, polygon2, tmp1, flip) == null) {
            return null;
        }
        if (SAT2D.checkPolygons(polygon2, polygon1, tmp2, !flip) == null) {
            return null;
        }
        var result = null, other = null;
        if (Math.abs(tmp1.overlap) < Math.abs(tmp2.overlap)) {
            result = tmp1;
            other = tmp2;
        }
        else {
            result = tmp2;
            other = tmp1;
        }
        result.otherOverlap = other.overlap;
        result.otherSeparationX = other.separationX;
        result.otherSeparationY = other.separationY;
        result.otherUnitVectorX = other.unitVectorX;
        result.otherUnitVectorY = other.unitVectorY;
        into.copy_from(result);
        result = other = null;
        return into;
    }
    /**
     *
     * @param {Polygon} polygon1
     * @param {Polygon} polygon2
     * @param {ShapeCollision} into
     * @param {Bool} flip
     * @return {ShapeCollision}
     */
    static checkPolygons(polygon1, polygon2, into, flip) {
        into.reset();
        var offset = 0.0, test1 = 0.0, test2 = 0.0, testNum = 0.0;
        var min1 = 0.0, max1 = 0.0, min2 = 0.0, max2 = 0.0;
        var closest = 0x3FFFFFFF;
        var axisX = 0.0;
        var axisY = 0.0;
        var verts1 = polygon1.getTransformedVertices();
        var verts2 = polygon2.getTransformedVertices();
        // loop to begin projection
        for (var i = 0; i < verts1.length; i++) {
            axisX = SAT2D.findNormalAxisX(verts1, i);
            axisY = SAT2D.findNormalAxisY(verts1, i);
            var aLen = SAT2D.vec_length(axisX, axisY);
            axisX = SAT2D.vec_normalize(aLen, axisX);
            axisY = SAT2D.vec_normalize(aLen, axisY);
            // project polygon1
            min1 = SAT2D.vec_dot(axisX, axisY, verts1[0].x, verts1[0].y);
            max1 = min1;
            for (var j = 0; j < verts1.length; j++) {
                testNum = SAT2D.vec_dot(axisX, axisY, verts1[j].x, verts1[j].y);
                if (testNum < min1)
                    min1 = testNum;
                if (testNum > max1)
                    max1 = testNum;
            }
            // project polygon2
            min2 = SAT2D.vec_dot(axisX, axisY, verts2[0].x, verts2[0].y);
            max2 = min2;
            for (var j = 0; j < verts2.length; j++) {
                testNum = SAT2D.vec_dot(axisX, axisY, verts2[j].x, verts2[j].y);
                if (testNum < min2)
                    min2 = testNum;
                if (testNum > max2)
                    max2 = testNum;
            }
            test1 = min1 - max2;
            test2 = min2 - max1;
            if (test1 > 0 || test2 > 0) {
                return null;
            }
            var distMin = -(max2 - min1);
            if (flip)
                distMin *= -1;
            if (Math.abs(distMin) < closest) {
                into.unitVectorX = axisX;
                into.unitVectorY = axisY;
                into.overlap = distMin;
                closest = Math.abs(distMin);
            }
        }
        into.shape1 = flip ? polygon2 : polygon1;
        into.shape2 = flip ? polygon1 : polygon2;
        into.separationX = -into.unitVectorX * into.overlap;
        into.separationY = -into.unitVectorY * into.overlap;
        if (flip) {
            into.unitVectorX = -into.unitVectorX;
            into.unitVectorY = -into.unitVectorY;
        }
        return into;
    }
    /**
     * Internal helper for ray overlaps.
     * @param {Float} udelta
     * @param {Float} aX
     * @param {Float} aY
     * @param {Float} bX
     * @param {Float} bY
     * @param {Float} dX
     * @param {Float} dY
     * @return {Float}
     */
    static rayU(udelta, aX, aY, bX, bY, dX, dY) {
        return (dX * (aY - bY) - dY * (aX - bX)) / udelta;
    }
    static findNormalAxisX(verts, index) {
        var v2 = (index >= verts.length - 1) ? verts[0] : verts[index + 1];
        return -(v2.y - verts[index].y);
    }
    static findNormalAxisY(verts, index) {
        var v2 = (index >= verts.length - 1) ? verts[0] : verts[index + 1];
        return (v2.x - verts[index].x);
    }
    static vec_length(x, y) {
        return Math.sqrt(SAT2D.vec_lengthSq(x, y));
    }
    static vec_lengthSq(x, y) {
        return x * x + y * y;
    }
    static vec_normalize(length, value) {
        return value / length;
    }
    static vec_dot(x1, y1, x2, y2) {
        return x1 * x2 + y1 * y2;
    }
}
exports.SAT2D = SAT2D;
SAT2D.tempRayIntersection = new rayIntersection_1.RayIntersection();
SAT2D.tmp1 = new shapeCollision_1.ShapeCollision();
SAT2D.tmp2 = new shapeCollision_1.ShapeCollision();


/***/ }),
/* 18 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RayIntersection = void 0;
class RayIntersection {
    constructor() {
        this.ray1 = null; // The first ray in the test
        this.ray2 = null; // The second ray in the test
        this.u1 = 0; // u value for ray1.
        this.u2 = 0; // u value for ray2.
    }
    reset() {
        this.ray1 = null;
        this.ray2 = null;
        this.u1 = 0;
        this.u2 = 0;
        return this;
    }
    /**
     * @param {RayIntersection} other
     */
    copy_from(other) {
        this.ray1 = other.ray1;
        this.ray2 = other.ray2;
        this.u1 = other.u1;
        this.u2 = other.u2;
    }
    clone() {
        let clone = new RayIntersection();
        clone.copy_from(this);
        return clone;
    }
}
exports.RayIntersection = RayIntersection;


/***/ }),
/* 19 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Ray = exports.RayType = void 0;
const vector2_1 = __webpack_require__(20);
var RayType;
(function (RayType) {
    RayType["not_infinite"] = "not_infinite";
    RayType["infinite"] = "infinite";
    RayType["infinite_from_start"] = "infinite_from_start";
})(RayType = exports.RayType || (exports.RayType = {}));
class Ray {
    /**
     * Create a new ray with the start and end point,
     * which determine the direction of the ray, and optionally specifying
     * that this ray is infinite in some way.
     * @param {Vector2} start
     * @param {Vector2} end
     * @param {Int} infinite
     */
    constructor(start, end, infinite) {
        this.start = start; // The start point of the ray.
        this.end = end; // The end point of the ray.
        /**
         * The direction of the ray.
         * Returns a cached vector, so modifying it will affect this instance.
         * Updates only when the dir value is accessed.
         */
        this.dir = new vector2_1.Vector2(this.end.x - this.start.x, this.end.y - this.start.y);
        /**
         * The line is a fixed length between the start and end points.
         * 0 = not infinite
         *
         * The line is infinite from it's starting point.
         * 1 = infinite
         *
         * The line is infinite in both directions from it's starting point.
         * 2 = infinite from start
         */
        this.infinite = infinite == null ? RayType.not_infinite : infinite; // Whether or not the ray is infinite.
        this.color = 0x000000;
        this.alpha = 0.5;
    }
    recalculateDir() {
        this.dir = new vector2_1.Vector2(this.end.x - this.start.x, this.end.y - this.start.y);
    }
}
exports.Ray = Ray;


/***/ }),
/* 20 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Vector2 = void 0;
class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}
exports.Vector2 = Vector2;


/***/ }),
/* 21 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RayCollision = void 0;
const shape_1 = __webpack_require__(22);
const ray_1 = __webpack_require__(19);
class RayCollision {
    constructor() {
        this.shape = new shape_1.Shape(0, 0); // Shape the intersection was with.
        this.ray = new ray_1.Ray(null, null, ray_1.RayType.not_infinite); // The ray involved in the intersection.
        this.start = 0; // Distance along ray that the intersection start at.
        this.end = 0; // Distance along ray that the intersection ended at.
    }
    reset() {
        this.shape = null;
        this.ray = null;
        this.start = 0;
        this.end = 0;
        return this;
    }
    /**
     * @param {RayCollision} other
     */
    copy_from(other) {
        this.shape = other.shape;
        this.ray = other.ray;
        this.start = other.start;
        this.end = other.end;
    }
    clone() {
        var clone = new RayCollision();
        clone.copy_from(this);
        return clone;
    }
}
exports.RayCollision = RayCollision;
/**
 * A static extension class helper for RayCollision
 */
class RayCollisionHelper {
    /**
     * Convenience: get the start X point along the line.
     * It is possible the start point is not along the ray itself, when
     * the `start` value is < 0, the ray start is inside the shape.
     * If you need that point, use the ray.start point,
     * i.e `if(data.start < 0) point = data.ray.start; else point = data.hitStart();
     * @param {RayCollision} data
     * @return {Float}
     */
    static hitStartX(data) {
        return data.ray.start.x + (data.ray.dir.x * data.start);
    }
    /**
     * Convenience: get the start Y point along the line
     * @param {RayCollision} data
     * @return {Float}
     */
    static hitStartY(data) {
        return data.ray.start.y + (data.ray.dir.y * data.start);
    }
    /**
     * Convenience: get the end X point along the line.
     * Note that it is possible that this extends beyond the length of the ray,
     * when RayCollision `end` value is > 1, i.e the end of the ray is inside the shape area.
     * If you need that point, you would use ray.end as the point,
     * i.e `if(data.end > 1) point = data.ray.end; else point = data.hitEnd();`
     * @param {RayCollision} data
     * @return {Float}
     */
    static hitEndX(data) {
        return data.ray.end.x + (data.ray.dir.x * data.end);
    }
    /**
     * Convenience: get the end point along the line.
     * Note that it is possible that this extends beyond the length of the ray,
     * when RayCollision `end` value is > 1, i.e the end of the ray is inside the shape area.
     * If you need that point, you would use ray.end as the point,
     * i.e `if(data.end > 1) point = data.ray.end; else point = data.hitEnd();`
     * @param {RayCollision} data
     * @return {Float}
     */
    static hitEndY(data) {
        return data.ray.end.y + (data.ray.dir.y * data.end);
    }
}


/***/ }),
/* 22 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Shape = void 0;
const vector2_1 = __webpack_require__(20);
class Shape {
    constructor(x, y) {
        this.active = true; // The state of this shape, if inactive can be ignored in results
        this.name = ""; // The name of this shape, to help in debugging
        // tags = []                                // A list of tags to use for marking shapes with data for later use, by key/value
        this.position = new vector2_1.Vector2(); // The position of this shape
        this.x = 0; // The x position of this shape
        this.y = 0; // The y position of this shape
        this.rotation = 0; // The rotation of this shape, in degrees
        this.scaleX = 1; // The scale in the x direction of this shape
        this.scaleY = 1; // The scale in the y direction of this shape
        this.color = 0x00ff00;
        this.alpha = 0.5;
        this.x = x;
        this.y = y;
        this.position.x = x;
        this.position.y = y;
    }
    /**
     * @param {Shape} shape
     * @param {ShapeCollision} into
     * @return {ShapeCollision}
     */
    test(shape, into) { }
    /**
     *
     * @param {Circle} circle
     * @param {ShapeCollision} into
     * @param {Bool} flip
     * @return {ShapeCollision}
     */
    // testCircle(circle:Circle, into:ShapeCollision, flip = false) {
    // }
    /**
     *
     * @param {Polygon} polygon
     * @param {ShapeCollision} into
     * @param {Bool} flip
     * @return {ShapeCollision}
     */
    testPolygon(polygon, into, flip = false) { }
}
exports.Shape = Shape;


/***/ }),
/* 23 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ShapeCollision = void 0;
/**
 * Collision data, obtained by testing two shapes for a collision.
 */
class ShapeCollision {
    constructor() {
        this.overlap = 0; // The overlap amount
        this.separationX = 0; // X component of the separation vector, when subtracted from shape 1 will separate it from shape 2
        this.separationY = 0; // Y component of the separation vector, when subtracted from shape 1 will separate it from shape 2
        this.unitVectorX = 0; // X component of the unit vector, on the axis of the collision (i.e the normal of the face that was collided with)
        this.unitVectorY = 0; // Y component of the unit vector, on the axis of the collision (i.e the normal of the face that was collided with)
        this.otherOverlap = 0;
        this.otherSeparationX = 0;
        this.otherSeparationY = 0;
        this.otherUnitVectorX = 0;
        this.otherUnitVectorY = 0;
        this.shape1 = null; // The shape that was tested
        this.shape2 = null; // The shape that shape1 was tested against
    }
    reset() {
        this.shape1 = null;
        this.shape2 = null;
        this.overlap = 0;
        this.separationX = 0;
        this.separationY = 0;
        this.unitVectorX = 0;
        this.unitVectorY = 0;
        this.otherOverlap = 0;
        this.otherSeparationX = 0;
        this.otherSeparationY = 0;
        this.otherUnitVectorX = 0;
        this.otherUnitVectorY = 0;
        return this;
    }
    /**
     *
     * @param {ShapeCollision} _other
     */
    copy_from(_other) {
        this.overlap = _other.overlap;
        this.separationX = _other.separationX;
        this.separationY = _other.separationY;
        this.unitVectorX = _other.unitVectorX;
        this.unitVectorY = _other.unitVectorY;
        this.otherOverlap = _other.otherOverlap;
        this.otherSeparationX = _other.otherSeparationX;
        this.otherSeparationY = _other.otherSeparationY;
        this.otherUnitVectorX = _other.otherUnitVectorX;
        this.otherUnitVectorY = _other.otherUnitVectorY;
        this.shape1 = _other.shape1;
        this.shape2 = _other.shape2;
    }
}
exports.ShapeCollision = ShapeCollision;


/***/ }),
/* 24 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Helper = void 0;
class Helper {
    /**
     * The direction from a to b. The vector points towards b (b - a).
     * @param a - 1st entity.
     * @param b - 2nd entity.
     * @returns {Phaser.Point}
     */
    static directionTo(a, b) {
        let dx = b.getPosition().x - a.getPosition().x;
        let dy = b.getPosition().y - a.getPosition().y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        return new Phaser.Point(dx / distance, dy / distance);
    }
    static directionTo2(a, b) {
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        return new Phaser.Point(dx / distance, dy / distance);
    }
    /**
     * The distance from a to b.
     * @param a - 1st entity.
     * @param b - 2nd entity.
     * @returns {number}
     */
    static distanceTo(a, b) {
        let dx = b.getPosition().x - a.getPosition().x;
        let dy = b.getPosition().y - a.getPosition().y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    static distanceTo2(a, b) {
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    static distanceTo3(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    }
}
exports.Helper = Helper;


/***/ }),
/* 25 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Meter = exports.MeterDirection = void 0;
const konstants_1 = __webpack_require__(2);
const konstants_2 = __webpack_require__(2);
var MeterDirection;
(function (MeterDirection) {
    MeterDirection["Vertical"] = "Vertical";
    MeterDirection["Horizontal"] = "Horizontal";
})(MeterDirection = exports.MeterDirection || (exports.MeterDirection = {}));
class Meter {
    constructor(game, x, y, direction = MeterDirection.Vertical) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.activateEnergyState = new Phaser.Signal();
        this.deactivateEnergyState = new Phaser.Signal();
        this.currEnergy = 28;
        this.totalEnergy = 28;
        this.isGivingEnergy = false; // HACK: True, if the meter is 'working', giving energy; prevent meter logic from overlapping when player picks up two energy items.
        this.restoreSpeed = 75;
        this.isVisible = true;
        this.singlePoint = new Array();
        this.barHeight = 56;
        this.spacing = 2;
        this.energyTimer = null;
        this.energyFillSoundTimer = null;
        this.energyFillSound = null;
        this.direction == MeterDirection.Horizontal ? this.createHorizontalMeter() : this.createVerticalMeter();
        this.energyFillSound = this.game.add.audio(konstants_2.AudioName.energy_fill);
    }
    createHorizontalMeter() {
        this.background = this.game.add.sprite(this.x, this.y, konstants_1.Konstants.meter, 'horizontal_healthbar_background');
        this.background.fixedToCamera = true;
        this.game.add.existing(this.background);
        let tempSprite;
        for (let i = this.totalEnergy - 1; i >= 0; i--) {
            tempSprite = this.game.add.sprite(this.x + this.spacing * i, this.y, konstants_1.Konstants.meter, 'horizontal_healthbar_single');
            tempSprite.fixedToCamera = true;
            this.singlePoint.push(tempSprite);
            this.game.add.existing(tempSprite);
        }
    }
    createVerticalMeter() {
        this.background = this.game.add.sprite(this.x, this.y + 1, konstants_1.Konstants.meter, 'vertical_healthbar_background');
        this.background.fixedToCamera = true;
        this.game.add.existing(this.background);
        let tempSprite;
        for (let i = this.totalEnergy - 1; i >= 0; i--) {
            tempSprite = this.game.add.sprite(this.x, this.y + (this.barHeight - (this.spacing * i)) - 2, konstants_1.Konstants.meter, 'vertical_healthbar_single');
            tempSprite.fixedToCamera = true;
            this.singlePoint.push(tempSprite);
            this.game.add.existing(tempSprite);
        }
    }
    hide() {
        this.isVisible = false;
        this.background.visible = false;
        this.singlePoint.forEach((sprite) => {
            sprite.visible = false;
        });
    }
    show() {
        this.isVisible = true;
        this.background.visible = true;
        this.background.bringToTop();
        for (let i = 0; i < this.currEnergy; i++) {
            this.singlePoint[this.totalEnergy - 1 - i].visible = true;
            this.singlePoint[this.totalEnergy - 1 - i].bringToTop();
        }
    }
    takeOneEnergy() {
        if (this.currEnergy < 0) {
            this.currEnergy = 0;
            return;
        }
        this.currEnergy--;
        for (let i = 0; i <= this.singlePoint.length - 1; i++) {
            if (this.singlePoint[i].visible) {
                this.singlePoint[i].visible = false;
                return;
            }
        }
    }
    takeEnergy(amount) {
        let count = 0;
        for (let i = 0; i <= amount; i++) {
            this.takeOneEnergy();
            count++;
            if (count >= amount) {
                return;
            }
        }
    }
    restoreEnergy(amount) {
        this.isGivingEnergy = true;
        this.activateEnergyState.dispatch();
        this.energyTimer = this.game.time.create(true);
        this.energyFillSoundTimer = this.game.time.create(true);
        let count = 0;
        this.energyTimer.loop(this.restoreSpeed, () => {
            this.currEnergy++;
            for (let i = this.singlePoint.length - 1; i >= 0; i--) {
                if (!this.singlePoint[i].visible) {
                    this.singlePoint[i].visible = true;
                    this.singlePoint[i].bringToTop();
                    break;
                }
            }
            count++;
            if (count >= amount || this.currEnergy >= this.totalEnergy) {
                this.isGivingEnergy = false;
                this.energyTimer.stop();
                this.deactivateEnergyState.dispatch();
                return;
            }
        }, this);
        this.energyFillSoundTimer.loop(75, () => {
            this.energyFillSound.play();
            if (!this.isGivingEnergy) {
                this.energyFillSoundTimer.stop();
                return;
            }
        }, this);
        this.energyTimer.start();
        this.energyFillSoundTimer.start();
    }
    setEnergy(value) {
        this.currEnergy = value;
        let count = 0;
        for (let i = 0; i < this.totalEnergy - value; i++) {
            if (this.singlePoint[i].visible) {
                this.singlePoint[i].visible = false;
                count++;
                if (count == value) {
                    return;
                }
            }
        }
    }
    reset() {
        for (let i = 0; i <= this.singlePoint.length - 1; i++) {
            this.singlePoint[i].visible = true;
        }
        this.currEnergy = this.totalEnergy;
    }
    playEnergyFillSound() {
        if (this.energyFillSound.isPlaying) {
            return;
        }
        if (this.energyFillSound.isPlaying && this.energyFillSound.currentTime < 50) {
            return;
        }
        this.energyFillSound.play();
    }
}
exports.Meter = Meter;


/***/ }),
/* 26 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayerInput = void 0;
const input_1 = __webpack_require__(27);
class PlayerInput extends input_1.Input {
    constructor(game) {
        super(game);
    }
    update(player) {
        if (this.preventControl) {
            return;
        }
        if (!player.alive) {
            return;
        }
        if (player.isHurt) {
            return;
        }
        if (player.isWarpingIn) {
            return;
        }
        if (player.isDisrupted) {
            return;
        }
        if (input_1.Input.leftKey.isDown) {
            player.move(-player.horizontalSpeed, player.targetSpeed.y, -1);
        }
        if (input_1.Input.rightKey.isDown) {
            player.move(player.horizontalSpeed, player.targetSpeed.y, 1);
        }
        if (!input_1.Input.leftKey.isDown && !input_1.Input.rightKey.isDown) {
            player.move(0, player.targetSpeed.y, player.getFacingDirection());
        }
        if (input_1.Input.downKey.isDown) {
            player.getOnLadder(false);
            player.moveOnLadder(player.ladderSpeed);
        }
        if (input_1.Input.upKey.isDown) {
            player.getOnLadder(true);
            player.moveOnLadder(-player.ladderSpeed);
        }
        if (!input_1.Input.downKey.isDown && !input_1.Input.upKey.isDown) {
            player.moveOnLadder(0);
        }
        if (input_1.Input.dKey.downDuration(1)) {
            player.shoot();
        }
        if (input_1.Input.fKey.justDown) {
            if (input_1.Input.downKey.isDown) {
                player.slide();
            }
            else {
                player.jump();
            }
        }
        if (input_1.Input.fKey.justUp) {
            player.jumpReleased();
        }
        if (input_1.Input.commaKey.justDown) {
            player.switchWeapon(-1);
        }
        if (input_1.Input.periodKey.justDown) {
            player.switchWeapon(1);
        }
    }
}
exports.PlayerInput = PlayerInput;


/***/ }),
/* 27 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Input = void 0;
class Input {
    constructor(game) {
        this.game = game;
        this.preventControl = false;
        Input.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        Input.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        Input.upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        Input.downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        Input.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        Input.eKey = game.input.keyboard.addKey(Phaser.Keyboard.E);
        Input.commaKey = game.input.keyboard.addKey(Phaser.Keyboard.COMMA);
        Input.periodKey = game.input.keyboard.addKey(Phaser.Keyboard.PERIOD);
        Input.oneKey = game.input.keyboard.addKey(Phaser.Keyboard.ONE);
        Input.twoKey = game.input.keyboard.addKey(Phaser.Keyboard.TWO);
        Input.threeKey = game.input.keyboard.addKey(Phaser.Keyboard.THREE);
        Input.fourKey = game.input.keyboard.addKey(Phaser.Keyboard.FOUR);
        Input.wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
        Input.aKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
        Input.sKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
        Input.dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
        Input.fKey = game.input.keyboard.addKey(Phaser.Keyboard.F);
        Input.pKey = game.input.keyboard.addKey(Phaser.Keyboard.P);
        Input.qKey = game.input.keyboard.addKey(Phaser.Keyboard.Q);
        Input.rKey = game.input.keyboard.addKey(Phaser.Keyboard.R);
        Input.zKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);
    }
    update(player) { }
}
exports.Input = Input;


/***/ }),
/* 28 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayerGraphics = void 0;
const graphics_1 = __webpack_require__(29);
const player_1 = __webpack_require__(15);
const weapon_1 = __webpack_require__(4);
class PlayerGraphics extends graphics_1.Graphics {
    constructor(game) {
        super(game);
    }
    update(player) {
        if (player.isDisrupted) {
            player.animations.play(player_1.MegaManAnimations.lose_control);
            return;
        }
        if (player.isWarpingIn) {
            player.animations.play(player_1.MegaManAnimations.unpause_effect);
            return;
        }
        if (player.isHurt) {
            player.animations.play(player_1.MegaManAnimations.hurt);
            return;
        }
        if (player.isOnLadder) {
            if (player.isShooting) {
                player.animations.play(player_1.MegaManAnimations.ladder_shoot);
                return;
            }
            if (Math.abs(player.targetSpeed.y) > 0) {
                player.animations.play(player_1.MegaManAnimations.ladder);
                return;
            }
            if (player.targetSpeed.y == 0) {
                player.animations.play(player_1.MegaManAnimations.ladder_idle);
                return;
            }
        }
        if (player.isOnGround) {
            if (player.isRunning) {
                if (player.isShooting) {
                    if (player.getCurrentWeapon().type == weapon_1.WeaponType.MegaBuster ||
                        player.getCurrentWeapon().type == weapon_1.WeaponType.IceMan ||
                        player.getCurrentWeapon().type == weapon_1.WeaponType.FireMan ||
                        player.getCurrentWeapon().type == weapon_1.WeaponType.ElecMan) {
                        player.animations.play(player_1.MegaManAnimations.run_shoot);
                    }
                    else if (player.getCurrentWeapon().type == weapon_1.WeaponType.CutMan ||
                        player.getCurrentWeapon().type == weapon_1.WeaponType.BombMan) {
                        player.animations.play(player_1.MegaManAnimations.throw);
                    }
                }
                else {
                    player.animations.play(player_1.MegaManAnimations.run);
                }
            }
            if (!player.isIdle && player.getVelocity().x == 0 && !player.isJumping && !player.isRunning && !player.isShooting) {
                player.animations.play(player_1.MegaManAnimations.idle);
            }
            if (!player.isIdle && !player.isRunning && player.isShooting && !player.isJumping && player.animations.currentAnim.name != player_1.MegaManAnimations.idle_shoot) {
                if (player.getCurrentWeapon().type == weapon_1.WeaponType.MegaBuster ||
                    player.getCurrentWeapon().type == weapon_1.WeaponType.IceMan ||
                    player.getCurrentWeapon().type == weapon_1.WeaponType.FireMan ||
                    player.getCurrentWeapon().type == weapon_1.WeaponType.ElecMan) {
                    player.animations.play(player_1.MegaManAnimations.idle_shoot);
                }
                else if (player.getCurrentWeapon().type == weapon_1.WeaponType.CutMan) {
                    player.animations.play(player_1.MegaManAnimations.throw);
                }
            }
            if (player.isIdle && player.animations.currentAnim.name != player_1.MegaManAnimations.blink) {
                player.animations.play(player_1.MegaManAnimations.blink);
            }
            if (player.isSliding) {
                player.animations.play(player_1.MegaManAnimations.slide);
                return;
            }
            if (player.isOnMovingPlatform) {
                if (!player.isRunning) {
                    player.animations.play(player_1.MegaManAnimations.idle);
                }
                if (!player.isRunning && player.isShooting) {
                    player.animations.play(player_1.MegaManAnimations.idle_shoot);
                }
            }
        }
        else {
            if (player.isJumping && player.isShooting && player.animations.currentAnim.name != player_1.MegaManAnimations.jump_shoot) {
                player.animations.play(player_1.MegaManAnimations.jump_shoot);
            }
            if (player.isJumping && !player.isShooting && player.animations.currentAnim.name != player_1.MegaManAnimations.jump) {
                player.animations.play(player_1.MegaManAnimations.jump);
            }
            if (player.isFalling && !player.isShooting) {
                player.animations.play(player_1.MegaManAnimations.jump);
            }
        }
    }
}
exports.PlayerGraphics = PlayerGraphics;


/***/ }),
/* 29 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Graphics = void 0;
class Graphics {
    constructor(game) {
        this.game = game;
    }
    update(player) {
    }
}
exports.Graphics = Graphics;


/***/ }),
/* 30 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Blader = void 0;
const enemy_1 = __webpack_require__(31);
const konstants_1 = __webpack_require__(2);
const stateMachine_1 = __webpack_require__(33);
const mathutil_1 = __webpack_require__(34);
const main_1 = __webpack_require__(0);
var BladerAnimations;
(function (BladerAnimations) {
    BladerAnimations["idle"] = "idle";
})(BladerAnimations || (BladerAnimations = {}));
class Blader extends enemy_1.Enemy {
    constructor(myWorld, tag, myEntityType, game, x, y, key, frame) {
        super(myWorld, tag, myEntityType, game, x, y, key, frame);
        this.horizontalSpeed = 50;
        this.targetSpeed = new Phaser.Point(0, 0);
        this.targetPos = new Phaser.Point();
        this.afterTargetPos = new Phaser.Point();
        this.attackSpeed = 100; // todo: speed too high, blader overshoots the arrival position and jitters forever
        this.getPosition().x = x;
        this.getPosition().y = y;
        this.position.x = this.getPosition().x;
        this.position.y = this.getPosition().y;
        this.anchor.setTo(0.5, 0.5);
        this.smoothed = false;
        this.setFacingDirection(1);
        this.health = 1;
        this.maxHealth = 1;
        this.animations.add(BladerAnimations.idle, ['blader_01', 'blader_02'], 7, true, false);
        this.animations.play(BladerAnimations.idle);
        this.hitbox = new Phaser.Rectangle(this.getPosition().x, this.getPosition().y, 16, 16);
        this.hitboxOffset.x = -this.hitbox.halfWidth;
        this.hitboxOffset.y = -this.hitbox.halfHeight;
        this.updateRect();
        this.fsm = new stateMachine_1.StateMachine();
        this.fsm.addState(BladerState.move, new BladerMoveState(this));
        this.fsm.addState(BladerState.attack, new BladerAttackState(this));
        this.fsm.addState(BladerState.goBackUp, new BladerGoBackUpkState(this));
        this.fsm.changeState(BladerState.move);
    }
    manualUpdate() {
        // this.pGraphicsDebug.clear();
        if (!this.alive) {
            return;
        }
        this.frozen.update();
        if (this.frozen.isFrozen) {
            return;
        }
        this.fsm.currentState.update();
        this.velocity.x = this.targetSpeed.x;
        this.velocity.y = this.targetSpeed.y;
        this.getPosition().x += this.velocity.x * main_1.fixedTime;
        this.getPosition().y += this.velocity.y * main_1.fixedTime;
        this.position.x = (this.getPosition().x + 0.5) | 0;
        this.position.y = this.getPosition().y;
        this.updateRect();
    }
    takeDamage(damage) {
        if (this.isShielded) {
            this.game.sound.play(konstants_1.AudioName.dink);
            return;
        }
        if (this.health <= 0) {
            return;
        }
        this.game.sound.play(konstants_1.AudioName.enemy_damage);
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            this.myWorld.dropManager.dropPowerUp(this.getPosition().x, this.getPosition().y);
            this.myWorld.createExplosionEffect(this.getPosition().x, this.getPosition().y);
            this.kill();
        }
    }
}
exports.Blader = Blader;
var BladerState;
(function (BladerState) {
    BladerState["move"] = "move";
    BladerState["attack"] = "attack";
    BladerState["goBackUp"] = "goBackUp";
})(BladerState || (BladerState = {}));
class BladerMoveState {
    constructor(actor) {
        this.name = BladerState.move;
        this.startX = 0;
        this.startY = 0;
        this.endX = 0;
        this.endY = 0;
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
        this.player = this.actor.myWorld.entityManager.player;
        let dirX = mathutil_1.MathUtil.sign(this.player.getPosition().x - this.actor.getPosition().x);
        this.actor.targetSpeed.x = this.actor.horizontalSpeed * dirX;
        this.actor.setFacingDirection(-dirX);
    }
    update() {
        if (Math.abs(this.actor.getPosition().x - this.player.getPosition().x) < 25) {
            this.actor.targetPos.x = this.player.getPosition().x;
            this.actor.targetPos.y = this.player.getPosition().y;
            this.actor.afterTargetPos.x = this.player.getPosition().x + 25 * mathutil_1.MathUtil.sign(this.actor.targetSpeed.x);
            this.actor.afterTargetPos.y = this.actor.getPosition().y;
            this.actor.fsm.changeState(BladerState.attack);
            return;
        }
    }
    exit() {
        this.initialized = false;
    }
}
class BladerAttackState {
    constructor(actor) {
        this.name = BladerState.attack;
        this.startX = 0;
        this.startY = 0;
        this.endX = 0;
        this.endY = 0;
        this.elapsedTime = 0;
        this.endTime = 500;
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
        this.startX = this.actor.getPosition().x;
        this.startY = this.actor.getPosition().y;
        this.endX = this.actor.myWorld.entityManager.player.getPosition().x;
        this.endY = this.actor.myWorld.entityManager.player.getPosition().y;
        this.actor.targetSpeed.x = 0;
        this.actor.targetSpeed.y = 0;
    }
    update() {
        this.elapsedTime += main_1.fixedTimeMS;
        this.actor.getPosition().x = mathutil_1.MathUtil.lerp(this.startX, this.endX, this.elapsedTime / this.endTime);
        this.actor.getPosition().y = mathutil_1.MathUtil.lerp(this.startY, this.endY, this.elapsedTime / this.endTime);
        if (this.elapsedTime >= this.endTime) {
            this.actor.fsm.changeState(BladerState.goBackUp);
            return;
        }
    }
    exit() {
        this.initialized = false;
        this.elapsedTime = 0;
    }
}
class BladerGoBackUpkState {
    constructor(actor) {
        this.name = BladerState.goBackUp;
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
    }
    update() {
        let dx = this.actor.afterTargetPos.x - this.actor.getPosition().x;
        let dy = this.actor.afterTargetPos.y - this.actor.getPosition().y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let dirX = dx / distance;
        let dirY = dy / distance;
        this.actor.targetSpeed.x = dirX * this.actor.attackSpeed;
        this.actor.targetSpeed.y = dirY * this.actor.attackSpeed;
        if (distance < 1) {
            this.actor.targetSpeed.x = 0;
            this.actor.targetSpeed.y = 0;
            this.actor.fsm.changeState(BladerState.move);
            return;
        }
    }
    exit() {
        this.initialized = false;
    }
}


/***/ }),
/* 31 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Enemy = void 0;
const entity_1 = __webpack_require__(16);
const frozen_1 = __webpack_require__(32);
class Enemy extends entity_1.Entity {
    constructor(myWorld, tag, e, game, x, y, key, frame) {
        super(myWorld, tag, e, game, x, y, key, frame);
        this.frozen = new frozen_1.Frozen(this);
    }
}
exports.Enemy = Enemy;


/***/ }),
/* 32 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Frozen = void 0;
const konstants_1 = __webpack_require__(2);
const main_1 = __webpack_require__(0);
class Frozen {
    constructor(owner) {
        this.owner = owner;
        this.isFrozen = false;
        this.frozenElapsedTime = 0;
        this.frozenEndTime = 3000;
    }
    update() {
        if (!this.isFrozen) {
            return;
        }
        this.frozenElapsedTime += main_1.fixedTimeMS;
        if (this.frozenElapsedTime >= this.frozenEndTime) {
            this.frozenElapsedTime = 0;
            this.isFrozen = false;
            this.owner.animations.paused = false;
        }
    }
    freeze() {
        if (this.isFrozen) {
            return;
        }
        this.owner.game.sound.play(konstants_1.AudioName.enemy_damage);
        this.isFrozen = true;
        this.owner.animations.paused = true;
    }
}
exports.Frozen = Frozen;


/***/ }),
/* 33 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StateMachine = void 0;
const mathutil_1 = __webpack_require__(34);
class StateMachine {
    constructor() {
        this.prevState = null;
        this.currentState = null;
        this.states = new mathutil_1.KeyedCollection();
    }
    addState(name, state) {
        state.name = name;
        this.states.Add(name, state);
    }
    changeState(state) {
        if (this.currentState != null || this.currentState != undefined) {
            this.currentState.exit();
        }
        this.prevState = this.currentState;
        this.currentState = this.states.Item(state);
        this.currentState.enter();
    }
}
exports.StateMachine = StateMachine;


/***/ }),
/* 34 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KeyedCollection = exports.MathUtil = void 0;
const PI = 3.14159265358979323846264;
const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;
class MathUtil {
    static sign(s) {
        if (s >= 0) {
            return 1;
        }
        else {
            return -1;
        }
    }
    /**
     * see: https://stackoverflow.com/questions/1761626/weighted-random-numbers
     * @param choices An array of 'weights' as the percent chance of being chosen
     * @param sumOfWeights
     */
    static weightedRandom(choices, sumOfWeights) {
        var rand = Math.random() * sumOfWeights;
        for (var i = 0; i < choices.length; i++) {
            if (rand < choices[i]) {
                return i;
            }
            rand -= choices[i];
        }
    }
    /**
     * Built for KeyedCollection
     * see: http://www.dustinhorne.com/post/2016/06/09/implementing-a-dictionary-in-typescript
     *
     * @param choices
     * @param sumOfWeights
     */
    static weightedRandomKey(choices, sumOfWeights) {
        var rand = Math.random() * sumOfWeights;
        for (var i = 0; i < choices.Count(); i++) {
            var value = choices.Item(choices.Keys()[i]);
            if (rand < value) {
                return choices.Keys()[i];
            }
            rand -= value;
        }
    }
    /**
     * Clamps a number. Based on Zevan's idea: http://actionsnippet.com/?p=475
     * params: val, min, max
     * Author: Jakub Korzeniowski
     * Agency: Softhis
     * http://www.softhis.com
     */
    // (function () { Math.clamp = function (a, b, c) { return Math.max(b, Math.min(c, a)); } })();
    /*
        You can simply use Javascript's .toFixed(<number>)
    
        Deprecated.
    */
    // (function () { Math.roundTo2Places = function (a) { return (Math.round(a) * 100) / 100; } })();
    // (function () {
    //     Math.distanceSq = function (a, b) {
    //         return (b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y);
    //     }
    // })();
    // (function () {
    //     Math.distance = function (a, b) {
    //         return Math.sqrt((b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y));
    //     }
    // })();
    /**
     * Get a random floating point number between `min` and `max`.
     * @param {number} min - min number
     * @param {number} max - max number
     * @return {float} a random floating point number
     */
    // (function () {
    //     Math.getRandomFloat = function (min, max) {
    //         return Math.random() * (max - min) + min;
    //     }
    // })();
    /**
     * Get a random integer between `min` and `max`.
     * @param {number} min - min number
     * @param {number} max - max number
     * @return {int} a random integer
     */
    // (function () {
    //     Math.getRandomInt = function (min, max) {
    //         return Math.floor(Math.random() * (max - min + 1) + min);
    //     }
    // })();
    /**
     * Swaps two things.
     * @param {*} a -
     * @param {*} b -
     */
    // (function () {
    //     Math.swap = function (a, b) {
    //         var t = a;
    //         a = b;
    //         b = t;
    //     }
    // })();
    // (function () {
    // 	/**
    // 	 * Linearly interpolates between a and b.
    // 	 * see: https://en.wikipedia.org/wiki/Linear_interpolation
    // 	 * @param {} a - The first value.
    // 	 * @param {} b - The second value.
    // 	 * @param {} t - Time.
    // 	 * @return The linear interpolation between a and b based on t.
    // 	 */
    //     Math.lerp = function (a, b, t) {
    //         return (1 - t) * a + t * b;
    //     }
    // })();
    static lerp(a, b, t) {
        return (1 - t) * a + t * b;
    }
}
exports.MathUtil = MathUtil;
/**
 * see: http://www.dustinhorne.com/post/2016/06/09/implementing-a-dictionary-in-typescript
 */
class KeyedCollection {
    constructor() {
        this.items = {};
        this.count = 0;
    }
    ContainsKey(key) {
        return this.items.hasOwnProperty(key);
    }
    Count() {
        return this.count;
    }
    Add(key, value) {
        if (!this.items.hasOwnProperty(key))
            this.count++;
        this.items[key] = value;
    }
    Remove(key) {
        var val = this.items[key];
        delete this.items[key];
        this.count--;
        return val;
    }
    Item(key) {
        return this.items[key];
    }
    Keys() {
        var keySet = [];
        for (var prop in this.items) {
            if (this.items.hasOwnProperty(prop)) {
                keySet.push(prop);
            }
        }
        return keySet;
    }
    Values() {
        var values = [];
        for (var prop in this.items) {
            if (this.items.hasOwnProperty(prop)) {
                values.push(this.items[prop]);
            }
        }
        return values;
    }
}
exports.KeyedCollection = KeyedCollection;


/***/ }),
/* 35 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Met = void 0;
const enemy_1 = __webpack_require__(31);
const konstants_1 = __webpack_require__(2);
const mathutil_1 = __webpack_require__(34);
const stateMachine_1 = __webpack_require__(33);
const main_1 = __webpack_require__(0);
var MetAnimations;
(function (MetAnimations) {
    MetAnimations["idle"] = "idle";
    MetAnimations["active"] = "active";
})(MetAnimations || (MetAnimations = {}));
class Met extends enemy_1.Enemy {
    constructor(myWorld, tag, e, game, x, y, key, frame) {
        super(myWorld, tag, e, game, x, y, key, frame);
        this.horizontalSpeed = 50;
        this.targetSpeed = new Phaser.Point(0, 0);
        this.getPosition().x = x;
        this.getPosition().y = y;
        this.position.x = this.getPosition().x;
        this.position.y = this.getPosition().y;
        this.anchor.setTo(0.5, 1);
        this.smoothed = false;
        this.setFacingDirection(-1);
        this.health = 1;
        this.maxHealth = 1;
        this.isShielded = true;
        this.fsm = new stateMachine_1.StateMachine();
        this.fsm.addState(MetState.idle, new MetIdleState(this));
        this.fsm.addState(MetState.active, new MetActiveState(this));
        this.fsm.changeState(MetState.idle);
        this.animations.add(MetAnimations.idle, ['met_idle'], 10, false, false);
        this.animations.add(MetAnimations.active, ['met_active'], 10, false, false);
        this.animations.play(MetAnimations.idle);
        this.hitbox = new Phaser.Rectangle(this.getPosition().x, this.getPosition().y, 16, 12);
        this.hitboxOffset.x = -8;
        this.hitboxOffset.y = -6;
        this.updateRect();
    }
    manualUpdate() {
        // this.pGraphicsDebug.clear();
        if (!this.alive) {
            return;
        }
        this.frozen.update();
        if (this.frozen.isFrozen) {
            return;
        }
        this.fsm.currentState.update();
        this.velocity.x = this.targetSpeed.x;
        this.velocity.y = this.targetSpeed.y;
        this.getPosition().x += this.velocity.x * main_1.fixedTime;
        this.getPosition().y += this.velocity.y * main_1.fixedTime;
        this.position.x = (this.getPosition().x + 0.5) | 0;
        this.position.y = this.getPosition().y;
        this.updateRect();
    }
    takeDamage(damage) {
        if (this.isShielded) {
            this.game.sound.play(konstants_1.AudioName.dink);
            return;
        }
        if (this.health <= 0) {
            return;
        }
        this.game.sound.play(konstants_1.AudioName.enemy_damage);
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            this.myWorld.dropManager.dropPowerUp(this.getPosition().x - 8, this.getPosition().y);
            this.myWorld.createExplosionEffect(this.getPosition().x, this.getPosition().y - this.hitbox.halfHeight);
            this.kill();
        }
        else {
        }
    }
    shoot() {
        this.game.sound.play(konstants_1.AudioName.enemy_shoot);
        this.isShielded = false;
        this.animations.play(MetAnimations.active);
        let bullet = this.myWorld.entityManager.createBitmapBullet(this, this.position.x, this.position.y, 6, 6, konstants_1.EntityType.bullet, konstants_1.EntityType.met_bullet);
        bullet.horizontalSpeed = 35;
        bullet.targetSpeed.x = bullet.horizontalSpeed * -this.getFacingDirection();
        bullet = this.myWorld.entityManager.createBitmapBullet(this, this.position.x, this.position.y, 6, 6, konstants_1.EntityType.bullet, konstants_1.EntityType.met_bullet);
        bullet.horizontalSpeed = 35;
        let cos = Math.cos(45 * (Math.PI / 180));
        let sin = Math.sin(45 * (Math.PI / 180));
        bullet.targetSpeed.x = bullet.horizontalSpeed * cos * -this.getFacingDirection();
        bullet.targetSpeed.y = bullet.horizontalSpeed * sin * -this.getFacingDirection();
        bullet = this.myWorld.entityManager.createBitmapBullet(this, this.position.x, this.position.y, 6, 6, konstants_1.EntityType.bullet, konstants_1.EntityType.met_bullet);
        bullet.horizontalSpeed = 35;
        cos = Math.cos(-45 * (Math.PI / 180));
        sin = Math.sin(-45 * (Math.PI / 180));
        bullet.targetSpeed.x = bullet.horizontalSpeed * cos * -this.getFacingDirection();
        bullet.targetSpeed.y = bullet.horizontalSpeed * sin * -this.getFacingDirection();
    }
}
exports.Met = Met;
var MetState;
(function (MetState) {
    MetState["idle"] = "idle";
    MetState["active"] = "active";
})(MetState || (MetState = {}));
class MetIdleState {
    constructor(actor) {
        this.name = MetState.idle;
        this.elapsedTime = 0;
        this.minIdleTime = 500;
        this.maxIdleTime = 2000;
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
        this.actor.animations.play(MetAnimations.idle);
        this.actor.isShielded = true;
        this.endTime = this.minIdleTime + (Math.random() * (this.maxIdleTime - this.minIdleTime));
    }
    update() {
        this.actor.setFacingDirection(mathutil_1.MathUtil.sign(this.actor.getPosition().x - this.actor.myWorld.entityManager.player.getPosition().x));
        this.elapsedTime += main_1.fixedTimeMS;
        if (this.elapsedTime > this.endTime) {
            this.elapsedTime = 0;
            this.actor.fsm.changeState(MetAnimations.active);
            return;
        }
    }
    exit() {
        this.initialized = false;
        this.elapsedTime = 0;
    }
}
class MetActiveState {
    constructor(actor) {
        this.name = MetState.active;
        this.elapsedTime = 0;
        this.endTime = 200;
        this.shootDelayElapsedTime = 0;
        this.shootDelayEndTime = 550;
        this.hasShot = false;
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
        this.actor.animations.play(MetAnimations.active);
        this.actor.isShielded = false;
    }
    update() {
        this.checkIfCanShoot();
        this.checkIfCanIdle();
    }
    exit() {
        this.initialized = false;
        this.elapsedTime = 0;
        this.shootDelayElapsedTime = 0;
        this.hasShot = false;
    }
    checkIfCanShoot() {
        if (this.hasShot) {
            return;
        }
        this.shootDelayElapsedTime += main_1.fixedTimeMS;
        if (this.shootDelayElapsedTime < this.shootDelayEndTime) {
            return;
        }
        this.hasShot = true;
        this.actor.shoot();
    }
    checkIfCanIdle() {
        if (!this.hasShot) {
            return;
        }
        this.elapsedTime += main_1.fixedTimeMS;
        if (this.elapsedTime > this.endTime) {
            this.elapsedTime = 0;
            this.actor.fsm.changeState(MetState.idle);
            return;
        }
    }
}


/***/ }),
/* 36 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Beak = void 0;
const enemy_1 = __webpack_require__(31);
const konstants_1 = __webpack_require__(2);
const stateMachine_1 = __webpack_require__(33);
const main_1 = __webpack_require__(0);
var BeakAnimationNames;
(function (BeakAnimationNames) {
    BeakAnimationNames["idle"] = "idle";
    BeakAnimationNames["open"] = "open";
    BeakAnimationNames["close"] = "close";
})(BeakAnimationNames || (BeakAnimationNames = {}));
class Beak extends enemy_1.Enemy {
    constructor(myWorld, tag, myEntityType, game, x, y, key, frame) {
        super(myWorld, tag, myEntityType, game, x, y, key, frame);
        this.positionOffset = new Phaser.Point();
        this.fsm = new stateMachine_1.StateMachine();
        this.fsm.addState(BeakState.idle, new BeakIdleState(this));
        this.fsm.addState(BeakState.opening, new BeakOpeningState(this));
        this.fsm.addState(BeakState.closing, new BeakClosingState(this));
        this.fsm.addState(BeakState.shooting, new BeakShootingState(this));
        this.fsm.changeState(BeakState.idle);
        this.getPosition().x = x;
        this.getPosition().y = y;
        this.position.x = this.getPosition().x;
        this.position.y = this.getPosition().y;
        this.smoothed = false;
        this.health = 1;
        this.maxHealth = 1;
        this.isShielded = true;
        this.animations.add(BeakAnimationNames.idle, ['beak_01'], 10, false, false);
        this.animations.add(BeakAnimationNames.open, ['beak_02', 'beak_03', 'beak_04'], 7, false, false);
        this.animations.add(BeakAnimationNames.close, ['beak_04', 'beak_03', 'beak_02'], 7, false, false);
        this.animations.play(BeakAnimationNames.idle);
        this.hitbox = new Phaser.Rectangle(0, 0, 8, 14); // set by setDirectionFromRotation()
        this.hitboxOffset.x = -this.hitbox.halfWidth;
        this.hitboxOffset.y = -this.hitbox.halfHeight;
        this.updateRect();
    }
    manualUpdate() {
        // this.pGraphicsDebug.clear();
        if (!this.alive) {
            return;
        }
        this.frozen.update();
        if (this.frozen.isFrozen) {
            return;
        }
        this.fsm.currentState.update();
        this.updateRect();
    }
    setDirectionFromRotation(rotation) {
        switch (rotation) {
            case 0:
                this.setFacingDirection(1);
                this.positionOffset.x = -8;
                this.positionOffset.y = -8;
                this.hitboxOffset.x = 8;
                this.hitboxOffset.y = 1;
                break;
            case 180:
                this.setFacingDirection(-1);
                this.positionOffset.x = -8;
                this.positionOffset.y = 8;
                this.hitboxOffset.x = -16;
                this.hitboxOffset.y = 0;
                break;
            default:
                console.error('Beak: rotation doesnt exist');
                break;
        }
        this.getPosition().x = this.position.x + this.positionOffset.x;
        this.getPosition().y = this.position.y + this.positionOffset.y;
        this.position.x = this.getPosition().x;
        this.position.y = this.getPosition().y;
    }
    takeDamage(damage) {
        if (this.isShielded) {
            this.game.sound.play(konstants_1.AudioName.dink);
            return;
        }
        if (this.health <= 0) {
            return;
        }
        this.game.sound.play(konstants_1.AudioName.enemy_damage);
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            this.myWorld.dropManager.dropPowerUp(this.getPosition().x + this.hitbox.halfWidth, this.getPosition().y);
            this.myWorld.createExplosionEffect(this.getPosition().x + this.hitbox.halfWidth * 3, this.getPosition().y + this.hitbox.halfHeight);
            this.kill();
        }
        else {
        }
    }
    shoot(angle) {
        this.game.sound.play(konstants_1.AudioName.enemy_shoot);
        this.isShielded = false;
        let xOffset = this.getFacingDirection();
        let bullet = this.myWorld.entityManager.createBitmapBullet(this, this.position.x - xOffset, this.position.y + 8, 6, 6, konstants_1.EntityType.bullet, konstants_1.EntityType.beak_bullet);
        bullet.horizontalSpeed = 125;
        let cos = Math.cos(angle * (Math.PI / 180));
        let sin = Math.sin(angle * (Math.PI / 180));
        bullet.targetSpeed.x = bullet.horizontalSpeed * cos * -this.getFacingDirection();
        bullet.targetSpeed.y = bullet.horizontalSpeed * sin * -this.getFacingDirection();
    }
}
exports.Beak = Beak;
var BeakState;
(function (BeakState) {
    BeakState["idle"] = "idle";
    BeakState["opening"] = "opening";
    BeakState["closing"] = "closing";
    BeakState["shooting"] = "shooting";
})(BeakState || (BeakState = {}));
class BeakIdleState {
    constructor(actor) {
        this.elapsedTime = 0;
        this.endTime = 2000;
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
        this.actor.animations.play(BeakAnimationNames.idle);
        this.actor.isShielded = true;
    }
    update() {
        this.elapsedTime += main_1.fixedTimeMS;
        if (this.elapsedTime > this.endTime) {
            this.elapsedTime = 0;
            this.actor.fsm.changeState(BeakState.opening);
            return;
        }
    }
    exit() {
        this.initialized = false;
    }
}
class BeakOpeningState {
    constructor(actor) {
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
        this.actor.animations.play(BeakAnimationNames.open);
        this.actor.isShielded = false;
    }
    update() {
        if (this.actor.animations.currentAnim.isFinished) {
            this.actor.fsm.changeState(BeakState.shooting);
            return;
        }
    }
    exit() {
        this.initialized = false;
    }
}
class BeakShootingState {
    constructor(actor) {
        this.elapsedTime = 0;
        this.shootDelay = 450;
        this.numBullets = 0;
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
        this.elapsedTime = this.shootDelay;
    }
    update() {
        this.elapsedTime += main_1.fixedTimeMS;
        if (this.elapsedTime > this.shootDelay) {
            this.elapsedTime = 0;
            this.numBullets++;
            switch (this.numBullets) {
                case 1:
                    this.actor.shoot(45);
                    break;
                case 2:
                    this.actor.shoot(12);
                    break;
                case 3:
                    this.actor.shoot(-12);
                    break;
                case 4:
                    this.actor.shoot(-45);
                    this.actor.fsm.changeState(BeakState.closing);
                    return;
            }
        }
    }
    exit() {
        this.initialized = false;
        this.numBullets = 0;
        this.elapsedTime = 0;
    }
}
class BeakClosingState {
    constructor(actor) {
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
        this.actor.animations.play(BeakAnimationNames.close);
        this.actor.isShielded = false;
    }
    update() {
        if (this.actor.animations.currentAnim.isFinished) {
            this.actor.fsm.changeState(BeakState.idle);
            return;
        }
    }
    exit() {
        this.initialized = false;
    }
}


/***/ }),
/* 37 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SniperJoe = void 0;
const enemy_1 = __webpack_require__(31);
const konstants_1 = __webpack_require__(2);
const helper_1 = __webpack_require__(24);
const stateMachine_1 = __webpack_require__(33);
const vector2_1 = __webpack_require__(20);
const ray_1 = __webpack_require__(19);
const ray_2 = __webpack_require__(19);
const sat2d_1 = __webpack_require__(17);
const main_1 = __webpack_require__(0);
var SniperJoeAnimationNames;
(function (SniperJoeAnimationNames) {
    SniperJoeAnimationNames["idle"] = "idle";
    SniperJoeAnimationNames["pre_shoot"] = "pre_shoot";
    SniperJoeAnimationNames["jump"] = "jump";
})(SniperJoeAnimationNames || (SniperJoeAnimationNames = {}));
class SniperJoe extends enemy_1.Enemy {
    constructor(myWorld, tag, e, game, x, y, key, frame) {
        super(myWorld, tag, e, game, x, y, key, frame);
        this.horizontalSpeed = 50;
        this.targetSpeed = new Phaser.Point(0, 0);
        this.isOnGround = true;
        this.useGravity = true;
        this.isJumping = true;
        this.isFalling = true;
        this.minJumpHeight = 1;
        this.maxJumpHeight = 44;
        this.timeToJumpApex = 0.35;
        this.gravityX = 0;
        this.gravityY = 0;
        this.maxJumpVelocity = 0;
        this.minJumpVelocity = 0;
        this.groundRays = new Array();
        this.ceilRays = new Array();
        this.leftRays = new Array();
        this.rightRays = new Array();
        this.skinWidth = 5;
        this.fsm = new stateMachine_1.StateMachine();
        this.fsm.addState(SniperJoeState.amazing_entrance, new SniperJoeAmazingEntranceState(this));
        this.fsm.addState(SniperJoeState.idle, new SniperJoeIdleState(this));
        this.fsm.addState(SniperJoeState.pre_shoot, new SniperJoePreShootState(this));
        this.fsm.addState(SniperJoeState.shooting, new SniperJoeShootingState(this));
        this.fsm.addState(SniperJoeState.jump, new SniperJoeJumpState(this));
        this.fsm.addState(SniperJoeState.jump_back, new SniperJoeJumpBackState(this));
        this.fsm.changeState(SniperJoeState.amazing_entrance);
        this.getPosition().x = x + 8;
        this.getPosition().y = y + 16;
        this.smoothed = false;
        this.anchor.setTo(0.5, 1);
        this.health = 10;
        this.maxHealth = 10;
        this.isShielded = true;
        this.animations.add(SniperJoeAnimationNames.idle, ['sniper_joe_idle'], 10, false, false);
        this.animations.add(SniperJoeAnimationNames.pre_shoot, ['sniper_joe_pre_shoot_01', 'sniper_joe_pre_shoot_02'], 7, false, false);
        this.animations.add(SniperJoeAnimationNames.jump, ['sniper_joe_jump'], 10, false, false);
        this.animations.play(SniperJoeAnimationNames.idle);
        this.hitbox = new Phaser.Rectangle(this.getPosition().x - 8, this.getPosition().y - 16, 16, 16);
        this.updateRect();
        this.midGroundCheck = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_2.RayType.not_infinite);
        this.leftGroundCheck = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_2.RayType.not_infinite);
        this.rightGroundCheck = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_2.RayType.not_infinite);
        this.midCeilCheck = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_2.RayType.not_infinite);
        this.leftCeilCheck = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_2.RayType.not_infinite);
        this.rightCeilCheck = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_2.RayType.not_infinite);
        this.leftCheck1 = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_2.RayType.not_infinite);
        this.leftCheck2 = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_2.RayType.not_infinite);
        this.rightCheck1 = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_2.RayType.not_infinite);
        this.rightCheck2 = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_2.RayType.not_infinite);
        this.groundRays.push(this.midGroundCheck);
        this.groundRays.push(this.leftGroundCheck);
        this.groundRays.push(this.rightGroundCheck);
        this.ceilRays.push(this.midCeilCheck);
        this.ceilRays.push(this.leftCeilCheck);
        this.ceilRays.push(this.rightCeilCheck);
        this.leftRays.push(this.leftCheck1);
        this.leftRays.push(this.leftCheck2);
        this.rightRays.push(this.rightCheck1);
        this.rightRays.push(this.rightCheck2);
        this.wallContact = { left: false, right: false, up: false, down: false };
        this.calculateRegularJumpSettings();
    }
    manualUpdate() {
        // this.pGraphicsDebug.clear();
        if (!this.alive) {
            return;
        }
        this.frozen.update();
        if (this.frozen.isFrozen) {
            return;
        }
        this.fsm.currentState.update();
        if (this.useGravity) {
            this.targetSpeed.x += Math.abs(this.gravityX) * main_1.fixedTime;
            this.targetSpeed.y += Math.abs(this.gravityY) * main_1.fixedTime;
        }
        if (this.targetSpeed.y >= 300) {
            this.targetSpeed.y = 300;
        }
        this.velocity.x = this.targetSpeed.x;
        this.velocity.y = this.targetSpeed.y;
        if (this.isOnGround) {
            this.targetSpeed.x *= 0.75;
        }
        this.getPosition().x += this.velocity.x * main_1.fixedTime;
        this.getPosition().y += this.velocity.y * main_1.fixedTime;
        this.position.x = (this.getPosition().x + 0.5) | 0;
        this.position.y = this.getPosition().y;
        this.updateRect();
        this.castRays();
    }
    checkSurfaceCollisions(surfaces) {
        this.wallContact.left = false;
        this.wallContact.right = false;
        this.wallContact.up = false;
        this.wallContact.down = false;
        this.isOnGround = false;
        let into;
        for (let j = 0; j < surfaces.length; j++) {
            let surface = surfaces[j];
            if (!surface.collidable) {
                continue;
            }
            let nx = surface.dir.y;
            let ny = -surface.dir.x;
            // Check floors
            if (ny == -1 && this.getVelocity().y > 0) {
                for (let k = 0; k < this.groundRays.length; k++) {
                    let ray = this.groundRays[k];
                    into = sat2d_1.SAT2D.testRayVsRay(ray, new ray_1.Ray(new vector2_1.Vector2(surface.p1.x, surface.p1.y), new vector2_1.Vector2(surface.p2.x, surface.p2.y), ray_2.RayType.not_infinite), into);
                    if (into != null) {
                        let dx = into.ray1.end.x - into.ray1.start.x;
                        let dy = into.ray1.end.y - into.ray1.start.y;
                        let distance = Math.sqrt(dx * dx + dy * dy);
                        let trueDistance = distance * into.u1;
                        let contactX = into.ray1.start.x + into.ray1.dir.x * into.u1;
                        let contactY = into.ray1.start.y + trueDistance;
                        // this.pGraphicsDebug.drawCircle(contactX, contactY, 3);
                        if (trueDistance > this.hitbox.height * 0.5) {
                            continue;
                        }
                        this.getPosition().y = contactY;
                        this.setVelocity(this.getVelocity().x, 0);
                        this.targetSpeed.y = 0;
                        this.isOnGround = true;
                        this.isJumping = false;
                        this.isFalling = false;
                        this.wallContact.down = true;
                        continue;
                    }
                }
            }
            // Check ceilings
            if (ny == 1 && this.getVelocity().y < 0) {
                for (let k = 0; k < this.ceilRays.length; k++) {
                    let ray = this.ceilRays[k];
                    into = sat2d_1.SAT2D.testRayVsRay(ray, new ray_1.Ray(new vector2_1.Vector2(surface.p1.x, surface.p1.y), new vector2_1.Vector2(surface.p2.x, surface.p2.y), ray_2.RayType.not_infinite), into);
                    if (into != null) {
                        let dx = into.ray1.end.x - into.ray1.start.x;
                        let dy = into.ray1.end.y - into.ray1.start.y;
                        let distance = Math.sqrt(dx * dx + dy * dy);
                        let trueDistance = distance * into.u1;
                        let contactX = into.ray1.start.x + into.ray1.dir.x * into.u1;
                        let contactY = into.ray1.start.y - trueDistance;
                        // this.pGraphicsDebug.drawCircle(contactX, contactY, 3);
                        if (trueDistance > this.hitbox.height * 0.5) {
                            continue;
                        }
                        this.getPosition().y = contactY + this.hitbox.height;
                        this.setVelocity(this.getVelocity().x, 0);
                        this.targetSpeed.y = 0;
                        this.isFalling = true;
                        this.wallContact.up = true;
                        continue;
                    }
                }
            }
            // Check right walls
            if (nx == -1 && this.getVelocity().x > 0) {
                for (let k = 0; k < this.rightRays.length; k++) {
                    let ray = this.rightRays[k];
                    into = sat2d_1.SAT2D.testRayVsRay(ray, new ray_1.Ray(new vector2_1.Vector2(surface.p1.x, surface.p1.y), new vector2_1.Vector2(surface.p2.x, surface.p2.y), ray_2.RayType.not_infinite), into);
                    if (into != null) {
                        let dx = into.ray1.end.x - into.ray1.start.x;
                        let dy = into.ray1.end.y - into.ray1.start.y;
                        let distance = Math.sqrt(dx * dx + dy * dy);
                        let trueDistance = distance * into.u1;
                        let contactX = into.ray1.start.x + trueDistance;
                        let contactY = into.ray1.start.y;
                        // this.pGraphicsDebug.lineStyle(1, 0);
                        // this.pGraphicsDebug.beginFill(0xff0000, 0.5);
                        // this.pGraphicsDebug.drawCircle(contactX, contactY, 5);
                        if (trueDistance > this.hitbox.width * 0.5) {
                            continue;
                        }
                        this.getPosition().x = contactX - this.hitbox.width * 0.5;
                        this.wallContact.right = true;
                        continue;
                    }
                }
            }
            // Check left walls
            if (nx == 1 && this.getVelocity().x < 0) {
                for (let k = 0; k < this.leftRays.length; k++) {
                    let ray = this.leftRays[k];
                    into = sat2d_1.SAT2D.testRayVsRay(ray, new ray_1.Ray(new vector2_1.Vector2(surface.p1.x, surface.p1.y), new vector2_1.Vector2(surface.p2.x, surface.p2.y), ray_2.RayType.not_infinite), into);
                    if (into != null) {
                        let dx = into.ray1.end.x - into.ray1.start.x;
                        let dy = into.ray1.end.y - into.ray1.start.y;
                        let distance = Math.sqrt(dx * dx + dy * dy);
                        let trueDistance = distance * into.u1;
                        let contactX = into.ray1.start.x - trueDistance;
                        let contactY = into.ray1.start.y;
                        // this.pGraphicsDebug.lineStyle(1, 0);
                        // this.pGraphicsDebug.beginFill(0xff0000, 0.5);
                        // this.pGraphicsDebug.drawCircle(contactX, contactY, 5);
                        if (trueDistance > this.hitbox.width * 0.5) {
                            continue;
                        }
                        this.getPosition().x = contactX + this.hitbox.width * 0.5;
                        this.wallContact.left = true;
                        continue;
                    }
                }
            }
        }
    }
    takeDamage(damage) {
        if (this.isShielded) {
            if (this.fsm.currentState.name == SniperJoeState.idle) {
                this.fsm.currentState.reset();
            }
            return;
        }
        if (this.health <= 0) {
            return;
        }
        this.game.sound.play(konstants_1.AudioName.enemy_damage);
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            this.myWorld.dropManager.dropPowerUp(this.getPosition().x, this.getPosition().y);
            this.myWorld.createExplosionEffect(this.getPosition().x, this.getPosition().y - this.hitbox.halfHeight);
            this.kill();
        }
        else {
        }
    }
    shoot(angle) {
        this.game.sound.play(konstants_1.AudioName.enemy_shoot);
        this.isShielded = false;
        let bullet = this.myWorld.entityManager.createBitmapBullet(this, this.position.x - 4, this.position.y - 7, 6, 6, konstants_1.EntityType.bullet, konstants_1.EntityType.met_bullet);
        bullet.horizontalSpeed = 170;
        let cos = Math.cos(angle * (Math.PI / 180));
        let sin = Math.sin(angle * (Math.PI / 180));
        bullet.targetSpeed.x = bullet.horizontalSpeed * cos * -this.getFacingDirection();
        bullet.targetSpeed.y = bullet.horizontalSpeed * sin * -this.getFacingDirection();
    }
    updateRect() {
        this.hitbox.x = this.getPosition().x - 8;
        this.hitbox.y = this.getPosition().y - 16;
    }
    calculateRegularJumpSettings() {
        this.gravityY = -(2 * this.maxJumpHeight) / Math.pow(this.timeToJumpApex, 2);
        this.maxJumpVelocity = Math.abs(this.gravityY) * this.timeToJumpApex;
        this.minJumpVelocity = Math.sqrt(2 * Math.abs(this.gravityY) * this.minJumpHeight);
        // console.log('gravity: ' + this._gravity);
        // console.log('maxJumpVelocity: ' + this._maxJumpVelocity);
        // console.log('minJumpVelocity: ' + this._minJumpVelocity);
    }
    /**
     * Using the current position moves the rays a frame even though the player may be running into a wall. By using
     * previous position the rays don't move for that frame. They use the previous frame. Think about it, when the player
     * is running into a wall, its 'bounds' should not move.
     */
    castRays() {
        let centerX = this.getPosition().x;
        let centerY = this.getPosition().y - this.hitbox.height * 0.5;
        if (this.wallContact.left || this.wallContact.right) {
            centerX = this.previousPosition.x;
        }
        // cast ground rays
        this.midGroundCheck.start = new vector2_1.Vector2(centerX, centerY);
        this.midGroundCheck.end = new vector2_1.Vector2(centerX, centerY + this.hitbox.height * 0.5 + this.skinWidth);
        this.leftGroundCheck.start = new vector2_1.Vector2(centerX - this.hitbox.width * 0.5 + 3, centerY);
        this.leftGroundCheck.end = new vector2_1.Vector2(centerX - this.hitbox.width * 0.5 + 3, centerY + this.hitbox.height * 0.5 + this.skinWidth);
        this.rightGroundCheck.start = new vector2_1.Vector2(centerX + this.hitbox.width * 0.5 - 3, centerY);
        this.rightGroundCheck.end = new vector2_1.Vector2(centerX + this.hitbox.width * 0.5 - 3, centerY + this.hitbox.height * 0.5 + this.skinWidth);
        // cast ceil rays
        this.midCeilCheck.start = new vector2_1.Vector2(centerX, centerY);
        this.midCeilCheck.end = new vector2_1.Vector2(centerX, centerY - this.hitbox.height * 0.5 - this.skinWidth);
        this.leftCeilCheck.start = new vector2_1.Vector2(centerX - this.hitbox.width * 0.5 + 3, centerY);
        this.leftCeilCheck.end = new vector2_1.Vector2(centerX - this.hitbox.width * 0.5 + 3, centerY - this.hitbox.height * 0.5 - this.skinWidth);
        this.rightCeilCheck.start = new vector2_1.Vector2(centerX + this.hitbox.width * 0.5 - 3, centerY);
        this.rightCeilCheck.end = new vector2_1.Vector2(centerX + this.hitbox.width * 0.5 - 3, centerY - this.hitbox.height * 0.5 - this.skinWidth);
        // cast left rays
        let offsetY = 8;
        this.leftCheck1.start = new vector2_1.Vector2(centerX, centerY - offsetY);
        this.leftCheck1.end = new vector2_1.Vector2(centerX - this.hitbox.width * 0.5 - this.skinWidth, centerY - offsetY);
        this.leftCheck2.start = new vector2_1.Vector2(centerX, centerY + offsetY);
        this.leftCheck2.end = new vector2_1.Vector2(centerX - this.hitbox.width * 0.5 - this.skinWidth, centerY + offsetY);
        // cast right rays
        offsetY = 8;
        this.rightCheck1.start = new vector2_1.Vector2(centerX, centerY - offsetY);
        this.rightCheck1.end = new vector2_1.Vector2(centerX + this.hitbox.width * 0.5 + this.skinWidth, centerY - offsetY);
        this.rightCheck2.start = new vector2_1.Vector2(centerX, centerY + offsetY);
        this.rightCheck2.end = new vector2_1.Vector2(centerX + this.hitbox.width * 0.5 + this.skinWidth, centerY + offsetY);
    }
}
exports.SniperJoe = SniperJoe;
var SniperJoeState;
(function (SniperJoeState) {
    SniperJoeState["amazing_entrance"] = "amazing_entrance";
    SniperJoeState["idle"] = "idle";
    SniperJoeState["pre_shoot"] = "pre_shoot";
    SniperJoeState["jump"] = "jump";
    SniperJoeState["jump_back"] = "jump_back";
    SniperJoeState["shooting"] = "shooting";
})(SniperJoeState || (SniperJoeState = {}));
class SniperJoeAmazingEntranceState {
    constructor(actor) {
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
        this.actor.animations.play(SniperJoeAnimationNames.jump);
        this.actor.targetSpeed.x = -50;
        this.actor.targetSpeed.y = -50;
    }
    update() {
        if (this.actor.isOnGround) {
            this.actor.fsm.changeState(SniperJoeState.idle);
            return;
        }
    }
    exit() {
        this.initialized = false;
    }
}
class SniperJoeIdleState {
    constructor(actor) {
        this.elapsedTime = 0;
        this.endTime = 0;
        this.minIdleTime = 300;
        this.maxIdleTime = 800;
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
        this.actor.animations.play(SniperJoeAnimationNames.idle);
        this.actor.isShielded = true;
        this.endTime = this.minIdleTime + Math.random() * (this.maxIdleTime - this.minIdleTime);
    }
    update() {
        if (helper_1.Helper.directionTo(this.actor, this.actor.myWorld.entityManager.player).x > 0) {
            this.actor.fsm.changeState(SniperJoeState.jump_back);
            return;
        }
        this.elapsedTime += main_1.fixedTimeMS;
        if (this.elapsedTime > this.endTime) {
            this.elapsedTime = 0;
            Math.random() > 0.4 ? this.actor.fsm.changeState(SniperJoeState.pre_shoot) : this.actor.fsm.changeState(SniperJoeState.jump);
            return;
        }
    }
    exit() {
        this.initialized = false;
    }
    reset() {
        this.elapsedTime = 0;
    }
}
class SniperJoePreShootState {
    constructor(actor) {
        this.numTimesShot = 0;
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
        this.actor.animations.play(SniperJoeAnimationNames.pre_shoot);
        this.actor.isShielded = false;
        if (this.actor.fsm.prevState.name == SniperJoeState.jump) {
            this.numTimesShot = 0;
        }
        else {
            this.numTimesShot++;
        }
    }
    update() {
        if (this.numTimesShot > 3) {
            this.numTimesShot = 0;
            this.actor.fsm.changeState(SniperJoeState.jump);
            return;
        }
        if (this.actor.animations.currentAnim.isFinished) {
            this.actor.fsm.changeState(SniperJoeState.shooting);
            return;
        }
    }
    exit() {
        this.initialized = false;
    }
}
class SniperJoeShootingState {
    constructor(actor) {
        this.elapsedTime = 0;
        this.shootDelay = 400;
        this.numBullets = 0;
        this.waitAfterShootElapsedTime = 0;
        this.waitAfterShootEndTime = 250;
        this.hasShot = false;
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
        this.elapsedTime = this.shootDelay;
        this.actor.isShielded = false;
    }
    update() {
        this.elapsedTime += main_1.fixedTimeMS;
        if (this.elapsedTime > this.shootDelay && !this.hasShot) {
            this.elapsedTime = 0;
            this.numBullets++;
            this.actor.shoot(0);
            this.hasShot = true;
        }
        if (this.hasShot) {
            this.waitAfterShootElapsedTime += main_1.fixedTimeMS;
            if (this.waitAfterShootElapsedTime > this.waitAfterShootEndTime) {
                this.waitAfterShootElapsedTime = 0;
                this.hasShot = false;
                this.actor.fsm.changeState(SniperJoeState.idle);
                return;
            }
        }
    }
    exit() {
        this.initialized = false;
        this.numBullets = 0;
        this.elapsedTime = 0;
        this.hasShot = false;
        this.waitAfterShootElapsedTime = 0;
    }
}
class SniperJoeJumpState {
    constructor(actor) {
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
        this.actor.animations.play(SniperJoeAnimationNames.jump);
        this.actor.isOnGround = false;
        this.actor.targetSpeed.y = -220;
        this.actor.isShielded = false;
    }
    update() {
        if (this.actor.isOnGround) {
            this.actor.fsm.changeState(SniperJoeState.idle);
        }
    }
    exit() {
        this.initialized = false;
    }
}
class SniperJoeJumpBackState {
    constructor(actor) {
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
        this.actor.animations.play(SniperJoeAnimationNames.jump);
        this.actor.setFacingDirection(-1);
        this.actor.isOnGround = false;
        this.actor.targetSpeed.x = Math.cos(75 * (Math.PI / 180)) * 370;
        this.actor.targetSpeed.y = Math.sin(75 * (Math.PI / 180)) * 300 * -1;
        this.actor.isShielded = false;
    }
    update() {
        if (this.actor.isOnGround) {
            this.actor.targetSpeed.x = 0;
            this.actor.targetSpeed.y = 0;
            this.actor.setFacingDirection(1);
            this.actor.fsm.changeState(SniperJoeState.idle);
        }
    }
    exit() {
        this.initialized = false;
    }
}


/***/ }),
/* 38 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Bombomb = void 0;
const enemy_1 = __webpack_require__(31);
const konstants_1 = __webpack_require__(2);
const mathutil_1 = __webpack_require__(34);
const stateMachine_1 = __webpack_require__(33);
var BombombAnimationNames;
(function (BombombAnimationNames) {
    BombombAnimationNames["idle"] = "idle";
})(BombombAnimationNames || (BombombAnimationNames = {}));
class Bombomb extends enemy_1.Enemy {
    constructor(myWorld, tag, e, game, x, y, key, frame) {
        super(myWorld, tag, e, game, x, y, key, frame);
        this.player = this.myWorld.entityManager.player;
        this.getPosition().x = x;
        this.getPosition().y = y;
        this.position.x = this.getPosition().x;
        this.position.y = this.getPosition().y;
        this.smoothed = false;
        this.health = 1;
        this.maxHealth = 1;
        this.anchor.setTo(0.5, 0.5);
        this.isShielded = false;
        this.animations.add(BombombAnimationNames.idle, ['bombomb'], 10, false, false);
        this.animations.play(BombombAnimationNames.idle);
        this.hitbox = new Phaser.Rectangle(this.getPosition().x, this.getPosition().y, 14, 8);
        this.hitboxOffset.x = -this.hitbox.halfWidth;
        this.hitboxOffset.y = -this.hitbox.halfHeight;
        this.updateRect();
        this.fsm = new stateMachine_1.StateMachine();
        this.fsm.addState(BombombState.rising, new BombombRisingState(this));
        this.fsm.changeState(BombombState.rising);
    }
    manualUpdate() {
        // this.pGraphicsDebug.clear();
        if (!this.alive) {
            return;
        }
        this.frozen.update();
        if (this.frozen.isFrozen) {
            return;
        }
        this.fsm.currentState.update();
        this.updateRect();
    }
    takeDamage(damage) {
        if (this.isShielded) {
            this.game.sound.play(konstants_1.AudioName.dink);
            return;
        }
        if (this.health <= 0) {
            return;
        }
        this.game.sound.play(konstants_1.AudioName.enemy_damage);
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            this.myWorld.dropManager.dropPowerUp(this.getPosition().x - this.hitbox.halfWidth, this.getPosition().y + this.hitbox.halfHeight);
            this.myWorld.createExplosionEffect(this.getPosition().x, this.getPosition().y);
            this.kill();
        }
    }
    updateRect() {
        this.hitbox.x = this.getPosition().x - 7;
        this.hitbox.y = this.getPosition().y - 4;
    }
}
exports.Bombomb = Bombomb;
var BombombState;
(function (BombombState) {
    BombombState["rising"] = "rising";
    BombombState["exploding"] = "exploding";
})(BombombState || (BombombState = {}));
class BombombRisingState {
    constructor(actor) {
        this.name = BombombState.rising;
        this.elapsedTime = 0;
        this.endTime = 700;
        this.startY = 0;
        this.endY = 0;
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
        this.startY = this.actor.getPosition().y;
        this.endY = this.startY - 185;
    }
    update() {
        this.elapsedTime += this.actor.game.time.elapsedMS;
        this.actor.getPosition().y = mathutil_1.MathUtil.lerp(this.startY, this.endY, this.elapsedTime / this.endTime);
        this.actor.position.y = this.actor.getPosition().y;
        if (this.elapsedTime >= this.endTime) {
            this.createShrapnel(this.actor.getPosition().x - 4.5, this.actor.getPosition().y, -80, -150);
            this.createShrapnel(this.actor.getPosition().x - 4.5, this.actor.getPosition().y, -60, -130);
            this.createShrapnel(this.actor.getPosition().x - 4.5, this.actor.getPosition().y, 60, -130);
            this.createShrapnel(this.actor.getPosition().x - 4.5, this.actor.getPosition().y, 80, -150);
            this.actor.takeDamage(1);
            return;
        }
    }
    exit() {
        this.initialized = false;
    }
    createShrapnel(x, y, xSpeed, ySpeed) {
        let shrap = this.actor.myWorld.entityManager.createEntity(konstants_1.EntityType.bombomb_shrapnel, x, y);
        shrap.targetSpeed.x = xSpeed;
        shrap.targetSpeed.y = ySpeed;
        this.actor.game.add.existing(shrap);
        this.actor.myWorld.entityManager.addEntity(shrap);
    }
}


/***/ }),
/* 39 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BombombShrapnel = void 0;
const konstants_1 = __webpack_require__(2);
const entity_1 = __webpack_require__(16);
const stateMachine_1 = __webpack_require__(33);
var BombombShrapnelAnimationNames;
(function (BombombShrapnelAnimationNames) {
    BombombShrapnelAnimationNames["idle"] = "idle";
})(BombombShrapnelAnimationNames || (BombombShrapnelAnimationNames = {}));
class BombombShrapnel extends entity_1.Entity {
    constructor(myWorld, tag, e, game, x, y, key, frame) {
        super(myWorld, tag, e, game, x, y, key, frame);
        this.horizontalSpeed = 35;
        this.verticalSpeed = 10;
        this.targetSpeed = new Phaser.Point();
        this.useGravity = true;
        this.gravityX = 0;
        this.gravityY = 450;
        this.getPosition().x = x;
        this.getPosition().y = y;
        this.position.x = this.getPosition().x;
        this.position.y = this.getPosition().y;
        this.smoothed = false;
        this.health = 1;
        this.maxHealth = 1;
        this.isShielded = false;
        this.anchor.setTo(0.5, 0.5);
        this.fsm = new stateMachine_1.StateMachine();
        this.fsm.addState(BombombShrapnelState.idle, new BombombShrapnelIdleState(this));
        this.fsm.changeState(BombombShrapnelState.idle);
        this.animations.add(BombombShrapnelAnimationNames.idle, ['bombomb_shrapnel'], 10, false, false);
        this.animations.play(BombombShrapnelAnimationNames.idle);
        this.hitbox = new Phaser.Rectangle(this.getPosition().x, this.getPosition().y, 8, 6);
        this.hitboxOffset.x = -this.hitbox.halfWidth;
        this.hitboxOffset.y = -this.hitbox.halfHeight;
        this.updateRect();
    }
    manualUpdate() {
        // this.pGraphicsDebug.clear();
        if (!this.alive) {
            return;
        }
        if (this.useGravity) {
            this.targetSpeed.x += Math.abs(this.gravityX) * this.game.time.physicsElapsed;
            this.targetSpeed.y += Math.abs(this.gravityY) * this.game.time.physicsElapsed;
        }
        if (this.targetSpeed.y >= 400) {
            this.targetSpeed.y = 400;
        }
        this.velocity.x = this.targetSpeed.x;
        this.velocity.y = this.targetSpeed.y;
        this.getPosition().x += this.velocity.x * this.game.time.physicsElapsed;
        this.getPosition().y += this.velocity.y * this.game.time.physicsElapsed;
        this.position.x = (this.getPosition().x + 0.5) | 0;
        this.position.y = this.getPosition().y;
        this.fsm.currentState.update();
        this.updateRect();
    }
    takeDamage(damage) {
        if (this.isShielded) {
            return;
        }
        if (this.health <= 0) {
            return;
        }
        this.game.sound.play(konstants_1.AudioName.explosion);
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            this.myWorld.createExplosionEffect(this.getPosition().x + this.hitbox.halfWidth, this.getPosition().y + this.hitbox.halfHeight);
            this.kill();
        }
        else {
        }
    }
}
exports.BombombShrapnel = BombombShrapnel;
var BombombShrapnelState;
(function (BombombShrapnelState) {
    BombombShrapnelState["idle"] = "idle";
})(BombombShrapnelState || (BombombShrapnelState = {}));
class BombombShrapnelIdleState {
    constructor(actor) {
        this.name = BombombShrapnelState.idle;
        this.elapsedTime = 0;
        this.endTime = 2000;
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
    }
    update() {
        this.elapsedTime += this.actor.game.time.elapsedMS;
    }
    exit() {
        this.initialized = false;
    }
}


/***/ }),
/* 40 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Spine = void 0;
const enemy_1 = __webpack_require__(31);
const konstants_1 = __webpack_require__(2);
const mathutil_1 = __webpack_require__(34);
const stateMachine_1 = __webpack_require__(33);
const sat2d_1 = __webpack_require__(17);
const ray_1 = __webpack_require__(19);
const ray_2 = __webpack_require__(19);
const vector2_1 = __webpack_require__(20);
const main_1 = __webpack_require__(0);
var SpineAnimations;
(function (SpineAnimations) {
    SpineAnimations["blink"] = "blink";
    SpineAnimations["paralyzed"] = "paralyzed";
})(SpineAnimations || (SpineAnimations = {}));
class Spine extends enemy_1.Enemy {
    constructor(myWorld, tag, e, game, x, y, key, frame) {
        super(myWorld, tag, e, game, x, y, key, frame);
        this.skinWidth = 5;
        this.groundRayLeftHit = false;
        this.groundRayRightHit = false;
        this.playerDetected = false;
        this.horizontalSpeed = 20;
        this.targetSpeed = new Phaser.Point(0, 0);
        this.previousTargetSpeedX = 0;
        this.player = this.myWorld.entityManager.player;
        this.playerHitBox = this.player.hitbox;
        this.getPosition().x = x;
        this.getPosition().y = y;
        this.position.x = this.getPosition().x;
        this.position.y = this.getPosition().y;
        this.anchor.setTo(0.5, 1);
        this.smoothed = false;
        this.setFacingDirection(-1);
        this.health = 1;
        this.maxHealth = 1;
        this.isShielded = false;
        this.fsm = new stateMachine_1.StateMachine();
        this.fsm.addState(SpineState.idle, new SpineIdleState(this));
        this.fsm.addState(SpineState.active, new SpineActiveState(this));
        this.fsm.addState(SpineState.paralyze, new SpineParalyzeState(this));
        this.fsm.changeState(SpineState.idle);
        this.animations.add(SpineAnimations.blink, ['spine_01', 'spine_02'], 10, true, false);
        this.animations.add(SpineAnimations.paralyzed, ['spine_01'], 10, false, false);
        this.animations.play(SpineAnimations.blink);
        this.hitbox = new Phaser.Rectangle(this.getPosition().x, this.getPosition().y, 16, 8);
        this.updateRect();
        this.leftRay = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_2.RayType.not_infinite);
        this.rightRay = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_2.RayType.not_infinite);
        this.groundRayLeft = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_2.RayType.not_infinite);
        this.groundRayRight = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_2.RayType.not_infinite);
    }
    manualUpdate() {
        // this.pGraphicsDebug.clear();
        if (!this.alive) {
            return;
        }
        this.frozen.update();
        if (this.frozen.isFrozen) {
            return;
        }
        this.fsm.currentState.update();
        this.velocity.x = this.targetSpeed.x;
        this.velocity.y = this.targetSpeed.y;
        this.getPosition().x += this.velocity.x * main_1.fixedTime;
        this.getPosition().y += this.velocity.y * main_1.fixedTime;
        this.position.x = (this.getPosition().x + 0.5) | 0;
        this.position.y = this.getPosition().y;
        this.updateRect();
        this.castRays();
        this.detectPlayer();
        this.showDebugRays();
    }
    takeDamage(damage) {
        if (this.isShielded) {
            this.game.sound.play(konstants_1.AudioName.dink);
            return;
        }
        if (this.health <= 0) {
            return;
        }
        this.game.sound.play(konstants_1.AudioName.enemy_damage);
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            this.myWorld.dropManager.dropPowerUp(this.getPosition().x, this.getPosition().y);
            this.myWorld.createExplosionEffect(this.getPosition().x, this.getPosition().y - this.hitbox.halfHeight);
            this.kill();
        }
        else {
        }
    }
    updateRect() {
        this.hitbox.x = this.getPosition().x - 8;
        this.hitbox.y = this.getPosition().y - 8;
    }
    checkSurfaceCollisions(surfaces) {
        this.groundRayLeftHit = false;
        this.groundRayRightHit = false;
        let into;
        let tempSurface;
        let surfaceHit;
        let tempVec1 = new vector2_1.Vector2();
        let tempVec2 = new vector2_1.Vector2();
        for (let i = 0; i < surfaces.length; i++) {
            tempSurface = surfaces[i];
            let nx = tempSurface.dir.y;
            let ny = -tempSurface.dir.x;
            // Check floors (ny == -1 is a floor)
            if (ny != -1) {
                continue;
            }
            tempVec1.x = tempSurface.p1.x;
            tempVec1.y = tempSurface.p1.y;
            tempVec2.x = tempSurface.p2.x;
            tempVec2.y = tempSurface.p2.y;
            into = sat2d_1.SAT2D.testRayVsRay(this.groundRayLeft, new ray_1.Ray(tempVec1, tempVec2, ray_2.RayType.not_infinite), into);
            if (into != null) {
                this.groundRayLeftHit = true;
            }
            into = sat2d_1.SAT2D.testRayVsRay(this.groundRayRight, new ray_1.Ray(tempVec1, tempVec2, ray_2.RayType.not_infinite), into);
            if (into != null) {
                this.groundRayRightHit = true;
            }
            if (this.groundRayLeftHit || this.groundRayRightHit) {
                surfaceHit = tempSurface;
                break;
            }
        }
        if (!this.groundRayLeftHit) {
            this.targetSpeed.x = Math.abs(this.targetSpeed.x);
            this.getPosition().x = surfaceHit.p1.x + this.hitbox.width * 0.5;
        }
        if (!this.groundRayRightHit) {
            this.targetSpeed.x = -Math.abs(this.targetSpeed.x);
            this.getPosition().x = surfaceHit.p2.x - this.hitbox.width * 0.5;
        }
    }
    paralyze() {
        this.game.sound.play(konstants_1.AudioName.enemy_damage);
        this.fsm.changeState(SpineState.paralyze);
    }
    castRays() {
        let centerX = this.getPosition().x;
        let centerY = this.getPosition().y;
        // cast ground rays
        this.groundRayLeft.start = new vector2_1.Vector2(centerX - this.hitbox.width * 0.5, centerY - 5);
        this.groundRayLeft.end = new vector2_1.Vector2(centerX - this.hitbox.width * 0.5, centerY + this.hitbox.height * 0.5);
        this.groundRayRight.start = new vector2_1.Vector2(centerX + this.hitbox.width * 0.5, centerY - 5);
        this.groundRayRight.end = new vector2_1.Vector2(centerX + this.hitbox.width * 0.5, centerY + this.hitbox.height * 0.5);
        // cast left rays
        let offsetY = 6;
        this.leftRay.start = new vector2_1.Vector2(centerX, centerY - offsetY);
        this.leftRay.end = new vector2_1.Vector2(centerX - 256, centerY - offsetY);
        // cast right rays
        offsetY = 6;
        this.rightRay.start = new vector2_1.Vector2(centerX, centerY - offsetY);
        this.rightRay.end = new vector2_1.Vector2(centerX + 256, centerY - offsetY);
    }
    detectPlayer() {
        this.playerDetected = false;
        this.playerLeftSide = new ray_1.Ray(new vector2_1.Vector2(this.playerHitBox.bottomLeft.x, this.playerHitBox.bottomLeft.y), new vector2_1.Vector2(this.playerHitBox.topLeft.x, this.playerHitBox.topLeft.y), ray_2.RayType.not_infinite);
        this.playerRightSide = new ray_1.Ray(new vector2_1.Vector2(this.playerHitBox.topRight.x, this.playerHitBox.topRight.y), new vector2_1.Vector2(this.playerHitBox.bottomRight.x, this.playerHitBox.bottomRight.y), ray_2.RayType.not_infinite);
        let into;
        into = sat2d_1.SAT2D.testRayVsRay(this.leftRay, this.playerRightSide, into);
        if (into != null) {
            this.playerDetected = true;
            return;
        }
        into = sat2d_1.SAT2D.testRayVsRay(this.rightRay, this.playerRightSide, into);
        if (into != null) {
            this.playerDetected = true;
            return;
        }
    }
    showDebugRays() {
        if (!this.myWorld.showDebug) {
            return;
        }
        // this.pGraphicsDebug.lineStyle(1, 0);
        // this.pGraphicsDebug.moveTo(this.leftRay.start.x, this.leftRay.start.y);
        // this.pGraphicsDebug.lineTo(this.leftRay.end.x, this.leftRay.end.y);
        // this.pGraphicsDebug.moveTo(this.rightRay.start.x, this.rightRay.start.y);
        // this.pGraphicsDebug.lineTo(this.rightRay.end.x, this.rightRay.end.y);
        // this.pGraphicsDebug.moveTo(this.groundRayLeft.start.x, this.groundRayLeft.start.y);
        // this.pGraphicsDebug.lineTo(this.groundRayLeft.end.x, this.groundRayLeft.end.y);
        // this.pGraphicsDebug.moveTo(this.groundRayRight.start.x, this.groundRayRight.start.y);
        // this.pGraphicsDebug.lineTo(this.groundRayRight.end.x, this.groundRayRight.end.y);
    }
}
exports.Spine = Spine;
var SpineState;
(function (SpineState) {
    SpineState["idle"] = "idle";
    SpineState["active"] = "active";
    SpineState["paralyze"] = "paralyze";
})(SpineState || (SpineState = {}));
class SpineIdleState {
    constructor(actor) {
        this.name = SpineState.idle;
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
        if (this.actor.targetSpeed.x == 0) {
            this.actor.targetSpeed.x = -this.actor.horizontalSpeed;
        }
        else {
            this.actor.targetSpeed.x = this.actor.horizontalSpeed * mathutil_1.MathUtil.sign(this.actor.targetSpeed.x);
        }
        if (this.actor.fsm.prevState != null && this.actor.fsm.prevState.name == SpineState.paralyze) {
            this.actor.targetSpeed.x = this.actor.previousTargetSpeedX;
        }
        this.actor.animations.play(SpineAnimations.blink);
    }
    update() {
        if (!this.actor.playerDetected) {
            return;
        }
        if (!this.actor.player.isOnGround) {
            return;
        }
        this.actor.fsm.changeState(SpineState.active);
    }
    exit() {
        this.initialized = false;
    }
}
class SpineActiveState {
    constructor(actor) {
        this.name = SpineState.active;
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
        this.actor.targetSpeed.x = mathutil_1.MathUtil.sign(this.actor.targetSpeed.x) * this.actor.horizontalSpeed * 4;
    }
    update() {
        if (this.actor.playerDetected) {
            return;
        }
        if (this.actor.player.isOnGround) {
            return;
        }
        this.actor.fsm.changeState(SpineState.idle);
    }
    exit() {
        this.initialized = false;
    }
}
class SpineParalyzeState {
    constructor(actor) {
        this.name = SpineState.paralyze;
        this.elapsedTime = 0;
        this.endTime = 3000;
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
        if (this.actor.fsm.prevState != null && this.actor.fsm.prevState.name != SpineState.paralyze) {
            this.actor.previousTargetSpeedX = this.actor.targetSpeed.x;
            this.actor.targetSpeed.x = 0;
            this.actor.animations.play(SpineAnimations.paralyzed);
        }
    }
    update() {
        this.elapsedTime += main_1.fixedTimeMS;
        if (this.elapsedTime >= this.endTime) {
            this.actor.fsm.changeState(SpineState.idle);
            return;
        }
    }
    exit() {
        this.initialized = false;
        this.elapsedTime = 0;
    }
}


/***/ }),
/* 41 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OctopusBattery = void 0;
const enemy_1 = __webpack_require__(31);
const konstants_1 = __webpack_require__(2);
const mathutil_1 = __webpack_require__(34);
const stateMachine_1 = __webpack_require__(33);
const sat2d_1 = __webpack_require__(17);
const ray_1 = __webpack_require__(19);
const ray_2 = __webpack_require__(19);
const vector2_1 = __webpack_require__(20);
const main_1 = __webpack_require__(0);
var OctopusBatteryAnimations;
(function (OctopusBatteryAnimations) {
    OctopusBatteryAnimations["idle"] = "idle";
    OctopusBatteryAnimations["open_eyes"] = "open_eyes";
    OctopusBatteryAnimations["reverse_open_eyes"] = "reverse_open_eyes";
})(OctopusBatteryAnimations || (OctopusBatteryAnimations = {}));
class OctopusBattery extends enemy_1.Enemy {
    constructor(myWorld, tag, e, game, x, y, key, frame) {
        super(myWorld, tag, e, game, x, y, key, frame);
        this.horizontalSpeed = 50;
        this.targetSpeed = new Phaser.Point(0, 0);
        this.prevTargetSpeed = new Phaser.Point(0, 0);
        this.speed = 0;
        this.horizontal = false;
        this.vertical = false;
        this.isFirstRun = true;
        this.getPosition().x = x;
        this.getPosition().y = y;
        this.position.x = (this.getPosition().x + 0.5) | 0;
        this.position.y = this.getPosition().y;
        this.anchor.setTo(0.5, 0.5);
        this.smoothed = false;
        this.setFacingDirection(-1);
        this.health = 5;
        this.maxHealth = 5;
        this.isShielded = false;
        this.fsm = new stateMachine_1.StateMachine();
        this.fsm.addState(OctopusBatteryState.idle, new OctopusBatteryIdleState(this));
        this.fsm.addState(OctopusBatteryState.move, new OctopusBatteryMoveState(this));
        this.fsm.changeState(OctopusBatteryState.idle);
        this.animations.add(OctopusBatteryAnimations.idle, ['octopus_battery_01'], 10, false, false);
        this.animations.add(OctopusBatteryAnimations.open_eyes, ['octopus_battery_01', 'octopus_battery_02', 'octopus_battery_03'], 7, false, false);
        this.animations.add(OctopusBatteryAnimations.reverse_open_eyes, ['octopus_battery_03', 'octopus_battery_02', 'octopus_battery_01'], 7, false, false);
        this.animations.play(OctopusBatteryAnimations.idle);
        this.hitbox = new Phaser.Rectangle(this.getPosition().x, this.getPosition().y, 16, 16);
        this.hitboxOffset.x = -8;
        this.hitboxOffset.y = -8;
        this.updateRect();
        this.leftRay = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_2.RayType.not_infinite);
        this.rightRay = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_2.RayType.not_infinite);
        this.upRay = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_2.RayType.not_infinite);
        this.downRay = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_2.RayType.not_infinite);
        this.isFirstRun = false;
        this.events.onKilled.add(() => {
            this.resetProps();
        });
    }
    manualUpdate() {
        // this.pGraphicsDebug.clear();
        if (!this.alive) {
            return;
        }
        this.frozen.update();
        if (this.frozen.isFrozen) {
            return;
        }
        this.fsm.currentState.update();
        this.velocity.x = this.targetSpeed.x;
        this.velocity.y = this.targetSpeed.y;
        this.getPosition().x += this.velocity.x * main_1.fixedTime;
        this.getPosition().y += this.velocity.y * main_1.fixedTime;
        this.position.x = (this.getPosition().x + 0.5) | 0;
        this.position.y = this.getPosition().y;
        this.updateRect();
        this.castRays();
        this.showDebugRays();
    }
    takeDamage(damage) {
        if (this.isShielded) {
            this.game.sound.play(konstants_1.AudioName.dink);
            return;
        }
        if (this.health <= 0) {
            return;
        }
        this.game.sound.play(konstants_1.AudioName.enemy_damage);
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            this.myWorld.dropManager.dropPowerUp(this.getPosition().x - this.hitbox.halfWidth, this.getPosition().y);
            this.myWorld.createExplosionEffect(this.getPosition().x, this.getPosition().y - this.hitbox.halfHeight);
            this.kill();
        }
        else {
        }
    }
    checkSurfaceCollisions(surfaces) {
        if (this.horizontal) {
            this.checkHorizontalRaycasts(surfaces);
        }
        else if (this.vertical) {
            this.checkVerticalRaycasts(surfaces);
        }
    }
    castRays() {
        let centerX = this.getPosition().x;
        let centerY = this.getPosition().y;
        if (this.horizontal) {
            // cast left rays
            this.leftRay.start = new vector2_1.Vector2(centerX, centerY);
            this.leftRay.end = new vector2_1.Vector2(centerX - this.hitbox.width, centerY);
            // cast right rays
            this.rightRay.start = new vector2_1.Vector2(centerX, centerY);
            this.rightRay.end = new vector2_1.Vector2(centerX + this.hitbox.width, centerY);
        }
        else if (this.vertical) {
            // cast up rays
            this.upRay.start = new vector2_1.Vector2(centerX, centerY);
            this.upRay.end = new vector2_1.Vector2(centerX, centerY - this.hitbox.height);
            // cast down rays
            this.downRay.start = new vector2_1.Vector2(centerX, centerY);
            this.downRay.end = new vector2_1.Vector2(centerX, centerY + this.hitbox.height);
        }
    }
    checkHorizontalRaycasts(surfaces) {
        let into;
        for (let j = 0; j < surfaces.length; j++) {
            let surface = surfaces[j];
            let nx = surface.dir.y;
            let ny = -surface.dir.x;
            // Check right walls
            if (nx == -1 && this.getVelocity().x > 0) {
                into = sat2d_1.SAT2D.testRayVsRay(this.rightRay, new ray_1.Ray(new vector2_1.Vector2(surface.p1.x, surface.p1.y), new vector2_1.Vector2(surface.p2.x, surface.p2.y), ray_2.RayType.not_infinite), into);
                if (into != null) {
                    let dx = into.ray1.end.x - into.ray1.start.x;
                    let dy = into.ray1.end.y - into.ray1.start.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    let trueDistance = distance * into.u1;
                    let contactX = into.ray1.start.x + trueDistance;
                    let contactY = into.ray1.start.y;
                    // this.pGraphicsDebug.lineStyle(1, 0);
                    // this.pGraphicsDebug.beginFill(0xff0000, 0.5);
                    // this.pGraphicsDebug.drawCircle(contactX, contactY, 5);
                    if (trueDistance > this.hitbox.halfWidth) {
                        continue;
                    }
                    this.getPosition().x = contactX - this.hitbox.halfWidth;
                    this.fsm.changeState(OctopusBatteryState.idle);
                    return;
                }
            }
            // Check left walls
            if (nx == 1 && this.getVelocity().x < 0) {
                into = sat2d_1.SAT2D.testRayVsRay(this.leftRay, new ray_1.Ray(new vector2_1.Vector2(surface.p1.x, surface.p1.y), new vector2_1.Vector2(surface.p2.x, surface.p2.y), ray_2.RayType.not_infinite), into);
                if (into != null) {
                    let dx = into.ray1.end.x - into.ray1.start.x;
                    let dy = into.ray1.end.y - into.ray1.start.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    let trueDistance = distance * into.u1;
                    let contactX = into.ray1.start.x - trueDistance;
                    let contactY = into.ray1.start.y;
                    // this.pGraphicsDebug.lineStyle(1, 0);
                    // this.pGraphicsDebug.beginFill(0xff0000, 0.5);
                    // this.pGraphicsDebug.drawCircle(contactX, contactY, 5);
                    if (trueDistance > this.hitbox.halfWidth) {
                        continue;
                    }
                    this.getPosition().x = contactX + this.hitbox.halfWidth;
                    this.fsm.changeState(OctopusBatteryState.idle);
                    return;
                }
            }
        }
    }
    checkVerticalRaycasts(surfaces) {
        let into;
        for (let j = 0; j < surfaces.length; j++) {
            let surface = surfaces[j];
            let nx = surface.dir.y;
            let ny = -surface.dir.x;
            // Check floors
            if (ny == -1 && this.getVelocity().y > 0) {
                into = sat2d_1.SAT2D.testRayVsRay(this.downRay, new ray_1.Ray(new vector2_1.Vector2(surface.p1.x, surface.p1.y), new vector2_1.Vector2(surface.p2.x, surface.p2.y), ray_2.RayType.not_infinite), into);
                if (into != null) {
                    let dx = into.ray1.end.x - into.ray1.start.x;
                    let dy = into.ray1.end.y - into.ray1.start.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    let trueDistance = distance * into.u1;
                    let contactX = into.ray1.start.x + into.ray1.dir.x * into.u1;
                    let contactY = into.ray1.start.y + trueDistance;
                    // this.pGraphicsDebug.drawCircle(contactX, contactY, 3);
                    if (trueDistance > this.hitbox.halfHeight) {
                        continue;
                    }
                    this.getPosition().y = contactY - this.hitbox.halfHeight;
                    this.fsm.changeState(OctopusBatteryState.idle);
                    return;
                }
            }
            // Check ceilings
            if (ny == 1 && this.getVelocity().y < 0) {
                into = sat2d_1.SAT2D.testRayVsRay(this.upRay, new ray_1.Ray(new vector2_1.Vector2(surface.p1.x, surface.p1.y), new vector2_1.Vector2(surface.p2.x, surface.p2.y), ray_2.RayType.not_infinite), into);
                if (into != null) {
                    let dx = into.ray1.end.x - into.ray1.start.x;
                    let dy = into.ray1.end.y - into.ray1.start.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    let trueDistance = distance * into.u1;
                    let contactX = into.ray1.start.x + into.ray1.dir.x * into.u1;
                    let contactY = into.ray1.start.y - trueDistance;
                    // this.pGraphicsDebug.drawCircle(contactX, contactY, 3);
                    if (trueDistance > this.hitbox.halfHeight) {
                        continue;
                    }
                    this.getPosition().y = contactY + this.hitbox.halfHeight;
                    this.fsm.changeState(OctopusBatteryState.idle);
                    return;
                }
            }
        }
    }
    resetProps() {
        this.isFirstRun = true;
    }
    showDebugRays() {
        // this.pGraphicsDebug.lineStyle(1, 0);
        // this.pGraphicsDebug.moveTo(this.leftRay.start.x, this.leftRay.start.y);
        // this.pGraphicsDebug.lineTo(this.leftRay.end.x, this.leftRay.end.y);
        // this.pGraphicsDebug.moveTo(this.rightRay.start.x, this.rightRay.start.y);
        // this.pGraphicsDebug.lineTo(this.rightRay.end.x, this.rightRay.end.y);
        // this.pGraphicsDebug.moveTo(this.upRay.start.x, this.upRay.start.y);
        // this.pGraphicsDebug.lineTo(this.upRay.end.x, this.upRay.end.y);
        // this.pGraphicsDebug.moveTo(this.downRay.start.x, this.downRay.start.y);
        // this.pGraphicsDebug.lineTo(this.downRay.end.x, this.downRay.end.y);
    }
}
exports.OctopusBattery = OctopusBattery;
var OctopusBatteryState;
(function (OctopusBatteryState) {
    OctopusBatteryState["idle"] = "idle";
    OctopusBatteryState["move"] = "move";
})(OctopusBatteryState || (OctopusBatteryState = {}));
class OctopusBatteryIdleState {
    constructor(actor) {
        this.name = OctopusBatteryState.idle;
        this.elapsedTime = 0;
        this.minEndTime = 1000;
        this.maxEndTime = 2500;
        this.endTime = 0;
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
        if (this.actor.isFirstRun) {
            this.endTime = 0;
        }
        else {
            this.endTime = Math.random() * (this.maxEndTime - this.minEndTime) + this.minEndTime;
        }
    }
    update() {
        if (this.actor.animations.currentAnim.isFinished) {
            this.actor.animations.play(OctopusBatteryAnimations.idle);
        }
        this.elapsedTime += main_1.fixedTimeMS;
        if (this.elapsedTime >= this.endTime) {
            this.actor.fsm.changeState(OctopusBatteryState.move);
            return;
        }
    }
    exit() {
        this.initialized = false;
        this.elapsedTime = 0;
    }
}
class OctopusBatteryMoveState {
    constructor(actor) {
        this.name = OctopusBatteryState.move;
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
        this.actor.animations.play(OctopusBatteryAnimations.open_eyes);
        if (this.actor.horizontal) {
            let dir = mathutil_1.MathUtil.sign(this.actor.prevTargetSpeed.x) * -1;
            this.actor.targetSpeed.x = this.actor.speed * dir;
        }
        else if (this.actor.vertical) {
            let dir = mathutil_1.MathUtil.sign(this.actor.prevTargetSpeed.y) * -1;
            this.actor.targetSpeed.y = this.actor.speed * dir;
        }
        else {
            console.error('Forgot to set horizontal/vertical!');
        }
    }
    update() {
    }
    exit() {
        this.initialized = false;
        this.actor.animations.play(OctopusBatteryAnimations.reverse_open_eyes);
        this.actor.prevTargetSpeed.x = this.actor.targetSpeed.x;
        this.actor.prevTargetSpeed.y = this.actor.targetSpeed.y;
        this.actor.targetSpeed.x = 0;
        this.actor.targetSpeed.y = 0;
    }
}


/***/ }),
/* 42 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KillerBullet = void 0;
const enemy_1 = __webpack_require__(31);
const konstants_1 = __webpack_require__(2);
const stateMachine_1 = __webpack_require__(33);
const main_1 = __webpack_require__(0);
var KillerBulletAnimations;
(function (KillerBulletAnimations) {
    KillerBulletAnimations["idle"] = "idle";
})(KillerBulletAnimations || (KillerBulletAnimations = {}));
class KillerBullet extends enemy_1.Enemy {
    constructor(myWorld, tag, myEntityType, game, x, y, key, frame) {
        super(myWorld, tag, myEntityType, game, x, y, key, frame);
        this.horizontalSpeed = 50;
        this.verticalSpeed = 40;
        this.initialPos = new Phaser.Point(0, 0);
        this.initialPos.x = this.getPosition().x;
        this.initialPos.y = this.myWorld.entityManager.player.getPosition().y;
        this.getPosition().x = x;
        this.getPosition().y = this.initialPos.y;
        this.position.y = this.getPosition().y;
        this.position.x = (this.getPosition().x + 0.5) | 0;
        this.anchor.setTo(0.5, 0.5);
        this.smoothed = false;
        this.setFacingDirection(1);
        this.health = 1;
        this.maxHealth = 1;
        this.animations.add(KillerBulletAnimations.idle, ['killer_bullet'], 10, false, false);
        this.animations.play(KillerBulletAnimations.idle);
        this.hitbox = new Phaser.Rectangle(this.getPosition().x, this.getPosition().y, 16, 16);
        this.updateRect();
        this.fsm = new stateMachine_1.StateMachine();
        this.fsm.addState(KillerBulletState.move, new KillerBulletMoveState(this));
        this.fsm.addState(KillerBulletState.explode, new KillerBulletExplodeState(this));
        this.fsm.changeState(KillerBulletState.move);
    }
    manualUpdate() {
        // this.pGraphicsDebug.clear();
        if (!this.alive) {
            return;
        }
        this.frozen.update();
        if (this.frozen.isFrozen) {
            return;
        }
        this.fsm.currentState.update();
        this.updateRect();
    }
    takeDamage(damage) {
        if (this.isShielded) {
            this.game.sound.play(konstants_1.AudioName.dink);
            return;
        }
        if (this.health <= 0) {
            return;
        }
        this.game.sound.play(konstants_1.AudioName.enemy_damage);
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            let entity = this.myWorld.entityManager.createEntity(konstants_1.EntityType.explosion_from_killer_bullet, this.getPosition().x, this.getPosition().y);
            this.myWorld.entityManager.addEntity(entity);
            this.myWorld.game.add.existing(entity);
            this.myWorld.dropManager.dropPowerUp(this.getPosition().x, this.getPosition().y);
            this.kill();
        }
    }
    updateRect() {
        this.hitbox.x = this.getPosition().x - this.hitbox.width * 0.5;
        this.hitbox.y = this.getPosition().y - this.hitbox.height * 0.5;
    }
}
exports.KillerBullet = KillerBullet;
var KillerBulletState;
(function (KillerBulletState) {
    KillerBulletState["move"] = "attack";
    KillerBulletState["explode"] = "goBackUp";
})(KillerBulletState || (KillerBulletState = {}));
class KillerBulletMoveState {
    constructor(actor) {
        this.name = KillerBulletState.move;
        this.amplitude = 0;
        this.count = 0;
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
    }
    update() {
        this.count += 2;
        this.actor.getPosition().y = this.actor.verticalSpeed * Math.sin(this.count * main_1.fixedTime) + this.actor.initialPos.y;
        this.actor.getPosition().x += -this.actor.horizontalSpeed * main_1.fixedTime;
        this.actor.position.y = this.actor.getPosition().y;
        this.actor.position.x = (this.actor.getPosition().x + 0.5) | 0;
    }
    exit() {
        this.initialized = false;
    }
}
class KillerBulletExplodeState {
    constructor(actor) {
        this.name = KillerBulletState.explode;
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
    }
    update() {
    }
    exit() {
        this.initialized = false;
    }
}


/***/ }),
/* 43 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Explosion = void 0;
const entity_1 = __webpack_require__(16);
var ExplosionAnimations;
(function (ExplosionAnimations) {
    ExplosionAnimations["explode"] = "explode";
})(ExplosionAnimations || (ExplosionAnimations = {}));
class Explosion extends entity_1.Entity {
    constructor(myWorld, tag, myEntityType, game, x, y, key, frame) {
        super(myWorld, tag, myEntityType, game, x, y, key, frame);
        this.getPosition().x = x;
        this.getPosition().y = y;
        this.position.y = this.getPosition().y;
        this.position.x = (this.getPosition().x + 0.5) | 0;
        this.anchor.setTo(0.5, 0.5);
        this.smoothed = false;
        this.setFacingDirection(1);
        this.health = 1;
        this.maxHealth = 1;
        this.animations.add(ExplosionAnimations.explode, ['explosion_01', 'explosion_02', 'explosion_03', 'explosion_04', 'explosion_05', 'explosion_06', 'explosion_07',
            'explosion_08', 'explosion_09', 'explosion_10', 'explosion_11'], 14, false, false);
        this.animations.play(ExplosionAnimations.explode);
        this.hitbox = new Phaser.Rectangle(this.getPosition().x, this.getPosition().y, 36, 36);
        this.updateRect();
    }
    manualUpdate() {
        if (!this.alive) {
            return;
        }
        if (this.animations.currentAnim != null || this.animations.currentAnim != undefined) {
            if (this.animations.currentAnim.isFinished) {
                this.takeDamage(9999);
                return;
            }
        }
        this.updateRect();
    }
    takeDamage(damage) {
        if (this.health <= 0) {
            return;
        }
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            this.kill();
        }
    }
    updateRect() {
        this.hitbox.x = this.getPosition().x - this.hitbox.width * 0.5;
        this.hitbox.y = this.getPosition().y - this.hitbox.height * 0.5;
    }
}
exports.Explosion = Explosion;


/***/ }),
/* 44 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ScrewBomber = exports.MountType = void 0;
const enemy_1 = __webpack_require__(31);
const konstants_1 = __webpack_require__(2);
const stateMachine_1 = __webpack_require__(33);
const main_1 = __webpack_require__(0);
var MountType;
(function (MountType) {
    MountType["Ceiling"] = "Ceiling";
    MountType["Floor"] = "Floor";
})(MountType = exports.MountType || (exports.MountType = {}));
var ScrewBomberAnimationNames;
(function (ScrewBomberAnimationNames) {
    ScrewBomberAnimationNames["idle"] = "idle";
    ScrewBomberAnimationNames["open"] = "open";
    ScrewBomberAnimationNames["close"] = "close";
    ScrewBomberAnimationNames["spin"] = "spin";
})(ScrewBomberAnimationNames || (ScrewBomberAnimationNames = {}));
class ScrewBomber extends enemy_1.Enemy {
    constructor(myWorld, tag, myEntityType, game, x, y, key, frame) {
        super(myWorld, tag, myEntityType, game, x, y, key, frame);
        this.bulletYDirection = 1;
        this.hitBoxOffset = new Phaser.Point();
        this.fsm = new stateMachine_1.StateMachine();
        this.fsm.addState(ScrewBomberState.wait_for_player, new ScrewBomberWaitForPlayerState(this));
        this.fsm.addState(ScrewBomberState.opening, new ScrewBomberOpeningState(this));
        this.fsm.addState(ScrewBomberState.closing, new ScrewBomberClosingState(this));
        this.fsm.addState(ScrewBomberState.wait_to_close, new ScrewBomberWaitToCloseState(this));
        this.fsm.addState(ScrewBomberState.shooting, new ScrewBomberShootingState(this));
        this.fsm.addState(ScrewBomberState.rest_after_shoot, new ScrewBomberRestAfterShootState(this));
        this.fsm.changeState(ScrewBomberState.wait_for_player);
        this.getPosition().x = x;
        this.getPosition().y = y;
        this.position.x = (this.getPosition().x + 0.5) | 0;
        this.position.y = this.getPosition().y;
        this.smoothed = false;
        this.health = 1;
        this.maxHealth = 1;
        this.isShielded = false;
        this.anchor.setTo(0.5, 0.5);
        this.animations.add(ScrewBomberAnimationNames.idle, ['screw_bomber_01'], 10, false, false);
        this.animations.add(ScrewBomberAnimationNames.open, ['screw_bomber_01', 'screw_bomber_02'], 5, false, false);
        this.animations.add(ScrewBomberAnimationNames.close, ['screw_bomber_02', 'screw_bomber_01'], 5, false, false);
        this.animations.add(ScrewBomberAnimationNames.spin, ['screw_bomber_02', 'screw_bomber_03', 'screw_bomber_04',], 7, true, false);
        this.animations.play(ScrewBomberAnimationNames.idle);
        this.hitbox = new Phaser.Rectangle(this.getPosition().x, this.getPosition().y, 16, 8);
        this.updateRect();
    }
    manualUpdate() {
        // this.pGraphicsDebug.clear();
        if (!this.alive) {
            return;
        }
        this.frozen.update();
        if (this.frozen.isFrozen) {
            return;
        }
        this.fsm.currentState.update();
        this.updateRect();
    }
    takeDamage(damage) {
        if (this.isShielded) {
            this.game.sound.play(konstants_1.AudioName.dink);
            return;
        }
        if (this.health <= 0) {
            return;
        }
        this.game.sound.play(konstants_1.AudioName.enemy_damage);
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            this.myWorld.dropManager.dropPowerUp(this.getPosition().x, this.getPosition().y);
            let y = this.mountType == MountType.Floor ? 8 : -8; // offset the y position slightly; aesthetics!
            this.myWorld.createExplosionEffect(this.getPosition().x + this.hitbox.halfWidth, this.getPosition().y + y);
            this.kill();
        }
    }
    shoot(angle) {
        let height = 0;
        switch (this.mountType) {
            case MountType.Floor:
                height = -3;
                break;
            case MountType.Ceiling:
                height = 6;
                break;
        }
        let bullet = this.myWorld.entityManager.createBitmapBullet(this, this.position.x, this.position.y + height, 6, 6, konstants_1.EntityType.bullet, konstants_1.EntityType.screw_bomber_bullet);
        bullet.horizontalSpeed = 125;
        let cos = Math.cos(angle * (Math.PI / 180));
        let sin = Math.sin(angle * (Math.PI / 180));
        bullet.targetSpeed.x = bullet.horizontalSpeed * cos * -this.getFacingDirection();
        bullet.targetSpeed.y = bullet.horizontalSpeed * sin * -this.getFacingDirection() * -this.bulletYDirection;
    }
    updateRect() {
        this.hitbox.x = this.getPosition().x + this.hitBoxOffset.x;
        this.hitbox.y = this.getPosition().y + this.hitBoxOffset.y;
    }
    setMountByRotation(rotation) {
        switch (rotation) {
            // Mounted to floor
            case 0:
                this.mountType = MountType.Floor;
                this.bulletYDirection = -1;
                this.useIdleHitbox();
                break;
            // Mounted to ceiling
            case 180:
                this.mountType = MountType.Ceiling;
                this.bulletYDirection = 1;
                this.height = -this.height;
                this.getPosition().x = this.position.x - 16;
                this.getPosition().y = this.position.y + 16;
                this.position.x = (this.getPosition().x + 0.5) | 0;
                this.position.y = this.getPosition().y;
                this.useIdleHitbox();
                break;
            default:
                console.error('Screw Bomber: rotation doesnt exist');
                break;
        }
    }
    /**
     * Modifies the hitbox to be larger when shooting.
     */
    useShootingHitbox() {
        switch (this.mountType) {
            case MountType.Floor:
                this.hitBoxOffset.x = -8;
                this.hitBoxOffset.y = -8;
                this.hitbox.width = 16;
                this.hitbox.height = 16;
                break;
            case MountType.Ceiling:
                this.hitBoxOffset.x = -8;
                this.hitBoxOffset.y = -8;
                this.hitbox.width = 16;
                this.hitbox.height = 16;
                break;
        }
    }
    /**
     * Modifies the hitbox to be smaller when idle.
     */
    useIdleHitbox() {
        switch (this.mountType) {
            case MountType.Floor:
                this.hitBoxOffset.x = -8;
                this.hitBoxOffset.y = 0;
                this.hitbox.width = 16;
                this.hitbox.height = 8;
                break;
            case MountType.Ceiling:
                this.hitBoxOffset.x = -8;
                this.hitBoxOffset.y = -8;
                this.hitbox.width = 16;
                this.hitbox.height = 8;
                break;
        }
    }
}
exports.ScrewBomber = ScrewBomber;
var ScrewBomberState;
(function (ScrewBomberState) {
    ScrewBomberState["wait_for_player"] = "wait_for_player";
    ScrewBomberState["rest_after_shoot"] = "idle";
    ScrewBomberState["opening"] = "opening";
    ScrewBomberState["closing"] = "closing";
    ScrewBomberState["wait_to_close"] = "wait_to_close";
    ScrewBomberState["shooting"] = "shooting";
})(ScrewBomberState || (ScrewBomberState = {}));
class ScrewBomberWaitForPlayerState {
    constructor(actor) {
        this.name = ScrewBomberState.wait_for_player;
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
        this.actor.animations.play(ScrewBomberAnimationNames.idle);
    }
    update() {
        let xDist = Math.abs(Math.abs(this.actor.getPosition().x) - Math.abs(this.actor.myWorld.entityManager.player.getPosition().x));
        if (xDist > 72) {
            return;
        }
        this.actor.fsm.changeState(ScrewBomberState.opening);
    }
    exit() {
        this.initialized = false;
    }
}
class ScrewBomberOpeningState {
    constructor(actor) {
        this.name = ScrewBomberState.opening;
        this.elapsedWaitTime = 0;
        this.waitEndTime = 500;
        this.isOpening = false;
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
        this.actor.animations.play(ScrewBomberAnimationNames.open);
        this.isOpening = true;
    }
    update() {
        if (this.isOpening) {
            if (this.actor.animations.currentAnim.isFinished) {
                this.actor.useShootingHitbox();
                this.isOpening = false;
                this.actor.animations.play(ScrewBomberAnimationNames.spin);
            }
            return;
        }
        this.elapsedWaitTime += main_1.fixedTimeMS;
        if (this.elapsedWaitTime >= this.waitEndTime) {
            this.actor.fsm.changeState(ScrewBomberState.shooting);
            return;
        }
    }
    exit() {
        this.initialized = false;
        this.elapsedWaitTime = 0;
        this.isOpening = false;
    }
}
class ScrewBomberShootingState {
    constructor(actor) {
        this.name = ScrewBomberState.shooting;
        this.elapsedTime = 0;
        this.shootDelay = 450;
        this.numBullets = 0;
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
        this.elapsedTime = this.shootDelay;
    }
    update() {
        this.elapsedTime += main_1.fixedTimeMS;
        if (this.elapsedTime > this.shootDelay) {
            this.elapsedTime = 0;
            this.numBullets++;
            switch (this.numBullets) {
                case 1:
                    this.actor.shoot(0);
                    this.actor.shoot(-225);
                    this.actor.shoot(-270);
                    this.actor.shoot(-315);
                    this.actor.shoot(-180);
                    this.actor.game.sound.play(konstants_1.AudioName.enemy_shoot);
                    break;
                case 2:
                    this.actor.shoot(0);
                    this.actor.shoot(-225);
                    this.actor.shoot(-270);
                    this.actor.shoot(-315);
                    this.actor.shoot(-180);
                    this.actor.game.sound.play(konstants_1.AudioName.enemy_shoot);
                    this.actor.fsm.changeState(ScrewBomberState.wait_to_close);
                    break;
                default:
                    console.error('Screw Bomber: numBullets incorrect!');
                    break;
            }
        }
    }
    exit() {
        this.initialized = false;
        this.numBullets = 0;
        this.elapsedTime = 0;
    }
}
class ScrewBomberWaitToCloseState {
    constructor(actor) {
        this.name = ScrewBomberState.wait_to_close;
        this.waitElapsedTime = 0;
        this.waitEndTime = 0;
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
    }
    update() {
        this.waitElapsedTime += main_1.fixedTimeMS;
        if (this.waitElapsedTime > this.waitEndTime) {
            this.actor.fsm.changeState(ScrewBomberState.closing);
        }
    }
    exit() {
        this.initialized = false;
        this.waitElapsedTime = 0;
    }
}
class ScrewBomberClosingState {
    constructor(actor) {
        this.name = ScrewBomberState.closing;
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
        this.actor.animations.play(ScrewBomberAnimationNames.close);
        this.actor.useIdleHitbox();
    }
    update() {
        if (this.actor.animations.currentAnim.isFinished) {
            this.actor.fsm.changeState(ScrewBomberState.rest_after_shoot);
            return;
        }
    }
    exit() {
        this.initialized = false;
    }
}
class ScrewBomberRestAfterShootState {
    constructor(actor) {
        this.name = ScrewBomberState.rest_after_shoot;
        this.elapsedIdleTime = 0;
        this.idleEndTime = 2000;
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
        this.actor.animations.play(ScrewBomberAnimationNames.idle);
    }
    update() {
        this.elapsedIdleTime += main_1.fixedTimeMS;
        if (this.elapsedIdleTime > this.idleEndTime) {
            this.elapsedIdleTime = 0;
            this.actor.fsm.changeState(ScrewBomberState.wait_for_player);
            return;
        }
    }
    exit() {
        this.initialized = false;
        this.elapsedIdleTime = 0;
    }
}


/***/ }),
/* 45 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SuperCutter = void 0;
const enemy_1 = __webpack_require__(31);
const konstants_1 = __webpack_require__(2);
const mathutil_1 = __webpack_require__(34);
const stateMachine_1 = __webpack_require__(33);
const main_1 = __webpack_require__(0);
var SuperCutterAnimationNames;
(function (SuperCutterAnimationNames) {
    SuperCutterAnimationNames["open_and_close"] = "open_and_close";
})(SuperCutterAnimationNames || (SuperCutterAnimationNames = {}));
class SuperCutter extends enemy_1.Enemy {
    constructor(myWorld, tag, e, game, x, y, key, frame) {
        super(myWorld, tag, e, game, x, y, key, frame);
        this.targetSpeed = new Phaser.Point(0, 0);
        this.useGravity = true;
        this.gravityX = 0;
        this.gravityY = 400;
        this.vx = 0;
        this.vy = 0;
        this.targetDistance = 0;
        this.customAngle = 80;
        this.elapsedTime = 0;
        this.getPosition().x = x;
        this.getPosition().y = y;
        this.position.x = (this.getPosition().x + 0.5) | 0;
        this.position.y = this.getPosition().y;
        this.smoothed = false;
        this.health = 1;
        this.maxHealth = 1;
        this.isShielded = false;
        this.anchor.setTo(0.5, 0.5);
        this.fsm = new stateMachine_1.StateMachine();
        this.fsm.addState(SuperCutterState.active, new SuperCutterActiveState(this));
        this.fsm.changeState(SuperCutterState.active);
        this.animations.add(SuperCutterAnimationNames.open_and_close, ['super_cutter_01', 'super_cutter_02'], 5, true, false);
        this.animations.play(SuperCutterAnimationNames.open_and_close);
        this.hitbox = new Phaser.Rectangle(this.getPosition().x, this.getPosition().y, 16, 16);
        this.hitboxOffset.x = -8;
        this.hitboxOffset.y = -8;
        this.updateRect();
        this.calculate();
    }
    manualUpdate() {
        // this.pGraphicsDebug.clear();
        if (!this.alive) {
            return;
        }
        this.frozen.update();
        if (this.frozen.isFrozen) {
            return;
        }
        this.fsm.currentState.update();
        this.position.x = (this.getPosition().x + 0.5) | 0;
        this.position.y = this.getPosition().y;
        this.updateRect();
    }
    takeDamage(damage) {
        if (this.isShielded) {
            this.game.sound.play(konstants_1.AudioName.dink);
            return;
        }
        if (this.health <= 0) {
            return;
        }
        this.game.sound.play(konstants_1.AudioName.enemy_damage);
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            this.myWorld.dropManager.dropPowerUp(this.getPosition().x + this.hitbox.halfWidth * 0.5, this.getPosition().y + this.hitbox.halfHeight);
            this.myWorld.createExplosionEffect(this.getPosition().x + this.hitbox.halfWidth, this.getPosition().y + this.hitbox.halfHeight);
            this.kill();
        }
    }
    calculate() {
        let dirToPlayer = -mathutil_1.MathUtil.sign(this.getPosition().x - this.myWorld.entityManager.player.getPosition().x);
        let xDist = Math.abs(Math.abs(this.getPosition().x) - Math.abs(this.myWorld.entityManager.player.getPosition().x + (-dirToPlayer * 1)));
        this.targetDistance = xDist;
        let firingAngle = this.customAngle * (Math.PI / 180);
        this.projVel = this.targetDistance / (Math.sin(2 * firingAngle) / this.gravityY);
        this.vx = Math.sqrt(this.projVel) * Math.cos(firingAngle) * dirToPlayer;
        this.vy = Math.sqrt(this.projVel) * Math.sin(firingAngle);
        this.flightDuration = this.targetDistance / this.vx;
        this.setFacingDirection(-dirToPlayer);
    }
}
exports.SuperCutter = SuperCutter;
var SuperCutterState;
(function (SuperCutterState) {
    SuperCutterState["active"] = "active";
})(SuperCutterState || (SuperCutterState = {}));
class SuperCutterActiveState {
    constructor(actor) {
        this.name = SuperCutterState.active;
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
        this.actor.calculate();
    }
    update() {
        this.actor.getPosition().x += this.actor.vx * main_1.fixedTime;
        this.actor.getPosition().y -= (this.actor.vy - (this.actor.gravityY * this.actor.elapsedTime)) * main_1.fixedTime;
        this.actor.elapsedTime += main_1.fixedTime;
    }
    exit() {
        this.initialized = false;
    }
}


/***/ }),
/* 46 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Watcher = void 0;
const enemy_1 = __webpack_require__(31);
const konstants_1 = __webpack_require__(2);
const mathutil_1 = __webpack_require__(34);
const stateMachine_1 = __webpack_require__(33);
const main_1 = __webpack_require__(0);
var WatcherAnimations;
(function (WatcherAnimations) {
    WatcherAnimations["idle"] = "idle";
    WatcherAnimations["shoot"] = "shoot";
    WatcherAnimations["reverse_shoot"] = "reverse_shoot";
})(WatcherAnimations || (WatcherAnimations = {}));
class Watcher extends enemy_1.Enemy {
    constructor(myWorld, tag, e, game, x, y, key, frame) {
        super(myWorld, tag, e, game, x, y, key, frame);
        this.verticalSpeed = 50;
        this.targetSpeed = new Phaser.Point(0, 0);
        this.startYDirection = 1; // initial y movement direction; based off players position
        this.hitBoxOffset = new Phaser.Point();
        this.getPosition().x = x;
        this.getPosition().y = y;
        this.position.x = (this.getPosition().x + 0.5) | 0;
        this.position.y = this.getPosition().y;
        this.smoothed = false;
        this.anchor.setTo(0.5, 0.5);
        this.setFacingDirection(1);
        this.health = 1;
        this.maxHealth = 1;
        this.isShielded = false;
        this.hitbox = new Phaser.Rectangle(this.getPosition().x, this.getPosition().y, 16, 16);
        this.animations.add(WatcherAnimations.idle, ['watcher_01'], 10, false, false);
        this.animations.add(WatcherAnimations.shoot, ['watcher_01', 'watcher_02', 'watcher_03'], 7, false, false);
        this.animations.add(WatcherAnimations.reverse_shoot, ['watcher_03', 'watcher_02', 'watcher_01'], 10, false, false);
        this.animations.play(WatcherAnimations.shoot);
        this.fsm = new stateMachine_1.StateMachine();
        this.fsm.addState(WatcherState.spawn_delay, new WatcherSpawnDelayState(this));
        this.fsm.addState(WatcherState.move, new WatcherMoveState(this));
        this.fsm.addState(WatcherState.open, new WatcherOpenState(this));
        this.fsm.addState(WatcherState.shoot, new WatcherShootState(this));
        this.fsm.addState(WatcherState.escape, new WatcherEscapeState(this));
        this.fsm.changeState(WatcherState.spawn_delay);
        this.updateRect();
        this.visible = false;
    }
    manualUpdate() {
        // this.pGraphicsDebug.clear();
        if (!this.alive) {
            return;
        }
        this.frozen.update();
        if (this.frozen.isFrozen) {
            return;
        }
        this.fsm.currentState.update();
        this.velocity.x = this.targetSpeed.x;
        this.velocity.y = this.targetSpeed.y;
        this.getPosition().x += this.velocity.x * main_1.fixedTime;
        this.getPosition().y += this.velocity.y * main_1.fixedTime;
        this.position.x = (this.getPosition().x + 0.5) | 0;
        this.position.y = this.getPosition().y;
        this.updateRect();
    }
    initialize() {
        this.fsm.states.Item(WatcherState.spawn_delay).spawnDelay = this.spawnDelay;
        switch (this.direction) {
            case -1:
                this.getPosition().y += 25;
                this.position.y = this.getPosition().y;
                break;
            case 1:
                this.getPosition().y -= 35;
                this.position.y = this.getPosition().y;
                break;
            default:
                console.error('direction value not set correctly.');
                break;
        }
        this.startYDirection = this.direction;
    }
    takeDamage(damage) {
        if (this.isShielded) {
            this.game.sound.play(konstants_1.AudioName.dink);
            return;
        }
        if (this.health <= 0) {
            return;
        }
        this.game.sound.play(konstants_1.AudioName.enemy_damage);
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            this.myWorld.dropManager.dropPowerUp(this.getPosition().x, this.getPosition().y);
            this.myWorld.createExplosionEffect(this.getPosition().x, this.getPosition().y - this.hitbox.halfHeight);
            this.kill();
        }
    }
    updateRect() {
        this.hitbox.x = this.getPosition().x + this.hitBoxOffset.x;
        this.hitbox.y = this.getPosition().y + this.hitBoxOffset.y;
    }
    shoot(x, y, angle) {
        let bullet = this.myWorld.entityManager.createLaserBullet(this, x, y, 24, 4, konstants_1.EntityType.laser_beam, konstants_1.EntityType.laser_beam);
        bullet.horizontalSpeed = 160;
        let cos = Math.cos(angle * (Math.PI / 180));
        let sin = Math.sin(angle * (Math.PI / 180));
        bullet.targetSpeed.x = bullet.horizontalSpeed * cos * -this.getFacingDirection();
        bullet.targetSpeed.y = bullet.horizontalSpeed * sin * -this.getFacingDirection();
    }
    /**
     * Modifies the hitbox to be larger when shooting.
     */
    useLargeHitbox() {
        this.hitBoxOffset.x = -8;
        this.hitBoxOffset.y = -20.5;
        this.hitbox.width = 16;
        this.hitbox.height = 41;
    }
    /**
     * Modifies the hitbox to be smaller when idle.
     */
    useSmallHitbox() {
        this.hitBoxOffset.x = -8;
        this.hitBoxOffset.y = -8;
        this.hitbox.width = 16;
        this.hitbox.height = 16;
    }
}
exports.Watcher = Watcher;
var WatcherState;
(function (WatcherState) {
    WatcherState["spawn_delay"] = "spawn_delay";
    WatcherState["move"] = "move";
    WatcherState["open"] = "open";
    WatcherState["shoot"] = "shoot";
    WatcherState["escape"] = "escape";
})(WatcherState || (WatcherState = {}));
class WatcherSpawnDelayState {
    constructor(actor) {
        this.name = WatcherState.spawn_delay;
        this.elapsedTime = 0;
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
    }
    update() {
        this.elapsedTime += main_1.fixedTimeMS;
        if (this.elapsedTime >= this.spawnDelay) {
            this.actor.visible = true;
            this.actor.fsm.changeState(WatcherState.move);
        }
    }
    exit() {
        this.initialized = false;
        this.elapsedTime = 0;
    }
}
class WatcherMoveState {
    constructor(actor) {
        this.name = WatcherState.move;
        this.elapsedTime = 0;
        this.endTime = 1000;
        this.playerHalfHeight = 0;
        this.additionalHeightOffset = 6;
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
        this.actor.animations.play(WatcherAnimations.idle);
        this.playerHalfHeight = this.actor.myWorld.entityManager.player.hitbox.halfHeight;
        this.actor.useSmallHitbox();
    }
    update() {
        let yDist = this.actor.getPosition().y - (this.actor.myWorld.entityManager.player.getPosition().y - this.playerHalfHeight + this.additionalHeightOffset);
        let yDir = -mathutil_1.MathUtil.sign(yDist);
        this.actor.targetSpeed.y = yDir * this.actor.verticalSpeed;
        if (yDist < 36) {
            this.actor.fsm.changeState(WatcherState.open);
        }
    }
    exit() {
        this.initialized = false;
    }
}
class WatcherOpenState {
    constructor(actor) {
        this.name = WatcherState.open;
        this.playerHalfHeight = 0;
        this.additionalHeightOffset = 6;
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
        this.actor.animations.play(WatcherAnimations.shoot).onComplete.addOnce(() => {
            this.actor.fsm.changeState(WatcherState.shoot);
        }, this);
        this.playerHalfHeight = this.actor.myWorld.entityManager.player.hitbox.halfHeight;
    }
    update() {
        // Always face the player.
        let dir = mathutil_1.MathUtil.sign(this.actor.getPosition().x - this.actor.myWorld.entityManager.player.getPosition().x);
        this.actor.setFacingDirection(dir);
        // If the player is out of range then get out of this state back to move state.
        let yDist = Math.abs(this.actor.getPosition().y - (this.actor.myWorld.entityManager.player.getPosition().y - this.playerHalfHeight + this.additionalHeightOffset));
        if (yDist > 36) {
            this.actor.animations.stop();
            this.actor.fsm.changeState(WatcherState.move);
        }
    }
    exit() {
        this.initialized = false;
    }
}
class WatcherShootState {
    constructor(actor) {
        this.name = WatcherState.shoot;
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
        this.actor.shoot(this.actor.position.x + 2, this.actor.position.y - 12, 0);
        this.actor.shoot(this.actor.position.x + 2, this.actor.position.y + 20, 0);
        this.actor.animations.play(WatcherAnimations.reverse_shoot).onComplete.addOnce(() => {
            this.actor.fsm.changeState(WatcherState.escape);
        }, this);
        this.actor.useLargeHitbox();
    }
    update() {
    }
    exit() {
        this.initialized = false;
    }
}
class WatcherEscapeState {
    constructor(actor) {
        this.name = WatcherState.escape;
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
        this.actor.animations.play(WatcherAnimations.idle);
        this.actor.targetSpeed.y = -this.actor.startYDirection * this.actor.verticalSpeed;
        this.actor.useSmallHitbox();
    }
    update() {
    }
    exit() {
        this.initialized = false;
    }
}


/***/ }),
/* 47 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Peng = void 0;
const enemy_1 = __webpack_require__(31);
const konstants_1 = __webpack_require__(2);
const stateMachine_1 = __webpack_require__(33);
const main_1 = __webpack_require__(0);
var PengAnimations;
(function (PengAnimations) {
    PengAnimations["idle"] = "idle";
    PengAnimations["active"] = "active";
})(PengAnimations || (PengAnimations = {}));
class Peng extends enemy_1.Enemy {
    constructor(myWorld, tag, myEntityType, game, x, y, key, frame) {
        super(myWorld, tag, myEntityType, game, x, y, key, frame);
        this.horizontalSpeed = 74;
        this.verticalSpeed = 50;
        this.initialPos = new Phaser.Point(0, 0);
        this.getPosition().x = x;
        this.getPosition().y = y;
        this.position.y = this.getPosition().y;
        this.position.x = (this.getPosition().x + 0.5) | 0;
        this.anchor.setTo(0.5, 0.5);
        this.smoothed = false;
        this.setFacingDirection(1);
        this.health = 1;
        this.maxHealth = 1;
        this.animations.add(PengAnimations.idle, ['peng_01'], 10, false, false);
        this.animations.add(PengAnimations.active, ['peng_01', 'peng_02'], 10, true, false);
        this.animations.play(PengAnimations.active);
        this.hitbox = new Phaser.Rectangle(this.getPosition().x, this.getPosition().y, 16, 16);
        this.updateRect();
        this.fsm = new stateMachine_1.StateMachine();
        this.fsm.addState(PengState.move, new PengMoveState(this));
        this.fsm.changeState(PengState.move);
    }
    manualUpdate() {
        // this.pGraphicsDebug.clear();
        if (!this.alive) {
            return;
        }
        this.frozen.update();
        if (this.frozen.isFrozen) {
            return;
        }
        this.fsm.currentState.update();
        this.updateRect();
    }
    takeDamage(damage) {
        if (this.isShielded) {
            this.game.sound.play(konstants_1.AudioName.dink);
            return;
        }
        if (this.health <= 0) {
            return;
        }
        this.game.sound.play(konstants_1.AudioName.enemy_damage);
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            this.myWorld.dropManager.dropPowerUp(this.getPosition().x, this.getPosition().y);
            this.kill();
        }
    }
    updateRect() {
        this.hitbox.x = this.getPosition().x - this.hitbox.width * 0.5;
        this.hitbox.y = this.getPosition().y - this.hitbox.height * 0.5;
    }
}
exports.Peng = Peng;
var PengState;
(function (PengState) {
    PengState["move"] = "move";
})(PengState || (PengState = {}));
class PengMoveState {
    constructor(actor) {
        this.name = PengState.move;
        this.amplitude = 0;
        this.count = 0;
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
    }
    update() {
        if (this.actor.getPosition().x > this.actor.game.camera.x + this.actor.game.camera.width) {
            this.actor.getPosition().x = this.actor.game.camera.x;
            return;
        }
        if (this.actor.getPosition().x < this.actor.game.camera.x) {
            this.actor.getPosition().x = this.actor.game.camera.x + this.actor.game.camera.width;
            this.actor.initialPos.y = this.actor.myWorld.entityManager.player.getPosition().y - 20;
            return;
        }
        this.count += 2;
        this.actor.getPosition().y = this.actor.verticalSpeed * Math.sin(this.count * main_1.fixedTime) + this.actor.initialPos.y;
        this.actor.getPosition().x += -this.actor.horizontalSpeed * main_1.fixedTime;
        this.actor.position.y = this.actor.getPosition().y;
        this.actor.position.x = (this.actor.getPosition().x + 0.5) | 0;
    }
    exit() {
        this.initialized = false;
    }
}


/***/ }),
/* 48 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BigEye = void 0;
const enemy_1 = __webpack_require__(31);
const konstants_1 = __webpack_require__(2);
const helper_1 = __webpack_require__(24);
const mathutil_1 = __webpack_require__(34);
const bullet_1 = __webpack_require__(49);
const stateMachine_1 = __webpack_require__(33);
const vector2_1 = __webpack_require__(20);
const ray_1 = __webpack_require__(19);
const ray_2 = __webpack_require__(19);
const sat2d_1 = __webpack_require__(17);
const debug_1 = __webpack_require__(5);
const main_1 = __webpack_require__(0);
var BigEyeAnimationNames;
(function (BigEyeAnimationNames) {
    BigEyeAnimationNames["idle"] = "idle";
    BigEyeAnimationNames["pre_shoot"] = "pre_shoot";
    BigEyeAnimationNames["jump"] = "jump";
})(BigEyeAnimationNames || (BigEyeAnimationNames = {}));
class BigEye extends enemy_1.Enemy {
    constructor(myWorld, tag, e, game, x, y, key, frame) {
        super(myWorld, tag, e, game, x, y, key, frame);
        this.normalJumpSpeed = new Phaser.Point(50, -200);
        this.highJumpSpeed = new Phaser.Point(50, -270);
        this.isNormalJumping = false;
        this.isHighJumping = false;
        this.standingHeight = 48;
        this.jumpingHeight = 32;
        this.horizontalSpeed = 50;
        this.targetSpeed = new Phaser.Point(0, 0);
        this.isOnGround = true;
        this.useGravity = true;
        this.isJumping = true;
        this.isFalling = true;
        this.minJumpHeight = 1;
        this.maxJumpHeight = 44;
        this.timeToJumpApex = 0.35;
        this.gravityX = 0;
        this.gravityY = 0;
        this.maxJumpVelocity = 0;
        this.minJumpVelocity = 0;
        this.groundRays = new Array();
        this.ceilRays = new Array();
        this.leftRays = new Array();
        this.rightRays = new Array();
        this.skinWidth = 5;
        this.numHorizontalRays = 4;
        this.numVerticalRays = 4;
        this.getPosition().x = x + 8;
        this.getPosition().y = y + 24;
        this.position.x = (this.getPosition().x + 0.5) | 0;
        this.position.y = this.getPosition().y;
        this.smoothed = false;
        this.anchor.setTo(0.5, 1);
        this.health = 10;
        this.maxHealth = 10;
        this.isShielded = false;
        this.animations.add(BigEyeAnimationNames.idle, ['big_eye_02'], 10, false, false);
        this.animations.add(BigEyeAnimationNames.jump, ['big_eye_01'], 5, false, false);
        this.animations.play(BigEyeAnimationNames.idle);
        this.hitbox = new Phaser.Rectangle(this.getPosition().x, this.getPosition().y, 16, 48);
        this.hitboxOffset.x = -this.hitbox.halfWidth;
        this.hitboxOffset.y = -this.hitbox.height;
        this.updateRect();
        this.fsm = new stateMachine_1.StateMachine();
        this.fsm.addState(BigEyeState.decide, new BigEyeDecideState(this));
        this.fsm.addState(BigEyeState.jump, new BigEyeJumpState(this));
        this.fsm.changeState(BigEyeState.decide);
        this.wallContact = { left: false, right: false, up: false, down: false };
        this.calculateRegularJumpSettings();
        this.createRays();
    }
    manualUpdate() {
        // this.pGraphicsDebug.clear();
        if (!this.alive) {
            return;
        }
        this.frozen.update();
        if (this.frozen.isFrozen) {
            return;
        }
        this.fsm.currentState.update();
        if (this.useGravity) {
            this.targetSpeed.x += Math.abs(this.gravityX) * main_1.fixedTime;
            this.targetSpeed.y += Math.abs(this.gravityY) * main_1.fixedTime;
        }
        if (this.targetSpeed.y >= 300) {
            this.targetSpeed.y = 300;
        }
        this.velocity.x = this.targetSpeed.x;
        this.velocity.y = this.targetSpeed.y;
        this.getPosition().x += this.velocity.x * main_1.fixedTime;
        this.getPosition().y += this.velocity.y * main_1.fixedTime;
        this.position.x = (this.getPosition().x + 0.5) | 0;
        this.position.y = this.getPosition().y;
        this.updateRect();
        this.castRays();
        this.showDebugRays();
    }
    checkSurfaceCollisions(surfaces) {
        this.wallContact.left = false;
        this.wallContact.right = false;
        this.wallContact.up = false;
        this.wallContact.down = false;
        this.isOnGround = false;
        let into;
        for (let j = 0; j < surfaces.length; j++) {
            let surface = surfaces[j];
            if (!surface.collidable) {
                continue;
            }
            let nx = surface.dir.y;
            let ny = -surface.dir.x;
            // Check floors
            if (ny == -1 && this.getVelocity().y > 0) {
                for (let k = 0; k < this.groundRays.length; k++) {
                    let ray = this.groundRays[k];
                    into = sat2d_1.SAT2D.testRayVsRay(ray, new ray_1.Ray(new vector2_1.Vector2(surface.p1.x, surface.p1.y), new vector2_1.Vector2(surface.p2.x, surface.p2.y), ray_2.RayType.not_infinite), into);
                    if (into != null) {
                        let dx = into.ray1.end.x - into.ray1.start.x;
                        let dy = into.ray1.end.y - into.ray1.start.y;
                        let distance = Math.sqrt(dx * dx + dy * dy);
                        let trueDistance = distance * into.u1;
                        let contactX = into.ray1.start.x + into.ray1.dir.x * into.u1;
                        let contactY = into.ray1.start.y + trueDistance;
                        // this.pGraphicsDebug.drawCircle(contactX, contactY, 3);
                        if (trueDistance > this.hitbox.height * 0.5) {
                            continue;
                        }
                        this.getPosition().y = contactY;
                        this.setVelocity(this.getVelocity().x, 0);
                        this.targetSpeed.y = 0;
                        this.isOnGround = true;
                        this.isJumping = false;
                        this.isFalling = false;
                        this.wallContact.down = true;
                        continue;
                    }
                }
            }
            // Check ceilings
            if (ny == 1 && this.getVelocity().y < 0) {
                for (let k = 0; k < this.ceilRays.length; k++) {
                    let ray = this.ceilRays[k];
                    into = sat2d_1.SAT2D.testRayVsRay(ray, new ray_1.Ray(new vector2_1.Vector2(surface.p1.x, surface.p1.y), new vector2_1.Vector2(surface.p2.x, surface.p2.y), ray_2.RayType.not_infinite), into);
                    if (into != null) {
                        let dx = into.ray1.end.x - into.ray1.start.x;
                        let dy = into.ray1.end.y - into.ray1.start.y;
                        let distance = Math.sqrt(dx * dx + dy * dy);
                        let trueDistance = distance * into.u1;
                        let contactX = into.ray1.start.x + into.ray1.dir.x * into.u1;
                        let contactY = into.ray1.start.y - trueDistance;
                        // this.pGraphicsDebug.drawCircle(contactX, contactY, 3);
                        if (trueDistance > this.hitbox.height * 0.5) {
                            continue;
                        }
                        this.getPosition().y = contactY + this.hitbox.height;
                        this.setVelocity(this.getVelocity().x, 0);
                        this.targetSpeed.y = 0;
                        this.isFalling = true;
                        this.wallContact.up = true;
                        continue;
                    }
                }
            }
            // Check right walls
            if (nx == -1 && this.getVelocity().x > 0) {
                for (let k = 0; k < this.rightRays.length; k++) {
                    let ray = this.rightRays[k];
                    into = sat2d_1.SAT2D.testRayVsRay(ray, new ray_1.Ray(new vector2_1.Vector2(surface.p1.x, surface.p1.y), new vector2_1.Vector2(surface.p2.x, surface.p2.y), ray_2.RayType.not_infinite), into);
                    if (into != null) {
                        let dx = into.ray1.end.x - into.ray1.start.x;
                        let dy = into.ray1.end.y - into.ray1.start.y;
                        let distance = Math.sqrt(dx * dx + dy * dy);
                        let trueDistance = distance * into.u1;
                        let contactX = into.ray1.start.x + trueDistance;
                        let contactY = into.ray1.start.y;
                        // this.pGraphicsDebug.lineStyle(1, 0);
                        // this.pGraphicsDebug.beginFill(0xff0000, 0.5);
                        // this.pGraphicsDebug.drawCircle(contactX, contactY, 5);
                        if (trueDistance > this.hitbox.width * 0.5) {
                            continue;
                        }
                        this.getPosition().x = contactX - this.hitbox.width * 0.5;
                        this.wallContact.right = true;
                        continue;
                    }
                }
            }
            // Check left walls
            if (nx == 1 && this.getVelocity().x < 0) {
                for (let k = 0; k < this.leftRays.length; k++) {
                    let ray = this.leftRays[k];
                    into = sat2d_1.SAT2D.testRayVsRay(ray, new ray_1.Ray(new vector2_1.Vector2(surface.p1.x, surface.p1.y), new vector2_1.Vector2(surface.p2.x, surface.p2.y), ray_2.RayType.not_infinite), into);
                    if (into != null) {
                        let dx = into.ray1.end.x - into.ray1.start.x;
                        let dy = into.ray1.end.y - into.ray1.start.y;
                        let distance = Math.sqrt(dx * dx + dy * dy);
                        let trueDistance = distance * into.u1;
                        let contactX = into.ray1.start.x - trueDistance;
                        let contactY = into.ray1.start.y;
                        // this.pGraphicsDebug.lineStyle(1, 0);
                        // this.pGraphicsDebug.beginFill(0xff0000, 0.5);
                        // this.pGraphicsDebug.drawCircle(contactX, contactY, 5);
                        if (trueDistance > this.hitbox.width * 0.5) {
                            continue;
                        }
                        this.getPosition().x = contactX + this.hitbox.width * 0.5;
                        this.wallContact.left = true;
                        continue;
                    }
                }
            }
        }
    }
    takeDamage(damage) {
        if (this.isShielded) {
            this.game.sound.play(konstants_1.AudioName.dink);
            return;
        }
        if (this.health <= 0) {
            return;
        }
        this.game.sound.play(konstants_1.AudioName.enemy_damage);
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            this.myWorld.dropManager.dropPowerUp(this.getPosition().x, this.getPosition().y);
            this.myWorld.createExplosionEffect(this.getPosition().x, this.getPosition().y - this.hitbox.halfHeight);
            this.kill();
        }
    }
    shoot(angle) {
        let bullet = new bullet_1.Bullet(this, this.myWorld, konstants_1.TagType.bullet, konstants_1.EntityType.bullet_lemon, this.game, this.position.x - 4, this.position.y - 7, konstants_1.Konstants.sniper_joe_bullet, '');
        bullet.horizontalSpeed = 170;
        let cos = Math.cos(angle * (Math.PI / 180));
        let sin = Math.sin(angle * (Math.PI / 180));
        bullet.targetSpeed.x = bullet.horizontalSpeed * cos * -this.getFacingDirection();
        bullet.targetSpeed.y = bullet.horizontalSpeed * sin * -this.getFacingDirection();
        this.game.add.existing(bullet);
        this.myWorld.entityManager.addEntity(bullet);
    }
    calculateRegularJumpSettings() {
        this.gravityY = -(2 * this.maxJumpHeight) / Math.pow(this.timeToJumpApex, 2);
        this.maxJumpVelocity = Math.abs(this.gravityY) * this.timeToJumpApex;
        this.minJumpVelocity = Math.sqrt(2 * Math.abs(this.gravityY) * this.minJumpHeight);
        // console.log('gravity: ' + this._gravity);
        // console.log('maxJumpVelocity: ' + this._maxJumpVelocity);
        // console.log('minJumpVelocity: ' + this._minJumpVelocity);
    }
    createRays() {
        for (let i = 0; i < this.numVerticalRays; i++) {
            this.groundRays.push(new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_2.RayType.not_infinite));
        }
        for (let i = 0; i < this.numVerticalRays; i++) {
            this.ceilRays.push(new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_2.RayType.not_infinite));
        }
        for (let i = 0; i < this.numHorizontalRays; i++) {
            this.leftRays.push(new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_2.RayType.not_infinite));
        }
        for (let i = 0; i < this.numHorizontalRays; i++) {
            this.rightRays.push(new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_2.RayType.not_infinite));
        }
    }
    /**
     * Using the current position moves the rays a frame even though the player may be running into a wall. By using
     * previous position the rays don't move for that frame. They use the previous frame. Think about it, when the player
     * is running into a wall, its 'bounds' should not move.
     */
    castRays() {
        let centerX = this.getPosition().x - 4;
        let centerY = this.getPosition().y - this.hitbox.height * 0.5;
        if (this.wallContact.left || this.wallContact.right) {
            centerX = this.previousPosition.x;
        }
        let width = this.hitbox.width;
        let verticalSpacing = width / (this.numVerticalRays - 1);
        let startX = this.getPosition().x - width * 0.5;
        let endX = this.getPosition().x + width * 0.5;
        for (let i = 0; i < this.groundRays.length; i++) {
            this.groundRays[i].start.x = startX;
            this.groundRays[i].start.y = centerY;
            this.groundRays[i].end.x = startX;
            this.groundRays[i].end.y = centerY + this.hitbox.height * 0.5 + this.skinWidth;
            startX += verticalSpacing;
        }
        startX = this.getPosition().x - width * 0.5;
        for (let i = 0; i < this.ceilRays.length; i++) {
            this.ceilRays[i].start.x = startX;
            this.ceilRays[i].start.y = centerY;
            this.ceilRays[i].end.x = startX;
            this.ceilRays[i].end.y = centerY - this.hitbox.height * 0.5 - this.skinWidth;
            startX += verticalSpacing;
        }
        centerX = this.getPosition().x - 4;
        centerY = this.getPosition().y - this.hitbox.height * 0.5;
        let height = this.height;
        let horizontalSpacing = height / (this.numHorizontalRays - 1);
        let startY = this.getPosition().y - this.height;
        let endY = this.getPosition().y;
        for (let i = 0; i < this.leftRays.length; i++) {
            this.leftRays[i].start.x = centerX;
            this.leftRays[i].start.y = startY;
            this.leftRays[i].end.x = centerX - this.hitbox.width * 0.5 - this.skinWidth;
            this.leftRays[i].end.y = startY;
            startY += horizontalSpacing;
        }
        centerX = this.getPosition().x + 4;
        startY = this.getPosition().y - this.height;
        for (let i = 0; i < this.rightRays.length; i++) {
            this.rightRays[i].start.x = centerX;
            this.rightRays[i].start.y = startY;
            this.rightRays[i].end.x = centerX + this.hitbox.width * 0.5 + this.skinWidth;
            this.rightRays[i].end.y = startY;
            startY += horizontalSpacing;
        }
    }
    showDebugRays() {
        if (!debug_1.Debug.AllowDrawOutlines) {
            return;
        }
        // this.pGraphicsDebug.lineStyle(1, 0);
        // this.groundRays.forEach((ray) => {
        //     this.pGraphicsDebug.moveTo(ray.start.x, ray.start.y);
        //     this.pGraphicsDebug.lineTo(ray.end.x, ray.end.y);
        // });
        // this.ceilRays.forEach((ray) => {
        //     this.pGraphicsDebug.moveTo(ray.start.x, ray.start.y);
        //     this.pGraphicsDebug.lineTo(ray.end.x, ray.end.y);
        // });
        // this.leftRays.forEach((ray) => {
        //     this.pGraphicsDebug.moveTo(ray.start.x, ray.start.y);
        //     this.pGraphicsDebug.lineTo(ray.end.x, ray.end.y);
        // });
        // this.rightRays.forEach((ray) => {
        //     this.pGraphicsDebug.moveTo(ray.start.x, ray.start.y);
        //     this.pGraphicsDebug.lineTo(ray.end.x, ray.end.y);
        // });
    }
}
exports.BigEye = BigEye;
var BigEyeState;
(function (BigEyeState) {
    BigEyeState["decide"] = "decide";
    BigEyeState["jump"] = "jump";
})(BigEyeState || (BigEyeState = {}));
class BigEyeDecideState {
    constructor(actor) {
        this.rand = 0;
        this.direction = 0;
        this.elapsedTime = 0;
        this.endTime = 300;
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
        this.actor.animations.play(BigEyeAnimationNames.idle);
        this.actor.targetSpeed.x = 0;
        this.actor.targetSpeed.y = 0;
        this.actor.isNormalJumping = false;
        this.actor.isHighJumping = false;
        this.rand = Math.random();
    }
    update() {
        if (!this.actor.isOnGround) {
            return;
        }
        this.elapsedTime += main_1.fixedTimeMS;
        if (this.elapsedTime < this.endTime) {
            return;
        }
        this.direction = mathutil_1.MathUtil.sign(helper_1.Helper.directionTo(this.actor, this.actor.myWorld.entityManager.player).x);
        this.actor.setFacingDirection(-this.direction);
        if (this.actor.myWorld.entityManager.player.isJumping) {
            this.doBigJump();
            return;
        }
        if (this.rand > 0.65) {
            this.doBigJump();
        }
        else {
            this.doSmallJump();
        }
    }
    exit() {
        this.initialized = false;
        this.elapsedTime = 0;
    }
    doBigJump() {
        this.actor.targetSpeed.x = this.actor.highJumpSpeed.x * this.direction;
        this.actor.targetSpeed.y = this.actor.highJumpSpeed.y;
        this.actor.isHighJumping = true;
        this.actor.fsm.changeState(BigEyeState.jump);
    }
    doSmallJump() {
        this.actor.targetSpeed.x = this.actor.normalJumpSpeed.x * this.direction;
        this.actor.targetSpeed.y = this.actor.normalJumpSpeed.y;
        this.actor.isNormalJumping = true;
        this.actor.fsm.changeState(BigEyeState.jump);
    }
}
class BigEyeJumpState {
    constructor(actor) {
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
        this.actor.animations.play(BigEyeAnimationNames.jump);
    }
    update() {
        if (this.actor.isOnGround) {
            this.actor.myWorld.game.sound.play(konstants_1.AudioName.big_eye);
            this.actor.fsm.changeState(BigEyeState.decide);
            return;
        }
    }
    exit() {
        this.initialized = false;
    }
}


/***/ }),
/* 49 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Bullet = void 0;
const konstants_1 = __webpack_require__(2);
const entity_1 = __webpack_require__(16);
const helper_1 = __webpack_require__(24);
const mathutil_1 = __webpack_require__(34);
class Bullet extends entity_1.Entity {
    constructor(owner, myWorld, tag, e, game, x, y, key, frame) {
        super(myWorld, tag, e, game, x, y, key, frame);
        this.velocity = new Phaser.Point(0, 0);
        this.horizontalSpeed = 160;
        this.useGravity = false;
        this.gravityY = 500;
        this.targetSpeed = new Phaser.Point(0, 0);
        this.canCollideWithOtherBullet = false;
        this.isReflected = false;
        this.smoothed = false;
        this.owner = owner;
        this.health = 1;
        this.maxHealth = 1;
        this.getPosition().x = x;
        this.getPosition().y = y;
        this.position.x = (this.getPosition().x + 0.5) | 0;
        this.position.y = this.getPosition().y;
        this.anchor.setTo(0.5, 0.5);
    }
    manualUpdate() {
        // this.pGraphicsDebug.clear();
        if (!this.alive) {
            return;
        }
        if (this.useGravity) {
            this.targetSpeed.y += this.gravityY * this.game.time.physicsElapsed;
        }
        this.velocity.x = this.targetSpeed.x;
        this.velocity.y = this.targetSpeed.y;
        this.getPosition().x += this.velocity.x * this.game.time.physicsElapsed;
        this.getPosition().y += this.velocity.y * this.game.time.physicsElapsed;
        this.position.x = (this.getPosition().x + 0.5) | 0;
        this.position.y = this.getPosition().y;
        this.updateRect();
    }
    /**
     * NOTE: The distance check is not particularly great. Some entities have their position as their middle center.
     *         This causes strange behavior when entities have a large hitbox because the position checked will be
     *         its middle center. Intersection may be missed since distance check will show that the bullet is too
     *         far but yet it actually intersects.  Make sure to keep this in mind when creating the hit boxes.
     * @param other {Entity}
     */
    checkCollideWith(other) {
        if (helper_1.Helper.distanceTo(other, this) > 60) {
            return;
        }
        // The bullet cannot hit itself.
        if (other == this) {
            return;
        }
        // The bullet cannot hit other bullets shot by the same owner.
        if (other.tag == konstants_1.TagType.bullet) {
            let bullet = other;
            if (this.owner == bullet.owner) {
                return;
            }
        }
        // Go through spike.
        else if (other.myEntityType == konstants_1.EntityType.spike) {
            return;
        }
        // Go through explosions.
        else if (other.myEntityType == konstants_1.EntityType.explosion_from_killer_bullet) {
            return;
        }
        // Go through power ups.
        if (other.tag == konstants_1.TagType.power_up) {
            return;
        }
        // The bullet cannot hit the owner who shot it.
        if (this.owner == other) {
            return;
        }
        if (!this.canCollideWithOtherBullet) {
            if (other.tag == konstants_1.TagType.bullet) {
                let bullet = other;
                // Player bullet cannot collide with enemy bullet.
                if (this.owner.tag == konstants_1.TagType.player && bullet.owner.tag != konstants_1.TagType.player) {
                    return;
                }
                // Enemy bullet cannot collide with player bullet.
                if (this.owner.tag != konstants_1.TagType.player && bullet.owner.tag == konstants_1.TagType.player) {
                    return;
                }
                // Enemy bullet cannot collide with enemy bullet.
                if (this.tag == konstants_1.TagType.bullet) {
                    return;
                }
            }
        }
        // Enemy bullet cannot collide (hurt/kill) with other enemies.
        if (this.owner.tag == konstants_1.TagType.enemy) {
            if (other.tag == konstants_1.TagType.enemy) {
                return;
            }
        }
        // Enemy bullet cannot collide with platforms (vanishing_block, drop_lift, foot_holder)
        if (other.tag == konstants_1.TagType.platform) {
            return;
        }
        // ***************************************************
        // In the future bullets will be allowed to hit other bullets since they don't share the same owner.
        // A boolean will keep track of this.
        // this.graphicsDebug.drawRect(this.getPosition().x + this.hitbox.x - this.hitbox.width * 0.5, this.getPosition().y - this.hitbox.height + this.hitbox.y, this.hitbox.width, this.hitbox.height);
        if (!Phaser.Rectangle.intersects(this.hitbox, other.hitbox)) {
            return;
        }
        if (this.applyEffect(other)) {
            return;
        }
        // This bullets hits enemy 'met'. Reflect this bullet if met is shielded.
        // if (other.myEntityType == EntityType.met) {
        //     let met: Met = <Met>other;
        //     if (met.isShielded) {
        //         this.isReflected = true;
        //         this.reflect();
        //         return;
        //     }
        // }
        if (other.myEntityType == konstants_1.EntityType.spine) {
            if (this.myEntityType == konstants_1.EntityType.bullet_lemon) {
                other.paralyze();
                this.takeDamage(1);
                return;
            }
        }
        if (other.myEntityType == konstants_1.EntityType.cut_man) {
            if (this.myEntityType == konstants_1.EntityType.bullet_lemon) {
                if (other.isInvincible) {
                    return;
                }
            }
        }
        other.takeDamage(this.contactDamage, helper_1.Helper.directionTo(this, other));
        this.takeDamage(1);
    }
    takeDamage(damage) {
        if (this.health <= 0) {
            return;
        }
        this.health -= damage;
        if (this.health == 0) {
            this.destroyed.dispatch();
            this.kill();
        }
    }
    reflect() {
        let x = this.targetSpeed.x > 0 ? 135 : 45;
        this.targetSpeed.x = 200 * Math.cos(mathutil_1.MathUtil.sign(this.horizontalSpeed) * x * (Math.PI / 180));
        this.targetSpeed.y = 200 * Math.sin(mathutil_1.MathUtil.sign(this.horizontalSpeed) * -45 * (Math.PI / 180));
    }
    applyEffect(other) {
        if (other.tag != konstants_1.TagType.enemy) {
            return false;
        }
        switch (this.myEntityType) {
            case konstants_1.EntityType.bullet_lemon:
                break;
            case konstants_1.EntityType.ice_man_bullet:
                other.frozen.freeze();
                return true;
        }
        return false;
    }
}
exports.Bullet = Bullet;


/***/ }),
/* 50 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Flea = void 0;
const enemy_1 = __webpack_require__(31);
const konstants_1 = __webpack_require__(2);
const mathutil_1 = __webpack_require__(34);
const stateMachine_1 = __webpack_require__(33);
const vector2_1 = __webpack_require__(20);
const ray_1 = __webpack_require__(19);
const ray_2 = __webpack_require__(19);
const sat2d_1 = __webpack_require__(17);
const main_1 = __webpack_require__(0);
var FleaAnimationNames;
(function (FleaAnimationNames) {
    FleaAnimationNames["idle"] = "idle";
    FleaAnimationNames["pre_shoot"] = "pre_shoot";
    FleaAnimationNames["jump"] = "jump";
})(FleaAnimationNames || (FleaAnimationNames = {}));
class Flea extends enemy_1.Enemy {
    constructor(myWorld, tag, e, game, x, y, key, frame) {
        super(myWorld, tag, e, game, x, y, key, frame);
        this.horizontalSpeed = 50;
        this.targetSpeed = new Phaser.Point(0, 0);
        this.isOnGround = true;
        this.useGravity = true;
        this.isJumping = true;
        this.isFalling = true;
        this.minJumpHeight = 1;
        this.maxJumpHeight = 44;
        this.timeToJumpApex = 0.35;
        this.gravityX = 0;
        this.gravityY = 0;
        this.maxJumpVelocity = 0;
        this.minJumpVelocity = 0;
        this.groundRays = new Array();
        this.ceilRays = new Array();
        this.leftRays = new Array();
        this.rightRays = new Array();
        this.skinWidth = 5;
        this.tempRay_1 = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_2.RayType.not_infinite);
        this.tempRay_2 = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_2.RayType.not_infinite);
        this.fsm = new stateMachine_1.StateMachine();
        this.fsm.addState(FleaState.idle, new FleaIdleState(this));
        this.fsm.addState(FleaState.jump, new FleaJumpState(this));
        this.fsm.changeState(FleaState.idle);
        this.getPosition().x = x;
        this.getPosition().y = y;
        this.position.x = (this.getPosition().x + 0.5) | 0;
        this.position.y = this.getPosition().y;
        this.smoothed = false;
        this.anchor.setTo(0.5, 0.5);
        this.health = 1;
        this.maxHealth = 1;
        this.isShielded = false;
        this.animations.add(FleaAnimationNames.idle, ['flea_01'], 10, false, false);
        this.animations.add(FleaAnimationNames.jump, ['flea_02'], 10, false, false);
        this.animations.play(FleaAnimationNames.idle);
        this.hitbox = new Phaser.Rectangle(this.getPosition().x, this.getPosition().y, 16, 16);
        this.hitboxOffset.x = -this.hitbox.halfWidth;
        this.hitboxOffset.y = -this.hitbox.halfHeight;
        this.updateRect();
        this.midGroundCheck = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_2.RayType.not_infinite);
        this.leftGroundCheck = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_2.RayType.not_infinite);
        this.rightGroundCheck = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_2.RayType.not_infinite);
        this.midCeilCheck = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_2.RayType.not_infinite);
        this.leftCeilCheck = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_2.RayType.not_infinite);
        this.rightCeilCheck = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_2.RayType.not_infinite);
        this.leftCheck1 = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_2.RayType.not_infinite);
        this.leftCheck2 = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_2.RayType.not_infinite);
        this.rightCheck1 = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_2.RayType.not_infinite);
        this.rightCheck2 = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_2.RayType.not_infinite);
        this.groundRays.push(this.midGroundCheck);
        this.groundRays.push(this.leftGroundCheck);
        this.groundRays.push(this.rightGroundCheck);
        this.ceilRays.push(this.midCeilCheck);
        this.ceilRays.push(this.leftCeilCheck);
        this.ceilRays.push(this.rightCeilCheck);
        this.leftRays.push(this.leftCheck1);
        this.leftRays.push(this.leftCheck2);
        this.rightRays.push(this.rightCheck1);
        this.rightRays.push(this.rightCheck2);
        this.wallContact = { left: false, right: false, up: false, down: false };
        this.calculateRegularJumpSettings();
    }
    manualUpdate() {
        // this.pGraphicsDebug.clear();
        if (!this.alive) {
            return;
        }
        this.frozen.update();
        if (this.frozen.isFrozen) {
            return;
        }
        this.fsm.currentState.update();
        if (this.useGravity) {
            this.targetSpeed.x += Math.abs(this.gravityX) * main_1.fixedTime;
            this.targetSpeed.y += Math.abs(this.gravityY) * main_1.fixedTime;
        }
        this.velocity.x = this.targetSpeed.x;
        this.velocity.y = this.targetSpeed.y;
        if (this.isOnGround) {
            this.targetSpeed.x *= 0.75;
        }
        this.getPosition().x += this.velocity.x * main_1.fixedTime;
        this.getPosition().y += this.velocity.y * main_1.fixedTime;
        this.position.x = (this.getPosition().x + 0.5) | 0;
        this.position.y = this.getPosition().y;
        this.updateRect();
        this.castRays();
    }
    checkSurfaceCollisions(surfaces) {
        this.wallContact.left = false;
        this.wallContact.right = false;
        this.wallContact.up = false;
        this.wallContact.down = false;
        this.isOnGround = false;
        this.tempInto = null;
        for (let j = 0; j < surfaces.length; j++) {
            let surface = surfaces[j];
            if (!surface.collidable) {
                continue;
            }
            let nx = surface.dir.y;
            let ny = -surface.dir.x;
            // Check floors
            if (ny == -1 && this.getVelocity().y > 0) {
                for (let k = 0; k < this.groundRays.length; k++) {
                    this.tempRay_1 = this.groundRays[k];
                    this.tempRay_2.start = new vector2_1.Vector2(surface.p1.x, surface.p1.y);
                    this.tempRay_2.end = new vector2_1.Vector2(surface.p2.x, surface.p2.y);
                    this.tempRay_2.recalculateDir();
                    this.tempInto = sat2d_1.SAT2D.testRayVsRay(this.tempRay_1, this.tempRay_2, this.tempInto);
                    if (this.tempInto != null) {
                        let dx = this.tempInto.ray1.end.x - this.tempInto.ray1.start.x;
                        let dy = this.tempInto.ray1.end.y - this.tempInto.ray1.start.y;
                        let distance = Math.sqrt(dx * dx + dy * dy);
                        let trueDistance = distance * this.tempInto.u1;
                        let contactX = this.tempInto.ray1.start.x + this.tempInto.ray1.dir.x * this.tempInto.u1;
                        let contactY = this.tempInto.ray1.start.y + trueDistance;
                        // this.pGraphicsDebug.drawCircle(contactX, contactY, 3);
                        if (trueDistance > this.hitbox.halfHeight) {
                            continue;
                        }
                        this.getPosition().y = contactY - this.hitbox.halfHeight;
                        this.setVelocity(this.getVelocity().x, 0);
                        this.targetSpeed.y = 0;
                        this.isOnGround = true;
                        this.isJumping = false;
                        this.isFalling = false;
                        this.wallContact.down = true;
                        continue;
                    }
                }
            }
            // Check ceilings
            if (ny == 1 && this.getVelocity().y < 0) {
                for (let k = 0; k < this.ceilRays.length; k++) {
                    this.tempRay_1 = this.ceilRays[k];
                    this.tempRay_2.start = new vector2_1.Vector2(surface.p1.x, surface.p1.y);
                    this.tempRay_2.end = new vector2_1.Vector2(surface.p2.x, surface.p2.y);
                    this.tempRay_2.recalculateDir();
                    this.tempInto = sat2d_1.SAT2D.testRayVsRay(this.tempRay_1, this.tempRay_2, this.tempInto);
                    if (this.tempInto != null) {
                        let dx = this.tempInto.ray1.end.x - this.tempInto.ray1.start.x;
                        let dy = this.tempInto.ray1.end.y - this.tempInto.ray1.start.y;
                        let distance = Math.sqrt(dx * dx + dy * dy);
                        let trueDistance = distance * this.tempInto.u1;
                        let contactX = this.tempInto.ray1.start.x + this.tempInto.ray1.dir.x * this.tempInto.u1;
                        let contactY = this.tempInto.ray1.start.y - trueDistance;
                        // this.pGraphicsDebug.drawCircle(contactX, contactY, 3);
                        if (trueDistance > this.hitbox.halfHeight) {
                            continue;
                        }
                        this.getPosition().y = contactY + this.hitbox.halfHeight;
                        this.setVelocity(this.getVelocity().x, 0);
                        this.targetSpeed.y = 0;
                        this.isFalling = true;
                        this.wallContact.up = true;
                        continue;
                    }
                }
            }
            // Check right walls
            if (nx == -1 && this.getVelocity().x > 0) {
                for (let k = 0; k < this.rightRays.length; k++) {
                    this.tempRay_1 = this.rightRays[k];
                    this.tempRay_2.start = new vector2_1.Vector2(surface.p1.x, surface.p1.y);
                    this.tempRay_2.end = new vector2_1.Vector2(surface.p2.x, surface.p2.y);
                    this.tempRay_2.recalculateDir();
                    this.tempInto = sat2d_1.SAT2D.testRayVsRay(this.tempRay_1, this.tempRay_2, this.tempInto);
                    if (this.tempInto != null) {
                        let dx = this.tempInto.ray1.end.x - this.tempInto.ray1.start.x;
                        let dy = this.tempInto.ray1.end.y - this.tempInto.ray1.start.y;
                        let distance = Math.sqrt(dx * dx + dy * dy);
                        let trueDistance = distance * this.tempInto.u1;
                        let contactX = this.tempInto.ray1.start.x + trueDistance;
                        let contactY = this.tempInto.ray1.start.y;
                        // this.pGraphicsDebug.lineStyle(1, 0);
                        // this.pGraphicsDebug.beginFill(0xff0000, 0.5);
                        // this.pGraphicsDebug.drawCircle(contactX, contactY, 5);
                        if (trueDistance > this.hitbox.halfWidth) {
                            continue;
                        }
                        this.getPosition().x = contactX - this.hitbox.halfWidth;
                        this.wallContact.right = true;
                        continue;
                    }
                }
            }
            // Check left walls
            if (nx == 1 && this.getVelocity().x < 0) {
                for (let k = 0; k < this.leftRays.length; k++) {
                    this.tempRay_1 = this.leftRays[k];
                    this.tempRay_2.start = new vector2_1.Vector2(surface.p1.x, surface.p1.y);
                    this.tempRay_2.end = new vector2_1.Vector2(surface.p2.x, surface.p2.y);
                    this.tempRay_2.recalculateDir();
                    this.tempInto = sat2d_1.SAT2D.testRayVsRay(this.tempRay_1, this.tempRay_2, this.tempInto);
                    if (this.tempInto != null) {
                        let dx = this.tempInto.ray1.end.x - this.tempInto.ray1.start.x;
                        let dy = this.tempInto.ray1.end.y - this.tempInto.ray1.start.y;
                        let distance = Math.sqrt(dx * dx + dy * dy);
                        let trueDistance = distance * this.tempInto.u1;
                        let contactX = this.tempInto.ray1.start.x - trueDistance;
                        let contactY = this.tempInto.ray1.start.y;
                        // this.pGraphicsDebug.lineStyle(1, 0);
                        // this.pGraphicsDebug.beginFill(0xff0000, 0.5);
                        // this.pGraphicsDebug.drawCircle(contactX, contactY, 5);
                        if (trueDistance > this.hitbox.halfWidth) {
                            continue;
                        }
                        this.getPosition().x = contactX + this.hitbox.halfWidth;
                        this.wallContact.left = true;
                        continue;
                    }
                }
            }
        }
    }
    takeDamage(damage) {
        if (this.isShielded) {
            this.game.sound.play(konstants_1.AudioName.dink);
            return;
        }
        if (this.health <= 0) {
            return;
        }
        this.game.sound.play(konstants_1.AudioName.enemy_damage);
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            this.myWorld.dropManager.dropPowerUp(this.getPosition().x - this.hitbox.halfWidth, this.getPosition().y);
            this.myWorld.createExplosionEffect(this.getPosition().x, this.getPosition().y - this.hitbox.halfHeight);
            this.kill();
        }
    }
    calculateRegularJumpSettings() {
        this.gravityY = -(2 * this.maxJumpHeight) / Math.pow(this.timeToJumpApex, 2);
        this.maxJumpVelocity = Math.abs(this.gravityY) * this.timeToJumpApex;
        this.minJumpVelocity = Math.sqrt(2 * Math.abs(this.gravityY) * this.minJumpHeight);
        // console.log('gravity: ' + this._gravity);
        // console.log('maxJumpVelocity: ' + this._maxJumpVelocity);
        // console.log('minJumpVelocity: ' + this._minJumpVelocity);
    }
    /**
     * Using the current position moves the rays a frame even though the player may be running into a wall. By using
     * previous position the rays don't move for that frame. They use the previous frame. Think about it, when the player
     * is running into a wall, its 'bounds' should not move.
     */
    castRays() {
        let centerX = this.getPosition().x;
        let centerY = this.getPosition().y;
        if (this.wallContact.left || this.wallContact.right) {
            centerX = this.previousPosition.x;
        }
        // cast ground rays
        this.midGroundCheck.start = new vector2_1.Vector2(centerX, centerY);
        this.midGroundCheck.end = new vector2_1.Vector2(centerX, centerY + this.hitbox.height);
        this.leftGroundCheck.start = new vector2_1.Vector2(centerX - this.hitbox.halfWidth, centerY);
        this.leftGroundCheck.end = new vector2_1.Vector2(centerX - this.hitbox.halfWidth, centerY + this.hitbox.height);
        this.rightGroundCheck.start = new vector2_1.Vector2(centerX + this.hitbox.halfWidth, centerY);
        this.rightGroundCheck.end = new vector2_1.Vector2(centerX + this.hitbox.halfWidth, centerY + this.hitbox.height);
        // cast ceil rays
        this.midCeilCheck.start = new vector2_1.Vector2(centerX, centerY);
        this.midCeilCheck.end = new vector2_1.Vector2(centerX, centerY - this.hitbox.height);
        this.leftCeilCheck.start = new vector2_1.Vector2(centerX - this.hitbox.halfWidth, centerY);
        this.leftCeilCheck.end = new vector2_1.Vector2(centerX - this.hitbox.halfWidth, centerY - this.hitbox.height);
        this.rightCeilCheck.start = new vector2_1.Vector2(centerX + this.hitbox.halfWidth, centerY);
        this.rightCeilCheck.end = new vector2_1.Vector2(centerX + this.hitbox.halfWidth, centerY - this.hitbox.height);
        // cast left rays
        this.leftCheck1.start = new vector2_1.Vector2(centerX, centerY - this.hitbox.halfHeight);
        this.leftCheck1.end = new vector2_1.Vector2(centerX - this.hitbox.width, centerY);
        this.leftCheck2.start = new vector2_1.Vector2(centerX, centerY + this.hitbox.halfHeight);
        this.leftCheck2.end = new vector2_1.Vector2(centerX - this.hitbox.width, centerY);
        // // cast right rays
        this.rightCheck1.start = new vector2_1.Vector2(centerX, centerY - this.hitbox.halfHeight);
        this.rightCheck1.end = new vector2_1.Vector2(centerX + this.hitbox.width, centerY);
        this.rightCheck2.start = new vector2_1.Vector2(centerX, centerY + this.hitbox.halfHeight);
        this.rightCheck2.end = new vector2_1.Vector2(centerX + this.hitbox.width, centerY);
    }
}
exports.Flea = Flea;
var FleaState;
(function (FleaState) {
    FleaState["idle"] = "idle";
    FleaState["jump"] = "jump";
})(FleaState || (FleaState = {}));
class FleaIdleState {
    constructor(actor) {
        this.name = FleaState.idle;
        this.waitElapsedTime = 0;
        this.waitEndTime = 500;
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
        this.actor.animations.play(FleaAnimationNames.idle);
    }
    update() {
        this.waitElapsedTime += main_1.fixedTimeMS;
        if (this.waitElapsedTime >= this.waitEndTime) {
            this.actor.fsm.changeState(FleaState.jump);
            return;
        }
    }
    exit() {
        this.initialized = false;
        this.waitElapsedTime = 0;
    }
}
class FleaJumpState {
    constructor(actor) {
        this.name = FleaState.jump;
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
        this.actor.animations.play(FleaAnimationNames.jump);
        this.actor.setFacingDirection(-1);
        this.actor.isOnGround = false;
        let dirToPlayer = -mathutil_1.MathUtil.sign(this.actor.getPosition().x - this.actor.myWorld.entityManager.player.getPosition().x);
        let random = Math.random();
        if (random > 0.5) { // low arc, long distance
            this.actor.targetSpeed.x = Math.cos(45 * (Math.PI / 180)) * 200 * dirToPlayer;
            this.actor.targetSpeed.y = Math.sin(45 * (Math.PI / 180)) * 300 * -1;
        }
        else { // high arc, short distance
            this.actor.targetSpeed.x = Math.cos(80 * (Math.PI / 180)) * 290 * dirToPlayer;
            this.actor.targetSpeed.y = Math.sin(80 * (Math.PI / 180)) * 290 * -1;
        }
    }
    update() {
        if (this.actor.isOnGround) {
            this.actor.targetSpeed.x = 0;
            this.actor.targetSpeed.y = 0;
            this.actor.setFacingDirection(1);
            this.actor.fsm.changeState(FleaState.idle);
            return;
        }
    }
    exit() {
        this.initialized = false;
    }
}


/***/ }),
/* 51 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FlyingShell = void 0;
const enemy_1 = __webpack_require__(31);
const konstants_1 = __webpack_require__(2);
const stateMachine_1 = __webpack_require__(33);
const main_1 = __webpack_require__(0);
var FlyingShellAnimations;
(function (FlyingShellAnimations) {
    FlyingShellAnimations["move"] = "move";
    FlyingShellAnimations["shoot"] = "shoot";
})(FlyingShellAnimations || (FlyingShellAnimations = {}));
class FlyingShell extends enemy_1.Enemy {
    constructor(myWorld, tag, e, game, x, y, key, frame) {
        super(myWorld, tag, e, game, x, y, key, frame);
        this.horizontalSpeed = 50;
        this.targetSpeed = new Phaser.Point(0, 0);
        this.prevTargetSpeed = new Phaser.Point(0, 0);
        this.getPosition().x = x;
        this.getPosition().y = y;
        this.position.x = (this.getPosition().x + 0.5) | 0;
        this.position.y = this.getPosition().y;
        this.anchor.setTo(0.5, 0.5);
        this.smoothed = false;
        this.setFacingDirection(1);
        this.health = 1;
        this.maxHealth = 1;
        this.isShielded = false;
        this.animations.add(FlyingShellAnimations.move, ['flying_shell_01'], 10, false, false);
        this.animations.add(FlyingShellAnimations.shoot, ['flying_shell_01', 'flying_shell_02'], 10, false, false);
        this.animations.play(FlyingShellAnimations.move);
        this.fsm = new stateMachine_1.StateMachine();
        this.fsm.addState(FlyingShellState.move, new FlyingShellMoveState(this));
        this.fsm.addState(FlyingShellState.shoot, new FlyingShellShootState(this));
        this.fsm.changeState(FlyingShellState.move);
        this.hitbox = new Phaser.Rectangle(this.getPosition().x, this.getPosition().y, 16, 16);
        this.hitboxOffset.x = -this.hitbox.halfWidth - 1;
        this.hitboxOffset.y = -this.hitbox.halfHeight + 2;
        this.updateRect();
    }
    manualUpdate() {
        // this.pGraphicsDebug.clear();
        if (!this.alive) {
            return;
        }
        this.frozen.update();
        if (this.frozen.isFrozen) {
            return;
        }
        this.fsm.currentState.update();
        this.velocity.x = this.targetSpeed.x;
        this.velocity.y = this.targetSpeed.y;
        this.getPosition().x += this.velocity.x * main_1.fixedTime;
        this.getPosition().y += this.velocity.y * main_1.fixedTime;
        this.position.x = (this.getPosition().x + 0.5) | 0;
        this.position.y = this.getPosition().y;
        this.updateRect();
    }
    takeDamage(damage) {
        if (this.isShielded) {
            this.game.sound.play(konstants_1.AudioName.dink);
            return;
        }
        if (this.health <= 0) {
            return;
        }
        this.game.sound.play(konstants_1.AudioName.enemy_damage);
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            this.myWorld.dropManager.dropPowerUp(this.getPosition().x, this.getPosition().y);
            this.myWorld.createExplosionEffect(this.getPosition().x, this.getPosition().y - this.hitbox.halfHeight);
            this.kill();
        }
    }
    shoot(angle) {
        let bullet = this.myWorld.entityManager.createBitmapBullet(this, this.position.x, this.position.y - 4, 6, 6, konstants_1.EntityType.bullet, konstants_1.EntityType.screw_bomber_bullet);
        bullet.horizontalSpeed = 160;
        let cos = Math.cos(angle * (Math.PI / 180));
        let sin = Math.sin(angle * (Math.PI / 180));
        bullet.targetSpeed.x = bullet.horizontalSpeed * cos * -this.getFacingDirection();
        bullet.targetSpeed.y = bullet.horizontalSpeed * sin * -this.getFacingDirection();
    }
}
exports.FlyingShell = FlyingShell;
var FlyingShellState;
(function (FlyingShellState) {
    FlyingShellState["move"] = "move";
    FlyingShellState["shoot"] = "shoot";
})(FlyingShellState || (FlyingShellState = {}));
class FlyingShellMoveState {
    constructor(actor) {
        this.name = FlyingShellState.move;
        this.elapsedTime = 0;
        this.endTime = 1000;
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
        this.actor.animations.play(FlyingShellAnimations.move);
        this.actor.targetSpeed.x = -this.actor.horizontalSpeed;
        this.actor.isShielded = true;
    }
    update() {
        this.elapsedTime += main_1.fixedTimeMS;
        if (this.elapsedTime >= this.endTime) {
            this.actor.fsm.changeState(FlyingShellState.shoot);
            return;
        }
    }
    exit() {
        this.initialized = false;
        this.elapsedTime = 0;
    }
}
class FlyingShellShootState {
    constructor(actor) {
        this.name = FlyingShellState.shoot;
        this.elapsedTime = 0;
        this.endTime = 500;
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
        this.actor.animations.play(FlyingShellAnimations.shoot);
        this.actor.targetSpeed.x = 0;
        this.actor.shoot(-180);
        this.actor.shoot(-135);
        this.actor.shoot(-90);
        this.actor.shoot(-45);
        this.actor.shoot(-0);
        this.actor.shoot(45);
        this.actor.shoot(90);
        this.actor.shoot(135);
        this.actor.shoot(180);
        this.actor.game.sound.play(konstants_1.AudioName.enemy_shoot);
        this.actor.isShielded = false;
    }
    update() {
        this.elapsedTime += main_1.fixedTimeMS;
        if (this.elapsedTime >= this.endTime) {
            this.actor.fsm.changeState(FlyingShellState.move);
            return;
        }
    }
    exit() {
        this.initialized = false;
        this.elapsedTime = 0;
    }
}


/***/ }),
/* 52 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Spike = void 0;
const entity_1 = __webpack_require__(16);
class Spike extends entity_1.Entity {
    constructor(world, tag, e, game, x, y, key, frame) {
        super(world, tag, e, game, x, y, key, frame);
        this.getPosition().x = x;
        this.getPosition().y = y;
        this.anchor.setTo(0.5, 1);
        this.hitbox = new Phaser.Polygon(new Phaser.Point(), new Phaser.Point(), new Phaser.Point());
        this.updateRect();
        // this.pGraphicsDebug = this.game.add.graphics();
        // this.game.add.existing(this.pGraphicsDebug);
    }
    manualUpdate() {
        // this.pGraphicsDebug.clear();
    }
    updateRect() {
        this.hitbox.points[0].x = this.getPosition().x - 6;
        this.hitbox.points[0].y = this.getPosition().y;
        this.hitbox.points[1].x = this.getPosition().x + 6;
        this.hitbox.points[1].y = this.getPosition().y;
        this.hitbox.points[2].x = this.getPosition().x;
        this.hitbox.points[2].y = this.getPosition().y - 16;
    }
    drawHitBox() {
        let temp = this.hitbox;
        let point = temp.points[0];
        // this.pGraphicsDebug.lineStyle(1);
        // this.pGraphicsDebug.beginFill(0x00ff00, 0.5);
        // this.pGraphicsDebug.moveTo(point.x, point.y);
        // this.pGraphicsDebug.lineTo((<Phaser.Point>temp.points[1]).x, (<Phaser.Point>temp.points[1]).y);
        // this.pGraphicsDebug.lineTo((<Phaser.Point>temp.points[2]).x, (<Phaser.Point>temp.points[2]).y);
        // this.pGraphicsDebug.lineTo((<Phaser.Point>temp.points[0]).x, (<Phaser.Point>temp.points[0]).y);
    }
    toggleVisibility() {
    }
}
exports.Spike = Spike;


/***/ }),
/* 53 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CutMan = exports.CutManAnimations = void 0;
const konstants_1 = __webpack_require__(2);
const helper_1 = __webpack_require__(24);
const mathutil_1 = __webpack_require__(34);
const stateMachine_1 = __webpack_require__(33);
const meter_1 = __webpack_require__(25);
const ray_1 = __webpack_require__(19);
const vector2_1 = __webpack_require__(20);
const boss_1 = __webpack_require__(54);
const cutManBullet_1 = __webpack_require__(55);
const boomerangBulletMovement_1 = __webpack_require__(56);
var CutManAnimations;
(function (CutManAnimations) {
    CutManAnimations["idle"] = "idle";
    CutManAnimations["throw_cutter"] = "throw_cutter";
    CutManAnimations["taunt_with_cutter"] = "taunt_with_cutter";
    CutManAnimations["taunt_without_cutter"] = "taunt_without_cutter";
    CutManAnimations["taunt_long"] = "taunt_long";
    CutManAnimations["run_with_cutter"] = "run_with_cutter";
    CutManAnimations["run_without_cutter"] = "run_without_cutter";
    CutManAnimations["hurt_with_cutter"] = "hurt_with_cutter";
    CutManAnimations["hurt_without_cutter"] = "hurt_without_cutter";
    CutManAnimations["jump_with_cutter"] = "jump_with_cutter";
    CutManAnimations["jump_without_cutter"] = "jump_without_cutter";
})(CutManAnimations = exports.CutManAnimations || (exports.CutManAnimations = {}));
class CutMan extends boss_1.Boss {
    constructor(myWorld, tag, e, game, x, y, key, frame) {
        super(myWorld, tag, e, game, x, y, key, frame);
        this.hasThrownCutter = false;
        this.bullet = null;
        this.fsm = new stateMachine_1.StateMachine();
        this.fsm.addState(CutManState.idle, new CutManIdleState(this));
        this.fsm.addState(CutManState.throw_cutter, new CutManThrowCutterState(this));
        this.fsm.addState(CutManState.jump_to_player, new CutManJumpToPlayerState(this));
        this.fsm.addState(CutManState.move_to_player, new CutManMoveToPlayerState(this));
        this.fsm.addState(CutManState.hurt, new CutManHurtState(this));
        this.fsm.addState(CutManState.taunt, new CutManTauntState(this));
        this.fsm.changeState(CutManState.idle);
        this.animations.add(CutManAnimations.idle, ['taunt_with_cutter_01'], 10, false, false);
        this.animations.add(CutManAnimations.throw_cutter, ['throw_01', 'throw_02'], 10, false, false);
        this.animations.add(CutManAnimations.taunt_with_cutter, ['taunt_with_cutter_01', 'taunt_with_cutter_02'], 10, true, false);
        this.animations.add(CutManAnimations.taunt_without_cutter, ['taunt_without_cutter_01', 'taunt_without_cutter_02'], 10, true, false);
        this.animations.add(CutManAnimations.taunt_long, ['taunt_with_cutter_01', 'taunt_with_cutter_02', 'taunt_with_cutter_01', 'taunt_with_cutter_02', 'taunt_with_cutter_01', 'taunt_with_cutter_02', 'taunt_with_cutter_01', 'taunt_with_cutter_02', 'taunt_with_cutter_01', 'taunt_with_cutter_02'], 5, false, false);
        this.animations.add(CutManAnimations.run_without_cutter, ['run_without_cutter_01', 'run_without_cutter_02', 'run_without_cutter_03', 'run_without_cutter_04'], 10, false, false);
        this.animations.add(CutManAnimations.run_with_cutter, ['run_with_cutter_01', 'run_with_cutter_02', 'run_with_cutter_03', 'run_with_cutter_04'], 10, false, false);
        this.animations.add(CutManAnimations.jump_with_cutter, ['jump_with_cutter'], 10, false, false);
        this.animations.add(CutManAnimations.jump_without_cutter, ['jump_without_cutter'], 10, false, false);
        this.hitbox = new Phaser.Rectangle(this.getPosition().x, this.getPosition().y, 16, 20);
        this.hitboxOffset.x = -8;
        this.hitboxOffset.y = -20;
        this.updateRect();
        this.healthMeter = new meter_1.Meter(this.game, 40, 15);
        this.healthMeter.setEnergy(0);
        this.health = this.healthMeter.totalEnergy;
        this.maxHealth = this.healthMeter.totalEnergy;
        this.position.x = (this.getPosition().x + 0.5) | 0;
        this.position.y = this.getPosition().y;
        this.leftGroundCheck = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_1.RayType.not_infinite);
        this.rightGroundCheck = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_1.RayType.not_infinite);
        this.leftCeilCheck = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_1.RayType.not_infinite);
        this.rightCeilCheck = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_1.RayType.not_infinite);
        this.leftCheck1 = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_1.RayType.not_infinite);
        this.leftCheck2 = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_1.RayType.not_infinite);
        this.rightCheck1 = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_1.RayType.not_infinite);
        this.rightCheck2 = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_1.RayType.not_infinite);
        this.groundRays.push(this.leftGroundCheck);
        this.groundRays.push(this.rightGroundCheck);
        this.ceilRays.push(this.leftCeilCheck);
        this.ceilRays.push(this.rightCeilCheck);
        this.leftRays.push(this.leftCheck1);
        this.leftRays.push(this.leftCheck2);
        this.rightRays.push(this.rightCheck1);
        this.rightRays.push(this.rightCheck2);
        this.wallContact = { left: false, right: false, up: false, down: false };
        this.calculateRegularJumpSettings();
        this.whiteEffect = this.game.add.sprite(0, 0, konstants_1.Konstants.mega_man, 'white_effect.png');
        this.whiteEffect.alpha = 0.5;
        this.whiteEffect.visible = false;
        this.addChild(this.whiteEffect);
        this.weights.Add(CutManState.throw_cutter, 10);
        this.weights.Add(CutManState.jump_to_player, 7);
        this.weights.Add(CutManState.move_to_player, 10);
        this.weights.Add(CutManState.taunt, 10);
        this.weights.Keys().forEach(element => {
            this.sumOfWeights += this.weights.Item(element);
        });
    }
    show() {
        this.visible = true;
        this.animations.play(CutManAnimations.taunt_long);
    }
    performTaunt() {
        this.animations.play(CutManAnimations.taunt_long);
    }
    shoot() {
        this.hasThrownCutter = true;
        let xPos = this.getPosition().x + this.getFacingDirection();
        let yPos = this.getPosition().y - 10;
        this.bullet = new cutManBullet_1.CutManBullet(this, this.player.myWorld, konstants_1.TagType.bullet, konstants_1.EntityType.bullet_cut_man, this.player.game, xPos, yPos, konstants_1.Konstants.rolling_cutter, '');
        this.bullet.bulletMovement = new boomerangBulletMovement_1.BoomerangBulletMovement(this, new Phaser.Point(xPos, yPos), new Phaser.Point(this.player.getPosition().x, this.player.getPosition().y - 10), 120);
        this.bullet.bulletMovement.destroyed.addOnce(() => {
            this.hasThrownCutter = false;
            this.bullet.destroyed.dispatch();
            this.bullet.kill();
        }, this);
        this.player.game.add.existing(this.bullet);
        this.player.myWorld.entityManager.addEntity(this.bullet);
        this.player.game.sound.play(konstants_1.AudioName.rolling_cutter);
        return true;
    }
    takeDamage(damage, damageDir = new Phaser.Point(0, 0)) {
        if (this.isShielded) {
            this.game.sound.play(konstants_1.AudioName.dink);
            return;
        }
        if (this.health <= 0) {
            return;
        }
        if (this.isInvincible) {
            return;
        }
        this.healthMeter.takeEnergy(damage);
        this.health -= damage;
        this.targetSpeed.x = 30 * damageDir.x;
        this.targetSpeed.y = 0;
        if (this.health <= 0) {
            this.game.sound.play(konstants_1.AudioName.explosion);
            let speed = 24;
            this.addDeathEffect(0, -speed); // top
            this.addDeathEffect(speed, 0); // right
            this.addDeathEffect(0, speed); // bottom
            this.addDeathEffect(-speed, 0); // left
            speed = 40;
            this.addDeathEffect(0, -speed); // top
            this.addDeathEffect(Math.cos(45 * (Math.PI / 180)) * speed, Math.sin(-45 * (Math.PI / 180)) * speed); // top-right
            this.addDeathEffect(speed, 0); // right
            this.addDeathEffect(Math.cos(45 * (Math.PI / 180)) * speed, Math.sin(45 * (Math.PI / 180)) * speed); // bottom-right
            this.addDeathEffect(0, speed); // bottom
            this.addDeathEffect(Math.cos(135 * (Math.PI / 180)) * speed, Math.sin(45 * (Math.PI / 180)) * speed); // bottom-left
            this.addDeathEffect(-speed, 0); // left
            this.addDeathEffect(Math.cos(135 * (Math.PI / 180)) * speed, Math.sin(-45 * (Math.PI / 180)) * speed); // top-left
            this.health = 0;
            this.myWorld.dropManager.dropBossItem(konstants_1.EntityType.cut_man_boss_item, this.bossData.bossItemSpawnPosition.x * 16, this.bossData.bossItemSpawnPosition.y * 16);
            this.myWorld.createExplosionEffect(this.getPosition().x, this.getPosition().y - this.hitbox.halfHeight);
            this.destroyed.dispatch(this);
            this.kill();
        }
        else {
            this.game.sound.play(konstants_1.AudioName.enemy_damage);
            this.isHurt = true;
            this.isInvincible = true;
            this.isBlinking = true;
            this.myWorld.createHurtDust(this.getPosition().x - 2, this.getPosition().y - 40);
            this.myWorld.createHurtDust(this.getPosition().x - 12, this.getPosition().y - 36);
            this.myWorld.createHurtDust(this.getPosition().x + 8, this.getPosition().y - 36);
            this.whiteEffect.visible = true;
            this.whiteEffect.position.x = -12;
            this.whiteEffect.position.y = -24;
            this.fsm.changeState(CutManState.hurt);
        }
    }
}
exports.CutMan = CutMan;
var CutManState;
(function (CutManState) {
    CutManState["idle"] = "idle";
    CutManState["throw_cutter"] = "active";
    CutManState["jump_to_player"] = "jump_to_player";
    CutManState["move_to_player"] = "move_to_player";
    CutManState["hurt"] = "hurt";
    CutManState["taunt"] = "taunt";
})(CutManState || (CutManState = {}));
class CutManIdleState {
    constructor(actor) {
        this.name = CutManState.idle;
        this.elapsedTime = 0;
        this.endTime = 3000;
        this.actor = actor;
    }
    enter() {
        // console.log('CutManIdleState');
        this.initialized = true;
        this.actor.animations.play(CutManAnimations.idle);
    }
    update() {
        let choice = mathutil_1.MathUtil.weightedRandomKey(this.actor.weights, this.actor.sumOfWeights);
        switch (choice) {
            case CutManState.throw_cutter:
                if (this.actor.hasThrownCutter) {
                    break;
                }
                this.actor.fsm.changeState(CutManState.throw_cutter);
                return;
            case CutManState.jump_to_player:
                this.actor.fsm.changeState(CutManState.jump_to_player);
                break;
            case CutManState.move_to_player:
                this.actor.fsm.changeState(CutManState.move_to_player);
                break;
            case CutManState.taunt:
                if (this.actor.isOnGround) {
                    this.actor.fsm.changeState(CutManState.taunt);
                }
                break;
        }
    }
    exit() {
        this.initialized = false;
        this.elapsedTime = 0;
    }
}
class CutManThrowCutterState {
    constructor(actor) {
        this.name = CutManState.throw_cutter;
        this.elapsedTime = 0;
        this.endTime = 1000;
        this.actor = actor;
    }
    enter() {
        // console.log('CutManThrowCutterState');
        this.initialized = true;
        if (this.actor.isOnGround) {
            this.actor.targetSpeed.x = 0;
        }
        this.actor.animations.play(CutManAnimations.throw_cutter);
    }
    update() {
        if (this.actor.animations.currentAnim.isFinished) {
            this.actor.shoot();
            this.actor.fsm.changeState(CutManState.idle);
            return;
        }
    }
    exit() {
        this.initialized = false;
        this.elapsedTime = 0;
    }
}
class CutManJumpToPlayerState {
    constructor(actor) {
        this.name = CutManState.jump_to_player;
        this.actor = actor;
    }
    enter() {
        // console.log('CutManJumpToPlayerState');
        this.initialized = true;
        let jumpVerticalSpeed = (Math.random() * (this.actor.maxJumpSpeed - this.actor.minJumpSpeed)) + this.actor.minJumpSpeed;
        let dirX = mathutil_1.MathUtil.sign(this.actor.player.getPosition().x - this.actor.getPosition().x);
        this.actor.targetSpeed.y = -jumpVerticalSpeed;
        this.actor.targetSpeed.x = this.actor.jumpHorizontalSpeed * dirX;
        if (this.actor.hasThrownCutter) {
            this.actor.animations.play(CutManAnimations.jump_without_cutter);
        }
        else {
            this.actor.animations.play(CutManAnimations.jump_with_cutter);
        }
    }
    update() {
        if (this.actor.isOnGround) {
            this.actor.fsm.changeState(CutManState.idle);
            return;
        }
    }
    exit() {
        this.initialized = false;
    }
}
class CutManMoveToPlayerState {
    constructor(actor) {
        this.name = CutManState.move_to_player;
        this.dirToPlayer = new Phaser.Point();
        this.actor = actor;
    }
    enter() {
        // console.log('CutManMoveToPlayerState');
        this.initialized = true;
    }
    update() {
        if (this.actor.hasThrownCutter) {
            this.actor.animations.play(CutManAnimations.run_without_cutter);
        }
        else {
            this.actor.animations.play(CutManAnimations.run_with_cutter);
        }
        if (this.actor.wallContact.left) {
            this.actor.fsm.changeState(CutManState.jump_to_player);
            return;
        }
        this.dirToPlayer = helper_1.Helper.directionTo2(this.actor.getPosition(), this.actor.player.getPosition());
        this.actor.targetSpeed.x = mathutil_1.MathUtil.sign(this.dirToPlayer.x) * this.actor.horizontalSpeed;
        let distance = helper_1.Helper.distanceTo2(this.actor.getPosition(), this.actor.player.getPosition());
        if (distance < 5) {
            this.actor.fsm.changeState(CutManState.idle);
            return;
        }
    }
    exit() {
        this.initialized = false;
    }
}
class CutManHurtState {
    constructor(actor) {
        this.name = CutManState.hurt;
        this.actor = actor;
    }
    enter() {
        // console.log('CutManHurtState');
        this.initialized = true;
        if (this.actor.hasThrownCutter) {
            this.actor.animations.play(CutManAnimations.hurt_without_cutter);
        }
        else {
            this.actor.animations.play(CutManAnimations.hurt_with_cutter);
        }
    }
    update() {
        if (!this.actor.isHurt) {
            this.actor.targetSpeed.x = 0;
            this.actor.targetSpeed.y = 0;
            this.actor.fsm.changeState(CutManState.idle);
            return;
        }
    }
    exit() {
        this.initialized = false;
    }
}
class CutManTauntState {
    constructor(actor) {
        this.name = CutManState.taunt;
        this.actor = actor;
    }
    enter() {
        // console.log('CutManTauntState');
        this.initialized = true;
        if (this.actor.hasThrownCutter) {
            this.actor.animations.play(CutManAnimations.taunt_without_cutter);
        }
        else {
            this.actor.animations.play(CutManAnimations.taunt_with_cutter);
        }
        this.actor.targetSpeed.x = 0;
        if (Math.random() > 0.75) {
            this.actor.game.sound.play(konstants_1.AudioName.beam);
        }
    }
    update() {
        if (this.actor.animations.currentAnim.loopCount == 3) {
            if (this.actor.hasThrownCutter) {
                this.actor.fsm.changeState(CutManState.idle);
            }
            else {
                this.actor.fsm.changeState(CutManState.throw_cutter);
            }
        }
    }
    exit() {
        this.initialized = false;
        this.actor.animations.stop();
    }
}


/***/ }),
/* 54 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Boss = void 0;
const konstants_1 = __webpack_require__(2);
const entity_1 = __webpack_require__(16);
const mathutil_1 = __webpack_require__(34);
const sat2d_1 = __webpack_require__(17);
const ray_1 = __webpack_require__(19);
const vector2_1 = __webpack_require__(20);
class Boss extends entity_1.Entity {
    constructor(myWorld, tag, e, game, x, y, key, frame) {
        super(myWorld, tag, e, game, x, y, key, frame);
        this.horizontalSpeed = 65;
        this.targetSpeed = new Phaser.Point(0, 0);
        this.disableLogic = true;
        this.weights = new mathutil_1.KeyedCollection();
        this.sumOfWeights = 0;
        this.isRunning = false;
        this.idleElapsedTime = 0;
        this.blinkStartTime = 2500; // After some time player will play idle animation after (ms) passed.
        this.isIdle = false; // The player has not moved for some time.
        this.isJumping = false;
        this.canJumpInAir = true;
        this.jumpInAirElapsedTime = 0;
        this.jumpInAirEndTime = 500;
        this.airJumpWindow = false;
        this.isFalling = false;
        this.useGravity = true;
        this.minJumpSpeed = 250;
        this.maxJumpSpeed = 300;
        this.isOnGround = false;
        this.jumpHorizontalSpeed = 60;
        this.isHurt = false;
        this.hurtElapsedTime = 0;
        this.hurtEndTime = 500;
        this.damageDir = new Phaser.Point;
        this.isInvincible = false;
        this.invincibleElapsedTime = 0;
        this.invincibleEndTime = 900;
        this.isBlinking = false;
        this.blinkingElapsedTime = 0;
        this.blinkingEndTime = 900;
        this.blinkRate = 2;
        this.blinkCounter = 0;
        this.whiteEffectMaxCounter = 12;
        this.deathEffects = new Array();
        this.groundRays = new Array();
        this.ceilRays = new Array();
        this.leftRays = new Array();
        this.rightRays = new Array();
        this.skinWidth = 5;
        this.minJumpHeight = 1;
        this.maxJumpHeight = 44;
        this.timeToJumpApex = 0.35;
        this.gravityX = 0;
        this.gravityY = 0;
        this.maxJumpVelocity = 0;
        this.minJumpVelocity = 0;
        this.player = this.myWorld.entityManager.player;
        this.getPosition().x = x;
        this.getPosition().y = y;
        this.anchor.setTo(0.5, 1);
        this.smoothed = true;
        this.setFacingDirection(1);
        this.isShielded = false;
        this.visible = false;
    }
    manualUpdate() {
        // this.pGraphicsDebug.clear();
        if (!this.alive) {
            return;
        }
        if (this.disableLogic) {
            return;
        }
        let dirX = mathutil_1.MathUtil.sign(this.player.getPosition().x - this.getPosition().x);
        this.setFacingDirection(-mathutil_1.MathUtil.sign(dirX));
        this.fsm.currentState.update();
        if (this.useGravity) {
            this.targetSpeed.x += Math.abs(this.gravityX) * this.game.time.physicsElapsed;
            this.targetSpeed.y += Math.abs(this.gravityY) * this.game.time.physicsElapsed;
        }
        this.velocity.x = this.targetSpeed.x;
        this.velocity.y = this.targetSpeed.y;
        this.getPosition().x += this.velocity.x * this.game.time.physicsElapsed;
        this.getPosition().y += this.velocity.y * this.game.time.physicsElapsed;
        this.position.x = (this.getPosition().x + 0.5) | 0;
        this.position.y = this.getPosition().y;
        this.checkBlink();
        this.checkInvincible();
        this.checkHurt();
        this.checkIdle();
        this.checkFalling();
        this.updateRect();
        this.castRays();
        this.showDebugRays();
    }
    show() {
        this.visible = true;
    }
    /**
     * Primarily used on the bosses initial spawn.
     */
    performTaunt() {
    }
    checkSurfaceCollisions(surfaces) {
        this.wallContact.left = false;
        this.wallContact.right = false;
        this.wallContact.up = false;
        this.wallContact.down = false;
        this.isOnGround = false;
        let into;
        for (let j = 0; j < surfaces.length; j++) {
            let surface = surfaces[j];
            if (!surface.collidable) {
                continue;
            }
            let nx = surface.dir.y;
            let ny = -surface.dir.x;
            // Check floors
            if (ny == -1 && this.getVelocity().y > 0) {
                for (let k = 0; k < this.groundRays.length; k++) {
                    let ray = this.groundRays[k];
                    into = sat2d_1.SAT2D.testRayVsRay(ray, new ray_1.Ray(new vector2_1.Vector2(surface.p1.x, surface.p1.y), new vector2_1.Vector2(surface.p2.x, surface.p2.y), ray_1.RayType.not_infinite), into);
                    if (into != null) {
                        let dx = into.ray1.end.x - into.ray1.start.x;
                        let dy = into.ray1.end.y - into.ray1.start.y;
                        let distance = Math.sqrt(dx * dx + dy * dy);
                        let trueDistance = distance * into.u1;
                        let contactX = into.ray1.start.x + into.ray1.dir.x * into.u1;
                        let contactY = into.ray1.start.y + trueDistance;
                        // this.pGraphicsDebug.drawCircle(contactX, contactY, 3);
                        if (trueDistance > this.hitbox.height * 0.5) {
                            continue;
                        }
                        this.getPosition().y = contactY;
                        this.setVelocity(this.getVelocity().x, 0);
                        this.targetSpeed.y = 0;
                        this.isOnGround = true;
                        this.isJumping = false;
                        this.isFalling = false;
                        this.airJumpWindow = false;
                        this.jumpInAirElapsedTime = 0;
                        this.wallContact.down = true;
                        continue;
                    }
                }
            }
            // Check ceilings
            if (ny == 1 && this.getVelocity().y < 0) {
                for (let k = 0; k < this.ceilRays.length; k++) {
                    let ray = this.ceilRays[k];
                    into = sat2d_1.SAT2D.testRayVsRay(ray, new ray_1.Ray(new vector2_1.Vector2(surface.p1.x, surface.p1.y), new vector2_1.Vector2(surface.p2.x, surface.p2.y), ray_1.RayType.not_infinite), into);
                    if (into != null) {
                        let dx = into.ray1.end.x - into.ray1.start.x;
                        let dy = into.ray1.end.y - into.ray1.start.y;
                        let distance = Math.sqrt(dx * dx + dy * dy);
                        let trueDistance = distance * into.u1;
                        let contactX = into.ray1.start.x + into.ray1.dir.x * into.u1;
                        let contactY = into.ray1.start.y - trueDistance;
                        // this.pGraphicsDebug.drawCircle(contactX, contactY, 3);
                        if (trueDistance > this.hitbox.height * 0.5) {
                            continue;
                        }
                        this.getPosition().y = contactY + this.hitbox.height;
                        this.setVelocity(this.getVelocity().x, 0);
                        this.targetSpeed.y = 0;
                        this.isFalling = true;
                        this.wallContact.up = true;
                        continue;
                    }
                }
            }
            // Check right walls
            if (nx == -1 && this.getVelocity().x > 0) {
                for (let k = 0; k < this.rightRays.length; k++) {
                    let ray = this.rightRays[k];
                    into = sat2d_1.SAT2D.testRayVsRay(ray, new ray_1.Ray(new vector2_1.Vector2(surface.p1.x, surface.p1.y), new vector2_1.Vector2(surface.p2.x, surface.p2.y), ray_1.RayType.not_infinite), into);
                    if (into != null) {
                        let dx = into.ray1.end.x - into.ray1.start.x;
                        let dy = into.ray1.end.y - into.ray1.start.y;
                        let distance = Math.sqrt(dx * dx + dy * dy);
                        let trueDistance = distance * into.u1;
                        let contactX = into.ray1.start.x + trueDistance;
                        let contactY = into.ray1.start.y;
                        // this.pGraphicsDebug.lineStyle(1, 0);
                        // this.pGraphicsDebug.beginFill(0xff0000, 0.5);
                        // this.pGraphicsDebug.drawCircle(contactX, contactY, 5);
                        if (trueDistance > this.hitbox.width * 0.5) {
                            continue;
                        }
                        this.getPosition().x = contactX - this.hitbox.width * 0.5;
                        this.wallContact.right = true;
                        continue;
                    }
                }
            }
            // Check left walls
            if (nx == 1 && this.getVelocity().x < 0) {
                for (let k = 0; k < this.leftRays.length; k++) {
                    let ray = this.leftRays[k];
                    into = sat2d_1.SAT2D.testRayVsRay(ray, new ray_1.Ray(new vector2_1.Vector2(surface.p1.x, surface.p1.y), new vector2_1.Vector2(surface.p2.x, surface.p2.y), ray_1.RayType.not_infinite), into);
                    if (into != null) {
                        let dx = into.ray1.end.x - into.ray1.start.x;
                        let dy = into.ray1.end.y - into.ray1.start.y;
                        let distance = Math.sqrt(dx * dx + dy * dy);
                        let trueDistance = distance * into.u1;
                        let contactX = into.ray1.start.x - trueDistance;
                        let contactY = into.ray1.start.y;
                        // this.pGraphicsDebug.lineStyle(1, 0);
                        // this.pGraphicsDebug.beginFill(0xff0000, 0.5);
                        // this.pGraphicsDebug.drawCircle(contactX, contactY, 5);
                        if (trueDistance > this.hitbox.width * 0.5) {
                            continue;
                        }
                        this.getPosition().x = contactX + this.hitbox.width * 0.5;
                        this.wallContact.left = true;
                        continue;
                    }
                }
            }
        }
    }
    takeDamage(damage, damageDir = new Phaser.Point(0, 0)) {
        if (this.isShielded) {
            this.game.sound.play(konstants_1.AudioName.dink);
            return;
        }
        if (this.health <= 0) {
            return;
        }
        if (this.isInvincible) {
            return;
        }
        this.healthMeter.takeEnergy(damage);
        this.health -= damage;
        this.targetSpeed.x = 30 * damageDir.x;
        this.targetSpeed.y = 0;
        if (this.health <= 0) {
            this.game.sound.play(konstants_1.AudioName.explosion);
            let speed = 24;
            this.addDeathEffect(0, -speed); // top
            this.addDeathEffect(speed, 0); // right
            this.addDeathEffect(0, speed); // bottom
            this.addDeathEffect(-speed, 0); // left
            speed = 40;
            this.addDeathEffect(0, -speed); // top
            this.addDeathEffect(Math.cos(45 * (Math.PI / 180)) * speed, Math.sin(-45 * (Math.PI / 180)) * speed); // top-right
            this.addDeathEffect(speed, 0); // right
            this.addDeathEffect(Math.cos(45 * (Math.PI / 180)) * speed, Math.sin(45 * (Math.PI / 180)) * speed); // bottom-right
            this.addDeathEffect(0, speed); // bottom
            this.addDeathEffect(Math.cos(135 * (Math.PI / 180)) * speed, Math.sin(45 * (Math.PI / 180)) * speed); // bottom-left
            this.addDeathEffect(-speed, 0); // left
            this.addDeathEffect(Math.cos(135 * (Math.PI / 180)) * speed, Math.sin(-45 * (Math.PI / 180)) * speed); // top-left
            this.health = 0;
            this.myWorld.dropManager.dropBossItem(konstants_1.EntityType.cut_man_boss_item, 201.5 * 16, 78 * 16);
            this.myWorld.createExplosionEffect(this.getPosition().x, this.getPosition().y - this.hitbox.halfHeight);
            this.destroyed.dispatch(this);
            this.kill();
        }
        else {
            this.game.sound.play(konstants_1.AudioName.enemy_damage);
            this.isHurt = true;
            this.isInvincible = true;
            this.isBlinking = true;
            this.myWorld.createHurtDust(this.getPosition().x - 2, this.getPosition().y - 40);
            this.myWorld.createHurtDust(this.getPosition().x - 12, this.getPosition().y - 36);
            this.myWorld.createHurtDust(this.getPosition().x + 8, this.getPosition().y - 36);
            this.whiteEffect.visible = true;
            this.whiteEffect.position.x = -12;
            this.whiteEffect.position.y = -24;
        }
    }
    jump() {
        if (this.isHurt) {
            return;
        }
        if (this.isOnGround) {
            this.jumpOnGround();
        }
    }
    jumpOnGround() {
        this.targetSpeed.y = -this.maxJumpVelocity;
        this.isOnGround = false;
        this.isJumping = true;
        this.isFalling = false;
    }
    calculateRegularJumpSettings() {
        this.gravityY = -(2 * this.maxJumpHeight) / Math.pow(this.timeToJumpApex, 2);
        this.maxJumpVelocity = Math.abs(this.gravityY) * this.timeToJumpApex;
        this.minJumpVelocity = Math.sqrt(2 * Math.abs(this.gravityY) * this.minJumpHeight);
        // console.log('gravity: ' + this._gravity);
        // console.log('maxJumpVelocity: ' + this._maxJumpVelocity);
        // console.log('minJumpVelocity: ' + this._minJumpVelocity);
    }
    addDeathEffect(vx, vy) {
        let s = this.myWorld.createMegaManDeathEffect(this.getPosition().x, this.getPosition().y - 12);
        s.body.velocity.x = vx;
        s.body.velocity.y = vy;
        this.deathEffects.push(s);
    }
    checkBlink() {
        if (!this.isBlinking) {
            return;
        }
        this.blinkCounter++;
        if (this.blinkCounter % this.blinkRate == 0) {
            this.alpha == 1 ? this.alpha = 0 : this.alpha = 1;
        }
        if (this.blinkCounter > this.whiteEffectMaxCounter) {
            this.whiteEffect.visible = false;
        }
        this.blinkingElapsedTime += this.game.time.elapsedMS;
        if (this.blinkingElapsedTime > this.blinkingEndTime) {
            this.blinkingElapsedTime = 0;
            this.isBlinking = false;
            this.alpha = 1;
            this.blinkCounter = 0;
        }
    }
    checkInvincible() {
        if (!this.isInvincible) {
            return;
        }
        this.invincibleElapsedTime += this.game.time.elapsedMS;
        if (this.invincibleElapsedTime > this.invincibleEndTime) {
            this.invincibleElapsedTime = 0;
            this.isInvincible = false;
        }
    }
    checkHurt() {
        if (!this.isHurt) {
            return;
        }
        this.hurtElapsedTime += this.game.time.elapsedMS;
        if (this.hurtElapsedTime > this.hurtEndTime) {
            this.hurtElapsedTime = 0;
            this.isHurt = false;
        }
    }
    checkIdle() {
        if (this.isOnGround && this.velocity.x == 0) {
            this.idleElapsedTime += this.game.time.elapsedMS;
            if (this.idleElapsedTime > this.blinkStartTime) {
                this.isIdle = true;
            }
        }
        else {
            this.isIdle = false;
            this.idleElapsedTime = 0;
        }
    }
    checkFalling() {
        if (!this.isOnGround && this.velocity.y > 0) {
            this.isFalling = true;
            // When falling we give the player some time to jump again; after that time jumping isnt possible while in air.
            this.airJumpWindow = true;
            this.jumpInAirElapsedTime += this.game.time.elapsedMS;
            if (this.jumpInAirElapsedTime > this.jumpInAirEndTime) {
                this.airJumpWindow = false;
            }
        }
    }
    /**
     * Using the current position moves the rays a frame even though the player may be running into a wall. By using
     * previous position the rays don't move for that frame. They use the previous frame. Think about it, when the player
     * is running into a wall, its 'bounds' should not move.
     */
    castRays() {
        let centerX = this.getPosition().x;
        let centerY = this.getPosition().y - this.hitbox.height * 0.5;
        if (this.wallContact.left || this.wallContact.right) {
            centerX = this.previousPosition.x;
        }
        // cast ground rays
        this.leftGroundCheck.start = new vector2_1.Vector2(centerX - this.hitbox.width * 0.5 + 3, centerY);
        this.leftGroundCheck.end = new vector2_1.Vector2(centerX - this.hitbox.width * 0.5 + 3, centerY + this.hitbox.height * 0.5 + this.skinWidth);
        this.rightGroundCheck.start = new vector2_1.Vector2(centerX + this.hitbox.width * 0.5 - 3, centerY);
        this.rightGroundCheck.end = new vector2_1.Vector2(centerX + this.hitbox.width * 0.5 - 3, centerY + this.hitbox.height * 0.5 + this.skinWidth);
        // cast ceil rays
        this.leftCeilCheck.start = new vector2_1.Vector2(centerX - this.hitbox.width * 0.5 + 3, centerY);
        this.leftCeilCheck.end = new vector2_1.Vector2(centerX - this.hitbox.width * 0.5 + 3, centerY - this.hitbox.height * 0.5 - this.skinWidth);
        this.rightCeilCheck.start = new vector2_1.Vector2(centerX + this.hitbox.width * 0.5 - 3, centerY);
        this.rightCeilCheck.end = new vector2_1.Vector2(centerX + this.hitbox.width * 0.5 - 3, centerY - this.hitbox.height * 0.5 - this.skinWidth);
        // cast left rays
        let offsetY = 8;
        this.leftCheck1.start = new vector2_1.Vector2(centerX, centerY - offsetY);
        this.leftCheck1.end = new vector2_1.Vector2(centerX - this.hitbox.width * 0.5 - this.skinWidth, centerY - offsetY);
        this.leftCheck2.start = new vector2_1.Vector2(centerX, centerY + offsetY);
        this.leftCheck2.end = new vector2_1.Vector2(centerX - this.hitbox.width * 0.5 - this.skinWidth, centerY + offsetY);
        // cast right rays
        offsetY = 8;
        this.rightCheck1.start = new vector2_1.Vector2(centerX, centerY - offsetY);
        this.rightCheck1.end = new vector2_1.Vector2(centerX + this.hitbox.width * 0.5 + this.skinWidth, centerY - offsetY);
        this.rightCheck2.start = new vector2_1.Vector2(centerX, centerY + offsetY);
        this.rightCheck2.end = new vector2_1.Vector2(centerX + this.hitbox.width * 0.5 + this.skinWidth, centerY + offsetY);
    }
    showDebugRays() {
        // this.pGraphicsDebug.lineStyle(1, 0);
        // this.groundRays.forEach((ray) => {
        //     this.pGraphicsDebug.moveTo(ray.start.x, ray.start.y);
        //     this.pGraphicsDebug.lineTo(ray.end.x, ray.end.y);
        // });
        // this.ceilRays.forEach((ray) => {
        //     this.pGraphicsDebug.moveTo(ray.start.x, ray.start.y);
        //     this.pGraphicsDebug.lineTo(ray.end.x, ray.end.y);
        // });
        // this.leftRays.forEach((ray) => {
        //     this.pGraphicsDebug.moveTo(ray.start.x, ray.start.y);
        //     this.pGraphicsDebug.lineTo(ray.end.x, ray.end.y);
        // });
        // this.rightRays.forEach((ray) => {
        //     this.pGraphicsDebug.moveTo(ray.start.x, ray.start.y);
        //     this.pGraphicsDebug.lineTo(ray.end.x, ray.end.y);
        // });
    }
}
exports.Boss = Boss;


/***/ }),
/* 55 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CutManBullet = void 0;
const konstants_1 = __webpack_require__(2);
const konstants_2 = __webpack_require__(2);
const entity_1 = __webpack_require__(16);
const helper_1 = __webpack_require__(24);
const mathutil_1 = __webpack_require__(34);
const v2_1 = __webpack_require__(10);
const catmull_1 = __webpack_require__(11);
class CutManBullet extends entity_1.Entity {
    constructor(owner, world, tag, e, game, x, y, key, frame) {
        super(world, tag, e, game, x, y, key, frame);
        this.velocity = new Phaser.Point(0, 0);
        this.horizontalSpeed = 160;
        this.useGravity = false;
        this.gravityY = 500;
        this.targetSpeed = new Phaser.Point(0, 0);
        this.canCollideWithOtherBullet = false;
        // pGraphicsDebug: Phaser.Graphics;
        this.startPos = new Phaser.Point();
        this.points = new Array();
        this.marker = 0;
        this.bulletMovement = null;
        this.rotationAmount = 15 * (Math.PI / 180);
        this.smoothed = false;
        this.owner = owner;
        this.health = 1;
        this.maxHealth = 1;
        this.getPosition().x = x;
        this.getPosition().y = y;
        this.anchor.setTo(0.5, 0.5);
        this.hitbox = new Phaser.Rectangle(this.getPosition().x, this.getPosition().y, 8, 6);
        this.hitboxOffset.x = -4;
        this.hitboxOffset.y = -3;
        this.updateRect();
        this.startPos.x = this.getPosition().x;
        this.startPos.y = this.getPosition().y;
        this.catmull = new catmull_1.Catmull(this.points);
        this.points.push(new v2_1.v2(this.startPos.x, this.startPos.y));
        this.points.push(new v2_1.v2(this.startPos.x + 50 * this.owner.getFacingDirection(), this.startPos.y - 20));
        this.points.push(new v2_1.v2(this.startPos.x + 90 * this.owner.getFacingDirection(), this.startPos.y));
        this.points.push(new v2_1.v2(this.startPos.x + 80 * this.owner.getFacingDirection(), this.startPos.y + 20));
        // this.fsm = new StateMachine();
        // this.fsm.addState(CutManBulletState.catmullPathing, new CutManBulletCatmullPathingState(this));
        // this.fsm.addState(CutManBulletState.returning, new CutManBulletReturningState(this));
        // this.fsm.changeState(CutManBulletState.catmullPathing);
    }
    manualUpdate() {
        // this.pGraphicsDebug.clear();
        if (!this.alive) {
            return;
        }
        // this.fsm.currentState.update();
        this.bulletMovement.move();
        this.getPosition().x = this.bulletMovement.position.x;
        this.getPosition().y = this.bulletMovement.position.y;
        this.position.x = (this.getPosition().x + 0.5) | 0;
        this.position.y = this.getPosition().y;
        this.rotation += this.rotationAmount;
        this.updateRect();
    }
    checkCollideWith(other) {
        if (helper_1.Helper.distanceTo(other, this) > 21) {
            return;
        }
        // The bullet cannot hit itself.
        if (other == this) {
            return;
        }
        // The bullet cannot hit other bullets shot by the same owner.
        if (other.tag == konstants_1.TagType.bullet) {
            let bullet = other;
            if (this.owner == bullet.owner) {
                return;
            }
        }
        // Go through spike.
        else if (other.myEntityType == konstants_2.EntityType.spike) {
            return;
        }
        // Go through explosions.
        else if (other.myEntityType == konstants_2.EntityType.explosion_from_killer_bullet) {
            return;
        }
        // The bullet cannot hit the owner who shot it.
        if (this.owner == other) {
            return;
        }
        if (!this.canCollideWithOtherBullet) {
            if (other.tag == konstants_1.TagType.bullet) {
                let bullet = other;
                // Player bullet cannot collide with enemy bullet.
                if (this.owner.tag == konstants_1.TagType.player && bullet.owner.tag != konstants_1.TagType.player) {
                    return;
                }
                // Enemy bullet cannot collide with player bullet.
                if (this.owner.tag != konstants_1.TagType.player && bullet.owner.tag == konstants_1.TagType.player) {
                    return;
                }
            }
        }
        // Enemy bullet cannot collide (hurt/kill) with other enemies.
        if (this.owner.tag != konstants_1.TagType.player) {
            if (other.tag != konstants_1.TagType.player) {
                return;
            }
        }
        // ***************************************************
        // In the future bullets will be allowed to hit other bullets since they don't share the same owner.
        // A boolean will keep track of this.
        // this.graphicsDebug.drawRect(this.getPosition().x + this.hitbox.x - this.hitbox.width * 0.5, this.getPosition().y - this.hitbox.height + this.hitbox.y, this.hitbox.width, this.hitbox.height);
        if (!Phaser.Rectangle.intersects(this.hitbox, other.hitbox)) {
            return;
        }
        // This bullets hits enemy 'met'. Reflect this bullet if met is shielded.
        // if (other.myEntityType == EntityType.met) {
        //     let met: Met = <Met>other;
        //     if (met.isShielded) {
        //         this.reflect();
        //         return;
        //     }
        // }
        other.takeDamage(this.contactDamage, helper_1.Helper.directionTo(this, other));
        // this.takeDamage(1);
    }
    takeDamage(damage) {
        if (this.health <= 0) {
            return;
        }
        this.health -= damage;
        if (this.health == 0) {
            this.destroyed.dispatch();
            this.kill();
        }
    }
    reflect() {
        let x = this.targetSpeed.x > 0 ? 135 : 45;
        this.targetSpeed.x = 200 * Math.cos(mathutil_1.MathUtil.sign(this.horizontalSpeed) * x * (Math.PI / 180));
        this.targetSpeed.y = 200 * Math.sin(mathutil_1.MathUtil.sign(this.horizontalSpeed) * -45 * (Math.PI / 180));
    }
}
exports.CutManBullet = CutManBullet;


/***/ }),
/* 56 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BoomerangBulletMovement = void 0;
const helper_1 = __webpack_require__(24);
const stateMachine_1 = __webpack_require__(33);
class BoomerangBulletMovement {
    constructor(owner, initialPosition, target, speed) {
        this.owner = owner;
        this.initialPosition = initialPosition;
        this.speed = speed;
        this.destroyed = new Phaser.Signal();
        this.position = new Phaser.Point();
        this.targetSpeed = new Phaser.Point();
        this.velocity = new Phaser.Point();
        this.targetPosition = new Phaser.Point();
        this.position.x = initialPosition.x;
        this.position.y = initialPosition.y;
        this.targetPosition.x = target.x;
        this.targetPosition.y = target.y;
        this.fsm = new stateMachine_1.StateMachine();
        this.fsm.addState(BoomerangBulletState.forward, new BoomerangBulletForwardState(this));
        this.fsm.addState(BoomerangBulletState.backward, new BoomerangBulletBackwardState(this));
        this.fsm.changeState(BoomerangBulletState.forward);
    }
    move() {
        this.fsm.currentState.update();
    }
}
exports.BoomerangBulletMovement = BoomerangBulletMovement;
var BoomerangBulletState;
(function (BoomerangBulletState) {
    BoomerangBulletState["forward"] = "forward";
    BoomerangBulletState["backward"] = "backward";
})(BoomerangBulletState || (BoomerangBulletState = {}));
class BoomerangBulletForwardState {
    constructor(actor) {
        this.name = BoomerangBulletState.forward;
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
        this.dirToTarget = helper_1.Helper.directionTo2(this.actor.position, this.actor.targetPosition);
        this.actor.targetSpeed.x = this.dirToTarget.x * this.actor.speed;
        this.actor.targetSpeed.y = this.dirToTarget.y * this.actor.speed;
    }
    update() {
        this.actor.velocity.x = this.actor.targetSpeed.x;
        this.actor.velocity.y = this.actor.targetSpeed.y;
        this.actor.position.x += this.actor.velocity.x * this.actor.owner.game.time.physicsElapsed;
        this.actor.position.y += this.actor.velocity.y * this.actor.owner.game.time.physicsElapsed;
        if (helper_1.Helper.distanceTo2(this.actor.position, this.actor.targetPosition) < 2) {
            this.actor.fsm.changeState(BoomerangBulletState.backward);
            return;
        }
    }
    exit() {
        this.initialized = false;
    }
}
class BoomerangBulletBackwardState {
    constructor(actor) {
        this.name = BoomerangBulletState.backward;
        this.posDiff = new Phaser.Point(0, -10);
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
    }
    update() {
        this.tempPos = this.actor.owner.getPosition().clone().add(this.posDiff.x, this.posDiff.y);
        if (helper_1.Helper.distanceTo2(this.actor.position, this.tempPos) < 5) {
            this.actor.destroyed.dispatch();
            return;
        }
        this.dir = helper_1.Helper.directionTo2(this.actor.position, this.tempPos);
        this.actor.targetSpeed.x = this.actor.speed * 1.2 * this.dir.x;
        this.actor.targetSpeed.y = this.actor.speed * 1.2 * this.dir.y;
        this.actor.velocity.x = this.actor.targetSpeed.x;
        this.actor.velocity.y = this.actor.targetSpeed.y;
        this.actor.position.x += this.actor.velocity.x * this.actor.owner.game.time.physicsElapsed;
        this.actor.position.y += this.actor.velocity.y * this.actor.owner.game.time.physicsElapsed;
    }
    exit() {
        this.initialized = false;
    }
}


/***/ }),
/* 57 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GutsMan = exports.GutsManAnimations = void 0;
const konstants_1 = __webpack_require__(2);
const helper_1 = __webpack_require__(24);
const mathutil_1 = __webpack_require__(34);
const stateMachine_1 = __webpack_require__(33);
const meter_1 = __webpack_require__(25);
const ray_1 = __webpack_require__(19);
const vector2_1 = __webpack_require__(20);
const boss_1 = __webpack_require__(54);
var GutsManAnimations;
(function (GutsManAnimations) {
    GutsManAnimations["idle"] = "idle";
    GutsManAnimations["hurt"] = "hurt";
    GutsManAnimations["taunt"] = "taunt";
    GutsManAnimations["jump"] = "jump";
    GutsManAnimations["lift"] = "lift";
    GutsManAnimations["crouch_lift"] = "crouch_lift";
    GutsManAnimations["throw"] = "throw";
    GutsManAnimations["open_mouth"] = "open_mouth";
})(GutsManAnimations = exports.GutsManAnimations || (exports.GutsManAnimations = {}));
var GutsManWeights;
(function (GutsManWeights) {
    GutsManWeights["jump_up"] = "jump_up";
    GutsManWeights["jump_towards_player"] = "jump_towards_player";
    GutsManWeights["jump_away_from_player"] = "jump_away_from_player";
})(GutsManWeights || (GutsManWeights = {}));
class GutsMan extends boss_1.Boss {
    constructor(myWorld, tag, e, game, x, y, key, frame) {
        super(myWorld, tag, e, game, x, y, key, frame);
        this.slamGround = new Phaser.Signal();
        this.fsm = new stateMachine_1.StateMachine();
        this.fsm.addState(GutsManState.idle, new GutsManIdleState(this));
        this.fsm.addState(GutsManState.jump, new GutsManJumpState(this));
        this.fsm.addState(GutsManState.in_air, new GutsManInAirState(this));
        this.fsm.addState(GutsManState.wait_for_throwable, new GutsManWaitForThrowableState(this));
        this.fsm.addState(GutsManState.receive, new GutsManReceiveState(this));
        this.fsm.addState(GutsManState.throw, new GutsManThrowState(this));
        this.fsm.changeState(GutsManState.jump);
        this.animations.add(GutsManAnimations.idle, ['stand'], 10, false, false);
        this.animations.add(GutsManAnimations.taunt, ['crouch', 'stand'], 5, false, false);
        this.animations.add(GutsManAnimations.jump, ['crouch', 'stand'], 5, false, false);
        this.animations.add(GutsManAnimations.lift, ['lift'], 10, false, false);
        this.animations.add(GutsManAnimations.crouch_lift, ['crouch_lift'], 10, false, false);
        this.animations.add(GutsManAnimations.throw, ['throw'], 10, false, false);
        this.animations.add(GutsManAnimations.open_mouth, ['stand', 'stand', 'taunt'], 10, false, false);
        this.hitbox = new Phaser.Rectangle(this.getPosition().x, this.getPosition().y, 36, 30);
        this.hitboxOffset.x = -18;
        this.hitboxOffset.y = -30;
        this.updateRect();
        this.healthMeter = new meter_1.Meter(this.game, 40, 15);
        this.healthMeter.setEnergy(0);
        this.health = this.healthMeter.totalEnergy;
        this.maxHealth = this.healthMeter.totalEnergy;
        this.position.x = (this.getPosition().x + 0.5) | 0;
        this.position.y = this.getPosition().y;
        this.leftGroundCheck = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_1.RayType.not_infinite);
        this.rightGroundCheck = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_1.RayType.not_infinite);
        this.leftCeilCheck = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_1.RayType.not_infinite);
        this.rightCeilCheck = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_1.RayType.not_infinite);
        this.leftCheck1 = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_1.RayType.not_infinite);
        this.leftCheck2 = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_1.RayType.not_infinite);
        this.rightCheck1 = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_1.RayType.not_infinite);
        this.rightCheck2 = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_1.RayType.not_infinite);
        this.groundRays.push(this.leftGroundCheck);
        this.groundRays.push(this.rightGroundCheck);
        this.ceilRays.push(this.leftCeilCheck);
        this.ceilRays.push(this.rightCeilCheck);
        this.leftRays.push(this.leftCheck1);
        this.leftRays.push(this.leftCheck2);
        this.rightRays.push(this.rightCheck1);
        this.rightRays.push(this.rightCheck2);
        this.wallContact = { left: false, right: false, up: false, down: false };
        this.calculateRegularJumpSettings();
        this.whiteEffect = this.game.add.sprite(0, 0, konstants_1.Konstants.mega_man, 'white_effect.png');
        this.whiteEffect.alpha = 0.5;
        this.whiteEffect.visible = false;
        this.addChild(this.whiteEffect);
        this.weights.Add(GutsManWeights.jump_up, 36);
        this.weights.Add(GutsManWeights.jump_towards_player, 50);
        this.weights.Add(GutsManWeights.jump_away_from_player, 40);
        this.weights.Keys().forEach(element => {
            this.sumOfWeights += this.weights.Item(element);
        });
    }
    show() {
        this.visible = true;
        this.animations.play(GutsManAnimations.taunt);
    }
    performTaunt() {
        this.animations.play(GutsManAnimations.taunt);
    }
    shoot() {
        return true;
    }
    takeDamage(damage, damageDir = new Phaser.Point(0, 0)) {
        if (this.isShielded) {
            this.game.sound.play(konstants_1.AudioName.dink);
            return;
        }
        if (this.health <= 0) {
            return;
        }
        if (this.isInvincible) {
            return;
        }
        this.healthMeter.takeEnergy(damage);
        this.health -= damage;
        this.targetSpeed.x = 30 * damageDir.x;
        this.targetSpeed.y = 0;
        if (this.health <= 0) {
            this.fsm.changeState(GutsManState.idle);
            if (this.tempThrowableObject != undefined) {
                this.tempThrowableObject.kill();
            }
            this.game.sound.play(konstants_1.AudioName.explosion);
            let speed = 24;
            this.addDeathEffect(0, -speed); // top
            this.addDeathEffect(speed, 0); // right
            this.addDeathEffect(0, speed); // bottom
            this.addDeathEffect(-speed, 0); // left
            speed = 40;
            this.addDeathEffect(0, -speed); // top
            this.addDeathEffect(Math.cos(45 * (Math.PI / 180)) * speed, Math.sin(-45 * (Math.PI / 180)) * speed); // top-right
            this.addDeathEffect(speed, 0); // right
            this.addDeathEffect(Math.cos(45 * (Math.PI / 180)) * speed, Math.sin(45 * (Math.PI / 180)) * speed); // bottom-right
            this.addDeathEffect(0, speed); // bottom
            this.addDeathEffect(Math.cos(135 * (Math.PI / 180)) * speed, Math.sin(45 * (Math.PI / 180)) * speed); // bottom-left
            this.addDeathEffect(-speed, 0); // left
            this.addDeathEffect(Math.cos(135 * (Math.PI / 180)) * speed, Math.sin(-45 * (Math.PI / 180)) * speed); // top-left
            this.health = 0;
            this.myWorld.dropManager.dropBossItem(konstants_1.EntityType.guts_man_boss_item, this.bossData.bossItemSpawnPosition.x * 16, this.bossData.bossItemSpawnPosition.y * 16);
            this.myWorld.createExplosionEffect(this.getPosition().x, this.getPosition().y - this.hitbox.halfHeight);
            this.destroyed.dispatch(this);
            this.kill();
        }
        else {
            this.game.sound.play(konstants_1.AudioName.enemy_damage);
            this.isHurt = true;
            this.isInvincible = true;
            this.isBlinking = true;
            this.myWorld.createHurtDust(this.getPosition().x - 2, this.getPosition().y - 40);
            this.myWorld.createHurtDust(this.getPosition().x - 12, this.getPosition().y - 36);
            this.myWorld.createHurtDust(this.getPosition().x + 8, this.getPosition().y - 36);
            this.whiteEffect.visible = true;
            this.whiteEffect.position.x = -12;
            this.whiteEffect.position.y = -24;
        }
    }
}
exports.GutsMan = GutsMan;
var GutsManState;
(function (GutsManState) {
    GutsManState["idle"] = "idle";
    GutsManState["jump"] = "jump";
    GutsManState["in_air"] = "in_air";
    GutsManState["wait_for_throwable"] = "wait_for_throwable";
    GutsManState["receive"] = "receive";
    GutsManState["throw"] = "throw";
})(GutsManState || (GutsManState = {}));
class GutsManIdleState {
    constructor(actor) {
        this.name = GutsManState.idle;
        this.elapsedTime = 0;
        this.endTime = 500;
        this.actor = actor;
    }
    enter() {
        // console.log('GutsManIdleState');
        this.initialized = true;
        this.actor.animations.play(GutsManAnimations.open_mouth);
    }
    update() {
        this.elapsedTime += this.actor.game.time.elapsedMS;
        if (this.elapsedTime >= this.endTime) {
            this.actor.fsm.changeState(GutsManState.jump);
            return;
        }
    }
    exit() {
        this.initialized = false;
        this.elapsedTime = 0;
    }
}
class GutsManJumpState {
    constructor(actor) {
        this.name = GutsManState.jump;
        this.waitForAnimElapsedTime = 0;
        this.waitForAnimEndTime = 300;
        this.actor = actor;
    }
    enter() {
        // console.log('GutsManJumpState');
        this.initialized = true;
        this.actor.animations.play(GutsManAnimations.jump);
    }
    update() {
        this.waitForAnimElapsedTime += this.actor.game.time.elapsedMS;
        if (this.waitForAnimElapsedTime < this.waitForAnimEndTime) {
            return;
        }
        let choice = mathutil_1.MathUtil.weightedRandomKey(this.actor.weights, this.actor.sumOfWeights);
        let jumpVerticalSpeed = (Math.random() * (this.actor.maxJumpSpeed - this.actor.minJumpSpeed)) + this.actor.minJumpSpeed;
        let dirX = 0;
        this.actor.choice = choice;
        switch (choice) {
            case GutsManWeights.jump_up:
                dirX = 0;
                break;
            case GutsManWeights.jump_towards_player:
                dirX = mathutil_1.MathUtil.sign(this.actor.player.getPosition().x - this.actor.getPosition().x);
                break;
            case GutsManWeights.jump_away_from_player:
                dirX = -mathutil_1.MathUtil.sign(this.actor.player.getPosition().x - this.actor.getPosition().x);
                break;
        }
        this.actor.targetSpeed.y = -jumpVerticalSpeed;
        this.actor.targetSpeed.x = this.actor.jumpHorizontalSpeed * dirX;
        this.actor.isOnGround = false;
        this.actor.fsm.changeState(GutsManState.in_air);
    }
    exit() {
        this.initialized = false;
        this.waitForAnimElapsedTime = 0;
    }
}
class GutsManInAirState {
    constructor(actor) {
        this.name = GutsManState.in_air;
        this.tauntElapsedTime = 0;
        this.tauntEndTime = 250;
        this.actor = actor;
    }
    enter() {
        // console.log('GutsManInAirState');
        this.initialized = true;
    }
    update() {
        if (!this.actor.isOnGround) {
            return;
        }
        this.actor.slamGround.dispatch(this);
        this.actor.targetSpeed.x = this.actor.targetSpeed.y = 0;
        this.actor.game.sound.play(konstants_1.AudioName.guts_quake);
        if (this.actor.choice == GutsManWeights.jump_up) {
            this.actor.fsm.changeState(GutsManState.wait_for_throwable);
            return;
        }
        else {
            this.actor.fsm.changeState(GutsManState.idle);
            return;
        }
    }
    exit() {
        this.initialized = false;
        this.tauntElapsedTime = 0;
    }
}
class GutsManWaitForThrowableState {
    constructor(actor) {
        this.name = GutsManState.wait_for_throwable;
        this.startY = 0;
        this.endY = 0;
        this.lerpElapsedTime = 0;
        this.lerpEndTime = 350;
        this.actor = actor;
    }
    enter() {
        // console.log('GutsManWaitForThrowableState');
        this.initialized = true;
        this.actor.animations.play(GutsManAnimations.lift);
        let x = this.actor.getPosition().x + (this.actor.getFacingDirection() * 11);
        let y = this.actor.myWorld.camera.currentRoom.bounds.y + 30;
        this.actor.tempThrowableObject = this.actor.myWorld.entityManager.createThrowableObject(this.actor, x, y, 36, 34, -18, -17, konstants_1.EntityType.guts_man, 'big_rock', konstants_1.EntityType.guts_man, 'small_rock', konstants_1.EntityType.throwable_object);
        this.actor.tempThrowableObject.canCollideWithWalls = false;
        this.startY = y;
        // 12 for the height of big_rock
        // 34 for guts_man crouch height
        this.endY = this.actor.getPosition().y - 34 - 9;
    }
    update() {
        this.lerpElapsedTime += this.actor.game.time.elapsedMS;
        this.actor.tempThrowableObject.getPosition().y = mathutil_1.MathUtil.lerp(this.startY, this.endY, this.lerpElapsedTime / this.lerpEndTime);
        this.actor.tempThrowableObject.position.y = this.actor.tempThrowableObject.getPosition().y;
        if (this.lerpElapsedTime >= this.lerpEndTime) {
            this.actor.tempThrowableObject.getPosition().y = this.actor.getPosition().y - 34 - 9;
            this.actor.tempThrowableObject.position.y = this.actor.tempThrowableObject.getPosition().y;
            this.actor.fsm.changeState(GutsManState.receive);
            return;
        }
    }
    exit() {
        this.initialized = false;
        this.lerpElapsedTime = 0;
    }
}
class GutsManReceiveState {
    constructor(actor) {
        this.name = GutsManState.receive;
        this.crouchElapsedTime = 0;
        this.crouchEndTime = 300;
        this.actor = actor;
    }
    enter() {
        // console.log('GutsManReceiveState');
        this.initialized = true;
        this.actor.animations.play(GutsManAnimations.crouch_lift);
    }
    update() {
        this.crouchElapsedTime += this.actor.game.time.elapsedMS;
        if (this.crouchElapsedTime < this.crouchEndTime) {
            return;
        }
        this.crouchElapsedTime += this.actor.game.time.elapsedMS;
        if (this.crouchElapsedTime >= this.crouchEndTime) {
            this.actor.fsm.changeState(GutsManState.throw);
            return;
        }
    }
    exit() {
        this.initialized = false;
        this.crouchElapsedTime = 0;
    }
}
class GutsManThrowState {
    constructor(actor) {
        this.name = GutsManState.throw;
        this.throwElapsedTime = 0;
        this.throwEndTime = 500;
        this.idleElapsedTime = 0;
        this.idleEndTime = 500;
        this.hasThrown = false;
        this.canGoToJumpState = false;
        this.actor = actor;
    }
    enter() {
        // console.log('GutsManThrowState');
        this.initialized = true;
    }
    update() {
        this.checkCanThrow();
        this.checkCanGoToJumpState();
    }
    exit() {
        this.initialized = false;
        this.throwElapsedTime = 0;
        this.idleElapsedTime = 0;
        this.hasThrown = false;
    }
    checkCanThrow() {
        if (this.hasThrown) {
            return;
        }
        this.throwElapsedTime += this.actor.game.time.elapsedMS;
        if (this.throwElapsedTime >= this.throwEndTime) {
            this.actor.animations.play(GutsManAnimations.throw);
            let direction = helper_1.Helper.directionTo2(this.actor.tempThrowableObject.getPosition(), this.actor.myWorld.entityManager.player.getPosition().clone().subtract(0, 10));
            this.actor.tempThrowableObject.setParameters(direction, 210);
            this.actor.tempThrowableObject.getPosition().x += direction.x * 20;
            this.actor.tempThrowableObject.position.x = this.actor.tempThrowableObject.getPosition().x;
            this.actor.tempThrowableObject.canCollideWithWalls = true;
            this.hasThrown = true;
        }
    }
    checkCanGoToJumpState() {
        if (!this.hasThrown) {
            return;
        }
        this.idleElapsedTime += this.actor.game.time.elapsedMS;
        if (this.idleElapsedTime >= this.idleEndTime) {
            this.actor.fsm.changeState(GutsManState.jump);
            return;
        }
    }
}


/***/ }),
/* 58 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IceMan = exports.IceManAnimations = void 0;
const konstants_1 = __webpack_require__(2);
const helper_1 = __webpack_require__(24);
const mathutil_1 = __webpack_require__(34);
const stateMachine_1 = __webpack_require__(33);
const meter_1 = __webpack_require__(25);
const ray_1 = __webpack_require__(19);
const vector2_1 = __webpack_require__(20);
const boss_1 = __webpack_require__(54);
var IceManAnimations;
(function (IceManAnimations) {
    IceManAnimations["idle"] = "idle";
    IceManAnimations["taunt"] = "taunt";
    IceManAnimations["attack"] = "attack";
    IceManAnimations["run"] = "run";
    IceManAnimations["jump"] = "jump";
})(IceManAnimations = exports.IceManAnimations || (exports.IceManAnimations = {}));
class IceMan extends boss_1.Boss {
    constructor(myWorld, tag, e, game, x, y, key, frame) {
        super(myWorld, tag, e, game, x, y, key, frame);
        this.bossPos = new Array();
        this.currentPosIdx = 1;
        this.maxIdx = 3;
        this.posDirection = 1;
        this.defaultCombatSpeed = 1050;
        this.combatSpeedInterval = 50;
        this.minCombatSpeed = 500;
        this.defaultBulletSpeed = 100;
        this.bulletSpeedIncrement = 5;
        this.maxBulletSpeed = 140;
        this.fsm = new stateMachine_1.StateMachine();
        this.fsm.addState(IceManState.idle, new IceManIdleState(this));
        this.fsm.addState(IceManState.choose_next_position, new IceManChooseNextPositionState(this));
        this.fsm.addState(IceManState.jump, new IceManJumpState(this));
        this.fsm.addState(IceManState.shoot_going_down, new IceManShootGoingDownState(this));
        this.fsm.addState(IceManState.shoot_going_up, new IceManShootGoingUpState(this));
        this.fsm.addState(IceManState.change_combat_speed, new IceManChangeCombatSpeedState(this));
        this.fsm.addState(IceManState.small_jump, new IceManSmallJumpState(this));
        this.fsm.changeState(IceManState.idle);
        this.animations.add(IceManAnimations.idle, ['stand'], 10, false, false);
        this.animations.add(IceManAnimations.taunt, ['taunt_01', 'taunt_02'], 10, false, false);
        this.animations.add(IceManAnimations.attack, ['attack_01', 'attack_02'], 10, false, false);
        this.animations.add(IceManAnimations.run, ['run_01', 'run_02'], 10, true, false);
        this.animations.add(IceManAnimations.jump, ['jump'], 10, false, false);
        this.hitbox = new Phaser.Rectangle(this.getPosition().x, this.getPosition().y, 16, 20);
        this.hitboxOffset.x = -8;
        this.hitboxOffset.y = -20;
        this.updateRect();
        this.healthMeter = new meter_1.Meter(this.game, 40, 15);
        this.healthMeter.setEnergy(0);
        this.health = this.healthMeter.totalEnergy;
        this.maxHealth = this.healthMeter.totalEnergy;
        this.position.x = (this.getPosition().x + 0.5) | 0;
        this.position.y = this.getPosition().y;
        this.leftGroundCheck = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_1.RayType.not_infinite);
        this.rightGroundCheck = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_1.RayType.not_infinite);
        this.leftCeilCheck = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_1.RayType.not_infinite);
        this.rightCeilCheck = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_1.RayType.not_infinite);
        this.leftCheck1 = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_1.RayType.not_infinite);
        this.leftCheck2 = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_1.RayType.not_infinite);
        this.rightCheck1 = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_1.RayType.not_infinite);
        this.rightCheck2 = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_1.RayType.not_infinite);
        this.groundRays.push(this.leftGroundCheck);
        this.groundRays.push(this.rightGroundCheck);
        this.ceilRays.push(this.leftCeilCheck);
        this.ceilRays.push(this.rightCeilCheck);
        this.leftRays.push(this.leftCheck1);
        this.leftRays.push(this.leftCheck2);
        this.rightRays.push(this.rightCheck1);
        this.rightRays.push(this.rightCheck2);
        this.wallContact = { left: false, right: false, up: false, down: false };
        this.calculateRegularJumpSettings();
        this.whiteEffect = this.game.add.sprite(0, 0, konstants_1.Konstants.mega_man, 'white_effect.png');
        this.whiteEffect.alpha = 0.5;
        this.whiteEffect.visible = false;
        this.addChild(this.whiteEffect);
        this.bossPos.push({
            x: 311.5,
            y: 73,
        });
        this.bossPos.push({
            x: 314.5,
            y: 73,
        });
        this.bossPos.push({
            x: 317.5,
            y: 73,
        });
        this.setCombatSpeed(this.defaultCombatSpeed);
        this.bulletSpeed = this.defaultBulletSpeed;
    }
    getCombatSpeed() {
        return this.combatSpeed;
    }
    setCombatSpeed(speed) {
        this.combatSpeed = speed;
    }
    getCombatSpeedInterval() {
        return this.combatSpeedInterval;
    }
    getMinCombatSpeed() {
        return this.minCombatSpeed;
    }
    incrementBulletSpeed() {
        this.bulletSpeed = this.bulletSpeed + this.bulletSpeedIncrement;
        if (this.bulletSpeed > this.maxBulletSpeed) {
            this.bulletSpeed = this.maxBulletSpeed;
        }
    }
    show() {
        this.visible = true;
        this.animations.play(IceManAnimations.taunt);
    }
    performTaunt() {
        this.animations.play(IceManAnimations.taunt);
    }
    shoot() {
        this.game.sound.play(konstants_1.AudioName.ice_slasher);
        this.isShielded = false;
        let bullet = this.myWorld.entityManager.createBasicBullet(this, this.position.x - 4, this.position.y - 12, 6, 6, konstants_1.EntityType.ice_man, konstants_1.EntityType.ice_man_bullet, 'bullet_01');
        bullet.horizontalSpeed = this.bulletSpeed;
        bullet.targetSpeed.x = bullet.horizontalSpeed * -1;
        bullet.animations.add('active', ['bullet_01', 'bullet_02'], 10, true);
        bullet.animations.play('active');
    }
    takeDamage(damage, damageDir = new Phaser.Point(0, 0)) {
        if (this.isShielded) {
            this.game.sound.play(konstants_1.AudioName.dink);
            return;
        }
        if (this.health <= 0) {
            return;
        }
        if (this.isInvincible) {
            return;
        }
        this.healthMeter.takeEnergy(damage);
        this.health -= damage;
        this.targetSpeed.x = 30 * damageDir.x;
        this.targetSpeed.y = 0;
        if (this.health <= 0) {
            this.game.sound.play(konstants_1.AudioName.explosion);
            let speed = 24;
            this.addDeathEffect(0, -speed); // top
            this.addDeathEffect(speed, 0); // right
            this.addDeathEffect(0, speed); // bottom
            this.addDeathEffect(-speed, 0); // left
            speed = 40;
            this.addDeathEffect(0, -speed); // top
            this.addDeathEffect(Math.cos(45 * (Math.PI / 180)) * speed, Math.sin(-45 * (Math.PI / 180)) * speed); // top-right
            this.addDeathEffect(speed, 0); // right
            this.addDeathEffect(Math.cos(45 * (Math.PI / 180)) * speed, Math.sin(45 * (Math.PI / 180)) * speed); // bottom-right
            this.addDeathEffect(0, speed); // bottom
            this.addDeathEffect(Math.cos(135 * (Math.PI / 180)) * speed, Math.sin(45 * (Math.PI / 180)) * speed); // bottom-left
            this.addDeathEffect(-speed, 0); // left
            this.addDeathEffect(Math.cos(135 * (Math.PI / 180)) * speed, Math.sin(-45 * (Math.PI / 180)) * speed); // top-left
            this.health = 0;
            this.myWorld.dropManager.dropBossItem(konstants_1.EntityType.ice_man_boss_item, this.bossData.bossItemSpawnPosition.x * 16, this.bossData.bossItemSpawnPosition.y * 16);
            this.myWorld.createExplosionEffect(this.getPosition().x, this.getPosition().y - this.hitbox.halfHeight);
            this.destroyed.dispatch(this);
            this.kill();
        }
        else {
            this.game.sound.play(konstants_1.AudioName.enemy_damage);
            this.isHurt = true;
            this.isInvincible = true;
            this.isBlinking = true;
            this.myWorld.createHurtDust(this.getPosition().x - 2, this.getPosition().y - 40);
            this.myWorld.createHurtDust(this.getPosition().x - 12, this.getPosition().y - 36);
            this.myWorld.createHurtDust(this.getPosition().x + 8, this.getPosition().y - 36);
            this.whiteEffect.visible = true;
            this.whiteEffect.position.x = -12;
            this.whiteEffect.position.y = -24;
        }
    }
}
exports.IceMan = IceMan;
var IceManState;
(function (IceManState) {
    IceManState["idle"] = "idle";
    IceManState["choose_next_position"] = "choose_next_position";
    IceManState["jump"] = "jump";
    IceManState["shoot_going_down"] = "shoot_going_down";
    IceManState["shoot_going_up"] = "shoot_going_up";
    IceManState["small_jump"] = "small_jump";
    IceManState["change_combat_speed"] = "change_combat_speed";
})(IceManState || (IceManState = {}));
class IceManIdleState {
    constructor(actor) {
        this.name = IceManState.idle;
        this.actor = actor;
    }
    enter() {
        // console.log('Ice Man enter: ' + this.name);
        this.initialized = true;
        this.actor.animations.play(IceManAnimations.idle);
    }
    update() {
        this.actor.fsm.changeState(IceManState.choose_next_position);
    }
    exit() {
        // console.log('Ice Man exit: ' + this.name);
        this.initialized = false;
    }
}
class IceManChooseNextPositionState {
    constructor(actor) {
        this.name = IceManState.choose_next_position;
        this.actor = actor;
    }
    enter() {
        // console.log('Ice Man enter: ' + this.name);
        this.initialized = true;
        if (this.actor.currentPosIdx == this.actor.maxIdx - 1) {
            this.actor.posDirection = -1;
        }
        else if (this.actor.currentPosIdx == 0) {
            this.actor.posDirection = 1;
        }
        if (this.actor.posDirection == 1) {
            this.actor.currentPosIdx++;
        }
        else if (this.actor.posDirection == -1) {
            this.actor.currentPosIdx--;
        }
        if (this.actor.currentPosIdx == this.actor.maxIdx) {
            this.actor.currentPosIdx = this.actor.maxIdx - 1;
        }
        else if (this.actor.currentPosIdx == -1) {
            this.actor.posDirection = 0;
        }
        this.goToX = this.actor.bossPos[this.actor.currentPosIdx].x * 16;
        this.dirX = mathutil_1.MathUtil.sign(this.goToX - this.actor.getPosition().x);
        this.actor.targetSpeed.x = this.actor.horizontalSpeed * this.dirX;
        this.actor.animations.play(IceManAnimations.run);
    }
    update() {
        this.actor.setFacingDirection(-this.dirX);
        if (helper_1.Helper.distanceTo3(this.actor.getPosition().x, 0, this.goToX, 0) < 2) {
            this.actor.getPosition().x = this.goToX;
            this.actor.position.x = (this.actor.getPosition().x + 0.5) | 0;
            this.actor.fsm.changeState(IceManState.jump);
            return;
        }
    }
    exit() {
        // console.log('Ice Man exit: ' + this.name);
        this.initialized = false;
    }
}
class IceManJumpState {
    constructor(actor) {
        this.name = IceManState.jump;
        this.fixedTime = 1 / 60;
        this.g = -300;
        this.t = 0;
        this.v = 190;
        this.actor = actor;
    }
    enter() {
        // console.log('Ice Man enter: ' + this.name);
        this.initialized = true;
        this.actor.animations.play(IceManAnimations.idle);
        this.actor.setFacingDirection(-1);
        this.actor.targetSpeed.x = 0;
        this.actor.targetSpeed.y = 0;
        this.actor.useGravity = false;
        this.startX = this.actor.bossPos[this.actor.currentPosIdx].x * 16;
        this.startY = this.actor.bossPos[this.actor.currentPosIdx].y * 16;
        this.vx = this.v;
        this.vy = -this.v;
        this.tMax = this.vy / this.g;
    }
    update() {
        this.actor.getPosition().x = 0;
        this.actor.getPosition().y = (this.vy * this.t) - (0.5 * this.g * this.t * this.t);
        this.actor.getPosition().x += this.startX;
        this.actor.getPosition().y += this.startY;
        this.t += this.fixedTime;
        this.actor.position.x = (this.actor.getPosition().x + 0.5) | 0;
        this.actor.position.y = this.actor.getPosition().y;
        if (this.t >= this.tMax) {
            this.actor.fsm.changeState(IceManState.shoot_going_down);
            return;
        }
    }
    exit() {
        // console.log('Ice Man exit: ' + this.name);
        this.initialized = false;
        this.t = 0;
    }
}
class IceManShootGoingDownState {
    constructor(actor) {
        this.name = IceManState.shoot_going_down;
        this.movementElapsedTime = 0;
        this.movementCompleted = false;
        this.shotCount = 0;
        this.maxShots = 3;
        this.shootElapsedTime = 0;
        this.shootEndTime = 0;
        this.shotTracker = new Array();
        this.shootingCompleted = false;
        this.fixedTime = (1 / 60) * 1000;
        this.delayElapsedTime = 0;
        this.delayEndTime = 500;
        this.delayCompleted = false;
        this.actor = actor;
    }
    enter() {
        // console.log('Ice Man enter: ' + this.name);
        this.initialized = true;
        this.startX = this.actor.getPosition().x;
        this.startY = this.actor.getPosition().y;
        this.endX = this.actor.bossPos[this.actor.currentPosIdx].x * 16;
        this.endY = this.actor.bossPos[this.actor.currentPosIdx].y * 16;
        this.movementEndTime = this.actor.getCombatSpeed();
        this.shootEndTime = this.movementEndTime / 3;
    }
    update() {
        this.checkShooting();
        this.checkMovement();
        this.checkDelay();
        if (this.delayCompleted) {
            this.actor.fsm.changeState(IceManState.shoot_going_up);
            return;
        }
    }
    exit() {
        // console.log('Ice Man exit: ' + this.name);
        this.initialized = false;
        this.movementElapsedTime = 0;
        this.shootElapsedTime = 0;
        this.delayElapsedTime = 0;
        this.shotCount = 0;
        this.movementCompleted = false;
        this.shootingCompleted = false;
        this.delayCompleted = false;
    }
    checkShooting() {
        if (this.shootingCompleted) {
            return;
        }
        this.shootElapsedTime += this.fixedTime;
        if (this.shootElapsedTime >= this.shootEndTime) {
            this.actor.animations.play(IceManAnimations.attack);
            this.shotCount++;
            this.shootElapsedTime = 0;
            this.actor.shoot();
            if (this.shotCount >= this.maxShots) {
                this.shootingCompleted = true;
            }
        }
    }
    checkMovement() {
        if (this.movementCompleted) {
            return;
        }
        this.movementElapsedTime += this.fixedTime;
        this.actor.getPosition().y = mathutil_1.MathUtil.lerp(this.startY, this.endY, this.movementElapsedTime / this.movementEndTime);
        if (this.movementElapsedTime >= this.movementEndTime) {
            if (this.shotCount >= this.maxShots) {
                this.actor.getPosition().y = this.endY;
                this.actor.position.y = this.actor.getPosition().y;
                this.movementCompleted = true;
            }
        }
    }
    checkDelay() {
        if (!this.shootingCompleted || !this.movementCompleted) {
            return;
        }
        this.delayElapsedTime += this.fixedTime;
        if (this.delayElapsedTime >= this.delayEndTime) {
            this.delayCompleted = true;
        }
    }
}
class IceManShootGoingUpState {
    constructor(actor) {
        this.name = IceManState.shoot_going_up;
        this.movementElapsedTime = 0;
        this.movementCompleted = false;
        this.shotCount = 0;
        this.maxShots = 3;
        this.shootElapsedTime = 0;
        this.shootEndTime = 0;
        this.shootingCompleted = false;
        this.fixedTime = (1 / 60) * 1000;
        this.actor = actor;
    }
    enter() {
        // console.log('Ice Man enter: ' + this.name);
        this.initialized = true;
        this.startX = this.actor.getPosition().x;
        this.startY = this.actor.getPosition().y;
        this.endX = this.actor.bossPos[this.actor.currentPosIdx].x * 16;
        this.endY = this.actor.bossPos[this.actor.currentPosIdx].y * 16 - (16 * 4);
        this.movementEndTime = this.actor.getCombatSpeed();
        this.shootEndTime = this.movementEndTime / 3;
        this.shootElapsedTime = this.shootEndTime;
    }
    update() {
        this.checkShooting();
        this.checkMovement();
        if (this.shootingCompleted && this.movementCompleted) {
            this.actor.fsm.changeState(IceManState.change_combat_speed);
            return;
        }
    }
    exit() {
        // console.log('Ice Man exit: ' + this.name);
        this.initialized = false;
        this.movementElapsedTime = 0;
        this.shootElapsedTime = 0;
        this.shotCount = 0;
        this.movementCompleted = false;
        this.shootingCompleted = false;
    }
    checkShooting() {
        if (this.shootingCompleted) {
            return;
        }
        this.shootElapsedTime += this.actor.game.time.elapsedMS;
        if (this.shootElapsedTime >= this.shootEndTime) {
            this.actor.animations.play(IceManAnimations.attack);
            this.shotCount++;
            this.shootElapsedTime = 0;
            this.actor.shoot();
            if (this.shotCount >= this.maxShots) {
                this.shootingCompleted = true;
            }
        }
    }
    checkMovement() {
        if (this.movementCompleted) {
            return;
        }
        this.movementElapsedTime += this.actor.game.time.elapsedMS;
        this.actor.getPosition().y = mathutil_1.MathUtil.lerp(this.startY, this.endY, this.movementElapsedTime / this.movementEndTime);
        if (this.movementElapsedTime >= this.movementEndTime) {
            if (this.shotCount >= this.maxShots) {
                this.movementCompleted = true;
            }
        }
    }
}
class IceManChangeCombatSpeedState {
    constructor(actor) {
        this.name = IceManState.change_combat_speed;
        this.actor = actor;
    }
    enter() {
        // console.log('Ice Man enter: ' + this.name);
        this.initialized = true;
        this.actor.setCombatSpeed(this.actor.getCombatSpeed() - this.actor.getCombatSpeedInterval());
        if (this.actor.getCombatSpeed() < this.actor.getMinCombatSpeed()) {
            this.actor.setCombatSpeed(this.actor.getMinCombatSpeed());
        }
        this.actor.incrementBulletSpeed();
    }
    update() {
        this.actor.fsm.changeState(IceManState.small_jump);
    }
    exit() {
        // console.log('Ice Man exit: ' + this.name);
        this.initialized = false;
    }
}
class IceManSmallJumpState {
    constructor(actor) {
        this.name = IceManState.small_jump;
        this.actor = actor;
    }
    enter() {
        // console.log('Ice Man enter: ' + this.name);
        this.initialized = true;
        this.actor.animations.play(IceManAnimations.idle);
        this.actor.targetSpeed.x = 0;
        this.actor.targetSpeed.y = -50;
        this.actor.useGravity = true;
    }
    update() {
        if (this.actor.isOnGround) {
            this.actor.fsm.changeState(IceManState.choose_next_position);
        }
    }
    exit() {
        // console.log('Ice Man exit: ' + this.name);
        this.initialized = false;
    }
}


/***/ }),
/* 59 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PowerUp = void 0;
const entity_1 = __webpack_require__(16);
const vector2_1 = __webpack_require__(20);
const ray_1 = __webpack_require__(19);
const ray_2 = __webpack_require__(19);
const sat2d_1 = __webpack_require__(17);
class PowerUp extends entity_1.Entity {
    constructor(myWorld, tag, myEntityType, game, x, y, key, frame) {
        super(myWorld, tag, myEntityType, game, x, y, key, frame);
        this.myWorld = myWorld;
        this.tag = tag;
        this.myEntityType = myEntityType;
        this.skinWidth = 5;
        this.useGravity = false;
        this.gravityY = 500;
        this.targetSpeed = new Phaser.Point(0, 0);
        this.energyRestore = 0;
        this.health = 1;
        this.maxHealth = 1;
        this.getPosition().x = x;
        this.getPosition().y = y;
        this.position.x = (this.getPosition().x + 0.5) | 0;
        this.position.y = this.getPosition().y;
        this.anchor.setTo(0.5, 0.5);
        this.groundRayLeft = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_2.RayType.not_infinite);
        this.groundRayRight = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_2.RayType.not_infinite);
    }
    manualUpdate() {
        if (!this.alive) {
            return;
        }
        if (this.isGlobal) {
            return;
        }
        if (this.useGravity) {
            this.targetSpeed.y += this.gravityY * this.game.time.physicsElapsed;
        }
        if (this.targetSpeed.y >= 300) {
            this.targetSpeed.y = 300;
        }
        this.velocity.x = this.targetSpeed.x;
        this.velocity.y = this.targetSpeed.y;
        this.getPosition().x += this.velocity.x * this.game.time.physicsElapsed;
        this.getPosition().y += this.velocity.y * this.game.time.physicsElapsed;
        this.position.x = (this.getPosition().x + 0.5) | 0;
        this.position.y = this.getPosition().y;
        this.updateRect();
        this.castRays();
        this.showDebugRays();
    }
    checkSurfaceCollisions(surfaces) {
        if (this.isGlobal) {
            return;
        }
        if (!this.useGravity) {
            return;
        }
        if (this.velocity.y < 0) {
            return;
        }
        let into;
        let tempSurface;
        let surfaceHit;
        let tempVec1 = new vector2_1.Vector2();
        let tempVec2 = new vector2_1.Vector2();
        for (let i = 0; i < surfaces.length; i++) {
            tempSurface = surfaces[i];
            if (!tempSurface.collidable) {
                continue;
            }
            let nx = tempSurface.dir.y;
            let ny = -tempSurface.dir.x;
            // Check floors (ny == -1 is a floor)
            if (ny != -1) {
                continue;
            }
            tempVec1.x = tempSurface.p1.x;
            tempVec1.y = tempSurface.p1.y;
            tempVec2.x = tempSurface.p2.x;
            tempVec2.y = tempSurface.p2.y;
            into = sat2d_1.SAT2D.testRayVsRay(this.groundRayLeft, new ray_1.Ray(tempVec1, tempVec2, ray_2.RayType.not_infinite), into);
            if (into != null) {
                let dx = into.ray1.end.x - into.ray1.start.x;
                let dy = into.ray1.end.y - into.ray1.start.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                let trueDistance = distance * into.u1;
                let contactX = into.ray1.start.x + into.ray1.dir.x * into.u1;
                let contactY = into.ray1.start.y + trueDistance;
                if (trueDistance > this.hitbox.halfHeight) {
                    continue;
                }
                this.getPosition().y = contactY - this.hitbox.halfHeight;
                this.setVelocity(this.getVelocity().x, 0);
                this.targetSpeed.y = 0;
            }
            into = sat2d_1.SAT2D.testRayVsRay(this.groundRayRight, new ray_1.Ray(tempVec1, tempVec2, ray_2.RayType.not_infinite), into);
            if (into != null) {
                let dx = into.ray1.end.x - into.ray1.start.x;
                let dy = into.ray1.end.y - into.ray1.start.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                let trueDistance = distance * into.u1;
                let contactX = into.ray1.start.x + into.ray1.dir.x * into.u1;
                let contactY = into.ray1.start.y + trueDistance;
                // this.pGraphicsDebug.drawCircle(contactX, contactY, 3);
                if (trueDistance > this.hitbox.halfHeight) {
                    continue;
                }
                this.getPosition().y = contactY - this.hitbox.halfHeight;
                this.setVelocity(this.getVelocity().x, 0);
                this.targetSpeed.y = 0;
            }
        }
    }
    checkCollisionWithPlayer() {
    }
    doAction() {
    }
    castRays() {
        let centerX = this.getPosition().x;
        let centerY = this.getPosition().y;
        // cast ground rays
        this.groundRayLeft.start = new vector2_1.Vector2(centerX - this.hitbox.halfWidth, centerY);
        this.groundRayLeft.end = new vector2_1.Vector2(centerX - this.hitbox.halfWidth, centerY + this.hitbox.height);
        this.groundRayRight.start = new vector2_1.Vector2(centerX + this.hitbox.halfWidth, centerY);
        this.groundRayRight.end = new vector2_1.Vector2(centerX + this.hitbox.halfWidth, centerY + this.hitbox.height);
    }
    showDebugRays() {
        // this.pGraphicsDebug.lineStyle(1, 0);
        // this.pGraphicsDebug.moveTo(this.groundRayLeft.start.x, this.groundRayLeft.start.y);
        // this.pGraphicsDebug.lineTo(this.groundRayLeft.end.x, this.groundRayLeft.end.y);
        // this.pGraphicsDebug.moveTo(this.groundRayRight.start.x, this.groundRayRight.start.y);
        // this.pGraphicsDebug.lineTo(this.groundRayRight.end.x, this.groundRayRight.end.y);
    }
}
exports.PowerUp = PowerUp;


/***/ }),
/* 60 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VanishingBlock = void 0;
const konstants_1 = __webpack_require__(2);
const entity_1 = __webpack_require__(16);
var VinishingBlockAnimations;
(function (VinishingBlockAnimations) {
    VinishingBlockAnimations["idle"] = "idle";
    VinishingBlockAnimations["appear"] = "appear";
})(VinishingBlockAnimations || (VinishingBlockAnimations = {}));
class VanishingBlock extends entity_1.Entity {
    constructor(myWorld, tag, e, game, x, y, key, frame) {
        super(myWorld, tag, e, game, x, y, key, frame);
        this.horizontalSpeed = 50;
        this.targetSpeed = new Phaser.Point(0, 0);
        this.surfaces = new Array();
        this.appear = 0;
        this.appearSaved = 0;
        this.delay = 0;
        this.startDelay = 0;
        this.appearFor = 0;
        this.hideFor = 0;
        this.isVisible = false;
        this.m_delayElapsedTime = 0;
        this.m_appearElapsedTime = 0;
        this.isActive = false;
        this.getPosition().x = x;
        this.getPosition().y = y;
        this.position.x = this.getPosition().x;
        this.position.x = this.getPosition().x;
        this.smoothed = true;
        this.health = 1;
        this.maxHealth = 1;
        this.isShielded = false;
        // this.fsm = new StateMachine();
        // this.fsm.addState(VanishingBlockState.start_delay, new VanishingBlockStartDelayState(this));
        // this.fsm.addState(VanishingBlockState.hide, new VanishingBlockHideState(this));
        // this.fsm.addState(VanishingBlockState.appear, new VanishingBlockAppearState(this));
        this.animations.add(VinishingBlockAnimations.idle, ['vanishing_block_01'], 10, false, false);
        this.animations.add(VinishingBlockAnimations.appear, ['vanishing_block_02', 'vanishing_block_03', 'vanishing_block_04', 'vanishing_block_05', 'vanishing_block_01'], 10, false, false);
        this.animations.play(VinishingBlockAnimations.idle);
        this.visible = false;
    }
    manualUpdate() {
        // this.pGraphicsDebug.clear();
        if (!this.enabled) {
            return;
        }
        if (!this.alive) {
            return;
        }
        // this.fsm.currentState.update();
        this.velocity.x = this.targetSpeed.x;
        this.velocity.y = this.targetSpeed.y;
        this.getPosition().x += this.velocity.x * this.game.time.physicsElapsed;
        this.getPosition().y += this.velocity.y * this.game.time.physicsElapsed;
        this.position.x = (this.getPosition().x + 0.5) | 0;
        this.position.y = this.getPosition().y - 16;
        this.updateRect();
    }
    /**
     * Initialize the start_delay state otherwise endTime is 0.
     */
    initialize() {
        this.updateRect();
        // this.fsm.changeState(VanishingBlockState.start_delay);
    }
    disable() {
        // this.fsm.changeState(VanishingBlockState.hide);
        // (<VanishingBlockHideState>this.fsm.states.Item(VanishingBlockState.hide)).elapsedTime = 0;
        // (<VanishingBlockHideState>this.fsm.states.Item(VanishingBlockState.appear)).elapsedTime = 0;
        this.enabled = false;
    }
    enable() {
        this.enabled = true;
        // this.fsm.changeState(VanishingBlockState.start_delay);
    }
    updateRect() {
        this.hitbox.x = this.getPosition().x;
        this.hitbox.y = this.getPosition().y - 16;
    }
}
exports.VanishingBlock = VanishingBlock;
var VanishingBlockState;
(function (VanishingBlockState) {
    VanishingBlockState["start_delay"] = "start_delay";
    VanishingBlockState["hide"] = "hidden";
    VanishingBlockState["appear"] = "appear";
})(VanishingBlockState || (VanishingBlockState = {}));
class VanishingBlockStartDelayState {
    constructor(actor) {
        this.name = VanishingBlockState.start_delay;
        this.elapsedTime = 0;
        this.endTime = 0;
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
        this.actor.visible = false;
        this.endTime = this.actor.startDelay;
    }
    update() {
        this.elapsedTime += this.actor.game.time.elapsedMS;
        if (this.elapsedTime >= this.endTime) {
            this.actor.fsm.changeState(VanishingBlockState.appear);
        }
    }
    exit() {
        this.initialized = false;
        this.elapsedTime = 0;
    }
}
class VanishingBlockAppearState {
    constructor(actor) {
        this.name = VanishingBlockState.appear;
        this.elapsedTime = 0;
        this.endTime = 0;
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
        this.actor.visible = true;
        this.actor.game.sound.play(konstants_1.AudioName.vanishing_blocks);
        this.actor.surfaces.forEach(element => {
            element.collidable = true;
        });
        this.endTime = this.actor.appearFor;
        this.actor.animations.play(VinishingBlockAnimations.appear);
    }
    update() {
        this.elapsedTime += this.actor.game.time.elapsedMS;
        if (this.elapsedTime >= this.endTime) {
            this.actor.fsm.changeState(VanishingBlockState.hide);
        }
    }
    exit() {
        this.initialized = false;
        this.elapsedTime = 0;
    }
}
class VanishingBlockHideState {
    constructor(actor) {
        this.name = VanishingBlockState.hide;
        this.elapsedTime = 0;
        this.endTime = 0;
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
        this.actor.visible = false;
        this.actor.surfaces.forEach(element => {
            element.collidable = false;
        });
        this.endTime = this.actor.hideFor;
    }
    update() {
        // this.elapsedTime += this.actor.game.time.elapsedMS;
        // if (this.elapsedTime >= this.endTime) {
        //     this.actor.fsm.changeState(VanishingBlockState.appear);
        // }
    }
    exit() {
        this.initialized = false;
        this.elapsedTime = 0;
    }
}
// class VanishingBlockStartDelayState implements State {
//     name: string = VanishingBlockState.start_delay;
//     initialized: boolean;
//     actor: VanishingBlock;
//     elapsedTime: number = 0;
//     endTime: number = 0;
//     constructor(actor: VanishingBlock) {
//         this.actor = actor;
//     }
//     enter(): void {
//         this.initialized = true;
//         this.actor.visible = false;
//         this.endTime = this.actor.startDelay;
//     }
//     update(): void {
//         this.elapsedTime += this.actor.game.time.elapsedMS;
//         if (this.elapsedTime >= this.endTime) {
//             this.actor.fsm.changeState(VanishingBlockState.appear);
//         }
//     }
//     exit(): void {
//         this.initialized = false;
//         this.elapsedTime = 0;
//     }
// }
// class VanishingBlockHideState implements State {
//     name: string = VanishingBlockState.hide;
//     initialized: boolean;
//     actor: VanishingBlock;
//     elapsedTime: number = 0;
//     endTime: number = 0;
//     constructor(actor: VanishingBlock) {
//         this.actor = actor;
//     }
//     enter(): void {
//         this.initialized = true;
//         this.actor.visible = false;
//         this.actor.surfaces.forEach(element => {
//             element.collidable = false;
//         });
//         this.endTime = this.actor.hideFor;
//     }
//     update(): void {
//         this.elapsedTime += this.actor.game.time.elapsedMS;
//         if (this.elapsedTime >= this.endTime) {
//             this.actor.fsm.changeState(VanishingBlockState.appear);
//         }
//     }
//     exit(): void {
//         this.initialized = false;
//         this.elapsedTime = 0;
//     }
// }
// class VanishingBlockAppearState implements State {
//     name: string = VanishingBlockState.appear;
//     initialized: boolean;
//     actor: VanishingBlock;
//     private elapsedTime: number = 0;
//     private endTime: number = 0;
//     constructor(actor: VanishingBlock) {
//         this.actor = actor;
//     }
//     enter(): void {
//         this.initialized = true;
//         this.actor.visible = true;
//         this.actor.game.sound.play(AudioName.vanishing_blocks);
//         this.actor.surfaces.forEach(element => {
//             element.collidable = true;
//         });
//         this.endTime = this.actor.appearFor;
//         this.actor.animations.play(VinishingBlockAnimations.appear);
//     }
//     update(): void {
//         this.elapsedTime += this.actor.game.time.elapsedMS;
//         if (this.elapsedTime >= this.endTime) {
//             this.actor.fsm.changeState(VanishingBlockState.hide);
//         }
//     }
//     exit(): void {
//         this.initialized = false;
//         this.elapsedTime = 0;
//     }
// }


/***/ }),
/* 61 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Pick = void 0;
const konstants_1 = __webpack_require__(2);
const entity_1 = __webpack_require__(16);
const helper_1 = __webpack_require__(24);
const mathutil_1 = __webpack_require__(34);
// todo: i feel like pick and bullet should be merged
//          or bullet should have bulletMovement
//          create standardBulletMovement for lemons
class Pick extends entity_1.Entity {
    constructor(owner, world, tag, e, game, x, y, key, frame) {
        super(world, tag, e, game, x, y, key, frame);
        this.velocity = new Phaser.Point(0, 0);
        this.horizontalSpeed = 160;
        this.useGravity = false;
        this.gravityY = 500;
        this.targetSpeed = new Phaser.Point(0, 0);
        this.canCollideWithOtherBullet = false;
        this.bulletMovement = null;
        this.smoothed = false;
        this.owner = owner;
        this.health = 1;
        this.maxHealth = 1;
        this.getPosition().x = x;
        this.getPosition().y = y;
        this.position.x = this.getPosition().x;
        this.position.y = this.getPosition().y;
        this.anchor.setTo(0.5, 0.5);
    }
    manualUpdate() {
        if (!this.alive) {
            return;
        }
        this.bulletMovement.move();
        this.getPosition().x = this.bulletMovement.position.x;
        this.getPosition().y = this.bulletMovement.position.y;
        this.position.x = (this.getPosition().x + 0.5) | 0;
        this.position.y = this.getPosition().y;
        this.updateRect();
    }
    checkCollideWith(other) {
        if (helper_1.Helper.distanceTo(other, this) > 21) {
            return;
        }
        // The bullet cannot hit itself.
        if (other == this) {
            return;
        }
        // The bullet cannot hit other bullets shot by the same owner.
        if (other.tag == konstants_1.TagType.bullet) {
            let bullet = other;
            if (this.owner == bullet.owner) {
                return;
            }
        }
        // Go through spike.
        else if (other.myEntityType == konstants_1.EntityType.spike) {
            return;
        }
        // Go through explosions.
        else if (other.myEntityType == konstants_1.EntityType.explosion_from_killer_bullet) {
            return;
        }
        // The bullet cannot hit the owner who shot it.
        if (this.owner == other) {
            return;
        }
        if (!this.canCollideWithOtherBullet) {
            if (other.tag == konstants_1.TagType.bullet) {
                let bullet = other;
                // Player bullet cannot collide with enemy bullet.
                if (this.owner.tag == konstants_1.TagType.player && bullet.owner.tag != konstants_1.TagType.player) {
                    return;
                }
                // Enemy bullet cannot collide with player bullet.
                if (this.owner.tag != konstants_1.TagType.player && bullet.owner.tag == konstants_1.TagType.player) {
                    return;
                }
            }
        }
        // Enemy bullet cannot collide (hurt/kill) with other enemies.
        if (this.owner.tag != konstants_1.TagType.player) {
            if (other.tag != konstants_1.TagType.player) {
                return;
            }
        }
        // ***************************************************
        // In the future bullets will be allowed to hit other bullets since they don't share the same owner.
        // A boolean will keep track of this.
        // this.graphicsDebug.drawRect(this.getPosition().x + this.hitbox.x - this.hitbox.width * 0.5, this.getPosition().y - this.hitbox.height + this.hitbox.y, this.hitbox.width, this.hitbox.height);
        if (!Phaser.Rectangle.intersects(this.hitbox, other.hitbox)) {
            return;
        }
        // This bullets hits enemy 'met'. Reflect this bullet if met is shielded.
        // if (other.myEntityType == EntityType.met) {
        //     let met: Met = <Met>other;
        //     if (met.isShielded) {
        //         this.reflect();
        //         return;
        //     }
        // }
        other.takeDamage(this.contactDamage, helper_1.Helper.directionTo(this, other));
        // this.takeDamage(1);
    }
    takeDamage(damage) {
        if (this.health <= 0) {
            return;
        }
        this.health -= damage;
        if (this.health == 0) {
            this.destroyed.dispatch();
            this.kill();
        }
    }
    reflect() {
        let x = this.targetSpeed.x > 0 ? 135 : 45;
        this.targetSpeed.x = 200 * Math.cos(mathutil_1.MathUtil.sign(this.horizontalSpeed) * x * (Math.PI / 180));
        this.targetSpeed.y = 200 * Math.sin(mathutil_1.MathUtil.sign(this.horizontalSpeed) * -45 * (Math.PI / 180));
    }
}
exports.Pick = Pick;


/***/ }),
/* 62 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PickBulletMovement = void 0;
class PickBulletMovement {
    constructor(owner, initialPosition, target, duration, gravity) {
        this.owner = owner;
        this.initialPosition = initialPosition;
        this.target = target;
        this.duration = duration;
        this.gravity = gravity;
        this.destroyed = new Phaser.Signal();
        this.position = new Phaser.Point();
        this.velocity = new Phaser.Point();
        this.t = 0;
        this.fixedTime = 1 / 60;
        this.position.x = initialPosition.x;
        this.position.y = initialPosition.y;
        // this.t = 0;
        // this.fixedTime = 1 / 60;
        // this.g = -160;
        // this.x0;
        // this.y0;
        // this.duration = 3;
        // this.vx;
        // this.vy;
        // this.targetX = 500;
        // this.targetY = 300;
        // this.x = 0;
        // this.y = 0;
        // this.ball = new Ball(100, 300, 5);
        // this.targetBall = new Ball(this.targetX, this.targetY, 10);
        // // Set the origin.
        // this.x0 = this.ball.startPosition.x;
        // this.y0 = this.ball.startPosition.y;
        // this.x = this.x0;
        // this.y = this.y0;
        // // Calculate the initial velocity: 'vx' and 'vy'.
        // this.vx = (this.targetX - this.x0) / this.duration; // v = d / t
        // this.vy = (this.targetY + 0.5 * this.g * this.duration * this.duration - this.y0) / this.duration; // v = (ty + 0.5 * g * t * t - y0) / t
        this.velocity.x = (this.target.x - this.initialPosition.x) / this.duration; // v = d / t
        this.velocity.y = (this.target.y + 0.5 * this.gravity * this.duration * this.duration - this.initialPosition.y) / this.duration;
        // console.log('duration: ' + this.duration);
        // console.log('target x: ' + this.target.x);
        // console.log('initial pos x: ' + this.initialPosition.x);
        // console.log(this.velocity);
    }
    move() {
        this.position.x = this.velocity.x * this.t;
        this.position.y = -0.5 * this.gravity * this.t * this.t + this.velocity.y * this.t;
        this.position.x += this.initialPosition.x;
        this.position.y += this.initialPosition.y;
        this.t += this.fixedTime;
        // this.x = this.vx * this.t;
        // this.y = -0.5 * this.g * this.t * this.t + this.vy * this.t;
        // this.x += this.x0;
        // this.y += this.y0;
        // this.t += this.fixedTime;
        // this.ball.position.x = this.x;
        // this.ball.position.y = this.y;
    }
}
exports.PickBulletMovement = PickBulletMovement;


/***/ }),
/* 63 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ThrowableObject = void 0;
const konstants_1 = __webpack_require__(2);
const entity_1 = __webpack_require__(16);
const helper_1 = __webpack_require__(24);
const mathutil_1 = __webpack_require__(34);
/**
 * NOTE:
 * Set the hitbox when you create this entity.
 */
class ThrowableObject extends entity_1.Entity {
    constructor(owner, myWorld, tag, e, game, x, y, key, frame) {
        super(myWorld, tag, e, game, x, y, key, frame);
        this.velocity = new Phaser.Point(0, 0);
        this.useGravity = false;
        this.gravityY = 500;
        this.canCollideWithOtherBullet = false;
        this.isReflected = false;
        this.isBreakable = true;
        this.canCollideWithWalls = true;
        this.speed = 0;
        this.direction = new Phaser.Point(0, 0);
        this.targetSpeed = new Phaser.Point(0, 0);
        this.smoothed = false;
        this.owner = owner;
        this.health = 1;
        this.maxHealth = 1;
        this.getPosition().x = x;
        this.getPosition().y = y;
        this.position.x = this.getPosition().x;
        this.position.y = this.getPosition().y;
        this.anchor.setTo(0.5, 0.5);
    }
    manualUpdate() {
        // this.pGraphicsDebug.clear();
        if (!this.alive) {
            return;
        }
        if (this.useGravity) {
            this.targetSpeed.y += this.gravityY * this.game.time.physicsElapsed;
        }
        this.velocity.x = this.targetSpeed.x;
        this.velocity.y = this.targetSpeed.y;
        this.getPosition().x += this.velocity.x * this.game.time.physicsElapsed;
        this.getPosition().y += this.velocity.y * this.game.time.physicsElapsed;
        this.position.x = (this.getPosition().x + 0.5) | 0;
        this.position.y = this.getPosition().y;
        this.updateRect();
    }
    /**
     * Set by the class that is throwing the object.
     * @param direction The direction to throw the object.
     * @param speed The speed at which the object is thrown.
     */
    setParameters(direction, speed) {
        this.direction = direction;
        this.speed = speed;
        this.targetSpeed.x = this.speed * this.direction.x;
        this.targetSpeed.y = this.speed * this.direction.y;
    }
    /**
     * Set by the entity manager class.
     * Sets the spritesheet key and start frame to use for the mini-breakables that spawn after
     * the base larger breakable breaks.
     * @param smallSpritesheet
     * @param smallStartFrame
     */
    setBreakableParameters(smallSpritesheet, smallStartFrame) {
        this.smallSpritesheet = smallSpritesheet;
        this.smallStartFrame = smallStartFrame;
    }
    updateRect() {
        this.hitbox.x = this.getPosition().x + this.hitboxOffset.x;
        this.hitbox.y = this.getPosition().y + this.hitboxOffset.y;
    }
    /**
     * NOTE: The distance check is not particularly great. Some entities have their position as their middle center.
     *         This causes strange behavior when entities have a large hitbox because the position checked will be
     *         its middle center. Intersection may be missed since distance check will show that the bullet is too
     *         far but yet it actually intersects.  Make sure to keep this in mind when creating the hit boxes.
     * @param other {Entity}
     */
    checkCollideWith(other) {
        if (helper_1.Helper.distanceTo(other, this) > 60) {
            return;
        }
        // The bullet cannot hit itself.
        if (other == this) {
            return;
        }
        // The bullet cannot hit other bullets shot by the same owner.
        if (other.tag == konstants_1.TagType.bullet) {
            let bullet = other;
            if (this.owner == bullet.owner) {
                return;
            }
        }
        // Go through spike.
        else if (other.myEntityType == konstants_1.EntityType.spike) {
            return;
        }
        // Go through explosions.
        else if (other.myEntityType == konstants_1.EntityType.explosion_from_killer_bullet) {
            return;
        }
        // Go through power ups.
        if (other.tag == konstants_1.TagType.power_up) {
            return;
        }
        // The bullet cannot hit the owner who shot it.
        if (this.owner == other) {
            return;
        }
        if (!this.canCollideWithOtherBullet) {
            if (other.tag == konstants_1.TagType.bullet) {
                let bullet = other;
                // Player bullet cannot collide with enemy bullet.
                if (this.owner.tag == konstants_1.TagType.player && bullet.owner.tag != konstants_1.TagType.player) {
                    return;
                }
                // Enemy bullet cannot collide with player bullet.
                if (this.owner.tag != konstants_1.TagType.player && bullet.owner.tag == konstants_1.TagType.player) {
                    return;
                }
                // Enemy bullet cannot collide with enemy bullet.
                if (this.tag == konstants_1.TagType.bullet) {
                    return;
                }
            }
        }
        // Enemy bullet cannot collide (hurt/kill) with other enemies.
        if (this.owner.tag == konstants_1.TagType.enemy) {
            if (other.tag == konstants_1.TagType.enemy) {
                return;
            }
        }
        // ***************************************************
        // In the future bullets will be allowed to hit other bullets since they don't share the same owner.
        // A boolean will keep track of this.
        // this.graphicsDebug.drawRect(this.getPosition().x + this.hitbox.x - this.hitbox.width * 0.5, this.getPosition().y - this.hitbox.height + this.hitbox.y, this.hitbox.width, this.hitbox.height);
        if (!Phaser.Rectangle.intersects(this.hitbox, other.hitbox)) {
            return;
        }
        // This bullets hits enemy 'met'. Reflect this bullet if met is shielded.
        // if (other.myEntityType == EntityType.met) {
        //     let met: Met = <Met>other;
        //     if (met.isShielded) {
        //         this.isReflected = true;
        //         this.reflect();
        //         return;
        //     }
        // }
        if (other.myEntityType == konstants_1.EntityType.spine) {
            if (this.myEntityType == konstants_1.EntityType.bullet_lemon) {
                other.paralyze();
                this.takeDamage(1);
                return;
            }
        }
        if (other.myEntityType == konstants_1.EntityType.cut_man) { // todo: check other bosses
            if (this.myEntityType == konstants_1.EntityType.bullet_lemon) {
                if (other.isInvincible) {
                    return;
                }
            }
        }
        other.takeDamage(this.contactDamage, helper_1.Helper.directionTo(this, other));
        this.takeDamage(1);
    }
    takeDamage(damage) {
        if (this.health <= 0) {
            return;
        }
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            if (this.isBreakable) {
                this.createSmallRock();
                this.createSmallRock();
                this.createSmallRock();
                this.createSmallRock();
            }
            this.destroyed.dispatch();
            this.kill();
        }
    }
    createSmallRock() {
        let throw_1 = this.myWorld.entityManager.createThrowableObject(this.owner, this.getPosition().x, this.getPosition().y, 16, 16, -8, -8, this.smallSpritesheet, this.smallStartFrame, null, null, konstants_1.EntityType.throwable_object);
        throw_1.contactDamage = 0;
        throw_1.isBreakable = false;
        throw_1.canCollideWithWalls = false;
        let rand = Math.random();
        let negOrPos = (Math.random() > 0.5) ? 1 : -1;
        let clone = this.direction.clone();
        clone.y = rand * negOrPos;
        throw_1.setParameters(clone, this.speed + 20);
    }
    reflect() {
        let x = this.targetSpeed.x > 0 ? 135 : 45;
        this.targetSpeed.x = 200 * Math.cos(mathutil_1.MathUtil.sign(this.speed) * x * (Math.PI / 180));
        this.targetSpeed.y = 200 * Math.sin(mathutil_1.MathUtil.sign(this.speed) * -45 * (Math.PI / 180));
    }
}
exports.ThrowableObject = ThrowableObject;


/***/ }),
/* 64 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DropLift = void 0;
const entity_1 = __webpack_require__(16);
const stateMachine_1 = __webpack_require__(33);
var DropLiftAnimations;
(function (DropLiftAnimations) {
    DropLiftAnimations["idle"] = "idle";
    DropLiftAnimations["drop"] = "drop";
    DropLiftAnimations["return"] = "return";
})(DropLiftAnimations || (DropLiftAnimations = {}));
class DropLift extends entity_1.Entity {
    constructor(myWorld, tag, e, game, x, y, key, frame) {
        super(myWorld, tag, e, game, x, y, key, frame);
        this.targetSpeed = new Phaser.Point(0, 0);
        this.start = new Phaser.Point();
        this.end = new Phaser.Point();
        this.gaps = new Array();
        this.getPosition().x = x;
        this.getPosition().y = y;
        this.position.x = (this.getPosition().x + 0.5) | 0;
        this.position.y = this.getPosition().y - 16;
        this.smoothed = true;
        this.fsm = new stateMachine_1.StateMachine();
        this.fsm.addState(DropLiftState.idle, new DropLiftIdleState(this));
        this.fsm.addState(DropLiftState.return, new DropLiftReturnState(this));
        this.fsm.addState(DropLiftState.drop, new DropLiftDropState(this));
        this.animations.add(DropLiftAnimations.idle, ['drop_lift_01'], 10, false, false);
        this.animations.add(DropLiftAnimations.drop, ['drop_lift_01', 'drop_lift_02', 'drop_lift_03'], 20, false, false);
        this.animations.add(DropLiftAnimations.return, ['drop_lift_03', 'drop_lift_02', 'drop_lift_01'], 40, false, false);
        this.animations.play(DropLiftAnimations.idle);
    }
    setPath(path) {
        this.path = path;
        for (let i = 0; i < this.path.length; i++) {
            // start
            if (i == 0 && this.path[i] == '2') {
                this.start.x = this.getPosition().x;
                this.start.y = this.getPosition().y;
                // console.log('start: ' + this.start);
                continue;
            }
            // gap
            if (this.path[i] == '0') {
                // console.log('gap start: ' + ((this.start.x + (16 * i)) - 16));
                // console.log('gap end: ' + (this.start.x + (16 * i)));
                this.gaps.push((this.start.x + (16 * i)) - 16); // start of the gap
                this.gaps.push((this.start.x + (16 * i))); // end of the gap
            }
            // end
            if (i == this.path.length - 1 && this.path[i] == '2') {
                this.end.x = this.getPosition().x + (16 * i);
                this.end.y = this.getPosition().y;
                // console.log('end: ' + this.end);
                continue;
            }
        }
    }
    getGaps() {
        return this.gaps;
    }
    getSurface() {
        return this.surface;
    }
    setSurface(s) {
        this.surface = s;
    }
    getStart() {
        return this.start.clone();
    }
    getEnd() {
        return this.end.clone();
    }
    getDelay() {
        return this.delay;
    }
    setDelay(d) {
        this.delay = d;
    }
    manualUpdate() {
        // this.pGraphicsDebug.clear();
        if (!this.enabled) {
            return;
        }
        if (!this.alive) {
            return;
        }
        this.fsm.currentState.update();
        this.velocity.x = this.targetSpeed.x;
        this.velocity.y = this.targetSpeed.y;
        this.getPosition().x += this.velocity.x * this.game.time.physicsElapsed;
        this.getPosition().y += this.velocity.y * this.game.time.physicsElapsed;
        this.position.x = (this.getPosition().x + 0.5) | 0;
        this.position.y = this.getPosition().y - 16;
        this.surface.p1.x += this.velocity.x * this.game.time.physicsElapsed;
        this.surface.p2.x += this.velocity.x * this.game.time.physicsElapsed;
        this.surface.targetSpeed.x = this.targetSpeed.x;
        this.updateRect();
    }
    /**
     */
    initialize() {
        this.updateRect();
        this.fsm.changeState(DropLiftState.idle);
    }
    updateRect() {
        this.hitbox.x = this.getPosition().x;
        this.hitbox.y = this.getPosition().y - 16;
    }
}
exports.DropLift = DropLift;
var DropLiftState;
(function (DropLiftState) {
    DropLiftState["idle"] = "idle";
    DropLiftState["drop"] = "drop";
    DropLiftState["return"] = "return";
})(DropLiftState || (DropLiftState = {}));
class DropLiftIdleState {
    constructor(actor) {
        this.name = DropLiftState.idle;
        this.hasSpeedBeenSet = false;
        this.actor = actor;
    }
    enter() {
        // console.log("ENTER: " + this.name);
        this.initialized = true;
        this.actor.animations.play(DropLiftAnimations.idle);
        this.gaps = this.actor.getGaps();
        this.start = this.actor.getStart();
        this.end = this.actor.getEnd();
        this.delayEndTime = this.actor.getDelay();
    }
    update() {
        this.delayElapsedTime += this.actor.game.time.elapsedMS;
        if (this.delayElapsedTime < this.delayEndTime) {
            return;
        }
        if (!this.hasSpeedBeenSet) {
            this.hasSpeedBeenSet = true;
            this.actor.targetSpeed.x = this.actor.horizontalSpeed;
        }
        for (let i = 0; i < this.gaps.length; i += 2) {
            // console.log('check first: ' + this.gaps[i]);
            // console.log('check second: ' + this.gaps[i + 1]);
            if (this.actor.getPosition().x >= this.gaps[i] && this.actor.getPosition().x <= this.gaps[i + 1]) {
                this.actor.fsm.changeState(DropLiftState.drop);
                return;
            }
        }
        if (this.actor.getPosition().x >= this.end.x - 8) {
            this.actor.getPosition().x = this.end.x - 8;
            this.actor.position.x = this.actor.getPosition().x;
            this.actor.targetSpeed.x = -this.actor.horizontalSpeed;
        }
        else if (this.actor.getPosition().x <= this.start.x - 8) {
            this.actor.getPosition().x = this.start.x - 8;
            this.actor.position.x = this.actor.getPosition().x;
            this.actor.targetSpeed.x = this.actor.horizontalSpeed;
        }
    }
    exit() {
        // console.log("EXIT: " + this.name);
        this.initialized = false;
        this.delayEndTime = 0;
        this.hasSpeedBeenSet = false;
    }
}
class DropLiftReturnState {
    constructor(actor) {
        this.name = DropLiftState.return;
        this.actor = actor;
    }
    enter() {
        // console.log("ENTER: " + this.name);
        this.initialized = true;
        this.actor.animations.play(DropLiftAnimations.return);
        this.gaps = this.actor.getGaps();
        this.actor.getSurface().collidable = true;
        this.start = this.actor.getStart();
        this.end = this.actor.getEnd();
    }
    update() {
        for (let i = 0; i < this.gaps.length; i += 2) {
            // console.log('check first: ' + this.gaps[i]);
            // console.log('check second: ' + this.gaps[i + 1]);
            if (this.actor.getPosition().x >= this.gaps[i] && this.actor.getPosition().x <= this.gaps[i + 1]) {
                this.actor.fsm.changeState(DropLiftState.drop);
                return;
            }
        }
        if (this.actor.getPosition().x >= this.end.x - 8) {
            this.actor.getPosition().x = this.end.x - 8;
            this.actor.position.x = this.actor.getPosition().x;
            this.actor.targetSpeed.x = -this.actor.horizontalSpeed;
        }
        else if (this.actor.getPosition().x <= this.start.x - 8) {
            this.actor.getPosition().x = this.start.x - 8;
            this.actor.position.x = this.actor.getPosition().x;
            this.actor.targetSpeed.x = this.actor.horizontalSpeed;
        }
    }
    exit() {
        // console.log("EXIT: " + this.name);
        this.initialized = false;
    }
}
class DropLiftDropState {
    constructor(actor) {
        this.name = DropLiftState.drop;
        this.actor = actor;
    }
    enter() {
        // console.log("ENTER: " + this.name);
        this.initialized = true;
        this.actor.animations.play(DropLiftAnimations.drop);
        this.gaps = this.actor.getGaps();
        this.actor.getSurface().collidable = false;
        this.start = this.actor.getStart();
        this.end = this.actor.getEnd();
    }
    update() {
        let isInBetween = false;
        for (let i = 0; i < this.gaps.length; i += 2) {
            // console.log('drop check first: ' + this.gaps[i]);
            // console.log('drop check second: ' + this.gaps[i + 1]);
            if (this.actor.getPosition().x >= this.gaps[i] && this.actor.getPosition().x <= this.gaps[i + 1]) {
                isInBetween = true;
            }
        }
        if (!isInBetween) {
            this.actor.fsm.changeState(DropLiftState.return);
            return;
        }
        if (this.actor.getPosition().x >= this.end.x - 8) {
            this.actor.getPosition().x = this.end.x - 8;
            this.actor.position.x = this.actor.getPosition().x;
            this.actor.targetSpeed.x = -this.actor.horizontalSpeed;
        }
        else if (this.actor.getPosition().x <= this.start.x - 8) {
            this.actor.getPosition().x = this.start.x - 8;
            this.actor.position.x = this.actor.getPosition().x;
            this.actor.targetSpeed.x = this.actor.horizontalSpeed;
        }
    }
    exit() {
        // console.log("EXIT: " + this.name);
        this.initialized = false;
    }
}


/***/ }),
/* 65 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PicketMan = void 0;
const enemy_1 = __webpack_require__(31);
const konstants_1 = __webpack_require__(2);
const helper_1 = __webpack_require__(24);
const mathutil_1 = __webpack_require__(34);
const stateMachine_1 = __webpack_require__(33);
const vector2_1 = __webpack_require__(20);
const ray_1 = __webpack_require__(19);
const sat2d_1 = __webpack_require__(17);
const main_1 = __webpack_require__(0);
var PicketManAnimationNames;
(function (PicketManAnimationNames) {
    PicketManAnimationNames["idle"] = "idle";
    PicketManAnimationNames["throw_ready"] = "throw_ready";
    PicketManAnimationNames["throw"] = "throw";
})(PicketManAnimationNames || (PicketManAnimationNames = {}));
class PicketMan extends enemy_1.Enemy {
    constructor(myWorld, tag, e, game, x, y, key, frame) {
        super(myWorld, tag, e, game, x, y, key, frame);
        this.horizontalSpeed = 50;
        this.targetSpeed = new Phaser.Point(0, 0);
        this.isOnGround = true;
        this.useGravity = true;
        this.isJumping = true;
        this.isFalling = true;
        this.minJumpHeight = 1;
        this.maxJumpHeight = 44;
        this.timeToJumpApex = 0.35;
        this.gravityX = 0;
        this.gravityY = 0;
        this.maxJumpVelocity = 0;
        this.minJumpVelocity = 0;
        this.groundRays = new Array();
        this.ceilRays = new Array();
        this.leftRays = new Array();
        this.rightRays = new Array();
        this.skinWidth = 5;
        this.fsm = new stateMachine_1.StateMachine();
        this.fsm.addState(PicketManState.amazing_entrance, new PicketManAmazingEntranceState(this));
        this.fsm.addState(PicketManState.idle, new PicketManIdleState(this));
        this.fsm.addState(PicketManState.throwing, new PicketManThrowingState(this));
        this.fsm.changeState(PicketManState.amazing_entrance);
        this.getPosition().x = x + 8;
        this.getPosition().y = y + 16;
        this.position.x = this.getPosition().x;
        this.position.y = this.getPosition().y;
        this.smoothed = false;
        this.anchor.setTo(0.5, 1);
        this.health = 10;
        this.maxHealth = 10;
        this.isShielded = true;
        this.animations.add(PicketManAnimationNames.idle, ['picket_man_01'], 10, false, false);
        this.animations.add(PicketManAnimationNames.throw_ready, ['picket_man_02'], 10, false, false);
        this.animations.add(PicketManAnimationNames.throw, ['picket_man_03'], 10, false, false);
        this.animations.play(PicketManAnimationNames.idle);
        this.hitbox = new Phaser.Rectangle(this.getPosition().x, this.getPosition().y, 16, 20);
        this.hitboxOffset.x = -8;
        this.hitboxOffset.y = -20;
        this.updateRect();
        this.midGroundCheck = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_1.RayType.not_infinite);
        this.leftGroundCheck = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_1.RayType.not_infinite);
        this.rightGroundCheck = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_1.RayType.not_infinite);
        this.midCeilCheck = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_1.RayType.not_infinite);
        this.leftCeilCheck = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_1.RayType.not_infinite);
        this.rightCeilCheck = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_1.RayType.not_infinite);
        this.leftCheck1 = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_1.RayType.not_infinite);
        this.leftCheck2 = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_1.RayType.not_infinite);
        this.rightCheck1 = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_1.RayType.not_infinite);
        this.rightCheck2 = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_1.RayType.not_infinite);
        this.groundRays.push(this.midGroundCheck);
        this.groundRays.push(this.leftGroundCheck);
        this.groundRays.push(this.rightGroundCheck);
        this.ceilRays.push(this.midCeilCheck);
        this.ceilRays.push(this.leftCeilCheck);
        this.ceilRays.push(this.rightCeilCheck);
        this.leftRays.push(this.leftCheck1);
        this.leftRays.push(this.leftCheck2);
        this.rightRays.push(this.rightCheck1);
        this.rightRays.push(this.rightCheck2);
        this.wallContact = { left: false, right: false, up: false, down: false };
        this.calculateRegularJumpSettings();
    }
    manualUpdate() {
        // this.pGraphicsDebug.clear();
        if (!this.alive) {
            return;
        }
        this.frozen.update();
        if (this.frozen.isFrozen) {
            return;
        }
        this.fsm.currentState.update();
        if (this.useGravity) {
            this.targetSpeed.x += Math.abs(this.gravityX) * main_1.fixedTime;
            this.targetSpeed.y += Math.abs(this.gravityY) * main_1.fixedTime;
        }
        this.velocity.x = this.targetSpeed.x;
        this.velocity.y = this.targetSpeed.y;
        if (this.isOnGround) {
            this.targetSpeed.x *= 0.75;
        }
        this.getPosition().x += this.velocity.x * main_1.fixedTime;
        this.getPosition().y += this.velocity.y * main_1.fixedTime;
        this.position.x = (this.getPosition().x + 0.5) | 0;
        this.position.y = this.getPosition().y;
        this.updateRect();
        this.castRays();
    }
    checkSurfaceCollisions(surfaces) {
        this.wallContact.left = false;
        this.wallContact.right = false;
        this.wallContact.up = false;
        this.wallContact.down = false;
        this.isOnGround = false;
        let into;
        for (let j = 0; j < surfaces.length; j++) {
            let surface = surfaces[j];
            if (!surface.collidable) {
                continue;
            }
            let nx = surface.dir.y;
            let ny = -surface.dir.x;
            // Check floors
            if (ny == -1 && this.getVelocity().y > 0) {
                for (let k = 0; k < this.groundRays.length; k++) {
                    let ray = this.groundRays[k];
                    into = sat2d_1.SAT2D.testRayVsRay(ray, new ray_1.Ray(new vector2_1.Vector2(surface.p1.x, surface.p1.y), new vector2_1.Vector2(surface.p2.x, surface.p2.y), ray_1.RayType.not_infinite), into);
                    if (into != null) {
                        let dx = into.ray1.end.x - into.ray1.start.x;
                        let dy = into.ray1.end.y - into.ray1.start.y;
                        let distance = Math.sqrt(dx * dx + dy * dy);
                        let trueDistance = distance * into.u1;
                        let contactX = into.ray1.start.x + into.ray1.dir.x * into.u1;
                        let contactY = into.ray1.start.y + trueDistance;
                        // this.pGraphicsDebug.drawCircle(contactX, contactY, 3);
                        if (trueDistance > this.hitbox.height * 0.5) {
                            continue;
                        }
                        this.getPosition().y = contactY;
                        this.setVelocity(this.getVelocity().x, 0);
                        this.targetSpeed.y = 0;
                        this.isOnGround = true;
                        this.isJumping = false;
                        this.isFalling = false;
                        this.wallContact.down = true;
                        continue;
                    }
                }
            }
            // Check ceilings
            if (ny == 1 && this.getVelocity().y < 0) {
                for (let k = 0; k < this.ceilRays.length; k++) {
                    let ray = this.ceilRays[k];
                    into = sat2d_1.SAT2D.testRayVsRay(ray, new ray_1.Ray(new vector2_1.Vector2(surface.p1.x, surface.p1.y), new vector2_1.Vector2(surface.p2.x, surface.p2.y), ray_1.RayType.not_infinite), into);
                    if (into != null) {
                        let dx = into.ray1.end.x - into.ray1.start.x;
                        let dy = into.ray1.end.y - into.ray1.start.y;
                        let distance = Math.sqrt(dx * dx + dy * dy);
                        let trueDistance = distance * into.u1;
                        let contactX = into.ray1.start.x + into.ray1.dir.x * into.u1;
                        let contactY = into.ray1.start.y - trueDistance;
                        // this.pGraphicsDebug.drawCircle(contactX, contactY, 3);
                        if (trueDistance > this.hitbox.height * 0.5) {
                            continue;
                        }
                        this.getPosition().y = contactY + this.hitbox.height;
                        this.setVelocity(this.getVelocity().x, 0);
                        this.targetSpeed.y = 0;
                        this.isFalling = true;
                        this.wallContact.up = true;
                        continue;
                    }
                }
            }
            // Check right walls
            if (nx == -1 && this.getVelocity().x > 0) {
                for (let k = 0; k < this.rightRays.length; k++) {
                    let ray = this.rightRays[k];
                    into = sat2d_1.SAT2D.testRayVsRay(ray, new ray_1.Ray(new vector2_1.Vector2(surface.p1.x, surface.p1.y), new vector2_1.Vector2(surface.p2.x, surface.p2.y), ray_1.RayType.not_infinite), into);
                    if (into != null) {
                        let dx = into.ray1.end.x - into.ray1.start.x;
                        let dy = into.ray1.end.y - into.ray1.start.y;
                        let distance = Math.sqrt(dx * dx + dy * dy);
                        let trueDistance = distance * into.u1;
                        let contactX = into.ray1.start.x + trueDistance;
                        let contactY = into.ray1.start.y;
                        // this.pGraphicsDebug.lineStyle(1, 0);
                        // this.pGraphicsDebug.beginFill(0xff0000, 0.5);
                        // this.pGraphicsDebug.drawCircle(contactX, contactY, 5);
                        if (trueDistance > this.hitbox.width * 0.5) {
                            continue;
                        }
                        this.getPosition().x = contactX - this.hitbox.width * 0.5;
                        this.wallContact.right = true;
                        continue;
                    }
                }
            }
            // Check left walls
            if (nx == 1 && this.getVelocity().x < 0) {
                for (let k = 0; k < this.leftRays.length; k++) {
                    let ray = this.leftRays[k];
                    into = sat2d_1.SAT2D.testRayVsRay(ray, new ray_1.Ray(new vector2_1.Vector2(surface.p1.x, surface.p1.y), new vector2_1.Vector2(surface.p2.x, surface.p2.y), ray_1.RayType.not_infinite), into);
                    if (into != null) {
                        let dx = into.ray1.end.x - into.ray1.start.x;
                        let dy = into.ray1.end.y - into.ray1.start.y;
                        let distance = Math.sqrt(dx * dx + dy * dy);
                        let trueDistance = distance * into.u1;
                        let contactX = into.ray1.start.x - trueDistance;
                        let contactY = into.ray1.start.y;
                        // this.pGraphicsDebug.lineStyle(1, 0);
                        // this.pGraphicsDebug.beginFill(0xff0000, 0.5);
                        // this.pGraphicsDebug.drawCircle(contactX, contactY, 5);
                        if (trueDistance > this.hitbox.width * 0.5) {
                            continue;
                        }
                        this.getPosition().x = contactX + this.hitbox.width * 0.5;
                        this.wallContact.left = true;
                        continue;
                    }
                }
            }
        }
    }
    takeDamage(damage) {
        if (this.isShielded) {
            this.game.sound.play(konstants_1.AudioName.dink);
            return;
        }
        if (this.health <= 0) {
            return;
        }
        this.game.sound.play(konstants_1.AudioName.enemy_damage);
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            this.myWorld.dropManager.dropPowerUp(this.getPosition().x + this.hitboxOffset.x, this.getPosition().y);
            this.myWorld.createExplosionEffect(this.getPosition().x, this.getPosition().y - this.hitbox.halfHeight);
            this.kill();
        }
    }
    shoot() {
        this.isShielded = false;
        this.myWorld.entityManager.createPick(this, this.getPosition().x, this.getPosition().y - 8, this.myWorld.entityManager.player.getPosition().x, this.myWorld.entityManager.player.getPosition().y - this.myWorld.entityManager.player.hitbox.halfHeight, 8, 8, konstants_1.EntityType.picket_man, konstants_1.EntityType.picket_man_weapon);
    }
    calculateRegularJumpSettings() {
        this.gravityY = -(2 * this.maxJumpHeight) / Math.pow(this.timeToJumpApex, 2);
        this.maxJumpVelocity = Math.abs(this.gravityY) * this.timeToJumpApex;
        this.minJumpVelocity = Math.sqrt(2 * Math.abs(this.gravityY) * this.minJumpHeight);
        // console.log('gravity: ' + this._gravity);
        // console.log('maxJumpVelocity: ' + this._maxJumpVelocity);
        // console.log('minJumpVelocity: ' + this._minJumpVelocity);
    }
    /**
     * Using the current position moves the rays a frame even though the player may be running into a wall. By using
     * previous position the rays don't move for that frame. They use the previous frame. Think about it, when the player
     * is running into a wall, its 'bounds' should not move.
     */
    castRays() {
        let centerX = this.getPosition().x;
        let centerY = this.getPosition().y - this.hitbox.height * 0.5;
        if (this.wallContact.left || this.wallContact.right) {
            centerX = this.previousPosition.x;
        }
        // cast ground rays
        this.midGroundCheck.start = new vector2_1.Vector2(centerX, centerY);
        this.midGroundCheck.end = new vector2_1.Vector2(centerX, centerY + this.hitbox.height * 0.5 + this.skinWidth);
        this.leftGroundCheck.start = new vector2_1.Vector2(centerX - this.hitbox.width * 0.5 + 3, centerY);
        this.leftGroundCheck.end = new vector2_1.Vector2(centerX - this.hitbox.width * 0.5 + 3, centerY + this.hitbox.height * 0.5 + this.skinWidth);
        this.rightGroundCheck.start = new vector2_1.Vector2(centerX + this.hitbox.width * 0.5 - 3, centerY);
        this.rightGroundCheck.end = new vector2_1.Vector2(centerX + this.hitbox.width * 0.5 - 3, centerY + this.hitbox.height * 0.5 + this.skinWidth);
        // cast ceil rays
        this.midCeilCheck.start = new vector2_1.Vector2(centerX, centerY);
        this.midCeilCheck.end = new vector2_1.Vector2(centerX, centerY - this.hitbox.height * 0.5 - this.skinWidth);
        this.leftCeilCheck.start = new vector2_1.Vector2(centerX - this.hitbox.width * 0.5 + 3, centerY);
        this.leftCeilCheck.end = new vector2_1.Vector2(centerX - this.hitbox.width * 0.5 + 3, centerY - this.hitbox.height * 0.5 - this.skinWidth);
        this.rightCeilCheck.start = new vector2_1.Vector2(centerX + this.hitbox.width * 0.5 - 3, centerY);
        this.rightCeilCheck.end = new vector2_1.Vector2(centerX + this.hitbox.width * 0.5 - 3, centerY - this.hitbox.height * 0.5 - this.skinWidth);
        // cast left rays
        let offsetY = 8;
        this.leftCheck1.start = new vector2_1.Vector2(centerX, centerY - offsetY);
        this.leftCheck1.end = new vector2_1.Vector2(centerX - this.hitbox.width * 0.5 - this.skinWidth, centerY - offsetY);
        this.leftCheck2.start = new vector2_1.Vector2(centerX, centerY + offsetY);
        this.leftCheck2.end = new vector2_1.Vector2(centerX - this.hitbox.width * 0.5 - this.skinWidth, centerY + offsetY);
        // cast right rays
        offsetY = 8;
        this.rightCheck1.start = new vector2_1.Vector2(centerX, centerY - offsetY);
        this.rightCheck1.end = new vector2_1.Vector2(centerX + this.hitbox.width * 0.5 + this.skinWidth, centerY - offsetY);
        this.rightCheck2.start = new vector2_1.Vector2(centerX, centerY + offsetY);
        this.rightCheck2.end = new vector2_1.Vector2(centerX + this.hitbox.width * 0.5 + this.skinWidth, centerY + offsetY);
    }
}
exports.PicketMan = PicketMan;
var PicketManState;
(function (PicketManState) {
    PicketManState["amazing_entrance"] = "amazing_entrance";
    PicketManState["idle"] = "idle";
    PicketManState["throwing"] = "throwing";
})(PicketManState || (PicketManState = {}));
class PicketManAmazingEntranceState {
    constructor(actor) {
        this.actor = actor;
    }
    enter() {
        console.log('PicketMan Enter: ' + this.name);
        this.initialized = true;
        this.actor.isShielded = true;
        this.actor.animations.play(PicketManAnimationNames.idle);
        this.actor.targetSpeed.x = -50;
        this.actor.targetSpeed.y = -50;
    }
    update() {
        if (this.actor.isOnGround) {
            this.actor.fsm.changeState(PicketManState.idle);
            return;
        }
    }
    exit() {
        console.log('PicketMan Exit: ' + this.name);
        this.initialized = false;
    }
}
class PicketManIdleState {
    constructor(actor) {
        this.elapsedTime = 0;
        this.endTime = 0;
        this.minIdleTime = 900;
        this.maxIdleTime = 1500;
        this.actor = actor;
    }
    enter() {
        // console.log('PicketMan Enter: ' + this.name);
        this.initialized = true;
        this.actor.animations.play(PicketManAnimationNames.idle);
        this.actor.isShielded = true;
        this.endTime = this.minIdleTime + Math.random() * (this.maxIdleTime - this.minIdleTime);
        this.player = this.actor.myWorld.entityManager.player;
    }
    update() {
        let direction = mathutil_1.MathUtil.sign(helper_1.Helper.directionTo(this.actor, this.actor.myWorld.entityManager.player).x);
        this.actor.setFacingDirection(-direction);
        this.elapsedTime += main_1.fixedTimeMS;
        if (this.elapsedTime > this.endTime) {
            this.actor.fsm.changeState(PicketManState.throwing);
            return;
        }
    }
    exit() {
        // console.log('PicketMan Exit: ' + this.name);
        this.initialized = false;
        this.elapsedTime = 0;
    }
}
class PicketManThrowingState {
    constructor(actor) {
        this.name = PicketManState.throwing;
        this.elapsedTime = 0;
        this.endTime = 300;
        this.hasThrown = false;
        this.throwReadyElapsedTime = 0;
        this.throwReadyEndTime = 300;
        this.throwReady = false;
        this.actor = actor;
    }
    enter() {
        // console.log('PicketMan Enter: ' + this.name);
        this.initialized = true;
        this.actor.isShielded = false;
        this.actor.animations.play(PicketManAnimationNames.throw_ready);
        this.shotCount = Math.floor(Math.random() * 7 + 3);
    }
    update() {
        let direction = mathutil_1.MathUtil.sign(helper_1.Helper.directionTo(this.actor, this.actor.myWorld.entityManager.player).x);
        this.actor.setFacingDirection(-direction);
        if (!this.hasThrown) {
            this.throwReadyElapsedTime += main_1.fixedTimeMS;
            if (this.throwReadyElapsedTime >= this.throwReadyEndTime) {
                this.hasThrown = true;
                this.actor.animations.play(PicketManAnimationNames.throw);
                this.throwReadyElapsedTime = 0;
                this.shotCount--;
                this.actor.shoot();
            }
        }
        else {
            this.elapsedTime += main_1.fixedTimeMS;
            if (this.elapsedTime >= this.endTime) {
                if (this.shotCount <= 0) {
                    this.actor.fsm.changeState(PicketManState.idle);
                    return;
                }
                this.hasThrown = false;
                this.actor.animations.play(PicketManAnimationNames.throw_ready);
                this.elapsedTime = 0;
            }
        }
    }
    exit() {
        // console.log('PicketMan Exit: ' + this.name);
        this.initialized = false;
        this.elapsedTime = 0;
        this.hasThrown = false;
        this.throwReadyElapsedTime = 0;
    }
}


/***/ }),
/* 66 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CrazyRazy = void 0;
const enemy_1 = __webpack_require__(31);
const konstants_1 = __webpack_require__(2);
const stateMachine_1 = __webpack_require__(33);
const vector2_1 = __webpack_require__(20);
const ray_1 = __webpack_require__(19);
const sat2d_1 = __webpack_require__(17);
const main_1 = __webpack_require__(0);
var CrazyRazyAnimationNames;
(function (CrazyRazyAnimationNames) {
    CrazyRazyAnimationNames["idle"] = "idle";
    CrazyRazyAnimationNames["walk"] = "walk";
    CrazyRazyAnimationNames["legs_walk_only"] = "legs_walk_only";
})(CrazyRazyAnimationNames || (CrazyRazyAnimationNames = {}));
class CrazyRazy extends enemy_1.Enemy {
    constructor(myWorld, tag, e, game, x, y, key, frame) {
        super(myWorld, tag, e, game, x, y, key, frame);
        this.targetSpeed = new Phaser.Point(0, 0);
        this.isOnGround = true;
        this.useGravity = true;
        this.isJumping = true;
        this.isFalling = true;
        this.minJumpHeight = 1;
        this.maxJumpHeight = 44;
        this.timeToJumpApex = 0.35;
        this.gravityX = 0;
        this.gravityY = 0;
        this.maxJumpVelocity = 0;
        this.minJumpVelocity = 0;
        this.groundRays = new Array();
        this.ceilRays = new Array();
        this.leftRays = new Array();
        this.rightRays = new Array();
        this.skinWidth = 5;
        this.fsm = new stateMachine_1.StateMachine();
        this.fsm.addState(CrazyRazyState.initial, new CrazyRazyInitialState(this));
        this.fsm.addState(CrazyRazyState.legs_only, new CrazyRazyLegsOnlyState(this));
        this.fsm.changeState(CrazyRazyState.initial);
        this.getPosition().x = x;
        this.getPosition().y = y + 16;
        this.position.x = this.getPosition().x;
        this.position.y = this.getPosition().y;
        this.smoothed = false;
        this.anchor.setTo(0.5, 1);
        this.health = 10;
        this.maxHealth = 10;
        this.isShielded = false;
        this.animations.add(CrazyRazyAnimationNames.idle, ['crazy_razy_walk_01'], 10, false, false);
        this.animations.add(CrazyRazyAnimationNames.walk, ['crazy_razy_walk_01', 'crazy_razy_walk_02', 'crazy_razy_walk_03'], 10, true, false);
        this.animations.play(CrazyRazyAnimationNames.walk);
        this.hitbox = new Phaser.Rectangle(this.getPosition().x, this.getPosition().y, 16, 20);
        this.hitboxOffset.x = -this.hitbox.halfWidth;
        this.hitboxOffset.y = -this.hitbox.height;
        this.updateRect();
        this.midGroundCheck = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_1.RayType.not_infinite);
        this.leftGroundCheck = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_1.RayType.not_infinite);
        this.rightGroundCheck = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_1.RayType.not_infinite);
        this.midCeilCheck = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_1.RayType.not_infinite);
        this.leftCeilCheck = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_1.RayType.not_infinite);
        this.rightCeilCheck = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_1.RayType.not_infinite);
        this.leftCheck1 = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_1.RayType.not_infinite);
        this.leftCheck2 = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_1.RayType.not_infinite);
        this.rightCheck1 = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_1.RayType.not_infinite);
        this.rightCheck2 = new ray_1.Ray(new vector2_1.Vector2(), new vector2_1.Vector2(), ray_1.RayType.not_infinite);
        this.groundRays.push(this.midGroundCheck);
        this.groundRays.push(this.leftGroundCheck);
        this.groundRays.push(this.rightGroundCheck);
        this.ceilRays.push(this.midCeilCheck);
        this.ceilRays.push(this.leftCeilCheck);
        this.ceilRays.push(this.rightCeilCheck);
        this.leftRays.push(this.leftCheck1);
        this.leftRays.push(this.leftCheck2);
        this.rightRays.push(this.rightCheck1);
        this.rightRays.push(this.rightCheck2);
        this.wallContact = { left: false, right: false, up: false, down: false };
        this.calculateRegularJumpSettings();
    }
    manualUpdate() {
        // this.pGraphicsDebug.clear();
        if (!this.alive) {
            return;
        }
        this.frozen.update();
        if (this.frozen.isFrozen) {
            return;
        }
        this.fsm.currentState.update();
        if (this.useGravity) {
            this.targetSpeed.x += Math.abs(this.gravityX) * main_1.fixedTime;
            this.targetSpeed.y += Math.abs(this.gravityY) * main_1.fixedTime;
        }
        this.velocity.x = this.targetSpeed.x;
        this.velocity.y = this.targetSpeed.y;
        this.getPosition().x += this.velocity.x * main_1.fixedTime;
        this.getPosition().y += this.velocity.y * main_1.fixedTime;
        this.position.x = (this.getPosition().x + 0.5) | 0;
        this.position.y = this.getPosition().y;
        this.updateRect();
        this.castRays();
    }
    killLegs() {
        if (this.fsm.currentState.name != CrazyRazyState.legs_only) {
            return;
        }
        this.fsm.currentState.killLegs();
    }
    checkSurfaceCollisions(surfaces) {
        this.wallContact.left = false;
        this.wallContact.right = false;
        this.wallContact.up = false;
        this.wallContact.down = false;
        this.isOnGround = false;
        let into;
        for (let j = 0; j < surfaces.length; j++) {
            let surface = surfaces[j];
            if (!surface.collidable) {
                continue;
            }
            let nx = surface.dir.y;
            let ny = -surface.dir.x;
            // Check floors
            if (ny == -1 && this.getVelocity().y > 0) {
                for (let k = 0; k < this.groundRays.length; k++) {
                    let ray = this.groundRays[k];
                    into = sat2d_1.SAT2D.testRayVsRay(ray, new ray_1.Ray(new vector2_1.Vector2(surface.p1.x, surface.p1.y), new vector2_1.Vector2(surface.p2.x, surface.p2.y), ray_1.RayType.not_infinite), into);
                    if (into != null) {
                        let dx = into.ray1.end.x - into.ray1.start.x;
                        let dy = into.ray1.end.y - into.ray1.start.y;
                        let distance = Math.sqrt(dx * dx + dy * dy);
                        let trueDistance = distance * into.u1;
                        let contactX = into.ray1.start.x + into.ray1.dir.x * into.u1;
                        let contactY = into.ray1.start.y + trueDistance;
                        // this.pGraphicsDebug.drawCircle(contactX, contactY, 3);
                        if (trueDistance > this.hitbox.height * 0.5) {
                            continue;
                        }
                        this.getPosition().y = contactY;
                        this.setVelocity(this.getVelocity().x, 0);
                        this.targetSpeed.y = 0;
                        this.isOnGround = true;
                        this.isJumping = false;
                        this.isFalling = false;
                        this.wallContact.down = true;
                        continue;
                    }
                }
            }
            // Check ceilings
            if (ny == 1 && this.getVelocity().y < 0) {
                for (let k = 0; k < this.ceilRays.length; k++) {
                    let ray = this.ceilRays[k];
                    into = sat2d_1.SAT2D.testRayVsRay(ray, new ray_1.Ray(new vector2_1.Vector2(surface.p1.x, surface.p1.y), new vector2_1.Vector2(surface.p2.x, surface.p2.y), ray_1.RayType.not_infinite), into);
                    if (into != null) {
                        let dx = into.ray1.end.x - into.ray1.start.x;
                        let dy = into.ray1.end.y - into.ray1.start.y;
                        let distance = Math.sqrt(dx * dx + dy * dy);
                        let trueDistance = distance * into.u1;
                        let contactX = into.ray1.start.x + into.ray1.dir.x * into.u1;
                        let contactY = into.ray1.start.y - trueDistance;
                        // this.pGraphicsDebug.drawCircle(contactX, contactY, 3);
                        if (trueDistance > this.hitbox.height * 0.5) {
                            continue;
                        }
                        this.getPosition().y = contactY + this.hitbox.height;
                        this.setVelocity(this.getVelocity().x, 0);
                        this.targetSpeed.y = 0;
                        this.isFalling = true;
                        this.wallContact.up = true;
                        continue;
                    }
                }
            }
            // Check right walls
            if (nx == -1 && this.getVelocity().x > 0) {
                for (let k = 0; k < this.rightRays.length; k++) {
                    let ray = this.rightRays[k];
                    into = sat2d_1.SAT2D.testRayVsRay(ray, new ray_1.Ray(new vector2_1.Vector2(surface.p1.x, surface.p1.y), new vector2_1.Vector2(surface.p2.x, surface.p2.y), ray_1.RayType.not_infinite), into);
                    if (into != null) {
                        let dx = into.ray1.end.x - into.ray1.start.x;
                        let dy = into.ray1.end.y - into.ray1.start.y;
                        let distance = Math.sqrt(dx * dx + dy * dy);
                        let trueDistance = distance * into.u1;
                        let contactX = into.ray1.start.x + trueDistance;
                        let contactY = into.ray1.start.y;
                        // this.pGraphicsDebug.lineStyle(1, 0);
                        // this.pGraphicsDebug.beginFill(0xff0000, 0.5);
                        // this.pGraphicsDebug.drawCircle(contactX, contactY, 5);
                        if (trueDistance > this.hitbox.width * 0.5) {
                            continue;
                        }
                        this.getPosition().x = contactX - this.hitbox.width * 0.5;
                        this.wallContact.right = true;
                        continue;
                    }
                }
            }
            // Check left walls
            if (nx == 1 && this.getVelocity().x < 0) {
                for (let k = 0; k < this.leftRays.length; k++) {
                    let ray = this.leftRays[k];
                    into = sat2d_1.SAT2D.testRayVsRay(ray, new ray_1.Ray(new vector2_1.Vector2(surface.p1.x, surface.p1.y), new vector2_1.Vector2(surface.p2.x, surface.p2.y), ray_1.RayType.not_infinite), into);
                    if (into != null) {
                        let dx = into.ray1.end.x - into.ray1.start.x;
                        let dy = into.ray1.end.y - into.ray1.start.y;
                        let distance = Math.sqrt(dx * dx + dy * dy);
                        let trueDistance = distance * into.u1;
                        let contactX = into.ray1.start.x - trueDistance;
                        let contactY = into.ray1.start.y;
                        // this.pGraphicsDebug.lineStyle(1, 0);
                        // this.pGraphicsDebug.beginFill(0xff0000, 0.5);
                        // this.pGraphicsDebug.drawCircle(contactX, contactY, 5);
                        if (trueDistance > this.hitbox.width * 0.5) {
                            continue;
                        }
                        this.getPosition().x = contactX + this.hitbox.width * 0.5;
                        this.wallContact.left = true;
                        continue;
                    }
                }
            }
        }
    }
    takeDamage(damage) {
        if (this.isShielded) {
            this.game.sound.play(konstants_1.AudioName.dink);
            return;
        }
        if (this.health <= 0) {
            return;
        }
        this.game.sound.play(konstants_1.AudioName.enemy_damage);
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            // this.myWorld.dropManager.dropPowerUp(this.getPosition().x + this.hitboxOffset.x, this.getPosition().y);
            this.myWorld.createExplosionEffect(this.getPosition().x, this.getPosition().y - this.hitbox.halfHeight);
            this.kill();
        }
    }
    shoot() {
        this.game.sound.play(konstants_1.AudioName.enemy_shoot);
        this.isShielded = false;
        let bullet = this.myWorld.entityManager.createBitmapBullet(this, this.position.x - 4, this.position.y - 7, 6, 6, konstants_1.EntityType.bullet, konstants_1.EntityType.met_bullet);
        bullet.horizontalSpeed = 170;
        let cos = Math.cos(0 * (Math.PI / 180));
        let sin = Math.sin(0 * (Math.PI / 180));
        bullet.targetSpeed.x = bullet.horizontalSpeed * cos * -this.getFacingDirection();
        bullet.targetSpeed.y = bullet.horizontalSpeed * sin * -this.getFacingDirection();
    }
    calculateRegularJumpSettings() {
        this.gravityY = -(2 * this.maxJumpHeight) / Math.pow(this.timeToJumpApex, 2);
        this.maxJumpVelocity = Math.abs(this.gravityY) * this.timeToJumpApex;
        this.minJumpVelocity = Math.sqrt(2 * Math.abs(this.gravityY) * this.minJumpHeight);
        // console.log('gravity: ' + this._gravity);
        // console.log('maxJumpVelocity: ' + this._maxJumpVelocity);
        // console.log('minJumpVelocity: ' + this._minJumpVelocity);
    }
    /**
     * Using the current position moves the rays a frame even though the player may be running into a wall. By using
     * previous position the rays don't move for that frame. They use the previous frame. Think about it, when the player
     * is running into a wall, its 'bounds' should not move.
     */
    castRays() {
        let centerX = this.getPosition().x;
        let centerY = this.getPosition().y - this.hitbox.height * 0.5;
        if (this.wallContact.left || this.wallContact.right) {
            centerX = this.previousPosition.x;
        }
        // cast ground rays
        this.midGroundCheck.start = new vector2_1.Vector2(centerX, centerY);
        this.midGroundCheck.end = new vector2_1.Vector2(centerX, centerY + this.hitbox.height * 0.5 + this.skinWidth);
        this.leftGroundCheck.start = new vector2_1.Vector2(centerX - this.hitbox.width * 0.5 + 3, centerY);
        this.leftGroundCheck.end = new vector2_1.Vector2(centerX - this.hitbox.width * 0.5 + 3, centerY + this.hitbox.height * 0.5 + this.skinWidth);
        this.rightGroundCheck.start = new vector2_1.Vector2(centerX + this.hitbox.width * 0.5 - 3, centerY);
        this.rightGroundCheck.end = new vector2_1.Vector2(centerX + this.hitbox.width * 0.5 - 3, centerY + this.hitbox.height * 0.5 + this.skinWidth);
        // cast ceil rays
        this.midCeilCheck.start = new vector2_1.Vector2(centerX, centerY);
        this.midCeilCheck.end = new vector2_1.Vector2(centerX, centerY - this.hitbox.height * 0.5 - this.skinWidth);
        this.leftCeilCheck.start = new vector2_1.Vector2(centerX - this.hitbox.width * 0.5 + 3, centerY);
        this.leftCeilCheck.end = new vector2_1.Vector2(centerX - this.hitbox.width * 0.5 + 3, centerY - this.hitbox.height * 0.5 - this.skinWidth);
        this.rightCeilCheck.start = new vector2_1.Vector2(centerX + this.hitbox.width * 0.5 - 3, centerY);
        this.rightCeilCheck.end = new vector2_1.Vector2(centerX + this.hitbox.width * 0.5 - 3, centerY - this.hitbox.height * 0.5 - this.skinWidth);
        // cast left rays
        let offsetY = 8;
        this.leftCheck1.start = new vector2_1.Vector2(centerX, centerY - offsetY);
        this.leftCheck1.end = new vector2_1.Vector2(centerX - this.hitbox.width * 0.5 - this.skinWidth, centerY - offsetY);
        this.leftCheck2.start = new vector2_1.Vector2(centerX, centerY + offsetY);
        this.leftCheck2.end = new vector2_1.Vector2(centerX - this.hitbox.width * 0.5 - this.skinWidth, centerY + offsetY);
        // cast right rays
        offsetY = 8;
        this.rightCheck1.start = new vector2_1.Vector2(centerX, centerY - offsetY);
        this.rightCheck1.end = new vector2_1.Vector2(centerX + this.hitbox.width * 0.5 + this.skinWidth, centerY - offsetY);
        this.rightCheck2.start = new vector2_1.Vector2(centerX, centerY + offsetY);
        this.rightCheck2.end = new vector2_1.Vector2(centerX + this.hitbox.width * 0.5 + this.skinWidth, centerY + offsetY);
    }
}
exports.CrazyRazy = CrazyRazy;
var CrazyRazyState;
(function (CrazyRazyState) {
    CrazyRazyState["initial"] = "initial";
    CrazyRazyState["legs_only"] = "legs_only";
})(CrazyRazyState || (CrazyRazyState = {}));
class CrazyRazyInitialState {
    constructor(actor) {
        this.name = CrazyRazyState.initial;
        this.actor = actor;
    }
    enter() {
        console.log('CrazyRazy Enter: ' + this.name);
        this.initialized = true;
        this.actor.animations.play(CrazyRazyAnimationNames.walk);
        this.actor.targetSpeed.x = -50;
    }
    update() {
        if (this.actor.myWorld.entityManager.player.x > this.actor.getPosition().x) {
            this.actor.visible = false;
            let entity = this.actor.myWorld.entityManager.createEntity(konstants_1.EntityType.crazy_razy_fly, this.actor.getPosition().x, this.actor.getPosition().y, null);
            this.actor.game.add.existing(entity);
            this.actor.myWorld.entityManager.addEntity(entity);
            this.actor.animations.stop();
            this.actor.fsm.changeState(CrazyRazyState.legs_only);
        }
    }
    exit() {
        console.log('CrazyRazy Exit: ' + this.name);
        this.initialized = false;
    }
}
class CrazyRazyLegsOnlyState {
    constructor(actor) {
        this.name = CrazyRazyState.legs_only;
        this.elapsedTime = 0;
        this.endTime = 2500;
        this.actor = actor;
    }
    enter() {
        console.log('CrazyRazy Enter: ' + this.name);
        this.initialized = true;
        this.legs = this.actor.game.add.sprite(this.actor.getPosition().x, this.actor.getPosition().y - 20, konstants_1.EntityType.crazy_razy, 'crazy_razy_legs_01');
        this.legs.anchor.setTo(0.5, 1);
        this.legs.animations.add('walk', ['crazy_razy_legs_01', 'crazy_razy_legs_02', 'crazy_razy_legs_03'], 10, true);
        this.legs.play('walk');
    }
    update() {
        if (this.legs == undefined) {
            return;
        }
        this.legs.position.x = (this.actor.getPosition().x + 0.5) | 0;
        this.legs.position.y = this.actor.getPosition().y;
        this.elapsedTime += main_1.fixedTimeMS;
        if (this.elapsedTime >= this.endTime) {
            this.legs.kill();
            this.actor.takeDamage(9999);
        }
    }
    exit() {
        console.log('CrazyRazy Exit: ' + this.name);
        this.initialized = false;
        this.elapsedTime = 0;
    }
    killLegs() {
        if (this.legs != undefined) {
            this.legs.kill();
        }
    }
}


/***/ }),
/* 67 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CrazyRazyFly = void 0;
const enemy_1 = __webpack_require__(31);
const konstants_1 = __webpack_require__(2);
const mathutil_1 = __webpack_require__(34);
const stateMachine_1 = __webpack_require__(33);
const main_1 = __webpack_require__(0);
var CrazyRazyFlyAnimationNames;
(function (CrazyRazyFlyAnimationNames) {
    CrazyRazyFlyAnimationNames["idle"] = "idle";
    CrazyRazyFlyAnimationNames["fly"] = "fly";
    CrazyRazyFlyAnimationNames["fly_attack"] = "fly_attack";
})(CrazyRazyFlyAnimationNames || (CrazyRazyFlyAnimationNames = {}));
class CrazyRazyFly extends enemy_1.Enemy {
    constructor(myWorld, tag, e, game, x, y, key, frame) {
        super(myWorld, tag, e, game, x, y, key, frame);
        this.targetSpeed = new Phaser.Point(0, 0);
        this.targetPos = new Phaser.Point();
        this.afterTargetPos = new Phaser.Point();
        this.attackSpeed = 100; // todo: speed too high, blader overshoots the arrival position and jitters forever
        this.isFleeing = false;
        this.fsm = new stateMachine_1.StateMachine();
        this.fsm.addState(CrazyRazyFlyState.initial, new CrazyRazyFlyInitialState(this));
        this.fsm.addState(CrazyRazyFlyState.move, new CrazyRazyFlyMoveState(this));
        this.fsm.addState(CrazyRazyFlyState.attack, new CrazyRazyFlyAttackState(this));
        this.fsm.addState(CrazyRazyFlyState.goBackUp, new CrazyRazyFlyGoBackUpkState(this));
        this.fsm.addState(CrazyRazyFlyState.flee, new CrazyRazyFleeState(this));
        this.fsm.changeState(CrazyRazyFlyState.initial);
        this.getPosition().x = x;
        this.getPosition().y = y;
        this.position.x = this.getPosition().x;
        this.position.y = this.getPosition().y;
        this.smoothed = false;
        this.anchor.setTo(0.5, 1);
        this.health = 10;
        this.maxHealth = 10;
        this.isShielded = false;
        this.animations.add(CrazyRazyFlyAnimationNames.fly, ['crazy_razy_fly'], 10, false, false);
        this.animations.add(CrazyRazyFlyAnimationNames.fly_attack, ['crazy_razy_fly_attack_01', 'crazy_razy_fly_attack_02', 'crazy_razy_fly'], 7, false, false);
        this.animations.play(CrazyRazyFlyAnimationNames.fly);
        this.hitbox = new Phaser.Rectangle(this.getPosition().x, this.getPosition().y, 16, 12);
        this.hitboxOffset.x = -8;
        this.hitboxOffset.y = -24;
        this.updateRect();
    }
    manualUpdate() {
        // this.pGraphicsDebug.clear();
        if (!this.alive) {
            return;
        }
        this.frozen.update();
        if (this.frozen.isFrozen) {
            return;
        }
        this.fsm.currentState.update();
        // if (this.useGravity) {
        //     this.targetSpeed.x += Math.abs(this.gravityX) * fixedTime;
        //     this.targetSpeed.y += Math.abs(this.gravityY) * fixedTime;
        // }
        this.velocity.x = this.targetSpeed.x;
        this.velocity.y = this.targetSpeed.y;
        this.getPosition().x += this.velocity.x * main_1.fixedTime;
        this.getPosition().y += this.velocity.y * main_1.fixedTime;
        this.position.x = (this.getPosition().x + 0.5) | 0;
        this.position.y = this.getPosition().y;
        this.updateRect();
    }
    flee() {
        if (this.isFleeing) {
            return;
        }
        this.isFleeing = true;
        this.fsm.changeState(CrazyRazyFlyState.flee);
    }
    takeDamage(damage) {
        if (this.isShielded) {
            this.game.sound.play(konstants_1.AudioName.dink);
            return;
        }
        if (this.health <= 0) {
            return;
        }
        this.game.sound.play(konstants_1.AudioName.enemy_damage);
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            this.myWorld.dropManager.dropPowerUp(this.getPosition().x + this.hitboxOffset.x, this.getPosition().y + this.hitboxOffset.y);
            this.myWorld.createExplosionEffect(this.getPosition().x, this.getPosition().y - this.hitbox.halfHeight);
            this.kill();
        }
    }
}
exports.CrazyRazyFly = CrazyRazyFly;
var CrazyRazyFlyState;
(function (CrazyRazyFlyState) {
    CrazyRazyFlyState["initial"] = "initial";
    CrazyRazyFlyState["attack"] = "attack";
    CrazyRazyFlyState["goBackUp"] = "goBackUp";
    CrazyRazyFlyState["move"] = "move";
    CrazyRazyFlyState["flee"] = "flee";
})(CrazyRazyFlyState || (CrazyRazyFlyState = {}));
class CrazyRazyFlyInitialState {
    constructor(actor) {
        this.elapsedTime = 0;
        this.endTime = 400;
        this.actor = actor;
    }
    enter() {
        console.log('CrazyRazyFlying Enter: ' + this.name);
        this.initialized = true;
        this.actor.animations.play(CrazyRazyFlyAnimationNames.idle);
        this.startX = this.actor.position.x;
        this.startY = this.actor.position.y;
        this.endX = this.startX - 30;
        this.endY = this.startY - 40;
        this.actor.targetSpeed.x = 0;
        this.actor.targetSpeed.y = 0;
        // console.log(this.startX,this.startY);
        // console.log(this.endX,this.endY);
    }
    update() {
        this.elapsedTime += main_1.fixedTimeMS;
        this.actor.getPosition().x = mathutil_1.MathUtil.lerp(this.startX, this.endX, this.elapsedTime / this.endTime);
        this.actor.getPosition().y = mathutil_1.MathUtil.lerp(this.startY, this.endY, this.elapsedTime / this.endTime);
        if (this.elapsedTime >= this.endTime) {
            this.actor.fsm.changeState(CrazyRazyFlyState.move);
            return;
        }
    }
    exit() {
        console.log('CrazyRazyFlying Exit: ' + this.name);
        this.initialized = false;
        this.elapsedTime = 0;
    }
}
class CrazyRazyFlyMoveState {
    constructor(actor) {
        this.name = CrazyRazyFlyState.move;
        this.startX = 0;
        this.startY = 0;
        this.endX = 0;
        this.endY = 0;
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
        this.player = this.actor.myWorld.entityManager.player;
        let dirX = mathutil_1.MathUtil.sign(this.player.getPosition().x - this.actor.getPosition().x);
        this.actor.targetSpeed.x = this.actor.horizontalSpeed * dirX;
        this.actor.setFacingDirection(-dirX);
    }
    update() {
        if (Math.abs(this.actor.getPosition().x - this.player.getPosition().x) < 25) {
            this.actor.targetPos.x = this.player.getPosition().x;
            this.actor.targetPos.y = this.player.getPosition().y;
            this.actor.afterTargetPos.x = this.player.getPosition().x + 25 * mathutil_1.MathUtil.sign(this.actor.targetSpeed.x);
            this.actor.afterTargetPos.y = this.actor.getPosition().y;
            this.actor.fsm.changeState(CrazyRazyFlyState.attack);
            return;
        }
    }
    exit() {
        this.initialized = false;
    }
}
class CrazyRazyFlyAttackState {
    constructor(actor) {
        this.name = CrazyRazyFlyState.attack;
        this.startX = 0;
        this.startY = 0;
        this.endX = 0;
        this.endY = 0;
        this.elapsedTime = 0;
        this.endTime = 200;
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
        this.startX = this.actor.getPosition().x;
        this.startY = this.actor.getPosition().y;
        this.endX = this.actor.myWorld.entityManager.player.getPosition().x;
        this.endY = this.actor.myWorld.entityManager.player.getPosition().y;
        this.actor.targetSpeed.x = 0;
        this.actor.targetSpeed.y = 0;
        this.actor.animations.play(CrazyRazyFlyAnimationNames.fly_attack);
    }
    update() {
        this.elapsedTime += main_1.fixedTimeMS;
        this.actor.getPosition().x = mathutil_1.MathUtil.lerp(this.startX, this.endX, this.elapsedTime / this.endTime);
        this.actor.getPosition().y = mathutil_1.MathUtil.lerp(this.startY, this.endY, this.elapsedTime / this.endTime);
        if (this.elapsedTime >= this.endTime) {
            this.actor.fsm.changeState(CrazyRazyFlyState.goBackUp);
            return;
        }
    }
    exit() {
        this.initialized = false;
        this.elapsedTime = 0;
    }
}
class CrazyRazyFlyGoBackUpkState {
    constructor(actor) {
        this.name = CrazyRazyFlyState.goBackUp;
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
        this.actor.animations.play(CrazyRazyFlyAnimationNames.fly);
    }
    update() {
        let dx = this.actor.afterTargetPos.x - this.actor.getPosition().x;
        let dy = this.actor.afterTargetPos.y - this.actor.getPosition().y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let dirX = dx / distance;
        let dirY = dy / distance;
        this.actor.targetSpeed.x = dirX * this.actor.attackSpeed;
        this.actor.targetSpeed.y = dirY * this.actor.attackSpeed;
        if (distance < 1) {
            this.actor.targetSpeed.x = 0;
            this.actor.targetSpeed.y = 0;
            this.actor.fsm.changeState(CrazyRazyFlyState.move);
            return;
        }
    }
    exit() {
        this.initialized = false;
    }
}
class CrazyRazyFleeState {
    constructor(actor) {
        this.name = CrazyRazyFlyState.flee;
        this.startX = 0;
        this.startY = 0;
        this.endX = 0;
        this.endY = 0;
        this.elapsedTime = 0;
        this.endTime = 1000;
        this.actor = actor;
    }
    enter() {
        console.log('CrazyRazyFly Enter: ' + this.name);
        this.initialized = true;
        this.startX = this.actor.getPosition().x;
        this.startY = this.actor.getPosition().y;
        this.endX = this.startX - 30;
        this.endY = this.startY - 100;
        this.actor.setFacingDirection(1);
        this.actor.animations.play(CrazyRazyFlyAnimationNames.idle);
    }
    update() {
        this.elapsedTime += main_1.fixedTimeMS;
        this.actor.getPosition().x = mathutil_1.MathUtil.lerp(this.startX, this.endX, this.elapsedTime / this.endTime);
        this.actor.getPosition().y = mathutil_1.MathUtil.lerp(this.startY, this.endY, this.elapsedTime / this.endTime);
        if (this.elapsedTime >= this.endTime) {
            this.actor.kill();
            return;
        }
    }
    exit() {
        console.log('CrazyRazyFly Exit: ' + this.name);
        this.initialized = false;
        this.elapsedTime = 0;
    }
}


/***/ }),
/* 68 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FootHolder = void 0;
const enemy_1 = __webpack_require__(31);
const konstants_1 = __webpack_require__(2);
const helper_1 = __webpack_require__(24);
const stateMachine_1 = __webpack_require__(33);
const main_1 = __webpack_require__(0);
var FootHolderAnimationNames;
(function (FootHolderAnimationNames) {
    FootHolderAnimationNames["idle"] = "idle";
    FootHolderAnimationNames["active"] = "active";
})(FootHolderAnimationNames || (FootHolderAnimationNames = {}));
class FootHolder extends enemy_1.Enemy {
    constructor(myWorld, tag, e, game, x, y, key, frame) {
        super(myWorld, tag, e, game, x, y, key, frame);
        this.targetSpeed = new Phaser.Point(0, 0);
        this.leftPositions = new Array();
        this.rightPositions = new Array();
        this.originalX = x;
        this.originalY = y;
        this.fsm = new stateMachine_1.StateMachine();
        this.getPosition().x = x;
        this.getPosition().y = y;
        this.position.x = (this.getPosition().x + 0.5) | 0;
        this.position.y = this.getPosition().y;
        this.smoothed = false;
        this.anchor.setTo(0.5, 0.5);
        this.health = 10;
        this.maxHealth = 10;
        this.isShielded = false;
        this.animations.add(FootHolderAnimationNames.idle, ['foot_holder_01'], 10, false, false);
        this.animations.add(FootHolderAnimationNames.active, ['foot_holder_01', 'foot_holder_02', 'foot_holder_03', 'foot_holder_04'], 5, true, false);
        this.hitbox = new Phaser.Rectangle(this.getPosition().x, this.getPosition().y, 24, 12);
        this.hitboxOffset.x = -this.hitbox.halfWidth;
        this.hitboxOffset.y = -this.hitbox.halfHeight;
        this.updateRect();
    }
    manualUpdate() {
        // this.pGraphicsDebug.clear();
        if (!this.enabled) {
            return;
        }
        if (!this.alive) {
            return;
        }
        this.frozen.update();
        if (this.frozen.isFrozen) {
            return;
        }
        this.fsm.currentState.update();
        this.velocity.x = this.targetSpeed.x;
        this.velocity.y = this.targetSpeed.y;
        this.getPosition().x += this.velocity.x * main_1.fixedTime;
        this.getPosition().y += this.velocity.y * main_1.fixedTime;
        this.position.x = (this.getPosition().x + 0.5) | 0;
        this.position.y = this.getPosition().y;
        this.surface.p1.x += this.velocity.x * main_1.fixedTime;
        this.surface.p1.y += this.velocity.y * main_1.fixedTime;
        this.surface.p2.x += this.velocity.x * main_1.fixedTime;
        this.surface.p2.y += this.velocity.y * main_1.fixedTime;
        this.surface.targetSpeed.x = this.targetSpeed.x;
        this.surface.targetSpeed.y = this.targetSpeed.y;
        this.updateRect();
    }
    getRandomLeftPosition() {
        return this.leftPositions[Math.floor(Math.random() * this.leftPositions.length)];
    }
    getRandomRightPosition() {
        return this.rightPositions[Math.floor(Math.random() * this.rightPositions.length)];
    }
    initialize() {
        this.fsm.addState(FootHolderState.initial, new FootHolderInitialState(this));
        this.fsm.addState(FootHolderState.choose_position, new FootHolderChoosePositionState(this));
        this.fsm.addState(FootHolderState.move, new FootHolderMoveState(this));
        this.fsm.changeState(FootHolderState.initial);
    }
    getSurface() {
        return this.surface;
    }
    setSurface(s) {
        this.surface = s;
    }
    /**
     *
     * @param left
     * @param right
     */
    setNumTiles(left, right) {
        let leftPos = this.originalX - (left * 16);
        let rightPos = this.originalX + (right * 16);
        this.leftPositions.push({ x: leftPos, y: this.originalY - 36 });
        this.leftPositions.push({ x: leftPos, y: this.originalY - 24 });
        this.leftPositions.push({ x: leftPos, y: this.originalY - 16 });
        this.leftPositions.push({ x: leftPos, y: this.originalY - 8 });
        this.leftPositions.push({ x: leftPos, y: this.originalY });
        this.leftPositions.push({ x: leftPos, y: this.originalY + 8 });
        this.leftPositions.push({ x: leftPos, y: this.originalY + 16 });
        this.leftPositions.push({ x: leftPos, y: this.originalY + 24 });
        this.leftPositions.push({ x: leftPos, y: this.originalY + 36 });
        this.leftPositions.push({ x: leftPos, y: this.originalY + 48 });
        this.rightPositions.push({ x: rightPos, y: this.originalY - 36 });
        this.rightPositions.push({ x: rightPos, y: this.originalY - 24 });
        this.rightPositions.push({ x: rightPos, y: this.originalY - 16 });
        this.rightPositions.push({ x: rightPos, y: this.originalY - 8 });
        this.rightPositions.push({ x: rightPos, y: this.originalY });
        this.rightPositions.push({ x: rightPos, y: this.originalY + 8 });
        this.rightPositions.push({ x: rightPos, y: this.originalY + 16 });
        this.rightPositions.push({ x: rightPos, y: this.originalY + 24 });
        this.rightPositions.push({ x: rightPos, y: this.originalY + 36 });
        this.rightPositions.push({ x: rightPos, y: this.originalY + 48 });
    }
    shoot() {
        this.game.sound.play(konstants_1.AudioName.enemy_shoot);
        this.isShielded = false;
        let bullet = this.myWorld.entityManager.createBitmapBullet(this, this.position.x - 4, this.position.y + 1, 6, 6, konstants_1.EntityType.bullet, konstants_1.EntityType.foot_holder_bullet);
        bullet.horizontalSpeed = 170;
        bullet.targetSpeed.x = bullet.horizontalSpeed * -1;
        bullet = this.myWorld.entityManager.createBitmapBullet(this, this.position.x + 4, this.position.y + 1, 6, 6, konstants_1.EntityType.bullet, konstants_1.EntityType.foot_holder_bullet);
        bullet.horizontalSpeed = 170;
        bullet.targetSpeed.x = bullet.horizontalSpeed * 1;
    }
    takeDamage(damage) {
        // if (this.isShielded) {
        //     this.game.sound.play(AudioName.dink);
        //     return;
        // }
        // if (this.health <= 0) {
        //     return;
        // }
        // this.game.sound.play(AudioName.enemy_damage);
        // this.health -= damage;
        // if (this.health <= 0) {
        //     this.health = 0;
        //     this.myWorld.dropManager.dropPowerUp(this.getPosition().x + this.hitboxOffset.x, this.getPosition().y + this.hitboxOffset.y);
        //     this.myWorld.createExplosionEffect(this.getPosition().x, this.getPosition().y - (<Phaser.Rectangle>this.hitbox).halfHeight);
        //     this.kill();
        // }
    }
}
exports.FootHolder = FootHolder;
var FootHolderState;
(function (FootHolderState) {
    FootHolderState["initial"] = "initial";
    FootHolderState["choose_position"] = "choose_position";
    FootHolderState["move"] = "move";
})(FootHolderState || (FootHolderState = {}));
class FootHolderInitialState {
    constructor(actor) {
        this.name = FootHolderState.initial;
        this.actor = actor;
    }
    enter() {
        // console.log('FootHolder Enter: ' + this.name);
        this.initialized = true;
        let leftPos = this.actor.getRandomLeftPosition();
        this.actor.goToPosX = leftPos.x;
        this.actor.goToPosY = leftPos.y;
        let dist = helper_1.Helper.distanceTo3(this.actor.goToPosX, this.actor.goToPosY, this.actor.getPosition().x, this.actor.getPosition().y);
        this.actor.dirX = (this.actor.goToPosX - this.actor.getPosition().x) / dist;
        this.actor.dirY = (this.actor.goToPosY - this.actor.getPosition().y) / dist;
        this.actor.targetSpeed.x = this.actor.dirX * this.actor.horizontalSpeed;
        this.actor.targetSpeed.y = this.actor.dirY * this.actor.horizontalSpeed;
    }
    update() {
        this.actor.fsm.changeState(FootHolderState.move);
    }
    exit() {
        // console.log('FootHolder Exit: ' + this.name);
        this.initialized = false;
    }
}
class FootHolderChoosePositionState {
    constructor(actor) {
        this.name = FootHolderState.choose_position;
        this.actor = actor;
    }
    enter() {
        // console.log('FootHolder Enter: ' + this.name);
        this.initialized = true;
        let pos = this.actor.dirX > 0 ? this.actor.getRandomLeftPosition() : this.actor.getRandomRightPosition();
        this.actor.goToPosX = pos.x;
        this.actor.goToPosY = pos.y;
        let dist = helper_1.Helper.distanceTo3(this.actor.goToPosX, this.actor.goToPosY, this.actor.getPosition().x, this.actor.getPosition().y);
        this.actor.dirX = (this.actor.goToPosX - this.actor.getPosition().x) / dist;
        this.actor.dirY = (this.actor.goToPosY - this.actor.getPosition().y) / dist;
        this.actor.targetSpeed.x = this.actor.dirX * this.actor.horizontalSpeed;
        this.actor.targetSpeed.y = this.actor.dirY * this.actor.horizontalSpeed;
    }
    update() {
        this.actor.fsm.changeState(FootHolderState.move);
    }
    exit() {
        // console.log('FootHolder Exit: ' + this.name);
        this.initialized = false;
    }
}
class FootHolderMoveState {
    constructor(actor) {
        this.name = FootHolderState.move;
        this.endX = 0;
        this.endY = 0;
        this.shootElapsedTime = 0;
        this.shootEndTime = 3000;
        this.actor = actor;
    }
    enter() {
        // console.log('FootHolder Enter: ' + this.name);
        this.initialized = true;
        this.actor.animations.play(FootHolderAnimationNames.active);
        this.endX = this.actor.goToPosX;
        this.endY = this.actor.goToPosY;
    }
    update() {
        if (helper_1.Helper.distanceTo3(this.actor.getPosition().x, this.actor.getPosition().y, this.endX, this.endY) < 2) {
            this.actor.getPosition().x = this.endX;
            this.actor.getPosition().y = this.endY;
            this.actor.position.x = (this.actor.getPosition().x + 0.5) | 0;
            this.actor.position.y = this.actor.getPosition().y;
            this.actor.targetSpeed.x *= -1;
            this.actor.targetSpeed.y *= -1;
            this.actor.fsm.changeState(FootHolderState.choose_position);
        }
        this.shootElapsedTime += main_1.fixedTimeMS;
        if (this.shootElapsedTime >= this.shootEndTime) {
            this.shootElapsedTime = 0;
            this.actor.shoot();
        }
    }
    exit() {
        // console.log('FootHolder Exit: ' + this.name);
        this.initialized = false;
    }
}


/***/ }),
/* 69 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CollisionManager = void 0;
const konstants_1 = __webpack_require__(2);
const sat2d_1 = __webpack_require__(17);
const polygon_1 = __webpack_require__(70);
const vector2_1 = __webpack_require__(20);
const helper_1 = __webpack_require__(24);
class CollisionManager {
    constructor(game, myWorld) {
        this.game = game;
        this.myWorld = myWorld;
        this.createEntityFromSpawner = new Phaser.Signal();
        this.stop = false;
        this.tempRect01 = new Phaser.Rectangle(0, 0, 1, 1);
        this.tempRect02 = new Phaser.Rectangle(0, 0, 1, 1);
        this.tempCameraRect = new Phaser.Rectangle(0, 0, 1, 1);
        this.tempSpawnerRect = new Phaser.Rectangle(0, 0, 1, 1);
        this.em = this.myWorld.entityManager;
        this.graphicsDebug = this.game.add.graphics();
        this.game.add.existing(this.graphicsDebug);
    }
    update() {
        this.graphicsDebug.clear();
        if (this.stop) {
            return;
        }
        for (let i = 0; i < this.em.entities.length; i++) {
            this.tempEntity = this.em.entities[i];
            // bullets
            if (this.tempEntity.tag == konstants_1.TagType.bullet) {
                this.tempBullet = this.em.entities[i];
                if (this.tempBullet.getPosition().x > this.game.camera.x + this.game.camera.width) {
                    this.tempBullet.destroyed.dispatch();
                    this.tempBullet.kill();
                }
                else if (this.tempBullet.getPosition().x < this.game.camera.x) {
                    this.tempBullet.destroyed.dispatch();
                    this.tempBullet.kill();
                }
                if (!this.tempBullet.alive) {
                    continue;
                }
                for (let j = 0; j < this.em.entities.length; j++) {
                    if (!this.em.entities[j].alive) {
                        continue;
                    }
                    if (this.em.entities[j].tag == konstants_1.TagType.player) {
                        let player = this.em.entities[j];
                        if (player.isHurt) {
                            continue;
                        }
                        if (player.isInvincible) {
                            continue;
                        }
                    }
                    this.tempBullet.checkCollideWith(this.em.entities[j]);
                }
            }
            else if (this.tempEntity.tag == konstants_1.TagType.player) {
                this.player = this.tempEntity;
                this.player.checkSurfaceCollisions(this.em.surfaces);
                this.player.checkLadderCollisions(this.em.ladders);
                for (let j = 0; j < this.em.entities.length; j++) {
                    if (this.player.isInvincible) {
                        continue;
                    }
                    if (this.player.isHurt) {
                        continue;
                    }
                    if (this.em.entities[j].tag == konstants_1.TagType.player) {
                        continue;
                    }
                    if (this.em.entities[j].tag == konstants_1.TagType.bullet) {
                        continue;
                    }
                    if (helper_1.Helper.distanceTo(this.em.entities[j], this.player) > 50) {
                        continue;
                    }
                    this.checkCollideWithEntity(this.em.entities[j]);
                }
            }
            else if (this.em.entities[i].tag == konstants_1.TagType.power_up) {
                if (this.em.entities[i].isGlobal) {
                    continue;
                }
                this.em.entities[i].checkSurfaceCollisions(this.em.surfaces);
            }
            if (this.tempEntity.myEntityType == konstants_1.EntityType.sniper_joe) {
                this.tempEntity.checkSurfaceCollisions(this.em.surfaces);
            }
            else if (this.tempEntity.myEntityType == konstants_1.EntityType.big_eye) {
                this.tempEntity.checkSurfaceCollisions(this.em.surfaces);
            }
            else if (this.tempEntity.myEntityType == konstants_1.EntityType.flea) {
                this.tempEntity.checkSurfaceCollisions(this.em.surfaces);
            }
            else if (this.em.entities[i].myEntityType == konstants_1.EntityType.cut_man ||
                this.em.entities[i].myEntityType == konstants_1.EntityType.guts_man ||
                this.em.entities[i].myEntityType == konstants_1.EntityType.ice_man ||
                this.em.entities[i].myEntityType == konstants_1.EntityType.fire_man ||
                this.em.entities[i].myEntityType == konstants_1.EntityType.bomb_man ||
                this.em.entities[i].myEntityType == konstants_1.EntityType.elec_man) {
                this.em.entities[i].checkSurfaceCollisions(this.em.surfaces);
            }
            else if (this.em.entities[i].myEntityType == konstants_1.EntityType.bombomb_shrapnel) {
                this.checkShrapnellCollideWithSurface(this.em.entities[i]);
            }
            else if (this.em.entities[i].myEntityType == konstants_1.EntityType.spine) {
                this.em.entities[i].checkSurfaceCollisions(this.em.surfaces);
            }
            else if (this.em.entities[i].myEntityType == konstants_1.EntityType.octopus_battery) {
                this.em.entities[i].checkSurfaceCollisions(this.em.surfaces);
            }
            else if (this.em.entities[i].myEntityType == konstants_1.EntityType.throwable_object) {
                this.checkThrowableAgainstWalls(this.em.entities[i]);
            }
            else if (this.tempEntity.myEntityType == konstants_1.EntityType.picket_man) {
                this.tempEntity.checkSurfaceCollisions(this.em.surfaces);
            }
            else if (this.tempEntity.myEntityType == konstants_1.EntityType.crazy_razy) {
                this.tempEntity.checkSurfaceCollisions(this.em.surfaces);
            }
        }
        // for (let i = 0; i < this.em.entities.length; i++) {
        //     if (this.em.entities[i].myEntityType == EntityType.cut_man) {
        //         this.em.entities[i].checkSurfaceCollisions(this.em.surfaces);
        //     }
        // }
        // for (let i = 0; i < this.em.entities.length; i++) {
        //     if (this.em.entities[i].tag == TagType.power_up) {
        //         (<PowerUp>this.em.entities[i]).checkSurfaceCollisions(this.em.surfaces);
        //     }
        // }
        // for (let i = 0; i < this.em.entities.length; i++) {
        //     if (this.em.entities[i].myEntityType == EntityType.bombomb_shrapnel) {
        //         this.checkShrapnellCollideWithSurface(<BombombShrapnel>this.em.entities[i]);
        //     }
        // }
        // for (let i = 0; i < this.em.entities.length; i++) {
        //     if (this.em.entities[i].myEntityType == EntityType.spine) {
        //         (<Spine>this.em.entities[i]).checkSurfaceCollisions(this.em.surfaces);
        //     }
        // }
        // for (let i = 0; i < this.em.entities.length; i++) {
        //     if (this.em.entities[i].myEntityType == EntityType.octopus_battery) {
        //         (<OctopusBattery>this.em.entities[i]).checkSurfaceCollisions(this.em.surfaces);
        //     }
        // }
        this.checkVanishingBlockTriggers();
        this.checkCrazyRazyTriggers();
        this.checkDoors();
        this.checkSpawners();
        this.checkOffscreen(); // Check for when entities are off-screen and kill them.
        this.checkDeathZones();
    }
    checkCollideWithEntity(entity) {
        // Spike is a special case because I dun' fucked up nigga!
        if (entity.myEntityType == konstants_1.EntityType.spike) {
            this.checkCollisionWithSpike(entity);
            return;
        }
        // Power ups is a special case because I dun' fucked up nigga!
        if (entity.tag == konstants_1.TagType.power_up) {
            this.checkPlayerCollideWithPowerUp(entity);
            return;
        }
        // Vanishing Block & Moving Platform is a special case because I dun' fucked up nigga!
        // Let foot_holder pass through because it is an enemy and moving platform...fucked up shit.
        if (entity.tag == konstants_1.TagType.platform && entity.myEntityType != konstants_1.EntityType.foot_holder) {
            return;
        }
        this.tempHitbox_1 = this.player.hitbox;
        this.tempHitbox_2 = entity.hitbox;
        let poly1 = new polygon_1.Polygon(this.tempHitbox_1.x, this.tempHitbox_1.y, new Array(new vector2_1.Vector2(0, 0), new vector2_1.Vector2(this.tempHitbox_1.width, 0), new vector2_1.Vector2(this.tempHitbox_1.width, this.tempHitbox_1.height), new vector2_1.Vector2(0, this.tempHitbox_1.height)));
        // this.graphicsDebug.beginFill(0xff0000, 0.5);
        // this.graphicsDebug.moveTo(poly1.getTransformedVertices()[0].x, poly1.getTransformedVertices()[0].y);
        // this.graphicsDebug.lineTo(poly1.getTransformedVertices()[1].x, poly1.getTransformedVertices()[1].y);
        // this.graphicsDebug.lineTo(poly1.getTransformedVertices()[2].x, poly1.getTransformedVertices()[2].y);
        // this.graphicsDebug.lineTo(poly1.getTransformedVertices()[3].x, poly1.getTransformedVertices()[3].y);
        // this.graphicsDebug.lineTo(poly1.getTransformedVertices()[0].x, poly1.getTransformedVertices()[0].y);
        let poly2 = new polygon_1.Polygon(this.tempHitbox_2.x, this.tempHitbox_2.y, new Array(new vector2_1.Vector2(0, 0), new vector2_1.Vector2(this.tempHitbox_2.width, 0), new vector2_1.Vector2(this.tempHitbox_2.width, this.tempHitbox_2.height), new vector2_1.Vector2(0, this.tempHitbox_2.height)));
        // this.graphicsDebug.beginFill(0xff0000, 0.5);
        // this.graphicsDebug.moveTo(poly2.getTransformedVertices()[0].x, poly2.getTransformedVertices()[0].y);
        // this.graphicsDebug.lineTo(poly2.getTransformedVertices()[1].x, poly2.getTransformedVertices()[1].y);
        // this.graphicsDebug.lineTo(poly2.getTransformedVertices()[2].x, poly2.getTransformedVertices()[2].y);
        // this.graphicsDebug.lineTo(poly2.getTransformedVertices()[3].x, poly2.getTransformedVertices()[3].y);
        // this.graphicsDebug.lineTo(poly2.getTransformedVertices()[0].x, poly2.getTransformedVertices()[0].y);
        this.tempInto = null;
        this.tempInto = sat2d_1.SAT2D.testPolygonVsPolygon(poly1, poly2, this.tempInto);
        if (this.tempInto == null) {
            return;
        }
        this.player.takeDamage(entity.contactDamage, helper_1.Helper.directionTo(entity, this.player));
    }
    checkCollisionWithSpike(entity) {
        this.tempHitbox_1 = this.player.hitbox;
        this.tempPolyHitbox_1 = entity.hitbox;
        let poly1 = new polygon_1.Polygon(this.tempHitbox_1.x, this.tempHitbox_1.y, new Array(new vector2_1.Vector2(0, 0), new vector2_1.Vector2(this.tempHitbox_1.width, 0), new vector2_1.Vector2(this.tempHitbox_1.width, this.tempHitbox_1.height), new vector2_1.Vector2(0, this.tempHitbox_1.height)));
        // this.graphicsDebug.beginFill(0xff0000, 0.5);
        // this.graphicsDebug.moveTo(poly1.getTransformedVertices()[0].x, poly1.getTransformedVertices()[0].y)
        // this.graphicsDebug.lineTo(poly1.getTransformedVertices()[1].x, poly1.getTransformedVertices()[1].y)
        // this.graphicsDebug.lineTo(poly1.getTransformedVertices()[2].x, poly1.getTransformedVertices()[2].y)
        // this.graphicsDebug.lineTo(poly1.getTransformedVertices()[3].x, poly1.getTransformedVertices()[3].y)
        // this.graphicsDebug.lineTo(poly1.getTransformedVertices()[0].x, poly1.getTransformedVertices()[0].y)
        let width = (this.tempPolyHitbox_1.points[1].x - this.tempPolyHitbox_1.points[0].x) * 0.5;
        let poly2 = new polygon_1.Polygon(entity.getPosition().x, entity.getPosition().y, new Array());
        poly2.vertices.push(new vector2_1.Vector2(-width, 0));
        poly2.vertices.push(new vector2_1.Vector2(width, 0));
        poly2.vertices.push(new vector2_1.Vector2(0, -16));
        poly2.transformedVertices.push(new vector2_1.Vector2(entity.getPosition().x + poly2.vertices[0].x, entity.getPosition().y + poly2.vertices[0].y));
        poly2.transformedVertices.push(new vector2_1.Vector2(entity.getPosition().x + poly2.vertices[1].x, entity.getPosition().y + poly2.vertices[1].y));
        poly2.transformedVertices.push(new vector2_1.Vector2(entity.getPosition().x + poly2.vertices[2].x, entity.getPosition().y + poly2.vertices[2].y));
        // this.graphicsDebug.beginFill(0xff0000, 0.5);
        // this.graphicsDebug.moveTo(poly2.getTransformedVertices()[0].x, poly2.getTransformedVertices()[0].y);
        // for (let k = 1; k < hitbox2.points.length; k++) {
        //     this.graphicsDebug.lineTo(poly2.getTransformedVertices()[k].x, poly2.getTransformedVertices()[k].y);
        // }
        // this.graphicsDebug.lineTo(poly2.getTransformedVertices()[0].x, poly2.getTransformedVertices()[0].y);
        this.tempInto = null;
        this.tempInto = sat2d_1.SAT2D.testPolygonVsPolygon(poly1, poly2, this.tempInto);
        if (this.tempInto != null) {
            this.player.takeDamage(entity.contactDamage, helper_1.Helper.directionTo(entity, this.player));
        }
    }
    checkPlayerCollideWithPowerUp(entity) {
        if (entity.tag != konstants_1.TagType.power_up) {
            return;
        }
        this.tempRect01 = entity.hitbox;
        if (!this.em.player.hitbox.intersects(this.tempRect01)) {
            return;
        }
        if (this.em.player.healthMeter.isGivingEnergy) {
            return;
        }
        switch (entity.myEntityType) {
            case konstants_1.EntityType.energy_pellet_small:
            case konstants_1.EntityType.energy_pellet_large:
                this.em.player.giveHealth(entity.energyRestore);
                this.em.player.healthMeter.restoreEnergy(entity.energyRestore);
                entity.kill();
                break;
            case konstants_1.EntityType.weapon_energy_small:
            case konstants_1.EntityType.weapon_energy_large:
                if (this.em.player.getCurrentWeapon().energyMeter != null && this.em.player.getCurrentWeapon().energyMeter.isGivingEnergy) {
                    break;
                }
                this.em.player.getCurrentWeapon().restoreEnergy(entity.energyRestore);
                entity.kill();
                break;
            case konstants_1.EntityType.robot_crystal:
                this.game.sound.play(konstants_1.AudioName.bonus_ball);
                entity.kill();
                break;
            case konstants_1.EntityType.one_up:
                this.game.sound.play(konstants_1.AudioName.bonus_ball);
                entity.kill();
                break;
            case konstants_1.EntityType.cut_man_boss_item:
            case konstants_1.EntityType.guts_man_boss_item:
            case konstants_1.EntityType.ice_man_boss_item:
            case konstants_1.EntityType.bomb_man_boss_item:
            case konstants_1.EntityType.fire_man_boss_item:
            case konstants_1.EntityType.elec_man_boss_item:
                this.myWorld.pickedUpBossItem(entity.myEntityType);
                entity.kill();
                break;
            default:
                console.error('This entity type does not exist.');
                break;
        }
    }
    /**
     * Check bomb shrapnel collisions with the walls. The walls are the surfaces. Walls represent the rectangle that the surfaces
     * form. Shrapnels use rectangle intersection because it is more reliable than doing rectangle/line collision detection.
     * @param entity
     */
    checkShrapnellCollideWithSurface(entity) {
        this.tempRect02 = entity.hitbox;
        for (let i = 0; i < this.myWorld.walls.length; i++) {
            this.tempWall = this.myWorld.walls[i];
            if (!this.tempWall.top.collidable &&
                !this.tempWall.bottom.collidable &&
                !this.tempWall.left.collidable &&
                !this.tempWall.right.collidable) {
                // This must be a vanishing block that just vanished.
                continue;
            }
            this.tempRect01.x = this.tempWall.top.p1.x;
            this.tempRect01.y = this.tempWall.top.p1.y;
            this.tempRect01.width = this.tempWall.top.p2.x - this.tempWall.top.p1.x;
            this.tempRect01.height = this.tempWall.bottom.p2.y - this.tempWall.top.p2.y;
            if (this.tempRect02.intersects(this.tempRect01, 0)) {
                entity.takeDamage(1);
                return;
            }
        }
    }
    checkThrowableAgainstWalls(entity) {
        if (!entity.canCollideWithWalls) {
            return;
        }
        this.tempHitbox_1 = entity.hitbox;
        for (let i = 0; i < this.myWorld.walls.length; i++) {
            if (Phaser.Rectangle.intersects(this.tempHitbox_1, this.myWorld.walls[i].rect)) {
                entity.takeDamage(9999);
                return;
            }
        }
    }
    checkVanishingBlockTriggers() {
        this.tempCameraRect.x = this.game.camera.x;
        this.tempCameraRect.y = this.game.camera.y;
        this.tempCameraRect.width = this.game.camera.width;
        this.tempCameraRect.height = this.game.camera.height;
        for (let i = 0; i < this.myWorld.vanishingBlockTriggers.length; i++) {
            // console.log(this.myWorld.vanishingBlockTriggers[i].groupIndex);
            if (this.tempCameraRect.intersects(this.myWorld.vanishingBlockTriggers[i].trigger, 0)) {
                if (this.myWorld.vanishingBlockManager.isTriggerActive(this.myWorld.vanishingBlockTriggers[i].groupIndex)) {
                    continue;
                }
                this.myWorld.vanishingBlockManager.activateTrigger(this.myWorld.vanishingBlockTriggers[i].groupIndex);
            }
            else {
                if (!this.myWorld.vanishingBlockManager.isTriggerActive(this.myWorld.vanishingBlockTriggers[i].groupIndex)) {
                    continue;
                }
                this.myWorld.vanishingBlockManager.deactivateTrigger(this.myWorld.vanishingBlockTriggers[i].groupIndex);
            }
        }
    }
    checkCrazyRazyTriggers() {
        for (let i = 0; i < this.myWorld.crazyRazyTriggers.length; i++) {
            if (!this.myWorld.crazyRazyTriggers[i].intersects(this.player.hitbox, 0)) {
                continue;
            }
            this.em.entities.filter((value) => {
                return value.myEntityType == konstants_1.EntityType.crazy_razy_fly;
            }).forEach((value) => {
                value.flee();
            });
        }
    }
    checkDoors() {
        for (let i = 0; i < this.myWorld.doors.length; i++) {
            if (this.myWorld.doors[i].secondDoorIntoBossRoom) {
                continue;
            }
            if (this.myWorld.doors[i].isOpen) {
                continue;
            }
            if (!Phaser.Rectangle.intersects(this.player.hitbox, this.myWorld.doors[i].hitbox)) {
                continue;
            }
            this.myWorld.doors[i].isOpen = true;
            this.myWorld.openDoor(this.myWorld.doors[i]);
            break;
        }
    }
    checkSpawners() {
        // Check for when enemy spawners are in view of the camera and spawn stuff.
        for (let i = 0; i < this.myWorld.spawners.length; i++) {
            this.tempSpawner = this.myWorld.spawners[i];
            // Spawners that use distance to spawn their entities: super_cutter
            if (this.tempSpawner.useDistanceCheck) {
                let distX = Math.abs(this.player.getPosition().x - this.tempSpawner.x);
                let distY = Math.abs(this.player.getPosition().y - this.tempSpawner.y);
                if (distX > this.tempSpawner.withinPlayerDistanceX) {
                    continue;
                }
                if (distY > this.tempSpawner.withinPlayerDistanceY) {
                    continue;
                }
            }
            this.tempCameraRect.x = this.game.camera.x;
            this.tempCameraRect.y = this.game.camera.y;
            this.tempCameraRect.width = this.game.camera.width;
            this.tempCameraRect.height = this.game.camera.height;
            let spawnerWidth = this.tempSpawner.width * 0.5;
            let spawnerHeight = this.tempSpawner.height * 0.5;
            this.tempSpawnerRect.x = this.tempSpawner.x;
            this.tempSpawnerRect.y = this.tempSpawner.y;
            this.tempSpawnerRect.width = spawnerWidth;
            this.tempSpawnerRect.height = spawnerHeight;
            if (this.tempCameraRect.intersects(this.tempSpawnerRect, 0)) {
                if (this.tempSpawner.canLoop) {
                    if (this.tempSpawner.entities.length > 0) {
                        // If this spawner has entities that are NOT alive then remove them so we can spawn a new one.
                        for (let j = this.tempSpawner.entities.length - 1; j >= 0; j--) {
                            if (!this.tempSpawner.entities[j].alive) {
                                this.tempSpawner.entities.splice(j, 1);
                            }
                        }
                    }
                    if (this.tempSpawner.entities.length >= this.tempSpawner.maxEntitiesAllowedPerLoop) {
                        continue;
                    }
                    this.tempSpawner.loopElapsedTime += this.game.time.elapsedMS;
                    if (this.tempSpawner.loopElapsedTime >= this.tempSpawner.loopEndTime) {
                        this.tempSpawner.loopElapsedTime = 0;
                        // Let the world know to create an entity.
                        this.createEntityFromSpawner.dispatch(this.tempSpawner);
                        this.tempSpawner.isSpawnerOnScreen = true;
                        this.tempSpawner.entities.push(this.myWorld.entityManager.entities[this.myWorld.entityManager.entities.length - 1]);
                    }
                }
                else {
                    if (this.tempSpawner.isSpawnerOnScreen) {
                        continue;
                    }
                    // Let the world know to create an entity.
                    this.createEntityFromSpawner.dispatch(this.tempSpawner);
                    this.tempSpawner.isSpawnerOnScreen = true;
                    this.tempSpawner.entities.push(this.myWorld.entityManager.entities[this.myWorld.entityManager.entities.length - 1]);
                }
            }
            else {
                if (this.tempSpawner.isSpawnerOnScreen) {
                    this.tempSpawner.isSpawnerOnScreen = false;
                    if (this.tempSpawner.canLoop) {
                        this.tempSpawner.loopElapsedTime = 0;
                    }
                }
            }
        }
    }
    checkOffscreen() {
        for (let i = this.em.entities.length - 1; i >= 0; i--) {
            if (!this.em.entities[i].alive) {
                continue;
            }
            this.tempEntity = this.em.entities[i];
            // Allow drop_lift to always update.
            if (this.tempEntity.myEntityType == konstants_1.EntityType.drop_lift) {
                continue;
            }
            // Allow foot_holder to always update.
            // if (this.tempEntity.myEntityType == EntityType.foot_holder) {
            //     continue;
            // }
            if (this.tempEntity.tag == konstants_1.TagType.power_up) {
                if (this.tempEntity.isGlobal) {
                    continue;
                }
            }
            // Don't remove/kill player. Player may sometimes spawn off-screen; camera will adjust.
            if (this.tempEntity.myEntityType == konstants_1.EntityType.player) {
                continue;
            }
            // Special off-screen handling done by Peng.
            if (this.tempEntity.myEntityType == konstants_1.EntityType.peng) {
                continue;
            }
            // Spikes don't need to be disabled.
            if (this.tempEntity.myEntityType == konstants_1.EntityType.spike) {
                continue;
            }
            // Special case for foot_holder.
            if (this.tempEntity.myEntityType == konstants_1.EntityType.foot_holder) {
                if (!(this.tempEntity.getPosition().x - Math.abs(this.tempEntity.width) * 0.5 < this.game.camera.x + this.game.camera.width &&
                    this.tempEntity.getPosition().x + Math.abs(this.tempEntity.width) * 0.5 > this.game.camera.x &&
                    this.tempEntity.getPosition().y - Math.abs(this.tempEntity.height) * 0.5 < this.game.camera.y + this.game.camera.height &&
                    this.tempEntity.getPosition().y + Math.abs(this.tempEntity.height) * 0.5 > this.game.camera.y)) {
                    this.tempEntity.disable();
                }
                else {
                    if (this.tempEntity.enabled) {
                        continue;
                    }
                    this.tempEntity.enable();
                }
                continue;
            }
            if (this.tempEntity.getPosition().x - Math.abs(this.tempEntity.width) * 0.5 > this.game.camera.x + this.game.camera.width) {
                // console.log('off screeen 1: ' + this.tempEntity.myEntityType);
                // console.log(entity.getPosition());
                this.tempEntity.kill();
            }
            else if (this.tempEntity.getPosition().x + Math.abs(this.tempEntity.width) * 0.5 < this.game.camera.x) {
                // console.log('off screeen 2:  ' + this.tempEntity.myEntityType);
                // console.log(entity.getPosition());
                this.tempEntity.kill();
            }
            // killer_bullet & peng are allowed to go off the vertical axis.
            if (this.tempEntity.myEntityType == konstants_1.EntityType.watcher) {
                if (this.tempEntity.getPosition().y - Math.abs(this.tempEntity.height) * 0.5 > this.game.camera.y + this.game.camera.height) {
                    this.tempEntity.kill();
                }
                else if (this.tempEntity.getPosition().y + Math.abs(this.tempEntity.height) * 0.5 < this.game.camera.y) {
                    this.tempEntity.kill();
                }
            }
            if (this.tempEntity.myEntityType == konstants_1.EntityType.picket_man_weapon) {
                if (this.tempEntity.getPosition().y - Math.abs(this.tempEntity.height) * 0.5 > this.game.camera.y + this.game.camera.height) {
                    this.tempEntity.kill();
                }
                else if (this.tempEntity.getPosition().y + Math.abs(this.tempEntity.height) * 0.5 < this.game.camera.y) {
                    this.tempEntity.kill();
                }
            }
        }
    }
    checkDeathZones() {
        if ((this.player == null || this.player == undefined) || !this.player.alive) {
            return;
        }
        for (let i = 0; i < this.myWorld.deathZones.length; i++) {
            if (this.player.hitbox.intersects(this.myWorld.deathZones[i])) {
                this.player.takeDamage(9999);
            }
        }
    }
}
exports.CollisionManager = CollisionManager;


/***/ }),
/* 70 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Polygon = void 0;
const sat2d_1 = __webpack_require__(17);
const shape_1 = __webpack_require__(22);
const vector2_1 = __webpack_require__(20);
class Polygon extends shape_1.Shape {
    constructor(x, y, vertices) {
        super(x, y);
        this.transformedVertices = new Array();
        this.vertices = new Array();
        this.vertices = vertices; // The vertices of this shape
        this.name = "polygon(sides: " + this.vertices.length + ")";
        for (var i = 0; i < this.vertices.length; i++) {
            this.transformedVertices.push(new vector2_1.Vector2());
        }
    }
    // test(shape, into) {
    //     return shape.testPolygon(this, into, true);
    // }
    // testCircle(circle, into, flip) {
    //     // return SAT2D.testCircleVsPolygon(circle, this, into, !flip);
    // }
    testPolygon(polygon, into, flip = false) {
        return sat2d_1.SAT2D.testPolygonVsPolygon(this, polygon, into, flip);
    }
    // testRay(ray, into) {
    //     // return SAT2D.testRayVsPolygon(ray, this, into);
    // }
    getTransformedVertices() {
        for (var i = 0; i < this.vertices.length; i++) {
            this.transformedVertices[i].x = this.vertices[i].x + this.position.x;
            this.transformedVertices[i].y = this.vertices[i].y + this.position.y;
        }
        return this.transformedVertices;
    }
    /**
     *
     * @param {Number} x
     * @param {Number} y
     * @param {int} sides
     * @param {Number} radius
     * @return {Polygon}
     */
    static create(x, y, sides, radius = 100) {
        if (sides < 3) {
            throw 'Polygon - Needs at least 3 sides';
        }
        let rotation = (Math.PI * 2) / sides;
        let angle;
        let vector;
        let vertices = [];
        for (let i = 0; i < sides; i++) {
            angle = (i * rotation) + ((Math.PI - rotation) * 0.5);
            vector = new vector2_1.Vector2();
            vector.x = Math.cos(angle) * radius;
            vector.y = Math.sin(angle) * radius;
            vertices.push(vector);
        }
        return new Polygon(x, y, vertices);
    }
    /**
     * Helper generate a rectangle at x,y with a given width/height and centered state.
     * Centered by default. Returns a ready made `Polygon` collision `Shape`
     * @param {*} x
     * @param {*} y
     * @param {*} width
     * @param {*} height
     * @param {*} centered
     */
    static createRectangle(x, y, width, height, centered = false) {
        var vertices = [];
        if (centered) {
            vertices.push(new vector2_1.Vector2(-width * 0.5, -height * 0.5));
            vertices.push(new vector2_1.Vector2(width * 0.5, -height * 0.5));
            vertices.push(new vector2_1.Vector2(width * 0.5, height * 0.5));
            vertices.push(new vector2_1.Vector2(-width * 0.5, height * 0.5));
        }
        else {
            vertices.push(new vector2_1.Vector2(0, 0));
            vertices.push(new vector2_1.Vector2(width, 0));
            vertices.push(new vector2_1.Vector2(width, height));
            vertices.push(new vector2_1.Vector2(0, height));
        }
        return new Polygon(x, y, vertices);
    }
    static createSquare(x, y, width, centered = false) {
        return Polygon.createRectangle(x, y, width, width, centered);
    }
    static createTriangle() {
    }
}
exports.Polygon = Polygon;


/***/ }),
/* 71 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DropManager = void 0;
const konstants_1 = __webpack_require__(2);
const mathutil_1 = __webpack_require__(34);
class DropManager {
    constructor(game, myWorld) {
        this.game = game;
        this.myWorld = myWorld;
        this.sumOfWeights = 0;
        this.weights = new mathutil_1.KeyedCollection();
        this.weights.Add(konstants_1.EntityType.energy_pellet_small, 40);
        this.weights.Add(konstants_1.EntityType.energy_pellet_large, 20);
        this.weights.Add(konstants_1.EntityType.weapon_energy_small, 40);
        this.weights.Add(konstants_1.EntityType.weapon_energy_large, 20);
        this.weights.Add(konstants_1.EntityType.robot_crystal, 70);
        this.weights.Add(konstants_1.EntityType.one_up, 3);
        this.weights.Add('', 150); // No drop
        for (let i = 0; i < this.weights.Count(); i++) {
            this.sumOfWeights += this.weights.Item(this.weights.Keys()[i]);
        }
    }
    initialize() {
        this.myWorld.entityManager.player.switchedWeapon.add(function (player) {
            // TODO: choose color
            // switch (player.weaponIndex) {
            //     case 0:
            //         break;
            //     case 1:
            //         break;
            //     default:
            //         console.error("Player weapon index is incorrect!");
            //         break;
            // }
            this.myWorld.entityManager.entities.forEach((element) => {
                if (element.tag == konstants_1.TagType.power_up) {
                    // TODO: change power-up color based off the weapon
                }
            }, this);
        }, this);
    }
    dropPowerUp(x, y) {
        let itemToDrop = mathutil_1.MathUtil.weightedRandomKey(this.weights, this.sumOfWeights);
        if (itemToDrop == '') {
            return;
        }
        let entity = this.myWorld.entityManager.createPowerUp(itemToDrop, x, y, false);
        this.game.add.existing(entity);
        this.myWorld.entityManager.addEntity(entity);
        entity.useGravity = true;
        entity.targetSpeed.y = -200;
    }
    dropBossItem(itemToDrop, x, y) {
        let entity = this.myWorld.entityManager.createEntity(itemToDrop, x, y);
        this.myWorld.entityManager.addEntity(entity);
        this.game.add.existing(entity);
        entity.useGravity = true;
    }
    chancePowerUpColors() {
    }
}
exports.DropManager = DropManager;


/***/ }),
/* 72 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InventoryManager = void 0;
const konstants_1 = __webpack_require__(2);
const weapon_1 = __webpack_require__(4);
const bombManWeapon_1 = __webpack_require__(73);
const elecManWeapon_1 = __webpack_require__(74);
const gutsManWeapon_1 = __webpack_require__(75);
const iceManWeapon_1 = __webpack_require__(76);
const cutManWeapon_1 = __webpack_require__(77);
const fireManWeapon_1 = __webpack_require__(79);
const lemonWeapon_1 = __webpack_require__(80);
const meter_1 = __webpack_require__(25);
const saveGame_1 = __webpack_require__(3);
class InventoryManager {
    constructor(myWorld) {
        this.myWorld = myWorld;
        this.inventoryMenuFullyClosed = new Phaser.Signal();
        this.selectedWeapon = new Phaser.Signal();
        this.currIdx = 0;
        this.isOpen = false;
        this.weaponList = new Array();
        this.topLeftStartPos = new Phaser.Point(128, 24);
        this.isAnimating = false;
        this.backgroundSprites = new Array();
        this.parts = new Array();
        this.letters = new Array();
        this.items = new Array();
    }
    initialize() {
        this.container = this.myWorld.game.add.sprite(0, 0);
        this.myWorld.game.add.existing(this.container);
        this.cutManManColors = [116, 116, 116, 188, 188, 188, 252, 252, 252];
        this.gutsManColors = [124, 8, 0, 200, 76, 12, 252, 116, 96];
        this.iceManColors = [0, 128, 136, 0, 68, 0, 252, 252, 252];
        this.bombManColors = [124, 8, 0, 0, 148, 0, 128, 208, 16];
        this.fireManColors = [164, 0, 0, 188, 188, 188, 252, 252, 252];
        this.elecManColors = [200, 76, 12, 252, 152, 56, 252, 252, 252];
        saveGame_1.SaveGame.loadInventoryData();
        this.createBitmapBackground();
        this.changeColors(this.cutManManColors);
        this.createLetters();
        this.createWeapons();
        this.createOneUp();
        this.hideInventory();
        this.populateSavedData();
        this.unlockWeapon(weapon_1.WeaponType.MegaBuster);
        this.currIdx = 6;
        this.items[this.currIdx].letter.tint = 0xffffff;
        // let nKey = this.myWorld.game.input.keyboard.addKey(Phaser.Keyboard.N);
        // let mKey = this.myWorld.game.input.keyboard.addKey(Phaser.Keyboard.M);
        // nKey.onDown.add(() => {
        //     this.animateInventoryIn();
        // }, this);
        // mKey.onDown.add(() => {
        //     this.animateInventoryOut();
        // }, this);
    }
    populateSavedData() {
        if (saveGame_1.SaveGame.HasCutManWeapon) {
            this.unlockWeapon(weapon_1.WeaponType.CutMan);
            this.weaponList.filter((value) => {
                return value.type == weapon_1.WeaponType.CutMan;
            })[0].setEnergy(saveGame_1.SaveGame.CutManWeaponEnergy);
        }
        if (saveGame_1.SaveGame.HasGutsManWeapon) {
            this.unlockWeapon(weapon_1.WeaponType.GutsMan);
            this.weaponList.filter((value) => {
                return value.type == weapon_1.WeaponType.GutsMan;
            })[0].setEnergy(saveGame_1.SaveGame.GutsManWeaponEnergy);
        }
        if (saveGame_1.SaveGame.HasIceManWeapon) {
            this.unlockWeapon(weapon_1.WeaponType.IceMan);
            this.weaponList.filter((value) => {
                return value.type == weapon_1.WeaponType.IceMan;
            })[0].setEnergy(saveGame_1.SaveGame.IceManWeaponEnergy);
        }
        if (saveGame_1.SaveGame.HasBombManWeapon) {
            this.unlockWeapon(weapon_1.WeaponType.BombMan);
            this.weaponList.filter((value) => {
                return value.type == weapon_1.WeaponType.BombMan;
            })[0].setEnergy(saveGame_1.SaveGame.BombManWeaponEnergy);
        }
        if (saveGame_1.SaveGame.HasFireManWeapon) {
            this.unlockWeapon(weapon_1.WeaponType.FireMan);
            this.weaponList.filter((value) => {
                return value.type == weapon_1.WeaponType.FireMan;
            })[0].setEnergy(saveGame_1.SaveGame.FireManWeaponEnergy);
        }
        if (saveGame_1.SaveGame.HasElecManWeapon) {
            this.unlockWeapon(weapon_1.WeaponType.ElecMan);
            this.weaponList.filter((value) => {
                return value.type == weapon_1.WeaponType.ElecMan;
            })[0].setEnergy(saveGame_1.SaveGame.ElecManWeaponEnergy);
        }
    }
    createBitmapBackground() {
        this.bitmapData = this.myWorld.game.make.bitmapData(96, 160);
        this.image = this.myWorld.game.add.image(InventoryManager.inventoryPos.x, InventoryManager.inventoryPos.y, this.bitmapData);
        this.image.fixedToCamera = true;
        let testSprite = this.myWorld.game.make.sprite(0, 0, 'grayscale_menu', 'top_left');
        this.bitmapData.copy(testSprite, 0, 0, 32, 32, 0, 0);
        testSprite = this.myWorld.game.make.sprite(0, 0, 'grayscale_menu', 'top_middle');
        this.bitmapData.copy(testSprite, 0, 0, 32, 32, 32, 0);
        testSprite = this.myWorld.game.make.sprite(0, 0, 'grayscale_menu', 'top_right');
        this.bitmapData.copy(testSprite, 0, 0, 32, 32, 64, 0);
        testSprite = this.myWorld.game.make.sprite(0, 0, 'grayscale_menu', 'middle_left');
        this.bitmapData.copy(testSprite, 0, 0, 32, 32, 0, 32);
        testSprite = this.myWorld.game.make.sprite(0, 0, 'grayscale_menu', 'middle');
        this.bitmapData.copy(testSprite, 0, 0, 32, 32, 32, 32);
        testSprite = this.myWorld.game.make.sprite(0, 0, 'grayscale_menu', 'middle_right');
        this.bitmapData.copy(testSprite, 0, 0, 32, 32, 64, 32);
        testSprite = this.myWorld.game.make.sprite(0, 0, 'grayscale_menu', 'middle_left');
        this.bitmapData.copy(testSprite, 0, 0, 32, 32, 0, 64);
        testSprite = this.myWorld.game.make.sprite(0, 0, 'grayscale_menu', 'middle');
        this.bitmapData.copy(testSprite, 0, 0, 32, 32, 32, 64);
        testSprite = this.myWorld.game.make.sprite(0, 0, 'grayscale_menu', 'middle_right');
        this.bitmapData.copy(testSprite, 0, 0, 32, 32, 64, 64);
        testSprite = this.myWorld.game.make.sprite(0, 0, 'grayscale_menu', 'middle_left');
        this.bitmapData.copy(testSprite, 0, 0, 32, 32, 0, 96);
        testSprite = this.myWorld.game.make.sprite(0, 0, 'grayscale_menu', 'middle');
        this.bitmapData.copy(testSprite, 0, 0, 32, 32, 32, 96);
        testSprite = this.myWorld.game.make.sprite(0, 0, 'grayscale_menu', 'middle_right');
        this.bitmapData.copy(testSprite, 0, 0, 32, 32, 64, 96);
        testSprite = this.myWorld.game.make.sprite(0, 0, 'grayscale_menu', 'bottom_left');
        this.bitmapData.copy(testSprite, 0, 0, 32, 32, 0, 128);
        testSprite = this.myWorld.game.make.sprite(0, 0, 'grayscale_menu', 'bottom_middle');
        this.bitmapData.copy(testSprite, 0, 0, 32, 32, 32, 128);
        testSprite = this.myWorld.game.make.sprite(0, 0, 'grayscale_menu', 'bottom_right');
        this.bitmapData.copy(testSprite, 0, 0, 32, 32, 64, 128);
        this.bitmapData.update();
        // Hide it immediatelly.
        this.bitmapData.processPixelRGB((color, x, y) => {
            color.a = 0;
            return color;
        }, this);
    }
    changeColors(colors) {
        this.bitmapData.processPixelRGB((color, x, y) => {
            // background
            color.r = color.r == 106 ? colors[0] : color.r;
            color.g = color.g == 106 ? colors[1] : color.g;
            color.b = color.b == 106 ? colors[2] : color.b;
            // shadow (border)
            color.r = color.r == 154 ? colors[3] : color.r;
            color.g = color.g == 154 ? colors[4] : color.g;
            color.b = color.b == 154 ? colors[5] : color.b;
            // color (border)
            color.r = color.r == 252 ? colors[6] : color.r;
            color.g = color.g == 252 ? colors[7] : color.g;
            color.b = color.b == 252 ? colors[8] : color.b;
            return color;
        }, this);
    }
    animateInventoryIn() {
        this.repeatTimer = this.myWorld.game.time.create();
        this.repeatTimer.onComplete.add(() => {
            this.isAnimating = false;
            this.displayInventoryContents();
        }, this);
        let row = 0;
        let col = 0;
        this.repeatTimer.repeat(InventoryManager.animationSpeed, 15, () => {
            // console.log('row: ' + row)
            // console.log('col: ' + col)
            let xx = row * 32;
            let yy = col * 32;
            row++;
            if (row >= 3) {
                row = 0;
                col++;
            }
            this.bitmapData.processPixelRGB((color, x, y) => {
                let betweenX = x >= xx && x < (xx + 32);
                let betweenY = y >= yy && y < (yy + 32);
                if (!(betweenX && betweenY)) {
                    return false;
                }
                color.a = 255;
                return color;
            }, this);
        }, this);
        this.repeatTimer.start();
    }
    animateInventoryOut() {
        this.repeatTimer = this.myWorld.game.time.create();
        this.repeatTimer.onComplete.add(() => {
            this.inventoryMenuFullyClosed.dispatch();
            this.isAnimating = false;
        }, this);
        let row = 0;
        let col = 0;
        this.repeatTimer.repeat(InventoryManager.animationSpeed, 15, () => {
            // console.log('row: ' + row)
            // console.log('col: ' + col)
            let xx = row * 32;
            let yy = col * 32;
            row++;
            if (row >= 3) {
                row = 0;
                col++;
            }
            this.bitmapData.processPixelRGB((color, x, y) => {
                let betweenX = x >= xx && x < (xx + 32);
                let betweenY = y >= yy && y < (yy + 32);
                if (!(betweenX && betweenY)) {
                    return false;
                }
                color.a = 0;
                return color;
            }, this);
        }, this);
        this.repeatTimer.start();
    }
    createLetters() {
        this.letterBShadow = this.myWorld.game.add.bitmapText(142 + 1, 44 + 1, 'myfont', 'B', 8);
        this.letterBShadow.smoothed = false;
        this.letterBShadow.tint = 0;
        this.letterBShadow.fixedToCamera = true;
        this.myWorld.game.add.existing(this.letterBShadow);
        this.letters.push(this.letterBShadow);
        this.container.addChild(this.letterBShadow);
        this.letterB = this.myWorld.game.add.bitmapText(142, 44, 'myfont', 'B', 8);
        this.letterB.smoothed = false;
        this.letterB.tint = 0x00e8d8;
        this.letterB.fixedToCamera = true;
        this.myWorld.game.add.existing(this.letterB);
        this.letters.push(this.letterB);
        this.container.addChild(this.letterB);
        this.letterEShadow = this.myWorld.game.add.bitmapText(142 + 1, 60 + 1, 'myfont', 'E', 8);
        this.letterEShadow.smoothed = false;
        this.letterEShadow.tint = 0;
        this.letterEShadow.fixedToCamera = true;
        this.myWorld.game.add.existing(this.letterEShadow);
        this.letters.push(this.letterEShadow);
        this.container.addChild(this.letterEShadow);
        this.letterE = this.myWorld.game.add.bitmapText(142, 60, 'myfont', 'E', 8);
        this.letterE.smoothed = false;
        this.letterE.tint = 0x00e8d8;
        this.letterE.fixedToCamera = true;
        this.myWorld.game.add.existing(this.letterE);
        this.letters.push(this.letterE);
        this.container.addChild(this.letterE);
        this.letterGShadow = this.myWorld.game.add.bitmapText(142 + 1, 76 + 1, 'myfont', 'G', 8);
        this.letterGShadow.smoothed = false;
        this.letterGShadow.tint = 0;
        this.letterGShadow.fixedToCamera = true;
        this.myWorld.game.add.existing(this.letterGShadow);
        this.letters.push(this.letterGShadow);
        this.container.addChild(this.letterGShadow);
        this.letterG = this.myWorld.game.add.bitmapText(142, 76, 'myfont', 'G', 8);
        this.letterG.smoothed = false;
        this.letterG.tint = 0x00e8d8;
        this.letterG.fixedToCamera = true;
        this.myWorld.game.add.existing(this.letterG);
        this.letters.push(this.letterG);
        this.container.addChild(this.letterG);
        this.letterIShadow = this.myWorld.game.add.bitmapText(142 + 1, 92 + 1, 'myfont', 'I', 8);
        this.letterIShadow.smoothed = false;
        this.letterIShadow.tint = 0;
        this.letterIShadow.fixedToCamera = true;
        this.myWorld.game.add.existing(this.letterIShadow);
        this.letters.push(this.letterIShadow);
        this.container.addChild(this.letterIShadow);
        this.letterI = this.myWorld.game.add.bitmapText(142, 92, 'myfont', 'I', 8);
        this.letterI.smoothed = false;
        this.letterI.tint = 0x00e8d8;
        this.letterI.fixedToCamera = true;
        this.myWorld.game.add.existing(this.letterI);
        this.letters.push(this.letterI);
        this.container.addChild(this.letterI);
        this.letterCShadow = this.myWorld.game.add.bitmapText(142 + 1, 108 + 1, 'myfont', 'C', 8);
        this.letterCShadow.smoothed = false;
        this.letterCShadow.tint = 0;
        this.letterCShadow.fixedToCamera = true;
        this.myWorld.game.add.existing(this.letterCShadow);
        this.letters.push(this.letterCShadow);
        this.container.addChild(this.letterCShadow);
        this.letterC = this.myWorld.game.add.bitmapText(142, 108, 'myfont', 'C', 8);
        this.letterC.smoothed = false;
        this.letterC.tint = 0x00e8d8;
        this.letterC.fixedToCamera = true;
        this.myWorld.game.add.existing(this.letterC);
        this.letters.push(this.letterC);
        this.container.addChild(this.letterC);
        this.letterFShadow = this.myWorld.game.add.bitmapText(142 + 1, 124 + 1, 'myfont', 'F', 8);
        this.letterFShadow.smoothed = false;
        this.letterFShadow.tint = 0;
        this.letterFShadow.fixedToCamera = true;
        this.myWorld.game.add.existing(this.letterFShadow);
        this.letters.push(this.letterFShadow);
        this.container.addChild(this.letterFShadow);
        this.letterF = this.myWorld.game.add.bitmapText(142, 124, 'myfont', 'F', 8);
        this.letterF.smoothed = false;
        this.letterF.tint = 0x00e8d8;
        this.letterF.fixedToCamera = true;
        this.myWorld.game.add.existing(this.letterF);
        this.letters.push(this.letterF);
        this.container.addChild(this.letterF);
        this.letterPShadow = this.myWorld.game.add.bitmapText(142 + 1, 156 + 1, 'myfont', 'P', 8);
        this.letterPShadow.smoothed = false;
        this.letterPShadow.tint = 0;
        this.letterPShadow.fixedToCamera = true;
        this.myWorld.game.add.existing(this.letterPShadow);
        this.letters.push(this.letterPShadow);
        this.container.addChild(this.letterPShadow);
        this.letterP = this.myWorld.game.add.bitmapText(142, 156, 'myfont', 'P', 8);
        this.letterP.smoothed = false;
        this.letterP.tint = 0x00e8d8;
        this.letterP.fixedToCamera = true;
        this.myWorld.game.add.existing(this.letterP);
        this.letters.push(this.letterP);
        this.container.addChild(this.letterP);
    }
    createWeapons() {
        this.weaponList.push(new bombManWeapon_1.BombManWeapon(this.myWorld));
        this.weaponList.push(new elecManWeapon_1.ElecManWeapon(this.myWorld));
        this.weaponList.push(new gutsManWeapon_1.GutsManWeapon(this.myWorld));
        this.weaponList.push(new iceManWeapon_1.IceManWeapon(this.myWorld));
        this.weaponList.push(new cutManWeapon_1.CutManWeapon(this.myWorld));
        this.weaponList.push(new fireManWeapon_1.FireManWeapon(this.myWorld));
        this.weaponList.push(new lemonWeapon_1.LemonWeapon(this.myWorld));
        for (let i = 0; i < this.weaponList.length; i++) {
            if (this.weaponList[i].energyMeter == null)
                continue;
            this.weaponList[i].energyMeter.hide();
        }
        let startY = 44;
        // Bomb Man
        let meter = new meter_1.Meter(this.myWorld.game, 155, 44 + 16 * this.items.length, meter_1.MeterDirection.Horizontal);
        this.items.push({
            weapon: this.weaponList[0], horizontalMeter: meter, unlocked: false, letter: this.letterB,
            letterShadow: this.letterBShadow
        });
        // Elec Man
        meter = new meter_1.Meter(this.myWorld.game, 155, 44 + 16 * this.items.length, meter_1.MeterDirection.Horizontal);
        this.items.push({
            weapon: this.weaponList[1], horizontalMeter: meter, unlocked: false, letter: this.letterE,
            letterShadow: this.letterEShadow
        });
        // Guts Man
        meter = new meter_1.Meter(this.myWorld.game, 155, 44 + 16 * this.items.length, meter_1.MeterDirection.Horizontal);
        this.items.push({
            weapon: this.weaponList[2], horizontalMeter: meter, unlocked: false, letter: this.letterG,
            letterShadow: this.letterGShadow
        });
        // Ice Man
        meter = new meter_1.Meter(this.myWorld.game, 155, 44 + 16 * this.items.length, meter_1.MeterDirection.Horizontal);
        this.items.push({
            weapon: this.weaponList[3], horizontalMeter: meter, unlocked: false, letter: this.letterI,
            letterShadow: this.letterIShadow
        });
        // Cut Man
        meter = new meter_1.Meter(this.myWorld.game, 155, 44 + 16 * this.items.length, meter_1.MeterDirection.Horizontal);
        this.items.push({
            weapon: this.weaponList[4], horizontalMeter: meter, unlocked: false, letter: this.letterC,
            letterShadow: this.letterCShadow
        });
        // Fire Man
        meter = new meter_1.Meter(this.myWorld.game, 155, 44 + 16 * this.items.length, meter_1.MeterDirection.Horizontal);
        this.items.push({
            weapon: this.weaponList[5], horizontalMeter: meter, unlocked: false, letter: this.letterF,
            letterShadow: this.letterFShadow
        });
        // Mega Buster
        this.items.push({
            weapon: this.weaponList[6], horizontalMeter: null, unlocked: false, letter: this.letterP,
            letterShadow: this.letterPShadow
        });
        this.items.forEach(element => {
            element.unlocked = false;
            element.letter.visible = false;
            element.letterShadow.visible = false;
            if (element.horizontalMeter != null) {
                element.horizontalMeter.hide();
            }
        });
    }
    createOneUp() {
        this.oneUp = this.myWorld.game.add.sprite(168, 154, konstants_1.SpriteSheets.items, 'one_up');
        this.oneUp.smoothed = false;
        this.oneUp.fixedToCamera = true;
        this.myWorld.game.add.existing(this.oneUp);
        this.container.addChild(this.oneUp);
        this.oneUpTextShadow = this.myWorld.game.add.bitmapText(187, 161, 'myfont', '=02', 8);
        this.oneUpTextShadow.tint = 0x000000;
        this.oneUpTextShadow.smoothed = false;
        this.oneUpTextShadow.fixedToCamera = true;
        this.myWorld.game.add.existing(this.oneUpTextShadow);
        this.container.addChild(this.oneUpTextShadow);
        this.oneUpText = this.myWorld.game.add.bitmapText(186, 160, 'myfont', '=02', 8);
        this.oneUpText.tint = 0xffffff;
        this.oneUpText.smoothed = false;
        this.oneUpText.fixedToCamera = true;
        this.myWorld.game.add.existing(this.oneUpText);
        this.container.addChild(this.oneUpText);
    }
    cycleInventoryUp() {
        this.myWorld.game.sound.play(konstants_1.AudioName.menu_select);
        let prevIdx = this.currIdx;
        this.items[prevIdx].letter.tint = 0x00e8d8;
        do {
            this.currIdx--;
            if (this.currIdx < 0) {
                this.currIdx = this.items.length - 1;
            }
        } while (!this.items[this.currIdx].unlocked);
        this.items[this.currIdx].letter.tint = 0xffffff;
        this.items[prevIdx].letter.visible = true;
        this.items[prevIdx].letterShadow.visible = true;
        this.currSelectedItem = this.items[this.currIdx];
        console.log('curr weapon: ' + this.currSelectedItem.weapon.type);
    }
    cycleInventoryDown() {
        this.myWorld.game.sound.play(konstants_1.AudioName.menu_select);
        let prevIdx = this.currIdx;
        this.items[prevIdx].letter.tint = 0x00e8d8;
        do {
            this.currIdx++;
            if (this.currIdx >= this.items.length) {
                this.currIdx = 0;
            }
        } while (!this.items[this.currIdx].unlocked);
        this.items[this.currIdx].letter.tint = 0xffffff;
        this.items[prevIdx].letter.visible = true;
        this.items[prevIdx].letterShadow.visible = true;
        this.currSelectedItem = this.items[this.currIdx];
        console.log('curr weapon: ' + this.currSelectedItem.weapon.type);
    }
    toggleInventory() {
        if (this.isAnimating) {
            return;
        }
        this.isOpen == true ? this.closeInventory() : this.openInventory();
    }
    unlockWeapon(type) {
        console.log('Unlock weapon: ' + type);
        this.items.filter(element => {
            return element.weapon.type == type;
        }).forEach(element => {
            element.unlocked = true;
        });
    }
    getCurrentlySelectedItem() {
        return this.items[this.currIdx];
    }
    getCurrentlySelectedWeapon() {
        return this.items[this.currIdx].weapon;
    }
    openInventory() {
        this.isAnimating = true;
        this.isOpen = true;
        this.myWorld.game.sound.play(konstants_1.AudioName.pause_menu);
        this.showInventory();
        this.getCorrectEnergyForMeters();
        this.playAnimation();
    }
    closeInventory() {
        this.isAnimating = true;
        this.isOpen = false;
        this.stopAnimation();
        this.selectedWeapon.dispatch(this.getCurrentlySelectedItem().weapon);
        this.hideInventory();
    }
    showInventory() {
        this.image.bringToTop();
        this.animateInventoryIn();
    }
    hideInventory() {
        this.animateInventoryOut();
        this.container.visible = false;
        this.items.forEach(element => {
            if (!element.unlocked) {
                return;
            }
            if (element.horizontalMeter == null) {
                return;
            }
            element.horizontalMeter.hide();
        });
    }
    playAnimation() {
        let toggle = true;
        let count = 0;
        this.animationTimer = this.myWorld.game.time.create(true);
        this.animationTimer.loop(1 / 60, () => {
            count++;
            if (count % 8 == 0) {
                let b = !this.getCurrentlySelectedItem().letter.visible;
                this.getCurrentlySelectedItem().letter.visible = b;
                this.getCurrentlySelectedItem().letterShadow.visible = b;
            }
        });
        this.animationTimer.start();
    }
    stopAnimation() {
        this.animationTimer.stop();
    }
    getCorrectEnergyForMeters() {
        this.items.forEach(element => {
            if (!element.unlocked) {
                return;
            }
            if (element.horizontalMeter == null) {
                return;
            }
            element.horizontalMeter.setEnergy(element.weapon.energyMeter.currEnergy);
        });
    }
    displayInventoryContents() {
        this.container.visible = true;
        this.container.bringToTop();
        this.items.forEach(element => {
            if (!element.unlocked) {
                return;
            }
            if (element.horizontalMeter == null) {
                return;
            }
            element.horizontalMeter.show();
            element.letter.visible = true;
            element.letterShadow.visible = true;
        });
    }
}
exports.InventoryManager = InventoryManager;
InventoryManager.inventoryPos = new Phaser.Point(128, 24);
InventoryManager.animationSpeed = 15;


/***/ }),
/* 73 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BombManWeapon = void 0;
const weapon_1 = __webpack_require__(4);
const konstants_1 = __webpack_require__(2);
const bullet_1 = __webpack_require__(49);
const meter_1 = __webpack_require__(25);
class BombManWeapon {
    constructor(myWorld) {
        this.myWorld = myWorld;
        this.type = weapon_1.WeaponType.BombMan;
        this.currEnergy = 28;
        this.totalEnergy = 28;
        this.energyMeter = null;
        this.tempBullet = null;
        this.bullets = new Array();
        this.totalBullets = 0;
        this.maxBulletsAllowed = 3;
        this.energyMeter = new meter_1.Meter(this.myWorld.game, 24, 15);
        this.setEnergy(28);
    }
    doAction(x, y) {
        if (this.totalBullets >= this.maxBulletsAllowed) {
            return false;
        }
        if (this.currEnergy <= 0) {
            this.currEnergy = 0;
            return false;
        }
        this.totalBullets++;
        this.tempBullet = new bullet_1.Bullet(this.myWorld.entityManager.player, this.myWorld, konstants_1.TagType.bullet, konstants_1.EntityType.bullet_lemon, this.myWorld.game, x, y, konstants_1.Konstants.lemon, '');
        // The args will be this bullet.
        this.tempBullet.destroyed.addOnce((args) => {
            this.totalBullets--;
            this.bullets.splice(this.bullets.indexOf(args), 1);
        }, this, 0, this);
        this.tempBullet.contactDamage = 14;
        this.tempBullet.horizontalSpeed = 190;
        this.tempBullet.targetSpeed.x = this.tempBullet.horizontalSpeed * this.myWorld.entityManager.player.getFacingDirection();
        this.myWorld.game.add.existing(this.tempBullet);
        this.myWorld.entityManager.addEntity(this.tempBullet);
        this.bullets.push(this.tempBullet);
        this.myWorld.game.sound.play(konstants_1.AudioName.mega_buster);
        return true;
    }
    restoreEnergy(amount) {
        this.currEnergy += amount;
        if (this.currEnergy >= this.totalEnergy) {
            this.currEnergy = this.totalEnergy;
        }
        console.log("this.currEnergy: " + this.currEnergy);
        this.energyMeter.restoreEnergy(amount);
    }
    setEnergy(amount) {
        this.currEnergy = amount;
        if (this.currEnergy >= this.totalEnergy) {
            this.currEnergy = this.totalEnergy;
        }
        this.energyMeter.setEnergy(amount);
    }
}
exports.BombManWeapon = BombManWeapon;


/***/ }),
/* 74 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ElecManWeapon = void 0;
const weapon_1 = __webpack_require__(4);
const konstants_1 = __webpack_require__(2);
const bullet_1 = __webpack_require__(49);
const meter_1 = __webpack_require__(25);
class ElecManWeapon {
    constructor(myWorld) {
        this.myWorld = myWorld;
        this.type = weapon_1.WeaponType.ElecMan;
        this.currEnergy = 28;
        this.totalEnergy = 28;
        this.energyMeter = null;
        this.tempBullet = null;
        this.bullets = new Array();
        this.totalBullets = 0;
        this.maxBulletsAllowed = 3;
        this.energyMeter = new meter_1.Meter(this.myWorld.game, 24, 15);
        this.setEnergy(28);
    }
    doAction(x, y) {
        if (this.totalBullets >= this.maxBulletsAllowed) {
            return false;
        }
        if (this.currEnergy <= 0) {
            this.currEnergy = 0;
            return false;
        }
        this.totalBullets++;
        this.tempBullet = new bullet_1.Bullet(this.myWorld.entityManager.player, this.myWorld, konstants_1.TagType.bullet, konstants_1.EntityType.bullet_lemon, this.myWorld.game, x, y, konstants_1.Konstants.lemon, '');
        // The args will be this bullet.
        this.tempBullet.destroyed.addOnce((args) => {
            this.totalBullets--;
            this.bullets.splice(this.bullets.indexOf(args), 1);
        }, this, 0, this);
        this.tempBullet.contactDamage = 1;
        this.tempBullet.horizontalSpeed = 190;
        this.tempBullet.targetSpeed.x = this.tempBullet.horizontalSpeed * this.myWorld.entityManager.player.getFacingDirection();
        this.myWorld.game.add.existing(this.tempBullet);
        this.myWorld.entityManager.addEntity(this.tempBullet);
        this.bullets.push(this.tempBullet);
        this.myWorld.game.sound.play(konstants_1.AudioName.mega_buster);
        return true;
    }
    restoreEnergy(amount) {
        this.currEnergy += amount;
        if (this.currEnergy >= this.totalEnergy) {
            this.currEnergy = this.totalEnergy;
        }
        console.log("this.currEnergy: " + this.currEnergy);
        this.energyMeter.restoreEnergy(amount);
    }
    setEnergy(amount) {
        this.currEnergy = amount;
        if (this.currEnergy >= this.totalEnergy) {
            this.currEnergy = this.totalEnergy;
        }
        this.energyMeter.setEnergy(amount);
    }
}
exports.ElecManWeapon = ElecManWeapon;


/***/ }),
/* 75 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GutsManWeapon = void 0;
const weapon_1 = __webpack_require__(4);
const meter_1 = __webpack_require__(25);
class GutsManWeapon {
    constructor(myWorld) {
        this.myWorld = myWorld;
        this.type = weapon_1.WeaponType.GutsMan;
        this.currEnergy = 28;
        this.totalEnergy = 28;
        this.energyMeter = null;
        this.tempBullet = null;
        this.bullets = new Array();
        this.totalBullets = 0;
        this.maxBulletsAllowed = 3;
        this.energyMeter = new meter_1.Meter(this.myWorld.game, 24, 15);
        this.setEnergy(28);
    }
    doAction(x, y) {
        if (this.totalBullets >= this.maxBulletsAllowed) {
            return false;
        }
        if (this.currEnergy <= 0) {
            this.currEnergy = 0;
            return false;
        }
        this.currEnergy -= 5;
        this.energyMeter.takeEnergy(5);
        return true;
    }
    restoreEnergy(amount) {
        this.currEnergy += amount;
        if (this.currEnergy >= this.totalEnergy) {
            this.currEnergy = this.totalEnergy;
        }
        console.log("this.currEnergy: " + this.currEnergy);
        this.energyMeter.restoreEnergy(amount);
    }
    setEnergy(amount) {
        this.currEnergy = amount;
        if (this.currEnergy >= this.totalEnergy) {
            this.currEnergy = this.totalEnergy;
        }
        this.energyMeter.setEnergy(amount);
    }
}
exports.GutsManWeapon = GutsManWeapon;


/***/ }),
/* 76 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IceManWeapon = void 0;
const weapon_1 = __webpack_require__(4);
const konstants_1 = __webpack_require__(2);
const meter_1 = __webpack_require__(25);
class IceManWeapon {
    constructor(myWorld) {
        this.myWorld = myWorld;
        this.type = weapon_1.WeaponType.IceMan;
        this.currEnergy = 28;
        this.totalEnergy = 28;
        this.energyMeter = null;
        this.tempBullet = null;
        this.totalBullets = 0;
        this.maxBulletsAllowed = 1;
        this.energyMeter = new meter_1.Meter(this.myWorld.game, 24, 15);
        this.setEnergy(28);
    }
    doAction(x, y) {
        if (this.totalBullets >= this.maxBulletsAllowed) {
            return false;
        }
        if (this.currEnergy <= 0) {
            this.currEnergy = 0;
            return false;
        }
        this.totalBullets++;
        this.tempBullet = this.myWorld.entityManager.createBasicBullet(this.myWorld.entityManager.player, x, y, 12, 12, konstants_1.EntityType.ice_man, konstants_1.EntityType.ice_man_bullet, 'bullet_01');
        // The args will be this bullet.
        this.tempBullet.destroyed.addOnce((args) => {
            this.totalBullets--;
        }, this, 0, this);
        this.tempBullet.contactDamage = 9999;
        this.tempBullet.horizontalSpeed = 150;
        this.tempBullet.targetSpeed.x = this.tempBullet.horizontalSpeed * this.myWorld.entityManager.player.getFacingDirection();
        this.tempBullet.animations.add('active', ['bullet_01', 'bullet_02'], 10, true);
        this.tempBullet.animations.play('active');
        this.tempBullet.setFacingDirection(-this.myWorld.entityManager.player.getFacingDirection());
        this.myWorld.game.sound.play(konstants_1.AudioName.ice_slasher);
        this.currEnergy -= 5;
        this.energyMeter.takeEnergy(5);
        return true;
    }
    restoreEnergy(amount) {
        this.currEnergy += amount;
        if (this.currEnergy >= this.totalEnergy) {
            this.currEnergy = this.totalEnergy;
        }
        console.log("this.currEnergy: " + this.currEnergy);
        this.energyMeter.restoreEnergy(amount);
    }
    setEnergy(amount) {
        this.currEnergy = amount;
        if (this.currEnergy >= this.totalEnergy) {
            this.currEnergy = this.totalEnergy;
        }
        this.energyMeter.setEnergy(amount);
    }
}
exports.IceManWeapon = IceManWeapon;


/***/ }),
/* 77 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CutManWeapon = void 0;
const weapon_1 = __webpack_require__(4);
const konstants_1 = __webpack_require__(2);
const konstants_2 = __webpack_require__(2);
const konstants_3 = __webpack_require__(2);
const konstants_4 = __webpack_require__(2);
const cutManBullet_1 = __webpack_require__(55);
const splineBulletMovement_1 = __webpack_require__(78);
const meter_1 = __webpack_require__(25);
class CutManWeapon {
    constructor(myWorld) {
        this.myWorld = myWorld;
        this.type = weapon_1.WeaponType.CutMan;
        this.currEnergy = 28;
        this.totalEnergy = 28;
        this.energyMeter = null;
        this.totalBullets = 0;
        this.maxBulletsAllowed = 1;
        this.energyMeter = new meter_1.Meter(this.myWorld.game, 24, 15);
        this.setEnergy(28);
    }
    doAction(x, y) {
        if (this.totalBullets >= this.maxBulletsAllowed) {
            return false;
        }
        if (this.currEnergy <= 0) {
            this.currEnergy = 0;
            return false;
        }
        this.totalBullets++;
        this.bullet = new cutManBullet_1.CutManBullet(this.myWorld.entityManager.player, this.myWorld, konstants_2.TagType.bullet, konstants_3.EntityType.bullet_cut_man, this.myWorld.game, x, y, konstants_1.Konstants.rolling_cutter, '');
        this.bullet.bulletMovement = new splineBulletMovement_1.SplineBulletMovement(this.myWorld.entityManager.player, new Phaser.Point(x, y));
        // this.bullet.bulletMovement = new BoomerangBulletMovement(this.player, new Phaser.Point(xPos, yPos),new Phaser.Point(xPos + this.player.getFacingDirection() * 100, yPos));
        this.bullet.contactDamage = 1;
        this.bullet.bulletMovement.destroyed.addOnce(() => {
            this.bullet.destroyed.dispatch();
            this.bullet.kill();
        }, this);
        this.bullet.destroyed.addOnce(() => {
            this.totalBullets--;
        }, this);
        this.myWorld.game.add.existing(this.bullet);
        this.myWorld.entityManager.addEntity(this.bullet);
        this.myWorld.game.sound.play(konstants_4.AudioName.rolling_cutter);
        this.currEnergy -= 5;
        this.energyMeter.takeEnergy(5);
        return true;
    }
    restoreEnergy(amount) {
        this.currEnergy += amount;
        if (this.currEnergy >= this.totalEnergy) {
            this.currEnergy = this.totalEnergy;
        }
        console.log("this.currEnergy: " + this.currEnergy);
        this.energyMeter.restoreEnergy(amount);
    }
    setEnergy(amount) {
        this.currEnergy = amount;
        if (this.currEnergy >= this.totalEnergy) {
            this.currEnergy = this.totalEnergy;
        }
        this.energyMeter.setEnergy(amount);
    }
}
exports.CutManWeapon = CutManWeapon;


/***/ }),
/* 78 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SplineBulletMovement = void 0;
const helper_1 = __webpack_require__(24);
const v2_1 = __webpack_require__(10);
const catmull_1 = __webpack_require__(11);
const stateMachine_1 = __webpack_require__(33);
class SplineBulletMovement {
    constructor(owner, initialPosition) {
        this.owner = owner;
        this.initialPosition = initialPosition;
        this.destroyed = new Phaser.Signal();
        this.position = new Phaser.Point();
        this.targetSpeed = new Phaser.Point();
        this.velocity = new Phaser.Point();
        this.speed = 160;
        this.points = new Array();
        this.marker = 0;
        this.catmull = new catmull_1.Catmull(this.points);
        this.points.push(new v2_1.v2(initialPosition.x, initialPosition.y));
        this.points.push(new v2_1.v2(initialPosition.x + 50 * owner.getFacingDirection(), initialPosition.y - 20));
        this.points.push(new v2_1.v2(initialPosition.x + 90 * owner.getFacingDirection(), initialPosition.y));
        this.points.push(new v2_1.v2(initialPosition.x + 80 * owner.getFacingDirection(), initialPosition.y + 20));
        this.fsm = new stateMachine_1.StateMachine();
        this.fsm.addState(CutManBulletState.catmullPathing, new CutManBulletCatmullPathingState(this));
        this.fsm.addState(CutManBulletState.returning, new CutManBulletReturningState(this));
        this.fsm.changeState(CutManBulletState.catmullPathing);
    }
    move() {
        this.fsm.currentState.update();
    }
}
exports.SplineBulletMovement = SplineBulletMovement;
var CutManBulletState;
(function (CutManBulletState) {
    CutManBulletState["catmullPathing"] = "catmullPathing";
    CutManBulletState["returning"] = "returning";
})(CutManBulletState || (CutManBulletState = {}));
class CutManBulletCatmullPathingState {
    constructor(actor) {
        this.name = CutManBulletState.catmullPathing;
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
    }
    update() {
        this.actor.marker += 2.7 * (1 / 60);
        if (this.actor.marker > this.actor.points.length - 1) {
            this.actor.fsm.changeState(CutManBulletState.returning);
            return;
        }
        let pos = this.actor.catmull.getSplinePoint(this.actor.marker, true);
        this.actor.position.x = pos.x;
        this.actor.position.y = pos.y;
    }
    exit() {
        this.initialized = false;
    }
}
class CutManBulletReturningState {
    constructor(actor) {
        this.name = CutManBulletState.returning;
        this.posDiff = new Phaser.Point(0, -10);
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
    }
    update() {
        this.tempPos = this.actor.owner.getPosition().clone().add(this.posDiff.x, this.posDiff.y);
        if (helper_1.Helper.distanceTo2(this.actor.position, this.tempPos) < 2) {
            this.actor.destroyed.dispatch();
            return;
        }
        this.dir = helper_1.Helper.directionTo2(this.actor.position, this.tempPos);
        this.actor.targetSpeed.x = this.actor.speed * this.dir.x;
        this.actor.targetSpeed.y = this.actor.speed * this.dir.y;
        this.actor.velocity.x = this.actor.targetSpeed.x;
        this.actor.velocity.y = this.actor.targetSpeed.y;
        this.actor.position.x += this.actor.velocity.x * this.actor.owner.game.time.physicsElapsed;
        this.actor.position.y += this.actor.velocity.y * this.actor.owner.game.time.physicsElapsed;
    }
    exit() {
        this.initialized = false;
    }
}


/***/ }),
/* 79 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FireManWeapon = void 0;
const weapon_1 = __webpack_require__(4);
const konstants_1 = __webpack_require__(2);
const bullet_1 = __webpack_require__(49);
const meter_1 = __webpack_require__(25);
class FireManWeapon {
    constructor(myWorld) {
        this.myWorld = myWorld;
        this.type = weapon_1.WeaponType.FireMan;
        this.currEnergy = 28;
        this.totalEnergy = 28;
        this.energyMeter = null;
        this.tempBullet = null;
        this.bullets = new Array();
        this.totalBullets = 0;
        this.maxBulletsAllowed = 3;
        this.energyMeter = new meter_1.Meter(this.myWorld.game, 24, 15);
        this.setEnergy(28);
    }
    doAction(x, y) {
        if (this.totalBullets >= this.maxBulletsAllowed) {
            return false;
        }
        if (this.currEnergy <= 0) {
            this.currEnergy = 0;
            return false;
        }
        this.totalBullets++;
        this.tempBullet = new bullet_1.Bullet(this.myWorld.entityManager.player, this.myWorld, konstants_1.TagType.bullet, konstants_1.EntityType.bullet_lemon, this.myWorld.game, x, y, konstants_1.Konstants.lemon, '');
        // The args will be this bullet.
        this.tempBullet.destroyed.addOnce((args) => {
            this.totalBullets--;
            this.bullets.splice(this.bullets.indexOf(args), 1);
        }, this, 0, this);
        this.tempBullet.contactDamage = 1;
        this.tempBullet.horizontalSpeed = 190;
        this.tempBullet.targetSpeed.x = this.tempBullet.horizontalSpeed * this.myWorld.entityManager.player.getFacingDirection();
        this.myWorld.game.add.existing(this.tempBullet);
        this.myWorld.entityManager.addEntity(this.tempBullet);
        this.bullets.push(this.tempBullet);
        this.myWorld.game.sound.play(konstants_1.AudioName.mega_buster);
        return true;
    }
    restoreEnergy(amount) {
        this.currEnergy += amount;
        if (this.currEnergy >= this.totalEnergy) {
            this.currEnergy = this.totalEnergy;
        }
        console.log("this.currEnergy: " + this.currEnergy);
        this.energyMeter.restoreEnergy(amount);
    }
    setEnergy(amount) {
        this.currEnergy = amount;
        if (this.currEnergy >= this.totalEnergy) {
            this.currEnergy = this.totalEnergy;
        }
        this.energyMeter.setEnergy(amount);
    }
}
exports.FireManWeapon = FireManWeapon;


/***/ }),
/* 80 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LemonWeapon = void 0;
const weapon_1 = __webpack_require__(4);
const konstants_1 = __webpack_require__(2);
const konstants_2 = __webpack_require__(2);
const konstants_3 = __webpack_require__(2);
class LemonWeapon {
    constructor(myWorld) {
        this.myWorld = myWorld;
        this.type = weapon_1.WeaponType.MegaBuster;
        this.currEnergy = 28;
        this.totalEnergy = 28;
        this.energyMeter = null;
        this.tempBullet = null;
        this.bullets = new Array();
        this.totalBullets = 0;
        this.maxBulletsAllowed = 3;
    }
    doAction(x, y) {
        if (this.totalBullets >= this.maxBulletsAllowed) {
            return false;
        }
        this.totalBullets++;
        this.tempBullet = this.myWorld.entityManager.createBitmapBullet(this.myWorld.entityManager.player, x, y, 8, 6, konstants_1.Konstants.lemon, konstants_3.EntityType.bullet_lemon);
        // The args will be this bullet.
        this.tempBullet.destroyed.addOnce((args) => {
            this.totalBullets--;
            this.bullets.splice(this.bullets.indexOf(args), 1);
        }, this, 0, this);
        this.tempBullet.contactDamage = 9999;
        this.tempBullet.horizontalSpeed = 190;
        this.tempBullet.targetSpeed.x = this.tempBullet.horizontalSpeed * this.myWorld.entityManager.player.getFacingDirection();
        this.bullets.push(this.tempBullet);
        this.myWorld.game.sound.play(konstants_2.AudioName.mega_buster);
        return true;
    }
    restoreEnergy(amount) {
        // Buster weapon does not have energy
    }
    setEnergy(amount) {
        // Buster weapon does not have energy
    }
}
exports.LemonWeapon = LemonWeapon;


/***/ }),
/* 81 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VanishingBlockManager = void 0;
const konstants_1 = __webpack_require__(2);
class VanishingBlockManager {
    constructor(world) {
        this.world = world;
        this.groups = new Array();
        this.isPaused = false;
        this.game = world.game;
    }
    update() {
        if (this.isPaused) {
            return;
        }
        for (let i = 0; i < this.groups.length; i++) {
            if (!this.groups[i].isActive) {
                continue;
            }
            for (let j = 0; j < this.groups[i].blocks.length; j++) {
                // Last block is visible
                if (this.groups[i].blocks[this.groups[i].blocks.length - 1].visible) {
                    // continue;
                }
                if (this.groups[i].currBlockIdx != j) {
                    continue;
                }
                this.groups[i].blocks[this.groups[i].currBlockIdx].m_delayElapsedTime += this.game.time.elapsedMS;
                if (this.groups[i].blocks[this.groups[i].currBlockIdx].m_delayElapsedTime >=
                    this.groups[i].blocks[this.groups[i].currBlockIdx].startDelay) {
                    this.game.sound.play(konstants_1.AudioName.vanishing_blocks);
                    this.groups[i].blocks[this.groups[i].currBlockIdx].visible = true;
                    this.groups[i].blocks[this.groups[i].currBlockIdx].surfaces.forEach(element => {
                        element.collidable = true;
                    });
                    this.groups[i].blocks[this.groups[i].currBlockIdx].m_delayElapsedTime = 0;
                    this.groups[i].currBlockIdx++;
                    if (this.groups[i].currBlockIdx >= this.groups[i].blocks.length) {
                        this.groups[i].currBlockIdx = 0;
                    }
                }
            }
            for (let j = 0; j < this.groups[i].blocks.length; j++) {
                if (this.groups[i].blocks[j].visible) {
                    this.groups[i].blocks[j].m_appearElapsedTime += this.game.time.elapsedMS;
                    if (this.groups[i].blocks[j].m_appearElapsedTime >= this.groups[i].blocks[j].appearFor) {
                        this.groups[i].blocks[j].m_appearElapsedTime = 0;
                        this.groups[i].blocks[j].visible = false;
                        this.groups[i].blocks[j].surfaces.forEach(element => {
                            element.collidable = false;
                        });
                    }
                }
            }
        }
    }
    pause() {
        this.isPaused = true;
    }
    unpause() {
        this.isPaused = false;
    }
    reset() {
        for (let i = 0; i < this.groups.length; i++) {
            this.groups[i].isActive = false;
            this.groups[i].currBlockIdx = 0;
            for (let j = 0; j < this.groups[i].blocks.length; j++) {
                this.groups[i].blocks[j].m_delayElapsedTime = 0;
                this.groups[i].blocks[j].m_appearElapsedTime = 0;
                this.groups[i].blocks[j].visible = false;
                this.groups[i].blocks[j].surfaces.forEach(element => {
                    element.collidable = false;
                });
            }
        }
    }
    addNewGroup(groupIndex) {
        // console.log('ADD NEW GROUP: ' + groupIndex);
        if (this.groups.length != 0) {
            // This group already exists; don't create it.
            if (this.groups.filter((value) => {
                return value.groupIndex == groupIndex;
            }).length != 0) {
                return;
            }
        }
        this.groups.push({
            currBlockIdx: 0,
            isActive: false,
            groupIndex: groupIndex,
            blocks: new Array()
        });
    }
    addToGroup(groupIndex, vb) {
        // console.log("ADD VANISHING BLOCK TO GROUP: " + groupIndex);
        // Create a new group if it doesn't exist.
        if (this.groups.filter((value) => {
            return value.groupIndex == groupIndex;
        }).length == 0) {
            this.addNewGroup(groupIndex);
        }
        ;
        this.groups.filter((value) => {
            return value.groupIndex == groupIndex;
        })[0].blocks.push(vb);
    }
    isTriggerActive(groupIndex) {
        return this.groups.filter((value) => {
            return value.groupIndex == groupIndex;
        })[0].isActive;
    }
    activateTrigger(groupIndex) {
        this.groups.filter((value) => {
            return value.groupIndex == groupIndex;
        })[0].isActive = true;
        this.groups.filter((value) => {
            return value.groupIndex == groupIndex;
        })[0].blocks.sort((a, b) => {
            if (a.index > b.index) {
                return 1;
            }
            else if (a.index < b.index) {
                return -1;
            }
            else if (a.index == b.index) {
                return 0;
            }
            else {
                console.error('???');
            }
        });
    }
    deactivateTrigger(groupIndex) {
        // console.log('deactivate trigger: ' + groupIndex);
        this.groups.filter((value) => {
            return value.groupIndex == groupIndex;
        })[0].isActive = false;
    }
}
exports.VanishingBlockManager = VanishingBlockManager;


/***/ }),
/* 82 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DebugDrawManager = void 0;
const konstants_1 = __webpack_require__(2);
const debug_1 = __webpack_require__(5);
class DebugDrawManager {
    constructor(myWorld) {
        this.myWorld = myWorld;
        this.tempRect = new Phaser.Rectangle(0, 0, 0, 0);
        this.drawSurfacesOnceFlag = false;
        this.graphicsDebug = myWorld.game.add.graphics();
        myWorld.game.add.existing(this.graphicsDebug);
        this.gridGraphics = myWorld.game.add.graphics();
        myWorld.game.add.existing(this.gridGraphics);
        this.allowDrawHitboxes = debug_1.Debug.AllowDrawHitboxes;
        this.allowDrawOutlines = debug_1.Debug.AllowDrawOutlines;
        this.allowDrawGrid = debug_1.Debug.AllowDrawGrid;
        this.drawGrid();
    }
    update() {
        this.graphicsDebug.clear();
        this.drawHitboxes();
        this.drawSurfaces();
    }
    toggleHitboxDrawing() {
        this.allowDrawHitboxes = !this.allowDrawHitboxes;
        if (!this.allowDrawHitboxes) {
            this.graphicsDebug.clear();
        }
    }
    toggleOutlineDrawing() {
        this.allowDrawOutlines = !this.allowDrawOutlines;
        this.drawSurfaces();
        if (!this.allowDrawOutlines) {
            this.graphicsDebug.clear();
        }
    }
    toggleGridDrawing() {
        this.allowDrawGrid = !this.allowDrawGrid;
        this.drawGrid();
        if (!this.allowDrawGrid) {
            this.gridGraphics.clear();
        }
    }
    drawGrid() {
        if (!this.allowDrawGrid) {
            return;
        }
        this.gridGraphics.lineStyle(1);
        this.gridGraphics.beginFill(0x00ff00, 0.5);
        // let x = this.myWorld.game.camera.position.x;
        // let y = this.myWorld.game.camera.position.y;
        let x = 0;
        let y = 0;
        for (let i = 0; i < 200; i++) {
            this.gridGraphics.moveTo(x, y + i * 16);
            this.gridGraphics.lineTo(x + 5000, y + i * 16);
        }
        for (let i = 0; i < 200; i++) {
            this.gridGraphics.moveTo(x + i * 16, y);
            this.gridGraphics.lineTo(x + i * 16, y + 5000);
        }
    }
    drawHitboxes() {
        if (!this.allowDrawHitboxes) {
            return;
        }
        this.graphicsDebug.lineStyle(1);
        this.graphicsDebug.beginFill(0x00ff00, 0.5);
        for (let i = 0; i < this.myWorld.entityManager.entities.length; i++) {
            if (this.myWorld.entityManager.entities[i].myEntityType == konstants_1.EntityType.player) {
                if (!this.myWorld.entityManager.player.alive) {
                    continue;
                }
                this.tempRect = this.myWorld.entityManager.player.hitbox;
                this.graphicsDebug.drawRect(this.tempRect.x, this.tempRect.y, this.tempRect.width, this.tempRect.height);
            }
            else if (this.myWorld.entityManager.entities[i].hitbox instanceof Phaser.Rectangle) {
                this.tempRect = this.myWorld.entityManager.entities[i].hitbox;
                this.graphicsDebug.drawRect(this.tempRect.x, this.tempRect.y, this.tempRect.width, this.tempRect.height);
            }
            else if (this.myWorld.entityManager.entities[i].hitbox instanceof Phaser.Polygon) {
            }
        }
    }
    drawSurfaces() {
        if (!this.allowDrawOutlines) {
            return;
        }
        this.graphicsDebug.endFill();
        this.graphicsDebug.lineStyle(1, 0xff0000);
        for (let i = 0; i < this.myWorld.entityManager.surfaces.length; i++) {
            this.graphicsDebug.moveTo(this.myWorld.entityManager.surfaces[i].p1.x, this.myWorld.entityManager.surfaces[i].p1.y);
            this.graphicsDebug.lineTo(this.myWorld.entityManager.surfaces[i].p2.x, this.myWorld.entityManager.surfaces[i].p2.y);
        }
        for (let i = 0; i < this.myWorld.entityManager.ladders.length; i++) {
            this.graphicsDebug.lineStyle(1, 0x555500);
            this.graphicsDebug.drawRect(this.myWorld.entityManager.ladders[i].x, this.myWorld.entityManager.ladders[i].y, this.myWorld.entityManager.ladders[i].width, this.myWorld.entityManager.ladders[i].height);
        }
    }
}
exports.DebugDrawManager = DebugDrawManager;


/***/ }),
/* 83 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Camera = exports.GoingTo = void 0;
const stateMachine_1 = __webpack_require__(33);
const mathutil_1 = __webpack_require__(34);
var GoingTo;
(function (GoingTo) {
    GoingTo["Left"] = "left";
    GoingTo["Right"] = "right";
    GoingTo["Up"] = "up";
    GoingTo["Down"] = "down";
})(GoingTo = exports.GoingTo || (exports.GoingTo = {}));
/**
 * How the Tilemap works:
 * camera_bounds object layer determines the 'rooms' based off its position and size.
 * This layer also contains properties: left, right, up, down, leftConn, rightConn, upConn, downConn, and index.
 * The index to distinguish one room for another.
 * If a room has a left room then left will be true. Additionally, leftConn must have the index of the room that will be entered.
 * A room can have at most 4 rooms that it can enter (left, right, up, down). The appropriate bools must be true and its
 * connections indices must be set to the room that it is connected to.
 *
 * if upConn,leftConn,downConn,rightConn exists why need the bool?
 */
class Camera {
    constructor(game, myWorld, camera_bounds) {
        this.game = game;
        this.myWorld = myWorld;
        this.camera_bounds = camera_bounds;
        this.cameraStateShifting = new Phaser.Signal();
        this.camersStateBackToNormal = new Phaser.Signal();
        this.prevTarget = null;
        this.target = null;
        this.rooms = new Array();
        this.fsm = new stateMachine_1.StateMachine();
        this.fsm.addState(CameraState.Regular, new RegularCameraState(this));
        this.fsm.addState(CameraState.Shifting, new ShiftingCameraState(this));
        this.fsm.changeState(CameraState.Regular);
        for (let i = 0; i < camera_bounds.length; i++) {
            // console.log('i: ' + i);
            // console.log('x: ' + camera_bounds[i].x);
            // console.log('y: ' + camera_bounds[i].y);
            // console.log('width: ' + camera_bounds[i].width);
            // console.log('height: ' + camera_bounds[i].height);
            // console.log(camera_bounds[i].properties)
            let x = camera_bounds[i].x;
            let y = camera_bounds[i].y;
            let width = camera_bounds[i].width;
            let height = camera_bounds[i].height;
            let left = camera_bounds[i].properties.left;
            let right = camera_bounds[i].properties.right;
            let up = camera_bounds[i].properties.up;
            let down = camera_bounds[i].properties.down;
            let isBossRoom = camera_bounds[i].properties.bossRoom;
            let leftConn = camera_bounds[i].properties.leftConn;
            let rightConn = camera_bounds[i].properties.rightConn;
            let upConn = camera_bounds[i].properties.upConn;
            let downConn = camera_bounds[i].properties.downConn;
            let index = camera_bounds[i].properties.index;
            let canGoBack = camera_bounds[i].properties.canGoBack == 'true' ? true : false;
            let bounds = new Phaser.Rectangle(x, y, width, height);
            let hasDoorLeft = camera_bounds[i].properties.hasDoorLeft;
            let hasDoorRight = camera_bounds[i].properties.hasDoorRight;
            let hasDoorUp = camera_bounds[i].properties.hasDoorUp;
            let hasDoorDown = camera_bounds[i].properties.hasDoorDown;
            // console.log('name: ' + camera_bounds[i].name);
            // console.log('index: ' + index);
            // console.log('x: ' + x);
            // console.log('y: ' + y);
            // console.log('width: ' + width);
            // console.log('height: ' + height);
            // console.log('left: ' + left);
            // console.log('leftConn: ' + leftConn);
            // console.log('right: ' + right);
            // console.log('rightConn: ' + rightConn);
            // console.log('up: ' + up);
            // console.log('upConn: ' + upConn);
            // console.log('down: ' + down);
            // console.log('downConn: ' + downConn);
            let room = {
                isBossRoom: isBossRoom,
                bounds: bounds,
                left: left,
                right: right,
                up: up,
                down: down,
                leftConn: leftConn,
                rightConn: rightConn,
                upConn: upConn,
                downConn: downConn,
                index: index,
                canGoBack: canGoBack,
                hasDoorLeft: hasDoorLeft,
                hasDoorRight: hasDoorRight,
                hasDoorUp: hasDoorUp,
                hasDoorDown: hasDoorDown,
            };
            this.rooms.push(room);
        }
        // this.setCurrentRoom(0); // default room is index 0; overwrite somewhere else if needed
    }
    update() {
        this.fsm.currentState.update();
    }
    setCurrentRoom(index) {
        for (let i = 0; i < this.rooms.length; i++) {
            if (this.rooms[i].index == index) {
                this.currentRoom = this.rooms[i];
                break;
            }
        }
        if (this.currentRoom == null || this.currentRoom == undefined) {
            console.error('index does not exist...make sure this room index exists in Tiled.');
        }
        this.game.camera.bounds = this.currentRoom.bounds;
        this.game.camera.x = this.currentRoom.bounds.x;
        this.game.camera.y = this.currentRoom.bounds.y;
    }
    setTarget(target) {
        this.prevTarget = this.target;
        this.target = target;
        this.game.camera.target = target;
    }
    forceCameraGo(doorDirection) {
        if (doorDirection == 'left') {
            if (this.currentRoom.left) {
                let nextRoomIndex = this.currentRoom.leftConn;
                for (let i = 0; i < this.rooms.length; i++) {
                    if (this.rooms[i].index == nextRoomIndex) {
                        this.nextRoom = this.rooms[i];
                        this.goingTo = GoingTo.Left;
                        this.fsm.changeState(CameraState.Shifting);
                        return;
                    }
                }
            }
        }
        if (doorDirection == 'right') {
            if (this.currentRoom.right) {
                let nextRoomIndex = this.currentRoom.rightConn;
                for (let i = 0; i < this.rooms.length; i++) {
                    if (this.rooms[i].index == nextRoomIndex) {
                        this.nextRoom = this.rooms[i];
                        this.goingTo = GoingTo.Right;
                        this.fsm.changeState(CameraState.Shifting);
                        return;
                    }
                }
            }
        }
        if (doorDirection == 'up') {
            if (this.currentRoom.up) {
                let nextRoomIndex = this.currentRoom.upConn;
                for (let i = 0; i < this.rooms.length; i++) {
                    if (this.rooms[i].index == nextRoomIndex) {
                        this.nextRoom = this.rooms[i];
                        this.goingTo = GoingTo.Up;
                        this.fsm.changeState(CameraState.Shifting);
                        return;
                    }
                }
            }
        }
        if (doorDirection == 'down') {
            if (this.currentRoom.down) {
                let nextRoomIndex = this.currentRoom.downConn;
                for (let i = 0; i < this.rooms.length; i++) {
                    if (this.rooms[i].index == nextRoomIndex) {
                        this.nextRoom = this.rooms[i];
                        this.goingTo = GoingTo.Down;
                        this.fsm.changeState(CameraState.Shifting);
                        return;
                    }
                }
            }
        }
    }
}
exports.Camera = Camera;
var CameraState;
(function (CameraState) {
    CameraState["Regular"] = "Regular";
    CameraState["Shifting"] = "Shifting";
})(CameraState || (CameraState = {}));
class RegularCameraState {
    constructor(actor) {
        this.name = CameraState.Regular;
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
    }
    update() {
        if (this.actor.currentRoom.left) {
            let leftX = this.actor.currentRoom.bounds.x;
            if (this.actor.target.getPosition().x < leftX) {
                let nextRoomIndex = this.actor.currentRoom.leftConn;
                for (let i = 0; i < this.actor.rooms.length; i++) {
                    if (this.actor.rooms[i].index == nextRoomIndex) {
                        this.actor.nextRoom = this.actor.rooms[i];
                        this.actor.goingTo = GoingTo.Left;
                        this.actor.fsm.changeState(CameraState.Shifting);
                        return;
                    }
                }
            }
        }
        if (this.actor.currentRoom.right) {
            let rightX = this.actor.currentRoom.bounds.x + this.actor.currentRoom.bounds.width;
            if (this.actor.target.getPosition().x > rightX) {
                let nextRoomIndex = this.actor.currentRoom.rightConn;
                for (let i = 0; i < this.actor.rooms.length; i++) {
                    if (this.actor.rooms[i].index == nextRoomIndex) {
                        this.actor.nextRoom = this.actor.rooms[i];
                        this.actor.goingTo = GoingTo.Right;
                        this.actor.fsm.changeState(CameraState.Shifting);
                        return;
                    }
                }
            }
        }
        if (this.actor.currentRoom.down) {
            // Take into account the camera targets height.
            let downY = this.actor.currentRoom.bounds.y + this.actor.currentRoom.bounds.height + 10;
            if (this.actor.target.getPosition().y > downY) {
                let nextRoomIndex = this.actor.currentRoom.downConn;
                for (let i = 0; i < this.actor.rooms.length; i++) {
                    if (this.actor.rooms[i].index == nextRoomIndex) {
                        this.actor.nextRoom = this.actor.rooms[i];
                        this.actor.goingTo = GoingTo.Down;
                        this.actor.fsm.changeState(CameraState.Shifting);
                        return;
                    }
                }
            }
        }
        if (this.actor.currentRoom.up) {
            // Take into account the camera targets height.
            let upY = this.actor.currentRoom.bounds.y + 10;
            if (this.actor.target.getPosition().y < upY) {
                let nextRoomIndex = this.actor.currentRoom.upConn;
                for (let i = 0; i < this.actor.rooms.length; i++) {
                    if (this.actor.rooms[i].index == nextRoomIndex) {
                        this.actor.nextRoom = this.actor.rooms[i];
                        this.actor.goingTo = GoingTo.Up;
                        this.actor.fsm.changeState(CameraState.Shifting);
                        return;
                    }
                }
            }
        }
    }
    exit() {
        this.initialized = false;
    }
}
class ShiftingCameraState {
    constructor(actor) {
        this.name = CameraState.Shifting;
        this.startX = 0;
        this.startY = 0;
        this.endX = 0;
        this.endY = 0;
        this.elapsedTime = 0;
        this.endTime = 1500;
        this.actor = actor;
    }
    enter() {
        this.initialized = true;
        this.actor.setTarget(null);
        switch (this.actor.goingTo) {
            case GoingTo.Left:
                this.startX = this.actor.currentRoom.bounds.x;
                this.endX = this.actor.currentRoom.bounds.x - 256;
                break;
            case GoingTo.Right:
                this.startX = this.actor.currentRoom.bounds.x + this.actor.currentRoom.bounds.width - 256;
                this.endX = this.actor.nextRoom.bounds.x;
                break;
            case GoingTo.Down:
                this.startY = this.actor.currentRoom.bounds.y + this.actor.currentRoom.bounds.height - 240;
                this.endY = this.actor.nextRoom.bounds.y;
                break;
            case GoingTo.Up:
                this.startY = this.actor.currentRoom.bounds.y;
                this.endY = this.actor.currentRoom.bounds.y - 240;
                break;
        }
        this.actor.game.camera.bounds = new Phaser.Rectangle(0, 0, 6000, 6000); // make the bounds 'unlimited' for now
        this.actor.cameraStateShifting.dispatch();
    }
    update() {
        this.elapsedTime += this.actor.game.time.elapsedMS;
        switch (this.actor.goingTo) {
            case GoingTo.Left:
            case GoingTo.Right:
                this.doHorizontalScroll();
                break;
            case GoingTo.Down:
            case GoingTo.Up:
                this.doVerticalScroll();
                break;
        }
    }
    exit() {
        this.initialized = false;
        this.elapsedTime = 0;
    }
    doHorizontalScroll() {
        let finalX = mathutil_1.MathUtil.lerp(this.startX, this.endX, this.elapsedTime / this.endTime);
        this.actor.game.camera.x = finalX;
        if (this.elapsedTime > this.endTime) {
            this.actor.game.camera.x = finalX;
            this.actor.currentRoom = this.actor.nextRoom;
            this.actor.game.camera.bounds = this.actor.currentRoom.bounds;
            this.actor.setTarget(this.actor.prevTarget);
            this.actor.camersStateBackToNormal.dispatch();
            this.actor.fsm.changeState(CameraState.Regular);
        }
    }
    doVerticalScroll() {
        let finalY = mathutil_1.MathUtil.lerp(this.startY, this.endY, this.elapsedTime / this.endTime);
        this.actor.game.camera.y = finalY;
        if (this.elapsedTime > this.endTime) {
            this.actor.game.camera.y = finalY;
            this.actor.currentRoom = this.actor.nextRoom;
            this.actor.game.camera.bounds = this.actor.currentRoom.bounds;
            this.actor.setTarget(this.actor.prevTarget);
            this.actor.camersStateBackToNormal.dispatch();
            this.actor.fsm.changeState(CameraState.Regular);
        }
    }
}


/***/ }),
/* 84 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RespawnLocation = void 0;
var RespawnLocation;
(function (RespawnLocation) {
    RespawnLocation["Original"] = "Original";
    RespawnLocation["LeftSideOfScreen"] = "LeftSideOfScreen";
    RespawnLocation["RightSideOfScreen"] = "RightSideOfScreen";
})(RespawnLocation = exports.RespawnLocation || (exports.RespawnLocation = {}));


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	
/******/ })()
;
//# sourceMappingURL=app.js.map