const svgns = "http://www.w3.org/2000/svg";
const ViewPortMaxUnitX = 1000;
const ViewPortMaxUnitY = 600;
const EchelleY=0.06;
const EchelleX=0.5
let viewport = null;

class Graphe{
    static DEFAULT_HEIGHT_SEPARATION_VALUE=1000;
    static DEFAULT_ORIENTATION_TEXT=45;
    static DEFAULT_COLOR="red";
    static DEFAULT_WEIGHT=40;
    static DEFAULT_NBR_SUB_SEPARATION=5;
    static DEFAULT_SEPARATION_DATA=10;
    static DEFAULT_WEIGHT_DATA=50;
    static WEIGHT_BOTTOM_LINE=2;
    static WEIGHT_MIDDLE_LINE=0.5;
    static DEFAULT_NBR_SEPARATION=5;
    static WEIGHT_SUB_LINE=0.1;
    static DEFAULT_SPACE_FOR_ANNOTATION=15;
    static DEFAULT_SPACE_FOR_GRADUATION=80;
    static DEFAULT_SPACE_FOR_TITLE=75;
    #data;
    #rulesColor;
    #title;
    #spaceForTitle;
    #spaceForAnnotation;
    #spaceForGraduation;
    #viewport
    constructor(title,viewport){
        this.#viewport=viewport
        this.#title=title;
        this.heightSeparation=Graphe.DEFAULT_HEIGHT_SEPARATION_VALUE;
        this.nbrSeparation=Graphe.DEFAULT_NBR_SEPARATION;
        this.orientationText=Graphe.DEFAULT_ORIENTATION_TEXT;
        this.delfaultColor=Graphe.DEFAULT_COLOR;
        this.separationData=Graphe.DEFAULT_SEPARATION_DATA;
        this.nbreSubSeparation=Graphe.DEFAULT_NBR_SUB_SEPARATION;
        this.weightData=Graphe.DEFAULT_WEIGHT_DATA;
        this.#spaceForAnnotation=Graphe.DEFAULT_SPACE_FOR_ANNOTATION
        this.#spaceForTitle=Graphe.DEFAULT_SPACE_FOR_TITLE
        this.#spaceForGraduation=Graphe.DEFAULT_SPACE_FOR_GRADUATION
        this.#data=[];
        this.#rulesColor=[];
    }
    addData(name,data){
        this.#data.push({name:name,data:parseInt(data)})
    }
    addRuleColor(rule,color){
        this.#rulesColor.push({rule:(data)=>rule(data),color:color})
    }
    calculateColor(data){
        let finalColor=false;
        this.#rulesColor.forEach(({rule,color})=>{
            if(rule(data) && finalColor===false){
                finalColor=color
            }
        })
        return finalColor!==false?finalColor:this.delfaultColor;
    }
    #makeGraphe(){
        let hauteurGraphe=Math.ceil((this.#data.reduce((prev,current)=>(prev.data>current.data)?prev:current,{data:this.heightSeparation}).data)/this.heightSeparation)*this.heightSeparation
        let nbrData=this.#data.length;
        let largeurGraphe=(nbrData*(this.separationData+this.weightData+2));
        // this.#viewport.appendChild(line(0,0,0,EchelleY *hauteurGraphe,"black",20))
        let title=text(this.#spaceForGraduation+EchelleX * largeurGraphe/2-30,this.#spaceForTitle/2,this.#title,0,1.5);
        this.#viewport.appendChild(title)
        this.#viewport.appendChild(
            line(this.#spaceForGraduation,this.#spaceForTitle+EchelleY *hauteurGraphe,
                this.#spaceForGraduation+EchelleX *largeurGraphe,
                this.#spaceForTitle+EchelleY *hauteurGraphe,"black",Graphe.WEIGHT_BOTTOM_LINE))
        let nbrLigne=hauteurGraphe/this.heightSeparation;
        for(let noLigne=-1;noLigne<nbrLigne;noLigne++){
            let hauteurLigne=noLigne*this.heightSeparation-Graphe.WEIGHT_BOTTOM_LINE/2;
            if(noLigne>=0)
            this.#viewport.appendChild(line(
                this.#spaceForGraduation,
                this.#spaceForTitle+hauteurLigne*EchelleY,
                this.#spaceForGraduation+largeurGraphe*EchelleX,
                this.#spaceForTitle+hauteurLigne*EchelleY,
                "black",Graphe.WEIGHT_MIDDLE_LINE))
            this.#viewport.appendChild(text(20,this.#spaceForTitle+(hauteurGraphe-noLigne*this.heightSeparation-this.heightSeparation-10)*EchelleY,"$ "+(1+noLigne)*this.heightSeparation));
            for(let noSepatation = 1; noSepatation < this.nbreSubSeparation && noLigne>=0; noSepatation++){
                let hauteurSubSeparation=noSepatation*hauteurGraphe/(this.nbreSubSeparation*nbrLigne);
                this.#viewport.appendChild(line(
                    this.#spaceForGraduation,
                this.#spaceForTitle+(hauteurLigne+hauteurSubSeparation)*EchelleY,
                this.#spaceForGraduation+largeurGraphe*EchelleX,
                this.#spaceForTitle+(hauteurLigne+hauteurSubSeparation)*EchelleY,
                "black",Graphe.WEIGHT_SUB_LINE))
            }
        }
        return hauteurGraphe;
    }
    print(){
        let hauteurGraphe=this.#makeGraphe();//construit le graphe vide
        this.#data.forEach(({name,data},index)=>{
            let color=this.calculateColor(data);
            let posX=this.separationData*(1+index)+index*this.weightData+30;
            this.#viewport.appendChild(
                rect(
                    this.#spaceForGraduation+(posX-this.weightData/2)*EchelleX,
                    this.#spaceForTitle+hauteurGraphe*EchelleY-Graphe.WEIGHT_BOTTOM_LINE/2,
                    this.weightData*EchelleX,
                    data*EchelleY-Graphe.WEIGHT_BOTTOM_LINE/2,
                    color)
                // line(this.#spaceForGraduation+posX*EchelleX,
                //     this.#spaceForTitle+hauteurGraphe*EchelleY-Graphe.WEIGHT_BOTTOM_LINE/2,
                //     this.#spaceForGraduation+posX*EchelleX,
                //     this.#spaceForTitle+(hauteurGraphe-data)*EchelleY-Graphe.WEIGHT_BOTTOM_LINE/2,
                //     color,this.weightData*EchelleX)
                );
                this.#viewport.appendChild(text(
                    this.#spaceForGraduation+EchelleX*(posX-this.weightData*1/3),
                    this.#spaceForTitle+hauteurGraphe*EchelleY+this.#spaceForAnnotation,
                    name,
                    this.orientationText))
        })
    }
}
init_UI();


function init_UI() {
    insertViewPort("graphContainer");
    main();
}

function insertViewPort(containerId) {
    viewport = document.createElementNS(svgns, "svg");
    viewport.setAttribute("id", "viewport");
    viewport.setAttribute("viewBox", "0 0 " + ViewPortMaxUnitX + " " + ViewPortMaxUnitY);
    document.getElementById(containerId).appendChild(viewport);
}
function main() {
    let mois = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
    let ventes = [6500, 5550, 4200, 4525, 2500, 1500, 500, 1000, 1750, 2300, 3700, 3500];
    function addValues(mois, ventes) {
        if (mois.length !== ventes.length) {
            throw new Error("Les tableaux n'ont pas la même longueur");
        }
        for (let i = 0; i < mois.length; i++) {
            graphe.addData(mois[i], ventes[i]);
        }
      }

    graphe=new Graphe("Ventes 2022",viewport);
    addValues(mois,ventes)
    graphe.addRuleColor((data)=>data>=4500,"green")
    graphe.addRuleColor((data)=>data>3000,"yellow")
    graphe.addRuleColor((data)=>data>1000,"orange")
    graphe.delfaultColor="red"
    graphe.print()
}
function line(x1, y1, x2, y2, stroke = "black", strokeWidth = 1) {
    let line = document.createElementNS(svgns, "line");
    line.setAttribute("x1", x1); line.setAttribute("y1", y1);
    line.setAttribute("x2", x2); line.setAttribute("y2", y2);
    line.setAttribute("stroke", stroke);
    line.setAttribute("stroke-width", strokeWidth);
    return line;
}
// modifiée
function rect(x, y, width, height, fill = "white", stroke = "black", strokeWidth = 1) {
    let rect = document.createElementNS(svgns, "rect");
    rect.setAttribute("x", x); rect.setAttribute("y", y-height);
    rect.setAttribute("width", width); rect.setAttribute("height", height);
    rect.setAttribute("fill", fill); rect.setAttribute("stroke", stroke);
    rect.setAttribute("stroke-width", strokeWidth);
    return rect;
}
function text(x, y, content, angle = 0, size = "1", fill = "black") {
    let text = document.createElementNS(svgns, "text");
    text.setAttribute("x", x); text.setAttribute("y", y);
    text.setAttribute("transform", `rotate(${angle},${x},${y})`);
    text.setAttribute("font-size", size + "em");
    text.setAttribute("fill", fill);
    text.innerHTML = content;
    return text;
}