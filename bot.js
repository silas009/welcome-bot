const { Telegraf, Markup } = require('telegraf')

const bot = new Telegraf(process.env.BOT_TOKEN)

// Store the last welcome message ID
let lastWelcomeMessageId = null
let lastWelcomeChatId = null

// ✅ When someone starts a private chat
bot.start((ctx) => {
  const name = ctx.from.first_name || 'Chief'
  ctx.reply(
    `👋 Welcome, ${name}!\n\n` +
    `This bot manages our group. Join us and read our disclaimer to get started.\n\n` +
    `📢 Stay updated with the latest job opportunities.\n\n` +
    `✅ WorklinkNigeria Forum is where we can connect with fellow jobseekers.\n\n` +
    `🤝 Be Helpful, share everything here — no offline chat. DO NOT engage anyone offline!`,
    Markup.inlineKeyboard([
      [Markup.button.url('📖 Read Disclaimer', 'https://worklinknigeria.com/disclaimer-page/')],
      [Markup.button.url('🌐 Visit Website', 'https://worklinknigeria.com')]
    ])
  )
})

// ✅ Welcome new members in group with rules + buttons
bot.on('new_chat_members', async (ctx) => {
  for (const member of ctx.message.new_chat_members) {
    const name = member.first_name || 'Friend'

    // Delete previous welcome message if it exists
    if (lastWelcomeMessageId && lastWelcomeChatId) {
      try {
        await ctx.telegram.deleteMessage(lastWelcomeChatId, lastWelcomeMessageId)
      } catch (err) {
        console.log('Could not delete previous welcome message:', err.message)
      }
    }

    // Send new welcome message
    const sent = await ctx.reply(
      `👋 Welcome, ${name}!\n\n` +
      `📌 *Group Rules:*\n` +
      `1️⃣ Avoid sharing personal info\n` +
      `2️⃣ No spamming or self-promotion\n` +
      `3️⃣ No offensive language\n` +
      `4️⃣ ALWAYS ENGAGE WITH THE RIGHT TOPIC\n` +
      `5️⃣ NO private chat — share everything here\n\n` +
      `Enjoy the group! 🎉`,
      {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          [Markup.button.url('📖 Read Disclaimer', 'https://worklinknigeria.com/disclaimer-page/')],
          [Markup.button.url('🌐 Visit Website', 'https://worklinknigeria.com')]
        ])
      }
    )

    // Save the new welcome message ID
    lastWelcomeMessageId = sent.message_id
    lastWelcomeChatId = sent.chat.id
  }
})

// 🚫 Anti-spam — delete messages with links from non-admins
bot.on('message', async (ctx) => {
  const msg = ctx.message

  // Check if message contains a link
  const hasLink = msg.entities?.some(e =>
    e.type === 'url' || e.type === 'text_link'
  )

  if (hasLink) {
    try {
      // Get member status
      const member = await ctx.getChatMember(msg.from.id)
      const isAdmin = ['administrator', 'creator'].includes(member.status)

      // Only delete if not an admin
      if (!isAdmin) {
        await ctx.deleteMessage()
        await ctx.reply(
          `⚠️ @${msg.from.username || msg.from.first_name}, links are not allowed in this group.`
        )
      }
    } catch (err) {
      console.error('Anti-spam error:', err)
    }
  }
})

bot.launch()
console.log('Bot is running...')
