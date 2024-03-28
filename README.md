# Bitburner

These are the scripts I wrote for the Bitburner Game. Before I started this game I couldn't write any code.

Bitburner is a programming-based incremental game that revolves around hacking and cyberpunk themes. The game can be played in a [browser](https://danielyxie.github.io/bitburner) or installed through [Steam](https://store.steampowered.com/app/1812820/Bitburner/).


## Genesis

### sqn_gwh.js

Weakens the security, grows the balance, hacks the money avaliable. Grows server money incremental on every hack + 1%. The arguments are provided bij collectStage1.js but can also be run manualy. If no argument is given it will hack n00dles by default.

Example: run sqn_gwh.js n00dles

### sqn_gw.js

Weakens the security, grows the balance, In contrast to GWH, this script grows and reduces security. The hacking is done by collectStage2.js.

> arg optional
> run sqn_gw.js 

### pck_grow.js pck_weak.js pck_hack.js

These scripts have the same functions as sqn_gwh.js buy are seperated for more control on timing en threads. The arguments are provided bij netSparker.js.

- Weakens the security of a server, use arg to define target server with a delay
- Grows the money of a server, use arg to define target server with a delay
- Hacks the money available of a server, use arg to define target server with a delay