
console.log = () => {}

useBinance = true // use binance stream if true

openhour = {} // for caching this, looked up by symbol

const wsTickerArr = new WebSocket( 'wss://fstream.binance.com/ws/!ticker@arr' )

let binanceSymbolSet = new Set() // to avoid duplicates use Set not Array

wsTickerArr.addEventListener( 'message', e => {

  let data = JSON.parse( e.data ) || {};

  //console.info("got data = " + JSON.stringify(data, null, 2))

  for (let i = 0; i < data.length; i++) {
     let fullsym = data[i].s
     let shortsym = fullsym.replace(/USDT$/, '')
     binanceSymbolSet.add(shortsym)
  }

  console.info("binance symbol set is now size " + binanceSymbolSet.size)

  // see:  https://2ality.com/2015/01/es6-set-operations.html

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set

  function union(setA, setB) {
    let _union = new Set(setA)
    for (let elem of setB) {
        _union.add(elem)
    }
    return _union
}

  function intersection(setA, setB) {
    let _intersection = new Set()
    for (let elem of setB) {
        if (setA.has(elem)) {
            _intersection.add(elem)
        }
    }
    return _intersection
  }

  // a should be the bigger set 

  function difference(setA, setB) {
    let _difference = new Set(setA)
    for (let elem of setB) {
        _difference.delete(elem)
    }
    return _difference
  }

  if (window.allSymbols) {
    console.info("orig symbol set is size " + window.allSymbols.length)

    // combine symbol sets eliminating duplicates
    let origSet = new Set(window.allSymbols)

    let oldPlusNewSymbols = union(origSet, binanceSymbolSet)

    console.info("combined symbol set is size " + oldPlusNewSymbols.size)

    let template = document.getElementById("onestream")
   
    let newSymbolSet = difference(oldPlusNewSymbols, origSet)

    console.info("newSymbolSet count = " + newSymbolSet.size)

    let newSymbols = Array.from(newSymbolSet)

    console.info("should make " + newSymbols.length + " more tiles")

    // make new tiles for new symbols that binance finds

    for (let i = 0; i < newSymbols.length; i++) {

      let newIndex = window.allSymbols.length + i

      let clone = template.cloneNode(true) // clone children also e.g. the numbers and text in the tile

      clone.style.display = 'inline-block'

      clone.className = clone.className + newIndex.toString() // now the main class name will be like onesymbol0, onesymbol1, etc

      clone.id = clone.id + newIndex.toString()

      document.body.appendChild(clone) // add this child to the main body of the page

   }

   window.allSymbols = Array.from(oldPlusNewSymbols)

   // for user display, show all the new binance symbols flowing in
   let allNewSymbols = difference(new Set(window.allSymbols), new Set(window.origSymbolList))

   let annotation = document.getElementById("newBinanceSymbols")

   let annotationOut = 'new Binance symbols:  '

   let allNewSymbolsArray = Array.from(allNewSymbols)

   for (let i = 0; i < allNewSymbolsArray.length; i++)
     annotationOut = annotationOut + ' ' + allNewSymbolsArray[i]

   annotation.innerText = annotationOut

   if (allNewSymbolsArray.length > 0) {
     window.bws.close() // close old data stream
     connect() // re-open w/ new symbol set
   }

  }

})




// function updateClock() {
 //  var timeElement = document.getElementById('timeOut');
 //  var time = new Date();
 //  timeElement.innerHTML = time.toLocaleString();

 //}


function daynightToggle() {
  var element = document.body;
  element.classList.toggle("dark-mode");
}

function onloadicon(e) {
  console.info("onloadicon e = " + e)
  e.style.opacity = 1;
}

function findGetParameter(parameterName) {
  var result = null,
  tmp = [];
  location.search.
  substr(1).
  split("&").
  forEach(function (item) {
    tmp = item.split("=");
    if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
  });
  return result;
}



const el = document.getElementById( 'ticker' );
const symbol = document.getElementById( 'symbol' );
const open = document.getElementById( 'open' );
const high = document.getElementById( 'high' );
const low = document.getElementById( 'low' );
const vol = document.getElementById( 'vol' );
const close = document.getElementById( 'close' );
const change = document.getElementById( 'change' );
const percent = document.getElementById( 'percent' );
const bid = document.getElementById( 'bid' );
const ask = document.getElementById( 'ask' );
const Percent = document.getElementById( 'Percent' );
const Quantity = document.getElementById( 'Quantity' );
const Bid = document.getElementById( 'Bid' );
const Ask = document.getElementById( 'Ask' );
const bidask = document.getElementById( 'bidask' );
const bidaskpct = document.getElementById( 'bidaskpct' );
const usvol = document.getElementById( 'usvol' );
const rangevol = document.getElementById( 'rangevol' );
const coinIcon = document.getElementById( 'coinIcon' );

 if (!coinIcon.assigned) {// avoid doing this every time if it is already assigned, could be a slow call
      coinIcon.src =    'https://coinicon2.s3.us-east-2.amazonaws.com/BTC.png'      //imageUrlTable[sym]
      coinIcon.assigned = true // hack
    }

const ws = new WebSocket( 'wss://stream.binance.com:9443/ws/btcusdt@ticker' );


ws.addEventListener( 'message', e => {

  let data = JSON.parse( e.data ) || {};
  let { s,p,P,o,h,l,v,q,c,b,a,w,Q,B,A } = data;

  el.textContent = 'BinanceSpot: ' + Number( c ).toFixed( 5 );
  symbol.textContent = 'Symbol: '+ s
  open.textContent = 'PrevClose '+ Number( o ).toFixed( 3 );
  high.textContent = 'H$'+ Number( h ).toFixed(0);
  low.textContent = 'L$'+ Number( l ).toFixed(0);
  vol.textContent = Number( v/1000 ).toFixed(1) + 'k';
  usvol.textContent = '$'+ Number( q/1000000000 ).toFixed(2)+'b';
  close.textContent = '$'+ Number(c).toFixed(0);
  change.textContent = 'Chg: '+ Number(p).toFixed( 3 );
  percent.textContent = Number(P).toFixed( 2 )+'%';
  bid.textContent = 'Bid $' + Number(b).toFixed( 2 );
  ask.textContent = 'Ask $' + Number(a).toFixed( 2);
  Bid.textContent = 'x ' + Number(B);
  Ask.textContent = 'x ' + Number(A);
  bidask.textContent = '$' + Number(a-b).toFixed(3)+'  ';
  bidaskpct.textContent = 'Bid-Ask%: ' + Number((a-b)*100/c).toFixed(7)+"%";
  rangevol.textContent = Number(((h-l)/w)*100).toFixed( 2 )+'%';


  change.rawfloat = Number(c-o).toFixed( 8 );

      if (Number(p) > 0) {
        change.textContent = 'Chg: +'+ Number(p).toFixed( 3 );
        percent.textContent = '+'+ Number(P).toFixed( 2 )+'%';
        change.style.color = 'lime'
        percent.style.color = 'lime'


     } else {
         change.textContent = 'Chg: $'+ Number(p).toFixed( 3 );
         percent.textContent = Number(P).toFixed( 2 )+'%';
         change.style.color = 'red'
         percent.style.color = 'red'
     }
});



const wsTickerArr = new WebSocket( 'wss://fstream.binance.com/ws/!ticker@arr' )

let binanceSymbolSet = new Set() // to avoid duplicates use Set not Array

wsTickerArr.addEventListener( 'message', e => {

  let data = JSON.parse( e.data ) || {};

  //console.info("got data = " + JSON.stringify(data, null, 2))

  for (let i = 0; i < data.length; i++) {
     let fullsym = data[i].s
     let shortsym = fullsym.replace(/USDT$/, '')
     binanceSymbolSet.add(shortsym)
  }

  console.info("binance symbol set is now size " + binanceSymbolSet.size)

  // see:  https://2ality.com/2015/01/es6-set-operations.html

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set

  function union(setA, setB) {
    let _union = new Set(setA)
    for (let elem of setB) {
        _union.add(elem)
    }
    return _union
}

  function intersection(setA, setB) {
    let _intersection = new Set()
    for (let elem of setB) {
        if (setA.has(elem)) {
            _intersection.add(elem)
        }
    }
    return _intersection
  }

  // a should be the bigger set 

  function difference(setA, setB) {
    let _difference = new Set(setA)
    for (let elem of setB) {
        _difference.delete(elem)
    }
    return _difference
  }

  if (window.allSymbols) {
    console.info("orig symbol set is size " + window.allSymbols.length)

    // combine symbol sets eliminating duplicates
    let origSet = new Set(window.allSymbols)

    let oldPlusNewSymbols = union(origSet, binanceSymbolSet)

    console.info("combined symbol set is size " + oldPlusNewSymbols.size)

    let template = document.getElementById("onestream")
   
    let newSymbolSet = difference(oldPlusNewSymbols, origSet)

    console.info("newSymbolSet count = " + newSymbolSet.size)

    let newSymbols = Array.from(newSymbolSet)

    console.info("should make " + newSymbols.length + " more tiles")

    // make new tiles for new symbols that binance finds

    for (let i = 0; i < newSymbols.length; i++) {

      let newIndex = window.allSymbols.length + i

      let clone = template.cloneNode(true) // clone children also e.g. the numbers and text in the tile

      clone.style.display = 'inline-block'

      clone.className = clone.className + newIndex.toString() // now the main class name will be like onesymbol0, onesymbol1, etc

      clone.id = clone.id + newIndex.toString()

      document.body.appendChild(clone) // add this child to the main body of the page

   }

   window.allSymbols = Array.from(oldPlusNewSymbols)

   // for user display, show all the new binance symbols flowing in
   let allNewSymbols = difference(new Set(window.allSymbols), new Set(window.origSymbolList))

   let annotation = document.getElementById("newBinanceSymbols")

   let annotationOut = 'new Binance symbols:  '

   let allNewSymbolsArray = Array.from(allNewSymbols)

   for (let i = 0; i < allNewSymbolsArray.length; i++)
     annotationOut = annotationOut + ' ' + allNewSymbolsArray[i]

   annotation.innerText = annotationOut

   if (allNewSymbolsArray.length > 0) {
     window.bws.close() // close old data stream
     connect() // re-open w/ new symbol set
   }

  }

})






  function generateCSV() {
    console.log("generate csv")

    var allSymbols = window.allSymbols

    var allTilesUnsorted = []

    // start with header row dont forget return character at end
    let allrows = 'Symbol,Name,Sector,Rank,MarketCap,Volume,RelVol1D,Price,Change,Today1D,Hour1H,Week1W,Month1M,Quarter3M,YTD,TradeLink,NewsChart,Url,CMCLink,Description,Tags,AvgVol,Circulating,Slug,CoinToken\n'

    for (var i = 0; i < allSymbols.length; i++) {

      var e = document.getElementById("onestream" + i.toString())

      var Symbol = e.querySelector("#symOut").innerHTML
      var Name = e.querySelector("#nameOut").innerHTML
      var Rank = e.querySelector("#cmcrank2Out").innerHTML
      var Sector = e.querySelector("#sectorOut").innerHTML
      var MarketCap = e.querySelector("#mktcapOut").rawFloat
      var Volume = e.querySelector("#totalvolOut").rawFloat
      var AvgVol = e.querySelector("#avgvolOut").rawFloat
      var RelVol1D = e.querySelector("#relvol1dOut").innerHTML
      var RelVol1H = e.querySelector("#relvol1hOut").innerHTML
      var Price = e.querySelector("#priceOut").innerHTML
      var Change = e.querySelector("#changeOut").innerHTML
      var Today1D = e.querySelector("#percentOut").innerHTML // percent change shown with percent
      var Hour1H = e.querySelector("#hour2Out").innerHTML // percent change shown with percent
      var Week1W = e.querySelector("#week2Out").innerHTML // percent change shown with percent
      var Month1M = e.querySelector("#month2Out").innerHTML // percent change shown with percent
      var Quarter3M = e.querySelector("#quarter2Out").innerHTML // percent change shown with percent
      var YTD = e.querySelector("#ytd2Out").innerHTML
      var Circulating = e.querySelector("#cmccirculating2Out").innerHTML
      var Url = e.querySelector("#urlOut").innerHTML
      var Description = e.querySelector("#descriptionOut").innerHTML
      var Tags = e.querySelector("#cmctag2Out").innerHTML
      var TradeLink = e.querySelector("#tradelinkOut").innerHTML
      var NewsChart = e.querySelector("#abxOut").innerHTML
      var CMCLink = e.querySelector("#cmclinkOut").innerHTML
      var Slug = e.querySelector("#cmcslug2Out").innerHTML
      var CoinToken = e.querySelector("#cointokenOut").innerHTML



      // note:  if you want the symbols like $ and % and up / down arrows, you can use .innerHTML
      // for raw numbers no decoration symbols use .rawFloat
      // raw numbers are more useful for statistical analysis

      // each row is output as a formatted string, note the back quotes around it and the ${ } around
      // variable names
      var row = `${Symbol},${Name},${Sector},${Rank},${MarketCap},${Volume},${RelVol1D},${Price},${Change},${Today1D},${Hour1H},${Week1W},${Month1M},${Quarter3M},${YTD},${TradeLink},${NewsChart},${Url},${CMCLink},${Description},${Tags},${AvgVol},${Circulating},${Slug},${CoinToken}\n`
      allrows = allrows + row
    }

    // for debugging
    console.log(allrows)

    var link;

    link = document.getElementById("link")
    link.href = "data:text/csv," + encodeURIComponent(allrows)
    link.download = "CryptoData.csv"
    link.target = "_blank"
    link.textContent = "tap to download CryptoData.csv"

    link.click() // trigger download

  }




  function sortTiles(byWhat) {

    var allSymbols = window.allSymbols

    var allTilesUnsorted = []

    for (var i = 0; i < allSymbols.length; i++) {

      var e = document.getElementById("onestream" + i.toString())

/*

      var key = e.querySelector("#percentOut").innerHTML // default sort by percent change

      if (byWhat == "Year to date %") // trial year to date % change
        key = e.querySelector("#ytd2Out").innerHTML
      if (byWhat == "Week %") // trial 1 week % change
        key = e.querySelector("#week2Out").rawFloat
      if (byWhat == "Hour %") // trial 1 hour % change
        key = e.querySelector("#hour2Out").innerHTML
      if (byWhat == "Month %") // trial 1 month % change
        key = e.querySelector("#month2Out").rawFloat
      if (byWhat == "Quarter %") // trial 1 quarter % change
        key = e.querySelector("#quarter2Out").rawFloat
      if (byWhat == "MarketCap") // trial mktcap change
        key = e.querySelector("#mktcapOut").innerHTML
      if (byWhat == "Volume1D") // trial 1dvolumechange
        key = e.querySelector("#totalvolOut").innerHTML
      if (byWhat == "Volume1H") // trial 1hvolumechange
        key = e.querySelector("#vol1hOut").innerHTML
      if (byWhat == "RelativeVolume1H") // trial 1hvolumechange
        key = e.querySelector("#relvol1hOut").innerHTML
      if (byWhat == "RelativeVolume1D") // trial 1dvolumechange
        key = e.querySelector("#relvol1dOut").innerHTML

*/


      var key = e.querySelector("#percentOut").rawFloat // default sort by percent change

      if (byWhat == "YTD") // trial year to date % change
        key = e.querySelector("#ytd2Out").rawFloat
      if (byWhat == "Hour") // trial hour % change
        key = e.querySelector("#hour2Out").rawFloat
     if (byWhat == "Week") // trial week % change
        key = e.querySelector("#week2Out").rawFloat
     if (byWhat == "Month") // trial month % change
        key = e.querySelector("#month2Out").rawFloat
     if (byWhat == "Quarter") // trial month % change
        key = e.querySelector("#quarter2Out").rawFloat
      if (byWhat == "MarketCap") // trial mktcap change
        key = e.querySelector("#mktcapOut").rawFloat
      if (byWhat == "Volume1D") // trial 1dvolume change
        key = e.querySelector("#totalvolOut").rawFloat
      if (byWhat == "Volume1H") // trial 1hvolume change
        key = e.querySelector("#vol1hOut").rawFloat
      if (byWhat == "RelativeVolume1H") // trial 1hrelvolume change
        key = e.querySelector("#relvol1hOut").rawFloat
      if (byWhat == "RelativeVolume1D") // trial 1dvolume change
        key = e.querySelector("#relvol1dOut").rawFloat
     if (byWhat == "Volatility") // trial 1dvolatility change
        key = e.querySelector("#volatility24Out").rawFloat
     if (byWhat == "VolumeUSDM") // trial 1dvolatility change
        key = e.querySelector("#volOut").rawFloat


      if (false) {

            // get rid of non numeric characters
            key = key.replace('%', '')

            //key = key.replace(/[^\d.-]/gM, '') // get rid of non numeric except dot this works except now we lose our sign up / down arrow

            var keysign = 1;

            if (key.match('▾')) keysign = -1; // doesnt work

            // the up arrow just in case
            // ▴

            key = key.replace(/[^\d.-]/g, '') // get rid of non numeric

            key = keysign * key // re-apply the numeric sign not symbolic

      }

      console.log("key is now " + key)

      //key = key.replace("&#x25B4;", '') // up and down triangles
      //key = key.replace("&#x25BE;", '')

      allTilesUnsorted.push({"tileElement" : e, "origIndex" : i, "sortKey" : key})

      //var clone = template.cloneNode(true) // clone children also e.g. the numbers and text in the tile

      //clone.className = clone.className + i.toString() // now the main class name will be like onesymbol0, onesymbol1, etc

      //clone.id = clone.id + i.toString()

      //var e = document.getElementById("sortDropdown")

      // document.body.appendChild(clone) // add this child to the main body of the page

    }

    let sortedTiles = allTilesUnsorted.sort(function(a, b){return -(a.sortKey - b.sortKey)})

    console.log("sorted tiles " + JSON.stringify(sortedTiles))

    for (var i = 0; i < allSymbols.length; i++) { // should move them or do we have to remove them first?
      document.body.appendChild(sortedTiles[i].tileElement)
    }
  }

  function sortDidChange(x) { // no X have to get from selector
      console.log("sort did change x = " + JSON.stringify(x)) // nothing
      var e = document.getElementById("sortDropdown")
      window.STSortValue = e.value // store global for now; undefined should do first item in list (winners in our test case)
      sortTiles(e.value)
  }

  function mapDidChange(x) { // no X have to get from selector
      console.log("map did change x = " + JSON.stringify(x)) // nothing
      var e = document.getElementById("mapDropdown")
      window.STMapValue = e.value // store global for now; undefined should do first item in list (winners in our test case)
      // just trigger a redraw?
      refreshTiles()
  }


  function sizeDidChange(x) {
    var e = document.getElementById("sizeDropdown")
    window.STSizeValue = e.value
    refreshTiles() 
  }

  function animDidChange(x) {
    var e = document.getElementById("animDropdown")
    window.STSAnimValue = e.value // default undef should be ZoomAnimOff
  }



 function refreshTiles() {

    var allSymbols = window.allSymbols

    for (var i = 0; i < allSymbols.length; i++) {
      var e = document.getElementById("onestream" + i.toString())
      if (e.lastMessage)
        onStreamMessage(e.lastMessage)
    }

  }



  // compute and send to display
  function computeAggregates() { // starting w/ avg % change not weighted by mktcap

    let timeNow = Date.now()
    if (window.lastAggComputeTime) {
      let timeDelta = timeNow - window.lastAggComputeTime
      if (timeDelta < 200) return // millisec, dont recompute so often
    }
    window.lastAggComputeTime = Date.now()


    var allSymbols = window.allSymbols

    var sumPercent = 0
    var sumweek2 = 0
    var summonth2 = 0
    var sumquarter2 = 0
    var sumytd2 = 0
    var sumyear12 = 0
    var sumrelvol1d = 0
    var sumvolatility24 = 0
    var sumhour2 = 0
    var ndata = 0

    for (var i = 0; i < allSymbols.length; i++) {
      var e = document.getElementById("onestream" + i.toString())

      // cache the queries for speed

      e.percentOut = e.percentOut ? e.percentOut : (e.percentOut = e.querySelector("#percentOut"))
      e.week2Out =  e.week2Out ? e.week2Out : (e.week2Out = e.querySelector("#week2Out"))
      e.month2Out = e.month2Out ? e.month2Out : (e.month2Out = e.querySelector("#month2Out"))
      e.quarter2Out = e.quarter2Out ? e.quarter2Out : (e.quarter2Out = e.querySelector("#quarter2Out"))
      e.ytd2Out = e.ytd2Out ? e.ytd2Out : (e.ytd2Out = e.querySelector("#ytd2Out"))
      e.year12Out = e.year12Out ? e.year12Out : (e.year12Out = e.querySelector("#year12Out"))
      e.relvol1dOut = e.relvol1dOut ? e.relvol1dOut : (e.relvol1dOut = e.querySelector("#relvol1dOut"))
      e.volatility24Out = e.volatility24Out ? e.volatility24Out : (e.volatility24Out = e.querySelector("#volatility24Out"))
      e.hour2Avg = e.hour2Avg ? e.hour2Avg : (e.hour2Avg = e.querySelector("#hour2Out"))

      var thisAvg = e.percentOut.rawFloat
      var week2Avg = e.week2Out.rawFloat
      var month2Avg = e.month2Out.rawFloat
      var quarter2Avg = e.quarter2Out.rawFloat
      var ytd2Avg = e.ytd2Out.rawFloat
      var year12Avg = e.year12Out.rawFloat
      var relvol1dAvg = e.relvol1dOut.rawFloat
      var volatility24Avg = e.volatility24Out.rawFloat
      var hour2Avg = e.hour2Avg.rawFloat

      if (typeof thisAvg != 'undefined' && !isNaN(thisAvg)) {
        sumPercent += parseFloat(thisAvg)
        sumweek2 += parseFloat(week2Avg)
        summonth2 += parseFloat(month2Avg)
        sumquarter2 += parseFloat(quarter2Avg)
        sumytd2 += parseFloat(ytd2Avg)
        sumyear12 += parseFloat(year12Avg)
        sumrelvol1d += parseFloat(relvol1dAvg)
        sumvolatility24 += parseFloat(volatility24Avg)
        sumhour2 += parseFloat(hour2Avg)
        console.log("sumPercent is now " + sumPercent + " from thisAvg " + thisAvg)
        console.log("sumweek2 is now " + sumweek2 + " from week2Avg " + week2Avg)
        console.log("summonth2 is now " + summonth2 + " from month2Avg " + month2Avg)
        console.log("sumquarter2 is now " + sumquarter2 + " from quarter2Avg " + quarter2Avg)
        console.log("sumytd2 is now " + sumytd2 + " from ytd2Avg " + ytd2Avg)
        console.log("sumyear12 is now " + sumyear12 + " from year12Avg " + year12Avg)
        console.log("sumrelvol1d is now " + sumrelvol1d + " from relvol1dAvg " + relvol1dAvg)
        console.log("sumvolatility24 is now " + sumvolatility24 + " from volatility24Avg " + volatility24Avg)
        console.log("sumhour2 is now " + sumhour2 + " from hour2Avg " + hour2Avg)
        ndata += 1
      }
    }


    document.getElementById("numberData").innerHTML = "Set: " + ndata

    var avgPercent = (sumPercent/ndata).toFixed(1)

    var avgweek2 = (sumweek2/ndata).toFixed(1)

    var avgmonth2 = (summonth2/ndata).toFixed(1)

    var avgquarter2 = (sumquarter2/ndata).toFixed(1)

    var avgytd2 = Math.round(sumytd2/ndata)

    var avgyear12 = Math.round(sumyear12/ndata)

    var avgrelvol1d = Math.round(sumrelvol1d/ndata)

    var avgvolatility24 = (sumvolatility24/ndata).toFixed(2)

    var avghour2 = (sumhour2/ndata).toFixed(3)


    document.getElementById("averagePercentChange").innerHTML = "1D: " + avgPercent + "%"


    if (avgPercent > 0) {
      document.getElementById("averagePercentChange").style.color = 'lime'
      document.getElementById("averagePercentChange").innerHTML = "1D "  + '<i class="fas fa-arrow-up"></i>' + "+" + avgPercent + "%"


     } else {
      document.getElementById("averagePercentChange").style.color = 'red'
      document.getElementById("averagePercentChange").innerHTML = " 1D " + '<i class="fas fa-arrow-down"></i>' + avgPercent + "%"

     }

    document.getElementById("averagerelvol1dChange").innerHTML = "RelVol1D " + avgrelvol1d + "%"

    if (avgrelvol1d > 120) {
      document.getElementById("averagerelvol1dChange").style.color = 'magenta'
      document.getElementById("averagerelvol1dChange").innerHTML = "RelVol " + '<i class="fa-solid fa-fire-flame-curved"></i>' + avgrelvol1d + "%" 


     } else {
      document.getElementById("averagerelvol1dChange").style.color = '#1998ff'
      document.getElementById("averagerelvol1dChange").innerHTML = "RelVol " + '<i class="fas fa-tint"></i>' + avgrelvol1d + "%"

     }



    document.getElementById("averagevolatility24Change").innerHTML = "Avg V&#963;: " + avgvolatility24 + "%"

    if (avgvolatility24 > 5) {
      document.getElementById("averagevolatility24Change").style.color = 'magenta'
      document.getElementById("averagevolatility24Change").innerHTML = "Volatility " + avgvolatility24 + "%"


     } else {
      document.getElementById("averagevolatility24Change").style.color = 'cyan'
      document.getElementById("averagevolatility24Change").innerHTML = "Volatility " + avgvolatility24 + "%"

     }



    document.getElementById("averageweek2Change").innerHTML = "1W " + avgweek2 + "%"

    if (avgweek2 > 0) {
      document.getElementById("averageweek2Change").style.color = '#1bcc38'
      document.getElementById("averageweek2Change").innerHTML = "1W " + '<i class="fas fa-arrow-up"></i>' + ("+" + avgweek2 + "%")


     } else {
      document.getElementById("averageweek2Change").style.color = 'red'
      document.getElementById("averageweek2Change").innerHTML = "1W " +  '<i class="fas fa-arrow-down"></i>' + avgweek2 + "%"

     }


    document.getElementById("averagemonth2Change").innerHTML = "1M: " + avgmonth2 + "%"

    if (avgmonth2 > 0) {
      document.getElementById("averagemonth2Change").style.color = '#1bcc38'
      document.getElementById("averagemonth2Change").innerHTML = "1M " +  '<i class="fas fa-arrow-up"></i>' + "+" + avgmonth2 + "%"


     } else {
      document.getElementById("averagemonth2Change").style.color = '#bf0027'
      document.getElementById("averagemonth2Change").innerHTML = "1M " +  '<i class="fas fa-arrow-down"></i>' + avgmonth2 + "%"

     }


    document.getElementById("averagequarter2Change").innerHTML = "Avg 3M Change: " + avgquarter2 + "%"

    if (avgquarter2 > 0) {
      document.getElementById("averagequarter2Change").style.color = '#1bcc38'
      document.getElementById("averagequarter2Change").innerHTML = "3M " +  '<i class="fas fa-arrow-up"></i>'+ "+" + avgquarter2 + "%"


     } else {
      document.getElementById("averagequarter2Change").style.color = 'red'
      document.getElementById("averagequarter2Change").innerHTML = "3M " +  '<i class="fas fa-arrow-down"></i>' + avgquarter2 + "%"

     }


    document.getElementById("averageytd2Change").innerHTML = "YTD: " + avgytd2 + "%"

    if (avgytd2 > 0) {
      document.getElementById("averageytd2Change").style.color = 'lime'
      document.getElementById("averageytd2Change").innerHTML = "YTD" +  '<i class="fas fa-arrow-up"></i>' + "+" + avgytd2 + "%"


     } else {
      document.getElementById("averageytd2Change").style.color = 'red'
      document.getElementById("averageytd2Change").innerHTML = "YTD"+  '<i class="fas fa-arrow-down"></i>' + avgytd2 + "%"

     }



    document.getElementById("averageyear12Change").innerHTML = "Avg 1Y Change: " + avgyear12 + "%"

    if (avgyear12 > 0) {
      document.getElementById("averageyear12Change").style.color = 'lime'
      document.getElementById("averageyear12Change").innerHTML = "1Y " +  '<i class="fas fa-arrow-up"></i>' + "+" + avgyear12 + "%"


     } else {
      document.getElementById("averageyear12Change").style.color = 'red'
      document.getElementById("averageyear12Change").innerHTML = "1Y " +  '<i class="fas fa-arrow-down"></i>' + avgyear12 + "%"
     }




    document.getElementById("averagehour2Change").innerHTML = "1H " + avghour2 + "%"

    if (avghour2 > 0) {
      document.getElementById("averagehour2Change").style.color = '#23fd0b'
      document.getElementById("averagehour2Change").innerHTML = "1H " +  '<i class="fas fa-arrow-up"></i>' + "+" + avghour2 + "%"


     } else {
      document.getElementById("averagehour2Change").style.color = '#FF6037'
      document.getElementById("averagehour2Change").innerHTML = "1H " +  '<i class="fas fa-arrow-down"></i>' + avghour2 + "%"

     }

  }





  
  // Change background gradient
//  for (var i = 0; i < prefs.length; i++) {
//    style += '.range {background: linear-gradient(to right, #37adbf 0%, #37adbf ' + val + '%, #fff ' + val + '%, #fff 100%)}';
//    style += '.range input::-' + prefs[i] + '{background: linear-gradient(to right, #37adbf 0%, #37adbf ' + val + '%, #b2b2b2 ' + val + '%, #b2b2b2 100%)}';
//  }

 // return style;
//}





  // filter tile display to items that include search term in text

function searchFunction() {

  var allSymbols = window.allSymbols
  var input = document.getElementById("myInput")
  var filter = input.value.toUpperCase()
  for (var i = 0; i < allSymbols.length; i++) {
    var e = document.getElementById("onestream" + i.toString())
    var d = e.querySelector("#descriptionOut").innerHTML // may not need this if we use below
    // make sure we have description w/ tags which get read in some time after launch
    let esym = e.querySelector("#symOut").innerHTML
    d = descriptionName[esym]
    if (d) {
      txtValue = d.toUpperCase() // d.textContent || d.innerText;
      if (txtValue.indexOf(filter) > -1) {
        e.style.display = "inline-block";
      } else {
        e.style.display = "none";
      }
    }
  }
}







  // note: this can be combined w/ symName table below, i will do that separately
  // or we could pull these from coin market cap rest api possibly (or some other)
  var imageUrlTable = {
'AAVE' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7278.png',
'AAVEDOWN' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7775.png',
'AAVEUP' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7774.png',
'ACM' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/8538.png',
'ADA' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2010.png',
'ADADOWN' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7014.png',
'ADAUP' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7013.png',
'AGLD' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/11568.png',
'AION' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2062.png',
'AKRO' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/4134.png',
'ALGO' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/4030.png',
'ALICE' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/8766.png',
'ALPACA' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/8707.png',
'ALPHA' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7232.png',
'ANKR' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/3783.png',
'ANT' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1680.png',
'AR' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5632.png',
'ARDR' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1320.png',
'ARPA' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/4039.png',
'ASR' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5229.png',
'ATA' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/10188.png',
'ATM' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5227.png',
'ATOM' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/3794.png',
'AUDIO' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7455.png',
'AUTO' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/8387.png',
'AVA' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2776.png',
'AVAX' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png',
'AXS' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/6783.png',
'BADGER' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7859.png',
'BAKE' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7064.png',
'BAL' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5728.png',
'BAND' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/4679.png',
'BAR' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5225.png',
'BAT' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1697.png',
'BCH' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1831.png',
'BCHDOWN' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7523.png',
'BCHUP' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7522.png',
'BEAM' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/3702.png',
'BEL' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/6928.png',
'BETA' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/11307.png',
'BLZ' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2505.png',
'BNB' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
'BNBDOWN' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7010.png',
'BNBUP' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7009.png',
'BNT' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1727.png',
'BOND' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7440.png',
'BTC' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
'BTCDOWN' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5609.png',
'BTCST' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/8891.png',
'BTCUP' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5608.png',
'BTG' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2083.png',
'BTS' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/463.png',
'BTT' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/3718.png',
'BURGER' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7158.png',
'BUSD' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/4687.png',
'BZRX' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5810.png',
'CAKE' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7186.png',
'CELO' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5567.png',
'CELR' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/3814.png',
'CFX' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7334.png',
'CHESS' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/10974.png',
'CHR' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/3978.png',
'CHZ' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/4066.png',
'CKB' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/4948.png',
'CLV' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/8384.png',
'COCOS' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/4275.png',
'COMP' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5692.png',
'COS' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/4036.png',
'COTI' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/3992.png',
'CRV' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/6538.png',
'CTK' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/4807.png',
'CTSI' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5444.png',
'CTXC' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2638.png',
'CVC' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1816.png',
'CVP' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/6669.png',
'DASH' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/131.png',
'DATA' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2143.png',
'DCR' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1168.png',
'DEGO' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7087.png',
'DENT' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1886.png',
'DEXE' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7326.png',
'DF' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/4758.png',
'DGB' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/109.png',
'DIA' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/6138.png',
'DNT' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1856.png',
'DOCK' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2675.png',
'DODO' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7224.png',
'DOGE' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/74.png',
'DOT' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/6636.png',
'DOTDOWN' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7006.png',
'DOTUP' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7003.png',
'DREP' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/9148.png',
'DUSK' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/4092.png',
'DYDX' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/11156.png',
'EGLD' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/6892.png',
'ELF' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2299.png',
'ENJ' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2130.png',
'EOS' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1765.png',
'EOSDOWN' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7000.png',
'EOSUP' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/6999.png',
'EPS' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/8938.png',
'ERN' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/8615.png',
'ETC' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1321.png',
'ETH' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
'ETHDOWN' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/10853.png',
'ETHUP' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7016.png',
'FARM' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/6859.png',
'FET' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/3773.png',
'FIDA' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7978.png',
'FIL' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2280.png',
'FILDOWN' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/8051.png',
'FILUP' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/8050.png',
'FIO' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5865.png',
'FIRO' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1414.png',
'FIS' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5882.png',
'FLM' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7150.png',
'FLOW' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/4558.png',
'FLUX' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/3029.png',
'FOR' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/4118.png',
'FORTH' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/9421.png',
'FRONT' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5893.png',
'FTM' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/3513.png',
'FTT' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/4195.png',
'FUN' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1757.png',
'GALA' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7080.png',
'GBP' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/6897.png',
'GHST' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7046.png',
'GNO' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1659.png',
'GRT' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/6719.png',
'GTC' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/10052.png',
'GTO' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2289.png',
'GXC' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1750.png',
'HARD' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7576.png',
'HBAR' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/4642.png',
'HIVE' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5370.png',
'HNT' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5665.png',
'HOT' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2682.png',
'ICP' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/8916.png',
'ICX' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2099.png',
'IDEX' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/3928.png',
'ILV' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/8719.png',
'INJ' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7226.png',
'IOST' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2405.png',
'IOTX' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2777.png',
'IRIS' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/3874.png',
'JST' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5488.png',
'JUV' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5224.png',
'KAVA' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/4846.png',
'KEEP' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5566.png',
'KEY' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2398.png',
'KLAY' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/4256.png',
'KMD' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1521.png',
'KNC' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/9444.png',
'KSM' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5034.png',
'LAZIO' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/12687.png',
'LINA' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7102.png',
'LINK' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1975.png',
'LINKDOWN' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7012.png',
'LINKUP' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7011.png',
'LIT' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/6833.png',
'LPT' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/3640.png',
'LRC' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1934.png',
'LSK' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1214.png',
'LTC' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2.png',
'LTCDOWN' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7527.png',
'LTCUP' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7526.png',
'LTO' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/3714.png',
'LUNA' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/4172.png',
'MANA' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1966.png',
'MASK' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/8536.png',
'MATIC' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png',
'MBL' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/4038.png',
'MBOX' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/9175.png',
'MDT' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2348.png',
'MDX' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/8335.png',
'MFT' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2896.png',
'MINA' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/8646.png',
'MIOTA' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1720.png',
'MIR' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7857.png',
'MITH' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2608.png',
'MKR' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1518.png',
'MLN' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1552.png',
'MTL' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1788.png',
'NANO' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1567.png',
'NBS' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7110.png',
'NEAR' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/6535.png',
'NEO' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1376.png',
'NKN' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2780.png',
'NMR' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1732.png',
'NU' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/4761.png',
'NULS' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2092.png',
'OCEAN' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/3911.png',
'OG' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5309.png',
'OGN' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5117.png',
'OM' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/6536.png',
'OMG' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1808.png',
'ONE' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/3945.png',
'ONG' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/3217.png',
'ONT' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2566.png',
'ORN' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5631.png',
'OXT' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5026.png',
'PAXG' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/4705.png',
'PERL' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/4293.png',
'PERP' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/6950.png',
'PHA' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/6841.png',
'PNT' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5794.png',
'POLS' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7208.png',
'POLY' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2496.png',
'POND' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7497.png',
'PSG' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5226.png',
'PUNDIX' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/9040.png',
'QNT' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/3155.png',
'QTUM' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1684.png',
'QUICK' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/8206.png',
'RAD' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/6843.png',
'RAMP' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7463.png',
'RARE' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/11294.png',
'RAY' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/8526.png',
'REEF' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/6951.png',
'REN' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2539.png',
'REP' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1104.png',
'REQ' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2071.png',
'RIF' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/3701.png',
'RLC' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1637.png',
'ROSE' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7653.png',
'RSR' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/3964.png',
'RUNE' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/4157.png',
'RVN' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2577.png',
'SAND' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/6210.png',
'SC' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1042.png',
'SFP' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/8119.png',
'SHIB' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5994.png',
'SKL' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5691.png',
'SLP' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5824.png',
'SNX' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2586.png',
'SOL' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png',
'SRM' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/6187.png',
'STMX' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2297.png',
'STORJ' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1772.png',
'STPT' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/4006.png',
'STRAX' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1343.png',
'STX' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/4847.png',
'SUN' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/10529.png',
'SUPER' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/8290.png',
'SUSD' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2927.png',
'SUSHI' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/6758.png',
'SUSHIDOWN' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/8052.png',
'SUSHIUP' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/8053.png',
'SXP' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/4279.png',
'SXPDOWN' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7529.png',
'SXPUP' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7528.png',
'SYS' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/541.png',
'TCT' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2364.png',
'TFUEL' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/3822.png',
'THETA' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2416.png',
'TKO' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/9020.png',
'TLM' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/9119.png',
'TOMO' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2570.png',
'TORN' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/8049.png',
'TRB' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/4944.png',
'TRIBE' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/9025.png',
'TROY' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5007.png',
'TRU' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7725.png',
'TRX' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png',
'TRXDOWN' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7004.png',
'TRXUP' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7005.png',
'TUSD' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2563.png',
'TVK' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/8037.png',
'TWT' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5964.png',
'UMA' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5617.png',
'UNFI' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7672.png',
'UNI' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7083.png',
'UNIDOWN' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7525.png',
'UNIUP' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7524.png',
'USDC' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
'USDP' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/3330.png',
'UTK' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2320.png',
'VET' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/3077.png',
'VIDT' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/3845.png',
'VITE' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2937.png',
'VTHO' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/3012.png',
'WAN' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2606.png',
'WAVES' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1274.png',
'WAXP' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2300.png',
'WIN' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/4206.png',
'WING' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7048.png',
'WNXM' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5939.png',
'WRX' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5161.png',
'WTC' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1925.png',
'XEC' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/10791.png',
'XEM' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/873.png',
'XLM' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/512.png',
'XLMDOWN' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/8054.png',
'XLMUP' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/8055.png',
'XMR' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/328.png',
'XRP' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/52.png',
'XRPDOWN' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7002.png',
'XRPUP' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7001.png',
'XTZ' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2011.png',
'XTZDOWN' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7008.png',
'XTZUP' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7007.png',
'XVG' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/693.png',
'XVS' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7288.png',
'YFI' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5864.png',
'YFIDOWN' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7453.png',
'YFII' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5957.png',
'YFIUP' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7452.png',
'YGG' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/10688.png',
'ZEC' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1437.png',
'ZEN' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1698.png',

'ZIL' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2469.png',
'ZRX' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1896.png',
'RGT' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7986.png',
'ACH' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/6958.png',
'DDX' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7228.png',
'RAI' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/8525.png',
'XYO' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2765.png',
'DAI' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/4943.png',
'RARI' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5877.png',
'RLY' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/8075.png',
'UST' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7129.png',
'ABBC' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/3437.png',
'ACH' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/6958.png',
'ADX' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1768.png',
'AERGO' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/3637.png',
'AGLD' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/11568.png',
'AION' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2062.png',
'AKRO' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/4134.png',
'ALBT' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/6957.png',
'ALEPH' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5821.png',
'ALPACA' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/8707.png',
'AMPL' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/4056.png',
'API3' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7737.png',
'APL' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2992.png',
'ARPA' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/4039.png',
'AUCTION' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/8602.png',
'AUTO' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/8387.png',
'AVA' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2776.png',
'BADGER' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7859.png',
'BAL' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5728.png',
'BCN' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/372.png',
'BEAM' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/3702.png',
'BEL' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/6928.png',
'BEPRO' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5062.png',
'BEST' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/4361.png',
'BIT' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/11221.png',
'BLZ' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2505.png',
'BMX' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2933.png',
'BOA' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/4217.png',
'BOSON' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/8827.png',
'BTM' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1866.png',
'BTS' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/463.png',
'BURGER' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7158.png',
'BUSD' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/4687.png',
'BZRX' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5810.png',
'CET' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2941.png',
'CGG' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/8648.png',
'CHR' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/3978.png',
'CHSB' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2499.png',
'CLV' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/8384.png',
'COS' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/4036.png',
'COTI' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/3992.png',
'CREAM' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/6193.png',
'CRU' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/6747.png',
'CSPR' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5899.png',
'CTC' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5198.png',
'CTK' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/4807.png',
'CVP' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/6669.png',
'DAD' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/4862.png',
'DAI' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/4943.png',
'DAO' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/8420.png',
'DATA' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2143.png',
'DDX' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7228.png',
'DEGO' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7087.png',
'DERO' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2665.png',
'DEXT' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5866.png',
'DGD' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1229.png',
'DIA' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/6138.png',
'DIVI' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/3441.png',
'DKA' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5908.png',
'DNT' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1856.png',
'DOCK' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2675.png',
'DODO' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7224.png',
'DUSK' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/4092.png',
'EDG' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5274.png',
'ELA' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2492.png',
'ERN' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/8615.png',
'ETN' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2137.png',
'EUM' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/3968.png',
'EURS' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2989.png',
'FARM' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/6859.png',
'FIO' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5865.png',
'FIRO' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1414.png',
'FLM' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7150.png',
'FLUX' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/3029.png',
'FOR' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/4118.png',
'FORTH' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/9421.png',
'FRONT' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5893.png',
'GAS' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1785.png',
'GHST' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7046.png',
'GRS' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/258.png',
'GUSD' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/3306.png',
'HARD' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7576.png',
'HEDG' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/3662.png',
'HEGIC' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/6929.png',
'HNS' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5221.png',
'HUSD' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/4779.png',
'HXRO' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/3748.png',
'ILV' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/8719.png',
'IQ' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2930.png',
'IRIS' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/3874.png',
'JST' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5488.png',
'KAI' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5453.png',
'KDA' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5647.png',
'KEY' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2398.png',
'KIN' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1993.png',
'KLV' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/6724.png',
'KMD' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1521.png',
'KOK' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5185.png',
'KP3R' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7535.png',
'KYL' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/8644.png',
'LA' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2090.png',
'LDO' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/8000.png',
'LOOM' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2588.png',
'LQTY' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7429.png',
'LTO' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/3714.png',
'MARO' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/3175.png',
'MASK' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/8536.png',
'MATH' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5616.png',
'MBL' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/4038.png',
'MCO' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1776.png',
'MET' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2873.png',
'MFT' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2896.png',
'MINA' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/8646.png',
'MLK' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5266.png',
'MLN' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1552.png',
'MOF' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2441.png',
'MONA' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/213.png',
'MTV' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/3853.png',
'MX' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/4041.png',
'MXC' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/3628.png',
'NFT' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/9816.png',
'NIM' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2916.png',
'NOIA' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/4191.png',
'NRG' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/3218.png',
'NULS' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2092.png',
'NWC' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/4890.png',
'OM' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/6536.png',
'ORN' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5631.png',
'OXY' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/8029.png',
'PAC' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1107.png',
'PHB' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2112.png',
'PLA' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7461.png',
'PNK' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/3581.png',
'POLK' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/8579.png',
'POLS' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7208.png',
'POLY' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2496.png',
'POWR' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2132.png',
'PRO' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1974.png',
'PRQ' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5410.png',
'QKC' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2840.png',
'RAD' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/6843.png',
'RARI' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5877.png',
'RDD' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/118.png',
'REVV' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/6993.png',
'RFR' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2553.png',
'RIF' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/3701.png',
'RLY' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/8075.png',
'RPL' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2943.png',
'SAFEMOON' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/8757.png',
'SBD' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1312.png',
'SFP' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/8119.png',
'SHR' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/4197.png',
'SOLO' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5279.png',
'SOLVE' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/3724.png',
'SOUL' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2827.png',
'STAKE' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5601.png',
'STPT' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/4006.png',
'STRONG' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/6511.png',
'SUKU' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/6180.png',
'SUN' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/10529.png',
'SUPER' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/8290.png',
'SUSD' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2927.png',
'SWAP' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5829.png',
'SYS' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/541.png',
'TITAN' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7206.png',
'TKO' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/9020.png',
'TOMO' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2570.png',
'TRAC' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2467.png',
'TRB' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/4944.png',
'TROY' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5007.png',
'TRU' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7725.png',
'TT' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/3930.png',
'TTT' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5514.png',
'TUSD' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2563.png',
'TVK' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/8037.png',
'UNFI' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7672.png',
'UOS' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/4189.png',
'UPP' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2866.png',
'UQC' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2273.png',
'USDC' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
'USDN' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5068.png',
'UST' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/7129.png',
'UTK' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2320.png',
'VEE' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2223.png',
'VERI' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1710.png',
'VID' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/4300.png',
'VITE' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2937.png',
'VRA' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/3816.png',
'WNXM' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5939.png',
'WTC' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/1925.png',
'XEC' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/10791.png',
'XOR' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5802.png',
'XPR' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5350.png',
'XYO' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/2765.png',
'YFII' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/5957.png',
'PEOPLE' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/14806.png',
'ENS' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/13855.png',
'IMX' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/10603.png',
'ZB' : 'https://s2.coinmarketcap.com/static/img/coins/64x64/3351.png',

'BTC' : 'https://coinicon2.s3.us-east-2.amazonaws.com/BTC.png',
'ETH' : 'https://coinicon2.s3.us-east-2.amazonaws.com/ETH.png',
'ADA' : 'https://coinicon2.s3.us-east-2.amazonaws.com/ADA.png',
'BNB' : 'https://coinicon2.s3.us-east-2.amazonaws.com/BNB.png',
'XRP' : 'https://coinicon2.s3.us-east-2.amazonaws.com/XRP.png',
'SOL' : 'https://coinicon2.s3.us-east-2.amazonaws.com/SOL.png',
'DOGE' : 'https://coinicon2.s3.us-east-2.amazonaws.com/DOGE2.png',
'DOT' : 'https://coinicon2.s3.us-east-2.amazonaws.com/DOT.png',
'UNI' : 'https://coinicon2.s3.us-east-2.amazonaws.com/UNI.png',
'LINK' : 'https://coinicon2.s3.us-east-2.amazonaws.com/LINK.png',
'BCH' : 'https://coinicon2.s3.us-east-2.amazonaws.com/BCH.png',
'LTC' : 'https://coinicon2.s3.us-east-2.amazonaws.com/LTC.png',
'LUNA' : 'https://coinicon2.s3.us-east-2.amazonaws.com/LUNA.png',
'ICP' : 'https://coinicon2.s3.us-east-2.amazonaws.com/ICP.png',
'WBTC' : 'https://coinicon2.s3.us-east-2.amazonaws.com/WBTC.png',
'FIL' : 'https://coinicon2.s3.us-east-2.amazonaws.com/FIL.png',
'MATIC' : 'https://coinicon2.s3.us-east-2.amazonaws.com/MATIC.png',
'AVAX' : 'https://coinicon2.s3.us-east-2.amazonaws.com/AVAX.png',
'XLM' : 'https://coinicon2.s3.us-east-2.amazonaws.com/XLM.png',
'VET' : 'https://coinicon2.s3.us-east-2.amazonaws.com/VET.png',
'ETC' : 'https://coinicon2.s3.us-east-2.amazonaws.com/ETC.png',
'THETA' : 'https://coinicon2.s3.us-east-2.amazonaws.com/THETA.png',
'FTT' : 'https://coinicon2.s3.us-east-2.amazonaws.com/FTT.png',
'TRX' : 'https://coinicon2.s3.us-east-2.amazonaws.com/TRX.png',
'EOS' : 'https://coinicon2.s3.us-east-2.amazonaws.com/EOS.png',
'ATOM' : 'https://coinicon2.s3.us-east-2.amazonaws.com/ATOM.png',
'XMR' : 'https://coinicon2.s3.us-east-2.amazonaws.com/XMR.png',
'CAKE' : 'https://coinicon2.s3.us-east-2.amazonaws.com/CAKE.png',
'AAVE' : 'https://coinicon2.s3.us-east-2.amazonaws.com/AAVE.png',
'ALGO' : 'https://coinicon2.s3.us-east-2.amazonaws.com/ALGO.png',
'MIOTA' : 'https://coinicon2.s3.us-east-2.amazonaws.com/MIOTA.png',
'IOTA' : 'https://coinicon2.s3.us-east-2.amazonaws.com/MIOTA.png',
'CRO' : 'https://coinicon2.s3.us-east-2.amazonaws.com/CRO.png',
'APE' : 'https://coinicon2.s3.us-east-2.amazonaws.com/APE.png',
'AXS' : 'https://coinicon2.s3.us-east-2.amazonaws.com/AXS.png',
'XTZ' : 'https://coinicon2.s3.us-east-2.amazonaws.com/XTZ.png',
'GRT' : 'https://coinicon2.s3.us-east-2.amazonaws.com/GRT.png',
'FTM' : 'https://coinicon2.s3.us-east-2.amazonaws.com/FTM.png',
'NEO' : 'https://coinicon2.s3.us-east-2.amazonaws.com/NEO.png',
'KLAY' : 'https://coinicon2.s3.us-east-2.amazonaws.com/KLAY.png',
'QNT' : 'https://coinicon2.s3.us-east-2.amazonaws.com/QNT.png',
'BSV' : 'https://coinicon2.s3.us-east-2.amazonaws.com/BSV.png',
'MKR' : 'https://coinicon2.s3.us-east-2.amazonaws.com/MKR.png',
'EGLD' : 'https://coinicon2.s3.us-east-2.amazonaws.com/EGLD.png',
'KSM' : 'https://coinicon2.s3.us-east-2.amazonaws.com/KSM.png',
'HBAR' : 'https://coinicon2.s3.us-east-2.amazonaws.com/HBAR.png',
'BTT' : 'https://coinicon2.s3.us-east-2.amazonaws.com/BTT.png',
'WAVES' : 'https://coinicon2.s3.us-east-2.amazonaws.com/WAVES.png',
'NEAR' : 'https://coinicon2.s3.us-east-2.amazonaws.com/NEAR.png',
'LEO' : 'https://coinicon2.s3.us-east-2.amazonaws.com/LEO.png',
'SHIB' : 'https://coinicon2.s3.us-east-2.amazonaws.com/SHIB.png',
'HT' : 'https://coinicon2.s3.us-east-2.amazonaws.com/HT.png',
'COMP' : 'https://coinicon2.s3.us-east-2.amazonaws.com/COMP.png',
'DASH' : 'https://coinicon2.s3.us-east-2.amazonaws.com/DASH.png',
'AMP' : 'https://coinicon2.s3.us-east-2.amazonaws.com/AMP.png',
'CHZ' : 'https://coinicon2.s3.us-east-2.amazonaws.com/CHZ.png',
'RUNE' : 'https://coinicon2.s3.us-east-2.amazonaws.com/RUNE.png',
'REV' : 'https://coinicon2.s3.us-east-2.amazonaws.com/REV.png',
'HNT' : 'https://coinicon2.s3.us-east-2.amazonaws.com/HNT.png',
'DCR' : 'https://coinicon2.s3.us-east-2.amazonaws.com/DCR.png',
'TFUEL' : 'https://coinicon2.s3.us-east-2.amazonaws.com/TFUEL.png',
'HOT' : 'https://coinicon2.s3.us-east-2.amazonaws.com/HOT.png',
'ZEC' : 'https://coinicon2.s3.us-east-2.amazonaws.com/ZEC.png',
'XEM' : 'https://coinicon2.s3.us-east-2.amazonaws.com/XEM.png',
'STX' : 'https://coinicon2.s3.us-east-2.amazonaws.com/STX.png',
'AR' : 'https://coinicon2.s3.us-east-2.amazonaws.com/AR.png',
'MANA' : 'https://coinicon2.s3.us-east-2.amazonaws.com/MANA.png',
'XDC' : 'https://coinicon2.s3.us-east-2.amazonaws.com/XDC.png',
'ENJ' : 'https://coinicon2.s3.us-east-2.amazonaws.com/ENJ.png',
'SUSHI' : 'https://coinicon2.s3.us-east-2.amazonaws.com/SUSHI.png',
'ONE' : 'https://coinicon2.s3.us-east-2.amazonaws.com/ONE.png',
'CEL' : 'https://coinicon2.s3.us-east-2.amazonaws.com/CEL.png',
'CELO' : 'https://coinicon2.s3.us-east-2.amazonaws.com/CELO.png',
'QTUM' : 'https://coinicon2.s3.us-east-2.amazonaws.com/QTUM.png',
'YFI' : 'https://coinicon2.s3.us-east-2.amazonaws.com/YFI.png',
'SNX' : 'https://coinicon2.s3.us-east-2.amazonaws.com/SNX.png',
'ZIL' : 'https://coinicon2.s3.us-east-2.amazonaws.com/ZIL.png',
'FLOW' : 'https://coinicon2.s3.us-east-2.amazonaws.com/FLOW.png',
'BTG' : 'https://coinicon2.s3.us-east-2.amazonaws.com/BTG.png',
'BAT' : 'https://coinicon2.s3.us-east-2.amazonaws.com/BAT.png',
'RVN' : 'https://coinicon2.s3.us-east-2.amazonaws.com/RVN.png',
'OKB' : 'https://coinicon2.s3.us-east-2.amazonaws.com/OKB.png',
'PERP' : 'https://coinicon2.s3.us-east-2.amazonaws.com/PERP.png',
'OMG' : 'https://coinicon2.s3.us-east-2.amazonaws.com/OMG.png',
'TEL' : 'https://coinicon2.s3.us-east-2.amazonaws.com/TEL.png',
'KCS' : 'https://coinicon2.s3.us-east-2.amazonaws.com/KCS.png',
'ZEN' : 'https://coinicon2.s3.us-east-2.amazonaws.com/ZEN.png',
'SC' : 'https://coinicon2.s3.us-east-2.amazonaws.com/SC.png',
'IOST' : 'https://coinicon2.s3.us-east-2.amazonaws.com/IOST.png',
'ICX' : 'https://coinicon2.s3.us-east-2.amazonaws.com/ICX.png',
'BNT' : 'https://coinicon2.s3.us-east-2.amazonaws.com/BNT.png',
'NEXO' : 'https://coinicon2.s3.us-east-2.amazonaws.com/NEXO.png',
'DGB' : 'https://coinicon2.s3.us-east-2.amazonaws.com/DGB.png',
'ONT' : 'https://coinicon2.s3.us-east-2.amazonaws.com/ONT.png',
'AUDIO' : 'https://coinicon2.s3.us-east-2.amazonaws.com/AUDIO.png',
'ZRX' : 'https://coinicon2.s3.us-east-2.amazonaws.com/ZRX.png',
'CRV' : 'https://coinicon2.s3.us-east-2.amazonaws.com/CRV.png',
'NANO' : 'https://coinicon2.s3.us-east-2.amazonaws.com/NANO.png',
'ANKR' : 'https://coinicon2.s3.us-east-2.amazonaws.com/ANKR.png',
'UMA' : 'https://coinicon2.s3.us-east-2.amazonaws.com/UMA.png',
'SAND' : 'https://coinicon2.s3.us-east-2.amazonaws.com/SAND.png',
'FET' : 'https://coinicon2.s3.us-east-2.amazonaws.com/FET.png',
'REN' : 'https://coinicon2.s3.us-east-2.amazonaws.com/REN.png',
'IOTX' : 'https://coinicon2.s3.us-east-2.amazonaws.com/IOTX.png',
'SXP' : 'https://coinicon2.s3.us-east-2.amazonaws.com/SXP.png',
'KAVA' : 'https://coinicon2.s3.us-east-2.amazonaws.com/KAVA.png',
'LRC' : 'https://coinicon2.s3.us-east-2.amazonaws.com/LRC.png',
'DENT' : 'https://coinicon2.s3.us-east-2.amazonaws.com/DENT.png',
'1INCH' : 'https://coinicon2.s3.us-east-2.amazonaws.com/1INCH.png',
'RSR' : 'https://coinicon2.s3.us-east-2.amazonaws.com/RSR.png',
'GLM' : 'https://coinicon2.s3.us-east-2.amazonaws.com/GLM.png',
'WAXP' : 'https://coinicon2.s3.us-east-2.amazonaws.com/WAXP.png',
'OCEAN' : 'https://coinicon2.s3.us-east-2.amazonaws.com/OCEAN.png',
'LSK' : 'https://coinicon2.s3.us-east-2.amazonaws.com/LSK.png',
'STORJ' : 'https://coinicon2.s3.us-east-2.amazonaws.com/STORJ.png',
'ALPHA' : 'https://coinicon2.s3.us-east-2.amazonaws.com/ALPHA.png',
'SKL' : 'https://coinicon2.s3.us-east-2.amazonaws.com/SKL.png',
'BAKE' : 'https://coinicon2.s3.us-east-2.amazonaws.com/BAKE.png',
'BCD' : 'https://coinicon2.s3.us-east-2.amazonaws.com/BCD.png',
'WIN' : 'https://coinicon2.s3.us-east-2.amazonaws.com/WIN.png',
'ERG' : 'https://coinicon2.s3.us-east-2.amazonaws.com/ERG.png',
'SRM' : 'https://coinicon2.s3.us-east-2.amazonaws.com/SRM.png',
'CKB' : 'https://coinicon2.s3.us-east-2.amazonaws.com/CKB.png',
'NMR' : 'https://coinicon2.s3.us-east-2.amazonaws.com/NMR.png',
'XVG' : 'https://coinicon2.s3.us-east-2.amazonaws.com/XVG.png',
'VTHO' : 'https://coinicon2.s3.us-east-2.amazonaws.com/VTHO.png',
'WRX' : 'https://coinicon2.s3.us-east-2.amazonaws.com/WRX.png',
'INJ' : 'https://coinicon2.s3.us-east-2.amazonaws.com/INJ.png',
'ROSE' : 'https://coinicon2.s3.us-east-2.amazonaws.com/ROSE.png',
'ELF' : 'https://coinicon2.s3.us-east-2.amazonaws.com/ELF.png',
'OGN' : 'https://coinicon2.s3.us-east-2.amazonaws.com/OGN.png',
'XVS' : 'https://coinicon2.s3.us-east-2.amazonaws.com/XVS.png',
'GT' : 'https://coinicon2.s3.us-east-2.amazonaws.com/GT.png',
'CVC' : 'https://coinicon2.s3.us-east-2.amazonaws.com/CVC.png',
'STMX' : 'https://coinicon2.s3.us-east-2.amazonaws.com/STMX.png',
'RLC' : 'https://coinicon2.s3.us-east-2.amazonaws.com/RLC.png',
'ARDR' : 'https://coinicon2.s3.us-east-2.amazonaws.com/ARDR.png',
'SNT' : 'https://coinicon2.s3.us-east-2.amazonaws.com/SNT.png',
'DAG' : 'https://coinicon2.s3.us-east-2.amazonaws.com/DAG.png',
'EWT' : 'https://coinicon2.s3.us-east-2.amazonaws.com/EWT.png',
'STRAX' : 'https://coinicon2.s3.us-east-2.amazonaws.com/STRAX.png',
'REEF' : 'https://coinicon2.s3.us-east-2.amazonaws.com/REEF.png',
'BAND' : 'https://coinicon2.s3.us-east-2.amazonaws.com/BAND.png',
'PROM' : 'https://coinicon2.s3.us-east-2.amazonaws.com/PROM.png',
'CELR' : 'https://coinicon2.s3.us-east-2.amazonaws.com/CELR.png',
'NKN' : 'https://coinicon2.s3.us-east-2.amazonaws.com/NKN.png',
'REP' : 'https://coinicon2.s3.us-east-2.amazonaws.com/REP.png',
'PAXG' : 'https://coinicon2.s3.us-east-2.amazonaws.com/PAXG.png',
'CTSI' : 'https://coinicon2.s3.us-east-2.amazonaws.com/CTSI.png',
'HIVE' : 'https://coinicon2.s3.us-east-2.amazonaws.com/HIVE.png',
'ORBS' : 'https://coinicon2.s3.us-east-2.amazonaws.com/ORBS.png',
'FUN' : 'https://coinicon2.s3.us-east-2.amazonaws.com/FUN.png',
'OXT' : 'https://coinicon2.s3.us-east-2.amazonaws.com/OXT.png',
'STEEM' : 'https://coinicon2.s3.us-east-2.amazonaws.com/STEEM.png',
'MTL' : 'https://coinicon2.s3.us-east-2.amazonaws.com/MTL.png',
'PHA' : 'https://coinicon2.s3.us-east-2.amazonaws.com/PHA.png',
'SLP' : 'https://coinicon2.s3.us-east-2.amazonaws.com/SLP.png',
'MAID' : 'https://coinicon2.s3.us-east-2.amazonaws.com/MAID.png',
'ANT' : 'https://coinicon2.s3.us-east-2.amazonaws.com/ANT.png',
'REQ' : 'https://coinicon2.s3.us-east-2.amazonaws.com/REQ.png',
'ARK' : 'https://coinicon2.s3.us-east-2.amazonaws.com/ARK.png',
'WAN' : 'https://coinicon2.s3.us-east-2.amazonaws.com/WAN.png',
'HEX' : 'https://coinicon2.s3.us-east-2.amazonaws.com/HEX.png',
'NXM' : 'https://coinicon2.s3.us-east-2.amazonaws.com/NXM.png',
'DFI' : 'https://coinicon2.s3.us-east-2.amazonaws.com/DFI.png',
'XWC' : 'https://coinicon2.s3.us-east-2.amazonaws.com/XWC.png',
'OMI' : 'https://coinicon2.s3.us-east-2.amazonaws.com/OMI.png',
'ARRR' : 'https://coinicon2.s3.us-east-2.amazonaws.com/ARRR.png',
'TWT' : 'https://coinicon2.s3.us-east-2.amazonaws.com/TWT.png',
'XCH' : 'https://coinicon2.s3.us-east-2.amazonaws.com/XCH.png',
'KNC' : 'https://coinicon2.s3.us-east-2.amazonaws.com/KNC.png',
'ANC' : 'https://coinicon2.s3.us-east-2.amazonaws.com/ANC.png',
'TRIBE' : 'https://coinicon2.s3.us-east-2.amazonaws.com/TRIBE.png',
'KEEP' : 'https://coinicon2.s3.us-east-2.amazonaws.com/KEEP.png',
'MIR' : 'https://coinicon2.s3.us-east-2.amazonaws.com/MIR.png',
'AKT' : 'https://coinicon2.s3.us-east-2.amazonaws.com/AKT.png',
'MBOX' : 'https://coinicon2.s3.us-east-2.amazonaws.com/MBOX.png',
'GMT' : 'https://coinicon2.s3.us-east-2.amazonaws.com/GMT.png',
'C98' : 'https://coinicon2.s3.us-east-2.amazonaws.com/C98.png',
'DYDX' : 'https://coinicon2.s3.us-east-2.amazonaws.com/DYDX.png'


  }

 // lookup table for names

var symName = {

'BTC' : 'Bitcoin',
'ETH' : 'Ethereum',
'ETC' : 'Ethereum Classic',
'ADA' : 'Cardano',
'SOL' : 'Solana',
'AXS' : 'Axie Infinity',
'APE' : 'APECoin',
'LRC' : 'Loopring',
'LUNA' : 'Terra',
'DOGE' : 'Dogecoin',
'GALA' : 'Gala',
'AVAX' : 'Avalanche',
'SAND' : 'The Sandbox',
'NEAR' : 'NEAR Protocol',
'1000SHIB' : '1000SHIB',
'XRP' : 'XRP',
'FTM' : 'Fantom',
'DOT' : 'Polkadot',
'MANA' : 'Decentraland',
'BNB' : 'BNB',
'GMT' : 'STEPN',
'WAVES' : 'Waves',
'ATOM' : 'Cosmos',
'MATIC' : 'Polygon',
'LINK' : 'Chainlink',
'AAVE' : 'Aave',
'LTC' : 'Litecoin',
'RUNE' : 'THORChain',
'SRM' : 'Serum',
'ENJ' : 'Enjin Coin',
'FIL' : 'Filecoin',
'EOS' : 'EOS',
'OGN' : 'Origin Protocol',
'PEOPLE' : 'ConstitutionDAO',
'BCH' : 'Bitcoin Cash',
'ZEC' : 'Zcash',
'HOT' : 'Holo',
'DYDX' : 'dYdX',
'ALGO' : 'Algorand',
'ALICE' : 'MyNeighborAlice',
'SUSHI' : 'SushiSwap',
'ONE' : 'Harmony',
'THETA' : 'Theta Network',
'IMX' : 'Immutable X',
'GTC' : 'Gitcoin',
'ARPA' : 'ARPA Chain',
'EGLD' : 'Elrond',
'ICP' : 'Internet Computer',
'VET' : 'VeChain',
'CRV' : 'Curve DAO Token',
'QTUM' : 'Qtum',
'CHR' : 'Chromia',
'UNI' : 'Uniswap',
'AUDIO' : 'Audius',
'DASH' : 'Dash',
'TLM' : 'Alien Worlds',
'GRT' : 'The Graph',
'CHZ' : 'Chiliz',
'CELR' : 'Celer Network',
'IOTX' : 'IoTeX',
'ALPHA' : 'Alpha Finance Lab',
'XTZ' : 'Tezos',
'TRX' : 'TRON',
'SNX' : 'Synthetix',
'1INCH' : '1Inch',
'XLM' : 'Stellar',
'ROSE' : 'Oasis Network',
'KNC' : 'Kyber Network Crystal v2',
'BAT' : 'Basic Attention Token',
'COMP' : 'Compound',
'ENS' : 'Ethereum Name Service',
'HNT' : 'Helium',
'AR' : 'Arweave',
'SXP' : 'Swipe',
'BAND' : 'Band Protocol',
'LINA' : 'Linear',
'MKR' : 'Maker',
'KSM' : 'Kusama',
'CELO' : 'Celo',
'XEM' : 'NEM',
'XMR' : 'Monero',
'FLOW' : 'Flow',
'HBAR' : 'Hedera',
'OMG' : 'OMG Network',
'NEO' : 'Neo',
'OCEAN' : 'Ocean Protocol',
'IOTA' : 'IOTA',
'DODO' : 'DODO',
'YFI' : 'yearn.finance',
'MASK' : 'Mask Network',
'RAY' : 'Raydium',
'ANKR' : 'Ankr',
'DENT' : 'Dent',
'ICX' : 'ICON',
'REEF' : 'Reef',
'API3' : 'API3',
'KAVA' : 'Kava',
'RSR' : 'Reserve Rights',
'C98' : 'C98',
'DUSK' : 'Dusk Network',
'NKN' : 'NKN',
'RVN' : 'Ravencoin',
'ONT' : 'Ontology',
'ZIL' : 'Zilliqa',
'COTI' : 'COTI',
'REN' : 'Ren',
'MTL' : 'Metal',
'STORJ' : 'Storj',
'ZEN' : 'Horizen',
'1000BTTC' : '1000BTTC',
'RLC' : 'iExec RLC',
'KLAY' : 'Klaytn',
'BAL' : 'Balancer',
'ANT' : 'Aragon',
'IOST' : 'IOST',
'YFII' : 'DFI.Money',
'BEL' : 'Bella Protocol',
'ANC' : 'ANC',
'CVC' : 'Civic',
'CTSI' : 'Cartesi',
'AKRO' : 'Akropolis',
'TOMO' : 'TomoChain',
'BAKE' : 'BakeryToken',
'BLZ' : 'Bluzelle',
'LPT' : 'Livepeer',
'SKL' : 'SKALE Network',
'UNFI' : 'Unifi Protocol DAO',
'DGB' : 'DigiByte',
'SFP' : 'SafePal',
'CTK' : 'CertiK',
'ATA' : 'Automata Network',
'STMX' : 'StormX',
'SC' : 'Siacoin',
'LIT' : 'Litentry',
'ZRX' : '0x',
'TRB' : 'Tellor',
'1000XEC' : '1000XEC',
'FLM' : 'Flamingo',
'DEFI' : 'DEFI',
'BTS' : 'BitShares',
'BTCDOM' : 'BTCDOM',
'BTCUSDT_220325' : 'BTCUSDT_220325',
'ETHUSDT_220325' : 'ETHUSDT_220325',
'BTCUSDT_220624' : 'BTCUSDT_220624',
'ETHUSDT_220624' : 'ETHUSDT_220624',
'BTCBUSD' : 'BTCBUSD',
'ETHBUSD' : 'ETHBUSD',
'SOLBUSD' : 'SOLBUSD',
'ADABUSD' : 'ADABUSD',
'XRPBUSD' : 'XRPBUSD',
'DOGEBUSD' : 'DOGEBUSD',
'BNBBUSD' : 'BNBBUSD',
'FTTBUSD' : 'FTTBUSD'

  }


// override by arguments

var symArgInput = findGetParameter('sym');
var symNameInput = findGetParameter('name');

if (symArgInput) window.symbolToChart = symArgInput // for the react chart

//alert("symNameInput " + symNameInput)

if (symArgInput && symArgInput.length > 0 && symNameInput && symNameInput.length > 0) {
  symName = {};
  symName[symArgInput] = symNameInput;
}

// now the level 2 has options of Price% RelVol1H RelVol1D

var mapInput = findGetParameter('map');

if (mapInput) {

  window.mapInterval = setInterval(() => {
    console.log("trying to set initial map")
    window.STMapValue = mapInput
    refreshTiles()
  }, 1000)

}

var toSendArg = findGetParameter('toSend')

//alert("got to send = " + toSendArg)

//alert("got to send type = " + typeof toSendArg)

var toSendObj = JSON.parse(toSendArg)

//alert("keys = " + JSON.stringify(Object.keys(toSendObj)))

var priceOutInner = toSendObj ? toSendObj.priceOutInner : '0.00'
var changeOutInner = toSendObj ? toSendObj.changeOutInner : '0.00'
var percentOutInner = toSendObj ? toSendObj.percentOutInner : '0.00%'
var percentOutRaw = toSendObj ? toSendObj.percentOutRaw : 0

var backgroundImageInput = toSendObj ? toSendObj.backgroundImage : 'yellow' // gradient input

//alert(backgroundImageInput)

 
 // lookup table for sectors
  var sectorName = {

'BTC' : 'Currencies',
'ETH' : 'Smart Contract Platforms',
'SOL' : 'Smart Contract Platforms',
'ADA' : 'Smart Contract Platforms',
'DOT' : 'Smart Contract Platforms',
'DOGE' : 'Currencies',
'SHIB' : 'Currencies',
'AVAX' : 'Smart Contract Platforms',
'LTC' : 'Currencies',
'WBTC' : 'Wrapped Tokens DeFi',
'LINK' : 'Data Management Web3',
'UNI' : 'Decentralized Exchanges DeFi',
'MATIC' : 'Scaling Platform',
'BCH' : 'Currencies',
'ALGO' : 'Smart Contract Platforms',
'XLM' : 'Currencies',
'AXS' : 'Gaming Media Metaverse NFTs',
'ICP' : 'Smart Contract Platforms',
'FIL' : 'Technology File Storage Web3',
'ETC' : 'Smart Contract Platforms',
'ATOM' : 'Smart Contract Platforms',
'DAI' : 'Stablecoins',
'UST' : 'Stablecoins',
'MANA' : 'Gaming Media Metaverse NFTs',
'XTZ' : 'Smart Contract Platforms',
'GRT' : 'Data Management Web3 Polygon Ecos',
'EOS' : 'Smart Contract Platforms',
'AAVE' : 'Finance Lending DeFi',
'LRC' : 'Decentralized Exchanges DeFi',
'QNT' : 'Gaming Media NFTs',
'CHZ' : 'Media Entertainment',
'MKR' : 'Finance Lending DeFi',
'ENJ' : 'Gaming Media NFTs',
'AMP' : 'Finance Payments DeFi',
'ZEC' : 'Currencies',
'DASH' : 'Currencies',
'COMP' : 'Finance Lending DeFi',
'IOTX' : 'IoT ',
'CELO' : 'Derivatives',
'CRV' : 'Gaming Media NFTs',
'BAT' : 'Gaming Media Entertainment',
'OMG' : 'Gaming Media Entertainment',
'SUSHI' : 'Gaming Media Metaverse',
'UMA' : 'Derivatives DeFi Polygon Ecos',
'LPT' : 'undefined',
'YFI' : 'Finance Yield Farming DeFi',
'ANKR' : 'Enterprise Shared Computing',
'PERP' : 'Derivatives Financial DeFi AMM',
'SNX' : 'Gaming Media Entertainment',
'ZEN' : 'Gaming Media Metaverse NFTs',
'BNT' : 'Gaming Media NFTs',
'ZRX' : 'Decentralized Exchanges DeFi',
'REN' : 'Interoperability Defi',
'SKL' : 'Technology Scaling Web3',
'1INCH' : 'Decentralized Exchanges DeFi',
'XYO' : 'undefined',
'NU' : 'undefined',
'STORJ' : 'File Storage Web3',
'FET' : 'Technology AI Web3',
'POLY' : 'undefined',
'CTSI' : 'Smart Contract Platforms',
'COTI' : 'undefined',
'NMR' : 'Finance Asset Management',
'OXT' : 'Technology Data Management Web3',
'NKN' : 'Technology IoT Web3',
'OGN' : 'Technology Ecommerce P2P',
'RLC' : 'Shared Compute ',
'BADGER' : 'undefined',
'BAND' : 'Data Management Web3',
'RLY' : 'Tokenization Social Money',
'TRIBE' : 'undefined',
'KEEP' : 'Interoperability Privacy',
'RGT' : 'undefined',
'MASK' : 'undefined',
'KNC' : 'Decentralized Exchanges DeFi',
'RAD' : 'undefined',
'ACH' : 'undefined',
'REP' : 'Prediction Markets DeFi Polygon Ecos',
'TRU' : 'undefined',
'ORN' : 'undefined',
'MIR' : 'undefined',
'FUN' : 'Gambling ',
'MLN' : 'Portfolio Management Software',
'REQ' : 'undefined',
'AGLD' : 'undefined',
'CLV' : 'undefined',
'BAL' : 'Decentralized Exchanges DeFi',
'YFII' : 'Finance Asset Management DeFi',
'DDX' : 'undefined',
'FORTH' : 'undefined',
'QUICK' : 'undefined',
'GTC' : 'undefined',
'TRB' : 'Data Management Web3 Oracle',
'RARI' : 'Tokenization NFTs',
'RAI' : 'undefined',
'FARM' : 'undefined',
'BNB' : 'Centralized Exchanges',
'XRP' : 'Currencies',
'USDC' : 'Stablecoins',
'BUSD' : 'Stablecoins',
'THETA' : 'Media Content Video',
'VET' : 'Smart Contract Platforms',
'TRX' : 'Smart Contract Platforms',
'XMR' : 'Currencies',
'LUNA' : 'Finance Lending DeFi',
'CRO' : 'Finance Payments DeFi',
'CAKE' : 'Decentralized Exchanges DeFi',
'BTCB' : 'Currencies',
'FTT' : 'Centralized Exchanges',
'LEO' : 'Centralized Exchanges',
'GRT' : 'Gaming Media NFTs',
'KLAY' : 'Smart Contract Platforms',
'BSV' : 'Currencies',
'MIOTA' : ' IoT Medium of Exchange',
'NEO' : 'Smart Contract Platforms',
'HT' : 'Centralized Exchanges',
'BTT' : 'Distributed Computing Web3',
'HBAR' : 'Smart Contract Platforms',
'TFUEL' : 'Media Content Payments',
'DCR' : 'Currencies',
'EGLD' : 'Smart Contract Platforms',
'WAVES' : 'Smart Contract Platforms',
'KSM' : 'Smart Contract Platforms',
'XEM' : 'Smart Contract Platforms',
'CEL' : 'Finance Lending',
'STX' : 'Gaming Media NFTs',
'TUSD' : 'Stablecoins',
'OKB' : 'Gaming Media Metaverse NFTs',
'HOT' : 'Application Development',
'HNT' : 'Technology IoT Web3',
'TEL' : 'Finance Payments',
'XDC' : 'Technology Blockchain BAAS Trading',
'FLOW' : 'Smart Contract Platforms',
'NEXO' : 'Gaming Media Metaverse NFTs',
'PAX' : 'Stablecoins',
'RUNE' : 'Decentralized Exchanges DeFi',
'NEAR' : 'Smart Contract Platforms',
'ZIL' : 'Smart Contract Platforms',
'BTG' : 'Currencies',
'ONE' : 'Gaming Media Entertainment',
'KCS' : 'Gaming Media NFTs',
'QTUM' : 'Gaming Media NFTs',
'DGB' : 'Currencies',
'ONT' : 'Gaming Media Entertainment',
'HUSD' : 'Derivatives',
'SC' : 'File Storage Distributed Compute Web3',
'FTM' : 'Gaming Media Entertainment',
'RVN' : 'Currencies',
'REV' : 'Technology AI Reviews',
'ICX' : 'Technology Interoperability BaaS',
'NANO' : 'Currencies',
'BAKE' : 'Decentralized Exchanges DeFi',
'SAND' : 'Gaming Media Metaverse',
'USDN' : 'Stablecoins',
'IOST' : 'Smart Contract Platforms',
'KAVA' : 'Finance Lending DeFi',
'RSR' : 'Stablecoins DeFi',
'GLM' : 'Technology Shared Compute',
'BCD' : 'Currencies',
'LSK' : 'Application Development',
'XVG' : 'Currencies',
'AR' : 'File Storage Distributed Computing',
'WRX' : 'Centralized Exchanges',
'GUSD' : 'Stablecoins',
'PAXG' : 'Finance Asset Backed Gold',
'MAID' : 'Data Management Web3',
'CKB' : 'Smart Contract Platforms',
'XVS' : 'Lending DeFi BSC Ecos',
'WIN' : 'Technoliogy Data',
'WAXP' : 'Media Collectibles NFTs',
'OCEAN' : 'Data Management Web3',
'GT' : 'Finance Decentralized Trading DeFi',
'DENT' : 'Data Management Web3',
'VTHO' : 'Blockchain Platforms ',
'SNT' : 'Application Development ',
'STRAX' : 'Technology Blockchain BAAS',
'ALPHA' : 'Asset Management DeFi Yield Farm',
'PROM' : 'Finance Yield Farming Infrastructure DeFi ',
'EWT' : 'Energy',
'ABBC' : 'Finance Payment Platforms',
'SXP' : 'Payments DeFi Social Money',
'REEF' : 'Finance Asset Management Polygon',
'STMX' : 'Rewards',
'INJ' : 'Derivatives DeFi Cosmos Ecos Polygon Ecos',
'CVC' : 'Identity Web3 Solana Ecos',
'ANT' : 'Technology Web3 DAO Infrastructure',
'ERG' : 'Technology Blockchain BAAS Infrastructure',
'STEEM' : 'Content Creation Distribution Web3',
'ARDR' : 'Smart Contract Platforms',
'FUNX' : 'Gambling ',
'AMPL' : 'Currencies Rebase Tokens',
'SRM' : 'Decentralized Exchanges DeFi SOL',
'CELR' : 'Technology Scaling',
'ORBS' : 'Enterprise and BaaS ',
'CHR' : 'Application Development ',
'UQC' : 'Finance Payments Cards DeFi',
'HIVE' : 'Content Creation Distribution Web3',
'MCO' : 'Payment Platforms ',
'RIF' : 'Application Development ',
'ZB' : 'Centralized Exchanges',
'PHA' : 'Smart Contract Platforms',
'ARK' : 'Interoperability Polygon Ecos',
'BTS' : 'Smart Contract Platforms',
'HEX' : 'Finance Yield Farming Infrastructure DeFi',
'XWC' : 'Currencies',
'AUDIO' : 'Content Creation Web3 Solana',
'DYDX' : 'Decentralized Exchanges DeFi AMM',
'HXRO' : 'Centralized Exchanges Solana Ecos',
'SUN' : 'Finance Decentralized DeFi TRON Ecos',
'DODO' : 'Decentralized Exchanges DeFi',
'MTL' : 'Finance Payment Platforms',
'JST' : 'Decentralized Exchanges DeFi',
'AVA' : 'Payment Platforms',
'UTK' : 'Payment Platforms',
'DEGO' : 'Finance Infrastructure DeFI',
'BTM' : 'Smart Contract Platforms Cosmos',
'KMD' : 'Technology Interoperability',
'DATA' : 'Data Management Web3',
'HNS' : 'Technology Misc Web3',
'MXC' : 'Technology Interoperability Communication',
'FIO' : 'Technology Interoperability',
'BZRX' : 'Lending DeFi',
'DIA' : 'Technology Data Management Oracle Web3',
'HARD' : 'Lending DeFi Cosmos Ecos',
'VRA' : 'Media Video Sharing Monetization',
'DOCK' : 'Technology Data Management',
'NULS' : 'Enterprise and BaaS',
'KEY' : 'Technoliogy Identity',
'FRONT' : 'Finance Asset Management',
'USDK' : 'Finance DeFi Infrastructure',
'SOC' : 'Technology Infrastructure Prediction',
'FLUX' : 'Technology Equihash Distributed Compute Web3',
'GTO' : 'Content Creation and Distribution',
'BOND' : 'Finance DeFi Yield Farming',
'IMX' : 'Technology Scaling Web3 NFTs',
'GALA' : 'Gaming Blockchain Metaverse NFTs',
'SOLBUSD' : 'Smart Contract Platforms',
'BTCBUSD' : 'Currencies',
'1000SHIB' : 'Currencies',
'BNBBUSD' : 'Centralized Exchanges',
'ADABUSD' : 'Smart Contract Platforms',
'XRPBUSD' : 'Currencies',
'DOGEBUSD' : 'Currencies',
'1000BTTC' : 'Currencies',
'ETHBUSD' : 'Smart Contract Platforms',
'FTTBUSD' : 'Centralized Exchanges',
'1000XEC' : 'Payments',
'BTCUSDT_220325' : 'Currencies',
'ETHUSDT_220325' : 'Smart Contract Platforms',
'BTCUSDT_220624' : 'Currencies',
'BTCDOM' : 'Index',
'ETHUSDT_220624' : 'Smart Contract Platforms',
'DEFI' : 'Index',
'DF' : 'Finance DeFi Interoperability'

  }




 // lookup table for dexcriptions
  var descriptionName = {
'BTC' : 'Bitcoin (BTC) uses peer-to-peer technology to operate with no central authority or banks; managing transactions and the issuing of bitcoins is carried out collectively by the network. Although other cryptocurrencies have come before Bitcoin is the first decentralized cryptocurrency - Its reputation has spawned copies and evolution in the space.With the largest variety of markets and the biggest value - having reached a peak of 318 billion USD - Bitcoin is here to stay. As with any new invention there can be improvements or flaws in the initial model however the community and a team of dedicated developers are pushing to overcome any obstacle they come across. It is also the most traded cryptocurrency and one of the main entry points for all the other cryptocurrencies. The price is as unstable as always and it can go up or down by 10%-20% in a single day.Bitcoin is an SHA-256 POW coin with almost 21000000 total minable coins. The block time is 10 minutes. See below for a full range of Bitcoin markets where you can trade US Dollars for Bitcoin crypto to Bitcoin and many other fiat currencies too.Bitcoin Whitepaper PDF - A Peer-to-Peer Electronic Cash SystemBlockchain data provided by: Blockchain (main source) Blockchair (backup); Mineable Currencies.',
'ETH' : 'Ethereum (ETH) is a decentralized platform that runs smart contracts: applications that run exactly as programmed without any possibility of downtime censorship fraud or third party interference. In the Ethereum protocol and blockchain there is a price for each operation. The general idea is in order to have things transferred or executed by the network you have to consume or burn Gas. The cryptocurrency is called Ether and is used to pay for computation time and for transaction fees.If you want to earn block rewards from the network you can join the network as a miner. Follow the link for a guide on how to mine Ethereum on a Windows Pc. The much easier but a bit more expensive way is to buy an Ethereum mining contract. Ethereum is how the Internet was supposed to work. As long as you have enough funds to pay for your code to be run by the network your contacts will always be up and running.It was crowdfunded during August 2014 by fans all around the world. It is developed and maintained by ETHDEV with contributions from great minds across the globe. There is also an Ethereum foundation and there are multiple startups working with the Ethereum blockchain.Ethereum is currently on the Homestead stage and all its related software is still considered Beta until the release of the next stage Metropolis. Ethereum Whitepaper - A Next-Generation Smart Contract &amp; Decentralized Application PlatformBlockchain data provided by: Etherchain (Main Source) Blockchair (Backup) and Etherscan (Total Supply only).; Smart Contract Platforms.',
'ADA' : 'Cardano (ADA) was designed and developed by IOHK in conjunction with the University of Edinburgh the University of Athens and the University of Connecticut Cardano SL (or Cardano Settlement Layer) is a Proof of Stake cryptocurrency based on the Haskell implementation of the white paper Ouroboros: A Provably Secure Proof of Stake Blockchain Protocol by Aggelos Kiayias Alexander Russell Bernardo David and Roman Oliynykov. Blockchain data provided by: Blockchair; Smart Contract Platforms.',
'BNB' : 'Binance Coin (BNB) powers the Binance ecosystem and is the native asset of the Binance Chain. BNB is a cryptocurrency created in June 2017 launched during an ICO in July and initially issued as an ERC-20 token. Designed to be used for a fee reduction on the Binance exchange its scope was extended over the years.BNB powers the Binance Chain as its native chain token. For instance it is used to pay fees on the Binance DEX issue new tokens send/cancel orders and transfer assets. BNB is also powering the Binance Smart Chain which is an EVM-compatible network forked from go-ethereum. It supports smart contracts and relies on a new consensus mechanism: Proof-of-Staked Authority (PoSA) consensus (Parlia) which incorporates elements from both Proof of Stake and Proof of Authority. BNB is used for delegated staking on the authority validator leading to staking rewards for users and validators.Besides its on-chain functions BNB has multiple additional use-cases such as fee discounts on multiple exchanges (e.g. Binance.com) payment asset on third-party services and participation rights &amp; transacting currency on Binance Launchpad.At the core of the economics of BNB there is a burn mechanism leading to period reductions in its total supply (~ every three months). From its initial maximum supply of 200 million burns are expected to continue until the supply reaches 100 million.  Centralized Exchanges.',
'XRP' : 'XRP (XRP) is one of the most liquid currencies which is fast (settles in 3-5 seconds) scalable (can handle 1500 transactions per second) decentralized (140+ validators) stable (7-year track record) and with a negligible energy consumption (due to the consensus protocol vs proof-of-work). XRP is a distributed network which means transactions occur immediately across the network - and as it is peer to peer - the network is resilient to systemic risk. XRPs arent mined - unlike bitcoin and its peers - but each transaction destroys a small amount of XRP which adds a deflationary measure into the system. XRP was created by Ripple.  Blockchain data provided by: Blockchair (Block/Ledgers Number only) Ripple Data API (Total Supply only); Currencies.',
'SOL' : 'Solana (SOL) is a single-chain delegated-Proof-of-Stake protocol founded by former Qualcomm Intel and Dropbox engineers in late-2017 focus on delivering scalability without sacrificing decentralization or security.Core to Solanas scaling solution is a decentralized clock titled Proof-of-History (PoH) built to solve the problem of time in distributed networks in where there is not a single trusted source of time. By using Verifiable Delay Functions PoH allows each node to locally generate timestamps with SHA256 computations. This eliminates the need for the broadcasts of timestamps across the network improving overall network efficiency.SOL is the native token of the Solana blockchain. Community tokens are held by the Swiss Foundation which is run by an independent board. This token pool is used for bounties incentives programs marketing and grants.Solanas mission is to support all high-growth and high-frequency blockchain applications and to democratize the worlds financial systems.; Smart Contract Platforms. dpos | platform | solana-ecosystem | cms-holdings-portfolio | kinetic-capital | alameda-research-portfolio | multicoin-capital-portfolio',
'DOGE' : 'Dogecoin (DOGE) is a meme coin cryptocurrency. Dogecoin is a cryptocurrency invented by software engineers Billy Markus and Jackson Palmer as payment system that is instant fun and free from traditional banking fees. Dogecoin features the face of the Shiba Inu dog from the Doge meme as its logo and namesake. It was introduced December 6 2013 and quickly developed its own online community reaching a market capitalization of US $5382875000 on January 28 2021. The coin has produced 100 billion units by the end of 2014 and is now producing roughly 5 billion units per year. ; Mineable Currencies.',
'DOT' : 'Polkadot (DOT) development is on track to deliver a robust platform for security scalability and innovation. Currently Polkadot is in the NPoS phase of launch. Polkadot enables cross-blockchain transfers of any type of data or asset not just tokens. Connecting to Polkadot gives users the ability to interoperate with a wide variety of blockchains in the Polkadot network.The DOT token serves three distinct purposes: governance over the network staking and bonding.This page refers to the new DOT which is 100x smaller than the old DOT (the DOT token underwent a redenomination from its original sale on 21 August 2020 at 16:40 UTC block number 1248328); Smart Contract Platforms.',
'USDC' : 'USD Coin (USDC) is a fully collateralized US Dollar stable coin. It is built on the open source fiat stable coin framework developed by CENTRE and Circle is the first of several forthcoming issuers of USDC.USDC is designed to minimize price volatility and it does so by ensuring that every unit of USDC is only created when a corresponding US Dollar is deposited into a reserve bank account. Its major application at this point is as a mechanism for trading and hedging in global crypto capital markets. However USDC is being adopted for use cases such as lending payments investments and further applications within financial contracts such as derivatives contracts insurance contracts and security tokens.Commercial issuers of USDC are required by CENTRE to be licensed to handle electronic money; have audited AML and Compliance programs that meet FATF standards; back all tokens on a fully reserved basis and provide monthly published proof of reserves attested to by certified public auditors; support fungible exchange and redemption of USDC tokens from other authorized issuer members; meet other reporting and review requirements established by CENTRE Note that as a fully collateralized stablecoin the supply is determined by the USD deposits being taken on issuing services such as circle.com/usdc.Recently CENTRE announced that Coinbase is joining Circle as a founding member of CENTRE Consortium and as part of this USDC is now available on Coinbase Pro and coinbase.com.; Stablecoins.',
'UNI' : 'Uniswap (UNI) is a protocol for exchanging ERC-20 tokens on Ethereum. It eliminates trusted intermediaries and unnecessary forms of rent extraction allowing for fast efficient trading. Where it makes tradeoffs decentralization censorship resistance and security are prioritized. Uniswap is open-source software licensed under GPL.The introduction of UNI (ERC-20) on September 16th 2020 enables shared community ownership and a vibrant diverse and dedicated governance system which will actively guide the protocol towards the future.1 billion UNI have been minted at genesis and will become accessible over the course of 4 years. A perpetual inflation rate of 2% per year will start after 4 years ensuring continued participation and contribution to Uniswap at the expense of passive UNI holders.Uniswap has embraced the tenets of neutrality and trust minimization: it is crucial that governance is constrained to where it is strictly necessary. With this in mind the Uniswap governance framework is limited to contributing to both protocol development and usage as well as the development of the broader Uniswap ecosystem. In doing so UNI officially enshrines Uniswap as publicly-owned and self-sustainable infrastructure while continuing to carefully protect its indestructible and autonomous qualities.; Decentralized Exchanges DeFi.',
'LINK' : 'Chainlink (LINK) is a blockchain-base middleware acting as a bridge between cryptocurrency smart contracts and off-chain resources like data feeds various web APIs and traditional bank account payments. This way Chainlink allows Smart Contracts to communicate with external resources on their own. LINK is an ERC20 token based on the Ethereum Blockchain. It is used to pay Chainlink Node operators for the retrieval of data from off-chain data feeds formatting of data into blockchain readable formats off-chain computation and uptime guarantees they provide as operators.; Data Management Web3 DeFi; platform | defi | oracles | smart-contracts | substrate | polkadot | binance-smart-chain | polkadot-ecosystem | avalanche-ecosystem | solana-ecosystem | framework-ventures | polygon-ecosystem | fantom-ecosystem',
'BCH' : 'Bitcoin Cash (BCH) is a hard forked version of the original Bitcoin. It is similar to bitcoin with regards to its protocol; Proof of Work SHA-256 hashing 21000000 supply same block times and reward system. However two main differences are the the blocksize limits as of August 2017 Bitcoin has a 1MB blocksize limit whereas BCH proposes 8MB blocks. Bitcoin Cash is a proposal from the viaBTC mining pool and the Bitmain mining group to carry out a UAHF (User Activated Hard Fork) on August 1st 12:20 pm UTC. They rejected the agreed consensus (aka BIP-91 or SegWit2x) and have decided to fork the original Bitcoin blockchain and create this new version called Bitcoin Cash. Bitcoin Cash can be claimed by BTC owners who have their private keys or store their Bitcoins on a service that will split BCH for the customer. On November 15 2020 Bitcoin Cash experienced a scheduled upgrade. Bitcoin Cash developers from various full node projects changed the Difficulty Adjustment Algorithm (DAA) to a new DAA called aserti3-2d (or ASERT for short).Blockchain data provided by: Blockchair (Main Source) WhatToMine (Block Time only); Mineable Currencies.',
'LTC' : 'Litecoin (LTC) - provides faster transaction confirmations (2.5 minutes on average) and uses a memory-hard scrypt-based mining proof-of-work algorithm to target the regular computers and GPUs most people already have - which are its main differentials to Bitcoin. The Litecoin network is scheduled to produce 84 million currency units with a halving in reward every four years just like bitcoin. The coin was created by a Google employee Charles Lee. Litecoin is in second spot to Bitcoin and has spawned numerous clones - however it has a solid base of support and dedicated development team.The Litecoin project is currently maintained by a core group of 6 software developers led by Charles Lee with a large community that is growing in support.In May 2017 Litecoin became the first of the Top 5 (By Market Cap) cryptocurrencies to implement the SegWit scaling solution. Later in May of the same year the first Lightning Network transaction was completed through litecoin transferring 0.00000001 LTC from Zurich to San Francisco in under one second.Blockchain data provided by: Blockchair (Main Source) CryptoID (Backup) and WhatToMine (Block Time only); Mineable Currencies.',
'BUSD' : 'Binance USD (BUSD) is a stable coin pegged to USD that has received approval from the New York State Department of Financial Services (NYDFS). BUSD will be available for direct purchase and redemption at a rate of 1 BUSD = 1 USD.Starting September 12 2019 BUSD will be available on the Paxos platform for direct purchase and redemption 1:1 for U.S. dollars or PAX. Later in September it will become available on Binance.com for trading initially against BTC BNB and XRP and more to come. BUSD is now available for purchase and redemption on the Paxos platform. In order to get BUSD through Paxos you need to be a verified customer. You can either deposit PAX or deposit dollars by wire from a bank account.; Stablecoins.',
'LUNA' : 'Terra (LUNA) aims to build a new financial infrastructure that works better for everyone. The network is powered by a family of stablecoins each pegged to major fiat currencies all algorithmically stabilized by Terras native token Luna. Terras mission is to set money free by building open financial infrastructure. Luna as the native staking asset from which the family of Terra stablecoins derives their stability utility and value acts both as collateral for the entire Terra economy and as a staking token that secures the PoS network. Luna can be held and traded like a normal crypto asset but can also be staked to accrue rewards in the network generated from transaction fees. Luna can also be used to make and vote on governance proposals.The family of Terra stablecoins is designed to achieve stability through consistent mining rewards with a contracting and expanding money supply. For example if the system has detected that the price of a Terra currency has deviated from its peg it applies pressure to normalize the price. Currently the family of Terra stablecoins includes: KRT (Terra stablecoin pegged to Korean Won) UST (Terra stablecoin pegged to US Dollar) MNT (Terra stablecoin pegged to Mongolian Togrog) SDR (Terra stablecoin pegged to IMF SDR) with more being added in the future.; Stablecoins.cosmos-ecosystem | store-of-value | defi | payments | coinbase-ventures-portfolio | binance-labs-portfolio | solana-ecosystem | arrington-xrp-capital | hashkey-capital-portfolio | kinetic-capital | huobi-capital | pantera-capital-portfolio | terra-ecosystem',
'ICP' : 'Internet Computer (ICP) The DFINITY Foundation is a not-for-profit scientific research organization based in Zurich Switzerland that oversees research centers in Palo Alto San Francisco and Zurich as well as teams in Japan Germany the UK and across the United States. The Foundations mission is to build promote and maintain the Internet Computer.The Internet Computer extends the functionality of the public Internet so that it can host backend software transforming it into a global compute platform.Using the Internet Computer developers can create websites enterprise IT systems and internet services by installing their code directly on the public Internet and dispense with server computers and commercial cloud services.The Internet Computer is launching a revolutionary public network that provides a limitless environment for smart contracts that run at web speed serve web scale and reduce compute costs. Able to build everything from DeFi to mass market tokenized social media services that run on-chain or extend Ethereum dapps.',
'WBTC' : 'Wrapped Bitcoin (WBTC) is the first ERC20 token backed 1:1 with Bitcoin. WBTC standardizes Bitcoin to the ERC20 format creating smart contracts for Bitcoin. This makes it easier to write smart contracts that integrate Bitcoin transfers. To receive WBTC a user requests tokens from a merchant. The merchant then performs the required KYC / AML procedures and verifies the users identity. Once this is completed the user and merchant execute their swap with Bitcoin from the user transferring to the merchant and WBTC from the merchant transferring to the user.; Wrapped Tokens DeFi.',
'FIL' : 'Filecoin (FIL) is a decentralized storage network that turns cloud storage into an algorithmic market. The market runs on a blockchain with a native protocol token (also called Filecoin) which miners earn by providing storage to clients. Conversely clients spend Filecoin hiring miners to store or distribute data. Filecoin miners compete to mine blocks with sizable rewards but Filecoin mining power is proportional to active storage which directly provides a useful service to clients.; Technology File Storage Infrastructure Web3.',
'MATIC' : 'Polygon (MATIC) provides scalable secure and instant transactions using sidechains based on an adapted implementation of Plasma framework for asset security and a decentralized network of Proof-of-Stake (PoS) validators. In short it allows anyone to create scalable DApps while ensuring a superior user experience in a secure and decentralized manner. It has a working implementation for Ethereum on Ropsten Testnet. Matic intends to support other blockchains in the future which will enable it to provide interoperability features alongside offering scalability to existing public blockchains.Matic Network is expanding tech scope and mission and becoming Polygon ‚Äî Ethereums Internet of Blockchains.Existing Matic solutions remain functional and high priority. All the existing Matic solutions and implementations primarily Matic PoS Chain and Matic Plasma Chains remain fully functional and will continue to be developed and grown as very important components of the Polygon ecosystem. These implementations will not be impacted or changed in any way and no action is required from developers or end-users. The $MATIC token will continue to exist and will play an increasingly important role securing the system and enabling governance. See the official announcement.Polygon is a easy-to-use platform for Ethereum scaling and infrastructure development. Its core component is Polygon SDK a modular flexible framework that supports building and connecting two major types of solutions:Secured chains (aka Layer 2 chains): Scaling solutions that rely on Ethereum for security instead of establishing their own validator pool. Stand-alone chains (aka Sidechains): Sovereign Ethereum sidechains normally fully in charge of their own security i.e. with their own validator pool.; Technology Scaling Platform.',
'AVAX' : 'Avalanche (AVAX) is an open-source platform for launching decentralized finance applications and enterprise blockchain deployments in one interoperable highly scalable ecosystem. Developers who build on Avalanche can easily create applications and custom blockchain networks with complex rulesets or build on existing private or public subnets.Avalanche can confirm transactions in under one second supports the entirety of the Ethereum development toolkit and enables millions of independent validators to participate as full block producers (Avalanche had over 1000 full block-producing nodes on its Denali testnet).In addition to supporting transaction finality under one second Avalanche is capable of throughput orders of magnitude greater than existing decentralized blockchain networks (4500+ transactions/second) and security thresholds well-above the 51% standards of other networks.AVAX is the capped supply native token of the Avalanche platform. Participants can become full block-producers and validators by staking AVAX and are incentivized to do so because of staking rewards. Fees for all sorts of operations on the network are paid out in AVAX through burning thus increasing the scarcity of AVAX for all token holders.On September 2020 Avalanche announced the launch of its mainnnet. ; Smart Contract Platforms.',
'XLM' : 'Stellar(XLM) is a decentralized platform that aims to connect banks payments systems and people. Integrate to move money quickly reliably and at almost no cost. Supported by a nonprofit Stellars goal is to bring the world together by increasing interoperability between diverse financial systems and currencies.Stellar is a technology that enables money to move directly between people companies and financial institutions as easily as email. This means more access for individuals lower costs for banks and more revenue for businesses.Stellar Lumens is not mineable and does not use proof of work (PoW). Instead Stellar uses SCP the stellar consensus protocol. Blockchain data provided by: Blockchair (Block Number) Stellar.org Dashboard (Total Supply); Currencies.',
'VET' : 'VeChains (VET) Blockchain-as-a-Service (BaaS) platform is called ToolChain. ToolChain is a comprehensive blockchain platform offering diverse services including: product lifecycle management supply chain process control data deposit data certification and process certification. With ToolChain any sized business can utilize blockchain technology to further enhance brand perception and value as well as to expand into new business models.; Smart Contract Platforms.',
'ETC' : 'Ethereum Classic (ETC) is an attempt at keeping the Ethereum blockchain unaltered by the part of the community that opposed the hard fork and the return of The DAO funds. It started trading on Poloniex and is getting more and more traction.The Ethereum Classic mission statement is:We believe in decentralized censorship-resistant permissionless blockchains. We believe in the original vision of Ethereum as a world computer you cant shut down running irreversible smart contracts. We believe in a strong separation of concerns where system forks are only possible in order to correct actual platform bugs not to bail out failed contracts and special interests. We believe in censorship-resistant platform that can be actually trusted - by anyone.Our block explorer data: total coins supply total network hash rate last block number and total difficulty are freely provided by https://gastracker.io/In 2017 the Die Hard fork was implemented in ETC removing the Ethereum difficulty bomb. Currently there are no plans to move to Proof of Stake like Ethereum although developers at the IOHK institute are developing a new PoS protocol for Ethereum Classic.; Smart Contract Platforms.',
'THETA' : 'Theta (THETA) is a decentralized video delivery network powered by users.The Theta mainnet was launched on March 15th 2019 with the swap from ERC20 (Ethereum) Theta Tokens to native Theta Tokens on the Theta blockchain. To make sure that you receive your Theta Tokens on the mainnet as well as the 1:5 distribution of Theta Fuel download the new Theta wallet for Android OS or Apple iOS and move your tokens there.; Media Content Platform Video.',
'FTT' : 'FTX (FTT) is a cryptocurrency derivatives exchange built by traders for traders. It strives to build a platform powerful enough for professional trading firms and intuitive enough for first-time users.FTX Token (FTT) is the backbone of the FTX ecosystem. It has been carefully designed with incentive schemes to increase network effects and demand for FTT and to decrease its circulating supply.; Centralized Exchanges.',
'TRX' : 'TRON (TRX) is a cryptocurrency payment platform. It allows the users to perform cryptocurrencies transactions between them on a global scale within a decentralized ecosystem. TRON has finished its native token (TRX) migration to the mainnet. In addition users can access the platform digital wallet the TRON Wallet where it is possible to store and manage their digital assets with support for desktop and mobile devices. Since July 24th 2018 TRON acquired BitTorrent Inc. which is an Internet technology company based in San Francisco. It designs distributed technologies that scale efficiently keep intelligence at the edge and keep creators and consumers in control of their content and data.The TRX token is a cryptographic currency developed by TRON. Formerly an ERC-20 token the TRX has now finished its migration to the TRON mainnet. This token is the medium for the users to exchange value between them when using the platform services.; Smart Contract Platforms.',
'DAI' : 'The Maker Protocol (DAI) also known as the Multi-Collateral Dai (MCD) system allows users to generate Dai by leveraging collateral assets approved by Maker Governance. Maker Governance is the community organized and operated process of managing the various aspects of the Maker Protocol. Dai is a decentralized unbiased collateral-backed cryptocurrency soft-pegged to the US Dollar. Resistant to hyperinflation due to its low volatility Dai offers economic freedom and opportunity to anyone anywhere.Dai is collateral-backed money whose value is pegged to the US Dollar and kept stable through a framework of aligned financial incentives.The Dai token lives on the Ethereum blockchain; its stability is unmediated by any central party and its solvency does not rely on any trusted counterparties. All circulating Dai are generated from Maker Vaults and are backed by a surplus of collateral assetsTelegram; Stablecoins.',
'EOS' : 'EOS.IO (EOS)is software that introduces a blockchain architecture designed to enable vertical and horizontal scaling of decentralized applications (the EOS.IO Software). This is achieved through an operating system-like construct upon which applications can be built. The software provides accounts authentication databases asynchronous communication and the scheduling of applications across multiple CPU cores and/or clusters. The resulting technology is a blockchain architecture that has the potential to scale to millions of transactions per second eliminates user fees and allows for quick and easy deployment of decentralized applications. For more information please read the EOS.IO Technical White Paper.Blockexplorer: https://eospark.com/ In the case of EOS circulating supply and total supply are available but max supply is not available which indicates that EOS supply is infinite. The current cap is 1 billion tokens there will be an inflation of up to 5% per annum to reward the block producers and they may use these to sell or to invest back into EOS dapps. Blockchain data provided by: Blockchair (main source) Bloks.io (backup); Smart Contract Platforms.',
'ATOM' : 'Cosmos (ATOM) is a network of many independent blockchains called zones. The zones are powered by Tendermint Core which provides a high-performance consistent secure PBFT-like consensus engine where strict fork-accountability guarantees hold over the behaviour of malicious actors. Tendermint Cores BFT consensus algorithm is well suited for scaling public proof-of-stake blockchains.The first zone on Cosmos is called the Cosmos Hub. The Cosmos Hub is a multi-asset proof-of-stake cryptocurrency with a simple governance mechanism which enables the network to adapt and upgrade. In addition the Cosmos Hub can be extended by connecting other zones. The hub and zones of the Cosmos network communicate with each other via an inter-blockchain communication (IBC) protocol a kind of virtual UDP or TCP for blockchains. Tokens can be transferred from one zone to another securely and quickly without the need for exchange liquidity between zones. Instead all inter-zone token transfers go through the Cosmos Hub which keeps track of the total amount of tokens held by each zone. The hub isolates each zone from the failure of other zones. Because anyone can connect a new zone to the Cosmos Hub zones allow for future-compatibility with new blockchain innovations. The supply wont be limited as the project plans to introduce a yearly inflatory model. ; Smart Contract Platforms.',
'XMR' : 'Monero (XMR) is a decentralized cryptocurrency meaning it is secure digital cash operated by a network of users. Transactions are confirmed by distributed consensus and then immutably recorded on the blockchain.Monero uses ring signatures ring confidential transactions and stealth addresses to obfuscate the origins amounts and destinations of all transactions. Transactions on the Monero blockchain cannot be linked to a particular user or real-world identity.Monero is is private by default. Units of Monero cannot be blacklisted by vendors or exchanges due to their association in previous transactions.Blockchain data provided by: Blockchair (Main Source) LocalMonero (Backup) and WhatToMine (Block Time only); Mineable Currencies.',
'CAKE' : 'PancakeSwap (CAKE) is an automated market maker (AMM) that allows two tokens to be exchanged on the Binance Smart Chain. It is designed to be fast cheap allowing anyone to participate. PancakeSwap runs on Binance Smart Chain a blockchain with lower transaction costs than Ethereum or Bitcoin.Unlike centralized exchanges PancakeSwap doesnt hold funds when users trade giving them 100% ownership of their own crypto.Built on open-source software the website and all Smart Contracts are publicly visible for maximum transparency.Contracts are verified on BscScan so users know that what they see is what they get.Telegram | Instagram; Decentralized Exchanges DeFi.',
'AAVE' : 'Aave (AAVE) is a decentralized non-custodial money market protocol where users can participate as depositors or borrowers. Depositors provide liquidity to the market to earn a passive income while borrowers are able to borrow in an overcollateralized (perpetually) or undercollateralized (one-block liquidity) fashion. The goal of Aave as a protocol is to bring decentralized finance to the masses.Aave protocol has been audited and secured. The protocol is completely open source which allows anyone to interact with Aave user interface client API or directly with the smart contracts on the Ethereum network..Feel free to refer to the White Paper for a deeper dive into Aave Protocol mechanisms.Aave (LEND) is migrating to Aave (AAVE) please refer to the following announcement. ; Finance Lending DeFi.',
'ALGO' : 'The Algorand Foundation (ALGO) is dedicated to fulfilling the global promise of blockchain technology by leveraging the Algorand protocol and open source software which was initially designed by Silvio Micali and a team of leading scientists. With core beliefs in the establishment of an open public and permissionless blockchain the Algorand Foundation has a vision for an inclusive ecosystem that provides an opportunity for everyone to harness the potential of an equitable and truly borderless economy.The Algorand platform is a public a permissionless pure proof-of-stake blockchain protocol that solves the blockchain trilemma of achieving scalability security and true decentralization all at once.Performance on the Algorand platform exceeds 1000 transactions per second (TPS) with a latency of fewer than 5 seconds putting it on par with the throughput of major global payment networks without compromising security or decentralization.; Smart Contract Platforms.',
'MIOTA' : 'IOTA (MIOTA) is an open-source distributed ledger protocol that goes beyond blockchain through its core invention of the blockless Tangle. The IOTA Tangle is a quantum-proof Directed Acyclic Graph with no fees on transactions &amp; no fixed limit on how many transactions can be confirmed per second in the network. Instead throughput grows in conjunction with activity in the network; the more activity the faster the network. Unlike blockchain architecture IOTA has no separation between users and validators; rather validation is an intrinsic property of using the ledger thus avoiding centralization. IOTA is initially focused on serving as the backbone of the emerging Internet-of-Things (IoT). For a more in depth look at the technical design of IOTA read their https://iota.org/IOTA_Whitepaper.pdf. The total supply of IOTA is (3^33 - 1) / 2 = 2779530283277761 tokens. This value is optimized for ternary computation - it is the largest possible 33-digit ternary number:111111111111111111111111111111111 (base-3) = 2779530283277761 (base-10)The total IOTA token supply was minted on the genesis transaction and will never change. It is now impossible for anyone to mint or mine new IOTA tokens.IOTA uses the International System of Units (or SI units):; Medium of Exchange IoT Sharing Economy.',
'CRO' : 'The mission of Crypto.com (CRO)  is to accelerate the worlds transition to crypto. The Crypto.com team aims to put cryptocurrency in every wallet with a strong focus on real-life use cases.Crypto.com Chain (CRO) is a cryptocurrency token issued on the Ethereum platform with secondary distribution only. No pre-sale no public sale or ICO.; Finance Payment Platform DeFI.',
'AXS' : 'Axie Infinity Shards (AXS) What are Axie Infinity Shards (AXS)?Axie Infinity Shards (AXS) are the governance token of the popular blockchain-based game Axie Infinity. The game was created by SkyMavis and allows players to earn income through non-fungible tokens (NFTs) by breeding battling and trading digital pets called Axies.Players need AXS tokens to trade Axies and can stake their coins to earn weekly rewards and participate in the protocols governance. New players have to buy at least three tokens priced in ether to truly participate in the game.Each Axie is an NFT on its own with different attributes. These pets can enter battles to earn experience points and more. They can also be bred together to create new Axie NFTs with different attributes. These new Axies can then be used or sold on the Axie marketplace.According to DappRadar the Axie Infinity game has multiple ways to earn revenue and has been gaining popularity in developing countries like Brazil India Indonesia and Venezuela as a way to earn income. Dedicated players can reportedly earn over $1000 a month in the game.Who created AXS?The Axie Infinity game was created back in 2018 by Sky Mavis a firm co-founded by Trung Nguyen and Aleksander Larsen. In total the Axie Infinity team now has 25 full-time employees actively working on improving the game.The Axie Infinity Shards were launched in November 2020 with a public sale price of just $0.1 per token – meaning their price has increased over 28000% since launch. Their launch came as part of an effort to decentralize the game Etherscan data shows there are over 10500 AXS holders.Where can you buy AXS?The cryptocurrency is currently being traded on major cryptocurrency exchanges including Binance Huobi Global FTX Gate.io Uniswap 0x Protocol and the Bancor Network. You can find out more about which currencies AXS is traded against and on which platforms on our analysis tab. ',
'XTZ' : 'Tezos (XTZ) is a new decentralized blockchain that governs itself by establishing a true digital commonwealth. It facilitates formal verification a technique that mathematically proves the correctness of the code governing transactions and boosts the security of the most sensitive or financially weighted smart contracts.Tezos takes a fundamentally different approach to governance by creating governance rules for stakeholders to approve of protocol upgrades that are then automatically deployed on the network. When a developer proposes a protocol upgrade they can attach an invoice to be paid out to their address upon approval and inclusion of their upgrade. This approach provides a strong incentive for participation in the Tezos core development and further decentralizes the maintenance of the network. It compensates developers with tokens that have immediate value rather than forcing them to seek corporate sponsorships foundation salaries or work for Internet fame alone.Blockchain data provided by: Blockchair (main source) TzStats (backup); Smart Contract Platforms.',
'GRT' : 'The Graph (GRT) is an indexing protocol for querying data for networks like Ethereum and IPFS powering many applications in both DeFi and the broader Web3 ecosystem. Anyone can build and publish open APIs called subgraphs that applications can query using GraphQL to retrieve blockchain data. There is a hosted service in production that makes it easy for developers to get started building on The Graph and the decentralized network will be launching later this year. The Graph currently supports indexing data from Ethereum IPFS and POA with more networks coming soon. ; Data Management Infrastructure Web3 Polygon Ecos; ai-big-data | enterprise-solutions | defi | binance-smart-chain | coinbase-ventures-portfolio | solana-ecosystem | analytics | coinfund-portfolio | dcg-portfolio | fabric-ventures-portfolio | framework-ventures | ledgerprime-portfolio | multicoin-capital-portfolio | parafi-capital | polygon-ecosystem | fantom-ecosystem',
'FTM' : 'FANTOM  (FTM) is a new DAG based Smart Contract platform that intends to solve the scalability issues of existing public distributed ledger technologies. The platform intends to distinguish itself from the traditional block ledger-based storage infrastructure by attempting to employ an improved version of existing DAG-based protocols. The FANTOM platform adopts a new protocol known as the Lachesis Protocol to maintain consensus. This protocol is intended to be integrated into the Fantom OPERA Chain. The aim is to allow applications built on top of the FANTOM OPERA Chain to enjoy instant transactions and near-zero transaction costs for all users. The mission of FANTOM is to provide compatibility between all transaction bodies around the world and create an ecosystem that allows real-time transactions and data sharing at a low cost.; Gaming Media and Entertainment.',
'NEO' : 'Neo (NEO) was founded by Da Hongfei and Erik Zhang in 2014 under the name Antshares. The original source code was published to GitHub in July 2015 and the MainNet subsequently launched in October 2016.In 2017 Antshares was rebranded to Neo as it implemented Smart Contracts 2.0. It underwent aggressive global expansion as hundreds of new developers poured onto the blockchain. Neo leadership began distributing NEO token rewards to groups and individuals that contributed to the growth of the Neo platform. Some of the earliest groups to join Neo included COZ NeoEconoLabs and O3 Labs.In 2021 Neo is being upgraded to version 3.0 known as N3. As a project that began in June 2018 the N3 upgrade represents the biggest advancement in Neos history. It is aimed at bringing the first all-in-one blockchain development experience to the industry packed with powerful native features such as distributed storage oracles and name services. Neo N3 also boasts a simpler and more modular architecture than its predecessors along with an improved governance and economic model.Neo is an open-source community driven blockchain platform.A feature-complete blockchain platform for building decentralized applications. Neo enables developers to digitize and automate the management of assets through smart contracts. It also provides powerful native infrastructures such as decentralized storage oracles and domain name service creating a solid foundation for the Next-Gen Internet.With a total of 100 million tokens NEO has two main features:- The right to vote in elections to determine NEO council members;- The right to claim GAS needed to perform transactions in the NEO networkThe minimum unit of NEO is 1 and tokens are indivisible. This means if you are withdrawing from an exchange to your wallet you must withdraw in whole numbers. It also means that NEO is one of the scarcest public blockchain tokens as it cannot be broken down into smaller pieces.; Smart Contract Platforms.',
'KLAY' : 'Klaytn (KLAY) is Kakaos global public blockchain project and is an enterprise-grade service-centric platform that brings user-friendly blockchain experience to millions. It combines features of both public blockchains (decentralized data &amp; control distributed governance) and private blockchains (low latency high scalability) via an efficient hybrid design. Klaytn is secured by participation from numerous reputable brands around the globe working together to create a reliable business platform atop a robust system of decentralized trust. Klaytn enables businesses and entrepreneurs today to capture value using blockchain technology. Klaytn was designed by GroundX.Facebook | LinkedIn ; Smart Contract Platforms.',
'QNT' : 'Quant Overledger  (QNT) is a blockchain operating system (OS) that aims to empower applications to function across multiple blockchains and facilitates the creation of internet scale multi-chain applications otherwise known as MApps. Overledger securely removes the barriers that prohibit communication across multiple blockchains providing endless possibilities for your data and applications.QNT is an Ethereum-based token that powers the network. ; Gaming Media and Entertainment NFTs.',
'BSV' : 'Bitcoin SV restores the original Bitcoin protocol aiming to keep it stable and allow it to massively scale. Bitcoin SV will maintain the vision set out by Satoshi Nakamotos white paper in 2008: Bitcoin: A Peer-to-Peer Electronic Cash SystemReflecting its mission to fulfill the vision of Bitcoin the project name represents the Satoshi Vision or SV. Created at the request of leading BSV mining enterprise CoinGeek and other miners Bitcoin SV is intended to provide a clear choice for miners and allow businesses to build applications and websites on it reliably.; Mineable Currencies.',
'MKR' : 'Maker DAO (MKR) is a decentralized autonomous organization on the Ethereum blockchain seeking to minimize the price volatility of its own stable token Dai against the IMFs currency basket SDR. Its token MKR is a speculative Ethereum based asset that backs the value of the dai a stable price stable coin issued on Ethereum. Maker earns a continuous fee on all outstanding dai in return for governing the system and taking on the risk of bailouts. Makers income is funnelled to MKR owners through BuyBack program (Buy&amp;Burn).; Finance Lending DeFi.',
'EGLD' : 'Elrond (EGLD) is a novel architecture that goes beyond state-of-the-art by introducing a genuine State Sharding scheme for practical scalability eliminating energy and computational waste while ensuring distributed fairness through a Secure Proof of Stake (SPoS) consensus mechanism. Having a strong focus on security Elronds network is built to ensure resistance to known security problems like the Sybil attack Rogue-key attack Nothing at Stake attack and others. In an ecosystem that strives for interconnectivity Elronds solution for smart contracts offers an EVM compliant engine to ensure interoperability by design.Elrond (ERD) to Elrond (EGLD) swap:Following the launch of the Elrond Mainnet on the 30th of July Elrond officially began the token swap from ERD to EGLD on the 3rd of September of 2020. The eGLD ticker is an abbreviation for eGold denoting the metaphor of what the Elrond currency aims to become. Elronds dedicated website Elrond Bridge enabled ERC20/BEP2 ERD holders to swap their tokens for eGLD at a 1000:1 ratio (1000 ERD (old) = 1 eGLD (new)). ; Smart Contract Platforms.',
'KSM' : 'Kusama (KSM) is an early unaudited and unrefined release of Polkadot. Kusama will serve as a proving ground allowing teams and developers to build and deploy a parachain or try out Polkadots governance staking nomination and validation functionality in a real environment.With KSM users can validate nominate validators bond parachains pay for interop message passing and vote on governance referenda.; Smart Contract Platforms.',
'HBAR' : 'Hedera (HBAR) is a decentralized public network for the users to make its digital world exactly as it should be ‚Äì theirs. Whether the user is a startup or enterprise a creator or a consumer Hedera is designed to go beyond blockchain for developers to create the next era of fast fair and secure applications.HBAR is the native energy-efficient cryptocurrency of the Hedera public network. Hbars are used to power decentralized applications and protect the network from malicious actors.Developers use hbars to pay for network services such as transferring hbars managing fungible and non-fungible tokens and logging data. For each transaction submitted to the network hbars are used to compensate network nodes for bandwidth compute and storage.Hederas proof-of-stake public network uses hbars which are staked or proxy staked (coming soon) to a network node to weight votes on transactions when reaching consensus.Weighted voting with hbars makes it difficult and expensive for a bad actor to maliciously affect consensus ‚Äî it would require them to own and stake over one-third of the networks total supply of HBAR which will not be possible for the first 5 years.; Smart Contract Platforms.',
'BTT' : 'BitTorrent Protocol (BTT) is a decentralized protocol with over 1 billion users. BitTorrent Inc. invented and maintains the BitTorrent protocol. While there are many implementations of the BitTorrent software BitTorrent and ¬µTorrent (often called utorrent) remain two of the most popular. In 2018 BitTorrent Protocol reached a strategic partnership with TRON Blockchain Protocol. On July 24 2018 TRON has successfully acquired BitTorrent and all BitTorrent products.BitTorrent (BTT) the token is a TRC-10 utility token based on the TRON blockchain to foster faster speed on the worlds largest decentralized application.; Technology Distributed Computing Web3.',
'WAVES' : 'Waves (WAVES) is an open blockchain protocol and development toolset for Web 3.0 applications and decentralized solutions aiming to raise security reliability and speed of IT systems. It enables anyone to build their apps fostering mass adoption of blockchain with a wide range of purpose-designed tools for making the process of developing and running dApps easy and accessible. Launched in 2016 Waves has since released numerous successful blockchain-based solutions and has steadily developed into a rich and constantly-growing technological platform. Waves technology is designed to address the needs of developers and companies that want to leverage the properties of blockchain systems ‚Äì including their security auditability verifiability and the trustless execution of transactions and business logic.Waves Platform provides everything required to support the backend of Web 3.0 services. In 2017 Waves successfully launched its mainnet with LPoS pioneer decentralised exchange DEX and later the Waves-NG protocol. In 2018 the Waves development team delivered the first implementation of smart contracts. This was followed by the release of the RIDE programming language in 2019 a simple and powerful language for programming logic. Moreover in June 2019 the mainnet of Waves Enterprise a global private blockchain solution was launched. All of this is complemented with a broad infrastructure: an IDE for sandbox development tools SDKs libraries frameworks and protocols for convenient and easy integrations.; Smart Contract Platforms. lpos | platform | smart-contracts | solana-ecosystem',
'NEAR' : 'NEAR (NEAR) is an open-source decentralized platform with the potential to change how systems are designed how applications are built and how the web itself works. It is a complex technology with a simple goal ‚Äî allow developers and entrepreneurs to easily and sustainably build applications which secure high value assets like money and identity while making them performant and usable enough for consumers to access. NEAR provides a community-operated cloud infrastructure for deploying and running decentralized applications.  It combines the features of a decentralized database with others of a serverless compute platform. The token which allows this platform to run also enables applications built on top of it to interact with each other in new ways.  Together these features allow developers to create censorship resistant back-ends for applications that deal with high stakes data like money identity and assets and open-state components which interact seamlessly with each other. NEARs token economy is built around the NEAR token a unit of value on the platform that enables token holders to use applications on NEAR participate in network governance and earn token rewards by staking to the network.; Smart Contract Platforms.',
'LEO' : 'LEO Token (LEO) is a utility token designed to empower the Bitfinex community and provide utility for those seeking to maximize the output and capabilities of the Bitfinex trading platform will commence trading on Monday May 20th at 08:00 UTC on Bitfinex. The tokens will be tradable against BTC USD USDT EOS and ETH.The company motto Unus Sed Leo is a Latin citation from Aesops fable The Sow and the Lioness. The fable (in short) details how a sow brags about how many children she has and then asks the lioness if she only had one child. The lioness replies One but a lion.; Centralized Exchanges.',
'SHIB' : 'Shiba Inu (SHIB) SHIB is an experiment in decentralized spontaneous community building. SHIB token is the project first token and allows users to hold Billions or even Trillions of them. SHIBA INU is a 100% decentralized community experiment that claims that 1/2 the tokens have been sent to Vitalik Buterin and the other half were locked to a Uniswap pool and the keys burned.',
'HT' : 'The Huobi token (HT) is an ERC-20 token that allows users to receive a discount for any fees on the Huobi exchange. The HT tokens will be issued by an airdrop in which 60% of the tokens will be credit to the users accounts 20% will be used to support the platform operations and the last 20% will be used as an incentive to Huobis team with a freezing period of 4 years. In the future the team plans to announce more benefits for the HT token holders.; Centralized Exchanges.',
'COMP' : 'Compound (COMP) is an ERC-20 asset that empowers community governance of the Compound protocol; COMP token-holders and their delegates debate propose and vote on all changes to the protocol.By placing COMP directly into the hands of users and applications an increasingly large ecosystem will be able to upgrade the protocol and will be incentivized to collectively steward the protocol into the future with good governance.Each day approximately 2312 COMP will be distributed to users of the protocol; the distribution is allocated to each market (ETH USDC DAI‚Ä¶) and is set through the governance process by COMP token-holders.Within each market half of the distribution is earned by suppliers and the other half by borrowers.; Finance Lending DeFi.',
'UST' : 'Terra (UST) aims to build a new financial infrastructure that works better for everyone. The network is powered by a family of stablecoins each pegged to major fiat currencies all algorithmically stabilized by Terras native token Luna. Terras mission is to set money free by building open financial infrastructure. Luna as the native staking asset from which the family of Terra stablecoins derives their stability utility and value acts both as collateral for the entire Terra economy and as a staking token that secures the PoS network. Luna can be held and traded like a normal crypto asset but can also be staked to accrue rewards in the network generated from transaction fees. Luna can also be used to make and vote on governance proposals.The family of Terra stablecoins is designed to achieve stability through consistent mining rewards with a contracting and expanding money supply. For example if the system has detected that the price of a Terra currency has deviated from its peg it applies pressure to normalize the price. Currently the family of Terra stablecoins includes: KRT (Terra stablecoin pegged to Korean Won) UST (Terra stablecoin pegged to US Dollar) MNT (Terra stablecoin pegged to Mongolian Togrog) SDR (Terra stablecoin pegged to IMF SDR) with more being added in the future.; Stablecoins.',
'DASH' : 'Dash (DASH) is an open-source cryptocurrency. It is an altcoin that was forked from the Bitcoin protocol. It is also a decentralized autonomous organization (DAO) run by a subset of its users which are called masternodes. The currency permits transactions that can be untraceable.Created in 2014 Dash is comprised of features such as:Two-tier network with incentivized nodes and decentralized project governance (Masternodes)Instantly settled payments (InstantSend)Instantly immutable blockchain (ChainLocks)Optional privacy (PrivateSend)Blockchain data provided by: Blockchair (Main Source) CryptoID (Backup) and WhatToMine (Block Time only); Mineable Currencies.',
'AMP' : 'Amp (AMP) Amp is the evolution of Flexacoin ($FXC). Amp is a digital collateral token designed to facilitate fast and efficient value transfer especially for use cases that prioritize security and irreversibility.As collateral Amp insures the value of any transfer while it remains unconfirmed—a process which can take anywhere from seconds to hours to days. Amp tokens used as collateral are generally released when consensus for a particular transfer is achieved making them available to collateralize another transfer. In the event that consensus is not achieved for the transfer the Amp collateral can instead be liquidated to cover losses.Flexa uses Amp to secure transactions and build networks that accrue value both securely and transparently.At the core of the Amp collateral model is the concept of the collateral partition. Collateral partitions represent subsets of Amp tokens that provide collateral for particular purposes and are distinguished on the Ethereum blockchain with unique partition addresses. Each collateral partition can be endowed with its own set of rules regarding transfer hooks and privileges and can also implement a predefined partition strategy in order to enable special capabilities (e.g. collateral models in which tokens are staked without ever leaving their original address).On Tuesday September 8 2020 Flexacoin ($FXC) became available to migrate to Amp ($AMP). See the official announcement.',
'CHZ' : 'Chiliz (CHZ) is a fin-tech platform for tokenizing sports teams. Its currency and blockchain technology power products for casual mainstream consumers. Socios.com - a tokenized fan engagement solution for sports - is the first platform powered by Chiliz.The CHZ token is currently available across two blockchains in BEP-2 &amp; ERC20 variations. It is openly purchasable on multiple centralized exchanges including Binance DEX KuCoin Bitmax and others. CHZ tokens will also be purchasable on Socios.com via debit/ credit card.CHZ tokens run on both Binance Chain and the Ethereum blockchain.; Media and Entertainment.',
'RUNE' : 'THORChain (RUNE) is built for cross-chain permissionless digital asset liquidity. Stake assets in liquidity pools to earn fees swap assets instantly at open market prices borrow and lend on any asset and pay in any currency.; Decentralized Exchanges DeFi.',
'REV' : 'Revain (REV) is a utility token based on Ethereum and Tron from Revain a blockchain-based review platform for the crypto community established in 2018. Revain platform consists of 6 main sections: projects exchanges wallets games casinos and cards. In each section they rank every company based on their user rating and number of reviews.Any crypto website is able to integrate reviews from the platform using Revain Widget. In this case website users can write their feedback without leaving it and all reviews will appear on Revain platform as well.All user reviews are written in the blockchain providing full transparency. No one can change or delete them including the Revain itself. This makes review manipulation by any party nearly impossible.Revains ultimate goal is to provide high-quality and authentic user feedback on all global products and services using new emerging technologies like blockchain and machine learning.Revain recently replaced the smart contract and made an automatic swap from the coin (R) to coin (REV) in the ratio of 1:1 for all existing token holders. For more information regarding the swap please click here.; Technology AI Reviews.',
'HNT' : 'Helium (HNT) is a mineable cryptocurrency.  With a Helium Hotspot anyone can earn cryptocurrency by building a wireless network in their city and creating a more connected future. It provides wireless coverage for low power Internet of Things (IoT) devices and earns a new cryptocurrency Helium from the users living room. HNT is mined and distributed to Hotspot Owners Helium Inc. and Investors. Helium uses algorithm called Proof-of-Coverage (PoC) to verify that Hotspots are located where they claim (as established in the assert_location transaction when they are first deployed).There is no pre-mine of HNT and a max supply of 223M HNT. HNT supply comes from mining with a compatible Hotspot that both mines HNT and creates network coverage for IoT devices.All HNT was mined from genesis starting at a rate of 5M HNT/month and then halving every 2 years. On August 1st 2021 the net HNT issuance will be reduced to 2.5M HNT per month. The distribution of HNT changes over time to align incentives with the needs of the network. In the early days a higher proportion of HNT is allocated to Hotspot owners for building and securing coverage. As the network grows Hotspots earn more for transferring device data on the network while Helium Inc. and investors earn less. After 20 years distributions no longer adjust and remain fixed.; IoT Enterprise Infrastructure Web3.',
'DCR' : 'Decred (DCR) is an open progressive and self-funding cryptocurrency with a system of community-based governance integrated into its blockchain. At its core is a hybridized proof-of-work proof-of-stake (PoW/PoS) consensus system that aims to strike a balance between PoW miners and PoS voters to create a more robust notion of consensus. The project is a result of the theoretical proposals brought by proof-of-activity (PoA) and MC2 in 2013. Decred development started in April 2014 with a single developer and expanded to include developers from btcsuite shortly thereafter.Decred is built in the spirit of open participation and we have provided below a full disclosure of the technical features of the system wallets and mining initial funding and distribution project governance and development and a group contribution timeline.Decred opted for a different funding model in an attempt to shift the risk carried by supporters to the developers of the project. Instead of asking interested parties to fund the development of the software the developers decided to pool funds together and carry the project to completion before making it public. The consensus was that this is an ethical path given the realities of funding software development due to the fact that the developers alone carry the risk of the project failing whereas in the past potential users were expected to pay for coins before any code was written. We felt this was unjust.The development of Decred was funded by Company 0 and from the pockets of its developers individually. The cost of developing the project in terms of developer pay totals to approximately USD 250000 which Company 0 paid to developers. An additional amount of approximately USD 165000 has been allocated for unpaid work and individual purchases by developers. We felt that the most equitable way to handle compensation for these expenses was to perform a small premine as part of the project launch. The model is unusual in that no developer received any amount of coins for free - all coins owned by developers will either be purchased at a rate of USD 0.49 per coin from their own pockets or exchanged for work performed at the same rate.The premine consists of 8% of the total supply of 21 million coins meaning the premine consists of 1.68 million coins. Rather than allocating the entire premine to the bring-up costs we decided to split the premine equally between compensation for bring-up and an airdrop where we freely give an equal amount of coins to a number of airdrop participants. This means Company 0 and its developers will have put roughly USD 415000 into the bring-up since April 2014 and receive 4% of the total supply 840000 coins (at USD 0.49 per coin). The remaining 4% will be spread evenly across a list of airdrop participants as part of an effort to build the Decred network and decentralize its distribution.  Coins held by Company 0 will be used to fund its ongoing work on open-source projects such as Decred and btcsuite.Giving away these coins in an airdrop allows us to accomplish several things at once for the project: enlarge the Decred network further help decentralize the distribution of coins and allow us to get coins into the hands of people who are interested in participating in the project. Decred is fundamentally about technological progress so the airdrop will target individuals that have made contributions to advance technology in its various forms. The maximum number of airdrop participants is capped at 5000 individuals so we recommend registering sooner rather than later. These coins will be given away unconditionally and there is zero expectation of Decred receiving anything from you in return for these coins.Sign up for the airdrop is currently open but the airdrop registration will commence on January 4th 2016. People who have been selected to participate in the airdrop will receive an email that contains a link to a web registration form. This form will require airdrop participants to enter an address to which their coins can be sent. Binaries and source code will be made available so that you can generate a wallet seed and an address for your airdrop coins. Once you have entered your receiving address into the airdrop webform and submitted it you will receive your coins on the projected launch date.; Currencies Privacy.',
'TFUEL' : 'Theta Fuel (TFUEL) is part of the Theta Network and protocol  aim to solve various challenges the video streaming industry faces today. First tokens on the Theta blockchain are used as an incentive to encourage individual users to share their redundant computing and bandwidth resources as caching or relay nodes for video streams. This improves the quality of stream delivery and solves the last-mile delivery problem the main bottleneck for traditional content delivery pipelines especially for high-resolution high bitrate 4k and 8k.Second with sufficient network density the majority of viewers will pull streams from peering caching nodes allowing video platforms to significantly reduce content delivery network (CDN) costs. More importantly by introducing tokens as an end-user incentive mechanism the Theta Network allows video platforms to deepen viewer engagement drive incremental revenuesTheta Fuel (TFUEL) is the operational token of the Theta protocol. TFUEL is used for on-chain operations like payments to Edge Node relayers for sharing a video stream or for deploying or interacting with smart contracts. Relayers earn TFUEL for every video stream they relay to other users on the network. You can think of Theta Fuel as the gas of the protocol. There were 5 billion TFUEL at genesis of Theta blockchain and the supply increases annually at a fixed percentage set at the protocol level. In December 2020 Theta Labs announced Theta 3.0 which introduces a new crypto-economics design for TFuel in particular the concept of TFuel staking and burning. This will greatly expand the capacity and use cases of the network and maximize the utility value of TFuel.; Media Content Platform Payments.',
'HOT' : 'Holochain (HOT) is a decentralized application platform that uses peer-to-peer networking for processing agent-centric agreement and consensus mechanisms between users. In Holochain no true global consensus is maintained. Instead each agent in the public blockchain maintains a private fork that is managed and stored in a limited way on the public blockchain with a distributed hash table. This enables every device on a network to function independently and only requires the synchronization of data when necessary or agreed upon by users. This could translate into higher scalability for dapps hosted on Holochain. The Holo ecosystem relies on hosts that provide processing and storage for distributed applications while earning redeemable credits. Holochain Dapps can be developed with JavaScript or Lisp with support for front-end systems using CSS HTML and JavaScript.; Technology Application Development.',
'ZEC' : 'ZCash (ZEC) is a privacy driven cryptocurrency. It uses the Equihash as an algorithm which is an asymmetric memory-hard Proof of Work algorithm based on the generalized birthday problem. It relies on high RAM requirements to bottleneck the generation of proofs and making ASIC development unfeasible. ZCash uses zero-knowledge Succinct Non-interactive Arguments of Knowledge (zk-SNARKs) to ensure that all information (sender receiver amount) is encrypted without the possibility of double-spending. The only information that is revealed regarding transactions is the time in which they take place.Blockchain data provided by: Blockchair (Main Source) Zchain Explorer (Backup) ; Mineable Currencies.',
'XEM' : 'NEM (XEM) is a peer-to-peer crypto platform. It is written in Java and JavaScript with 100% original source code. NEM has a stated goal of a wide distribution model and has introduced new features in blockchain technology in its proof-of-importance (POI) algorithm. NEM also features an integrated P2P secure and encrypted messaging system multisignature accounts and an Eigentrust++ reputation system.NEM has gone through extensive open alpha testing starting June 25 2014 followed by lengthy and comprehensive beta testing starting on October 20 2014. NEM finally launched on May 31 2015.; Smart Contract Platforms .',
'STX' : 'Stacks (STX) is an open-source network of decentralized apps and smart contracts built on Bitcoin. The Stacks blockchain is a flexible layer on top of Bitcoin that enables decentralized apps smart contracts and digital assetsA layer-1 blockchain that connects to Bitcoin for security and enables decentralized apps and predictable smart contracts Stacks implements Proof of Transfer (PoX) mining that anchors to Bitcoin security and produces blocks at the same rate as Bitcoin.Stacks Token (STX) is the native asset on the Stacks blockchain and used as fuel for transactions. All transactions from executing Clarity contracts to creating digital assets are paid for in STX.; Gaming Media and Entertainment NFTs.',
'AR' : 'Arweave (AR) is a new type of storage that backs data with sustainable and perpetual endowments allowing users and developers to truly store data forever ‚Äì for the very first time.As a collectively owned hard drive that never forgets Arweave allows users to remember and preserve valuable information apps and history indefinitely. By preserving history it prevents others from rewriting it.; File Storage Filesharing Distributed Computing. distributed-computing | filesharing | storage | coinbase-ventures-portfolio | solana-ecosystem | blockchain-capital-portfolio | a16z-portfolio | multicoin-capital-portfolio',
'MANA' : 'Decentraland (MANA) is a virtual reality platform powered by the Ethereum blockchain. Users can create experience and monetize content and applications. Land in Decentraland is permanently owned by the community giving them full control over their creations. Users claim ownership of virtual land on a blockchain-based ledger of parcels. Landowners control what content is published to their portion of land which is identified by a set of cartesian coordinates (xy).Contents can range from static 3D scenes to interactive systems such as games. Land is a non-fungible transferrable scarce digital asset stored in an Ethereum smart contract. It can be acquired by spending an ERC20 token called MANA. MANA can also be used to make in-world purchases of digital goods and services.; Gaming Media Entertainment Metaverse NFTs.',
'XDC' : 'Xinfin Network (XDC) XinFin is an enterprise-ready hybrid Blockchain technology company optimized for international trade and finance. The XinFin network is powered by the native coin called XDC. The XDC protocol is architected to support smart contracts 2000TPS 2seconds transaction time KYC to Masternodes (Validator Nodes). The XDC Chain (XinFin Digital Contract) uses XinFin Delegated Proof of Stake (XDPoS) with the intending to create a ‘highly-scalable secure permission and commercial grade blockchain network. XinFin mainnet token XDC and also creates an opportunity to utilize the XinFins real-world use-cases such as TradeFinex.org helps small and medium businesses or institutions originate their own financial requirements in a digital fully structured manner so that they can distribute it to the bank or non-bank funders themselves using a common distribution standard.Xinfin Network ticker has changed from XDCE to XDC.',
'ENJ' : 'Enjin (EJN) is introducing Enjin Coin (ENJ) a cryptocurrency (ERC-20 Token) and smart contract platform that gives game developers content creators and gaming communities the required crypto-backed value and tools for implementing and managing virtual goods.; Media Gaming Collectibles NFTs.',
'SUSHI' : 'SushiSwap (SUSHI) is designed to be an evolution of #Uniswap with $SUSHI tokenomics. SushiSwap protocol better aligns incentives for network participants by introducing revenue-sharing &amp; network effects to the popular AMM model.; Gaming Media and Entertainment Metaverse.',
'ONE' : 'Harmony (ONE) provides a high-throughput low-latency and low-fee consensus platform designed to power the decentralized economy of the future. It plans to address the issues faced in other blockchain ecosystems through the use of the best research and engineering practices in an optimally tuned system.The technical focus of the project is on resharding and secure staking with decentralized randomness. Harmony also implements optimal cross-shard routing and fast block propagation.Learn more about Harmonys Effective Proof-of-Stake (EPoS) here.; Gaming Media and Entertainment.',
'CEL' : 'Celsius Network (CEL)  is an Ethereum-based value-driven lending and borrowing platform based in London. The Celsius Wallet was designed to allow members to use coins as collateral to get a loan in dollars and in the future to lend their crypto to earn interest on deposited coins.CEL is an ERC20 utility token that powers Celsius Networks credit ecosystem. CELs utilities include the ability to become a member of the Celsius platform and community the ability to deposit your cryptocurrencies in the Celsius wallet the ability to apply for dollar loans with cryptocurrencies as collateral and the ability to pay interest on these loans at a discount.; Finance Lending.',
'CELO' : 'The Celo Foundation (CELO) is a non-profit organization based in the US that supports the growth and development of the open-source Celo Platform. Guided by the Celo community tenets the Foundation contributes to education technical research environmental health community engagement and ecosystem outreach‚Äîactivities that support and encourage an inclusive financial system that creates the conditions for prosperity for everyone.Celos mission is to build a financial system that creates the conditions for prosperity for everyone.CELO is a utility and governance asset for the Celo community which has a fixed supply and variable value. With CELO users can help shape the direction of the Celo Platform.; Derivatives Financial.',
'QTUM' : 'Qtum (QTUM) is a decentralized blockchain platform with dApp and turing-complete smart contract functionalities while still maintaining an Unspent Transaction Output (UTXO) transaction model. Qtum is PoS based and boasts a Decentralized Governance Protocol (DGP) which allows specific blockchain settings to be modified by making use of smart contracts.QTUM is the underlying value token in the Qtum blockchain.; Gaming Media and Entertainment NFTs.',
'YFI' : 'Yearn Finance (YFI) is a suite of products in Decentralized Finance (DeFi) that provides lending aggregation yield generation and insurance on the Ethereum blockchain. The protocol is maintained by various independent developers and is governed by YFI holders.Core Products:Vaults:Capital pools that automatically generate yield based on opportunities present in the market. Vaults benefit users by socializing gas costs automating the yield generation and rebalancing process and automatically shifting capital as opportunities arise.Earn:The first Yearn product was a lending aggregator. Funds are shifted between dYdX AAVE and Compound automatically as interest rates change between these protocols. Users can deposit to these lending aggregator smart contracts via the Earn page.Zap:A tool that enables users to swap into and out of (known as Zapping) several liquidity pools available on Curve.Finance. These pools benefit from the lending aggregators discussed above as well as earning users trading fees by partcipating as Liquidity Providers (LPs) on Curve.Fi. Currently users can use five stablecoins (BUSD DAI USDC USDT TUSD) and Zap into one of two pools (y.curve.fi or busd.curve.f) on Curve. Alternatively users can Zap out of these two Curve pools and into one of the five base stablecoins.Cover:Insurance that enables users to obtain coverage against financial loss for various smart contracts and/or protcols on the Ethereum blockchain. Cover is underwritten by Nexus Mutual.Governance:The Yearn ecosystem is controlled by YFI token holders who submit and vote on off-chain proposals that govern the ecosystem. Proposals that generate a majority support (&gt;50% of the vote) are implemented by a 9 member multi-signature wallet. Changes must be signed by 6 out of the 9 wallet signers in order to be implemented. The members of the multi-signature wallet were voted in by YFI holders and are subject to change from future governance votes.; Finance DeFI Yield Aggregator Yield Farming.',
'SNX' : 'Synthetix (SNX) is a rebranding of Havven.io (HAV).Synthetix is a decentralised synthetic asset issuance protocol built on Ethereum. These synthetic assets are collateralized by the Synthetix Network Token (SNX) which when locked in the contract enables the issuance of synthetic assets (Synths). This pooled collateral model enables users to perform conversions between Synths directly with the smart contract avoiding the need for counterparties.This mechanism is designed to solve the liquidity and slippage issues experienced by DEXs. Synthetix currently supports synthetic fiat currencies cryptocurrencies (long and short) and commodities. SNX holders are incentivised to stake their tokens as they are paid a pro-rata portion of the fees generated through activity on Synthetix.Exchange based on their contribution to the network. It is the right to participate in the network and capture fees generated from Synth exchanges from which the value of the SNX token is derived. Trading on Synthetix.Exchange does not require the trader to hold SNX.How SNX backs SynthsAll Synths are backed by SNX tokens. Synths are minted when SNX holders stake their SNX as collateral using Mintr a decentralised application for interacting with the Synthetix contracts. Synths are currently backed by a 750% collateralisation ratio although this may be raised or lowered in the future through community governance mechanisms. SNX stakers incur debt when they mint Synths and to exit the system (i.e. unlock their SNX) they must pay back this debt by burning Synths.Synthetix is also currently trialling Ether as an alternative form of collateral. This means traders can borrow Synths against their ETH and begin trading immediately rather than needing to sell their ETH. Staking ETH requires a collateralisation ratio of 150% and creates a debt denominated in ETH so ETH stakers mint sETH rather than sUSD and do not participate in the pooled debt aspect of the system. In this model ETH stakers do not receive fees or rewards as they take no risk for the debt pool. ; Derivatives DeFi.',
'ZIL' : 'Zilliqa(ZIL) leverages on its silicon-smooth speedy and cost-effective blockchain platform to catalyse and transform digital infrastructure across all global communities and industries.Zilliqa is a high-throughput blockchain platform that achieves over 2828 transactions per second in its testnet by the implementation of sharding.Moreover Zilliqa is designed so that the throughput scales almost linearly as the number of nodes scales ensuring that Zilliqas capacity can continue to grow to meet demand.; Smart Contract Platforms .',
'TUSD' : 'TrueUSD (TUSD) part of the TrustToken asset tokenization platform is a blockchain-based stablecoin pegged to the value of USD. In the TrueUSD system U.S Dollars are held in the bank accounts of multiple trust companies that have signed escrow agreements rather than in a bank account controlled by a single company. The contents of said bank accounts are published every day and are subject to monthly audits. If someone wants to obtain TrueUSD through the online application they will need to pass a KYC/AML check. Once thats complete they can send USD to one of TrueUSDs trust company partners. Once the funds are verified by the trust company their API will instruct the TrueUSD smart contract to issue tokens on a 1 to 1 ratio and to send them to the Ethereum address associated with the account at hand.Once in the wallet the tokens can be transferred to a friend or used as payment combining the advantages of fiat (stability and trust) with those of cryptocurrencies (reduced fees and transfer times). The user can also redeem real US Dollars by sending the TUSD tokens back to the smart contract address which will notify the trust company and initiate a bank transfer to the users account.; Stablecoins.',
'FLOW' : 'Flow (FLOW) is a fast decentralized and developer-friendly blockchain designed as the foundation for a new generation of games apps and the digital assets that power them. It is based on a unique multi-role architecture and designed to scale without sharding allowing for massive improvements in speed and throughput while preserving a developer-friendly ACID-compliant environment.Flow empowers developers to build thriving crypto- and crypto-enabled businesses. Applications on Flow can keep consumers in control of their own data; create new kinds of digital assets tradable on open markets accessible from anywhere in the world; and build open economies owned by the users that help make them valuable.; Smart Contract Platforms.',
'BTG' : 'Bitcoin Gold (BTG) is a cryptocurrency with Bitcoin fundamentals mined on common GPUs instead of specialty ASICs. This type of equipment tends to monopolize mining to a few big players but GPU mining means anyone can mine again - restoring decentralization and independence. GPU mining rewards go to individuals worldwide instead of mostly to ASIC warehouse owners recreating network effects that Bitcoin used to have.; Mineable Currencies.',
'BAT' : 'The Basic Attention Token (BAT) is an Ethereum-based token that can be used to obtain a variety of advertising and attention-based services on the Brave platform a new Blockchain based digital advertising system. User attention is privately monitored in the Brave browser and publishers are rewarded accordingly with BATs. Users also get a share of BATs for participating.; Advertising Web3.',
'RVN' : 'Ravencoin (RVN) is a digital peer to peer network that aims to implement a use case specific blockchain designed to efficiently handle one specific function: the transfer of assets from one party to another. Built on a fork of the Bitcoin code Ravencoin was launched January 3rd 2018 and is a truly open source project (no ICO or masternodes). It focuses on building a useful technology with a strong and growing community.Launched on January 3rd 2018 the ninth anniversary of bitcoins launch Ravencoin is an open-source project designed to enable instant payments to anyone around the world. The aim of the project is to create a blockchain optimized specifically for the transfer of assets such as tokens from one holder to another.A fork of the bitcoin code Ravencoin features four key changes:The issuance schedule (block reward of 5000 RVN)Block time (1 minute)Coin supply (21 Billion)Mining algorithm (KAWPOW formerly X16R and X16RV2 respectively); Mineable Currencies.',
'OKB' : 'Okex (OKB) is a leading digital market exchange that has issued a token to celebrate the Chinese new year and to thank customers for their support. Through the issued token Okex aims to develop a sharing community that allows all the participants to contribute to the improvement of the Okex platform.OKB token is an Ethereum-based utility token (ERC 20) used to settle trading fees participate in token-listing polls deposits of verified merchants and rewards. It allows users to Save up to 40% on trading fees Get passive income with OKEx Earn Participate in Jumpstart token sales of crypto projects ; Gaming Media Entertainment NFTs Metaverse.',
'PERP' : 'Perpetual Protocol launched in 2019 as Strike Protocol is a decentralized perpetual contract protocol for every asset made possible by a Virtual Automated Market Maker (vAMM) design (constant product curve). Perpetual Protocol is composed of two parts: Uniswap-inspired Virtual AMMs backed by fully collateralized vaults and a built-in Staking Pool that provide a backstop for each virtual market. Focusing exclusively on perpetual swap contracts the PERP token is Perpetual Protocol ERC-20 native token with the main goal to serve in the Perpetual Protocol Insurance Fund which aims to cover any unexpected losses from leveraged trading. PERP holders can stake PERPs to help provide a backstop for the protocol. In return stakers are rewarded with part of the transaction fees plus staking rewards. The PERP team claims the Perpetual Protocol include the following key features: 20x leverage on-chain perpetual contact going Long or short on any asset and low slippage.  Perpetual Protocol was created by team based in Taipei Taiwan. Decentralized Exchanges DeFi AMM',
'OMG' : 'OmiseGO (OMG) is building a decentralized exchange liquidity provider mechanism clearinghouse messaging network and asset-backed blockchain gateway. OmiseGO is not owned by any single one party. Instead it is an open distributed network of validators that enforce the behavior of all participants. It uses the mechanism of a protocol token to create a proof-of-stake blockchain to enable enforcement of market activity amongst participants.Owning OMG tokens buys the right to validate this blockchain within its consensus rules. Transaction fees on the network including payment interchange trading and clearinghouse use are given to non-faulty validators who enforce bonded contract states. The token will have value derived from the fees derived from this network with the obligation/cost of providing validation to its users.OMG rebrand: OmiseGO Rebrands to OMG Network; Scaling Infrastructure.',
'TEL' : 'Telcoin (TEL)  is an Ethereum-based ERC20 token that will be distributed and accepted by telecom operators. ; Payment Platforms.',
'KCS' : 'KCS (KCS) is an Ethereum-based ERC20 token issued by the Kucoin Cryptocurrency Exchange. The token holders benefit from bonuses (50% of the total trading fees charged by the platform) trading fee discounts and other special services.KCS smart contract was upgraded with the support of KuCoin.KuCoin also supported the KCS team in rebranding by renaming KuCoin Shares to KuCoin Token. The brand logo was also be renewed though the token ticker remained unchanged as KCS. KuCoin and the KCS Team will soon announce the strategic plans for the next 2-3 years. ; Gaming Media and Entertainment NFTs.',
'ZEN' : 'Horizen (ZEN) is an inclusive ecosystem where everyone is empowered and rewarded for their contributions. Horizens massively scalable platform enables businesses and developers to quickly and affordably create their own public or private blockchains utilizing the largest node network in the industry. Horizens Sidechain SDK provides all necessary components for easy and fast deployment of a fully customizable blockchain.Horizens native cryptocurrency ZEN is a mineable PoW coin currently trading on exchanges including Bittrex Binance and Changelly. ZEN is integrated on major wallets including Horizens flagship app Sphere by Horizen a multifunctional wallet that serves as an interface with most Horizen products and services.Zendoo - Horizens revolutionary sidechain and scaling solution.The Zendoo sidechain platform enables businesses and developers to affordably and quickly create real-world blockchain applications on Horizens fully distributed secure and privacy-preserving architecture.Zendoo extends the Horizen network from a cryptocurrency to a privacy-preserving platform that scales for commercial applications. Zendoo is designed to be completely decentralized without the need to rely on pre-defined trusted parties - it solves the biggest problems in applying blockchain solutions to real-world use cases: Scalability and Flexibility Decentralization Privacy and Auditability.ZenNodes - Horizen has the largest node networks in the industry with a multi-tiered node system. Horizens massive and geographically dispersed node network improves the scalability reliability security and speed of the network. Horizens node infrastructure supports the public main blockchain as well as a large number of sidechains. Each node is rewarded for supporting the network. All Horizen Node Operators receive 10% of the block reward.Mining ZEN - ZEN is a proof-of-work equihash-based cryptocurrency and is available to mine.We use the APIs from https://explorer.horizen.io/ and https://zen.tokenview.com to present the updated values from the table above.; Gaming Media Entertainment Metaverse NFTs.',
'SC' : 'Sia (SC) is an actively developed decentralized storage platform. Users all over the world contribute disk storage from their computers to form a decentralized network.Anybody with siacoins can rent storage from hosts on Sia. This is accomplish via smart storage contracts stored on the Sia blockchain. The smart contract provides a payment to the host only after the host has kept the file for a given amount of time. If the host loses the file the host does not get paid.The distrubuted nature of the Sia network enables many optimizations in latency throughput reliability and security. The decentralized nature of the Sia network enables anyone with storage to get paid lowering the barrier to entry and reducing the overall price of cloud storage.The Sia cryptocurrency is live! You can rent storage using siacoins and hosts providing storage to the network receive compensation in the form of siacoins. The storage platform itself is still in beta and only uploads that are 500mb or less in size are supported by the wallet.; Gaming Financial NFTs.',
'IOST' : 'IOS token (IOST) is an ERC20 token that serves as a medium of exchange on IOS platform.The Internet of Services (IOS) is an Ethereum-based platform that provides its users a way to exchange online services and digital goods. I also enables developers to deploy large scale dApps.Proof of Believability (PoB) is the consensus algorithm used by the IOST blockchain. Proof of Believability enables high transaction speed without compromising network security. In order to achieve this it uses several factors including how many IOST tokens the node holds its reputation its contribution and its behaviour.Telegram | Facebook; Smart Contract Platforms.',
'ICX' : 'ICON (ICX) Foundation is leading ICON project one of the largest blockchain networks in the world launched in 2017 with the vision of Hyperconnect the World.ICON Network is a loopchain-based public blockchain a general purpose turing complete smart-contract protocol using LFT (enhanced PBFT algorithm) consensus algorithm based on loopchain a high-performance blockchain engineFrom the start ICON has focused on interoperability. To do this ICON will connect independent blockchains with different governances allowing them to transact in real time via BTP technologyICON supports not only private blockchain projects cooperating with various companies but also DApp developments in public blockchain sector through strategic partnerships to expand ICONs blockchain ecosystem.Telegram | Facebook | LinkedIn; Enterprise BaaS Media Interoperabiliy Platform.',
'BNT' : 'The Bancor Protocol (BNT) is a blockchain-based system for discovery and a liquidity mechanism supporting multiple smart contract platforms. The flexibility of these blockchains allows tokens to be locked in reserve and to issue smart tokens on the Bancor system enabling anyone to instantly purchase or liquidate the smart token in exchange for any of its reserve tokens.A trading protocol empowering traders liquidity providers &amp; developers to participate in an open financial marketplace with no barriers to entry. No one needs permission to use the open-source Bancor Protocol. Bancor is owned and operated by its community as a decentralized autonomous organization (DAO). The Bancor Protocol is governed via a democratic and transparent voting system which allows all stakeholders to get involved and shape Bancors future.The BNT is the first smart token on the Bancor system and it will hold a single reserve in Ether. Other smart tokens by using BNT as one of their reserves connect to the BNT network. The BNT establishes network dynamics where increased demand for any of the networks smart tokens increases demand for the common BNT benefiting all other smart tokens holding it in reserve.; Gaming Media and Entertainment NFTs.',
'NEXO' : 'NEXO (NEXO) token is a utility token for the NEXO exchange. It is an ERC20 compliant token in the Ethereum network.The NEXO platform allows users to lend and request loans backed by cryptocurrency.; Gaming Media Entertainment Metaverse NFTs.',
'DGB' : 'Digibyte (DGB) is a coin that has adopted the Bitcoin 21 figure but increased the supply to 21 billion - with over 5 algorithms to mine with (Scryt Sha-256 Qubit Skein Groestl)  - in order to keep mining local and in the hands of many. A 60 second block target a 0.5% premine and a block retarget every 2.4 hrs or 244 blocks.DigiByte: Refers to the entire DigiByte network or a single monetary unit on the payment network. 21 billion DigiBytes will be created over 21 years.Block: A grouping of all transactions sent over the DigiByte network within a 30 second time frame. Think of a block as an excel spreadsheet that lists the address location of all DigiBytes at a given point in time in history. New DigiBytes are brought into circulation as each block is discovered on the network through a process called mining.Mining: Mining is how transactions are processed on the network. Anyone can become a miner by donating and using their desktop laptop or mobile phone computing power to help process transactions on the DigiByte network.  DigiByte has made this process even easier with our 3 click mining software for beginners.Blockchain: The DigiByte blockchain is the entire history of all blocks discovered on the network &amp; therefore all transactions made on the network. Each block references the proceeding block all the way back to the beginning of the network to what is known as the genesis block. By linking blocks (spreadsheets) together an accurate secure accounting of all up to date DigiByte ownership is made by decentralized consensus.; Mineable Currencies.',
'ONT' : 'Ontology (ONT) is a public infrastructure chain project and distributed trust collaboration platform. Its blockchain framework supports public blockchain systems and is able to customize different public blockchains for different applications. The blockchain/distributed ledger network combines distributed identity verification data exchange data collaboration procedure protocols communities attestation smart contract system support and various industry-specific modules.Previously a NEO-based token the ONT has now launched his mainnet. It will serve as the utility token within the platform. ; Smart Contract Platforms.',
'AUDIO' : 'Audius (AUDIO) Audius is creating a decentralized andamp; open-source streaming platform controlled by artists fans andamp; developers. It provides users with the tools to gather their fans base share work in progress and then publish their completed tracks for all the world to hear. Content Creation and Distribution Web3 Solana Ecos. music | coinbase-ventures-portfolio | binance-labs-portfolio | solana-ecosystem | pantera-capital-portfolio | multicoin-capital-portfolio',
'ZRX' : '0x (ZRX) is an open protocol that facilitates the decentralized exchange of Ethereum-based tokens and assets. Developers can use 0x to build their own custom exchange apps with a wide variety of user-facing applications i.e. 0x OTC a decentralized application that facilitates trustless over-the-counter trading of Ethereum-based tokens. The 0x token (ZRX) is used by Makers and Takers to pay transaction fees to Relayers (entities that host and maintain public order books). ZRX tokens are also used for decentralized governance over 0x protocols update mechanism which allows its underlying smart contracts to be replaced and improved over time.; Decentralized Exchanges DeFi.',
'CRV' : 'Curve (CRV) is an exchange liquidity pool on Ethereum (like Uniswap) designed for (1) extremely efficient stablecoin trading (2) low risk supplemental fee income for liquidity providers without an opportunity cost.Curve allows users (and smart contracts like 1inch Paraswap Totle and Dex.ag) to trade between DAI and USDC with a bespoke low slippage low fee algorithm designed specifically for stablecoins and earn fees. Behind the scenes the liquidity pool is also supplied to the Compound protocol or iearn.finance where it generates even more income for liquidity providers.; Gaming Media and Entertainment NFTs.',
'PAX' : 'Paxos Standard (PAX) is a stable coin owned by Paxos Trust Company LLC. It combines the stability of the dollar with the efficiency of blockchain technology. Paxos is regulated by the New York State Department of Financial Services which has deep experience and knowledge as an intermediary between fiat and digital assets.Built on the Ethereum blockchain it offers the benefits of crypto-assets such as immutability and decentralized accounting. Since it is fully collateralized by dollars Paxos Standard offers a liquid and digital alternative to cash available 24/7 for instantaneous transaction settlement and fully redeemable. Paxos Standard has been designed as an Ethereum token written according to the ERC-20 protocol so that anyone with an Ethereum wallet will be able to send and receive Paxos Standard tokens. The smart contract has been audited by smart contract auditors Nomic Labs and ChainSecurity and nationally top-ranking auditing firm Withum will perform attestation procedures on their token and bank account balances on a month-end basis.Why Use Paxos Standard:Hold digital assets in PAX to limit exposure to volatilitySettle the cash component of digital asset transactions in dollar-equivalent denominationsMove between digital assets with ease and lower feesSettle transactions outside of traditional banking hoursTransact internationally more efficiently; Gaming Media and Entertainment.',
'NANO' : 'Nano (NANO) is designed to be a low latency high throughput cryptocurrency. It builds on an analogy from the electrical engineering discipline by equating network consensus to arbiter circuits. This gives Nano an established and well-researched modeling basis for how the system comes to a distributed egalitarian and efficient conclusion. In the Nano system each account in the system has a blockchain that is controlled only by them all chains are replicated to all peers in the network removing block intervals mining transaction fees.; Mineable Currencies.',
'ANKR' : 'Ankr (ANKR) is a distributed computing platform that aims to leverage idle computing resources in data centers and edge devices. What Ankr enables is a Sharing Economy model where enterprises and consumers can monetize their spare computing capacities from their devices on-premise servers private cloud and even public cloud. This enables Ankr to provide computing power much closer to users at a much cheaper price.The Ankr mainnet launched on July 10th 2019The Ankr Chain and token swap:Ankr native token and the current ERC 20 token will co-exist together each with its own purposes.The Ankr native token will run on the Ankr Chain mainnet and will be used to power the network purchase services on the Ankr platform and incentivize compute resource providers. It can also be staked.Therefore the token swap is optional and is only required in case a user wants to utilize any service in the Ankr platform including staking purposes.The Ankr ERC 20 token will continue to provide the necessary liquidity on all the exchanges that listed us.; Technology Enterprise Shared Computing.',
'UMA' : 'UMA (UMA) is designed to power the financial innovations made possible by permissionless public blockchains like Ethereum. Using concepts borrowed from fiat financial derivatives UMA defines an open-source protocol that allows any two counterparties to design and create their own financial contracts. But unlike traditional derivatives UMA contracts are secured with economic incentives alone making them self-enforcing and universally accessible.; Derivatives DeFi Polygon Ecos.',
'SAND' : 'The Sandbox (SAND) The Sandbox is a community-driven platform where creators can monetize voxel ASSETS and gaming experiences on the blockchain. SAND holders will be also able to participate in the governance of the platform via a Decentralized Autonomous Organization (DAO) where they can exercise voting rights on key decisions of The Sandbox ecosystem. As a player the user can create digital assets (Non-Fungible Tokens aka NFTs) upload them to the marketplace and drag-and-drop them to create game experiences with The Sandbox Game Maker.',
'FET' : 'Fetch.AI (FET) Fetch.ai is delivering AI to the crypto economy. Autonomous Economic Agents powered by artificial intelligence can provide automation to decentralised finance that can serve the needs of a single user or aggregate millions of data points for on-chain oracles. These agent-based systems provide greater flexibility speed and crypto-economic security than existing oracle networks and represent the future of decentralized finance. This technology enables creation of personalised oracles that maintain users DeFi positions using decentralized and non-custodial protocols to increase the security and convenience of crypto asset management. The Fetch.ai network is an interchain protocol based on the Cosmos-SDK and uses a high-performance WASM-based smart contract language (Cosmwasm) to allow advanced cryptography and machine learning logic to be implemented on chain. This also allows the Fetch.ai network to serve as a layer-2 network for Ethereum and as an interchain bridge to the rest of the blockchain world. AI Web3',
'REN' : 'The REN (REN) is an open-source decentralized dark pool for trustless cross-chain atomic trading of Ether ERC20 tokens and Bitcoin.REN is an ERC20 token built on the Ethereum network. Ren is an ecosystem for building deploying and running general-purpose privacy-preserving applications using zkSNARK and our their newly developed secure multiparty computation protocol.It makes it possible for any kind of application to run in a decentralized trustless and fault-tolerant environment similar to blockchains but with the distinguishing feature that all application inputs outputs and state remain a secret even to the participants running the network.; Technology Defi Interoperability. marketplace | defi | polkadot-ecosystem | avalanche-ecosystem | solana-ecosystem | kinetic-capital | huobi-capital | alameda-research-portfolio | fantom-ecosystem',
'IOTX' : 'IoTeX Network (IOTX) IoTeX Network is a decentralized platform of privacy-centric blockchain for various vendors to build dApps for IoT. IOTX is an ERC20 token that serves as the network and#39;fueland#39;. It is required to use certain designed functions on the IoTeX Network such as executing transactions and running the distributed applications on the IoTeX Network. IoT ',
'SXP' : 'Swipe (SXP) Swipe will create a platform that will be accessible to users worldwide via an Apple or Android device which enables them to buy sell or pay with cryptocurrencies at millions of locations. The plan to execute this vision starts with creating a highly-secure bank-grade digital Wallet infrastructure that will host multiple blockchain systems tied to a traditional debit card. With these two products users will be able to buy or sell cryptocurrencies to traditional fiat and they may link it to their traditional bank accounts while having the ability to store these cryptocurrencies on the Wallet to spend it via the debit card at millions of locations worldwide. The ecosystem powering the product line will be fueled by its native cryptocurrency Swipe Token (SXP) which will be used as gas throughout the whole platform as gas. For every interaction on the network it will require SXP to perform the transaction similar to gas on Ethereum. Payment Platforms BSC Ecos DeFi Social Money',
'KAVA' : 'Kava (KAVA) Kava Chain is a decentralized permissionless censorship-resistant blockchain built with the Cosmos SDK. This means it operates much like other Cosmos ecosystem blockchains and is designed to be interoperable between chains. Learn more about Cosmos. Learn more about Kava.‍Kava Protocol is the set of rules and behaviors built into the Kava Chain that enables advanced Decentralized Finance (DeFi) functionality like permissionless borrowing and lending.‍The KAVA token is an asset on the Kava Chain. Kava Chain is secured by its token KAVA and it is used across the full chain as a transport and a store of value. It is given as a reward for minting USDX on the Kava app.Telegram | Discord | Youtube',
'LRC' : 'Loopring (LRC) is an open multilateral token exchange protocol for decentralized exchange on the Ethereum blockchain. Loopring is intended to serve as a common building block with open standards driving interoperability among decentralized applications (DAPPs) that incorporate exchange functionality. Trades are executed by a system of Ethereum smart contracts that are publicly accessible free to use and that any dApp can hook into. Looprings token is based on the ERC20 Ethereum Token Standard and can be liquidated through a Loopring smart contract.LRC is an Ethereum Token; Decentralized Exchanges DeFi.',
'DENT' : 'Dent (DENT) is a decentralized exchange for mobile data. Its based on the Ethereum blockchain allowing mobile data to be sold bought or donated through an automated bidding process much like currencies or goods. The data packages are smart contracts in Ethereum. The DENT token is required to purchase mobile data within the Dent platform.; Data Management Services.',
'1INCH' : '1inch (1INCH) The independent board of the 1inch Foundation has released 1INCH a governance and utility token. The 1inch Foundation intends to support the adoption of the 1INCH token via the permissionless and decentralized 1inch Network.The 1INCH token will be used to govern all 1inch Network protocols taking governance in the DeFi space to a new level.Instant governance is a new kind of governance where the community can participate benefit and vote for specific protocol settings without any barrier to entry.The key feature of the 1inch Liquidity Protocol version 2 is the price impact fee. This is a fee that grows with price slippage to ensure that liquidity providers and 1INCH token stakers earn significantly more on volatility. Decentralized Exchanges DeFi',
'RSR' : 'The Reserve Protocol (RSR) holds the collateral tokens that back the Reserve token. When new Reserves are sold on the market the assets used by market participants to purchase the new Reserves are held as collateral. This process keeps the Reserve collateralized at a 1:1 ratio even as supply increases.At times the Reserve Protocol may target a collateralization ratio greater than 1:1. When this is the case scaling the supply of Reserve tokens requires additional capital in order to maintain the target collateralization ratio. To accomplish this the Reserve Protocol mints and sells Reserve Rights tokens in exchange for additional collateral tokens.Collateral tokens are somewhat volatile. While we may be able to select a portfolio with minimal downside risk the reality is that drops in the collateral tokens value will happen. When this happens the Reserve Protocol will sell newly minted Reserve Rights tokens for additional collateral tokens and add them to the backing.; Stablecoins DeFi.',
'GLM' : 'Golem Network Token (GLM) The Golem Network is a decentralized computation network. Using Golem users can buy or sell computational power from other users in a peer to peer environment. Golem is built using Ethereum smart contracts as a transaction system for nano-payments within the network. Golem Network Tokens (GNT) will serve as a secure medium for all transactions within the Golem Network.Starting 19 NOV 2020 Golem Network Token is migrating towards an ERC20 token mainly because New Golems transaction framework is built on Ethereums Layer 2 and this scaling method requires tokens to be ERC-20.Migrate your GNT to the new ERC-20 GLM token - step by step guide and migration options',
'WAXP' : 'Worldwide Asset eXchange (WAXP) WAX is a purpose-built blockchain and protocol token that has a convenient way to create buy sell and trade virtual items anywhere in the world and it is designed to be the platform for video gaming and e-commerce dApps. It will also be fully backward compatible with EOSIO. Participants of the Worldwide Asset eXchange gain access to a global community of collectors and traders buyers and sellers creators and gamers merchants dApp creators and game developers. The WAX Blockchain uses the Delegated Proof of Stake (DPoS) as its consensus mechanism. Collectibles NFTs',
'OCEAN' : 'Ocean Protocol (OCEAN) Ocean Protocol is an ecosystem for the data economy and associated services with a tokenized service layer that securely exposes data storage compute and algorithms for consumption. Users of the data will pay to access these sources with cryptocurrency. The marketplaces built on Ocean Protocol will allow data.Ocean Protocol claims to help developers build marketplaces and other apps to privately andamp; securely publish exchange and consume data.On September 27 2020 Ocean Protocol Foundation initiated a hard fork of the Ocean Token contract as described in this announcement. All Ocean token balances from the previous contract are reflected on Ocean new token contract.Etherscan has recognized the new contract and wallet balances can be verified on Etherscans website.Telegram | Discord | Youtube Data Management Web3 Polkadot Ecos Polygon Ecos',
'LSK' : 'Lisk (LSK) is a crypto-currency and decentralized application platform. As a crypto-currency much like Bitcoin and other alternatives it provides a decentralized payment system and digital money network. The network itself operates using a highly efficient Delegated-Proof-of-Stake (DPoS) consensus model that is secured by 101 democratically elected delegates. The Lisk decentralized application platform its most powerful component allows the deployment distribution and monetization of decentralized applications and custom blockchains (sidechains) onto the Lisk blockchain. The inflation rate is 5 LISK per block which gets lowered by 1 every year until it reaches a stable block reward of 1 LISK per block. Lisk partnered with Microsoft to integrate Lisk into its Azure Blockchain as a Service (BaaS) program‚Ää‚Äî‚Äämeaning developers worldwide can develop test and deploy Lisk blockchain applications using Microsofts Azure cloud computing platform and infrastructure.; Technology Application Development.',
'STORJ' : 'Storj (STORJ) Storj is a decentralized cloud storage platform that allows anyone to rent their idle hard drive space and to earn a revenue by doing so. Endusers can use Storj to store their files at competitive prices and within a p2p network that is secure from sever downtime censorship and hacks. Payments within the Sotrj network are conducted with the STORJ token an ERC20 Ethereum-based token. File Storage Web3',
'ALPHA' : 'Alpha Finance Lab (ALPHA) Alpha Finance Lab is an ecosystem of DeFi products starting on Binance Smart Chain and Ethereum. Alpha Finance Lab is focused on building an ecosystem of automated yield-maximizing Alpha products that interoperate to bring optimal Alpha to users on a cross-chain level.Alpha Finance Lab is focused on researching and building in the Decentralized Finance (DeFi) space. Alpha Lending the first product built by Alpha Finance Lab is a decentralized lending protocol with algorithmically adjusted interest rates built on Binance Smart Chain.The ALPHA token is the native utility token of the platforms. Current and planned use cases of the ALPHA token includes liquidity mining governance voting as well as staking.  Asset Management DeFi Yield Aggregator Yield Farming BSC Ecos',
'SKL' : 'SKALE Network (SKL) SKALE Network is an open source Web3 platform intended to bring speed and configurability to blockchain. SKALE Network is the project by N.O.D.E. Foundation - the Lichtenstein Foundation that aims to advance development of Web3 technologies and make decentralized web more user friendly and accessible for developers validators and end users.N.O.D.E. Foundation partners with SKALE Labs and other top entities and investors around the world to facilitate development of SKALE Network.SKALE Labs is the core team involved in creating the technology specs creating the code and growing use and awareness of the network. SKALE Labs is headquartered in San Francisco California and also operates in Kharkiv Ukraine.  Technology Scaling Web3',
'BAKE' : 'BakerySwap(BAKE) is like Uniswap but designed to be faster and cheaper. In addition to all of the above liquidity providers will also be rewarded with BAKE tokens from which they can earn a share of BakerySwaps trading fees and use for voting as part of BakerySwaps governance.; Decentralized Exchanges DeFi AMM Token.',
'BCD' : 'Bitcoin Diamond (BCD) uses blockchain and cryptocurrency technology to provide the worlds unbanked and underserved people with a currency they can access trust and use. As a fast secure digital currency Bitcoin Diamond aims to free the trapped capital intellect and creativity of the worlds emerging population.; Mineable Currencies.',
'WIN' : 'WINk (WIN) is a TRC20 token issued on the TRON network which is used in multiple scenarios; WinkLink nodes receive WIN tokens as rewards for providing trusted data Developers request trusted data by paying WIN to the WinkLink nodes WIN holders can get involved in community governance and decide its futureBy creating a whole mining ecosystem WINk will revolutionize the way that developers adopt the blockchain ecosystem while keeping wealth redistribution at its core.WIN will continue to be the centerpiece of the platform while developers will be able to utilize everything the WINk ecosystem has to offer. By taking behavioral mining to the next level traditional apps will now have all the resources at their disposal to convert their apps to the TRON blockchain.  Technoliogy Data',
'ERG' : 'Ergo (ERG) Ergo builds advanced cryptographic features and radically new DeFi functionality on the rock-solid foundations laid by a decade of blockchain theory and development. Ergo is the open protocol that implements modern scientific ideas in the blockchain area. Ergo operates an open contributor model where anyone is welcome to contribute.EFYT (Ergo First Year Tokens) served the dual purposes of helping to build an early community of stake holders and enthusiasts for Ergo and of raising a small amount of funds for the platform before launch to fund development promotion etc. EFYT is strictly a Waves token and is not the same as an ERG which is the Ergo mainnet native token mined after Ergos mainnet launch.EFYT were swapped with a fraction of the ERG mined within the first 1 year post mainnet launch (July 1st 2019)Telegram | Discord | Youtube Technology Blockchain BAAS Infrastructure',
'SRM' : 'Serum (SRM) Serum is a completely decentralized derivatives exchange with trustless cross-chain trading brought to you by Project Serum in collaboration with a consortium of crypto trading and DeFi experts. While it built the Serum protocol it is permissionless – it does not hold special power anymore. It is up to the users the crypto community to use it as they will. Decentralized Exchanges DeFi Solana Ecos. decentralized-exchange | defi | derivatives | smart-contracts | staking | solana-ecosystem | cms-holdings-portfolio | coinfund-portfolio | kinetic-capital | alameda-research-portfolio | exnetwork-capital-portfolio',
'CKB' : 'The Nervos CKB Common Knowledge Base (CKB) is the layer 1 proof of work public blockchain protocol of the Nervos Network. The Nervos Network is an open-source public blockchain ecosystem and collection of protocols designed to solve the biggest challenges facing blockchains like Bitcoin and Ethereum today.It allows any crypto-asset to be stored with the security immutability and permissionless nature of Bitcoin while enabling smart contracts layer 2 scaling and captures the total network value through its store of value crypto-economic design and native token the CKByte.  $CKB is a cryptocurrency that can be used as a secure store of value like Bitcoin. It can also be a value token behind smart contracts like ETH. Store execute and even rent space on the Nervos Blockchain with CKBytes.; Smart Contract Platforms.',
'NMR' : 'Numeraire (NMR) Numerai is a network of data scientists that are incentivised to forecast models to improve hedge fund returns. Numaire is the token that facilitates the reward structure that correct predictions receive. Founders described it as a social network or software company whose business model happens to be a hedge fund. USV partner Andy Weissman says Network effects get more valuable with every participant that uses them. Whats an example of that in a financial institution? Weve never seen one before except for this.Numerai has already raised $7.5 million in traditional venture capital from Union Square Ventures Joey Krug (Augur) Juan Benet (FileCoin) Fred Ehrsam (Coinbase) and Olaf Carlson-Wee (Polychain). So the Numeraire token will not be sold in a crowdsale or ICO.In Febuary 2017 1000000 NMR tokens were issued to 12000 data scientists.White paperForum Asset Management ',
'XVG' : 'Verge(XVG) is a cryptocurrency designed for people and for everyday use. It improves upon the original Bitcoin blockchain and aims to fulfill its initial purpose of providing individuals and businesses with a fast efficient and decentralized way of making direct transactions.Verge is a secure and user-friendly digital currency built for everyday transactions.Verge is a scrypt based alternative crypto currency trying to take the popularity of both Dogecoin and Bitcoin and combine it with the anonymous features of DASH. The block time is 30 seconds and the coin operates through Proof of Work.VERGE prides itself on being a symbol of progression in the cryptocurrency world. It is a more secure private and evolving cryptocurrency that is backed by bitcoin a ton of developer resources and privacy tools (located here!)Block reward:Block 0 to 14000 : 200000 coins14000 to 28000 : 100000 coins28000 to 42000: 50000 coins42000 to 210000: 25000 coins210000 to 378000: 12500 coins378000 to 546000: 6250 coins546000 to 714000: 3125 coins714000 to 2124000: 1560 coins2124000 to 4248000: 730 coinsApproximately total reward: 9 Billion (9000000000) during first year then issuing 1 billion (1000000000) each year after.; Mineable Currencies.',
'VTHO' : 'VeChainThor (VTHO) VeChainThor is a blockchain-based payment platform. The users are allowed to access tools to support their business applications and perform cryptocurrencies transactions through a distributed business ecosystem that uses a blockchain-based technology the Vechain. VeChainThor was designed as a twin-token system to facilitate activities at both levels namely VET and VTHO.The VTHO token is a cryptocurrency developed by VeChain. It is one of the twin-tokens which main role is to fuel the platform and represents the underlying cost of using VeChain it will be consumed (or in other words destroyed) after certain blockchain operations are performed. Note that as a gas token the VTHO does not hold a max supply of tokens. Smart Contract Platforms ',
'WRX' : 'WazirX (WRX ) a utility token backed by WazirX forms the backbone of the WazirX ecosystem. It launched WRX tokens to involve its community in helping build out WazirX and reward them accordingly for contributing to success. This helps WazirX stay true to the ethos of cryptocurrency and blockchain - to share the rewards of WazirXs success with its early adopters and supporters.; Centralized Exchanges.',
'USDN' : 'Neutrino USD (USDN) Neutrino is an algorithmic price-stable assetization protocol acting as an accessible DeFi toolkit. It enables the creation of stablecoins pegged to specific real-world assets such as national currencies or commodities.Neutrino USD (USDN) is an algorithmic stablecoin pegged to the US dollar and backed by WAVES. Leveraging the staking model of the Waves protocols underlying consensus algorithm USDN staking yields a sustainable reward of up to ~ 15% APY. All operations involving USDN such as issuance collateralization staking and reward payouts are fully transparent and governed by a smart contract. Decentralized Forex (DeFo) is an extension on top of the Neutrino protocol that facilitates instant swaps of stable-price assets tied to popular national currencies indices or commodities.Neutrino Token (NSBT) enables its holders to influence decisions concerning the Neutrino protocol product and feature roadmap as well as changes to governance parameters. It is a utility and governance token for the Neutrino system that is designed to ensure the stability of reserves on the Neutrino smart contract through the so-called mechanism of reserve recapitalization. The token is also used for protocols governance and supporting liquidity pools of Decentralized Forex.Telegram | Facebook',
'INJ' : 'Injective Protocol (INJ) The Injective Protocol project aims to make currency exchanges completely decentralized public operated networks. What this means is the exchange is solely operated by people who hold INJ tokens. There is no centralized governing body that enforces control over the development of the project. The Injective Protocol project officially launched via a public offering in 2020 and it was backed by names in the industry like Binance Pantera and Hashed.The Injective Chain is the blockchain foundation of the project. It hosts a completely decentralized order book and employs elements from the Ethereum Virtual Machine (EVM). The platform also incorporates a bi-directional token bridge linking it to the Ethereum ecosystem.Telegram | Discord | Facebook Derivatives DeFi Cosmos Ecos Polygon Ecos',
'ROSE' : 'Oasis Labs (ROSE) The Oasis Protocol Foundation looks to support projects focused on making that privacy-first Internet a reality. From building privacy-preserving applications to developing more powerful tools for the network to improving how it operates.',
'HUSD' : 'HUSD (HUSD)  is a U.S. dollar-backed stablecoin issued by Stable Universal. The dollars backing HUSD will be held in reserve by Paxos Trust Company a fiduciary and qualified custodian regulated by the New York State Department of Financial Services (NYDFS). On a monthly basis a top U.S. auditing firm will perform an attestation to ensure USD reserves match the supply of HUSD.The coin has been listed on the Huobi exchange platform and can be converted to any of the four stable coins supported by the stable coin solution: PAX TUSD GUSD and USDC. For investors they can deposit any of the stable coins on the all-in-one stable coin solution and it will immediately convert it and store it as HUSD. When investors want to withdraw their coins they have withdrawal options to choose from any of the four stable coins.; Derivatives Financial.',
'ELF' : 'aelf (ELF) aelf is an open-source blockchain network designed as a complete business solution. The structure of one main chain + multiple side chains allows developers to independently deploy or run DApps (Distributed Applications) on individual side chains to achieve effective resource isolation.By adopting parallel processing and the unique AEDPoS consensus mechanism aelfs technology made major breakthroughs in performance achieving high throughput. Based on the cross-chain technology of the main chain index and verification mechanisms aelf achieves efficient and secure communication between the main chain and all side chains and as a result allows direct interoperability between side chains.ELF token is the aelf utility token mined on the aelf mainnet explorer previously an ERC-20 token.',
'OGN' : 'Origin Protocol (OGN) Origin is an open-source platform that enables the creation of peer-to-peer marketplaces and e-commerce applications. The Origin Platform initially targets the global sharing economy allowing buyers and sellers of fractional use goods and services (car-sharing service-based tasks home-sharing etc.) to transact on the distributed open web.Using the Ethereum blockchain and Interplanetary File System (IPFS) the platform and its community participants can interact in a peer-to-peer fashion allowing for the creation and booking of services and goods without traditional intermediaries.Origin enables everyone to own a piece of the network. Fans and collectors can have a direct stake in the success of their favorite community with NFTs. Yield generated by OUSD is distributed fairly to all holders. Holders of Origin Tokens (OGN) can participate in governance to decide the future rules and direction of the network and also have a stake in the success of Origins products. When everyone owns a piece of the network everyone is incentivized to help it grow and succeed.Telegram | Discord | Youtube | Facebook | Instagram   Technology Ecommerce Infrastructure P2P',
'XVS' : 'Venus Protocol (XVS) is an algorithmic-based money market system designed to bring a complete decentralized finance-based lending and credit system onto Binance Smart Chain.Venus enables users to utilize their cryptocurrencies by supplying collateral to the network that may be borrowed by pledging over-collateralized cryptocurrencies. This creates a secure lending environment where the lender receives a compounded interest rate annually (APY) paid per block while the borrower pays interest on the cryptocurrency borrowed. These interest rates are set by the protocol in a curve yield where the rates are automated based on the demand of the specific market such as Bitcoin.Telegram; Finance Lending DeFi.',
'GT' : 'Gatechain Token (GT) GateChain is a public blockchain focused on onchain asset safety and decentralized trading. With a uniquely designed Vault Account primed for handling abnormal transactions GateChain presents a clearing mechanism tackling the challenges of asset theft and private key loss. Decentralized trading and cross-chain transfers will also be supported alongside other core features.Gatechain 2.0 has built a complete Defi Ecosystem allowing users to easily explore Defi and experience the hottest products. Finance Decentralized Trading DeFi Finance Decentralized Trading DeFi',
'CVC' : 'Civic (CVC) Civic is a decentralized identity ecosystem that allows for on-demand secure and lower cost access to identity verification via the blockchain. Through a digital Identity platform users to set up their own virtual identity and to store it along with their personally identifiable information on the device. This information will go through a verification process conducted by the identity validators on the platform and then ported into the blockchain where service providers can access it with the proper permission from the user.CVC is an Ethereum-based token used by service providers that are looking to acquire information about a user. These can make a payment in CVC. The smart contract system employed will then see funds delivered to both the validator and the identity owner (user). Identity Web3 Solana Ecos. enterprise-solutions | identity | solana-ecosystem | dcg-portfolio | pantera-capital-portfolio',
'STMX' : 'StormX (STMX) The STMX token is an ERC-20 token on the Ethereum blockchain written in Solidity. The STMX token is very much like the STORM token with 18 decimals and a maximum total supply of 10000000000.STMX token team - and#39;The new StormX brand solidifies our original vision of a single go-to app with the mission to Earn anywhere anytime from any device. Our goal since the very start has been to empower users around the world and increase their earning potential using the power of blockchain. Our white paper focused on three main products — Play Shop and Gigs. With the launch of the Shop feature late last year we are now two-thirds of the way to our final goal. Read more about our Shop feature launch here.and#39; Rewards ',
'RLC' : 'iExec (RLC) is a technology startup founded in France in October 2016. The team of 24 engineers and developers based in Lyon has set up a global market for computing power that relies on blockchain:Companies and individuals exchange their servers data and applications with each other. IBM Intel and TF Cloud have already joined the marketplace as cloud providers. The enterprise solution (iExec V3) is used by emerging players in the areas of distributed machine learning data rental and the internet of things.RLC is the native token of the iExec cloud platform. In exchange for RLC tokens users can utilize the network to rent servers data and applications.RLC is an Ethereum-based token used in the iEx.ec a blockchain-based distributed cloud computing platform.  Developers can rent computing power servers and data centers and make their unused resources available through a unique marketplace on the Ethereum blockchain. The RLC token allows users to rent servers data and applications to execute their distributed applications.; Technology Shared Computing.',
'ARDR' : 'Ardor (ARDR) Ardor is a multichain blockchain platform with a unique parent-child chain architecture. The security of the whole network is provided by the parent Ardor chain while the interoperable child chains have all the rich functionality. This elegant design and access to hybrid user permissioning capabilities are the key to the flexibility necessary for a variety of use cases and opens the door towards mainstream adoption of blockchain technology. Not only that - Ardor is created with scalability in mind and solves many existing industry problems such as blockchain bloat single token dependency and the need for easily customizable-yet-compatible blockchain solutions.Where did Ardor come from? Ardor is being developed by Jelurida Swiss SA founded in 2016. The company started upgrading Nxt blockchain system and created Ardor to provide a platform for facilitated and accelerated transactions. The platform obtained a good reputation among users analysts investors and experts. Ardors mission is to form a universal user-friendly and easy crypto platform facilitating different concepts implementation. Jelurida worked on creating ways to allow each third-party developer to make his own projects. The platforms authors presented a smart contract technology that is completely different from Ethereum although some parallels are made between them.What are the advantages of Ardor?All child chains have their own native tokens used as a unit of value and forpaying transaction fees and a variety of ready to use features;Scalability is achieved by pruning of the unnecessary child chain data once theyare included in the permissionless Ardor parent chain preventing the andamp;quot;bloatandamp;quot; ofthe network;All child chains are connected and share the same source code ensuringecosystem interoperability that allows child chain token trading to one another ina fully decentralized way and transactions on one child chain to access data orentities on another. Smart Contract Platforms ',
'SNT' : 'Status Network Token (SNT) Status is an open source messaging platform and mobile browser that allows users to interact with decentralized applications (dApps) that run on the Ethereum Network.In Status users own and control their own data wealth and digital identity. The Status Network Token (and#39;SNTand#39;) is an Ethereum-based token that is required to interact with the Status Network.Status strives to be a secure communication tool that upholds human rights. Designed to enable the free flow of information protect the right to private secure conversations and promote the sovereignty of individuals.Discord | Youtube | Instagram | Facebook Application Development ',
'DAG' : 'Constellation (DAG) Constellation is a Horizontally Scalable Blockchain with mobile support. By Horizontal Scalable is mentioned that Network capacity is proportional to the user adoption which concedes the network the strength to have more and more users in a medium to far future. Constellation will work with its own smart contacts to support blockchains microservices. In addition the platform uses reputation-based incentives in order to remove the costs from transactions fees.The DAG token was  released first as an ERC20 cryptocurrency now migrated to its own mainnet and become the Constellation native token.',
'EWT' : 'Energy Web Token (EWT) EW focuses on building core infrastructure and shared technology speeding the adoption of commercial solutions and fostering a community of practice. In 2019 EW launched the Energy Web Chain an open-source enterprise blockchain platform tailored to the energy sector. EWs technology roadmap has since grown to include the Energy Web Decentralized Operating System (EW-DOS) a blockchain-plus suite of decentralized solutions.EW also grew an energy blockchain ecosystem comprising utilities grid operators renewable energy developers corporate energy buyers and others. Energy Web has become the industrys leading blockchain partner and most-respected voice of authority on energy blockchain. Energy ',
'STRAX' : 'Stratis (STRAX) Stratis is the native value currency in the Stratis Platform it fuels the creation of private and public custom blockchains for corporate use. The Stratis Platform offers a one-click deployment system for custom blockchain deployment. These blockchains can be customized to suit the companiesand needs and can even be deployed to mimic the features of popular blockchains like Ethereum or Lisk which can be tested individually or in parallel.The Stratis team will also function as a London Based consultancy agency that will help businesses to deploy the blockchain that best suits them.On the 12th of November 2020 Stratis lauched a new blockchain and finalized their token swap. The new Mainnet enables flexibility and allows development in a more agile manner while providing a platform for the development and deployment of DeFi based Smart Contracts.In the official STRAX Blockchain launch announcement Stratis lists the following enhancements to the platform:Block Reward Increase and Cirrus Sidechain Incentivization Block Time Reduction Cold-Staking Activation Cross-Chain-Transfer Time Reduction Improvement to Blockchain data stores Increase of OPRETURN Capacity Masternode Dynamic Membership Masternode Collateral Increase Removal of Legacy Node Support Segregated Witness Activation.STRAX distribution was performed by an automated script executed on the 12th of November 2020 crediting those who had participated in the initial Token Swap period. Token Swap requests after the initial Token Swap period (15th October 2020 until 9 AM GMT on 12th November 2020) will be subject to an additional defined manual process to prove ownership of funds instead process defined above. Technology Blockchain BAAS',
'REEF' : 'Reef (REEF) Reef is a smart liquidity aggregator and yield engine that enables trading with access to liquidity from both CEXes and DEXes while offering smart lending borrowing staking mining through AI driven personalized Reef Yield Engine.Reef Token is the native currency on Reef Chain and is used for transaction fees (gas) and on-chain goverance (NPoS and PoC). Reef token is also available as ERC-20 on Ethereum and BSC and will be made convertible 1:1 with native Reef chain tokens. Asset Management Polygon Ecos',
'BAND' : 'Band Protocol (BAND) Band Protocol is a Secure Scalable Blockchain-Agnostic Decentralized Oracle platform that aggregates and connects real-world data and APIs to smart contracts.Band Protocol connects smart contracts with trusted off-chain information provided through community-curated data providers. It provides community-curated on-chain data feeds backed by strong economic incentives which ensure the data stays accurate.Band Protocol aims to Ensure Interoperability between Smart Contracts and the Rest of the WorldOne of the biggest challenges for the any decentralized application is to have access to trusted data and services over the traditional Web 2.0. Band Protocol  tries to tackle this problem by building a decentralized bridge to enable secure interoperabilities between smart contracts and the traditional web.Telegram | Discord | Explorer  Data Management Web3 Cosmos Ecos Polygon Ecos. cosmos-ecosystem | defi | oracles | binance-chain | binance-smart-chain | binance-launchpad | binance-labs-portfolio | solana-ecosystem | polygon-ecosystem | fantom-ecosystem',
'PROM' : 'Prometeus (PROM) Prometeus Network is a secure and decentralized ecosystem designed to solve real-world problems in data brokerage created for the Influencer Marketing Medical and Insurance data market industries. Prometeus Network is developed by Prometeus Labs. A company existing out of data scientists and entrepreneurs who have been working for more than 15 years on machine learning business development and marketing.Telegram | Medium Finance Yield Farming Infrastructure DeFi ',
'CELR' : 'Celer Network (CELR) Celer Network is a leading layer-2 scaling platform that aims to enable fast easy and secure off-chain transactions for not only payment transactions but also generalized off-chain smart contract. It enables everyone to quickly build operate and use highly scalable decentralized applications through innovations in off-chain scaling techniques and incentive-aligned crypto-economics. Scaling ',
'NKN' : 'NKN (NKN)  (New Kind of Network) is a highly scalable self-evolving and self-incentivized blockchain network infrastructure. It addresses the network decentralization and self-evolution by introducing Cellular Automata (CA) methodology for both dynamism and efficiency. NKN tokenizes network connectivity and data transmission capacity as a useful Proof of Work.NKN is an ERC20 token that serves as a currency on the NKN ecosystem and works as the incentive given to participants that share their connectivity and bandwidth. IoT Web3',
'REP' : 'Augur (REP) This page represents Augur v2 which is a fork of the Augur prediction market protocol designed to improve efficiency. Prediction markets like Augur v2 are designed so users can place bets on a variety of different events. With this fork Augur v2 rolled out a suite of improvements around dispute management settlements forking and more. Prediction markets are widely considered the best forecasting tool. Augur is an open global platform where anyone anywhere can create monitor or trade in prediction markets about any topic. Think of it as an Early Warning Systemand#39;and#39; with the most accurate event forecasts a potential Google Search Bloomberg Terminal or Reuters Terminal for crowdsourced event forecasts.The system plans to use the Wisdom of Crowdsand#39;and#39; (collective intelligenceand#39;and#39;) via market incentives Long Tailand#39;and#39; dynamics and blockchain technology to securely generate a more accurate robust and unfiltered array of dynamic event forecasts than any alternative can match.Augur is decentralized self-regulating pseudonymous and autonomous. It offers the promise of markets without exposure to counterparty risk principal-agent problems or central points of control failure or censorship. No person is ever in direct control of someone elses funds or in a position to single-handedly threaten the systems integrity.The software is comprised of smart contracts perpetually deployed on a blockchain network which enables applications deployed to be immune to local outages while benefiting from the entire communityand#39;s security. All interactions with markets are communicated as database transactions between unique accounts powered by immutable software instructions.Augur v2 LaunchesThe Augur v2 protocol contracts have been successfully deployed to the Ethereum Mainnet. The contracts have been verified on Etherscan and the deployers address can be found here. ​See more info on the Augur V2 deployment here. Prediction Markets DeFi Polygon Ecos',
'PAXG' : 'PAX Gold (PAXG)  is an asset-backed token where one token represents one fine troy ounce of a London Good Delivery gold bar stored in professional vault facilities. Anyone who owns PAXG has ownership rights to that gold under the custody of Paxos Trust Company. Since PAXG represents physical gold its value is tied directly to the real-time market value of that physical gold.PAXG gives customers the benefits of actual physical ownership of specific gold bars with the speed and mobility of a digital asset. Customers are able to have fractional ownership of physical bars.On the Paxos platform customers can convert their tokens to allocated gold unallocated gold or fiat currency (and vice versa) quickly and efficiently reducing their exposure to settlement risk. PAXG is also available for trading on Paxos itBit exchange. PAXG will also be available on other crypto-asset exchanges wallets lending platforms and elsewhere within the crypto ecosystem. Finance Asset Backed Gold',
'CTSI' : 'Cartesi (CTSI) Cartesi provides a Linux runtime environment for scalable blockchain Dapps. Complex and intensive computations run off-chain while retaining the security guarantees of the blockchain.The Cartesi Token economy has been designed to overcome challenges of usability and scalability of blockchain applications. The native digital cryptographically-secured utility token of Cartesi (CTSI) is a transferable representation of attributed functions specified in the protocol/code of Cartesi designed to play a major role in the functioning of the ecosystem on Cartesi and intended to be used solely as the primary utility token on the network. CTSI is an essential ingredient for the proper functioning of Cartesiand#39;s Data Ledger which is a PoS-based side-chain for temporary data storage. Block generators receive CTSI mine rewards and fees paid by parties adding data to the ledger.Telegram | Discord | Youtube Smart Contract Platforms ',
'HIVE' : 'Hive (HIVE) Hive is an open-source blockchain forged in years of development to bring Web 3.0 to the world. With a diverse community of stakeholders and without controlling bad actors individuals can experience true ownership in a decentralized blockchain andamp; cryptocurrency.Hive distributes the new coins based on the Proof of Brain mechanism (PoB). Although it also distributes it to the stake holders trough curation and staking rewards so its a bit of hybrid DPoS/PoB. Hive was created as an independent and decentralized fork of the Steem blockchain.The Hive network comes with two classes of cryptocurrency assets named HIVE and Hive Backed Dollars (HBD). Moreover HIVE exists both under a liquid form (simply called HIVE) and a staked form (called Hive Power). HIVE is the liquid currency of the Hive ecosystem. Content Creation and Distribution Web3',
'ORBS' : 'Orbs (ORBS) The Orbs Network is a public blockchain infrastructure designed for businesses looking at trust as a competitive strategyOrbs combine scalability low fees and isolation between virtual chains with Ethereums mature decentralized asset ecosystem. The Orbs Proof-of-Stake (PoS) ecosystem is the backbone of the Orbs network and the Universe that is being created. This ecosystem serves as the foundation for the security and operation of the network enabling an optimal platform for decentralized applications. The Orbs Universe is centered around three core roles – Validators Guardians and Delegators.Telegram | LinkedIn Enterprise and BaaS ',
'FUN' : 'FunFair (FUN) FunFair is an Ethereum-based casino that allows users to bet in a trustless and decentralized model featuing 3D games can be built in HTML5. FunFair offers cheap fees in terms of gas costs. The FUN coin is also an Ethereum-based token that will be used for all platform actions including betting lending paying out players and compensating stakeholders. Gambling ',
'OXT' : 'Orchid Protocol (OXT) OXT is a new Ethereum (ERC20) compliant digital currency used to exchange value on the Orchid network. OXT is used by users to purchase VPN service. Orchid node providers receive OXT in exchange for their bandwidth. On Orchid both users and providers stake OXT. Data Management Web3',
'COTI' : 'COTI (COTI) Based in Gibraltar Currency Of The Internet (COTI) is a decentralized payment platform that aims to become a payment mechanism for cryptocurrency users as it can instantly convert and transact digital assets through the Trustchain a protocol developed by the COTI platform to replace third-party entities. In addition COTI uses a blockless payment system based on a directed acyclic graph (DAG) to improve the protocol scalability.The COTI token is the cryptocurrency created to fuel the payment platform. It can be used on the Currency Of The Internet exchange mechanisms as well as to pay for goods services or earn fees discounts. COTI has bridged with Binance Chains BEP2. COTIs Cross Chain Bridge allows users with COTI coins to cross the bridge and swap their coins to COTI BEP2 tokens and vice versa which adds another level of liquidity support for the entire community.',
'TOMO' : 'TomoChain (TOMO) TomoChain is a blockchain-based project that aims to provide a solution to the scalability problem with the Ethereum blockchain. The TomoChain team plans to support horizontal scaling by adding more second layer blockchain integrated with Ethereum for backup and atomic cross-chain transfer. The platform will be supported by the TomoCoin and will feature instant transaction confirmation and near zero transaction fee.TomoCoin (TOMO) is the protocol token to govern and regulate the Tomochain infrastructure.',
'STEEM' : 'Steem (STEEM) Steem.it is a blockchain-based social media platform where anyone can earn rewards by posting relevant content curating quality content by upvoting and by holding Steem based currencies in a vest fund which generates interest.There are three main currencies in Steemit: Steem Steem Power (SP) and Steem Backed Dollars (SBD).Steem is liquid and can be bought in an exchange and converted into steem dollars or steem power.Steem Power is basically Steem that is locked in a vesting fund for 3 months. Users can use steem power to upvote content and get curating rewards.When a user upvotes content his steem power gets depleted and then slowly regenerated. Steem Power holders recieve interest from their holdings. The more Steem Power a voter has the more revenue heand#39;ll generate for himself (in form of SP) and for the content creator  (In SBD).There is also an incentive to upvote content early as the rewards are distributed according to time. The earliest votes gets the biggest share of the reward.Steem Backed Dollars are there to protect content creators from volatitlity and can be traded for roughly 1 usd worth of steem in order to cash out from steem. Converting Steem backed dollars into STEEM takes 5 days. Users also recieve interest from holding SBD. TSteem is a proof of work currency with a scheduled blocktime of 3 seconds. Steem PoW mining is done in rounds of 63 seconds by 21 miners (witnesses). 19 of the miners are pre voted one is the other with the most computational power and the last one is selected from a queue of witnesses that did not get on the top 19 voted witnesses.90% of the block reward is allocated to a vest fund to reward curators and PoW miners the other 10% are made liquid in the form of steem and are used to reward content creators. Steem gets converted to Steem Backed Dollars and sent to the content creator.  Content Creation and Distribution Web3',
'MTL' : 'Metal (MTL) Metal Pay is a blockchain-based payment processing platform which intends to introduce cryptocurrency to the mass-market level by combining participation incentives with a clean user-friendly interface.Utilizing Proof-of-Processed-Payments to identify users rewarding them for converting legacy fiat currency into cryptocurrency acting as a bridge to the cryptocurrency world. Metaland#39;s system uses provable payments attached to verified identities to distribute currency. Anyone can participate to earn METAL as a reward for converting fiat to cryptocurrency. The Metal project aims to provide all of the financial services small to medium-sized businesses (SMB) might need.The MTL token is the native currency within the Metal system and itand#39;s distributed through a Proof of Processed Payments (PoPP) in which users earn MTL for sending money or making purchases. Payment Platforms ',
'PHA' : 'Phala Network (PHA) Phala.Network is designed to guarantee the reliable execution of smart contracts while keeping the data secretly. Confidential contracts run in miner nodes with Trusted Computing capable hardware which guarantees the secrecy of the contract data. Smart Contract Platforms',
'SLP' : 'Smooth Love Potion (SLP) Smooth Love Potion (SLP) is an ERC-20 token that can be used on the Ethereum blockchain and a part of the Axie Infinity video game.Axie Infinity is a game (dapp) that runs on the Ethereum blockchain where users can collect raise breed and battle virtual creatures called axies. Axies are really similar to real-life pets and each one has its own unique traits and appearance. Axie Infinity was created in 2018 in Vietnam. Smooth Love Potion token is a part of the Axie Infinity video game. Thus some otherwise standard might be missing.',
'MAID' : 'MaidSafe Coin (MAID) MaidSafe is a fully decentralized platform on which application developers can build decentralized applications. The network is made up by individual users who contribute storage computing power and bandwidth to form a world-wide autonomous system.Safecoin can only reside within the SAFE network and will be stored in a users wallet and used in exchange for network services; such as increased storage space and access to network applications. There is no set distribution time for safecoins. Unlike many currencies the distribution of safecoin is backed by information and the amount of coins generated by the SAFE network is directly related to the amount of resource provided to it. Data Management Web3',
'ANT' : 'Aragon (ANT) Aragon is a decentralized platform built on the Ethereum network. It allows users to manage entire organizations on the blockchain offering several tools that allow users to manage these decentralized organizations with efficiency. The ANT will enable its holders to govern the Aragon Network.ANT — the Aragon Network Token — was introduced in 2017 as the governance token of the Aragon Network. ANT was one of the first tokens to adopt the MiniMe standard being governance-enabled out of the box. MiniMe stores block-per-block snapshots of token balances. That way votes can be properly counted and no one can vote twice with the same tokens.Aragon is now introducing ANTv2: a new version of the token that is 3x cheaper to transfer and supports gasless transfers.ANTv2 will also support voting but all the logic doesnt need to be on-chain like ANTv1 making it cheaper to transfer. Thanks to the adoption of off-chain voting ANTv2 is extremely lightweight. Misc Web3 DAOs Infrastructure Cosmos Ecos',
'UOS' : 'UOS (UOS) U°OS is a universal reputation system constituting an open-source blockchain protocol. it is built to be the standard for evaluation of trustworthiness on the emerging decentralized web.U°OS introduces DPoI a unique consensus algorithm that takes into account not only the monetary stake of an account but also the value it creates for the network calculating it via accounts incoming transfer and social activity.The U°OS reputation system already has use-cases/dApps such as u.community a social platform which serves as an explorer and interface to the blockchain.Unlike other chains U°OS records both economic transfers and social interactions on the blockchain.Social transactions allow the exchange of non-monetary value in a blockchain. For example U°Community dApp uses the social transactions to upvote downvote publish content and follow or trust users. Social transactions along with economic ones are used to calculate reputation or Importance of digital entitiesClick here to access the UºOS community blog.',
'REQ' : 'Request Network (REQ) Request is a decentralized network that allows anyone to request a payment (a Request Invoice) and provide a safe payment method to the receiver. All of the data is stored in a decentralized authentic ledger.REQ tokens are ERC20 tokens that allow members to participate in the network create advanced requests and reward several parties who contribute in building the request ecosystem. To the participants a fee will be charged in REQ and afterward be burned. ',
'ARK' : 'ARK (ARK) Ark is a cryptocurrency platform built on top an improved Delegated Proof of Stake (DPoS) system derived from Lisk Crypti and BitShares. It uses Smart Bridges to communicate with others (new and existing) blockchains to further increase its reach providing a wider range of features in a single place.Ark plans to stimulate cryptocurrency mass adoption by offering multiple consumer tools like a card network game tokens anonymous transactions multi-signature accounts and others. Adding more features and tools along the way. Interoperability Polygon Ecos',
'BADGER' : 'Badger DAO (BADGER) Badger is a decentralized autonomous organization (DAO) with a single purpose: build the products and infrastructure necessary to accelerate Bitcoin as collateral across other blockchains.Its meant to be an ecosystem DAO where projects and people from across DeFi can come together to collaborate and build products the ecosystem needs. Shared ownership in the DAO allows builders to have aligned incentives while decentralized governance can ensure those incentives remain fair to all parties. The idea is less competing and more collaborating.',
'WAN' : 'Wanchain (WAN) Wanchain is a distributed super financial market based on blockchain. Wanchain aims to build a distributed future bank. As a distributed digital-asset based financial infrastructure Wanchain aims to allow any institution or individual to set up their own virtual teller window in the bank and provide services such as loan origination asset exchanges credit payments and transaction settlements based on digital assets. The core developers are based in the US and China.',
'HEX' : 'HEX (HEX) is the first high-interest Blockchain CD. CDs pay higher interest than savings accounts requiring money to be deposited for a fixed time. HEX aims to replace inefficient currencies banks and payment networks with verifiably secure peer-to-peer technology. HEX takes the profit out of banks and government money printing and gives it to HEX holders.HEX is a hybrid proof of work(POW) and proof of stake(POS) system. Stakers are paid handsomely in HEX while miners can be paid just pennies in ETH to perform your HEX transaction.HEX conforms to the ERC20 standard to maximize interoperability and security. Every HEX consists of 100000000 Hearts (1 with 8 zeroes or 100 Million.) Which is funny because when you stake you have staked Hearts.Hardware wallet support: Trezor and Ledger are integrated with both MetaMask (for HEX and ETH) and Electrum (for Bitcoin.)FreeClaiming is totally secure. Generating signatures is a standard feature in Bitcoin and can be done totally offline. Electrum is a great Bitcoin wallet. If you use a trezor or ledger hardware wallet you use it through Electrum which is a handy way to generate your BTC FreeClaim signature if the software youand#39;re using doesnand#39;t have the feature. Your private keys stay safe inside your hardware device this way. If you really love anonymity you can claim each BTC address to a new ETH address over TOR or other proxies.HEX is easily extensible because smart contracts can be built on top of it or reference it.HEX works with distributed exchanges and atomic swaps easily. Finance Yield Farming Infrastructure DeFi ',
'NXM' : 'Nexus Mutual (NXM) Nexus Mutual is a decentralized alternative to insurance. It has used blockchain technology to create a mutual (a risk-sharing pool) to return the power of insurance to the people. The platform is built on the Ethereum public chain. It allows anyone to become a member and buy cover.',
'DFI' : 'DeFiChain (DFI) The DFI token is an integral unit of account in the DeFi blockchain. The DeFi Foundation in Singapore will issue 1.2 billion DFI over its lifetime.',
'XWC' : 'WhiteCoin (XWC) Whitecoin is a public chain that utilizes interconnection between blockchains through the innovative Multi Tunnel Blockchain Communication Protocol (MTBCP) protocol.As an essential part of the Whitecoin ecosystem it adopts the Random Proof of Stake (RPOS) consensus Whitecoin Axis Whitecoin Wallet decentralized mining pools and smart contract platforms to build a cross-chain blockchain ecological infrastructure.Telegram Currencies ',
'OMI' : 'ECOMI (OMI) ECOMI is a technology company based in Singapore and it offers a one-stop-shop for digital collectibles through the ECOMI Collect app bringing pop culture and entertainment into the 21st century.The Collect app allows users to experience true ownership of premium digital collectibles. Through the app marketplace users can obtain common rare or one-of-a-kind digital collectibles share these across the social network service and exchange them with the Collect community all from the palm of their hand.ECOMI sees digital collectibles as a new asset class that offers intellectual property owners the opportunity for new revenue streams in the digital landscape. Digital streaming gaming and in-app purchasing have become a multibillion-dollar market and the next to join this digital trend is the pop culture and collectibles industry.ECOMI also offers two cold storage solutions- The Secure Wallet available now is the worlds only true cold storage wallet. Currently stores BTC LTC ETH XRP BCH GoChain OMI ERC20 tokens ERC721 NFTs (digital collectibles).To be released Q4 2019- the ECOMI Collect Digital Wallet. A similar device however it is designed solely for NFTs and the OMI token.',
'ARRR' : 'Pirate Chain (ARRR) PirateChain (ARRR) is a 100% private send cryptocurrency. It uses a privacy protocol that cannot be compromised by other users activity on the network. Most privacy coins are riddled with holes created by optional privacy. PirateChain uses ZK-Snarks to shield 100% of the peer to peer transactions on the blockchain making for highly anonymous and private transactions.',
'TWT' : 'Trust Wallet Token (TWT) Trust Wallet is an iOS (Open Source) and Android (Closed Source) wallet for Ethereum and other Ethereum-based tokens. The Trust Wallet keeps your private keys stored locally and features an open-source and audited code. It also features a decentralized exchange provided by the Kyber Network (Q2 2018). On the 8th of February Trust wallet team decided to move the Trust Wallet app for Android into closed source development due to security reasons. It supports 14 crypto-currencies to see the full list click here.Trust Wallet was acquired by Binance in July 2018 and it will natively support Binance DEX and Binance Chain in Q1 2019 it also supports ETC/POA DApps and will soon add support for Tron DApps.Trust Wallet Token is the native token from Trust Wallet.',
'XCH' : 'Chia (XCH) Founded by Bram Cohen the inventor of the BitTorrent network Chia Network is building a better blockchain and smart transaction platform which is more decentralized more efficient and more secure.Chialisp is Chias new smart transaction programming language that is powerful easy to audit and secure. The blockchain is powered by the first new Nakamoto style consensus algorithm since Bitcoin launched in 2008. Proofs of Space and Time replace energy intensive proofs of work by utilizing unused disk space.Chia Network supports the development and deployment of the Chia blockchain globally. Chia Network supports chia developers and supports the enterprise use of chia with software support and chia lending.',
'KNC' : 'KyberNetwork (KNC) is an on-chain protocol which allows instant exchange and conversion of digital assets (e.g. crypto tokens) and cryptocurrencies (e.g. Ether Bitcoin ZCash) with high liquidity.KyberNetwork wants to implement several ideal operating properties of an exchange including trustless decentralized execution instant trade and high liquidity. Besides serving as an exchange KyberNetwork also provides payment APIs that will allow Ethereum accounts to easily receive payments from any crypto tokens.; Decentralized Exchanges DeFi.',
'ANC' : 'Anchor Protocol (ANC) The Anchor Token (ANC) is Anchor Protocols governance token. ANC tokens can be deposited to create new governance polls which can be voted on by users that have staked ANC.ANC is designed to capture a portion of Anchors yield allowing its value to scale linearly with Anchors assets under management (AUM). Anchor distributes protocol fees to ANC stakers pro-rata to their stake benefitting stakers as adoption of Anchor increases -- stakers of ANC are incentivized to propose discuss and vote for proposals that further merit the protocol.ANC is also used as incentives to bootstrap borrow demand and initial deposit rate stability. The protocol distributes ANC tokens every block to stablecoin borrowers proportional to the amount borrowed.',
'BEST' : 'Bitpanda Ecosystem Token (BEST) BEST is the Bitpanda coin that offers users a wide range of benefits and perks within the Bitpanda ecosystem. It provides the growing community of around 1 million Bitpanda users with a wide range of rewards and benefits. It is issued by Bitpanda. By investing in BEST the user will enjoy a reduction of up to 25% on Bitpanda trading fees gain priority access to the Bitpanda Launchpad which will be available later and benefit from a wide range of upcoming features and rewards.It will play a vital role in Bitpandas global expansion and in making its vision of changing the rules of investing a reality. BEST is the fuel of the Bitpanda ecosystem which means that the Bitpanda platform the Bitpanda Global Exchange and future products like the Bitpanda Launchpad will make heavy use of incorporating it and offering users who hold it exclusive rewards and perks.',
'HEDG' : 'HedgeTrade (HEDG) HedgeTrade is a platform where the traders share their knowledge. Traders post predictions into a smart contract-powered Blueprint that users can purchase or unlock in order to access. Traders are rewarded if the Blueprint is correct otherwise the users purchase is refunded.',
'TRIBE' : 'Tribe (TRIBE) TRIBE is the governance token that manages the Fei Protocol. TRIBE is governance minimized for peg maintenance with an emphasis on upgrades and integrations.',
'KEEP' : 'Keep Network (KEEP) A keep is an off-chain container for private data. Keeps let you interact with private data while taking full advantage of the public blockchain. Interoperability Privacy',
'MIR' : 'Mirror Protocol (MIR) MIR is the governance token of Mirror Protocol a synthetic assets protocol built by Terraform Labs (TFL) on the Terra blockchain.Mirror Protocol is decentralized from day 1 with the on-chain treasury and code changes governed by holders of the MIR token. TFL has no intention of keeping or selling MIR tokens and there are no admin keys or special access privileges granted. The intent for this is to be a completely decentralized community-driven project.',
'AKT' : 'Akash Network (AKT) Akash DeCloud is a cloud built for DeFi decentralized projects and high growth companies providing scale flexibility and price performance. Its serverless computing platform is compatible with all cloud providers and all applications that run on the cloud. cosmos-ecosystem | storage | solana-ecosystem',
'ORN' : 'Orion Protocol (ORN) At the core of Orion Protocol is the ORN token. Orion has ensured deep utility of the token across the entire protocol integrating it into all main transactions to take the form of an internal currency or utility token.Orion Terminal seamlessly aggregates bottomless liquidity from all major exchanges centralized + decentralized: providing rich trading tools in one easy to use platform.Find all info regarding the 2020 ORN token swap here.',
'MBOX' : 'MOBOX (MBOX) MOBOX is a community-driven platform empowering users by rewarding them for their engagement and enjoyment. By using innovative tokenomics utilizing finance and games. Whilst also combining the best of DeFi and NFTs to create a truly unique and everlasting FREE TO PLAY PLAY TO EARN ECOSYSTEM. MBOX Token hodlers have the right to submit and vote on proposals. Hodlers will be able to manage the success of the platform such as games to develop and integrate unique functions events development and more.',
'SUSD' : 'sUSD (SUSD) sUSD is a stablecoin that scales while avoiding the risks of centralized off-chain assets will be a huge benefit for the entire trading ecosystem. It will provide fast interexchange settlement stable trading against ERC-20 assets and a safe place to park value without the need to settle into fiat. The network is built on the Ethereum blockchain and it employs two tokens both of which are ERC20 compatible. The Havven network has been released as an open source protocol so that anyone can integrate with it including exchanges and decentralized platforms.',
'TKO' : 'Tokocrypto (TKO) Tokocrypto is a centralized exchange based in Jakarta Indonesia with IDR fiat on/off ramps. Its vision is to help Indonesians gain a broader knowledge of the industry and to integrate the technology into society and subsequently the global economy.',
'ETN' : 'Electroneum (ETN) ETN is a store of value that can be used to purchase everyday items from bread and milk to mobile phone top-ups. When used in conjunction with the Electroneum mobile application users can transfer ETN to anyone in an instant either in person or remotely.',
'RAD' : 'Radicle (RAD) Radicle is a decentralized code collaboration network built on open protocols. It enables developers to collaborate on code without relying on trusted intermediaries. Radicle was designed to provide similar functionality to centralized code collaboration platforms — or forges — while retaining Gits peer-to-peer nature building on what made distributed version control so powerful in the first place.Radicle also leverages Ethereum (opt-in) for unique global names decentralized organizations and protocols that help maintainers sustain their open-source work.The network is powered by a peer-to-peer replication protocol built on Git called Radicle Link. Radicle Link extends Git with peer-to-peer discovery by disseminating data via a process called gossip. That is participants in the network share and spread data they are interested in by keeping redundant copies locally and sharing otherwise known as replicating their local data with selected peers. By leveraging Gits smart transfer protocol Radicle Link keeps Gits efficiency when it comes to data replication while offering global decentralized repository storage through the peer-to-peer networking layer.Since all data on the network is stored locally by peers on the network developers can share and collaborate on Git repositories without relying on intermediaries such as hosted servers.The easiest way to use Radicle is with Upstream a desktop client developed by the founding team of the Radicle project. With Upstream you can create an identity host your code and collaborate with others on the Radicle network.',
'GUSD' : 'Gemini Dollar (GUSD) Gemini is a licensed digital asset financial platform. It enables users with the ability to trade (buy/sell) and store digital assets by granting them the access to custody services and a crypto marketplace. Gemini platform works under the regulatory oversight of the New York State Department of Financial Services.The GUSD token is an Ethereum-based (ERC-20) cryptocurrency developed by Gemini. It is a stable coin which is attached to the USD giving it the stability of fiat along with the advantages of cryptocurrency. Stablecoins',
'BAL' : 'Balancer (BAL) An AMM or Automated Market Maker is a general term that defines an algorithm for creating and managing liquidity. Instead of paying fees to portfolio managers to rebalance the usersand#39; portfolio they collect fees from traders who rebalance their portfolio. Users can earn returns by providing liquidity or as a trader swap between any assets in the global liquidity pool. Decentralized Exchanges DeFi',
'DODO' : 'DODO (DODO) is an on-chain liquidity provider which leverages the Proactive Market Maker algorithm (PMM) to provide pure on-chain and contract-fillable liquidity for everyone.DODO accepts liquidity providers assets. It gathers funds near market prices to provide sufficient liquidity. In order to minimize counterparty risks for LPs DODO dynamically adjusts market prices to encourage arbitrageurs to step in and stabilize LPsand#39; portfolios.Telegram | Discord Decentralized Exchanges DeFi BSC Ecos',
'RPL' : 'RocketPool (RPL) RocketPool is an Ethereum-based Proof of Stake pool built to be compatible with Casper the new consensus protocol due in 2018. It acts as a decentralized platform that provides the users individuals or organizations with tools to earn interest on their Ethereum. At the RocketPool users can use 3d full party API for businesses that want to feature a Proof of Stake service.The RocketPool token (RPL) is a protocol token that was created to be a tool on distributed staking network. RPL token is Ethereum-based and it works with an automatic adjustment between reporting intervals mechanism in which Smart nodes on the RocketPool network report their status and server load every 15 minutes.',
'UTK' : 'Utrust (UTK) The UTRUST platform aims to provide the consumer protection that buyers take for granted in traditional online purchases - acting as a mediator resolving conflicts and enabling the possibility of refunds to mitigate fraud while shielding the merchant from crypto-market volatility. The project wants to enable fast transactions lower fees and low cross-border transaction friction enabling merchants to sell to a growing worldwide audience of crypto-holders. The project aspires to and#39;build a payment API for marketplace integration that will become the crypto-equivalent of PayPal. Payment Platforms ',
'YFII' : 'DFI.money (YFII) DFI.Money (YFII) is a Decentralized Finance (DeFi) platform which aims to build products on aggregated liquidity provision leveraged trading automated marketing making and more.DFI.Money (YFII) is a fork of yearn.finance (YFI) after yEarn Improvement Proposal #8 (YIP-8) which proposed to prolong the minting of the platform utility token YFI by another 2 months and with a weekly-halving emission curve was rejected.The YFII token is the native utility token of the DFI.Money platform. Users can earn it by contributing liquidity to DFI.Moneyand#39;s aggregated liquidity pool and use the token for platform governance.DFI.Money currently provides a profit optimizing service for lending providers moving providersand#39; funds between lending protocols such as Aave and Compound autonomously for highest return. Future strategies are being developed in its vaults section. Asset Management DeFi',
'RLY' : 'Rally (RLY) The Rally Network is an open decentralized network that is powered by its native ERC-20 governance token $RLY. $RLY is an Ethereum blockchain-based asset that can be sent and received in the Ethereum mainnet network. An open network for digital creators crypto influencers brands and celebrities to build tokenized communities. It provides creators with tools to build virtual economies that extend their brands while also providing community benefits and new economic incentives for fans to engage with their favourite creators.Creator Coins are digital currencies that represent the brands of Creators. Creator Coins are the first in the long line of customizable Creator-branded blockchain tools on the Rally Network.Rally offers anyone with an online community the ability to launch their own coin without the complexity of coding on the ethereum blockchain. Rally is a decentralized platform completely governed by the community. This means that creators and their communities have unfettered control to use their social tokens across all social platforms.Discord Tokenization Social Money',
'RIF' : 'RIF Token (RIF) The RIF Token is intended to allow any token holder to consume any services that are compatible with RIF OS Protocols. Such services may include third-party-developed infrastructure services and any other apps that might be deployed on their framework that agrees to accept RIF Tokens as a means of accessing/consuming the service or app.RIF (Rootstock Infrastructure Framework) is the third layer on top of Bitcoin that provides a wide range of solutions based on blockchain technology such as payments storage and domaining (RNS). Application Development ',
'PLA' : 'PlayChip (PLA) PlayChip is an incentivized blockchain-based online sports betting platform and fantasy sports ecosystem. The PlayChip ecosystem is designed to be secure scalable simple to use and fun as well as include features to incorporate provable fairness into PlayChip transactions and the partnered gaming platforms.PLA is PlayChips native token. PLA is an Ethereum based ERC20 token. PLA represents a universal system for payments and rewards on the platform. PLA tokens can be used for placing bets wagering and gaming.',
'MLN' : 'Enzyme (MLN) Enzyme empowers users to build and scale investment strategies of their choice - from discretionary and robot to ETFs and market-making. Its second-generation smart contract-enforced platform is thoroughly tested and audited before any mainnet deployments are made.Enzyme Finance was formerly known as Melon Protocol. The token has a new icon and name but the MLN ticker and contract address stay the same. MLN is used to pay for various functions throughout the fund creation process and investment lifecycle. Portfolio Management Software',
'JST' : 'JUST (JST) JST is a part of the USDJ currency system. Holding JST can participate in the community governance of JUST and pay the stabilization fee for CDP borrowing in the JUST system. Decentralized Exchanges DeFi',
'DYDX' : 'dYdX (DYDX) is building an open platform decentralized exchange for advanced cryptofinancial products powered by the Ethereum blockchain. A powerful and professional exchange for trading cryptoassets where users can truly own their trades and eventually the exchange itself. dYdX (DYDX) is the exchange ERC20 token. Decentralized Exchanges DeFi AMMs',
'POWR' : 'Power Ledger (POWR) Power Ledger is a decentralized energy exchange platform. It incorporates energy applications such as a P2P energy trading application that allows businesses to host trading on the platform. This technology enables the sale of surplus renewable energy generated at residential and commercial developments (including multi-unit/multi-tenanted) connected to existing electricity distribution networks or within micro-grids. POWR is an Ethereum-based token that fuels the Power Ledger Ecosystem. POWR tokens serve as access permission tokens allowing the Application Hosts and their consumers to gain access to the P2P trading features and other Power Ledger applications. To synchronize the ecosystem globally and create cross-market electricity compatibility a second token Sparkz is used in Power Ledgers ecosystem transactions. Applications Hosts may convert their POWR tokens to Sparks when the ecosystem has been accessed.    ',
'VRA' : 'Verasity (VRA) Verasity is the next generation of video sharing platform enhanced with blockchain technology. It aims to empower content creators by allowing them to choose how to monetize videos and also users by giving them more content and options and letting them choose if advertising is wanted and rewarding users that view it.Verasity (VRA) is an ERC20 compliant token in the Ethereum network and is used in the platform as a reward and payment method.  Media Video Sharing Monetization',
'BOND' : 'BarnBridge (BOND) is a risk tokenizing protocol. It allows hedging yield sensitivity and price volatility. BarnBridge does this by accessing debt pools on other DeFi protocols and transforming single pools into multiple assets with varying risk/return characteristics. Finance Asset Management DeFi Risk',
'IQ' : 'Everipedia (IQ) The Everipedia IQ blockchain provides a new paradigm change and knowledge economy to disrupt the old centralized internet knowledge encyclopedia model similar to Wikipedia. By creating a new incentive structure and a distributed backend hosted within a blockchain the new Everipedia knowledge base will be able to improve upon all fundamental features of Wikipedia.',
'FLUX' : 'Flux (FLUX) Flux is the cryptocurrency powering the Flux Ecosystem, including a massive decentralized computational network. Flux gives users both institutional and private control over their cloud infrastructure in a decentralized manner.Flux provides incentives for miners and FluxNode operators on the highly scalable Flux network and is the currency for buying resources and fueling transactions on the computational network called FluxOS. mineable | equihash | distributed-computing | privacy | filesharing | masternodes | binance-smart-chain',
'IMX' : 'IMX is the native utility token of the Immutable X protocol. Immutable X protocol claims zero gas fees instant trades and carbon-neutral NFTs for marketplaces games and applications. The IMX engine supports over 9000 transactions per second which is a 600x improvement over native limits. scaling | nfts | rollups | arrington-xrp-capital-portfolio | alameda-research-portfolio',
'GALA' : 'GALA (GALA) is the official ERC-20 token that powers the Gala Games Ecosystem.  From one of the founders of Zynga and some of the creative minds behind FarmVille and Words With Friends.  Town Star is a game for the Gala blockchain. The Gala blockchain is the next evolution of gaming and has the $148B industry buzzing with excitement. It is gaming reimagined to benefit creators and players.',
'APE' : 'ApeCoin (APE) is an ERC-20 governance and utility token used within the APE ecosystem to empower a decentralized community building at the forefront of web3.The APE Foundation is the steward of ApeCoin. It is the base layer on which ApeCoin holders in the ApeCoin DAO can build.The Foundation facilitates decentralized and community-led governance and is designed to become more decentralized over time. It is tasked with administering the decisions of the ApeCoin DAO and is responsible for day-to-day administration bookkeeping project management and other tasks that ensure the DAO communitys ideas have the support they need to become a reality.The goal of the APE Foundation is to steward the growth and development of the APE ecosystem in a fair and inclusive way. It utilizes the Ecosystem Fund which is controlled by a multisig wallet to pay its expenses as directed by the ApeCoin DAO and provides an infrastructure for ApeCoin holders to collaborate through open and permissionless governance processes.',
'BTS' : 'Bitshares (BTS) BitShares (BTS) was first introduced in a White Paper titled A Peer-to-Peer Polymorphic Digital Asset Exchange by Daniel Larimer Charles Hoskinson and Stan Larimer. It is a brand of open-source software based on as blockchain technology as used by Bitcoin. Unlike bitcoins which do not produce any income for their owners BitShare can be used to launch Decentralized Autonomous Companies (DACs) which issue shares produce profits and distribute profits to shareholders. As such BitShares is about making profitable companies that people want to own shares in thus creating a return for the shareholders. The first DAC launched by this process was called BitSharesX a decentralized asset exchange based in Hong Kong. BitShares was originally launched under the name of ProtoShares (PTS); it was later renamed to BitShares (BTS) and reloaded in November 2014 by merging several products into BitShares (BTS). Smart Contract Platforms '

  }




  var avgvol7d = {

'BTC' : 20913513157,
'ETH' : 12611304516,
'ADA' : 3032101354,
'BNB' : 1254518137,
'USDT' : 49006170480,
'XRP' : 3087487496,
'SOL' : 3282127948,
'DOGE' : 1434039831,
'DOT' : 1351884084,
'USDC' : 1628835793,
'UNI' : 381793495,
'LTC' : 1973382054,
'LINK' : 1027279543,
'BCH' : 1741802210,
'LUNA' : 484855716,
'ICP' : 485865903,
'BUSD' : 3614696903,
'MATIC' : 901988992,
'FIL' : 1100712472,
'AVAX' : 548593538,
'WBTC' : 174593100,
'VET' : 489991901,
'ETC' : 3375139437,
'XLM' : 570600706,
'THETA' : 319884820,
'TRX' : 874704201,
'DAI' : 257639556,
'FTT' : 948716190,
'EOS' : 1423656770,
'XMR' : 134503143,
'AAVE' : 234355923,
'ATOM' : 376019179,
'CAKE' : 251025660,
'MIOTA' : 244643219,
'AXS' : 501830909,
'GRT' : 137973373,
'XTZ' : 162981298,
'CRO' : 33229153,
'ALGO' : 198319560,
'NEO' : 384029125,
'KLAY' : 61572933,
'BTCB' : 20232128,
'BSV' : 246987702,
'MKR' : 88127147,
'KSM' : 182340163,
'EGLD' : 62316774,
'QNT' : 117275751,
'FTM' : 506868927,
'BTT' : 440636677,
'WAVES' : 109171474,
'HBAR' : 175127171,
'SHIB' : 174331590,
'LEO' : 1641853,
'COMP' : 153693260,
'NEAR' : 182347880,
'REV' : 1807904,
'DASH' : 200322462,
'HT' : 153133714,
'CHZ' : 244839048,
'UST' : 41897094,
'AMP' : 31846793,
'RUNE' : 68051548,
'DCR' : 8342264,
'HNT' : 19124748,
'HOT' : 162899811,
'ZEC' : 177925457,
'STX' : 41129517,
'XEM' : 73687448,
'TFUEL' : 72518514,
'MANA' : 112041419,
'SUSHI' : 203574926,
'ENJ' : 114297115,
'XDC' : 4727849,
'AR' : 65778207,
'CELO' : 101937943,
'YFI' : 176662147,
'ZIL' : 86379416,
'FLOW' : 103168520,
'CEL' : 5695682,
'SNX' : 91564875,
'BAT' : 184191897,
'QTUM' : 327088163,
'BTG' : 72057811,
'RVN' : 70973211,
'TUSD' : 40333886,
'OKB' : 181180761,
'ONE' : 660440636,
'TEL' : 9761827,
'SC' : 82695185,
'ZEN' : 39712300,
'AUDIO' : 43522337,
'ICX' : 48002252,
'MDX' : 60737117,
'PERP' : 32207317,
'KCS' : 11260251,
'ONT' : 118930005,
'NEXO' : 6941309,
'BNT' : 39498316,
'ZRX' : 63497478,
'OMG' : 495883424,
'CRV' : 128111420,
'DGB' : 28187555,
'IOST' : 226086119,
'ANKR' : 65342656,
'PAX' : 41404115,
'NANO' : 28071065,
'MINA' : 70164039,
'UMA' : 26522557,
'SAND' : 271073838,
'REN' : 75693406,
'CHSB' : 2307353,
'VGX' : 2442796,
'IOTX' : 52560945,
'RENBTC' : 7402669,
'KAVA' : 80288163,
'SXP' : 171031036,
'1INCH' : 214755891,
'LRC' : 62324642,
'DENT' : 55865079,
'RSR' : 37962365,
'WAXP' : 48219524,
'GLM' : 96150690,
'OCEAN' : 30268000,
'LSK' : 29525155,
'STORJ' : 68269391,
'ERG' : 3807044,
'BAKE' : 76368716,
'ALPHA' : 44290905,
'MED' : 58281150,
'XVG' : 22139248,
'WIN' : 48806666,
'FET' : 70357670,
'UBT' : 2899939,
'SKL' : 39872992,
'BCD' : 5540435,
'NMR' : 13525338,
'WRX' : 27317317,
'VTHO' : 20356531,
'AGIX' : 10775758,
'USDN' : 5414323,
'INJ' : 32964737,
'OGN' : 41495795,
'CKB' : 11101417,
'ARDR' : 132162928,
'HUSD' : 170420422,
'LPT' : 11494545,
'POLY' : 254229933,
'GNO' : 5980577,
'CVC' : 425506211,
'STMX' : 94329703,
'RLC' : 29185384,
'ALICE' : 142881809,
'SRM' : 327775887,
'DAG' : 4597075,
'XVS' : 42232401,
'SNT' : 29709977,
'FEI' : 19799580,
'EWT' : 3264669,
'ONG' : 44156272,
'REEF' : 51806695,
'STRAX' : 32575462,
'BAND' : 44824698,
'REP' : 35794641,
'PROM' : 34055915,
'NKN' : 20958618,
'ELF' : 341763309,
'CTSI' : 30123432,
'GT' : 7914729,
'ORBS' : 30102224,
'CELR' : 43312731,
'PAXG' : 7498169,
'COTI' : 45619876,
'FUN' : 15110786,
'WOO' : 24703081,
'OXT' : 34180502,
'HIVE' : 98656729,
'TOMO' : 22559631,
'ANT' : 58987652,
'ASD' : 1943012,
'CFX' : 15174131,
'UOS' : 3268326,
'STEEM' : 31688085,
'MAID' : 486884,
'MTL' : 151122976,
'MVL' : 20747416,
'BTCST' : 7859937,
'SLP' : 112593559,
'XDB' : 1787391,
'REQ' : 17980369,
'BADGER' : 11026931,
'DODO' : 57037915,
'ARK' : 36524053,
'NU' : 35311042,
'BAL' : 51693726,
'UTK' : 10391413,
'PHA' : 26942124,
'BORA' : 39311614,
'WAN' : 11100154,
'YFII' : 53684809,
'GUSD' : 5920654,
'HEX' : 49462623,
'BCHA' : 753861658,
'XEC' : 288169988,
'STETH' : 87047604,
'WBNB' : 660538357,
'CTC' : 5634941,
'HBTC' : 7534217,
'CCXX' : 2407502,
'TTT' : 705885,
'SAFEMOON' : 6911855,
'EGR' : 487692,
'YOUC' : 97888,
'INO' : 1000000,
'NXM' : 16099,
'DFI' : 2165887,
'XWC' : 14546725,
'C98' : 124720349,
'RAY' : 153392215,
'XYM' : 1873811,
'OMI' : 4824134,
'LUSD' : 1139186,
'YGG' : 28925745,
'ARRR' : 934238,
'PUNDIX' : 49609928,
'ORC' : 10782932,
'XCH' : 26605196,
'KNC' : 40853699,
'AGLD' : 131234369,
'XPRT' : 691144,
'TWT' : 77269281,
'BEST' : 90045,
'ILV' : 16556920,
'TITAN' : 9177041,
'ANC' : 5751128,
'HEDG' : 30505,
'TRIBE' : 15620113,
'MNGO' : 3963056,
'ZLW' : 590617,
'DAWN' : 40499395,
'MBOX' : 63725461,
'BIT' : 7136739,
'MIR' : 25307749,
'FRAX' : 2687686,
'TLM' : 90121604,
'TKO' : 32984360,
'ACH' : 62131545,
'AKT' : 978910,
'PEAK' : 650926,
'ALBT' : 4680252,
'EPS' : 43179259,
'ORN' : 10390191,
'FIDA' : 806883,
'SUSD' : 6563329,
'KEEP' : 33760960,
'KOK' : 2350928,
'BFC' : 21943459,
'ETN' : 414278,
'DDX' : 1984305,
'LINA' : 21253357,
'ATA' : 51181477,
'RAD' : 24535637,
'LYXe' : 1964857,
'DRS' : 2718930,
'KSP' : 13033184,
'TLOS' : 2792474,
'CLV' : 32618524,
'ROSE' : 120598259,
'RPL' : 1067433,
'VRA' : 33159590,
'MASK' : 68785109,
'PLA' : 48598285,
'RLY' : 16376485,
'HTR' : 3941394,
'STRK' : 17581762,
'NOIA' : 1053723,
'KLV' : 1834991,
'RNDR' : 2376440,
'SAPP' : 155964,
'JST' : 96553423,
'IQ' : 20604165,
'BANANA' : 8155603,
'DKA' : 25616271,
'C20' : 103333,
'RIF' : 2147780,
'MLN' : 12738657,
'CVX' : 9346130,
'QUICK' : 16883867,
'BTS' : 9901818,
'XYO' : 4218560,
'VLX' : 1840827,
'CSPR' : 30164311,
'ERN' : 20021800,
'MATH' : 2388034,
'POWR' : 89822026,
'CHR' : 44033887,
'SUN' : 15880575,
'META' : 23734482,
'ZKS' : 10723262,
'SOLO' : 394614,
'TVK' : 19688863,
'AVA' : 15425993,
'QKC' : 15609038,
'TPT' : 2222050,
'DYDX' : 1674862650,


  }




  // keys are symbols
  // local test
  // var url7dayvol = 'cmc7dayvol.txt' // volume avg 7 day pull

  var url7dayvol = 'https://stocktouch.s3.amazonaws.com/cmc7dayvol.txt'

  fetch(url7dayvol)
      .then(response => response.json())
      .then(data => {
        console.log("volume avg 7 day pull " + JSON.stringify(Object.keys(data)))
        // note you can also get lots of other stuff including coins in circ it is SUPPLY perhaps
        let allkeys = Object.keys(data)
        for (let i = 0; i < allkeys.length; i++) {
          let s = allkeys[i]
          avgvol7d[s] = data[s]['avgVolUSD'] // could use USDT here also
        }
      })
      .catch((x) => {
        console.log("error pulling 7 day vol " + JSON.stringify(x))
      })

var cmctag = {

'BTC' : 'mineable pow sha-256 store-of-value state-channels coinbase-ventures-portfolio three-arrows-capital-portfolio polychain-capital-portfolio binance-labs-portfolio arrington-xrp-capital blockchain-capital-portfolio boostvc-portfolio cms-holdings-portfolio dcg-portfolio dragonfly-capital-portfolio electric-capital-portfolio fabric-ventures-portfolio framework-ventures galaxy-digital-portfolio huobi-capital alameda-research-portfolio a16z-portfolio 1confirmation-portfolio winklevoss-capital usv-portfolio placeholder-ventures-portfolio pantera-capital-portfolio multicoin-capital-portfolio paradigm-xzy-screener',
'ETH' : 'mineable pow smart-contracts ethereum binance-smart-chain coinbase-ventures-portfolio three-arrows-capital-portfolio polychain-capital-portfolio binance-labs-portfolio arrington-xrp-capital blockchain-capital-portfolio boostvc-portfolio cms-holdings-portfolio dcg-portfolio dragonfly-capital-portfolio electric-capital-portfolio fabric-ventures-portfolio framework-ventures hashkey-capital-portfolio kinetic-capital huobi-capital alameda-research-portfolio a16z-portfolio 1confirmation-portfolio winklevoss-capital usv-portfolio placeholder-ventures-portfolio pantera-capital-portfolio multicoin-capital-portfolio paradigm-xzy-screener',
'BNB' : 'marketplace centralized-exchange payments binance-smart-chain alameda-research-portfolio multicoin-capital-portfolio',
'ADA' : 'mineable dpos pos platform research smart-contracts staking binance-smart-chain cardano-ecosystem',
'SOL' : 'pos platform solana-ecosystem cms-holdings-portfolio kinetic-capital alameda-research-portfolio multicoin-capital-portfolio',
'XRP' : 'medium-of-exchange enterprise-solutions binance-chain arrington-xrp-capital galaxy-digital-portfolio a16z-portfolio pantera-capital-portfolio',
'DOT' : 'substrate polkadot binance-chain binance-smart-chain polkadot-ecosystem three-arrows-capital-portfolio polychain-capital-portfolio blockchain-capital-portfolio boostvc-portfolio cms-holdings-portfolio coinfund-portfolio fabric-ventures-portfolio fenbushi-capital-portfolio hashkey-capital-portfolio kinetic-capital 1confirmation-portfolio placeholder-ventures-portfolio pantera-capital-portfolio exnetwork-capital-portfolio',

}

var cmcslug = {

'BTC' : 'bitcoin',
'ETH' : 'ethereum',

}

var cmcrank = {

'BTC' : 1,
'ETH' : 1,

}

  var cmcvol = {

'BTC' : 41827026314,
'ETH' : 25222609031,
'ADA' : 6064202708,
'BNB' : 2509036274,
'USDT' : 98012340960,
'XRP' : 6174974991,
'SOL' : 6564255896,
'DOGE' : 2868079661,
'DOT' : 2703768167,
'USDC' : 3257671586,
'UNI' : 763586990,
'LTC' : 3946764108,
'LINK' : 2054559085,
'BCH' : 3483604420,
'LUNA' : 969711431,
'ICP' : 971731805,
'BUSD' : 7229393805,
'MATIC' : 1803977984,
'FIL' : 2201424943,
'AVAX' : 1097187075,
'WBTC' : 349186200,
'VET' : 979983801,
'ETC' : 6750278874,
'XLM' : 1141201411,
'THETA' : 639769639,
'TRX' : 1749408402,
'DAI' : 515279111,
'FTT' : 1897432379,
'EOS' : 2847313540,
'XMR' : 269006285,
'AAVE' : 468711846,
'ATOM' : 752038357,
'CAKE' : 502051320,
'MIOTA' : 489286437,
'AXS' : 1003661818,
'GRT' : 275946746,
'XTZ' : 325962596,
'CRO' : 66458306,
'ALGO' : 396639119,
'NEO' : 768058250,
'KLAY' : 123145865,
'BTCB' : 40464255,
'BSV' : 493975404,
'MKR' : 176254294,
'KSM' : 364680326,
'EGLD' : 124633547,
'QNT' : 234551501,
'FTM' : 1013737853,
'BTT' : 881273353,
'WAVES' : 218342948,
'HBAR' : 350254341,
'SHIB' : 348663179,
'LEO' : 3283705,
'COMP' : 307386519,
'NEAR' : 364695759,
'REV' : 3615808,
'DASH' : 400644924,
'HT' : 306267428,
'CHZ' : 489678096,
'UST' : 83794187,
'AMP' : 63693586,
'RUNE' : 136103096,
'DCR' : 16684528,
'HNT' : 38249495,
'HOT' : 325799621,
'ZEC' : 355850913,
'STX' : 82259034,
'XEM' : 147374896,
'TFUEL' : 145037027,
'MANA' : 224082837,
'SUSHI' : 407149851,
'ENJ' : 228594229,
'XDC' : 9455698,
'AR' : 131556413,
'CELO' : 203875886,
'YFI' : 353324294,
'ZIL' : 172758832,
'FLOW' : 206337039,
'CEL' : 11391363,
'SNX' : 183129750,
'BAT' : 368383794,
'QTUM' : 654176325,
'BTG' : 144115622,
'RVN' : 141946421,
'TUSD' : 80667772,
'OKB' : 362361522,
'ONE' : 111781144,
'TEL' : 19523654,
'SC' : 165390369,
'ZEN' : 79424600,
'AUDIO' : 87044674,
'ICX' : 96004504,
'MDX' : 121474234,
'PERP' : 64414633,
'KCS' : 22520501,
'ONT' : 237860010,
'NEXO' : 13882618,
'BNT' : 78996631,
'ZRX' : 126994955,
'OMG' : 991766847,
'CRV' : 256222840,
'DGB' : 56375109,
'IOST' : 452172237,
'ANKR' : 130685312,
'PAX' : 82808230,
'NANO' : 56142130,
'MINA' : 140328078,
'UMA' : 53045113,
'SAND' : 542147676,
'REN' : 151386812,
'CHSB' : 4614706,
'VGX' : 4885592,
'IOTX' : 105121890,
'RENBTC' : 14805337,
'KAVA' : 160576326,
'SXP' : 342062071,
'1INCH' : 429511782,
'LRC' : 124649284,
'DENT' : 111730157,
'RSR' : 75924730,
'WAXP' : 96439047,
'GLM' : 192301380,
'OCEAN' : 60535999,
'LSK' : 59050310,
'STORJ' : 136538781,
'ERG' : 7614088,
'BAKE' : 152737431,
'ALPHA' : 88581810,
'MED' : 116562299,
'XVG' : 44278496,
'WIN' : 97613331,
'FET' : 140715340,
'UBT' : 5799878,
'SKL' : 79745984,
'BCD' : 11080870,
'NMR' : 27050676,
'WRX' : 54634633,
'VTHO' : 40713062,
'AGIX' : 21551516,
'USDN' : 10828646,
'INJ' : 65929474,
'OGN' : 82991590,
'CKB' : 22202834,
'ARDR' : 264325856,
'HUSD' : 340840844,
'LPT' : 22989089,
'POLY' : 508459865,
'GNO' : 11961153,
'CVC' : 851012421,
'STMX' : 188659406,
'RLC' : 58370767,
'ALICE' : 285763618,
'SRM' : 655551774,
'DAG' : 9194150,
'XVS' : 84464801,
'SNT' : 59419953,
'FEI' : 39599160,
'EWT' : 6529338,
'ONG' : 88312544,
'REEF' : 103613390,
'STRAX' : 65150924,
'BAND' : 89649395,
'REP' : 71589281,
'PROM' : 68111830,
'NKN' : 41917236,
'ELF' : 683526617,
'CTSI' : 60246864,
'GT' : 15829457,
'ORBS' : 60204447,
'CELR' : 86625462,
'PAXG' : 14996337,
'COTI' : 91239751,
'FUN' : 30221572,
'WOO' : 49406162,
'OXT' : 68361004,
'HIVE' : 197313458,
'TOMO' : 45119262,
'ANT' : 117975303,
'ASD' : 3886023,
'CFX' : 30348262,
'UOS' : 6536652,
'STEEM' : 63376169,
'MAID' : 973768,
'MTL' : 302245952,
'MVL' : 41494831,
'BTCST' : 15719874,
'SLP' : 225187118,
'XDB' : 3574782,
'REQ' : 35960737,
'BADGER' : 22053861,
'DODO' : 114075829,
'ARK' : 73048105,
'NU' : 70622083,
'BAL' : 103387452,
'ONE' : 660440636,
'UTK' : 20782826,
'PHA' : 53884248,
'BORA' : 78623228,
'WAN' : 22200307,
'YFII' : 107369617,
'GUSD' : 11841308,
'HEX' : 98925246,
'BCHA' : 1507723315,
'XEC' : 576339975,
'STETH' : 174095207,
'WBNB' : 1321076714,
'CTC' : 11269882,
'HBTC' : 15068433,
'CCXX' : 4815003,
'TTT' : 1411769,
'SAFEMOON' : 13823710,
'EGR' : 975383,
'YOUC' : 195775,
'INO' : 2797,
'NXM' : 32198,
'DFI' : 4331774,
'XWC' : 29093450,
'C98' : 249440697,
'RAY' : 306784429,
'XYM' : 3747622,
'OMI' : 9648268,
'LUSD' : 2278372,
'YGG' : 57851490,
'ARRR' : 1868475,
'PUNDIX' : 99219856,
'ORC' : 21565863,
'XCH' : 53210392,
'KNC' : 81707398,
'AGLD' : 262468737,
'XPRT' : 1382288,
'TWT' : 154538562,
'BEST' : 180090,
'ILV' : 33113840,
'TITAN' : 18354081,
'ANC' : 11502255,
'HEDG' : 61010,
'TRIBE' : 31240225,
'MNGO' : 7926111,
'ZLW' : 1181234,
'DAWN' : 80998789,
'MBOX' : 127450921,
'BIT' : 14273478,
'MIR' : 50615498,
'FRAX' : 5375371,
'TLM' : 180243207,
'TKO' : 65968720,
'ACH' : 124263089,
'AKT' : 1957819,
'PEAK' : 1301851,
'ALBT' : 9360503,
'EPS' : 86358518,
'ORN' : 20780382,
'FIDA' : 1613766,
'SUSD' : 13126658,
'KEEP' : 67521919,
'KOK' : 4701856,
'BFC' : 43886917,
'ETN' : 828556,
'DDX' : 3968610,
'LINA' : 42506714,
'ATA' : 102362953,
'RAD' : 49071274,
'LYXe' : 3929714,
'DRS' : 5437860,
'KSP' : 26066368,
'TLOS' : 5584948,
'CLV' : 65237048,
'ROSE' : 241196517,
'RPL' : 2134866,
'VRA' : 66319179,
'MASK' : 137570218,
'PLA' : 97196569,
'RLY' : 32752969,
'HTR' : 7882788,
'STRK' : 35163524,
'NOIA' : 2107445,
'KLV' : 3669982,
'RNDR' : 4752880,
'SAPP' : 311927,
'JST' : 193106846,
'IQ' : 41208330,
'BANANA' : 16311206,
'DKA' : 51232542,
'C20' : 206665,
'RIF' : 4295559,
'MLN' : 25477314,
'CVX' : 18692260,
'QUICK' : 33767734,
'BTS' : 19803635,
'XYO' : 8437120,
'VLX' : 3681654,
'CSPR' : 60328621,
'ERN' : 40043600,
'MATH' : 4776067,
'POWR' : 179644052,
'CHR' : 88067774,
'SUN' : 31761149,
'META' : 47468964,
'ZKS' : 21446523,
'SOLO' : 789227,
'TVK' : 39377725,
'AVA' : 30851985,
'QKC' : 31218076,
'TPT' : 4444100,
'DYDX' : 1671276970,
  }



  var cmccirculating = {

'BTC' : 18810518,
'ETH' : 117444836,
'ADA' : 32025859375,
'BNB' : 168137036,
'USDT' : 68625377886,
'SOL' : 292840036,
'XRP' : 46585282244,
'DOGE' : 131200542911,
'USDC' : 28591923591,
'DOT' : 987579315,
'UNI' : 611643724,
'BUSD' : 12750931423,
'BCH' : 18840738,
'LINK' : 450509554,
'LTC' : 66752615,
'LUNA' : 400082818,
'ALGO' : 5223953517,
'ICP' : 158871517,
'WBTC' : 203771,
'FIL' : 103280390,
'MATIC' : 6649053883,
'AVAX' : 220286577,
'VET' : 64315576989,
'ETC' : 130037001,
'FTT' : 94346958,
'THETA' : 1000000000,
'TRX' : 71659657369,
'DAI' : 6489654521,
'XMR' : 17989234,
'EOS' : 957579152,
'NEAR' : 449669568,
'ATOM' : 221059290,
'CAKE' : 219095789,
'AAVE' : 13150245,
'CRO' : 25263013692,
'MIOTA' : 2779530283,
'AXS' : 60907500,
'FTM' : 2545006273,
'GRT' : 4715735200,
'XTZ' : 858585875,
'QNT' : 12072738,
'BTCB' : 78129,
'NEO' : 70538831,
'EGLD' : 19415950,
'KLAY' : 2502669685,
'HBAR' : 9633180078,
'BSV' : 18837183,
'MKR' : 991328,
'LEO' : 953954130,
'WAVES' : 106117438,
'KSM' : 8470098,
'BTT' : 659952625000,
'SHIB' : 394796000000000,
'UST' : 2459730842,
'HT' : 166099511,
'AMP' : 42227702186,
'COMP' : 5506108,
'STX' : 1229403200,
'DASH' : 10322263,
'RUNE' : 224410215,
'REV' : 85061485690,
'HNT' : 97355334,
'CHZ' : 5897640034,
'DCR' : 13292785,
'AR' : 33394701,
'HOT' : 172895855591,
'TFUEL' : 5301214400,
'ZEC' : 12607819,
'XEM' : 8999999999,
'XDC' : 12293566234,
'MANA' : 1795370443,
'ONE' : 10546856512,
'ENJ' : 834331121,
'SUSHI' : 127244443,
'IOST' : 18099719631,
'TUSD' : 1420263446,
'CEL' : 238863520,
'CELO' : 306819314,
'SNX' : 114841533,
'YFI' : 36635,
'QTUM' : 98681677,
'BTG' : 17513924,
'FLOW' : 57064824,
'ZIL' : 11707251874,
'OMG' : 140245398,
'MDX' : 667175245,
'RVN' : 9608065000,
'BAT' : 1490348708,
'OKB' : 60000000,
'TEL' : 54302110195,
'NEXO' : 560000011,
'ICX' : 671283485,
'BNT' : 233211447,
'KCS' : 80118638,
'SC' : 48823132992,
'ZEN' : 11498906,
'PAX' : 945642940,
'DGB' : 14651580228,
'ONT' : 875249524,
'AUDIO' : 406077610,
'ZRX' : 845341602,
'CRV' : 426748438,
'RAY' : 66881256,
'KAVA' : 91443180,
'MINA' : 210389040,
'ANKR' : 7662899378,
'NANO' : 133248297,
'CHSB' : 1000000000,
'RENBTC' : 15703,
'SAND' : 885439937,
'UMA' : 62757646,
'REN' : 997763051,
'FET' : 746113681,
'VGX' : 222295208,
'KIN' : 1518114145968,
'IOTX' : 9540779324,
'LRC' : 1320796789,
'PROM' : 16450000,
'GLM' : 1000000000,
'1INCH' : 180362122,
'SXP' : 187368789,
'RSR' : 13159999000,
'WAXP' : 1750331748,
'DENT' : 99007791203,
'LSK' : 128901463,
'ERG' : 32012428,
'POLY' : 624946939,
'OCEAN' : 613099141,
'USDN' : 469099340,
'STORJ' : 319778209,
'PERP' : 59018750,
'ALPHA' : 406330126,
'HUSD' : 458164638,
'ELF' : 544480200,
'SRM' : 50000000,
'MED' : 5382401140,
'UBT' : 149999999,
'SKL' : 1213100288,
'BCD' : 186492898,
'CKB' : 27743688728,
'NMR' : 10198144,
'XVG' : 16477279192,
'FEI' : 414940114,
'AGIX' : 867132939,
'WIN' : 766299999999,
'VTHO' : 39743245612,
'LPT' : 21164655,
'WRX' : 317591918,
'BAKE' : 193529499,
'INJ' : 32655553,
'GNO' : 1504587,
'ROSE' : 1500000000,
'GT' : 76203924,
'DAG' : 1266911931,
'CVC' : 670000000,
'ARDR' : 998999495,
'SNT' : 3470483788,
'XVS' : 11090577,
'STMX' : 10000000000,
'OGN' : 351815555,
'EWT' : 30062138,
'HIVE' : 394888373,
'STRAX' : 135154610,
'CELR' : 5748480630,
'XDB' : 777009768,
'RLC' : 80070793,
'ALICE' : 23000000,
'ONG' : 258990559,
'PAXG' : 172101,
'REEF' : 13709721016,
'VLX' : 2124380663,
'BAND' : 35191821,
'ORBS' : 2229950518,
'REP' : 11000000,
'NKN' : 700000000,
'ASD' : 660615274,
'CFX' : 997358172,
'CTSI' : 408197415,
'WOO' : 509393840,
'COTI' : 868672118,
'OXT' : 690690084,
'FUN' : 10899873621,
'XYO' : 12844821266,
'PHA' : 272000000,
'STEEM' : 385783650,
'REQ' : 999881816,
'MVL' : 13226547042,
'MTL' : 65588845,
'NU' : 672000000,
'MAID' : 452552412,
'UOS' : 282786730,
'BTCST' : 11417110,
'ARK' : 131675511,
'ANT' : 39609523,
'SLP' : 2145135756,
'TOMO' : 84087050,
'AVA' : 51250587,
'BADGER' : 10116031,
'MLN' : 1792738,
'BAL' : 6943831,
'HEX' : 173411074413,
'BCHA' : 18572921,
'XEC' : 18837754673313,
'STETH' : 1138927,
'WBNB' : 6805536,
'CTC' : 564970555,
'CCXX' : 17841133,
'HBTC' : 39906,
'TTT' : 104766050,
'EGR' : 65160356358,
'SAFEMOON' : 585536366402812,
'YOUC' : 6696709142,
'NXM' : 6621938,
'INO' : 180003180,
'DFI' : 300511840,
'XWC' : 739941749,
'XYM' : 5492695859,
'vBNB' : 84327095,
'C98' : 185000000,
'DYDX' : 55679060,
'OMI' : 166285821196,
'ARRR' : 186661341,
'ORC' : 550161723,
'TWT' : 346951186,
'PUNDIX' : 258491637,
'YGG' : 67907005,
'MNGO' : 1000000000,
'FIDA' : 44908948,
'XCH' : 1582223,
'TITAN' : 53404160,
'IDEX' : 590919396,
'HEDG' : 348731468,
'XPRT' : 39963068,
'BEST' : 378373406,
'ATLAS' : 2160000000,
'ZLW' : 72321064,
'ANC' : 111867639,
'FRAX' : 315065811,
'ILV' : 634834,
'TRIBE' : 453448622,
'KNC' : 173660279,
'BIT' : 231500975,
'PEAK' : 624743639,
'AKT' : 77645116,
'MIR' : 77742680,
'MBOX' : 49493115,
'SUSD' : 265778750,
'ACH' : 3157787878,
'KOK' : 107333422,
'KEEP' : 576825556,
'DAWN' : 70453175,
'POLIS' : 21600000,
'TLOS' : 270123444,
'CVX' : 21376501,
'ORN' : 30095000,
'BFC' : 844434685,
'ALBT' : 232955783,
'ETN' : 17894120389,
'EPS' : 335480066,
'TKO' : 108500000,
'LYXe' : 14945916,
'TLM' : 914030370,
'RNDR' : 157153487,
'DDX' : 26094664,
'RPL' : 10279742,
'AGLD' : 70170001,
'RAD' : 19436288,
'vBTC' : 205836,
'BANANA' : 56299799,
'SAPP' : 537572916,
'LINA' : 4003665123,
'PLA' : 181976702,
'C20' : 40001329,
'WAN' : 193585400,
'NOIA' : 479446793,
'RLY' : 248558803,
'UTK' : 450000000,
'ATA' : 172252000,
'STRK' : 2969267,
'SYS' : 618776857,
'BORA' : 853244247,
'JST' : 2260326706,
'MATH' : 114356164,
'GUSD' : 181385719,
'YFII' : 38596,
'HTR' : 180833876,
'RIF' : 764340008,
'IQ' : 10021320430,
'SOLO' : 200001808,
'POWR' : 457585997,
'CSPR' : 1431375808,
'DKA' : 1017709366,
'NWC' : 150400834,
'CLV' : 128777778,
'ALT' : 60000000,
'PAC' : 15379392609,
'DODO' : 110551965,
'KAI' : 2719300000,
'QUICK' : 327100,
'MCO' : 15793831,

  }



  var weekTable = {  // api works without these numbers now

'BTC' : 47134.0334,
'ETH' : 3479.3793,
'ADA' : 2.4521,
'BNB' : 426.7684,
'USDT' : 1.0013,
'XRP' : 1.146,
'SOL' : 184.7298,
'DOT' : 29.2414,
'DOGE' : 0.262,
'USDC' : 1.0001,
'UNI' : 24.3579,
'LUNA' : 27.371,
'LINK' : 28.8239,
'BUSD' : 1.0002,
'LTC' : 184.5309,
'BCH' : 679.9583,
'AVAX' : 38.635,
'ALGO' : 1.2471,
'WBTC' : 47041.197,
'ICP' : 63.8013,
'MATIC' : 1.3406,
'FIL' : 85.3144,
'TRX' : 0.0865,
'FTT' : 70.5645,
'ATOM' : 21.2842,
'XLM' : 0.3359,
'VET' : 0.1258,
'ETC' : 59.4874,
'DAI' : 1.0008,
'THETA' : 7.2089,
'XTZ' : 4.5075,
'EGLD' : 155.4089,
'AAVE' : 343.2362,
'XMR' : 262.5182,
'CAKE' : 21.5341,
'EOS' : 4.9368,
'CRO' : 0.1703,
'QNT' : 330.3935,
'HBAR' : 0.2761,
'XEC' : 0.0002,
'MIOTA' : 1.5355,
'NEAR' : 6.6029,
'GRT' : 0.8383,
'AXS' : 69.6154,
'BTCB' : 47154.4841,
'NEO' : 51.5295,
'KSM' : 334.1262,
'KLAY' : 1.4542,
'FTM' : 1.6721,
'WAVES' : 25.3024,
'BSV' : 160.8504,
'LEO' : 2.8868,
'MKR' : 3164.7168,
'BTT' : 0.0041,
'SHIB' : 0.0000062,
'UST' : 1.0024,
'HT' : 14.5566,
'COMP' : 418.4222,
'AMP' : 0.0539,
'DASH' : 210.4929,
'RUNE' : 9.1667,
'HNT' : 19.7028,
'CHZ' : 0.3612,
'STX' : 1.3668,
'AR' : 49.9583,
'DCR' : 152.5645,
'ONE' : 0.2349,
'HOT' : 0.0103,
'REV' : 0.0251,
'TFUEL' : 0.3534,
'ZEC' : 139.0952,
'XEM' : 0.1914,
'SUSHI' : 11.4388,
'XDC' : 0.132,
'CELO' : 4.2662,
'SNX' : 10.9316,
'MANA' : 0.8516,
'MINA' : 3.744,
'TUSD' : 1.0003,
'ENJ' : 1.7892,
'ICX' : 1.4096,
'IOST' : 0.0561,
'CEL' : 6.0138,
'QTUM' : 12.7522,
'YFI' : 35780.6225,
'OMG' : 7.8609,
'FLOW' : 22.3102,
'ZIL' : 0.1066,
'BTG' : 70.7001,
'BAT' : 0.8056,
'MDX' : 1.6436,
'RVN' : 0.118,
'CRV' : 2.0237,
'OKB' : 19.4703,
'TEL' : 0.0206,
'PERP' : 19.8532,
'KCS' : 11.7349,
'ZEN' : 85.208,
'BNT' : 4.158,
'USDP' : 0.9967,
'RAY' : 12.183,
'SC' : 0.02,
'NEXO' : 1.6722,
'AUDIO' : 2.2188,
'ONT' : 1.0327,
'ZRX' : 1.0415,
'DGB' : 0.0619,
'UMA' : 11.3479,
'NANO' : 5.9428,
'ANKR' : 0.1002,
'REN' : 0.6953,
'RENBTC' : 46963.7185,
'CHSB' : 0.7392,
'SAND' : 0.7601,
'FET' : 0.9224,
'LRC' : 0.4234,
'IOTX' : 0.0634,
'VGX' : 3.0796,
'KAVA' : 6.2809,
'ERG' : 14.5763,
'XYO' : 0.0166,
'SKL' : 0.3607,
'1INCH' : 3.0031,
'CELR' : 0.0489,
'SRM' : 8.6521,
'GLM' : 0.5308,
'USDN' : 0.9931,
'SXP' : 3.3158,
'WAXP' : 0.2862,
'RSR' : 0.0412,
'OCEAN' : 0.7938,
'UBT' : 2.9914,
'HUSD' : 1.0002,
'DENT' : 0.0055,
'ALPHA' : 1.141,
'CKB' : 0.0151,
'LSK' : 3.8102,
'POLY' : 0.7558,
'XDB' : 0.3408,
'NMR' : 42.5166,
'STORJ' : 1.457,
'FEI' : 0.9852,
'GNO' : 262.57,
'WIN' : 0.0006,
'BCD' : 2.3966,
'VTHO' : 0.0106,
'XVG' : 0.0268,
'AGIX' : 0.4779,
'ELF' : 0.7863,
'BAKE' : 2.2514,
'LPT' : 19.2631,
'MED' : 0.078,
'GT' : 5.1992,
'WRX' : 1.3231,
'XVS' : 34.1884,
'ROSE' : 0.2903,
'INJ' : 12.6815,
'DAG' : 0.2771,
'STRAX' : 2.4338,
'OGN' : 1.0526,
'ARDR' : 0.3402,
'STMX' : 0.0352,
'CVC' : 0.5155,
'REEF' : 0.0232,
'EWT' : 11.3712,
'SNT' : 0.0993,
'ASD' : 0.4248,
'BAND' : 8.7529,
'RLC' : 4.2829,
'PAXG' : 1795.1385,
'ORBS' : 0.1348,
'VLX' : 0.1506,
'PROM' : 19.2109,
'HIVE' : 0.78,
'ONG' : 1.1275,
'REP' : 27.0077,
'WOO' : 0.5446,
'ALICE' : 14.216,
'COTI' : 0.2914,
'NKN' : 0.4142,
'MAID' : 0.5046,
'CTSI' : 0.717,
'OXT' : 0.3779,
'CFX' : 0.2817,
'CSPR' : 0.1155,
'FUN' : 0.025,
'ANT' : 5.9124,
'STEEM' : 0.6432,
'PHA' : 0.8665,
'NOIA' : 0.3925,
'ARK' : 1.6199,
'BTCST' : 20.2635,
'UOS' : 0.7966,
'REQ' : 0.2166,
'MTL' : 3.3559,
'NU' : 0.3465,
'MVL' : 0.0169,
'JST' : 0.0775,
'BADGER' : 19.9222,
'TOMO' : 3.1357,
'HEX' : 0.3649,
'BCHA' : 268.7724,
'STETH' : 3623.5703,
'WBNB' : 422.7937,
'CTC' : 3.6506,
'HBTC' : 47219.9488,
'CCXX' : 102.6452,
'TTT' : 12.8455,
'EGR' : 0.0184,
'YOUC' : 0.1332,
'SAFEMOON' : 0.0000018,
'NXM' : 133.1075,
'INO' : 5.2451,
'DFI' : 2.756,
'XWC' : 0.9656,
'XYM' : 0.1373,
'LUSD' : 1.0064,
'C98' : 3.5869,
'vBNB' : 8.7732,
'MOVR' : 163.3133,
'DYDX' : 11.799,
'OMI' : 0.004,
'ARRR' : 2.6456,
'ANC' : 2.7412,
'TWT' : 1.2704,
'XPRT' : 8.5062,
'SDN' : 4.5538,
'AKT' : 3.4293,
'YGG' : 6.1769,
'ETN' : 0.0134,
'PUNDIX' : 1.7251,
'ORC' : 0.8528,
'MNGO' : 0.3824,
'BIT' : 1.2731,
'TITAN' : 6.4039,
'GALA' : 0.0229,
'XCH' : 221.821,
'FRAX' : 1.0058,
'IDEX' : 0.6355,
'KNC' : 1.8403,
'HEDG' : 0.9536,
'RPL' : 18.7447,
'FIDA' : 7.4922,
'ILV' : 473.4334,
'BEST' : 0.8885,
'ZLW' : 4.5933,
'TRIBE' : 0.6483,
'ATLAS' : 0.1474,
'MIR' : 3.6942,
'MBOX' : 5.3116,
'KOK' : 2.4623,
'ORN' : 8.7737,
'LYXe' : 15.2339,
'LGCY' : 0.0081,
'PEAK' : 0.4179,
'BFC' : 0.2913,
'DAWN' : 3.7567,
'SUSD' : 0.992,
'KEEP' : 0.4627,
'ALT' : 2.7172,
'ACH' : 0.0872,
'ALBT' : 1.063,
'KDA' : 0.9279,
'TKO' : 2.2991,
'CVX' : 10.5503,
'PLA' : 1.0081,
'EPS' : 0.7254,
'ATA' : 1.1372,
'TLOS' : 0.7735,
'POLIS' : 10.1422,
'RLY' : 0.7371,
'MLN' : 99.3249,
'DVPN' : 0.0259,
'SOLO' : 0.9122,
'vBTC' : 950.3864,
'LINA' : 0.05,
'DERO' : 12.0439,
'SLIM' : 3.6086,
'RNDR' : 1.0871,
'SAPP' : 0.353,
'RAD' : 10.5142,
'AVA' : 4.0619,
'C20' : 4.8867,
'CLV' : 1.3515,
'TLM' : 0.2558,
'GUSD' : 1.0054,
'POWR' : 0.3765,
'BAL' : 26.6806,
'MASK' : 9.3357,
'PAC' : 0.0135,
'WAN' : 1.0386,
'STRK' : 59.2525,
'SUN' : 0.0317,
'DDX' : 7.9994,
'RIF' : 0.2395,
'SYS' : 0.3034,
'YFII' : 4556.6361,
'BANANA' : 3.0159,
'SLP' : 0.1034,
'MATH' : 1.6428,
'DYDX' : 12.32,

}



  var monthTable = {  // api works without these numbers now

'BTC' : 46077.3503,
'ETH' : 3153.9075,
'ADA' : 2.106,
'BNB' : 403.8628,
'USDT' : 1.0012,
'XRP' : 1.2562,
'SOL' : 48.0489,
'DOT' : 22.0938,
'DOGE' : 0.3034,
'USDC' : 1.0005,
'UNI' : 28.7765,
'LUNA' : 17.012,
'LINK' : 26.2578,
'BUSD' : 1.0006,
'LTC' : 180.6951,
'BCH' : 687.0097,
'AVAX' : 17.5291,
'ALGO' : 0.9464,
'WBTC' : 46008.9015,
'ICP' : 60.8915,
'MATIC' : 1.4237,
'FIL' : 70.9503,
'TRX' : 0.0904,
'FTT' : 48.1545,
'ATOM' : 15.1832,
'XLM' : 0.3803,
'VET' : 0.1325,
'ETC' : 73.9115,
'DAI' : 1.001,
'THETA' : 7.0503,
'XTZ' : 3.6212,
'EGLD' : 133.1548,
'AAVE' : 400.4661,
'XMR' : 265.0151,
'CAKE' : 20.3767,
'EOS' : 5.2876,
'CRO' : 0.149,
'QNT' : 149.3804,
'HBAR' : 0.2443,
'XEC' : 0.0001,
'MIOTA' : 1.1261,
'NEAR' : 3.1491,
'GRT' : 0.87,
'AXS' : 65.0957,
'BTCB' : 46247.0251,
'NEO' : 54.2713,
'KSM' : 265.2462,
'KLAY' : 1.7629,
'FTM' : 0.3298,
'WAVES' : 24.4852,
'BSV' : 169.5695,
'LEO' : 2.9756,
'MKR' : 3673.8513,
'BTT' : 0.0047,
'SHIB' : 0.000008,
'UST' : 1.0026,
'HT' : 13.0394,
'COMP' : 468.8567,
'AMP' : 0.0602,
'DASH' : 207.1814,
'RUNE' : 8.1627,
'HNT' : 17.6213,
'CHZ' : 0.3624,
'STX' : 1.3869,
'AR' : 15.9154,
'DCR' : 168.6871,
'ONE' : 0.18,
'HOT' : 0.0115,
'REV' : 0.0115,
'TFUEL' : 0.3359,
'ZEC' : 142.8073,
'XEM' : 0.2079,
'SUSHI' : 11.8794,
'XDC' : 0.1301,
'CELO' : 3.0878,
'SNX' : 12.3283,
'MANA' : 0.8145,
'MINA' : 2.9154,
'TUSD' : 1.0004,
'ENJ' : 1.6168,
'ICX' : 1.2298,
'IOST' : 0.0317,
'CEL' : 6.0397,
'QTUM' : 13.3592,
'YFI' : 38230.7537,
'OMG' : 5.4534,
'FLOW' : 22.5008,
'ZIL' : 0.1081,
'BTG' : 69.5255,
'BAT' : 0.7822,
'MDX' : 1.3681,
'RVN' : 0.1438,
'CRV' : 2.1345,
'OKB' : 22.0755,
'TEL' : 0.0195,
'PERP' : 13.6924,
'KCS' : 11.4383,
'ZEN' : 69.5837,
'BNT' : 4.1121,
'USDP' : 1.0004,
'RAY' : 5.0318,
'SC' : 0.0187,
'NEXO' : 1.9667,
'AUDIO' : 1.5852,
'ONT' : 1.0613,
'ZRX' : 1.0273,
'DGB' : 0.0668,
'UMA' : 11.8371,
'NANO' : 6.2709,
'ANKR' : 0.1043,
'REN' : 0.5003,
'RENBTC' : 45983.3022,
'CHSB' : 0.7481,
'SAND' : 0.6344,
'FET' : 0.4923,
'LRC' : 0.3204,
'IOTX' : 0.0833,
'VGX' : 4.1188,
'KAVA' : 6.5893,
'ERG' : 11.5911,
'XYO' : 0.0106,
'SKL' : 0.3348,
'1INCH' : 2.9513,
'CELR' : 0.0478,
'SRM' : 5.6016,
'GLM' : 0.4251,
'USDN' : 0.9996,
'SXP' : 3.3761,
'WAXP' : 0.1872,
'RSR' : 0.0403,
'OCEAN' : 0.7,
'UBT' : 1.9086,
'HUSD' : 1.0008,
'DENT' : 0.0077,
'ALPHA' : 0.9742,
'CKB' : 0.0145,
'LSK' : 4.2781,
'POLY' : 0.308,
'XDB' : 0.1899,
'NMR' : 41.4313,
'STORJ' : 1.2729,
'FEI' : 0.9994,
'GNO' : 204.4101,
'WIN' : 0.0007,
'BCD' : 2.8931,
'VTHO' : 0.0147,
'XVG' : 0.0334,
'AGIX' : 0.2719,
'ELF' : 0.2804,
'BAKE' : 2.6025,
'LPT' : 19.5071,
'MED' : 0.0826,
'GT' : 4.5514,
'WRX' : 1.4709,
'XVS' : 36.925,
'ROSE' : 0.0943,
'INJ' : 9.2288,
'DAG' : 0.2601,
'STRAX' : 2.2316,
'OGN' : 1.0422,
'ARDR' : 0.2749,
'STMX' : 0.029,
'CVC' : 0.3312,
'REEF' : 0.0217,
'EWT' : 9.6476,
'SNT' : 0.1006,
'ASD' : 0.4346,
'BAND' : 7.936,
'RLC' : 4.0188,
'PAXG' : 1776.1961,
'ORBS' : 0.098,
'VLX' : 0.0469,
'PROM' : 19.4493,
'HIVE' : 0.4705,
'ONG' : 0.9025,
'REP' : 27.5366,
'WOO' : 0.8136,
'ALICE' : 13.3956,
'COTI' : 0.2136,
'NKN' : 0.407,
'MAID' : 0.572,
'CTSI' : 0.7909,
'OXT' : 0.3812,
'CFX' : 0.3664,
'CSPR' : 0.1258,
'FUN' : 0.0225,
'ANT' : 4.9246,
'STEEM' : 0.5845,
'PHA' : 0.8597,
'NOIA' : 0.2931,
'ARK' : 1.3066,
'BTCST' : 24.3035,
'UOS' : 0.7316,
'REQ' : 0.2411,
'MTL' : 3.0815,
'NU' : 0.3005,
'MVL' : 0.0171,
'JST' : 0.0701,
'BADGER' : 26.5042,
'TOMO' : 2.988,
'HEX' : 0.1693,
'BCHA' : 56.3624,
'STETH' : 3261.6762,
'WBNB' : 403.7047,
'CTC' : 3.0042,
'HBTC' : 46264.5925,
'CCXX' : 103.0208,
'TTT' : 12.524,
'EGR' : 0.0192,
'YOUC' : 0.1757,
'SAFEMOON' : 0.000002,
'NXM' : 120.5343,
'INO' : 6.5415,
'DFI' : 2.858,
'XWC' : 0.9507,
'XYM' : 0.162,
'LUSD' : 1.0143,
'C98' : 1.4492,
'vBNB' : 8.2817,
'MOVR' : 449.0989,
'DYDX' : 11.799,
'OMI' : 0.0026,
'ARRR' : 4.1433,
'ANC' : 2.4701,
'TWT' : 0.6917,
'XPRT' : 6.5067,
'SDN' : 7.5462,
'AKT' : 2.7398,
'YGG' : 6.4893,
'ETN' : 0.0188,
'PUNDIX' : 1.7775,
'ORC' : 1.1468,
'MNGO' : 0.2021,
'BIT' : 1.5716,
'TITAN' : 7.6028,
'GALA' : 0.018,
'XCH' : 260.0929,
'FRAX' : 1.0002,
'IDEX' : 0.0653,
'KNC' : 1.9297,
'HEDG' : 0.99,
'RPL' : 18.9275,
'FIDA' : 2.6258,
'ILV' : 497.2103,
'BEST' : 1.057,
'ZLW' : 6.7697,
'TRIBE' : 0.6792,
'ATLAS' : 0.1316,
'MIR' : 3.8727,
'MBOX' : 1.9381,
'KOK' : 2.3195,
'ORN' : 8.4417,
'LYXe' : 12.0496,
'LGCY' : 0.0053,
'PEAK' : 0.2895,
'BFC' : 0.193,
'DAWN' : 3.8326,
'SUSD' : 0.9969,
'KEEP' : 0.3802,
'ALT' : 0.8879,
'ACH' : 0.0846,
'ALBT' : 0.5446,
'KDA' : 0.6171,
'TKO' : 1.9678,
'CVX' : 6.5705,
'PLA' : 0.9247,
'EPS' : 0.7909,
'ATA' : 0.5824,
'TLOS' : 0.1991,
'POLIS' : 9.3747,
'RLY' : 0.5612,
'MLN' : 94.4422,
'DVPN' : 0.0199,
'SOLO' : 1.0452,
'vBTC' : 931.5592,
'LINA' : 0.057,
'DERO' : 13.392,
'SLIM' : 0.3972,
'RNDR' : 0.9611,
'SAPP' : 0.3528,
'RAD' : 8.1023,
'AVA' : 2.6512,
'C20' : 3.9072,
'CLV' : 1.5037,
'TLM' : 0.3158,
'GUSD' : 0.9962,
'POWR' : 0.3246,
'BAL' : 27.2055,
'MASK' : 6.6613,
'PAC' : 0.0064,
'WAN' : 0.8768,
'STRK' : 54.6179,
'SUN' : 0.0393,
'DDX' : 4.5656,
'RIF' : 0.2372,
'SYS' : 0.2066,
'YFII' : 4229.4508,
'BANANA' : 3.1267,
'SLP' : 0.174,
'MATH' : 1.1967,
'DYDX' : 12.32,


}

  var quarterTable = {  // api works without these numbers now

'BTC' : 39254.6681,
'ETH' : 2442.8722,
'ADA' : 1.5202,
'BNB' : 352.3654,
'USDT' : 1.0002,
'XRP' : 0.8388,
'SOL' : 40.678,
'DOT' : 23.5964,
'DOGE' : 0.3128,
'USDC' : 1.0002,
'UNI' : 22.3798,
'LUNA' : 6.1783,
'LINK' : 23.7467,
'BUSD' : 1.0002,
'LTC' : 168.4205,
'BCH' : 604.4019,
'AVAX' : 14.3983,
'ALGO' : 1.0232,
'WBTC' : 39174.9963,
'ICP' : 57.0634,
'MATIC' : 1.5212,
'FIL' : 69.9661,
'TRX' : 0.0703,
'FTT' : 32.4881,
'ATOM' : 12.7423,
'XLM' : 0.324,
'VET' : 0.1082,
'ETC' : 56.2189,
'DAI' : 1.0004,
'THETA' : 8.8261,
'XTZ' : 3.1977,
'EGLD' : 86.8585,
'AAVE' : 298.7046,
'XMR' : 275.1888,
'CAKE' : 16.1802,
'EOS' : 4.9589,
'CRO' : 0.1182,
'QNT' : 76.813,
'HBAR' : 0.2023,
'XEC' : 0.0002,
'MIOTA' : 1.0908,
'NEAR' : 3.0522,
'GRT' : 0.7041,
'AXS' : 4.3103,
'BTCB' : 39263.0605,
'NEO' : 48.5947,
'KSM' : 369.0389,
'KLAY' : 1.1546,
'FTM' : 0.2808,
'WAVES' : 17.1668,
'BSV' : 163.9727,
'LEO' : 2.5389,
'MKR' : 3017.2532,
'BTT' : 0.0034,
'SHIB' : 0.000009,
'UST' : 0.9996,
'HT' : 13.5253,
'COMP' : 314.3221,
'AMP' : 0.1187,
'DASH' : 169.1058,
'RUNE' : 9.2229,
'HNT' : 13.3541,
'CHZ' : 0.3363,
'STX' : 0.9129,
'AR' : 15.0858,
'DCR' : 132.8462,
'ONE' : 0.072,
'HOT' : 0.0078,
'REV' : 0.0112,
'TFUEL' : 0.4938,
'ZEC' : 140.3331,
'XEM' : 0.1683,
'SUSHI' : 8.5184,
'XDC' : 0.0517,
'CELO' : 2.4351,
'SNX' : 9.1786,
'MANA' : 0.7167,
'MINA' : 2.4596,
'TUSD' : 1.0002,
'ENJ' : 1.4531,
'ICX' : 1.0284,
'IOST' : 0.0279,
'CEL' : 6.6719,
'QTUM' : 8.8575,
'YFI' : 37239.9434,
'OMG' : 5.2262,
'FLOW' : 11.9959,
'ZIL' : 0.1069,
'BTG' : 56.3445,
'BAT' : 0.6729,
'MDX' : 1.9593,
'RVN' : 0.073,
'CRV' : 2.1474,
'OKB' : 13.7171,
'TEL' : 0.0316,
'PERP' : 8.0747,
'KCS' : 8.8206,
'ZEN' : 88.3028,
'BNT' : 3.9035,
'USDP' : 1.0002,
'RAY' : 4.1182,
'SC' : 0.0154,
'NEXO' : 1.799,
'AUDIO' : 1.0505,
'ONT' : 0.9224,
'ZRX' : 0.8851,
'DGB' : 0.0552,
'UMA' : 12.3797,
'NANO' : 6.23,
'ANKR' : 0.0822,
'REN' : 0.4431,
'RENBTC' : 39145.2809,
'CHSB' : 0.6806,
'SAND' : 0.2736,
'FET' : 0.2933,
'LRC' : 0.2969,
'IOTX' : 0.0229,
'VGX' : 2.4723,
'KAVA' : 4.31,
'ERG' : 9.0262,
'XYO' : 0.006,
'SKL' : 0.2949,
'1INCH' : 3.6609,
'CELR' : 0.038,
'SRM' : 4.2871,
'GLM' : 0.2883,
'USDN' : 1.0016,
'SXP' : 2.3076,
'WAXP' : 0.148,
'RSR' : 0.0309,
'OCEAN' : 0.5477,
'UBT' : 1.2439,
'HUSD' : 1.0001,
'DENT' : 0.0035,
'ALPHA' : 0.6147,
'CKB' : 0.0173,
'LSK' : 2.9091,
'POLY' : 0.2056,
'XDB' : 0.0359,
'NMR' : 39.1339,
'STORJ' : 0.9291,
'FEI' : 0.9991,
'GNO' : 188.113,
'WIN' : 0.0005,
'BCD' : 2.8371,
'VTHO' : 0.0078,
'XVG' : 0.0283,
'AGIX' : 0.2111,
'ELF' : 0.2105,
'BAKE' : 3.049,
'LPT' : 26.1268,
'MED' : 0.0464,
'GT' : 3.9118,
'WRX' : 1.5596,
'XVS' : 28.4058,
'ROSE' : 0.0736,
'INJ' : 7.8963,
'DAG' : 0.0413,
'STRAX' : 1.2796,
'OGN' : 0.9691,
'ARDR' : 0.1677,
'STMX' : 0.0211,
'CVC' : 0.2619,
'REEF' : 0.0213,
'EWT' : 7.2624,
'SNT' : 0.073,
'ASD' : 0.4212,
'BAND' : 7.005,
'RLC' : 3.8885,
'PAXG' : 1862.2341,
'ORBS' : 0.0697,
'VLX' : 0.062,
'PROM' : 12.9659,
'HIVE' : 0.3477,
'ONG' : 0.8219,
'REP' : 18.8554,
'WOO' : 0.9086,
'ALICE' : 5.3709,
'COTI' : 0.203,
'NKN' : 0.295,
'MAID' : 0.7474,
'CTSI' : 0.5616,
'OXT' : 0.3206,
'CFX' : 0.3201,
'CSPR' : 0.2545,
'FUN' : 0.0207,
'ANT' : 4.493,
'STEEM' : 0.4111,
'PHA' : 0.9018,
'NOIA' : 0.2073,
'ARK' : 1.0818,
'BTCST' : 29.2521,
'UOS' : 0.4766,
'REQ' : 0.0684,
'MTL' : 2.1065,
'NU' : 0.2851,
'MVL' : 0.013,
'JST' : 0.0608,
'BADGER' : 13.4254,
'TOMO' : 1.8639,
'HEX' : 0.0747,
'BCHA' : 20.7386,
'STETH' : 2437.5714,
'WBNB' : 354.4908,
'CTC' : 3.2914,
'HBTC' : 39097.0223,
'CCXX' : 102.3162,
'TTT' : 16.2052,
'EGR' : 0.0893,
'YOUC' : 0.0652,
'SAFEMOON' : 0.0000043,
'NXM' : 93.4792,
'INO' : 3.1551,
'DFI' : 3.1326,
'XWC' : 1.133,
'XYM' : 0.1791,
'LUSD' : 1.0044,
'C98' : 3.8357,
'vBNB' : 7.1722,
'MOVR' : 449.0989,
'DYDX' : 11.799,
'OMI' : 0.002,
'ARRR' : 4.1138,
'ANC' : 2.7014,
'TWT' : 0.3604,
'XPRT' : 10.32,
'SDN' : 7.5462,
'AKT' : 3.0392,
'YGG' : 6.0294,
'ETN' : 0.0075,
'PUNDIX' : 1.2822,
'ORC' : 1.0578,
'MNGO' : 0.3848,
'BIT' : 1.5716,
'TITAN' : 4.21,
'GALA' : 0.0101,
'XCH' : 412.1425,
'FRAX' : 1.0021,
'IDEX' : 0.0517,
'KNC' : 1.8277,
'HEDG' : 1.2647,
'RPL' : 11.4562,
'FIDA' : 2.1469,
'ILV' : 50.6702,
'BEST' : 1.3334,
'ZLW' : 6.0057,
'TRIBE' : 0.7284,
'ATLAS' : 0.1316,
'MIR' : 3.8763,
'MBOX' : 0.8929,
'KOK' : 1.2223,
'ORN' : 9.5999,
'LYXe' : 6.4381,
'LGCY' : 0.0029,
'PEAK' : 0.3243,
'BFC' : 0.059,
'DAWN' : 2.6423,
'SUSD' : 1.0071,
'KEEP' : 0.5236,
'ALT' : 3.996,
'ACH' : 0.0033,
'ALBT' : 0.2613,
'KDA' : 0.4939,
'TKO' : 1.849,
'CVX' : 5.1398,
'PLA' : 0.1803,
'EPS' : 0.6371,
'ATA' : 0.9202,
'TLOS' : 0.2127,
'POLIS' : 9.3747,
'RLY' : 0.6129,
'MLN' : 87.5569,
'DVPN' : 0.0147,
'SOLO' : 1.1364,
'vBTC' : 789.9545,
'LINA' : 0.0343,
'DERO' : 4.2928,
'SLIM' : 0.6377,
'RNDR' : 0.5041,
'SAPP' : 0.243,
'RAD' : 6.3568,
'AVA' : 3.2606,
'C20' : 3.3931,
'CLV' : 1.477,
'TLM' : 0.1406,
'GUSD' : 1.0039,
'POWR' : 0.1974,
'BAL' : 23.1095,
'MASK' : 4.8762,
'PAC' : 0.007,
'WAN' : 0.7445,
'STRK' : 45.4272,
'SUN' : 0.0361,
'DDX' : 2.2643,
'RIF' : 0.1809,
'SYS' : 0.1629,
'YFII' : 1789.5398,
'BANANA' : 1.8502,
'SLP' : 0.1318,
'MATH' : 1.3922,
'DYDX' : 12.50,

}



  // keys are symbols
  // local test
  // var urlcmcvol = 'cmclatest.json' // cmc volume pull
 // var urlcmcvol = 'https://stocktouch.s3.amazonaws.com/cmclatest.json' // volume avg 7 day pull

  // 2 alt urls for s3 json files https://stocktouch.s3.amazonaws.com/cmclatest.json and https://abxt.s3.us-east-2.amazonaws.com/cmc300_0907.json //

  // https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=b886ce71-078e-43ab-905a-16533b32e300&start=1&limit=300&convert=USD

   let latestURL = 'https://stocktouch.s3.amazonaws.com/cmclatest.json'

   // let latestURL = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?CMC_PRO_API_KEY=b886ce71-078e-43ab-905a-16533b32e300&start=1&limit=1000&convert=USD'


fetch(latestURL)
      .then(response => response.json())
      .then(data => {
        //console.log("got test url " + JSON.stringify(Object.keys(data)))

        // note you can also get lots of other stuff including coins in circ it is SUPPLY perhaps
        let allkeys = Object.keys(data.data) // 2 levels of data
        for (let i = 0; i < allkeys.length; i++) {
          let s = allkeys[i] // here s is an index not a symbol have to find symbol
          let newsym = data.data[s].symbol
          //console.log("for s = " + s + " " + JSON.stringify(data.data[s]['quote']['USD']))
          let tags = data.data[s]['tags']
          if (tags && tags.length > 0) { // like sectors defi etc
            tagstring = tags.join(' ') // turn an array of tags into a string of tags, blank separated
            if (descriptionName[newsym])
              // tack on the tag string to the end of the description if this description exists
              descriptionName[newsym] = descriptionName[newsym] + ' ' + tagstring
            else
              descriptionName[newsym] = tagstring // if no description just use the tag string itself
          }
          cmccirculating[newsym] = data.data[s]['circulating_supply']
          cmcslug[newsym] = data.data[s]['slug']
          cmcrank[newsym] = data.data[s]['cmc_rank']
          cmctag[newsym] = data.data[s]['tags']
          cmcvol[newsym] = data.data[s]['quote']['USD']['volume_24h']
          let perc7 = data.data[s]['quote']['USD']['percent_change_7d'] / 100 // go back to 0 to 1 not orig 0 to 100 range
          let perc30 = data.data[s]['quote']['USD']['percent_change_30d'] / 100 // go back to 0 to 1 not orig 0 to 100 range
          let perc90 = data.data[s]['quote']['USD']['percent_change_90d'] / 100 // go back to 0 to 1 not orig 0 to 100 range
          let pricenow = data.data[s]['quote']['USD']['price']
          let priorPrice7d = pricenow / (1 + perc7)
          let priorPrice30d = pricenow / (1 + perc30)
          let priorPrice90d = pricenow / (1 + perc90)
          console.log("weekTable len = " + Object.keys(weekTable).length + " " + newsym + " orig week ago " + weekTable[newsym] +  " new week ago " + priorPrice7d)
          weekTable[newsym] = priorPrice7d
          console.log("monthTable len = " + Object.keys(monthTable).length + " " + newsym + " orig month ago " + monthTable[newsym] +  " new month ago " + priorPrice30d)
          monthTable[newsym] = priorPrice30d
          console.log("quarterTable len = " + Object.keys(quarterTable).length + " " + newsym + " orig quarter ago " + quarterTable[newsym] +  " new quarter ago " + priorPrice90d)
          quarterTable[newsym] = priorPrice90d

        }

      })
      .catch((x) => {
        console.log("error pulling test url " + JSON.stringify(x))
      })




  var mcsupply = {

'BTC' : 18809187,
'ETH' : 117424511,
'ADA' : 32026336371,
'BNB' : 168137036,
'XRP' : 46542338341,
'SOL' : 291398003,
'DOGE' : 131183317764,
'DOT' : 987579315,
'USDC' : 27893342280,
'UNI' : 611643724,
'LINK' : 450509554,
'BCH' : 18839281,
'LTC' : 66752615,
'BUSD' : 12553977647,
'LUNA' : 400258973,
'ICP' : 157140097,
'WBTC' : 203221,
'FIL' : 102475324,
'MATIC' : 6649053883,
'AVAX' : 220110087,
'XLM' : 23659954035,
'VET' : 64315576989,
'ETC' : 129705562,
'THETA' : 1000000000,
'FTT' : 94346958,
'TRX' : 71659657369,
'DAI' : 6508513228,
'EOS' : 957451663,
'ATOM' : 220984939,
'XMR' : 17988266,
'CAKE' : 218506888,
'AAVE' : 13150245,
'ALGO' : 3523951662,
'MIOTA' : 2779530283,
'CRO' : 25263013692,
'AXS' : 60907500,
'XTZ' : 858467375,
'GRT' : 4715735200,
'FTM' : 2545006273,
'NEO' : 70538831,
'KLAY' : 2502157773,
'QNT' : 12072738,
'BSV' : 18835864,
'MKR' : 991328,
'EGLD' : 19406408,
'KSM' : 8470098,
'HBAR' : 9633180214,
'BTT' : 659952625000,
'WAVES' : 106104574,
'NEAR' : 448984780,
'LEO' : 953954130,
'SHIB' : 394796000000000,
'HT' : 166099511,
'COMP' : 5506108,
'UST' : 2454299562,
'DASH' : 10320050,
'AMP' : 42227702186,
'CHZ' : 5897640034,
'RUNE' : 224410215,
'REV' : 85061485690,
'HNT' : 97246283,
'DCR' : 13288722,
'TFUEL' : 5301214400,
'HOT' : 172794036341,
'ZEC' : 12597106,
'XEM' : 8999999999,
'STX' : 1218157932,
'AR' : 33394701,
'MANA' : 1795370743,
'XDC' : 12293215225,
'ENJ' : 834331121,
'SUSHI' : 127244443,
'ONE' : 10690000000,
'CEL' : 238863520,
'CELO' : 306819314,
'QTUM' : 98677627,
'YFI' : 36635,
'SNX' : 114841533,
'ZIL' : 11700694492,
'TUSD' : 1405534285,
'FLOW' : 57064824,
'BTG' : 17513924,
'BAT' : 1490348708,
'RVN' : 9597360000,
'OKB' : 60000000,
'PERP' : 59018750,
'OMG' : 140245398,
'TEL' : 54302110195,
'KCS' : 80118638,
'ZEN' : 11493569,
'SC' : 48817852992,
'IOST' : 18099719631,
'ICX' : 670943384,
'BNT' : 232478632,
'NEXO' : 560000011,
'DGB' : 14647244796,
'ONT' : 875249524,
'AUDIO' : 406077610,
'ZRX' : 845341602,
'CRV' : 426748438,
'PAX' : 945642940,
'NANO' : 133248297,
'ANKR' : 7662899378,
'UMA' : 62757143,
'SAND' : 885439937,
'FET' : 746113681,
'REN' : 997763051,
'IOTX' : 9540779324,
'SXP' : 187368789,
'KAVA' : 91443180,
'LRC' : 1320796789,
'DENT' : 99007791203,
'1INCH' : 180362122,
'RSR' : 13159999000,
'GLM' : 1000000000,
'WAXP' : 1749485959,
'OCEAN' : 613099141,
'LSK' : 128901463,
'STORJ' : 319742684,
'ALPHA' : 406330126,
'SKL' : 1213100288,
'BAKE' : 193529503,
'BCD' : 186492898,
'WIN' : 766299999999,
'ERG' : 32012428,
'SRM' : 50000000,
'CKB' : 27725469838,
'NMR' : 10198144,
'XVG' : 16477105292,
'VTHO' : 39687678399,
'WRX' : 317591918,
'USDN' : 468781980,
'INJ' : 32655553,
'ROSE' : 1500000000,
'HUSD' : 456111551,
'ELF' : 544480200,
'OGN' : 351815555,
'XVS' : 11079193,
'GT' : 76203924,
'CVC' : 670000000,
'STMX' : 10000000000,
'RLC' : 80070793,
'ARDR' : 998999495,
'SNT' : 3470483788,
'DAG' : 1266911931,
'EWT' : 30062138,
'STRAX' : 135107000,
'REEF' : 13709721016,
'BAND' : 35191821,
'PROM' : 16450000,
'CELR' : 5748480630,
'NKN' : 700000000,
'REP' : 11000000,
'PAXG' : 181286,
'CTSI' : 408197415,
'HIVE' : 395131505,
'ORBS' : 2229950518,
'FUN' : 10899873621,
'OXT' : 690690084,
'COTI' : 868672118,
'TOMO' : 84071138,
'STEEM' : 385336590,
'MTL' : 65588845,
'PHA' : 272000000,
'SLP' : 2145135756,
'MAID' : 452552412,
'ANT' : 39609523,
'UOS' : 282786730,
'REQ' : 999881816,
'ARK' : 131644915,
'BADGER' : 10116031,
'WAN' : 193580298,
'HEX' : 173411074413,
'NXM' : 6621938,
'DFI' : 300511840,
'XWC' : 739737809,
'OMI' : 166285821196,
'ARRR' : 186593645,
'TWT' : 346951186,
'XCH' : 1582223,
'KNC' : 173494734,
'ANC' : 111556632,
'BEST' : 378373406,
'HEDG' : 348731468,
'TRIBE' : 453448622,
'KEEP' : 576825556,
'MIR' : 77742680,
'AKT' : 77424166,
'ORN' : 30095000,
'MBOX' : 49493115,
'SUSD' : 283614964,
'TKO' : 108500000,
'ETN' : 17894120389,
'RAD' : 19436288,
'GUSD' : 218077562,
'BAL' : 6943831,
'DODO' : 110551965,
'RPL' : 10279742,
'UTK' : 450000000,
'YFII' : 38596,
'RLY' : 248558803,
'RIF' : 764340008,
'PLA' : 181976702,
'MLN' : 1792738,
'JST' : 2260326706,
'POWR' : 457585997,
'VRA' : 4470185346,
'IQ' : 10021266462,
'BTS' : 2994460000,
'DYDX' : 55679060,



  }



  var ytdTable = {

'BTC' : 29199.5079,
'ETH' : 726.9044,
'USDT' : 1.0029,
'BNB' : 37.6428,
'ADA' : 0.1745,
'XRP' : 0.2373,
'USDC' : 0.9971,
'DOGE' : 0.0057,
'DOT' : 8.2283,
'BUSD' : 1.0007,
'UNI' : 4.7279,
'BCH' : 340.3314,
'LTC' : 125.8039,
'LINK' : 11.7427,
'SOL' : 1.5146,
'WBTC' : 29350.2292,
'MATIC' : 0.0177,
'ETC' : 5.6578,
'XLM' : 0.1319,
'THETA' : 1.9527,
'DAI' : 1.0001,
'ICP' : 480.5988,
'VET' : 0.019,
'FIL' : 22.1111,
'TRX' : 0.0268,
'XMR' : 135.1932,
'LUNA' : 0.6493,
'AAVE' : 90.1466,
'EOS' : 2.6317,
'CRO' : 0.0593,
'CAKE' : 0.5742,
'AXS' : 0.6051,
'AMP' : 0.0055,
'FTT' : 5.7859,

'LEO' : 1.3958,
'ALGO' : 0.3973,
'GRT' : 0.3616,
'MKR' : 579.3322,
'ATOM' : 5.8616,
'KLAY' : 1.2333,
'BSV' : 162.1696,
'SHIB' : 0.000002726,
'MIOTA' : 0.2891,
'XTZ' : 2.0012,
'NEO' : 14.3976,
'COMP' : 145.2993,
'AVAX' : 3.6607,
'UST' : 1.0191,
'HT' : 5.1626,
'BTT' : 0.0003,
'HBAR' : 0.0323,
'TFUEL' : 0.0332,
'DCR' : 40.8975,
'EGLD' : 85.6488,
'WAVES' : 5.9761,
'KSM' : 69.3301,
'DASH' : 87.7094,
'CHZ' : 0.0208,
'XEM' : 0.2217,
'CEL' : 5.4565,
'STX' : 0.4272,
'ZEC' : 56.4598,
'TUSD' : 0.9971,
'MANA' : 0.0829,
'QNT' : 10.9314,
'ENJ' : 0.1349,
'OKB' : 9.1911,
'YFI' : 21819.7594,
'HOT' : 0.0007,
'SNX' : 8.2865,
'HNT' : 1.3597,
'TEL' : 0.0002,
'SUSHI' : 3.3367,
'XDC' : 0.004973,
'FLOW' : 7.1596,
'NEXO' : 0.5779,
'PAX' : 1.0002,
'RUNE' : 1.2825,
'NEAR' : 1.3576,
'ZIL' : 0.079,
'BAT' : 0.2034,
'BTG' : 8.4259,
'BNT' : 1.2899,
'ONE' : 0.004242,
'KCS' : 0.6882,
'CHSB' : 0.2673,

'CELO' : 1.456,
'QTUM' : 2.2588,
'DGB' : 0.0263,
'ZEN' : 11.7591,
'ONT' : 0.4485,
'HUSD' : 0.9991,
'ZRX' : 0.3728,
'SC' : 0.0034,
'CRV' : 0.6189,
'ANKR' : 0.009,
'FTM' : 0.0171,
'RVN' : 0.0129,
'REV' : 0.01165,
'ICX' : 0.448,
'NANO' : 1.0299,
'BAKE' : 0.0151,
'OMG' : 2.5327,
'UMA' : 7.8684,
'SAND' : 0.0373,
'RENBTC' : 29616.6274,

'USDN' : 0.875,
'IOST' : 0.0058,
'KAVA' : 1.3068,
'RSR' : 0.025,
'GLM' : 0.1122,
'BCD' : 0.4611,
'REN' : 0.3147,
'LSK' : 1.1378,
'XVG' : 0.0073,
'AR' : 2.6545,
'WRX' : 0.0661,
'GUSD' : 1.0216,
'PAXG' : 1943.3881,
'MAID' : 0.3255,
'REP' : 16.8944,
'LPT' : 1.4423,
'CKB' : 0.004047,
'KNC' : 0.7944,
'GNO' : 72.8672,
'LRC' : 0.1748,
'XVS' : 3.6288,
'SKL' : 0.0799,
'WIN' : .00005877,
'WAXP' : 0.0366,
'GT' : 0.455,
'OCEAN' : 0.3461,
'FET' : 0.053,
'STORJ' : 0.292,
'MINA' : 2.8273,
'STRAX' : 0.4727,
'WOO' : 0.7132,
'DENT' : 0.0002,
'OGN' : 0.1198,
'VTHO' : 0.0007,
'ALICE' : 14.4439,
'SNT' : 0.03096,
'PROM' : 1.88,
'RLC' : 0.7462,
'ONG' : 0.1944,
'ALPHA' : 0.2155,
'ZB' : 0.2538,
'ERG' : 0.5725,
'NMR' : 22.7001,
'BAND' : 5.4749,
'EWT' : 6.6068,
'PHA' : 6.1117,
'ABBC' : 0.2634,
'SXP' : 0.7105,
'REEF' : 0.0094,
'STMX' : 0.0026,
'OXT' : 0.2293,
'INJ' : 3.9837,
'CFX' : 0.8653,
'IOTX' : 0.0065,
'CVC' : 0.084996,
'ANT' : 3.2173,


'STEEM' : 0.1614,
'ARDR' : 0.0824,
'NKN' : 0.0183,
'FUN' : 0.0074,
'CTSI' : 0.0418,
'AMPL' : 0.968,
'SRM' : 1.1233,
'CELR' : 0.0045,
'ORBS' : 0.0121,
'CHR' : 0.0232,
'UQC' : 4.5259,
'POLY' : 0.0971,
'HIVE' : 0.1179,
'MCO' : 2.6275,
'ZKS' : 0.291,
'NU' : 0.1658,
'BAL' : 13.8939,
'RIF' : 0.163,


'MLN' : 26.7008,
'ARK' : 0.3842,
'BTS' : 0.0216,


'FEI' : 0.9643,

'XWC' : 0.2246,
'AUDIO' : 0.1579,
'KEEP' : 0.2188,
'HXRO' : 0.1707,

'DODO' : 0.2046,
'MTL' : 0.4019,
'YFII' : 1576.6165,
'JST' : 0.0228,
'AVA' : 0.8072,
'UTK' : 0.1223,
'GTC' : 5.6982,

'DEGO' : 0.5398,
'BTM' : 0.0546,
'KMD' : 0.498,

'FIO' : 0.06275,
'RLY' : 0.1228,
'DATA' : 0.0392,
'CSPR' : 1.3144,


'ACH' : '0.003466',
'ACM' : 10.8995,
'AGLD' : 2.6666,
'AION' : 0.0616,
'AKRO' : 0.0085,
'AKT' : 0.7867,
'ALPACA' : 0.4297,
'ANC' : 4.6484,
'ANT' : 3.0532,
'ARDR' : 0.072,
'ARK' : 0.376,
'ARPA' : 0.0239,
'ARRR' : 0.1733,
'ASR' : 7.9719,
'ATA' : 0.4931,
'ATM' : 9.0911,
'AUTO' : 3128.1599,
'BADGER' : 7.1942,
'BAND' : 5.3476,
'BAR' : 14.2072,
'BEAM' : 0.3009,
'BEL' : 0.8545,
'BLZ' : 0.0606,
'BTCST' : 33.0879,
'BURGER' : 0.6216,
'BZRX' : 0.1617,
'CELR' : 0.0044,
'CHESS' : 0.4344,
'CLV' : 1.1886,
'COCOS' : 0.0002434,
'COS' : 0.0071,
'COTI' : 0.047,
'CTK' : 0.8475,
'CTSI' : 0.0404,
'CTXC' : 0.0789,
'CVC' : 0.0845,
'CVP' : 1.8418,
'DAG' : 0.0079,
'DDX' : '2.893728',
'DEXE' : 1.638,
'DEP' : 0.005104,
'DF' : 0.1146,
'DFI' : 1.5231,
'DIA' : 1.2051,
'DNT' : 0.0452,
'DOCK' : 0.0168,
'DREP' : 1.627,
'DUSK' : 0.0451,
'DVI' : 0.131,
'DYDX' : 12.5,
'ELF' : 0.1027,
'EPS' : 5.0483,
'ERN' : 7.858,
'EWT' : 6.2223,
'FARM' : '73.254835',
'FIDA' : 0.3661,
'FIRO' : 3.38,
'FIS' : 0.5921,
'FLM' : 0.1254,
'FOR' : 0.0153,
'FORTH' : 43.3121,
'FRONT' : 0.2796,
'FUN' : 0.005,
'GALA' : 0.0014,
'GHST' : 0.5466,
'GT' : 0.455,
'GTO' : 0.0216,
'HARD' : 0.4857,
'HEX' : 0.01434,
'HEX' : 0.0145,
'HIVE' : 0.1145,
'HNS' : 0.1008,
'IDEX' : 0.0342,
'ILV' : 47.1048,
'IRIS' : 0.0402,
'JUV' : 12.0981,
'KEEP' : 0.1879,
'KEY' : 0.001945,
'KNC' : 1.6367,
'LINA' : 0.0104,
'LIT' : 6.8926,
'LTO' : 0.1311,
'MAID' : 0.308,
'MASK' : 8.5078,
'MBL' : 0.0014,
'MBOX' : 1.4117,
'MDT' : 0.0232,
'MDX' : 3.4002,
'MFT' : 0.0025,
'MIR' : 1.0853,
'MITH' : 0.0139,
'MIX' : 0.001876,
'MTL' : 0.4034,
'MXC' : 0.0105,
'NKN' : 0.0173,
'NULS' : 0.2111,
'NXM' : 26.6384,
'OG' : 6.6813,
'OGN' : 0.1128,
'OM' : 0.0551,
'OMI' : 0.002,
'OPIUM' : 15.3216,
'ORBS' : 0.0127,
'ORN' : 2.1291,
'OXT' : 0.2237,
'PAXG' : 1932.7035,
'PERL' : 0.0232,
'PERP' : 1.1594,
'PHA' : 0.1022,
'PNT' : 0.3543,
'POLS' : 0.6271,
'POND' : 0.0254,
'PROM' : 1.8835,
'PSG' : 12.5245,
'PUNDIX' : 3.351,
'QUICK' : 510.8954,
'RAD' : 12.121,
'RAI' : '3.306339',
'RAMP' : 0.0392,
'RARE' : 1.856,
'RARI' : 2.0077,
'RAY' : 5.7892,
'REEF' : 0.0137,
'REP' : 16.2058,
'REQ' : 0.0298,
'RGT' : '0.346676',
'RLC' : 0.7338,
'ROSE' : 0.0416,
'SFP' : 1.4653,
'SLP' : 0.0191,
'SNT' : 0.0307,
'SOC' : 0.0025,
'STEEM' : 0.1567,
'STMX' : 0.0023,
'STPT' : 0.0166,
'STRAX' : 0.471,
'SUN' : 0.02343,
'SUPER' : 1.2132,
'SYS' : 0.0605,
'TCT' : 0.0081,
'TKO' : 3.5201,
'TLM' : 0.4276,
'TOMO' : 0.6775,
'TORN' : 196.3525,
'TRB' : 17.5838,
'TRIBE' : 1.3259,
'TROY' : 0.0023,
'TRU' : 0.1372,
'TVK' : 0.0571,
'TWT' : 0.1269,
'UNFI' : 5.3511,
'USDK' : 0.9986,
'VIDT' : 0.564,
'VITE' : 0.0133,
'VRA' : 0.000552,
'WAN' : 0.3121,
'WING' : 13.0155,
'WNXM' : 40.1502,
'WTC' : 0.2765,
'XCH' : 772.4477,
'XEC' : 0.0000346,
'XHV' : 2.7693,
'XVS' : 3.5058,
'XWC' : 0.2292,
'XYO' : '0.0002245',
'YGG' : 2.749,


'QKC' : 0.00532,
'DERO' : 0.64026,
'SOUL' : 0.06085,
'TT' : 0.00521,
'XOR' : 102.59239,
'GAS' : 1.57154,
'NRG' : 1.28829,
'AE' : 0.08851,
'WICC' : 0.16275,
'MHC' : 0.00264,
'NAS' : 0.24948,
'ETP' : 0.08723,
'NXT' : 0.0109,
'SALT' : 0.3149,
'GBYTE' : 23.29174,

'ADX' : 0.3646,
'AERGO' : 0.03995,
'ALBT' : 0.26623,
'ALEPH' : 0.13778,
'API3' : 1.58093,
'APL' : 0.00078,
'AUCTION' : 19.19966,
'BCN' : 0.000169,
'BEPRO' : 0.000469,
'BEST' : 0.20937,
'BIT' : 1.43964,
'BMX' : 0.02783,
'BOA' : 0.08594,
'BOSON' : 3.56236,
'CET' : 0.00866,
'CGG' : 2.10854,
'CREAM' : 59.1583,
'CRU' : 3.9835,
'CTC' : 0.63084,
'DAD' : 0.15323,
'DAO' : 3.19475,
'DEXT' : 0.07403,
'DGD' : 141.93973,
'DIVI' : 0.02824,
'DKA' : 0.02262,
'EDG' : 0.00853,
'ELA' : 1.49452,
'ETN' : 0.00489,
'EUM' : 3.55062,
'EURS' : 1.23354,
'GRS' : 0.39152,
'HEDG' : 0.46354,
'HEGIC' : 0.11879,
'IQ' : 0.00297,
'KAI' : 0.0214,
'KDA' : 0.15196,
'KIN' : 0.00007,
'KLV' : 0.00424,
'KOK' : 0.25075,
'KP3R' : 254.82456,
'KYL' : 1.11089,
'LA' : 0.04306,
'LDO' : 1.98934,
'LOOM' : 0.02936,
'LQTY' : 25.79428,
'MARO' : 0.0208,
'MATH' : 0.49395,
'MET' : 1.24181,
'MLK' : 0.14884,
'MOF' : 0.15328,
'MONA' : 1.34572,
'MTV' : 0.000263,
'MX' : 0.1365,
'NFT' : 0.00000362,
'NIM' : 0.00519,
'NOIA' : 0.19324,
'NWC' : 0.15973,
'OXY' : 2.87545,
'PAC' : 0.000608,
'PHB' : 0.00274,
'PLA' : 0.13448,
'PNK' : 0.1103,
'POLK' : 2.03439,
'POWR' : 0.09488,
'PRO' : 0.08501,
'PRQ' : 0.55315,
'RDD' : 0.00116,
'REVV' : 0.06026,
'RFR' : 0.00371,
'RPL' : 2.26206,
'SAFEMOON' : 0.000000298,
'SBD' : 2.67572,
'SHR' : 0.02112,
'SOLO' : 0.75386,
'SOLVE' : 0.09039,
'STAKE' : 7.74093,
'STRONG' : 25.2993,
'SUKU' : 0.13774,
'SUSD' : 1.01176,
'SWAP' : 0.58706,
'TITAN' : 0.67885,
'TRAC' : 0.15014,
'TTT' : 0.64916,
'UOS' : 0.12785,
'UPP' : 0.02549,
'VEE' : 0.00129,
'VERI' : 3.42517,
'VID' : 0.05833,
'XPR' : 0.00417,
'BOND' : 25.03,
'BTCB' : 29044.4677,
'EXRD' : 0.0702,
'FX' : 0.0575,
'KAR' : 6.0043,
'LCX' : 0.0157,
'RBTC' : 28454.147,
'ROOK' : 84.1154,
'VLX' : 0.0293,

'1INCH' : 1.1388



  }


  var urlTable = {


'AAVE' : 'https://aave.com/',
'ADA' : 'https://www.cardano.org',
'AKT' : 'https://akash.network',
'ALGO' : 'http://algorand.foundation',
'ALPHA' : 'https://alphafinance.io/',
'AMP' : 'https://amptoken.org',
'ANC' : 'https://app.anchorprotocol.com',
'ANKR' : 'https://www.ankr.com/',
'ANT' : 'https://aragon.org/',
'AR' : 'https://www.arweave.org',
'ARDR' : 'https://www.jelurida.com/ardor',
'ARK' : 'http://ark.io/',
'ARRR' : 'https://pirate.black/',
'ATOM' : 'https://cosmos.network/',
'AUDIO' : 'https://audius.co/',
'AVAX' : 'https://avax.network/',
'AXS' : 'https://axieinfinity.com/',
'BAKE' : 'https://www.bakeryswap.org/',
'BAND' : 'https://bandprotocol.com/',
'BAT' : 'https://basicattentiontoken.org/',
'BCD' : 'https://www.bitcoindiamond.org/',
'BCH' : 'http://bch.info',
'BNB' : 'https://www.binance.com/',
'BNT' : 'https://bancor.network/',
'BSV' : 'https://bitcoinsv.com/',
'BTC' : 'https://bitcoin.org/',
'BTG' : 'https://bitcoingold.org/',
'BTT' : 'https://www.bittorrent.com/btt/',
'CAKE' : 'https://pancakeswap.finance/',
'CEL' : 'https://celsius.network/',
'CELO' : 'https://celo.org/',
'CELR' : 'https://www.celer.network/#',
'CHZ' : 'https://www.chiliz.com/',
'CKB' : 'http://nervos.org/',
'COMP' : 'https://compound.finance/governance/comp',
'CRO' : 'https://www.crypto.com/en/chain',
'CRV' : 'https://guides.curve.fi/everything-you-need-to-know-about-crv/',
'CTSI' : 'https://cartesi.io/',
'CVC' : 'https://www.civic.com/',
'DAG' : 'https://www.constellationnetwork.io',
'DASH' : 'https://www.dash.org/',
'DCR' : 'https://www.decred.org/',
'DENT' : 'https://www.dentwireless.com/',
'DFI' : 'https://defichain.com/',
'DGB' : 'https://digibyte.org/',
'DOGE' : 'http://dogecoin.com/',
'DOT' : 'https://polkadot.network/',
'DYDX' : 'https://dydx.community',
'EGLD' : 'https://elrond.com/',
'ELF' : 'http://aelf.io/',
'ENJ' : 'https://enjin.io/',
'EOS' : 'https://eos.io/',
'ERG' : 'https://ergoplatform.org/',
'ETC' : 'https://ethereumclassic.org/',
'ETH' : 'https://www.ethereum.org/',
'EWT' : 'https://www.energyweb.org/',
'FET' : 'https://fetch.ai/',
'FIL' : 'https://filecoin.io/',
'FLOW' : 'https://www.onflow.org/',
'FTM' : 'https://fantom.foundation/',
'FTT' : 'https://ftx.com/',
'FUN' : 'https://funtoken.io/',
'GLM' : 'https://golem.network/',
'GRT' : 'https://thegraph.com',
'GT' : 'https://gatechain.io/',
'HBAR' : 'https://www.hedera.com/',
'HEX' : 'https://hex.com/',
'HIVE' : 'https://hive.io/',
'HNT' : 'https://www.helium.com/',
'HOT' : 'https://holochain.org/',
'HT' : 'https://www.huobiwallet.com',
'ICP' : 'https://dfinity.org',
'ICX' : 'https://iconrepublic.org/',
'INJ' : 'https://injectiveprotocol.com/',
'IOST' : 'http://iost.io/',
'IOTX' : 'https://www.iotex.io/',
'KAVA' : 'https://www.kava.io/',
'KCS' : 'https://www.kucoin.com/',
'KEEP' : 'https://keep.network',
'KLAY' : 'https://www.klaytn.com/',
'KNC' : 'https://kyber.network/',
'KSM' : 'https://kusama.network/',
'LEO' : 'https://www.bitfinex.com/',
'LINK' : 'https://chain.link/',
'LRC' : 'https://loopring.org',
'LSK' : 'https://lisk.com/',
'LTC' : 'https://litecoin.org/',
'LUNA' : 'https://terra.money/',
'MAID' : 'https://safenetwork.tech/',
'MANA' : 'https://decentraland.org/',
'MATIC' : 'https://polygon.technology/',
'MBOX' : 'https://www.mobox.io/#/',
'MIOTA' : 'https://www.iota.org/',
'MIR' : 'https://mirror.finance',
'MKR' : 'https://makerdao.com/',
'MTL' : 'https://www.metalpay.com/',
'NANO' : 'http://nano.org/en',
'NEAR' : 'https://near.org/',
'NEO' : 'https://neo.org/',
'NEXO' : 'http://nexo.io',
'NKN' : 'https://nkn.org/',
'NMR' : 'https://numer.ai/',
'NXM' : 'https://nexusmutual.io/',
'OCEAN' : 'https://oceanprotocol.com/',
'OGN' : 'https://www.originprotocol.com',
'OKB' : 'https://www.okex.com/',
'OMG' : 'https://omg.network/',
'OMI' : 'https://www.ecomi.com/',
'ONE' : 'https://www.harmony.one/',
'ONT' : 'https://ont.io/',
'ORBS' : 'https://www.orbs.com/',
'OXT' : 'https://www.orchid.com/',
'PAXG' : 'https://www.paxos.com/paxgold/',
'PERP' : 'https://perp.fi/',
'PHA' : 'https://phala.network/',
'PROM' : 'https://prometeus.io/',
'QNT' : 'https://quant.network/',
'QTUM' : 'https://qtum.org/',
'REEF' : 'https://reef.finance/',
'REN' : 'https://renproject.io/',
'REP' : 'http://www.augur.net/',
'REQ' : 'https://request.network/',
'REV' : 'https://revain.org/',
'RLC' : 'https://iex.ec/',
'ROSE' : 'https://oasisprotocol.org/',
'RSR' : 'https://reserve.org/',
'RUNE' : 'https://thorchain.org/',
'RVN' : 'https://ravencoin.org/',
'SAND' : 'https://www.sandbox.game/en/',
'SC' : 'https://sia.tech/',
'SHIB' : 'https://shibatoken.com/',
'SKL' : 'https://skale.network/',
'SLP' : 'https://axieinfinity.com/',
'SNT' : 'http://status.im/',
'SNX' : 'https://www.synthetix.io/',
'SOL' : 'https://solana.com',
'SRM' : 'https://projectserum.com/',
'STEEM' : 'https://steem.com/',
'STMX' : 'https://stormx.io/',
'STORJ' : 'https://storj.io/',
'STRAX' : 'http://stratisplatform.com/',
'STX' : 'https://stacks.co',
'SUSHI' : 'https://sushi.com/',
'SXP' : 'https://swipe.io/',
'TEL' : 'https://www.telco.in/',
'TFUEL' : 'https://www.thetatoken.org',
'THETA' : 'https://www.thetatoken.org/',
'TRIBE' : 'https://fei.money/',
'TRX' : 'https://tron.network/',
'TWT' : 'https://trustwallet.com/',
'UMA' : 'https://umaproject.org/',
'UNI' : 'https://uniswap.org/blog/uni/',
'VET' : 'https://www.vechain.org/',
'VTHO' : 'https://www.vechain.org/',
'WAN' : 'https://wanchain.org/',
'WAVES' : 'https://waves.tech/',
'WAXP' : 'https://wax.io/',
'WBTC' : 'https://wbtc.network',
'WIN' : 'https://winklink.org/',
'WRX' : 'https://wazirx.com/',
'XCH' : 'https://www.chia.net/',
'XDC' : 'https://xinfin.org/',
'XEM' : 'http://nem.io',
'XLM' : 'https://www.stellar.org',
'XMR' : 'https://www.getmonero.org/',
'XRP' : 'https://xrpl.org/',
'XTZ' : 'https://www.tezos.com/',
'XVG' : 'http://vergecurrency.com/',
'XVS' : 'https://venus.io/',
'XWC' : 'http://whitecoin.info/',
'YFI' : 'https://yearn.finance/',
'ZEC' : 'https://z.cash/',
'ZEN' : 'https://www.horizen.io/',
'ZIL' : 'https://www.zilliqa.com/',
'ZRX' : 'https://0x.org/',
'ABBC' : 'https://abbccoin.com/',
'ACH' : 'https://www.alchemytech.io/',
'ADX' : 'https://www.adex.network/',
'AERGO' : 'https://www.aergo.io/',
'AGLD' : 'https://www.lootproject.com/',
'AION' : 'https://theoan.com/',
'AKRO' : 'https://akropolis.io/',
'ALBT' : 'https://allianceblock.io/',
'ALEPH' : 'https://aleph.im/',
'ALPACA' : 'https://www.alpacafinance.org/',
'AMPL' : 'https://www.ampleforth.org/',
'API3' : 'https://api3.org/',
'APL' : 'https://aplfintech.com/apollo-currency/',
'ARPA' : 'https://arpachain.io/',
'AUCTION' : 'https://bounce.finance/',
'AUTO' : 'https://autofarm.network/',
'AVA' : 'https://www.travala.com/',
'BADGER' : 'https://app.badger.finance/',
'BAL' : 'https://balancer.finance/',
'BCN' : 'https://bytecoin.org/',
'BEAM' : 'https://www.beam.mw/',
'BEL' : 'https://bella.fi/',
'BEPRO' : 'https://bepro.network',
'BEST' : 'https://www.bitpanda.com/en/best',
'BIT' : 'https://www.bitdao.io/',
'BLZ' : 'https://bluzelle.com/',
'BMX' : 'https://www.bitmart.com/',
'BOA' : 'https://www.bosagora.io/',
'BOSON' : 'http://bosonprotocol.io',
'BTM' : 'http://bytom.io/',
'BTS' : 'https://bitshares.org',
'BURGER' : 'https://burgerswap.org/',
'BUSD' : 'https://www.binance.com/en/busd',
'BZRX' : 'https://bzx.network/',
'CET' : 'https://www.coinex.org/',
'CGG' : 'https://chainguardians.io/',
'CHR' : 'https://chromia.com/',
'CHSB' : 'https://swissborg.com/',
'CLV' : 'https://clover.finance/',
'COS' : 'https://www.contentos.io/',
'COTI' : 'https://coti.io/',
'CREAM' : 'https://cream.finance/',
'CRU' : 'https://www.crust.network/',
'CSPR' : 'https://casper.network/',
'CTC' : 'https://www.creditcoin.org',
'CTK' : 'http://certik.org',
'CVP' : 'https://powerpool.finance/',
'DAD' : 'https://dad.one/',
'DAI' : 'http://www.makerdao.com/',
'DAO' : 'https://daomaker.com/',
'DATA' : 'https://streamr.network',
'DDX' : 'https://derivadex.com/',
'DEGO' : 'https://dego.finance/',
'DERO' : 'https://dero.io',
'DEXT' : 'https://www.dextools.io/',
'DGD' : 'https://digix.global/dgd/',
'DIA' : 'https://diadata.org/',
'DIVI' : 'https://www.diviproject.org/',
'DKA' : 'https://dkargo.io/main_en.html',
'DNT' : 'https://district0x.io/',
'DOCK' : 'https://dock.io',
'DODO' : 'https://dodoex.io/',
'DUSK' : 'https://www.dusk.network',
'EDG' : 'https://edgewa.re',
'ELA' : 'https://elastos.info',
'ERN' : 'https://ethernity.io/',
'ETN' : 'http://electroneum.com/',
'EUM' : 'https://www.elitium.io',
'EURS' : 'https://stasis.net',
'FARM' : 'https://harvest.finance/',
'FIO' : 'https://fioprotocol.io/',
'FIRO' : 'https://firo.org/',
'FLM' : 'https://flamingo.finance/',
'FOR' : 'https://for.tube/home',
'FORTH' : 'https://www.ampleforth.org/',
'FRONT' : 'https://frontier.xyz/',
'GAS' : 'https://neo.org/',
'GHST' : 'https://aavegotchi.com/',
'GRS' : 'http://www.groestlcoin.org/',
'GUSD' : 'https://gemini.com/dollar/',
'HARD' : 'https://kava.io/lend',
'HEDG' : 'https://hedgetrade.com/',
'HEGIC' : 'https://www.hegic.co/',
'HNS' : 'https://handshake.org/',
'HUSD' : 'http://www.stcoins.com/',
'HXRO' : 'https://hxro.io/',
'ILV' : 'https://illuvium.io/',
'IQ' : 'https://everipedia.org/',
'IRIS' : 'https://www.irisnet.org/',
'JST' : 'https://just.network/#/',
'KAI' : 'https://www.kardiachain.io/',
'KDA' : 'http://kadena.io/',
'KEY' : 'https://selfkey.org/',
'KIN' : 'https://www.kin.org/',
'KLV' : 'https://www.klever.io/',
'KMD' : 'https://komodoplatform.com/',
'KOK' : 'http://kok-chain.io',
'KP3R' : 'https://keep3r.network/',
'KYL' : 'https://kylin.network/',
'LA' : 'https://latoken.com/',
'LDO' : 'https://lido.fi/',
'LOOM' : 'https://loomx.io/',
'LQTY' : 'https://www.liquity.org/',
'LTO' : 'https://www.ltonetwork.com/',
'MARO' : 'https://ma.ro/#/',
'MASK' : 'https://www.mask.io',
'MATH' : 'https://mathwallet.org',
'MBL' : 'https://www.moviebloc.com/',
'MCO' : 'https://crypto.com/',
'MET' : 'https://www.metronome.io/',
'MFT' : 'https://hifi.finance/',
'MINA' : 'https://minaprotocol.com/',
'MLK' : 'http://milkalliance.io/',
'MLN' : 'https://enzyme.finance/',
'MOF' : 'http://www.molecular.cc/',
'MONA' : 'http://monacoin.org',
'MTV' : 'https://www.mtv.ac/',
'MX' : 'https://www.mxc.com',
'MXC' : 'https://www.mxc.org/',
'NFT' : 'http://apenft.org/',
'NIM' : 'https://nimiq.com/',
'NOIA' : 'http://syntropynet.com/',
'NRG' : 'https://www.energi.world/',
'NULS' : 'https://nuls.io/',
'NWC' : 'https://newscrypto.io/',
'OM' : 'https://mantradao.com/',
'ORN' : 'https://www.orionprotocol.io/orn',
'OXY' : 'https://www.oxygen.org/',
'PAC' : 'https://pacprotocol.com',
'PHB' : 'https://www.phoenix.global/',
'PLA' : 'https://playdapp.io',
'PNK' : 'https://kleros.io/',
'POLK' : 'https://www.polkamarkets.com/',
'POLS' : 'https://www.polkastarter.com/',
'POLY' : 'https://www.polymath.network/',
'POWR' : 'https://powerledger.io/',
'PRO' : 'https://propy.com/',
'PRQ' : 'https://parsiq.net',
'QKC' : 'https://quarkchain.io/',
'RAD' : 'https://radicle.xyz/',
'RARI' : 'https://app.rarible.com/rari',
'RDD' : 'http://www.reddcoin.com/',
'REVV' : 'https://www.revvmotorsport.com/',
'RFR' : 'https://refereum.com/',
'RIF' : 'https://www.rifos.org/',
'RLY' : 'https://vaults.rally.io/vaults',
'RPL' : 'https://www.rocketpool.net/',
'SAFEMOON' : 'https://safemoon.net/',
'SBD' : 'https://steem.io/',
'SFP' : 'https://www.safepal.io',
'SHR' : 'https://sharering.network/',
'SOLO' : 'https://www.sologenic.com/',
'SOLVE' : 'https://solve.care/',
'SOUL' : 'https://phantasma.io/',
'STAKE' : 'http://xdaichain.com/',
'STPT' : 'https://stp.network/',
'STRONG' : 'https://strongblock.io/',
'SUKU' : 'https://www.suku.world/',
'SUN' : 'https://sun.io/',
'SUPER' : 'https://superfarm.com/#/',
'SUSD' : 'https://www.synthetix.io/',
'SWAP' : 'https://trustswap.org/',
'SYS' : 'http://syscoin.org',
'TITAN' : 'https://titanswap.org/',
'TKO' : 'https://www.tokocrypto.com/',
'TOMO' : 'https://tomochain.com/',
'TRAC' : 'https://origintrail.io/',
'TRB' : 'https://tellor.io/',
'TROY' : 'https://troytrade.com/',
'TRU' : 'https://truefi.io/',
'TT' : 'https://www.thundercore.com',
'TTT' : 'https://www.atom-solutions.jp/en/xecttt/',
'TUSD' : 'https://www.trueusd.com/',
'TVK' : 'https://terravirtua.io/',
'UNFI' : 'https://www.unifiprotocol.com/',
'UOS' : 'https://ultra.io/',
'UPP' : 'https://sentinelprotocol.io',
'UQC' : 'https://uquidcoin.com/',
'USDC' : 'https://www.centre.io/usdc',
'USDN' : 'https://neutrino.at/',
'UST' : 'https://terra.money',
'UTK' : 'https://utrust.com/',
'VEE' : 'https://blockv.io/',
'VERI' : 'http://veritas.veritaseum.com/',
'VID' : 'https://www.videocoin.network/',
'VITE' : 'https://www.vite.org/',
'VRA' : 'https://www.verasity.io/',
'WNXM' : 'https://nexusmutual.io/',
'WTC' : 'http://www.waltonchain.org/',
'XEC' : 'https://e.cash/',
'XOR' : 'https://sora.org/',
'XPR' : 'https://www.protonchain.com',
'XYO' : 'https://xyo.network/',
'YFII' : 'https://dfi.money/#/',
'ZB' : 'https://www.zb.com/',
'1INCH' : 'https://1inch.io/',

 }

var cointokenTable = {

'AAVE' : 'Token',
'AAVEDOWN' : 'Token',
'AAVEUP' : 'Token',
'ACM' : 'Token',
'ADA' : 'Coin',
'ADADOWN' : 'Coin',
'ADAUP' : 'Coin',
'AGLD' : 'Token',
'AION' : 'Coin',
'AKRO' : 'Token',
'ALGO' : 'Coin',
'ALICE' : 'Token',
'ALPACA' : 'Token',
'ALPHA' : 'Token',
'ANKR' : 'Token',
'ANT' : 'Token',
'AR' : 'Coin',
'ARDR' : 'Coin',
'ARPA' : 'Token',
'ASR' : 'Token',
'ATA' : 'Token',
'ATM' : 'Token',
'ATOM' : 'Coin',
'AUDIO' : 'Token',
'AUTO' : 'Token',
'AVA' : 'Token',
'AVAX' : 'Coin',
'AXS' : 'Token',
'BADGER' : 'Token',
'BAKE' : 'Token',
'BAL' : 'Token',
'BAND' : 'Token',
'BAR' : 'Token',
'BAT' : 'Token',
'BCH' : 'Coin',
'BCHDOWN' : 'Token',
'BCHUP' : 'Token',
'BEAM' : 'Coin',
'BEL' : 'Token',
'BETA' : 'Token',
'BLZ' : 'Token',
'BNB' : 'Coin',
'BNBDOWN' : 'Coin',
'BNBUP' : 'Coin',
'BNT' : 'Token',
'BOND' : 'Token',
'BTC' : 'Coin',
'BTCDOWN' : 'Coin',
'BTCST' : 'Token',
'BTCUP' : 'Coin',
'BTG' : 'Coin',
'BTS' : 'Coin',
'BTT' : 'Token',
'BURGER' : 'Token',
'BUSD' : 'Token',
'BZRX' : 'Token',
'CAKE' : 'Token',
'CELO' : 'Coin',
'CELR' : 'Token',
'CFX' : 'Token',
'CHESS' : 'Token',
'CHR' : 'Token',
'CHZ' : 'Token',
'CKB' : 'Coin',
'CLV' : 'Token',
'COCOS' : 'Token',
'COMP' : 'Token',
'COS' : 'Token',
'COTI' : 'Coin',
'CRV' : 'Token',
'CTK' : 'Coin',
'CTSI' : 'Token',
'CTXC' : 'Coin',
'CVC' : 'Token',
'CVP' : 'Token',
'DASH' : 'Coin',
'DATA' : 'Token',
'DCR' : 'Coin',
'DEGO' : 'Token',
'DENT' : 'Token',
'DEXE' : 'Token',
'DF' : 'Token',
'DGB' : 'Coin',
'DIA' : 'Token',
'DNT' : 'Token',
'DOCK' : 'Token',
'DODO' : 'Token',
'DOGE' : 'Coin',
'DOT' : 'Coin',
'DOTDOWN' : 'Coin',
'DOTUP' : 'Coin',
'DREP' : 'Token',
'DUSK' : 'Token',
'DYDX' : 'Token',
'EGLD' : 'Coin',
'ELF' : 'Token',
'ENJ' : 'Token',
'EOS' : 'Coin',
'EOSDOWN' : 'Coin',
'EOSUP' : 'Coin',
'EPS' : 'Token',
'ERN' : 'Token',
'ETC' : 'Coin',
'ETH' : 'Coin',
'ETHDOWN' : 'Token',
'ETHUP' : 'Coin',
'FARM' : 'Token',
'FET' : 'Token',
'FIDA' : 'Token',
'FIL' : 'Coin',
'FILDOWN' : 'Token',
'FILUP' : 'Token',
'FIO' : 'Coin',
'FIRO' : 'Coin',
'FIS' : 'Coin',
'FLM' : 'Token',
'FLOW' : 'Coin',
'FOR' : 'Token',
'FORTH' : 'Token',
'FRONT' : 'Token',
'FTM' : 'Coin',
'FTT' : 'Token',
'FUN' : 'Token',
'GALA' : 'Token',
'GBP' : 'Token',
'GHST' : 'Token',
'GNO' : 'Token',
'GRT' : 'Token',
'GTC' : 'Token',
'GTO' : 'Token',
'GXC' : 'Coin',
'HARD' : 'Token',
'HBAR' : 'Coin',
'HIVE' : 'Coin',
'HNT' : 'Coin',
'HOT' : 'Token',
'ICP' : 'Coin',
'ICX' : 'Coin',
'IDEX' : 'Token',
'ILV' : 'Token',
'INJ' : 'Token',
'IOST' : 'Coin',
'IOTX' : 'Coin',
'IRIS' : 'Coin',
'JST' : 'Token',
'JUV' : 'Token',
'KAVA' : 'Token',
'KEEP' : 'Token',
'KEY' : 'Token',
'KLAY' : 'Coin',
'KMD' : 'Coin',
'KNC' : 'Token',
'KSM' : 'Coin',
'LAZIO' : 'Token',
'LINA' : 'Token',
'LINK' : 'Token',
'LINKDOWN' : 'Coin',
'LINKUP' : 'Coin',
'LIT' : 'Token',
'LPT' : 'Token',
'LRC' : 'Token',
'LSK' : 'Coin',
'LTC' : 'Coin',
'LTCDOWN' : 'Coin',
'LTCUP' : 'Coin',
'LTO' : 'Coin',
'LUNA' : 'Coin',
'MANA' : 'Token',
'MASK' : 'Token',
'MATIC' : 'Coin',
'MBL' : 'Token',
'MBOX' : 'Token',
'MDT' : 'Token',
'MDX' : 'Token',
'MFT' : 'Token',
'MINA' : 'Coin',
'MIOTA' : 'Coin',
'MIR' : 'Token',
'MITH' : 'Token',
'MKR' : 'Token',
'MLN' : 'Token',
'MTL' : 'Token',
'NANO' : 'Coin',
'NBS' : 'Token',
'NEAR' : 'Coin',
'NEO' : 'Coin',
'NKN' : 'Coin',
'NMR' : 'Token',
'NU' : 'Token',
'NULS' : 'Coin',
'OCEAN' : 'Token',
'OG' : 'Token',
'OGN' : 'Token',
'OM' : 'Token',
'OMG' : 'Token',
'ONE' : 'Coin',
'ONG' : 'Token',
'ONT' : 'Coin',
'ORN' : 'Token',
'OXT' : 'Token',
'PAXG' : 'Token',
'PERL' : 'Token',
'PERP' : 'Token',
'PHA' : 'Coin',
'PNT' : 'Token',
'POLS' : 'Token',
'POLY' : 'Token',
'POND' : 'Token',
'PSG' : 'Token',
'PUNDIX' : 'Token',
'QNT' : 'Token',
'QTUM' : 'Coin',
'QUICK' : 'Token',
'RAD' : 'Coin',
'RAMP' : 'Token',
'RARE' : 'Token',
'RAY' : 'Token',
'REEF' : 'Coin',
'REN' : 'Token',
'REP' : 'Token',
'REQ' : 'Token',
'RIF' : 'Token',
'RLC' : 'Token',
'ROSE' : 'Coin',
'RSR' : 'Token',
'RUNE' : 'Token',
'RVN' : 'Coin',
'SAND' : 'Token',
'SC' : 'Coin',
'SFP' : 'Token',
'SHIB' : 'Token',
'SKL' : 'Token',
'SLP' : 'Token',
'SNX' : 'Token',
'SOL' : 'Coin',
'SRM' : 'Coin',
'STMX' : 'Token',
'STORJ' : 'Token',
'STPT' : 'Token',
'STRAX' : 'Coin',
'STX' : 'Coin',
'SUN' : 'Token',
'SUPER' : 'Token',
'SUSD' : 'Token',
'SUSHI' : 'Token',
'SUSHIDOWN' : 'Token',
'SUSHIUP' : 'Token',
'SXP' : 'Token',
'SXPDOWN' : 'Coin',
'SXPUP' : 'Coin',
'SYS' : 'Coin',
'TCT' : 'Token',
'TFUEL' : 'Coin',
'THETA' : 'Coin',
'TKO' : 'Token',
'TLM' : 'Token',
'TOMO' : 'Coin',
'TORN' : 'Token',
'TRB' : 'Token',
'TRIBE' : 'Token',
'TROY' : 'Token',
'TRU' : 'Token',
'TRX' : 'Coin',
'TRXDOWN' : 'Coin',
'TRXUP' : 'Coin',
'TUSD' : 'Token',
'TVK' : 'Token',
'TWT' : 'Token',
'UMA' : 'Token',
'UNFI' : 'Token',
'UNI' : 'Token',
'UNIDOWN' : 'Token',
'UNIUP' : 'Token',
'USDC' : 'Token',
'USDP' : 'Token',
'UTK' : 'Token',
'VET' : 'Coin',
'VIDT' : 'Token',
'VITE' : 'Coin',
'VTHO' : 'Token',
'WAN' : 'Coin',
'WAVES' : 'Coin',
'WAXP' : 'Coin',
'WIN' : 'Token',
'WING' : 'Token',
'WNXM' : 'Token',
'WRX' : 'Token',
'WTC' : 'Token',
'XEC' : 'Coin',
'XEM' : 'Coin',
'XLM' : 'Coin',
'XLMDOWN' : 'Token',
'XLMUP' : 'Token',
'XMR' : 'Coin',
'XRP' : 'Coin',
'XRPDOWN' : 'Coin',
'XRPUP' : 'Coin',
'XTZ' : 'Coin',
'XTZDOWN' : 'Coin',
'XTZUP' : 'Coin',
'XVG' : 'Coin',
'XVS' : 'Token',
'YFI' : 'Token',
'YFIDOWN' : 'Token',
'YFII' : 'Token',
'YFIUP' : 'Token',
'YGG' : 'Token',
'ZEC' : 'Coin',
'ZEN' : 'Coin',
'ZIL' : 'Coin',
'ZRX' : 'Token',
'AAVE' : 'Token',
'ADA' : 'Coin',
'AKT' : 'Coin',
'ALGO' : 'Coin',
'ALPHA' : 'Token',
'AMP' : 'Token',
'ANC' : 'Token',
'ANKR' : 'Token',
'ANT' : 'Token',
'AR' : 'Coin',
'ARDR' : 'Coin',
'ARK' : 'Coin',
'ARRR' : 'Coin',
'ATOM' : 'Coin',
'AUDIO' : 'Token',
'AVAX' : 'Coin',
'AXS' : 'Token',
'BAKE' : 'Token',
'BAND' : 'Token',
'BAT' : 'Token',
'BCD' : 'Coin',
'BCH' : 'Coin',
'BNB' : 'Coin',
'BNT' : 'Token',
'BSV' : 'Coin',
'BTC' : 'Coin',
'BTG' : 'Coin',
'BTT' : 'Token',
'CAKE' : 'Token',
'CEL' : 'Token',
'CELO' : 'Coin',
'CELR' : 'Token',
'CHZ' : 'Token',
'CKB' : 'Coin',
'COMP' : 'Token',
'CRO' : 'Token',
'CRV' : 'Token',
'CTSI' : 'Token',
'CVC' : 'Token',
'DAG' : 'Coin',
'DASH' : 'Coin',
'DCR' : 'Coin',
'DENT' : 'Token',
'DFI' : 'Coin',
'DGB' : 'Coin',
'DOGE' : 'Coin',
'DOT' : 'Coin',
'DYDX' : 'Token',
'EGLD' : 'Coin',
'ELF' : 'Token',
'ENJ' : 'Token',
'EOS' : 'Coin',
'ERG' : 'Coin',
'ETC' : 'Coin',
'ETH' : 'Coin',
'EWT' : 'Coin',
'FET' : 'Token',
'FIL' : 'Coin',
'FLOW' : 'Coin',
'FTM' : 'Coin',
'FTT' : 'Token',
'FUN' : 'Token',
'GLM' : 'Token',
'GRT' : 'Token',
'GT' : 'Token',
'HBAR' : 'Coin',
'HEX' : 'Token',
'HIVE' : 'Coin',
'HNT' : 'Coin',
'HOT' : 'Token',
'HT' : 'Token',
'ICP' : 'Coin',
'ICX' : 'Coin',
'INJ' : 'Token',
'IOST' : 'Coin',
'IOTX' : 'Coin',
'KAVA' : 'Token',
'KCS' : 'Token',
'KEEP' : 'Token',
'KLAY' : 'Coin',
'KNC' : 'Token',
'KSM' : 'Coin',
'LEO' : 'Token',
'LINK' : 'Token',
'LRC' : 'Token',
'LSK' : 'Coin',
'LTC' : 'Coin',
'LUNA' : 'Coin',
'MAID' : 'Token',
'MANA' : 'Token',
'MATIC' : 'Coin',
'MBOX' : 'Token',
'MIOTA' : 'Coin',
'MIR' : 'Token',
'MKR' : 'Token',
'MTL' : 'Token',
'NANO' : 'Coin',
'NEAR' : 'Coin',
'NEO' : 'Coin',
'NEXO' : 'Token',
'NKN' : 'Coin',
'NMR' : 'Token',
'NXM' : 'Token',
'OCEAN' : 'Token',
'OGN' : 'Token',
'OKB' : 'Token',
'OMG' : 'Token',
'OMI' : 'Token',
'ONE' : 'Coin',
'ONT' : 'Coin',
'ORBS' : 'Token',
'OXT' : 'Token',
'PAXG' : 'Token',
'PERP' : 'Token',
'PHA' : 'Coin',
'PROM' : 'Token',
'QNT' : 'Token',
'QTUM' : 'Coin',
'REEF' : 'Token',
'REN' : 'Token',
'REP' : 'Token',
'REQ' : 'Token',
'REV' : 'Token',
'RLC' : 'Token',
'ROSE' : 'Coin',
'RSR' : 'Token',
'RUNE' : 'Token',
'RVN' : 'Coin',
'SAND' : 'Token',
'SC' : 'Coin',
'SHIB' : 'Token',
'SKL' : 'Token',
'SLP' : 'Token',
'SNT' : 'Token',
'SNX' : 'Token',
'SOL' : 'Coin',
'SRM' : 'Coin',
'STEEM' : 'Coin',
'STMX' : 'Token',
'STORJ' : 'Token',
'STRAX' : 'Coin',
'STX' : 'Coin',
'SUSHI' : 'Token',
'SXP' : 'Token',
'TEL' : 'Token',
'TFUEL' : 'Coin',
'THETA' : 'Coin',
'TRIBE' : 'Token',
'TRX' : 'Coin',
'TWT' : 'Token',
'UMA' : 'Token',
'UNI' : 'Token',
'VET' : 'Coin',
'VTHO' : 'Token',
'WAN' : 'Coin',
'WAVES' : 'Coin',
'WAXP' : 'Coin',
'WBTC' : 'Token',
'WIN' : 'Token',
'WRX' : 'Token',
'XCH' : 'Coin',
'XDC' : 'Coin',
'XEM' : 'Coin',
'XLM' : 'Coin',
'XMR' : 'Coin',
'XRP' : 'Coin',
'XTZ' : 'Coin',
'XVG' : 'Coin',
'XVS' : 'Token',
'XWC' : 'Coin',
'YFI' : 'Token',
'ZEC' : 'Coin',
'ZEN' : 'Coin',
'ZIL' : 'Coin',
'ZRX' : 'Token',
'ABBC' : 'Coin',
'ACH' : 'Token',
'ADX' : 'Token',
'AERGO' : 'Token',
'AGLD' : 'Token',
'AION' : 'Coin',
'AKRO' : 'Token',
'ALBT' : 'Token',
'ALEPH' : 'Token',
'ALPACA' : 'Token',
'AMPL' : 'Token',
'API3' : 'Token',
'APL' : 'Coin',
'ARPA' : 'Token',
'AUCTION' : 'Token',
'AUTO' : 'Token',
'AVA' : 'Token',
'BADGER' : 'Token',
'BAL' : 'Token',
'BCN' : 'Coin',
'BEAM' : 'Coin',
'BEL' : 'Token',
'BEPRO' : 'Token',
'BEST' : 'Token',
'BIT' : 'Token',
'BLZ' : 'Token',
'BMX' : 'Token',
'BOA' : 'Token',
'BOSON' : 'Token',
'BTM' : 'Coin',
'BTS' : 'Coin',
'BURGER' : 'Token',
'BUSD' : 'Token',
'BZRX' : 'Token',
'CET' : 'Coin',
'CGG' : 'Token',
'CHR' : 'Token',
'CHSB' : 'Token',
'CLV' : 'Token',
'COS' : 'Token',
'COTI' : 'Coin',
'CREAM' : 'Token',
'CRU' : 'Coin',
'CSPR' : 'Coin',
'CTC' : 'Coin',
'CTK' : 'Coin',
'CVP' : 'Token',
'DAD' : 'Token',
'DAI' : 'Token',
'DAO' : 'Token',
'DATA' : 'Token',
'DDX' : 'Token',
'DEGO' : 'Token',
'DERO' : 'Coin',
'DEXT' : 'Token',
'DGD' : 'Token',
'DIA' : 'Token',
'DIVI' : 'Coin',
'DKA' : 'Token',
'DNT' : 'Token',
'DOCK' : 'Token',
'DODO' : 'Token',
'DUSK' : 'Token',
'EDG' : 'Coin',
'ELA' : 'Coin',
'ERN' : 'Token',
'ETN' : 'Coin',
'EUM' : 'Token',
'EURS' : 'Token',
'FARM' : 'Token',
'FIO' : 'Coin',
'FIRO' : 'Coin',
'FLM' : 'Token',
'FOR' : 'Token',
'FORTH' : 'Token',
'FRONT' : 'Token',
'GAS' : 'Token',
'GHST' : 'Token',
'GRS' : 'Coin',
'GUSD' : 'Token',
'HARD' : 'Token',
'HEDG' : 'Token',
'HEGIC' : 'Token',
'HNS' : 'Coin',
'HUSD' : 'Token',
'HXRO' : 'Token',
'ILV' : 'Token',
'IQ' : 'Token',
'IRIS' : 'Coin',
'JST' : 'Token',
'KAI' : 'Coin',
'KDA' : 'Coin',
'KEY' : 'Token',
'KIN' : 'Coin',
'KLV' : 'Token',
'KMD' : 'Coin',
'KOK' : 'Token',
'KP3R' : 'Token',
'KYL' : 'Token',
'LA' : 'Token',
'LDO' : 'Token',
'LOOM' : 'Token',
'LQTY' : 'Token',
'LTO' : 'Coin',
'MARO' : 'Coin',
'MASK' : 'Token',
'MATH' : 'Token',
'MBL' : 'Token',
'MCO' : 'Token',
'MET' : 'Token',
'MFT' : 'Token',
'MINA' : 'Coin',
'MLK' : 'Token',
'MLN' : 'Token',
'MOF' : 'Token',
'MONA' : 'Coin',
'MTV' : 'Coin',
'MX' : 'Token',
'MXC' : 'Token',
'NFT' : 'Token',
'NIM' : 'Coin',
'NOIA' : 'Token',
'NRG' : 'Coin',
'NULS' : 'Coin',
'NWC' : 'Token',
'OM' : 'Token',
'ORN' : 'Token',
'OXY' : 'Token',
'PAC' : 'Coin',
'PHB' : 'Token',
'PLA' : 'Token',
'PNK' : 'Token',
'POLK' : 'Token',
'POLS' : 'Token',
'POLY' : 'Token',
'POWR' : 'Token',
'PRO' : 'Token',
'PRQ' : 'Token',
'QKC' : 'Token',
'RAD' : 'Coin',
'RARI' : 'Token',
'RDD' : 'Coin',
'REVV' : 'Token',
'RFR' : 'Token',
'RIF' : 'Token',
'RLY' : 'Token',
'RPL' : 'Token',
'SAFEMOON' : 'Token',
'SBD' : 'Coin',
'SFP' : 'Token',
'SHR' : 'Token',
'SOLO' : 'Token',
'SOLVE' : 'Token',
'SOUL' : 'Token',
'STAKE' : 'Token',
'STPT' : 'Token',
'STRONG' : 'Token',
'SUKU' : 'Token',
'SUN' : 'Token',
'SUPER' : 'Token',
'SUSD' : 'Token',
'SWAP' : 'Token',
'SYS' : 'Coin',
'TITAN' : 'Token',
'TKO' : 'Token',
'TOMO' : 'Coin',
'TRAC' : 'Token',
'TRB' : 'Token',
'TROY' : 'Token',
'TRU' : 'Token',
'TT' : 'Coin',
'TTT' : 'Token',
'TUSD' : 'Token',
'TVK' : 'Token',
'UNFI' : 'Token',
'UOS' : 'Token',
'UPP' : 'Token',
'UQC' : 'Token',
'USDC' : 'Token',
'USDN' : 'Token',
'UST' : 'Coin',
'UTK' : 'Token',
'VEE' : 'Token',
'VERI' : 'Token',
'VID' : 'Token',
'VITE' : 'Coin',
'VRA' : 'Token',
'WNXM' : 'Token',
'WTC' : 'Token',
'XEC' : 'Coin',
'XOR' : 'Token',
'XPR' : 'Token',
'XYO' : 'Token',
'YFII' : 'Token',
'ZB' : 'Token',
'1INCH' : 'Token',

}


var twitterTable = {


'AAVE' : 'https://twitter.com/AaveAave',
'ADA' : 'https://twitter.com/cardano',
'AKT' : 'https://twitter.com/akashnet_',
'ALGO' : 'https://twitter.com/AlgoFoundation',
'ALPHA' : 'https://twitter.com/alphafinancelab',
'AMP' : 'https://twitter.com/amptoken',
'ANC' : 'https://twitter.com/anchor_protocol',
'ANKR' : 'https://twitter.com/ankr',
'ANT' : 'https://twitter.com/AragonProject',
'AR' : 'https://twitter.com/arweaveteam',
'ARDR' : 'https://twitter.com/ardorplatform',
'ARK' : 'https://twitter.com/ArkEcosystem',
'ARRR' : 'https://twitter.com/PirateChain',
'ATOM' : 'https://twitter.com/cosmos',
'AUDIO' : 'https://twitter.com/AudiusProject',
'AVAX' : 'https://twitter.com/AvalancheAVAX',
'AXS' : 'https://twitter.com/AxieInfinity',
'BAKE' : 'https://twitter.com/bakery_swap',
'BAND' : 'https://twitter.com/bandprotocol',
'BAT' : 'https://twitter.com/attentiontoken',
'BCD' : 'https://twitter.com/BitcoinDiamond_',
'BCH' : '',
'BNB' : 'https://twitter.com/binance',
'BNT' : 'https://twitter.com/Bancor',
'BSV' : 'https://twitter.com/BitcoinAssn',
'BTC' : '',
'BTG' : 'https://twitter.com/bitcoingold',
'BTT' : 'https://twitter.com/BitTorrent',
'CAKE' : 'https://twitter.com/pancakeswap',
'CEL' : 'https://twitter.com/celsiusnetwork',
'CELO' : 'https://twitter.com/CeloOrg',
'CELR' : 'https://twitter.com/CelerNetwork',
'CHZ' : 'https://twitter.com/chiliz',
'CKB' : 'https://twitter.com/nervosnetwork',
'COMP' : 'https://twitter.com/compoundfinance',
'CRO' : 'https://twitter.com/cryptocom',
'CRV' : 'https://twitter.com/curvefinance',
'CTSI' : 'https://twitter.com/cartesiproject',
'CVC' : 'https://twitter.com/civickey',
'DAG' : 'https://twitter.com/Conste11ation',
'DASH' : 'https://twitter.com/Dashpay',
'DCR' : 'https://twitter.com/decredproject',
'DENT' : 'https://twitter.com/dentcoin',
'DFI' : 'https://twitter.com/defichain',
'DGB' : 'https://twitter.com/DigiByteCoin',
'DOGE' : 'https://twitter.com/dogecoin',
'DOT' : 'https://twitter.com/Polkadot',
'DYDX' : 'https://twitter.com/dydxfoundation',
'EGLD' : 'https://twitter.com/elrondnetwork',
'ELF' : 'https://twitter.com/aelfblockchain',
'ENJ' : 'https://twitter.com/enjin',
'EOS' : 'https://twitter.com/block_one_',
'ERG' : 'https://twitter.com/ergoplatformorg',
'ETC' : 'https://twitter.com/eth_classic',
'ETH' : 'https://twitter.com/ethereum',
'EWT' : 'https://twitter.com/energywebx',
'FET' : 'https://twitter.com/fetch_ai',
'FIL' : 'https://twitter.com/protocollabs',
'FLOW' : 'https://twitter.com/flow_blockchain',
'FTM' : 'https://twitter.com/FantomFDN',
'FTT' : 'https://twitter.com/FTX_Official',
'FUN' : 'https://twitter.com/funtoken_io',
'GLM' : 'https://twitter.com/golemproject',
'GRT' : 'https://twitter.com/graphprotocol',
'GT' : 'https://twitter.com/gatechain_io',
'HBAR' : 'https://twitter.com/hedera',
'HEX' : 'https://twitter.com/HEXcrypto',
'HIVE' : 'https://twitter.com/hiveblocks',
'HNT' : 'https://twitter.com/helium',
'HOT' : 'https://twitter.com/H_O_L_O_',
'HT' : 'https://twitter.com/HuobiGlobal',
'ICP' : 'https://twitter.com/dfinity',
'ICX' : 'https://twitter.com/helloiconworld',
'INJ' : 'https://twitter.com/injectivelabs',
'IOST' : 'https://twitter.com/IOST_Official',
'IOTX' : 'https://twitter.com/iotex_io',
'KAVA' : 'https://twitter.com/kava_labs',
'KCS' : 'https://twitter.com/kucoincom',
'KEEP' : 'https://twitter.com/keep_project',
'KLAY' : 'https://twitter.com/klaytn_official',
'KNC' : 'https://twitter.com/kybernetwork',
'KSM' : 'https://twitter.com/kusamanetwork',
'LEO' : 'https://twitter.com/bitfinex',
'LINK' : 'https://twitter.com/chainlink',
'LRC' : 'https://twitter.com/loopringorg',
'LSK' : 'https://twitter.com/LiskHQ',
'LTC' : 'https://twitter.com/LitecoinProject',
'LUNA' : 'https://twitter.com/terra_money',
'MAID' : 'https://twitter.com/maidsafe',
'MANA' : 'https://twitter.com/decentraland',
'MATIC' : 'https://twitter.com/0xPolygon',
'MBOX' : 'https://twitter.com/MOBOX_Official',
'MIOTA' : 'https://twitter.com/iota',
'MIR' : 'https://twitter.com/mirror_protocol',
'MKR' : 'https://twitter.com/MakerDAO',
'MTL' : 'https://twitter.com/metalpaysme',
'NANO' : 'https://twitter.com/nano',
'NEAR' : 'https://twitter.com/NEARProtocol',
'NEO' : 'https://twitter.com/neo_blockchain',
'NEXO' : 'https://twitter.com/NexoFinance',
'NKN' : 'https://twitter.com/nkn_org',
'NMR' : 'https://twitter.com/numerai',
'NXM' : 'https://twitter.com/NexusMutual',
'OCEAN' : 'https://twitter.com/oceanprotocol',
'OGN' : 'https://twitter.com/originprotocol',
'OKB' : 'https://twitter.com/okex',
'OMG' : 'https://twitter.com/omgnetworkhq',
'OMI' : 'https://twitter.com/ecomi_',
'ONE' : 'https://twitter.com/harmonyprotocol',
'ONT' : 'https://twitter.com/OntologyNetwork',
'ORBS' : 'https://twitter.com/orbs_network',
'OXT' : 'https://twitter.com/OrchidProtocol',
'PAXG' : 'https://twitter.com/paxosglobal',
'PERP' : 'https://twitter.com/perpprotocol',
'PHA' : 'https://twitter.com/PhalaNetwork',
'PROM' : 'https://twitter.com/prometeusnet',
'QNT' : 'https://twitter.com/quant_network',
'QTUM' : 'https://twitter.com/qtum',
'REEF' : 'https://twitter.com/ReefDeFi',
'REN' : 'https://twitter.com/renprotocol',
'REP' : 'https://twitter.com/AugurProject',
'REQ' : 'https://twitter.com/requestnetwork',
'REV' : 'https://twitter.com/revain_org',
'RLC' : 'https://twitter.com/iEx_ec',
'ROSE' : 'https://twitter.com/OasisProtocol',
'RSR' : 'https://twitter.com/reserveprotocol',
'RUNE' : 'https://twitter.com/THORChain',
'RVN' : 'https://twitter.com/ravencoin',
'SAND' : 'https://twitter.com/thesandboxgame',
'SC' : 'https://twitter.com/SkynetLabs',
'SHIB' : 'https://twitter.com/shibtoken',
'SKL' : 'https://twitter.com/SkaleNetwork',
'SLP' : 'https://twitter.com/AxieInfinity',
'SNT' : 'https://twitter.com/ethstatus',
'SNX' : 'https://twitter.com/synthetix_io',
'SOL' : 'https://twitter.com/solana',
'SRM' : 'https://twitter.com/projectserum',
'STEEM' : 'https://twitter.com/Steemit',
'STMX' : 'https://twitter.com/stormxio',
'STORJ' : 'https://twitter.com/storj',
'STRAX' : 'https://twitter.com/stratisplatform',
'STX' : 'https://twitter.com/Stacks',
'SUSHI' : 'https://twitter.com/sushiswap',
'SXP' : 'https://twitter.com/Swipe',
'TEL' : 'https://twitter.com/telcoin_team',
'TFUEL' : 'https://twitter.com/Theta_Network',
'THETA' : 'https://twitter.com/Theta_Network',
'TRIBE' : 'https://twitter.com/feiprotocol',
'TRX' : 'https://twitter.com/justinsuntron',
'TWT' : 'https://twitter.com/TrustWalletApp',
'UMA' : 'https://twitter.com/UMAprotocol',
'UNI' : 'https://twitter.com/Uniswap',
'VET' : 'https://twitter.com/vechainofficial',
'VTHO' : 'https://twitter.com/vechainofficial',
'WAN' : 'https://twitter.com/wanchain_org',
'WAVES' : 'https://twitter.com/wavesprotocol',
'WAXP' : 'https://twitter.com/WAX_io',
'WBTC' : 'https://twitter.com/WrappedBTC',
'WIN' : 'https://twitter.com/WinkLink_Oracle',
'WRX' : 'https://twitter.com/wazirxindia',
'XCH' : 'https://twitter.com/chia_project',
'XDC' : 'https://twitter.com/XinFin_Official',
'XEM' : 'https://twitter.com/NEMofficial',
'XLM' : 'https://twitter.com/StellarOrg',
'XMR' : 'https://twitter.com/monero',
'XRP' : 'https://twitter.com/Ripple',
'XTZ' : 'https://twitter.com/tezos',
'XVG' : 'https://twitter.com/vergecurrency',
'XVS' : 'https://twitter.com/VenusProtocol',
'XWC' : 'https://twitter.com/WhiteCoiner',
'YFI' : 'https://twitter.com/iearnfinance',
'ZEC' : 'https://twitter.com/electriccoinco',
'ZEN' : 'https://twitter.com/horizenglobal',
'ZIL' : 'https://twitter.com/zilliqa',
'ZRX' : 'https://twitter.com/0xproject',
'1INCH' : 'https://twitter.com/1inch',

}

 var talkTable = {

'1INCH' : 'https://t.me/OneInchNetwork',
'AAVE' : 'https://aave.com/discord',
'ADA' : 'https://t.me/Cardano',
'AKT' : 'https://t.me/akashnw',
'ALGO' : 'https://t.me/AlgorandFoundation',
'ALPHA' : 'https://t.me/AlphaFinanceLab',
'AMP' : 'https://amptoken.org/discord',
'ANC' : 'https://t.me/anchor_official',
'ANKR' : 'https://t.me/ankrnetwork',
'ANT' : 'https://t.me/AragonProject',
'AR' : 'https://discord.gg/BXk8tq7',
'ARDR' : 'https://t.me/ardorplatform',
'ARK' : 'https://t.me/arkannouncements',
'ARRR' : 'https://t.me/piratechain',
'ATOM' : 'https://t.me/cosmosproject',
'AUDIO' : 'https://discord.gg/yNUg2e2',
'AVAX' : 'https://t.me/avalancheavax',
'AXS' : 'https://discord.com/invite/axie',
'BAKE' : 'https://t.me/bakeryswap',
'BAND' : 'https://t.me/bandprotocol',
'BAT' : 'https://t.me/batproject',
'BCD' : 'https://t.me/BCDcommunity',
'BCH' : '',
'BNB' : 'https://t.me/binanceexchange',
'BNT' : 'https://telegram.me/bancor',
'BSV' : '',
'BTC' : 'https://bitcointalk.org',
'BTG' : 'https://t.me/BitcoinGoldHQ',
'BTT' : 'https://t.me/BTTBitTorrent',
'CAKE' : 'https://t.me/PancakeSwap',
'CEL' : 'https://t.me/celsiusnetwork',
'CELO' : 'https://discord.com/invite/nfmTPV2',
'CELR' : 'https://t.me/celernetwork',
'CHZ' : 'https://t.me/chiliz_io',
'CKB' : 'https://t.me/nervosnetwork',
'COMP' : 'https://compound.finance/discord',
'CRO' : 'https://t.me/CryptoComOfficial',
'CRV' : 'https://t.me/curvefi',
'CTSI' : 'https://t.me/cartesiproject',
'CVC' : '',
'DAG' : 'https://t.me/constellationcommunity',
'DASH' : 'https://t.me/dash_chat',
'DCR' : 'https://t.me/decred',
'DENT' : 'https://t.me/dentcoin',
'DFI' : 'https://t.me/defiblockchain',
'DGB' : 'https://t.me/DigiByteCoin',
'DOGE' : 'http://webchat.freenode.net/?nick=Shibe..&channels=%23dogecoin&prompt=1',
'DOT' : 'https://t.me/PolkadotOfficial',
'EGLD' : 'https://t.me/ElrondNetwork',
'ELF' : 'https://t.me/aelfblockchain',
'ENJ' : 'https://t.me/enjin',
'EOS' : 'https://t.me/joinchat/AAAAAEQbOeucnaMWN0A9dQ',
'ERG' : 'https://telegram.me/ergoplatform',
'ETC' : 'https://discord.gg/HW4GckH',
'ETH' : 'https://gitter.im/orgs/ethereum/rooms',
'EWT' : 'https://t.me/energyweb',
'FET' : 'https://t.me/fetch_ai',
'FIL' : '',
'FLOW' : 'https://discord.gg/hfxW25U',
'FTM' : 'http://chat.fantom.network/',
'FTT' : 'https://t.me/FTX_Official',
'FUN' : 'https://t.me/officialFUNToken',
'GLM' : '',
'GRT' : 'https://thegraph.com/discord',
'GT' : '',
'HBAR' : 'https://t.me/hederahashgraph',
'HEX' : 'https://t.me/HEXcrypto',
'HIVE' : 'https://t.me/hiveblockchain',
'HNT' : 'http://chat.helium.com/',
'HOT' : 'http://t.me/channelHolo',
'HT' : '',
'ICP' : 'https://forum.dfinity.org',
'ICX' : 'https://t.me/hello_iconworld',
'INJ' : 'https://discord.com/invite/pJZqagr',
'IOST' : 'https://t.me/officialios',
'IOTX' : 'https://t.me/IoTeXGroup',
'KAVA' : 'https://t.me/kavalabs',
'KCS' : '',
'KEEP' : 'https://t.me/KeepNetworkOfficial',
'KLAY' : '',
'KNC' : 'https://t.me/officialkybernetwork',
'KSM' : '',
'LEO' : 'https://t.me/bfxtelegram',
'LINK' : 'https://t.me/chainlinkofficial',
'LRC' : 'https://t.me/loopring_en',
'LSK' : 'https://lisk.chat/',
'LTC' : 'https://telegram.me/litecoin',
'LUNA' : 'https://t.me/TerraLunaChat',
'MAID' : '',
'MANA' : 'https://t.me/DecentralandTG',
'MATIC' : 'https://t.me/polygonofficial',
'MBOX' : 'https://t.me/mobox_io',
'MIOTA' : 'https://discord.iota.org/',
'MIR' : 'https://t.me/mirror_protocol',
'MKR' : 'https://t.me/makerdaoOfficial',
'MTL' : 'https://t.me/MetalPayCommunity',
'NANO' : 'https://chat.nano.org/',
'NEAR' : 'https://t.me/cryptonear',
'NEO' : 'https://t.me/NEO_EN',
'NEXO' : 'https://t.me/nexofinance',
'NKN' : 'https://t.me/nknorg',
'NMR' : 'https://t.me/NMR_Official',
'NXM' : 'https://t.me/joinchat/K_g-fA-3CmFwXumCKQUXkw',
'OCEAN' : 'https://t.me/OceanProtocol_Community',
'OGN' : 'https://www.originprotocol.com/discord',
'OKB' : 'https://t.me/okexofficial_en',
'OMG' : 'https://t.me/omgnetwork',
'OMI' : '',
'ONE' : 'https://t.me/harmony_one',
'ONT' : 'https://t.me/OntologyNetwork',
'ORBS' : 'https://t.me/OrbsNetwork',
'OXT' : 'https://www.t.me/OrchidOfficial',
'PAXG' : '',
'PERP' : 'https://discord.com/invite/mYKKRTn',
'PHA' : 'https://t.me/phalanetwork',
'PROM' : 'https://t.me/promnetwork',
'QNT' : 'https://t.me/QuantOverledger',
'QTUM' : 'https://t.me/qtumofficial',
'REEF' : 'https://t.me/reefdefi',
'REN' : 'https://t.me/renproject',
'REP' : '',
'REQ' : 'https://t.me/requestnetwork',
'REV' : 'https://t.me/joinchat/CzZcC0PCgpJcbBCb3JfNeQ',
'RLC' : 'https://t.me/iexec_rlc_official',
'ROSE' : 'https://t.me/oasisprotocolcommunity',
'RSR' : 'https://t.me/reservecurrency',
'RUNE' : 'https://t.me/thorchain_org',
'RVN' : 'https://t.me/RavencoinDev',
'SAND' : 'https://discord.gg/vAe4zvY',
'SC' : 'https://discord.gg/sia',
'SHIB' : 'http://t.me/shibainuthedogecoinkiller',
'SKL' : 'https://t.me/skaleofficial',
'SLP' : 'https://discord.gg/68DeTqc',
'SNT' : 'https://join.status.im/status',
'SNX' : 'https://discord.gg/AEdUHzt',
'SOL' : 'https://discord.gg/Rz737rP',
'SRM' : 'https://t.me/ProjectSerum',
'STEEM' : '',
'STMX' : 'https://t.me/stormxapp',
'STORJ' : '',
'STRAX' : 'https://discord.com/invite/9tDyfZs',
'STX' : 'https://t.me/BlockstackChat',
'SUSHI' : 'https://discord.com/invite/MsVBwEc',
'SXP' : 'Https://t.me/SwipeWallet',
'TEL' : 'https://t.me/telcoincommunity',
'TFUEL' : 'https://discord.com/invite/QfMpeZBfKB',
'THETA' : 'https://discord.com/invite/QfMpeZBfKB',
'TRIBE' : 'https://t.me/feiprotocol',
'TRX' : 'http://t.me/tronnetworkEN',
'TWT' : 'https://t.me/trust_announcements',
'UMA' : 'https://join.slack.com/t/umaprotocol/shared_invite/enQtNTk4MjQ4ODY0MDA1LTM4ODg0NGZhYWZkNjkzMDE4MjU0ZGFlYWQzZTFiZWFlZjI2NDE4OGI2NWY3OTdhYjYyZjg0MjAzMTgwODVhZTE',
'UNI' : 'https://discord.gg/FCfyBSbCU5',
'VET' : 'https://t.me/vechain_official_english',
'VTHO' : 'https://t.me/vechain_official_english',
'WAN' : 'https://t.me/WanchainANN',
'WAVES' : 'https://t.me/Wavescommunity',
'WAXP' : 'https://t.me/wax_io',
'WBTC' : '',
'WIN' : 'https://t.me/WINkLink_Oracle_official',
'WRX' : '',
'XCH' : 'https://keybase.io/team/chia_network.public',
'XDC' : 'https://t.me/xinfintalk',
'XEM' : 'https://t.me/nemred',
'XLM' : 'http://slack.stellar.org/',
'XMR' : 'https://telegram.me/monero',
'XRP' : 'https://t.me/Ripple',
'XTZ' : 'https://t.me/tezosplatform',
'XVG' : 'https://t.me/VERGExvg',
'XVS' : 'https://t.me/VenusProtocol',
'XWC' : 'https://discordapp.com/invite/GbpdbMt',
'YFI' : 'https://t.me/iearnfinance',
'ZEC' : 'https://t.me/Zcash_Community',
'ZEN' : 'https://horizen.io/invite/telegram'

}



var explorerTable = {

'AAVE' : 'https://etherscan.io/token/0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
'ADA' : 'https://explorer.cardano.org',
'AKT' : 'https://akash.bigdipper.live',
'ALGO' : 'https://algoexplorer.io/',
'ALPHA' : 'https://bscscan.com/address/0xa1faa113cbe53436df28ff0aee54275c13b40975',
'AMP' : 'https://etherscan.io/token/0xff20817765cb7f73d4bde2e66e067e58d11095c2',
'ANC' : 'https://finder.terra.money/columbus-4/address/terra14z56l0fp2lsf86zy3hty2z47ezkhnthtr9yq76',
'ANKR' : 'https://etherscan.io/token/0x8290333ceF9e6D528dD5618Fb97a76f268f3EDD4',
'ANT' : 'https://etherscan.io/token/0xa117000000f279d81a1d3cc75430faa017fa5a2e',
'AR' : 'https://viewblock.io/arweave',
'ARDR' : 'https://ardor.tools/',
'ARK' : 'https://explorer.ark.io/',
'ARRR' : 'http://pirate.explorer.dexstats.info/',
'ATOM' : 'https://www.mintscan.io/',
'AUDIO' : 'https://etherscan.io/token/0x18aaa7115705e8be94bffebde57af9bfc265b998',
'AVAX' : 'https://avascan.info/',
'AXS' : 'https://etherscan.io/token/0xf5d669627376ebd411e34b98f19c868c8aba5ada',
'BAKE' : 'https://bscscan.com/token/0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
'BAND' : 'https://etherscan.io/token/0xba11d00c5f74255f56a5e366f4f77f5a186d7f55',
'BAT' : 'https://etherscan.io/token/0x0d8775f648430679a709e98d2b0cb6250d2887ef',
'BCD' : 'http://explorer.btcd.io/',
'BCH' : 'https://explorer.bitcoin.com/bch',
'BNB' : 'https://explorer.binance.org/',
'BNT' : 'https://etherscan.io/token/Bancor',
'BSV' : 'https://blockchair.com/bitcoin-sv',
'BTC' : 'https://blockchain.coinmarketcap.com/chain/bitcoin',
'BTG' : 'https://explorer.bitcoingold.org/insight/',
'BTT' : 'https://tronscan.org/#/token/1002000',
'CAKE' : 'https://bscscan.com/token/0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
'CEL' : 'https://etherscan.io/token/0xaaaebe6fe48e54f431b0c390cfaf0b017d09d42d',
'CELO' : 'https://thecelo.com/',
'CELR' : 'https://etherscan.io/token/0x4f9254c83eb525f9fcf346490bbb3ed28a81c667',
'CHZ' : 'https://explorer.chiliz.com/address/0xe4a461065d032c77c8bf2d708f371dd098d71a20/transactions',
'CKB' : 'https://explorer.nervos.org/',
'COMP' : 'https://etherscan.io/token/0xc00e94cb662c3520282e6f5717214004a7f26888',
'CRO' : 'https://etherscan.io/token/0xa0b73e1ff0b80914ab6fe0444e65848c4c34450b',
'CRV' : 'https://etherscan.io/token/0xD533a949740bb3306d119CC777fa900bA034cd52',
'CTSI' : 'https://etherscan.io/token/0x491604c0fdf08347dd1fa4ee062a822a5dd06b5d',
'CVC' : 'https://etherscan.io/token/civic',
'DAG' : 'https://www.dagexplorer.io/',
'DASH' : 'https://explorer.dash.org',
'DCR' : 'https://mainnet.decred.org/',
'DENT' : 'https://etherscan.io/token/0x3597bfd533a99c9aa083587b074434e61eb0a258',
'DFI' : 'http://explorer.defichain.io/',
'DGB' : 'https://digiexplorer.info/',
'DOGE' : 'https://blockchair.com/dogecoin',
'DOT' : 'http://polkascan.io/',
'DYDX' : 'https://etherscan.io/token/0x92d6c1e31e14520e676a687f0a93788b716beff5',
'EGLD' : 'https://explorer.elrond.com/',
'ELF' : 'https://etherscan.io/token/0xbf2179859fc6D5BEE9Bf9158632Dc51678a4100e',
'ENJ' : 'https://enjinx.io/eth/token/0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c',
'EOS' : 'https://bloks.io/',
'ERG' : 'https://explorer.ergoplatform.com/',
'ETC' : 'https://blockscout.com/etc/mainnet/',
'ETH' : 'https://etherscan.io/',
'EWT' : 'https://explorer.energyweb.org/',
'FET' : 'https://etherscan.io/token/0xaea46A60368A7bD060eec7DF8CBa43b7EF41Ad85',
'FIL' : 'https://filfox.io/en?utm_source=cmc',
'FLOW' : 'https://flowscan.org',
'FTM' : 'https://ftmscan.com/',
'FTT' : 'https://etherscan.io/token/0x50d1c9771902476076ecfc8b2a83ad6b9355a4c9',
'FUN' : 'https://etherscan.io/token/FunFair',
'GLM' : 'https://etherscan.io/address/0x7DD9c5Cba05E151C895FDe1CF355C9A1D5DA6429',
'GRT' : 'https://etherscan.io/token/0xc944e90c64b2c07662a292be6244bdf05cda44a7',
'GT' : 'https://etherscan.io/token/0xe66747a101bff2dba3697199dcce5b743b454759',
'HBAR' : 'https://hash-hash.info/',
'HEX' : 'https://etherscan.io/token/0x2b591e99afe9f32eaa6214f7b7629768c40eeb39',
'HIVE' : 'https://hiveblocks.com/',
'HNT' : 'https://explorer.helium.com/',
'HOT' : 'https://etherscan.io/token/0x6c6ee5e31d828de241282b9606c8e98ea48526e2',
'HT' : 'https://etherscan.io/token/0x6f259637dcd74c767781e37bc6133cd6a68aa161',
'ICP' : 'http://dfinityexplorer.org/',
'ICX' : 'https://tracker.icon.foundation/',
'INJ' : 'https://etherscan.io/token/0xe28b3b32b6c345a34ff64674606124dd5aceca30',
'IOST' : 'https://www.iostabc.com/',
'IOTX' : 'https://www.iotexscan.io/',
'KAVA' : 'https://www.mintscan.io/kava',
'KCS' : 'https://etherscan.io/token/0xf34960d9d60be18cc1d5afc1a6f012a723a28811',
'KEEP' : 'https://etherscan.io/token/0x85eee30c52b0b379b046fb0f85f4f3dc3009afec',
'KLAY' : 'https://scope.klaytn.com/blocks',
'KNC' : 'https://etherscan.io/token/0xdeFA4e8a7bcBA345F687a2f1456F5Edd9CE97202',
'KSM' : 'https://polkascan.io/pre/kusama-cc3',
'LEO' : 'https://etherscan.io/token/0x2af5d2ad76741191d15dfe7bf6ac92d4bd912ca3',
'LINK' : 'https://etherscan.io/token/0x514910771af9ca656af840dff83e8264ecf986ca',
'LRC' : 'https://etherscan.io/token/0xbbbbca6a901c926f240b89eacb641d8aec7aeafd',
'LSK' : 'https://lisk.observer/',
'LTC' : 'https://blockchair.com/litecoin',
'LUNA' : 'https://finder.terra.money/',
'MAID' : 'http://omniexplorer.info/asset/3',
'MANA' : 'https://etherscan.io/token/decentraland',
'MATIC' : 'https://etherscan.io/token/0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
'MBOX' : 'https://bscscan.com/token/0x3203c9e46ca618c8c1ce5dc67e7e9d75f5da2377',
'MIOTA' : 'https://thetangle.org/',
'MIR' : 'https://etherscan.io/token/0x09a3EcAFa817268f77BE1283176B946C4ff2E608',
'MKR' : 'https://etherscan.io/token/Maker',
'MTL' : 'https://etherscan.io/token/0xF433089366899D83a9f26A773D59ec7eCF30355e',
'NANO' : 'https://nanocrawler.cc/',
'NEAR' : 'https://explorer.near.org/',
'NEO' : 'https://neoscan.io/',
'NEXO' : 'https://etherscan.io/token/0xb62132e35a6c13ee1ee0f84dc5d40bad8d815206',
'NKN' : 'https://nscan.io/',
'NMR' : 'https://etherscan.io/token/0x1776e1F26f98b1A5dF9cD347953a26dd3Cb46671',
'NXM' : 'https://etherscan.io/token/0xd7c49cee7e9188cca6ad8ff264c1da2e69d4cf3b',
'OCEAN' : 'https://etherscan.io/token/0x967da4048cd07ab37855c090aaf366e4ce1b9f48',
'OGN' : 'https://etherscan.io/token/0x8207c1ffc5b6804f6024322ccf34f29c3541ae26',
'OKB' : 'https://etherscan.io/token/0x75231f58b43240c9718dd58b4967c5114342a86c',
'OMG' : 'https://omg.eco/blockexplorer',
'OMI' : 'https://explorer.gochain.io/addr/0x5347FDeA6AA4d7770B31734408Da6d34a8a07BdF',
'ONE' : 'https://explorer.harmony.one/#/',
'ONT' : 'https://explorer.ont.io/',
'ORBS' : 'https://etherscan.io/token/0xff56cc6b1e6ded347aa0b7676c85ab0b3d08b0fa',
'OXT' : 'https://etherscan.io/token/0x4575f41308EC1483f3d399aa9a2826d74Da13Deb',
'PAXG' : 'https://etherscan.io/token/0x45804880de22913dafe09f4980848ece6ecbaf78',
'PERP' : 'https://etherscan.io/token/0xbc396689893d065f41bc2c6ecbee5e0085233447',
'PHA' : 'https://etherscan.io/token/0x6c5bA91642F10282b576d91922Ae6448C9d52f4E',
'PROM' : 'https://etherscan.io/token/0xfc82bb4ba86045af6f327323a46e80412b91b27d',
'QNT' : 'https://etherscan.io/token/0x4a220e6096b25eadb88358cb44068a3248254675',
'QTUM' : 'https://qtum.info/',
'REEF' : 'https://etherscan.io/token/0xfe3e6a25e6b192a42a44ecddcd13796471735acf',
'REN' : 'https://etherscan.io/token/0x408e41876cccdc0f92210600ef50372656052a38',
'REP' : 'https://etherscan.io/token/0x1985365e9f78359a9B6AD760e32412f4a445E862',
'REQ' : 'https://etherscan.io/token/0x8f8221afbb33998d8584a2b05749ba73c37a938a',
'REV' : 'https://etherscan.io/token/0x2ef52Ed7De8c5ce03a4eF0efbe9B7450F2D7Edc9',
'RLC' : 'https://etherscan.io/token/RLC',
'ROSE' : 'https://www.oasisscan.com/',
'RSR' : 'https://etherscan.io/token/0x8762db106b2c2a0bccb3a80d1ed41273552616e8',
'RUNE' : 'https://explorer.binance.org/asset/RUNE-B1A',
'RVN' : 'https://ravencoin.network/',
'SAND' : 'https://etherscan.io/token/0x3845badAde8e6dFF049820680d1F14bD3903a5d0',
'SC' : 'https://siastats.info/',
'SHIB' : 'https://etherscan.io/token/0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce',
'SKL' : 'https://etherscan.io/token/0x00c83aecc790e8a4453e5dd3b0b4b3680501a7a7',
'SLP' : 'https://etherscan.io/token/0x37236cd05b34cc79d3715af2383e96dd7443dcf1',
'SNT' : 'https://etherscan.io/token/StatusNetwork',
'SNX' : 'https://etherscan.io/token/0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
'SOL' : 'https://explorer.solana.com',
'SRM' : 'https://etherscan.io/token/0x476c5e26a75bd202a9683ffd34359c0cc15be0ff',
'STEEM' : 'https://steemdb.io',
'STMX' : 'https://etherscan.io/token/0xbE9375C6a420D2eEB258962efB95551A5b722803',
'STORJ' : 'https://etherscan.io/token/Storj',
'STRAX' : 'https://chainz.cryptoid.info/strax/#',
'STX' : 'https://explorer.stacks.co',
'SUSHI' : 'https://etherscan.io/token/0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
'SXP' : 'https://etherscan.io/token/0x8ce9137d39326ad0cd6491fb5cc0cba0e089b6a9',
'TEL' : 'https://etherscan.io/token/0x467Bccd9d29f223BcE8043b84E8C8B282827790F',
'TFUEL' : 'https://explorer.thetatoken.org/',
'THETA' : 'https://explorer.thetatoken.org/',
'TRIBE' : 'https://etherscan.io/token/0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B',
'TRX' : 'https://tronscan.org/#/',
'TWT' : 'https://explorer.binance.org/asset/TWT-8C2',
'UMA' : 'https://etherscan.io/token/0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828',
'UNI' : 'https://etherscan.io/token/0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
'VET' : 'http://explore.vechain.org/',
'VTHO' : 'https://explore.vechain.org/',
'WAN' : 'https://www.wanscan.org/',
'WAVES' : 'http://wavesexplorer.com/',
'WAXP' : 'https://wax.bloks.io/',
'WBTC' : 'https://etherscan.io/token/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
'WIN' : 'https://tronscan.org/#/token20/TLa2f6VPqDgRE67v1736s7bJ8Ray5wYjU7',
'WRX' : 'https://explorer.binance.org/asset/WRX-ED1',
'XCH' : 'https://www.chiaexplorer.com/',
'XDC' : 'https://explorer.xinfin.network/home',
'XEM' : 'http://chain.nem.ninja/',
'XLM' : 'https://dashboard.stellar.org/',
'XMR' : 'http://moneroblocks.info/',
'XRP' : 'https://xrpcharts.ripple.com/#/graph/',
'XTZ' : 'https://tzstats.com/',
'XVG' : 'https://verge-blockchain.info/',
'XVS' : 'https://bscscan.com/token/0xcf6bb5389c92bdda8a3747ddb454cb7a64626c63',
'XWC' : 'http://explorer.whitecoin.info/#/',
'YFI' : 'https://etherscan.io/token/0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e',
'ZEC' : 'https://explorer.zcha.in/',
'ZEN' : 'https://explorer.horizen.io/',
'ZIL' : 'https://viewblock.io/zilliqa',
'ZRX' : 'https://etherscan.io/token/ZRX',
'1INCH' : 'https://etherscan.io/token/0x111111111117dc0aa78b770fa6a738034120c302',


}

var redditTable = {

'AAVE' : 'https://reddit.com/r/Aave_Official',
'ADA' : 'https://reddit.com/r/cardano',
'AKT' : '',
'ALGO' : 'https://reddit.com/r/AlgorandOfficial',
'ALPHA' : '',
'AMP' : 'https://reddit.com/r/amptoken',
'ANC' : '',
'ANKR' : '',
'ANT' : '',
'AR' : 'https://reddit.com/r/Arweave',
'ARDR' : 'https://reddit.com/r/ardor',
'ARK' : 'https://reddit.com/r/ArkEcosystem',
'ARRR' : 'https://reddit.com/r/piratechain',
'ATOM' : 'https://reddit.com/r/cosmosnetwork',
'AUDIO' : '',
'AVAX' : 'https://reddit.com/r/Avax',
'AXS' : 'https://reddit.com/r/AxieInfinity',
'BAKE' : '',
'BAND' : 'https://reddit.com/r/bandprotocol',
'BAT' : 'https://reddit.com/r/BATProject',
'BCD' : 'https://reddit.com/r/Bitcoin-Diamond',
'BCH' : 'https://reddit.com/r/Bitcoincash',
'BNB' : 'https://reddit.com/r/binance',
'BNT' : 'https://reddit.com/r/Bancor',
'BSV' : '',
'BTC' : 'https://reddit.com/r/bitcoin',
'BTG' : 'https://reddit.com/r/BitcoinGoldHQ',
'BTT' : 'https://reddit.com/r/BittorrentToken',
'CAKE' : '',
'CEL' : 'https://reddit.com/r/celsiusnetwork',
'CELO' : 'https://reddit.com/r/CeloHQ',
'CELR' : '',
'CHZ' : '',
'CKB' : 'https://reddit.com/r/NervosNetwork',
'COMP' : '',
'CRO' : 'https://reddit.com/r/Crypto_com',
'CRV' : 'https://reddit.com/r/CurveDAO',
'CTSI' : '',
'CVC' : 'https://reddit.com/r/civicplatform',
'DAG' : 'https://reddit.com/r/constellation',
'DASH' : 'https://reddit.com/r/dashpay',
'DCR' : 'https://reddit.com/r/decred',
'DENT' : 'https://reddit.com/r/dent',
'DFI' : 'https://reddit.com/r/defiblockchain',
'DGB' : 'https://reddit.com/r/Digibyte',
'DOGE' : 'https://reddit.com/r/dogecoin',
'DOT' : 'https://reddit.com/r/dot',
'EGLD' : 'https://reddit.com/r/elrondnetwork',
'ELF' : '',
'ENJ' : 'https://reddit.com/r/EnjinCoin',
'EOS' : 'https://reddit.com/r/EOS',
'ERG' : '',
'ETC' : 'https://reddit.com/r/EthereumClassic',
'ETH' : 'https://reddit.com/r/ethereum',
'EWT' : 'https://reddit.com/r/EnergyWeb',
'FET' : 'https://reddit.com/r/FetchAI_Community',
'FIL' : '',
'FLOW' : '',
'FTM' : 'https://reddit.com/r/FantomFoundation',
'FTT' : '',
'FUN' : 'https://reddit.com/r/FUN_Token',
'GLM' : 'https://reddit.com/r/GolemProject',
'GRT' : 'https://reddit.com/r/thegraph',
'GT' : '',
'HBAR' : 'https://reddit.com/r/hashgraph',
'HEX' : 'https://reddit.com/r/HEXcrypto',
'HIVE' : 'https://reddit.com/r/hivenetwork',
'HNT' : 'https://reddit.com/r/HeliumNetwork',
'HOT' : 'https://reddit.com/r/holochain',
'HT' : 'https://reddit.com/r/HuobiGlobal',
'ICP' : 'https://reddit.com/r/dfinity',
'ICX' : 'https://reddit.com/r/helloicon',
'INJ' : 'https://reddit.com/r/injective',
'IOST' : 'https://reddit.com/r/IOStoken',
'IOTX' : 'https://reddit.com/r/IoTex',
'KAVA' : '',
'KCS' : 'https://reddit.com/r/kucoin',
'KEEP' : 'https://reddit.com/r/KeepNetwork',
'KLAY' : 'https://reddit.com/r/klaytn',
'KNC' : 'https://reddit.com/r/kybernetwork',
'KSM' : '',
'LEO' : 'https://reddit.com/r/bitfinex',
'LINK' : 'https://reddit.com/r/chainlink',
'LRC' : 'https://reddit.com/r/loopringorg',
'LSK' : 'https://reddit.com/r/lisk',
'LTC' : 'https://reddit.com/r/litecoin',
'LUNA' : 'https://reddit.com/r/terraluna',
'MAID' : 'https://reddit.com/r/safenetwork',
'MANA' : 'https://reddit.com/r/decentraland',
'MATIC' : 'https://reddit.com/r/0xPolygon',
'MBOX' : 'https://reddit.com/r/Mobox',
'MIOTA' : 'https://reddit.com/r/Iota',
'MIR' : '',
'MKR' : 'https://reddit.com/r/MakerDAO',
'MTL' : 'https://reddit.com/r/MetalPay',
'NANO' : 'https://reddit.com/r/nanocurrency',
'NEAR' : '',
'NEO' : 'https://reddit.com/r/NEO',
'NEXO' : 'https://reddit.com/r/nexo',
'NKN' : 'https://reddit.com/r/nknblockchain',
'NMR' : 'https://reddit.com/r/numerai',
'NXM' : '',
'OCEAN' : 'https://reddit.com/r/oceanprotocol',
'OGN' : 'https://reddit.com/r/originprotocol',
'OKB' : 'https://reddit.com/r/okex',
'OMG' : 'https://reddit.com/r/OMGnetwork',
'OMI' : '',
'ONE' : 'https://reddit.com/r/harmony_one/',
'ONT' : 'https://reddit.com/r/OntologyNetwork',
'ORBS' : 'https://reddit.com/r/ORBS_Network',
'OXT' : 'https://reddit.com/r/orchid',
'PAXG' : '',
'PERP' : '',
'PHA' : '',
'PROM' : '',
'QNT' : 'https://reddit.com/r/QuantNetwork',
'QTUM' : 'https://reddit.com/r/Qtum',
'REEF' : 'https://reddit.com/r/ReefDeFi',
'REN' : 'https://reddit.com/r/renproject',
'REP' : 'https://reddit.com/r/augur',
'REQ' : 'https://reddit.com/r/RequestNetwork',
'REV' : 'https://reddit.com/r/revain_org',
'RLC' : 'https://reddit.com/r/iexec',
'ROSE' : '',
'RSR' : '',
'RUNE' : 'https://reddit.com/r/thorchain',
'RVN' : 'https://reddit.com/r/Ravencoin',
'SAND' : '',
'SC' : 'https://reddit.com/r/Siacoin',
'SHIB' : 'https://reddit.com/r/SHIBArmy',
'SKL' : '',
'SLP' : 'https://reddit.com/r/AxieInfinity',
'SNT' : 'https://reddit.com/r/statusim',
'SNX' : 'https://reddit.com/r/synthetix_io',
'SOL' : 'https://reddit.com/r/solana',
'SRM' : '',
'STEEM' : 'https://reddit.com/r/steemit',
'STMX' : 'https://reddit.com/r/stormxio',
'STORJ' : 'https://reddit.com/r/storj',
'STRAX' : 'https://reddit.com/r/Stratisplatform',
'STX' : 'https://reddit.com/r/stacks',
'SUSHI' : 'https://reddit.com/r/SushiSwap',
'SXP' : '',
'TEL' : 'https://reddit.com/r/telcoin',
'TFUEL' : 'https://reddit.com/r/theta_network',
'THETA' : 'https://reddit.com/r/theta_network',
'TRIBE' : '',
'TRX' : 'https://reddit.com/r/Tronix',
'TWT' : 'https://reddit.com/r/trustapp',
'UMA' : '',
'UNI' : 'https://reddit.com/r/Uniswap',
'VET' : 'https://reddit.com/r/vechain',
'VTHO' : 'https://reddit.com/r/Vechain',
'WAN' : 'https://reddit.com/r/wanchain',
'WAVES' : 'https://reddit.com/r/Wavesplatform',
'WAXP' : 'https://reddit.com/r/WAX_io',
'WBTC' : '',
'WIN' : 'https://reddit.com/r/WIN_Wink',
'WRX' : '',
'XCH' : 'https://reddit.com/r/chia',
'XDC' : 'https://reddit.com/r/xinfin',
'XEM' : 'https://reddit.com/r/nem',
'XLM' : 'https://reddit.com/r/stellar',
'XMR' : 'https://reddit.com/r/monero',
'XRP' : 'https://reddit.com/r/ripple',
'XTZ' : 'https://reddit.com/r/tezos',
'XVG' : 'https://reddit.com/r/vergecurrency',
'XVS' : '',
'XWC' : 'https://reddit.com/r/whitecoin',
'YFI' : '',
'ZEC' : 'https://reddit.com/r/zec',
'ZEN' : 'https://reddit.com/r/Horizen',
'ZIL' : 'https://reddit.com/r/zilliqa',
'ZRX' : 'https://reddit.com/r/0xProject',
'1INCH' : 'https://reddit.com/r/1inch',

}

var githubTable = {


'AAVE' : 'https://github.com/aave',
'ADA' : 'https://cardanoupdates.com/',
'AKT' : '',
'ALGO' : 'https://github.com/algorand',
'ALPHA' : 'https://github.com/AlphaFinanceLab/alpha-lending-smart-contract/blob/master/documents/Alpha%20Lending%20Whitepaper.pdf',
'AMP' : 'https://github.com/amptoken',
'ANC' : 'https://github.com/Anchor-Protocol',
'ANKR' : 'https://github.com/Ankr-network',
'ANT' : '',
'AR' : 'https://github.com/ArweaveTeam/arweave',
'ARDR' : 'https://bitbucket.org/Jelurida/ardor/src',
'ARK' : 'https://github.com/ArkEcosystem',
'ARRR' : 'https://github.com/PirateNetwork',
'ATOM' : 'https://github.com/cosmos',
'AUDIO' : '',
'AVAX' : 'https://github.com/ava-labs',
'AXS' : '',
'BAKE' : 'https://github.com/BakeryProject',
'BAND' : 'https://github.com/bandprotocol',
'BAT' : '',
'BCD' : 'https://github.com/eveybcd/BitcoinDiamond',
'BCH' : 'https://gitlab.com/bitcoin-cash-node/',
'BNB' : '',
'BNT' : 'https://github.com/bancorprotocol/',
'BSV' : 'https://github.com/bitcoin-sv/bitcoin-sv',
'BTC' : 'https://github.com/bitcoin/',
'BTG' : 'https://github.com/BTCGPU/BTCGPU',
'BTT' : 'https://github.com/bittorrent',
'CAKE' : 'https://github.com/pancakeswap',
'CEL' : 'https://github.com/CelsiusNetwork',
'CELO' : 'https://github.com/celo-org/celo-monorepo/',
'CELR' : 'https://github.com/celer-network',
'CHZ' : '',
'CKB' : 'https://github.com/nervosnetwork',
'COMP' : 'https://github.com/compound-finance/compound-protocol',
'CRO' : '',
'CRV' : 'https://github.com/curvefi/curve-dao-contracts/tree/master/doc',
'CTSI' : 'https://github.com/cartesi',
'CVC' : '',
'DAG' : 'https://github.com/Constellation-Labs/constellation',
'DASH' : 'https://github.com/dashpay/dash',
'DCR' : 'https://github.com/decred',
'DENT' : '',
'DFI' : 'https://github.com/DeFiCh/ain',
'DGB' : 'https://github.com/DigiByte-Core',
'DOGE' : 'https://github.com/dogecoin/dogecoin',
'DOT' : 'https://github.com/w3f',
'DYDX' : 'https://github.com/dydxfoundation/',
'EGLD' : 'https://github.com/ElrondNetwork',
'ELF' : 'https://github.com/aelfProject',
'ENJ' : 'https://github.com/enjin/contracts',
'EOS' : 'https://github.com/eosio',
'ERG' : '',
'ETC' : 'https://github.com/ethereumclassic',
'ETH' : 'https://github.com/ethereum',
'EWT' : 'https://github.com/energywebfoundation/ewc-system-contracts',
'FET' : 'https://github.com/fetchai',
'FIL' : '',
'FLOW' : 'https://github.com/onflow',
'FTM' : 'https://github.com/Fantom-Foundation',
'FTT' : '',
'FUN' : '',
'GLM' : 'https://github.com/golemfactory/golem',
'GRT' : 'https://github.com/graphprotocol',
'GT' : 'https://github.com/gatechain',
'HBAR' : 'https://github.com/hashgraph',
'HEX' : 'https://github.com/BitcoinHEX',
'HIVE' : 'https://github.com/openhive-network/hive',
'HNT' : 'https://github.com/helium/',
'HOT' : 'https://github.com/holochain',
'HT' : '',
'ICP' : 'https://github.com/dfinity',
'ICX' : 'https://github.com/icon-project',
'INJ' : 'https://github.com/InjectiveLabs',
'IOST' : '',
'IOTX' : 'https://github.com/iotexproject/',
'KAVA' : 'https://github.com/kava-labs',
'KCS' : '',
'KEEP' : 'https://github.com/keep-network',
'KLAY' : 'https://github.com/klaytn/klaytn',
'KNC' : 'https://github.com/kybernetwork',
'KSM' : 'https://github.com/kusamanetwork',
'LEO' : '',
'LINK' : 'https://github.com/smartcontractkit/chainlink',
'LRC' : 'https://github.com/loopring',
'LSK' : 'https://github.com/LiskHQ/',
'LTC' : 'https://github.com/litecoin-project/litecoin',
'LUNA' : 'https://github.com/terra-project',
'MAID' : 'https://github.com/maidsafe',
'MANA' : 'https://github.com/decentraland',
'MATIC' : 'https://github.com/maticnetwork/',
'MBOX' : '',
'MIOTA' : 'https://github.com/iotaledger',
'MIR' : 'https://github.com/Mirror-Protocol/eth-web-app',
'MKR' : '',
'MTL' : '',
'NANO' : 'https://github.com/nanocurrency',
'NEAR' : 'https://github.com/nearprotocol/nearcore',
'NEO' : 'https://github.com/neo-project',
'NEXO' : 'https://github.com/nexofinance/NEXO-Token/',
'NKN' : 'https://github.com/nknorg',
'NMR' : 'https://github.com/numerai',
'NXM' : 'https://github.com/NexusMutual',
'OCEAN' : 'https://github.com/oceanprotocol',
'OGN' : 'https://github.com/originprotocol',
'OKB' : '',
'OMG' : 'https://github.com/omgnetwork',
'OMI' : '',
'ONE' : 'https://github.com/harmony-one',
'ONT' : 'https://github.com/ontio',
'ORBS' : 'https://github.com/orbs-network/',
'OXT' : 'https://github.com/OrchidTechnologies/orchid',
'PAXG' : 'https://github.com/paxosglobal/paxos-gold-contract',
'PERP' : '',
'PHA' : 'https://github.com/Phala-Network',
'PROM' : '',
'QNT' : 'https://github.com/quantnetwork/eth-contract-metadata',
'QTUM' : 'https://github.com/qtumproject/qtum/',
'REEF' : 'http://github.com/reef-defi',
'REN' : 'https://github.com/renproject',
'REP' : 'https://github.com/AugurProject',
'REQ' : 'https://github.com/RequestNetwork/',
'REV' : 'https://github.com/Revain',
'RLC' : 'https://github.com/iExecBlockchainComputing',
'ROSE' : 'https://github.com/oasisprotocol/oasis-core',
'RSR' : 'https://github.com/reserve-protocol',
'RUNE' : 'https://github.com/thorchain',
'RVN' : 'https://github.com/RavenProject/Ravencoin',
'SAND' : '',
'SC' : 'https://gitlab.com/NebulousLabs',
'SHIB' : '',
'SKL' : 'https://github.com/skalenetwork',
'SLP' : '',
'SNT' : 'https://github.com/status-im',
'SNX' : '',
'SOL' : 'https://github.com/solana-labs',
'SRM' : 'https://github.com/project-serum',
'STEEM' : 'https://github.com/steemit/steem',
'STMX' : 'https://github.com/StormX-Inc/crowdsale',
'STORJ' : 'https://github.com/storj/storj',
'STRAX' : 'https://github.com/stratisproject',
'STX' : 'https://github.com/blockstack',
'SUSHI' : 'https://github.com/sushiswap/sushiswap',
'SXP' : 'https://github.com/SwipeWallet',
'TEL' : 'https://github.com/telcoin',
'TFUEL' : 'https://github.com/thetatoken',
'THETA' : 'https://github.com/thetatoken',
'TRIBE' : '',
'TRX' : 'https://github.com/tronprotocol',
'TWT' : 'https://github.com/trustwallet',
'UMA' : 'https://github.com/UMAprotocol',
'UNI' : '',
'VET' : '',
'VTHO' : 'https://github.com/vechain/thor',
'WAN' : 'https://github.com/wanchain',
'WAVES' : 'https://github.com/wavesplatform/',
'WAXP' : 'https://github.com/worldwide-asset-exchange/',
'WBTC' : 'https://github.com/WrappedBTC/bitcoin-token-smart-contracts',
'WIN' : '',
'WRX' : '',
'XCH' : 'https://github.com/Chia-Network',
'XDC' : 'https://github.com/XinFinOrg/XDPoSChain',
'XEM' : 'https://github.com/nemtech',
'XLM' : 'https://github.com/stellar',
'XMR' : 'https://github.com/monero-project/monero',
'XRP' : 'https://github.com/ripple',
'XTZ' : 'https://gitlab.com/tezos/tezos',
'XVG' : 'https://github.com/vergecurrency',
'XVS' : 'https://github.com/SwipeWallet/Venus-Protocol',
'XWC' : '',
'YFI' : 'https://github.com/iearn-finance',
'ZEC' : 'https://github.com/zcash/zcash',
'ZEN' : 'https://github.com/HorizenOfficial',
'ZIL' : 'https://github.com/Zilliqa/Zilliqa',
'ZRX' : 'https://github.com/0xProject',
'1INCH' : 'https://github.com/1inch-exchange/1inch-token/',

}


var tradeTable = {

'BTC' : 'https://www.coinbase.com/price/bitcoin',
'ETH' : 'https://www.coinbase.com/price/ethereum',
'USDT' : 'https://www.coinbase.com/price/tether',
'ADA' : 'https://www.coinbase.com/price/cardano',
'SOL' : 'https://www.coinbase.com/price/solana',
'DOT' : 'https://www.coinbase.com/price/polkadot-new',
'DOGE' : 'https://www.coinbase.com/price/dogecoin',
'LUNA' : 'https://www.coinbase.com/price/terra-luna',
'UNI' : 'https://www.coinbase.com/price/uniswap',
'WBTC' : 'https://www.coinbase.com/price/wrapped-bitcoin',
'LINK' : 'https://www.coinbase.com/price/chainlink',
'AVAX' : 'https://www.coinbase.com/price/avalanche',
'LTC' : 'https://www.coinbase.com/price/litecoin',
'MATIC' : 'https://www.coinbase.com/price/polygon',
'ALGO' : 'https://www.coinbase.com/price/algorand',
'BCH' : 'https://www.coinbase.com/price/bitcoin-cash',
'AXS' : 'https://www.coinbase.com/price/axie-infinity',
'XLM' : 'https://www.coinbase.com/price/stellar',
'ATOM' : 'https://www.coinbase.com/price/cosmos',
'ICP' : 'https://www.coinbase.com/price/internet-computer',
'FIL' : 'https://www.coinbase.com/price/filecoin',
'ETC' : 'https://www.coinbase.com/price/ethereum-classic',
'DAI' : 'https://www.coinbase.com/price/multi-collateral-dai',
'XTZ' : 'https://www.coinbase.com/price/tezos',
'MANA' : 'https://www.coinbase.com/price/decentraland',
'GRT' : 'https://www.coinbase.com/price/the-graph',
'EOS' : 'https://www.coinbase.com/price/eos',
'AAVE' : 'https://www.coinbase.com/price/aave',
'QNT' : 'https://www.coinbase.com/price/quant',
'UST' : 'https://www.coinbase.com/price/terrausd',
'ENJ' : 'https://www.coinbase.com/price/enjin-coin',
'CHZ' : 'https://www.coinbase.com/price/chiliz',
'MKR' : 'https://www.coinbase.com/price/maker',
'CRV' : 'https://www.coinbase.com/price/curve-dao-token',
'CELO' : 'https://www.coinbase.com/price/celo',
'ZEC' : 'https://www.coinbase.com/price/zcash',
'OMG' : 'https://www.coinbase.com/price/omg',
'COMP' : 'https://www.coinbase.com/price/compound',
'DASH' : 'https://www.coinbase.com/price/dash',
'AMP' : 'https://www.coinbase.com/price/amp',
'BAT' : 'https://www.coinbase.com/price/basic-attention-token',
'SHIB' : 'https://www.coinbase.com/price/shiba-inu',
'SUSHI' : 'https://www.coinbase.com/price/sushiswap',
'YFI' : 'https://www.coinbase.com/price/yearn-finance',
'PERP' : 'https://www.coinbase.com/price/perpetual-protocol',
'SNX' : 'https://www.coinbase.com/price/synthetix-network-token',
'BNT' : 'https://www.coinbase.com/price/bancor',
'REN' : 'https://www.coinbase.com/price/ren',
'ZRX' : 'https://www.coinbase.com/price/0x',
'USDP' : 'https://www.coinbase.com/price/paxos-standard',
'ZEN' : 'https://www.coinbase.com/price/horizen',
'1INCH' : 'https://www.coinbase.com/price/1inch',
'RLY' : 'https://www.coinbase.com/price/rally',
'LRC' : 'https://www.coinbase.com/price/loopring',
'ANKR' : 'https://www.coinbase.com/price/ankr',
'UMA' : 'https://www.coinbase.com/price/uma',
'SKL' : 'https://www.coinbase.com/price/skale-network',
'NU' : 'https://www.coinbase.com/price/nucypher',
'IOTX' : 'https://www.coinbase.com/price/iotex',
'LPT' : 'https://www.coinbase.com/price/livepeer',
'JASMY' : 'https://www.coinbase.com/price/jasmy',
'FET' : 'https://www.coinbase.com/price/fetch',
'POLY' : 'https://www.coinbase.com/price/polymath-network',
'COTI' : 'https://www.coinbase.com/price/coti',
'BTRST' : 'https://www.coinbase.com/price/braintrust',
'RGT' : 'https://www.coinbase.com/price/rari-governance-token',
'STORJ' : 'https://www.coinbase.com/price/storj',
'NMR' : 'https://www.coinbase.com/price/numeraire',
'TRIBE' : 'https://www.coinbase.com/price/tribe',
'KEEP' : 'https://www.coinbase.com/price/keep-network',
'XYO' : 'https://www.coinbase.com/price/xyo',
'CTSI' : 'https://www.coinbase.com/price/cartesi',
'OGN' : 'https://www.coinbase.com/price/origin-protocol',
'TRU' : 'https://www.coinbase.com/price/truefi-token',
'RLC' : 'https://www.coinbase.com/price/rlc',
'KNC' : 'https://www.coinbase.com/price/kyber-network-crystal-v2',
'MASK' : 'https://www.coinbase.com/price/mask-network',
'BAND' : 'https://www.coinbase.com/price/band-protocol',
'OXT' : 'https://www.coinbase.com/price/orchid',
'NKN' : 'https://www.coinbase.com/price/nkn',
'BADGER' : 'https://www.coinbase.com/price/badger-dao',
'PLA' : 'https://www.coinbase.com/price/playdapp',
'REP' : 'https://www.coinbase.com/price/augur',
'MIR' : 'https://www.coinbase.com/price/mirror-protocol',
'AGLD' : 'https://www.coinbase.com/price/adventure-gold',
'MLN' : 'https://www.coinbase.com/price/enzyme',
'ORN' : 'https://www.coinbase.com/price/orion-protocol',
'FUN' : 'https://www.coinbase.com/price/funtoken',
'RAD' : 'https://www.coinbase.com/price/radicle',
'REQ' : 'https://www.coinbase.com/price/request',
'ACH' : 'https://www.coinbase.com/price/alchemy-pay',
'CFG' : 'https://www.coinbase.com/price/centrifuge',
'BAL' : 'https://www.coinbase.com/price/balancer',
'ARPA' : 'https://www.coinbase.com/price/arpa-chain',
'DDX' : 'https://www.coinbase.com/price/derivadao',
'YFII' : 'https://www.coinbase.com/price/yearn-finance-ii',
'CLV' : 'https://www.coinbase.com/price/clover',
'QUICK' : 'https://www.coinbase.com/price/quickswap',
'BOND' : 'https://www.coinbase.com/price/barnbridge',
'FORTH' : 'https://www.coinbase.com/price/ampleforth-governance-token',
'ASM' : 'https://www.coinbase.com/price/assemble-protocol',
'GTC' : 'https://www.coinbase.com/price/gitcoin',
'TRB' : 'https://www.coinbase.com/price/tellor',
'RARI' : 'https://www.coinbase.com/price/rarible',
'FARM' : 'https://www.coinbase.com/price/harvest-finance',
'RAI' : 'https://www.coinbase.com/price/rai',
'AUCTION' : 'https://www.coinbase.com/price/bounce-token'

 }




var binancetradeTable = {

'BTC' : 'https://binance.com/en/trade/btc_usdt',
'ETH' : 'https://binance.com/en/trade/eth_usdt',
'BNB' : 'https://binance.com/en/trade/bnb_usdt',
'BUSD' : 'https://binance.com/en/trade/busd_usdt',
'SOL' : 'https://binance.com/en/trade/sol_usdt',
'ADA' : 'https://binance.com/en/trade/ada_usdt',
'XRP' : 'https://binance.com/en/trade/xrp_usdt',
'DOT' : 'https://binance.com/en/trade/dot_usdt',
'DOGE' : 'https://binance.com/en/trade/doge_usdt',
'SHIB' : 'https://binance.com/en/trade/shib_usdt',
'LUNA' : 'https://binance.com/en/trade/luna_usdt',
'AVAX' : 'https://binance.com/en/trade/avax_usdt',
'UNI' : 'https://binance.com/en/trade/uni_usdt',
'LINK' : 'https://binance.com/en/trade/link_usdt',
'WBTC' : 'https://binance.com/en/trade/wbtc_usdt',
'LTC' : 'https://binance.com/en/trade/ltc_usdt',
'MATIC' : 'https://binance.com/en/trade/matic_usdt',
'ALGO' : 'https://binance.com/en/trade/algo_usdt',
'BCH' : 'https://binance.com/en/trade/bch_usdt',
'VET' : 'https://binance.com/en/trade/vet_usdt',
'AXS' : 'https://binance.com/en/trade/axs_usdt',
'XLM' : 'https://binance.com/en/trade/xlm_usdt',
'ICP' : 'https://binance.com/en/trade/icp_usdt',
'CRO' : 'https://binance.com/en/trade/cro_usdt',
'ATOM' : 'https://binance.com/en/trade/atom_usdt',
'THETA' : 'https://binance.com/en/trade/theta_usdt',
'FIL' : 'https://binance.com/en/trade/fil_usdt',
'TRX' : 'https://binance.com/en/trade/trx_usdt',
'FTT' : 'https://binance.com/en/trade/ftt_usdt',
'ETC' : 'https://binance.com/en/trade/etc_usdt',
'FTM' : 'https://binance.com/en/trade/ftm_usdt',
'DAI' : 'https://binance.com/en/trade/dai_usdt',
'EGLD' : 'https://binance.com/en/trade/egld_usdt',
'HBAR' : 'https://binance.com/en/trade/hbar_usdt',
'XTZ' : 'https://binance.com/en/trade/xtz_usdt',
'NEAR' : 'https://binance.com/en/trade/near_usdt',
'MANA' : 'https://binance.com/en/trade/mana_usdt',
'GRT' : 'https://binance.com/en/trade/grt_usdt',
'XMR' : 'https://binance.com/en/trade/xmr_usdt',
'CAKE' : 'https://binance.com/en/trade/cake_usdt',
'EOS' : 'https://binance.com/en/trade/eos_usdt',
'FLOW' : 'https://binance.com/en/trade/flow_usdt',
'AAVE' : 'https://binance.com/en/trade/aave_usdt',
'KLAY' : 'https://binance.com/en/trade/klay_usdt',
'KSM' : 'https://binance.com/en/trade/ksm_usdt',
'MIOTA' : 'https://binance.com/en/trade/miota_usdt',
'XEC' : 'https://binance.com/en/trade/xec_usdt',
'HNT' : 'https://binance.com/en/trade/hnt_usdt',
'BSV' : 'https://binance.com/en/trade/bsv_usdt',
'LEO' : 'https://binance.com/en/trade/leo_usdt',
'NEO' : 'https://binance.com/en/trade/neo_usdt',
'QNT' : 'https://binance.com/en/trade/qnt_usdt',
'MKR' : 'https://binance.com/en/trade/mkr_usdt',
'CHZ' : 'https://binance.com/en/trade/chz_usdt',
'ENJ' : 'https://binance.com/en/trade/enj_usdt',
'AR' : 'https://binance.com/en/trade/ar_usdt',
'WAVES' : 'https://binance.com/en/trade/waves_usdt',
'AMP' : 'https://binance.com/en/trade/amp_usdt',
'BTT' : 'https://binance.com/en/trade/btt_usdt',
'STX' : 'https://binance.com/en/trade/stx_usdt',
'SAND' : 'https://binance.com/en/trade/sand_usdt',
'OMG' : 'https://binance.com/en/trade/omg_usdt',
'CELO' : 'https://binance.com/en/trade/celo_usdt',
'ZEC' : 'https://binance.com/en/trade/zec_usdt',
'COMP' : 'https://binance.com/en/trade/comp_usdt',
'KDA' : 'https://binance.com/en/trade/kda_usdt',
'TFUEL' : 'https://binance.com/en/trade/tfuel_usdt',
'DASH' : 'https://binance.com/en/trade/dash_usdt',
'XEM' : 'https://binance.com/en/trade/xem_usdt',
'LRC' : 'https://binance.com/en/trade/lrc_usdt',
'CRV' : 'https://binance.com/en/trade/crv_usdt',
'QTUM' : 'https://binance.com/en/trade/qtum_usdt',
'HT' : 'https://binance.com/en/trade/ht_usdt',
'NEXO' : 'https://binance.com/en/trade/nexo_usdt',
'OKB' : 'https://binance.com/en/trade/okb_usdt',
'BAT' : 'https://binance.com/en/trade/bat_usdt',
'SUSHI' : 'https://binance.com/en/trade/sushi_usdt',
'KCS' : 'https://binance.com/en/trade/kcs_usdt',
'DCR' : 'https://binance.com/en/trade/dcr_usdt',
'ICX' : 'https://binance.com/en/trade/icx_usdt',
'RVN' : 'https://binance.com/en/trade/rvn_usdt',
'AUDIO' : 'https://binance.com/en/trade/audio_usdt',
'ZIL' : 'https://binance.com/en/trade/zil_usdt',
'YFI' : 'https://binance.com/en/trade/yfi_usdt',
'MINA' : 'https://binance.com/en/trade/mina_usdt',
'PERP' : 'https://binance.com/en/trade/perp_usdt',
'TEL' : 'https://binance.com/en/trade/tel_usdt',
'XDC' : 'https://binance.com/en/trade/xdc_usdt',
'SNX' : 'https://binance.com/en/trade/snx_usdt',
'BTG' : 'https://binance.com/en/trade/btg_usdt',
'CEL' : 'https://binance.com/en/trade/cel_usdt',
'IOTX' : 'https://binance.com/en/trade/iotx_usdt',
'ZRX' : 'https://binance.com/en/trade/zrx_usdt',
'SRM' : 'https://binance.com/en/trade/srm_usdt',
'ANKR' : 'https://binance.com/en/trade/ankr_usdt',
'BNT' : 'https://binance.com/en/trade/bnt_usdt',
'ZEN' : 'https://binance.com/en/trade/zen_usdt',
'WAXP' : 'https://binance.com/en/trade/waxp_usdt',
'SC' : 'https://binance.com/en/trade/sc_usdt',
'REN' : 'https://binance.com/en/trade/ren_usdt',
'ONT' : 'https://binance.com/en/trade/ont_usdt',
'SKL' : 'https://binance.com/en/trade/skl_usdt',
'IOST' : 'https://binance.com/en/trade/iost_usdt',
'DYDX' : 'https://binance.com/en/trade/dydx_usdt',
'XYO' : 'https://binance.com/en/trade/xyo_usdt',
'UMA' : 'https://binance.com/en/trade/uma_usdt',
'TRAC' : 'https://binance.com/en/trade/trac_usdt',
'DGB' : 'https://binance.com/en/trade/dgb_usdt',
'1INCH' : 'https://binance.com/en/trade/1inch_usdt',
'NANO' : 'https://binance.com/en/trade/nano_usdt',
'CKB' : 'https://binance.com/en/trade/ckb_usdt',
'CELR' : 'https://binance.com/en/trade/celr_usdt',
'DENT' : 'https://binance.com/en/trade/dent_usdt',
'CHSB' : 'https://binance.com/en/trade/chsb_usdt',
'FET' : 'https://binance.com/en/trade/fet_usdt',
'USDN' : 'https://binance.com/en/trade/usdn_usdt',
'OCEAN' : 'https://binance.com/en/trade/ocean_usdt',
'STORJ' : 'https://binance.com/en/trade/storj_usdt',
'KAVA' : 'https://binance.com/en/trade/kava_usdt',
'WIN' : 'https://binance.com/en/trade/win_usdt',
'RSR' : 'https://binance.com/en/trade/rsr_usdt',
'GLM' : 'https://binance.com/en/trade/glm_usdt',
'POLY' : 'https://binance.com/en/trade/poly_usdt',
'INJ' : 'https://binance.com/en/trade/inj_usdt',
'ALPHA' : 'https://binance.com/en/trade/alpha_usdt',
'GT' : 'https://binance.com/en/trade/gt_usdt',
'REEF' : 'https://binance.com/en/trade/reef_usdt',
'DOTUP' : 'https://www.binance.com/en/trade/DOTUP_USDT',
'ETHUP' : 'https://www.binance.com/en/trade/ETHUP_USDT',
'BNBUP' : 'https://www.binance.com/en/trade/BNBUP_USDT',
'XRPUP' : 'https://www.binance.com/en/trade/XRPUP_USDT',
'LINKUP' : 'https://www.binance.com/en/trade/LINKUP_USDT',
'ADAUP' : 'https://www.binance.com/en/trade/ADAUP_USDT',
'ADADOWN' : 'https://www.binance.com/en/trade/ADADOWN_USDT',
'LINKDOWN' : 'https://www.binance.com/en/trade/LINKDOWN_USDT',
'ETHDOWN' : 'https://www.binance.com/en/trade/ETHDOWN_USDT',
'BNBDOWN' : 'https://www.binance.com/en/trade/BNBDOWN_USDT',
'XRPDOWN' : 'https://www.binance.com/en/trade/XRPDOWN_USDT',
'DOTDOWN' : 'https://www.binance.com/en/trade/DOTDOWN_USDT',
'TRXDOWN' : 'https://www.binance.com/en/trade/TRXDOWN_USDT',
'TRXUP' : 'https://www.binance.com/en/trade/TRXUP_USDT',
'BTCUP' : 'https://www.binance.com/en/trade/BTCUP_USDT',
'BTCDOWN' : 'https://www.binance.com/en/trade/BTCDOWN_USDT'

 }


var geminitradeTable = {

'BTC' : 'https://www.gemini.com/prices/bitcoin',
'ETH' : 'https://www.gemini.com/prices/ether',
'GUSD' : 'https://www.gemini.com/prices/gemini-dollar',
'SHIB' : 'https://www.gemini.com/prices/shiba-inu',
'DOGE' : 'https://www.gemini.com/prices/dogecoin',
'USDC' : 'https://www.gemini.com/prices/usd-coin',
'LUNA' : 'https://www.gemini.com/prices/terra',
'UNI' : 'https://www.gemini.com/prices/uniswap',
'LTC' : 'https://www.gemini.com/prices/litecoin',
'LINK' : 'https://www.gemini.com/prices/chainlink',
'BCH' : 'https://www.gemini.com/prices/bitcoin-cash',
'MATIC' : 'https://www.gemini.com/prices/polygon',
'AXS' : 'https://www.gemini.com/prices/axie-infinity',
'FIL' : 'https://www.gemini.com/prices/filecoin',
'DAI' : 'https://www.gemini.com/prices/dai',
'FTM' : 'https://www.gemini.com/prices/fantom',
'XTZ' : 'https://www.gemini.com/prices/tezos',
'AAVE' : 'https://www.gemini.com/prices/aave',
'GRT' : 'https://www.gemini.com/prices/the-graph',
'QNT' : 'https://www.gemini.com/prices/quant',
'UST' : 'https://www.gemini.com/prices/terrausd',
'AMP' : 'https://www.gemini.com/prices/amp',
'MKR' : 'https://www.gemini.com/prices/maker',
'SUSHI' : 'https://www.gemini.com/prices/sushiswap',
'COMP' : 'https://www.gemini.com/prices/compound',
'ZEC' : 'https://www.gemini.com/prices/zcash',
'SNX' : 'https://www.gemini.com/prices/synthetix',
'ENJ' : 'https://www.gemini.com/prices/enjin-coin',
'YFI' : 'https://www.gemini.com/prices/yearn.finance',
'CRV' : 'https://www.gemini.com/prices/curve',
'BAT' : 'https://www.gemini.com/prices/basic-attention-token',
'MANA' : 'https://www.gemini.com/prices/decentraland',
'REN' : 'https://www.gemini.com/prices/ren',
'BNT' : 'https://www.gemini.com/prices/bancor-network',
'UMA' : 'https://www.gemini.com/prices/uma',
'ZRX' : 'https://www.gemini.com/prices/0x',
'AUDIO' : 'https://www.gemini.com/prices/audius',
'ANKR' : 'https://www.gemini.com/prices/ankr-network',
'SKL' : 'https://www.gemini.com/prices/skale',
'LPT' : 'https://www.gemini.com/prices/livepeer',
'1INCH' : 'https://www.gemini.com/prices/1inch',
'SAND' : 'https://www.gemini.com/prices/the-sandbox',
'LRC' : 'https://www.gemini.com/prices/loopring',
'FET' : 'https://www.gemini.com/prices/fetch.ai',
'INJ' : 'https://www.gemini.com/prices/injective-protocol',
'RARE' : 'https://www.gemini.com/prices/superrare',
'MASK' : 'https://www.gemini.com/prices/mask-network',
'PAXG' : 'https://www.gemini.com/prices/pax-gold',
'OXT' : 'https://www.gemini.com/prices/orchid',
'MIR' : 'https://www.gemini.com/prices/mirror-protocol',
'RAD' : 'https://www.gemini.com/prices/radicle',
'ALCX' : 'https://www.gemini.com/prices/alchemix',
'NMR' : 'https://www.gemini.com/prices/numeraire',
'BAL' : 'https://www.gemini.com/prices/balancer',
'WCFG' : 'https://www.gemini.com/prices/wrapped-centrifuge',
'API3' : 'https://www.gemini.com/prices/api3',
'STORJ' : 'https://www.gemini.com/prices/storj',
'KNC' : 'https://www.gemini.com/prices/kyber-network',
'SLP' : 'https://www.gemini.com/prices/smooth-love-potion',
'BOND' : 'https://www.gemini.com/prices/barnbridge',
'CTX' : 'https://www.gemini.com/prices/cryptex-finance',
'CUBE' : 'https://www.gemini.com/prices/somnium-space',
'ASH' : 'https://www.gemini.com/prices/burn',
'MCO2' : 'https://www.gemini.com/prices/moss-carbon-credit',
'EFIL' : 'https://www.gemini.com/prices/wrapped-filecoin'

 }





var upholdtradeTable = {

'AAVE' : 'https://uphold.com/en-us/assets/crypto/buy-aave',
'ADA' : 'https://uphold.com/en-us/assets/crypto/buy-cardano',
'ATOM' : 'https://uphold.com/en-us/assets/crypto/buy-atom',
'AXS' : 'https://uphold.com/en-us/assets/crypto/buy-axs',
'BAL' : 'https://uphold.com/en-us/assets/crypto/buy-balancer',
'BAT' : 'https://uphold.com/en-us/assets/crypto/buy-bat',
'BCH' : 'https://uphold.com/en-us/assets/crypto/buy-btc',
'BTC' : 'https://uphold.com/en-us/assets/crypto/buy-btc',
'BTG' : 'https://uphold.com/en-us/assets/crypto/buy-btg',
'COMP' : 'https://uphold.com/en-us/assets/crypto/buy-comp',
'CRV' : 'https://uphold.com/en-us/assets/crypto/buy-crv',
'CSPR' : 'https://uphold.com/en-us/assets/crypto/buy-casper',
'DASH' : 'https://uphold.com/en-us/assets/crypto/buy-dash',
'DCR' : 'https://uphold.com/en-us/assets/crypto/buy-decred',
'DGB' : 'https://uphold.com/en-us/assets/crypto/buy-dgb',
'DOGE' : 'https://uphold.com/en-us/assets/crypto/buy-dogecoin',
'DOT' : 'https://uphold.com/en-us/assets/crypto/buy-polkadot',
'ENJ' : 'https://uphold.com/en-us/assets/crypto/buy-enjin',
'EOS' : 'https://uphold.com/en-us/assets/crypto/buy-eos',
'ETH' : 'https://uphold.com/en-us/assets/crypto/buy-eth',
'FIL' : 'https://uphold.com/en-us/assets/crypto/buy-filecoin',
'FLOW' : 'https://uphold.com/en-us/assets/crypto/buy-flow',
'GRT' : 'https://uphold.com/en-us/assets/crypto/buy-grt',
'HBAR' : 'https://uphold.com/en-us/assets/crypto/buy-hbar',
'HNT' : 'https://uphold.com/en-us/assets/crypto/buy-hnt',
'LINK' : 'https://uphold.com/en-us/assets/crypto/buy-link',
'LTC' : 'https://uphold.com/en-us/assets/crypto/buy-ltc',
'LUNA' : 'https://uphold.com/en-us/assets/crypto/buy-luna',
'MATIC' : 'https://uphold.com/en-us/assets/crypto/buy-matic',
'MIOTA' : 'https://uphold.com/en-us/assets/crypto/buy-miota',
'MKR' : 'https://uphold.com/en-us/assets/crypto/buy-maker',
'NANO' : 'https://uphold.com/en-us/assets/crypto/buy-nano',
'NEO' : 'https://uphold.com/en-us/assets/crypto/buy-neo',
'OMG' : 'https://uphold.com/en-us/assets/crypto/buy-omg',
'OXT' : 'https://uphold.com/en-us/assets/crypto/buy-oxt',
'REN' : 'https://uphold.com/en-us/assets/crypto/buy-ren',
'RUNE' : 'https://uphold.com/en-us/assets/crypto/buy-rune',
'SAND' : 'https://uphold.com/en-us/assets/crypto/buy-sand',
'SNX' : 'https://uphold.com/en-us/assets/crypto/buy-synthetix',
'SOL' : 'https://uphold.com/en-us/assets/crypto/buy-solana',
'SRM' : 'https://uphold.com/en-us/assets/crypto/buy-srm',
'SUSHI' : 'https://uphold.com/en-us/assets/crypto/buy-sushiswap',
'THETA' : 'https://uphold.com/en-us/assets/crypto/buy-theta',
'TRX' : 'https://uphold.com/en-us/assets/crypto/buy-trx',
'UMA' : 'https://uphold.com/en-us/assets/crypto/buy-uma',
'UNI' : 'https://uphold.com/en-us/assets/crypto/buy-uni',
'VET' : 'https://uphold.com/en-us/assets/crypto/buy-vechain',
'WBTC' : 'https://uphold.com/en-us/assets/crypto/buy-wrapped-bitcoin',
'XCH' : 'https://uphold.com/en-us/assets/crypto/buy-xch',
'XEM' : 'https://uphold.com/en-us/assets/crypto/buy-xem',
'XLM' : 'https://uphold.com/en-us/assets/crypto/buy-xlm',
'XRP' : 'https://uphold.com/en-us/assets/crypto/buy-xrp',
'XTZ' : 'https://uphold.com/en-us/assets/crypto/buy-xtz',
'ZIL' : 'https://uphold.com/en-us/assets/crypto/buy-zilliqa',
'ZRX' : 'https://uphold.com/en-us/assets/crypto/buy-0x',
'XLM' : 'https://uphold.com/en-us/assets/crypto/buy-xlm',
'XRP' : 'https://uphold.com/en-us/assets/crypto/buy-xrp',
'XTZ' : 'https://uphold.com/en-us/assets/crypto/buy-xtz',
'ZIL' : 'https://uphold.com/en-us/assets/crypto/buy-zil',
'ZRX' : 'https://uphold.com/en-us/assets/crypto/buy-zrx',
'UPT' : 'https://uphold.com/en-us/assets/crypto/buy-upt',
'BTC0' : 'https://uphold.com/en-us/assets/crypto/buy-btc0',
'UPBTC' : 'https://uphold.com/en-us/assets/crypto/buy-upbtc',
'UPCO2' : 'https://uphold.com/en-us/assets/crypto/buy-upco2'

 }




var kucointradeTable = {

'BTC' : 'https://trade.kucoin.com/trade/BTC-USDT',
'LUNA' : 'https://trade.kucoin.com/trade/LUNA-USDT',
'ETH' : 'https://trade.kucoin.com/trade/ETH-USDT',
'XRP' : 'https://trade.kucoin.com/trade/XRP-USDT',
'MATIC' : 'https://trade.kucoin.com/trade/MATIC-USDT',
'AVAX' : 'https://trade.kucoin.com/trade/AVAX-USDT',
'PYR' : 'https://trade.kucoin.com/trade/PYR-USDT',
'ONE' : 'https://trade.kucoin.com/trade/ONE-USDT',
'KDA' : 'https://trade.kucoin.com/trade/KDA-USDT',
'SOL' : 'https://trade.kucoin.com/trade/SOL-USDT',
'ADA' : 'https://trade.kucoin.com/trade/ADA-USDT',
'HTR' : 'https://trade.kucoin.com/trade/HTR-USDT',
'SHIB' : 'https://trade.kucoin.com/trade/SHIB-USDT',
'MANA' : 'https://trade.kucoin.com/trade/MANA-USDT',
'DOT' : 'https://trade.kucoin.com/trade/DOT-USDT',
'SAND' : 'https://trade.kucoin.com/trade/SAND-USDT',
'FTM' : 'https://trade.kucoin.com/trade/FTM-USDT',
'BNB' : 'https://trade.kucoin.com/trade/BNB-USDT',
'VRA' : 'https://trade.kucoin.com/trade/VRA-USDT',
'VR' : 'https://trade.kucoin.com/trade/VR-USDT',
'LTC' : 'https://trade.kucoin.com/trade/LTC-USDT',
'HBAR' : 'https://trade.kucoin.com/trade/HBAR-USDT',
'BLOK' : 'https://trade.kucoin.com/trade/BLOK-USDT',
'USDC' : 'https://trade.kucoin.com/trade/USDC-USDT',
'DOGE' : 'https://trade.kucoin.com/trade/DOGE-USDT',
'CRO' : 'https://trade.kucoin.com/trade/CRO-USDT',
'XLM' : 'https://trade.kucoin.com/trade/XLM-USDT',
'KCS' : 'https://trade.kucoin.com/trade/KCS-USDT',
'TRX' : 'https://trade.kucoin.com/trade/TRX-USDT',
'NEAR' : 'https://trade.kucoin.com/trade/NEAR-USDT',
'LINK' : 'https://trade.kucoin.com/trade/LINK-USDT',
'CRV' : 'https://trade.kucoin.com/trade/CRV-USDT',
'RNDR' : 'https://trade.kucoin.com/trade/RNDR-USDT',
'ROSE' : 'https://trade.kucoin.com/trade/ROSE-USDT',
'KOK' : 'https://trade.kucoin.com/trade/KOK-USDT',
'VET' : 'https://trade.kucoin.com/trade/VET-USDT',
'EOS' : 'https://trade.kucoin.com/trade/EOS-USDT',
'YFI' : 'https://trade.kucoin.com/trade/YFI-USDT',
'ATOM' : 'https://trade.kucoin.com/trade/ATOM-USDT',
'XYO' : 'https://trade.kucoin.com/trade/XYO-USDT',
'EGLD' : 'https://trade.kucoin.com/trade/EGLD-USDT',
'XPR' : 'https://trade.kucoin.com/trade/XPR-USDT',
'QNT' : 'https://trade.kucoin.com/trade/QNT-USDT',
'ILA' : 'https://trade.kucoin.com/trade/ILA-USDT',
'TRIAS' : 'https://trade.kucoin.com/trade/TRIAS-USDT',
'RMRK' : 'https://trade.kucoin.com/trade/RMRK-USDT',
'QRDO' : 'https://trade.kucoin.com/trade/QRDO-USDT',
'GALAX' : 'https://trade.kucoin.com/trade/GALAX-USDT',
'LRC' : 'https://trade.kucoin.com/trade/LRC-USDT',
'ICP' : 'https://trade.kucoin.com/trade/ICP-USDT',
'ALGO' : 'https://trade.kucoin.com/trade/ALGO-USDT',
'FLUX' : 'https://trade.kucoin.com/trade/FLUX-USDT',
'MOVR' : 'https://trade.kucoin.com/trade/MOVR-USDT',
'GRT' : 'https://trade.kucoin.com/trade/GRT-USDT',
'TEL' : 'https://trade.kucoin.com/trade/TEL-USDT',
'GODS' : 'https://trade.kucoin.com/trade/GODS-USDT',
'CHMB' : 'https://trade.kucoin.com/trade/CHMB-USDT',
'UOS' : 'https://trade.kucoin.com/trade/UOS-USDT',
'STRONG' : 'https://trade.kucoin.com/trade/STRONG-USDT',
'CBC' : 'https://trade.kucoin.com/trade/CBC-USDT',
'ZKT' : 'https://trade.kucoin.com/trade/ZKT-USDT',
'HERO' : 'https://trade.kucoin.com/trade/HERO-USDT',
'CWAR' : 'https://trade.kucoin.com/trade/CWAR-USDT',
'FTG' : 'https://trade.kucoin.com/trade/FTG-USDT',
'MIR' : 'https://trade.kucoin.com/trade/MIR-USDT',
'NAKA' : 'https://trade.kucoin.com/trade/NAKA-USDT',
'SHILL' : 'https://trade.kucoin.com/trade/SHILL-USDT',
'FLAME' : 'https://trade.kucoin.com/trade/FLAME-USDT',
'PBX' : 'https://trade.kucoin.com/trade/PBX-USDT',
'FIL' : 'https://trade.kucoin.com/trade/FIL-USDT',
'IOTX' : 'https://trade.kucoin.com/trade/IOTX-USDT',
'THETA' : 'https://trade.kucoin.com/trade/THETA-USDT',
'AR' : 'https://trade.kucoin.com/trade/AR-USDT',
'ENJ' : 'https://trade.kucoin.com/trade/ENJ-USDT',
'ELON' : 'https://trade.kucoin.com/trade/ELON-USDT',
'MNET' : 'https://trade.kucoin.com/trade/MNET-USDT',
'IMX' : 'https://trade.kucoin.com/trade/IMX-USDT',
'COTI' : 'https://trade.kucoin.com/trade/COTI-USDT',
'XTZ' : 'https://trade.kucoin.com/trade/XTZ-USDT',
'XMR' : 'https://trade.kucoin.com/trade/XMR-USDT',
'RUNE' : 'https://trade.kucoin.com/trade/RUNE-USDT',
'SUSHI' : 'https://trade.kucoin.com/trade/SUSHI-USDT',
'1EARTH' : 'https://trade.kucoin.com/trade/1EARTH-USDT',
'POLC' : 'https://trade.kucoin.com/trade/POLC-USDT',
'WAX' : 'https://trade.kucoin.com/trade/WAX-USDT',
'GLCH' : 'https://trade.kucoin.com/trade/GLCH-USDT',
'WOO' : 'https://trade.kucoin.com/trade/WOO-USDT',
'UFO' : 'https://trade.kucoin.com/trade/UFO-USDT',
'SFUND' : 'https://trade.kucoin.com/trade/SFUND-USDT',
'CELO' : 'https://trade.kucoin.com/trade/CELO-USDT',
'CKB' : 'https://trade.kucoin.com/trade/CKB-USDT',
'AAVE' : 'https://trade.kucoin.com/trade/AAVE-USDT',
'JASMY' : 'https://trade.kucoin.com/trade/JASMY-USDT',
'CIRUS' : 'https://trade.kucoin.com/trade/CIRUS-USDT',
'ZEC' : 'https://trade.kucoin.com/trade/ZEC-USDT',
'IOI' : 'https://trade.kucoin.com/trade/IOI-USDT',
'MTV' : 'https://trade.kucoin.com/trade/MTV-USDT',
'SOUL' : 'https://trade.kucoin.com/trade/SOUL-USDT',
'RSR' : 'https://trade.kucoin.com/trade/RSR-USDT',
'STX' : 'https://trade.kucoin.com/trade/STX-USDT',
'SLP' : 'https://trade.kucoin.com/trade/SLP-USDT',
'SUPER' : 'https://trade.kucoin.com/trade/SUPER-USDT',
'BTT' : 'https://trade.kucoin.com/trade/BTT-USDT',
'ANC' : 'https://trade.kucoin.com/trade/ANC-USDT',
'WILD' : 'https://trade.kucoin.com/trade/WILD-USDT',
'UNI' : 'https://trade.kucoin.com/trade/UNI-USDT',
'LYXe' : 'https://trade.kucoin.com/trade/LYXe-USDT',
'CERE' : 'https://trade.kucoin.com/trade/CERE-USDT',
'CAKE' : 'https://trade.kucoin.com/trade/CAKE-USDT',
'SHA' : 'https://trade.kucoin.com/trade/SHA-USDT',
'DYDX' : 'https://trade.kucoin.com/trade/DYDX-USDT',
'NUM' : 'https://trade.kucoin.com/trade/NUM-USDT',
'API3' : 'https://trade.kucoin.com/trade/API3-USDT',
'ALICE' : 'https://trade.kucoin.com/trade/ALICE-USDT',
'DFI' : 'https://trade.kucoin.com/trade/DFI-USDT',
'RFOX' : 'https://trade.kucoin.com/trade/RFOX-USDT',
'LSS' : 'https://trade.kucoin.com/trade/LSS-USDT',
'XTM' : 'https://trade.kucoin.com/trade/XTM-USDT',
'DREAMS' : 'https://trade.kucoin.com/trade/DREAMS-USDT',
'REEF' : 'https://trade.kucoin.com/trade/REEF-USDT',
'SCLP' : 'https://trade.kucoin.com/trade/SCLP-USDT',
'CRPT' : 'https://trade.kucoin.com/trade/CRPT-USDT',
'ISP' : 'https://trade.kucoin.com/trade/ISP-USDT',
'XDC' : 'https://trade.kucoin.com/trade/XDC-USDT',
'AUDIO' : 'https://trade.kucoin.com/trade/AUDIO-USDT',
'1INCH' : 'https://trade.kucoin.com/trade/1INCH-USDT',
'REAP' : 'https://trade.kucoin.com/trade/REAP-USDT',
'ENS' : 'https://trade.kucoin.com/trade/ENS-USDT',
'FALCONS' : 'https://trade.kucoin.com/trade/FALCONS-USDT',
'XAVA' : 'https://trade.kucoin.com/trade/XAVA-USDT',
'XNL' : 'https://trade.kucoin.com/trade/XNL-USDT',
'WIN' : 'https://trade.kucoin.com/trade/WIN-USDT',
'CIX100' : 'https://trade.kucoin.com/trade/CIX100-USDT',
'CHZ' : 'https://trade.kucoin.com/trade/CHZ-USDT',
'TLM' : 'https://trade.kucoin.com/trade/TLM-USDT',
'COMP' : 'https://trade.kucoin.com/trade/COMP-USDT',
'SUKU' : 'https://trade.kucoin.com/trade/SUKU-USDT',
'TOKO' : 'https://trade.kucoin.com/trade/TOKO-USDT',
'EXRD' : 'https://trade.kucoin.com/trade/EXRD-USDT',
'ACE' : 'https://trade.kucoin.com/trade/ACE-USDT',
'BCH' : 'https://trade.kucoin.com/trade/BCH-USDT',
'POL' : 'https://trade.kucoin.com/trade/POL-USDT',
'CPOOL' : 'https://trade.kucoin.com/trade/CPOOL-USDT',
'EWT' : 'https://trade.kucoin.com/trade/EWT-USDT',
'XCAD' : 'https://trade.kucoin.com/trade/XCAD-USDT',
'OGN' : 'https://trade.kucoin.com/trade/OGN-USDT',
'LPT' : 'https://trade.kucoin.com/trade/LPT-USDT',
'NTVRK' : 'https://trade.kucoin.com/trade/NTVRK-USDT',
'HAI' : 'https://trade.kucoin.com/trade/HAI-USDT',
'GHX' : 'https://trade.kucoin.com/trade/GHX-USDT',
'KSM' : 'https://trade.kucoin.com/trade/KSM-USDT',
'XTAG' : 'https://trade.kucoin.com/trade/XTAG-USDT',
'CQT' : 'https://trade.kucoin.com/trade/CQT-USDT',
'CHR' : 'https://trade.kucoin.com/trade/CHR-USDT',
'ZIL' : 'https://trade.kucoin.com/trade/ZIL-USDT',
'BAT' : 'https://trade.kucoin.com/trade/BAT-USDT',
'XYM' : 'https://trade.kucoin.com/trade/XYM-USDT',
'BOSON' : 'https://trade.kucoin.com/trade/BOSON-USDT',
'CARR' : 'https://trade.kucoin.com/trade/CARR-USDT',
'BCHSV' : 'https://trade.kucoin.com/trade/BCHSV-USDT',
'SENSO' : 'https://trade.kucoin.com/trade/SENSO-USDT',
'AXS' : 'https://trade.kucoin.com/trade/AXS-USDT',
'ETC' : 'https://trade.kucoin.com/trade/ETC-USDT',
'QI' : 'https://trade.kucoin.com/trade/QI-USDT',
'NIF' : 'https://trade.kucoin.com/trade/NIF-USDT',
'PRE' : 'https://trade.kucoin.com/trade/PRE-USDT',
'H3RO3S' : 'https://trade.kucoin.com/trade/H3RO3S-USDT',
'NEO' : 'https://trade.kucoin.com/trade/NEO-USDT',
'DAG' : 'https://trade.kucoin.com/trade/DAG-USDT',
'YGG' : 'https://trade.kucoin.com/trade/YGG-USDT',
'SXP' : 'https://trade.kucoin.com/trade/SXP-USDT',
'OPUL' : 'https://trade.kucoin.com/trade/OPUL-USDT',
'ARX' : 'https://trade.kucoin.com/trade/ARX-USDT',
'SWASH' : 'https://trade.kucoin.com/trade/SWASH-USDT',
'DAO' : 'https://trade.kucoin.com/trade/DAO-USDT',
'DPR' : 'https://trade.kucoin.com/trade/DPR-USDT',
'KRL' : 'https://trade.kucoin.com/trade/KRL-USDT',
'ARKER' : 'https://trade.kucoin.com/trade/ARKER-USDT',
'GOVI' : 'https://trade.kucoin.com/trade/GOVI-USDT',
'UNB' : 'https://trade.kucoin.com/trade/UNB-USDT',
'ANKR' : 'https://trade.kucoin.com/trade/ANKR-USDT',
'ALEPH' : 'https://trade.kucoin.com/trade/ALEPH-USDT',
'OUSD' : 'https://trade.kucoin.com/trade/OUSD-USDT',
'FTT' : 'https://trade.kucoin.com/trade/FTT-USDT',
'VXV' : 'https://trade.kucoin.com/trade/VXV-USDT',
'REQ' : 'https://trade.kucoin.com/trade/REQ-USDT',
'MASK' : 'https://trade.kucoin.com/trade/MASK-USDT',
'TLOS' : 'https://trade.kucoin.com/trade/TLOS-USDT',
'CUSD' : 'https://trade.kucoin.com/trade/CUSD-USDT',
'FRONT' : 'https://trade.kucoin.com/trade/FRONT-USDT',
'ACOIN' : 'https://trade.kucoin.com/trade/ACOIN-USDT',
'DASH' : 'https://trade.kucoin.com/trade/DASH-USDT',
'LTO' : 'https://trade.kucoin.com/trade/LTO-USDT',
'XDB' : 'https://trade.kucoin.com/trade/XDB-USDT',
'MXW' : 'https://trade.kucoin.com/trade/MXW-USDT',
'CGG' : 'https://trade.kucoin.com/trade/CGG-USDT',
'HYDRA' : 'https://trade.kucoin.com/trade/HYDRA-USDT',
'KAI' : 'https://trade.kucoin.com/trade/KAI-USDT',
'KLV' : 'https://trade.kucoin.com/trade/KLV-USDT',
'TRU' : 'https://trade.kucoin.com/trade/TRU-USDT',
'NANO' : 'https://trade.kucoin.com/trade/NANO-USDT',
'HOTCROSS' : 'https://trade.kucoin.com/trade/HOTCROSS-USDT',
'SNX' : 'https://trade.kucoin.com/trade/SNX-USDT',
'MNST' : 'https://trade.kucoin.com/trade/MNST-USDT',
'TARA' : 'https://trade.kucoin.com/trade/TARA-USDT',
'KAT' : 'https://trade.kucoin.com/trade/KAT-USDT',
'ORN' : 'https://trade.kucoin.com/trade/ORN-USDT',
'UNO' : 'https://trade.kucoin.com/trade/UNO-USDT',
'MKR' : 'https://trade.kucoin.com/trade/MKR-USDT',
'TCP' : 'https://trade.kucoin.com/trade/TCP-USDT',
'BMON' : 'https://trade.kucoin.com/trade/BMON-USDT',
'R' : 'https://trade.kucoin.com/trade/R-USDT',
'GOM2' : 'https://trade.kucoin.com/trade/GOM2-USDT',
'BEPRO' : 'https://trade.kucoin.com/trade/BEPRO-USDT',
'STC' : 'https://trade.kucoin.com/trade/STC-USDT',
'FKX' : 'https://trade.kucoin.com/trade/FKX-USDT',
'ZCX' : 'https://trade.kucoin.com/trade/ZCX-USDT',
'ERG' : 'https://trade.kucoin.com/trade/ERG-USDT',
'MEM' : 'https://trade.kucoin.com/trade/MEM-USDT',
'PEL' : 'https://trade.kucoin.com/trade/PEL-USDT',
'BAX' : 'https://trade.kucoin.com/trade/BAX-USDT',
'FLOW' : 'https://trade.kucoin.com/trade/FLOW-USDT',
'DODO' : 'https://trade.kucoin.com/trade/DODO-USDT',
'NORD' : 'https://trade.kucoin.com/trade/NORD-USDT',
'ABBC' : 'https://trade.kucoin.com/trade/ABBC-USDT',
'NWC' : 'https://trade.kucoin.com/trade/NWC-USDT',
'XCUR' : 'https://trade.kucoin.com/trade/XCUR-USDT',
'OOE' : 'https://trade.kucoin.com/trade/OOE-USDT',
'TVK' : 'https://trade.kucoin.com/trade/TVK-USDT',
'NFTB' : 'https://trade.kucoin.com/trade/NFTB-USDT',
'PNT' : 'https://trade.kucoin.com/trade/PNT-USDT',
'NGL' : 'https://trade.kucoin.com/trade/NGL-USDT',
'ZEN' : 'https://trade.kucoin.com/trade/ZEN-USDT',
'PHA' : 'https://trade.kucoin.com/trade/PHA-USDT',
'AIOZ' : 'https://trade.kucoin.com/trade/AIOZ-USDT',
'DAPPX' : 'https://trade.kucoin.com/trade/DAPPX-USDT',
'AXC' : 'https://trade.kucoin.com/trade/AXC-USDT',
'PLU' : 'https://trade.kucoin.com/trade/PLU-USDT',
'AI' : 'https://trade.kucoin.com/trade/AI-USDT',
'BOA' : 'https://trade.kucoin.com/trade/BOA-USDT',
'DYP' : 'https://trade.kucoin.com/trade/DYP-USDT',
'ALBT' : 'https://trade.kucoin.com/trade/ALBT-USDT',
'XHV' : 'https://trade.kucoin.com/trade/XHV-USDT',
'UMB' : 'https://trade.kucoin.com/trade/UMB-USDT',
'WAVES' : 'https://trade.kucoin.com/trade/WAVES-USDT',
'UMA' : 'https://trade.kucoin.com/trade/UMA-USDT',
'DFYN' : 'https://trade.kucoin.com/trade/DFYN-USDT',
'SOLVE' : 'https://trade.kucoin.com/trade/SOLVE-USDT',
'AURY' : 'https://trade.kucoin.com/trade/AURY-USDT',
'SKEY' : 'https://trade.kucoin.com/trade/SKEY-USDT',
'CEUR' : 'https://trade.kucoin.com/trade/CEUR-USDT',
'KEEP' : 'https://trade.kucoin.com/trade/KEEP-USDT',
'KMA' : 'https://trade.kucoin.com/trade/KMA-USDT',
'WOM' : 'https://trade.kucoin.com/trade/WOM-USDT',
'CLV' : 'https://trade.kucoin.com/trade/CLV-USDT',
'GTC' : 'https://trade.kucoin.com/trade/GTC-USDT',
'WNCG' : 'https://trade.kucoin.com/trade/WNCG-USDT',
'DGB' : 'https://trade.kucoin.com/trade/DGB-USDT',
'ILV' : 'https://trade.kucoin.com/trade/ILV-USDT',
'CWS' : 'https://trade.kucoin.com/trade/CWS-USDT',
'VSYS' : 'https://trade.kucoin.com/trade/VSYS-USDT',
'UBX' : 'https://trade.kucoin.com/trade/UBX-USDT',
'VLX' : 'https://trade.kucoin.com/trade/VLX-USDT',
'BASIC' : 'https://trade.kucoin.com/trade/BASIC-USDT',
'MNW' : 'https://trade.kucoin.com/trade/MNW-USDT',
'PBR' : 'https://trade.kucoin.com/trade/PBR-USDT',
'POLS' : 'https://trade.kucoin.com/trade/POLS-USDT',
'ARPA' : 'https://trade.kucoin.com/trade/ARPA-USDT',
'VIDT' : 'https://trade.kucoin.com/trade/VIDT-USDT',
'AVA' : 'https://trade.kucoin.com/trade/AVA-USDT',
'HAKA' : 'https://trade.kucoin.com/trade/HAKA-USDT',
'AMPL' : 'https://trade.kucoin.com/trade/AMPL-USDT',
'IDEA' : 'https://trade.kucoin.com/trade/IDEA-USDT',
'SLIM' : 'https://trade.kucoin.com/trade/SLIM-USDT',
'SOLR' : 'https://trade.kucoin.com/trade/SOLR-USDT',
'INJ' : 'https://trade.kucoin.com/trade/INJ-USDT',
'NOIA' : 'https://trade.kucoin.com/trade/NOIA-USDT',
'GMEE' : 'https://trade.kucoin.com/trade/GMEE-USDT',
'CTSI' : 'https://trade.kucoin.com/trade/CTSI-USDT',
'MONI' : 'https://trade.kucoin.com/trade/MONI-USDT',
'PUSH' : 'https://trade.kucoin.com/trade/PUSH-USDT',
'USDN' : 'https://trade.kucoin.com/trade/USDN-USDT',
'STORJ' : 'https://trade.kucoin.com/trade/STORJ-USDT',
'LOCG' : 'https://trade.kucoin.com/trade/LOCG-USDT',
'XPRT' : 'https://trade.kucoin.com/trade/XPRT-USDT',
'PROM' : 'https://trade.kucoin.com/trade/PROM-USDT',
'KAR' : 'https://trade.kucoin.com/trade/KAR-USDT',
'EPIK' : 'https://trade.kucoin.com/trade/EPIK-USDT',
'DEGO' : 'https://trade.kucoin.com/trade/DEGO-USDT',
'IOST' : 'https://trade.kucoin.com/trade/IOST-USDT',
'OPCT' : 'https://trade.kucoin.com/trade/OPCT-USDT',
'EQZ' : 'https://trade.kucoin.com/trade/EQZ-USDT',
'MAP' : 'https://trade.kucoin.com/trade/MAP-USDT',
'CUDOS' : 'https://trade.kucoin.com/trade/CUDOS-USDT',
'JUP' : 'https://trade.kucoin.com/trade/JUP-USDT',
'PRQ' : 'https://trade.kucoin.com/trade/PRQ-USDT',
'ONT' : 'https://trade.kucoin.com/trade/ONT-USDT',
'PUNDIX' : 'https://trade.kucoin.com/trade/PUNDIX-USDT',
'NFT' : 'https://trade.kucoin.com/trade/NFT-USDT',
'XCH' : 'https://trade.kucoin.com/trade/XCH-USDT',
'OMG' : 'https://trade.kucoin.com/trade/OMG-USDT',
'KIN' : 'https://trade.kucoin.com/trade/KIN-USDT',
'ETN' : 'https://trade.kucoin.com/trade/ETN-USDT',
'LON' : 'https://trade.kucoin.com/trade/LON-USDT',
'VELO' : 'https://trade.kucoin.com/trade/VELO-USDT',
'HORD' : 'https://trade.kucoin.com/trade/HORD-USDT',
'MITX' : 'https://trade.kucoin.com/trade/MITX-USDT',
'BZRX' : 'https://trade.kucoin.com/trade/BZRX-USDT',
'GLQ' : 'https://trade.kucoin.com/trade/GLQ-USDT',
'CREDI' : 'https://trade.kucoin.com/trade/CREDI-USDT',
'GAFI' : 'https://trade.kucoin.com/trade/GAFI-USDT',
'HYVE' : 'https://trade.kucoin.com/trade/HYVE-USDT',
'IXS' : 'https://trade.kucoin.com/trade/IXS-USDT',
'SKL' : 'https://trade.kucoin.com/trade/SKL-USDT',
'ARRR' : 'https://trade.kucoin.com/trade/ARRR-USDT',
'TOMO' : 'https://trade.kucoin.com/trade/TOMO-USDT',
'AGIX' : 'https://trade.kucoin.com/trade/AGIX-USDT',
'AKRO' : 'https://trade.kucoin.com/trade/AKRO-USDT',
'MATTER' : 'https://trade.kucoin.com/trade/MATTER-USDT',
'TXA' : 'https://trade.kucoin.com/trade/TXA-USDT',
'PDEX' : 'https://trade.kucoin.com/trade/PDEX-USDT',
'MTRG' : 'https://trade.kucoin.com/trade/MTRG-USDT',
'BUY' : 'https://trade.kucoin.com/trade/BUY-USDT',
'ENQ' : 'https://trade.kucoin.com/trade/ENQ-USDT',
'KDON' : 'https://trade.kucoin.com/trade/KDON-USDT',
'MTL' : 'https://trade.kucoin.com/trade/MTL-USDT',
'TONE' : 'https://trade.kucoin.com/trade/TONE-USDT',
'OXT' : 'https://trade.kucoin.com/trade/OXT-USDT',
'ROSN' : 'https://trade.kucoin.com/trade/ROSN-USDT',
'DIVI' : 'https://trade.kucoin.com/trade/DIVI-USDT',
'WXT' : 'https://trade.kucoin.com/trade/WXT-USDT',
'EQX' : 'https://trade.kucoin.com/trade/EQX-USDT',
'SHR' : 'https://trade.kucoin.com/trade/SHR-USDT',
'FEAR' : 'https://trade.kucoin.com/trade/FEAR-USDT',
'REN' : 'https://trade.kucoin.com/trade/REN-USDT',
'ROUTE' : 'https://trade.kucoin.com/trade/ROUTE-USDT',
'PERP' : 'https://trade.kucoin.com/trade/PERP-USDT',
'DERO' : 'https://trade.kucoin.com/trade/DERO-USDT',
'HT' : 'https://trade.kucoin.com/trade/HT-USDT',
'EFX' : 'https://trade.kucoin.com/trade/EFX-USDT',
'PMON' : 'https://trade.kucoin.com/trade/PMON-USDT',
'KLAY' : 'https://trade.kucoin.com/trade/KLAY-USDT',
'SRM' : 'https://trade.kucoin.com/trade/SRM-USDT',
'TWT' : 'https://trade.kucoin.com/trade/TWT-USDT',
'WRX' : 'https://trade.kucoin.com/trade/WRX-USDT',
'PAXG' : 'https://trade.kucoin.com/trade/PAXG-USDT',
'MFT' : 'https://trade.kucoin.com/trade/MFT-USDT',
'FRM' : 'https://trade.kucoin.com/trade/FRM-USDT',
'OM' : 'https://trade.kucoin.com/trade/OM-USDT',
'DINO' : 'https://trade.kucoin.com/trade/DINO-USDT',
'PHNX' : 'https://trade.kucoin.com/trade/PHNX-USDT',
'SDAO' : 'https://trade.kucoin.com/trade/SDAO-USDT',
'UNFI' : 'https://trade.kucoin.com/trade/UNFI-USDT',
'RLY' : 'https://trade.kucoin.com/trade/RLY-USDT',
'DPET' : 'https://trade.kucoin.com/trade/DPET-USDT',
'POLX' : 'https://trade.kucoin.com/trade/POLX-USDT',
'DSLA' : 'https://trade.kucoin.com/trade/DSLA-USDT',
'POND' : 'https://trade.kucoin.com/trade/POND-USDT'

 }



var ftxtradeTable = {

'BTC' : 'https://ftx.com/intl/trade/BTC/USD',
'ETH' : 'https://ftx.com/intl/trade/ETH/USD',
'SOL' : 'https://ftx.com/intl/trade/SOL/USD',
'USDT' : 'https://ftx.com/intl/trade/USDT/USD',
'SAND' : 'https://ftx.com/intl/trade/SAND/USD',
'MANA' : 'https://ftx.com/intl/trade/MANA/USD',
'DOGE' : 'https://ftx.com/intl/trade/DOGE/USD',
'BNB' : 'https://ftx.com/intl/trade/BNB/USD',
'FTT' : 'https://ftx.com/intl/trade/FTT/USD',
'ATLAS' : 'https://ftx.com/intl/trade/ATLAS/USD',
'CRO' : 'https://ftx.com/intl/trade/CRO/USD',
'LTC' : 'https://ftx.com/intl/trade/LTC/USD',
'DFL' : 'https://ftx.com/intl/trade/DFL/USD',
'XRP' : 'https://ftx.com/intl/trade/XRP/USD',
'MATIC' : 'https://ftx.com/intl/trade/MATIC/USD',
'FTM' : 'https://ftx.com/intl/trade/FTM/USD',
'BOBA' : 'https://ftx.com/intl/trade/BOBA/USD',
'SHIB' : 'https://ftx.com/intl/trade/SHIB/USD',
'IMX' : 'https://ftx.com/intl/trade/IMX/USD',
'LRC' : 'https://ftx.com/intl/trade/LRC/USD',
'SPELL' : 'https://ftx.com/intl/trade/SPELL/USD',
'BCH' : 'https://ftx.com/intl/trade/BCH/USD',
'LINK' : 'https://ftx.com/intl/trade/LINK/USD',
'CRV' : 'https://ftx.com/intl/trade/CRV/USD',
'ENJ' : 'https://ftx.com/intl/trade/ENJ/USD',
'ENS' : 'https://ftx.com/intl/trade/ENS/USD',
'RAY' : 'https://ftx.com/intl/trade/RAY/USD',
'POLIS' : 'https://ftx.com/intl/trade/POLIS/USD',
'GALA' : 'https://ftx.com/intl/trade/GALA/USD',
'AXS' : 'https://ftx.com/intl/trade/AXS/USD',
'SRM' : 'https://ftx.com/intl/trade/SRM/USD',
'SUSHI' : 'https://ftx.com/intl/trade/SUSHI/USD',
'OMG' : 'https://ftx.com/intl/trade/OMG/USD',
'UNI' : 'https://ftx.com/intl/trade/UNI/USD',
'CHZ' : 'https://ftx.com/intl/trade/CHZ/USD',
'RUNE' : 'https://ftx.com/intl/trade/RUNE/USD',
'DYDX' : 'https://ftx.com/intl/trade/DYDX/USD',
'TRYB' : 'https://ftx.com/intl/trade/TRYB/USD',
'WBTC' : 'https://ftx.com/intl/trade/WBTC/USD',
'SXP' : 'https://ftx.com/intl/trade/SXP/USD',
'BAT' : 'https://ftx.com/intl/trade/BAT/USD',
'ALICE' : 'https://ftx.com/intl/trade/ALICE/USD',
'PTU' : 'https://ftx.com/intl/trade/PTU/USD',
'MOB' : 'https://ftx.com/intl/trade/MOB/USD',
'TRX' : 'https://ftx.com/intl/trade/TRX/USD',
'1INCH' : 'https://ftx.com/intl/trade/1INCH/USD',
'TLM' : 'https://ftx.com/intl/trade/TLM/USD',
'STEP' : 'https://ftx.com/intl/trade/STEP/USD',
'GENE' : 'https://ftx.com/intl/trade/GENE/USD',
'AAVE' : 'https://ftx.com/intl/trade/AAVE/USD',
'BIT' : 'https://ftx.com/intl/trade/BIT/USD',
'AURY' : 'https://ftx.com/intl/trade/AURY/USD',
'CHR' : 'https://ftx.com/intl/trade/CHR/USD',
'STARS' : 'https://ftx.com/intl/trade/STARS/USD',
'DAI' : 'https://ftx.com/intl/trade/DAI/USD',
'REN' : 'https://ftx.com/intl/trade/REN/USD',
'COMP' : 'https://ftx.com/intl/trade/COMP/USD',
'SLP' : 'https://ftx.com/intl/trade/SLP/USD',
'CEL' : 'https://ftx.com/intl/trade/CEL/USD',
'GODS' : 'https://ftx.com/intl/trade/GODS/USD',
'YFI' : 'https://ftx.com/intl/trade/YFI/USD',
'KSHIB' : 'https://ftx.com/intl/trade/KSHIB/USD',
'MKR' : 'https://ftx.com/intl/trade/MKR/USD',
'AGLD' : 'https://ftx.com/intl/trade/AGLD/USD',
'TOMO' : 'https://ftx.com/intl/trade/TOMO/USD',
'GRT' : 'https://ftx.com/intl/trade/GRT/USD',
'AUDIO' : 'https://ftx.com/intl/trade/AUDIO/USD',
'HUM' : 'https://ftx.com/intl/trade/HUM/USD',
'TONCOIN' : 'https://ftx.com/intl/trade/TONCOIN/USD',
'RSR' : 'https://ftx.com/intl/trade/RSR/USD',
'BADGER' : 'https://ftx.com/intl/trade/BADGER/USD',
'MTA' : 'https://ftx.com/intl/trade/MTA/USD',
'SNX' : 'https://ftx.com/intl/trade/SNX/USD',
'PERP' : 'https://ftx.com/intl/trade/PERP/USD',
'MNGO' : 'https://ftx.com/intl/trade/MNGO/USD',
'KIN' : 'https://ftx.com/intl/trade/KIN/USD',
'AMPL' : 'https://ftx.com/intl/trade/AMPL/USD',
'STORJ' : 'https://ftx.com/intl/trade/STORJ/USD',
'BAO' : 'https://ftx.com/intl/trade/BAO/USD',
'RAMP' : 'https://ftx.com/intl/trade/RAMP/USD',
'EUR' : 'https://ftx.com/intl/trade/EUR/USD',
'SKL' : 'https://ftx.com/intl/trade/SKL/USD',
'ZRX' : 'https://ftx.com/intl/trade/ZRX/USD',
'ALPHA' : 'https://ftx.com/intl/trade/ALPHA/USD',
'HT' : 'https://ftx.com/intl/trade/HT/USD',
'CREAM' : 'https://ftx.com/intl/trade/CREAM/USD',
'HNT' : 'https://ftx.com/intl/trade/HNT/USD',
'MSOL' : 'https://ftx.com/intl/trade/MSOL/USD',
'COPE' : 'https://ftx.com/intl/trade/COPE/USD',
'FIDA' : 'https://ftx.com/intl/trade/FIDA/USD',
'CQT' : 'https://ftx.com/intl/trade/CQT/USD',
'ALCX' : 'https://ftx.com/intl/trade/ALCX/USD',
'MCB' : 'https://ftx.com/intl/trade/MCB/USD',
'VGX' : 'https://ftx.com/intl/trade/VGX/USD',
'LINA' : 'https://ftx.com/intl/trade/LINA/USD',
'CONV' : 'https://ftx.com/intl/trade/CONV/USD',
'BAND' : 'https://ftx.com/intl/trade/BAND/USD',
'C98' : 'https://ftx.com/intl/trade/C98/USD',
'OKB' : 'https://ftx.com/intl/trade/OKB/USD',
'KNC' : 'https://ftx.com/intl/trade/KNC/USD',
'EDEN' : 'https://ftx.com/intl/trade/EDEN/USD',
'GBP' : 'https://ftx.com/intl/trade/GBP/USD',
'SLND' : 'https://ftx.com/intl/trade/SLND/USD',
'TULIP' : 'https://ftx.com/intl/trade/TULIP/USD',
'REEF' : 'https://ftx.com/intl/trade/REEF/USD',
'BRZ' : 'https://ftx.com/intl/trade/BRZ/USD',
'ROOK' : 'https://ftx.com/intl/trade/ROOK/USD',
'BNT' : 'https://ftx.com/intl/trade/BNT/USD',
'INTER' : 'https://ftx.com/intl/trade/INTER/USD',
'TRU' : 'https://ftx.com/intl/trade/TRU/USD',
'CLV' : 'https://ftx.com/intl/trade/CLV/USD',
'ALEPH' : 'https://ftx.com/intl/trade/ALEPH/USD',
'PAXG' : 'https://ftx.com/intl/trade/PAXG/USD',
'OXY' : 'https://ftx.com/intl/trade/OXY/USD',
'MER' : 'https://ftx.com/intl/trade/MER/USD',
'BLT' : 'https://ftx.com/intl/trade/BLT/USD',
'BAL' : 'https://ftx.com/intl/trade/BAL/USD',
'ORBS' : 'https://ftx.com/intl/trade/ORBS/USD',
'STSOL' : 'https://ftx.com/intl/trade/STSOL/USD',
'DODO' : 'https://ftx.com/intl/trade/DODO/USD',
'STETH' : 'https://ftx.com/intl/trade/STETH/USD',
'XAUT' : 'https://ftx.com/intl/trade/XAUT/USD',
'GAL' : 'https://ftx.com/intl/trade/GAL/USD',
'HXRO' : 'https://ftx.com/intl/trade/HXRO/USD',
'PORT' : 'https://ftx.com/intl/trade/PORT/USD',
'JET' : 'https://ftx.com/intl/trade/JET/USD',
'WRX' : 'https://ftx.com/intl/trade/WRX/USD',
'DENT' : 'https://ftx.com/intl/trade/DENT/USD',
'LUA' : 'https://ftx.com/intl/trade/LUA/USD',
'DAWN' : 'https://ftx.com/intl/trade/DAWN/USD',
'CITY' : 'https://ftx.com/intl/trade/CITY/USD',
'LEO' : 'https://ftx.com/intl/trade/LEO/USD',
'STMX' : 'https://ftx.com/intl/trade/STMX/USD',
'SECO' : 'https://ftx.com/intl/trade/SECO/USD',
'CAD' : 'https://ftx.com/intl/trade/CAD/USD',
'SNY' : 'https://ftx.com/intl/trade/SNY/USD',
'CVC' : 'https://ftx.com/intl/trade/CVC/USD',
'WAVES' : 'https://ftx.com/intl/trade/WAVES/USD',
'MAPS' : 'https://ftx.com/intl/trade/MAPS/USD',
'ASD' : 'https://ftx.com/intl/trade/ASD/USD',
'SLRS' : 'https://ftx.com/intl/trade/SLRS/USD',
'MATH' : 'https://ftx.com/intl/trade/MATH/USD',
'HMT' : 'https://ftx.com/intl/trade/HMT/USD',
'MEDIA' : 'https://ftx.com/intl/trade/MEDIA/USD',
'YFII' : 'https://ftx.com/intl/trade/YFII/USD',
'AKRO' : 'https://ftx.com/intl/trade/AKRO/USD',
'PSG' : 'https://ftx.com/intl/trade/PSG/USD',
'BAR' : 'https://ftx.com/intl/trade/BAR/USD',
'PUNDIX' : 'https://ftx.com/intl/trade/PUNDIX/USD',
'HOLY' : 'https://ftx.com/intl/trade/HOLY/USD',
'EMB' : 'https://ftx.com/intl/trade/EMB/USD',
'CUSDT' : 'https://ftx.com/intl/trade/CUSDT/USD',
'HGET' : 'https://ftx.com/intl/trade/HGET/USD',
'FRONT' : 'https://ftx.com/intl/trade/FRONT/USD',
'UBXT' : 'https://ftx.com/intl/trade/UBXT/USD',
'JST' : 'https://ftx.com/intl/trade/JST/USD',
'PROM' : 'https://ftx.com/intl/trade/PROM/USD',
'GT' : 'https://ftx.com/intl/trade/GT/USD',
'DMG' : 'https://ftx.com/intl/trade/DMG/USD',
'MTL' : 'https://ftx.com/intl/trade/MTL/USD',
'SUN' : 'https://ftx.com/intl/trade/SUN/USD'

 }






  var cmclinkTable = {


'AAVE' : 'https://coinmarketcap.com/currencies/aave/',
'ABBC' : 'https://coinmarketcap.com/currencies/abbc-coin/',
'ACH' : 'https://coinmarketcap.com/currencies/alchemy-pay/',
'ADA' : 'https://coinmarketcap.com/currencies/cardano/',
'AKT' : 'https://coinmarketcap.com/currencies/akash-network/',
'ALGO' : 'https://coinmarketcap.com/currencies/algorand/',
'ALPHA' : 'https://coinmarketcap.com/currencies/alpha-finance-lab/',
'AMP' : 'https://coinmarketcap.com/currencies/amp/',
'AMPL' : 'https://coinmarketcap.com/currencies/ampleforth/',
'ANC' : 'https://coinmarketcap.com/currencies/anchor-protocol/',
'ANKR' : 'https://coinmarketcap.com/currencies/ankr/',
'ANT' : 'https://coinmarketcap.com/currencies/aragon/',
'AR' : 'https://coinmarketcap.com/currencies/arweave/',
'ARDR' : 'https://coinmarketcap.com/currencies/ardor/',
'ARK' : 'https://coinmarketcap.com/currencies/ark/',
'ARRR' : 'https://coinmarketcap.com/currencies/pirate-chain/',
'ATOM' : 'https://coinmarketcap.com/currencies/cosmos/',
'AUDIO' : 'https://coinmarketcap.com/currencies/audius/',
'AVA' : 'https://coinmarketcap.com/currencies/travala/',
'AVAX' : 'https://coinmarketcap.com/currencies/avalanche/',
'AXS' : 'https://coinmarketcap.com/currencies/axie-infinity/',
'BADGER' : 'https://coinmarketcap.com/currencies/badger-dao/',
'BAKE' : 'https://coinmarketcap.com/currencies/bakerytoken/',
'BAL' : 'https://coinmarketcap.com/currencies/balancer/',
'BAND' : 'https://coinmarketcap.com/currencies/band-protocol/',
'BAT' : 'https://coinmarketcap.com/currencies/basic-attention-token/',
'BCD' : 'https://coinmarketcap.com/currencies/bitcoin-diamond/',
'BCH' : 'https://coinmarketcap.com/currencies/bitcoin-cash/',
'BEST' : 'https://coinmarketcap.com/currencies/bitpanda-ecosystem-token/',
'BNB' : 'https://coinmarketcap.com/currencies/binance-coin/',
'BNT' : 'https://coinmarketcap.com/currencies/bancor/',
'BSV' : 'https://coinmarketcap.com/currencies/bitcoin-sv/',
'BTC' : 'https://coinmarketcap.com/currencies/bitcoin/',
'BTCB' : 'https://coinmarketcap.com/currencies/bitcoin-bep2/',
'BTG' : 'https://coinmarketcap.com/currencies/bitcoin-gold/',
'BTM' : 'https://coinmarketcap.com/currencies/bytom/',
'BTS' : 'https://coinmarketcap.com/currencies/bitshares/',
'BTT' : 'https://coinmarketcap.com/currencies/bittorrent/',
'BUSD' : 'https://coinmarketcap.com/currencies/binance-usd/',
'BZRX' : 'https://coinmarketcap.com/currencies/bzx-protocol/',
'CAKE' : 'https://coinmarketcap.com/currencies/pancakeswap/',
'CEL' : 'https://coinmarketcap.com/currencies/celsius/',
'CELO' : 'https://coinmarketcap.com/currencies/celo/',
'CELR' : 'https://coinmarketcap.com/currencies/celer-network/',
'CHR' : 'https://coinmarketcap.com/currencies/chromia/',
'CHZ' : 'https://coinmarketcap.com/currencies/chiliz/',
'CKB' : 'https://coinmarketcap.com/currencies/nervos-network/',
'COMP' : 'https://coinmarketcap.com/currencies/compound/',
'COTI' : 'https://coinmarketcap.com/currencies/coti/',
'CRO' : 'https://coinmarketcap.com/currencies/crypto-com-coin/',
'CRV' : 'https://coinmarketcap.com/currencies/curve-dao-token/',
'CTC' : 'https://coinmarketcap.com/currencies/creditcoin/',
'CTSI' : 'https://coinmarketcap.com/currencies/cartesi/',
'CVC' : 'https://coinmarketcap.com/currencies/civic/',
'DAG' : 'https://coinmarketcap.com/currencies/constellation/',
'DAI' : 'https://coinmarketcap.com/currencies/multi-collateral-dai/',
'DASH' : 'https://coinmarketcap.com/currencies/dash/',
'DATA' : 'https://coinmarketcap.com/currencies/streamr/',
'DCR' : 'https://coinmarketcap.com/currencies/decred/',
'DEGO' : 'https://coinmarketcap.com/currencies/dego-finance/',
'DENT' : 'https://coinmarketcap.com/currencies/dent/',
'DF' : 'https://coinmarketcap.com/currencies/dforce/',
'DFI' : 'https://coinmarketcap.com/currencies/defichain/',
'DGB' : 'https://coinmarketcap.com/currencies/digibyte/',
'DIA' : 'https://coinmarketcap.com/currencies/dia/',
'DKA' : 'https://coinmarketcap.com/currencies/dkargo/',
'DOCK' : 'https://coinmarketcap.com/currencies/dock/',
'DODO' : 'https://coinmarketcap.com/currencies/dodo/',
'DOGE' : 'https://coinmarketcap.com/currencies/dogecoin/',
'DOT' : 'https://coinmarketcap.com/currencies/polkadot-new/',
'DYDX' : 'https://coinmarketcap.com/currencies/dydx/',
'EGLD' : 'https://coinmarketcap.com/currencies/elrond-egld/',
'ELF' : 'https://coinmarketcap.com/currencies/aelf/',
'ENJ' : 'https://coinmarketcap.com/currencies/enjin-coin/',
'EOS' : 'https://coinmarketcap.com/currencies/eos/',
'ERG' : 'https://coinmarketcap.com/currencies/ergo/',
'ETC' : 'https://coinmarketcap.com/currencies/ethereum-classic/',
'ETH' : 'https://coinmarketcap.com/currencies/ethereum/',
'ETN' : 'https://coinmarketcap.com/currencies/electroneum/',
'EWT' : 'https://coinmarketcap.com/currencies/energy-web-token/',
'FET' : 'https://coinmarketcap.com/currencies/fetch/',
'FIL' : 'https://coinmarketcap.com/currencies/filecoin/',
'FIO' : 'https://coinmarketcap.com/currencies/fio-protocol/',
'FLOW' : 'https://coinmarketcap.com/currencies/flow/',
'FRONT' : 'https://coinmarketcap.com/currencies/frontier/',
'FTM' : 'https://coinmarketcap.com/currencies/fantom/',
'FTT' : 'https://coinmarketcap.com/currencies/ftx-token/',
'FUN' : 'https://coinmarketcap.com/currencies/funtoken/',
'GLM' : 'https://coinmarketcap.com/currencies/golem-network-tokens/',
'GRT' : 'https://coinmarketcap.com/currencies/the-graph/',
'GT' : 'https://coinmarketcap.com/currencies/gatetoken/',
'GTO' : 'https://coinmarketcap.com/currencies/gifto/',
'GUSD' : 'https://coinmarketcap.com/currencies/gemini-dollar/',
'HARD' : 'https://coinmarketcap.com/currencies/hard-protocol/',
'HBAR' : 'https://coinmarketcap.com/currencies/hedera-hashgraph/',
'HEDG' : 'https://coinmarketcap.com/currencies/hedgetrade/',
'HEX' : 'https://coinmarketcap.com/currencies/hex/',
'HIVE' : 'https://coinmarketcap.com/currencies/hive-blockchain/',
'HNS' : 'https://coinmarketcap.com/currencies/handshake/',
'HNT' : 'https://coinmarketcap.com/currencies/helium/',
'HOT' : 'https://coinmarketcap.com/currencies/holo/',
'HT' : 'https://coinmarketcap.com/currencies/huobi-token/',
'HUSD' : 'https://coinmarketcap.com/currencies/husd/',
'HXRO' : 'https://coinmarketcap.com/currencies/hxro/',
'ICP' : 'https://coinmarketcap.com/currencies/internet-computer/',
'ICX' : 'https://coinmarketcap.com/currencies/icon/',
'INJ' : 'https://coinmarketcap.com/currencies/injective-protocol/',
'IOST' : 'https://coinmarketcap.com/currencies/iostoken/',
'IOTX' : 'https://coinmarketcap.com/currencies/iotex/',
'IQ' : 'https://coinmarketcap.com/currencies/everipedia/',
'JST' : 'https://coinmarketcap.com/currencies/just/',
'KAVA' : 'https://coinmarketcap.com/currencies/kava/',
'KCS' : 'https://coinmarketcap.com/currencies/kucoin-token/',
'KEEP' : 'https://coinmarketcap.com/currencies/keep-network/',
'KEY' : 'https://coinmarketcap.com/currencies/selfkey/',
'KLAY' : 'https://coinmarketcap.com/currencies/klaytn/',
'KMD' : 'https://coinmarketcap.com/currencies/komodo/',
'KNC' : 'https://coinmarketcap.com/currencies/kyber-network-crystal-v2/',
'KOK' : 'https://coinmarketcap.com/currencies/keystone-of-opportunity-knowledge/',
'KSM' : 'https://coinmarketcap.com/currencies/kusama/',
'LEO' : 'https://coinmarketcap.com/currencies/unus-sed-leo/',
'LINK' : 'https://coinmarketcap.com/currencies/chainlink/',
'LRC' : 'https://coinmarketcap.com/currencies/loopring/',
'LSK' : 'https://coinmarketcap.com/currencies/lisk/',
'LTC' : 'https://coinmarketcap.com/currencies/litecoin/',
'LUNA' : 'https://coinmarketcap.com/currencies/terra-luna/',
'MAID' : 'https://coinmarketcap.com/currencies/maidsafecoin/',
'MANA' : 'https://coinmarketcap.com/currencies/decentraland/',
'MATH' : 'https://coinmarketcap.com/currencies/math/',
'MATIC' : 'https://coinmarketcap.com/currencies/polygon/',
'MBOX' : 'https://coinmarketcap.com/currencies/mobox/',
'MCO' : 'https://coinmarketcap.com/currencies/crypto-com/',
'MIOTA' : 'https://coinmarketcap.com/currencies/iota/',
'MIR' : 'https://coinmarketcap.com/currencies/mirror-protocol/',
'MKR' : 'https://coinmarketcap.com/currencies/maker/',
'MLN' : 'https://coinmarketcap.com/currencies/enzyme/',
'MTL' : 'https://coinmarketcap.com/currencies/metal/',
'MXC' : 'https://coinmarketcap.com/currencies/mxc/',
'NANO' : 'https://coinmarketcap.com/currencies/nano/',
'NEAR' : 'https://coinmarketcap.com/currencies/near-protocol/',
'NEO' : 'https://coinmarketcap.com/currencies/neo/',
'NEXO' : 'https://coinmarketcap.com/currencies/nexo/',
'NKN' : 'https://coinmarketcap.com/currencies/nkn/',
'NMR' : 'https://coinmarketcap.com/currencies/numeraire/',
'NOIA' : 'https://coinmarketcap.com/currencies/syntropy/',
'NULS' : 'https://coinmarketcap.com/currencies/nuls/',
'NXM' : 'https://coinmarketcap.com/currencies/nxm/',
'OCEAN' : 'https://coinmarketcap.com/currencies/ocean-protocol/',
'OGN' : 'https://coinmarketcap.com/currencies/origin-protocol/',
'OKB' : 'https://coinmarketcap.com/currencies/okb/',
'OMG' : 'https://coinmarketcap.com/currencies/omg/',
'OMI' : 'https://coinmarketcap.com/currencies/ecomi/',
'ONE' : 'https://coinmarketcap.com/currencies/harmony/',
'ONT' : 'https://coinmarketcap.com/currencies/ontology/',
'ORBS' : 'https://coinmarketcap.com/currencies/orbs/',
'ORN' : 'https://coinmarketcap.com/currencies/orion-protocol/',
'OXT' : 'https://coinmarketcap.com/currencies/orchid/',
'PAX' : 'https://coinmarketcap.com/currencies/paxos-standard/',
'PAXG' : 'https://coinmarketcap.com/currencies/pax-gold/',
'PERP' : 'https://coinmarketcap.com/currencies/perpetual-protocol/',
'PHA' : 'https://coinmarketcap.com/currencies/phala-network/',
'PLA' : 'https://coinmarketcap.com/currencies/playdapp/',
'POWR' : 'https://coinmarketcap.com/currencies/power-ledger/',
'PROM' : 'https://coinmarketcap.com/currencies/prometeus/',
'QNT' : 'https://coinmarketcap.com/currencies/quant/',
'QTUM' : 'https://coinmarketcap.com/currencies/qtum/',
'RAD' : 'https://coinmarketcap.com/currencies/radicle/',
'RARI' : 'https://coinmarketcap.com/currencies/rarible/',
'REEF' : 'https://coinmarketcap.com/currencies/reef/',
'REN' : 'https://coinmarketcap.com/currencies/ren/',
'REP' : 'https://coinmarketcap.com/currencies/augur/',
'REQ' : 'https://coinmarketcap.com/currencies/request/',
'REV' : 'https://coinmarketcap.com/currencies/revain/',
'RIF' : 'https://coinmarketcap.com/currencies/rsk-infrastructure-framework/',
'RLC' : 'https://coinmarketcap.com/currencies/rlc/',
'RLY' : 'https://coinmarketcap.com/currencies/rally/',
'ROSE' : 'https://coinmarketcap.com/currencies/oasis-network/',
'RPL' : 'https://coinmarketcap.com/currencies/rocket-pool/',
'RSR' : 'https://coinmarketcap.com/currencies/reserve-rights/',
'RUNE' : 'https://coinmarketcap.com/currencies/thorchain/',
'RVN' : 'https://coinmarketcap.com/currencies/ravencoin/',
'SAFEMOON' : 'https://coinmarketcap.com/currencies/safemoon/',
'SAND' : 'https://coinmarketcap.com/currencies/the-sandbox/',
'SC' : 'https://coinmarketcap.com/currencies/siacoin/',
'SHIB' : 'https://coinmarketcap.com/currencies/shiba-inu/',
'SKL' : 'https://coinmarketcap.com/currencies/skale-network/',
'SLP' : 'https://coinmarketcap.com/currencies/smooth-love-potion/',
'SNT' : 'https://coinmarketcap.com/currencies/status/',
'SNX' : 'https://coinmarketcap.com/currencies/synthetix-network-token/',
'SOC' : 'https://coinmarketcap.com/currencies/soda-coin/',
'SOL' : 'https://coinmarketcap.com/currencies/solana/',
'SRM' : 'https://coinmarketcap.com/currencies/serum/',
'STEEM' : 'https://coinmarketcap.com/currencies/steem/',
'STMX' : 'https://coinmarketcap.com/currencies/stormx/',
'STORJ' : 'https://coinmarketcap.com/currencies/storj/',
'STRAX' : 'https://coinmarketcap.com/currencies/stratis/',
'STX' : 'https://coinmarketcap.com/currencies/stacks/',
'SUN' : 'https://coinmarketcap.com/currencies/sun-token/',
'SUSD' : 'https://coinmarketcap.com/currencies/susd/',
'SUSHI' : 'https://coinmarketcap.com/currencies/sushiswap/',
'SXP' : 'https://coinmarketcap.com/currencies/swipe/',
'TEL' : 'https://coinmarketcap.com/currencies/telcoin/',
'TFUEL' : 'https://coinmarketcap.com/currencies/theta-fuel/',
'THETA' : 'https://coinmarketcap.com/currencies/theta/',
'TITAN' : 'https://coinmarketcap.com/currencies/titanswap/',
'TKO' : 'https://coinmarketcap.com/currencies/tokocrypto/',
'TOMO' : 'https://coinmarketcap.com/currencies/tomochain/',
'TRB' : 'https://coinmarketcap.com/currencies/tellor/',
'TRIBE' : 'https://coinmarketcap.com/currencies/tribe/',
'TRX' : 'https://coinmarketcap.com/currencies/tron/',
'TTT' : 'https://coinmarketcap.com/currencies/the-transfer-token/',
'TUSD' : 'https://coinmarketcap.com/currencies/trueusd/',
'TWT' : 'https://coinmarketcap.com/currencies/trust-wallet-token/',
'UMA' : 'https://coinmarketcap.com/currencies/uma/',
'UNI' : 'https://coinmarketcap.com/currencies/uniswap/',
'UOS' : 'https://coinmarketcap.com/currencies/ultra/',
'UQC' : 'https://coinmarketcap.com/currencies/uquid-coin/',
'USDC' : 'https://coinmarketcap.com/currencies/usd-coin/',
'USDK' : 'https://coinmarketcap.com/currencies/usdk/',
'USDN' : 'https://coinmarketcap.com/currencies/neutrino-usd/',
'UST' : 'https://coinmarketcap.com/currencies/terrausd/',
'UTK' : 'https://coinmarketcap.com/currencies/utrust/',
'VET' : 'https://coinmarketcap.com/currencies/vechain/',
'VRA' : 'https://coinmarketcap.com/currencies/verasity/',
'VTHO' : 'https://coinmarketcap.com/currencies/vethor-token/',
'WAN' : 'https://coinmarketcap.com/currencies/wanchain/',
'WAVES' : 'https://coinmarketcap.com/currencies/waves/',
'WAXP' : 'https://coinmarketcap.com/currencies/wax/',
'WBTC' : 'https://coinmarketcap.com/currencies/wrapped-bitcoin/',
'WIN' : 'https://coinmarketcap.com/currencies/wink/',
'WRX' : 'https://coinmarketcap.com/currencies/wazirx/',
'XCH' : 'https://coinmarketcap.com/currencies/chia-network/',
'XDC' : 'https://coinmarketcap.com/currencies/xinfin-network/',
'XEM' : 'https://coinmarketcap.com/currencies/nem/',
'XLM' : 'https://coinmarketcap.com/currencies/stellar/',
'XMR' : 'https://coinmarketcap.com/currencies/monero/',
'XRP' : 'https://coinmarketcap.com/currencies/xrp/',
'XTZ' : 'https://coinmarketcap.com/currencies/tezos/',
'XVG' : 'https://coinmarketcap.com/currencies/verge/',
'XVS' : 'https://coinmarketcap.com/currencies/venus/',
'XWC' : 'https://coinmarketcap.com/currencies/whitecoin/',
'YFI' : 'https://coinmarketcap.com/currencies/yearn-finance/',
'YFII' : 'https://coinmarketcap.com/currencies/yearn-finance-ii/',
'ZB' : 'https://coinmarketcap.com/currencies/zb-token/',
'ZEC' : 'https://coinmarketcap.com/currencies/zcash/',
'ZEN' : 'https://coinmarketcap.com/currencies/horizen/',
'ZIL' : 'https://coinmarketcap.com/currencies/zilliqa/',
'ZRX' : 'https://coinmarketcap.com/currencies/0x/',
'XEC' : 'https://coinmarketcap.com/currencies/ecash/',
'MINA' : 'https://coinmarketcap.com/currencies/mina/',
'POLY' : 'https://coinmarketcap.com/currencies/polymath-network/',
'ILV' : 'https://coinmarketcap.com/currencies/illuvium/',
'TRU' : 'https://coinmarketcap.com/currencies/truefi-token/',
'MASK' : 'https://coinmarketcap.com/currencies/mask-network/',
'SUPER' : 'https://coinmarketcap.com/currencies/superfarm/',
'AGLD' : 'https://coinmarketcap.com/currencies/adventure-gold/',
'POLS' : 'https://coinmarketcap.com/currencies/polkastarter/',
'SYS' : 'https://coinmarketcap.com/currencies/syscoin/',
'STPT' : 'https://coinmarketcap.com/currencies/standard-tokenization-protocol/',
'SFP' : 'https://coinmarketcap.com/currencies/safepal/',
'TROY' : 'https://coinmarketcap.com/currencies/troy/',
'GHST' : 'https://coinmarketcap.com/currencies/aavegotchi/',
'CLV' : 'https://coinmarketcap.com/currencies/clover/',
'ARPA' : 'https://coinmarketcap.com/currencies/arpa-chain/',
'FORTH' : 'https://coinmarketcap.com/currencies/ampleforth-governance-token/',
'IRIS' : 'https://coinmarketcap.com/currencies/irisnet/',
'MFT' : 'https://coinmarketcap.com/currencies/mainframe/',
'ALPACA' : 'https://coinmarketcap.com/currencies/alpaca-finance/',
'TVK' : 'https://coinmarketcap.com/currencies/terra-virtua-kolect/',
'AKRO' : 'https://coinmarketcap.com/currencies/akropolis/',
'CTK' : 'https://coinmarketcap.com/currencies/certik/',
'BEL' : 'https://coinmarketcap.com/currencies/bella-protocol/',
'LTO' : 'https://coinmarketcap.com/currencies/lto-network/',
'FIRO' : 'https://coinmarketcap.com/currencies/firo/',
'DNT' : 'https://coinmarketcap.com/currencies/district0x/',
'WNXM' : 'https://coinmarketcap.com/currencies/wrapped-nxm/',
'AION' : 'https://coinmarketcap.com/currencies/aion/',
'OM' : 'https://coinmarketcap.com/currencies/mantra-dao/',
'WTC' : 'https://coinmarketcap.com/currencies/waltonchain/',
'FLM' : 'https://coinmarketcap.com/currencies/flamingo/',
'BLZ' : 'https://coinmarketcap.com/currencies/bluzelle/',
'BEAM' : 'https://coinmarketcap.com/currencies/beam/',
'COS' : 'https://coinmarketcap.com/currencies/contentos/',
'BURGER' : 'https://coinmarketcap.com/currencies/burger-swap/',
'MBL' : 'https://coinmarketcap.com/currencies/moviebloc/',
'DUSK' : 'https://coinmarketcap.com/currencies/dusk-network/',
'CVP' : 'https://coinmarketcap.com/currencies/powerpool/',
'AUTO' : 'https://coinmarketcap.com/currencies/auto/',
'FOR' : 'https://coinmarketcap.com/currencies/the-force-protocol/',
'UNFI' : 'https://coinmarketcap.com/currencies/unifi-protocol-dao/',
'VITE' : 'https://coinmarketcap.com/currencies/vite/',
'MITH' : 'https://coinmarketcap.com/currencies/mithril/',
'PNT' : 'https://coinmarketcap.com/currencies/pnetwork/',
'PERL' : 'https://coinmarketcap.com/currencies/perlin/',
'WING' : 'https://coinmarketcap.com/currencies/wing/',
'CTXC' : 'https://coinmarketcap.com/currencies/cortex/',
'COCOS' : 'https://coinmarketcap.com/currencies/cocos-bcx/',
'TCT' : 'https://coinmarketcap.com/currencies/tokenclub/',
'ACM' : 'https://coinmarketcap.com/currencies/ac-milan-fan-token/',
'ATM' : 'https://coinmarketcap.com/currencies/atletico-de-madrid-fan-token/',
'DREP' : 'https://coinmarketcap.com/currencies/drep-new/',
'ADX' : 'https://coinmarketcap.com/currencies/adx-net/',
'AERGO' : 'https://coinmarketcap.com/currencies/aergo/',
'ALBT' : 'https://coinmarketcap.com/currencies/allianceblock/',
'ALEPH' : 'https://coinmarketcap.com/currencies/aleph-im/',
'API3' : 'https://coinmarketcap.com/currencies/api3/',
'APL' : 'https://coinmarketcap.com/currencies/apollo-currency/',
'AUCTION' : 'https://coinmarketcap.com/currencies/bounce-token/',
'BCN' : 'https://coinmarketcap.com/currencies/bytecoin-bcn/',
'BEPRO' : 'https://coinmarketcap.com/currencies/bepro-network/',
'BIT' : 'https://coinmarketcap.com/currencies/bitdao/',
'BMX' : 'https://coinmarketcap.com/currencies/bitmart-token/',
'BOA' : 'https://coinmarketcap.com/currencies/bosagora/',
'BOSON' : 'https://coinmarketcap.com/currencies/boson-protocol/',
'CET' : 'https://coinmarketcap.com/currencies/coinex-token/',
'CGG' : 'https://coinmarketcap.com/currencies/chain-guardians/',
'CHSB' : 'https://coinmarketcap.com/currencies/swissborg/',
'CREAM' : 'https://coinmarketcap.com/currencies/cream-finance/',
'CRU' : 'https://coinmarketcap.com/currencies/crustnetwork/',
'CSPR' : 'https://coinmarketcap.com/currencies/casper/',
'DAD' : 'https://coinmarketcap.com/currencies/dad/',
'DAO' : 'https://coinmarketcap.com/currencies/dao-maker/',
'DDX' : 'https://coinmarketcap.com/currencies/derivadao/',
'DERO' : 'https://coinmarketcap.com/currencies/dero/',
'DEXT' : 'https://coinmarketcap.com/currencies/dextools/',
'DGD' : 'https://coinmarketcap.com/currencies/digixdao/',
'DIVI' : 'https://coinmarketcap.com/currencies/divi/',
'EDG' : 'https://coinmarketcap.com/currencies/edgeware/',
'ELA' : 'https://coinmarketcap.com/currencies/elastos/',
'ERN' : 'https://coinmarketcap.com/currencies/ethernity-chain/',
'EUM' : 'https://coinmarketcap.com/currencies/elitium/',
'EURS' : 'https://coinmarketcap.com/currencies/stasis-euro/',
'FARM' : 'https://coinmarketcap.com/currencies/harvest-finance/',
'GAS' : 'https://coinmarketcap.com/currencies/gas/',
'GRS' : 'https://coinmarketcap.com/currencies/groestlcoin/',
'HEGIC' : 'https://coinmarketcap.com/currencies/hegic/',
'KAI' : 'https://coinmarketcap.com/currencies/kardiachain/',
'KDA' : 'https://coinmarketcap.com/currencies/kadena/',
'KIN' : 'https://coinmarketcap.com/currencies/kin/',
'KLV' : 'https://coinmarketcap.com/currencies/klever/',
'KP3R' : 'https://coinmarketcap.com/currencies/keep3rv1/',
'KYL' : 'https://coinmarketcap.com/currencies/kylin/',
'LA' : 'https://coinmarketcap.com/currencies/latoken/',
'LDO' : 'https://coinmarketcap.com/currencies/lido-dao/',
'LOOM' : 'https://coinmarketcap.com/currencies/loom-network/',
'LQTY' : 'https://coinmarketcap.com/currencies/liquity/',
'MARO' : 'https://coinmarketcap.com/currencies/maro/',
'MET' : 'https://coinmarketcap.com/currencies/metronome/',
'MLK' : 'https://coinmarketcap.com/currencies/milk-alliance/',
'MOF' : 'https://coinmarketcap.com/currencies/molecular-future/',
'MONA' : 'https://coinmarketcap.com/currencies/monacoin/',
'MTV' : 'https://coinmarketcap.com/currencies/multivac/',
'MX' : 'https://coinmarketcap.com/currencies/mx-token/',
'NFT' : 'https://coinmarketcap.com/currencies/apenft/',
'NIM' : 'https://coinmarketcap.com/currencies/nimiq/',
'NRG' : 'https://coinmarketcap.com/currencies/energi/',
'NWC' : 'https://coinmarketcap.com/currencies/newscrypto/',
'OXY' : 'https://coinmarketcap.com/currencies/oxygen/',
'PAC' : 'https://coinmarketcap.com/currencies/pac-protocol/',
'PHB' : 'https://coinmarketcap.com/currencies/phoenix-global/',
'PNK' : 'https://coinmarketcap.com/currencies/kleros/',
'POLK' : 'https://coinmarketcap.com/currencies/polkamarkets/',
'PRO' : 'https://coinmarketcap.com/currencies/propy/',
'PRQ' : 'https://coinmarketcap.com/currencies/parsiq/',
'QKC' : 'https://coinmarketcap.com/currencies/quarkchain/',
'RDD' : 'https://coinmarketcap.com/currencies/redd/',
'REVV' : 'https://coinmarketcap.com/currencies/revv/',
'RFR' : 'https://coinmarketcap.com/currencies/refereum/',
'SBD' : 'https://coinmarketcap.com/currencies/steem-dollars/',
'SHR' : 'https://coinmarketcap.com/currencies/sharetoken/',
'SOLO' : 'https://coinmarketcap.com/currencies/sologenic/',
'SOLVE' : 'https://coinmarketcap.com/currencies/solve/',
'SOUL' : 'https://coinmarketcap.com/currencies/phantasma/',
'STAKE' : 'https://coinmarketcap.com/currencies/xdai/',
'STRONG' : 'https://coinmarketcap.com/currencies/strong/',
'SUKU' : 'https://coinmarketcap.com/currencies/suku/',
'SWAP' : 'https://coinmarketcap.com/currencies/trustswap/',
'TRAC' : 'https://coinmarketcap.com/currencies/origintrail/',
'TT' : 'https://coinmarketcap.com/currencies/thunder-token/',
'UPP' : 'https://coinmarketcap.com/currencies/sentinel-protocol/',
'VEE' : 'https://coinmarketcap.com/currencies/blockv/',
'VERI' : 'https://coinmarketcap.com/currencies/veritaseum/',
'VID' : 'https://coinmarketcap.com/currencies/videocoin/',
'XOR' : 'https://coinmarketcap.com/currencies/sora/',
'XPR' : 'https://coinmarketcap.com/currencies/proton/',
'GALA' : 'https://coinmarketcap.com/currencies/gala',
'NU' : 'https://coinmarketcap.com/currencies/nucypher',
'RAY' : 'https://coinmarketcap.com/currencies/raydium',
'GTC' : 'https://coinmarketcap.com/currencies/gitcoin',
'LPT' : 'https://coinmarketcap.com/currencies/livepeer',
'RGT' : 'https://coinmarketcap.com/currencies/rari-governance-token',
'PUNDIX' : 'https://coinmarketcap.com/currencies/pundix-new',
'QUICK' : 'https://coinmarketcap.com/currencies/quickswap',
'GNO' : 'https://coinmarketcap.com/currencies/gnosis-gno',
'VLX' : 'https://coinmarketcap.com/currencies/velas',
'EXRD' : 'https://coinmarketcap.com/currencies/radix',
'LCX' : 'https://coinmarketcap.com/currencies/lcx',
'KAR' : 'https://coinmarketcap.com/currencies/karura',
'ROOK' : 'https://coinmarketcap.com/currencies/keeperdao',
'BOND' : 'https://coinmarketcap.com/currencies/bonded-finance',
'RBTC' : 'https://coinmarketcap.com/currencies/rsk-smart-bitcoin',
'USDT' : 'https://coinmarketcap.com/currencies/tether',
'XYO' : 'https://coinmarketcap.com/currencies/xyo/',
'1INCH' : 'https://coinmarketcap.com/currencies/1inch/'

}
 

var moreTable = {	

'BTC' : 'https://www.cointouch.co/crypto/BTC',
'ETH' : 'https://www.cointouch.co/crypto/ETH',
'BNB' : 'https://www.cointouch.co/crypto/BNB',
'ADA' : 'https://www.cointouch.co/crypto/ADA',
'XRP' : 'https://www.cointouch.co/crypto/XRP',
'USDC' : 'https://www.cointouch.co/crypto/USDC',
'DOGE' : 'https://www.cointouch.co/crypto/DOGE',
'DOT' : 'https://www.cointouch.co/crypto/DOT',
'BUSD' : 'https://www.cointouch.co/crypto/BUSD',
'UNI' : 'https://www.cointouch.co/crypto/UNI',
'BCH' : 'https://www.cointouch.co/crypto/BCH',
'LTC' : 'https://www.cointouch.co/crypto/LTC',
'LINK' : 'https://www.cointouch.co/crypto/LINK',
'SOL' : 'https://www.cointouch.co/crypto/SOL',
'WBTC' : 'https://www.cointouch.co/crypto/WBTC',
'MATIC' : 'https://www.cointouch.co/crypto/MATIC',
'ETC' : 'https://www.cointouch.co/crypto/ETC',
'XLM' : 'https://www.cointouch.co/crypto/XLM',
'THETA' : 'https://www.cointouch.co/crypto/THETA',
'DAI' : 'https://www.cointouch.co/crypto/DAI',
'ICP' : 'https://www.cointouch.co/crypto/ICP',
'VET' : 'https://www.cointouch.co/crypto/VET',
'FIL' : 'https://www.cointouch.co/crypto/FIL',
'TRX' : 'https://www.cointouch.co/crypto/TRX',
'XMR' : 'https://www.cointouch.co/crypto/XMR',
'LUNA' : 'https://www.cointouch.co/crypto/LUNA',
'AAVE' : 'https://www.cointouch.co/crypto/AAVE',
'EOS' : 'https://www.cointouch.co/crypto/EOS',
'CRO' : 'https://www.cointouch.co/crypto/CRO',
'CAKE' : 'https://www.cointouch.co/crypto/CAKE',
'AXS' : 'https://www.cointouch.co/crypto/AXS',
'AMP' : 'https://www.cointouch.co/crypto/AMP',
'FTT' : 'https://www.cointouch.co/crypto/FTT',
'LEO' : 'https://www.cointouch.co/crypto/LEO',
'ALGO' : 'https://www.cointouch.co/crypto/ALGO',
'GRT' : 'https://www.cointouch.co/crypto/GRT',
'MKR' : 'https://www.cointouch.co/crypto/MKR',
'ATOM' : 'https://www.cointouch.co/crypto/ATOM',
'KLAY' : 'https://www.cointouch.co/crypto/KLAY',
'BSV' : 'https://www.cointouch.co/crypto/BSV',
'SHIB' : 'https://www.cointouch.co/crypto/SHIB',
'MIOTA' : 'https://www.cointouch.co/crypto/MIOTA',
'XTZ' : 'https://www.cointouch.co/crypto/XTZ',
'NEO' : 'https://www.cointouch.co/crypto/NEO',
'COMP' : 'https://www.cointouch.co/crypto/COMP',
'AVAX' : 'https://www.cointouch.co/crypto/AVAX',
'UST' : 'https://www.cointouch.co/crypto/UST',
'HT' : 'https://www.cointouch.co/crypto/HT',
'BTT' : 'https://www.cointouch.co/crypto/BTT',
'HBAR' : 'https://www.cointouch.co/crypto/HBAR',
'TFUEL' : 'https://www.cointouch.co/crypto/TFUEL',
'DCR' : 'https://www.cointouch.co/crypto/DCR',
'EGLD' : 'https://www.cointouch.co/crypto/EGLD',
'WAVES' : 'https://www.cointouch.co/crypto/WAVES',
'KSM' : 'https://www.cointouch.co/crypto/KSM',
'DASH' : 'https://www.cointouch.co/crypto/DASH',
'CHZ' : 'https://www.cointouch.co/crypto/CHZ',
'XEM' : 'https://www.cointouch.co/crypto/XEM',
'CEL' : 'https://www.cointouch.co/crypto/CEL',
'STX' : 'https://www.cointouch.co/crypto/STX',
'ZEC' : 'https://www.cointouch.co/crypto/ZEC',
'TUSD' : 'https://www.cointouch.co/crypto/TUSD',
'MANA' : 'https://www.cointouch.co/crypto/MANA',
'QNT' : 'https://www.cointouch.co/crypto/QNT',
'ENJ' : 'https://www.cointouch.co/crypto/ENJ',
'OKB' : 'https://www.cointouch.co/crypto/OKB',
'YFI' : 'https://www.cointouch.co/crypto/YFI',
'HOT' : 'https://www.cointouch.co/crypto/HOT',
'SNX' : 'https://www.cointouch.co/crypto/SNX',
'HNT' : 'https://www.cointouch.co/crypto/HNT',
'TEL' : 'https://www.cointouch.co/crypto/TEL',
'SUSHI' : 'https://www.cointouch.co/crypto/SUSHI',
'XDC' : 'https://www.cointouch.co/crypto/XDC',
'FLOW' : 'https://www.cointouch.co/crypto/FLOW',
'NEXO' : 'https://www.cointouch.co/crypto/NEXO',
'PAX' : 'https://www.cointouch.co/crypto/PAX',
'RUNE' : 'https://www.cointouch.co/crypto/RUNE',
'NEAR' : 'https://www.cointouch.co/crypto/NEAR',
'ZIL' : 'https://www.cointouch.co/crypto/ZIL',
'BAT' : 'https://www.cointouch.co/crypto/BAT',
'BTG' : 'https://www.cointouch.co/crypto/BTG',
'BNT' : 'https://www.cointouch.co/crypto/BNT',
'ONE' : 'https://www.cointouch.co/crypto/ONE',
'KCS' : 'https://www.cointouch.co/crypto/KCS',
'CELO' : 'https://www.cointouch.co/crypto/CELO',
'QTUM' : 'https://www.cointouch.co/crypto/QTUM',
'DGB' : 'https://www.cointouch.co/crypto/DGB',
'ZEN' : 'https://www.cointouch.co/crypto/ZEN',
'ONT' : 'https://www.cointouch.co/crypto/ONT',
'HUSD' : 'https://www.cointouch.co/crypto/HUSD',
'ZRX' : 'https://www.cointouch.co/crypto/ZRX',
'SC' : 'https://www.cointouch.co/crypto/SC',
'CRV' : 'https://www.cointouch.co/crypto/CRV',
'ANKR' : 'https://www.cointouch.co/crypto/ANKR',
'FTM' : 'https://www.cointouch.co/crypto/FTM',
'RVN' : 'https://www.cointouch.co/crypto/RVN',
'REV' : 'https://www.cointouch.co/crypto/REV',
'ICX' : 'https://www.cointouch.co/crypto/ICX',
'NANO' : 'https://www.cointouch.co/crypto/NANO',
'BAKE' : 'https://www.cointouch.co/crypto/BAKE',
'OMG' : 'https://www.cointouch.co/crypto/OMG',
'UMA' : 'https://www.cointouch.co/crypto/UMA',
'SAND' : 'https://www.cointouch.co/crypto/SAND',
'USDN' : 'https://www.cointouch.co/crypto/USDN',
'IOST' : 'https://www.cointouch.co/crypto/IOST',
'KAVA' : 'https://www.cointouch.co/crypto/KAVA',
'RSR' : 'https://www.cointouch.co/crypto/RSR',
'GLM' : 'https://www.cointouch.co/crypto/GLM',
'BCD' : 'https://www.cointouch.co/crypto/BCD',
'REN' : 'https://www.cointouch.co/crypto/REN',
'LSK' : 'https://www.cointouch.co/crypto/LSK',
'XVG' : 'https://www.cointouch.co/crypto/XVG',
'AR' : 'https://www.cointouch.co/crypto/AR',
'WRX' : 'https://www.cointouch.co/crypto/WRX',
'GUSD' : 'https://www.cointouch.co/crypto/GUSD',
'PAXG' : 'https://www.cointouch.co/crypto/PAXG',
'MAID' : 'https://www.cointouch.co/crypto/MAID',
'REP' : 'https://www.cointouch.co/crypto/REP',
'CKB' : 'https://www.cointouch.co/crypto/CKB',
'KNC' : 'https://www.cointouch.co/crypto/KNC',
'LRC' : 'https://www.cointouch.co/crypto/LRC',
'XVS' : 'https://www.cointouch.co/crypto/XVS',
'SKL' : 'https://www.cointouch.co/crypto/SKL',
'WIN' : 'https://www.cointouch.co/crypto/WIN',
'WAXP' : 'https://www.cointouch.co/crypto/WAXP',
'OCEAN' : 'https://www.cointouch.co/crypto/OCEAN',
'FET' : 'https://www.cointouch.co/crypto/FET',
'STORJ' : 'https://www.cointouch.co/crypto/STORJ',
'GT' : 'https://www.cointouch.co/crypto/GT',
'DENT' : 'https://www.cointouch.co/crypto/DENT',
'OGN' : 'https://www.cointouch.co/crypto/OGN',
'VTHO' : 'https://www.cointouch.co/crypto/VTHO',
'SNT' : 'https://www.cointouch.co/crypto/SNT',
'STRAX' : 'https://www.cointouch.co/crypto/STRAX',
'RLC' : 'https://www.cointouch.co/crypto/RLC',
'ALPHA' : 'https://www.cointouch.co/crypto/ALPHA',
'PROM' : 'https://www.cointouch.co/crypto/PROM',
'NMR' : 'https://www.cointouch.co/crypto/NMR',
'BAND' : 'https://www.cointouch.co/crypto/BAND',
'EWT' : 'https://www.cointouch.co/crypto/EWT',
'ABBC' : 'https://www.cointouch.co/crypto/ABBC',
'SXP' : 'https://www.cointouch.co/crypto/SXP',
'REEF' : 'https://www.cointouch.co/crypto/REEF',
'STMX' : 'https://www.cointouch.co/crypto/STMX',
'OXT' : 'https://www.cointouch.co/crypto/OXT',
'INJ' : 'https://www.cointouch.co/crypto/INJ',
'IOTX' : 'https://www.cointouch.co/crypto/IOTX',
'CVC' : 'https://www.cointouch.co/crypto/CVC',
'ANT' : 'https://www.cointouch.co/crypto/ANT',
'ERG' : 'https://www.cointouch.co/crypto/ERG',
'STEEM' : 'https://www.cointouch.co/crypto/STEEM',
'ARDR' : 'https://www.cointouch.co/crypto/ARDR',
'NKN' : 'https://www.cointouch.co/crypto/NKN',
'FUN' : 'https://www.cointouch.co/crypto/FUN',
'CTSI' : 'https://www.cointouch.co/crypto/CTSI',
'AMPL' : 'https://www.cointouch.co/crypto/AMPL',
'SRM' : 'https://www.cointouch.co/crypto/SRM',
'CELR' : 'https://www.cointouch.co/crypto/CELR',
'ORBS' : 'https://www.cointouch.co/crypto/ORBS',
'CHR' : 'https://www.cointouch.co/crypto/CHR',
'UQC' : 'https://www.cointouch.co/crypto/UQC',
'HIVE' : 'https://www.cointouch.co/crypto/HIVE',
'MCO' : 'https://www.cointouch.co/crypto/MCO',
'BAL' : 'https://www.cointouch.co/crypto/BAL',
'RIF' : 'https://www.cointouch.co/crypto/RIF',
'ZB' : 'https://www.cointouch.co/crypto/ZB',
'PHA' : 'https://www.cointouch.co/crypto/PHA',
'MLN' : 'https://www.cointouch.co/crypto/MLN',
'ARK' : 'https://www.cointouch.co/crypto/ARK',
'BTS' : 'https://www.cointouch.co/crypto/BTS',
'HEX' : 'https://www.cointouch.co/crypto/HEX',
'XWC' : 'https://www.cointouch.co/crypto/XWC',
'AUDIO' : 'https://www.cointouch.co/crypto/AUDIO',
'KEEP' : 'https://www.cointouch.co/crypto/KEEP',
'DYDX' : 'https://www.cointouch.co/crypto/DYDX',
'HXRO' : 'https://www.cointouch.co/crypto/HXRO',
'SUN' : 'https://www.cointouch.co/crypto/SUN',
'DODO' : 'https://www.cointouch.co/crypto/DODO',
'MTL' : 'https://www.cointouch.co/crypto/MTL',
'YFII' : 'https://www.cointouch.co/crypto/YFII',
'JST' : 'https://www.cointouch.co/crypto/JST',
'AVA' : 'https://www.cointouch.co/crypto/AVA',
'UTK' : 'https://www.cointouch.co/crypto/UTK',
'DEGO' : 'https://www.cointouch.co/crypto/DEGO',
'BTM' : 'https://www.cointouch.co/crypto/BTM',
'KMD' : 'https://www.cointouch.co/crypto/KMD',
'RLY' : 'https://www.cointouch.co/crypto/RLY',
'DATA' : 'https://www.cointouch.co/crypto/DATA',
'HNS' : 'https://www.cointouch.co/crypto/HNS',
'TRB' : 'https://www.cointouch.co/crypto/TRB',
'MXC' : 'https://www.cointouch.co/crypto/MXC',
'FIO' : 'https://www.cointouch.co/crypto/FIO',
'BZRX' : 'https://www.cointouch.co/crypto/BZRX',
'DIA' : 'https://www.cointouch.co/crypto/DIA',
'HARD' : 'https://www.cointouch.co/crypto/HARD',
'RARI' : 'https://www.cointouch.co/crypto/RARI',
'VRA' : 'https://www.cointouch.co/crypto/VRA',
'DOCK' : 'https://www.cointouch.co/crypto/DOCK',
'NULS' : 'https://www.cointouch.co/crypto/NULS',
'KEY' : 'https://www.cointouch.co/crypto/KEY',
'FRONT' : 'https://www.cointouch.co/crypto/FRONT',
'USDK' : 'https://www.cointouch.co/crypto/USDK',
'SOC' : 'https://www.cointouch.co/crypto/SOC',
'GTO' : 'https://www.cointouch.co/crypto/GTO',
'DF' : 'https://www.cointouch.co/crypto/DF',
'AKT' : 'https://www.cointouch.co/crypto/AKT',
'ANC' : 'https://www.cointouch.co/crypto/ANC',
'ARRR' : 'https://www.cointouch.co/crypto/ARRR',
'DAG' : 'https://www.cointouch.co/crypto/DAG',
'DFI' : 'https://www.cointouch.co/crypto/DFI',
'ELF' : 'https://www.cointouch.co/crypto/ELF',
'MBOX' : 'https://www.cointouch.co/crypto/MBOX',
'MIR' : 'https://www.cointouch.co/crypto/MIR',
'NXM' : 'https://www.cointouch.co/crypto/NXM',
'OMI' : 'https://www.cointouch.co/crypto/OMI',
'PERP' : 'https://www.cointouch.co/crypto/PERP',
'REQ' : 'https://www.cointouch.co/crypto/REQ',
'ROSE' : 'https://www.cointouch.co/crypto/ROSE',
'SLP' : 'https://www.cointouch.co/crypto/SLP',
'TRIBE' : 'https://www.cointouch.co/crypto/TRIBE',
'TWT' : 'https://www.cointouch.co/crypto/TWT',
'WAN' : 'https://www.cointouch.co/crypto/WAN',
'XCH' : 'https://www.cointouch.co/crypto/XCH',
'1INCH' : 'https://www.cointouch.co/crypto/1INCH',
'DOTUP' : 'https://www.cointouch.co/crypto/DOTUP',
'ETHUP' : 'https://www.cointouch.co/crypto/ETHUP',
'BNBUP' : 'https://www.cointouch.co/crypto/BNBUP',
'XRPUP' : 'https://www.cointouch.co/crypto/XRPUP',
'LINKUP' : 'https://www.cointouch.co/crypto/LINKUP',
'ADAUP' : 'https://www.cointouch.co/crypto/ADAUP',
'ADADOWN' : 'https://www.cointouch.co/crypto/ADADOWN',
'LINKDOWN' : 'https://www.cointouch.co/crypto/LINKDOWN',
'ETHDOWN' : 'https://www.cointouch.co/crypto/ETHDOWN',
'BNBDOWN' : 'https://www.cointouch.co/crypto/BNBDOWN',
'XRPDOWN' : 'https://www.cointouch.co/crypto/XRPDOWN',
'DOTDOWN' : 'https://www.cointouch.co/crypto/DOTDOWN',
'TRXDOWN' : 'https://www.cointouch.co/crypto/TRXDOWN',
'BTCDOWN' : 'https://www.cointouch.co/crypto/BTCDOWN'

}




  window.allSymbols = Object.keys(symName) // pull symbols only from above (make global so sort can get)

window.origSymbolList = window.allSymbols // so we can tell the user about new binance symbols flowing in

  // set up internal list of onesymbol div objects based upon the template defined above

  var template = document.getElementById("onestream")

  for (var i = 0; i < allSymbols.length; i++) {

     var clone = template.cloneNode(true) // clone children also e.g. the numbers and text in the tile

     clone.className = clone.className + i.toString() // now the main class name will be like onesymbol0, onesymbol1, etc

     clone.id = clone.id + i.toString()

     document.body.appendChild(clone) // add this child to the main body of the page

  }

  // get rid of template onesymbol, we already have all the tiles now

  template.remove()

   template.style.display = 'none' // we will need this to augment our tiles when new symbols come in from binance so keep it


  var url_string = window.location.href
  var url = new URL(url_string)
  var sym = url.searchParams.get("sym")

  // test
  if (!sym) sym = "ETH"

  // 2000 = milliseconds, delay randomly up to 2 seconds before launching to avoid
  // overloading the other side
  setTimeout(connect, /*3000*/ 0 * Math.random());

  var savedBackgroundImage = null
  var savedHighlightedTile = null

  // test binance stream connection
  // connectBinance(['BTC', 'ETH', 'ADA'])

  // this function can exist if we use CryCom stream instead as long as we don't call it, won't tie up stream connections

  // 2nd arg is function that gets called when we get data

  function connectBinance(ourSymbols, gotBinanceData) { // pass in array of upper case plain symbols no usdt suffix

    // works
    // const bws = new WebSocket( 'wss://stream.binance.com:9443/ws/btcusdt@ticker' );

    urlEnd = ''

    ourSymbols.forEach(x => {
      let separator = (urlEnd == '') ? '' : '/' // no separator at start
      urlEnd = urlEnd + separator + x.toLowerCase(x) + 'usdt@ticker'
    })

    // urlEnd model is like this: btcusdt@ticker/ethusdt@ticker

    console.info("urlEnd = " + urlEnd)

    //const bws = new WebSocket( 'wss://stream.binance.com:9443/stream?streams=' + urlEnd )
    const bws = new WebSocket( 'wss://fstream.binance.com/stream?streams=' + urlEnd )

    if (typeof window.lastTimeStamp == 'undefined') {
      window.lastTimeStamp = Date.now()
      window.sumTimeDeltas = 0
      window.nTimeStamps = 0
     }

    //console.info('loc 0')

    bws.addEventListener( 'message', e => {
      //console.info("binance message = " + JSON.stringify(e.data, null, 2))

      if (gotBinanceData) gotBinanceData(e) // send data to the application just as it comes in no parsing or anything


      //let data = JSON.parse( e.data ) || {};
      //let { s,p,P,o,h,l,c,b,a,w,Q,B,A } = data;

      if (false) { // JJ's initial example from binance

        el.textContent = Number( c );
        symbol.textContent = s
        open.textContent = Number( o );
        high24.textContent = Number( h );
        low24.textContent = Number( l );
        close.textContent = Number(c);
        coinvol.textContent = Number(v);
        vol.textContent = Number(q);
        change.textContent = Number(p);
        percent.textContent = Number(P);
        bid.textContent = Number(b);
        ask.textContent = Number(a);
        Bid.textContent = Number(B);
        Ask.textContent = Number(A);
        bidask.textContent = Number(a)-Number(b);
        bidaskpct.textContent = Number((a-b)*100/c)
        rangevol.textContent = Number(((h-l)/w)*100)

        change.rawfloat = Number(c-o);

        if (Number(p) > 0) {

              change.textContent = Number(p);
              percent.textContent = Number(P);
              change.style.color = 'lime'
              percent.style.color = 'lime'

        } else {

              change.textContent = Number(p);
              percent.textContent = Number(P);
              change.style.color = 'red'
              percent.style.color = 'red'

        }
      }
    })
  }

  function connect() {

    var cc = useBinance ? null : new WebSocket('wss://streamer.cryptocompare.com/v2?api_key=6754e907a673813903283fa627c08c3935e4e80415973721ed33c0771c467323')

    if (useBinance)
      connectBinance(allSymbols, onStreamMessage) // see below, we call teh same onStreamMessage as for CC but we have to parse the results different in there

    // build subs array from above allSymbols list

    var subs = []

    var base = "USDT" // input "USDT" or "USD" as the base trading currency "USD" shows the US exchanges eg Coinbase 

    for (var i = 0; i < allSymbols.length; i++)
      subs.push("5~CCCAGG~" + allSymbols[i] + "~" + base) // subs.push("2~Coinbase~" + allSymbols[i] + "~USD") or subs.push("5~CCCAGG~" + allSymbols[i] + "~USD")

   if (!useBinance)
    cc.onopen = function onStreamOpen() {
      var subRequest = {
          "action": "SubAdd",
          "subs": subs
        };

        cc.send(JSON.stringify(subRequest));
    }


   var animSuffix = ''

   var priceChangeArray = []

   var lastPriceChangeTime = 0

  const evtSource = useBinance ? new EventSource(cc) : null

  console.log("hook up stream for " + sym) // not sure what this is maybe for single stream test case

  var storedOpen24 = {} // open 24 referenced by symbol when it comes in from stream, does not come from stream every data objert

  // new way we have many of the text elements by the same name so we have to find them by path

  // this is the crypto compare on stream message to start but it is huge so we should try to make
  // it work the same for binance stream

  /*cc.onmessage = */function onStreamMessage(message) {


    if (savedLevel3iFrame && savedLevel3iFrame.style.opacity != 0)
    {
       return // skip level 2 stream data if we are going to level 3
    }

    if (window.animatingLevels) return // dont process messages when animating between levels


    var incomingMessage = message
    if (event && !isRefresh) message = event.data // something strange about this, review // fixed 25Jan2022 firefox issue

    //console.log("Received from Cryptocompare: " + message)

    // avoid breaking fast refresh, check for undefined
    if (message && typeof message != 'string' && typeof message != 'undefined' && message.data) message = message.data // one level more (firefox)

    if (!message) return // avoid an error in console if message is empty, cannot parse it on next line


    var x = JSON.parse(message)

    if (useBinance) x = x.data // one more level for binance

    console.info("parsed message: " + JSON.stringify(x, null, 2))

    // this is going to break for Binance data so just return
    // left is CC key, right is binance key

    let keymapping = {
      'FROMSYMBOL' : 's',
      'PRICE' : 'c',
     'TOPTIERVOLUME24HOURTO' : 'q',
      'HIGH24HOUR' : 'h',
      'LOW24HOUR' : 'l',
      'OPEN24HOUR' : 'x' // tentative, see https://github.com/binance/binance-spot-api-docs/blob/master/web-socket-streams.md#retrieving-properties
    }

    // map to proper key if binance stream, otherwise use CC key
    function map(key) {
      if (!useBinance) return key
      return keymapping[key]
    }

    var sym = x[map("FROMSYMBOL")]

    if (useBinance) sym = sym.replace('USDT', '') // may want to anchor to end later

    console.info("sym = " + sym) // returned sym from binance is already upper case

    // compute which number tile we should assign this data to, based on the symbol coming in on the stream

    if (!sym) return

    var tileNumber = allSymbols.findIndex(function(x) {
      console.log("looking for sym " + sym)
      if (sym) {
        return x.toUpperCase() === sym.toUpperCase()
      }
    })

    // get the text elements within this particular tile number

    var topTile = document.querySelector('#onestream' + tileNumber)

   // for refreshing before data comes in e.g. changing tile colors
    if (!topTile.lastMessage) // only store the first message
      topTile.lastMessage = message

    // pass in selector 

// already defined earlier let topTile = document.querySelector('#onestream' + tileNumber)



   // topTile.onmouseover = (event) => {
   //   const target = event.currentTarget
   //   savedBackgroundImage = target.style.backgroundImage
   //   savedHighlightedTile = target
   //   target.style.backgroundImage = null
   //   target.style.backgroundColor = '#ffffff00' // simple background color change hilite to start
      // can do fancier as we go
      // boost font size of price change and percent change as example
   //   target.querySelector("#changeOut").classList.add("boostFont")
   //   target.querySelector("#percentOut").classList.add("boostFont")
   //   target.querySelector("#symOut").classList.add("boostFont")
   //   target.querySelector("#priceOut").classList.add("boostFont")
   // }

   // topTile.addEventListener('mouseout', (event) => {
   //   savedHighlightedTile.style.backgroundImage = savedBackgroundImage
   //   savedHighlightedTile.querySelector("#changeOut").classList.remove("boostFont")
    //  savedHighlightedTile.querySelector("#percentOut").classList.remove("boostFont")
   //   savedHighlightedTile.querySelector("#symOut").classList.remove("boostFont")
   //   savedHighlightedTile.querySelector("#priceOut").classList.remove("boostFont")
   // })

  //  topTile.addEventListener('mouseleave', (event) => {
   //   savedHighlightedTile.style.backgroundImage = savedBackgroundImage
   //   savedHighlightedTile.querySelector("#changeOut").classList.remove("boostFont")
   //   savedHighlightedTile.querySelector("#percentOut").classList.remove("boostFont")
   //   savedHighlightedTile.querySelector("#symOut").classList.remove("boostFont")
  //    savedHighlightedTile.querySelector("#priceOut").classList.remove("boostFont")
  //  })


    // for refreshing before data comes in e.g. changing tile colors
    if (!topTile.lastMessage) // only store the first message
      topTile.lastMessage = message



    var element = topTile.querySelector("#priceOut")
    var symElement = topTile.querySelector("#symOut")
    var symBreakElement = topTile.querySelector("#afterSymBreak")
    var nameElement = topTile.querySelector("#nameOut")
    var volElement = topTile.querySelector("#volOut")
    var mcsupplyElement = topTile.querySelector("#mcsupplyOut")
    var mktcapElement = topTile.querySelector("#mktcapOut")
    var mktcap2Element = topTile.querySelector("#mktcap2Out")
    var totalvolElement = topTile.querySelector("#totalvolOut")
    var vol1hElement = topTile.querySelector("#vol1hOut")
    var avgvol7dElement = topTile.querySelector("#avgvol7dOut")
    var cmcvolElement = topTile.querySelector("#cmcvolOut")
    var cmccirculatingElement = topTile.querySelector("#cmccirculatingOut")
    var cmccirculating2Element = topTile.querySelector("#cmccirculating2Out")
    var avgvolElement = topTile.querySelector("#avgvolOut")
    var relvol1hlabelElement = topTile.querySelector("#relvol1hlabelOut")
    var relvol1dlabelElement = topTile.querySelector("#relvol1dlabelOut")
    var relvol1hElement = topTile.querySelector("#relvol1hOut")
    var relvol1dElement = topTile.querySelector("#relvol1dOut")
    var lastElement = topTile.querySelector("#lastOut")
    var cmcrelvolElement = topTile.querySelector("#cmcrelvolOut")
    // var vsbtcElement = topTile.querySelector("#vsbtcOut")
    var weekElement = topTile.querySelector("#weekOut")
    var weekchangeElement = topTile.querySelector("#weekchangeOut")
    var weeklabelElement = topTile.querySelector("#weeklabelOut")
    var week2Element = topTile.querySelector("#week2Out")
    var monthElement = topTile.querySelector("#monthOut")
    var monthchangeElement = topTile.querySelector("#monthchangeOut")
    var monthlabelElement = topTile.querySelector("#monthlabelOut")
    var month2Element = topTile.querySelector("#month2Out")
    var quarterElement = topTile.querySelector("#quarterOut")
    var quarterchangeElement = topTile.querySelector("#quarterchangeOut")
    var quarterlabelElement = topTile.querySelector("#quarterlabelOut")
    var quarter2Element = topTile.querySelector("#quarter2Out")
    var hourElement = topTile.querySelector("#hourOut")
    var hourchangeElement = topTile.querySelector("#hourchangeOut")
    var hourlabelElement = topTile.querySelector("#hourlabelOut")
    var hour2Element = topTile.querySelector("#hour2Out")
    var ytdlabelElement = topTile.querySelector("#ytdlabelOut")
    var ytdElement = topTile.querySelector("#ytdOut")
    var ytd2Element = topTile.querySelector("#ytd2Out")
    var year1labelElement = topTile.querySelector("#year1labelOut")
    var year1Element = topTile.querySelector("#year1Out")
    var year12Element = topTile.querySelector("#year12Out")
    var open24Element = topTile.querySelector("#open24Out")
    var high24Element = topTile.querySelector("#high24Out")
    var low24Element= topTile.querySelector("#low24Out")
    var volatility24Element = topTile.querySelector("#volatility24Out")
    var percElement = topTile.querySelector("#percentOut")
    var changeElement = topTile.querySelector("#changeOut")
    var percentarrowElement = topTile.querySelector("#percentarrowOut")
    var percentdisplaylabelElement = topTile.querySelector("#percentdisplaylabelOut")
    var percentdisplayElement = topTile.querySelector("#percentdisplayOut")
    var percentdisplayarrowElement = topTile.querySelector("#percentdisplayarrowOut")
    var ytdchangeElement = topTile.querySelector("#ytdchangeOut")
    var backgroundDiv = topTile
    var coinIcon = topTile.querySelector("#coinIcon")
    var sectorElement = topTile.querySelector("#sectorOut")
    var descriptionElement = topTile.querySelector("#descriptionOut")
     var cmctagElement = topTile.querySelector("#cmctagOut")
     var cmctag2Element = topTile.querySelector("#cmctag2Out")
    var cmcslugElement = topTile.querySelector("#cmcslugOut")
    var cmcslug2Element = topTile.querySelector("#cmcslug2Out")
    var cmcrankElement = topTile.querySelector("#cmcrankOut")
    var cmcrank2Element = topTile.querySelector("#cmcrank2Out")
    var cmclinkElement = topTile.querySelector("#cmclinkOut")
    var cmclink2Element = topTile.querySelector("#cmclink2Out")
    var urlElement = topTile.querySelector("#urlOut")
    var  url2Element = topTile.querySelector("#url2Out")
    var cointokenElement = topTile.querySelector("#cointokenOut")
    var tradelinkElement = topTile.querySelector("#tradelinkOut")
    var tradelink2Element = topTile.querySelector("#tradelink2Out")
    var tradetextElement = topTile.querySelector("#tradetextOut")
    var binancelinkElement = topTile.querySelector("#binancelinkOut")
    var binancelink2Element = topTile.querySelector("#binancelink2Out")
    var upholdlinkElement = topTile.querySelector("#upholdlinkOut")
    var upholdlink2Element = topTile.querySelector("#upholdlink2Out")
    var geminilinkElement = topTile.querySelector("#geminilinkOut")
    var geminilink2Element = topTile.querySelector("#geminilink2Out")
    var kucoinlinkElement = topTile.querySelector("#kucoinlinkOut")
    var kucoinlink2Element = topTile.querySelector("#kucoinlink2Out")
    var ftxlinkElement = topTile.querySelector("#ftxlinkOut")
    var ftxlink2Element = topTile.querySelector("#ftxlink2Out")
    // var moreElement = topTile.querySelector("#moreOut")
    // var more2Element = topTile.querySelector("#more2Out")
    var downloadElement = topTile.querySelector("#downloadOut")

    var afterNameBreakElement = topTile.querySelector("#afterNameBreak")


    nameElement.innerHTML = symName[sym] // assign name

    symElement.innerHTML = sym // + "BTC"

    if (!coinIcon.assigned) {// avoid doing this every time if it is already assigned, could be a slow call
      coinIcon.src = imageUrlTable[sym]
      coinIcon.assigned = true // hack
    }

    var priorPrice = element.innerHTML.replace('$', '') // for color pop get rid of dollar sign

    var price = parseFloat(x[map("PRICE")]) // make sure it's a number not a string (binance)
    if (price) { // price is sometimes not defined so check for it
      console.log("price = " + price)
      var decimals = (price > 100.0) ? 2 : 5 // use more decimal places for under 10 dollar coins
      // very small price coins override
      // decimals = 2
      if (price < 0.001) {
          decimals = 7 // use more decimal places for very small price coins (should possibly make font smaller too)
          // element.style.marginRight = '25px' // bump over margin if extra decimals
          // while we are at it, make the price change element font tiny so it doesnt wrap to next row which bumps the tile up out of the div line
          // this doenst do it, just hide for now
          // changeElement.style.display = 'none'
      } else
        changeElement.style.display = 'inline-block'
        element.innerHTML = "$" + price.toFixed(decimals)
    } else {

        // it looks like sometimes no price comes in , which is going to mess up change, etc, so ignore for now
        // e.g. sometimes only volume data is coming in (handle that later)

        return // just get out if no price
    }

    var priceDelta = 0                // for color pop

    if (priorPrice != 0 && price > 0) {   // for color pop
      priceDelta = price - priorPrice     // for color pop
    }                                 // for color pop



    var open24 = parseFloat(x[map("OPEN24HOUR")]) // need to find equiv for binance stream https://github.com/binance/binance-spot-api-docs/blob/master/web-socket-streams.md#retrieving-properties
    // it might be 'x' key

    console.info(sym + " OPEN24HOUR tentative binance " + open24)

    var change = 0


    if (open24)
      storedOpen24[sym] = open24
    else
      open24 = storedOpen24[sym] // get open24 from in mem storage if it is not specified in this stream chunk


    if (open24) { // open24 is sometimes not defined so check for it
      console.log("open24 = " + open24)
      open24Element.innerHTML = "Open24H: " + open24

      if (!price) {
        console.log("caution, price is undefined when computing change")
      }
      change = (price - open24)
    } else {
      console.log("caution open24 is 0")
    }



     var high24 = parseFloat(x[map("HIGH24HOUR")]) // need to find equiv for binance stream https://github.com/binance/binance-spot-api-docs/blob/master/web-socket-streams.md#retrieving-properties
 

     var low24 = parseFloat(x[map("LOW24HOUR")]) // need to find equiv for binance stream https://github.com/binance/binance-spot-api-docs/blob/master/web-socket-streams.md#retrieving-properties


     var volatility24 = 100*(high24 - low24)/open24

     volatility24Element.innerHTML = "V&#963;:" + volatility24.toFixed(2) + "%"

     
     volatility24Element.rawFloat = 100*(high24 - low24)/open24
 
     
      high24Element.innerHTML = "H: " + high24.toFixed(decimals)

     low24Element.innerHTML = "L: " + low24.toFixed(decimals)






    // Copyright Abxium Inc 2021 -- all rights reserved
   // min max in percent (note:  we are using backgroundGradients but we leave the solid color background for example just in case)
    var backgroundColors = [

    {'min' :  5.0, 'max' : 1000000, 'color' :  '#33ff33'}, // green
    {'min' :  2.0, 'max' : 5.0, 'color' :   '#33bb33'},  // more green
    {'min' :  0.5, 'max' : 2.0, 'color' :   '#338833'}, // dark green

    {'min' : -0.5, 'max' : 0.5, 'color' :   '#333333'},  // dark gray

    {'min' : -2.0, 'max'  : -0.5, 'color' :  '#883333'}, // dark red
    {'min' : -5.0, 'max'  : -2.0, 'color' :  '#bb3333'}, // more red
    {'min' : -1000, 'max' : -5.0, 'color' : '#ff3333'} // red

    ]

    // 'color' is bottom color, 'colorTop' is top color
    var backgroundGradients = [

    {'min' :  5.0, 'max' : 1000000, 'color' :  '#016810', colorTop: '#07ab35'}, // green
    {'min' :  2.0000, 'max' : 5.0000, 'color' :   '#012714', colorTop: '#02400B'},  // more green
    {'min' :  0.5000, 'max' : 2.0000, 'color' :   '#011c0e', colorTop: '#012714'}, // dark green

    {'min' : -0.5000, 'max' : 0.5000, 'color' :   '#000000', colorTop: '#171924'},  // dark gray

    {'min' : -2.0000, 'max'  : -0.5000, 'color' :  '#170101', colorTop: '#260102'}, // dark red
    {'min' : -5.0000, 'max'  : -2.0000, 'color' :  '#260102', colorTop: '#460103'}, // more red
    {'min' : -99.0000, 'max' : -5.0000, 'color' : '#460103', colorTop: '#6A0312'} // red

    ]

    // RELVOL GRAD color is bottom color 'colorTop' is top color this has revised pink blue dark grey RelVol tile scale

    var backgroundGradientsRelVol = [

    {'min' :  160, 'max' : 100000, 'color' :  '#a30278', colorTop: '#c2008e'},    // pink
    {'min' :  130, 'max' : 160, 'color' :  '#000088', colorTop: '#0000ff'},     // bright blue
    {'min' :  110, 'max' : 130, 'color' :  '#000033', colorTop: '#000088'},    // bright blue

    {'min' : 90, 'max' : 110, 'color' :  '#000000', colorTop: '#000000'},    // med blue

    {'min' : 70, 'max'  : 90, 'color' :  '#000000', colorTop: '#000000'},  //  med blue
    {'min' : 40, 'max'  : 70, 'color' :  '#02101f', colorTop: '#171924'}, //  dark grey gradient
    {'min' : 0, 'max' : 40, 'color' :  '#02101f', colorTop: '#171924'}   //  dark grey gradient

    ]

   var backgroundGradientsSolid = [

    {'min' :  5.0, 'max' : 1000, 'color' :  '#00060d', colorTop: '#171924'}, // green
    {'min' :  130, 'max' : 199, 'color' :  '#00060d', colorTop: '#171924'},     // bright blue
    {'min' :  110, 'max' : 130, 'color' :  '#00060d', colorTop: '#171924'},    // bright blue

    {'min' : 90, 'max' : 110, 'color' :  '#00060d', colorTop: '#171924'},    // med blue

    {'min' : 70, 'max'  : 90, 'color' :  '#00060d', colorTop: '#171924'},  //  med blue
    {'min' : 40, 'max'  : 70, 'color' :  '#00060d', colorTop: '#171924'}, //  dark grey gradient
    {'min' : 0, 'max' : 40, 'color' :  '#00060d', colorTop: '#171924'}   //  dark grey gradient

    ]


    // 'color' is bottom color, 'colorTop' is top color
    var backgroundGradientsBright = [ 

    {'min' :  5.0, 'max' : 1000000, 'color' :  '#419228', colorTop: '#74fa4c'}, // green  '#016810', colorTop: '#07ab35'
    {'min' :  2.0000, 'max' : 5.0000, 'color' :   '#012714', colorTop: '#02400B'},  // more green '#012714', colorTop: '#02400B
    {'min' :  0.5000, 'max' : 2.0000, 'color' :   '#1d4910', colorTop: '#4aa52f'}, // dark green '#011c0e', colorTop: '#012714'

    {'min' : -0.5000, 'max' : 0.5000, 'color' :   '#020202', colorTop: '#24272b'},  // dark gray with st

    {'min' : -2.0000, 'max'  : -0.5000, 'color' :  '#3a0603', colorTop: '#7c160d'}, // dark red '#170101', colorTop: '#260102'
    {'min' : -5.0000, 'max'  : -2.0000, 'color' :  '#81180e', colorTop: '#cd2c1e'}, // more red '#260102', colorTop: '#460103'
    {'min' : -99.0000, 'max' : -5.0000, 'color' : '#ca2b1d', colorTop: '#ff0000'} // red '#460103', colorTop: '#6A0312'

    ]

    var backgroundGradientsVolatility = [

    {'min' :  18, 'max' : 100000, 'color' :  '#9e0267', colorTop: '#f205a7'},    // magenta
    {'min' :  10, 'max' : 18, 'color' :  '#5c003a', colorTop: '#bd1a81'},     // med pink
    {'min' :  5, 'max' : 10, 'color' :  '#400140', colorTop: '#4f0129'},    // dark magenta #5e025e

    {'min' : 0, 'max' : 5, 'color' :  '#02101f', colorTop: '#171924'},    // med blue

   // {'min' : 70, 'max'  : 90, 'color' :  '#02101f', colorTop: '#171924'},  //  med blue
   // {'min' : 40, 'max'  : 70, 'color' :  '#02101f', colorTop: '#171924'}, //  dark grey gradient
  //  {'min' : 0, 'max' : 40, 'color' :  '#02101f', colorTop: '#171924'}   //  dark grey gradient

    ]

    var backgroundGradientsVolumeFut = [

    {'min' :  1000000000, 'max' : 1000000000000000, 'color' :  '#5504b8', colorTop: '#7d12ff'},    // bright purple '#7d26e8'
    {'min' :  300000000, 'max' : 1000000000, 'color' :  '#2d0063', colorTop: '#47029c'},     // med purple
    {'min' :  50000000, 'max' : 300000000, 'color' :  '#130252', colorTop: '#200589'},    // dark purple #5e025e

    {'min' : 0, 'max' : 50000000, 'color' :  '#02101f', colorTop: '#171924'},    // dark purple

   // {'min' : 0, 'max'  : 30000000, 'color' :  '#02101f', colorTop: '#171924'},  //  med blue
   // {'min' : 40, 'max'  : 70, 'color' :  '#02101f', colorTop: '#171924'}, //  dark grey gradient
  //  {'min' : 0, 'max' : 40, 'color' :  '#02101f', colorTop: '#171924'}   //  dark grey gradient

    ]





    // figure background color based on percent
    function findBackgroundColor(percent) {
           for (var i = 0; i < backgroundColors.length; i++) {
              if (percent > backgroundColors[i].min && percent <= backgroundColors[i].max)
                return backgroundColors[i].color
           }
        }

    // figure background gradient based on percent
    function findBackgroundGradient(percent) {
           for (var i = 0; i < backgroundGradients.length; i++) {
              if (percent > backgroundGradients[i].min && percent <= backgroundGradients[i].max)
                return backgroundGradients[i]
           }
           console.log('***** caution cant find background gradient for percent ' + percent)
           return backgroundGradients[3] // return gray
        }

    // figure background gradient based on percent
    function findBackgroundGradientRelVol(percent) {
           for (var i = 0; i < backgroundGradientsRelVol.length; i++) {
              if (percent > backgroundGradientsRelVol[i].min && percent <= backgroundGradientsRelVol[i].max)
                return backgroundGradientsRelVol[i]
           }
           console.log('***** caution cant find background gradient for percent ' + percent)
           return backgroundGradientsRelVol[3] // return gray
        }


    // figure background gradient based on percent
    function findBackgroundGradientSolid(percent) {
           for (var i = 0; i < backgroundGradientsSolid.length; i++) {
              if (percent > backgroundGradientsSolid[i].min && percent <= backgroundGradientsSolid[i].max) 
                return backgroundGradientsSolid[i]
           }
           //console.log('***** caution cant find background gradient for percent ' + percent)
           return backgroundGradientsSolid[3] // return gray
        }

    // figure background gradient based on percent
    function findBackgroundGradientBright(percent) {
           for (var i = 0; i < backgroundGradientsBright.length; i++) {
              if (percent > backgroundGradientsBright[i].min && percent <= backgroundGradientsBright[i].max) 
                return backgroundGradientsBright[i]
           }
           //console.log('***** caution cant find background gradient for percent ' + percent)
           return backgroundGradientsBright[3] // return gray
        }

    // figure background gradient based on volatility
    function findBackgroundGradientVolatility(volatility24) {
           for (var i = 0; i < backgroundGradientsVolatility.length; i++) {
              if (volatility24 > backgroundGradientsVolatility[i].min && percent <= backgroundGradientsVolatility[i].max)
                return backgroundGradientsVolatility[i]
           }
           console.log('***** caution cant find background gradient for percent ' + volatility24)
           return backgroundGradientsVolatility[3] // return gray
        }


    // figure background gradient based on volatility
    function findBackgroundGradientVolumeFut(vol) {
           for (var i = 0; i < backgroundGradientsVolumeFut.length; i++) {
              if (vol > backgroundGradientsVolumeFut[i].min && vol <= backgroundGradientsVolumeFut[i].max)
                return backgroundGradientsVolumeFut[i]
           }
           console.log('***** caution cant find background gradient for percent ' + vol)
           return backgroundGradientsVolumeFut[3] // return gray
        }



    console.log('ready to compute percent, change = ' + change + " open24 = " + open24)



    // var percent = (change / open24*100)

    var percent= parseFloat(x["P"])? parseFloat(x["P"]) : (change / open24)*100

    if (change > 0) {
      symElement.style.color='#fefefe'
      element.style.color = '#fefefe' // pop color should end up at this
      percElement.style.color = '#16de94'
      changeElement.style.color = '#16de94'
      percElement.innerHTML = "+" + percent.toFixed(3) + "%"
      percElement.rawFloat = percent // hack
      percentarrowElement.style.color = '#16de94'
      percentarrowElement.innerHTML = '<i class="fas fa-arrow-up"></i>'
      changeElement.innerHTML = "+$" + change.toFixed(decimals)
      changeElement.rawFloat = change // hack

     } else {
       symElement.style.color='#fefefe'
       element.style.color = '#fefefe' // pop color should end up at this
       percElement.style.color = '#bf0027'
       percElement.innerHTML = percent.toFixed(3) + "%"
       percElement.rawFloat = percent // hack
       percentarrowElement.innerHTML = '<i class="fas fa-arrow-down"></i>'
       percentarrowElement.style.color = '#bf0027'
       changeElement.style.color = '#bf0027'
       changeElement.innerHTML = "$" + change.toFixed(decimals)
       changeElement.rawFloat = change
     }


   var daylabel = + "1D"


    var day2 = percent


                if (change> 0) {
                  daylabelElement.style.color='#16de94'
                  daylabelElement.innerHTML= "1D"
                  day2Element.style.color='#16de94'
                  day2Element.innerHTML = "+" + day2.toFixed(2) + "%"

                  day2Element.rawFloat = week2



                } else {
                  daylabelElement.style.color='#bf0027'
                  daylabelElement.innerHTML= "1D"
                  day2Element.style.color='#bf0027'
                  day2Element.innerHTML = "-" + Math.abs(day2).toFixed(2) + "%"

                  day2Element.rawFloat = week2

                 
                }





      // color pop of price test

      // future prep to take average of many price deltas
      priceChangeArray.push(priceDelta)

      const maxAvgCount = 10
      if (priceChangeArray.length > maxAvgCount) priceChangeArray.shift() // remove 1st item if we already have max

      let avgPriceDelta = priceChangeArray/priceChangeArray.length
      
      symElement.style.animationName = 'none'
      element.style.animationName = 'none'

      // if we have to set the same animation name twice in a row
         // the browser doesnt trigger the animate (it thinks there is nothing to change)
         //  so we have dual animations for each color and alternate between them

         if (animSuffix == '') animSuffix = '1'
          else if (animSuffix == '1') animSuffix = ''

        var timeDelta = Date.now() - lastPriceChangeTime

        var priceDeltaToUse = priceDelta

        // if data is coming in too fast, use average price delta and dont pop

        // time in millisec

        const timeCutoff = 1000

        // future: if (timeDelta < timeCutoff) priceDeltaToUse = avgPriceDelta

        if (priceDeltaToUse != 0) {
            // animated pop logic
            // console.log("price delta " + priceDelta)
            if (priceDelta > 0)
              element.style.animationName = 'popGreen' + animSuffix
            else
              element.style.animationName = 'popRed' + animSuffix
        } else if (false) { // dont do this yet

          // just make the color solid if data is coming in fast to avoid too much flashing
          // only if market hours (have to fix for weekend)


            if (priceDelta > 0)
              element.style.color = 'green'
            else
              element.style.color = 'red'

        }




   if (priceDeltaToUse != 0) {
            // animated pop logic
            console.log("price delta " + priceDelta)
            if (priceDelta > 0)
              symElement.style.animationName = 'popGreen' + animSuffix
            else 
              symElement.style.animationName = 'popRed' + animSuffix 
        } else if (false) { // dont do this yet

          // just make the color solid if data is coming in fast to avoid too much flashing
          // only if market hours (have to fix for weekend)


            if (priceDelta > 0)

              symElement.style.color = 'green'
            else 
              symElement.style.color = 'red' 

        }




        //backgroundDiv.style.backgroundColor =  findBackgroundColor(percent*100)

        var gradient = findBackgroundGradientSolid(percent) // default use price tile colors

        //backgroundDiv.style.backgroundImage.linearGradient(gradient.color, gradient.colorTop)

        var grad1 = '-webkit-linear-gradient(' + gradient.colorTop + ', ' + gradient.color + ')'

        // console.log("grad1 = " + grad1)

      backgroundDiv.style.backgroundImage = grad1
      backgroundDiv.saveBackgroundImage = grad1

   // var vol = x["TOPTIERVOLUME24HOURTO"]

      var vol = parseFloat(x[map("TOPTIERVOLUME24HOURTO")])

     // var vol = x["q"]

     
     
    

    // volElement.innerHTML = Math.round(vol)

    volElement.rawFloat = Math.round(vol)
    // volElement.innerHTML = "USDM:$" + Math.round(vol).toLocaleString("en-US")
     volElement.innerHTML = Math.round(vol)


    volElement.innerHTML = "ExchVol1D:$" + Math.round(vol).toLocaleString("en-US")


    var vol1h = x["VOLUMEHOURTO"]
    vol1hElement.innerHTML = "ExchVol1H:$" + Math.round(vol1h).toLocaleString("en-US")

    var last = x["LASTMARKET"]

    last = last? last : null

    lastElement.innerHTML = last


    var relvol1hlabel = "RelVol1H: "

    relvol1h = vol1h/(vol/24)

    relvol1hElement.innerHTML = + (relvol1h*100).toFixed(2) + "%"

    relvol1hElement.rawFloat = relvol1h*100

    // override prior computed tile color gradient if map selector is set to Volume
    if (window.STMapValue == "RelVol1H") { // pick a volume tile color instead (rel vol)
          console.log("volume tile compute from " + relvol1hElement.rawFloat)
          gradient = findBackgroundGradientRelVol(relvol1hElement.rawFloat)
          var grad2 = '-webkit-linear-gradient(' + gradient.colorTop + ', ' + gradient.color + ')'
          console.log("grad2 = " + grad2)
          backgroundDiv.style.backgroundImage = grad2
    }

    // override prior computed tile color gradient if map selector is set to Volume
    if (window.STMapValue == "Price1D") { // pick a volume tile color instead (rel vol)
          console.log("volume tile compute from " + percElement.rawFloat)
          gradient = findBackgroundGradient(percElement.rawFloat)
          var grad4 = '-webkit-linear-gradient(' + gradient.colorTop + ', ' + gradient.color + ')'
          console.log("grad4 = " + grad4)
          backgroundDiv.style.backgroundImage = grad4
    }


                if (Math.abs(relvol1h)> 1.00) {
                  relvol1hlabelElement.style.color='#FF6037'
                  relvol1hlabelElement.innerHTML = relvol1hlabel
                  relvol1hElement.style.color='#FF6037'

                  relvol1hElement.innerHTML = + (relvol1h*100).toFixed(2) + "%"
                  relvol1hElement.rawFloat = relvol1h*100



                } else {
                  relvol1hlabelElement.style.color='#FF6037'
                  relvol1hlabelElement.innerHTML = relvol1hlabel
                  relvol1hElement.style.color='#FF6037'
                  relvol1hElement.innerHTML = + (relvol1h*100).toFixed(2) + "%"
                  relvol1hElement.rawFloat = relvol1h*100
                }


    // override prior computed tile color gradient if map selector is set to Volume
    if (window.STMapValue == "MapBright") { // pick a volume tile color instead (rel vol)
          console.log("volume tile compute from " + percElement.rawFloat)
          gradient = findBackgroundGradientBright(percElement.rawFloat)
          var grad4 = '-webkit-linear-gradient(' + gradient.colorTop + ', ' + gradient.color + ')'
          console.log("grad11 = " + grad11)
          backgroundDiv.style.backgroundImage = grad11
    }




     var cmccirculating2 = cmccirculating[sym]?  cmccirculating[sym] : 0

    // cmccirculating2Element.innerHTML = 'Circulating:' + cmccirculating2.toLocaleString("en-US")

      cmccirculating2Element.innerHTML = Math.round(cmccirculating2)


   // var mktcap = mcsupply[sym] * price

      var mktcap = mcsupply[sym]? mcsupply[sym] * price : 0


      if (cmccirculating[sym]) { // set this to use the circulating supply since API mktcap incorrect
     console.log("using calc mktcap")
     mktcap = cmccirculating[sym] * price
      }


    mktcapElement.innerHTML = "MktCap:$" + Math.round(mktcap).toLocaleString("en-US")

    mktcapElement.rawFloat = Math.round(mktcap)


   // var totalvol = cmcvol[sym]

      var totalvol = cmcvol[sym]? cmcvol[sym] : vol


    totalvolElement.innerHTML = "Volume:$" + (parseInt(totalvol)).toLocaleString("en-US")

    totalvolElement.rawFloat = Math.round(totalvol)


    // var avgvol = avgvol7d[sym]
       var avgvol = avgvol7d[sym]? avgvol7d[sym] : totalvol


    avgvolElement.innerHTML = 'AvgVol:$' + Math.round(avgvol).toLocaleString("en-US")

    avgvolElement.rawFloat = avgvol


    var relvol1dlabel = "RelVol1D: "

    relvol1dlabelElement.innerHTML = relvol1dlabel

    var relvol1d = totalvol/avgvol

    relvol1dElement.innerHTML = (relvol1d*100).toFixed(2) + "%"

    relvol1dElement.rawFloat = relvol1d



    // override prior computed tile color gradient if map selector is set to Volume
    if (window.STMapValue == "RelVol1D") { // pick a volume tile color instead (rel vol)
          console.log("volume tile compute from " + relvol1dElement.rawFloat*100)
          gradient = findBackgroundGradientRelVol(relvol1dElement.rawFloat*100)
          var grad3 = '-webkit-linear-gradient(' + gradient.colorTop + ', ' + gradient.color + ')'
          console.log("grad3 = " + grad3)
          backgroundDiv.style.backgroundImage = grad3
    }


                if (Math.abs(relvol1d)> 1.00) {
                  relvol1dlabelElement.style.color='#FF00FF'
                  relvol1dlabelElement.innerHTML = relvol1dlabel
                  relvol1dElement.style.color='#FF00FF'
                  relvol1dElement.innerHTML = + (relvol1d*100).toFixed(2) + "%"
                  relvol1dElement.rawFloat = relvol1d*100



                } else {
                  relvol1dlabelElement.style.color='#FF00FF'
                  relvol1dlabelElement.innerHTML = relvol1dlabel
                  relvol1dElement.style.color='#FF00FF'
                  relvol1dElement.innerHTML = + (relvol1d*100).toFixed(2) + "%"
                  relvol1dElement.rawFloat = relvol1d*100
                }


    
        // override prior computed tile color gradient if map selector is set to Volume
    if (window.STMapValue == "Volatility24") { // pick a volatility tile color instead 
          console.log("volume tile compute from " + volatility24Element.rawFloat)
          gradient = findBackgroundGradientVolatility(volatility24Element.rawFloat)
          var grad11 = '-webkit-linear-gradient(' + gradient.colorTop + ', ' + gradient.color + ')'
          console.log("grad11 = " + grad11)
          backgroundDiv.style.backgroundImage = grad11
    }

        // override prior computed tile color gradient if map selector is set to Volume
    if (window.STMapValue == "VolumeFut") { // pick a volatility tile color instead 
          console.log("volume tile compute from " + volElement.rawFloat)
          gradient = findBackgroundGradientVolumeFut(volElement.rawFloat)
          var grad12 = '-webkit-linear-gradient(' + gradient.colorTop + ', ' + gradient.color + ')'
          console.log("grad11 = " + grad12)
          backgroundDiv.style.backgroundImage = grad12
    }
    



    var weeklabel = + "1W"

    var week = weekTable[sym]

    var weekchange = week ? (price-week) : 0


    var week2 = week ? weekchange/week*100 : 0


                if (weekchange> 0) {
                  weeklabelElement.style.color='#16de94'
                  weeklabelElement.innerHTML= "1W"
                  week2Element.style.color='#16de94'
                  week2Element.innerHTML = "+" + week2.toFixed(1) + "%"

                  week2Element.rawFloat = week2

                  weekchangeElement.style.color='#16de94'
                  weekchangeElement.innerHTML = '1W' + "+" + weekchange



                } else {
                  weeklabelElement.style.color='#bf0027'
                  weeklabelElement.innerHTML= "1W"
                  week2Element.style.color='#bf0027'
                  week2Element.innerHTML = "-" + Math.abs(week2).toFixed(1) + "%"

                  week2Element.rawFloat = week2

                  weekchangeElement.style.color='#bf0027'
                  weekchangeElement.innerHTML = '1W' + "-" + weekchange
                }

    // override prior computed tile color gradient if map selector is set to Volume
    if (window.STMapValue == "Price1W") { // pick a price tile color instead (rel vol)
          console.log("price tile compute from " + week2Element.rawFloat)
          gradient = findBackgroundGradient(week2Element.rawFloat)
          var grad7 = '-webkit-linear-gradient(' + gradient.colorTop + ', ' + gradient.color + ')'
          console.log("grad7 = " + grad7)
          backgroundDiv.style.backgroundImage = grad7
    }



    var monthlabel = + "1M: "

    var month = monthTable[sym]

    var monthchange = month ? price-month : 0


    var month2 = month ? (monthchange/month)*100 : 0

                if (monthchange> 0) {
                  monthlabelElement.style.color='#16de94'
                  monthlabelElement.innerHTML= "1M"
                  month2Element.style.color='#16de94'
                  month2Element.innerHTML = "+" + month2.toFixed(1) + "%"

                  month2Element.rawFloat = month2

                  monthchangeElement.style.color='#16de94'
                  monthchangeElement.innerHTML = '1M:' + "+" + monthchange.toFixed(4)


                } else {
                  monthlabelElement.style.color='#bf0027'
                  monthlabelElement.innerHTML= "1M"
                  month2Element.style.color='#bf0027'
                  month2Element.innerHTML = "-" + Math.abs(month2).toFixed(1) + "%"

                  month2Element.rawFloat = month2

                  monthchangeElement.style.color='#bf0027'
                  monthchangeElement.innerHTML = '1M:' + "-" + monthchange.toFixed(4)
                }

    // override prior computed tile color gradient if map selector is set to Volume
    if (window.STMapValue == "Price1M") { // pick a price tile color instead (rel vol)
          console.log("price tile compute from " + month2Element.rawFloat)
          gradient = findBackgroundGradient(month2Element.rawFloat)
          var grad5 = '-webkit-linear-gradient(' + gradient.colorTop + ', ' + gradient.color + ')'
          console.log("grad5 = " + grad5)
          backgroundDiv.style.backgroundImage = grad5
    }


    var quarterlabel = + "1Q: "

    var quarter = quarterTable[sym]

    var quarterchange = quarter? price-quarter : 0


    var quarter2 = quarter ? ((quarterchange/quarter)*100) : 0

                if (quarter2> 0) {
                  quarterlabelElement.style.color='#16de94'
                  quarterlabelElement.innerHTML= "3M"
                  quarter2Element.style.color='#16de94'
                  quarter2Element.innerHTML = "+" + Math.round(quarter2) + "%"

                  quarter2Element.rawFloat = quarter2

                  quarterchangeElement.style.color='#16de94'
                  quarterchangeElement.innerHTML = '1Q: &nbsp;' + "+" + quarterchange



                } else {
                  quarterlabelElement.style.color='#bf0027'
                  quarterlabelElement.innerHTML= "3M"
                  quarter2Element.style.color='#bf0027'
                  quarter2Element.innerHTML = "-" + Math.abs(Math.round(quarter2)) + "%"

                  quarter2Element.rawFloat = quarter2

                  quarterchangeElement.style.color='#bf0027'
                  quarterchangeElement.innerHTML = '1Q: &nbsp;' + "-" + quarterchange

                }

    // override prior computed tile color gradient if map selector is set to Volume
    if (window.STMapValue == "Price3M") { // pick a price tile color instead (rel vol)
          console.log("price tile compute from " + quarter2Element.rawFloat)
          gradient = findBackgroundGradient(quarter2Element.rawFloat)
          var grad8 = '-webkit-linear-gradient(' + gradient.colorTop + ', ' + gradient.color + ')'
          console.log("grad8 = " + grad8)
          backgroundDiv.style.backgroundImage = grad8
    }


    var ytdlabel = "YTD"


    var ytd = ytdTable[sym]

    var ytdchange = ytd? price - ytd : 0

    var ytd2 = ytd ?  ((price-ytd)/ytd)*100 : 0

                if (ytd2> 0) {
                  ytdlabelElement.style.color='#16de94'
                  ytdlabelElement.innerHTML = ytdlabel
                  ytd2Element.style.color='#16de94'
                  ytd2Element.innerHTML = "+" + Math.round(ytd2) + "%"

                  ytd2Element.rawFloat = ytd2

                  ytdchangeElement.style.color='#16de94'
                  ytdchangeElement.innerHTML = 'YTD:' + "+" + ytdchange.toFixed(decimals)



                } else {
                  ytdlabelElement.style.color= '#bf0027'
                  ytdlabelElement.innerHTML = ytdlabel
                  ytd2Element.style.color='#bf0027'
                  ytd2Element.innerHTML = + Math.round(ytd2) + "%"

                  ytd2Element.rawFloat = ytd2

                  ytdchangeElement.style.color='#bf0027'
                  ytdchangeElement.innerHTML = 'YTD:' + ytdchange.toFixed(decimals)
                }

    // override prior computed tile color gradient if map selector is set to Volume
    if (window.STMapValue == "PriceYTD") { // pick a ytd price tile color instead (rel vol)
          console.log("price tile compute from " + ytd2Element.rawFloat)
          gradient = findBackgroundGradient(ytd2Element.rawFloat)
          var grad6 = '-webkit-linear-gradient(' + gradient.colorTop + ', ' + gradient.color + ')'
          console.log("grad6 = " + grad6)
          backgroundDiv.style.backgroundImage = grad6
    }



    var year1label = "1Y"


    var year1 = year1Table[sym]

    var year1change = year1 ? price-year1 : 0

    var year12 = year1 ? (((price-year1)/year1)*100) : 0

                if (year12> 0) {
                  year1labelElement.style.color= 'lime' // '#16de94'
                  year1labelElement.innerHTML = year1label
                  year12Element.style.color='lime'
                  year12Element.innerHTML = "+" + Math.round(year12) + "%"

                  year12Element.rawFloat = year12

                  // year1changeElement.style.color='lime'
                  // year1changeElement.innerHTML = '1Y:' + "+" + ytdchange.toFixed(decimals)



                } else {
                  year1labelElement.style.color= 'red' // '#bf0027'
                  year1labelElement.innerHTML = year1label
                  year12Element.style.color='red'
                  year12Element.innerHTML = Math.round(year12) + "%"

                  year12Element.rawFloat = year12

                  // year1changeElement.style.color='red'
                  // year1changeElement.innerHTML = '1Y:' + year1change.toFixed(decimals)
                }

    // override prior computed tile color gradient if map selector is set to Volume
    if (window.STMapValue == "PriceYear1") { // pick a 1y price tile color instead (rel vol)
          console.log("price tile compute from " + year12Element.rawFloat)
          gradient = findBackgroundGradient(year12Element.rawFloat)
          var grad12 = '-webkit-linear-gradient(' + gradient.colorTop + ', ' + gradient.color + ')'
          console.log("grad12 = " + grad12)
          backgroundDiv.style.backgroundImage = grad12
    }


// percentdisplayElement.style = 'white'

  var percentdisplay = percent
  // percentdisplayElement.innerHTML = "Vol:" + (totalvol/1000000000).toFixed(3) + "B" 
     percentdisplayElement.innerHTML = "+" +(percent).toFixed(2) + "%" + '<i class="fas fa-arrow-up"></i>'
     percentdisplayElement.style.color = '#16de94'



if (percent < 0) {

          percentdisplayElement.innerHTML = percent.toFixed(2) + "%" + '<i class="fas fa-arrow-down"></i>'
          percentdisplayElement.style.color = '#bf0027'

        } 




        var hour = x["OPENHOUR"]
        if (hour > 0) { // if we have an open hour, save it for later use
          openhour[sym] = hour

        } else {
          hour = openhour[sym] // use cached if the streamer doesnt have this data in this stream chunk
        }
        var hourlabel = "1H"

        var hourchange = price - (hour ? hour : price)

        if (useBinance) { // hide hour elements for now, no hour data
          hourlabelElement.style.display = 'none'
          hour2Element.style.display = 'none'
          hourchangeElement.style.display = 'none'
        }
        var hour2 = 100*hourchange/hour

                if (hourchange > 0) {
                  hourlabelElement.style.color='#16de94'
                  hourlabelElement.innerHTML= hourlabel
                  hour2Element.style.color='#16de94'
                  hour2Element.innerHTML = "+" + hour2.toFixed(3) + "%"

                  hour2Element.rawFloat = hour2

                  hourchangeElement.style.color='#16de94'
                  hourchangeElement.innerHTML = hourchange.toFixed(decimals)



                } else {
                  hourlabelElement.style.color='#bf0027'
                  hourlabelElement.innerHTML= hourlabel
                  hour2Element.style.color='#bf0027'
                  hour2Element.innerHTML = hour2.toFixed(3) + "%"

                  hour2Element.rawFloat = hour2

                  hourchangeElement.style.color='#bf0027'
                  hourchangeElement.innerHTML = hourchange.toFixed(decimals)

                }

    // override prior computed tile color gradient if map selector is set to Volume
    if (window.STMapValue == "Price1H") { // pick a price tile color instead (rel vol)
          console.log("price tile compute from " + hour2Element.rawFloat)
          gradient = findBackgroundGradient(hour2Element.rawFloat)
          var grad9 = '-webkit-linear-gradient(' + gradient.colorTop + ', ' + gradient.color + ')'
          console.log("grad9 = " + grad9)
          backgroundDiv.style.backgroundImage = grad9
    }


 if ((window.STMapValue == "Price") && (change > 0 )) {
          percentdisplayElement.innerHTML = "+" + percent.toFixed(2) + "%" + '<i class="fas fa-arrow-up"></i>'
          percentdisplayElement.style.color = '#16de94'
         } 

     if ((window.STMapValue == "Price") && (change < 0 )) {
          percentdisplayElement.innerHTML = percent.toFixed(2) + "%" + '<i class="fas fa-arrow-down"></i>'
          percentdisplayElement.style.color = '#bf0027'
         } 



     if ((window.STMapValue == "Price1H") && (hourchange > 0 )) {
          percentdisplayElement.innerHTML = "+" + hour2.toFixed(2) + "%" + '<i class="fas fa-arrow-up"></i>'
          percentdisplayElement.style.color = '#16de94'
         } 

     if ((window.STMapValue == "Price1H") && (hourchange < 0 )) {
          percentdisplayElement.innerHTML = hour2.toFixed(2) + "%" + '<i class="fas fa-arrow-down"></i>'
          percentdisplayElement.style.color = '#bf0027'
         } 

     if ((window.STMapValue == "Price1W") && (weekchange > 0 )) {
          percentdisplayElement.innerHTML = "+" + week2.toFixed(2) + "%" + '<i class="fas fa-arrow-up"></i>'
          percentdisplayElement.style.color = '#16de94'
         } 

     if ((window.STMapValue == "Price1W") && (weekchange < 0 )) {
          percentdisplayElement.innerHTML = week2.toFixed(2) + "%" + '<i class="fas fa-arrow-down"></i>'
          percentdisplayElement.style.color = '#bf0027'
         } 

     if ((window.STMapValue == "Price1M") && (monthchange > 0 )) {
          percentdisplayElement.innerHTML = "+" + month2.toFixed(0) + "%" + '<i class="fas fa-arrow-up"></i>'
          percentdisplayElement.style.color = '#16de94'
         } 

     if ((window.STMapValue == "Price1M") && (monthchange < 0 )) {
          percentdisplayElement.innerHTML = month2.toFixed(0) + "%" + '<i class="fas fa-arrow-down"></i>'
          percentdisplayElement.style.color = '#bf0027'
         } 

     if ((window.STMapValue == "Price3M") && (quarterchange > 0 )) {
          percentdisplayElement.innerHTML = "+" + quarter2.toFixed(0) + "%" + '<i class="fas fa-arrow-up"></i>'
          percentdisplayElement.style.color = '#16de94'
         } 

     if ((window.STMapValue == "Price3M") && (quarterchange < 0 )) {
          percentdisplayElement.innerHTML = quarter2.toFixed(0) + "%" + '<i class="fas fa-arrow-down"></i>'
          percentdisplayElement.style.color = '#bf0027'
         } 

     if ((window.STMapValue == "PriceYTD") && (ytdchange > 0 )) {
          percentdisplayElement.innerHTML = "+" + ytd2.toFixed(0) + "%" + '<i class="fas fa-arrow-up"></i>'
          percentdisplayElement.style.color = '#16de94'
         } 

     if ((window.STMapValue == "PriceYTD") && (ytdchange < 0 )) {
          percentdisplayElement.innerHTML = ytd2.toFixed(0) + "%" + '<i class="fas fa-arrow-down"></i>'
          percentdisplayElement.style.color = '#bf0027'
         } 

     if ((window.STMapValue == "PriceYear1") && (year1change > 0 )) {
          percentdisplayElement.innerHTML = "+" + year12.toFixed(0) + "%" + '<i class="fas fa-arrow-up"></i>'
          percentdisplayElement.style.color = '#16de94'
         } 

     if ((window.STMapValue == "PriceYear1") && (year1change < 0 )) {
          percentdisplayElement.innerHTML = year12.toFixed(0) + "%" + '<i class="fas fa-arrow-down"></i>'
          percentdisplayElement.style.color = '#bf0027'
         } 

      if ((window.STMapValue == "RelVol1D") && (relvol1d > 1) && (percent > 0 ))  {
          percentdisplayElement.innerHTML = "Vol:" + ((relvol1d*100)*1).toFixed(0) + "% " + '<i class="fa-solid fa-fire-flame-curved"></i>'
          percentdisplayElement.style.color = 'lime'
         } 

   if ((window.STMapValue == "RelVol1D") && (relvol1d > 1) && (percent < 0 )) {
          percentdisplayElement.innerHTML = "Vol:" + ((relvol1d*100)*1).toFixed(0) + "% " + '<i class="fa-solid fa-fire-flame-curved"></i>'
          percentdisplayElement.style.color = 'red'
         } 

     if ((window.STMapValue == "RelVol1D") && (relvol1d < 1 )  && (percent > 0 )) {
         percentdisplayElement.innerHTML = "Vol:"+(Math.abs((relvol1d*100)*1).toFixed(0)) + "% "
         percentdisplayElement.style.color = 'green'
         } 

      if ((window.STMapValue == "RelVol1D") && (relvol1d < 1 )  && (percent < 0 )) {
         percentdisplayElement.innerHTML = "Vol:" + (Math.abs((relvol1d*100)*1).toFixed(0)) + "% "
         percentdisplayElement.style.color = '#bf0027' // '#1998ff'
         } 


      if ((window.STMapValue == "Volatility24") && (volatility24 > .05) && (percent > 0 ))  {
          percentdisplayElement.innerHTML = "V&#963;:" + volatility24.toFixed(2) + "% " + '<i class="fa-solid fa-fire-flame-curved"></i>'
          percentdisplayElement.style.color = 'lime'
         } 

   if ((window.STMapValue == "Volatility24") && (volatility24 > .05) && (percent < 0 )) {
          percentdisplayElement.innerHTML = "V&#963;:" + volatility24.toFixed(2) + "% " + '<i class="fa-solid fa-fire-flame-curved"></i>'
          percentdisplayElement.style.color = 'red'
         } 

     if ((window.STMapValue == "Volatility24") && (relvol1d < .04999 )  && (percent > 0 )) {
         percentdisplayElement.innerHTML = "V&#963;:"+ volatility24.toFixed(2) + "% "
         percentdisplayElement.style.color = 'green'
         } 

      if ((window.STMapValue == "Volatility24") && (relvol1d < 049999 )  && (percent < 0 )) {
         percentdisplayElement.innerHTML = "V&#963;:" + volatility24.toFixed(2) + "% "
         percentdisplayElement.style.color = '#bf0027' // '#1998ff'
         } 

     if ((window.STMapValue == "RelVol1H") && (relvol1h > 1))  {
          percentdisplayElement.innerHTML = "RelVol1H" + Math.round(relvol1h*100) + "% " + '<i class="fa-solid fa-fire-flame-curved"></i>' // '<i class="fa-solid fa-bolt"></i>'
          percentdisplayElement.style.color = '#ff7b19'
          
         } 

     if ((window.STMapValue == "RelVol1H") && (relvol1h < 1 )) {
         percentdisplayElement.innerHTML = "RelVol1H" + Math.round(relvol1h*100) + "% "
         percentdisplayElement.style.color = '#1998ff'
         
         }

    

    var sector = sectorName[sym]

    sectorElement.innerHTML = sector

    var description = descriptionName[sym]

    descriptionElement.innerHTML = description

    var url = urlTable[sym]

    urlElement.innerHTML = url

    var url2 = urlTable[sym]

    function assignInnerIfDifferent(left, right) {
      if (left.innerHTML != right) {
        left.innerHTML = right
      }
    }

    assignInnerIfDifferent(url2Element, '<a href=' + url + ' target="_blank"><i class="fa fa-home" title="Homepage"></i></a>')

    // url2Element.innerHTML = '<a href=' + url + ' target="_blank"><i class="fa fa-home" title="Homepage"></i></a>'

    var abx= moreTable[sym]

    abxElement.innerHTML = abx


    var cointoken= cointokenTable[sym]

    cointokenElement.innerHTML = 'Type: ' + cointoken

    var twitter = twitterTable[sym]

    var twitter2 = twitterTable[sym]

    twitter2Element.innerHTML = '<a href=' + twitter + ' target="_blank"><i class="fab fa-twitter" title="Twitter"></i></a>'

    var talk = talkTable[sym]

    var talk2 = talkTable[sym]

    talk2Element.innerHTML = '<a href=' + talk + ' target="_blank"><i class="fab fa-telegram" title="Telegram"></i></a>'

    var explorer = explorerTable[sym]

    var explorer2 = explorerTable[sym]

    explorer2Element.innerHTML = '<a href=' + explorer + ' target="_blank"><i class="fas fa-cubes" title="Etherscan"></i></a>'

    var reddit = redditTable[sym]

    var reddit2 = redditTable[sym]

    reddit2Element.innerHTML = '<a href=' + reddit + ' target="_blank"><i class="fab fa-reddit-alien" title="Reddit"></i></a>'

    var github = githubTable[sym]

    var github2 = githubTable[sym]

    github2Element.innerHTML = '<a href=' + github + ' target="_blank"><i class="fab fa-github" title="Github"></i></a>'


    var cmclink = cmclinkTable[sym]

    cmclinkElement.innerHTML = cmclink

    var cmclink2 = cmclinkTable[sym]

    cmclink2Element.innerHTML = '<a href=' + cmclink + ' target="_blank"><i class="fa-solid fa-chart-line" title="CoinMarketCap"></i></a>'

    var tradelink = tradeTable[sym]

    tradelinkElement.innerHTML = tradelink

    var tradelink2 = tradeTable[sym]

    let tradetext = 'Buy ' + sym

    tradelink2Element.innerHTML = '<button class="btn4"><a style="text-decoration:none;color:black;" href=' + tradelink + ' target="_blank">' + tradetext + '</a></button>'

    
    var cmctag2 = cmctag[sym]

    cmctag2Element.innerHTML = cmctag2.join(' ')

    var cmcslug2 = cmcslug[sym]

    cmcslug2Element.innerHTML = cmcslug2

    var cmcrank2 = cmcrank[sym]

    cmcrank2Element.innerHTML = 'Rank:' + cmcrank2



    var more = moreTable[sym]

    moreElement.innerHTML = '<a href=' + more + ' target="_blank"><i class="fa fa-th-large" title="NewsChart"></i></a>'


        function goToLink() {
          console.log('tap on tile ok')
          //location.href = more // this opens in same window, send message to parent instead
          //console.log("window.parent = " + window.parent)
          window.parent.postMessage({"goTo" : more }, "*")
        }

       topTile.onclick = goToLink


        function goToTrade() {
          console.log('tap on tile ok')
          //location.href = more // this opens in same window, send message to parent instead
          //console.log("window.parent = " + window.parent)
          window.parent.postMessage({"goTo" : tradelink }, "*")
        }

       topTile.onclick = goToTrade


      computeAggregates() // average percent etc

     } // onStreamMessage

     window.onStreamMessage = onStreamMessage // allow others to get at this

     cc.onmessage = onStreamMessage // we re-use this for a refresh of tiles

     // connectBinance(ourSymbols, gotBinanceData)

      window.bws = connectBinance(ourSymbols, gotBinanceData)

window.addEventListener('message', (event) => {
    console.log(`level 3 received message: ${event.data}`)
    alert(JSON.stringify(event.data, null, 2))
  })

  // set up initial states from cmd line args gotten earlier

  {
    var tileNumber = '0'

    var element = document.querySelector('#onestream' + tileNumber).querySelector("#priceOut");
    var symElement = document.querySelector('#onestream' + tileNumber).querySelector("#symOut");
    var nameElement = document.querySelector('#onestream' + tileNumber).querySelector("#nameOut");
    var percElement = document.querySelector('.onestream' + tileNumber).querySelector("#percentOut");
    var changeElement = document.querySelector('.onestream' + tileNumber).querySelector("#changeOut");

    element.innerHTML = '$' + priceOutInner // level 2 didnt have dollar sign so add it
    symElement.innerHTML = symArgInput
    nameElement.innerHTML = symNameInput
    if (percentOutInner) {
      // not working, char replacement
      percElement.innerHTML = percentOutInner.replace("&#x25B4;", "+").replace("&#x25BE;", "-")
    }
    changeElement.innerHTML = changeOutInner

    if (backgroundImageInput) {
      //document.querySelector('#onestream' + tileNumber).style.backgroundImage = backgroundImageInput
      //document.querySelector('.onestream' + tileNumber).style.backgroundImage = '-webkit-linear-gradient(' + '#ffff00' + ', ' + '#ffff00' + ')'
      element.parentElement.style.backgroundImage = backgroundImageInput
      console.info("*** set background image from args " + backgroundImageInput)
      //alert("just set background image from args " + backgroundImageInput)
    }

    var coinIcon = document.querySelector('#onestream' + tileNumber).querySelector("#coinIcon");

    if (!coinIcon.assigned && symArgInput) {// avoid doing this every time if it is already assigned, could be a slow call
      coinIcon.src = imageUrlTable[symArgInput];
      coinIcon.assigned = true; // hack 
    }


// newsformula1

    let newsFrame = document.getElementById('level3newsiframe')

    if (symArgInput)
      newsFrame.src = 'news01-btc-multi0323.html?sym=' + symArgInput
    else
      newsFrame.src = 'news01-btc-multi0323.html'

  } // set init values


   }



</script>
</html>
<!--HTTPS only...-->
