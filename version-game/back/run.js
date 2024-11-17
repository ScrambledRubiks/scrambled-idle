import {Game} from "../game.js";
import { TypeChecker,OuterSetup } from "./back.js";
addEventListener("DOMContentLoaded", async (event) => {
    document.body.style.overflow = "hidden";
    if(OuterSetup.useGameJsCSS) {
        document.head.removeChild(document.getElementById("default"));
        document.head.removeChild(document.getElementById("custom"));
        const style = document.createElement("style");
        style.innerHTML = OuterSetup.defaultCSS + "\n" + OuterSetup.customCSS;
        document.getElementsByTagName('head')[0].appendChild(style);
    }
    // if(OuterSetup.pastebinDataSource) {
    //     let params = new URLSearchParams(location.search);
    //     let jsData = params.get("gameData");
    //     let pasteData = 
    //         await fetch("https://api.paste.ee/v1/pastes/"+jsData, {
    //             method:"GET",
    //             headers: {
    //                 "X-Auth-Token": "uPcnh8PyamWMiQdStTG2o4deWFr0ujo6jFDM1nqy7"
    //             }
    //         })
    //         .then(response => response.json())
    //         .then(data => {
    //             return Promise.resolve(data.paste);
    //         });
    //         if(Date.parse(pasteData["expires_at"])!=null) {
    //             console.warn("WARNING: The paste that your game is hosted at is set to expire in "+(Math.floor((Date.parse(pasteData["expires_at"])-Date.now())/86400000))+" days. Make sure that you have a backup of your game's code and, if this is a release version of your game, you need to manually set the paste to never expire.");
    //         }
    //         console.log(pasteData);
    //     pasteData["sections"].forEach(section => {
    //         if(section["syntax"]=="xml") {
    //             console.log(section);
    //             document.write(section["contents"]);
    //         }
    //         if(section["syntax"]=="javascript") {
    //             eval(section["contents"]);
    //         }
    //     });
    //     }
    let G = new Game();
    G.GameElements();''

    if(OuterSetup.gameElementsGlobalScope) window.G = G;
    if(TypeChecker.doTypeChecking) new TypeChecker();
});