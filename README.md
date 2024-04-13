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

### collectStage3.js

collectStage3 handles threads very efficiently. When it installs an action in the network, it will only create one instance of it distributed across multiple servers. Although this is efficient with threads, the script struggles with time management because all instances are executed sequentially.

`args non`
> run collectStage3.js

### hacknet.js

This script will operate autonomously until all provided arguments are met, at which point it will terminate. If no arguments are given, the script will automatically purchase 4 nodes with 25 levels, 2 gigabytes of RAM, and 1 core. This configuration is sufficient to receive an invitation from Netburners.

The script accepts the following arguments:

- Number of nodes to purchase
- Number of levels per node to purchase
- Amount of RAM per node to purchase (in gigabytes)
- Number of cores per node to purchase

`args: optional`
> run hacknet.js 5 100 16 2

### pck_*.js

These scripts have the same functions as sqn_gwh.js buy are seperated for more control on timing en threads. The arguments are provided bij collectStage3.js

- Weak the security of a server, use arg to define target server with a delay
- Grow the money of a server, use arg to define target server with a delay
- Hack the money available of a server, use arg to define target server with a delay

`parent: collectStage3.js`
`args required`
> run pck_grow.js sigma-cosmetics 2000

### server.js

This script will continuously purchase servers until 32GB. Initially, it will buy servers with 4GB of RAM. Once all 24 servers have 4GB RAM, it will replace each server with an 8GB RAM version. This process will continue, increasing the RAM of each server until the 32GB amount of RAM is reached. The script will consider the total available RAM in the network. If the usage is more than 90% of the total RAM, the script will purchase new servers or upgrades.

`args: non`
> run servers.js 128

### sharePower.js

When all is said and done, and all you're waiting for is the reputation of a faction, run this script. The network will be flooded with sharepower so that waiting for reputation can proceed more quickly.

`args: non`
> run sharePower.js

### sqn_gw.js

The sqn_gw.js script increases the account balance and reduces security based on the chance. The hacking process is carried out by either collectStage2.js or collectStage3.js. Initially, the arguments are provided by parents, but they can also be manually specified. If no argument is provided, the default hack chance is set to 80% (in decimal form).

`parent: collectStage2.js`
`args: optional`
> run sqn_gw.js 0.7

### sqn_w.js

The sqn_w.js script operates based on probability. It initiates within a range of 70% to 80% and traverses through all servers to lower their security. Once all servers within this range have been addressed, the range expands to 60% to 80%. This process continues until all servers are completely open, at 0% security. At this point, the script self-terminates. The purpose of this script is to bring servers with a probability lower than 70% into this range. Once achieved, collectStage3.js takes over further actions.

`parent: collectStage3.js collectStage2.js`
`args optional`
> run sqn_w.js 0.5 0.8

### stockmarket.js

The stock market script is designed to gather information on all stocks that exceed the purchase threshold or in which shares are currently held. Once collected, this data is sorted to prioritize investment opportunities. Based on this analysis, shares are then purchased accordingly. Conversely, if a stock's value drops below the selling threshold, the script automatically triggers the sale of all associated shares to mitigate potential losses. For a detailed overview of the current status and transactions, you can refer to the comprehensive logs generated by the script.

`args non`
> run stockmarket.js

## Singularity

### company.js

Bij het starten moet je opgeven bij welk bedrijf je wil werken en hoeveel reputatie je daar maximaal wil verdienen. als je dat gedaan hebt zal het script voor aan het werk gaan tot je de opgegeven gegevens hebt berijkt. als je geen argumenten mee geeft bij het starten zal het script gaan werken bij 4sigma tot het de status van CEO, CFO, CTO heeft berijkt. Dit moet genoeg zijn voor Silhouette waarvan het een van de voorwaarde is om voor de gang te mogen werken. 

`args optional`
> run company.js ECorp 400000

### core.js

core.js will keep buying as long as the script is running.

`args non`
> run core.js

### crime.js Next update...
### faction.js Next update...
### gym.js 

When starting this script, you are required to specify via the arguments how much skills you want to acquire. Upon starting the script, it will first attempt to install a backdoor on the gym server for a small discount. Then, you will be directed to the correct location. Afterward, you will begin building up your skills to the point you have specified. Once the goal is reached, the script will automatically close itself.

skills: str, def, dex, agi

`args required`
> run gym.js 20 20 20 20

### install.js Next update...
### programs.js

During its focus, Programs will always take precedence over any of its similar scripts. This script contains a list of essential programs that will either be purchased or created. Once all the programs are acquired, the script will close to free up space for other scripts.

`cousins: company, crime, gym, programs, reputation, school`
`args non`
> run programs.js

### ram.js
 
Ram.js will keep buying as long as the script is running.

`args non`
> run ram.js

### reputation.js Next update...
### requirement.js Next update...
### school.js

When starting this script, you are required to specify via the arguments how much charisma you want to acquire. Upon starting the script, it will first attempt to install a backdoor on the school server for a small discount. Then, you will be directed to the correct location. Afterward, you will begin building up your charisma to the point you have specified. Once the goal is reached, the script will automatically close itself.

`args required`
> run school.js 375