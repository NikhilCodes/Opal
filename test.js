var temp = {
	name: "sample",
	contacts: [],

}

function deepCopy(data) {
    const copyData = {}
    for (let key of Object.keys(data)) {
        console.log(typeof data[key], Array.isArray(data[key]))
        if (Array.isArray(data[key])) {
            copyData[key] = data[key].map(deepCopy)
        } else if (typeof data[key] === 'object') {
            copyData[key]= deepCopy(data[key])
        } else {
            copyData[key] = data[key]
        }
    }

    return copyData
}

function createPerson(data, name) {
    const newData = deepCopy(data)
	newData.name = name;
	return newData;
}
 
function addContact(data, type, value) {
	data.contacts.push({
		type: type,
		value: value
	})
}
 
let a = createPerson(temp, "ram")
addContact(a, "phone", 99898878);
 
let b = createPerson(temp, "sham")
addContact(b, "phone", 7777777);
 
console.log(a, b);
// const temp1 = deepCopy(temp)
// temp.name = "Nikhil"
// console.log(temp, temp1)