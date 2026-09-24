
exports.isNumber = (value) => typeof value === "number" && Number.isFinite(value);
exports.isInteger = (value) => Number.isInteger(value);
exports.isValidRange = (value, min, max) => value >= min && value <= max;
