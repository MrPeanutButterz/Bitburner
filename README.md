# Bitburner

These are the scripts I wrote for the Bitburner Game. Before I started this game I couldn't write any code.


## ROOT

`main.js`

Kickstarts all scripts.

## DEFAULT

`conf.js`

Default settings.

`lib.js`

The library of functions.


## GENESIS


`serverExploid.js` 

Weakens the security, grows the balance, hacks the money avaliable, grows server money incremental on every hack + 1%.
If no argument is given it will hack n00dles by default.

***Arguments - optional***
1. specify the server to start hacking it. 

`netStumbler.js`

This is a basic hack script, the purpose of which is to kickstart your game... 
It will install serverExploid.js on every server. 
Start hacking the server that is provided as an argument, or if non is given it will find one for you.
As the network ram increases with more avialable servers it will switch over to netSparker.js as it is more provitable. 

***Arguments - optional***
1. specify the server to start hacking it.

**Example:** run netStumbler.js n00dles

`serverWeak.js` - `serverGrow.js` - `serverHack.js` 

These scripts have the same functions as serverExploid.js buy are seperated for more control on timing en threads.

* Weakens the security of a server, use arg to define target server with a delay
* Grows the money of a server, use arg to define target server with a delay
* Hacks the money available of a server, use arg to define target server with a delay

`netSparker.js`

This is a advanced hack script, the purpose of which is make as mutch money as posible. 
It wil make a timed package with fases: weak, grow, weak, hack. All script ending within 500 ticks after one another. 
These script are installed on the servers with free ram. 

`buyHacknet.js` 

This script runs on autopilot until all the provided arguments are met. When this happens the script will exit itself.
In addition to the arguments, it can also be run without. The script will only buy 4 nodes with 25 levels en 2 ram en 1 core.
This is enough to get an invite from Netburners. 

***Arguments - optional***
1. specify how many nodes you want to buy
2. specify how many levels you want to buy
3. specify how many gb ram you want to buy
4. specify how many cores you want to buy

**Example:** run buyHacknet.js 5 100 16 2

`buyServer.js` 

This script runs on autopilot until all the provided arguments are met. 
If no arguments are given the script will start buying 4GB ram servers en if all 24 servers have 4GB it will replace every server
with 8 GB ram en so on untill the maximum amount of ram is reached. 

***Arguments - optional***
1. specify the amount of ram you want to start buying
2. specify the amount of ram you want to stop buying

**Example:** run buyServers.js 4 16


## SINGULARITY


`buyCore.js` - `buyRam.js`

Keeps buying untill your money runs out.

`buyPrograms.js` 

This script buys all .exe programs needed to run the hack scripts. There are 2 lists an essential en a non essential list.
If the script is run the essential list will be bought 

1. essential: BruteSSH.exe, FTPCrack.exe, relaySMTP.exe, HTTPWorm.exe, SQLInject.exe
2. non essential: AutoLink.exe, ServerProfiler.exe, DeepscanV1.exe, DeepscanV2.exe, Formulas.exe

**Example:** run buyPrograms.js [ e or n ]

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