import {OuterSetup,TypeChecker,SaveManager,DisplayElement,DisplayGroup, Res,ResO,Tick,TickO,Label,LabelO,Button,ButtonO,Upgrade,UpgradeGroup,UpgradeGroupO,Building,BuildingGroup,BuildingGroupO,Toast,ToastO,Achievement,AchievementGroup,AchievementGroupO,InfoMenu, TextArea, TextAreaO, Terminal} from "./back/back.js";
export {Game};

/* Setup Constants */ {

    /**
     * If true, prints out an absolute torrent of print statements, almost acting like a live stack trace of everything occuring in your game. As there will probably be thousands of print statements per few seconds, this is not recommended except in cases of debugging where some of that information is necessary.
     */
    OuterSetup.debugPrintStatements = false

    /**
     * If true, the CSS will be defined in this file rather than in the separate default.css and custom.css files. If you're hosting your game on the RubiksIdle website, this needs to be set to true and your CSS has to be in this file, although it is recommended that you have your CSS in the separate files otherwise.
     */
    OuterSetup.useGameJsCSS = false
    /**
     * If true, the type checker will run on every game element to ensure type safety and help with debugging.
     */
    TypeChecker.doTypeChecking = true

    /**
     * If true, the type checker will run periodically to ensure type protection for objects. Doing this may be bad for performance and is not recommended for release versions of your game.
     */
    TypeChecker.periodicTypeChecks = false

    /**
     * If true, only checks the first element of every array for being the wrong type. Helps with performance if you have a lot of objects with arrays.
     */
    TypeChecker.quickArrayCheck=false

    /**
     * A list of IDs for DisplayElements that will NOT have their properties saved or loaded. Add as much as you can to keep saves from being bricked whenever you make a change!
     */
    SaveManager.doNotSaveList = []

    /**
     * A boolean to set whether or not to print a save message to the console.
     */
    SaveManager.consoleSaveMessage = false

}
class Game {
GameElements() {
    let lineCount = 0;
    function cmdPrint() {
        term.log(`>@ line ${lineCount}: ${term.cmd.substring(6)}`);
    }
    function cmdHelp() {
        helpGroup.show();
        term.log("help:")
    }
    function cmdStats() {
        term.log("| ==> cpu: IGM Automated Abacus v2<br>| ==> memory: 8 bytes<br>| ==> program size: 16 bytes<br>| ==> supported languages: ARI");
        term.log("> type 'info {item}' for more detailed information")
    }
    function cmdQueue() {
        term.log("> 1: <br>| ==> task: Run a task<br>| ==> description: This equipment cost a lot of money and Scrambled Instruments has only a one-program warranty on their devices. We'll just run a simple test program in ARI adding two numbers.<br>| ==> inputs:none<br>| ==> outputs: one number<br>| ==> program size: 2 bytes(8 bit instruction width)<br>| ==> est. execution time: 1 cycles(at 1 cycle per second)<br>| ==> overtime: none");
    }
    let term = new Terminal("term1", "main", "term1", true, "out1", "", function() {
        lineCount++;
        let cmd = term.cmd;


        if(cmd.startsWith("print")) {
            cmdPrint();
        } else if(cmd.startsWith("help")) {
            cmdHelp();
        } else if(cmd.startsWith("stats")) {
            cmdStats();
        } else if(cmd.startsWith("queue")) {
            cmdQueue();
        } else if(cmd.startsWith("skip")) {
            
        }
        else {
            term.log(`> @ line ${lineCount}: ERR: unknown command '${cmd.split(" ")[0]}'`);
        }
    });
    let del = 0;
    let logDel = (msg, delMS) => {
        del +=delMS;
        let int = setTimeout(function() {
            term.log(msg);
        }, del);
    }

    logDel("TASKATRON by SCRAMBLED INSTRUMENTS, MODEL NO. 22898422. RESEARCH USE ONLY. <br>INSERT INSTALL MEDIUM.", 1000);
    logDel(".", 3000);
    logDel(".", 1000);
    logDel(".", 500);

    logDel("MEDIUM FOUND.", 1000);

    logDel("&#60;STARTUP&#62;", 1000);
    logDel("loading image 'TasQRUNTIME.bxlr'", 200);
    logDel("", 1000);
    let loadTime = 30+Math.floor(20*Math.random());
    for (let i = 0; i < loadTime+1; i++) {

        logDel(`${i} bytes of ${loadTime} loaded`, Math.floor(Math.random()*100));
    }
    logDel("",0);
    logDel("Load finished. Welcome to Task Queue! You have 1 pending task(s).<br>> type or click 'help' for help or 'queue' to view your queue.", 1000);
    setTimeout(() => {help.show();}, del);
    setTimeout(() => {queue.show();}, del);

    let buttonsCont = new Label("bC", "term1", "", "buttonsCont");

    let help = new Button("help", "bC", "help", "cmdButtons", () => {
        term.log("> help");
        cmdHelp();
    }, "", false);
    let stats = new Button("stats", "bC", "stats", "cmdButtons", () => {
        term.log("> stats");
        cmdStats();
    }, "", false);
    let queue = new Button("queue", "bC", "queue", "cmdButtons", () => {
        term.log("> queue");
        cmdQueue();
    }, "", false);

    let helpGroup = new DisplayGroup([help, stats]);

    let researchFund = new Res("Research Funds($)", "resFunds", -8188, true);

    let resFundsDisp = new Label("researchDisp", "main", "", "researchDisp", "Your money that you have for research. The TASKATRON cost an absolute fortune so you had to take out some loans.");
    resFundsDisp.resFormat(researchFund);


    
    
}
}
