import {OuterSetup,TypeChecker,SaveManager,DisplayElement,DisplayGroup, Res,ResO,Tick,TickO,Label,LabelO,Button,ButtonO,Upgrade,UpgradeGroup,UpgradeGroupO,Building,BuildingGroup,BuildingGroupO,Toast,ToastO,Achievement,AchievementGroup,AchievementGroupO,InfoMenu, TextArea, TextAreaO, Terminal} from "./back/back.js";
export {GameElements};

/* Setup Constants */ {

    /**
     * If true, prints out an absolute torrent of print statements, almost acting like a live stack trace of everything occuring in your game. As there will probably be thousands of print statements per few seconds, this is not recommended except in cases of debugging where some of that information is necessary.
     */
    OuterSetup.debugPrintStatements = true

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
function GameElements() {
    let lineCount = 0;
    function cmdPrint() {
        term.log(`>@ line ${lineCount}: ${term.cmd.substring(6)}`);
    }
    function cmdHelp() {
        helpGroup.show();
        term.log("help:")
    }``
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
            if(term.metaCommand=="$DEFAULT") {
                term.metaCommand="$PRE_SETUP";
                playerName = term.cmd;
                term.log(`PRIOR AUTHORIZATION FOR USER '${playerName}' FOUND.(user level: operator)`);
                setTimeout(() =>{term.log(`
                <br>┏======================
                <br>| USER:${playerName}
                <br>| POSITION: TASKATRON Specialist
                <br>| BALANCE ($): 0
                <br>┕======================
                `)}, 300);
                del=300;
                logDel("PRESS ENTER TO PROCEED SETUP...", 100);
            }
            if(term.metaCommand=="$PRE_SETUP"&&cmd=="") {
                term.log("CPU GIVEN BUT NOT INSTALLED. PLEASE INSTALL CPU AND PRESS ENTER.");
                installCPU.show();
                
            }
        }
    });
    let del = 0;
    let logDel = (msg, delMS) => {
        del +=delMS;
        let int = setTimeout(function() {
            term.log(msg);
        }, del);
    }
    let logTimeout = (msg, delMS) => {
        setTimeout(() => {
            term.log(msg)
        }, delMS);
    }
    let logDelAction = (msg, delMS, func) => {
        del +=delMS;
        let int = setTimeout(function() {
            term.log(msg);
            func();
        }, del);
    }

    let buttonsCont = new Label("bC", "term1", "", "buttonsCont");

    let help = new Button("help", "bC", "help", "cmdButtons", () => {
        term.log("> ts help");
        cmdHelp();
    }, "", false);
    let stats = new Button("stats", "bC", "stats", "cmdButtons", () => {
        term.log("> ts stats");
        cmdStats();
    }, "", false);
    let queue = new Button("queue", "bC", "queue", "cmdButtons", () => {
        term.log("> ts queue");
        cmdQueue();
    }, "", false);
    let installCPU = new Button("install", "bC", "install --cpu", "cmdButtons", () => {
        term.log(term.metaCommand);
        if(term.metaCommand=="$PRE_SETUP") {
            term.log("> ts install --cpu");
            logDelAction(`
            <br>┏====| Inventory |=====
            <br>| 01:
            <br>| ┏ name: IGM Automated Abacus v2
            <br>| | slot: sixpin
            <br>| | memory: 8 bytes
            <br>| | program size: 16 bytes
            <br>| | maximum clock speed: none
            <br>| ┕supported languages: ARI
            <br>┕======================
            
            `, 100, () => {
                installCPU.innerHTML = "install --cpu 01";
                term.metaCommand="$PRE_INSTALL";
            });
    } else if(term.metaCommand=="$PRE_INSTALL") {
        currentCPU.show();
        currentCPU.icon("igm-cpu-1.png", "cpuIcon");
        term.log("> ts install --cpu 01");
        logTimeout("CPU sucessfully installed. Further information availible in the CPU Slot Monitor.", 100);
        
    }
    }, "", false);

    let helpGroup = new DisplayGroup([help, stats]);

    let researchFund = new Res("Research Funds($)", "resFunds", -8188, true);

    let resFundsDisp = new Label("researchDisp", "main", "", "researchDisp", "Your money that you have for research. The TASKATRON cost an absolute fortune so you had to take out some loans.");
    resFundsDisp.resFormat(researchFund);

    let cpuSlot1 = new Label("cpuSlot1","main","");
    cpuSlot1.icon(`circuit-inset-test4.png`, "circuitImage");
    let currentCPU = new Label("currentCPU", "cpuSlot1", "","cpuSlot1",`
    <b>IGM Automated Abacus v2</b>
    <br>slot: sixpin
    <br>memory: 8 bytes
    <br>program size: 16 bytes
    <br>maximum clock speed: none
    <br>supported languages: ARI
    <br>-----<br>
    <i>"This once top-of-the-line number cruncher has now been largely obsoleted by manufacturers with more ambition than simply shoving a very small abacus in a plasic housing. Its iconic six-pin design, however, has easily become the standard for the lowest-end of CPUs."</i>

    `, false);
    //currentCPU.icon("igm-cpu-1.png", "cpuIcon");
    
    // logDel(`
    // <br>&nbsp;&nbsp;^
    // <br>&nbsp;/&nbsp;\\
    // <br>/&nbsp;&nbsp;&nbsp;\\
    // <br>|\\&nbsp;&nbsp;|
    // <br>|&nbsp;\\&nbsp;|
    // <br>|&nbsp;&nbsp;\\|
    // <br>\\&nbsp;&nbsp;&nbsp;/
    // <br>&nbsp;\\&nbsp;/
    // <br>&nbsp;&nbsp;V
    // `,1000);
    logDel("TASKATRON by SCRAMBLED INSTRUMENTS, MODEL NO. 22898422. RESEARCH USE ONLY.", 1200);
    logDel("ERROR: USER NOT AUTHORIZED. PLEASE ENTER NAME:", 1000);
    
    let playerName = "";

    
    // while(!nameEntered) {
    //     if(term.pollInput()!="") {
    //         nameEntered = true;
    //         term.log("NAME: "+term.cmd);
    //     }
    // }
    
    

    


    
    
}
