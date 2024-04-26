/** The Complete Handbook for Creating a Successful Corporation
 * 
 * Getting Started with Corporations
 * To get started, visit the City Hall in Sector-12 in order to create a Corporation. 
 * This requires $150b of your own money, but this $150b will get put into your Corporation's funds. 
 * If you're in BitNode 3 you also have option to get seed money from the government in exchange for 500m shares. 
 * Your Corporation can have many different divisions, each in a different Industry. 
 * There are many different types of Industries, each with different properties. 
 * To create your first division, click the 'Expand' (into new Industry) button at the top of the management UI. 
 * The Agriculture industry is recommended for your first division.
 * 
 * The first thing you'll need to do is hire some employees. 
 * Employees can be assigned to five different positions. 
 * Each position has a different effect on various aspects of your Corporation. It is recommended to have at least one employee at each position.
 * 
 * Each industry uses some combination of Materials in order to produce other Materials and/or create Products. 
 * Specific information about this is displayed in each of your divisions' UI.
 * Products are special, industry-specific objects. 
 * They are different than Materials because you must manually choose to develop them, and you can choose to develop any number of Products. 
 * Developing a Product takes time, but a Product typically generates significantly more revenue than any Material. 
 * Not all industries allow you to create Products. 
 * To create a Product, look for a button in the top-left panel of the division UI (e.g. For the Software Industry, the button says 'Develop Software').
 * 
 * To get your supply chain system started, purchase the Materials that your industry needs to produce other Materials/Products. 
 * This can be done by clicking the 'Buy' button next to the corresponding Material(s). 
 * After you have the required Materials, you will immediately start production. 
 * The amount and quality/effective rating of Materials/Products you produce is based on a variety of factors, such as your employees and their productivity and the quality of materials used for production.
 * 
 * Once you start producing Materials/Products, you can sell them in order to start earning revenue. 
 * This can be done by clicking the 'Sell' button next to the corresponding Material or Product. 
 * The amount of Material/Product you sell is dependent on a wide variety of different factors. 
 * In order to produce and sell a Product you'll have to fully develop it first.
 * 
 * These are the basics of getting your Corporation up and running! Now, you can start purchasing upgrades to improve your bottom line. 
 * If you need money, consider looking for seed investors, who will give you money in exchange for stock shares. 
 * Otherwise, once you feel you are ready, take your Corporation public! 
 * Once your Corporation goes public, you can no longer find investors. 
 * Instead, your Corporation will be publicly traded and its stock price will change based on how well it's performing financially. 
 * In order to make money for yourself you can set dividends for a solid reliable income or you can sell your stock shares in order to make quick money.
 * 
 * Tips/Pointers
 * -Start with one division, such as Agriculture. Get it profitable on it's own, then expand to a division that consumes/produces a material that the division you selected produces/consumes.
 * -Materials are profitable, but Products are where the real money is, although if the product had a low development budget or is produced with low quality materials it won't sell well.
 * -The 'Smart Supply' upgrade is extremely useful. Consider purchasing it as soon as possible.
 * -Purchasing Hardware, Robots, AI Cores, and Real Estate can potentially increase your production. The effects of these depend on what industry you are in.
 * -In order to optimize your production, you will need a good balance of all employee positions, about 1/9 should be interning
 * -Quality of materials used for production affects the quality/effective rating of materials/products produced, so vertical integration is important for high profits.
 * -Materials purchased from the open market are always of quality 1.
 * -The price at which you can sell your Materials/Products is highly affected by the quality/effective rating
 * -When developing a product, different employee positions affect the development process differently, some improve the development speed, some improve the rating of the finished product.
 * -If your employees have low morale or energy, their production will greatly suffer. Having enough interns will make sure those stats get high and stay high.
 * -Don't forget to advertise your company. You won't have any business if nobody knows you.
 * -Having company awareness is great, but what's really important is your company's popularity. Try to keep your popularity as high as possible to see the biggest benefit for your sales
 * -Remember, you need to spend money to make money!
 * -Corporations do not reset when installing Augmentations, but they do reset when destroying a BitNode
*/

import { scriptStart, scriptExit, scriptPath } from "lib/scripting"

/** @param {NS} ns */
export async function main(ns) {

    //\\ SCRIPT SETTINGS
    scriptStart(ns)
    ns.tail()

    //\\ GENERAL DATA
    const SCRIPT = scriptPath(ns)
    //\\ FUNCTIONS 
    //\\ LOGIC
}
