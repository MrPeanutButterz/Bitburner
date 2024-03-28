# Bitburner

These are the scripts I wrote for the Bitburner Game. Before I started this game I couldn't write any code. 

Bitburner is a programming-based incremental game that revolves around hacking and cyberpunk themes. The game can be played in a [browser](https://danielyxie.github.io/bitburner) or installed through [Steam](https://store.steampowered.com/app/1812820/Bitburner/).

## Genesis

### collectStage1.js

With this script, you can execute a ‘grow weak’ hack on servers that are easy to manipulate. Arguments are optional, if you run this script without any arguments, it will target n00dles.

`args optional`
> run collectStage1.js joesguns

### collectStage2.js

This script floods the entire network with the sqn_gw.js script, thereby increasing the funds on each server and lowering security. If the money on a server exceeds 40% of its maximum capacity, the script will initiate a hacking action on the home server. To limit RAM usage, only one hack per server will be executed at all times.

`args non`
> run collectStage2.js

### sqn_gwh 

The sqn_gwh.js weakens the security, grows the balance, hacks the money available. Grows server money incremental on every hack + 1%. The arguments are provided bij collectStage1.js but can also be run manualy. If no argument is given it will hack n00dles by default.

`parent: collectStage1.js`
`args optional`
> run sqn_gwh.js n00dles

### sqn_gw.js

The sqn_gw.js script grows the balance and reduces security. The hacking is done by collectStage2.js.
The arguments are provided bij collectStage2.js but can also be run manualy. If no argument is given it will hack n00dles by default.

`parent: collectStage2.js`
`args: optional`
> run sqn_gw.js foodnstuff

### pck_grow & pck_weak & pck_hack .js

These scripts have the same functions as sqn_gwh.js buy are seperated for more control on timing en threads. The arguments are provided bij collectStage3.js

- Weakens the security of a server, use arg to define target server with a delay
- Grows the money of a server, use arg to define target server with a delay
- Hacks the money available of a server, use arg to define target server with a delay

`parent: collectStage3.js`
`args required`
> run sqn_gw.js sigma-cosmetics 2000

## Purchase

### hacknet.js

This script will operate autonomously until all provided arguments are met, at which point it will terminate. If no arguments are given, the script will automatically purchase 4 nodes with 25 levels, 2 gigabytes of RAM, and 1 core. This configuration is sufficient to receive an invitation from Netburners.

The script accepts the following arguments:

- Number of nodes to purchase
- Number of levels per node to purchase
- Amount of RAM per node to purchase (in gigabytes)
- Number of cores per node to purchase

`args: optional`
> run buyHacknet.js 5 100 16 2


### buyServer.js

This script will continue purchasing servers until the specified conditions are met. If no arguments are provided, the script will begin by buying 4GB RAM servers, and once all 24 servers have 4GB RAM, it will replace each server with an 8GB RAM version. This process will continue, increasing the RAM of each server until the maximum amount of RAM is reached.

- specify the amount of ram you want to start buying
- specify the amount of ram you want to stop buying

`args: optional`
> run buyServers.js 4 16