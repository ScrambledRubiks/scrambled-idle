import setup from "../file_setup.js";
let game = await import(`../${setup.gameJSName}`);
import { TypeChecker,OuterSetup } from "./back.js";
document.body.style.overflow = "hidden";
if(OuterSetup.useGameJsCSS) {
    document.head.removeChild(document.getElementById("default"));
    document.head.removeChild(document.getElementById("custom"));
    const style = document.createElement("style");
    style.innerHTML = OuterSetup.defaultCSS + "\n" + OuterSetup.customCSS; //TODO there's probably a better way of doing this
    document.getElementsByTagName('head')[0].appendChild(style);
}
let G = new game.Game()
G.GameElements();

if(OuterSetup.gameElementsGlobalScope) window.G = G;
if(TypeChecker.doTypeChecking) new TypeChecker();