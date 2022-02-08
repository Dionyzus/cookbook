exports.isNullOrEmpty = (value) => {
  if (value == null || value == "") {
    return true;
  }
  return false;
};
