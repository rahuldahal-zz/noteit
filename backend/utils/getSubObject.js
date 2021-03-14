module.exports = function getSubObject(wholeObject, propertiesToReturn) {
  const subObject = {};
  propertiesToReturn.forEach(
    (property) => (subObject[property] = wholeObject[property])
  );
  return subObject;
};
