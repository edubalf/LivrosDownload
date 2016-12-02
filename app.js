var Crawler = require("node-webcrawler");
var url = require('url');
var http = require('http');
var fs = require('fs');

var pagina = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page 
    callback : function (error, result, $) {
        // $ is Cheerio by default 
        //a lean implementation of core jQuery designed specifically for the server 
        if (error) {
            console.log(error);
        }
        else {
            $('.product > a').each(function(index, a) {
                
                if (index % 2 == 0) {
                    //console.log($(a).attr('href'));
                    livro.queue($(a).attr('href'));
                }
            });
        }
    }
});

var livro = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page 
    callback : function (error, result, $) {
        // $ is Cheerio by default 
        //a lean implementation of core jQuery designed specifically for the server 
        if (error) {
            console.log(error);
        }
        else {
            $('.links-download > a').each(function(index, a) {
                if ($(a).attr('href').indexOf('.pdf') != -1) {
                    
                    var link = $(a).attr('href').replace(new RegExp(' ', 'g'), '%20'); 

                    var nome = $('.product_title').text()
                        .replace(new RegExp(' ', 'g'), '_')
                        .replace(/[^\w\s]/gi, '');

                    var file = fs.createWriteStream("livros/" + nome + ".pdf");
                    var request = http.get(link, function(response) {
                        response.pipe(file);
                        file.on('finish', function() {
                            //console.log('a');
                            file.close(function() {
                                console.log(nome + ' - terminou download');
                            });
                        });
                    });                    
                }
            });
        }
    }
});

for (var a = 0; a < 4; a++) {
    pagina.queue('http://lelivros.top/book/page/' + a);
}