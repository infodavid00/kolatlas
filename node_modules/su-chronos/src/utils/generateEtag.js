
/**
 * A function that generates a unique etag for a resource by concatenating the resources
 * file path together with its last modified date, and randomly scrambling the characters 
 * to form another string of same length encoded as a base 64 url.
 * 
 * Since 2 resources can generally not share the same file path, and a resource last 
 * modified date can never repeat itself once another modification to the resource is made,
 * the chronos etag generator ensures 2 resources can never share the same entity tag
 * and the generator would never generate an already-used etag for the same resource.
 * 
 * @author David.A super-user-d0
 * @param {string} filePath - The resource's filePath.
 * @param {number} lastModified - The resource's lastModified date.
 * @returns {string} The generated entity tag.
 */
export default function generateEtag(filePath, lastModified) {
  const concatenatedString = filePath + lastModified;
  const csLength = concatenatedString.length; //csLnegth AS IN concatenatedString Length

  let newString = "";
  const ids = [];
 
  const genRandomNumber = () => {
    let random = Math.round(Math.random() * (csLength - 1));
    if (ids.includes(random)) genRandomNumber()
    else ids.push(random)
  }
  for (let i = 0; i < csLength; i++) {
     genRandomNumber();
  } for (let i = 0; i < csLength; i++) {
     newString += concatenatedString[ids[i]];
  }

  return Buffer.from(newString).toString("base64url");
}