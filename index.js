const easyvk = require('easyvk')
const fs = require('fs')
const config = require('./config.json')
const key = config['key']
const tlEditMode = config['timeline_edit_mode']

const commandHandler = require('./commandHandler')

easyvk({
    token: key
}).then(vk => {
    console.log(vk.session.group_id);

    vk.bots.longpoll.connect({
        forGetLongPollServer: {
            grop_id: vk.session.group_id
        }
    }).then((connection) => {
        let cHandler = new commandHandler(vk);
        connection.on("message_new", (msg) => {
            console.log(msg);
            cHandler.handle(msg); //On message event
        });

    });

})