import { describe, it, expect } from "vitest";
import {
  isPastDate,
  isToday,
  getWeekStart,
  getWeekDates,
  formatDateDisplay,
  getDayName,
  getDayNumber,
} from "../../../config/services/dateUtils";

describe("Date Utility Functions", () => {
  describe("isPastDate", () => {
    it("returns true for past dates", () => {
      expect(isPastDate("2024-01-01")).toBe(true);
    });

    it("returns false for today", () => {
      const today = new Date().toISOString().split("T")[0];
      expect(isPastDate(today)).toBe(false);
    });

    it("returns false for future dates", () => {
      expect(isPastDate("2026-12-31")).toBe(false);
    });

    it("handles invalid date strings", () => {
      expect(isPastDate("not-a-date")).toBe(false);
    });
  });

  describe("isToday", () => {
    it("returns true for today", () => {
      const today = new Date().toISOString().split("T")[0];
      expect(isToday(today)).toBe(true);
    });

    it("returns false for past dates", () => {
      expect(isToday("2024-01-01")).toBe(false);
    });
  });

  describe("getWeekStart", () => {
    it("returns Monday for a Thursday date", () => {
      expect(getWeekStart("2026-07-16")).toBe("2026-07-13");
    });

    it("returns same date if it is Monday", () => {
      expect(getWeekStart("2026-07-13")).toBe("2026-07-13");
    });
  });

  describe("getWeekDates", () => {
    it("returns 7 dates", () => {
      const result = getWeekDates("2026-07-13");
      expect(result.length).toBe(7);
      expect(result[0]).toBe("2026-07-13");
      expect(result[6]).toBe("2026-07-19");
    });
  });

  describe("formatDateDisplay", () => {
    it("formats date correctly", () => {
      expect(formatDateDisplay("2026-07-16")).toContain("Thursday");
    });
  });

  describe("getDayName", () => {
    it("returns correct day name for Monday", () => {
      expect(getDayName("2026-07-13")).toBe("Mon");
    });

    it("returns correct day name for Sunday", () => {
      expect(getDayName("2026-07-19")).toBe("Sun");
    });
  });

  describe("getDayNumber", () => {
    it("returns correct day number", () => {
      expect(getDayNumber("2026-07-16")).toBe(16);
    });
  });
});
