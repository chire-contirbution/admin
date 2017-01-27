/* ----------------------------------------------------------------------------
      REQUIRE
---------------------------------------------------------------------------- */
var yo = require('yo-yo')
var csjs = require('csjs-inject')
var minixhr = require('minixhr')

/* ----------------------------------------------------------------------------
      COLORS
---------------------------------------------------------------------------- */
var titleColor = '#1f8cbe'
var textColor = '#3c3c3c'
var grey = '#cbcbcb'
var lightGrey = '#dedede'
var darkGrey = '#333'

/* ----------------------------------------------------------------------------
      DATABASE URLS
---------------------------------------------------------------------------- */
var urls = ['https://scraping-a5a55.firebaseio.com/authenticjobs@com@@!_!onlyremote=1.json']
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
  .table {
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
  <div class='${css.table}'>
  	${displayRaws(data)}
  </div>
  `
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
          ${job[1]}
    			${job[2]}
    			${job[3]}
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
