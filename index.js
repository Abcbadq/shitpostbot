const Discord = require('discord.js')
const snekfetch = require('snekfetch')
const cluster = require('cluster')

var winston = require('winston')
winston.add(winston.transports.File, {filename: 'error.log', level: 'error'})

const fs = require('fs')
const defaultSubs = require('./default.json')
const config = require('./config.json')

const redditheader = "https://www.reddit.com/r/"

const client = new Discord.Client({
    disableEveryone:true,
    disableEvents:['TYPING_START']
})

process.on('exit', () => {
    client.destroy()
})

process.on('uncaughtException', function(error){
    winston.error(error.message)
})

async function getSubBody(url){
    return await snekfetch.get(url).then(r => r.body.data.children)
}

function saveSubs(subs){
    fs.writeFile(`./refined.json` , JSON.stringify( subs , null , 4) , (err) => {
        if(err){
            var date = new Date()
            winston.info(`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}-Error while writing sub file`)
            return
        }
        else{
            var date = new Date()
            winston.info(`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}-Wrote sub file`)
        }
    })
}

client.on('ready', () => {
	if(cluster.isMaster){
		cluster.fork()
	}
	else{
		setInterval(winston.info(() => {`I am posting le message`}, config.timer))
	}
})
cluster.on('exit', (worker, code, signal) => {
	cluster.fork()
})
cluster.on('online', (worker) => {
	var timedPost = setInterval(function(){sendImage()},config.timer)
})

async function getImage(subs){
    var date = new Date()
    winston.info(`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}-Pulling images`)
    
    var pool = []

    for(var i=0 ; i < subs.length ; i++){
        const currentsub = subs[i]
        try{
            var subchildren = await getSubBody(`${redditheader}${currentsub}/top/.json`)
            subchildren = subchildren
                    .map(x => x = nonAsyncGetPictureUrl(x))
                    .filter(x => x)
            if(subchildren.length > 0){
                pool.push(nonAsyncPickOne(subchildren))
            }
        }
        catch(err){
            winston.error(`${currentsub} has caused an error:${err.message}`)
        }
    }
    if(pool.length > 0){
        return pool[Math.floor(Math.random()*pool.length)]
    }
    return null
}

async function sendImage(){
    var subs = require('./refined.json')
    var url = await getImage(subs)
    if(url !== null){
        var date = new Date()
        winston.info(`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}-Activated`)
        client.channels.get(config.channelid).send(url)
    }
    else{
        var date = new Date()
        winston.info(`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}-No images found`)
    }
}

const juggernaut = "http://i2.kym-cdn.com/photos/images/original/000/456/960/d5e.jpg"
client.on('message' , msg => {
    if(msg.author.id == '108454013384544256' && msg.content.toLowerCase().indexOf('jug') >= 0){
        msg.reply(juggernaut)
    }
    if(msg.content.startsWith('!') && config.admins.indexOf(msg.author.id) >= 0 ){
        var subs = require('./refined.json')
        if(msg.content.startsWith('!hockey')){
            sendImage(subs)
        }
        if(msg.content.startsWith('!add')){
            const addCommand = msg.content.split(' ')
            if(addCommand.length !== 2){
                msg.reply(`The command comes in the form of !add *sub*`)
            }
            else{
                if(subs.indexOf(addCommand[1]) >= 0){
                    msg.reply(`Duplicate sub`)
                }
                else{
                    subs.push(addCommand[1])
                    msg.reply(`Added [${addCommand[1]}]`)
                }
            }
        }
        else if(msg.content.startsWith('!remove')){
            const removeCommand = msg.content.split(' ')
            if(removeCommand.length !== 2){
                msg.reply(`The command comes in the form of !remove *sub*`)
            }
            else{
                const removeIndex = subs.indexOf(removeCommand[1])
                if(removeIndex >= 0){
                    subs.splice(removeIndex,removeIndex + 1)
                    msg.reply(`Removed [${removeCommand[1]}]`)
                }
                else{
                    msg.reply(`Non-existant sub`)
                }
            }
        }
        else if(msg.content.startsWith('!subs')){
            msg.reply(subs)
        }
        else if(msg.content.startsWith('!reset')){
            var subs = defaultSubs
            msg.reply('Reset subs')
        }
        else if(msg.content.startsWith('!save')){
            saveSubs(subs)
            msg.reply('Subs saved')
        }
        else if(msg.content.startsWith('!command')){
            msg.reply(['!hockey' , '!add [sub]' , '!remove [sub]' , '!subs' , '!reset' , '!save'])
        }
    }
})

function nonAsyncGetPictureUrl(child){
    if(child.data.post_hint == 'image'){
	return child.data.url
    }return undefined

}

function nonAsyncPickOne(array){
    for(var i=0;i<array.length;i++){
        if(Math.random()>.5){
            return array[i]
        }
    }
    return array.pop()
}

client.login(config.token)
