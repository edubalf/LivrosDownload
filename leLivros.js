var Crawler = require("node-webcrawler");
var url = require('url');
var http = require('http');
var fs = require('fs');

var lastPage;

var download = new Crawler({
    maxConnections: 1,
    callback: function (error, result, $) {

        lastPage = $('.last')
            .attr('href')
            .split('/')[5];

        for (var i = 1; i < lastPage; i++) {
            pagina.queue('http://lelivros.top/book/page/' + i);
        }
    }
});

var countRunDownloads = 0;

var pagina = new Crawler({
    maxConnections: 10,
    callback: function (error, result, $) {

        if (error) {
            console.log(error);
        }
        else {
            $('.product > a').each(function (index, a) {
                if (index % 2 == 0) {
                    livro.queue($(a).attr('href'));
                }
            });
        }
    }
});

var livro = new Crawler({
    maxConnections: 10,
    callback: function (error, result, $) {
        if (error) {
            console.log(error);
        }
        else {
            $('.links-download > a').each(function (index, a) {
                if ($(a).attr('href').indexOf('.pdf') != -1) {

                    var link = $(a).attr('href')
                        .replace(new RegExp(' ', 'g'), '%20');

                    var nome = $('.product_title').text()
                        .replace(new RegExp(' ', 'g'), '_')
                        .replace(/[^\w\s]/gi, '');

                    var file = fs.createWriteStream("livros/" + nome + ".pdf");
                    var request = http.get(link, function (response) {
                        response.pipe(file);
                        file.on('finish', function () {
                            file.close(function () {
                                //console.log(nome + ' - terminou download');

                                countRunDownloads++;
                                console.log('Baixados ' + countRunDownloads + ' de ' + lastPage + 16 + ' livros');
                            });
                        });
                    });
                }
            });
        }
    }
});

var downloadAllBooks = function () {
    download.queue('http://lelivros.top/book/page/1');
}

module.exports.downloadAllBooks = downloadAllBooks; 
