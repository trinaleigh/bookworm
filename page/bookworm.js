display = document.getElementById("book_data")

function library(callback){
	// wikiquote api call to get and format a list of quotes
    $.ajax({
            url: '/books',
            dataType: 'xml',
            success: function (data) {
				callback(data);
            }            
	})
};

function showData(rawData){

    $xml = $( rawData ),
    $title = $xml.find('title').slice(0,1);

    x = $title.text();

    book_data.innerHTML = x;

}

library(showData);