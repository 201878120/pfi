$("#cursor");
let selector="#cursor";
$(document).ready(init_UI)
let mouseDown = false;
let mousePos = { x: 0, y: 0 };
let lastMousePos = { x: 0, y: 0 };
let currentTransform = null;
let currentTarget = null;
let currentOffset = null;
let screenToPoint = 1;

function extractTranslateValues(translateProp) { //translate( Xpx, ypx) --> {x: X, y: Y}
    let cleaned = translateProp.replace("translate(", "").replace(")", "").replaceAll("px", "").replaceAll(" ", "").split(",");
    return { x: parseInt(cleaned[0]), y: parseInt(cleaned[1]) };
}
function extractViewBoxWidth(svg){
    return parseInt(svg.getAttribute("viewBox").split(" ")[2]);
}
function getPolygoneSize(selecteurId){
    return $(selecteurId).clientX
}
console.dir(getPolygoneSize("#units"))
function init_UI() {
    const MIN_VOLUME  = 0;
    const MAX_VOLUME  = 10;
    const ajustVolume = (volume,min,max)=>{
        return volume>=max?max:(volume<=min?min:volume);
    }
    // console.table({
    //     "-1":ajustVolume(-1,MIN_VOLUME,MAX_VOLUME),
    //     "0":ajustVolume(0,MIN_VOLUME,MAX_VOLUME),
    //     "1":ajustVolume(1,MIN_VOLUME,MAX_VOLUME),
    //     "8":ajustVolume(8,MIN_VOLUME,MAX_VOLUME),
    //     "10":ajustVolume(10,MIN_VOLUME,MAX_VOLUME),
    //     "13":ajustVolume(13,MIN_VOLUME,MAX_VOLUME),
    // })
    $( selector).mousedown((e) => {
        currentTarget = e.target.closest( selector);
        currentOffset = { x: 0, y: 0 };    
        if (currentTarget.style.transform !== "" )
            currentOffset =  extractTranslateValues(currentTarget.style.transform);
        let parentTarget = currentTarget.parentNode;
        let parentViewBoxWidth = extractViewBoxWidth(parentTarget);
        screenToPoint = parentTarget.getBoundingClientRect().width / parentViewBoxWidth /* viewBox width*/ ; 
        lastMousePos.x = e.clientX / screenToPoint;
        lastMousePos.y = e.clientY / screenToPoint;
    });

    $("body").mousemove((e) => {
        if (currentTarget) {
            mousePos.x = e.clientX / screenToPoint  + currentOffset.x;
            mousePos.y = e.clientY / screenToPoint  + currentOffset.y;
            console.log(Math.ceil(mousePos.x*100)/100)
            let delta = { x: mousePos.x - lastMousePos.x, y: 0/*mousePos.y - lastMousePos.y*/ }
            $(currentTarget).css('transform', 'translate(' + delta.x  + 'px,' + delta.y + 'px)');
        }
    });

    $("body").mouseup((e) => {
        currentTarget = null;
    });
}

