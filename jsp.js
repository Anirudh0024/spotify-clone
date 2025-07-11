// let btn=document.querySelector("button");
// let ul=document.querySelector("ul");
// let input=document.querySelector("input");

// btn.addEventListener("click",function(){
//     let items=document.createElement("li");
//     items.innerText=input.value;
//     let dbtn=document.createElement("button");
//     dbtn.innerText="Delete";
//     items.appendChild(dbtn);
//     input.value="";
//    ul.appendChild(items);
// });

// ul.addEventListener("click",function(e){
//     if(e.target.nodeName=="BUTTON"){
//         e.target.parentElement.remove();
//     }
// })

// // let dbtns=document.querySelectorAll(".delete");
// // for(dbtns of dbtns){
// //     dbtns.addEventListener("click",function(){
// //         // console.log("element  deleted");
// //         let par=this.parentElement;
// //         console.log(par);
// //         par.remove();
// //     })
// // }




let gameseq=[];
let userseq=[];
let started=false;
let level=0;
let h2=document.querySelector("h2");
let btns=["red","yellow","purple","green"];
document.addEventListener("keypress",function(){
    if(started==false){
        console.log("started");
        started=true;
        levelup();

    }
})

function levelup(){
    userseq=[];
    level++;
h2.innerText=`level ${level}`;



// choosing random button
let randomindex=Math.floor(Math.random()*3);
let randomcolor=btns[randomindex];

let randombtn=document.querySelector(`.${randomcolor}`)
// console.log(randombtn);
// console.log(randomcolor);
// console.log(randomindex)
gameseq.push(randomcolor);
console.log(gameseq);
flash(randombtn);
}

function flash(btn){
    btn.classList.add("flash");
    setTimeout(function(){
        btn.classList.remove("flash");
    },250)
}
function userflash(btn){
    btn.classList.add("userflash");
    setTimeout(function(){
        btn.classList.remove("userflash");
    },250)
}

function checkAns(index){
    // console.log(`current level ${level}`)
   
    if(userseq[index]==gameseq[index]){
       if(userseq.length==gameseq.length){
       setTimeout(levelup,1000)
       }
    }else{
        h2.innerHTML=`Game over! Your score was <b>${level}</b> <br> Press any key  to start`
        reset();
        document.querySelector("body").style.backgroundColor="red";
        setTimeout(function(){
            document.querySelector("body").style.backgroundColor="white";
        },150)
    }
}

function btnpress(){
   let btn=this;
   userflash(btn);

  let userColor=btn.getAttribute("id");
   userseq.push(userColor);
   checkAns(userseq.length-1);
}
let allbtns=document.querySelectorAll(".btn");
for(btn of  allbtns){
    btn.addEventListener("click",btnpress)
}
function reset(){
     started=false;
    gameseq=[];
    userseq=[];
    level=0
}