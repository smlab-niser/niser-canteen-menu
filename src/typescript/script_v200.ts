const csvLink =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSpgPFjsVbVak8MuXxOYEV8ezmsXC38Ki13xHcGwVt3YbFRoRSKwiRemMk9lCGOKRsDCrlYtD2ePg7V/pub?output=csv";
const kaveri_form_link = "https://docs.google.com/forms/d/e/1FAIpQLSerO8nzg2LGAQbuBf4Eoz_te1oJZ8Qkzo_zXc1cYswwQ0oh1g/viewform?usp=sf_link"
const mahanadi_form_link = "https://docs.google.com/forms/d/e/1FAIpQLSdciZNQC1z_hSjiYp_V1V2HHUQHYWcG0qAvp6546j7ttCDNlQ/viewform?usp=sf_link"
const rushikulya_form_link = "https://docs.google.com/forms/d/e/1FAIpQLSddThe2b9zj5M-kjTfNRBriIgibh_yN1HIBMU07i4mtTNhRaA/viewform?usp=sf_link"

let request: any;
if (window.XMLHttpRequest) {
  request = new XMLHttpRequest();
} else {
  request = new ActiveXObject("Microsoft.XMLHTTP");
}
let loading = true;
request.open("GET", csvLink, true);
request.send();
request.onload = function (e) {
  if (request.readyState === 4) {
    if (request.status === 200) {
      const response: string = request.responseText;
      const lines = request.responseText.split("\r");
      for (const line of lines.slice(1)) {
        const line_json = CSVtoArray(line);
        let time = line_json[0].split(" ");
        time = make_date_friendly(time[0]) + " " + time[1];
        const canteen = line_json[1];
        const breakfast = line_json[2];
        const lunch = line_json[3];
        const snacks = line_json[4];
        const dinner = line_json[5];
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

function CSVtoArray(text: string) {
  const re_valid =
      /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
  const re_value =
      /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;

  // Return NULL if input string is not well formed CSV string.
  if (!re_valid.test(text)) return null;

  let a = []; // Initialize array to receive values.
  text.replace(re_value, function (m0, m1, m2, m3) {
    // Remove backslash from \' in single quoted values.
    if (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
    // Remove backslash from \" in double quoted values.
    else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
    else if (m3 !== undefined) a.push(m3);
    return ""; // Return empty string.
  });

  // Handle special case of empty last value.
  if (/,\s*$/.test(text)) a.push("");
  return a;
}

function make_date_friendly(date: string) {
  const now = new Date();
  const today =
      (now.getMonth() + 1).toString() +
      "/" +
      now.getDate().toString() +
      "/" +
      now.getFullYear().toString();
  now.setDate(now.getDate() - 1); // going a day back
  const yesterday =
      (now.getMonth() + 1).toString() +
      "/" +
      now.getDate().toString() +
      "/" +
      now.getFullYear().toString();
  if (date == today) {
    return "Today";
  } else if (date == yesterday) {
    return "Yesterday";
  }
  return date;
}

function addCanteen(time: String, canteen: String, meals: String[]) {
  if (loading) {
    document.querySelector("#skeleton").classList.add("hide");
    loading = false;
  }
  let sections = document.getElementsByTagName("section");
  for (let section in sections) {
    if (typeof sections[section] == "object") {
      let canteen_review_link = "";
      switch(canteen) {
        case "Kaveri":
          canteen_review_link = kaveri_form_link;
          break;
        case "Mahanadi":
          canteen_review_link = mahanadi_form_link;
          break;
        case "Rushikulya":
          canteen_review_link = rushikulya_form_link;
          break;
      }
      sections[section].innerHTML +=
          "<div class=canteen-card><div class=card-head><span class=canteen-name>" +
          canteen +
          "</span><a class=feedback href='"+
          canteen_review_link +
          "' target=__blank>Feedback</a></div><span class=timestamp>" +
          time +
          "</span><br /><br/><span class=menu>" +
          meals[section] +
          "</span></div>";
    }
  }
}

//moving to section according to time
function move() {
  const hours: number = new Date().getHours();
  let section_no: number = 0;
  const sections = document.getElementsByTagName("section");

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

  const location = "-" + section_no.toString() + "00vw";
  sections[0].style["margin-left"] = location;
  sections[1].style["margin-left"] = location;
  sections[2].style["margin-left"] = location;
  sections[3].style["margin-left"] = location;
}

// function to reload on appropriate times
function setToReload() {
  const hours: number = new Date().getHours();
  let milliSecsToWait: number = 0;

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
