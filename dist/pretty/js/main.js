function setToReload() {
    var hours = new Date().getHours();
    var milliSecsToWait = 0;
    if (hours < 9) {
        milliSecsToWait = (9 - hours) * 60 * 60 * 1000;
    }
    else if (hours < 14) {
        milliSecsToWait = (14 - hours) * 60 * 60 * 1000;
    }
    else if (hours < 19) {
        milliSecsToWait = (19 - hours) * 60 * 60 * 1000;
    }
    else {
        milliSecsToWait = (24 - hours + 9) * 60 * 60 * 1000;
    }
    setTimeout(function () {
        history.go();
    }, milliSecsToWait);
}
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
    .then(function (response) {
    //entries with garbage
    var entries_wg = response.data.feed.entry;
    //cleaning
    var entries = clean_entries(entries_wg);
    // loading data into the page
    load_into_html(entries);
    // moving to the relevant location
    move();
    // set to reload after a certain amount of time
    setToReload();
});
// cleaning up entries
function clean_entries(entries_wg) {
    return entries_wg.map(function (entry) {
        // time case
        if (entry['gs$cell']['col'] == '1' && entry['gs$cell']['row'] != '1') {
            var date_time = entry['content']['$t'];
            var now = new Date();
            var today = (now.getMonth() + 1).toString() + "/" + now.getDate().toString() + "/" + now.getFullYear().toString();
            now.setDate(now.getDate() - 1); // going a day back
            var yesterday = (now.getMonth() + 1).toString() + "/" + now.getDate().toString() + "/" + now.getFullYear().toString();
            var date = date_time.slice(0, 9);
            if (date == today) {
                entry['content']['$t'] = "today " + date_time.slice(date_time.indexOf(" "));
            }
            else if (date == '2') {
                entry['content']['$t'] = "yesterday " + date_time.slice(date_time.indexOf(" "));
            }
        }
        // other cases
        return {
            col: entry['gs$cell']['col'],
            row: entry['gs$cell']['row'],
            value: entry['content']['$t']
        };
    });
}
// function to directly get data from it like an array
function table(entries, col, row) {
    return entries.filter(function (entry) {
        return entry['col'] == col.toString() && entry['row'] == row.toString();
    })[0]['value'];
}
//function for loading the data into html
function load_into_html(entries) {
    var sections = document.getElementsByTagName('section');
    var noof_canteens = entries.length / 6 - 1;
    for (var section in sections) {
        for (var i = 0; i < noof_canteens; i++) {
            if (typeof sections[section] == 'object') {
                sections[section].innerHTML +=
                    '<div class=canteen-card><span class=canteen-name>' +
                        table(entries, 2, i + 2) +
                        '</span><br /><span class=timestamp>Updated ' +
                        table(entries, 1, i + 2) +
                        '</span><br /><br/><span class=menu>' +
                        table(entries, parseInt(section) + 3, i + 2) +
                        '</span></div>';
            }
        }
    }
}
