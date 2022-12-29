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
  await compressing.zip.compressDir(bundlePath, `${bundlePath}.zip`)
}


function recordAddingImages(sourceFile) {
  let sourceArr = []
  const files = fs.readdirSync(sourceFile)
  for (const file of files) {
    let filePath = sourceFile + '/' + file
    const stats = fs.lstatSync(filePath)
    if(stats.isDirectory()) {
      const subArr = recordAddingImages(filePath, sourceArr)
      sourceArr = sourceArr.concat(subArr)
    } else {
      filePath = _platform === 'ios' ? filePath.replace(_bundlePath + '/assets/', '') : file
      sourceArr.push(filePath)
    }
  }
  return sourceArr
}


/**
 * TODO 记录新增图片
 */
async function recordAddingSource(bundlePath) {
  console.log('----------------recordAddingSource start------------------', bundlePath)
  const sources = {}
  const files = fs.readdirSync(bundlePath)

  const getDirFiles = function (file) {
    let _sources = []
    const stats = fs.lstatSync(bundlePath + '/' + file)
    if(stats.isDirectory()) {
      const subArr = recordAddingImages(bundlePath + '/' + file)
      _sources = subArr
    }
    return _sources
  }

  for (const file of files) {
    const arr = getDirFiles(file)
    if (arr?.length > 0 || Object.keys(arr).length > 0) {
      sources[file] = arr
    }
  }
  console.log('----------------recordAddingSource end------------------', sources)
  return sources
}

let _bundlePath, _platform

async function main() {
  const _ = process.argv.splice(2)
  if (_.length < 2) {
    console.error('需要三个参数,第一个为platform,第二个为bundle,第二个为package.json')
    return
  }
  _platform = _[0]
  const md5 = await generateMd5(_[1])
  const info = await readPackageInfo(_[2])
  _bundlePath = _[1].substring(0, _[1].lastIndexOf('/'))
  // const fileName = _[0].substring(_[0].lastIndexOf('/') + 1, _[0].lastIndexOf('.'))
  const sources = await recordAddingSource(_bundlePath)
  const config = {
    create_date: new Date().getTime(),
    md5: md5,
    ...info,
    sources: sources,
  }
  await writeToFile(config, _bundlePath + '/config.json')

  await compress(_bundlePath)
}

main()