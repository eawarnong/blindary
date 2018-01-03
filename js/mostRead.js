$(document).ready(function(){

	$.ajax({

		url : 'php/functions.php?function=mostReadBook',
		success : function(books){
			books = JSON.parse(books);
			console.log(books);

			var length = Object.keys(books).length;
			var pageTotal= (length/18)+1;
			var currentPage = 1;
			var dataPrev = 0;
			var dataNext = 20;

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

							$.each(books, function(index,book){
								translator = book.translator;
								url = book.image;
								if(index < dataNext){
									if(index >= dataPrev){
										if(!url || url == ''){
											url = 'img/book.png';
										}
										if(!translator){
											translator = '-';
										}

										$('.content').append(`
											
											<div class="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-3 text-center blank">
							                    <div>
							                    <a href="#" data-toggle="modal" data-target="#${book.ISBN}">
						                            <img src="${url}" alt="${book.book_name}" class="img-book">
						                        </a>
						                        </div>
							                    <div class="btw-b-t">${book.book_name}</div>
							                   
							                </div>
							                
							                <div class="modal fade" id="${book.ISBN}" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
												<div class="modal-dialog" role="document">
													<div class="modal-content">
														<div class="modal-header" style="float:right;">
															<button type="button" class="close" data-dismiss="modal" aria-label="Close">
																<span aria-hidden="true">&times;</span>
															</button>
															
														</div>
														<div class="modal-body">
															<div class="row">
																<div class="col-12 col-sm-12 col-md-5 col-lg-5 col-xl-5 text-center">
																	<img src="${url}" alt="${book.book_name}" class="img-book">
																</div>
																<div class="col-12 col-sm-12 col-md-7 col-lg-7 col-xl-7 ">
																	<h6>${book.book_name}</h6>
																	<p>ISBN : ${book.ISBN}</p>
																	<p>สำนักพิมพ์ : ${book.publish}</p>
																	<p>ผู้แต่ง : ${book.author}</p>
																	<p>ผู้แปล : ${translator}</p>

																</div>
															</div>
														</div>
													
													</div>
												</div>
											</div>

										`)

									}
								
								}else{
									return false;
								}
							});
							


						}

					}
				
				

			});
			if(currentPage == 1){
				$.each(books, function(index,book){

					translator = book.translator;
					url = book.image;
					if(index <= 19){
						if(!url || url == ''){
							url = 'img/book.png';
						}
						if(!translator){
							translator = '-';
						}

						$('.content').append(`
							
							<div class="col-6 col-sm-6 col-md-3 col-lg-3 col-xl-3 text-center blank">
			                    <div>
			                    <a href="#" data-toggle="modal" data-target="#${book.ISBN}">
		                            <img src="${url}" alt="${book.book_name}" class="img-book">
		                        </a>
		                        </div>
			                    <div class="btw-b-t">${book.book_name}</div>
			                   
			                </div>
			                
			                <div class="modal fade" id="${book.ISBN}" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
								<div class="modal-dialog" role="document">
									<div class="modal-content">
										<div class="modal-header" style="float:right;">
											<button type="button" class="close" data-dismiss="modal" aria-label="Close">
												<span aria-hidden="true">&times;</span>
											</button>
											
										</div>
										<div class="modal-body">
											<div class="row">
												<div class="col-12 col-sm-12 col-md-5 col-lg-5 col-xl-5 text-center">
													<img src="${url}" alt="${book.book_name}" class="img-book">
												</div>
												<div class="col-12 col-sm-12 col-md-7 col-lg-7 col-xl-7 ">
													<h6>${book.book_name}</h6>
													<p>ISBN : ${book.ISBN}</p>
													<p>สำนักพิมพ์ : ${book.publish}</p>
													<p>ผู้แต่ง : ${book.author}</p>
													<p>ผู้แปล : ${translator}</p>

												</div>
											</div>
										</div>
									
									</div>
								</div>
							</div>
						`)

						
					}else{
						return false;
					}
				});
			}
			
		}
	});
	
});