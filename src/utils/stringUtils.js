exports.isNullOrEmpty = (value) => {
  if (value === null || value === "" || value === undefined) {
    return true;
  }
  return false;
};
