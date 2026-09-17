/* SARKARIIICHIJ - GOVERNMENT JOB DATABASE */

const JOBS = [
  {
    id:"ssc-cgl-2026",
    title:"SSC CGL 2026",
    org:"Staff Selection Commission",
    dept:"SSC",
    category:"Central Govt",
    type:"Government Job",
    state:"All India",
    status:"Active",
    vacancy:"To Be Updated",
    posts:"Group B & C Posts",
    qualification:"Graduate",
    age:"As per notification",
    salary:"As per post",
    fee:"As per notification",
    start:"To Be Updated",
    lastDate:"To Be Updated",
    examDate:"To Be Announced",
    notification:"#",
    apply:"#",
    official:"#",
    admitCard:"#",
    result:"#",
    syllabus:"#",
    cutoff:"#",
    papers:"#",
    details:"SSC CGL recruitment information. Verify all dates, vacancies, fees and eligibility from the official notification."
  }
];

/* DATABASE FUNCTIONS */

function getJob(id){
  return JOBS.find(j => j.id === id);
}

function activeJobs(){
  return JOBS.filter(j => j.status === "Active");
}

function searchJobs(q){
  q = q.toLowerCase().trim();
  if(!q) return JOBS;
  return JOBS.filter(j =>
    [j.title,j.org,j.dept,j.category,j.type,j.state,j.qualification]
    .join(" ").toLowerCase().includes(q)
  );
}
