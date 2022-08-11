const pika = require('./pika.gif')

const image = {
  pika,
}

function getImage(): typeof image {
  return image
}

export {
  getImage
}