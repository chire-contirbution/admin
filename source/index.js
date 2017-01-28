/* ----------------------------------------------------------------------------
      REQUIRE
---------------------------------------------------------------------------- */
var yo = require('yo-yo')
var csjs = require('csjs-inject')
var minixhr = require('minixhr')
var get = require('_get')
/* ----------------------------------------------------------------------------
      COLORS
---------------------------------------------------------------------------- */
var titleColor = '#1f8cbe'
var textColor = '#3c3c3c'
var grey = '#cbcbcb'
var lightGrey = '#dedede'
var darkGrey = '#333'
var white = '#fafafa'
/* ----------------------------------------------------------------------------
      DATABASE URLS
---------------------------------------------------------------------------- */
var urls = [
  'https://scraping-a5a55.firebaseio.com/authenticjobs@com@@!_!onlyremote=1.json',
  'https://scraping-a5a55.firebaseio.com/bountysource@com.json',
  'https://scraping-a5a55.firebaseio.com/careerbuilder@com@@jobs-javascript-remote.json',
  'https://scraping-a5a55.firebaseio.com/freelancer@com@@jobs@@Javascript@@1.json',
  'https://scraping-a5a55.firebaseio.com/frontenddeveloperjob@com.json',
  'https://scraping-a5a55.firebaseio.com/jobmote@com@@jobs@@search!__!q=javascript.json',
  'https://scraping-a5a55.firebaseio.com/jobs@github@com@@positions!__!description=JavaScript.json',
  'https://scraping-a5a55.firebaseio.com/jobs@remotive@io@@!__!category=engineering.json',
  'https://scraping-a5a55.firebaseio.com/jobs@smashingmagazine@com@@freelance.json',
  'https://scraping-a5a55.firebaseio.com/jsjobs@org@@!__!q=remote&p=1.json',
  'https://scraping-a5a55.firebaseio.com/news@ycombinator@com@@item!__!id=13301833.json',
  'https://scraping-a5a55.firebaseio.com/reddit@com@@r@@javascript_jobs.json',
  'https://scraping-a5a55.firebaseio.com/reddit@com@@r@@remotejs.json',
  'https://scraping-a5a55.firebaseio.com/remotees@com.json',
  'https://scraping-a5a55.firebaseio.com/remoteok@io@@remote-jobs.json',
  'https://scraping-a5a55.firebaseio.com/remoteworkhub@com@@results@@!__!category=software-application-development&type=&location=anywhere-worldwide.json',
  'https://scraping-a5a55.firebaseio.com/wfh@io@@categories@@1-remote-software-development@@jobs.json',
  'https://scraping-a5a55.firebaseio.com/workingnomads@co@@remote-javascript-jobs.json'
]

var url = urls[0]

/* ----------------------------------------------------------------------------
      START PAGE
---------------------------------------------------------------------------- */
minixhr(url, startPage)

function startPage(data) {
  var parsedData = getData(data)
  var html = template(parsedData)
  document.body.appendChild(html)
}

var css = csjs`
  body {
    background-color: ${lightGrey};
  }
  .container {
    background-color: ${white};
    padding: 10px 0 10 0;
    margin: 20px 0 20px 0;
    border: 1px solid #b8b8b8;
    border-radius: 4px;
    box-shadow: 1px 1px 1px rgba(255,255,255,.8);
  }
  .buttons {
    line-height: 20px;
    color: ${darkGrey};
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .button {
    font-size: 14px;
    margin: 7px;
    padding: 4px;
    border: 1px solid #b8b8b8;
    border-radius: 4px;
    box-shadow: 1px 1px 1px rgba(255,255,255,.8);
    text-align: center;
  }
  .button:hover {
    color: black;
    background-color: ${lightGrey};
  }
  .table {
    background-color: ${white};
    border: 1px solid ${grey};
    box-shadow: 0 0 4px rgba(0,0,0,.15);
    font-size: 14px;
    line-height: 20px;
    color: ${darkGrey};
  }
  .raw {
    padding: 10px 8px;
    vertical-align: middle;
    border-bottom: 1px solid ${lightGrey};
  }
  .rawTitle {
    color: ${titleColor};
    font-weight: bold;
  }
  .rawText {
    color: ${textColor};
  }
`

function template(data){
	return yo`
  <div>
    <div class='${css.container}'>
      <div class='${css.buttons}'>
        <select class='${css.button}'>
          ${showButton()}
        </select>
      </div>
    </div>
    <div class='${css.table}'>
    	${displayRaws(data)}
    </div>
  </div>
  `
}

function showButton () {
  var buttons = []
  urls.forEach(function (url) {
    var URL = get.url(url).slice(0,20)
    buttons.push(
      yo`
        <option value="${URL}">${URL}</option>
      `
    )
  })
  return buttons
}
function displayRaws (data) {
  var jobs = []
	data.forEach (function (job) {
    jobs.push(yo`
    	<div class='${css.raw}'>
        <div class='${css.rawTitle}'>
          ${job[0]}
        </div>
        <div class='${css.rawText}'>
          ${job[1]}<br>
    			${job[2]}<br>
    			${job[3]}<br>
          ${job[4]}<br>
          ${job[5]}<br>
          ${job[6]}<br>
        </div>
      </div>
    `)
  })
  return jobs
}

function getData (data) {
    var data = JSON.parse(data)
    var key = Object.keys(data)[0]
    var array = data[key]
    var data = []
    array.forEach(function (obj){
      data.push(obj.raw)
    })
    return data
}
