class Ajax{
    #baseURL;
    #defaultPath;
    #headers;
    constructor(baseURL= location.host,defaultPath=""){
        this.#baseURL=baseURL;
        this.#defaultPath=defaultPath;
        this.#headers={};
    }
    setDefaultPath(newPath){
        if(typeof newPath === 'string') this.#defaultPath=newPath;
        else throw new Error("le nouveau chemin doit être une chaine de caractaire")
    }
    setHeaders(headers){
        this.#headers={...this.#headers,...headers}
    }
    GET(successCallBack, errorCallBack,action="",path="", queryString = null) {
        if(path=="") path=this.#defaultPath;
        let url = "http://"+this.#baseURL+(path!=""?"/"+path:"")+(action!=""?"/"+action:"")+ (queryString!="" ? "/?"+queryString : "");
        $.ajax({
            url: url,
            type: 'GET',
            headers:this.#headers,
            success: (data, status, xhr) => { successCallBack(data/*, xhr.getResponseHeader("ETag")*/) },
            error: function (jqXHR) { errorCallBack(jqXHR.status) }
        });
    }
    POST(data, successCallBack, errorCallBack,action="",path="", queryString = "") {
        if(path=="") path=this.#defaultPath;
        let url = "http://"+this.#baseURL+(path!=""?"/"+path:"")+(action!=""?"/"+action:"")+ (queryString!="" ? "/?"+queryString : "");
        $.ajax({
            url: url,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            headers:this.#headers,
            success: (data) => { successCallBack(data) },
            error: function (jqXHR) { errorCallBack(jqXHR.status) }
        });
    }
    PUT(data, successCallBack, errorCallBack,action="",path="", queryString = null) {
        if(path=="") path=this.#defaultPath;
        let url = "http://"+this.#baseURL+(path!=""?"/"+path:"")+(action!=""?"/"+action:"")+ (queryString!="" ? "/?"+queryString : "");
        //console.log(url)
        $.ajax({
            url: url,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(data),
            headers:this.#headers,
            success: (data) => { successCallBack(data) },
            error: function (jqXHR) { errorCallBack(jqXHR.status) }
        });
    }
    DELETE(successCallBack, errorCallBack,path="", queryString = null) {
        if(path=="") path=this.#defaultPath;
        let url = "http://"+this.#baseURL+(path!=""?"/"+path:"")+(action!=""?"/"+action:"")+ (queryString!="" ? "/?"+queryString : "");
        $.ajax({
            url: url,
            type: 'DELETE',
            headers:this.#headers,
            success: () => { successCallBack() },
            error: function (jqXHR) { errorCallBack(jqXHR.status) }
        });
    }

}

/*
function HEAD(successCallBack, errorCallBack) {
    $.ajax({
        url: baseURL,
        type: 'HEAD',
        contentType: 'text/plain',
        complete: request => { successCallBack(request.getResponseHeader('ETag')) },
        error: function (jqXHR) { errorCallBack(jqXHR.status) }
    });
}
function GET_ID(id, successCallBack, errorCallBack) {
    $.ajax({
        url: baseURL + "/" + id,
        type: 'GET',
        success: data => { successCallBack(data); },
        error: function (jqXHR) { errorCallBack(jqXHR.status) }
    });
}
*/

