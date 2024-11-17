import {OuterSetup,TypeChecker,SaveManager,DisplayElement,Res,ResO,Tick,TickO,Label,LabelO,Button,ButtonO,Upgrade,UpgradeGroup,UpgradeGroupO,Building,BuildingGroup,BuildingGroupO,Toast,ToastO,Achievement,AchievementGroup,AchievementGroupO,InfoMenu, TextArea, TextAreaO, Terminal, visualBaseTick, updateBaseTick} from "./back/back.js";
export {Game};

/* Setup Constants */ {

    /**
     * If true, prints out an absolute torrent of print statements, almost acting like a live stack trace of everything occuring in your game. As there will probably be thousands of print statements per few seconds, this is not recommended except in cases of debugging where some of that information is necessary.
     */
    OuterSetup.debugPrintStatements = false

    /**
     * If true, the Game class will be accessible as G in the global scope, meaning that (among other things) you can access some variables using the dev console. For example, to access the variable 'foo' from the dev console, this would be true, and after foo's declaration you would include 'this.foo = foo'.
     */
    OuterSetup.gameClassGlobalScope = true

    /**
     * If true, the CSS will be defined in this file rather than in the separate default.css and custom.css files. If you're hosting your game on the RubiksIdle website, this needs to be set to true and your CSS has to be in this file, although it is recommended that you have your CSS in the separate files otherwise.
     */
    OuterSetup.useGameJsCSS = false
    OuterSetup.pastebinDataSource = true
    OuterSetup.showPasteExpiryWarning = true
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
     * A list of IDs for DisplayElements that will NOT have their properties saved or loaded. Add as much as you can to keep saves from being bricked whenever you make a change!
     */
    SaveManager.doNotSaveList = ["visualBaseTick", "updateBaseTick", "fastBaseTick"];

    /**
     * A boolean to set whether or not to print a save message to the console.
     */
    SaveManager.consoleSaveMessage = true

}
class Game {
GameElements() {
    let info = new InfoMenu("infoContainer", `
        You're playing X Squared by ScrambledRubiks, a minimalist idle game about research and math.<br>
        <br>
        Legacy Updates(For IGM version):<br>
          (01/24) Patch #1.1.1
          <br>&emsp;- As suggested, the endgame paper now disappears on purchase, yielding an upgrade
          <br>&emsp;- Previous version's endgame paper is now inaccessable, as it should have been in the previous update<br>
          (01/23) Patch #1.1
          <br>&emsp;- Balancing changes, including significantly buffing Paper Maker
          <br>&emsp;- 2 new papers, 1 new calculator, 1 new optimization, 1 new computing,
          <br>&emsp;- Added dark mode
          <br>&emsp;- Visual modifications to Paper Maker
          <br>&emsp;- Updated licensing information/added credits
          <br>&emsp;- Fixed a bug with an equation display value not being correct
          <br>&emsp;- Initial Outreach percentage raised to 20%, this will not re-update old saves. To update your save, use the inspect tool, go to the console and paste this into the console: G.things[36].amount+=10
          <br>&emsp;- Fixed a bug where the endgame paper doesn't remove research funds(thank you to Mr.Watermelon and Pulsar for pointing this out to me!)<br>
          (10/23) Patch #1.0.1
          <br>&emsp;- Fixed bug with Paper Maker upgrades displaying first thing when the game is started, disappearing on reload
          <br>&emsp;- Rebalanced Stat Pun facility to grow even more expensive over time
          <br>&emsp;- Stat pun facility now visually caps at level 59
          <br>&emsp;- Equation Values Display now is in the correct order<br>
          (08/23) Patch #1.0
          <br>&emsp;- Made x^3 12 times more expensive
          <br>&emsp;- 1 new Networking, 1 Outreach, 1 Loyalty, 1 new paper, 1 new calculator
          <br>&emsp;- Minor phrasing tweaks on certain things
          <br>&emsp;- Randomness in PaperMaker's production now scales with your investor count
          <br>&emsp;- Stat Pun facility now shows singular 'minute' when you have 1 minute left until a new paper
          <br>&emsp;- Visual indicator when you hit level 60 for the Center for Statistics Pun Recovery
          <br>&emsp;- Fixed bug with x^3 not displaying correctly in Equation Display
          <br>
          (08/23) Patch #0.8.1
          <br>&emsp;- Added endgame paper for 0.8 which I forgot<br>
          (08/23) Patch #0.8
          <br>&emsp;- Balancing changes
          <br>&emsp;- Added x^3 term, balancing very prone to change in the future
          <br>&emsp;- Added 1 new paper, 1 new misc., 1 new calculator, 1 new networking
          <br>&emsp;- Paper 11 now shows up at the correct point
          <br>&emsp;- Values Display was added in 0.6 but I forgot to put it in the update log until now
          <br>&emsp;- Added 500, 5,000, 50,000, 500,000 in Values Display(hover over your equation!)
          <br>&emsp;- Values Display no longer displays equation amounts less than your optimization level
          <br>&emsp;- Hovering over the Make Paper button now shows you how many papers until you have unlocked the next upgrade
          <br>&emsp;- Fixed networking upgrade description
          <br>&emsp;- Fixed bug where Estimated Payout is above 0 when you have 0 investors
          <br>&emsp;- Fixed bug where Paper Maker changes papers the first time you use it
          <br>
          (07/23) Patch #0.7
          <br>&emsp;- Released to the Idle Game Maker forums
          <br>&emsp;- Major rebalancing
          <br>&emsp;- Added 6 new papers, 2 new misc. upgrades, 2 new computing, 2 new calculator, 2 new opti, a new outreach, and a new efficiency
          <br>&emsp;- Added a new Research Funds generating facility
          <br>&emsp;- Made terms much bigger to be easier to read
          <br>&emsp;- Phrasing and clarity improvements/changes within some upgrades
          <br>&emsp;- Minor code cleanup + adding code comments in case you want to fork this project
          <br>&emsp;- Corrected spelling of endgame paper<br>
          (07/23) Patch #0.6
          <br>&emsp;- Added x^1.6 term
          <br>&emsp;- Made x^2 way more expensive
          <br>&emsp;- Added three new upgrade types to do with Paper Maker, each with 1 tier at the moment
          <br>&emsp;- Upgrades now use includes instead of being super repetitive
          <br>&emsp;- Fixed 0 Estimated Payout bug introduced in patch 0.5
          <br>&emsp;- Renamed Calculator 3 to be more consistent with progression
          <br>&emsp;- Edited Optimization description
          <br>&emsp;- Fixed bug with Optimization IV
          <br>&emsp;- Edited Investor button description
          <br>&emsp;- Added endgame paper at the game's 100% mark, which will become unbuyable in the next update and replaced by a new paper of the same name<br>
          (06/23) Patch #0.5
          <br>&emsp;- Balancing changes
          <br>&emsp;- Fixed a bug with Statistics Pun paper being able to be purchased before you have enough y
          <br>&emsp;- Building Cost Refund now set to 0% since selling terms doesn't actually give you y
          <br>&emsp;- Added a catch for the beginning toast so it shouldn't display if you sell all of your x term and then buy it back
          <br>&emsp;- Current Equation now has a little animation when you purchase a term
          <br>&emsp;- Dollars currency now can show as singular 'dollar'
          <br>&emsp;- Calculator 3 now gives the correct amount of x on click
          <br>&emsp;- Fixed bug with Current Paper and Estimated Payout changing at 1 second
          <br>&emsp;- Fixed exploit with being able to purchase things that cost y for a moment after already purchasing something that costs y, letting you purchase more than should be possible<br>
          (06/23) Patch #0.4<br>
          &emsp;- Added x^1.3 and x^2 terms, balancing of these especially x^2 will change in the future
          <br>&emsp;- Added a few new upgrades in every tier
          <br>&emsp;- Added Paper Maker with corresponding upgrades coming soon
          <br>&emsp;- This is starting to be an actual game
          <br>(05/23) Patch #0.3.3 <br>
          &emsp;- Things meant to be inaccessable are now actually inaccessable instead of just costing a lot.<br>
          &emsp;- Paper 1 now shows the correct amount of Research Funds you recieve.
          <br>(04/23) Patch # 0.3.2 Fixed a bug with optimization not kicking in for the optimization upgrades themselves. 
          <br>(03/23) Patch #0.3.1 Fixed a game-breaking bug with getting free Research Funds.
          <br>(02/23) Patch # 0.3 Initial public prerelease!
          </dd>
          For the sake of not providing misinformation, Optimization 2 is not a real optimization method.
          `);


//Ticks
    let autosaveTick = new Tick("autosaveTick",[function() {SaveManager.save()}],);
    let graphUpdateTick = new Tick("graphUpdateTick", () => {
        calculator.setMathBounds({
            left:-1,
            bottom:-1,
            right:x.max,
            top:y.max

        });
    })

    let yUpdateTick = new Tick("yUpdateTick",[function() {
        y.a = x.a * terms.bFromId("termX1").a + Math.pow(x.a*terms.bFromId("termX2").a, 2);
    }]);


    let t = new Toast("toast", "toast", "bottom");

//Resources
    let x = ResO({
        name:"x",
        id:"x",
        initVal:25
    });
    let y = new Res("y", "y");
    let researchFunds = new Res("dollars", "researchFunds");


    let xOnClick = new Res("xOnClick", "xOnClick", 1);

    let rOptimization = new Res("rOptimization", "rOptimization");

    let rStatFacilityLevel = new Res("", "statLevel");
    let rStatFacilityPrice = new Res("","statPrice", 10000);
    let rStatFacilityTime = new Res("", "statTime", 3600);
    rStatFacilityTime.yield = -1;
    
//Buttons/Labels/Groups

    SaveManager.doNotSaveList.push("bigButton");
    let equationDisplay = new Label("equation", "main", "Current Equation: y=1x", "equation", "hi");
    
    let currentLaTeX = "x";

    visualBaseTick.addOnTick(()=>{
        let eqEv = evaluatex(currentLaTeX);
        let displayedValues = "";
        let add = (val)=>{
            if(val>rOptimization.a) {
                displayedValues += `<br>x=${val} y=${eqEv({x:val})}`;
            }
        }
        add(100);
        add(500);
        add(1000);
        add(5000);
        add(10000);
        add(50000);
        add(100000);
        add(500000);
        add(1000000);
        equationDisplay.tooltip = `
         <div style="text-align: left; font-size:12px;">This is the equation which converts x into y. The following is a list of what y is at different values of x for your equation:<br>
         <b>x=${rOptimization.a} y=${eqEv({x:rOptimization.a})}
         ${displayedValues}</div></b>
        `;
    });
    let mainArea = new Label("mainArea", "main", "", "main");
    let xDisp = LabelO({
        id:"xDisp",
        container:"mainArea",
        innerHTML: "x: "+x.a,
        css:"cXDisp",
        tooltipHTML:"<b>x</b><br><div style='font-size:12px;'>This is your base currency. You can earn x by clicking the big button or by purchasing the Computing upgrades.</div>"
    });
    xDisp.resFormat(x);
    let yDisp = new Label("yDisp", "mainArea", "Y: "+y.a, "cYDisp", "<b>y</b><br><div style='font-size:12px;'>Y is always equal to plugging x into your equation. It can be used to purchase terms and certain upgrades.</div>");
    yDisp.resFormat(y);
    new Label("br", "mainArea", "", "linebreak");
    let researchFundsDisp = new Label("researchFundsDisp", "mainArea", "Research Funds: "+researchFunds.a, "cResearchDisp");
    visualBaseTick.addOnTick(() => {
        researchFundsDisp.innerHTML = `Research Funds: $${researchFunds.a}`;
    });
    updateBaseTick.addOnTick(()=>{if(rStatFacilityTime<=0) {
        rStatFacilityTime.a=3600-(rStatFacilityLevel.a*60);
        if(upgrades.uFromId("misc2").owned) researchFunds.a++;
    }});



    let bigButton = ButtonO({
        id:"bigButton",
        container:"mainArea",
        innerHTML:"<img src=\"https://file.garden/Y36WipOdi23QPRqg/x2-button-3.png\">",
        css:"cBigButton",
        actions: function() {
            x.add(xOnClick.a);
            yUpdateTick.tick();
            calculator.setMathBounds({
                left:-1,
                bottom:-1,
                right:x.max,
                top:y.max
    
            });
        }
    });

    let termsLabel = new Label("termsLabel", "main", "Terms","cTermsLabel");    
    SaveManager.doNotSaveList.push("termsLabel");
    let terms = new BuildingGroup("terms", "main","cTermsBox","cTerms", 2.5, function() {
        currentLaTeX = `${terms.bFromId("termX2").amount}x^2 + ${terms.bFromId("termX1").amount}x`;
        y.a=0;
        x.a=rOptimization.a;
        calculator.setExpression({id:'graph1', latex:currentLaTeX});
        equationDisplay.get.classList.add("classBoing")
        setTimeout(() => {
            equationDisplay.get.classList.remove("classBoing");
        }, 500);
    });
    let statPun = new Button("statPun", "main", "(ᴸᵛᴸ 0) Center for Statistics Pun Recovery", "statPun", ()=>{
        if(rStatFacilityPrice.a>=y.a && rStatFacilityLevel.a<59) {
            x=rOptimization
            rStatFacilityPrice*=1.7;
            rStatFacilityLevel++;
            rStatFacilityTime-=60;
        }
    }, "", true);
    visualBaseTick.addOnTick(()=>{
        statPun.innerHTML = `(ᴸᵛᴸ ${rStatFacilityLevel.a}) Center for Statistics Pun Recovery`;
        statPun.tooltip=`<b>Level ${rStatFacilityLevel.a} / 59</b><br>Generates Research Funds over time.<br>Current generation rate: 1 dollar every <b>${60-rStatFacilityLevel.a}</b> minutes.<br>Time until next dollar: ${Math.ceil(rStatFacilityTime.a/60)} minutes.<br><b>${y>=rStatFacilityPrice.a&&rStatFacilityLevel<59 ? `<div style="color:#126F00;">Click to level up for ${rStatFacilityPrice.a} y</div>`:`<div style="color:#9C0000;">Next Level: ${rStatFacilityPrice.a} y</div>`}`
    });

//Buildings
    terms.b("x", "termX1", "", function() {return true;}, function() {
        if(terms.bFromId("termX1").amount==2) {
            t.t("Every time you purchase a term or upgrade that costs y, x goes down to 0. Purchase wisely!")
        }
    }, 25, y, 1);
    terms.b("x¹ᐧ³", "termX13", "", ()=>{return y.max>1000}, ()=>{}, 4000, y);
    terms.b("x¹ᐧ⁶", "termX16", "", ()=>{return y.max>70000}, ()=>{}, 200000, y);
    terms.b("x²", "termX2", "", function() {return y.max>10000000}, () => {},100000000, y);

    visualBaseTick.addOnTick(() => {
        equationDisplay.innerHTML = `Current Equation: <i>y = ${terms.bFromId("termX2").a>0 ? terms.bFromId("termX2").a+"x²+":""}${terms.bFromId("termX16").a>0 ? terms.bFromId("termX13").a+"x+":""}${terms.bFromId("termX1").a}x</i>`;
    });

    let upgradesLabel = new Label("upgradesLabel", "main", "Upgrades","cUpgradesLabel");
    SaveManager.doNotSaveList.push("upgradesLabel");

    let upgrades = UpgradeGroupO({
        id:"upgrades",
        container:"main",
        containerCSS:"cUpgradesBox",
        upgradeCSS:"cUpgrades",
        defaultPurchaseBehavior: function() {
            y.a=0;
            x.a=rOptimization.a;
            this.hide();
            console.log(this.owned);
        }
    });
    this.u = upgrades;

    let achi = new AchievementGroup("achi", "infoAchievementBox", "main");


    yUpdateTick.start(200);

    //autosaveTick.start(30000);
    
    SaveManager.load();
    SaveManager.save();
    
//Custom functions
    let compCount = 0;
    function makeComp(called, requirement, numeral, price, gives) {
        compCount++;
        upgrades.u("🖳 "+called, "comp"+compCount, "🖳 Computing "+numeral+"<br>Increases x per second by "+gives+".", requirement, function() {
            x.yield+=gives;
        }, price, researchFunds);
    }
    let calcCount = 0;
    function makeCalc(called, requirement, numeral, price, gives) {
        calcCount++;
        upgrades.u("± "+called, "calc"+calcCount, `<b>± Calculator ${numeral}</b><br>Increases yield of the big button by <b>${gives}</b>.`, ()=>{return eval(requirement)}, ()=>{
            xOnClick.a+=gives;
        }, price, researchFunds);
    }
    let optiCount = 0;
    function makeOpti(called,requirement,numeral,price, gives) {
        optiCount++;
        upgrades.u(`🖫 ${called}`, "opti"+optiCount, `<b>🖫 Optimization ${numeral}</b><br>When a term or upgrade that costs y is purchased, x goes down to <b>${gives+rOptimization.a}</b>.`, ()=>{return eval(requirement)}, ()=>{
            rOptimization.a+=gives;
        });
    }
    let paperCount = 0;
    function makePapr(called, requirement, price, gives, flavor) {
        paperCount++;
        upgrades.u(`≡ Publish Paper: ${called}`, "papr"+paperCount, `<b>≡ Paper</b><br>Grants <b>$${gives}</b> for the Research Fund.<br>------<br><i>${flavor}</i>`, requirement, ()=>{
            researchFunds.a+=gives;
        }, price, y);
    }

    //Papers
    makePapr("Couch Cushion Theorem", ()=>{return y.max>=100}, 300, 2, "A theorem which states that at least 12% of the cash one carries in their lifetime will end up in various couch cushions, in addition to theoretical methods of mitigation. The investors' interests are certainly piqued.");
    makePapr("Sinking Point Numbers", ()=>{return y.max>=400}, 600, 3, "While ordinary floating point numbers have their decimal points move for efficient storage in binary, the decimal of the proposed sinking point number simply moves to the left until it moves out of the number itself. The potential applications within optimization theory are surprisingly numerous.");
    makePapr("Paranormal Distributions", ()=>{return y.max>=700}, 1500, 4, "So named for their spookiness in completely breaking the cleanliness of a normal distribution. Also, when put into the complex plane, the distribution allows one to summon the ghost of René Descartes.");
    makePapr("The Neurological Effect of Statistics Puns", ()=>{return terms.bFromId("termX13").max>=1}, 15000, 5, "An exploratory paper into the effects of statistics-related puns on the human psyche. The study found that as <i>n → ∞</i> where n = number of statistics-related puns, rates of anxiety and depression approaches 1.");
    makePapr("Halfli-Mechanical Valveumes", ()=>{return y.max>=20000}, 20000, 10, "A rigorous proof of the concept that the number 3 cannot exist in certain contexts, such as within certain popular video game franchises.");
    makePapr("Inverse-Inverse Kinematics Problems", ()=>{return y.max>=80000}, 300000, 17, "These are somehow different from non-inverse kinematics problems. Well, probably. Maybe. It's not totally clear, but it can certainly be tried to treat them as such.");
    makePapr("Least-Efficent Splines", ()=>{return y.max>800000}, 10000000, 24, "Splines are typically meant to connect points smoothly, such as connecting a polynomial's zeroes to find that polynomial. It was rather surprising to find that no one had yet tried applying the principle of bogosort to this problem wherein a smooth curve is randomly drawn until it happens to hit the points required.");
    makePapr("Puzzle Cube Theorem of Impossibility", ()=>{return upgrades.uFromId("papr7").owned && y>=7000000}, 17000000, 38, "This paper postulates the idea that, once scrambled, an ordinary 3x3 puzzle cube is mathematically impossible to solve, and that anyone who claims otherwise is a fraud. While not the strongest proof, it will certainly make enough waves within some internet communities that the research will prove its worth.");
    makePapr("Email-Based Energy", ()=>{return upgrades.uFromId("papr8").owned}, 20000000, 56, "Proposal for a prototype energy source fueled, rather inexplicably, by the outrage contained in certain emails discussing so-called 'provably wrong' opinions.");

    //Computing
    makeComp("A Helpful Friend", ()=>{return terms.termX1.max>2}, "I", 1,1);
    makeComp("Pen and Paper", ()=>{return terms.termX1.max>3&&upgrades.comp3.owned}, "II", 3, 6);
    makeComp("Slide Rule", ()=>{return y.max>8000&&upgrades.comp1.owned}, "III", 4,14);
    makeComp("Kinematic Abacus", ()=>{return upgrades.papr6.owned}, "IV", 10,28);
    makeComp("Four-Function Calculator", ()=>{return y.max>12000000}, "V", 20,36);

    //Calculator
    makeCalc("Double Successor Functions", "y.max>=200", "I", 4,1);
    makeCalc("Cleaner Whiteboards", "upgrades.papr5.owned", "II", 16,1);
    makeCalc("Sparklier Pens", "y.max>500000", "III", 22,1);
    makeCalc("Metric Rulers", "y.max>20000000", "IV", 29,1);

    //Optimization
    makeOpti("Bees Algorithm", "y.max>500 && upgrades.papr1.owned", "I", 800, 30);
    makeOpti("Sinking Byte Compression", "upgrades.papr2.owned && upgrades.opti1.owned", "II", 1500, 100);
    makeOpti("Differential Evolution", "y.max>=3000 && upgrades.opti2.owned", "III", 17000, 400);
    makeOpti("Alpha-Beta Pruning", "y.max>=70000 && upgrades.opti3.owned", "IV", 100000, 2000);
    makeOpti("Chain Matrix Multiplication", "y.max>=20000000 && upgrades.opti4.owned", "IV", 30000000, 6000);

    console.log(upgrades.papr1);

    
    

    var elt = document.getElementById('calculator');
        var calculator = Desmos.GraphingCalculator(elt);
        calculator.updateSettings({
            expressions:false,
            settingsMenu:false,
            zoomButtons:false,
            lockViewport:true,
            keypad:false,
        });
        calculator.setMathBounds({
            left:-1,
            bottom:-1,
            right:x.max,
            top:y.max

        });
        currentLaTeX = `${terms.bFromId("termX2").amount}x^2 + ${terms.bFromId("termX16").amount}x^{1.6} + ${terms.bFromId("termX13").amount}x^{1.3} + ${terms.bFromId("termX1").amount}x`;
        calculator.setExpression({id:'graph1', latex:currentLaTeX});

        graphUpdateTick.start(50);


}
}