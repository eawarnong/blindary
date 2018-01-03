name = localStorage.getItem('name');
if(name == null || name == '') {
	window.location.href="index.html";
}
volunteer_id = localStorage.getItem('volunteer_id');
var searchParams = new URLSearchParams(window.location.search.split('?')[1]); //?anything=123
var isbn = searchParams.get('isbn');

$(document).ready(function(){

	$.ajax({

		url : 'php/functions.php?function=getCategories',
		success : function(categories){
			
			categories = JSON.parse(categories);

			$.each(categories, function(index, category){
				$('#category_id').append(`

					<option value="${category.category_id}">${category.category_name}</option>

				`);
			});
		}

	});
 
	$('#searchIsbn').click(function(){
		searchBookFromDb($('#isbn').val());	
	});

	if(isbn) {
		$('#isbn').val(isbn)
		$('#searchIsbn').click();
	}

	$('#createbook').click(function(){

		if($('#isbn').val() == ''){
			$('.req').addClass('highlight');
			    
		}
		if($('#book_name').val() == ''){
		    $('.req').addClass('highlight');
		    
		}		
		if($('#no_of_chapter').val() == ''){
		    $('.req').addClass('highlight');
		    
		}
		if($('#no_of_page').val() == ''){
		    $('.req').addClass('highlight');
		    
		}
		if($('#publish').val() == ''){
		    $('.req').addClass('highlight');
		    
		}
		if($('#author').val() == ''){
		    $('.req').addClass('highlight');
		    
		}

		if(($('#isbn').val().length > 0) && ($('#book_name').val().length > 0) && ($('#no_of_chapter').val().length > 0)&& ($('#no_of_page').val().length > 0)&& ($('#publish').val().length > 0)&&($('#author').val().length > 0)){
			$('.req').removeClass('highlight');
			book = JSON.stringify({
				volunteer_id : volunteer_id,
				isbn : $('#isbn').val(),
				book_name : $('#book_name').val(),
				category_id : $('#category_id').val(),
				no_of_chapter : $('#no_of_chapter').val(),
				no_of_page : $('#no_of_page').val(),
				publish : $('#publish').val(),
				author : $('#author').val(),
				translator : $('#translator').val(),
				image : $('#image').val()
				
			});

			console.log(book);



			$.ajax({
	            url: "php/functions.php?function=insertBook&param=" + book,
	    		success: function(data){
	    			console.log(data);
	    			if(data == 1){
	    				alert('คุณได้สร้างหนังสือเล่มนี้ไปแล้ว');
	    			}else{
	    				window.location = 'createChapter.html?book_id=' + data;
	    			}
	    			
	    		}
	        });
		}


	});

	

});

function searchBookFromDb($isbn) {
	$.ajax({
		url : "php/functions.php?function=getDetailInsert&param=" + $isbn,
		success : function(info){

			info = JSON.parse(info);

			if(info.result == 0){
				
				$("#book_name").val(info.book_name);
				$('#category_id').val(info.category_id);
				$("#no_of_chapter").val(info.no_of_chapter)
	    		$("#no_of_page").val(info.no_of_page);
	    		$("#publish").val(info.publish);
	    		$("#author").val(info.author);
	    		$("#translator").val(info.translator);
	    		
			}else{
				console.log('false naja');
				searchBookFromApi($isbn);
			}

		}
	});
}

function searchBookFromApi($isbn) {
	console.log('from api');
	$.ajax({
        url: "https://www.googleapis.com/books/v1/volumes?q=isbn:" + $isbn,
    	dataType : "json",

    	success : function(info){
			if(info != null){
				if(info.totalItems > 0) {
					book = info.items[0].volumeInfo;
					console.log('have book');
	    		
	        		$("#book_name").val(book.title);
	        		$("#category_id").val("15");
	        		$("#no_of_chapter").val();
	        		$("#no_of_page").val(book.pageCount);
	        		$("#publish").val(book.publisher);
	        		$("#author").val(book.authors);
	        		$('#image').val(book.imageLinks.thumbnail);
	        		$("#translator").val('');
	        	} else {
	        		$("#book_name").val('');
					$('#category_id').val('');
					$("#no_of_chapter").val('')
		    		$("#no_of_page").val('');
		    		$("#publish").val('');
		    		$("#author").val('');
		    		$('#image').val('');
		    		$("#translator").val('');
	        		alert('ไม่ค้นพบข้อมูลของหนังสือเล่มนี้ กรุณากรอกข้อมูลด้วยตัวคุณเองค่ะ');
	        	}
    		}
		
    	}
    });
}