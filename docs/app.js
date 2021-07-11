fetch ("./base.json")
.then(function(response){
  console.log(response);
  return response.json();
})
.then(function(data){
  console.log(data);
  console.log(data.photographers[4].city);
})
