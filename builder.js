document.addEventListener("DOMContentLoaded", function(){
    document.getElementById('submit-button').addEventListener('click', ()=>{
        submit();
    });
});


function submit(){
    let keyWord=document.getElementById('keyWord').value;
    let count=document.getElementById('count').value;
    let password=document.getElementById('password').value;
    console.log(keyWord+" "+count+" "+password)
    if(keyWord!="" || password!="password")
    {
        if(count!=""){
            window.open("http://localhost:3001/?s="+keyWord+"&key="+password+"&count="+count, "_self");
        }
        else{
            window.open("http://localhost:3001/?s="+keyWord+"&key="+password, "_self");
        }
    }
    else
        window.open("http://localhost:3001");
}
