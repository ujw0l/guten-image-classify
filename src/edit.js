import {useEffect, useRef} from 'react';
import {  Button, ToggleControl, 
	Card,
    CardHeader,
    CardBody,
	CardDivider,
    CardFooter,} from '@wordpress/components';

	import * as tf from '@tensorflow/tfjs';
	import * as mobilenet from '@tensorflow-models/mobilenet';
	import * as knnClassifier from '@tensorflow-models/knn-classifier';

/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps,MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export default function Edit({attributes,setAttributes}) {
 const resultRef= useRef('');
 const fileRef = useRef('');
	useEffect(()=>{
		
			resultRef.current.textContent = __('Processing...','image-classify');

			let rawData = [attributes.labelImg1.map(x=>x.url),attributes.labelImg2.map(x=>x.url),attributes.labelImg3.map(x=>x.url),attributes.labelImg4.map(x=>x.url),attributes.labelImg5.map(x=>x.url)] 
			let trainData = rawData.filter(x=> x.length > 0)

			/**
 * Main App Function
 */
async function app() {
	const classifier = knnClassifier.create();
	const net = await mobilenet.load();

	/**
	 * 
	 * function to train  model to classify  images thorugh transfer learning
	 * 
	 * @param {*} imgEl image element to train model
	 * @param {*} classId class Id associated with image
	 */
	const addExample = async ( imgEl,classId) => {
	  const img = tf.browser.fromPixels(imgEl); //get tensor of the image
	  const activation = net.infer(img, true); //feature extraction using mobilenet model
	  classifier.addExample(activation, classId); //train knnClassifier for image with classid
	};
  
  
	/**
	 * 
	 * function to classify image based on learning
	 * 
	 * @param {*} imgEl image to be classified
	 */
   const runPredictions =  async imgEl=> {
  
	 
		const img = tf.browser.fromPixels(imgEl); //convert image to tensor
		const activation = net.infer(img, true); //feature extraction using mobile net
		const result = await classifier.predictClass(activation); //classify the image 
  
		let confidence =  result.confidences[result.label]

		  resultRef.current.innerText = `
		  Prediction: Class ${parseInt(result.label)+1},
		  Probability: ${result.confidences[result.label]}`;
		
	}
  
  /**
   * Train image for each train data
   */
  trainData.map((x,i)=>x.map( async (y,z)=>{
	  let img = new Image()    
	  img.src =  y;
	  img.addEventListener('load',e=> addExample(e.target,i));
	  if(i ==trainData.length-1 && z == x.length-1){
		resultRef.current.textContent = __("Done training model",'image-classify');
	  }
	}))
  
  /**
   * Run script when image to be itenfified is loaded
   */
	fileRef.current.addEventListener('change', async e=>{
	let file =  e.target.files[0];
	if(file){
	  const reader = new FileReader();
	  if(reader){
		reader.addEventListener('load', async e=>{
		  let img = new Image();
		  img.src =  e.target.result;
		  img.addEventListener('load', async e=>runPredictions(e.target))
		})
	 reader.readAsDataURL(file);
	  }
	}
  })
  
  
  }
  
  app();

		setAttributes({createModel:false})
	},[attributes.createModel, attributes.labelImg1,attributes.labelImg2,attributes.labelImg2,attributes.labelImg4,attributes.labelImg5])


	return (
		<div {...useBlockProps()}>


<>
<Card>
<CardHeader>{__("Select Images to Train",'image-classify')}</CardHeader>
<CardBody>
			<div>

<span style={{width:'100px',display:'inline-block'}}>  Class 1 </span>
			<span style={{width:'200px',display:'inline-block'}}>
             <MediaUploadCheck>
					<MediaUpload
					 title = {   0 >= attributes.labelImg1.length ? __('Select Images', 'image-classify') : __("Change Images",'image-classify')}
					 multiple={ true}
					 value= {attributes.labelImg1.map(x=>x.id)}
					 gallery= {true}
					 onSelect={ gallery =>  setAttributes({labelImg1:gallery})}
						allowedTypes={['image']}
						render={({ open }) => (
							<Button style={{ marginLeft: 'auto', marginRight: 'auto', display: 'block', color: 'rgb(61, 148, 218)', border: '1px solid rgb(61, 148, 218)'}} className= {"image-classify-button"}  onClick={open}>{  attributes.labelImg1.length > 1 ?  __(" Add Remove Images", "image-classify")  : __(" Select Images", "image-classify")}</Button>
						)}
					/>
				</MediaUploadCheck>

				</span>
</div>

<div>

<span style={{width:'100px',display:'inline-block'}}> Class 2 </span>
			<span style={{width:'200px',display:'inline-block'}}>
				<MediaUploadCheck>
					<MediaUpload
					 title = {   0 >= attributes.labelImg2.length ? __('Select Images', 'image-classify') : __("Change Images",'image-classify')}
					 multiple={ true}
					 value= {attributes.labelImg2.map(x=>x.id)}
					 gallery= {true}
					 onSelect={ gallery =>  setAttributes({labelImg2:gallery})}
						allowedTypes={['image']}
						render={({ open }) => (
							<Button style={{ marginLeft: 'auto', marginRight: 'auto', display: 'block', color: 'rgb(61, 148, 218)', border: '1px solid rgb(61, 148, 218)'}} className= {"image-classify-button "}  onClick={open}>{  attributes.labelImg2.length> 1 ?  __(" Add Remove Images", "image-classify")  : __(" Select Images", "image-classify")}</Button>
						)}
					/>
				</MediaUploadCheck>

				</span>
</div>

<div>
<span style={{width:'100px',display:'inline-block'}}>  Class 3 </span>
			<span style={{width:'200px',display:'inline-block'}}>
				<MediaUploadCheck>
					<MediaUpload
					 title = {   0 >= attributes.labelImg3.length ? __('Select Images', 'image-classify') : __("Change Images",'image-classify')}
					 multiple={ true}
					 value= {attributes.labelImg3.map(x=>x.id)}
					 gallery= {true}
					 onSelect={ gallery =>  setAttributes({labelImg3:gallery})}
						allowedTypes={['image']}
						render={({ open }) => (
							<Button style={{ marginLeft: 'auto', marginRight: 'auto', display: 'block', color: 'rgb(61, 148, 218)', border: '1px solid rgb(61, 148, 218)'}} className= {"image-classify-button "}  onClick={open}>{  attributes.labelImg3.length> 1 ?  __(" Add Remove Images", "image-classify")  : __(" Select Images", "image-classify")}</Button>
						)}
					/>
				</MediaUploadCheck>
			</span>	
</div>

<div>
<span style={{width:'100px',display:'inline-block'}}> Class 4 </span>
			<span style={{width:'200px',display:'inline-block'}}>
				<MediaUploadCheck>
					<MediaUpload
					 title = {   0 >= attributes.labelImg4.length ? __('Select Images', 'image-classify') : __("Change Images",'image-classify')}
					 multiple={ true}
					 value= {attributes.labelImg4.map(x=>x.id)}
					 gallery= {true}
					 onSelect={ gallery =>  setAttributes({labelImg4:gallery})}
						allowedTypes={['image']}
						render={({ open }) => (
							<Button style={{ marginLeft: 'auto', marginRight: 'auto', display: 'block', color: 'rgb(61, 148, 218)', border: '1px solid rgb(61, 148, 218)'}} className= {"image-classify-button "}  onClick={open}>{  attributes.labelImg4.length> 1 ?  __(" Add Remove Images", "image-classify")  : __(" Select Images", "image-classify")}</Button>
						)}
					/>
				</MediaUploadCheck>
				</span>	
</div>
<div>
<span style={{width:'100px',display:'inline-block'}}> Class 5 </span>
			<span style={{width:'200px',display:'inline-block'}}>
				<MediaUploadCheck>
					<MediaUpload
					 title = "Select Images"
					 multiple={ true}
					 value= {attributes.labelImg5.map(x=>x.id)}
					 gallery= {true}
					 onSelect={ gallery =>  setAttributes({labelImg5:gallery})}
						allowedTypes={['image']}
						render={({ open }) => (
							<Button style={{ marginLeft: 'auto', marginRight: 'auto', display: 'block', color: 'rgb(61, 148, 218)', border: '1px solid rgb(61, 148, 218)'}} className= {"image-classify-button "}  onClick={open}>{  attributes.labelImg5.length> 1 ?  __(" Add Remove Images", "image-classify")  : __(" Select Images", "image-classify")}</Button>
						)}
					/>
				</MediaUploadCheck>
				</span>	
</div>
</CardBody>
<CardBody >
	
		<div>
				<span><Button variant='primary'   onClick={()=> setAttributes({createModel:true})} >{__("Train", "image-classify")}</Button></span><span ref={resultRef}> </span>
		</div>
</CardBody>

<CardBody>

<ToggleControl

label={  attributes.allowImage ? __("Allow Similar Image.", "image-classify"):__("Don't allow similar Images.")}
			checked={attributes.allowImage}
			onChange={val=> setAttributes({allowImage:val})}

/>

</CardBody>
	<CardFooter>
	<div><span> {__("Select Image to test")} </span> <span><input ref={fileRef} type='file' accept='img/*' /></span> </div>	
   </CardFooter>		
			</Card>	
				</>
		</div>
	);
}
