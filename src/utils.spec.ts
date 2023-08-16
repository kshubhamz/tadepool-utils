import { toTitleCase } from "./utils";

console["log"] = console["info"] = console["error"] = () => {};

describe("Unit test to convert a string to title case", () => {
  it("valid-data plain string", () => {
    const result = toTitleCase("barbie girl");
    expect(result).toBe("Barbie Girl");
  });
});
