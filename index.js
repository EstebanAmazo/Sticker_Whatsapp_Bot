const fs = require('fs');
const { Client, LocalAuth , MessageMedia} = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const mime = require('mime-types')

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true})
})

client.on('message', message => {
	console.log(message.body)
});
client.on('message', async message => {
	 if (message.hasMedia) {
        message.downloadMedia().then( media => {
            if(media){
                const mediaPath = './downloaded-media'
                if(!fs.existsSync(mediaPath)){
                    fs.mkdirSync(mediaPath)
                }
                const extension = mime.extension(media.mimetype)
                console.log(extension)
                const filename = new Date().getTime()
                const fullFileName = mediaPath + filename + '.' + extension
                // Guardar Archivo
                try {
                    fs.writeFileSync(fullFileName, media.data, { encoding: 'base64' })
                    console.log('File Dowloaded successfully', fullFileName)
                    console.log(fullFileName)
                    MessageMedia.fromFilePath(filePath = fullFileName)
                    client.sendMessage(message.from, new MessageMedia(media.mimetype,media.data,filename),{sendMediaAsSticker:true,stickerAuthor:"bot mio",stickerName:"No robes Stickers"})
                  
                    fs.unlinkSync(fullFileName)
                    console.log(`Archivo eliminado`)
                } catch (error) {
                    console.log('error al guardar archivo', error)
                    
                }
            }
        })
    }
});


client.on('ready', () => {
    console.log('Cliente listo!');
});
client.initialize()
