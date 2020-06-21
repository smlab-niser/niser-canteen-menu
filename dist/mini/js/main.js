window.onload=move;function move(){var hours=new Date().getHours();var section_no=0;var sections=document.getElementsByTagName('section');if(hours>=22||hours<10){console.log('breakfast')}else if(hours>=10&&hours<14){section_no=1;console.log('lunch')}else if(hours>=14&&hours<18){section_no=2;console.log('snacks')}else{section_no=3;console.log('dinner')}var location='-'+section_no.toString()+'00vw';sections[0].style['margin-left']=location;sections[1].style['margin-left']=location;sections[2].style['margin-left']=location;sections[3].style['margin-left']=location}axios.get('https://spreadsheets.google.com/feeds/cells/1CBEmRrqH8W-wsNDHq7G5_-vMTJvFYbt-h6NsEViMLHY/1/public/full?alt=json').then(response=>{const entries_wg=response.data.feed.entry;var entries=clean_entries(entries_wg);load_into_html(entries)});function clean_entries(entries_wg){return entries_wg.map(entry=>{return{col:entry['gs$cell']['col'],row:entry['gs$cell']['row'],value:entry['content']['$t']}})}function table(entries,col,row){return entries.filter(entry=>{return entry['col']==col.toString()&&entry['row']==row.toString()})[0]['value']}function load_into_html(entries){var sections=document.getElementsByTagName('section');for(let j=0;j<4;j+=1){var canteen_cards=sections[j].getElementsByClassName('canteen-card');for(let i=0;i<4;i+=1){canteen_cards[i].getElementsByClassName('canteen-code')[0].innerHTML=table(entries,2,i+2);canteen_cards[i].getElementsByClassName('menu')[0].innerHTML=table(entries,j+3,i+2);canteen_cards[i].getElementsByClassName('canteen-name')[0].innerHTML=' last updated on '+table(entries,1,i+2)}}}
