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
