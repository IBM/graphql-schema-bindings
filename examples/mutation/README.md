mutation add($id: ID!, $name: String!) {
  	add(id: $id, name: $name) {
    	id
    	name
    }
}

{
  "id":3,
  "name":"carol"
}