const { Telegraf } = require('telegraf')

const bot = new Telegraf('8886508137:AAFxv5lY5ZYW87UtlfsMqrNx_zgriRJZvvg')

// When someone starts a private chat
bot.start((ctx) => {
  const name = ctx.from.first_name || 'there'
  ctx.reply(`👋 Welcome, ${name}! Glad to have you here.`)
})

// When someone joins a group
bot.on('new_chat_members', (ctx) => {
  ctx.message.new_chat_members.forEach((member) => {
    const name = member.first_name || 'Friend'
    ctx.reply(`👋 Welcome to the group, ${name}! We're glad to have you here.`)
  })
})

bot.launch()
console.log('Bot is running...')