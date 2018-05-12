const Discord = require('discord.js')
const config = require('./config.json')
const snekfetch = require('snekfetch')

const client = new Discord.Client({
    disableEveryone:true,
    disableEvents:['TYPING_START']
})

process.on('exit', () => {
    client.destroy()
})

client.on('ready',() => {
	var date = new Date()
	console.log(`Shitpost-Bot activated on ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`)
	
    var interval = setInterval(async function() {
		var date = new Date()
        console.log(`Shitposting on ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`)
        var pool = [] 

        for(subreddit in config.badsubs){

            var subChildren = await snekfetch.get(`${config.redditheader}${subreddit}/.json`).then(r => r.body.data.children)

            subChildren = subChildren
                .filter(x => (badsubs.indexOf(x.data.subreddit) > -1))
                .map(x => x = getSubUrl(x))
                .filter(x => x)
            
            if(subChildren.length > 0){
                pool.push(subChildren[Math.floor(Math.random()*subChildren.length)])
            }
        }

        if(pool.length > 0){
			var picked_link = pool[Math.floor(Math.random()*pool.length)]
            console.log(picked_link)
            client.channels.get(config.channelid).send(picked_link)
        }},config.timer)
})

client.login(config.token)

function getSubUrl(child) {
    if (typeof child.data === 'undefined' ||
        typeof child.data.preview === 'undefined' ||
        typeof child.data.preview.images === 'undefined' ||
        typeof child.data.preview.images[0] === 'undefined' ||
        typeof child.data.preview.images[0].source === 'undefined' ||
        typeof child.data.preview.images[0].source.url === 'undefined'){
            return undefined
    }
    if (child.data.preview.images[0].variants.length > 0 && child.data.preview.images[0].variants.indexOf('gif') > (-1)){
        return child.data.preview.images[0].variants.gif.source.url
    }
    return child.data.preview.images[0].source.url
}