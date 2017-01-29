footer = document.getElementById("footer");
input = document.getElementById("isbn");
form = document.getElementById("form");

// example ISBNS:
// 9780486415918
// 9781476738024
form.addEventListener("submit", addBook);

function addBook(event){
    event.preventDefault();
    library(input.value).then(parseData).then(showData);
    this.reset();
}

function library(isbn){
	// wikiquote api call to get and format a list of quotes
    return $.ajax({
            url: `/books/${isbn}`,
            dataType: 'xml'
    //         success: function (data) {
				// callback(data);
    //         }            
	})
};

function parseData(rawData){ 

    $xml = $(rawData),
    $article = $xml.find('nonSort').slice(0,1);
    $title = $xml.find('title').slice(0,1);
    $author = $xml.find('namePart').slice(0,1);
    $dob = $xml.find('namePart').slice(1,2);

    title = $article.text().toUpperCase() + " " + $title.text().toUpperCase();
    author = $author.text();
    dob = $dob.text();

    book = {
        title, 
        author,
        dob };

    return new Promise(function(resolve, reject) {      

        if (book) {
            resolve(book);
        }
        else {
            reject(Error("parsing failed"));
        }
    })
};


function showData(book){
    newBook = document.createElement("p");
    newBook.innerHTML = `${book.title}<br>${book.author}: ${book.dob}<br>`;
    document.body.insertBefore(newBook, footer);
}


