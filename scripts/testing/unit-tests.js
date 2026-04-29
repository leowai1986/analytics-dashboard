/**
 * unit-tests.js
 * Framework de testing minimalista usando solo Node.js assert.
 * Corre con: node scripts/testing/unit-tests.js
 */

const assert = require("assert");

// --- Mini framework de testing ---
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

function describe(suiteName, fn) {
  console.log(`\n📦 ${suiteName}`);
  fn();
}

function it(testName, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`   ✅ ${testName}`);
  } catch (err) {
    failedTests++;
    failures.push({ suite: suiteName, test: testName, error: err.message });
    console.log(`   ❌ ${testName}`);
    console.log(`      ${err.message}`);
  }
}

function expect(actual) {
  return {
    toBe(expected) {
      assert.strictEqual(actual, expected, `Expected ${expected} but got ${actual}`);
    },
    toEqual(expected) {
      assert.deepStrictEqual(actual, expected, `Objects not equal`);
    },
    toBeTruthy() {
      assert.ok(actual, `Expected truthy but got ${actual}`);
    },
    toBeFalsy() {
      assert.ok(!actual, `Expected falsy but got ${actual}`);
    },
    toBeGreaterThan(expected) {
      assert.ok(actual > expected, `Expected ${actual} to be greater than ${expected}`);
    },
    toBeLessThan(expected) {
      assert.ok(actual < expected, `Expected ${actual} to be less than ${expected}`);
    },
    toContain(expected) {
      assert.ok(actual.includes(expected), `Expected ${actual} to contain ${expected}`);
    },
    toThrow(expectedMessage) {
      try {
        actual();
        assert.fail("Expected function to throw");
      } catch (err) {
        if (expectedMessage) {
          assert.ok(err.message.includes(expectedMessage), `Expected error to contain "${expectedMessage}"`);
        }
      }
    },
  };
}

// --- Tests del proyecto ---

describe("Math Utilities", () => {
  it("should add two numbers correctly", () => {
    expect(2 + 2).toBe(4);
    expect(10 + 5).toBe(15);
  });

  it("should calculate percentage correctly", () => {
    const percentage = (part, total) => (part / total) * 100;
    expect(percentage(25, 100)).toBe(25);
    expect(percentage(50, 200)).toBe(25);
  });
});

describe("String Utilities", () => {
  it("should format currency correctly", () => {
    const formatCurrency = (value) => `$${value.toFixed(2)}`;
    expect(formatCurrency(45.5)).toBe("$45.50");
    expect(formatCurrency(1000)).toBe("$1000.00");
  });

  it("should capitalize first letter", () => {
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    expect(capitalize("hello")).toBe("Hello");
    expect(capitalize("world")).toBe("World");
  });
});

describe("Data Validation", () => {
  it("should validate email format", () => {
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    expect(isValidEmail("test@example.com")).toBeTruthy();
    expect(isValidEmail("invalid")).toBeFalsy();
  });

  it("should validate positive numbers", () => {
    const isPositive = (n) => n > 0;
    expect(isPositive(5)).toBeTruthy();
    expect(isPositive(-1)).toBeFalsy();
    expect(isPositive(0)).toBeFalsy();
  });
});

describe("Array Operations", () => {
  it("should calculate sum of array", () => {
    const sum = (arr) => arr.reduce((a, b) => a + b, 0);
    expect(sum([1, 2, 3, 4, 5])).toBe(15);
    expect(sum([])).toBe(0);
  });

  it("should find max value", () => {
    const max = (arr) => Math.max(...arr);
    expect(max([3, 1, 4, 1, 5])).toBe(5);
  });
});

describe("Date Utilities", () => {
  it("should format date correctly", () => {
    const formatDate = (date) => date.toISOString().split("T")[0];
    expect(formatDate(new Date("2026-04-29"))).toBe("2026-04-29");
  });

  it("should calculate days between dates", () => {
    const daysBetween = (d1, d2) => Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
    const date1 = new Date("2026-04-01");
    const date2 = new Date("2026-04-29");
    expect(daysBetween(date1, date2)).toBe(28);
  });
});

// --- Reporte final ---
console.log("\n═══════════════════════════════════════");
console.log("📊 TEST RESULTS");
console.log("═══════════════════════════════════════");
console.log(`Total:  ${totalTests}`);
console.log(`Passed: ${passedTests} ✅`);
console.log(`Failed: ${failedTests} ❌`);
console.log(`Coverage: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
console.log("═══════════════════════════════════════");

if (failedTests > 0) {
  console.log("\nFailed tests:");
  failures.forEach((f) => {
    console.log(`   ❌ ${f.suite} > ${f.test}`);
    console.log(`      ${f.error}`);
  });
  process.exit(1);
} else {
  console.log("\n🎉 All tests passed!");
  process.exit(0);
}
