/**
 * Created by Yali on 2/12/17.
 */


// Check if two rectangle overlap each other
// The format of rectangle is {x: 0, y: 0, width: 10, height: 10}
function rectOverlap(A, B) {

    function valueInRange(value, min, max) {
        return (value <= max) && (value >= min);
    }

    var xOverlap = valueInRange(A.x, B.x, B.x + B.width) ||
        valueInRange(B.x, A.x, A.x + A.width);

    var yOverlap = valueInRange(A.y, B.y, B.y + B.height) ||
        valueInRange(B.y, A.y, A.y + A.height);

    return xOverlap && yOverlap;
}


// Moving an SVG selection to the front/back
// Thanks to d3-extended (github.com/wbkd/d3-extended)
d3.selection.prototype.moveToFront = function () {
    return this.each(function () {
        this.parentNode.appendChild(this);
    });
};

d3.selection.prototype.moveToBack = function () {
    return this.each(function () {
        var firstChild = this.parentNode.firstChild;
        if (firstChild) {
            this.parentNode.insertBefore(this, firstChild);
        }
    });
};




