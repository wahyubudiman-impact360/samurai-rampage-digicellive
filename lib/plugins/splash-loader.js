ig.module('plugins.splash-loader')
.requires(
    'impact.loader',
    'impact.animation'
)
.defines(function() {
    ig.SplashLoader = ig.Loader.extend({
        desktopCoverDIVID: "play-desktop", 
        
        splashDesktop: new ig.Image('media/graphics/splash/desktop/cover.jpg'),
        splashMobile: new ig.Image('media/graphics/splash/mobile/cover.jpg'),

		loadingBar: new ig.Image('media/graphics/splash/loading/loading-bar-full.png'),
		
        init:function(gameClass,resources){

            this.parent(gameClass,resources);
			
            // ADS
            ig.apiHandler.run("MJSPreroll");
        },

        end:function(){
            this.parent();
            this._drawStatus = 1;
            this.draw();
            
            if (_SETTINGS['TapToStartAudioUnlock']['Enabled']) {
                this.tapToStartDiv(function() {
                    /* play game */
                    ig.system.setGame(MyGame);
                }.bind(this));
            } else {
                /* play game */
                ig.system.setGame(MyGame);
            }
        },
        
        tapToStartDiv: function(onClickCallbackFunction) {
            this.desktopCoverDIV = document.getElementById(this.tapToStartDivId);

            // singleton pattern
            if (this.desktopCoverDIV) {
                return;
            }

            /* create DIV */
            this.desktopCoverDIV = document.createElement("div");
            this.desktopCoverDIV.id = this.tapToStartDivId;
            this.desktopCoverDIV.setAttribute("class", "play");
            this.desktopCoverDIV.setAttribute("style", "position: absolute; display: block; z-index: 999999; background-color: rgba(23, 32, 53, 0.7); visibility: visible; font-size: 10vmin; text-align: center; vertical-align: middle; -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;");
            this.desktopCoverDIV.innerHTML = "<div style='color:white;background-color: rgba(255, 255, 255, 0.3); border: 2px solid #fff; font-size:20px; border-radius: 5px; position: relative; float: left; top: 50%; left: 50%; transform: translate(-50%, -50%);'><div style='padding:20px 50px; font-family: grobold;'>" + _STRINGS["Splash"]["TapToStart"] + "</div></div>";

            /* inject DIV */
            var parentDIV = document.getElementById("play").parentNode || document.getElementById("ajaxbar");
            parentDIV.appendChild(this.desktopCoverDIV);

            /* resize DIV */
            try {
                if (typeof(ig.sizeHandler) !== "undefined") {
                    if (typeof(ig.sizeHandler.coreDivsToResize) !== "undefined") {
                        ig.sizeHandler.coreDivsToResize.push(("#" + this.tapToStartDivId));
                        if (typeof(ig.sizeHandler.reorient) === "function") {

                            //Bug with responsive plugin
                            //ig.sizeHandler.reorient();
                        }
                    }
                } else if (typeof(coreDivsToResize) !== "undefined") {
                    coreDivsToResize.push(this.tapToStartDivId);
                    if (typeof(sizeHandler) === "function") {
                        console.log("sizeHandler");
                        //sizeHandler();
                    }
                }
            } catch (error) {
                console.log(error);
            }

            /* click DIV */
            this.desktopCoverDIV.addEventListener("click", function() {
                ig.soundHandler.unlockWebAudio();

                /* hide DIV */
                this.desktopCoverDIV.setAttribute("style", "visibility: hidden;");

                /* end function */
                if (typeof(onClickCallbackFunction) === "function") {
                    onClickCallbackFunction();
                }
            }.bind(this));
        },

        animate:function(){
            ig.Timer.step();
        },


        drawCheck: 0,
        draw: function() {

            this._drawStatus += (this.status - this._drawStatus)/5;
            
            //Check the game screen. see if the font are loaded first. Removing the two lines below is safe :)
            if(this.drawCheck === 1) console.log('Font should be loaded before loader draw loop');
            if(this.drawCheck < 2) this.drawCheck ++;
			
			// FONTS PRELOAD
			ig.system.context.font = 'bold 16pt osaka';
			ig.system.context.fillText("preload",0, 0);
			
            // CLEAR RECTANGLE
            ig.system.context.fillStyle = '#000';
            ig.system.context.fillRect( 0, 0, ig.system.width, ig.system.height );
			
			// BACKGROUND
			if(ig.ua.mobile){
				this.splashMobile.draw(0,0);
			} else {
				this.splashDesktop.draw(0,0);
			}
			
			if(this.drawCheck >= 2)
			{
				var ctx = ig.system.context;
				ctx.save();
				ctx.fillStyle = "#ffffff";
				ctx.textAlign = 'center';
				ctx.textBaseline= "middle";
			
				// DRAW LOADING BAR
				this.loadingBar.draw((ig.system.width - this.loadingBar.width) * 0.5, 460 - this.loadingBar.height*0.5, 0, 0, this.loadingBar.width * this._drawStatus, this.loadingBar.height);
			
				// DRAW LOADING PERCENTAGE
				var percentage = Math.round(this._drawStatus * 100);
				ctx.font = 'bold 48px osaka';
				ctx.fillText(percentage+"%",ig.system.width * 0.5, 486);
				ctx.restore();
			}
        }
    });
});
