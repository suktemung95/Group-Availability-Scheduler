import { describe, test, expect } from "vitest";
import userServices from "./user.services.js";

const { findUserOverlap } = userServices;

describe("findUserOverlap", () => {
  test("finds one overlap between two users on the same day", () => {
    const freeBlocks = [
      {
        user_id: "1",
        day_of_week: 4,
        start_time: "15:00:00-04",
        end_time: "22:00:00-04",
        block_type: "free"
      },
      {
        user_id: "2",
        day_of_week: 4,
        start_time: "18:00:00-04",
        end_time: "23:00:00-04",
        block_type: "free"
      }
    ];

    const result = findUserOverlap(freeBlocks, 1, 2);

    expect(result).toEqual([
      {
        dow: 4,
        start: "18:00-04",
        end: "22:00-04",
        users: [1, 2]
      }
    ]);
  });

  test("returns empty array when users have no overlap", () => {
    const freeBlocks = [
      {
        user_id: "1",
        day_of_week: 1,
        start_time: "10:00:00-04",
        end_time: "12:00:00-04",
        block_type: "free"
      },
      {
        user_id: "2",
        day_of_week: 1,
        start_time: "13:00:00-04",
        end_time: "15:00:00-04",
        block_type: "free"
      }
    ];

    const result = findUserOverlap(freeBlocks, 1, 2);

    expect(result).toEqual([]);
  });

  test("does not count touching edges as overlap", () => {
    const freeBlocks = [
      {
        user_id: "1",
        day_of_week: 1,
        start_time: "10:00:00-04",
        end_time: "12:00:00-04",
        block_type: "free"
      },
      {
        user_id: "2",
        day_of_week: 1,
        start_time: "12:00:00-04",
        end_time: "14:00:00-04",
        block_type: "free"
      }
    ];

    const result = findUserOverlap(freeBlocks, 1, 2);

    expect(result).toEqual([]);
  });

  test("finds multiple overlaps on the same day", () => {
    const freeBlocks = [
      {
        user_id: "1",
        day_of_week: 4,
        start_time: "09:00:00-04",
        end_time: "12:00:00-04",
        block_type: "free"
      },
      {
        user_id: "2",
        day_of_week: 4,
        start_time: "10:00:00-04",
        end_time: "13:00:00-04",
        block_type: "free"
      },
      {
        user_id: "1",
        day_of_week: 4,
        start_time: "15:00:00-04",
        end_time: "22:00:00-04",
        block_type: "free"
      },
      {
        user_id: "2",
        day_of_week: 4,
        start_time: "18:00:00-04",
        end_time: "23:00:00-04",
        block_type: "free"
      }
    ];

    const result = findUserOverlap(freeBlocks, 1, 2);

    expect(result).toEqual([
      {
        dow: 4,
        start: "10:00-04",
        end: "12:00-04",
        users: [1, 2]
      },
      {
        dow: 4,
        start: "18:00-04",
        end: "22:00-04",
        users: [1, 2]
      }
    ]);
  });

  test("does not overlap blocks from different days", () => {
    const freeBlocks = [
      {
        user_id: "1",
        day_of_week: 1,
        start_time: "10:00:00-04",
        end_time: "18:00:00-04",
        block_type: "free"
      },
      {
        user_id: "2",
        day_of_week: 2,
        start_time: "10:00:00-04",
        end_time: "18:00:00-04",
        block_type: "free"
      }
    ];

    const result = findUserOverlap(freeBlocks, 1, 2);

    expect(result).toEqual([]);
  });
});