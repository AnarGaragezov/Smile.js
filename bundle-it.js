var bundles=[];const fs=require("fs"),{execSync:execSync}=require("child_process");function addslashes(e){return(e+"").replace(/[\\"']/g,"\\$&").replace(/\u0000/g,"\\0").replace(/\n/g,"\\n").replace(/\r/g,"\\r")}bundles[0]="(function(){",bundles[1]="var moduleCache = {};",fs.readdir("./modules/",(e,n)=>{(n||[]).forEach(e=>{bundles[bundles.length]="(function(moduleCache){\n      function loadModule(module1){\n        var moduleSrc = moduleCache[module1];\n      var module = {exports:{}}\n      eval(moduleSrc);\n      return module.exports\n    }",bundles[bundles.length]=`moduleCache["${addslashes(e)}"] = '${addslashes(fs.readFileSync("./modules/"+e)+"\n//# sourceURL=smileycreations15://bundle/modules/"+e)}';`,bundles[bundles.length]="})(moduleCache);"}),bundles[bundles.length]="function loadModule(module1){\n    var moduleSrc = moduleCache[module1];\n  var module = {exports:{}}\n  eval(moduleSrc);\n  return module.exports\n}",bundles[bundles.length]=`eval('${addslashes(execSync("cat index.js")+"\n//# sourceURL=smileycreations15://bundle/index.js")}');`,bundles[bundles.length]="})();",bundles[bundles.length]="//# sourceURL=smileycreations15://bundle/raw/bundle.js",fs.writeFileSync("out.js",bundles.join("\n")),execSync("uglifyjs -o out.min.js out.js"),execSync("echo >> out.min.js;echo '//# sourceURL=smileycreations15://bundle/raw/bundle.js' >> out.min.js")});