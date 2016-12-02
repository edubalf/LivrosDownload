var fs = require('fs');
var leLivros = require('./leLivros');

if (!fs.existsSync('./livros')){
    fs.mkdirSync('./livros');
}

leLivros.downloadAllBooks();