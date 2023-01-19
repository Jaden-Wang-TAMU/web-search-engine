const myStrings = require('./webCrawl.js');

myStrings.crawlHTML("https://en.wikipedia.org/wiki/Cricket_World_Cup")

//myStrings.crawlHTML("https://www.electronjs.org/docs/latest/tutorial/quick-start")

// myStrings.crawlHTML("https://www.katyisd.org/")

// myStrings.crawlHTML("https://www.britannica.com/sports/Cricket-World-Cup")

// myStrings.crawlHTML("https://yugioh.fandom.com/wiki/Blue-Eyes_White_Dragon")

// myStrings.crawlHTML("https://kagerouproject.fandom.com/wiki/Shuuya_Kano")

// myStrings.crawlHTML("https://genius.com/The-longest-johns-wellerman-lyrics")

const express = require('express');
const app = express();
const port = 3001;
app.get('/', (req, res) => {
    let s=req.query.s;
    let key=req.query.key;
    if(key==null)
        res.send("No given key")
    if(key!=undefined && key!=null && key=="password")
    {
        var fs = require('fs');
        let webContents=[]
        fs.readFile('webContents.csv', 'utf8' , (err, data) => {
            const dataArray = data.split(/\r?\n/);
            for(element of dataArray)
            {
                webContents.push(element)
            }
            if (err) {
                console.error(err)
                return
            }
            let listResults=[]
            let keyword=s;            
            let count=req.query.count;
            for(let y=1; y<751; y++){
                let splitter=webContents[y].split(",\t")
                console.log(splitter[1])
                let rawData = splitter[0];//Change to not get the actual website, just use csv file, splitter[0]                        
                let score=0;
                let ps=[];
                let p2s=[];
                let as=[];
                let bs=[];
                let b2s=[];
                let strongs=[];
                let strong2s=[];
                let is=[];
                let i2s=[];
                let ems=[];
                let em2s=[]
                let h3s=[];
                let h32s=[];
                let h4s=[];
                let h42s=[];
                let h5s=[];
                let h52s=[];
                let h2s=[];
                let h22s=[];
                let h1s=[];
                let h12s=[];
                let ts=[];
                let t2s=[];

                for(let x=6; x<rawData.length-6; x++){
                    if(rawData[x-1]=="<"){
                        if(rawData[x]=="p")
                            ps.push(x+2);
                        if(rawData[x]=="b" && rawData[x+1]==">")
                            bs.push(x+2);
                        if(rawData[x]=="i" && rawData[x+1]==">")
                            is.push(x+2);
                        if(rawData[x]=="a")
                            as.push(x+2);
                        if(rawData[x]=="e" && rawData[x+1]=="m" && rawData[x+2]==">")
                            ems.push(x+3)
                        if(rawData[x]=="h" && rawData[x+1]=="2" && rawData[x+2]==">")
                            h2s.push(x+3)
                        if(rawData[x]=="h" && rawData[x+1]=="3" && rawData[x+2]==">")
                            h3s.push(x+3)
                        if(rawData[x]=="h" && rawData[x+1]=="4" && rawData[x+2]==">")
                            h4s.push(x+3)
                        if(rawData[x]=="h" && rawData[x+1]=="5" && rawData[x+2]==">")
                            h5s.push(x+3)
                        if(rawData[x]=="h" && rawData[x+1]=="1" && rawData[x+2]==">")
                            h1s.push(x+3)
                        if(rawData[x]=="s" && rawData[x+1]=="t" && rawData[x+2]=="r" && rawData[x+3]=="o" && rawData[x+4]=="n" && rawData[x+5]=="g")
                            strongs.push(x+7);
                        if(rawData[x]=="t" && rawData[x+1]=="i" && rawData[x+2]=="t" && rawData[x+3]=="l" && rawData[x+4]=="e")
                            ts.push(x+6);                
                        if(rawData[x]=="/")
                        {
                            if(rawData[x+1]=="p" && rawData[x+2]==">")
                                p2s.push(x-1)
                            if(rawData[x+1]=="b" && rawData[x+2]==">")
                                b2s.push(x-1)
                            if(rawData[x+1]=="i" && rawData[x+2]==">")
                                i2s.push(x-1)
                            if(rawData[x+1]=="e" && rawData[x+2]=="m")
                                em2s.push(x-1)
                            if(rawData[x+1]=="h" && rawData[x+2]=="2")
                                h22s.push(x-1)
                            if(rawData[x+1]=="h" && rawData[x+2]=="3")
                                h32s.push(x-1)
                            if(rawData[x+1]=="h" && rawData[x+2]=="4")
                                h42s.push(x-1)
                            if(rawData[x+1]=="h" && rawData[x+2]=="5")
                                h52s.push(x-1)
                            if(rawData[x+1]=="h" && rawData[x+2]=="1")
                                h12s.push(x-1)                    
                            if(rawData[x+1]=="s" && rawData[x+2]=="t" && rawData[x+3]=="r" && rawData[x+4]=="o" && rawData[x+5]=="n" && rawData[x+6]=="g" && rawData[x+7]==">")
                                strong2s.push(x-1);
                            if(rawData[x+1]=="t" && rawData[x+2]=="i" && rawData[x+3]=="t" && rawData[x+4]=="l" && rawData[x+5]=="e")
                                t2s.push(x-1);
                        }
                    }
                }

                for(let x=0; x<ps.length; x++){
                    let p=rawData.substring(ps[x], p2s[x]);
                    if(p.includes(keyword))
                        score+=1;
                }

                for(element of as)
                {
                    let current=element;
                    let notFound=true;
                    while(notFound)
                    {
                        if(rawData[current]==">")
                            notFound=false
                        else
                            current++;
                    }
                    let p=rawData.substring(element, current)
                    if(p.includes(keyword)){
                        score+=2
                    }
                }
        
                for(let x=0; x<bs.length; x++){
                    let p=rawData.substring(bs[x], b2s[x]);
                    if(p.includes(keyword))
                        score+=1;
                }
        
                for(let x=0; x<strongs.length; x++){
                    let p=rawData.substring(strongs[x], strong2s[x]);
                    if(p.includes(keyword))
                        score+=2;
                }
        
                for(let x=0; x<is.length; x++){
                    let p=rawData.substring(is[x], i2s[x]);
                    if(p.includes(keyword))
                        score+=2;
                }
        
                for(let x=0; x<ems.length; x++){
                    let p=rawData.substring(ems[x], em2s[x]);
                    if(p.includes(keyword))
                        score+=2;
                }
                
                for(let x=0; x<h2s.length; x++){
                    let p=rawData.substring(h2s[x], h22s[x]);
                    if(p.includes(keyword))
                        score+=4;
                }
                
                for(let x=0; x<h3s.length; x++){
                    let p=rawData.substring(h3s[x], h32s[x]);
                    if(p.includes(keyword))
                        score+=3;
                }
                
                for(let x=0; x<h4s.length; x++){
                    let p=rawData.substring(h4s[x], h42s[x]);
                    if(p.includes(keyword))
                        score+=3;
                }
                
                for(let x=0; x<h5s.length; x++){
                    let p=rawData.substring(h5s[x], h52s[x]);
                    if(p.includes(keyword))
                        score+=3;
                }
                
                for(let x=0; x<h1s.length; x++){
                    let p=rawData.substring(h1s[x], h12s[x]);
                    if(p.includes(keyword))
                        score+=5;
                }
        
                for(let x=0; x<ts.length; x++){
                    let p=rawData.substring(ts[x], t2s[x]);
                    if(p.includes(keyword))
                        score+=10;
                }
                console.log(keyword+" Final Score: "+score+", title: "+splitter[3]+"\n")
                let temp={"url": splitter[1], "title":splitter[3], "score":score}
                listResults.push(temp)
            }
            let finResult=[]
            if(count==null)
            {
                while(finResult.length<10)
                {
                    let max=0
                    let maxElement={}
                    for(element of listResults)
                    {
                        if(element.score>max)
                        {
                            max=element.score
                            maxElement=element
                        }
                    }
                    finResult.push(maxElement)
                    for(let i=0; i<listResults.length; i++)
                    {
                        if(listResults[i]==maxElement)
                        {
                            listResults.splice(i, 1)
                        }
                    }
                }
                res.json({"number of results": 10, "keyword": String(s), "results": finResult,})
            }
            else
            {
                while(finResult.length<count)
                {
                    let max=0
                    let maxElement={}
                    for(element of listResults)
                    {
                        if(element.score>max)
                        {
                            max=element.score
                            maxElement=element
                        }
                    }
                    finResult.push(maxElement)
                    for(let i=0; i<listResults.length; i++)
                    {
                        if(listResults[i]==maxElement)
                        {
                            listResults.splice(i, 1)
                        }
                    }
                }
                res.json({"number of results": parseInt(count), "keyword": String(s), "results": finResult,})
            }
        })
    }
    else
    {
        res.send("Incorrect Password")
    }       
});
app.listen(port, () => console.log(`Hello world app listening on port ${port}!`)) 
