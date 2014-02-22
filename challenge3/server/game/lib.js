exports.sign = function(x) {
    return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
}

exports.random = function() {
  return (Math.random() - 0.5) * 2;
}

exports.limit = function(current, min, max) {
  return Math.max(Math.min(current, max), min);
};