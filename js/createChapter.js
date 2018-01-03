// var chapter_ids = new Array();
// var bookID;
// var joinID = new Array();
// var chapter_Id = new Array();
var book_owner;
var chap_owners = [];
name = localStorage.getItem('name');
if(name == null || name == '') {
	window.location.href="index.html";
}

volunteer_id = localStorage.getItem('volunteer_id');

var searchParams = new URLSearchParams(window.location.search.split('?')[1]); //?anything=123

bookID = searchParams.get("book_id");
console.log(bookID);

book_ID = JSON.stringify({
		book_id : bookID
});


// console.log(window.location.href);
// console.log("window " + window.location.search.split('?')[1]);

join_volunteer = JSON.stringify({
	book_id : bookID,
	requester_id : volunteer_id
});


$(document).ready(function(){

	
	bookDetail();


	$("#backChap").click(function(){
		$('#deleteChap').show();
		$("#backChap").hide();

		$('.chapter-detail').removeClass('col-10 col-sm-10 col-md-10 col-lg-10 col-xl-10');
		$('.chapter-detail').addClass('col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12');

		$('.chapter .row .delete-container').remove();
		$('.chapter').addClass('default');
	});

	$('#deleteChap').click(function(){
		$("#deleteChap").hide();
		$("#backChap").show();

		$('.chapter-detail').removeClass('col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12');
		$('.chapter-detail').addClass('col-10 col-sm-10 col-md-10 col-lg-10 col-xl-10');

		$('.chapter').removeClass('default');

		$('.chapter').each(function() {
			id = $(this).attr('id');
			row_id = $('#' + id + ' .row').attr('id');
			chap_owner = row_id.substring(0, row_id.indexOf('-'));

			if(volunteer_id == book_owner || volunteer_id == chap_owner) {
				$('#' + id + ' .row').append(`
					<div class="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 text-center delete-container" style="margin-top:20px;">
				        <button class="btn btn-danger btn-sm" id="delete-${id.substring(id.indexOf('-') + 1)}" onclick="deleteChapter(this)">ลบ</button>
				    </div>
				`);
			}
		});

	});

	// });
	feedback = JSON.stringify({
		book_id : bookID
	});

	$.ajax({

		url : 'php/functions.php?function=getRating&param=' + feedback,
		success : function(comments){
			comments = JSON.parse(comments);
			console.log(comments);

			var length = Object.keys(comments).length;

			$('#comment').html(``);

			if(length == 0){
				$("#comment").html(`
					<div class="notify col-12 col-sm-12 col-md-12">
						<h5 style="color:#B0B0B0; text-align:center;margin:50% auto;">ยังไม่มีความคิดเห็น</h5>
					</div>
				`)
			}else{
				var numStar = 0;
				var position = 0
				$.each(comments, function(index, comment){

					numStar = comment.rating;
					position = index;

					$('#comment').append(`
						<div class = "comment col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12" style="border-bottom: 1px solid darkgrey; padding-top: 10px;">
							<p class="p-detailBook inline" id="comment-${position}" style="padding-right:20px;">${comment.name}</p>
							<br>
							<p class="p-grey inline">${comment.comment}</p>
						</div>
					`);

					for(i = 0; i < numStar; i++) {
						$('#comment-' + position).append(`
							<i class="fa fa-star inline" aria-hidden="true" style="color:yellow;""></i>
						`)
					}

					
				});	
			}

			
		}
	});
 
	////////// อนุญาตให้คนที่เป้นเจ้าของบทเท่านั้นที่จะเข้าไปดูเนื้อหาข้างใน/////////////////
	$('#chapters').on('click', '.default', function(){
		var chapter_id = this.id.substring(this.id.indexOf('-')+1);
		console.log('createSound.html?book_id=' + bookID + '?chapter_id=' + chapter_id);

		$.ajax({

			url : 'php/functions.php?function=getReadedChapter&param=' + bookID,
			success : function(chapters){
				chapters = JSON.parse(chapters);

				$.each(chapters, function(index, chapter){
					if(chapter_id == chapter.chapter_id){
						if(volunteer_id == book_owner || volunteer_id == chapter.volunteer_id){
							// if(volunteer_id == book_owner || $.inArray(volunteer_id, chap_owners) != -1)
							window.location = 'createSound.html?book_id=' + bookID + '&chapter_id=' + chapter_id;
						}
					}
				});
			}
		});
	});
	

});



function bookDetail() {
	$.ajax({

		url : 'php/functions.php?function=getBookDetail&param='+book_ID ,
		success : function(books){

			books = JSON.parse(books);
			console.log(books);
			book_owner = books.volunteer_id;
			console.log(book_owner);
			url = books.image;

			if(!url || url == ''){
				url = 'img/book.png';
			}		

			$("#bookDetail").html(`
				<div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12" style="padding:20px 10px;">
					<div class="row" style="margin: 10px 10px;">
						<div class="col-5 col-sm-5 col-md-5 col-lg-5 col-xl-5 text-center">

	                        <img src="${url}" class="img-chapter">
	                        <p class="p-detailBook p-red">เสร็จแล้ว ${books.percent_finish}</p>
	                        <i class="fa fa-star inline" aria-hidden="true"></i>
	                        <p class="inline p-detailBook p-grey">${books.rating}</p>
	                        <br>
	                            
	                        <i class="fa fa-user inline user-icon" aria-hidden="true"></i>
	                        <p class="inline p-detailBook p-grey"> ${books.listening_times} คน </p>    

	                    </div>
	                        
	                        
	                    <div class="col-7 col-sm-7 col-md-7 col-lg-7 col-xl-7">
	                        
	                        <h5>ข้อมูลหนังสือ</h5>
	                        <p class="p-detailBook">${books.book_name}</p>
	                        <p class="inline p-detailBook">${books.category}</p>
	                        <p class="inline p-detailBook">จำนวนบท: ${books.no_of_chapter}</p>
	                        <p class="p-detailBook">สำนักพิมพ์: ${books.publish}</p>
	                        <p class="p-detailBook">ผู้แต่ง: ${books.author}</p>
	                        <p class="p-detailBook">ผู้แปล: ${books.translator}</p>
	                        <p class="p-detailBook">ISBN: ${books.ISBN}</p>

	                    </div>
	                </div>
                </div>
			`)

			if(volunteer_id == book_owner){
				$(".joinNav").show();
				// $(".chapDelete").show();

				$("#createChapterOwn").html(`
					<div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 text-center">
                               
                        <button class="button addChap" data-toggle="modal" data-target="#createChapter" style="margin-top: -25px;">
                            <span>+ เพิ่มบทใหม่</span>
                        </button>

                        <div class="modal fade" id="createChapter" tabindex="-1" role="dialog" aria-labelledby="modalLabelSmall" aria-hidden="true">
							<div class="modal-dialog modal-sm">
								<div class="modal-content">

									<div class="modal-header">
										<i class="fa fa-times" data-dismiss="modal" style="font-size: 20px; float:right;" aria-hidden="true"></i>

										<h5 class="modal-title" id="modalLabelSmall">เพิ่มบท</h5>

									</div>

									<div class="modal-body">
										<div style="padding-bottom:20px;">
										
										<h6 class="inline textChapSelect">บทที่ต้องการสร้าง</h6>
										<select class="custom-select form-control input-normal inline" id="chapterID"  name="categoryID" style="width:60px"></select>
										</div>
										<div>
										<button class="btn btn-primary" id="submit" data-toggle="modal" data-target="#accept">ยืนยัน</button>
											
												
										<button class="btn btn-primary" id="cancle" data-dismiss="modal">ยกเลิก</button>
										</div>
									</div>

								</div>
							</div>
						</div>
						<div id="accept" class="modal" tabindex="-1" role="dialog" aria-labelledby="modalLabelSmall" aria-hidden="true"></div>



                    </div>
				`)
				
				

				$('#submit').click(function(){
					checkJoin = JSON.stringify({
						book_id : bookID,
						chapter_id : $('#chapterID').val()
					});
					console.log(checkJoin);
					$.ajax({
						url : 'php/functions.php?function=checkJoin&param=' + checkJoin,
						success : function(data){
							
							data = JSON.parse(data);
							// console.log(data);
							if(data == 'true'){
								$('#createChapter').modal('hide');
								$('#accept').modal('show');
								$('#accept').html(`
									<div class="modal-dialog modal-sm">
										<div class="modal-content">

											<div class="modal-header">
												<i class="fa fa-times" data-dismiss="modal" style="font-size: 20px; float:right;" aria-hidden="true"></i>

												<h5 class="modal-title" id="modalLabelSmall">มีคำร้องขอเข้าร่วม</h5>

											</div>

											<div class="modal-body">
												
												<button class="btn btn-primary" id="viewJoin" data-dismiss="modal" style="padding: 2px 2px;">ดูคำร้องขอเข้าร่วม</button>
													
												<button class="btn btn-primary" id="createSubmit" style="padding: 2px 2px;">ยืนยันการสร้าง</button>
												
											</div>

										</div>
									</div>
								`)
								$('#closeJoin').click(function(){
									$('#accept').html(``);
									$('#createChapter').modal('show');
								});
								$('#createSubmit').click(function(){
									createPlaylist(1, volunteer_id, bookID, $('#chapterID').val());
								});

								// $('#viewJoin').click(function(){
								// 	$('a[href="#manageBook"]').removeClass('active').removeAttr('aria-expanded');
								// 	 $('a[href="#chapter_join"]').addClass('active').attr('aria-expanded','true');
								// });
								
							}else{

								createPlaylist(1, volunteer_id, bookID, $('#chapterID').val());

							}
						}
					});
				});

				$('.addChap').click(function(){
					$.ajax({
						url : 'php/functions.php?function=getChapterOfOwner&param=' + bookID,
						success : function(chapters){
							chapters = JSON.parse(chapters);
							// console.log('ownerChap' + chapters);

							$('#chapterID').html(``);
							var length = Object.keys(chapters).length;
							if(length == 0){
								$('.textChapSelect').text('ไม่มีบทที่ท่านสามารถสร้างได้');
								$('#chapterID').hide();
								$('#submit').hide();
								$('#cancle').hide();

							}else{
								$('#chapterID').show();
								$('#submit').show();
								$('#cancle').show();
								$.each(chapters, function(index, chapter){
									$("#chapterID").append(`
										<option value="${chapter}">${chapter}</option>
									`);
								});
							}
							
							
						}	
					});
				});
					
			}else{

				$("#joinChap").html(`
					<div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 text-center">
                               
                        <button class="button addChapJoin" data-toggle="modal" data-target="#joined" style="margin-top: -25px;">
                            <span>+ เข้าร่วม</span>
                        </button>

                        <div class="modal fade" id="joined" tabindex="-1" role="dialog" aria-labelledby="modalLabelSmall" aria-hidden="true">
							<div class="modal-dialog modal-sm">
								<div class="modal-content">

									<div class="modal-header">
										<i class="fa fa-times" data-dismiss="modal" style="font-size: 20px; float:right;" aria-hidden="true"></i>
										<h5 class="modal-title" id="modalLabelSmall">คำขอร้องเข้าร่วม</h5>
								
									</div>

									<div class="modal-body">

										<div style="padding-bottom:20px;">
										
										<h6 class="inline textChapSelect">บทที่ต้องการเข้าร่วม </h6>
										<select class="custom-select form-control input-normal inline" id="chapterID"  name="categoryID" style="width:60px"></select>
										</div>
										<div>
										<button class="btn btn-primary" id="submitJoin" data-dismiss="modal">ยืนยัน</button>

												
												
										<button class="btn btn-primary" id="cancleJoin" data-dismiss="modal">ยกเลิก</button>
										</div>

									</div>
									

								</div>
							</div>
						</div>

                    </div>

                    
				`)

				$('.addChapJoin').click(function(){
					$.ajax({
						url : 'php/functions.php?function=getJoinChapter&param=' + join_volunteer,
						success : function(chapters){
							chapters = JSON.parse(chapters);
							console.log(chapters);

							$('#chapterID').html('');
							var length = Object.keys(chapters).length;
							if(length == 0){
								$('.textChapSelect').text('ไม่มีบทที่ท่านสามารถสร้างได้');
								$('#chapterID').hide();
								$('#submitJoin').hide();
								$('#cancleJoin').hide();

							}else{
								$('#chapterID').show();
								$('#submitJoin').show();
								$('#cancleJoin').show();
								$.each(chapters, function(index, chapter){
									$("#chapterID").append(`
										<option value="${chapter}">${chapter}</option>
									`);
								});
							}
							
						}	
					});
				});
				
				
				
				$('#submitJoin').click(function(){
					join_chapter = JSON.stringify({
						requester_id : volunteer_id,
						owner_id : books.volunteer_id,
						book_id : books.book_id,
						chapter_id : $('#chapterID').val()
					});
					console.log(join_chapter);
					$.ajax({
						url : 'php/functions.php?function=insertRequest&param='+join_chapter,
						success : function(data){
							
						}
					});
				});
				
			}

			if(volunteer_id != book_owner){
				$("li.joinNav").hide();
			}else{
				$.ajax({
					url : "php/functions.php?function=getBookRequest&param="+bookID,
					success : function(joins){
						joins = JSON.parse(joins);
						console.log(joins);

						var x = 0;
						var checkChap = 0;
						var join = 0;
						var prevChap = 0;
						wait_id = 0;

						var length = Object.keys(joins).length;

						$('#bookJoin').html(``);

						if(length == 0){
							$("#bookJoin").html(`
								<div class="notify col-12 col-sm-12 col-md-12">
									<h5 style="color:#B0B0B0; text-align:center;margin:50% auto;">ยังไม่มีคำร้องขอเข้าร่วม</h5>
								</div>
							`)
						}else{
						
						
							$.each(joins, function(index, join){

								url = join.avatar;
								x = join.chapter_id;
								
								// if(prevChap == 0) { prevChap = x; }
								if(prevChap != x && wait_id != 0) {
									console.log('prevChap x ' + prevChap + ' ' + x);
									// $('#show-' + prevChap + ' button[name="accept"]').prop("disabled", true);
									// $('#show-' + prevChap + ' button[name="unaccept"]').prop("disabled", true);
									// $('#show-' + prevChap + ' #unaccept-' + wait_id).prop("disabled", false);

									$('#show-' + prevChap).children().find('.btn').prop("disabled", true);
									// $('#'+btn_id).html($('#'+btn_id).html().replace('ยอมรับ','รอการตอบรับ'));
									$('#unaccept-' + wait_id).prop("disabled", false);
									
									prevChap = x;
									wait_id = 0;
								}

								// console.log('x chapterid ' + x + ' ' + join.chapter_id);
								
								if(x == join.chapter_id){
									
									if(checkChap != join.chapter_id){
										
										checkChap = join.chapter_id;

										
										$("#bookJoin").append(`
											<div class="chap" id="chap-${join.chapter_id}" role="tablist" aria-multiselectable="true" style="padding-top:10px;">

												<div class="card" style=" border: none;box-shadow:2px 2px 5px lightgray" >
													<div class="card-header" role="tab" id="questionOne" data-toggle="collapse" data-parent="#faq" data-target="#card-${join.chapter_id}" aria-expanded="true" style="background: #f7f7f9;box-shadow: 2px 2px 2px lightgrey;">
														<h5 class="card-title inline" >
															บทที่ ${join.chapter_id}
														</h5>
														<i class="fa fa-chevron-down inline" aria-hidden="true" style="float:right;"></i>
														
													</div>
														<div id="card-${join.chapter_id}" class="collapse show" role="tabcard" aria-labelledby="questionOne">
															<div class="card-body">
																<div id="show-${join.chapter_id}"></div>
															</div>
														</div>
														
													
												</div>
											</div>
										`)
									}

									if( x == join.chapter_id){

										if(!url){
											url = "img/user.png";
										}
											
										$("#show-"+join.chapter_id).append(`
										
											<div class="col-12 col-sm-12 col-md-12 col-lg-12 col-lg-12 join" id="user-${join.join_id}" style="border-bottom: 1px solid darkgrey; padding-top: 10px;,">
												<div class="row">
													<div class="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 ">
														<div class="media" style="padding: 2px 2px;">
										                    <img class="mr-3 img-noticeUser" src="${url}">
										                    <div class="media-body" style="padding-left: 3px;">
										                        <h6>${join.name}</h6>
										                        <p style="font-size:13px;">${join.rank}</p>
										                    </div>
										                </div>
													</div>
													<div class="col-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 text-center " style="padding-top: 10px;">
														<button name="accept" class="btn btn-primary inline" id="accept-${join.join_id}" style="padding: 2px 2px;"></button>
														<button name="unaccept" class="btn btn-primary inline" id="unaccept-${join.join_id}" style="padding: 2px 2px;">ลบคำขอ</button>
													</div>
												</div>
											</div>

										`)
						
									} 
									
								}

								if(join.is_accept == 1){
									$('#accept-'+join.join_id).html($('#accept-'+join.join_id).html().replace('','รอการตอบรับ')).prop("disabled", true);
									wait_id = join.join_id;
									prevChap = join.chapter_id;
									console.log('is_accept = 1, wait_id ' + wait_id);
								}
								else if(join.is_accept == 0){
									$('#accept-'+join.join_id).text('ยอมรับ');
								}
								else{
									$('#chap-'+ join.chapter_id).hide();
								}

							});
						}


						
						// $("#bookJoin").on('click', '.chap', function(){
						// 	var chapID = this.id.substring(this.id.indexOf('-')+1);
						// 	console.log('chap' + chapID);

						// 	$.ajax({
						// 		url : "php/functions.php?function=getBookRequest&param="+bookID,
						// 		success : function(joins){
						// 			joins = JSON.parse(joins);
						// 			console.log(joins);

						// 			var chap = 0;
						// 			$.each(joins, function(index, join){
										
										
						// 					if(chapID == join.chapter_id){
						// 						chap = join.chapter_id;

												
						// 							if(join.is_accept == 1){
						// 								$('#accept-'+join.join_id).html($('#accept-'+join.join_id).html().replace('ยอมรับ','รอการตอบรับ')).prop("disabled", true);
						// 							}
						// 							else if(join.is_accept == 0){
						// 								$('#accept-'+join.join_id).prop("disabled", true);
						// 								$('#unaccept-'+join.join_id).prop("disabled", true);
						// 							}
						// 							else{
						// 								$('#' + join.join_id).hide();
						// 							}
												
						// 					}
									

						// 			});
						// 		}
						// 	});

						// });
					}
				});


				$("#bookJoin").on('click', '.join', function( e ){

						// e.targer.id = get id of clicked button e.g. accept-13, unaccept-13
						// e is event
						var btn_id = e.target.id;
						console.log('accept ' + e.target.id); 
						btn = '#' + btn_id;
						console.log(btn);
						// get index of -
						var datIndex = btn_id.indexOf('-'); 

						// get only number after accept- or unaccept-
						join_ID = btn_id.substring(datIndex + 1);

						console.log('id ' + join_ID);
						var check = 'accept-'+join_ID;

						if(btn_id == check){
							
							$.ajax({
								url : 'php/functions.php?function=acceptJoin&param='+join_ID,
								success : function(data){
									
									var parent = $('#user-' + join_ID).parent().attr('id');

									$('#' + parent).children().find('.btn').prop("disabled", true);
									$('#'+btn_id).html($('#'+btn_id).html().replace('ยอมรับ','รอการตอบรับ'));
									$('#unaccept-' + join_ID).prop("disabled", false);
										
								}
							});

						}else{
							
								$.ajax({
									url : 'php/functions.php?function=deleteJoin&param='+join_ID,
									success : function(data){
										alert(data);
									}
								});
							
						}

						
				});
			}

			chapterDetail();
		}

	});
}

function chapterDetail(){
	$('#chapters').html(``);
	$.ajax({

		url : 'php/functions.php?function=getReadedChapter&param=' + bookID,
		success : function(chapters){
			chapters = JSON.parse(chapters);
			console.log(chapters);

			var length = Object.keys(chapters).length;

			$('#chapters').html(``);

			if(length == 0){
				$("#chapters").html(`
					<div class="notify col-12 col-sm-12 col-md-12">
						<h5 style="color:#B0B0B0; text-align:center;margin:50% auto;">ยังไม่มีการสร้างบท</h5>
					</div>
				`)
			}else{
				$.each(chapters, function(index, chapter){

					if($.inArray(chapter.volunteer_id, chap_owners) == -1) {
						chap_owners.push(chapter.volunteer_id);
					}

				// chapter_ids.push(chapter.chapter_id);

					$('#chapters').append(`
						
						<div class="chapter default col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 " id="chapterid-${chapter.chapter_id}" style="border-bottom: 1px solid darkgrey; padding-top: 10px;">
	                        <div class="row" id="${chapter.volunteer_id}-${chapter.playlist_link}">
		                        <div class="chapter-detail col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
		                        	<div>
			                        <p class="p-detailBook inline">บทที่ ${chapter.chapter_id}</p>
			                        <p class="p-grey inline" style="float: right;"> ${chapter.name}</p>
			                        </div>
			                        <div style="display:inline">
			                        <i class="fa fa-user inline user-icon" aria-hidden="true"></i>
			                        <p class="p-grey inline"> ${chapter.listening_times} คน </p>
			                        <p class="p-grey inline" style="padding-left:20px;"> time : ${chapter.video_time} </p>
			                        <p class="inline" id="chapter-${chapter.chapter_id}" style="float:right;" >${chapter.complete}</p>
			                    	</div>
			                    </div>
	                        </div>
	                    </div>

					`)
					
					if(chapter.complete == "เสร็จแล้ว"){
						$('#chapter-' + chapter.chapter_id).addClass('text-green');
					}else{
						$('#chapter-' + chapter.chapter_id).addClass('text-red');
					}
				});

			}
			
			if(volunteer_id == book_owner || $.inArray(volunteer_id, chap_owners) != -1) {
				$(".chapDelete").show();
			} else {
				$(".chapDelete").hide();
			}

		}

	});

}

function deleteChapter(e) {
	var id = $(e).attr('id');
	var chapterId = id.substring(id.indexOf('-') + 1);

	$('#deleteModal').remove();

	$('#chapterid-' + chapterId).append(`
		<div class="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
			<div class="modal-dialog" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<i class="fa fa-times" data-dismiss="modal" style="font-size: 20px; float:right;" aria-hidden="true"></i>
						<h5>บทที่ ${chapterId}</h5>
						
					</div>
					<div class="modal-body text-center">
						<div style="margin-bottom:10px;">
							<h6 class="inline">ต้องการลบบทที่ ${chapterId}  ใช่หรือไม่</h6>
						</div>
							<button class="btn btn-danger" id="submitDelete" data-dismiss="modal">ยืนยัน</button>
							<button class="btn btn-default" data-dismiss="modal">ยกเลิก</button>
						
					</div>
				
				</div>
			</div>
		</div>
	`);

	$('#deleteModal').modal('show');

	$('#submitDelete').click(function() {
		rowId = $('#chapterid-' + chapterId + ' .row').attr('id');
		dat = rowId.indexOf('-');
		vol_id = rowId.substring(0, dat);
		playlist_link = rowId.substring(dat + 1);
		deleteData(chapterId, vol_id, playlist_link);
	});

	
}

function deleteData(chapterId, vol_id, playlist_link) {
	data = JSON.stringify({
		book_id : bookID,
		chapter_id : chapterId
	});

	if(volunteer_id == vol_id) {
		console.log('playlist_link ' + playlist_link);
		buildApiRequest('DELETE',
		                '/youtube/v3/playlists',
		                {'id': playlist_link,
		                 'onBehalfOfContentOwner': ''});
	}	

	$.ajax({
		url : 'php/functions.php?function=delChapter&param=' + data,
		success : function(data){
			$('#deleteModal').on('hidden.bs.modal', function (e) {
			  	$('#chapterid-' + chapterId).remove();
			  	console.log('delete');
			});
		}
	});

}
