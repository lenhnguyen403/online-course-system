import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

// hash password
export const passwordEncoded = async (password) => {
    if (!password) throw new Error('Password is required')

    return await bcrypt.hash(password, SALT_ROUNDS)
}

// compare password
export const passwordCompare = async (plainPassword, hashedPassword) => {
    if (!plainPassword || !hashedPassword)
        throw new Error("Missing password for comparison");

    return await bcrypt.compare(plainPassword, hashedPassword)
}

// Khi dung sync version cua bcrypt (hashSync, compareSync)
// thi khong can dung async/await, vi no da la dong bo roi.
// Neu dung version async thi moi can dung async/await
// de cho no chay xong truoc khi tiep tuc xu ly.