import {imgurKey} from '../keys/keys'

const uploadPhotoToImgur = props => new Promise((resolve,reject) => {
   let url = 'https://api.imgur.com/3/upload'
   let headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
	   'Authorization': 'Client-ID ' + imgurKey
   }
 	let post = {
		method: 'POST',
		headers: headers,
      body:JSON.stringify({image:props.image})
   }
   fetch(url,post)
		.then( res => res.json())
   	.then( img => resolve(img.data.link.replace('http://', 'https://')))
   	.catch( err => reject(err))
})
export {uploadPhotoToImgur}