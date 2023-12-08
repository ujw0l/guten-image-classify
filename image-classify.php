<?php
/**
 * Plugin Name:       Image Classify
 * Description:       Block to classify image and allow or block upload.
 * Requires at least: 6.4.2
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            UjW0L
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       image-classify
 *
 * @package           create-block
 */


 if ( ! defined( 'ABSPATH' ) ) exit; 

 class ctcImageClassify{

	public function __construct(){

		define('CTCIC_DIR_PATH',plugin_dir_url(__FILE__) );
		SELF::requiredWpAction();

	}




 /**
	* @since 0.1.0
	*
	* Register required wp action
	*/
   public function requiredWpAction(){
	add_action( 'init', array($this,'create_block_image_classify_block_init') );
	add_action('wp_ajax_uploadImage',array($this,'uploadImage'));
	add_action('wp_ajax_nopriv_uploadImage', array($this ,'uploadImage'));

   }






	/**
	 * Upload image with AJAX
	 */

	 public function uploadImage(){



		$ext =  'jpg'== $_POST['ext'] ? 'jpeg' : $_POST['ext'];

		$fileName = time().'.'.$ext;
        $outPutFile = wp_upload_dir()['path'].'/'. $fileName;
        $upload_file =   file_put_contents($outPutFile, base64_decode(str_replace(' ', '+',str_replace('data:image/'.$ext.';base64,', '',$_POST['blob']))));
     
        
        $attachment = array(
            'guid'           => wp_upload_dir()['url'] . '/' .  $fileName, 
            'post_mime_type' => wp_check_filetype( basename( $fileName ), null )['type'],
            'post_title'     =>  sanitize_file_name( pathinfo( basename( $outPutFile), PATHINFO_FILENAME ) ),
            'post_content'   => '',
            'post_status'    => 'inherit'
        );
         
        $attach_id = wp_insert_attachment( $attachment );
    
    if(is_numeric($attach_id)):
    // Make sure that this file is included, as wp_generate_attachment_metadata() depends on it.
    require_once( ABSPATH . 'wp-admin/includes/image.php' );
     
    // Generate the metadata for the attachment, and update the database record.
    $attach_data = wp_generate_attachment_metadata( $attach_id,  $outPutFile);
    
    wp_update_attachment_metadata( $attach_id, $attach_data );
    echo __('Image sucessfully uploaded','wp-js-crop');
    else:
        echo __('Image could not be uploaded','wp-js-crop');
    endif;

		wp_die();
	 }
	

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 * 
 * 
 */


public  function create_block_image_classify_block_init() {

	$params = array(
		'invalidImage'=>__('This kind of image is not allowed.','image-classify'),
		'validImage'=>__('Image allowed. Would you like to upload it?.','image-classify'),
		'modelLoading'=>__('Loading ....','image-classify'),
		'modelLoaded'=>__('Done.','image-classify'),
		'ajaxUrl'=> admin_url( 'admin-ajax.php' ),
	);

	register_block_type( __DIR__ . '/build' , 
    array('attributes' => array( 
		"ctcIcParam"=> ["type"=>'string', "default"=>json_encode($params)],
		"allowImage"=>["type"=>'boolean', "default"=>true],
		"labelImg1"=>["type"=>"array", "default"=>[]],
		"labelImg2"=>["type"=>"array", "default"=>[]],
		"labelImg3"=>["type"=>"array", "default"=>[]],
		"labelImg4"=>["type"=>"array", "default"=>[]],
		"labelImg5"=>["type"=>"array", "default"=>[]],
		"createModel"=>["type"=>'boolean',"default"=>false],
		"trainButtonDis"=>["type"=>'boolean',"default"=>true],
		"trainData"=>["type"=>"array","default"=>[]],
		"minProbabilty"=> ["type"=>'number',"default"=>70 ],
),)
);
}
 }

new ctcImageClassify();

