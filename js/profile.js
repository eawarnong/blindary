var book_ids = new Array();
var book_ID = new Array();
var url;

$(document).ready(function(){

	name = localStorage.getItem('name');
	if(name == null || name == '') {
		window.location.href="index.html";
	}	

	volunteer_id = localStorage.getItem('volunteer_id');
	console.log(volunteer_id);
	
	// function imgError(image) {
	//     image.onerror = "";
	//     image.src = "img/user_0.png";
 //    return true;
	// }
	
	 
	
	$.ajax({

		url : "php/functions.php?function=getUserInfo&param="+volunteer_id,
		success : function(user){
			
			user = JSON.parse(user);
			console.log(user);
			
			url = user.avatar;
			ranking = user.ranking;

			if(!url || url == ""){
				url = 'img/user.png'
			}
			if(ranking == "" || !ranking){
				ranking = "0";
			}

			    $('#user_profile').html(`

					
                    <img src="${url}"  class="img-profile img-profileMobile">
                    <h5 style="padding: 10px 0px;font-weigth:700;">${user.name}</h5>
                    <i class="fa fa-star-o inline" aria-hidden="true" style="font-weigth:bold;"></i>
                    <p class="inline" style="padding-right:20px;"> ${ranking}</p>
                    <p class="inline"> จำนวนการอ่าน: ${user.number_of_books} เรื่อง   ${user.video_time} วินาที</p>                 

				`);
			
			//});

		}

	});

	

	
	


// 	var jsonData = JSON.parse(myData);
// var url = jsonData["details"].imageUrl;
// if(!url || url == ""){
//     image.src = "default.png"
// }else{
//     image.src = url;
// }

	$.ajax({

		url : "php/functions.php?function=getReadedBook&param=" + volunteer_id,
	 	success : function(books){
	 		books = JSON.parse(books);

	 		var length = Object.keys(books).length;

			if(length == 0){
				$('#books').html(`
					<div class="notify col-12 col-sm-12 col-md-12" >
						<h4 style="color:grey; text-align:center;margin-top:20%">ยังไม่มีหนังสือเสียงที่ถูกสร้าง</h4>
					</div>
				`)
			}else{
				$.each(books, function(index, book){

		 			// book_ids.push(book.book_id);
		 			url = book.image;

		 			if(!url){
		 				url = 'img/book.png';
		 			}

		 			$('#books').append(`
		 				
		 				<div class="book-user default col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12" id="bookid-${book.book_id}" style="border-bottom: 1px solid darkgrey;">
		 					<div class="row">
		 						<div class="book-info col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
					 				<div class="media mediaProfile">
					                    <img class="mr-3 img-chapter2" src="${url}">
					                    <div class="media-body" style="padding-left: 20px;">
					                        <h4>${book.book_name}</h4>
					                        <p>ประเภท: ${book.category}</p>
					                        
					                        <i class="fa fa-star inline" aria-hidden="true"></i>
					                        <p class="inline"> ${book.rating}</p>
					                        
					                        <i class="fa fa-user inline" aria-hidden="true" style="margin-left:20px; color:grey;"></i>
					                        <p class="inline"> ${book.listening_times} คน </p>
					                    </div>
					                </div>
					                <div class="myProgress">
				                        <div class="myBar inline" id="progress-${book.book_id}" style="width: ${book.percent_finish}"></div>
				                        <p class="progressBook inline" id="book-${book.book_id}"> ${book.percent_finish} </p>
				                    </div>
				                </div>
		                    </div>
	                    </div>

		 			`);
		 			
		 			if(book.percent_finish != '0%'){
		 				$('#book-' + book.book_id).addClass('text-red');
		 			}
		 			if(book.percent_finish == '100%'){
		 				$('#book-' + book.book_id).css({color:'white',right:'20px'});
		 				$('#progress-' + book.book_id).css({background:'#00925b'});
		 			}
		 			

		 		});	
			}

	 		

	 	}

	});

	$('#deleteBook').click(function(){
		$("#deleteBook").hide();
		$("#backDefault").show();

		$('.book-info').removeClass('col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12');
		$('.book-info').addClass('col-8 col-sm-8 col-md-10 col-lg-10 col-xl-10');

		$('.book-user').removeClass('default');

		$('.book-user').each(function(){
			id = $(this).attr('id');
			console.log(id);
			$('#' + id + ' .row').append(`
				<div class="col-4 col-sm-4 col-md-2 col-lg-2 col-xl-2 text-center delete-container" style="margin-top:30px;">
			        <button class="btn btn-danger btn-lg btn-lgMobile" id="delete-${id.substring(id.indexOf('-') + 1)}" onclick="deleteBook(this)">ลบ</button>
			    </div>
			`);
		});

	});
	$("#backDefault").click(function(){
		$('#deleteBook').show();
		$("#backDefault").hide();

		$('.book-info').removeClass('col-9 col-sm-9 col-md-10 col-lg-10 col-xl-10');
		$('.book-info').addClass('col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12');

		$('.book-user .row .delete-container').remove();
		$('.book-user').addClass('default');
	});

	$.ajax({
		url : "php/functions.php?function=getJoinedBook&param=" + volunteer_id,
		success : function(books){
			books = JSON.parse(books);
			console.log(books);

			var length = Object.keys(books).length;

			if(length == 0){
				$('#book-detail').html(`
					<div class="notify col-12 col-sm-12 col-md-12" >
						<h4 style="color:grey; text-align:center;margin-top:20%">ยังไม่มีหนังสือเสียงที่คุณได้เข้าร่วม</h4>
					</div>
				`)
			}else{
				$.each(books, function(index, book){
					url = book.image;

		 			if(!url){
		 				url = 'img/book.png';
		 			}
					// book_ID.push(book.book_id);
					$('#book-detail').append(`
						<div class="joinBook col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12" id="join-${book.book_id}" style="border-bottom: 1px solid darkgrey;">
				 				<div class="media mediaProfile">
				                    <img class="mr-3 img-chapter2" src="${url}">
				                    <div class="media-body" style="padding-left: 30px;">
				                        <h4>${book.book_name}</h4>
				                        <p>ประเภท: ${book.category}</p>
				                        <i class="fa fa-star inline" aria-hidden="true"></i>
				                        <p class="inline"> ${book.rating} </p>
				                        
				                        <i class="fa fa-user inline" aria-hidden="true"  style="margin-left:20px; color:grey;"></i>
				                        <p class="inline"> ${book.listening_times} คน </p>
				                    </div>
				                </div>
				                
		                </div>
					`)
				});
			}

			
			

		}
	});
	// console.log(book_ids);
	var book_id;

	$('#books').on('click', '.default', function() {
		// console.log('id ' + this.id);
		// console.log('book id ' + this.id.substring(this.id.indexOf('-') + 1));
		book_id = this.id.substring(this.id.indexOf('-') + 1)
		// console.log('createChapter.html?book_id=' + book_id);
		window.location = 'createChapter.html?book_id=' + book_id;
	});
	$('#book-detail').on('click', '.joinBook', function() {
		book_id = this.id.substring(this.id.indexOf('-') + 1)
		window.location = 'createChapter.html?book_id=' + book_id;
	});
	
	
});

function deleteBook(e) {
	var id = $(e).attr('id');
	var bookId = id.substring(id.indexOf('-') + 1);

	$('#deleteModal').remove();

	$('#bookid-' + bookId).append(`
		<div class="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
			<div class="modal-dialog" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<i class="fa fa-times" data-dismiss="modal" style="font-size: 20px; float:right;" aria-hidden="true"></i>
												
					</div>
					<div class="modal-body text-center">
						<div style="margin-bottom:10px;">
							<h6 class="inline">ต้องการลบหนังสือเล่มนี้ใช่หรือไม่</h6>
						</div>
							<button class="btn btn-danger" id="submitDelete" data-dismiss="modal" onclick="deleteData(${bookId})">ลบ</button>
							<button class="btn btn-defaults" data-dismiss="modal">ยกเลิก</button>
						
					</div>
				
				</div>
			</div>
		</div>
	`);

	$('#deleteModal').modal('show');

}

function deleteData(book_id) {


	$.ajax({

		url : "php/functions.php?function=deleteBook&param=" + book_id,
	 	success : function(data){
	 		data = JSON.parse(data);

	 		console.log(data);

	 		//delete playlist
	 		$.each(data.playlists, function(index, playlist) {

	 			console.log(playlist);

	 			buildApiRequest('DELETE',
		                '/youtube/v3/playlists',
		                {'id': playlist,
		                 'onBehalfOfContentOwner': ''});

	 		});

	 		// //delete videos
	 		$.each(data.videos, function(index, video) {

	 			buildApiRequest('DELETE',
		                '/youtube/v3/videos',
		                {'id': video,
		                 'onBehalfOfContentOwner': ''});

	 		});

	 		$('#deleteModal').on('hidden.bs.modal', function (e) {
			  	$('#deleteModal').remove();
			  	$('#bookid-' + book_id).remove();
			});

	 	}

	});

}

// $(document).on('click', '.book', function() {
// 	console.log('createChapter.html?book_id=' + book.book_id);
// })

// $('.book').bind("click", function() {
// 		console.log('createChapter.html?book_id=' + book.book_id);
// 		// window.location = 'createChapter.html?book_id=' + book.book_id;
// 	});