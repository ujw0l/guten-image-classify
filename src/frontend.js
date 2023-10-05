
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as knnClassifier from '@tensorflow-models/knn-classifier';
alert("aye");
    async function app(el) {


        const trainData = JSON.parse(el.getAttribute('data-train-images'));
        const allow = el.getAttribute('data-allow');
        const resultCont = el.querySelector('.test-result');
        const uploadBtn = el.querySelector('.upload-btn button');
        const imgBtn =  el.querySelector('.select-img');

        resultCont.textContent = ctcIcParams.modelLoading;

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

            
           if(allow == 'allow'){

            if(result.confidences[result.label] > 0.7){
                resultCont.textContent = ctcIcParams.validImage
                uploadBtn.disabled = false;
                uploadBtn.addEventListener('click',()=>{
                    console.log(imgEl.src);
                })

            }else{

                resultCont.textContent = ctcIcParams.invalidImage
                uploadBtn.disabled = true;
            }

           }else{

            if(result.confidences[result.label] < 0.7){
                resultCont.textContent = ctcIcParams.validImage
                uploadBtn.disabled = false;
                uploadBtn.addEventListener('click',()=>{
                    console.log(img.src);
                })

            }else{

                resultCont.textContent = ctcIcParams.invalidImage
                uploadBtn.disabled = true;
            }

        }

            
        }
      
      /**
       * Train image for each train data
       */
     trainData.map((x,i)=>x.map( async (y,z)=>{
          let img = new Image()    
          img.src =  y;
          img.addEventListener('load',e=> addExample(e.target,i));
          if(i ==trainData.length-1 && z == x.length-1){
            resultCont.textContent = ctcIcParams.modelLoaded
          }
        }))
      
      /**
       * Run script when image to be itenfified is loaded
       */
      imgBtn.addEventListener('change', async e=>{
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
      window.addEventListener("DOMContentLoaded",()=>  Array.from(document.querySelectorAll('.image-classify-cont')).map(x=> app(x)))

