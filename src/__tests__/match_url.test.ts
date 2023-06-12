// TODO: TYLER ADD LOGIC TO CHECK IF MATCH IS A MATCH

const sum = (a: number, b: number): number => a + b;

it("1 + 1 = 2", () => {
  expect(sum(1, 1)).toBe(2);
});

it("1 + 2 != 2", () => {
  expect(sum(1, 2)).not.toBe(2);
});
