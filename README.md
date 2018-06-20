# shitpostbot

Install using npm install

Must have a config.json that contains:

{

  "token":"-discord bot token here-",

  "channelid":"-channelid here-",
  
  "timer":"-number of milliseconds between posts-",
  
  "admin":["-insert an array of admin id that can use commands"]
  
}

# Function of bot

On a timer the bot will go to the designated subreddits and pull a random picture file from the top 24 hour posts and put it in an aggregate pool.

A random picture is pulled from the aggregate pool of pictures and posted in a discord text channel.

# Commands

!subs: returns a list of subreddits the picture can choose from

!add [item]: add a subreddit

!remove[item]: remove a subreddit

!help: list commands

!hockey: post a picture
