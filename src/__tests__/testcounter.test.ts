import { sum } from "./testcounter"


test('adds the numbers', () => {
    expect(sum(10, 45)).toBe(55);
})