footer = document.getElementById("footer")

function library(isbn, callback){
	// wikiquote api call to get and format a list of quotes
    $.ajax({
            url: `/books/${isbn}`,
            dataType: 'xml',
            success: function (data) {
				callback(data);
            }            
	})
};

function showData(rawData){

    $xml = $( rawData ),
    $article = $xml.find('nonSort').slice(0,1);
    $title = $xml.find('title').slice(0,1);

    x = $article.text().toUpperCase() + " " + $title.text().toUpperCase();

    newBook = document.createElement("p");
    newBook.innerHTML = x
    document.body.insertBefore(newBook, footer)

}

library(9780486415918, showData);
library(9781476738024, showData);