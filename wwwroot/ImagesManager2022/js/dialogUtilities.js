function getData(idContainer){
    data= $(`#${idContainer} input`);
    const dictData={}
    for(let input of data){
        if(input.type==="checkbox")
            dictData[input.id]=input.checked?1:0;
        else dictData[input.id]=$(input).val();
    }
    return dictData
}

async function getLoginToken(data){
    return new Promise((resolve,reject)=>{
        let ajax=new Ajax(location.host)
        ajax.setDefaultPath("");
        ajax.POST(data,(d)=>{
            if(data.Remember){
                localStorage.setItem("email",data.Email);
                localStorage.setItem("password",data.Password);
                localStorage.setItem("remember",data.Remember);
            }
            else{
                localStorage.removeItem("email")
                localStorage.removeItem("password")
                localStorage.removeItem("remember")
            }
            resolve(d);
        },reject,"token")
    })
}
function formatData(json, removedString, capitalFrist=true){
    let jsonReturn={};
    let entriesJson=Object.entries(json)
    const formatKey=(key)=>{
        let newKey=key.replace(removedString,"")
        if(capitalFrist){
            newKey=newKey.charAt(0).toUpperCase() + newKey.slice(1);
        }
        else{
            newKey=newKey.charAt(0).toLowerCase() + newKey.slice(1);
        }
        return newKey;
    }
    entriesJson.forEach(data=>{
        jsonReturn[formatKey(data[0])]=data[1]
    })
    return jsonReturn;
}
function sendErrorInput(){
    
    let input=[
        {
            id:"error_name",
            value:$("#name_profil").val(),
            valider:function(){return this.value!=""}
        },
        {
            id:"error_email",
            value:$("#email_profil").val(),
            valider:function(){return (new RegExp("([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)").test(this.value))}
        },
        {
            id:"error_password",
            value:$("#password_profil").val(),
            valider:function(){return this.value!="" || this.value=="" && !createMode}
        },
        {
            id:"error_confirm",
            value:$("#comfirm_profil").val(),
            valider:function(){return this.value==$("#password_profil").val()}
        }
    ];
    input.forEach(data=>{
        if(!!data.valider()){
            $(`#${data.id}`).attr("hidden",1);
        }
        else{
            $(`#${data.id}`).removeAttr("hidden");
        }
    })
}
function resetForm(idForm){
    $(`#${idForm} input`).val("")
    
}