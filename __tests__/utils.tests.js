const decodeHTMLEntities = require("../utils/decode-html-entities");

describe("decodeHTMLEntities()", () => {
  test("Returns a string", () => {
    const input = "This &amp; that";
    const output = decodeHTMLEntities(input);

    expect(typeof output).toBe("string");
  });
  test("Replaces &amp; with  &", () => {
    const input = "This &amp; that";
    const output = decodeHTMLEntities(input);
    const expectedOutput = "This & that";

    expect(output).toBe(expectedOutput);
  });
  test("Replaces &quot; with double quotes", () => {
    const input = "Is it &quot;this&quot;?";
    const output = decodeHTMLEntities(input);
    const expectedOutput = 'Is it "this"?';

    expect(output).toBe(expectedOutput);
  });
  test("Replaces &#39; with single quotes", () => {
    const input = "Is it &#39;this&#39;?";
    const output = decodeHTMLEntities(input);
    const expectedOutput = "Is it 'this'?";

    expect(output).toBe(expectedOutput);
  });
  test("Replaces more than one type of encoding at once", () => {
    const input = "Is it &#39;this&#39; &amp; &quot;that&quot;?";
    const output = decodeHTMLEntities(input);
    const expectedOutput = "Is it 'this' & " + '"that"?';

    expect(output).toBe(expectedOutput);
  });
});
