const bcrypt = require('bcrypt')
const password = "password"

const generateHash = async () => {
    const hash = await bcrypt.hash(password, 10)
    console.log(hash)
}
generateHash()
