<?php
/**
 * Plugin Name:       Image Classify
 * Description:       Block to classify image and allow or block upload.
 * Requires at least: 6.3.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       image-classify
 *
 * @package           create-block
 */

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
	add_action( 'wp_enqueue_scripts', array($this,'enequeFrontendJs' ));
	add_action('wp_ajax_uploadImage',array($this,'uploadImage'));

   }


   /**
	* 
	*
    */

	public function enequeFrontendJs(){

		wp_enqueue_script('ctcIcFrontendJs', CTCIC_DIR_PATH.'build/frontend.js',array());
		wp_localize_script('ctcIcFrontendJs','ctcIcParams',array(
			'invalidImage'=>__('This kind of images are not allowed.','image-classify'),
			'validImage'=>__('Image is allowed to upload','image-classify'),
			'ajaxUrl'=> admin_url( 'admin-ajax.php' ),
		));

	}



	/**
	 * Upload image with AJAX
	 */

	 public function uploadImage(){


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
	register_block_type( __DIR__ . '/build' , 
    array('attributes' => array(
		"allowImage"=>["type"=>'boolean',"default"=>true],
		"labelImg1"=>["type"=>"array", "default"=>[]],
		"labelImg2"=>["type"=>"array", "default"=>[]],
		"labelImg3"=>["type"=>"array", "default"=>[]],
		"labelImg4"=>["type"=>"array", "default"=>[]],
		"labelImg5"=>["type"=>"array", "default"=>[]],
		"createModel"=>["type"=>'boolean',"default"=>false],
		"trainButtonDis"=>["type"=>'boolean',"default"=>true]


),)
);
}
 }

new ctcImageClassify();

