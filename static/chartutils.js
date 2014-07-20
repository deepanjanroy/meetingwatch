var lambdaMax = function(arr, lambda) {
  if (arr.length === 0 || arr === undefined || arr === null) {
    throw "Invalid argument";
  }

  if (lambda === null || lambda === undefined) {
    lambda = function (key) { return key; };
  }

  var max_index = 0;
  var cur_max = lambda(arr[max_index]);

  arr.forEach(function (val, i) {
    if (lambda(val) > cur_max) {
      max_index = i;
    }
  })

  return arr[max_index];
}

var deepRound = function (num, decimalPlaces) {
  if (decimalPlaces === undefined) {
    decimalPlaces = 2;
  }
  var factor = Math.pow(10, decimalPlaces);
  num = num * factor;
  num = Math.round(num);
  num = num / factor;

  return num;
}

var parsedTime = function(rawMilisecs) {
  var milisecs = rawMilisecs % 1000;
  var seconds = Math.floor(rawMilisecs / 1000) % 60;
  var minutes = Math.floor(rawMilisecs / 1000 / 60);
  return {"minutes": minutes,
          "seconds": seconds,
          "milisecs": milisecs
        };
}

var twoDFormat = function(num) {
  var negative = num < 0 ? true : false;
  var abs_num = Math.abs(num);
  var s;

  if (abs_num >= 0 && abs_num <= 9) {
    s = "0" + abs_num;
  } else {
    s = "" + abs_num;
  }

  return negative ? "-" + s : s;
}

Array.prototype.contains = function (elm) {
  for (var i=0; i < this.length; i++) {
    if (this[i] == elm) {
      return true;
    }
  }
  return false;
}
