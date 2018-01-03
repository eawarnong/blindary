// $(document).ready(function() { 



// 	$('#searchIsbn').click(function(){

// 		var ISBN = $('#isbn').val();
// 		console.log(ISBN);
    	
//     	// let ISBN = e.target.value;
//     	// console.log(ISBN);

// 	    $.ajax({
// 	        url: "https://www.googleapis.com/books/v1/volumes?q=isbn:" + ISBN,
// 	    	dataType : "json",
// 	    // }).done(function(info) {
// 	    //    console.log(info);

	       
// 	    //    for(i=0; i<info.items.length; i++){
// 	    //    		book = info.item[i].volumeInfo;
// 	    //    }
// 	    //    console.log(book);
// 	    	success : function(info){
//     			console.log(info);
    		
//         		book = info.items[0].volumeInfo;
//         		console.log(book);

//         		$("#book_name").val(book.title);
//         		$("#no_of_page").val(book.pageCount);
//         		$("#publish").val(book.publisher);
//         		$("#author").val(book.authors);
	        		
	    	    
	    		
// 	    	}
// 	    });

// 	});

// });