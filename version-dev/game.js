import {OuterSetup,TypeChecker,SaveManager,DisplayElement,Res,ResO,Tick,TickO,Label,Button,ButtonO,Upgrade,UpgradeGroup,UpgradeGroupO,Building,BuildingGroup,BuildingGroupO,Toast,ToastO,Achievement,AchievementGroup,AchievementGroupO,InfoMenu, TextArea, TextAreaO, Terminal, visualBaseTick, updateBaseTick, DisplayGroup} from "./back/back.js";
export {Game};

/* Setup Constants */ {

    /**
     * If true, prints out an absolute torrent of print statements, almost acting like a live stack trace of everything occuring in your game. As there will probably be thousands of print statements per few seconds, this is not recommended except in cases of debugging where some of that information is necessary.
     */
    OuterSetup.debugPrintStatements = false

    /**
     * If true, the Game class will be accessible as G in the global scope, meaning that (among other things) you can access some variables using the dev console. For example, to access the variable 'foo' from the dev console, this would be true, and after foo's declaration you would include 'this.foo = foo'.
     */
    OuterSetup.gameElementsGlobalScope = true

    /**
     * If true, the type checker will run on every game element to ensure type safety and help with debugging(or be needlessly annoying depending on your perspecive on static typing).
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
     * A list of IDs for DisplayElements that will NOT have their properties saved or loaded. Add as much as you can to keep saves from causing problems whenever you make a change!
     */
    SaveManager.doNotSaveList = ["visualBaseTick", "updateBaseTick", "fastBaseTick"];

    /**
     * A boolean to set whether or not to print a save message to the console.
     */
    SaveManager.consoleSaveMessage = true

}
class Game {
    test;
GameElements() {
    //Code for your game here!
    let test = new Label("test", "main", "testing label");
    this.test = test;
}
}