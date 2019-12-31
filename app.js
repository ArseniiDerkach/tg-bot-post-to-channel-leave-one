// 

const Telegraf = require('telegraf');
const session = require('telegraf/session');
const Telegram = require('telegraf/telegram');
const telegram = new Telegram('945599100:AAHAw1jgR_gmQ1pj1MKJlhgnuWjdMC6Vv4E', {
  agent: null,        
  webhookReply: true  
});
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')

const mainKeyboard = Markup.keyboard([
  Markup.callbackButton('Изменить сообщение', 'edit'),
  Markup.callbackButton('Посмотреть сообщение', 'view')
])

const cancelButton = Markup.keyboard([
    Markup.callbackButton('Отмена', 'cancel')
  ])

const bot = new Telegraf('945599100:AAHAw1jgR_gmQ1pj1MKJlhgnuWjdMC6Vv4E');

const channelId = -1001391164414;


let isEditing = false;

const currentMessage = {
    text: 'test interval text',
    id: 0
};

bot.use(session());

bot.start(ctx=>{
    ctx.reply('Добро пожаловать в бота! ', Extra.markup(mainKeyboard));
})

bot.command('echo', ctx => {
    const text = ctx.message.text.split(' ');
    console.log(text);
    text.shift();
    ctx.reply(text.join(' '));
})

const replaceMessage = () =>{
    if (currentMessage.id) {
        telegram.deleteMessage(channelId,currentMessage.id);
    }
    telegram.sendMessage(channelId,currentMessage.text).then((res)=>{ currentMessage.id = res.message_id});
}

setInterval(replaceMessage,10000);

bot.command('view', ctx=>{
    ctx.reply(currentMessage.text);
})

bot.hears('Посмотреть сообщение',ctx=>{
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
    console.log(ctx.reply)
    ctx.reply('Отменено', Extra.markup(mainKeyboard))
})

bot.command('cancel',ctx=>{
    isEditing = false;
    console.log(ctx.reply)
    ctx.reply('Отменено', Extra.markup(mainKeyboard))
})

bot.on( 'text', async (ctx)=>{
    if (isEditing) {
        currentMessage.text = ctx.message.text;
        await ctx.reply('Сообщение изменено!', Extra.markup(mainKeyboard));
    } else {
        console.log(ctx.message);
        ctx.reply('Вы можете редактировать и просматривать сообщение', Extra.markup(mainKeyboard))
    }
})

// bot.command('send', ctx => {
//     if (currentMessage.id) {
//         telegram.deleteMessage(channelId,currentMessage.id);
//     }
//     const text = ctx.message.text.split(' ');
//     console.log(text);
//     text.shift();
//     currentMessage.text = text.join(' ');
//     telegram.sendMessage(channelId,text.join(' ')).then((res)=>{ currentMessage.id = res.message_id});
// })
bot.launch();

