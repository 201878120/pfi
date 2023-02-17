
let selector = "#trackbar";
let mouseDown = false;
let lastMouseXPos = 0;
let currentTarget = null;
const SCREEN_TO_POINT = 1;
const idCursor="cursor";
const idStick="bigTicks";

$(document).ready(init_UI)

function extractViewBoxWidth(svg) {
    return parseInt(svg.getAttribute("viewBox").split(" ")[2]);
}

function ajustValue(volume, min, max){
    return volume >= max ? max : (volume <= min ? min : volume);
}

function getPolygon(selecteurId)
{
    return document.querySelector(`#${selecteurId}`).getBoundingClientRect();
}

function getInfo(){

    let polyCursor=getPolygon(idCursor);
    let polyStick=getPolygon(idStick);
    let minX = polyStick.left;
    let maxX = polyStick.right;
    let currentX=polyCursor.left+polyCursor.width/2;
    
    let results={
        minX:minX,
        maxX:maxX,
        currentX:currentX,
        value:(currentX-minX)/polyStick.width
    };
    return results;
}


function init_UI() {
    const MIN_VOLUME = 0;
    const MAX_VOLUME = 10;
    const SCREEN_TO_POINT = 1562 / 600;
    const WIDTH_CURSOR=getPolygon(idCursor).width;
    let currentValue = 0;
    placeCursor(currentValue)

    function placeCursor(value){
        let x=value*getPolygon(idStick).width
        $("#cursor").css('transform', 'translate(' + x*SCREEN_TO_POINT + 'px,' + 0 + 'px)');
        let level =document.querySelector("#level");
        let cursor=document.querySelector("#cursor");
        level.style.color =   "rgb(" + value * 255 + ",0 ,0)";
        cursor.style.fill =   "rgb(" + value * 255 + ",0 ,0)";
        cursor.style.stroke = "rgb(" + (255 - value * 255) + ",0 ,0)";
        $(level).val(ajustValue(value*MAX_VOLUME,MIN_VOLUME, MAX_VOLUME).toFixed(1));
    }
    $(selector).mousedown((e) => {
        currentTarget = e.target;
    });

    $(selector).mousemove((e) => {
        if (currentTarget) {
            let value=(e.offsetX - WIDTH_CURSOR)/getPolygon(idStick).width
            placeCursor(value);
            const INFO = getInfo()
            let valueX= INFO.value
            // 1=>croit  0=>décroit
            let delta=(valueX-currentValue)>0?1:0
            if(delta && value > 1){
                placeCursor(1);
            }
            else if(!delta && value < 0)
            {
                placeCursor(0);
            }
            else
            {
                currentValue=valueX;
            }
        }
    });

    $("body").mouseup((e) => {
        currentTarget = null;
    });
}

