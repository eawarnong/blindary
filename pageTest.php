<?php
include("include/top.php");


function testFunc(){



	$data = array(
	  'userID'      => 'a7664093-502e-4d2b-bf30-25a2b26d6021',
	  'itemKind'    => 0,
	  'value'       => 1,
	  'description' => 'Boa sauda',
	  'itemID'      => '03e76d0a-8bab-11e0-8250-000c29b481aa'
	);

	echo json_encode( $data );

	// $context  = stream_context_create( $options );

}

function testFunc2($data) {
	// $data = array(
	//   'userID'      => '555555555',
	//   'itemKind'    => 0,
	//   'value'       => 1,
	//   'description' => 'Boa sauda',
	//   'itemID'      => '03e76d0a-8bab-11e0-8250-000c29b481aa'
	// );

	// $d = array();
	// $d['test'] = $_POST['test'];

	$arr = (array) json_decode($data);
	//print_r($arr);
	foreach ($arr as $key => $value) {
		echo $value;
	}
//	echo $arr['test'];
	
}

// testFunc();
	
include("include/bottom.php");

?>

