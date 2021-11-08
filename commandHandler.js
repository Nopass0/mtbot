const easyvk = require('easyvk')
const config = require('./config.json')

let getDayOfWeek = () => {
    let now = new Date();
    let days = ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'];
    return days[ now.getDay() ];
}

let getUser = (id) => this.vk.call("users.get", { user_ids: id }).catch(console.error); //TODO: Исправить ошибку

class commandHandler {
    constructor(vk) {
        this.vk = vk;
        console.log('Command handler has been loaded!')
    }
    sendMsg(id, text) {
        this.vk.call("messages.send", {
            peer_id: id,
            message: text,
            random_id: easyvk.randomId()
        }).catch(console.error);
    }
    handle(msg) {
        this.msg = msg;
        let message = msg['message']['text'];
        let id = msg['message']['from_id'];
        if(message[0]=='!') {
           let command = message.split(' ')[0].slice(1);
           switch (command) {
               case 'расписание':
                   if(message.split(' ').length == 1) {
                       this.sendMsg(id, `⌛Расписание на ${getDayOfWeek()}\n`); //TODO: Доделать
                   } else {
                       let subcommand = message.split(' ')[1];
                       switch (subcommand) {
                           case 'редактировать':
                               this.sendMsg(id, `${getUser(id)['response']['last_name']}, вы вошли в режим редактирования!`)
                               config['timeline_edit_mode'].push(id);
                               fs.writeFile('./config.json', JSON.stringify(config), function (err) {
                                   console.log(err);
                               });
                               break;
                           default:
                               break;
                       }
                   }
                   break;
               case 'io':
                   this.sendMsg(id, 'po');
                   break;
               default:
                   this.sendMsg(id, "[Ошибка]: Неверная команда!");
           }
        }
    }
}

module.exports = commandHandler