name = localStorage.getItem('name');
volunteer_id = localStorage.getItem('volunteer_id');

var searchParams = window.location.search.split('?')[1];

$(document).ready(function() {


	if($('#notice').is(":visible")) {
		$(".icon-mobile").hide();
	}else{
		$(".icon-mobile").show();
	}

	$( window ).resize(function() {
  		
  		if ($( window ).width() > 1199) {
	        $(".icon-mobile").hide();
	        $("#user_img").hide();
	        $("#notice").show();
   			$('#response').show();
   			$('#authenHam').hide();
   			$('#authenDropdown').show();
   			$('#navbarCollapse').show();
	        
	    }else{
	    	$("#user_img").show();
	        $(".icon-mobile").show();
	        $("#notice").hide();
   			$('#response').hide();
   			$('#authenHam').show();
   			$('#authenDropdown').hide();
   			$('#navbarCollapse').hide(); 

	    }
	});
	console.log(volunteer_id);

	$('#btnNoticeOut').click(function(){
		

		window.location = 'notice?notice';

				
	});


	$('#btnResOut').click(function(){
		
		window.location = 'notice?response';
	});
	
	

	 $(function(){
  // mobile menu slide from the right
		$('[data-toggle="slide-collapse"]').on('click', function() {
			
   			$('#navbarCollapse').show();
   			$("#user_img").show();
   			$("#notice").hide();
   			$('#response').hide();
   			$('.overlay').show();
   			$('#authenHam').show();
   			$('#authenDropdown').hide();

   			$('#user_img').html(``);
   			$.ajax({

				url : "php/functions.php?function=getUserInfo&param="+volunteer_id,
				success : function(user){
					
					user = JSON.parse(user);
					console.log(user);
					
					url = user.avatar;
					name = user.name;

					if(!url || url == ""){
						url = 'img/user.png'
					}
					if(!name || name == "" || !volunteer_id ||volunteer_id == "" ){
						name = 'Guest';
					}

					$('#user_img').html(`
	                    
		                    <div class="user-view text-center">

			                    
			                   <img src="${url}"  class="img-menu"><br>
			                    ${name}
			                  
			                 </div>
		                 
					`);
					
					    
					
				}
					
					
			});
    		
    		
 		
 		 });
		$(".overlay").click(function(){
    			$('#navbarCollapse').hide();
    			$('.overlay').hide();
    			$('#user-img').hide();
    			$('#notice').show();
    			$('#response').show();
    			$('#authenHam').hide();
    			$('#authenDropdown').show();
    			$.ajax({

					url : "php/functions.php?function=getUserInfo&param="+volunteer_id,
					success : function(user){

						$('#user_img').html(``);

					}
				});
    	});
			
			
		
	});

	
	$('#btnNotice').click(function(){
		$("#content").html(``);
		$.ajax({

			url : "php/functions.php?function=getAllRequest&param="+volunteer_id,
			success : function(books){
				books = JSON.parse(books);

				var length = Object.keys(books).length;

				var update_books = [];

				$.each(books, function(index, book){

					if(book.is_read == 0) update_books.push({'book_id': book.book_id, 'chapter_id': book.chapter_id});
					
					$('#content').append(`
						<div class="notify" id="booK-${book.book_id}" style="border-bottom: 1px solid darkgrey;">
							<div class="row">
								<div class="col-lg-10 col-xl-10">
									<div class="media" style="padding: 10px 10px;">
					                    <img class="mr-3 img-notice" src="img/book.png">
					                    <div class="media-body" style="padding-left: 30px;">
					                        <h6>${book.book_name}</h6>
					                        <p style="font-size:13px;">คำร้องขอเข้าร่วมบทที่ ${book.chapter_id}</p>
					                    </div>
					                </div>
								</div>
								<div class="col-lg-2 col-xl-2">
									<div id="countBook" class="${book.count}"></div>
								<div>
							</div>
						</div>

					`)

					$('.'+book.count).text(''+book.count)

				});
				
				if(length == 0){
					$('#content').html(`
						<div class="notify col-12 col-sm-12 col-md-12" style="border-bottom: 1px solid darkgrey;">
							<h6 style="color:grey; text-align:center;margin:20px 0px">ยังไม่มีคำร้องขอเข้าร่วม</h6>
						</div>
					`)
				}else{
					$('#contentNotice').fadeToggle('fast', 'linear');

					$.ajax({

                        url : "php/functions.php?function=alertNotiRead&param=" + JSON.stringify({'book': update_books}),
                        success : function(data){
                            $(".countNotice").hide();
                            $(".countNotify").hide();
                        }
                    });

				}

				if(length < 5 && length >= 0){
					$('#content').css({ height: 'auto'})
				}

			}
				
		});
	});
	


    $(document).click(function () {
        $('#contentNotice').hide();

    });


    $('#btnRes').click(function(){
		$("#message").html(``);
		$.ajax({

			url : "php/functions.php?function=queryNoti&param="+volunteer_id,
			success : function(users){
				users = JSON.parse(users);
				console.log(users);
				
				var update_joins = [];
				var length = Object.keys(users).length;

				$.each(users, function(index, user){
					url = user.avatar;
					
					if(user.is_read == 1) update_joins.push({'join_id': user.join_id});

					if(url == ''|| !url){
						url = 'img/user.png'
					}
	
					$('#message').append(`
					
						<div class="Res" style="border-bottom: 1px solid darkgrey;">
							<div class="row">
								<div class="col-lg-8 col-xl-8">
									<div class="media" style="padding: 5px 5px; margin-left: 10px;">
					                    <img class="mr-3 img-noticeUser" src="${url}">
					                    <div class="media-body" style="padding:5px 5px;">
					                        <h6>${user.name}</h6>
					                        <h6>${user.book_name}</h6>
					                        <h6>บทที่ ${user.chapter_id}</h6>
					                    </div>
					                </div>
								</div>
								<div class="col-lg-4 col-xl-4 text-center" style="margin-top:20px; margin-left: -10px;">
									<button class="btn btn-primary btn-sm" id="accept-${user.join_id}">ยืนยัน</button>
									<button class="btn btn-primary btn-sm" id="unaccept-${user.join_id}">ยกเลิก</button>
								</div>
							</div>
						</div>
	
					`)
					
				});
				

				if(length == 0){
					$('#contentRes').html(`
							<h6 style="color:grey; text-align:center;margin:20px 0px">ยังไม่มีคำตอบรับเข้าร่วม</h6>
					`);
				}else{
					$('#contentRes').fadeToggle('fast', 'linear');

					$.ajax({
                        url : "php/functions.php?function=alertNotiRead&param=" + JSON.stringify({'join_id': update_joins}),
                        success : function(data){
                            $('.countRes').hide();
                            $(".countResponse").hide();
                        }
                    });
				}
											
				if( length< 5 && length != 0){
					$('#message')
						.css({ height: 'auto'})
				}

				$("#message").on('click', '.Res', function( e ){
					
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
										alert('ยกเลิกคำขอเข้าร่วมเรียบร้อยแล้วค่ะ');
										location.reload();
									}
								});
								
								
							});
							
						}

				});


			}
				
		});
	});
    
    $(document).click(function () {
        $('#contentRes').hide();
    
    });

	
$('#content').on('click', '.notify', function() {
	book_id = this.id.substring(this.id.indexOf('-') + 1)
			
	window.location = 'createChapter.html?book_id=' + book_id;
});



	
  
});
