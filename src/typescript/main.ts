// @ts-ignore
axios
  .get(
    'https://spreadsheets.google.com/feeds/cells/1CBEmRrqH8W-wsNDHq7G5_-vMTJvFYbt-h6NsEViMLHY/1/public/full?alt=json',
  )
  .then(response => {
    //entries with garbage
    const entries_wg = response.data.feed.entry;

    //cleaning
    var entries = clean_entries(entries_wg);

    // loading data into the page
    load_into_html(entries);

    // moving to the relevant meal
    move();

    // set to reload after a certain amount of time
    setToReload();
  });

// cleaning up entries
function clean_entries(entries_wg) {
  return entries_wg.map(entry => {
    // time case
    if (entry['gs$cell']['col'] == '1' && entry['gs$cell']['row'] != '1') {
      var date_time: string = entry['content']['$t'];
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
      var date: string = date_time.slice(0, date_time.indexOf(' ')).trim();
      if (date == today) {
        entry['content']['$t'] =
          'today ' + date_time.slice(date_time.indexOf(' '));
      } else if (date == '2') {
        entry['content']['$t'] =
          'yesterday ' + date_time.slice(date_time.indexOf(' '));
      }
    }

    return {
      col: entry['gs$cell']['col'],
      row: entry['gs$cell']['row'],
      value: entry['content']['$t'],
    };
  });
}

//function for loading the data into html
function load_into_html(entries) {
  var sections = document.getElementsByTagName('section');
  var noof_canteens = entries.length / 6 - 1;
  for (let section in sections) {
    for (let i = 0; i < noof_canteens; i++) {
      if (typeof sections[section] == 'object') {
        sections[section].innerHTML +=
          '<div class=canteen-card><span class=canteen-name>' +
          table(entries, 2, i + 2) +
          '</span><br /><span class=timestamp><img class="icon" src="./static/icons/approve-and-update.png"/>' +
          table(entries, 1, i + 2) +
          '</span><br /><br/><span class=menu>' +
          table(entries, parseInt(section) + 3, i + 2) +
          '</span></div>';
      }
    }
  }
}

// function to directly get data from it like an array
function table(entries, col, row) {
  return entries.filter(entry => {
    return entry['col'] == col.toString() && entry['row'] == row.toString();
  })[0]['value'];
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

// Dark theme handling
const theme = localStorage.getItem('theme');
if (theme === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
}

const userPrefers = getComputedStyle(document.documentElement).getPropertyValue(
  'content',
);

if (theme === 'dark') {
  document.getElementById('theme-toggle').innerHTML = '<img src="./static/icons/theme-toggle-light.svg">';
} else if (theme === 'light') {
  document.getElementById('theme-toggle').innerHTML = '<img src="./static/icons/theme-toggle-dark.svg">';
} else if (userPrefers === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
  window.localStorage.setItem('theme', 'dark');
  document.getElementById('theme-toggle').innerHTML = '<img src="./static/icons/theme-toggle-light.svg">';
} else {
  document.documentElement.setAttribute('data-theme', 'light');
  window.localStorage.setItem('theme', 'light');
  document.getElementById('theme-toggle').innerHTML = '<img src="./static/icons/theme-toggle-dark.svg">';
}

function modeSwitcher() {
  let currentMode = document.documentElement.getAttribute('data-theme');
  if (currentMode === 'dark') {
    document.documentElement.setAttribute('data-theme', 'light');
    window.localStorage.setItem('theme', 'light');
    document.getElementById('theme-toggle').innerHTML = '<img src="./static/icons/theme-toggle-dark.svg">';
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    window.localStorage.setItem('theme', 'dark');
  document.getElementById('theme-toggle').innerHTML = '<img src="./static/icons/theme-toggle-light.svg">';
  }
}
