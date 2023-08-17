import {
  areEqual,
  camelize,
  groupBy,
  invarient,
  isValid,
  normalize,
  sanitize,
  toTitleCase,
} from "./utils";

console["log"] = console["info"] = console["error"] = () => {};

describe("Unit test to convert a string to title case", () => {
  it("valid-data plain string", () => {
    const result = toTitleCase("barbie girl");
    expect(result).toBe("Barbie Girl");
  });

  it("valid-data plain string with splitter", () => {
    const result = toTitleCase("barbie_girl", "_");
    expect(result).toBe("Barbie Girl");
  });

  it("valid-data plain string containing single word", () => {
    const result = toTitleCase("barbie girl, a niCe womAn");
    expect(result).toBe("Barbie Girl, A Nice Woman");
  });

  it("invalid data - null passed", () => {
    const inp = null as any;
    const result = toTitleCase(inp);
    expect(result).toEqual(null);
  });

  it("invalid data - undefined passed", () => {
    const inp = undefined as any;
    const result = toTitleCase(inp);
    expect(result).toEqual(undefined);
  });

  it("invalid data - object passed", () => {
    const inp = {} as any;
    const result = toTitleCase(inp);
    expect(result).toStrictEqual({});
  });

  it("invalid data - number passed", () => {
    const inp = 1234 as any;
    const result = toTitleCase(inp);
    expect(result).toStrictEqual(1234);
  });

  it("invalid data - function passed", () => {
    const inp = (() => {}) as any;
    const result = toTitleCase(inp);
    expect(result).toStrictEqual(inp);
  });

  it("invalid data - boolean passed", () => {
    const inp = true as any;
    const result = toTitleCase(inp);
    expect(result).toStrictEqual(true);
  });
});

describe("Unit Test to camelize", () => {
  it("valid data without nested object", () => {
    const inp = {
      person_name: "shubham",
      person_age: 23,
      roles: ["user", "admin"],
      is_active: true,
    };
    const res = camelize(inp);
    expect(res).toStrictEqual({
      personName: "shubham",
      personAge: 23,
      roles: ["user", "admin"],
      isActive: true,
    });
  });

  it("valid data with list of strings", () => {
    expect(camelize(["user", "admin"])).toStrictEqual(["user", "admin"]);
  });

  it("valid data with list of object", () => {
    expect(camelize([{ role_1: "user" }, { role_2: "admin" }])).toStrictEqual([
      { role1: "user" },
      { role2: "admin" },
    ]);
  });

  it("valid data with list of list", () => {
    expect(camelize([["hello", "world"]])).toStrictEqual([["hello", "world"]]);
  });

  it("valid data with nested object", () => {
    const res = camelize(toCamelizeNested);
    expect(res).toStrictEqual(expectedCamelizedNested);
  });

  it("invalid data - null", () => {
    expect(camelize(null)).toStrictEqual(null);
  });

  it("invalid data - undefined", () => {
    expect(camelize(undefined)).toStrictEqual(undefined);
  });

  it("invalid data - string", () => {
    expect(camelize("Openheimer")).toStrictEqual("Openheimer");
  });

  it("invalid data - function", () => {
    const x = () => {};
    expect(camelize(x)).toStrictEqual(x);
  });

  it("invalid data - number", () => {
    expect(camelize(1234)).toStrictEqual(1234);
  });

  it("invalid data - boolean", () => {
    expect(camelize(true)).toStrictEqual(true);
  });
});

describe("Unit test to check validity of entity", () => {
  it("empty array", () => {
    expect(isValid([])).toBe(false);
  });

  it("empty object", () => {
    expect(isValid({})).toBe(false);
  });

  it("empty string", () => {
    expect(isValid("")).toBe(false);
  });

  it("empty string with whitespace", () => {
    expect(isValid("  ")).toBe(false);
  });

  it("list of empty string", () => {
    expect(isValid(["", "  "])).toBe(false);
  });

  it("list of non-empty string", () => {
    expect(isValid(["naurange", "  "])).toBe(true);
  });

  it("list of empty object", () => {
    expect(isValid([{}, {}])).toBe(false);
  });

  it("list of invalid objects", () => {
    expect(isValid([{ code: "", name: "", description: "" }])).toBe(false);
  });

  it("list of valid objects", () => {
    expect(isValid([{ code: "123XX", name: "", description: "" }])).toBe(true);
  });

  it("non-empty object", () => {
    expect(isValid({ code: "123XX", name: "", description: "" })).toBe(true);
  });

  it("non-empty string", () => {
    expect(isValid("love")).toBe(true);
  });

  it("number", () => {
    expect(isValid(1234)).toBe(true);
    expect(isValid(-1234)).toBe(true);
  });

  it("boolean", () => {
    expect(isValid(true)).toBe(true);
    expect(isValid(false)).toBe(true);
  });

  it("bigint", () => {
    expect(isValid(BigInt(9007199254740991))).toBe(true);
  });

  it("function", () => {
    expect(isValid(() => {})).toBe(false);
  });

  it("null", () => {
    expect(isValid(null)).toBe(false);
  });

  it("undefined", () => {
    expect(isValid(undefined)).toBe(false);
  });
});

describe("Unit Test for GroupBy", () => {
  it("all valid data in list", () => {
    expect(groupBy(groupByInput, (m) => m.genere)).toStrictEqual(groupByOutput);
  });

  it("some valid data in list", () => {
    expect(
      groupBy([...groupByInput, { name: "Dr Hola", genere: "" }], (m) => m.genere)
    ).toStrictEqual(groupByOutput);
  });

  it("invalid data - null", () => {
    expect(groupBy(null as any, (x) => "hola")).toStrictEqual({});
    expect(groupBy([], null as any)).toStrictEqual({});
  });

  it("invalid data - undefined", () => {
    expect(groupBy(undefined as any, (x) => "hola")).toStrictEqual({});
    expect(groupBy([], undefined as any)).toStrictEqual({});
  });
});

describe("Unit Test for normalize", () => {
  it("all valid data in list", () => {
    expect(normalize(groupByInput, (m) => m.genere)).toStrictEqual(normalizeOutput);
  });

  it("some valid data in list", () => {
    expect(
      normalize([...groupByInput, { name: "Dr Hola", genere: "" }], (m) => m.genere)
    ).toStrictEqual(normalizeOutput);
  });

  it("invalid data - null", () => {
    expect(normalize(null as any, (x) => "hola")).toStrictEqual({});
    expect(normalize([], null as any)).toStrictEqual({});
  });

  it("invalid data - undefined", () => {
    expect(normalize(undefined as any, (x) => "hola")).toStrictEqual({});
    expect(normalize([], undefined as any)).toStrictEqual({});
  });
});

describe("Unit test to compare two entity", () => {
  it("invalid data - 2 different types passed", () => {
    expect(areEqual("hello", ["hello"] as any)).toBe(false);
  });

  it("valid data - unequal string", () => {
    expect(areEqual("hello", "hola")).toBe(false);
  });

  it("valid data - equal string", () => {
    expect(areEqual("hello", "hello")).toBe(true);
  });

  it("valid data - equal string but different case", () => {
    expect(areEqual("hello", "Hello")).toBe(true);
    expect(areEqual("hello", "Hello", false, false)).toBe(false);
  });

  it("valid data - equal string with trailing space", () => {
    expect(areEqual("hello", "hello  ")).toBe(false);
    expect(areEqual("hello", "hello  ", true)).toBe(true);
  });

  it("valid data - unequal list", () => {
    expect(areEqual(["hello", "world"], ["world", "hello"])).toBe(false);
    expect(areEqual([{ message: "hello world" }], [{ message: "hola" }])).toBe(false);
  });

  it("valid data - equal list", () => {
    expect(areEqual(["hello", "world"], ["hello", "world"])).toBe(true);
    expect(areEqual([{ message: "hello world" }], [{ message: "hello world" }])).toBe(true);
  });

  it("valid data - unequal list having null", () => {
    expect(areEqual(["hello", null], null)).toBe(false);
  });

  it("valid data - unequal object", () => {
    expect(areEqual({ code: "XXX" }, { code: "yyy1" })).toBe(false);
    expect(
      areEqual(
        [{ codes: [{ code: "XXX" }, { code: "yyy" }], name: "ping pong" }],
        [{ codes: [{ code: "XXX" }, { code: "YYY2" }], name: "ping pong" }]
      )
    ).toBe(false);
    expect(areEqual({ code: "XXX" }, null)).toBe(false);
    expect(areEqual(null, { code: "XXX" })).toBe(false);
  });

  it("valid data - equal object", () => {
    expect(areEqual({ code: "XXX" }, { code: "xxx" })).toBe(true);
    expect(
      areEqual(
        [{ codes: [{ code: "XXX" }, { code: "YYY" }], name: "ping pong" }],
        [{ codes: [{ code: "XXX" }, { code: "YYY" }], name: "ping pong" }]
      )
    ).toBe(true);
    expect(areEqual(null, null)).toBe(true);
  });

  it("equal booleans", () => {
    expect(areEqual(true, true)).toBe(true);
    expect(areEqual(false, false)).toBe(true);
  });

  it("unequal booleans", () => {
    expect(areEqual(false, true)).toBe(false);
    expect(areEqual(true, false)).toBe(false);
  });

  it("equal numbers", () => {
    expect(areEqual(1234, 1234)).toBe(true);
    expect(areEqual(-1235, -1235)).toBe(true);
  });

  it("unequal numbers", () => {
    expect(areEqual(1234, -1234)).toBe(false);
    expect(areEqual(-9980, 6718)).toBe(false);
  });

  it("function", () => {
    const fn = () => {};
    expect(areEqual(fn, fn)).toBe(true);
    expect(areEqual(fn, () => {})).toBe(false);
  });
});

describe("Unit test for invarient", () => {
  it("condition does not satisfy", () => {
    const inp: { name?: string } = {};
    expect(() => invarient(inp.name)).toThrowError();
  });

  it("condition satisfies", () => {
    const inp: { name?: string } = { name: "shubham" };
    expect(() => invarient(inp.name)).not.toThrowError();
  });
});

describe("Unit Test for sanitize", () => {
  it("string", () => {
    expect(sanitize("helloo  ")).toStrictEqual("helloo");
  });

  it("empty string", () => {
    expect(sanitize("")).toStrictEqual("");
  });

  it("list of string", () => {
    expect(sanitize(["helloo  ", "world"])).toStrictEqual(["helloo", "world"]);
  });

  it("list of objects", () => {
    expect(sanitize([{ code: "X", name: "  cd dvd  ", description: "" }])).toStrictEqual([
      { code: "X", name: "cd dvd" },
    ]);
    expect(
      sanitize([
        { code: "X", name: "  cd dvd  ", description: "", info: { zip: 1234, add: {} } },
        {},
      ])
    ).toStrictEqual([{ code: "X", name: "cd dvd", info: { zip: 1234 } }]);
  });

  it("empty list", () => {
    expect(sanitize([])).toStrictEqual([]);
  });

  it("empty object", () => {
    expect(sanitize({})).toStrictEqual({});
  });

  it("object", () => {
    const obj = {
      personName: "Shubham",
      age: 23,
      active: true,
      specials: [
        { name: "Naurange", age: 20, specials: ["shubham "], active: true, dependents: [] },
        { name: "Sudhakar  ", age: 20, specials: [], active: false, dependents: null },
      ],
      dependents: null,
      executor: () => "nope!!!",
    };
    expect(sanitize(obj)).toStrictEqual({
      personName: "Shubham",
      age: 23,
      active: true,
      specials: [
        { name: "Naurange", age: 20, specials: ["shubham"], active: true },
        { name: "Sudhakar", age: 20, active: false },
      ],
    });
  });
});

const toCamelizeNested = {
  person_name: "shubham",
  person_age: 23,
  roles: ["user", "admin"],
  is_active: true,
  dependents: [
    {
      person_name: "Laxmi Naurange",
      person_age: 20,
      roles: ["user", "admin"],
      is_active: true,
      relation: "special",
      dependents: [
        {
          person_name: "Manish Naurange",
          person_age: 16,
          roles: ["user"],
          is_active: true,
          relation: "brother in law",
        },
      ],
    },
    {
      person_name: "Sudhakar",
      person_age: 23,
      roles: ["user"],
      is_active: true,
      relation: "special",
    },
  ],
};

const expectedCamelizedNested = {
  personName: "shubham",
  personAge: 23,
  roles: ["user", "admin"],
  isActive: true,
  dependents: [
    {
      personName: "Laxmi Naurange",
      personAge: 20,
      roles: ["user", "admin"],
      isActive: true,
      relation: "special",
      dependents: [
        {
          personName: "Manish Naurange",
          personAge: 16,
          roles: ["user"],
          isActive: true,
          relation: "brother in law",
        },
      ],
    },
    {
      personName: "Sudhakar",
      personAge: 23,
      roles: ["user"],
      isActive: true,
      relation: "special",
    },
  ],
};

const groupByInput = [
  { name: "Avengers: Infinity War", genere: "SciFi" },
  { name: "Notebook", genere: "Romance" },
  { name: "Avengers: Endgame", genere: "SciFi" },
];

const groupByOutput = {
  SciFi: [
    { name: "Avengers: Infinity War", genere: "SciFi" },
    { name: "Avengers: Endgame", genere: "SciFi" },
  ],
  Romance: [{ name: "Notebook", genere: "Romance" }],
};

const normalizeOutput = {
  SciFi: { name: "Avengers: Infinity War", genere: "SciFi" },
  Romance: { name: "Notebook", genere: "Romance" },
};
