const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
require("./deploy-commands")
require("./bot")

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Variável para armazenar o intervalo
let linkInterval = null;

// Função para gerar uma string aleatória
function generateRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

client.once('ready', () => {
    console.log(`Bot logado como ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'start') {
        // Verifica se o intervalo já está rodando
        if (linkInterval) {
            await interaction.reply({ content: 'O bot já está enviando links.', ephemeral: true });
            return;
        }

        await interaction.reply({ content: 'Iniciando o envio de links!', ephemeral: true });

        // Inicia o intervalo para enviar a mensagem a cada 1 segundo
        linkInterval = setInterval(() => {
            const randomString = generateRandomString(24);
            const link = `https://discord.com/billing/promotions/${randomString}`;
            interaction.channel.send(link);
        }, 1000);

    } else if (commandName === 'stop') {
        // Verifica se o intervalo não está rodando
        if (!linkInterval) {
            await interaction.reply({ content: 'O bot não está enviando links no momento.', ephemeral: true });
            return;
        }

        // Para o intervalo
        clearInterval(linkInterval);
        linkInterval = null; // Limpa a variável

        await interaction.reply({ content: 'Envio de links interrompido.', ephemeral: true });
    }
});

client.login(process.env.DISCORD_TOKEN);
