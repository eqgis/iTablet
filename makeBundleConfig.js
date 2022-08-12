const fs = require("fs")
const crypto = require('crypto')
const compressing = require('compressing')

function generateMd5(bundlePath) {
  return new Promise((resolve, rejects) => {
    const stream = fs.createReadStream(bundlePath)
    const fsHash = crypto.createHash('md5')

    stream.on('data', function (d) {
      fsHash.update(d)
    })

    stream.on('end', function () {
      const md5 = fsHash.digest('hex')
      resolve(md5)
    })
  })
}

/**
 * @param {string} [packageFile]
 */
async function readPackageInfo(packageFile) {
  return new Promise((resolve, rejects) => {
    fs.readFile(packageFile, function (err, data) {
      if (err) {
        rejects(err)
        return
      }
      const package = JSON.parse(data)
      resolve({
        version: package.version,
        name: package.name,
        author: package.author,
        bundleType: package.bundleType,
      })
    })
  })
}

async function writeToFile(info, configPath) {
  fs.writeFile(configPath, JSON.stringify(info), function (err) {
    if (err) {
      return console.error(err)
    }
  })
}

async function compress(bundlePath) {
  // const androidAssets = 'android/app/src/main/assets/bundles'
  // const dirName = bundlePath.substring(bundlePath.lastIndexOf('/') + 1)
  await compressing.zip.compressDir(bundlePath, `${bundlePath}.zip`)
  // await fs.copyFileSync(`${bundlePath}.zip`, `${androidAssets}/${dirName}.zip`)
  // await compressing.zip.uncompress(`${androidAssets}/${dirName}.zip`, `${androidAssets}`)
  // await fs.unlink(`${androidAssets}/${dirName}.zip`, () => {})
}


async function recordAddingImages(sourceFile) {
  const sourceArr = []
  return new Promise((resolve, rejects) => {
    fs.readdir(sourceFile, function (err, files) {
      if (err) return console.log(err)

      for (const file of files) {
        sourceArr.push(file)
      }
      resolve(sourceArr)
    })
  })
}


/**
 * TODO 记录新增图片
 */
async function recordAddingSource(bundlePath) {
  console.log('----------------recordAddingSource start------------------')
  let sources = {}
  return new Promise((resolve, rejects) => {
    fs.readdir(bundlePath, async function (err, files) {
      if (err) return console.log(err)

      const getDirFiles = async function (file) {
        return new Promise((resolve, rejects) => {
          fs.lstat(bundlePath + '/' + file, async function(err,stats){
            if(err) return console.log(err)
            if(stats.isDirectory()) {
              if (!sources[file]) {
                sources[file] = []
              }
              const subArr = await recordAddingImages(bundlePath + '/' + file, sources[file])
              console.log(file, subArr)
              sources[file] = sources[file].concat(subArr)
            }
            resolve(sources[file])
          })
        })
      }

      for (const file of files) {
        const arr = await getDirFiles(file)
        if (arr?.length > 0) {
          sources[file] = arr
        }
      }
      console.log('----------------recordAddingSource end------------------')
      resolve(sources)
    })
  })
}

async function main() {
  const _ = process.argv.splice(2)
  if (_.length < 2) {
    console.error('需要两个参数,第一个为bundle,第二个为package.json')
    return
  }
  const md5 = await generateMd5(_[0])
  const info = await readPackageInfo(_[1])
  const bundlePath = _[0].substring(0, _[0].lastIndexOf('/'))
  // const fileName = _[0].substring(_[0].lastIndexOf('/') + 1, _[0].lastIndexOf('.'))
  const sources = await recordAddingSource(bundlePath)
  const config = {
    create_date: new Date().getTime(),
    md5: md5,
    ...info,
    sources: sources,
  }
  await writeToFile(config, bundlePath + '/config.json')


  // if (fs.existsSync(bundlePath + '/index.android.bundle')) {
  //   fs.unlink(bundlePath + '/index.android.bundle', async () => {
  //     // await compressing.zip.compressDir(bundlePath, `${bundlePath}.zip`)
  //     // await fs.copyFileSync(`${bundlePath}.zip`, 'android/app/src/main/assets')
  //     // await compressing.zip.uncompress()
  //     await compressAndMove(bundlePath)
  //   })
  // } else {
  // await compressing.zip.compressDir(bundlePath, `${bundlePath}.zip`)
  await compress(bundlePath)
  // }
}

main()