# Bitburner

These are the scripts I wrote for the Bitburner Game. Before I started this game I couldn't write in code. I found out that I really enjoy coding so I went to school to learn it even better.


## ROOT

`conf.js`

Default settings.

`lib.js`

The library where all shared functions are stored.


## GENESIS


`serverWeak.js` - `serverGrow.js` - `serverHack.js` 

* Weakens the security of a server, use arg to define target server with a delay.
* Grows the money of a server, use arg to define target server with a delay.
* Hacks the money available of a server, use arg to define target server with a delay.

`serverExploid.js` 

Weakens the security, grows the balance, hacks the money avaliable, grows server money incremental on every hack + 1%.

`netStumbler.js`

This is a basic hack script, the purpose of which is to kickstart your game... 
it will install serverExploid.js on every server it has access to. 
Start hacking any server with te provided argument.

***Arguments - optional***
1. specify the server to start hacking it

**Example:** run netStumbler.js n00dles

`buyHacknet.js` 

This script runs on autopilot until all the conditions are met.

***Arguments - required***
1. specify how many nodes you want to buy
2. specify how many levels you want to buy
3. specify how many ram you want to buy
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

* Keeps buying untill your money runs out.

`buyPrograms.js` 

This script buys all .exe programs needed to run the hack scripts. There are 2 lists:

* essential
* non essential

