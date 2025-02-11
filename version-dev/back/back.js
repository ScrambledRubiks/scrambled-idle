/**
 * ScrambledIdle v. 0.1, created by Xander Gilson.
 * All code and assets for ScrambledIdle are under the Creative Commons CC-BY. Feel free to make games, websites, etc. with this, and modify to your liking. Just please don't remove this comment or the credit in the info menu. If you aren't using the info menu, just put a credit to ScrambledIdle somewhere on the page.
 */
console.log("ScrambledIdle v. 0.1, created by Xander Gilson.");

var everything = {};

class OuterSetup {
    /**
    * If true, prints out an absolute torrent of print statements, almost acting like a live stack trace of everything occuring in your game. As there will probably be thousands of print statements per few seconds, this is not recommended except in cases of debugging where some of that information is necessary.
    */
    static debugPrintStatements = false;
    static useGameJsCSS = false;
    static defaultCSS = "";
    static customCSS = "";
    static pastebinDataSource = true;
    static showPasteExpiryWarning = true;
    static gameElementsGlobalScope = true;
}
if(OuterSetup.debugPrintStatements) console.log("000 debugPrintStatements set to true");


class TypeChecker {
    /**
     * If true, the type checker will run on every game element to ensure type safety and help with debugging.
     */
    static doTypeChecking = true;
    /**
     * If true, the type checker will run periodically to ensure type protection for objects. Doing this may be bad for performance and is not recommended for release versions of your game.
     */
    static periodicTypeChecks=false;
    /**
     * If true, only checks the first element of every array for being the wrong type. Helps with performance if you have a lot of objects with arrays.
     */
    static quickArrayCheck=false;
    /**
     * Checks over every object with a class definition in this file for correct types. Call this constructor if you want every ScrambledIdle object to enforce static typing on its member variables. This is recommended for debugging but should definitely be disabled in release versions of your game as it can add to load times.
     */
    constructor() {
        this.doTheThings();
    }
    async doTheThings() { //TODO the way this is run is very silly
        //TODO add bigint to list of type-checked values
        const file = fetch("./back/back.js")
        .then(response => response.text())
        .then(text => {
            let lines = text.split("\n");
            let className="";
            let extend = [];
            for(let i=lines.indexOf("//BEGIN TYPE CHECKING\r"); i<lines.length; i++) {
                let line = lines[i];
                if(line.includes("class ")&&line.includes("{")&&!line.includes("}")&&!line.includes("*")) {
                    if(line.includes("extends")) {
                        extend = [line.split(" ")[3].split("{")[0]]
                        
                        //console.log(extend)
                    }
                    className = line.split("class ")[1];
                    className = className.split("{")[0];
                    
                    className.trim();
                    className = className.split(" ")[0];
                    extend = TypeChecker.findInheritancePath(className);
                }
                if(className!="") {//test
                    let checkedClass = eval(className);
                    // console.log(checkedClass)
                    let varsTypes = checkedClass.varsTypes;
                    let varsKeys = ["none"];
                    try {
                    varsKeys = Object.keys(varsTypes);
                    }catch(e) {
                        console.log(e);
                        throw new Error(`when type-checking class ${className}, class does not have a static varsTypes variable.`);
                    }
                    Object.keys(everything).forEach(objKey => {
                        try {
                            let obj = everything[objKey];
                            if(obj.constructor.name==className) {
                                for (var j = 0; j<varsKeys.length; j++) {
                                    let key = varsKeys[j];
                                    let type = varsTypes[key];
                                    if(type.includes("|")) {//multi-type
                                        type = type.split("|")
                                        let errorCount = 0;
                                        type.forEach(t => {
                                            if(TypeChecker.isPrimitive(t)) {//multi-type primitive
                                                if(typeof obj[key] != t) {
                                                    errorCount++;
                                                }
                                                if(errorCount == type.length) {
                                                    console.log(obj);
                                                    throw new TypeError(`on object ${obj.id},  property ${key} should be of type ${TypeChecker.arrayEnglishify(type)} but is instead ${TypeChecker.aOrAn(typeof obj[key]) ? "an":"a"} ${typeof obj[key]} with value ${obj[key]}`);
                                                }
                                            } //BUG there is no multi-type object case
                                        });
                                        if(obj[key] instanceof Array) { //multi-type array
                                            obj[key].forEach(elem => {
                                                type.forEach(t => {
                                                    if(typeof elem == "object") {
                                                        if(elem.constructor.name!=t) {
                                                            errorCount++;
                                                        }
                                                    } else if(typeof elem != t.split("[]")[0]) {
                                                        errorCount++;
                                                    }
                                                });
                                                if(errorCount>=type.length) { //multi-type array, is array with problem element
                                                    throw new TypeError(`on object ${obj.id}, property ${key} should be an array of ${TypeChecker.arrayEnglishify(type)} but instead contains an element of type ${typeof elem} with value ${elem}`);
                                                }
                                            });
                                        }
                                    } else { //single-type
                                        if(varsTypes[key].includes("[]")) {//single-type arrray
                                            let arrayType = varsTypes[key].split("[]")[0]
                                            if(!(obj[key] instanceof Array)) { //single-type array, not array
                                                if(!aOrAn(typeof obj[key])) {
                                                    throw new TypeError(`on object ${obj.id}, property ${key} should be an array of type ${arrayType} but is instead a ${typeof obj[key]} with the value ${obj[key]}.`);
                                                } else {
                                                    throw new TypeError(`on object ${obj.id}, property ${key} should be an array of type ${arrayType} but is instead an ${typeof obj[key]} with the value ${obj[key]}.`);
                                                }
                                            } else if(this.quickArrayCheck) {
                                                    if(TypeChecker.isPrimitive(arrayType)) {
                                                        if(typeof obj[key][0] != arrayType) {
                                                            throw new TypeError(`on object ${obj.id}, property ${key} should be an array of type ${arrayType} but is instead contains an element of type ${typeof obj[key][0]} with the value ${obj[key][0]}.`);
                                                        }
                                                    } else if(!(obj[key][0] instanceof eval(arrayType))) {
                                                        throw new TypeError(`on object ${obj.id}, property ${key} should be an array of type ${arrayType} but is instead contains an element of type ${obj[key][0].constructor.name} with the value ${obj[key][0]}.`);
                                                    }
                                            } else { //single-type array, is array with problem element
                                                for(let k=0; k < obj[key].length; k++) {
                                                    if(TypeChecker.isPrimitive(arrayType)) {
                                                        if(typeof obj[key][k] != arrayType) {
                                                            throw new TypeError(`on object ${obj.id}, property ${key} should be an array of type ${arrayType} but is instead contains an element of type ${typeof obj[key][k]} with the value ${obj[key][k]}.`);
                                                        }
                                                    } else {
                                                        if(!(obj[key][k] instanceof eval(arrayType))) {
                                                            throw new TypeError(`on object ${obj.id}, property ${key} should be an array of type ${arrayType} but is instead contains an element of type ${obj[key][k].constructor.name} with the value ${obj[key][k]}.`);
                                                        }
                                                    }
                                                }
                                            }
                                            
                                        } else { //single-type non-array
                                            if(TypeChecker.isPrimitive(type)) {//single-type non-array primitive
                                                if(typeof obj[key]!=type) {
                                                    if(!TypeChecker.aOrAn(typeof obj[key])) {
                                                        throw new TypeError(`on object ${obj.id}, property ${key} should be of type ${type} but is instead is a ${typeof obj[key]}with the value ${obj[key]}.`);
                                                    } else {
                                                        throw new TypeError(`on object ${obj.id}, property ${key} should be of type ${type} but is instead is an ${typeof obj[key]} with the value ${obj[key]}.`);
                                                    }
                                                }
                                            } else { //single-type non-array object
                                                if(obj[key].constructor.name!=type) { //BUG if a key is supposed to be an object but is instead null we error out
                                                    if(TypeChecker.aOrAn(typeof obj[key])) {
                                                        throw new TypeError(`on object ${obj.id}, property ${key} should be of type ${type} but is instead is a ${obj[key].constructor.name} with the value ${obj[key]}.`);
                                                    } else {
                                                        throw new TypeError(`on object ${obj.id}, property ${key} should be of type ${type} but is instead is an ${obj[key].constructor.name} with the value ${obj[key]}.`);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        } catch(e) {
                            console.error("Something has gone wrong with TypeChecker on object \""+objKey+"\".");
                            console.log(everything[objKey]);
                            console.error(e);
                        }
                    });
                }
            }
        });
    }
    static findInheritancePath(className) {
        let c = eval(className).toString();
        c=c.split("\n")[0]
        .split("class ")[1]
        .split("{")[0]
        .split(" extends ")

        try {
        c[1]=c[1].split(" ")[0]
        let toReturn = c[0]
        toReturn += ","+this.findInheritancePath(c[1]);
        return toReturn.split(",");
        } catch(e) {
            c[0]=c[0].split(" ")[0];
            return c;
        }
    }
    static aOrAn(str) {
        str = str.charAt(0).toLowerCase();
        //yes I know that this technically isn't how the a/an rule works but there's basically no systematic way to implement the correct rule and frankly it isn't really important at all(this comment is mainly to remind myself that i don't need to go down this rabbithole)
        return str=="a"||str=="e"||str=="i"||str=="o"||str=="u";
    }
    static isPrimitive(type) {
        return (type=="string"||type=="number"||type=="boolean"||type=="function"||type=="bigint"||type=="null");
    }
    static arrayEnglishify(ar) {
        let toReturn = "";
        for (let i = 0; i < ar.length; i++) {
            const element = ar[i];
            if(i==ar.length-1 && !(ar.length > 2)) {
                toReturn += "or " + element;
            } else {
                toReturn += element + ", ";
            }
        }
        return toReturn;
    }
}



//BEGIN TYPE CHECKING

class Tick {
    static ticks = [];
    onTick = []; id; interval;delayMS=1000;

    static varsTypes = {
        onTick:"function|function[]",
        id:"string",
        interval:"number",
        delayMS:"number"
    }
    /**
     * Creates a new collection of function to be run, typically periodically.
     * @param {string} id The id of the tick, can be anything as long as it's unique.
     * @param {function|function[]} onTick A function or list of functions that will be called every tick.
     */
    constructor(id, OnTick) {
        this.onTick = OnTick;
        this.id=id;
        Object.defineProperty(everything, id, {
            configurable:true,
            writable:true,
            enumerable:true,
            value:this,
        });
        Tick.ticks.push(this);
    }
    /**
     * Starts the tick.
     * @param {number} delayMS The delay between ticks in milliseconds, default is 1000 ms, or 1 second.
     */
    start(delayMS=null) {
        if(delayMS!=null) this.delayMS=delayMS;
        if(OuterSetup.debugPrintStatements) console.log("TK01 Beginning tick "+this.id+" with delay "+delayMS);
        let funcsOnTick = this.onTick;
        let self = this;
        this.interval = setInterval(function() {
            self.tick();
        }, delayMS!=null ? delayMS : this.delayMS)
    }
    /**
     * Calls the function(s) specified in OnTick. You can call this yourself to call the tick.
     */
    tick() {
        if(OuterSetup.debugPrintStatements) console.log("-----TK02 "+this.id+"-----");
        if(typeof this.onTick == "function") {
            this.onTick = [this.onTick];
        }
        for (let i = 0; i < this.onTick.length; i++) {
            try {
                this.onTick[i]();
            } catch(e) {
                if(e instanceof TypeError) {
                    if(this.onTick[i]!=null) {
                        if(typeof this.onTick!="object") {
                            throw new Error("Tick error on tick "+this.id+", there is an on tick item that isn't a function.(type "+typeof this.onTick[i]+" with contents "+this.onTick[i]+")");
                        }
                    } else {
                        throw new Error("Tick error on tick "+this.id+", there is an on tick item that isn't a function.(tick item is null)");
                    }
                } else { 
                    throw e;
                }
            }
        }
    }
    /**
     * Stops the tick from firing on a set interval. To start the tick again, call start again.
     */
    stop() {
        clearInterval(this.interval);
    }
    /**
     * Returns the function(s) that will be called every tick.
     */
    get onTick() {
        return this.onTick;
    }
    /**
     * Sets the function(s) that will be called every tick.
     * @param functions A function or list of functions that will be called every tick.
     */
    set onTick(functions) {
        this.onTick = functions;
    }
    /**
     * Adds a function(s) to be called every tick. NOTE: functions added using this are not saved in the game save and will disappear when the game is reloaded, unless the addOnTick is called every time the game is loaded.
     * @param {function[]|function} functions A list of functions that will be called every tick.
     */
    addOnTick(functions) {
        if(OuterSetup.debugPrintStatements) console.log("TK03 adding function(s) to tick "+this.id);
        if(typeof this.onTick=="function") this.onTick = [this.onTick];
        if(functions instanceof Array) {
            for (let i = 0; i < functions.length; i++) {
                this.onTick.push(functions[i]);
            }
    } else {
        this.onTick.push(functions);
    }
    }
    /**
     * Removes and returns the most recently added tick function.
     * @returns {function} The most recently added tick function
     */
    popOnTick() {
        if(typeof this.onTick=="function") {
            this.onTick=null;
            return;
        }
        return this.onTick.pop();
    }
}
/**
 * Creates a Tick based on an object with the parameters of Tick.
 * @param {object} obj The object to be constructed into a Res
 * @ Parameters for the object:
 * @param {string} id The id of the tick, can be anything as long as it's unique.
 * @param {function|function[]} onTick A function or list of functions that will be called every tick.
 */
function TickO(obj) {
    return new Tick(obj.id, obj.onTick);
}

var isPaused = false;
var pauseBuffer;
var gameState = {};

/**
 * Pauses the game. Stops all ticks and effectively loads the game over and over.
 */
function pause() {
    if(OuterSetup.debugPrintStatements) console.log("PS01 Pausing Game...");
    for(let i=0;i<Object.keys(everything).length; i++){
        let saveObj = everything[Object.keys(everything)[i]];
        let saveValues = Object.keys(saveObj);
        saveValues.forEach(key => {
            if(SaveManager.savableKeys.includes(key) &&  eval("saveObj."+key)!=null && !SaveManager.doNotSaveList.includes(saveObj.id)){
                gameState[saveObj.id+"_"+key]=eval("saveObj."+key);
            }
            
        });
    }
    for (let i = 0; i < Tick.ticks.length; i++) {
        Tick.ticks[i].stop();
    }
    isPaused = true;
    pauseBuffer = setInterval(function() {
        Object.keys(everything).forEach(objKey => {
            let obj = everything[objKey];
            Object.keys(obj).forEach(key => {
                if(SaveManager.savableKeys.includes(key) && !SaveManager.doNotSaveList.includes(obj.id)) {
                    try {
                        eval("obj."+key+ "= gameState["+obj.id+"_"+key+"]");
                    } catch(e) {
                        if(!(e instanceof ReferenceError)) {
                            console.log("advancement made: how did we get here?")
                            throw e;
                        }
                    }
                }
            });
        });
    }, 100);
}

/**
 * Unpauses the game.
 */
function unpause() {
    isPaused = false;
    if(OuterSetup.debugPrintStatements) console.log("PS02 Unpausing Game...");
    Tick.ticks.forEach(element => {
        element.start();
    });
    clearInterval(pauseBuffer);
}
/**
 * A tick used for most visual updates. Called every 100ms and whenever a button is clicked.
 */
var visualBaseTick = new Tick("visualBaseTick",function(){});
/**
 * A tick used for certain actions such as yielding resources. It is recommended to create your own tick for other purposes.
 */
var updateBaseTick = new Tick("updateBaseTick",[function(){}]);

var fastBaseTick = new Tick("fastBaseTick", ()=>{});

class SaveManager {
    static varsTypes = {
    }
    /* If any new savable values are needed, add them here.*/ 
    static savableKeys = ["amount", "a", "shown", "innerHTML", "tooltipHTML", "disabled", "css", "upgradeCSS", "cost", "owned", "yield", "max", "container"];

    static doNotSaveList = [];
    /**
     * A boolean to set whether or not to print a save message to the console.
     */
    static consoleSaveMessage = true;
    /**
     * Saves the game state to localStorage.
     */
    static save() {
        if(OuterSetup.debugPrintStatements) console.log("SV01 Saving game state to localStorage...");
        if(this.consoleSaveMessage) console.log("Saving game to localStorage...");

        let saved = {};
        for(let i = 0; i < Object.keys(everything).length; i++) {
            const thingKey = Object.keys(everything)[i];
            const thing = everything[thingKey];
            if(!this.doNotSaveList.includes(thing.id)) {
                let properties = {};
                Object.keys(thing).forEach((key)=>{ 
                    if(this.savableKeys.includes(key)) {
                        properties[key] = thing[key];
                    }
                });
                saved[thing.id] = properties;
            }
        }
        localStorage.setItem("save", JSON.stringify(saved));
        
        if(this.consoleSaveMessage) console.log("Saved.");
        if(OuterSetup.debugPrintStatements) console.log("SV01 Saved.");
    }
    /**
     * If a save exists, loads the game state from localStorage.
     * NOTE: If you are having random weirdness with things not updating when you change the code, clear your save and reload the game as loading will temporarily undo any change you made that affects a savable key.
     */
    static load() {
        console.log(everything)
        if(localStorage.save!=undefined) {
            if(this.consoleSaveMessage) console.log("Loading game from localStorage...");
            if(OuterSetup.debugPrintStatements) console.log("SV02 Loading game from localStorage...");
            let i=0;
            let save = JSON.parse(localStorage.save);
            console.log(save)
            for(;i<Object.keys(save).length;i++) {
                let savedKey = Object.keys(save)[i];
                let savedObj = save[savedKey];
                try {
                    Object.keys(savedObj).forEach((key) => {
                        everything[savedKey][key] = savedObj[key];
                    });
                } catch(e) {
                    console.warn("Saved key \""+savedKey+"\" not found in current version of game.");
                }
            }
            if(this.consoleSaveMessage) console.log("Loaded "+i+" key/value pairs.");
            if(OuterSetup.debugPrintStatements) console.log("SV02 Loaded "+i+" key/value pairs.");
            
    }
    }
    /**
     * Clears localStorage, clearing the game save.
     */
    static clear() {
        if(this.consoleSaveMessage) console.log("localStorage cleared.");
        if(OuterSetup.debugPrintStatements) console.log("SV03 localStorage cleared.");
        localStorage.clear();
    }
        /** 
         * Adds to a list of IDs for DisplayElements that will NOT have their properties saved or loaded. Add as much as you can to keep saves from causing problems whenever you make a change!
         * @param {string} id The ID of the DisplayElement that will not be saved or loaded.
         * */
    static doNotSave(id) {
        this.doNotSaveList.push(id);
    }
}

var tooltip = document.createElement("div");
tooltip.classList.add("tooltip");
tooltip.id="tooltip";
tooltip.innerHTML = "tooltip";

class DisplayElement {
    id;
    container;
    css;
    shown;
    innerHTML1;
    tooltipHTML;
    hasTooltip=false;
    element;
    constructed = false;
    hasIcon = false;
    iconURL=null;
    tooltipInterval;
    static varsTypes = {
        id:"string",
        container:"string",
        css:"string",
        shown:"boolean",
        innerHTML:"string",
        tooltipHTML:"string",
        hasTooltip:"boolean",
        element:"any",
        constructed:"boolean",
        hasIcon:"false",
        iconURL:"string|null"
    }
    /**
     * The root class for most objects in ScrambledIdle. Anything that has some form of display likely inherits from this.
     * @param {string} id The DisplayElement's id.
     * @param {string} container The DisplayElement's container.
     * @param {string} innerHTML The DisplayElement's innerHTML.
     * @param {string} css The DisplayElement's CSS class.
     * @param {string} elementType The type of element that the DisplayElement is.
     * @param {boolean} shown Whether or not the DisplayElement should be shown at load.
     * @param {string} tooltipHTML The HTML of the DisplayElement's tooltip.
     * @abstract
     */
    constructor(id, container, innerHTML, css, elementType, shown=true, tooltipHTML="") {

        if (this.constructor == DisplayElement) {
            throw new Error("Error on DisplayElement "+id+", DisplayElement is an abstract and should not be instantiated on its own.");
          }
          
        this.id=id;
        this.container = container;
        this.innerHTML1 = innerHTML;
        this.css = css;
        this.shown=shown;
        this.element = document.createElement(elementType);
        this.tooltipHTML = tooltipHTML;
        
    }
    /**
     * Removes the DisplayElement from the page.
     */
    hide() {
        this.destroy();
        
    }
    /**
     * Removes the DisplayElement from the page.
     */
    destroy() {
        if(OuterSetup.debugPrintStatements) console.log("DE02 removing DisplayElement '"+this.id+"'");
        this.constructed = false;
        try {
        document.getElementById(this.id).remove();
        tooltip.style.visibility="hidden";
        tooltip.classList.remove("tooltipHover");
        tooltip.classList.add("tooltipOut");
        clearInterval(this.tooltipInterval);
        } catch (error){
        }
    }
    /**
     * Adds the DisplayElement to the page.
     * TODO: Add an optional fade-in animation as a parameter to construct()
     */
    show() {
        if(!this.checkIfValid(this.container)) throw new Error("Container errror on DisplayElement "+this.id+", the container provided is not valid.(provided name "+this.container+") This may be caused by the name of the container not existing or by passing in an HTML element as the container instead of just the element's id.");
        if(!this.checkIfValid(this.id)&&this.checkIfValid(this.container)) {
            let f = false;
            this.construct(f, "called in show()");
            if(this.iconURL!=null) this.icon();
        }
    }
    /**
     * This version of construct() is unimplemented and will throw an error if you call it. If you're seeing this, it probably means you instantiated a generic DisplayElement instead of one of its subclasses.
     */
    construct(constructed, message="") {
        throw new Error("Unimplemented method 'construct'. If you're seeing this, it probably means you instantiated a generic DisplayElement instead of one of its subclasses.");
    }
    /**
     * Formats the DisplayElement's contents to nicely display a resource.
     * @param {Res} res The resource to use.
     * @param {string} suffix A string to add after the resource's amount.
     */
    resFormat(res, suffix="") {
        if(OuterSetup.debugPrintStatements) console.log("DE01 res formatting DisplayElement '"+this.id+"'");
        
        this.get.innerHTML = res.name + ": "+res.prettyA+suffix;
        if(this.hasIcon) this.icon();
        let self = this;
        let previousAmount = res.a;
        let baseVisualUpdateLag = 50; //TODO make this a constant in game.js
        let visualUpdateLag = baseVisualUpdateLag;
        visualBaseTick.addOnTick([function() {
            /*to apply numerical smoothing the following must happen:
            1) the change in the resource has to be greater than 30% of the previous value
            2) the change has to be greater than twice the per-second yield of the resource
            3) the change has to be greater than 10
            */
            if(Math.abs(previousAmount-res.a)>previousAmount*0.3 && Math.abs(previousAmount-res.a)>res.yield*2 && Math.abs(previousAmount-res.a)>10) {
                let amountBeforeSmoothing = previousAmount;
                    let onTickLoc = fastBaseTick.onTick.length;
                    let delaySlowdown = 0;
                    
                    fastBaseTick.addOnTick(()=>{
                        //loops 30 times/sec
                        if(delaySlowdown<baseVisualUpdateLag) {
                            delaySlowdown++;
                            visualUpdateLag--;
                            let b = (delaySlowdown)/baseVisualUpdateLag;
                            let c = res.a;
                            let d = amountBeforeSmoothing;
                            //smoothing formula made by trial and error in Desmos, auto-adjusts if the res changes value
                            self.innerHTML = res.name + ": "+ Res.numberPrettify(Math.floor(1 / ((b / (2 * (d - c))) + (1 / (2 * (d - c))))- d + 2 * c))+suffix;
                            
                        } else {
                            //base case to end the loop
                            visualUpdateLag = baseVisualUpdateLag;
                            delaySlowdown=0;
                            fastBaseTick.onTick[onTickLoc] = (()=>{});
                            //loop to remove empty functions from our fastBaseTick list, doesn't do anything if there are other functions in fastBaseTick which:
                            //BUG does nothing if fastBaseTick is being used by something other than resource value smoothing
                            for(let i = 0; i < fastBaseTick.onTick.length; i++) {
                                if(fastBaseTick.onTick[i].toString()!="()=>{}") {
                                    break;
                                }
                                if(i==fastBaseTick.onTick.length-1) fastBaseTick.onTick = []; //we only get here if every function in fastBaseTick is just ()=>{}
                            }
                        }
                    
                    });

                }
            if(visualUpdateLag==baseVisualUpdateLag){ //only updates the res like
                self.get.innerHTML = res.name + ": "+res.prettyA+suffix;
                if(self.hasIcon) self.icon();
            }
            previousAmount=res.a;
        }]);
    }
    /**
     * Constructs a tooltip for the DisplayElement using the Display Element's tooltipHTML property.
     */
    tooltip_able() {
        if(OuterSetup.debugPrintStatements) console.log("DE10 tooltip_able called on DisplayElement '"+this.id+"'");

        if(this.tooltipHTML!=""&&!this.hasTooltip) {
            this.hasTooltip=true;
            try {
                //one tooltip that moves between the different elements
                document.getElementById("tooltipDiv").appendChild(tooltip);
                tooltip.style.right="0px";
                tooltip.style.top="0px";
                tooltip.style.visibility="hidden";
                //puts the tooltip in the 'inactive after use' state
                tooltip.classList.add("tooltipOut");
                let self = this;
                this.get.addEventListener("mouseenter", ()=>{
                    let elementCoords = this.get.getClientRects()[0];
                    //moves the tooltip to a 10px offset from the edge of the DisplayElement
                    //TODO OuterSetup tooltip offset variable
                    tooltip.style.right=`-${elementCoords.x-10}px`;
                    tooltip.classList.remove("tooltipOut");
                    tooltip.style.top=`${elementCoords.y}px`;
                    tooltip.innerHTML=self.tooltipHTML;
                    //checks if the tooltip is clipping off the bottom of the screen
                    if((elementCoords.y+tooltip.getClientRects()[0].height)>window.innerHeight) {
                        tooltip.style.top = (elementCoords.y-tooltip.getClientRects()[0].height+elementCoords.height)+"px";
                    }
                    tooltip.classList.add("tooltipHover");
                    
                    tooltip.style.visibility="visible";
                    //checks if the tooltip is clipping off the
                    if(tooltip.getClientRects()[0].x<0) {
                        tooltip.style.right=`-${elementCoords.x+elementCoords.width+315}px`;
                    }
                    self.tooltipInterval = setInterval(()=> {
                        tooltip.innerHTML=self.tooltipHTML;
                    }, 100)
                });
                this.get.addEventListener("mouseleave", ()=>{
                    tooltip.style.visibility="hidden";
                    tooltip.classList.remove("tooltipHover");
                    tooltip.classList.add("tooltipOut");
                    clearInterval(self.tooltipInterval);
                });
            } catch(error) {
                console.error("Tooltip Error on DisplayElement '"+this.id+"'. Attempted to attach a tooltip to a DisplayElement that hasn't been instantiated yet.(Actual error: "+error+")");
                //if you got here and the error is something other than along the lines of "object null has no function getClientRects" i am sorry
            }
        }
    }
    /**
     * Gives the DisplayElement an internal icon.
     * @param {string} imageURL The URL for the icon's image.
     * @param {string} optionalCSS A CSS class to be applied to the image.
     */
    icon(imageURL=null, optionalCSS="") {
        if(OuterSetup.debugPrintStatements) console.log("DE09 setting icon for DisplayElement "+this.id);
        this.hasIcon=true;
        if(imageURL!=null) {
            this.iconURL = imageURL;
        } else if(this.iconURL!=null) {
            imageURL = this.iconURL;
        } else {
            throw new Error("Icon Error on DisplayElement "+this.id+", the icon function was not given an imageURL parameter and the DisplayElement's iconURL is null.");
        }
        if(this.get!=null) {
            this.get.innerHTML = "<img src='"+imageURL+"' class='defaultIconCSS "+optionalCSS+"'> "+this.get.innerHTML;
        }
    }
    /**
     * A simple helper function  that makes sure the container you want to place the DisplayElement exists.
     * @param {string} container The name of the container you want to place the DisplayElement in.
     * @returns {boolean} Whether or not the container exists.
     */
    checkIfValid(container) {
        if(OuterSetup.debugPrintStatements) console.log("DE03 checking if container '"+container+"' exists");
        return document.getElementById(container)!=null;
    }
    /**
     * Removes the DisplayElement's tooltip.
     * @todo Currently not working
     */
    removeTooltip() {
        //TODO fix this
    }
    /**
     * Returns the DisplayElement's HTML element.
     */
    get get() {
        if(OuterSetup.debugPrintStatements) console.log("DE05 getting document element for DisplayElement '"+this.id+"'");
        return document.getElementById(this.id);
    }
    /**
     * Returns the DisplayElement's inner HTML in a string.
     */
    get innerHTML() {
        return this.get.innerHTML;
    }
    /**
     * Sets the DisplayElement's HTML.
     * @param {string} html The HTML to set the DisplayElement's HTML to.
     */
    set innerHTML(html) {
        if(OuterSetup.debugPrintStatements) console.log("DE06 setting innerHTML for DisplayElement '"+this.id+"'");
        this.get.innerHTML = html;
    }
    /**
     * Sets the DisplayElement's tooltip HTML. If the DisplayElement does not have a tooltip, it will be created.
     * @param {string} html The HTML to set the DisplayElement's tooltip HTML to.
     */
    set tooltip(html) {
        if(OuterSetup.debugPrintStatements) console.log("DE07 setting tooltip for DisplayElement '"+this.id+"'");
        this.tooltipHTML = html;
        this.tooltip_able();
    }
    
}

class DisplayGroup {
    static varsTypes = {
        elements:"DisplayElement[]"
    }
    elements;
    /**
     * A group of DisplayElements. Make sure you add the DisplayElements in the order you want them to be shown, this may change their position depending on each element's CSS and the CSS of their container(s).
     * @param {DisplayElement[]} elements A list of DisplayElements to add to the group.
     */
    constructor(elements) {
        if(OuterSetup.debugPrintStatements) console.log("DG01 constructing DisplayGroup");
        this.elements = elements;
    }
    /**
     * Adds a DisplayElement to the group.
     * @param {DisplayElement} element The DisplayElement to add to the group.
     */
    add(element) {
        if(OuterSetup.debugPrintStatements) console.log("DG02 adding DisplayElement '"+element.id+"' to DisplayGroup");
        this.elements.push(element);
    }
    /**
     * Applies the specified function to all elements in the group. 
     * @param {string} func The function to apply to all elements in the group.
     * @example //if the group has elements disp1, and disp2...
     * sendCommand("show") //...this will expand to this:
     * disp1.show(); disp2.show();
     */
    sendFunction(func) {
        if(OuterSetup.debugPrintStatements) console.log("DG03 sending Function '"+func+"' to DisplayGroup");
        this.elements.forEach(element => {
            try {
            eval("element."+func+"()");
            } catch (error) {
                console.error("DisplayGroup Error: sending function '"+func+"' to DisplayElement '"+element.id+"', the specified function does not exist on the DisplayElement. (actual error"+error+")");
            }
        });
    }
    /**
     * Show all of the elements in the DisplayGroup.
     */
    show() {
        this.sendFunction("show");
    }
    /**
     * Hide all of the elements in the DisplayGroup.
     */
    hide() {
        this.sendFunction("hide");
    }
}
/**
 *Creates a DisplayGroup based on an object with the parameters of DisplayGroup. Considering DisplayGroup only has one parameter, this is very unnecessary but here for the sake of completeness.
 * @param {object} obj The object to be constructed into a Res
 * @ Parameters for the object:
 * @param {DisplayElement[]} elements A list of DisplayElements to add to the group.
 */
function DisplayGroupO(obj) {
    return new DisplayGroup(obj.elements);
}

class Res {
    name;
    id;
    amount;
    canBeNegative;
    /**
     * An amount to be gained or lost every second.
     */
    yield=0;
    max;
    static varsTypes = {
        id:"string",
        name:"string",
        amount:"number|bigint",
        canBeNegative:"boolean",
        yield:"number|bigint",
        max:"number|bigint"
    }
    /**
     * A resource object.
     * @param {string} name The name of the resource to be displayed.
     * @param {string} id The id of the resource.
     * @param {int} initVal The value the resource should initially have.(defaults to 0)
     * @param {boolean} canBeNegative Whether or not the resource can be negative (defaults to false)
     */
    constructor(name, id,  initVal=0,canBeNegative=false ) {
        if(OuterSetup.debugPrintStatements) console.log("RS01 constructing resource '"+id+"'");
        this.name = name;
        this.id=id;
        this.amount = initVal;
        this.max=initVal;
        this.canBeNegative = canBeNegative;
        let self = this;
        if(!canBeNegative) {
            visualBaseTick.addOnTick([function() {
                if(self.a>self.max) {
                    self.max=self.a;
                }
                if(self.a < 0) {
                    self.a=0;
                }
            }]);
            updateBaseTick.addOnTick([function() {
                self.add(self.yield/10);
            }]);
        }
        Object.defineProperty(everything, id, {
            configurable:true,
            writable:true,
            enumerable:true,
            value:this,
        });
    }
    /**
     * Adds some amount to the resource.
     * @param {number} amount The amount to add to the resource.
     */
    add(amount) {
        if(OuterSetup.debugPrintStatements) console.log("RS02adding "+amount+" to resource '"+this.id+"'");
        if(typeof amount == "number") {
            this.amount += amount;
        } else {
            throw new Error("Resource error on resource \""+this.id+"\", attempted to set amount to a non-numeric value. This may be caused by assigning a resource's amount to another resource, like this: res1.a = res2, instead of res1.a = res2.a.");
        }
    }
    /**
     * @return The resource's name.
     */
    get name() {
        return this.name;
    }
    /**
     * Returns The resource's amount.
     */
    get a() {
        return this.amount;
    }
    /**
     * Sets the resource's amount.
     * @param {number} val The amount to set the resource's amount to.
     */
    set a(val) {
        if(OuterSetup.debugPrintStatements) console.log("RS03 setting amount for resource '"+this.id+"'");
        if(typeof val == "number") {
            this.amount = val;
        } else {
            throw new Error("Resource error on resource \""+this.id+"\", attempted to set amount to a non-numeric value. This may be caused by assigning a resource's amount to another resource, like this: res1.a = res2, instead of res1.a = res2.a.");
        }
    }
    /**
     * Returns a nicely-formatted version of the resource's amount. Example: If a resource's amount is 10000, it will return "10.0k". Supports up to about 10^50 after which it will stay on the same suffix.
     */
    get prettyA() {
        return Res.numberPrettify(this.a);
    }
    static numberPrettify(num) {
        if(num <1000) {
            return num.toFixed();
        } else if(num<1000000) {
            return (num/1000).toFixed(1)+"k";
        } else if(num<1000000000) {
            return (num/1000000).toFixed(1)+"M";
        } else if(num<1000000000000) {
            return (num/1000000000).toFixed(1)+"B";
        } else if(num<1000000000000000) {
            return (num/1000000000000).toFixed(1)+"T";
        } else if(num<1000000000000000000n) {
            return (num/1000000000000000).toFixed(1)+"Qa";
        } else if(num<1000000000000000000000n) {
            return (num/1000000000000000000n).toFixed(1)+"Qi";
        } else if(num<1000000000000000000000000n) {
            return (num/1000000000000000000000n).toFixed(1)+"Sx";
        } else if(num<1000000000000000000000000000n) {
            return (num/1000000000000000000000000n).toFixed(1)+"Sp";
        } else if(num<1000000000000000000000000000000n) {
            return (num/1000000000000000000000000000n).toFixed(1)+"Oc";
        } else if(num<1000000000000000000000000000000000n) {
            return (num/1000000000000000000000000000000n).toFixed(1)+"No";
        } else if(num<1000000000000000000000000000000000000n) {
            return (num/1000000000000000000000000000000000n).toFixed(1)+"Dc";
        } else if(num<1000000000000000000000000000000000000000n) {
            return (num/1000000000000000000000000000000000000n).toFixed(1)+"Udc";
        } else if(num<1000000000000000000000000000000000000000000n) {
            return (num/1000000000000000000000000000000000000000n).toFixed(1)+"Ddc";
        } else if(num<1000000000000000000000000000000000000000000000n) {
            return (num/1000000000000000000000000000000000000000000n).toFixed(1)+"Tdc";
        } else if(num<1000000000000000000000000000000000000000000000000n) {
            return (num/1000000000000000000000000000000000000000000000n).toFixed(1)+"Qadc";
        } else {
            return (num/1000000000000000000000000000000000000000000000000n).toFixed(1)+"Qidc";
        }
    }
}
/**
 * Creates a Res based on an object with the parameters of Res.
 * @param {object} obj The object to be constructed into a Res
 * @ Parameters for the object:
 * 
 * @param {string} name The name of the resource to be displayed.
 * @param {string} id The id of the resource.
 * @param {int} initVal The value the resource should initially have.(optional, defaults to 0)
 * @param {boolean} canBeNegative Whether or not the resource can be negative (optional, defaults to false)
 */
function ResO(obj) {
    if(obj.initVal == null && canBeNegative == null) {
        return new Res(obj.name, obj.id);
    } else if(obj.initVal == null) {
        return new Res(obj.name, obj.id, 0, obj.canBeNegative);
    } else {
        return new Res(obj.name, obj.id, obj.initVal, obj.canBeNegative);
    }
}

class Label extends DisplayElement {
    static varsTypes = {
    }
    /**
     * A label, AKA a fancy div element.
     * @param {string} id The Label's id.
     * @param {string} container The id of the container to add the label to.
     * @param {string} innerHTML The label's HTML.
     * @param {string} css The label's CSS class, default is none.
     * @param {string} tooltipHTML The label's tooltip HTML, default is none.
     * @param {boolean} shown Whether or not the label should be shown on game load, default is true.
     * @extends DisplayElement
     */
    constructor(id, container, innerHTML, css="", tooltipHTML="",  shown=true) {
        super(id,container,innerHTML,css,"div",shown, tooltipHTML);
        this.constructed = true;
        this.tooltipHTML = tooltipHTML;
        this.id = id;
        this.container = container;
        this.innerHTML1 = innerHTML;
        this.css = css;
        this.shown = shown;
        if(shown) {
            this.construct(true, "called in constructor");
        }
        Object.defineProperty(everything, id, {
            configurable:true,
            writable:true,
            enumerable:true,
            value:this,
        });
    }
    /**
     * Constructs the label. You should probably call show() instead of this.
     */
    construct(constructed, message="") {
        if(OuterSetup.debugPrintStatements) console.log("LB01",this.id, message);
        if(!constructed) {
            if(OuterSetup.debugPrintStatements) console.log("LB02 Label "+this.id+" not constructed");
            new Label(this.id, this.container, this.innerHTML1, this.css, this.tooltipHTML, this.shown);
            //return;
        }
        this.element.id=this.id;
        if(this.css!="") {
        this.element.className+=" "+this.css;
        }
        this.element.innerHTML = this.innerHTML1;
        
            if(OuterSetup.debugPrintStatements) console.log(this.id, "LBO4 not adding tooltip, adding to container",this.container);
            try {
            document.getElementById(this.container).appendChild(this.element);
            if(this.tooltipHTML!="") {
                this.tooltip_able();
                if(OuterSetup.debugPrintStatements) console.log(this.id, "LB03 finished adding tooltip");
            }
            } catch(e) {
                throw new Error("Label Error: Tried to add the label " + this.id+" to the container "+this.container+" and failed.");
            }
            if(OuterSetup.debugPrintStatements) console.log("LB05 label",this.id, "finished creation no tooltip");
    }
    /**
 * Creates a DisplayElement based on an object with the parameters of DisplayElement. <u>Note</u>: JSDocs shows the function as having all of the parameters, but the function only has the one object parameter. The rest are parameters for the object, see the example for correct usage.
 * @param {object} obj The object to be constructed into a Res. The following are parameters <em>for the object and not for the function itself</em>:
 * @param {string} id The Label's id.
 * @param {string} container The id of the container to add the label to.
 * @param {string} innerHTML The label's HTML.
 * @param {string} css (optional) The label's CSS class, default is none.
 * @param {string} tooltipHTML (optional) The label's tooltip HTML, default is none.
 * @param {boolean} shown (optional) Whether or not the label should be shown on game load, default is true.
 * @param {string} icon (optional) An icon URL for the DisplayElement,  default is none.
 * @param {Res} resFormat (optional) A resource to display in the Label, default is none.
 * @param {string} resSuffix (optional) A string to add after the resource's amount, default is none.
 * @example let l = Label.O({
 * id:"label1", 
 * container:"main", 
 * innerHTML:"Hello, World!"
 * })
 */
    static O(obj) {
        let disp = new Label(obj.id, obj.container, obj.innerHTML, obj.css, obj.tooltipHTML, obj.shown);
        if(obj.css == null) {
            disp.css = "";
        }
        if(obj.tooltipHTML == null) {
            disp.tooltipHTML = "";
            disp.removeTooltip();
        }
        if(obj.shown == null) {
            disp.show();
        }
        if(obj.icon != null) {
            disp.icon(obj.icon);
        }
        if(obj.resFormat != null && resSuffix == null) {
            disp.resFormat(obj.resFormat)
        } else if( obj.resFormat != null && resSuffix == null) {
            disp.resFormat(obj.resFormat, obj.resSuffix);
        }
        return disp;
} 
}

class Button extends DisplayElement {
    actions;disabled;
    static varsTypes = {
        actions:"function|function[]",
        disabled:"boolean"
    }
    /**
     * Creates a button.
     * @param {string} id The button's id.
     * @param {string} container The container to add the button to.
     * @param {string} innerHTML The button's HTML.
     * @param {string} css The button's CSS class, default is none.
     * @param {function|function[]} actions A function or list of functions that will be called when the button is clicked.
     * @param {string} tooltipHTML The button tooltip's HTML, if none is provided, the button will not have a tooltip.
     * @param {boolean} shown Whether or not the button should be shown on game load, default is true.
     * @param {boolean} disabled Whether or not the button should be disabled on game load, default is false.
     * @extends DisplayElement
     */
    constructor(id, container, innerHTML, css="", actions, tooltipHTML = "", shown=true, disabled=false, exteriorCSS="") {
        
        super(id,container,innerHTML,css, "button",shown, tooltipHTML);
        
        this.actions= actions;
        this.disabled=disabled;
        this.tooltipHTML = tooltipHTML;
        this.id = id;
        this.innerHTML1 = innerHTML;
        this.css = css;
        this.tooltipHTML = tooltipHTML;
        this.shown = shown;
        this.disabled = disabled;

        if(shown) {
            this.construct(true, "called in constructor");
        }
        if(disabled) {
            this.disable();
        }
        Object.defineProperty(everything, id, {
            configurable:true,
            writable:true,
            enumerable:true,
            value:this,
        });
    }
    /**
     * Constructs a button. You should probably call show() instead of this.
     */
    construct(constructed, message="") {
       if(OuterSetup.debugPrintStatements) console.log("BT01",this.id, constructed, message);
        if(!constructed) {
            if(OuterSetup.debugPrintStatements) console.log("BT02 Button not constructed");
            new Button(this.id, this.container, this.innerHTML1, this.css, this.actions, this.tooltipHTML, this.shown, this.disabled);
            //return;
        }
        this.element.id=this.id;
        this.element.className="defaultInteriorButtonCSS "+this.css;
        let self = this;
        let actions2 = self.actions;
        this.element.onclick = function() {
            if(typeof actions2 == "function") {
                actions2();
            } else {
                for (let i = 0; i < actions2.length; i++) {
                    actions2[i]();

                }
            }
            visualBaseTick.tick();
        }
        this.element.innerHTML = this.innerHTML1;
        
        try {
        document.getElementById(this.container).appendChild(this.element);
        if (this.tooltipHTML!="") {
            this.tooltip_able();
        }
        } catch(error) {
            throw new Error("when trying to create the DisplayElement \""+this.id+"\", attempted to place the DisplayElement in a container that does not exist. "+"(actual error: "+error+")")
        }
        let elem = this.get;
        elem.addEventListener("mousedown", (e) => {
            elem.className="defaultInteriorButtonCSS "+this.css+" defaultMouseDown";
        });
        this.get.addEventListener("mouseup", (e) => {
            elem.className="defaultInteriorButtonCSS "+this.css+" defaultMouseUp";
        });
    }   
    /**
     * Disables the button.
     */
    disable() {
        if(OuterSetup.debugPrintStatements) console.log("BT03 disabling button '"+ this.id+"'");
        this.get.disabled = true;
    }
    /**
     * Enables the button.
     */
    enable() {
        if(OuterSetup.debugPrintStatements) console.log("BTO4 enabling button '"+ this.id+"'");
        this.get.disabled = false;
    }
    /**
 * Creates a Button based on an object with the parameters of Button.
 * @param {object} obj The object to be constructed into a Res
 * @ Parameters for the object:
 * @param {string} id The Button's id.
 * @param {string} container The id of the container to add the button to.
 * @param {string} innerHTML The button's HTML.
 * @param {function|function[]} actions A function or list of functions that will be called when the button is clicked.
 * @param {boolean} disabled Whether or not the button should be disabled on game load, default is false.
 * @param {string} css (optional) The button's CSS class, default is none.
 * @param {string} tooltipHTML (optional) The button's tooltip HTML, default is none.
 * @param {boolean} shown (optional) Whether or not the button should be shown on game load, default is true.
 * @param {string} icon (optional) An icon URL for the Button, default is none.
 * @param {Res} resFormat (optional) A resource to display in the Button, default is none.
 * @param {string} resSuffix (optional) A string to add after the resource's amount, default is none.
 * 
 */
    static O(obj) {
        let disp = new Button(obj.id, obj.container, obj.innerHTML, obj.css, obj.actions, obj.tooltipHTML, obj.shown, obj.disabled);
        if(obj.css == null) {
            disp.css = "";
        }
        if(obj.tooltipHTML == null) {
            disp.tooltipHTML = "";
            disp.removeTooltip();
        }
        if(obj.shown == null) {
            disp.show();
        }
        if(obj.icon != null) {
            disp.icon(obj.icon);
        }
        if(obj.resFormat != null && resSuffix == null) {
            disp.resFormat(obj.resFormat)
        } else if( obj.resFormat != null && resSuffix == null) {
            disp.resFormat(obj.resFormat, obj.resSuffix);
        }
        if(obj.disabled == null) {
            disp.disabled = false;
        }
        return disp;
    } 
}

class Upgrade extends Button {
    name; flavor; req; cost; effect; defaultPurchaseBehavior; currency; upgradeCSS; owned=false;
    static varsTypes = {
        name:"string",
        flavor:"string",
        req:"function",
        cost:"number|bigint|function",
        effect:"function",
        defaultPurchaseBehavior:"function",
        currency:"Res",
        upgradeCSS:"string",
        owned:"boolean"
    }
    /**
     * Creates an upgrade. You probably shouldn't call this directly, instead to create an upgrade call the u() method on an UpgradeGroup.
     * @param {string} name The upgrade's name.
     * @param {string} id The upgrade's id.
     * @param {string} container The container to add the upgrade to.
     * @param {string} flavor The upgrade's flavor text.
     * @param {function} req The requirement for the upgrade to be visible.
     * @param {function} effect The upgrade's effect when purchased.
     * @param {function} defaultPurchaseBehavior A set of default behaviors when the upgrade is purchased, defined in each UpgradeGroup.
     * @param {number|bigint|function} cost A number or a boolean function that dictates whether or not the upgrade can be purchased.
     * @param {string} upgradeCSS The upgrade's CSS class, default is none.
     * @param {Res} currency The currency to use for the upgrade's cost, if cost is a function this should be left null.
     * @private
     * @extends DisplayElement
     */
    constructor(name, id, container, flavor, req, effect, defaultPurchaseBehavior, cost, upgradeCSS="", currency=null) {
        let tooltipText = "";
        if (currency==null&&typeof(cost)=="function") {
            tooltipText = flavor;
        }else if(currency!=null&&typeof(cost)=="number") {
            tooltipText ="<b><u>"+name+"</u></b><br>"+cost+" "+currency.name+"<br>"+flavor;
        }  
        super(id, container, name, upgradeCSS, [function() {
            if (self.currency==null&&typeof(cost)=="function") {
                if(OuterSetup.debugPrintStatements) console.log("UD01 attempt function purchase on upgrade "+self.id);
                if(cost()) {
                    self.owned=true;
                    if(OuterSetup.debugPrintStatements) console.log("UD02 successful function purchase on upgrade "+self.id);
                    effect();
                    self.defaultPurchaseBehavior();
                }
            } else if(self.currency!=null&&typeof(cost)=="number") {
                if(OuterSetup.debugPrintStatements) console.log("UD03 attempt resource purchase on upgrade "+self.id);
                if(cost<=currency.a) {
                    self.owned=true;
                    if(OuterSetup.debugPrintStatements) console.log("UD04 successful resource purchase on upgrade "+self.id);
                    currency.add(-cost);
                    effect();
                    self.defaultPurchaseBehavior();
                }
            } else {
                throw new Error("Error when attempting to purchase upgrade '"+name+"', bad upgrade creation.\n If cost is some function, currency must not be included in the upgrade arguments. If cost is a number, currency must be a resource. Currency has to specifically be a resource, it cannot just be a variable.");
            }
        }], tooltipText, req(), false
        );
        let self = this;
        this.name=name;
        this.id=id;
        this.container=container;
        this.flavor=flavor;
        this.req=req;
        this.cost=cost;
        this.effect=effect;
        this.upgradeCSS = upgradeCSS;
        this.currency=currency;
        this.defaultPurchaseBehavior=defaultPurchaseBehavior;
        
        
        visualBaseTick.addOnTick([function() {
            if(self.req()&&!self.owned) {
                self.show();
            } else {
                self.hide();
            }
            if(self.currency!=null&&typeof(self.cost)=="number") {
                
                if (self.currency.a>=cost) {
                    self.enable();
                    self.tooltip = "<b><u>"+self.name+"</u></b><br><div style=\"color:green; display:inline;\">"+" "+self.cost+" "+self.currency.name+"</div><br>"+self.flavor;

                } else {
                    self.disable();
                    self.tooltip = "<b><u>"+self.name+"</u></b><br><div style=\"color:red; display:inline;\">"+" "+self.cost+" "+self.currency.name+"</div><br>"+self.flavor;
                }
        }
        }]);
        Object.defineProperty(everything, id, {
            configurable:true,
            writable:true,
            enumerable:true,
            value:this,
        });
    }
}
class UpgradeGroup extends Label {
    upgradeCSS;
    container;
    upgrades;
    upgradesData;
    defaultPurchaseBehavior;
    id;
    /**
     * Creates a new UpgradeGroup.
     * @param {string} id The UpgradeGroup's id.
     * @param {string} container The UpgradeGroup's container.
     * @param {string} containerCSS The UpgradeGroup's CSS class, default is none.
     * @param {string} upgradeCSS The UpgradeGroup's upgrade CSS class, default is none. Applied to all upgrades in the UpgradeGroup, but not the UpgradeGroup itself.
     * @param {function} defaultPurchaseBehavior A function that is called when an upgrade in the group is purchased. Note that defaultPurchaseBehavior is run in the Upgrade environment so  the 'this' is the upgrade object, which has all methods from Button.
     * @extends Label
     */
    constructor(id, container, containerCSS="", upgradeCSS="", defaultPurchaseBehavior = function() {
        this.disable();
    }) {
        super(id, container, "", containerCSS);  
        this.upgradeCSS = upgradeCSS;
        this.container = container;
        this.upgrades = {};
        this.upgradesData = [];
        this.defaultPurchaseBehavior = defaultPurchaseBehavior;
        this.id = id;
        Object.defineProperty(everything, id, {
            configurable:true,
            writable:true,
            enumerable:true,
            value:this,
        });
    }
    /**
     * Creates an upgrade in the UpgradeGroup.
     * @param {string} name The upgrade's name.
     * @param {string} id The upgrade's id.
     * @param {string} flavor The upgrade's flavor text.
     * @param {function} req The requirement for the upgrade to be visible.
     * @param {function} effect The upgrade's effect when purchased.
     * @param {number|function} cost A number or a boolean function that dictates whether or not the upgrade can be purchased.
     * @param {string} upgradeCSS The upgrade's CSS class, default is none.
     * @param {Res} currency The currency to use for the upgrade's cost, if cost is a function this should be left null.
     */
    u(name, id, flavor, req,  effect,cost,currency=null) {
        if(OuterSetup.debugPrintStatements) console.log("UG01 creating upgrade with container", this.id);
        let upgrade = new Upgrade(name,id, this.id,flavor,req,effect,this.defaultPurchaseBehavior, cost,this.upgradeCSS, currency);
        Object.defineProperty(this, id, {
            configurable:true,
            writable:true,
            enumerable:true,
            value:upgrade,
        });
    }
    /**
     * Gets an upgrade from the UpgradeGroup by its id.
     * @param {string} id The upgrade's id.
     * @returns {Upgrade} The upgrade with the given id.
     */
    uFromId(id) {
        if(OuterSetup.debugPrintStatements) console.log("UG02 fetching upgrade with id", id, "from group", this.id);
        try {
            return eval("this."+id);
        } catch(e) {
            console.error("Upgrade Error: Attempted and failed to find the upgrade \""+id+"\". Any TypeErrors preceding this error are likely caused by this.")
        }
        
    }
    /**
     * Sets the tooltip for an upgrade by its id.
     * @param {string} id The upgrade's id.
     * @param {string} html The HTML to place in the upgrade's tooltip.
     */
    uTooltip(id, html) {
        if(OuterSetup.debugPrintStatements) console.log("UG03 Usetting tooltip for upgrade with id", id, "in group", this.id);
        try {
        this.uFromId(id).tooltip = html
        } catch(error) {
            throw new Error("Tooltip Error: Tried to place a tooltip on the upgrade "+id+", which does not exist.");
        }
    }
    /**
     * Formats an upgrade's tooltip to be either name/price/flavor or name/effect/flavor. Use this if you want to change the tooltip of a name/price/flavor upgrade or add a tooltip format to a name/effect/flavor upgrade.
     * @param {string} id The id of the upgrade.
     * @param {string} flavor The upgrade's flavor text.
     * @param {string|null} effect Optional, A description of what needs to be done for the upgrade's cost function to be true to purchase the upgrade.
     */
    uFlavor(id,flavor, effect=null) {
        if(OuterSetup.debugPrintStatements) console.log("UG03 setting flavor for upgrade with id", id, "in group", this.id);
        let upgr = this.uFromId(id);
         try {
        this.uTooltip(id,"<b><u>"+upgr.name+"</u></b><br>"+" "+upgr.cost+" "+upgr.currency.name+"<br>"+flavor);
        } catch(error) {
            if(error.message.includes("name")) {
                if(effect==null) {
                    throw new Error("Upgrade Tooltip Error: Attempted to attach a name/price/flavor tooltip to the upgrade \""+id+"\" that does not have a numeric price. To set a name/effect/flavor tooltip, add some string outling your effect as the third parameter.")
                } else {
                    this.uTooltip(id,"<b><u>"+upgr.name+"</u></b><br>"+effect+"<br>"+upgr.flavor);
                }
            } else {
                throw error;
            }
        }
    }
    
}

class Collectable extends DisplayElement {
    req;effect;owned;
    constructor(id,container,innerHTML,css,elementType,shown,tooltipHTML,req,effect,owned) {
        super(id,container,innerHTML,css,elementType,shown,tooltipHTML);
        this.req=req;
        this.owned=owned;
    }
}
class CollectableGroup extends Label {
    collectableCSS;defaultEarnBehavior;
    constructor(id,container,containerCSS,collectableCSS,defaultEarnBehavior) {
        super(id,container,"",containerCSS);
        if(this.constructor == CollectableGroup) {
            throw new Error("Error on CollectableGroup " + id + ", CollectableGroup is an abstract and should not be instantiated on its own.");
        }
        this.collectableCSS = collectableCSS;
        this.defaultEarnBehavior = defaultEarnBehavior;
    }
    c(elementType, name,id,tooltip,req,effect) {
        let collectable = new Collectable(id,this.id,name,this.collectableCSS,elementType,req(),tooltip,req,effect,false);
        Object.defineProperty(this, id, {
            configurable:true,
            writable:true,
            enumerable:true,
            value:collectable,
        });
    }
}
/**
 * Creates a new UpgradeGroup.
 * @param {object} obj 
 * @returns The created UpgradeGroup
 * Object Parameters:
 * @param {string} id The UpgradeGroup's id.
 * @param {string} container The UpgradeGroup's container.
 * @param {string} containerCSS The UpgradeGroup's CSS class, default is none.
 * @param {string} upgradeCSS The UpgradeGroup's upgrade CSS class, default is none. Applied to all upgrades in the UpgradeGroup, but not the UpgradeGroup itself.
 * @param {function} defaultPurchaseBehavior A function that is called when an upgrade in the group is purchased. Note that defaultPurchaseBehavior is run in the Upgrad environment so  the 'this' is the upgrade object, which has all methods from Button.
 * @ You can also include another object with any number as its key(as long as that number is unique) to create upgrades inside the UpgradeGroup. Each of those have the following parameters:
 * @param {string} name The upgrade's name.
 * @param {string} id The upgrade's id.
 * @param {string} flavor The upgrade's flavor text.
 * @param {function} req The requirement for the upgrade to be visible.
 * @param {function} effect The upgrade's effect when purchased.
 * @param {number|function} cost A number or a boolean function that dictates whether or not the upgrade can be purchased.
 * @param {string} upgradeCSS (optional) The upgrade's CSS class, default is none.
 * @param {Res} currency (optional) The currency to use for the upgrade's cost, if cost is a function this shouldn't be included.
 */
function UpgradeGroupO(obj) {
    let disp = new UpgradeGroup(obj.id,obj.container,obj.containerCSS,obj.upgradeCSS, obj.defaultPurchaseBehavior);
    if(obj.containerCSS == null) {
        disp.containerCSS = "";
    }
    if(obj.upgradeCSS == null) {
        disp.upgradeCSS = "";
    }
    if(obj.defaultPurchaseBehavior == null) {
        disp.defaultPurchaseBehavior = function() {
            this.disable();
        }
    }
    Object.keys(obj).forEach(key => {
        if(key.match(/\d/)!=null&&key.match(/\D/)==null) {
            let u = obj[key];
            disp.u(u.name, u.id, u.flavor, u.req, u.effect, u.cost, u.currency);
        }
    });
    return disp;
}

class Building extends Button{
    name; flavor; req; effect; defaultPurchaseBehavior; buildingCostIncrease; cost; amount; a; max; currency;
    static varsTypes = {
        name:"string",
        flavor:"string",
        req:"function",
        cost:"number|bigint",
        amount:"number|bigint",
        a:"number|bigint",
        buildingCostIncrease:"number",
        effect:"function",
        defaultPurchaseBehavior:"function",
        currency:"Res",
    }
    /**
     * Creates a building. You probably shouldn't call this directly, instead to create a building call the b() method on a BuildingGroup.
     * @param {string} name The building's name.
     * @param {string} id The building's id.
     * @param {string} container The container to add the building to.
     * @param {string} flavor The building's flavor text.
     * @param {function} req The requirement for the building to be visible.
     * @param {function} effect The building's effect when purchased.
     * @param {function} defaultPurchaseBehavior A set of default behaviors when the building is purchased, defined in each buildingGroup.
     * @param {*} cost The cost of the building.
     * @param {number} amount The amount of the building.(also known as a)
     * @param {number} buildingCostIncrease Some number that the cost of the building is multiplied by every time the building is purchased.
     * @param {string} buildingCSS The building's CSS class, default is none.
     * @param {Res} currency The currency to use for the building's cost.
     * @private
     * @extends Label
     */
    constructor(name, id, container, flavor, req, effect, defaultPurchaseBehavior, cost, amount, buildingCostIncrease, buildingCSS, currency) {
        
        super(id,container.id,name+": "+amount, buildingCSS, [function() {
            if(currency.amount>=self.cost) {
                self.amount +=1;
                self.a=amount;
                currency.add(-self.cost);
                self.cost *= self.buildingCostIncrease;
                self.defaultPurchaseBehavior();
                self.effect();
            }
        }], "<b><u>"+name+"</u></b><br><div style=\"color:red; display:inline;\">"+" "+cost+" "+currency.name+"</div>"+flavor, req());
        let self = this;
        this.flavor=flavor;
        this.name=name;
        this.req=req;
        this.effect=effect;
        this.defaultPurchaseBehavior=defaultPurchaseBehavior;
        this.buildingCostIncrease=buildingCostIncrease;
        this.cost=cost;
        this.amount=amount;
        this.a=amount;
        this.max=amount;
        this.currency=currency;
        visualBaseTick.addOnTick([function() {
            if(self.req()) self.show();
            self.a = self.amount;
            if(self.a>self.max) self.max=self.a;
            //TODO make work with icons
            self.get.innerHTML = name+": "+self.amount;
            if(self.hasIcon) self.icon();
            if(OuterSetup.debugPrintStatements) console.log("BD01 attempting to purchase building with id", self.id);
                if (self.currency.amount>=self.cost) {
                    if(OuterSetup.debugPrintStatements) console.log("BD02 successfully purchased building with id", self.id);
                    self.enable();
                    self.tooltip = "<b><u>"+self.name+"</u></b><br><div style=\"color:green; display:inline;\">"+" "+self.cost+" "+self.currency.name+"</div><br>"+self.flavor;

                } else { 
                    self.disable();
                    self.tooltip = "<b><u>"+self.name+"</u></b><br><div style=\"color:red; display:inline;\">"+" "+self.cost+" "+self.currency.name+"</div><br>"+self.flavor;
                }
                self.get.innerHTML = name+": "+self.amount;
                if(self.hasIcon) self.icon();
        }]);
        Object.defineProperty(everything, id, {
            configurable:true,
            writable:true,
            enumerable:true,
            value:this,
        });
    }
}

class BuildingGroup extends Label {
    buildingCSS; buildingCostIncrease; defaultPurchaseBehavior;
    buildings = [];
    static varsTypes = {
        buildingCSS:"string",
        buildingCostIncrease:"number",
        defaultPurchaseBehavior:"function"
    }
    /**
     * Creates a new BuildingGroup.
     * @param {string} id The BuildingGroup's id.
     * @param {string} container The container to place the BuildingGroup into.
     * @param {string} containerCSS CSS for the BuildingGroup itself.
     * @param {string} buildingCSS CSS for the buildings in the BuildingGroup.
     * @param {number} buildingCostIncrease Some number that the cost of the building is multiplied by every time the building is purchased.
     * @param {function} defaultPurchaseBehavior Default behavior for every building in the group when purchased.
     * @extends Label
     */
    constructor(id, container, containerCSS, buildingCSS, buildingCostIncrease, defaultPurchaseBehavior) {
        super(id, container, "", containerCSS);
        this.buildingCSS = buildingCSS;
        this.buildingCostIncrease=buildingCostIncrease;
        this.defaultPurchaseBehavior = defaultPurchaseBehavior;
        Object.defineProperty(everything, id, {
            configurable:true,
            writable:true,
            enumerable:true,
            value:this,
        });
    }
        /**
     * Creates a building as a member of the BuildingGroup.
     * @param {string} name The building's name.
     * @param {string} id The building's id.
     * @param {string} flavor The building's flavor text.
     * @param {function} req The requirement for the building to be visible.
     * @param {function} effect The building's effect when purchased. Is executed after the building's amount and cost have been updated.
     * @param {*} initCost The starting cost of the building.
     * 
     * @param {Res} currency The currency to use for the building's cost.
     * @param {number} initAmount The initial amount of the building, default is 0.
     */

    b(name,id,flavor,req,effect,initCost,currency, initAmount=0) {
        if(OuterSetup.debugPrintStatements) console.log("BG01 creating building with id", id, "in group", this.id);
       let building = new Building(name,id, this.get, flavor, req, effect, this.defaultPurchaseBehavior, initCost, initAmount, this.buildingCostIncrease, this.buildingCSS, currency);
       Object.defineProperty(this, id, {
        value:building
       });
    }
    /**
     * Gets a building from the BuildingGroup by its id.
     * @param {string} id The building's id.
     * @returns {Building} The building with the given id.
     */
        bFromId(id) {
            if(OuterSetup.debugPrintStatements) console.log("BG02 finding building with id", id, "in group", this.id);
            try {
                return eval("this."+id);
            } catch(e) {
                console.error("Building Error: Attempted and failed to find the building \""+id+"\". Any TypeErrors preceding this error are likely caused by this.");
            }
    }
}
/**
 * Creates a new BuildingGroup.
 * 
 * @param {object} obj 
 * @ Object Parameters:
 * @param {string} id The BuildingGroup's id.
 * @param {string} container The container to place the BuildingGroup into.
 * @param {string} containerCSS CSS for the BuildingGroup itself.
 * @param {string} buildingCSS CSS for the buildings in the BuildingGroup.
 * @param {number} buildingCostIncrease Some number that the cost of the building is multiplied by every time the building is purchased.
 * @param {function} defaultPurchaseBehavior Default behavior for every building in the group when purchased.
 * @ You can also include another object with any number as its key(as long as that number is unique) to create buildings inside the BuildingGroup. Each of those have the following parameters:
 * @param {string} name The building's name.
 * @param {string} id The building's id.
 * @param {string} flavor The building's flavor text.
 * @param {function} req The requirement for the building to be visible.
 * @param {function} effect The building's effect when purchased. Is executed after the building's amount and cost have been updated.
 * @param {*} initCost The starting cost of the building.
 * @param {Res} currency The currency to use for the building's cost.
 * @param {number} initAmount The initial amount of the building, default is 0.
 * 
 */
function BuildingGroupO(obj) {
    let disp = new BuildingGroup(obj.id,obj.container,obj.containerCSS,obj.buildingCSS,obj.buildingCostIncrease, obj.defaultPurchaseBehavior);
    Object.keys(obj).forEach(key => {
        if(key.match(/\d/)!=null&&key.match(/\D/)==null) {
            let u = obj[key];
        disp.b(u.name, u.id, u.flavor, u.req, u.effect, u.cost, u.currency, u.initAmount? u.initAmount : 0);
        }
    });
    return disp;
}

class Toast {
    container; position; optionalCSS; positionCSS = ""; toastOffset = 0; numToasts = 0;
    static varsTypes = {
        container:"string",
        position:"string",
        optionalCSS:"string",
        positionCSS:"string",
        toastOffset:"number",
        numToasts:"number"
    }
    /**
     * Creates a new toast object.
     * @param {string} id The toast's id.
     * @param {string} container The toast's container.
     * @param {string} position The toast's position, either 'top' or 'bottom'.
     * @param {string} optionalCSS A CSS class to be applied to the toast.
     */
    constructor(id, container, position, optionalCSS="") {
        this.id=id;
        this.container = container;
        this.position = position;
        this.optionalCSS = optionalCSS;
        switch(this.position) {
            case "top":
                this.positionCSS = "toastCSSTop";
                break;
            case "bottom":
                this.positionCSS = "toastCSSBottom";
                break;
            default:
                throw new Error("Toast error: '" + this.position+"' is not a valid position, should be either 'top' or 'bottom'.");
        }
    }
    /**
     * Creates a toast. If there are multiple toasts on screen, the toasts will stack vertically.
     * @param {string} message The message to be displayed in the toast
     * @param {string|null} icon An image URL of an icon for the toast to display
     */
    t(message, icon=null) {
        if(OuterSetup.debugPrintStatements) console.log("TS01 creating toast");
        let toastCont = new Label(this.id+"_cont"+this.toastOffset, this.container, "", this.positionCSS);
        let toast = new Label(this.id+"_toast"+this.toastOffset,toastCont.id, message, this.optionalCSS);
        if(icon!=null) toast.icon(icon)
        toastCont.get.style = "animation: toastFadeIn 0.25s ease 0s 1 normal forwards;";
        if(this.position=="bottom") {
        toast.get.style="transform: translate(0px, -"+this.toastOffset+"px);";
        } else if(this.position=="top") {
            toast.get.style="transform: translate(0px, "+this.toastOffset+"px);";
        }
        toast.get.className = "toastCSS " + this.optionalCSS
        this.numToasts++;
        this.toastOffset+=toast.get.offsetHeight;
        let self  = this;
        let timer = setInterval(function() {
            toastCont.get.style="animation: toastFadeOut 0.25s ease 0s 1 normal forwards;";
            
            let wait = setInterval(function() {
                self.numToasts--;
                if(self.numToasts==0) self.toastOffset=0;
                toast.hide();
                clearInterval(wait);
            }, 250);
            clearInterval(timer);
        }, 10000)
    }
}
/**
 * Creates a new Toast.
 * @param {object} obj
 * @ Object Parameters:
 * @param {string} id The toast's id.
 * @param {string} container The toast's container.
 * @param {string} position The toast's position, either 'top' or 'bottom'.
 * @param {string} optionalCSS (optional) A CSS class to be applied to the toast.
 */
function ToastO(obj) {
    let disp = new Toast(obj.id,obj.container,obj.position);
    if(obj.optionalCSS!=null) disp.optionalCSS = obj.optionalCSS;
}


class Achievement extends Label{
    name;req;flavor;owned;toast;
    static varsTypes = {
        name:"string",
        req:"function",
        flavor:"string",
        owned:"boolean",
        toast:"Toast"
    }
    /**
     * Creates a new Achievement. You probably shouldn't call this yourself, instead to create an achievement call the a() method on an AchievementGroup.
     * @param {string} name 
     * @param {string} id 
     * @param {string} flavor 
     * @param {function|null} req 
     * @param {string} container 
     * @param {string} css 
     * @param {boolean} owned 
     * @param {string|null} icon 
     * @param {Toast} toast 
     * @private
     * @extends Label
     */
    constructor(name,id,flavor,req=null,container,css, owned=false,icon=null, toast) {
        
        super(id,container,name, css, 
            `
            <b><u>${name}</u></b><br>
            ${flavor}
            `
            , req());
        this.name=name;
        this.req=req;
        this.flavor=flavor;
        this.owned=owned;
        this.toast=toast;
        this.iconURL=icon;
        let self = this;
        updateBaseTick.addOnTick([function() {
            if(req()) {
                self.grant();

            }
        }]);
        Object.defineProperty(everything, id, {
            configurable:true,
            writable:true,
            enumerable:true,
            value:this,
        });
    }
    grant() {
        if(OuterSetup.debugPrintStatements) console.log("AC01 Granting achievement "+this.id);
        if(this.owned==false) {
            this.owned=true;
            if(this.iconURL==null) {
                this.toast.t("Achievement get: "+this.name+"<br>"+this.flavor);
            } else {
                this.toast.t("Achievement get: "+this.name+"<br>"+this.flavor, this.iconURL);
                this.icon();
            }
        }
    }
}

class AchievementGroup extends Label{
    containerCSS;achievementCSS;toastCSS;achievementList=[];toast=null;
    static achievementExists = false;
    static varsTypes = {
        containerCSS:"string",
        achievementCSS:"string",
        toastCSS:"string",
        achievementList:"Achievement[]",
        toast:"Toast|null"
    }
    /**
     * Creates a new AchievementGroup.
     * @param {string} id The AchievementGroup's ID
     * @param {string} container The container where achievements will appear after you purchase them, defaults to the achievements box in the InfoMenu.
     * @param {string|null} toastContainer The container that the achievement's on earn toast will be in, defaults to null if you wouldn't like a toast for the AchievementGroup.
     * @param {string} containerCSS The CSS class for the AchievementGroup, defaults to none
     * @param {string} achievementCSS The CSS class for all achievements within the AchievementGroup, defaults to the default CSS for buttons
     * @param {string} toastCSS The CSS class for the AchievementGroup's toast, defaults to none
     * @param {string} toastPosition The position for the achievement toasts, defaults to bottom
     * @extends Label
     */
    constructor(id,container="infoAchievementBox",toastContainer=null, containerCSS="",achievementCSS="defaultButtonCSS",toastCSS="",toastPosition="bottom") {
        try {
        super(id,container,"", containerCSS);
        } catch(e) {
            super(id,container,"",containerCSS, "", false);
            let self = this;
            
            visualBaseTick.addOnTick([function() {
                try {
                    self.show();
                    self.achievementList.forEach(element => {
                        if(element.owned) element.show();
                        if(OuterSetup.debugPrintStatements) console.log("AG01 attempting to show achievement "+element.name);
                    });
                    if(OuterSetup.debugPrintStatements) console.log("AG01 showing achievements");
                } catch(e) {
                }
            }])
        }
        this.achievementExists=true;
        this.id=id;
        this.container=container;
        this.containerCSS=containerCSS
        this.achievementCSS=achievementCSS;
        this.toastCSS=toastCSS;
        if(toastContainer!=null) {
            this.toast = new Toast(id+"_toast", toastContainer, toastPosition, toastCSS);
        }
    }
    /**
     * Creates a new Achievement within the AchievementGroup.
     * @param {string} name The achievement's name.
     * @param {string} id The achievement's id.
     * @param {string} flavor The achievement's flavor text.
     * @param {function|null} req A requirement for the achievement to be unlocked, default is none wherein the achievement cannot be earned unless granted using aFromID(id).grant().
     * @param {boolean} owned Whether or not the achievement should be owned on game load, default is false.
     * @param {string|null} icon The icon for the achievement, default is none.
     */
    a(name,id,flavor,req=null,owned=false,icon=null) {
        let achi = new Achievement(name,id,flavor,req,this.id,this.achievementCSS,owned,icon,this.toast);
        this.achievementList.push(achi);
    }
    /**
     * 
     * @param {string} id 
     */
    aFromId(id) {
        this.achievementList.forEach(element => {
            if(element.id==id) return element;
        });
    }
}
/**
 * Creates a new AchievementGroup.
 * @param {object} obj 
 * @ Parameters for the object:
 * @param {string} id The AchievementGroup's ID
 * @param {string} container (optional) The container where achievements will appear after you purchase them, defaults to the achievements box in the InfoMenu.
 * @param {string|null} toastContainer (optional) The container that the achievement's on earn toast will be in, defaults to null if you wouldn't like a toast for the AchievementGroup.
 * @param {string} containerCSS (optional) The CSS class for the AchievementGroup, defaults to none
 * @param {string} achievementCSS (optional) The CSS class for all achievements within the AchievementGroup, defaults to the default CSS for buttons
 * @param {string} toastCSS (optional) The CSS class for the AchievementGroup's toast, defaults to none
 * @param {string} toastPosition (optional) The position for the achievement toasts, defaults to bottom
 * @ You can also include another object with any number as its key(as long as that number is unique) to create achievements inside the AchievementGroup. Each of those have the following parameters:
 * 
 */
function AchievementGroupO(obj) {
    let disp = new AchievementGroup(obj.id,obj.container ? obj.container:"infoAchievementBox", obj.toastContainer, obj.containerCSS?obj.containerCSS:"", obj.achievementCSS?obj.achievementCSS:"", obj.toastCSS?obj.toastCSS:"",obj.toastPosition?obj.toastPosition:"bottom");
    return disp;
}

class InfoMenu {
    static varsTypes={
    };
    constructor(container, infoText, useAchievementMenu=true, pauseOnOpen=true, optionalCSS="") {
        let containerElement = document.getElementById(container);
        containerElement.style="z-index:10000;";
        let bigBackground = new Button("infoBigBackground", container, "", "infoBigBackground",function() {
            infoGroup.hide();
            unpause();
        }, "", false);
        let infoBackground = new Label("infoBackground", container, "", "infoBackground", "", false);
        let achievementBackground = new Label("infoAchievementBox", container, "Achievements", "achievementBackground", "", false);
        let infoTextElement = new Label("infoText", "infoBackground", infoText + "<br><br>This game was created using <b>ScrambledIdle</b>. Click <a href=\"https://example.com\" target=\"_blank\" style=\"color:lightblue;\">here</a> to check it out!", "infoText", optionalCSS, false);
        let infoCloseButton = new Button("infoCloseButtion", "infoBackground", "x", "infoClose", function() {
            infoGroup.hide();
            unpause();
        }, "", false);
        let saveClearButton = new Button("saveClearButton", "infoBackground", "Wipe save", "", function() {
            SaveManager.clear();
            location.reload();
        }, "Wipe the current save and reload the page. This cannot be undone!", false);
        let saveButton = new Button("saveButton", "infoBackground", "Save game", "", function() {
            SaveManager.save();
        }, "Save the game.", false);
        let infoGroup = new DisplayGroup([infoBackground, bigBackground, infoCloseButton, saveClearButton, saveButton, infoTextElement]);
        if(useAchievementMenu) {
            infoGroup.add(achievementBackground);
        }
        let showInfo = new Button("showInfo",container, "i", "showInfo", function() {
            if(OuterSetup.debugPrintStatements) console.log("IM01 showing info menu");
            infoGroup.show();
            if(pauseOnOpen) pause();
        });
        infoGroup.elements.forEach(element => {
            SaveManager.doNotSaveList.push(element.id);
        })
    }
}

class TextArea extends DisplayElement {
    static varsTypes={
        placeholder:"string"
    };
    placeholder;
    /**
     * Creates a new TextArea.
     * @param {string} id The TextArea's id
     * @param {*} container 
     * @param {*} css 
     * @param {*} placeholder 
     * @param {*} tooltipHTML 
     * @param {*} shown 
     * @param {*} disabled 
     * @extends DisplayElement
     */
    constructor(id, container, css="", placeholder="", tooltipHTML="",shown=true, disabled=false) {
        super(id, container, "", css, "textarea", shown, tooltipHTML);
        this.placeholder=placeholder;
        if(shown) this.construct(false, "called in constructor");
        if(disabled) this.disable();
        if(tooltipHTML!="") this.tooltip_able();
        
    }
    construct(constructed, message="") {
        this.element.innerHTML = this.innerHTML1
        this.element.id=this.id;
        this.element.placeholder = this.placeholder;
        document.getElementById(this.container).append(this.element);
        this.get.classList = this.css;
    }
    /**
     * @returns The text in the TextArea
     */
    get text() {
        return this.get.value;
    }
    /**
     * Disables the TextArea.
     */
    disable() {
        this.get.disabled=true;
    }
    /**
     * Enables the TextArea.
     */
    enable() {
        this.get.disabled=false;
    }
}
function TextAreaO(obj) {

}

class Terminal extends Label {
    static varsTypes={
        input:"TextArea",
        dispbox:"Label",
        hasInput:"boolean",
        onInput:"function"
    };
    input;
    dispbox;
    hasInput;
    msgCount = 0;
    /**
     * 
     */
    cmd;
    /**
     * 
     */
    metaCommand="$DEFAULT";
    /**
     * 
     */
    animMessageDelay = 20;
    onInput;
    onEnter;
    
    /**
     * Constructs a Terminal.
     * @param {string} id 
     * @param {*} container 
     * @param {*} css 
     * @param {*} hasInput 
     * @param {*} outputCSS 
     * @param {*} tooltipHTML 
     * @param {*} onEnter 
     * @param {*} shown 
     * @extends Label
     */
    constructor(id, container, css, hasInput=false, outputCSS="", tooltipHTML="", onEnter=function() {}, shown=true) {
        super(id, container, "", css, tooltipHTML, shown);
        this.hasInput = hasInput;
        this.onEnter = onEnter
        this.dispbox = new Label(id+"_dispbox", id, `<span id=${id}_span></span>`, "defaultTerminalOutputCSS "+outputCSS);
        if(hasInput) {
            this.input = new TextArea(id+"_input", id, "defaultInputCSS "+css, ">");
            let self = this;
            document.addEventListener("keypress", function(event) {
                if(document.activeElement == self.input.get && event.key=="Enter") {
                    self.log("> "+self.input.text);
                    self.cmd = self.input.text;
                    onEnter();
                    self.input.get.value="";
                }
                
            });
            document.addEventListener("keyup", function(event) {
                if(event.key=="Enter") self.input.get.value="";
            })
        }
    }
    /**
     * 
     * @param {string} msg 
     */
    logS(msg) {
        this.msgCount++;
        let msgSpan = document.createElement("span");
        msgSpan.id = `${this.id}_msg_${this.msgCount}`
        msgSpan.innerHTML = msg;
        msgSpan.childNodes.forEach((node)=>{
            if(node.nodeName == "DIV") { 
                node.style.display = "inherit";
            }
        });
        msgSpan.classList.add("defaultTerminalMessageCSS")
        document.getElementById(this.id+"_span").appendChild(msgSpan);
    }
    log(msg) {
        this.logS(msg+"<br>");
    }
    /**
     * 
     * @todo Unfinished, not currently working
     * @param {string} msg 
     */
    logAnim(msg) {
        this.logS("");
        let msgSpan = document.getElementById(`${this.id}_msg_${this.msgCount}`);
        let msgElement = document.createElement("div");
        msgElement.innerHTML = msg;
        console.log(msgElement.innerHTML);
        let i = 0;
        let lineDelay = 0;
        let msgHasChildren = false;
       
        msgElement.childNodes.forEach((node)=>{
            msgHasChildren = true;
            let nodeMsg = node.innerHTML;
            node.innerHTML = "";
            node.style.display = "inherit";
            msgSpan.appendChild(node);
            console.log(node.childNodes);
            setTimeout(()=>{
                let i = 0;
                let animInt = setInterval(()=>{
                    
                }, this.animMessageDelay);
            }, lineDelay*this.animMessageDelay);
        });
        if(!msgHasChildren) {
            let msgInt = setInterval(()=>{
                msgSpan.innerHTML += msg[i];
                if(i == msg.length-1) clearInterval(msgInt);
                i++;
            },this.animMessageDelay);
        }
        return lineDelay;
    }
    /**
     * 
     * @returns The text in the input TextArea
     */
    pollInput() {
        if(this.hasInput) {
            this.log("> "+this.input.text);
                    this.cmd = this.input.text;
                    this.onEnter();
                    this.input.get.value="";
                    return this.cmd;
        }
    }
    /**
     * 
     */
    clear() {
        this.dispbox.innerHTML = `<span id=${this.id}_span></span>`;
    }
    /**
     * @private
     * Do not use this method, it does nothing on a Terminal.
     */
    resFormat(res) {

    }
}


export {OuterSetup,TypeChecker,SaveManager,DisplayElement,DisplayGroup,Res,ResO,Tick,TickO,Label,Button,Upgrade,UpgradeGroup,UpgradeGroupO,Building,BuildingGroup,BuildingGroupO,Toast,ToastO,Achievement,AchievementGroup,AchievementGroupO,InfoMenu, TextArea, TextAreaO, Terminal, visualBaseTick, updateBaseTick};

visualBaseTick.start(100);
updateBaseTick.start(100);
fastBaseTick.start(30);
