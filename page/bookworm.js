display = document.getElementById("book_data")

function library(callback){
	// wikiquote api call to get and format a list of quotes
    $.ajax({
            url: '/books',
            dataType: 'text',
            success: function (data) {
				callback(data);
            }            
	})
};

function showData(x){
	book_data.innerHTML = x;
}

library(showData);