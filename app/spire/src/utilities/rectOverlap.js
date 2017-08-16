/**
 * Created by Yali on 2/27/17.
 */


export default function rectOverlap(A, B) {
  function valueInRange(value, min, max) {
    return (value <= max) && (value >= min);
  }
  
  let xOverlap = valueInRange(A.x, B.x, B.x + B.width) ||
    valueInRange(B.x, A.x, A.x + A.width);
  
  let yOverlap = valueInRange(A.y, B.y, B.y + B.height) ||
    valueInRange(B.y, A.y, A.y + A.height);
  
  return xOverlap && yOverlap;
}
