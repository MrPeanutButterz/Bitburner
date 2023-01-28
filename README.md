# Bitburner

These are the scripts I wrote for the Bitburner Game. Before I started this game I couldn't write in code.


## Default

`conf.js`

Default settings.

`lib.js`

The library where all shared functions are stored.


## GENESIS


`serverWeak.js` - `serverGrow.js` - `serverHack.js` 

Weaken, grow, hack seperated for more control.

* Weakens the security of a server, use arg to define target server with a delay.
* Grows the money of a server, use arg to define target server with a delay.
* Hacks the money available of a server, use arg to define target server with a delay.

`serverExploid.js` 

Weakens the security, grows the balance, hacks the money avaliable, grows server money incremental on every hack + 1%.

***Arguments - optional***
1. specify the server to start hacking it. 

`netStumbler.js`

This is a basic hack script, the purpose of which is to kickstart your game... 
it will install serverExploid.js on every server it has access to. 
Start hacking any server with te provided argument or if non is given it will find one for you.

***Arguments - optional***
1. specify the server to start hacking it

**Example:** run netStumbler.js n00dles

`buyHacknet.js` 

This script runs on autopilot until all the conditions are met.

***Arguments - required***
1. specify how many nodes you want to buy
2. specify how many levels you want to buy
3. specify how many gb ram you want to buy
4. specify how many cores you want to buy

**Example:** run buyHacknet.js 4 25 4 1

`buyServer.js` 

This script runs on autopilot until all the conditions are met.

***Arguments - required***
1. specify the amount of ram you want to start buying
2. specify the amount of ram you want to stop buying

**Example:** run buyServers.js 2 8


## SINGULARITY


`buyCore.js` - `buyRam.js`

Keeps buying untill your money runs out.

`buyPrograms.js` 

This script buys all .exe programs needed to run the hack scripts. There are 2 lists:

* essential
* non essential

`findFaction.js`

Finds the best faction based on the highest reputation in the list of buyable augmentations.
Then it will compair it to all factions en select the one with the least amount of work. 
When a faction is found it will start the requirements or reputation or installation script.

`requirements.js` 

Reputation is run with an argument (faction name) en finds the required tasks en execute hem.
When the selected faction has send an invitation it will be accepted en control is given back to findFaction.js.

`reputation.js`

When findFaction.js starts reputation.js it is run with an argument (faction name).
First it will do a 10 second test run to get a time estemate for an indication on the finish time.
If the required reputation is reached the script will go back to findFaction.js.

`installation.js`

The last part will be the installation, it will get all augmentations from the faction en list them from price high / low.
If an augmentation needs a pre install it will be listed before the actual augmentation. 
When all augmentations are bought, money left will be spend on Neuroflux. 
All will be installed en the main.js script will be run te reboot the procces.