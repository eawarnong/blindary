var book_ids = new Array();
var volunteer_id = localStorage.getItem('volunteer_id');
$(document).ready(function(){

	search();
	getRank();
	getBlindWant();
	getMostReaded();
	getpopularCategory();

});

function search() {
	$('#bookSearch').click(function(){
    	//let search = e.target.value;
    	var search = $('#searchBook').val();
    	console.log(search);
    	
    	if(search == ''){
    		$('#detailSearch').html(`
    			<div class="notify col-12 col-sm-12 col-md-12">
					<h4 style="color:grey; text-align:center;margin:20px 0px">ไม่มีข้อมูล</h6>
				</div>
    		`);
    	}else{
    		$.ajax({
	    		url : 'php/functions.php?function=searchReadedBook&param=' + search,
	    		success : function(searchs){
	    			searchs = JSON.parse(searchs);
	    			console.log(searchs);
	    			var length = Object.keys(searchs).length;
	    			if(length == 0){
    					$('#detailSearch').html(`
			    			<div class="notify col-12 col-sm-12 col-md-12">
								<h4 style="color:grey; text-align:center;margin:20px 0px">ไม่มีข้อมูล</h6>
							</div>
			    		`);
    				}else{
		    			$.each(searchs, function(index, search){
		    				// book_ids.push(search.book_id);
		    				var url = search.image;
		    				
		    					if(!url){
			    					url = "img/book.png"
			    				}
			    				$('#detailSearch').append(`

			    					<div class="book-search col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12" id="bookid-${search.book_id}" style="border-bottom: 1px solid darkgrey;margin: 10px 0px ">

					            		<div class="media">
											<img class="img-chapter3" src="${url}">
											<div class="media-body">
												<h4>${search.name}</h4>
												<h5>ข้อมูลหนังสือ</h5>
							                    <p class="p-detailBook">${search.book_name}</p>
							                    <p class="p-detailBook">ISBN: ${search.ISBN}</p>
							                    
											</div>
										</div>
									</div>
			    				`)
		    				
		    				
		    			});
		    		}
	    		}
	    	});

	    	$("#closeSearch").click(function(){
	    		$("#detailSearch").html(``)
	    	});	
    	}
 
    	
    
    });

	$('#searchBook').keypress(function(e) {
		if(e.which === 13) $('#bookSearch').click();
	});

	$('#detailSearch').on('click', '.book-search', function(){
		book_id = this.id.substring(this.id.indexOf('-') + 1)
		window.location = 'createChapter.html?book_id=' + book_id;
	});
}

function getRank() {
	volunteerID = JSON.stringify({
		volunteer_id : volunteer_id
	});
	if(!volunteer_id || volunteer_id == ''){
		$('.user-detail ').hide();
	}else{
		
		$.ajax({
			url : 'php/functions.php?function=getReadtime&param='+volunteerID,
			success : function(user) {
				user = JSON.parse(user);

				var url = user.avatar;
				var video_time = user.video_time;
				console.log(video_time);


				if(!url){
					url = "img/user.png";
				}
   
                $('#user').html(`
                    <img src="${url}" class="img-top">
                    <p> ${user.video_time} นาที</p>
                `);
	            

			    

			}
		});
	}
    
    
	$.ajax({
		url : 'php/functions.php?function=getReadtime',
		success : function(ranks) {
			ranks = JSON.parse(ranks);

			$.each(ranks, function(index, rank){
				url = rank.avatar;

				if(!url){
					url = "img/user.png";
				}
				if(index == 2){
					$('#ranks').append(`

						<div class="col-xl-1 inline text-center">  
							<img src="img/reward3.png" style="position:absolute;width:25px;"> 
				            <img src="${url}" class="img-top">
				            <p> ${rank.time} นาที </p>
		        		</div>

					`);
	
				}else if(index == 0){
					$('#ranks').append(`

						<div class="col-xl-1 inline text-center"> 
							<img src="img/reward1.png" style="position:absolute;width:25px;"> 
				            <img src="${url}" class="img-top">
				            <p> ${rank.time} นาที </p>
		        		</div>

					`);
				}else if(index == 1){
					$('#ranks').append(`

						<div class="col-xl-1 inline text-center"> 
							<img src="img/reward2.png" style="position:absolute;width:25px;"> 
				            <img src="${url}" class="img-top">
				            <p> ${rank.time} นาที </p>
		        		</div>

					`);
				}else{
					$('#ranks').append(`

						<div class="col-xl-1 inline text-center"> 
							<img src="${url}" class="img-top">
				            <p> ${rank.time} นาที </p>
		        		</div>

					`);
				}
				
				

			
				
				
			});
		}
	});
}

function getBlindWant() {
	$.ajax({

		url : 'php/functions.php?function=bookBlindWant&param=6',
		success : function(books){
			books = JSON.parse(books);

			console.log(books);

			$.each(books, function(index, book){
				url = book.image;

				if(!url || url == ''){
					url = 'img/book.png';
				}

				// console.log('book ' + book_name +)

				if(!book.ISBN) {
					book.ISBN = 'nah_' + Math.random().toString(36).substr(2, 10);
				}
				
				$('#wantBook').append(`
					
						<div class="want select col-6 col-sm-6 col-md-4 col-lg-3 col-xl-2 text-center blank ${book.ISBN}" onclick="createModal('${book.ISBN}')" style="padding-top: 10px; width:300px;heigth:auto;">
		                    <div>
	                            <img src="${url}" alt="${book.book_name}" class="img-book">
	                        </div>
		                    <div class="btw-b-t">${book.book_name}</div>
		                </div>

				`);

			});

			if(books.length < 6) {
				// blank book, in case of category has less than 6 books
				while(books.length < 6) {

					$('#wantBook').append(blankBook());
					books.length++;

				}
			} else {

				$('.wantListen').find('.row').first().append(`
					<div class="seeMore" id="seeMore-wantListen"></div>
				`);

				addSeeMore('#seeMore-wantListen', 1);
			}
		}
	});
}

function getMostReaded() {
	$.ajax({

		url : 'php/functions.php?function=mostReadBook&param=6',
		success : function(books){
			books = JSON.parse(books);
			console.log(books);

			$.each(books, function(index, book){
				url = book.image;

				if(!url || url == ''){
					url = 'img/book.png';
				}

				$('#readedBook').append(`
					
						<div class="read select col-6 col-sm-6 col-md-4 col-lg-3 col-xl-2 text-center blank ${book.ISBN}" onclick="createModal('${book.ISBN}')" style="padding-top: 10px; width:300px;heigth:auto;">
		                    <div>
	                            <img src="${url}" alt="${book.book_name}" class="img-book">
	                        </div>
		                    <div class="btw-b-t">${book.book_name}</div>
		                   
		                </div>

				`)

			});

			if(books.length < 6) {
				// blank book, in case of category has less than 6 books
				while(books.length < 6) {

					$('#readedBook').append(blankBook());
					books.length++;

				}
			} else {
				$('.mostReadedBook').find('.row').first().append(`
					<div class="seeMore" id="seeMore-mostReadBook"></div>
				`);

				addSeeMore('#seeMore-mostReadBook', 2);
			}

		}
	});
}

function getpopularCategory() {
	$.ajax({
		url : 'php/functions.php?function=popularCategory&param=6',
		success : function(categories){
			categories = JSON.parse(categories);

			// get categories
			$.each(categories, function(index, category) {
				$('#topCategory').append(`
					<div class="v-b">
			            <h2 class="h2-top20">${category.category_name}</h2>
			            <div class="row" style="padding:20px 20px;">
			                <div id="category-${category.category_id}" class="row " style="padding: 0px 50px;"></div>
			                
			                <div class="seeMore" id="seeMore-${category.category_id}"></div>
			            </div>
			        </div>
				`);

				// get books of each catefory
				$.each(category.books, function(index, book) {

					if(!book.image){
						book.image = 'img/book.png';
					}

					$('#category-' + category.category_id).append(`
						<div class="select col-6 col-sm-6 col-md-4 col-lg-3 col-xl-2 text-center blank ${book.ISBN}" onclick="createModal('${book.ISBN}')" style="padding-top: 10px; width:300px;heigth:auto;">
		                    <div>
		                    	<img src="${book.image}" alt="${book.book_name}" class="img-book">
	                        </div>
		                    <div class="btw-b-t">${book.book_name}</div>     
		                </div>
					`);
				});

				
				if(category.books.length < 6) {
					// blank book, in case of category has less than 6 books
					while(category.books.length < 6) {

						$('#category-' + category.category_id).append(blankBook());
						category.books.length++;

					}
				} else {
					addSeeMore('#seeMore-' + category.category_id, 3, category.category_id);
				}

			});
		}
	});
}

function addSeeMore($id, $flag, $cat_id) {

	var href = 'seeMore?flag=' + $flag;

	if($flag == 3) {
		href += '&id=' + $cat_id;
	}

	$($id).addClass('col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12');
	$($id).html(`
		<a href=${href}>
            <p class="inline"> ดูทั้งหมด </p>
            <i class="fa fa-arrow-right inline" aria-hidden="true"></i>
        </a>
	`);

}

function blankBook() {
	blank = `
			<div class="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-2 text-center blank blank1" style="padding:inherit; width:300px;heigth:auto;">
				<div>
                	<img class="img-book">
                </div>
                <div class="btw-b-t"></div>  
            </div>
			`;
	// $('.blank1').css({margin : '10px 20px;', margin:'0px 0px;', position:'relative;'});

	return blank;
}

function createModal($isbn) {
	var book_name = $('.' + $isbn).find('.btw-b-t').html();
	if($isbn.substring(0, 3) === 'nah') {
		$isbn = '';
	}
	// var book_name = $('#want-' + $isbn + ' .btw-b-t').text();
	// var book_name = $('#want-' + $isbn).html();
	$.ajax({
		url : 'php/functions.php?function=getUser&param=' + $isbn,
		success : function(users){
			users = JSON.parse(users);

			$('body').append(`
				<div class="modal hide fade" id="bookModal" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
			 		<div class="modal-dialog" role="document">
			 			<div class="modal-content">
			 				<div class="modal-header" style="padding: 20px;">
			 					<i class="fa fa-times" data-dismiss="modal" style="font-size: 20px;right: 0px;
                                            " aria-hidden="true"></i>
			 					<h5 class="modalBook">${book_name}</h5>
			 				</div>
			 				<div class="modal-body" id="modal-body"></div>
			 			</div>
			 		</div>
			 	</div>
			`);

			if(users.length > 0) {

				$.each(users, function(index, user) {
					url = user.avatar;
					if(!url){
						url = 'img/user.png'
					}
					$('#modal-body').append(`
						<div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12"
						onclick="window.location='createChapter.html?book_id=${user.book_id}'" style="border-bottom: 1px solid #eeeeee">
							<div class="row bookUser" style="margin:10px 0px">
								<div class="col-3 col-sm-3 col-md-2 col-lg-2 col-xl-2 text-center">
									<img src="${url}" class="img-bookUser">
								</div>
								<div class="col-9 col-sm-9 col-md-10 col-lg-10 col-xl-10">
									<p>${user.name}</p>
									<p class="inline">rank: ${user.ranking}</p>
									<p class="inline" style="float:right;">เสร็จแล้ว ${user.percent}</p>
								</div>
							
							</div>
						</div>
						
					`);
				});

			} else {
				$('#modal-body').html(`
					<div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 text-center" >
						<h6 style="color:darkgrey;">ยังไม่มีคนอ่านเรื่องนี้</h6>				
					</div>
					
				`);
			}

			$('#modal-body').append(`
				<div class="btnCreate col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12" style="padding-top:10px;">
					<button class="btn btn-primary btn-block full-width" onclick="window.location='createAudiobook.html?isbn=${$isbn}'">สร้างหนังสือเสียง</button>				
				</div>
			`);

			$('#bookModal').modal('show');

			$('#bookModal').on('hidden.bs.modal', function (e) {
			  	$('#bookModal').remove();
			});
		}
	});
}

