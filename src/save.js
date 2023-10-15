/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {WPElement} Element to render.
 */
export default function save({attributes}) {
	return (
		<div {...useBlockProps.save()}>
			<div className="image-classify-cont" data-conf={parseInt(attributes.minProbabilty)/100} data-train-images={JSON.stringify(attributes.trainData)} data-allow={attributes.allowImage? 'allow':'noAllow' } >

			<div><span>{__("Select Image: ", 'image-classify')}</span><span><input className="select-img" type="file" accept='image/*' /></span><span className="loading-result"></span></div>
			</div>
		</div>
	);
}
