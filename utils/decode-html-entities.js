const decodeHTMLEntities = (str) => {
  const entities = {
    "&amp;": "&",
    '\"': "",
    "&#039;": "'",
  };

  return str.replace(
    /&amp;|&lt;|&gt;|&quot;|&#39;/g,
    (match) => entities[match]
  );
};

module.exports = decodeHTMLEntities;
