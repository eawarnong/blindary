
var searchParams = window.location.search.split('?')[1];
console.log(searchParams);
name = localStorage.getItem('name');
	if(name == null || name == '') {
		window.location.href="index.html";
	}
volunteer_id = localStorage.getItem('volunteer_id');
$(document).ready(function(){

	$( window ).resize(function() {
  		
  		if ($( window ).width() > 1199){
  			window.location.href="index.html";
  		} 
  	});

	var word = ''+searchParams;

	if(word == 'notice'){
		$('#contentNoti').html(``);

		$.ajax({
			url :"php/functions.php?function=getAllRequest&param=" +volunteer_id,
			success : function(books){
				books = JSON.parse(books);
				console.log(books);

				var length = Object.keys(books).length;

				if(length == 0){
					$('#contentNoti').html(`
						<div class="notify col-12 col-sm-12 col-md-12" >
							<h6 style="color:grey; text-align:center;margin-top:40%">ยังไม่มีคำร้องขอเข้าร่วม</h6>
						</div>
					`)
					$('.bgNoti').css({height:'600px'});
				}else if(length <= 3){
					$('.bgNoti').css({height:'600px'});
				}else{

					$.each(books, function(index, book){
						
						$('#contentNoti').append(`
							<div class="notify col-12 col-sm-12 col-md-12" id="booK-${book.book_id}" style="border-bottom: 1px solid darkgrey; padding:0px 50px;">
								<div class="row">
									<div class="col-10 col-sm-10 col-md-10">
										<div class="media" style="padding: 10px 10px;">
						                    <img class="mr-3 img-chapter2" src="img/book.png">
						                    <div class="media-body" style="padding-left: 30px;">
						                        <h6>${book.book_name}</h6>
						                        <p style="font-size:13px;">คำร้องขอเข้าร่วมบทที่ ${book.chapter_id}</p>
						                    </div>
						                </div>
									</div>
									<div class="col-2 col-sm-2 col-md-2 text-center">
										<div id="countBook" class="${book.count}" style="right: 20px;top: 20%;font-size: 15px;padding: 2px 10px;"></div>
									<div>
								</div>
							</div>

						`)

						$('.'+book.count)
							 
					         .text(''+book.count)
					});

					$('.bgNoti').css({height:'auto'});
				}
				

			}
		});
		$('#contentNoti').on('click', '.notify', function() {
			book_id = this.id.substring(this.id.indexOf('-') + 1)
			
			window.location = 'createChapter.html?book_id=' + book_id;
		});

	   
	}

	if(word == 'response'){
		$('#contentNoti').html(``);

		$.ajax({

			url : "php/functions.php?function=queryNoti&param="+volunteer_id,
			success : function(users){
				users = JSON.parse(users);
				console.log(users);
				

				var length = Object.keys(users).length;

				if(length == 0){
					$('#contentNoti').html(`
						<div class="notify col-12 col-sm-12 col-md-12">
							<h6 style="color:grey; text-align:center;margin-top:40%">ยังไม่มีการตอบรับจากเจ้าของหนังสือ</h6>
						</div>
					`)
					$('.bgNoti').css({height:'600px'});
				}else{
					$.each(users, function(index, user){
							url = user.avatar;
							// chapter_ids.push(user.chapter_id);
							if(url == ''|| !url){
								url = 'img/user.png'
							}

								
							$('#contentNoti').append(`
							
								<div class="Res col-12 col-sm-12 col-md-12" style="border-bottom: 1px solid darkgrey;">
									<div class="row">
										<div class="col-8 col-sm-8 col-md-8">
											<div class="media" style="padding: 5px 5px;">
							                    <img class="mr-3 img-noticeUser" src="${url}">
							                    <div class="media-body" style="padding:5px 5px;">
							                        <h6 style="font-weight:600;">${user.name}</h6>
							                        <h6>หนังสือ: ${user.book_name}</h6>
							                        <h6>บทที่ ${user.chapter_id}</h6>
							                    </div>
							                </div>
										</div>
										<div class="col-4 col-sm-4 col-md-4" style="margin-top:20px;">
											<button class="btn btn-primary btn-sm inline" style="margin:5px 5px;" id="accept-${user.join_id}">ยืนยัน</button>
											<button class="btn btn-primary btn-sm inline" style="margin:5px 5px;" id="unaccept-${user.join_id}">ยกเลิก</button>
										</div>
									</div>
								</div>
			
							`)
						
					});
				}
				if(length <= 3) $('.bgNoti').css({height:'600px'});
				

				
			

					

							

				$("#contentNoti").on('click', '.Res', function( e ){
					
					var btn_id = e.target.id;
					console.log('accept ' + e.target.id); 
					btn = '#' + btn_id;
					console.log(btn);
					// get index of -
					var datIndex = btn_id.indexOf('-'); 

					// get only number after accept- or unaccept-
					join_ID = btn_id.substring(datIndex + 1);

					var check = 'accept-'+join_ID;

						if(btn_id == check){
							
							createPlaylist(2, join_ID);	
						
						}else{
							$("#"+btn_id).ready(function(){
								$.ajax({
									url : 'php/functions.php?function=deleteJoin&param='+join_ID,
									success : function(data){
										alert(data);
										location.reload();
									}
								});
								
								
							});
							
						}

				});


			}
				
		});
	}

});

		
