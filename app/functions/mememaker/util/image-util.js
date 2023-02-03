const axios = require('axios')
const { promises: { writeFile, unlink, readFile } } = require('fs')

module.exports = class ImageUtil {
    static generateImagePath() {
        return `/tmp/${new Date().getTime()}-out.png`
    }

    static async saveImageLocally(imageUrl, imagePath) {
        const { data } = await axios.get(imageUrl, { responseType: 'arraybuffer' })
        const buffer = Buffer.from(data, 'base64')
        return writeFile(imagePath, buffer)
    }

    static async getImageBase64(imagePath) {
        const data = await readFile(imagePath, { encoding: 'base64' })
        return data
    }

    static async removeImageLocally(imagePath) {
        await unlink(imagePath)
    }
}