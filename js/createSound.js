var selected_value = [];
var arr_paragraphs;
var playlist_link;
var chapter_reader;
volunteer_id = localStorage.getItem('volunteer_id');
name = localStorage.getItem('name');
if(name == null || name == '') {
	window.location.href="index.html";
}

var searchParams = new URLSearchParams(window.location.search.split('?')[1]); //?anything=123
// console.log(searchParams.get("book_id"));
console.log(searchParams.get("book_id"));
var book_Id = searchParams.get("book_id");
console.log(searchParams.get("chapter_id"))
var chapter_Id = searchParams.get("chapter_id");

book = JSON.stringify({
	book_id : book_Id,
	chapter_id : chapter_Id
});

$(document).ready(function(){

	$.ajax({

		url : 'php/functions.php?function=getBookDetail&param=' + book,
		success : function(chapter){
			chapter = JSON.parse(chapter);
			console.log(chapter);

			chapter_reader = chapter.volunteer_id;
			playlist_link = chapter.playlist_link;	
			console.log('chapter_reader ' + chapter_reader);

			var url = chapter.image;
			if(!url){
				url ="img/book.png"
			}

			$("#chapterDetail").html(`
				<div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12" style="padding:20px 10px;">
					
					<div class="row" style="padding: 10px 10px;">
						<div class="col-5 col-sm-5 col-md-5 col-lg-5 col-xl-5 text-center">
		                                            
		                    <img src="${url}" class="img-chapter">
		                                             
		                </div>
		                                        
						<div class="col-7 col-sm-7 col-md-7 col-lg-7 col-xl-7 datail-space">
		                    <h5 style="font-weight:600">ข้อมูลหนังสือ</h5>
		                    <p class="p-detailBook">${chapter.book_name}</p>
		                    <p class="p-detailBook">บทที่ ${chapter.chapter_id}</p>
		                    <p class="p-detailBook">ทั้งหมด ${chapter.video_time} นาที</p>
		                    <p class="text inline" id="paragraphChap" style="font-weigth:600">${chapter.complete}</p>
		                    <label class="switch inline" style="margin-bottom: -6px;margin-left: 10px;">
							  <input type="checkbox"  id="completeChap">
							  <span class="slider round"></span>
							</label>

						</div>
		            </div>
		        </div>
		    `);




			if(chapter.complete == 'ยังไม่เสร็จ'){
				$('p#paragraphChap').removeClass('text-green').addClass('text-red');
				$('input[type="checkbox"]').val('1').prop('checked', false);
				$('#insertSound').prop('disabled',false);
				$('#deleteParagraph').prop('disabled',false);
				$('#edit').prop('disabled',false);
			}

			if(chapter.complete == 'เสร็จแล้ว'){
				$('p#paragraphChap').removeClass('text-red').addClass('text-green');
				$('input[type="checkbox"]').val('0').prop('checked', true);
				$('#insertSound').prop('disabled',true);
				$('#deleteParagraph').prop('disabled',true);
				$('#edit').prop('disabled',true);
			}

			$('#completeChap').click(function(){
				info = JSON.stringify({
					book_id : book_Id,
					chapter_id : chapter_Id,
					complete : $('#completeChap').val()
				});
				console.log(info);



				$.ajax({
					url : 'php/functions.php?function=chapterComplete&param='+ info,
					success : function(data){
						
						console.log(data);
						location.reload();

					}
				});

			});


		}

	});
	

	
	

	

	paragraph();

	
	function paragraph(){
		$.ajax({

			url : 'php/functions.php?function=getReadedParagraph&param=' + book,
			success : function(paragraphs){
				paragraphs = JSON.parse(paragraphs);

				arr_paragraphs = paragraphs;
				var length = Object.keys(paragraphs).length;

				if(length == 0){
					$("#paragraph").html(`
						<div class="col-12 col-sm-12 col-md-12">
							<h5 style="color:#B0B0B0; text-align:center;margin:50% auto;">ยังไม่มีการสร้างเนื้อหาในบทนี้</h5>
						</div>
					`)
					$('#edit').prop('disabled',true);
					$('#deleteParagraph').prop('disabled',true);	
				}else{

					initParagraph(paragraphs);
					$('#edit').prop('disabled',false);
					$('#deleteParagraph').prop('disabled',false);
				}
			}
		});
	}

	$('#deleteParagraph').click(function(){
		$('#deleteParagraph').hide();
		$('#backParagraph').show();
		$('#edit').prop('disabled',true);

		$('.paragraph-detail').removeClass('col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12');
		$('.paragraph-detail').addClass('col-10 col-sm-10 col-md-10 col-lg-10 col-xl-10');

		$('.paragraph').each(function(){
			id = $(this).attr('id');
			console.log('id');
			$('#' + id + ' .row').append(`
				<div class="col-2 col-sm-2 col-md-2 col-lg-2 col-xl-2 text-center delete-container" style="margin-top:20px;">
			        <button class="btn btn-danger btn-sm" id="delete-${id.substring(id.indexOf('-') + 1)}" onclick="deleteParagraph(this)">ลบ</button>
			    </div>
			`);
		});

	});
	

	$('#backParagraph').click(function(){
		$('#deleteParagraph').show();
		$('#backParagraph').hide();
		$('#edit').prop('disabled',false);

		$('.paragraph-detail').removeClass('col-10 col-sm-10 col-md-10 col-lg-10 col-xl-10');
		$('.paragraph-detail').addClass('col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12');
		
		$('.paragraph .row .delete-container').remove();
	});

	$('#edit').click(function(){
		$('#edit').hide();
		$('#cancleEdit').show();
		$('#deleteParagraph').prop('disabled',true);


		$('.paragraph-detail').removeClass('col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12');
		$('.paragraph-detail').addClass('col-11 col-sm-11 col-md-11 col-lg-11 col-xl-11');

		
		$('.paragraph').each(function(){
			
			
			id = $(this).attr('id');
			
			// console.log(id);
			id_isused = $(this).attr('name');
			console.log(id_isused);
			$('#' + id + ' .row').prepend(`
				<div class="col-1 col-sm-1 col-md-1 col-lg-1 col-xl-1 text-center edit-container" style="margin-top:20px;">
			        <input type="radio" class="my-radio" name="${id_isused.substring(0, id_isused.indexOf('-'))}" value="${id.substring(id.indexOf('-') + 1)}" id="${id_isused.substring(id_isused.indexOf('-') + 1)}">
			    </div>
			`);
			$('#paragraph').find(':radio[id=1]').prop('checked', true);
			
		});
		$('#paragraphEdit').html(`
			<div class="chapter col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 text-center" style="margin-top: 0px; ">
                                                
                <button type="button" class="btn btn-primary" onclick="editParagraph()">
                    ยืนยัน
                </button>
        
            </div>
		`)


	});
	$('#cancleEdit').click(function(){
		$('#edit').show();
		$('#cancleEdit').hide();
		$('#deleteParagraph').prop('disabled',false);

		$('.paragraph-detail').removeClass('col-11 col-sm-11 col-md-11 col-lg-11 col-xl-11');
		$('.paragraph-detail').addClass('col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12');
		
		$('.paragraph .row .edit-container').remove();
		$('#paragraphEdit').html(``);
	});

	//pass value to testsound
	$('#createSound').click(function(){
		var paragraph_order = parseInt($('#paragraph_order').val()) - 1;
		flag = 0;
		if(!isUsedParagraph(paragraph_order)) {
			flag = 1; // never have this paragraph before
		}
		window.location = 'testSound.html?book_id=' + book_Id + '&chapter_id=' + chapter_Id + '&paragraph_order=' + paragraph_order + '&flag=' + flag;
	});
	
});

function isUsedParagraph(paragraph_order) {

	for(i = 0; i < arr_paragraphs.length; i++) {

		if(arr_paragraphs[i].paragraph_order == paragraph_order && arr_paragraphs[i].isused_num == "1") {
			return true;
		}

	}

	return false;

}

function initParagraph(paragraphs) {
	$('#paragraph').html(``);
	$.each(paragraphs, function(index, paragraph){
		$('#paragraph').append(`

			<div class="paragraph col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12" id="paragraph-${paragraph.paragraph_id}" name="${paragraph.paragraph_order}-${paragraph.isused_num}" style="border-bottom: 1px solid darkgrey; padding-top: 10px;">
				<div class="row" id="${paragraph.video_link}">
					<div class="paragraph-detail col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12">
                        <p class="p-detailBook inline" >เสียงที่ ${parseInt(paragraph.paragraph_order) + 1}</p>
                        <p class="p-grey inline" style="float: right;"> ${paragraph.video_time} </p>
                        <br>
                        <a id="${paragraph.paragraph_order}-${paragraph.video_link}" href="#" onclick="play(this)">
                        	<i class="fa fa-play inline" aria-hidden="true" style="color:grey;"></i>
                        	<p class="p-grey inline">เล่นทั้งหมด</p>
                        </a>
                       
                        <p class="inline" id="paragraphComplete-${paragraph.paragraph_id}" style="float: right;">${paragraph.isused}</p>
                    </div>
                </div>
            </div>

		`);
		if(paragraph.isused == "เสี่ยงที่เลือก"){
			$('#paragraphComplete-' + paragraph.paragraph_id).addClass('text-green');
		}else{
			$('#paragraphComplete-' + paragraph.paragraph_id).addClass('text-red');
		}

	});
}

function deleteParagraph(e) {
	var id = $(e).attr('id');
	var paragraphId = id.substring(id.indexOf('-') + 1);

	$('#deleteModal').remove();

	$('#paragraph-' + paragraphId).append(`
		<div class="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
			<div class="modal-dialog" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<i class="fa fa-times" data-dismiss="modal" style="font-size: 20px; float:right;" aria-hidden="true"></i>
						
						
					</div>
					<div class="modal-body text-center">
						
							<button class="btn btn-danger" id="submitDeleteAll" data-dismiss="modal">ลบ</button>
							<button class="btn btn-default" data-dismiss="modal">ยกเลิก</button>
						</div>
					</div>
				
				</div>
			</div>
		</div>
	`);

	$('#deleteModal').modal('show');

	$('#submitDeleteAll').click(function() {
		video_link = $('#paragraph-' + paragraphId + ' .row').attr('id');
		deleteData(paragraphId, video_link);
	});

	
}
function deleteData(paragraphId, video_link) {
	data = JSON.stringify({
		book_id : book_Id,
		chapter_id : chapter_Id,
		paragraph_id : paragraphId
	});	

	console.log('volunteer_id chapter_reader ' + volunteer_id + ' ' + chapter_reader);

	if(volunteer_id == chapter_reader) {

		deleteVideoFromPlaylist(playlist_link, video_link, arr_paragraphs.length);

		buildApiRequest('DELETE',
		                '/youtube/v3/videos',
		                {'id': video_link,
		                 'onBehalfOfContentOwner': ''});

		console.log(data);
		$.ajax({
			url : 'php/functions.php?function=deleteParagraph&param=' + data,
			success : function(data){
				$('#deleteModal').on('hidden.bs.modal', function (e) {
				  	$('#paragraph-' + paragraphId).remove();
				  	console.log('delete');
				});
			}
		});
	}

}

function editParagraph(){

	selected_value = [];
	$("input:checked").each(function(){
		selected_value.push($(this).val());
	});

	arr_edit = new Array();
	$.each(arr_paragraphs, function(index, paragraph) {

		inArray = $.inArray(paragraph.paragraph_id, selected_value);
		isused = (inArray > -1)? "1": "0";
		if(paragraph.isused_num != isused) {
			console.log('edit ' + paragraph.paragraph_id + ' ' + paragraph.paragraph_order);
			if(paragraph.isused_num == "1") { // isused = 0
				// delete from playlist
				deleteVideoFromPlaylist(playlist_link, paragraph.video_link, arr_paragraphs);

			} else { // isused = 1
				// add to playlist
				buildApiRequest('POST',
			                '/youtube/v3/playlistItems',
			                {'part': 'snippet',
			                 'onBehalfOfContentOwner': ''},
			                {'snippet.playlistId': playlist_link,
			                 'snippet.resourceId.kind': 'youtube#video',
			                 'snippet.resourceId.videoId': paragraph.video_link,
			                 'snippet.position': ''
				});
			}

			arr_edit.push({
 				book_id : book_Id,
 				chapter_id : chapter_Id,
 				paragraph_id : paragraph.paragraph_id,
 				paragraph_order : paragraph.paragraph_order,
 				isused : isused
 			});

 			arr_paragraphs[index].isused_num = isused;
 			arr_paragraphs[index].isused = (isused == "0")? "เสียงที่ไม่ถูกเลือก": "เสี่ยงที่เลือก";
		}
		
	});

	if(arr_edit.length > 0) {
		$.ajax({
			url : 'php/functions.php?function=updateIsused&param='+ JSON.stringify(arr_edit),
			success : function(data){
				$('#cancleEdit').click();
				initParagraph(arr_paragraphs);
			}
		});
	}

}

function play(e) {
	var id = $(e).attr('id');
	var dat = id.indexOf('-');
	var order = id.substring(0, dat);
	var link = id.substring(dat + 1);

	$('#playModal').remove();
	createModal(order, link);
} 

function createModal(order, link) {

	$('#paragraph').append(`
			<div class="modal hide fade" id="playModal" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
		 		<div class="modal-dialog" role="document">
		 			<div class="modal-content">
		 				<div class="modal-header">
		 					<i class="fa fa-times" data-dismiss="modal" style="font-size: 20px; float:right;" aria-hidden="true"></i>
		 					<h5>เสียงที่ ${(parseInt(order) + 1)}</h5>
							
		 				</div>
		 				<div class="modal-body">
		 					 <iframe id="ytplayer" 
		 					 	type="text/html" 
						        width="100%" 
						        height="45" 
						        src="http://www.youtube.com/embed/${link}?autoplay=1&autohide=0&playsinline=1&rel=0&showinfo=0&fs=0&modestbranding=1"
						        frameborder="0"/>
		 				</div>
					
		 			</div>
		 		</div>
		 	</div>`);

	$('#playModal').modal('show');

	$('#playModal').on('hidden.bs.modal', function (e) {
	  	$('#playModal').remove();
	});
}
