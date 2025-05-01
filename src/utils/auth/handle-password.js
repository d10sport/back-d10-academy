import bcrypt from 'bcrypt'

export async function hashPassword(data) {
    const hash = await bcrypt.hash(data.password, 10)
    return {
        password: hash
    }
}

export async function verifyPassword(myPassword, hash) {
    const isMatch = await bcrypt.compare(myPassword, hash)
    return isMatch
}