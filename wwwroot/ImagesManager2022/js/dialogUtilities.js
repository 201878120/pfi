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