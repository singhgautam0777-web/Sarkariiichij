/* SARKARIIICHIJ • JOB CONNECTION ENGINE */

(function(){

  const DATA = window.JOBS || [];
  const DETAIL = "job-details.html?id=";

  function clean(v){
    return String(v || "").toLowerCase();
  }

  function matches(job,q){
    if(!q) return true;
    return [
      job.title,job.org,job.dept,job.category,
      job.type,job.state,job.qualification,job.posts
    ].map(clean).join(" ").includes(clean(q));
  }

  function createCard(job){
    const card=document.createElement("article");
    card.className="vacancy-card";
    card.innerHTML=`
      <div class="vacancy-top">
        <span class="vacancy-status">${job.status||"Active"}</span>
        <span>${job.state||"All India"}</span>
      </div>
      <h3>${job.title}</h3>
      <p>${job.org||""}</p>
      <div class="vacancy-info">
        <span>📌 ${job.posts||"Various Posts"}</span>
        <span>🎓 ${job.qualification||"As per notification"}</span>
        <span>📅 Last Date: ${job.lastDate||"To Be Announced"}</span>
      </div>
      <a class="vacancy-open" href="${DETAIL}${encodeURIComponent(job.id)}">
        View Full Details →
      </a>
    `;
    return card;
  }

  function render(list,box){
    if(!box)return;
    box.innerHTML="";
    if(!list.length){
      box.innerHTML=`
        <div class="vacancy-empty">
          <strong>No vacancy found</strong>
          <p>Search another job or category.</p>
        </div>`;
      return;
    }
    list.forEach(job=>box.appendChild(createCard(job)));
  }

  function init(){
    const box=
      document.querySelector("#vacancyList") ||
      document.querySelector("#latestJobs") ||
      document.querySelector(".vacancy-grid");

    if(!box)return;

    render(DATA,box);

    const search=document.querySelector("#jobSearch");

    if(search){
      search.addEventListener("input",function(){
        render(
          DATA.filter(job=>matches(job,this.value)),
          box
        );
      });
    }
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",init);
  }else{
    init();
  }

})();
