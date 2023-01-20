# Bitburner

These are the scripts I wrote for the Bitburner Game. Before I started this game I couldn't write in code. I found out that I really enjoy coding so I went to school to learn it even better.


## ROOT

`conf.js`

Default settings.

`lib.js`

The library where all shared functions are stored.


## GENESIS


`serverWeak.js` 

Weakens the security of a server, use arg to define target server with a delay.

`serverGrow.js` 

Grows the money of a server, use arg to define target server with a delay.

`serverHack.js` 

Hacks the money available of a server, use arg to define target server with a delay.

`serverExploid.js` 

Weakens the security, grows the balance, hacks the money avaliable, grows server money incremental on every hack + 1%.

`netStumbler.js`

This is a basic hack script, the purpose of which is to kickstart your game... it will install serverExploid.js on every server it has access to.

`buyHacknet.js` 

Run script with arguments! This script runs on autopilot until all the conditions are met.

***Arguments***
1. specify how many nodes you want to buy
2. specify how many levels you want to buy
3. specify how many ram you want to buy
4. specify how many cores you want to buy

**Example:** run buyHacknet.js 4 25 4 1