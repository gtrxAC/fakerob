const
Discord   = require('discord.js'),
Enmap     = require('enmap'),
fs        = require('fs'),
defaults  = require('./defaults.json'),
db        = new Enmap('fakerob'),
client    = new Discord.Client(),

createCfg = g => {if (!db.has(g.id)) db.set(g.id, defaults)},

sendReply = async (message, target, replies) => {
  const {name} = db.get(message.guild.id) || defaults;

  const hooks = await message.channel.fetchWebhooks();
  let webhook = hooks.find(hook => hook.name === name) || hooks.first();
  if (!webhook) return;

  if (!target) {
    // If no one was mentioned, say that you need to mention someone.
    webhook.send(replies[0]);
  } else {
    // Otherwise send a random reply.
    target = message.mentions.users.first()
    || message.client.users.cache.get(target)
    || message.client.users.cache.find(u => u.tag.toLowerCase().startsWith(target.toLowerCase()))
    || target;

    message = replies[Math.floor(Math.random() * replies.length)]
    .replace(/\$user/g, message.author.username)
    .replace(/\$target/g, target.username || target);
    webhook.send(message, {disableMentions: 'all'});
  }
}

client.on('message', message => {
  const config = db.get(message.guild.id) || defaults;

  // Command handler.
  if (message.content.startsWith('fr ')) {
    if (message.author.bot) return;
    if (!message.member.permissions.has('MANAGE_GUILD')) return;
  
    const args = message.content.slice(3).split(' ');
    const cmdName = args.shift();
    switch (cmdName) {
      // Sends the contents of the help file.
      case 'help':
      case '?':
        data = fs.readFileSync('help.txt').toString();
        message.channel.send(data);
        break;
  
      // Resets the configuration back to the defaults.
      case 'reset':
        confirm = args.shift();
        if (confirm == 'confirm') {
          db.delete(message.guild.id);
          message.reply('reset the configuration.');
        } else {
          message.reply('are you sure? Use `fr reset confirm` to confirm.');
        }
        break;
  
      // Lists all the rob or heist replies.
      case 'ls':
        type = args.shift();
        if (['rob', 'heist'].includes(type)) {
          let list = 'Tip: The first (number 0) reply is always used if no one was mentioned in the rob command.\n';
          config.replies[type].forEach((reply, index) => {
            list += `\n\`${index}:\` "${reply}"`;
          })
          message.channel.send(list);
        } else {
          message.reply('specify a type of reply to list - `fr ls rob` or `fr ls heist`.');
        }
        break;
  
      // Removes a reply.
      case 'rm':
        createCfg(message.guild);
        [type, index] = args;
        if (['rob', 'heist'].includes(type) && isFinite(index)) {
          removed = config.replies[type].splice(index, 1);
          db.set(message.guild.id, config);
          message.reply(`removed reply ${index}: "${removed}"`);
        } else {
          message.reply('specify a reply type and an index, e.g. `fr rm heist 0` will remove the first heist reply listed in `fr ls heist`.');
        }
        break;
  
      // Adds a reply.
      case 'add':
        createCfg(message.guild);
        type = args.shift(), reply = args.join(' ');
        if (['rob', 'heist'].includes(type) && message.length) {
          length = config.replies[type].push(reply)
          db.set(message.guild.id, config);
          message.reply(`added reply ${length - 1}: "${reply}"`);
        } else {
          message.reply('specify a reply type and the reply message, e.g. `fr add rob Hello world!`.');
        }
        break;

      // Sets the name of the webhook to be used (if the channel has multiple webhooks).
      case 'setname':
        createCfg(message.guild);
        if (args.length) {
          db.set(message.guild.id, args.join(' '), 'name');
          message.reply(`changed the webhook name to "${args.join(' ')}"`);
        } else {
          message.reply(`specify a name to change to, the current name is "${config.name}".`);
        }
        break;
    }
    return;
  }

  // Rob message handler.
  const [prefix, command, target] = message.content.split(' ');
  if (prefix != 'pls') return;


  
  // If we get a rob message, send a rob reply.
  if (['steal', 'rob', 'ripoff'].includes(command)) {
    sendReply(message, target, config.replies.rob);
  } else {
    // If we get a heist message, send a heist reply.
    if (['heist', 'bankrob'].includes(command)) {
      sendReply(message, target, config.replies.heist);
    }
  }
})

.on('ready', () => {
  console.log('ready!');
  client.user.setActivity('lol');
});

client.login(
  fs.readFileSync('token').toString()
);