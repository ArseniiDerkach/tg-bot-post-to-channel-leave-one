
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

const groupId = -1001257486779;

let id;

const data = {
    "ok":true,
    "result":
        [
            {
                "update_id":30777782, 
                "message":
                {
                    "message_id":7,
                    "from":{
                        "id":70698447,
                        "is_bot":false,
                        "first_name":"Arsenii",
                        "last_name":"Derkach",
                        "username":"arseniiderkach",
                        "language_code":"ru"
                    },
                    "chat":{
                        "id":-1001257486779,
                        "title":"test group ad",
                        "type":"supergroup"
                    },
                    "date":1577913024,
                    "left_chat_participant":{
                        "id":51112222,
                        "is_bot":false,
                        "first_name":"Kon$tantin",
                        "last_name":"\ud83d\udc38",
                        "username":"krrryakwa"
                    },
                    "left_chat_member":{
                        "id":51112222,
                        "is_bot":false,
                        "first_name":"Kon$tantin",
                        "last_name":"\ud83d\udc38",
                        "username":"krrryakwa"
                    }
                }
            }
        ]
    }


let isEditing = false;


bot.use(session());

bot.start(ctx=>{
    ctx.reply('Добро пожаловать в бота! ', Extra.markup(mainKeyboard));
})

bot.command('echo', async ctx=>{
    if (ctx.message.chat.id == groupId) {
        return true;
    }
    console.log(await telegram.getChat(groupId));
    telegram.sendMessage(groupId, 'ping').then((res)=>{ id = res.message_id;console.log(res.message_id)})
    telegram.deleteMessage(groupId,10);
})

const replaceMessage = async () =>{
    const ad = await getAd();
    if (ad.id) {
        telegram.deleteMessage(groupId,ad.id);
    }
    telegram.sendMessage(groupId,ad.text).then((res)=>{  updateAd({text: ad.text, id: res.message_id});});
}

bot.on('new_chat_members', (ctx) => {
    telegram.deleteMessage(groupId,ctx.message.message_id);
    console.log(ctx.message)
})
bot.on('left_chat_member', (ctx) => {
    telegram.deleteMessage(groupId,ctx.message.message_id);
    console.log(ctx.message)
})

setInterval(replaceMessage,10000);

bot.command('view', async ctx=>{
    if (ctx.message.chat.id == groupId) {
        return true;
    }
    if (ctx.message.chat.id == groupId) {
        return true;
    }
    const currentMessage = await getAd();
    ctx.reply(currentMessage.text);
})

bot.hears('Посмотреть сообщение', async ctx=>{
    if (ctx.message.chat.id == groupId) {
        return true;
    }
    if (ctx.message.chat.id == groupId) {
        return true;
    }
    const currentMessage = await getAd();
    ctx.reply(currentMessage.text);
})

bot.command('edit',async ctx=>{
    if (ctx.message.chat.id == groupId) {
        return true;
    }
    await ctx.reply('Введите новое сообщение или нажмите Отмена',Extra.markup(cancelButton));
    isEditing = true;
});

bot.hears('Изменить сообщение',async ctx=>{
    if (ctx.message.chat.id == groupId) {
        return true;
    }
    await ctx.reply('Введите новое сообщение или нажмите Отмена',Extra.markup(cancelButton));
    isEditing = true;
})

bot.hears('Отмена',ctx=>{
    if (ctx.message.chat.id == groupId) {
        return true;
    }
    isEditing = false;
    ctx.reply('Отменено', Extra.markup(mainKeyboard))
})

bot.command('cancel',ctx=>{
    if (ctx.message.chat.id == groupId) {
        return true;
    }
    isEditing = false;
    ctx.reply('Отменено', Extra.markup(mainKeyboard))
})

bot.on( 'text', async (ctx)=>{
    if (ctx.message.chat.id == groupId) {
        return true;
    }
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