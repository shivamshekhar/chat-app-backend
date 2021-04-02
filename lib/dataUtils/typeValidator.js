function _stringValidator(value) {
  if (typeof value !== "string" || value === "") {
    throw new Error(`Provided value ${value} is not a valid string`);
  }
}

function _numberValidator(value) {
  if (isNaN(value) || isNaN(parseInt(value))) {
    throw new Error(`Provided value ${value} is not a valid number`);
  }
}

function _booleanValidator(value) {
  if (
    !(
      value === true ||
      value === false ||
      value === "false" ||
      value === "true"
    )
  ) {
    throw new Error(`Provided value ${value} is not a valid bool`);
  }
}

class TypeValidator {
  static validate(value, type) {
    switch (type) {
      case "string":
        _stringValidator(value);
        break;
      case "number":
        _numberValidator(value);
        break;
      case "boolean":
        _booleanValidator(value);
        break;
      default:
        break;
    }
  }
}

module.exports = TypeValidator;
