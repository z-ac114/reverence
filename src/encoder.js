export function encodeString(str){
  try{
    return btoa(unescape(encodeURIComponent(str)));
  }catch(e){
    console.error(e);return '';
  }
}

export function decodeString(b64){
  try{
    return decodeURIComponent(escape(atob(b64)));
  }catch(e){
    console.error(e);return '';
  }
}
