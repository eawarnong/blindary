var searchParams = new URLSearchParams(window.location.search.split('?')[1]);
var flag = searchParams.get("flag");
var cat_id = searchParams.get("id");

$(document).ready(function(){

	getBooksFunction();
	
});

function getBooksFunction() {
	var func = '';

	switch(flag) {
		case '1': 
			func = 'bookBlindWant'; 
			$('#head-topic').html('หนังสือที่อยากฟัง');
			break;
		case '2': 
			func = 'mostReadBook'; 
			$('#head-topic').html('หนังสือที่มีคนอ่านมากที่สุด');
			break;
		case '3': func = 'categoryBook&param=' + cat_id;
	}

	$.ajax({
		url : 'php/functions.php?function=' + func,
		success : function(data){
			data = JSON.parse(data);
			if(flag == 3) {

				$('#head-topic').html(data.category_name);
				if(data.books.length == 0) $('.content').html(`<div class="notify col-12 col-sm-12 col-md-12">
						<h5 style="color:#B0B0B0; text-align:center;">ยังไม่มีการสร้างหนังสือในหมวดนี้</h5>
					</div>`);
				else initPages(data.books);

			} else {
				initPages(data);
			}
		}
	});
}

function initPages(books) {
	var length = books.length;
	var pageTotal= (length/18)+1;
	var currentPage = 1;
	var dataPrev = 0;
	var dataNext = 20;

	if(currentPage == 1){
		initContent(books, 0, 20);
	}

	$('#page-selection').bootpag({
		total: pageTotal,
		page: currentPage,
		maxVisible: 10

	}).on("page", function (event, /* page number here */ num) {

		if (num != currentPage) {
			currentPage = num;

			if(currentPage == num){
				$('.content').html(``)
				if(num == 1){
					dataPrev = 0;
					dataNext = 20;
				}else if(num == 2){
					dataPrev = 20;
					dataNext = dataNext*num;
				}else{
					dataPrev = dataPrev*num;
					dataNext = dataNext*num;
				}

				$('.content').html(``);
				initContent(books, dataPrev, dataNext);

			}

		}

	});

}

function initContent(books, dataPrev, dataNext) {

	$.each(books, function(index,book){
		if(index >= dataPrev && index < dataNext){
						
			if(!book.image){
				book.image = 'img/book.png';
			}

			$('.content').append(`						
				<div class="select col-6 col-sm-6 col-md-4 col-lg-3 col-xl-3 text-center blank ${book.ISBN}" style="padding: 20px 0px;" onclick="createModal(${book.ISBN})" >
		            <div>
		                <img src="${book.image}" alt="${book.book_name}" class="img-book">
		            </div>
		            <div class="btw-b-t">${book.book_name}</div>   
		        </div>
			`);

		}else if(index >= dataNext){
			return false;
		}
	});

}

function createModal($isbn) {
	// $('#bookModal').remove();
	var book_name = $('.' + $isbn).first().find('.btw-b-t').text();
	$.ajax({
		url : 'php/functions.php?function=getUser&param=' + $isbn,
		success : function(users){
			users = JSON.parse(users);
			console.log(users);

			$('body').append(`
				<div class="modal hide fade" id="bookModal" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
			 		<div class="modal-dialog" role="document">
			 			<div class="modal-content">
			 				<div class="modal-header" style="padding: 20px;">
			 					<i class="fa fa-times" data-dismiss="modal" style="font-size: 20px; float:right;" aria-hidden="true"></i>
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
								<div class="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 text-center">
									<img src="${url}" class="img-bookUser">
								</div>
								<div class="col-10 col-sm-10 col-md-10 col-lg-10 col-xl-10">
									<p>${user.name}</p>
									<p>rank: ${user.ranking}</p>
									<p style="float:right;">เสร็จแล้ว ${user.percent}</p>
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