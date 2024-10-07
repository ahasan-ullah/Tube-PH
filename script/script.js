const loadCategories=()=>{
  fetch('https://openapi.programming-hero.com/api/phero-tube/categories')
  .then(res=>res.json())
  .then(data=>displayCategories(data.categories))
  .catch(err=>console.log(err));
};

const loadVideos=(seachText="")=>{
  fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${seachText}`)
  .then(res=>res.json())
  .then(data=>displayVideos(data.videos))
  .catch(err=>console.log(err));
};

const removeActiveClass=()=>{
  const buttons=document.getElementsByClassName('btn-category');
  for(const btn of buttons){
    btn.classList.remove('active');
  }
}

const displayCategories=(categories)=>{
  const categoryContainer=document.getElementById('categories');
  categories.forEach((item)=>{
    // const button=document.createElement('button');
    // button.classList='btn';
    // button.innerText=item.category;
    // button.onclick=()=>{
    //   alert('Hello');
    // }
    const buttonContainer=document.createElement('div');
    buttonContainer.innerHTML=
    `
    <button id="btn-${item.category_id}" onclick="loadCategoryVideos(${item.category_id})" class="btn btn-category">
      ${item.category}
    </button>
    `
    categoryContainer.append(buttonContainer);
  });
};

const loadCategoryVideos=id=>{
  fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
  .then(res=>res.json())
  .then(data=>{
    removeActiveClass();
    const activeBtn=document.getElementById(`btn-${id}`);
    activeBtn.classList.add('active');
    displayVideos(data.category);
  })
  .catch(err=>console.log(err));
};

const getTimeString=time=>{
  const hour=parseInt(time/3600);
  let remainingSeconds=time%3600;
  const minute=parseInt(remainingSeconds/60);
  remainingSeconds=remainingSeconds%60;
  return `${hour} hours ${minute} minutes ${remainingSeconds} seconds ago`;
};

const displayVideos=(videos)=>{
  const videoContainer=document.getElementById('videos');
  videoContainer.innerHTML="";

  if(videos.length==0){
    videoContainer.classList.remove('grid');
    videoContainer.innerHTML=`
    <div class="min-h-[300px] w-full flex flex-col gap-5 justify-center items-center">
      <img src="./assets/Icon.png"/>
      <h2 class="text-center text-xl font-bold">Oops!! Sorry, There is no content here</h2>
    </div>
    `;
    return;
  }
  else{
    videoContainer.classList.add('grid');
  }

  for(const video of videos){
    const card=document.createElement('div');
    card.classList='card card-compact';
    card.innerHTML=`
    <figure class="h-[200px] relative">
    <img
      src=${video.thumbnail}
      alt="Shoes" class="h-full w-full object-cover"/>
      ${
        video.others.posted_date
        .length==0 ? "" 
        :`<span class="absolute right-2 bottom-2 bg-black rounded p-1 text-white text-xs">
        ${getTimeString(video.others.posted_date)}
        </span>`
      };
    </figure>
    <div class="px-0 py-2 flex gap-2">
      <div>
        <img class="w-10 h-10 rounded-full object-cover" src=${video.authors[0].profile_picture}/>
      </div>
      <div>
        <h2 class="font-bold">${video.title}</h2>
        <div class="flex items-center gap-2">
          <p class="text-gray-400">${video.authors[0].profile_name}</p>
          ${video.authors[0].verified==true ? '<img class="w-5" src="https://img.icons8.com/?size=48&id=D9RtvkuOe31p&format=png"/>' : ''}
        </div>
        <p><button onclick="loadDetails('${video.video_id}')" class="btn btn-sm btn-error">Details</button></p>
      </div>
    </div>
    `;
    videoContainer.append(card);
  }
};

const loadDetails=async (videoID)=>{
  const url=`https://openapi.programming-hero.com/api/phero-tube/video/${videoID}`;
  const res=await fetch(url);
  const data= await res.json();
  displayDetails(data.video);
};

const displayDetails=(video)=>{
  const detailContainer=document.getElementById("modal-content");
  detailContainer.innerHTML=`
  <img src=${video.thumbnail}/>
  <p>${video.description}</p>
  `;
  document.getElementById('customModal').showModal();
};



document.getElementById('search-input').addEventListener("keyup",(e)=>{
  loadVideos(e.target.value);
});


loadCategories();
loadVideos();