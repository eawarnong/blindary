<?php
// $sql_id = "SELECT MAX(volunteer_id) AS MAX_ID FROM VOLUNTEER";
// $q_id = $db->query($sql_id);
// $f_id= $q_id->fetch_array();

// $max = $f_id['MAX_ID']+1;
// echo $max;


// $hours = str_pad(floor($number / 3600), 2, '0', STR_PAD_LEFT);
// $minutes = str_pad(floor( ($number / 60) % 60), 2, '0', STR_PAD_LEFT);
// $seconds = str_pad($number % 60, 2, '0', STR_PAD_LEFT);
// $result_time = $hours.":".$minutes.":".$seconds;



include("php/top.php"); 

// 	$json = '{
//     "title": "JavaScript: The Definitive Guide",
//     "author": "David Flanagan",
//     "edition": 6
// }';
// $book = json_decode($json);
// echo $book->author; // Notice: Trying to get property of non-object...
// echo json_last_error(); // 4 (JSON_ERROR_SYNTAX)
// echo json_last_error_msg(); // unexpected character 

      
$arr_book = '{
	"book_id" 	: "7",
	"chapter_id" : "2"
}';

$arr_para= '[
			{"book_id":"3","chapter_id":"1","paragraph_id":"1","paragraph_order":"1","isused":"1"},
			{"book_id":"3","chapter_id":"1","paragraph_id":"5","paragraph_order":"1","isused":"0"},
			{"book_id":"3","chapter_id":"1","paragraph_id":"2","paragraph_order":"3","isused":"1"},
			{"book_id":"3","chapter_id":"1","paragraph_id":"3","paragraph_order":"4","isused":"1"},
			{"book_id":"3","chapter_id":"1","paragraph_id":"4","paragraph_order":"5","isused":"1"},
			{"book_id":"3","chapter_id":"1","paragraph_id":"6","paragraph_order":"5","isused":"1"}]';

$arr_booknew = '{"volunteer_id":"110777450374734755161",
					"isbn":"9786160423224",
					"book_name":"ไต้หวัน : ชุด ล่าขุมทรัพย์สุดขอบฟ้า",
					"category_id":"1",
					"no_of_chapter":"12",
					"no_of_page":"150",
					"publish":"Nanmeebooks",
					"author":"Sweet Factory",
					"translator":"",
					"image":"http://books.google.com/books/content?id=MXmCBwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"}';







// $arr_info = array();
// $arr_info['volunteer_id']	=	$volunteer_id;
// $arr_info['type']			=	"return";
// $arr_info = json_encode($arr_info);

// $user = json_decode(getReadtime($arr_info));
// $number = $user->video_time;
// $hours = floor($number / 3600);
// $minutes = floor(($number / 60) % 60);
// $seconds = $number % 60;
// $result_time = $hours.":".$minutes.":".$seconds;

// $arr_userInfo['ranking']		= $user->ranking;
// $arr_userInfo['video_time']		= $result_time;	







///////////////////////////////////////////////////////////////////////////////////////////////////////////////

// function bookBlindWant($book_limit){
// 	global $db;
// 	$arr_getisbn = array();
// 	$arr_re = array();
// 	$arr_readd = array();
// 	$arr_result = array();

// 	$sql_isbn = "SELECT isbn FROM BLIND_REQUEST ";
// 	if($book_limit > 0) {
// 		$sql_isbn .= " LIMIT ".$book_limit;
// 	}

// 	$q_isbn = $db->query($sql_isbn);

// 	while($f_isbn = $q_isbn->fetch_array()){
// 		array_push($arr_getisbn, $f_isbn['isbn']);
// 	}

// 	$arr_re = array_count_values($arr_getisbn);

// 	print_r($arr_re);
// 	echo '<br/><br/>';

// 	arsort($arr_re);

// 	foreach ($arr_re as $key => $value) {
// 		$sql_data = "SELECT A.ISBN, A.book_name, A.image, B.category_name 
// 					FROM BOOK A JOIN CATEGORY B ON A.category_id = B.category_id 
// 					WHERE isbn ='".$key."' ";
// 		$q_data = $db->query($sql_data);
// 		$f_data = $q_data->fetch_array();

// 		$arr_readd['ISBN'] 			= $f_data['ISBN'];
// 		$arr_readd['book_name'] 	= $f_data['book_name'];
// 		$arr_readd['image']			= $f_data['image'];

// 		array_push($arr_result, $arr_readd);

// 	}
// 	//print_r($arr_result);
// 	echo json_encode($arr_result);
// }

//bookBlindWant();


function getReadtime($arr_info){ //getReadtime(); ระยะเวลาทั้งหมดที่user อ่าน //$volunteer_id is a volunteer_id for find the range of readingtime
	//getReadtime(3);
	global $db;

	$time = json_decode($arr_info);
	$volunteer_id 	= $time->volunteer_id;
	$type  			= $time->type;
	
	if($volunteer_id==''){
		$wh = " LIMIT 20";
	}else{
		$wh="";
	}
  	$sql_readtime = "SELECT VT.volunteer_id, VT.avatar, SUM(PG.video_time) AS Time
					FROM VOLUNTEER VT 
					JOIN CHAPTER CT ON VT.volunteer_id = CT.volunteer_id
					JOIN PARAGRAPH PG ON CT.chapter_id = PG.chapter_id
					GROUP BY VT.volunteer_id".$wh." ";

    $q_readtime = $db->query($sql_readtime);
    $arr_readtime = array();
    $result = array();
    $result_id = array();

    while($f_readtime = $q_readtime->fetch_array()){

    	$arr_readtime['volunteer_id'] = $f_readtime['volunteer_id'];
    	$arr_readtime['avatar'] = $f_readtime['avatar'];

    	$number =  $f_readtime['Time'];
    	
    	if($type=="returntime"){
    		$hours = str_pad(floor( $number / 3600), 2, '0', STR_PAD_LEFT);
			$minutes = str_pad(floor( ($number / 60) % 60), 2, '0', STR_PAD_LEFT);
			$seconds = str_pad($number % 60, 2, '0', STR_PAD_LEFT);
			$result_time = $hours.":".$minutes.":".$seconds;
			$arr_readtime['time'] = $result_time;
    	}else{
    		@$minutes = floor($number / 60);
    		$arr_readtime['time'] = $minutes;
    	}

    	array_push($result, $arr_readtime);
    }

    if($volunteer_id != ''){ 
    	$count_rank=1;
    	foreach ($result as $key => $value) {
    		if($value['volunteer_id']==$volunteer_id){
    			$result_id['avatar'] 		= $value['avatar'];
    			$result_id['ranking'] 		= $count_rank;
    			$result_id['video_time'] 	= $value['time'];
    		}
    		$count_rank++;
    	}
    	if($type=='return'||$type=="returntime"){
    		return json_encode($result_id); 
    	}else{
    		if(count($result_id)!=0){
    			echo json_encode($result_id);
    		}else{
    			echo 0;
    		}
    	}
    	 
    	
    }else{
		echo json_encode($result); 
    }  

}

$arr_vol = '{"volunteer_id":"118340574327394348099"}';

getReadtime($arr_vol);
//getReadtime();



//bookBlindWant();
/////////////////////////////////////////////////////////////////////

$arr_book = '{
	"book_id" 	: "7",
	"chapter_id" : "2",
	"volunteer_id" : "0001",
	"playlist_link":"linklink"
}';
//ignoreJoin($arr_book);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$arr_check = '{
	"book_id" 	: "7",
	"chapter_id" : "2",
	"type"		:"return"
}';


//////////////////////////////////////////////////////////////////////////
            
/////////////////////////////////////////////////////////////////////////////////////////////////////////
$arr_chap = '{
	"book_id" 	: "30",
	"chapter_id" : "1"
}';
////////////////////////////////////////////////////////////////////////////////////////////////


function deleteBook($book_id){
	global $db;
	$arr_playlist 	= array();
	$arr_video 		= array();
	$arr_result 	= array();

	$sql_playlist 	= "SELECT playlist_link FROM CHAPTER WHERE book_id = ".$book_id." ";
	$sql_videos		= "SELECT video_link FROM PARAGRAPH WHERE book_id = ".$book_id." ";

	$q_playlist	= $db->query($sql_playlist);
	$q_videos 	= $db->query($sql_videos);

	while($f_playlist = $q_playlist->fetch_array()){

		array_push($arr_playlist, $f_playlist['playlist_link']);

	}

	$arr_result['playlist']	= $arr_playlist;

	while ($f_videos = $q_videos->fetch_array()) {

		array_push($arr_video, $f_videos['video_link']);

	}

	$arr_result['videos'] = $arr_video;

	
	$sql_book = "DELETE FROM CREATED_BOOK WHERE book_id=".$book_id." ";
	$q_book = $db->query($sql_book);

	if($q_book){
		echo json_encode($arr_result);
	}else{
		echo mysqli_error($db);
	}
}

//deleteBook(61);

////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////////////////////////////////////



$arr_joinid = '{
					"var1":"1",
					"var2":"2",
					"var3":"6"
				}';

$e = '{
		"book":
			[{
				"book_id": "1",
				"chapter_id": "1"
			},

			{
				"book_id": "2",
				"chapter_id": "2"
			},

			{
				"book_id": "3",
				"chapter_id": "3"
			}]
	  }';

//// 
	  /*
//print_r($e);
echo 'size of $e = '.count($e).'<br/>';
$ee = json_decode($e);

//print_r($ee->noti);

$arr_teste = array();
$arr_teste = $ee->noti;
print_r($arr_teste);


echo '<br/>'."size of noti = ".count($arr_teste).'<br/>';


for($i = 0; $i < count($arr_teste); $i++) {
	print_r($arr_teste[$i]->book_id);
	echo '<br/>';

} */
//////
function alertNotiRead($arr_join){
	global $db;

	$json 		= json_decode($arr_join);
	$arr_use 	= array();

	$wh = "";

	if($json->book!=''){

		$arr_use = $json->book;
		$size 	 = count($arr_use);

		for($i=0 ; $i<$size ; $i++){

			$book_id 	= $arr_use[$i]->book_id;
			$chapter_id = $arr_use[$i]->chapter_id;

			if($i==0){
				$wh .= " ( book_id = ".$book_id." AND chapter_id = ".$chapter_id.") ";
			}else{
				$wh .= "OR ( book_id = ".$book_id." AND chapter_id = ".$chapter_id.") ";
			}

		}//loop

		//echo $wh;

	}else{

		$arr_use 	= $json->join_id;
		$size 		= count($arr_use);

		for($i=0 ; $i<$size ; $i++){

			$join_id = $arr_use[$i]->join_id;

			if($i==0){
				$wh .= " join_id = ".$join_id." ";
			}else{
				$wh .= "OR join_id = ".$join_id." ";
			}

		}//loop

		//echo $wh;
	}

	$sql_update = "UPDATE JOIN_REQUEST
				SET is_read = 1
				WHERE ".$wh." ";
	$q_update = $db->query($sql_update);

	if($q_update){
		//echo json_encode(1) ;
	}else{
		//echo json_encode(0);
	}

}

$book = '{
		"book":
			[{
				"book_id": "1",
				"chapter_id": "1"
			},

			{
				"book_id": "5",
				"chapter_id": "8"
			},

			{
				"book_id": "5",
				"chapter_id": "7"
			}]
	  }';

$join_id = '{
		"join_id":
			[{
				"join_id":"1"
			},

			{
				"join_id":"2"
			}]	
		}';
//alertNotiRead($join_id);

//alertNoti($arr_joinid);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////


function getAllRequest($owner_id){
	global $db;
	$arr_book 	= array();
	$arr_bookre = array();

	$arr_upallbook 	= array();
	$arr_upbookre 	= array();
	$arr_upresult	= array();

	$sql_book = "SELECT J.book_id, J.chapter_id, J.is_accept, B.book_name, COUNT(J.chapter_id) AS count
				FROM JOIN_REQUEST J
				JOIN CREATED_BOOK C ON J.book_id = C.book_id
				JOIN BOOK B ON C.ISBN = B.ISBN
				WHERE owner_id = '".$owner_id."' AND is_accept = 0 AND is_accept = ALL (SELECT is_accept FROM JOIN_REQUEST I WHERE owner_id = '".$owner_id."' AND I.book_id = J.book_id AND I.chapter_id = J.chapter_id)
				GROUP BY J.book_id, J.chapter_id, J.is_accept;";
	$q_book = $db->query($sql_book);

	while($f_book = $q_book->fetch_array()){

		$arr_bookre['book_id'] 		= $f_book['book_id'];
		$arr_bookre['chapter_id'] 	= $f_book['chapter_id'];
		$arr_bookre['is_accept'] 	= $f_book['is_accept'];
		$arr_bookre['book_name']	= $f_book['book_name'];
		$arr_bookre['count']		= $f_book['count'];

		array_push($arr_book, $arr_bookre);

		$arr_upbookre['book_id']	= $f_book['book_id'];
		$arr_upbookre['chapter_id']	= $f_book['chapter_id'];
		array_push($arr_upallbook, $arr_upbookre);

	}

	$arr_upresult['book']	= $arr_upallbook;

	echo json_encode($arr_book);

	alertNotiRead(json_encode($arr_upresult));
}

//getAllRequest('115899339961864263295');


////////////////////////////////////////////////////////////////////////////////////////////////////////////
function queryNoti($volunteer_id){
	global $db;
	$arr_noti = array();
	$arr_result = array();

	$arr_upalljoin 	= array();
	$arr_upjoinre 	= array();
	$arr_upresult	= array();
	
	$sql_noti = "SELECT A.*, B.name, B.avatar,D.book_name
				FROM JOIN_REQUEST A
				JOIN VOLUNTEER B ON A.owner_id = B.volunteer_id
				JOIN CREATED_BOOK C ON A.book_id = C.book_id
				JOIN BOOK D ON C.ISBN = D.ISBN
				WHERE A.requester_id = '".$volunteer_id."' AND A.is_accept=1
				ORDER BY date DESC";

	$q_noti = $db->query($sql_noti);
	
	while($f_noti = $q_noti->fetch_array()){

		$arr_noti['join_id'] 	= $f_noti['join_id'];
		$arr_noti['name'] 		= $f_noti['name'];
		$arr_noti['avatar'] 	= $f_noti['avatar'];
		$arr_noti['book_name'] 	= $f_noti['book_name'];
		$arr_noti['chapter_id'] = $f_noti['chapter_id'];
		array_push($arr_result, $arr_noti);

		$arr_upjoinre['join_id']	= $f_noti['join_id'];
		array_push($arr_upalljoin, $arr_upjoinre);
	}

	$arr_upresult['join_id']	= $arr_upalljoin;

	echo json_encode($arr_result);

	alertNotiRead(json_encode($arr_upresult));
}

//queryNoti('109642340458574024757');
/////////////////////////////////////////////////////////////////////////////////////////////////////////

//insertRequest($arr_request);
///////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////

//getJoinChapter($arr_data);
///////////////////////////////////////////////////////////////////////////////////////////////////////
?>

<!DOCTYPE html>
<html>
<head>
	<script src="js/jquery.js"></script>
</head>
<body>




 	<!-- <table border="">
 		<tr>
 			<th>paragraph_id</th>
 			<th>paragraph_order</th>
 			<th>isused</th>
 			<th>video_times</th>
 			<th>gmdate</th>
 			<th>ratio</th>
 		</tr>
 	</table> -->

 		<?php 
 			

 			//gmdate("H:i:s", $f_para['video_time']) 
 			/*foreach ($arr_use as $key => $value) {
 				$gm_tran = "";
 				$gm_h =  gmdate("H", $value['video_time']);
 				$gm_i =  gmdate("i", $value['video_time']);
 				$gm_s =  gmdate("s", $value['video_time']);

 				$gm_tran .= ($gm_h>0? number_format($gm_h)."ชม. ":"");
 				$gm_tran .= ($gm_i>0? number_format($gm_i)."นาที ":"");
 				$gm_tran .= ($gm_s>0? number_format($gm_s)."วินาที":"");

 				$number = $value['video_time'];
				$hours = floor($number / 3600);
				$minutes = floor(($number / 60) % 60);
				$seconds = $number % 60;
				$result_time = $hours.":".$minutes.":".$seconds;

				$min = floor($number/60);
				
 				
 				
 				?>
 				<tr>
 					<td><?php echo $value['paragraph_id'];?></td>
 					<td>เสียงที่ <?php echo $value['paragraph_order'];?></td>
 					<td><?php echo $value['isused'];?></td>
 					<td><?php echo $value['video_time'];?></td>
 					<td><?php echo $result_time; ?></td>
 					<td> <input type="radio" name="<?php echo $value['paragraph_order']?>" id="<?php echo $value['paragraph_order']?>" value="<?php echo $value['paragraph_id']?>"></td>

 				</tr>
 			<?php } */
 		 ?>

 	
 	<input type="button" name="submit" id="submit"value="Yoooooo"/>
	
</body>
</html>

<script type="text/javascript">
	
	$(document).ready(function() {

		$('#submit').click(function(){
			var VALUE = $('#4').val();
			console.log(VALUE);
		});
	});
	


</script>
<?php 
include("php/bottom.php");
 ?>

