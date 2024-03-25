const OpenAI = require('openai');

const { Telegraf } = require('telegraf')
const { message } = require('telegraf/filters')

const bot = new Telegraf(process.env.BOT_TOKEN)
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Функція для надсилання тексту до ChatGPT і отримання результату
async function getChatGPTResponse(prompt) {
    try {
        const response = await openai.complete({
            engine: 'gpt-3.5-turbo',
            prompt: prompt,
            maxTokens: 100 // Змініть за потребою
        });
        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error('Помилка отримання відповіді від ChatGPT API:', error);
        return 'Вибачте, сталася помилка. Будь ласка, спробуйте пізніше.';
    }
}

bot.start((ctx) => ctx.reply('Welcome'))

// Додавання можливості надсилання зображень
// feat: додано обробник команди '/send_image'
bot.command('send_image', (ctx) => ctx.reply('Send me an image'))

bot.help((ctx) => ctx.reply('Send me a sticker'))

// Виправлення помилки відображення стікерів
// fix: виправлено відображення стікерів
bot.on('sticker', (ctx) => ctx.reply('👍 Sticker received'))

// Зміна фільтру для вибору відповідей на повідомлення
// feat(bot): змінено фільтр для відповідей на повідомлення
bot.hears(/hello/i, (ctx) => ctx.reply('Hi there!'))



// Обробник вхідних повідомлень бота
bot.hears('gpt', async (ctx) => {
    const userMessage = ctx.message.text;

    // Отримуємо відповідь від ChatGPT за допомогою введеного повідомлення користувача
    const chatGPTResponse = await getChatGPTResponse(userMessage);

    // Надсилаємо отриману відповідь користувачеві
    ctx.reply(chatGPTResponse);
});

bot.launch({
    webhook: {
        domain: process.env.WEBHOOK_DOMAIN,
        port: process.env.PORT,
    },
})




// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
