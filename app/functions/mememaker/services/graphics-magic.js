const { exec } = require('child_process');
const { promisify } = require('util');
const shell = promisify(exec);

module.exports = class GraphicsMagicService {
    static async identifyImage(imagePath) {
        const command = `
            gm identify \
            -verbose \
            ${imagePath}
        `

        return (await shell(command)).stdout.trim().split('\n');
    }

    static async getImageSize(imagePath) {
        const [width, height] = (await GraphicsMagicService.identifyImage(imagePath)).filter(line => line.includes('Geometry:'))[0].trim().split(': ')[1].split('x');

        return {
            width: Number(width),
            height: Number(height)
        }
    }

   static  async convertImage(options, finalPath) {
        const command = `
            gm convert
            '${options.imagePath}'
            -font '${options.font}'
            -pointsize ${options.fontSize}
            -fill '${options.fontFill}'
            -stroke '${options.strokeColor}'
            -strokewidth ${options.strokeWidth}
            -draw 'gravity ${options.textPos} text 0,${options.top} "${options.topText}"'
            -draw 'gravity ${options.textPos} text 0,${options.bottom} "${options.bottomText}"'
            ${finalPath}
        `

        const finalCommand = command.split('\n').join(' ');

        return shell(finalCommand);
    }
}