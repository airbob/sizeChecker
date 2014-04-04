/*
    LZADialog
    v1.6
*/
(function(window, undefined){

    function isFunction(arg) {
      return typeof arg === 'function';
    }

    function isObject(arg) {
      return typeof arg === 'object';
    }

    var LZADialog = {
        debug: false
    };

    var saveFileAsDOM, saveFileAsCB, saveFileAsCE = undefined;
    LZADialog.saveFileAs = function(opt, callb){
        if(LZADialog.debug){ console.log("called saveFileAs"); }
        
        var cb = arguments[arguments.length - 1];
        saveFileAsCB = (isFunction(cb))? cb : function(evt){ if(LZADialog.debug){ console.log("Missing saveFileAs callback"); } };
        var opt = (isObject(opt))? opt : {};
        
        if(saveFileAsDOM !== undefined){
            if(LZADialog.debug){ 
                console.log("removing saveFileAs prev event listener"); 
                console.log("removing saveFileAs prev input element"); 
            }
            saveFileAsDOM.removeEventListener("change", saveFileAsCE);
            document.body.removeChild(saveFileAsDOM);
        }
        else{ if(LZADialog.debug){ console.log("no saveFileAs prev elem"); } }

        var f = document.createElement("input");
        f.setAttribute("id","LZAsavefile");
        f.setAttribute("type","file");
        if(opt.filename){ f.setAttribute("nwsaveas",opt.filename); }
        else{ f.setAttribute("nwsaveas",""); }
        if(opt.workingdir){ f.setAttribute("nwworkingdir",opt.workingdir); }
        else{ f.removeAttribute("nwworkingdir"); }
        f.style.display = "none";        
        saveFileAsCE = function(evt){        
            var files = saveFileAsDOM.files;
            if(LZADialog.debug){
                console.log("called saveFileAs change");
                for (var i = 0; i < files.length; ++i){
                    console.log(files[i].path);
                }
            }
            if(files.length > 0){ 
                saveFileAsCB(files[0]);
            }
        };
        f.addEventListener("change", saveFileAsCE);        
        document.body.appendChild(f);    
        f.click();
        saveFileAsDOM = f;
    };

    var selectFileDOM, selectFileCB, selectFileCE = undefined;   
    LZADialog.selectFile = function(opt, callb){
        if(LZADialog.debug){ console.log("called selectFile"); }

        var cb = arguments[arguments.length - 1];
        selectFileCB = (isFunction(cb))? cb : function(evt){ if(LZADialog.debug){ console.log("Missing selectFile callback"); } };
        var opt = (isObject(opt))? opt : {};

        if(selectFileDOM !== undefined){ 
            if(LZADialog.debug){
                console.log("removing selectFile prev-event listener");
                console.log("removing selectFile prev input element"); 
            }
            selectFileDOM.removeEventListener("change", selectFileCE); 
            document.body.removeChild(selectFileDOM);
        }
        else{ if(LZADialog.debug){ console.log("no selectFile prev elem"); } }
        
        var f = document.createElement("input");
        f.setAttribute("id","LZAselectfile");
        f.setAttribute("type","file");
        if(opt.workingdir){ f.setAttribute("nwworkingdir",opt.workingdir); }
        else{ f.removeAttribute("nwworkingdir"); }
        if(opt.multiple){ f.setAttribute("multiple",""); }
        else{ f.removeAttribute("multiple"); }
        f.style.display = "none";
        selectFileCE = function(evt){
            var files = selectFileDOM.files;
            if(LZADialog.debug){
                console.log("called selectFile change");        
                for (var i = 0; i < files.length; ++i){
                    console.log(files[i].path);
                }
            }
            if(files.length > 0){ 
                if(opt.multiple){ selectFileCB(files); }
                else{ selectFileCB(files[0]); }
            }
        }
        f.addEventListener("change", selectFileCE);    
        document.body.appendChild(f);    
        f.click();
        selectFileDOM = f;
    };

    var selectDirDOM, selectDirCB, selectDirCE = undefined;    
    LZADialog.selectDir = function(opt, callb){
        if(LZADialog.debug){ console.log("called selectDir"); }

        var cb = arguments[arguments.length - 1];
        selectDirCB = (isFunction(cb))? cb : function(evt){ if(LZADialog.debug){ console.log("Missing selectDir callback"); } };
        var opt = (isObject(opt))? opt : {};

        if(selectDirDOM !== undefined){
            if(LZADialog.debug){
                console.log("removing selectDir prev-event listener");
                console.log("removing selectDir prev input element"); 
            }
            selectDirDOM.removeEventListener("change", selectDirCE);
            document.body.removeChild(selectDirDOM);
        }
        else{ if(LZADialog.debug){ console.log("no selectDir prev elem"); } }
        var f = document.createElement("input");
        f.setAttribute("id","LZAselectdir");
        f.setAttribute("type","file");
        if(opt.workingdir){ f.setAttribute("nwworkingdir",opt.workingdir); }
        else{ f.removeAttribute("nwworkingdir"); }
        f.setAttribute("nwdirectory","");
        f.style.display = "none";
        selectDirCE = function(evt){
            var files = f.files;
            if(LZADialog.debug){
                console.log("called selectDir change");
                for (var i = 0; i < files.length; ++i){
                    console.log(files[i].path);
                }
            }
            if(files.length > 0){ 
                selectDirCB(files[0]);
            }
        };
        f.addEventListener("change", selectDirCE);    
        document.body.appendChild(f);
        f.click();
        selectDirDOM = f;
    };

    var selectWebkitDirDOM, selectWebkitDirCB, selectWebkitDirCE = undefined;
    LZADialog.selectWebkitDir = function(opt, callb){
        if(LZADialog.debug){ console.log("called selectWebkitDir"); }

        var cb = arguments[arguments.length - 1];
        selectWebkitDirCB = (isFunction(cb))? cb : function(evt){ if(LZADialog.debug){ console.log("Missing selectWebkitDir callback"); } };
        var opt = (isObject(opt))? opt : {};

        if(selectWebkitDirDOM !== undefined){
            if(LZADialog.debug){
                console.log("removing selectWebkitDir prev-event listener");
                console.log("removing selectWebkitDir prev input element"); 
            }
            selectWebkitDirDOM.removeEventListener("change", selectWebkitDirCE);
            document.body.removeChild(selectWebkitDirDOM);
        }
        else{ if(LZADialog.debug){ console.log("no selectWebkitDir prev elem"); } }
        var f = document.createElement("input");
        f.setAttribute("id","LZAselectWebkitDir");
        f.setAttribute("type","file");
        if(opt.workingdir){ f.setAttribute("nwworkingdir",opt.workingdir); }
        else{ f.removeAttribute("nwworkingdir"); }
        f.setAttribute("webkitdirectory","");
        f.style.display = "none";
        selectWebkitDirCE = function(evt){
            var files = f.files;
            if(LZADialog.debug){
                console.log("called selectWebkitDir change");
                for (var i = 0; i < files.length; ++i){
                    console.log(files[i].path);
                }
            }
            if(files.length > 0){ 
                selectWebkitDirCB(files);
            }
        };
        f.addEventListener("change", selectWebkitDirCE);    
        document.body.appendChild(f);
        f.click();
        selectWebkitDirDOM = f;
    };
    
    window.LZADialog = LZADialog;
})(window);
