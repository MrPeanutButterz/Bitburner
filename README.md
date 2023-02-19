# Bitburner

These are the scripts I wrote for the Bitburner Game. Before I started this game I couldn't write any code.

Bitburner is a programming-based incremental game that revolves around hacking and cyberpunk themes. The game can be played in a [browser](https://danielyxie.github.io/bitburner) or installed through [Steam](https://store.steampowered.com/app/1812820/Bitburner/).

## ROOT

`main.js`

In this file you will find a list of scripts. 
If there is avaliable ram on home the scripts will be run. 
Otherwise main will wait. 

## DEFAULT

`conf.js`

Default settings.

`lib.js`

The library of functions.


## GENESIS


`serverExploid.js`
**args optional**

Weakens the security, grows the balance, hacks the money avaliable. 
Grows server money incremental on every hack + 1%.
The arguments are provided bij netStumbler.js but can also be run manualy.
If no argument is given it will hack n00dles by default.

1. specify the server to start hacking it. 

`serverWeak.js` - `serverGrow.js` - `serverHack.js` 
**args required**

These scripts have the same functions as serverExploid.js buy are seperated for more control on timing en threads.
The arguments are provided bij netSparker.js.

* Weakens the security of a server, use arg to define target server with a delay
* Grows the money of a server, use arg to define target server with a delay
* Hacks the money available of a server, use arg to define target server with a delay

`netStumbler.js`
**args optional**

This basic hack script is intended to give your game a jumpstart. It installs "serverExploit.js" on each available server, then begins hacking the server specified as an argument. If no server is specified, it will locate one automatically. As the network's RAM grows with the addition of more available servers, the script will transition to using "netSparker.js," which is more profitable.

The script accepts the following arguments:

1. specify the server to start hacking it.

**Example:** run netStumbler.js n00dles

`netSparker.js`

This advanced hack script is designed to generate maximum profit. It follows a timed sequence consisting of the following stages: weak, grow, weak, hack. All scripts conclude within 500 ticks of each other and are installed on servers with ample RAM.

`metaSploit.js`
**args optional**

MetaSploit manages the stock market by purchasing stocks with a forecast of over 70% and selling when they dip below 50%. All owned stocks are boosted by running "grow" scripts on the home server to maximize profit potential. If the script is executed with a "sell" argument, all stocks will be liquidated.

To sell all stocks, include the "sell" argument when running the script.

**Example:** run metaSploit.js sell

`buyHacknet.js`
**args optional**

This script will operate autonomously until all provided arguments are met, at which point it will terminate. If no arguments are given, the script will automatically purchase 4 nodes with 25 levels, 2 gigabytes of RAM, and 1 core. This configuration is sufficient to receive an invitation from Netburners.

The script accepts the following arguments:

1. Number of nodes to purchase
2. Number of levels per node to purchase
3. Amount of RAM per node to purchase (in gigabytes)
4. Number of cores per node to purchase

**Example:** run buyHacknet.js 5 100 16 2

`buyServer.js`
**args optional**

This script will continue purchasing servers until the specified conditions are met. If no arguments are provided, the script will begin by buying 4GB RAM servers, and once all 24 servers have 4GB RAM, it will replace each server with an 8GB RAM version. This process will continue, increasing the RAM of each server until the maximum amount of RAM is reached.

1. specify the amount of ram you want to start buying
2. specify the amount of ram you want to stop buying

**Example:** run buyServers.js 4 16


## SINGULARITY


`buyCore.js` - `buyRam.js`

Keeps buying untill your money runs out.

`buyPrograms.js` 

This script purchases only the necessary .exe programs required to run the hack scripts, ensuring that essential programs are the only ones acquired.

BruteSSH.exe, FTPCrack.exe, relaySMTP.exe, HTTPWorm.exe, SQLInject.exe

`findFaction.js`

This script will identify the most desirable faction based on the highest reputation available in the list of purchasable augmentations. Next, it will compare this faction against all other factions and select the one with the least amount of work required. Once a suitable faction is found, the script will initiate the requirements, reputation, or installation script as needed. Once all factions have been completed, the script will launch bitnode.js.

`requirements.js`
**args optional**

Reputation is executed with a faction name argument and locates the necessary tasks to complete. Once identified, the script executes these tasks. If the selected faction sends an invitation, the script accepts it and returns control to findFaction.js.

**Example:** run requirements.js netburners

`reputation.js`
**args optional**

When findFaction.js launches reputation.js, it passes two arguments to the script: the faction name and the desired reputation amount. The script will perform a 10-second test run to estimate the completion time. If the required reputation is achieved, the script will return to findFaction.js.

**Example:** run requirements.js netburners 52000

`installation.js`
**args optional**

The final step will involve the installation process, which will gather all augmentations from the faction and list them in order of price, from highest to lowest. If an augmentation requires a pre-installation step, it will be listed before the actual augmentation. Before making any purchases, the script will terminate MetaSploit and sell all stocks. Once all augmentations have been purchased, any remaining funds will be spent on Neuroflux. Finally, all augmentations will be installed, and the main.js script will run to reboot the process.

`killBitnode.js`

Once all factions have been successfully completed, the bitnode script will initiate a hack of the final server (w0r1d_d43m0n).