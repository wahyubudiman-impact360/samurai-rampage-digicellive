ig.module(
    'plugins.handlers.dom-handler'
)
.requires(
)
.defines(function(){

    ig.DomHandler = ig.Class.extend({

        JQUERYAVAILABLE:false,
        init: function(){

            this.JQUERYAVAILABLE = this._jqueryAvailable();
            //console.log("Using JQuery?",this.JQUERYAVAILABLE);
        },

        _jqueryAvailable:function()
        {
            return (typeof jQuery !== "undefined");
        },

        addEvent:function(elem,eventName,eventFunction,userCapture)
        {
            if(this.JQUERYAVAILABLE)
            {
                elem.on(eventName,eventFunction);
            }
            else
            {
                elem.addEventListener(eventName,eventFunction,userCapture);
            }
        },


        create:function(domElement)
        {
            if(this.JQUERYAVAILABLE)
            {
                var newDomElement = $("<"+domElement+">");
                return newDomElement;
            }
            else
            {
                var newDomElement = ig.$new(domElement);
                return newDomElement;
            }

        },

        getElementByClass:function(classname)
        {
            if(this.JQUERYAVAILABLE)
            {
                var string  = "."+classname;
                return $(string);
            }
            else
            {
                return document.getElementsByClassName(classname);
            }
        },

        getElementById:function(id)
        {
            if(this.JQUERYAVAILABLE)
            {
                var jqueryObject = $(id);

                if(jqueryObject.length>0)
                {
                    return $(id);
                }
                else
                {
                    return null;
                }
            }
            else
            {
                return ig.$(id);
            }
        },

        appendChild:function(appender,appendee)
        {
            if(this.JQUERYAVAILABLE)
            {
                appender.append(appendee);
            }
            else
            {
                appender.appendChild(appendee);
            }
        },

        appendToBody:function(domElement)
        {
            if(this.JQUERYAVAILABLE)
            {
                $("body").append(domElement);
            }
            else
            {
                document.body.appendChild(domElement);
            }

        },

        resize:function(elem,w,h)
        {
            if(this.JQUERYAVAILABLE)
            {
                //var elem = $(id);
                elem.width(w.toFixed(2));
                elem.height(h.toFixed(2));
            }
            else
            {
                //var elem = ig.$(id);
                var tempVisibility = elem.style.visibility;
                var styleString="width:"+ w.toFixed(2) +"px; height:"+ h.toFixed(2)+ "px;";
                this.attr(elem,"style",styleString);
                elem.style.visibility = tempVisibility;
            }
        },

        resizeOffsetLeft:function(elem,w,h,l)
        {
            if(this.JQUERYAVAILABLE)
            {
                //var elem = $(id);
                elem.width(w.toFixed(2));
                elem.height(h.toFixed(2));
                elem.css('left',l);
            }
            else
            {
                var tempVisibility = elem.style.visibility;
                //var elem = ig.$(id);
                var styleString="width:"+ w.toFixed(2) +"px; height:"+ h.toFixed(2)+ "px; left: "+l.toFixed(2)+"px;";
                this.attr(elem,"style",styleString);
                elem.style.visibility = tempVisibility;
            }
        },

        resizeOffset:function(elem,w,h,l,t)
        {
            if(this.JQUERYAVAILABLE)
            {
                //var elem = $(id);
                elem.width(w.toFixed(2));
                elem.height(h.toFixed(2));
                elem.css('left',l);
                elem.css('top',t);
            }
            else
            {
                var tempVisibility = elem.style.visibility;
                //var elem = ig.$(id);
                var styleString="width:"+ w.toFixed(2) +"px; height:"+ h.toFixed(2)+ "px; left: "+l.toFixed(2)+"px; top: "+t.toFixed(2)+"px;";
                this.attr(elem,"style",styleString);
                elem.style.visibility = tempVisibility;
            }
        },

        css:function(elem,keys)
        {
            if(this.JQUERYAVAILABLE)
            {
                elem.css(keys);
            }
            else
            {
                var styleString = "";
                for(var key in keys)
                {

                    styleString += key+":"+keys[key]+";";
                }

                this.attr(elem,"style",styleString);
            }
        },

        getOffsets:function(elem)
        {
            if(this.JQUERYAVAILABLE)
            {
                var offsets = elem.offset();

                return {left:offsets.left,top:offsets.top};
            }
            else
            {
                return {left:elem.offsetLeft,top:elem.offsetTop};
            }
        },

        attr:function(elem,key,value)
        {
            if(typeof(value) === "undefined")
            {
                if(this.JQUERYAVAILABLE)
                {
                    return elem.attr(key);
                }
                else
                {
                    return elem.getAttribute(key);
                }
            }
            else
            {
                if(this.JQUERYAVAILABLE)
                {
                    elem.attr(key,value);
                }
                else
                {
                    elem.setAttribute(key,value);
                }
            }
        },

        show:function(elem)
        {
            if ( !elem || typeof (elem) === "undefined" ) 
            {
                // fail silently if elem is undefined
                return; 
            }
            
            if(this.JQUERYAVAILABLE)
            {
                //var elem = $(id);
                elem.show();
                elem.css("visibility","visible");
            }
            else
            {
                if(elem)
                {
                    //var elem = ig.$(id);
                    if(elem.style)
                    {
                        elem.style.visibility="visible";
                    }
                    else
                    {
                        if(elem[0])
                        {
                            elem[0].style.visibility="visible";
                        }
                    }
                }
            }
        },
        hide:function(elem)
        {
            if ( !elem || typeof (elem) === "undefined" ) 
            {
                // fail silently if elem is undefined
                return; 
            }
            
            if(this.JQUERYAVAILABLE)
            {
                //var elem = $(id);
                elem.hide();
                elem.css("visibility","hidden");
            }
            else
            {
                if(elem)
                {
                    //var elem = ig.$(id);
                    if(elem.style)
                    {
                        elem.style.visibility="hidden";
                    }
                    else
                    {
                        if(elem[0])
                        {
                            elem[0].style.visibility="hidden";
                        }

                    }
                }
            }
        },

        getQueryVariable:function(variable)
        {
            var query = window.location.search.substring(1); // search in parent
            var vars = query.split('&');
            for (var i = 0; i < vars.length; i++)
            {
                var pair = vars[i].split('=');
                if (decodeURIComponent(pair[0]) == variable)
                {
                    return decodeURIComponent(pair[1]);
                }
            }
        },

        //Shold not rely on this
        forcedDeviceDetection:function()
        {
            var device = this.getQueryVariable("device");
            if(device){
                switch(device){
                    case 'mobile':
                        console.log('serving mobile version ...');
                        ig.ua.mobile = true;
                        break;
                    case 'desktop':
                        console.log('serving desktop version ...');
                        ig.ua.mobile = false;
                        break;
                    default:
                        console.log('serving universal version ...');
                        break;
                }
            }else{
                console.log('serving universal version ...');
            }
        },

        //Do not think this works
        forcedDeviceRotation:function()
        {

            // FORCED DEVICE ROTATION
            var force_rotate = this.getQueryVariable("force-rotate");
            if(force_rotate){
                switch(force_rotate){
                    case 'portrait':
                        console.log('force rotate to portrait')
                        window.orientation = 0;
                        break;
                    case 'landscape':
                        console.log('force rotate to horizontal')
                        window.orientation = 90;
                        break;
                    default:
                        alert('wrong command/type in param force-rotate. Defaulting value to portrait');
                        window.orientation = 0;
                }
            }
        }


    });
});

