$(document).ready(function() {
console.log('555555');

$(window).on('beforeunload', function(){
    $(window).scrollTop(0);
});

    // $("#menu").load("menu.html",function(){
      
      
    //   $(window).scroll(function() {
    //     var offset = $(window).scrollTop();
    //     //console.log(offset);
    //     $('.navbar').toggleClass('trans', offset > 50);
    //   });

    // }); 

    // $("#step").load("step.html", function() {

    //   function checkPath(path) {
    //     if(window.location.pathname.indexOf( path + '.html') >= 0) {
    //     console.log(path);
    //     return true;
    //     }
    //   }

    //   if(checkPath('createAudiobook')) {

    //     $('#step1').addClass('active');

    //   } else if(checkPath('testSound')) {

    //     console.log('testSound true');
    //     $('#step1').removeClass('active');
    //     $('#step1').addClass('complete');
    //     $('#step2').addClass('active');

    //   } else{
    //     $('#step1').addClass('complete');
    //     $('#step2').removeClass('active');
    //     $('#step2').addClass('complete');
    //     $('#step3').addClass('active');

    //   } 
    // }); 
    
      	

      	//nav tab >> createChapter
  	$('#myTab a').click(function (e) {
		e.preventDefault()
		$(this).tab('show')
	});

    $("#footer").load("footer.html",function(){
        $.ajax({

        url : 'php/functions.php?function=getCategories',
        success : function(categories){
            
            categories = JSON.parse(categories);
            

            $.each(categories, function(index, category){

                $('#category').append(`

                    <div class="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4">
                        <p class="detailCategory">
                            <a href="seeMore?flag=3&id=${category.category_id}">${category.category_name}</a>
                        </p>
                    </div>

                `);
            });
        }

    });
    });

});
