const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config({ silent: true }); 

// ================= SERVIDOR FAKE PRO RENDER =================
const app = express();
const port = process.env.PORT || 3000;

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

// Links hackers/maliciosos que serão apagados
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
            // 1. Apaga a mensagem com o link imediatamente
            await message.delete();
            
            // 2. Tenta banir o sem noção que mandou o link
            if (message.member && message.member.bannable) {
                await message.member.ban({ reason: 'Envio de link malicioso/ataque hacker (Spam).' });
                console.log(`🚫 ${message.author.tag} foi banido por spam.`);
                
                // 3. Manda a mensagem de deboche no canal onde o link foi enviado
                await message.channel.send(`BEM FEITO, QUEM MANDA CLICAR EM LINK DE MÃES SOLTEIRAS 💅💀`);
            } else {
                console.log(`⚠️ Sem permissão para banir ${message.author.tag}.`);
                // Mesmo se não puder banir (tipo se for admin), o bot avisa no chat
                await message.channel.send(`⚠️ Eu deveria banir esse sapeca, mas não tenho permissão! Mas fica o aviso: QUEM MANDA CLICAR EM LINK DE MÃES SOLTEIRAS?`);
            }
        } catch (error) {
            console.error('Erro na execução da punição:', error);
        }
    }
});

const token = process.env.DISCORD_TOKEN;

if (!token) {
    console.error("❌ ERRO: A variável DISCORD_TOKEN não foi configurada no Render!");
    process.exit(1);
}

client.login(token);
