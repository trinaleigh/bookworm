const display = document.getElementById("all_books");
const input = document.getElementById("isbn");
const form = document.getElementById("form");

form.addEventListener("submit", addBook);

var bookshelf = []

function addBook(event){

    event.preventDefault();

    library(input.value)
        .then(parseData)
        .then(updateShelf)
        .then(function(){showData(bookshelf, display)});

    this.reset();
}

function library(isbn){
    // access Library of Congress online catalog
    return $.ajax({
            url: `/books/${isbn}`,
            dataType: 'xml'         
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

    var book = {
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

function updateShelf(book){

    bookshelf.push(book);

    return new Promise(function(resolve, reject) {      

        if (bookshelf) {
            resolve();
        }
        else {
            reject(Error("bookshelf update failed"));
        }
    })
}

function showData(bookshelf, div){
    while(div.firstChild){
        div.removeChild(div.firstChild);
    }

    bookshelf.forEach(function(book){
        newBook = document.createElement("p");
        newBook.innerHTML = `${book.title}<br>${book.author}: ${book.dob}<br>`;
        div.appendChild(newBook);
    })
}


