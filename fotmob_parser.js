const axios = require('axios');
const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const link = 'https://www.theguardian.com/football/bundesligafootball/table';


function parser() {
  let teamsLeague = [];
  axios.get(link).then((response) => {
    const dom = new JSDOM(response.data);
    const table = dom.window.document.querySelectorAll("table.table--league-table > tbody > tr");

    table.forEach((team, teamIndex) => {
      const teamDataHtml = team.querySelectorAll('td');
      let teamData = {
        position: null,
        logoLink: null,
        teamName: null,
        games: null,
        won: null,
        drawn: null,
        lost: null,
        gaolsFor: null,
        goalsAgainst: null,
        goalsDifference: null,
        points: null,
      }

      let counter = 0;
      
      for (const key in teamData) {
        if(counter == 0) {
          teamData[key] = teamDataHtml[counter].innerHTML;
          counter++;
        }
        else if (counter == 1) {
          const logoLink = teamDataHtml[counter].querySelector('span > img').src;
          teamData[key] = logoLink;
          counter++;
        }
        else if (counter == 2) {
          const teamName = teamDataHtml[counter - 1].querySelector('span > a').innerHTML.trim();
          teamData[key] = teamName;
          counter++;
        }
        else if(counter == 10) {
          teamData[key] = teamDataHtml[counter - 1].querySelector('b').innerHTML;
        }
        else {
          teamData[key] = teamDataHtml[counter - 1].innerHTML
          counter++;
        }
      }
      teamsLeague.push(teamData);
      // console.log('teamsLeague: ', teamsLeague);

    });

    fs.writeFile('test.json', JSON.stringify(teamsLeague), err => {
      if (err) {
        console.error(err);
      }
    });
    
  }).catch((err) => {
    console.log('Error:', err);
  });
}

parser();



