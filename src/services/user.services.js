exports.findUserOverlap = (freeBlocks, user1, user2) => {

    let user1Blocks = []
    let user2Blocks = []
    
    // push values
    for (const block of freeBlocks) {
        const id = Number(block.user_id)
        const start_time = convertRawTimeToMinutes(block.start_time), end_time = convertRawTimeToMinutes(block.end_time)
        if (id === user1) {
            user1Blocks.push(
                {
                    "dow": block.day_of_week,
                    "start": start_time,
                    "end": end_time
                }
            )
        }
        else if (id === user2) {
            user2Blocks.push(
                {
                    "dow": block.day_of_week,
                    "start": start_time,
                    "end": end_time
                }
            )
        }
    }
    
    // find overlaps
    let i = 0
    let j = 0
    let overlaps = []

    while (i < user1Blocks.length && j < user2Blocks.length) {
        const block1 = user1Blocks[i]
        const block2 = user2Blocks[j]

        if (block1.dow < block2.dow) {
            i++
            continue
        }
        if (block2.dow < block1.dow) {
            j++
            continue
        }

        const overlapStart = Math.max(block1.start, block2.start)
        const overlapEnd = Math.min(block1.end, block2.end)

        if (overlapStart < overlapEnd) {
            overlaps.push({
                dow: block1.dow,
                start: convertMinutesToRawTime(overlapStart),
                end: convertMinutesToRawTime(overlapEnd),
                users: [user1, user2]
                })
        }

        if (block1.end < block2.end) {
            i++
        }
        else {
            j++
        }
    }

    return overlaps
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