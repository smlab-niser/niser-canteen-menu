window.onload = move;
function move() {
    //moving to section according to time
    var hours = new Date().getHours();
    var section_no = 0;
    var sections = document.getElementsByTagName('section');
    if (hours >= 22 || hours < 10) {
        // breakfast case
        console.log('breakfast');
    }
    else if (hours >= 10 && hours < 14) {
        // lunch case
        section_no = 1;
        console.log('lunch');
    }
    else if (hours >= 14 && hours < 18) {
        // snacks case
        section_no = 2;
        console.log('snacks');
    }
    else {
        // dinner case
        section_no = 3;
        console.log('dinner');
    }
    var location = '-' + section_no.toString() + '00vw';
    sections[0].style['margin-left'] = location;
    sections[1].style['margin-left'] = location;
    sections[2].style['margin-left'] = location;
    sections[3].style['margin-left'] = location;
}
// filling in data
// @ts-ignore
axios
    .get('https://spreadsheets.google.com/feeds/cells/1CBEmRrqH8W-wsNDHq7G5_-vMTJvFYbt-h6NsEViMLHY/1/public/full?alt=json')
    .then(response => {
    //entries with garbage
    const entries_wg = response.data.feed.entry;
    //cleaning
    var entries = clean_entries(entries_wg);
    // loading data into the page
    load_into_html(entries);
});
// cleaning up entries
function clean_entries(entries_wg) {
    return entries_wg.map(entry => {
        return {
            col: entry['gs$cell']['col'],
            row: entry['gs$cell']['row'],
            value: entry['content']['$t'],
        };
    });
}
// function to directly get data from it like an array
function table(entries, col, row) {
    return entries.filter(entry => {
        return entry['col'] == col.toString() && entry['row'] == row.toString();
    })[0]['value'];
}
//function for loading the data into html
function load_into_html(entries) {
    var sections = document.getElementsByTagName('section');
    for (let j = 0; j < 4; j++) {
        var canteen_cards = sections[j].getElementsByClassName('canteen-card');
        for (let i = 0; i < 4; i++) {
            // the hostel name
            canteen_cards[i].getElementsByClassName('canteen-code')[0].innerHTML = table(entries, 2, i + 2);
            // the menu
            canteen_cards[i].getElementsByClassName('menu')[0].innerHTML = table(entries, j + 3, i + 2);
            // the timestamp
            canteen_cards[i].getElementsByClassName('canteen-name')[0].innerHTML =
                ' last updated on ' + table(entries, 1, i + 2);
        }
    }
}
