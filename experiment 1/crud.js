// Initial array
let fruits = ["Apple", "Banana", "Mango"];

console.log("Initial Array:", fruits);

// CREATE - Add a new element
function create(item) {
    fruits.push(item);
    console.log(`Added "${item}" ->`, fruits);
}

// READ - Display all elements
function read() {
    console.log("Current Array:", fruits);
}

// UPDATE - Update an element at a given index
function update(index, newItem) {
    if (index >= 0 && index < fruits.length) {
        console.log(`Updated "${fruits[index]}" to "${newItem}"`);
        fruits[index] = newItem;
    } else {
        console.log("Invalid index!");
    }
    console.log("Array after update:", fruits);
}

// DELETE - Remove an element at a given index
function remove(index) {
    if (index >= 0 && index < fruits.length) {
        console.log(`Deleted "${fruits[index]}"`);
        fruits.splice(index, 1);
    } else {
        console.log("Invalid index!");
    }
    console.log("Array after delete:", fruits);
}

// --- Example usage ---
create("Orange");     // Add new item
read();               // Read all items
update(1, "Grapes");  // Update index 1
remove(2);            // Delete item at index 2
read();               // Final state
