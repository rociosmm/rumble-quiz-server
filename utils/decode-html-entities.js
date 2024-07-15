const decodeHTMLEntities = (str) => {
  const entities = {
    "&amp;": "&",
    "&quot;": '"',
    "&#39;": "'",
  };

  return str.replace(
    /&amp;|&lt;|&gt;|&quot;|&#39;/g,
    (match) => entities[match]
  );
};

module.exports = decodeHTMLEntities;
