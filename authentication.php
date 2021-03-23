<?php 

require_once('wp-load.php');

$response = array(
	'data'		=> array(),
	'msg'		=> 'Invalid email or password',
	'status'	=> false
);

/* Sanitize all received posts */
foreach($_POST as $k => $value){
	$_POST[$k] = sanitize_text_field($value);
}

/**
 * Login Method
 *
 */
if( isset( $_POST['type'] ) &&  $_POST['type'] == 'login' ){

	/* Get user data */
	$user = get_user_by( 'email', $_POST['email'] );
	
	if ( $user ){
		$password_check = wp_check_password( $_POST['password'], $user->user_pass, $user->ID );
	
		if ( $password_check ){
			/* Generate a unique auth token */
			$token = MY_RANDOM_CODE_GENERATOR( 30 );

			/* Store / Update auth token in the database */
			if( update_user_meta( $user->ID, 'auth_token', $token ) ){
				
				/* Return generated token and user ID*/
				$response['status'] = true;
				$response['data'] = array(
					'auth_token' 	=>	$token,
					'user_id'		=>	$user->ID,
					'user_login'	=>	$user->user_login
				);
				$response['msg'] = 'Successfully Authenticated';
			}
		}
	}
}
