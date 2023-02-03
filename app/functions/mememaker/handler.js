'use strict';

const { decoratorValidator } = require('../../util/decorator-validator')
const { mememakerQueryParametersValidator } = require('./validator');
const ImageUtil = require('./util/image-util');
const GraphicsMagicService = require('./services/graphics-magic');

class Handler {
  constructor() {}

  setParametersDrawMeme(options, dimensions, imagePath) {
    return {
      topText: options.topText,
      bottomText: options.bottomText || '',
      fontSize: dimensions.width / 8,
      font: __dirname + './resources/impact.ttf',
      fontFill: '#FFF',
      textPos: 'center',
      strokeColor: '#000',
      strokeWidth: 1,
      padding: 40,
      imagePath
    }
  }

  setTextPosition(dimensions, padding) {
    const top = Math.abs((dimensions.height / 2.1) - padding) * -1;
    const bottom = Math.abs((dimensions.height / 2.1) - padding);

    return {
      top,
      bottom
    }
  }

  async main(event, context) {
    try {

      const options = event.queryStringParameters;
      const imagePath = ImageUtil.generateImagePath();
      await ImageUtil.saveImageLocally(options.image, imagePath);
      
      const { width, height } = await GraphicsMagicService.getImageSize(imagePath);
      
      const params = this.setParametersDrawMeme(options, { width, height }, imagePath);
      const data = this.setTextPosition({ width, height }, params.padding);

      const finalPath = ImageUtil.generateImagePath();
      await GraphicsMagicService.convertImage({ ...params, ...data }, finalPath);

      const imageBuffer = await ImageUtil.getImageBase64(finalPath);

      await ImageUtil.removeImageLocally(imagePath);
      await ImageUtil.removeImageLocally(finalPath);

      const result = {
        statusCode: 200,
        headers: {
          'Content-Type': 'text/html'
        },
        body: `<img src="data:image/png;base64,${imageBuffer}" />`
      }

      return result

    } catch(err) {
      console.error('error***', err.stack);
      return {
        statusCode: 500,
        body: 'Internal Server Error',
      }
    }
  }
}

const handler = new Handler()
module.exports = {
  mememaker: decoratorValidator(handler.main.bind(handler), mememakerQueryParametersValidator, 'queryStringParameters')
}