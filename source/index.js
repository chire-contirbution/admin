/* ----------------------------------------------------------------------------
      REQUIRE
---------------------------------------------------------------------------- */
var yo = require('yo-yo')
var csjs = require('csjs-inject')
var minixhr = require('minixhr')
var get = require('_get')

var nlp = require('nlp_compromise');
var nlpNgram = require('ngram-nlp');
nlp.plugin(nlpNgram);

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
  'https://scraping-a5a55.firebaseio.com/frontenddeveloperjob@com.json',
  'https://scraping-a5a55.firebaseio.com/jsjobs@org@@!__!q=remote&p=1.json',
  'https://scraping-a5a55.firebaseio.com/freelancermap@com.json',
  'https://scraping-a5a55.firebaseio.com/authenticjobs@com@@!_!onlyremote=1.json',
  //'https://scraping-a5a55.firebaseio.com/simplyhired@com@@search?q=remote!___!web!___!developer&fdb=30.json',
  'https://scraping-a5a55.firebaseio.com/peopleperhour@com@@freelance-javascript-jobs!__!locationFilter=remote.json',
  //'https://scraping-a5a55.firebaseio.com/bountysource@com.json',  //SCRAPED - but no matching DATA
  //'https://scraping-a5a55.firebaseio.com/hnhiring@me.json',
  // 'https://scraping-a5a55.firebaseio.com/cwjobs@co@uk@@jobs@@remote-javascript.json',
  'https://scraping-a5a55.firebaseio.com/careerbuilder@com@@jobs-javascript-remote.json',
  'https://scraping-a5a55.firebaseio.com/freelancer@com@@jobs@@Javascript@@1.json',
  'https://scraping-a5a55.firebaseio.com/jobmote@com@@jobs@@search!__!q=javascript.json',
  'https://scraping-a5a55.firebaseio.com/jobs@github@com@@positions!__!description=JavaScript.json',
  'https://scraping-a5a55.firebaseio.com/jobs@remotive@io@@!__!category=engineering.json',
  'https://scraping-a5a55.firebaseio.com/jobs@smashingmagazine@com@@freelance.json',
  'https://scraping-a5a55.firebaseio.com/news@ycombinator@com@@item!__!id=13301833.json',
  'https://scraping-a5a55.firebaseio.com/reddit@com@@r@@javascript_jobs.json',
  'https://scraping-a5a55.firebaseio.com/reddit@com@@r@@remotejs.json',
  'https://scraping-a5a55.firebaseio.com/remotees@com.json',
  'https://scraping-a5a55.firebaseio.com/remoteok@io@@remote-jobs.json',
  'https://scraping-a5a55.firebaseio.com/remoteworkhub@com@@results@@!__!category=software-application-development&type=&location=anywhere-worldwide.json',
  'https://scraping-a5a55.firebaseio.com/wfh@io@@categories@@1-remote-software-development@@jobs.json',
  'https://scraping-a5a55.firebaseio.com/weworkremotely@com@@categories@@2-programming@@jobs!_!intro.json',
  'https://scraping-a5a55.firebaseio.com/workingnomads@co@@remote-javascript-jobs.json'
]

/* ----------------------------------------------------------------------------
      START PAGE
---------------------------------------------------------------------------- */
var allData = []
for (var i=0, len=urls.length; i<len; i++) { minixhr(urls[i], nextCall) }
function nextCall (data) {
  allData.push(data)
  startPage()
}

function startPage () {
  if (allData.length !== urls.length) return
  var data = []
  allData.forEach(function(dataSet){
    var parsed = getData(dataSet)
    data.push(parsed)
  })
  var html = template(data, urls)
  document.body.appendChild(html)
}


var css = csjs`
  body {
    background-color: ${lightGrey};
  }
  .header {
    padding: 2%;
    margin-left: 3%;
    align-self: display-end;
    color: ${titleColor};
    font-weight: bold;
    font-size: 36px;
  }
  .container {
    background-color: ${white};
    padding: 10px 0;
    margin: 20px 0;
    border: 1px solid #b8b8b8;
    border-radius: 4px;
    box-shadow: 1px 1px 1px rgba(255,255,255,.8);
  }
  .buttons {
    margin-left: 5%;
    line-height: 20px;
    color: ${darkGrey};
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
    padding: 0 5%;
    background-color: ${white};
    border: 1px solid ${grey};
    box-shadow: 0 0 4px rgba(0,0,0,.15);
    font-size: 14px;
    line-height: 20px;
    color: ${darkGrey};
  }
  .raw {
    padding: 50px 8px;
    vertical-align: middle;
    border-bottom: 1px solid ${lightGrey};
  }
  .rawTitle {
    color: ${titleColor};
    font-weight: bold;
    font-size: 16px;
  }
  .rawText {
    color: ${textColor};
  }
`

function template(data,urls){
	return yo`
  <div>
    <div class='${css.header}'>
    Remote JS jobs for WorkingAmigos
    </div>
    <div class='${css.container}'>
      <div class='${css.buttons}'>
        <select class='${css.button}' onchange=${event=>getUrl(event,urls)}>
          ${selectOptions()}
        </select>
      </div>
    </div>
    <div class='${css.table}'>
      ${displayStats(data)}
    </div>
  </div>
  `
}

function displayStats (allPlatforms) {
  var platformsCount
  var jobTitles = []
  allPlatforms.forEach(function (onePlatform){
    platformsCount =  yo`<div>${onePlatform.length}</div>`
    onePlatform.forEach(function (jobPost){
      jobTitles.push(jobTitle =  yo`<div><a href=${jobPost.url||''}>${jobPost.title||'Title missing'}<br></a></div>`)
    })
  })
  allPlatforms = yo`<div>${allPlatforms}</div>`
  return yo`
  <div>
    Number of platforms analysed: ${allPlatforms.length}
    <br><br>
    All jobs: ${platformsCount}
    <br><br>
    ${jobTitles}
  </div>
  `
}

function getUrl (e,urls) {
  var i = e.target.value
  minixhr(urls[i], showJobs)
}

function showJobs (data) {
  var data = getData(data)
  var count = data.length
  var jobs = []
  data.forEach (function (job) {
    var keys = Object.keys(job)
    jobs.push(yo`
      <div class='${css.raw}'>
        <div class='${css.rawTitle}'>
          ${job.title}
        </div>
          ${displayJob(job,keys)}
      </div>
      `)
    })
    function displayJob (job,keys) {
      var body = []
      keys.forEach(function (category){
        //console.log(category)
        body.push(yo`
            <div>
              <br>
                ${category.toUpperCase()}
              <br>
                ${displayCategories(category)}
              <br>
            </div>
          `)
      })
      function displayCategories (category) {
        if (category === 'description') {
          var analysis = analyzeJobs(job[category])
          var rightStack = analysis.rightStack.map(x=>yo`<span>${x.toUpperCase()} </span>`)
          var wrongStack = analysis.wrongStack.map(x=>yo`<span>${x.toUpperCase()} </span>`)
          return yo`
            <div>
              <p>
              Stack (+):<br>
              ${rightStack.length ? rightStack : '/'}
              </p>
              <p>
              Stack (-):<br>
              ${wrongStack.length ? wrongStack : '/'}
              </p>
              <p>
              ${job[category]}
              </p>
            </div>
          `
        } else {
          return yo`
            <div>
              ${job[category]}
            </div>
          `
        }
      }
      //console.log(body)
      return yo `
        <div class='${css.rawText}'>
          ${body}
        </div>
      `
    }
    var newEl = yo`
      <div class='${css.table}'>
        ${jobs}
      </div>
    `
    var el = document.querySelector(`.${css.table}`)
    yo.update(el,newEl)
}

function selectOptions () {
  var buttons = []
  urls.forEach(function (url, index) {
    var URL = get.url(url).slice(0,20)
    buttons.push(
      yo`
      <option value='${index}'>${URL} </option>
      `
    )
  })
  //console.log(buttons)
  return buttons
}

function getData (data) {
    var data = JSON.parse(data)
    var key = Object.keys(data)[0]
    var array = data[key]
    var data = []
    array.forEach(function (obj){
      if (obj) { data.push(obj.item) }
    })
    return data
}

function analyzeJobs (text){
  var t = nlp.text(text);
  var allWords = t.ngram({max_size:2})

  var rightStack = [];
  for (var i=0;i<allWords[0].length;i++) {
    var result = allWords[0][i]
    if (result.word === 'js') { rightStack.push(result.word) }
    if (result.word === 'npm') { rightStack.push(result.word) }
    if (result.word === 'browserify') { rightStack.push(result.word) }
    if (result.word === 'remote') { rightStack.push(result.word) }
    if (result.word === 'javascript') { rightStack.push(result.word) }
    if (result.word === 'java script') { rightStack.push(result.word) }
    if (result.word === 'cordova') { rightStack.push(result.word) }
    if (result.word === 'phonegap') { rightStack.push(result.word) }
    if (result.word === 'electron') { rightStack.push(result.word) }
    if (result.word === 'css') { rightStack.push(result.word) }
    if (result.word === 'front end') { rightStack.push(result.word) }
    if (result.word === 'frontend') { rightStack.push(result.word) }
    if (result.word === 'mobile') { rightStack.push(result.word) }
    if (result.word === 'html') { rightStack.push(result.word) }
    if (result.word === 'svg') { rightStack.push(result.word) }
  }

  var wrongStack = [];
  for (var i=0;i<allWords[0].length;i++) {
    var result = allWords[0][i]
    if (result.word === 'php') { wrongStack.push(result.word) }
    if (result.word === 'jquery') { wrongStack.push(result.word) }
    if (result.word === 'django') { wrongStack.push(result.word) }
    if (result.word === 'python') { wrongStack.push(result.word) }
    if (result.word === 'ruby') { wrongStack.push(result.word) }
    if (result.word === 'rails') { wrongStack.push(result.word) }
    if (result.word === 'java') { wrongStack.push(result.word) }
    if (result.word === 'rust') { wrongStack.push(result.word) }
    if (result.word === 'clojure') { wrongStack.push(result.word) }
    if (result.word === 'elm') { wrongStack.push(result.word) }
    if (result.word === 'coffeescript') { wrongStack.push(result.word) }
    if (result.word === 'wordpress') { wrongStack.push(result.word) }
    if (result.word === 'netsuite') { wrongStack.push(result.word) }
    if (result.word === 'drupal') { wrongStack.push(result.word) }
    if (result.word === 'yoomla') { wrongStack.push(result.word) }
    if (result.word === 'ionic') { wrongStack.push(result.word) }
    if (result.word === 'angular') { wrongStack.push(result.word) }
    if (result.word === 'ember') { wrongStack.push(result.word) }
    if (result.word === 'react') { wrongStack.push(result.word) }
    if (result.word === 'xamarin') { wrongStack.push(result.word) }
  }
  return {rightStack, wrongStack}
}
