import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

// hash password
export const passwordEncoded = async (password) => {
    if (!password) throw new Error('Password is required')

    return await bcrypt.hashSync(password, SALT_ROUNDS)
}

// compare password
export const passwordCompare = async (plainPassword, hashedPassword) => {
    if (!plainPassword || !hashedPassword)
        throw new Error("Missing password for comparison");

    return await bcrypt.compareSync(plainPassword, hashedPassword)
}