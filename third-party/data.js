//////////////////////////////////////////////
// HELPERS
//////////////////////////////////////////////
function Data (causeTitle, link){
  this.cause = causeTitle;
  this.link = link;
}

function Country (name, location, totalVal, shareOfAllCauses) {
  this.name = name;
  this.location = location;
  this.totalVal = totalVal;
  this.secFactor = function() {
    var secValue = totalVal/365/24/60/60;
    return int(1/secValue);
  }
  this.shareOfAllCauses = shareOfAllCauses;
}

function Location (center, northEastBound, southWestBound){
  this.center = center;
  this.northEastBound = northEastBound;
  this.southWestBound = southWestBound;
}

function Coordinates (lat, lng) {
  this.lat = lat;
  this.lng = lng;
}



function randomInRange(min, max, precision) {
    return Math.round(Math.random() * Math.pow(10, precision)) /
            Math.pow(10, precision) * (max - min) + min;
}
