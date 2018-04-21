const discord = require('discord.js')
const path = require('path')
const config = require('./config.json')
const logger = require('bunyan').createLogger({ name: 'soup' })

var client = new discord.Client({
  disableEveryone: true,
  disableEvents: ["TYPING_START"]
})

process.on('exit', () => {
  client.destroy()
})

client.on('ready', () => {
  logger.info("Start up complete")
})

client.on('message', message => {
  if (message.author.bot || !(message.content.startsWith('!'))) {
    return
  }
  const args = message.content.slice(1).trim().split(/ +/g)
  const command = path.win32.basename(args.shift().toLowerCase())
  try {
    require(`./commands/${command}.js`).run(client, message, args, logger)
  } catch (err) {
    logger.info(err)
  }

})
//token
client.login(config.token)
