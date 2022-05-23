const fs = require('fs');

const blogs = JSON.parse(fs.readFileSync('./data/blogs.json', 'utf8'));


/*GET homepage*/
const index = (req, res) => {
    res.render('index', { title: 'Travlr Getaways', blogs});
};

module.exports = {
    index
};