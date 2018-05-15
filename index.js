const Discord = require('discord.js')
const config = require('./config.json')
const snekfetch = require('snekfetch')
const winston = require('winston')

const client = new Discord.Client({
    disableEveryone:true,
    disableEvents:['TYPING_START']
})

process.on('exit', () => {
    client.destroy()
})

client.on('ready',() => {
    var date = new Date()
	winston.info(`Shitpost-Bot ready on ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`)
    
    var timedPost = setInterval(function(){sendImage(getImage())},config.timer)
})

async function getImage(){
    var date = new Date()
    winston.info(`Shitpost-Bot pulling pictures on ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`)
    
    var pool = []

    for(var i=0;i<config.subs.length;i++){
        const currentsub = config.subs[i]
        try{
            var subchildren = await getSubBody(`${config.redditheader}${currentsub}/top/.json`)
            subchildren = subchildren
                    .map(x => x = getPictureUrl(x))
                    .filter(x => x)
            if(subchildren.length > 0){
                pool.push(pickOne(subchildren))
            }
        }
        catch(err){
            winston.error(`${currentsub} has caused an error:${err.message}`)
        }
    }
    winston.info(pool)
    if(pool.length > 0){
        return pool[Math.floor(Math.random()*pool.length)]
    }
    return null
}

async function getSubBody(url){
    return await snekfetch.get(url).then(r => r.body.data.children)
}

function getPictureUrl(child){
    if (typeof child.data === 'undefined' ||
        typeof child.data.preview === 'undefined' ||
        typeof child.data.preview.images === 'undefined' ||
        typeof child.data.preview.images[0] === 'undefined' ||
        typeof child.data.preview.images[0].source === 'undefined' ||
        typeof child.data.preview.images[0].source.url === 'undefined'){
        return undefined
    }
    if(child.data.preview.images[0].variants.length > 0 && child.data.prevgiew.images[0].variants.indexOf('gif') > -1){
        return child.data.preview.images[0].variants.gif.source.url
    }
    return child.data.preview.images[0].source.url
}

function pickOne(array){
    for(var i=0;i<array.length;i++){
        if(Math.random()>.5){
            return array[i]
        }
    }
    return array.pop()
}

function sendImage(url){
    if(url !== null){
        var date = new Date()
        winston.info(`Shitpost-Bot activated on ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`)
        client.channels.get(config.channelid).send(url)
    }
}

client.login(config.token)