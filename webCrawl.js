const fetch = require("cross-fetch");

const getRawData = (URL) => {
    return fetch(URL)
       .then((response) => response.text())
       .then((data) => {
          return data;
       });
 };

const myFunctions={
    crawlHTML: (str) =>{
        let originalURL=str;
        let URL = str;
        const getLinks = async () => {
            let rawData = String(await getRawData(URL));
            let h1=0;
            let h12=0;
            let h13=0;
            for(let x=6; x<rawData.length-6; x++){
                if(rawData[x-2]=="<" && rawData[x-1]=="h" && rawData[x]=="1"){
                    h1=x;
                    break;
                }
            }
            for(let x=h1; x<rawData.length-6; x++){
                if(rawData[x]==">"){
                    h12=x+1;
                    break;
                }
            }
            for(let x=h12; x<rawData.length-6; x++){
                if(rawData[x-3]=="<" && rawData[x-2]=="/" && rawData[x-1]=="h" && rawData[x]=="1"&& rawData[x+1]==">"){
                    h13=x-3;
                    break;
                }
            }
            let title=rawData.substring(h12, h13)
            let as=[];
            let links=[];

            var fs = require('fs');
            let webContents=""
            fs.readFile('webContents.csv', 'utf8' , (err, data) => {
                if (err) {
                    console.error(err)
                    return
                }
                webContents=data;
            })

            let lines=[]

            links.push(URL)
            var minify = require('html-minifier').minify;
            var result = minify(rawData, {
               collapseWhitespace: true,
               collapseInlineTagWhitespace: true,
               removeComments:true
            });

            let result2=String(result)
            result2=result2.replace(/\<\!--\s*?[^\s?\[][\s\S]*?--\>/g,'').replace(/\>\s*\</g,'><');
            result2=result2.replace(/\n/g, '')
            result2=result2.replace(/\r/g, '')

            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
            today = mm + '/' + dd + '/' + yyyy;

            if(!webContents.includes(URL))
                lines.push("\n"+result2+",\t"+URL+",\t"+today+",\t"+title)

            for(let x=1; x<rawData.length-2; x++){
                if(rawData[x-1]=="<" && rawData[x]=="a"){
                    as.push(x+2);
                }
            }
            for(let x=0; x<as.length; x++){
                if(x<750)
                {
                    let current=as[x];
                    let start=0;
                    let notFoundStart=true;
                    let sub=rawData.substring(current)
                    if(sub.includes("href"))
                    {
                        while(notFoundStart)
                        {
                            if(rawData[current-3]=="h" && rawData[current-2]=="r" && rawData[current-1]=="e" && rawData[current]=="f")
                            {
                                start=current+3;
                                notFoundStart=false;
                            }                        
                            else
                                current++
                        }
                        current=start;
                        let notFound=true;
                        while(notFound)
                        {                            
                            if(rawData[current]=="\"" || rawData[current]=="\'")
                                notFound=false
                            else
                                current++;
                        }
                        let p=rawData.substring(start, current)
                        if(p[0]!="#")
                        {
                            if(originalURL.includes("wikipedia.org") && p.includes("/wiki/") && !p.includes("/wiki/File") && !p.includes("wikidata.org") && !p.includes("wikipedia.org") && !p.includes("mediawiki") && !p.includes("wikimedia") && !p.includes("wikinews"))
                            {
                                if(!p.includes(".png") && !p.includes(".jpg"))
                                {
                                    if(!webContents.includes("https://en.wikipedia.org"+p) && !links.includes("https://en.wikipedia.org"+p))
                                    {
                                        links.push("https://en.wikipedia.org"+p)
                                        console.log("https://en.wikipedia.org"+p)
                                    }   
                                }
                            }
                            else
                            {
                                //Look for valid URLs that are not blocked on school wifi
                                if(!p.includes("/w/index") && !p.includes("webcitation.org") && !p.includes("/wiki/File") && !p.includes("web.archive") && !p.includes("newicc") && !p.includes("geocities") && !p.includes("icc.cricket.org") && !p.includes("sixsports") && !p.includes("electronforge") && !p.includes("discord") && !p.includes("twitter") && !p.includes("publicbiapps") && !p.includes("instagram") && !p.includes("energygrowshere") && !p.includes('youtube') && !p.includes("passwordreset")  && !p.includes("facebook") && !p.includes("tumblr") && !p.includes("apps.apple") && !p.includes("tiktok"))
                                {
                                    if(!webContents.includes(p) && !p.includes(".png") && !p.includes(".jpg") && !p.includes(".js") && !p.includes(".pdf"))
                                    {
                                        if(p.includes("/docs/") && !links.includes("https://www.electronjs.org"+p))
                                        {
                                            links.push("https://www.electronjs.org/"+p)
                                            console.log("https://www.electronjs.org/"+p)
                                        }
                                        else if(p.includes("https://"))
                                        {
                                            links.push(p)
                                            console.log(p)
                                        }
                                        else if(originalURL=="https://www.katyisd.org/Pages/default.aspx" && p!="" && !links.includes("https://www.katyisd.org/"+p))
                                        {
                                            links.push("https://www.katyisd.org/"+p)
                                            console.log("https://www.katyisd.org/"+p)
                                        }
                                    }  
                                }
                            }
                        }
                    }
                }
                else
                    break;
            }

            console.log("getting more links, current number of links:"+links.length)
            
            let y=1;
            let as2=[];

            while(links.length<750){
                URL=links[y];
                console.log("new URL: "+URL)
                rawData = String(await getRawData(URL));
                if(!rawData.includes('<meta name="robots" content="noindex">'))
                {
                    for(let x=1; x<rawData.length-2; x++){
                        if(rawData[x-1]=="<" && rawData[x]=="a"){
                            as2.push(x+2);
                        }
                    }
    
                    for(let x=0; x<as2.length; x++){
                        if(x<750)
                        {
                            let current=as2[x];
                            let start=0;
                            let notFoundStart=true;
                            let sub=rawData.substring(current)
                            if(sub.includes("href"))
                            {
                                while(notFoundStart)
                                {
                                    if(rawData[current-3]=="h" && rawData[current-2]=="r" && rawData[current-1]=="e" && rawData[current]=="f"){
                                        start=current+3;
                                        notFoundStart=false;
                                    }                        
                                    else
                                        current++
                                }
                                current=start;
                                let notFound=true;
                                while(notFound)
                                {
                                    
                                    if(rawData[current]=="\"" || rawData[current]=="\'")
                                        notFound=false
                                    else
                                        current++;
                                }
                                let p=rawData.substring(start, current)
                                if(p[0]!="#"){
                                    if(originalURL.includes("wikipedia.org") && p.includes("/wiki/") && !p.includes("/wiki/File") && !p.includes("wikidata.org") && !p.includes("wikipedia.org") && !p.includes("mediawiki") && !p.includes("wikimedia") && !p.includes("wikinews"))
                                    {
                                        if(!p.includes(".png") && !p.includes(".jpg"))
                                        {
                                            if(!webContents.includes("https://en.wikipedia.org"+p) && !links.includes("https://en.wikipedia.org"+p))
                                            {
                                                links.push("https://en.wikipedia.org"+p)
                                                console.log("https://en.wikipedia.org"+p)
                                            }                                        
                                        }
                                    }
                                    else{
                                        //Look for valid URLs that are not blocked on school wifi
                                        if(!p.includes("/w/index") && !p.includes("webcitation.org") && !p.includes("/wiki/File") && !p.includes("web.archive") && !p.includes("newicc") && !p.includes("geocities") && !p.includes("icc.cricket.org") && !p.includes("sixsports") && !p.includes("electronforge") && !p.includes("discord") && !p.includes("twitter") && !p.includes("publicbiapps") && !p.includes("instagram") && !p.includes("energygrowshere") && !p.includes("youtube") && !p.includes("passwordreset") && !p.includes("facebook") && !p.includes("tumblr") && !p.includes("apps.apple") && !p.includes("tiktok"))
                                        {
                                            if(!webContents.includes(p) && !p.includes(".png") && !p.includes(".jpg") && !p.includes(".js") && !p.includes(".pdf"))
                                            {
                                                if(p.includes("/docs/") && !links.includes("https://www.electronjs.org"+p))
                                                {
                                                    links.push("https://www.electronjs.org/"+p)
                                                    console.log("https://www.electronjs.org/"+p)
                                                }
                                                else if(p.includes("https://") && !links.includes(p))
                                                {
                                                    links.push(p)
                                                    console.log(p)
                                                }
                                                else if(originalURL=="https://www.katyisd.org/Pages/default.aspx" && p!="" && !links.includes("https://www.katyisd.org/"+p))
                                                {
                                                    links.push("https://www.katyisd.org/"+p)
                                                    console.log("https://www.katyisd.org/"+p)
                                                }
                                            }                                       
                                        }
                                    }
                                }
                                if(links.length>=750)
                                    break;
                            }
                        }
                        else
                            break;
                    }        
                    console.log("current number of links:" + links.length);
                }
                y++;
                as2=[]
                if(links.length>=750)
                    break;
            }
            console.log("adding to csv file")
            for(let x=1; x<links.length; x++)
            {
                console.log(links[x])
                if(!webContents.includes(links[x]))
                {
                    try {
                        rawData=String(await getRawData(links[x]));
                        let h1=0;
                        let h12=0;
                        let h13=0;
                        for(let x=6; x<rawData.length-6; x++){
                            if(rawData[x-2]=="<" && rawData[x-1]=="h" && rawData[x]=="1"){
                                h1=x;
                                break;
                            }
                        }
                        for(let x=h1; x<rawData.length-6; x++){
                            if(rawData[x]==">"){
                                h12=x+1;
                                break;
                            }
                        }
                        for(let x=h12; x<rawData.length-6; x++){
                            if(rawData[x-3]=="<" && rawData[x-2]=="/" && rawData[x-1]=="h" && rawData[x]=="1"&& rawData[x+1]==">"){
                                h13=x-3;
                                break;
                            }
                        }
                        let title=rawData.substring(h12, h13)
                        minify = require('html-minifier').minify;
                        result = minify(rawData, {
                        collapseWhitespace: true,
                        collapseInlineTagWhitespace: true,
                        removeComments:true
                        });
                        result2=String(result)
                        result2=result2.replace(/\<\!--\s*?[^\s?\[][\s\S]*?--\>/g,'').replace(/\>\s*\</g,'><');
                        result2=result2.replace(/\n/g, '')
                        result2=result2.replace(/\r/g, '')
                        today = new Date();
                        dd = String(today.getDate()).padStart(2, '0');
                        mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0
                        yyyy = today.getFullYear();
                        today = mm + '/' + dd + '/' + yyyy;
                        lines.push("\n"+result2+",\t"+links[x]+",\t"+today+",\t"+title)                        
                        await new Promise(r=> setTimeout(r, 1000));
                    } catch (error) {
                        console.error(error);
                    }
                }
            }
            console.log("made content and date. You can now call localhost")

            for(element of lines)
            {
                fs.appendFile("webContents.csv", element, (err) => {
                    if (err) {
                      console.log(err);
                    }
                });
            }      
        }
        getLinks();
    },
}
module.exports=myFunctions;
