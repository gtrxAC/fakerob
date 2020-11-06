# fakerob - fake "pls rob" replies
This bot uses webhooks to look like Dank Memer (or any bot of your choice) and sends fake rob replies to troll pirates who come to your rob-disabled server.

## Setting up
1. Invite the bot to your server [here](https://discord.com/api/oauth2/authorize?client_id=526496523878662157&permissions=536873984&scope=bot)
2. Create a webhook in the channel(s) where Dank Memer is used.
3. Set its name to what Dank Memer's nickname in your server is.
4. Set the avatar to https://cdn.discordapp.com/avatars/270904126974590976/b163c48fbae065c62da9682ccd6cc235.png
5. You can add/remove customized replies (see commands below).
6. If your Dank Memer channel(s) have multiple webhooks, you can choose one to use with the `fr setname` command.

## Commands
* `fr help` / `fr ?`
* Shows this message.

* `fr reset`
* Restores all settings back to the defaults.

* `fr ls rob` / `fr ls heist`
* Shows a list of all rob/heist replies.

* `fr rm rob (#)` / `fr rm heist (#)`
* Removes a rob/heist reply. The (#) can be found by doing `fr ls rob` or `fr ls heist`.

* `fr add rob (msg)` / `fr add heist (msg)`
* Adds a new rob/heist reply. In the message, "$user" is replaced with the robber's username and "$target" with the victim's username.

* `fr setname (webhook's name)`
* If the Dank Memer channel has multiple webhooks, this can be used to specify which webhook is used.

* `fr invite`
* Add the bot to your server.

## Self-hosting
1. Install the dependencies. `npm i discord.js enmap better-sqlite-pool`
2. Create a token.json file and paste your bot token there, surrounded by quotes. [Get a token here](https://discord.com/developers)
3. Start the bot. `node .`
