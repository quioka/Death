const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config({ silent: true }); 

// ================= SERVIDOR FAKE PRO RENDER =================
const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Bot da Giovanna está online e protegido! 💅'));
app.listen(port, () => console.log(`💻 Porta ${port} ativa.`));
// ===============================================================

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

const blacklistedLinks = [
    "1450205259426431007",
    "1461455444768985149"
];

client.once('ready', () => {
    console.log(`✅ Logada como ${client.user.tag}! Proteção ativa com timer de limpeza.`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const containsBadLink = blacklistedLinks.some(link => message.content.includes(link));

    if (containsBadLink) {
        try {
            // 1. Apaga o link hacker na hora
            await message.delete();
            
            // 2. Tenta banir o sapeca
            if (message.member && message.member.bannable) {
                await message.member.ban({ reason: 'Link malicioso/Mães Solteiras.' });
            }

            // 3. Manda a mensagem de deboche e salva ela numa variável
            const aviso = await message.channel.send(`BEM FEITO, QUEM MANDA CLICAR EM LINK DE MÃES SOLTEIRAS 💅💀`);

            // 4. ESPERA 7 SEGUNDOS E APAGA O DEBOCHE
            setTimeout(() => {
                aviso.delete().catch(err => console.log("Mensagem já tinha sido apagada ou erro ao apagar."));
            }, 7000); // 7000 milissegundos = 7 segundos

        } catch (error) {
            console.error('Erro na execução:', error);
        }
    }
});

const token = process.env.DISCORD_TOKEN;
client.login(token);
