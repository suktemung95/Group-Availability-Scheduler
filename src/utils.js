const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

async function hashPassword(password) {
  const passwordHash = await bcrypt.hash(password, 10);
  return passwordHash;
}
async function comparePassword(user, password) {
  const isValid = await bcrypt.compare(password, user.password_hash);
  return isValid;
}

function generateJWT(user) {

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return token
}

function findUserOverlap(freeBlocks, user1, user2) {

    const user1Blocks = []
    const user2Blocks = []
    
    // push values
    for (const block of freeBlocks) {
        const id = Number(block.user_id)
        
        const formattedBlock = {
            dow: block.day_of_week,
            start: convertRawTimeToMinutes(block.start_time),
            end: convertRawTimeToMinutes(block.end_time),
            users: [id]
        }

        if (id === user1) {
            user1Blocks.push(formattedBlock)
        } else if (id === user2) {
            user2Blocks.push(formattedBlock)
        }
    }

    const overlaps = overlapBlockArrays(user1Blocks, user2Blocks)

    return overlaps.map(block => ({
        dow: block.dow,
        start: convertMinutesToRawTime(block.start),
        end: convertMinutesToRawTime(block.end),
        users: block.users
    }))
}

function findGroupOverlap(freeBlocks, memberIds) {
    memberIds = memberIds.map(Number);

    const blocksByUser = {};

    for (const memberId of memberIds) {
        blocksByUser[memberId] = [];
    }

    for (const block of freeBlocks) {
        const id = Number(block.user_id);

        if (!blocksByUser[id]) continue;

        blocksByUser[id].push({
            dow: block.day_of_week,
            start: convertRawTimeToMinutes(block.start_time),
            end: convertRawTimeToMinutes(block.end_time),
            users: [id]
        });
    }

    if (memberIds.length === 0) {
        return [];
    }

    let currentOverlaps = blocksByUser[memberIds[0]] || [];

    for (let i = 1; i < memberIds.length; i++) {
        const memberId = memberIds[i];
        const memberBlocks = blocksByUser[memberId] || [];

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

function overlapBlockArrays(blocksA, blocksB) {
    let i = 0;
    let j = 0;
    const overlaps = [];

    while (i < blocksA.length && j < blocksB.length) {
        const block1 = blocksA[i];
        const block2 = blocksB[j];

        if (block1.dow < block2.dow) {
            i++;
            continue;
        }

        if (block2.dow < block1.dow) {
            j++;
            continue;
        }

        const overlapStart = Math.max(block1.start, block2.start);
        const overlapEnd = Math.min(block1.end, block2.end);

        if (overlapStart < overlapEnd) {
            overlaps.push({
                dow: block1.dow,
                start: overlapStart,
                end: overlapEnd,
                users: [...block1.users, ...block2.users]
            });
        }

        if (block1.end < block2.end) {
            i++;
        } else {
            j++;
        }
    }

    return overlaps;
}

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
  hashPassword,
  comparePassword,
  generateJWT,
  findUserOverlap,
  findGroupOverlap
};