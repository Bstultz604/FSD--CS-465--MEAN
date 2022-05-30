
const fs = require('fs');

const rooms = JSON.parse(fs.readFileSync('./data/rooms.json', 'utf8'))


/*GET travel view*/
const room = (req, res) => {
    res.render('rooms', { title: 'Travlr Getaways', rooms });
};

module.exports = {
    room
};