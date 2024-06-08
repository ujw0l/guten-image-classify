
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as knnClassifier from '@tensorflow-models/knn-classifier';

    async function app(el) {

        const ctcIcParams = JSON.parse(el.getAttribute('data-info'));
        const trainData = JSON.parse(el.getAttribute('data-train-images'));
        const allow = el.getAttribute('data-allow');
        const resultCont = el.querySelector('.loading-result');
        const imgBtn =  el.querySelector('.select-img');
        const minConfScore = parseFloat(el.getAttribute('data-conf'))
        imgBtn.disabled = true;

        resultCont.textContent = ctcIcParams.modelLoading;

        const classifier = knnClassifier.create();
        const net = await mobilenet.load();

    /**
     * Function to upload image to server
     */
      function ajaxUploadImg(img,ext){

        let nonce =  document.querySelector(".image-classify-cont").getAttribute("data-nonce")

        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", ctcIcParams.ajaxUrl, true);
        xhttp.responseType = "text";
        xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;');
        xhttp.addEventListener('load', event => {

            if (event.target.status >= 200 && event.target.status < 400) {

                alert(event.target.response);
            } else {
                alert(event.target.response);
            }
        })
        xhttp.send("action=image_classify_uploadImage&blob="+img+"&ext="+ext+"&nonce="+nonce);
      }
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
       const runPredictions =  async (imgEl,ext)=> {
      
        
            const img = tf.browser.fromPixels(imgEl); //convert image to tensor
            const activation = net.infer(img, true); //feature extraction using mobile net
            const result = await classifier.predictClass(activation); //classify the image 
      
            
           if(allow == 'allow'){
            if(result.confidences[result.label] >= minConfScore){
                if(confirm( ctcIcParams.validImage)){
                  ajaxUploadImg(imgEl.src,ext)
                }
          
            }else{
              alert( ctcIcParams.invalidImage);
            }

           }else{

            if(result.confidences[result.label] <= minConfScore){
              if(confirm( ctcIcParams.validImage)){
                ajaxUploadImg(imgEl.src,ext)
              }
            }else{
               alert( ctcIcParams.invalidImage);
              
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
            imgBtn.disabled = false;
          }
        }))
      
      /**
       * Run script when image to be itenfified is loaded
       */
      imgBtn.addEventListener('change', async e=>{
        let file =  e.target.files[0];
        let ext = e.target.files[0].name.split('.').pop().toLowerCase();
        
        if(file){
          const reader = new FileReader();
          if(reader){
            reader.addEventListener('load', async e=>{
              let img = new Image();
              img.src =  e.target.result;
              img.addEventListener('load', async e=>runPredictions(e.target,ext))
            })
         reader.readAsDataURL(file);
          }
        }
      })
      
      
      }
      window.addEventListener("DOMContentLoaded",()=>  Array.from(document.querySelectorAll('.image-classify-cont')).map(x=> app(x)))

