footer = document.getElementById("footer")
input = document.getElementById("isbn")
form = document.getElementById("form")

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

    $xml = $(rawData),
    $article = $xml.find('nonSort').slice(0,1);
    $title = $xml.find('title').slice(0,1);

    x = $article.text().toUpperCase() + " " + $title.text().toUpperCase();

    newBook = document.createElement("p");
    newBook.innerHTML = x
    document.body.insertBefore(newBook, footer)

}

// example ISBNS:
// 9780486415918
// 9781476738024
form.addEventListener("submit", addBook)

function addBook(event){
    event.preventDefault();
    library(input.value, showData);
    this.reset();
}


