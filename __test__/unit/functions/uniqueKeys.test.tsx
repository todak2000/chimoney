import { key } from "@/app/lib/uniqueKey";
import { validate as isUuid } from "uuid";

describe("key function", () => {
  it("should return a valid UUID", () => {
    const result = key();
    expect(isUuid(result)).toBe(true);
  });
});
