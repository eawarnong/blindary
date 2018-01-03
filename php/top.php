
<?php
	//include("../function_all.php");
// <!-- <!DOCTYPE html>
// <html lang="en">
// <head>
// 	<meta charset="utf-8">
// 	<meta http-equiv="X-UA-Compatible" content="IE=edge">

// 	<title></title>
// </head>
// <body>

// </body>

//  -->



	$servername = "localhost";
	$username = "production";
	$password = "Production_123";
	$dbname = "blindary";
	$port="3306";
	
	$db = new mysqli($servername, $username, $password, $dbname, $port);

	// $db = mysqli_connect($servername, $username, $password, $dbname, $port);
	// if (!$db) {
	//     echo "Error: Unable to connect to MySQL." . PHP_EOL;
	//     echo "Debugging errno: " . mysqli_connect_errno() . PHP_EOL;
	//     echo "Debugging error: " . mysqli_connect_error() . PHP_EOL;
	//     exit;
	// }
	mysqli_set_charset($db, 'utf8'); //***********************************************
	if($db->connect_error){
        die("Connection failed: ".mysqli_connect_error());
    }
     	//die("Connection succesfully");


if(isset($_GET['function']) && $_GET['function'] != '') {
	if(isset($_GET['param']) && $_GET['param'] != '') {
		$_GET['function']($_GET['param']);
	} else {
		$_GET['function']();

	}

}


?>
