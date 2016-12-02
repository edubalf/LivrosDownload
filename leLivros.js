var Crawler = require("node-webcrawler");
var url = require('url');
var http = require('http');
var fs = require('fs');

var lastPage;
var countRunDownloads = 0;

var downloadAllBooks = function () {
    try {
        download.queue('http://lelivros.top/book/page/1');
    }
    catch (e) {
        console.log('Erro consulta ultima pagina');
    }
}

var download = new Crawler({
    maxConnections: 1,
    callback: function (error, result, $) {

        lastPage = $('.last')
            .attr('href')
            .split('/')[5];

        for (var i = 1; i < lastPage; i++) {
            try {
                pages.queue('http://lelivros.top/book/page/' + i);
            }
            catch (e) {
                console.log('Erro na pagina ' + i + '\n' + e);
            }
        }
    }
});

var pages = new Crawler({
    maxConnections: 1,
    callback: function (error, result, $) {

        if (error) {
            console.log(error);
        }
        else {
            $('.product > a').each(function (index, a) {
                if (index % 2 == 0) {

                    try {
                        books.queue($(a).attr('href'));
                    }
                    catch (e) {
                        console.log('Erro com um livro ' + e);
                    }
                }
            });
        }
    }
});

var books = new Crawler({
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

                    var name = $('.product_title').text()
                        .replace(new RegExp(' ', 'g'), '_')
                        .replace(/[^\w\s]/gi, '');

                    var file = fs.createWriteStream("livros/" + name + ".pdf");
                    var request = http.get(link, function (response) {
                        response.pipe(file);
                        file.on('finish', function () {
                            file.close(function () {
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

module.exports.downloadAllBooks = downloadAllBooks;