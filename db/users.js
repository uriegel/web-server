var records = [
    { id: 1, username: 'uwe', password: 'riegel', displayName: 'Uwe' }
];

exports.findById = (id, cb) => process.nextTick(() => {
    const idx = id - 1
    if (records[idx]) 
        cb(null, records[idx])
    else 
        cb(new Error('User ' + id + ' does not exist'))
})

exports.findByUsername = (username, cb) => process.nextTick(() => {
    for (let i = 0, len = records.length; i < len; i++) {
        var record = records[i]
        if (record.username === username) 
            return cb(null, record)
    }
    return cb(null, null)
})
