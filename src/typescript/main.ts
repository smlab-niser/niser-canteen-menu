const csvLink = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSpgPFjsVbVak8MuXxOYEV8ezmsXC38Ki13xHcGwVt3YbFRoRSKwiRemMk9lCGOKRsDCrlYtD2ePg7V/pub?output=csv';
var request: any;
if(window.XMLHttpRequest){
  request = new XMLHttpRequest();
}else{
  request = new ActiveXObject("Microsoft.XMLHTTP");
}
const loading = true;
request.open('GET', csvLink, true);
request.send();
request.onload = function (e) {
  if (request.readyState === 4) {
    if (request.status === 200) {
      const lines = request.responseText.split("\r");
      for (const line of lines.slice(1)) {
        // Parsing the mess of a CSV file
        const rows = line.split("\",\"");
        var time = rows[0].split(",")[0].replace("\"", "").replace("\n", "").split(" ");
        time = make_date_friendly(time[0]) + " " + time[1];
        const canteen = rows[0].split(",")[1].replace("\"", "");
        const breakfast = String(rows[0].split(",").slice(2)).replace("\"", "");
        const lunch = rows[1].replace("\"", "");
        const snacks = rows[2].replace("\"", "");
        const dinner = rows[3].replace("\"", "");

        addCanteen(time, canteen, [breakfast, lunch, snacks, dinner]);
      }

      // moving to the relevant meal
      move();
      // set to reload after a certain amount of time
      setToReload();
    } else {
      console.error(request.statusText);
    }
  }
};

function make_date_friendly(date: string) {
  var now = new Date();
  var today =
    (now.getMonth() + 1).toString() +
    '/' +
    now.getDate().toString() +
    '/' +
    now.getFullYear().toString();
  now.setDate(now.getDate() - 1); // going a day back
  var yesterday =
    (now.getMonth() + 1).toString() +
    '/' +
    now.getDate().toString() +
    '/' +
    now.getFullYear().toString();
  if (date == today) {
    return 'Today';
  } else if (date == yesterday) {
    return 'Yesterday';
  }
  return date;
}

function addCanteen(time: String, canteen: String, meals: String[]) {
  var sections = document.getElementsByTagName('section');
  for (let section in sections) {
    if (typeof sections[section] == 'object') {
      sections[section].innerHTML +=
        '<div class=canteen-card><span class=canteen-name>' +
        canteen +
        '</span><br /><span class=timestamp>' +
        time +
        '</span><br /><br/><span class=menu>' +
        meals[section] +
        '</span></div>';
    }
  }
}

//moving to section according to time
function move() {
  var hours: number = new Date().getHours();
  var section_no: number = 0;
  var sections = document.getElementsByTagName('section');

  if (hours >= 22 || hours < 10) {
    // breakfast case
  } else if (hours >= 10 && hours < 14) {
    // lunch case
    section_no = 1;
  } else if (hours >= 14 && hours < 18) {
    // snacks case
    section_no = 2;
  } else {
    // dinner case
    section_no = 3;
  }

  var location = '-' + section_no.toString() + '00vw';
  sections[0].style['margin-left'] = location;
  sections[1].style['margin-left'] = location;
  sections[2].style['margin-left'] = location;
  sections[3].style['margin-left'] = location;
}

// function to reload on appropriate times
function setToReload() {
  const hours: number = new Date().getHours();
  var milliSecsToWait: number = 0;

  if (hours < 9) {
    milliSecsToWait = (9 - hours) * 60 * 60 * 1000;
  } else if (hours < 14) {
    milliSecsToWait = (14 - hours) * 60 * 60 * 1000;
  } else if (hours < 19) {
    milliSecsToWait = (19 - hours) * 60 * 60 * 1000;
  } else {
    milliSecsToWait = (24 - hours + 9) * 60 * 60 * 1000;
  }
  setTimeout(() => {
    history.go();
  }, milliSecsToWait);
}
