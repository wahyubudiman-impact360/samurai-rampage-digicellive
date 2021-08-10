/**
 *  SoundHandler
 *
 *  Created by Justin Ng on 2014-08-19.
 *  Copyright (c) 2014 __MyCompanyName__. All rights reserved.
 */

ig.module('plugins.audio.sound-info')
.requires(
)
.defines(function () {

    SoundInfo = ig.Class.extend({
		FORMATS:{
			OGG:".ogg",
			MP3:".mp3",
		},
        
		/**
		* Define your sounds here
		* 
        */
		sfx:{
			kittyopeningSound:{path:"media/audio/opening/kittyopening"}
			,staticSound:{path:"media/audio/play/static"}
			,openingSound:{path:"media/audio/opening/opening"}
			,button:{path:"media/audio/game/button"}
			,slash1:{path:"media/audio/game/slash1"}
			,slash2:{path:"media/audio/game/slash2"}
			,slash3:{path:"media/audio/game/slash3"}
			,throw:{path:"media/audio/game/shuriken-throw"}
			,popup:{path:"media/audio/game/shuriken-throw"}
			,hit1:{path:"media/audio/game/hit1"}
			,hit2:{path:"media/audio/game/hit2"}
			,shieldHit:{path:"media/audio/game/shield-hit"}
			,attack1:{path:"media/audio/game/attack1"}
			,attack2:{path:"media/audio/game/attack2"}
			,attack3:{path:"media/audio/game/attack3"}
			,jump:{path:"media/audio/game/jump"}
			,upgrade:{path:"media/audio/game/upgrade"}
			,rageMode1:{path:"media/audio/game/attack3"}
			,rageMode2:{path:"media/audio/game/upgrade"}
			// ,smallEnemyIn:{path:"media/audio/game/small-in"}
			// ,smallEnemyDeath:{path:"media/audio/game/small-death"}
			,bigEnemyIn:{path:"media/audio/game/big-in"}
			,bigEnemyDeath:{path:"media/audio/game/big-death"}
			,text:{path:"media/audio/game/round-text"}
		},
		
        /**
        * Define your BGM here
        */
		bgm:{
			background:{path:'media/audio/bgm',startOgg:0,endOgg:21.463,startMp3:0,endMp3:21.463}
		}
        
		
    });

});
