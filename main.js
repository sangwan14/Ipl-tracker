const axios = require("axios");
const cheerio = require("cheerio");
const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/chennai-super-kings-vs-kings-xi-punjab-53rd-match-1216506/full-scorecard";

console.log("Before");
axios.get(url)
.then(response => {
  // Load the HTML into cheerio
  const $ = cheerio.load(response.data);

  // Find the element that contains the player of the match
  const player = $("div.ds-text-eyebrow-xs.ds-uppercase.ds-text-typo-mid3:contains('Player Of The Match')").first().next().find("a > span").text();

  //Player Of The Match
  console.log("Player of the match:", player);

 // Find the element that contains the winning team name
 const winner = $("div*[class*='ci-team-score ds-flex ds-justify-between ds-items-center ds-text-typo ds-mb-2']").find("a > span").text();

 console.log("Winning Team:", winner); 

 const inningsArr = $(".ds-rounded-lg.ds-mt-2");

 for(let i=0; i<inningsArr.length; i++){
  //team name
  let teamNameElem = $(inningsArr[i]).find(".ds-text-title-xs.ds-font-bold.ds-capitalize");
  let teamName = teamNameElem.text();
  teamName = teamName.split("INNINGS")[0];
  teamName = teamName.trim();

  // table batsman
  let tableElem = $(inningsArr[i]).find(".ds-w-full.ds-table.ds-table-md.ds-table-auto.ci-scorecard-table");
  let allBatsMan = $(tableElem).find("tr:not(.ds-hidden)");
  for (let j = 0; j < allBatsMan.length; j++) {
      let firstCol = $(allBatsMan[j]).find("td").first();
      let isbatsManCol = $(firstCol).hasClass("ds-flex");
      if (isbatsManCol == true) {
          let href = $(firstCol).find("a").attr("href");
          let name = $(firstCol).text();
          console.log(name);
          let fullLink = "https://www.espncricinfo.com" + href;
          // console.log(fullLink);
          getBirthdaypage(fullLink, name, teamName);
      }

  }
 }
})
.catch(error => {
  // Handle any errors
  console.error(error);
});

function getBirthdaypage(url, name, teamName) {
  axios.get(url)
  .then(response => {
    extractBirthDay(response.data, name, teamName);
  })
  .catch(error => {
    console.error(error);
  });     
}

function extractBirthDay(html, name, teamName) {
  let $ = cheerio.load(html);
  let birthDay = $(".ds-text-tight-m.ds-font-regular.ds-uppercase.ds-text-typo-mid3:contains('Born')").next().text();
  console.log(`${name} plays for ${teamName} was born on ${birthDay}`);
}
