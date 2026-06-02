function groupByCity(people) {
    let result = {}
    for(let item of people) {
        if(item.city in result) {
            result[item.city].push(item)
        } else {
            result[item.city] = [];
        }
    }
    return result;
}


const people = [
  { name: "Alice", city: "Delhi" },
  { name: "Bob", city: "Mumbai" },
  { name: "Charlie", city: "Delhi" },
  { name: "David", city: "Mumbai" }
];


console.log(groupByCity(people));
