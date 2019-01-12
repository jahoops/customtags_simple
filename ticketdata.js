
var cats =['DVD','Monitor','Notebook','Mouse','Keyboard'];
function getRandom(low, high) {
    return Math.floor((Math.random() * high) + low);
}
function randomCat() {
    return cats[getRandom(0,4)];
}
function randomDue() {
    return getRandom(0,100);
}

function getTickets(howMany) {
    var tickets = [];
    var startingNumber = 100000;
    for(var i=0; i<howMany; i++) {
        tickets.push({ ticketNo:startingNumber++,category:randomCat(),dueNumber:randomDue() });
    }
    return tickets;
}

