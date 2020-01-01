
const Telegraf = require('telegraf');
const session = require('telegraf/session');
const Telegram = require('telegraf/telegram');
const telegram = new Telegram('945599100:AAHAw1jgR_gmQ1pj1MKJlhgnuWjdMC6Vv4E', {
  agent: null,        
  webhookReply: true  
});
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')

const { getAd, updateAd } = require('./db/db');

const mainKeyboard = Markup.keyboard([
  Markup.callbackButton('Изменить сообщение', 'edit'),
  Markup.callbackButton('Посмотреть сообщение', 'view')
])

const cancelButton = Markup.keyboard([
    Markup.callbackButton('Отмена', 'cancel')
  ])

const bot = new Telegraf('945599100:AAHAw1jgR_gmQ1pj1MKJlhgnuWjdMC6Vv4E');

const http = require('http');
const https = require('https');
http.createServer().listen(process.env.PORT || 5000).on('request', function(req, res){
    res.end('')
});
setInterval(function(){
    https.get('https://https://tg-ad-bot-replace-message.herokuapp.com//')
},300000)

const channelId = -1001391164414;


let isEditing = false;


bot.use(session());

bot.start(ctx=>{
    ctx.reply('Добро пожаловать в бота! ', Extra.markup(mainKeyboard));
})

const replaceMessage = async () =>{
    const ad = await getAd();
    if (ad.id) {
        telegram.deleteMessage(channelId,ad.id);
    }
    telegram.sendMessage(channelId,ad.text).then((res)=>{  updateAd({text: ad.text, id: res.message_id});});
}

setInterval(replaceMessage,60000);

bot.command('view', async ctx=>{
    const currentMessage = await getAd();
    ctx.reply(currentMessage.text);
})

bot.hears('Посмотреть сообщение', async ctx=>{
    const currentMessage = await getAd();
    ctx.reply(currentMessage.text);
})

bot.command('edit',async ctx=>{
    await ctx.reply('Введите новое сообщение или нажмите Отмена',Extra.markup(cancelButton));
    isEditing = true;
});

bot.hears('Изменить сообщение',async ctx=>{
    await ctx.reply('Введите новое сообщение или нажмите Отмена',Extra.markup(cancelButton));
    isEditing = true;
})

bot.hears('Отмена',ctx=>{
    isEditing = false;
    ctx.reply('Отменено', Extra.markup(mainKeyboard))
})

bot.command('cancel',ctx=>{
    isEditing = false;
    ctx.reply('Отменено', Extra.markup(mainKeyboard))
})

bot.on( 'text', async (ctx)=>{
    if (isEditing) {
        const currentMessage = await getAd();
        await updateAd({text: ctx.message.text, id: currentMessage.id});
        currentMessage.text = ctx.message.text;
        await ctx.reply('Сообщение изменено!', Extra.markup(mainKeyboard));
    } else {
        ctx.reply('Вы можете редактировать и просматривать сообщение', Extra.markup(mainKeyboard))
    }
})

bot.launch();

фыва