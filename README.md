# ScrambledIdle
ScrambledIdle is a work-in-progress Javascript library designed to do the heavy work of creating an idle/incremental game.

Picking up where projects like IdleJS or Continuum Engine left off, it seeks to be more heavyweight and complete than other options availible. It has many features uncommon elsewhere such as no-hassle saving, game pausing, metric tonnes of custom incremental-focused data structures, optional type safety, multiple syntax options, no-coding-experience-required tutorialization, and more.

Its main design philosophy is to balance beginner-friendliness and ease of use with flexibility and lack of arbitrary limitation wherever possible. In addition, ScrambledIdle was built to be familiar to developers coming from [Orteil's Idle Game Maker](https://orteil.dashnet.org/igm/), with many features bearing resemblence to their IGM counterparts, while offering superior flexibility at the cost of slightly less simplicity in implementation. Despite some superficial similarites, ScrambledIdle's codebase is completely independent of IGM's(or, for that matter, any other game engine) and is very semantically different from how IGM operates.

> Note: While much of its codebase is in a working and near-final state, ScrambledIdle is currently unfinished and is missing some core features. Code and documentation may be incomplete, and very little QA testing has occured.

## Planned Next-Revision changes
- Reimplementing SaveManager to not have a jStorage dependancy
- Compete refactor of Building, Upgrade, and Achievement to inherit a Collectable superclass
- Logic rework of logAnim in Terminal to allow for nested divs within the message
- Rework of Tick so that functions can be added and removed in an object-oriented manner

## Current Features
### TypeChecker
Optional type safety with any ScrambledIdle object, built into Javascript. No Typescript needed!
### Tick
Easily add and manupulate functions to be called on an interval.
### SaveManager
Save everything about your game without the hassle of manually defining every savable value. Unless you tell the game not to save and load something, it will be saved for a seamless player experience between page loads.
### Pausing
The entire game can be paused and unpaused at will.
### Label
Custom HTML divs with many helper methods. Has built-in support for easy icons and tooltips.
### Button
Same as Label, custom easy-creation buttons with many helper methods. Also has built-in support for icons and tooltips.
### DisplayGroup
Allows you to easily show and hide groups of ScrambledIdle assets that has show or hide methods.
### Res
Easy control and manipulation of incremental-focused resources. Automatically interfaces with Labels, Buttons, Upgrades, Buildings, and Achievements to track resouce amounts and update the game without any tedious DOM work.
### UpgradeGroup
Create unlockable upgrades consistently and easily that can be hidden until a criteria is reached, then can be purchased with both a resource or a hidden function. Both default and per-upgrade behavior can be fully custom-set.
### BuildingGroup
Similar to UpgradeGroup, but with buildings that can be bought over and over opposed to the typically one-time purchase of an upgrade.
### AchievementGroup
Wait in the background for a condition to be fulfilled, then give an upgrade for the player's good work! When an upgrade is gained, it automatically provides a toast for itself and adds itself to somewhere in your game. These can be added anywhere, but there's a special spot for them in the InfoMenu.
### Toast
A small popup on the bottom or top of your game. Has many of the same features as Label(including optional tooltips and an icon) plus customizable appear and dissapear animations.
### InfoMenu
A one-stop shop for many technical elements of your game. There's a place for a changelog, buttons for save control, and an optional place to hold Achievements.
### TextArea
An easy-to-use input box for players to put text data into your game.
### Terminal
A running log that you can print to in code or even have a user give data to with its own TextArea. Has many features to allow for fine control such as logging with or without a newline or logging animated for one character to be placed at a time.