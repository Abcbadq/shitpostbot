const Discord = require('discord.js')
const config = require('./config.json')
const snekfetch = require('snekfetch')

const redditurl = "https://www.reddit.com/.json"
const badsubs = [
    "PrequelMemes",
    "polandball",
    "terriblefacebookmemes",
    "MemeEconomy",
    "Dota2",
    "aww",
    "SequelMemes",
    "funny",
    "me_irl",
    "meirl",
    "BikiniBottomTwitter",
    "surrealmemes"
]

const client = new Discord.Client({
    disableEveryone:true,
    disableEvents:['TYPING_START']
})

process.on('exit', () => {
    client.destroy()
})

client.on('ready',() => {
    var interval = setInterval(async function() {
        console.log("shitpost activated")
        var children = await snekfetch.get(redditurl).then(r => r.body.data.children)

        function geturl(child) {
            if (typeof child.data === 'undefined' ||
                typeof child.data.preview === 'undefined' ||
                typeof child.data.preview.images === 'undefined' ||
                typeof child.data.preview.images[0] === 'undefined' ||
                typeof child.data.preview.images[0].source === 'undefined' ||
                typeof child.data.preview.images[0].source.url === 'undefined'){
                    return undefined
            }
            if (child.data.preview.images[0].variants.indexOf('gif')>-1){
                return child.data.preview.images[0].variants.gif.source.url
            }
            return child.data.preview.images[0].source.url
        }

        children = children.filter(x => (badsubs.indexOf(x.data.subreddit) > -1))
                    .map(x => x = geturl(x))
                    .filter(x => x)
        
        if(children.length > 0){
            console.log(children[Math.floor(Math.random()*children.length)])
            client.channels.get(config.channelid).send(children[Math.floor(Math.random()*children.length)])
        }},config.timer)
})

client.login(config.token)
