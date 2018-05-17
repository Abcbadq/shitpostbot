# shitpostbot

Install using npm install

Must have a config.json that contains:

{

  "token":"-discord bot token here-",

  "channelid":"-channelid here-",
  
  "timer":"-number of milliseconds between posts-",
  
  "subs":["-insert an array of subreddits that will be picked from"]
  
}

# Function of bot

On a timer the bot will go to the designated subreddits and pull a random picture file from the top 24 hour posts and put it in an aggregate pool.

A random picture is pulled from the aggregate pool of pictures and posted in a discord text channel.
