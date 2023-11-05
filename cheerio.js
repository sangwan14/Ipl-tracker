const cheerio = require('cheerio');
const html = '<span><span>KL Rahul<!-- -->&nbsp;<span>(c)†</span></span></span>';

const $ = cheerio.load(html);
const batsmanName = $('span').first().contents().filter(function(_,el) {
  return el.nodeType === 3; // filter out non-text nodes
}).text().trim();

console.log(batsmanName); // Output: "KL Rahul"
