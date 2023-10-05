/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './style.scss';

/**
 * Internal dependencies
 */
import Edit from './edit';
import save from './save';
import metadata from './block.json';

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType(metadata.name, {

	keywords:[__('Image Classify',"image-classify"),__("Deep Learning","image-classify")],
	attributes:{
		allowImage:{type:'boolean',default:true},
		labelImg1:{type:"array", default:[]},
		labelImg2:{type:"array", default:[]},
		labelImg3:{type:"array", default:[]},
		labelImg4:{type:"array", default:[]},
		labelImg5:{type:"array", default:[]},
		createModel:{type:'boolean',default:false},
		trainButtonDis:{type:'boolean',default:true},
		trainData:{type:"array",default:[]}
	},

	/**
	 * @see ./edit.js
	 */
	edit: Edit,

	/**
	 * @see ./save.js
	 */
	save,
});
