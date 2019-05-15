const bcrypt = require('bcrypt')
const password = "password"

const generateHash = async () => {
    const hash = await bcrypt.hash(password, 10)
    console.log(hash)


    let ret = await bcrypt.compare("gerd110549", '$2b$10$2ymdb9KfRaT3tWff2uNU/u7G9ZUKCh30U.G5ADdBfsGIVwXBEBDEu')
    console.log(hash)
}
generateHash()
