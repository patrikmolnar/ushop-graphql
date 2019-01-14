const uuid = require('uuid/v1')
const aws = require('aws-sdk')


const s3 = new aws.S3({
  accessKeyId: 'AKIAIFETDGZXBW52I5LA',
  secretAccessKey: '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',
  params: {
    Bucket: 'com.ushop.uploads'
  },
})

exports.processUpload = async ( upload, context ) => {
  if (!upload) {
    return console.log('ERROR: No file received.')
  }
  
  const { stream, mimetype, filename } = await upload
  const key =  filename

  // Upload to S3
  const response = await s3
    .upload({
      Key: key,
      ACL: 'public-read',
      Body: stream
    }).promise()

  const url = response.Location

  // Sync with Prisma
  const data = {
    mimetype,
    url,
    filename,
  }


  const { id } = await context.prisma.mutation.createDocument({ data }, ` { id } `)

  const file = {
    id,
    filename,
    mimetype,
    url,
  }

  console.log('file saved:')
  console.log(file)

  return file
}