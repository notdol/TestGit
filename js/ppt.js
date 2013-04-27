(function(win,$){

var PPTAtomic = function(){

};

var TransitionManager = function(){
        this.transitions = {};
}
TransitionManager.prototype.register = function(name){
        this.transitions[name] = new Transition();
        return this.transitions[name];
}
TransitionManager.prototype.get = function(name){
        return this.transitions[name];
}

var Transition = function(){
        this.showProp = {};
        this.hideProp = {};
        this.aniProps = [];
        this.duration = 3000;
}

Transition.prototype.setShowProp = function(startProp, endProp){
        this.showProp = {start: startProp, end: endProp};
        return this;
}
Transition.prototype.setAniProps = function(props){
        this.aniProps = props;
        return this;
}
Transition.prototype.setHideProp = function(startProp, endProp){
        this.hideProp = {start: startProp, end: endProp};
        return this;
}

Transition.prototype.show = function(t, direction){
        direction = direction || 'normal';
        if(direction == 'normal'){
                t.css(this.showProp.start);
                t.transition(this.showProp.end,this.duration);
        }else if (direction == 'reverse'){
                t.css(this.showProp.end);
                t.transition(this.showProp.start,this.duration);
        }
}
Transition.prototype.hide = function(t, direction){
        direction = direction || 'normal';
        if(direction == 'normal'){
                t.css(this.hideProp.start);
                t.transition(this.hideProp.end,this.duration);
        }else if (direction == 'reverse'){
                t.css(this.hideProp.end);
                t.transition(this.hideProp.start,this.duration);
        }
}

var TM = new TransitionManager();

TM.register('slide')
.setShowProp({'x':'200px','opacity':'0'},{'x':'0px','opacity':'1'})
.setHideProp({'x':'0px','opacity':'1'},{'x':'-200px','opacity':'0'});

TM.register('slide2')
.setShowProp({x:'600px',opacity:0,rotateY:'-90deg'},{x:'0px',opacity:1,rotateY:'0deg'})
.setHideProp({x:'0px',opacity:1,rotateY:'0deg'},{x:'-600px',opacity:0,rotateY:'90deg'})

var $new = $.noConflict(true);
var PPT = function(){
        this.created = false;
        this.opts = {
                transition: TM.get('slide2')
        };
        var sequence = 0;
        var $sections;
        var self = this;
        this.$new = $new;
        this.wrapJquery(this.$new);
        this.contextStack = [];
        this.currentStack;
        this.aniIndex = 0;
        $(document).ready(function(){
                //self.$new = $.extend(true,{},$);
                $sections = $('section');
                //$sections.remove();
                self.opts.transition.show($($sections.css({opacity:0})[0]));

                $(window).keydown(function(e){
                        switch(e.keyCode){
                                case 37:
                                        self.before();
                                break;

                                case 38:
                                        self.subNext();
                                break;

                                case 39:
                                        self.next();
                                break;

                                case 40:
                                        self.subBefore();
                                break;
                        }
                });
                self.created = true;
                $($sections[0]).fadeIn();
        });

        this.subNext = function(){
                var t = this.currentStack[this.aniIndex++];

                if(t.type == 'show'){
                        t.prop
                }
                t.target.transition(t.prop);
        }

        this.subBefore = function(){
                console.log(this.currentStack);
        }

        this.before = function(){
                if(sequence < 1) return;
                self.opts.transition.show($($sections[sequence]),'reverse');
                self.opts.transition.hide($($sections[--sequence]),'reverse');

                eval.call(window,$($sections[sequence]).find('script').html());
                var initjQuery = self.$new.fn.init;
                self.$new.fn.init = function(s,c,r) {
                    //c = c || window.document;
                    c = c || $sections[sequence];
                    return new initjQuery(s,c,r);
                };
                var context = {
                        '$': self.$new
                }
                self.contextStack[self.contextStack.length-1].apply(context);


                //window.animate();
        }
        this.next =  function(){
                if(sequence >= $sections.length-1) return;
                self.opts.transition.hide($($sections[sequence]));
                self.opts.transition.show($($sections[++sequence]));

                eval.call(window,$($sections[sequence]).find('script').html());
                var initjQuery = self.$new.fn.init;
   
                self.$new.fn.init = function(s,c,r) {
                    //c = c || window.document;
                    c = c || $sections[sequence];
                    return new initjQuery(s,c,r);
                };
                var context = {
                        '$': self.$new
                }
                self.contextStack[self.contextStack.length-1].apply(context);

                //window.animate();
        }
};

PPT.prototype.wrapJquery = function(t){

        this.currentStack = [];
        var self = this;
        t.fn.trans = function(prop){
                //alert('a');
                console.log(this);
                self.currentStack.push({
                        target: this,
                        'prop' : prop
                });
        };

        t.fn.show = function(aniName){
                self.currentStack.push({
                        target: this,
                        'prop' : aniName,
                        type: 'show'
                });
        };

        t.fn.hide = function(aniName){
                self.currentStack.push({
                        target: this,
                        'prop' : aniName,
                        type: 'hide'
                });
        };
}

PPT.prototype.animate = function(exec){
        if(!this.created)  return;
        console.log(exec);
        this.contextStack.push(exec);
};

win.PPT = new PPT();
})(window,$);



