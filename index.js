const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config({ silent: true }); 

// ================= HORA DE ENGANAR O RENDER 🕵️‍♀️ =================
const app = express();
const port = process.env.PORT || 3000;

// O Render vai acessar aqui e ver que tá tudo certo
app.get('/', (req, res) => res.send('Bot da Giovanna está online e protegido! 💅'));

app.listen(port, () => {
    console.log(`💻 Servidor fake rodando na porta ${port} para o Render ficar feliz.`);
});
// ===============================================================

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// Links hackers que serão apagados
const blacklistedLinks = [
    "1450205259426431007",
    "1461455444768985149"
];

client.once('ready', () => {
    console.log(`✅ Logada como ${client.user.tag}! Proteção ativa no Render.`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const containsBadLink = blacklistedLinks.some(link => message.content.includes(link));

    if (containsBadLink) {
        try {
            await message.delete();
            
            if (message.member.bannable) {
                await message.member.ban({ reason: 'Envio de link malicioso/ataque hacker (Spam).' });
                console.log(`🚫 ${message.author.tag} foi banido por spam.`);
            } else {
                console.log(`⚠️ Sem permissão para banir ${message.author.tag}.`);
            }
        } catch (error) {
            console.error('Erro na limpeza:', error);
        }
    }
});

const token = process.env.DISCORD_TOKEN;

if (!token) {
    console.error("❌ ERRO: A variável DISCORD_TOKEN não foi configurada no Render!");
    process.exit(1);
}

client.login(token);