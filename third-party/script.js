var dataInput;
const formatter = new Intl.NumberFormat('de-DE');
const formatterPercent = new Intl.NumberFormat('de-DE', {
  style: 'percent',
  maximumFractionDigits: 1,
  minimumFractionDigits: 1
});

var deathsTotal = 0;
var averageShare = 0;

if(!Detector.webgl){
  Detector.addGetWebGLMessage();
} else {
	var diff = 183+numInList*38;
	document.getElementById("selectedRectangle").style.top = diff+"px";
	if (numInList == 3) {
		document.getElementById("selectedRectangle").style.width = "410px";
	} else if (numInList == 6) {
		document.getElementById("selectedRectangle").style.width = "345px";
	} else if (numInList == 9) {
		document.getElementById("selectedRectangle").style.width = "325px";
	}
	
	
  var container = document.getElementById('container');
  var globe = new DAT.Globe(container);
  var i, tweens = [];

  TWEEN.start();


  // import the JSON file by making a request
  //var dataLinkCollection = [new Data("Alcohol Use", "data/causes/unnatural-causes/b7-substance-use-disorders/drug-use-disorders.json")]
  //var dataLinkCollection = [new Data("Alcohol Use", "data/causes/unnatural-causes/c1-transport-injuries/transport-injuries.json")]
  //var dataLinkCollection = [new Data("Alcohol Use", "data/causes/unnatural-causes/c3-self-harm-and-interpersonal-violence/self-harm.json")]
  //var dataLinkCollection = [new Data("Alcohol Use", "data/causes/unnatural-causes/c2-unintentional-injuries/animal-contact.json")]
  var dataLinkCollection = [new Data("Alcohol Use", "data/causes/unnatural-causes/a7-nutritional-deficiencies/nutritional-deficiencies.json")]

  var countryData = [];
  var rawData
  // store the needed data in a new global object

  var dataReq = new XMLHttpRequest();
  // dataReq.onload = dataReqListener;
  dataReq.open("get", causeDataLink, true);
  dataReq.onreadystatechange = function (e) {		
    rawData = JSON.parse(this.responseText);

// POTENTIALLY UNNECESSARY
    for (var i=0; i<rawData.length-1; i++) {
      var locationName = rawData[i].location_name_de;
      var neCoordinates = new Coordinates(rawData[i].bounds.northeast.lat, rawData[i].bounds.northeast.lng);
      var swCoordinates = new Coordinates(rawData[i].bounds.southwest.lat, rawData[i].bounds.southwest.lng);
      var centerCoordinates = new Coordinates(rawData[i].center.lat, rawData[i].center.lng);
      var location = new Location(centerCoordinates, neCoordinates, swCoordinates);
      var value = rawData[i].val
      var shareOfAllCauses = rawData[i].val / rawData[i].all_causes_val;

      var country = new Country(locationName, location, value, shareOfAllCauses);

      countryData.push(country);
    }

    // add share of all causes data to rawData
    for (var i=0; i<rawData.length; i++) {
      rawData[i].share_of_all_causes = rawData[i].val / rawData[i].all_causes_val;
    }

    // set the total number of deaths
    for (var i=0; i<countryData.length; i++) {
      deathsTotal += countryData[i].totalVal;
			averageShare += countryData[i].shareOfAllCauses
    }
    deathsTotal = Math.round(deathsTotal/52);
		averageShare = averageShare/countryData.length;

    // set the table information
    updateTableToAbsolute();

    // get the seriousness of issue for each country
    // for (var i=0; i<countryData.length; i++) {
    //   dataInput[1].push(countryData[i].location.center.lat); // push lat
    //   dataInput[1].push(countryData[i].location.center.lng);// push longitude
    //   dataInput[1].push(countryData[i].shareOfPopulation*5000);// push magnitude
    // }

    // //sorting data
    // jsonDataClean.sort(predicateBy("share_of_all_causes"));
    // jsonDataClean.reverse();	
		
    // show all deaths
		rawData.sort(predicateBy('share_of_all_causes'));
    dataInput = [dataLinkCollection[0].title, []]
    for (var i=0; i<rawData.length; i++) {
      var totalValue = rawData[i].val;
			var c = 0;
      for (var t=0; t < Math.round(totalValue/52	); t++) {
        var centerLat = rawData[i].center.lat;
        var centerLng = rawData[i].center.lng;
        var maxSurface = rawData[i].population/900000;
        var maxRadius = Math.sqrt(maxSurface/Math.PI);

        var radius = randomFloatInRange(0, maxRadius);
        var angle = randomFloatInRange(0, 360);

        var point = findPointOnCircle(centerLat, centerLng, radius, angle);

        dataInput[1].push(point.x);
        dataInput[1].push(point.y);
        dataInput[1].push(rawData[i].share_of_all_causes);
				
				c++;
      }
			console.log("c: " + c);
			console.log("hello");

      // LEGACY CODE FOR RECTANGULAR VISUALS
      // for (var t=0; t<Math.round(totalValue/20); t++) {
      //   var neLat = countryData[i].location.northEastBound.lat;
      //   var neLng = countryData[i].location.northEastBound.lng;
      //   var swLat = countryData[i].location.southWestBound.lat;
      //   var swLng = countryData[i].location.southWestBound.lng;
      //   var lat = randomFloatInRange(neLat, swLat);
      //   var lng = randomFloatInRange(neLng, swLng);
      //   dataInput[1].push(lat);
      //   dataInput[1].push(lng);
      //   dataInput[1].push(countryData[i].shareOfAllCauses);
      // }
    }

    // add data to globe
    globe.addData(dataInput[1], {format: 'magnitude', name: dataInput[0], animated: true});
    globe.createPoints();
    globe.animate();
    //document.body.style.background = 'red'; // remove loading
  };
  dataReq.send(null);
}

document.getElementById('nextBtn').addEventListener("click", updateTableToRelative);
document.getElementById('formerBtn').addEventListener("click", updateTableToAbsolute);



function randomFloatInRange(low, high) {
  if (low <= high) {
    return Math.random() * (high-low) + low;
  } else {
    return Math.random() * (low-high) + high;
  }
}

function predicateBy(prop){
   return function(a,b){
      if( a[prop] > b[prop]){
          return 1;
      }else if( a[prop] < b[prop] ){
          return -1;
      }
      return 0;
   }
}

function updateTableToRelative() {
  rawData.sort(predicateBy('share_of_all_causes'));
  rawData.reverse();
  var numbers = [];
  var names = [];
  var values = [];
  for (var i=0; i<10; i++) {
    numbers.push(i+1);
    names.push(rawData[i].location_name_de);
    values.push(rawData[i].share_of_all_causes);
  }
  document.getElementById('rankingTitle').textContent = 'Häufigkeit der Todesursache';
//	document.getElementById('title-big-number').textContent = 'DURCHSCHNITT';
	document.getElementById("bigNumber").textContent = formatterPercent.format(averageShare);
	
	var standard = 0.1;
  for (var i=0; i<10; i++) {
    var count = i*2 + 1;
		console.log(i);
    document.querySelectorAll('table tr:nth-child(' + count + ') td:nth-child(1) span')[0].textContent = numbers[i];
    document.querySelectorAll('table tr:nth-child(' + count + ') td:nth-child(2) span')[0].textContent = names[i];
    document.querySelectorAll('table tr:nth-child(' + count + ') td:nth-child(3)')[0].textContent = formatterPercent.format(values[i]);
		if (values[i] > standard && i === 0) {
			standard = values[i]
		}
		var w = map_range(values[i], 0, standard, 0, 200);
		
    //var w = values[i] * 1000 < 200 ? values[i] * 1000 : 200;
    setupBar(i, w);
  }
false
  // change the arrow button appearance
  document.querySelectorAll('#nextBtn img')[0].src = 'assets/arrow_right_inactive.svg';
  document.querySelectorAll('#formerBtn img')[0].src = 'assets/arrow_left_active.svg';
}

function updateTableToAbsolute() {
  rawData.sort(predicateBy('val'));
  rawData.reverse();
  var numbers = [];
  var names = [];
  var values = [];
  for (var i=0; i<10; i++) {
    numbers.push(i+1);
    names.push(rawData[i].location_name_de);
    values.push(Math.round(rawData[i].val));
  }
  document.getElementById('rankingTitle').textContent = 'Tote pro Woche';
//	document.getElementById('title-big-number').textContent = 'GESAMT';
	document.getElementById("bigNumber").textContent = formatter.format(deathsTotal);
	
	var standard = 2000;
  for (var i=0; i<10; i++) {
    var count = i*2 + 1;
    document.querySelectorAll('table tr:nth-child(' + count + ') td:nth-child(1) span')[0].textContent = numbers[i];
    document.querySelectorAll('table tr:nth-child(' + count + ') td:nth-child(2) span')[0].textContent = names[i];
    document.querySelectorAll('table tr:nth-child(' + count + ') td:nth-child(3)')[0].textContent = formatter.format(Math.round(values[i]/52));
		if (values[i] > standard && i === 0) {
			standard = values[i]
		}
		var w = map_range(values[i], 0, standard, 0, 200);
//    var w = values[i] * 0.002;
//    w = w > 200 ? 200 : w;
    setupBar(i, w);
  }

  // change the arrow button appearance
  document.querySelectorAll('#nextBtn img')[0].src = 'assets/arrow_right_active.svg';
  document.querySelectorAll('#formerBtn img')[0].src = 'assets/arrow_left_inactive.svg';
}

function setupBar(i, w) {
  var count = (i+1)*2;
  var el = document.querySelectorAll('table tr:nth-child(' + count + ') td:nth-child(2) div')[0];

  el.style.width = Math.round(w).toString() + '.px';

  var allCauses = rawData[i].share_of_all_causes;
  var hueValue = map_range(allCauses, 0, 0.1, 0.6*360, 1.0*360)
  console.log(hueValue);
  //c.setHSL(hueValue, 1.0, 0.5);
  el.style.backgroundColor = 'hsl(' + hueValue + ', 70%, 50%)';
  //el.style.backgroundColor = 'yellow';
}

function map_range(value, low1, high1, low2, high2) {
  if(value<low1) {value = low1} else if (value>high1) {value = high1}
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function findPointOnCircle(originX, originY , radius, angleRadians) {
  var newX = radius * Math.cos(angleRadians) + originX;
  var newY = radius * Math.sin(angleRadians) + originY;
  return {"x" : newX, "y" : newY};
}
