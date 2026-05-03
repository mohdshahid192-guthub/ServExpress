import "../src/style.css"

function getOrderDetails() {
  return fetch("/api/v1/orders/order-datails",{
    credentials: "include"
  })
}

getOrderDetails()
.then(res => res.json())
.then(data => {

  console.log(data);
  
})
