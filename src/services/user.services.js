const runQuery = require("../db/pool")
function overlapBlockArrays(blocksA, blocksB) {
    let i = 0;
    let j = 0;
    const overlaps = [];

    while (i < blocksA.length && j < blocksB.length) {
        const blockA = blocksA[i];
        const blockB = blocksB[j];

        if (blockA.dow < blockB.dow) {
            i++;
            continue;
        }

        if (blockB.dow < blockA.dow) {
            j++;
            continue;
        }

        const overlapStart = Math.max(blockA.start, blockB.start);
        const overlapEnd = Math.min(blockA.end, blockB.end);

        if (overlapStart < overlapEnd) {
            overlaps.push({
                dow: blockA.dow,
                start: overlapStart,
                end: overlapEnd,
                users: [...blockA.users, ...blockB.users]
            });
        }

        if (blockA.end < blockB.end) {
            i++;
        } else {
            j++;
        }
    }

    return overlaps;
}

function findGroupOverlap(freeBlocks, userIds) {
    const memberIds = userIds.map(Number);

    if (memberIds.length === 0) {
        return [];
    }

    const blocksByUser = {};

    for (const memberId of memberIds) {
        blocksByUser[memberId] = [];
    }

    for (const block of freeBlocks) {
        const userId = Number(block.user_id);

        if (!blocksByUser[userId]) {
            continue;
        }

        blocksByUser[userId].push({
            dow: block.day_of_week,
            start: convertRawTimeToMinutes(block.start_time),
            end: convertRawTimeToMinutes(block.end_time),
            users: [userId]
        });
    }

    for (const userId of memberIds) {
        blocksByUser[userId].sort((a, b) => {
            if (a.dow !== b.dow) return a.dow - b.dow;
            return a.start - b.start;
        });
    }

    let currentOverlaps = blocksByUser[memberIds[0]];

    for (let i = 1; i < memberIds.length; i++) {
        const memberId = memberIds[i];
        const memberBlocks = blocksByUser[memberId];

        currentOverlaps = overlapBlockArrays(currentOverlaps, memberBlocks);

        if (currentOverlaps.length === 0) {
            return [];
        }
    }

    return currentOverlaps.map(block => ({
        dow: block.dow,
        start: convertMinutesToRawTime(block.start),
        end: convertMinutesToRawTime(block.end),
        users: block.users
    }));
};

function convertRawTimeToMinutes(rawTime) {
    const time = rawTime.slice(0, 8)
    let [hour, minute] = time.split(":")
    
    hour = Number(hour)
    minute = Number(minute)

    // assume same time zone (-4) for now
    return hour * 60 + minute
}

function convertMinutesToRawTime(rawMinutes) {
    const hour = Math.floor(rawMinutes / 60);
    const minute = rawMinutes % 60;

    const hourStr = String(hour).padStart(2, "0");
    const minuteStr = String(minute).padStart(2, "0");

    // same assumption
    return `${hourStr}:${minuteStr}-04`;
}

module.exports = {
    findGroupOverlap
}