const plan = {
  "06-24":[["prov",24],["phil",1],["1kings",11],["1kings",12]],
  "06-25":[["prov",25],["phil",2],["1kings",13],["1kings",14]],
  "06-26":[["prov",26],["phil",3],["2chron",10],["2chron",11]],
  "06-27":[["prov",27],["phil",4],["2chron",12],["2chron",13]],
  "06-28":[["prov",28],["col",1],["2chron",14],["2chron",15]],
  "06-29":[["prov",29],["col",2],["2chron",16],["2chron",17]],
  "06-30":[["prov",30],["col",3],["2chron",18],["2chron",19]],

  "07-01":[["prov",31],["col",4],["1kings",15],["1kings",16]],
  "07-02":[["ps",1],["matt",1],["1kings",17],["1kings",18]],
  "07-03":[["ps",2],["matt",2],["1kings",19],["1kings",20]],
  "07-04":[["ps",3],["matt",3],["1kings",21],["1kings",22]],
  "07-05":[["ps",4],["matt",4],["2chron",20],["2chron",21]],
  "07-06":[["ps",5],["matt",5],["2kings",1],["2kings",2]],
  "07-07":[["ps",6],["matt",6],["2kings",3],["2kings",4]],
  "07-08":[["ps",7],["matt",7],["2kings",5],["2kings",6]],
  "07-09":[["ps",8],["matt",8],["2kings",7],["2kings",8]],
  "07-10":[["ps",9],["matt",9],["obad",1]],
  "07-11":[["ps",10],["matt",10],["2chron",22]],
  "07-12":[["ps",11],["matt",11],["joel",1],["joel",2],["joel",3]],
  "07-13":[["ps",12],["matt",12],["2kings",9],["2kings",10]],
  "07-14":[["ps",13],["matt",13],["2kings",11],["2kings",12]],
  "07-15":[["ps",14],["matt",14],["2kings",13],["2kings",14]],
  "07-16":[["ps",15],["matt",15],["jonah",1],["jonah",2],["jonah",3],["jonah",4]],
  "07-17":[["ps",16],["matt",16],["amos",1],["amos",2]],
  "07-18":[["ps",17],["matt",17],["amos",3],["amos",4],["amos",5]],
  "07-19":[["ps",18],["matt",18],["amos",6],["amos",7]],
  "07-20":[["ps",19],["matt",19],["amos",8],["amos",9]],
  "07-21":[["ps",20],["matt",20],["2chron",23],["2chron",24]],
  "07-22":[["ps",21],["matt",21],["2chron",25],["2chron",26]],
  "07-23":[["ps",22],["matt",22],["isa",1],["isa",2]],
  "07-24":[["ps",23],["matt",23],["isa",3],["isa",4]],
  "07-25":[["ps",24],["matt",24],["isa",5],["isa",6]],
  "07-26":[["ps",25],["matt",25],["2chron",27],["2chron",28]],
  "07-27":[["ps",26],["matt",26],["2kings",15],["2kings",16]],
  "07-28":[["ps",27],["matt",27],["isa",7],["isa",8]],
  "07-29":[["ps",28],["matt",28],["isa",9],["isa",10]],
  "07-30":[["ps",29],["1thess",1],["isa",11],["isa",12]],
  "07-31":[["ps",30],["1thess",2],["isa",13],["isa",14]]
};

const books = {
  ps:{ru:"Пс",uk:"Пс",en:"Psalms",query:"Psalms"},
  prov:{ru:"Притч",uk:"Прип",en:"Proverbs",query:"Proverbs"},
  matt:{ru:"Мф",uk:"Мт",en:"Matthew",query:"Matthew"},
  phil:{ru:"Флп",uk:"Флп",en:"Philippians",query:"Philippians"},
  col:{ru:"Кол",uk:"Кол",en:"Colossians",query:"Colossians"},
  "1kings":{ru:"3 Цар",uk:"3 Цар",en:"1 Kings",query:"1 Kings"},
  "2kings":{ru:"4 Цар",uk:"4 Цар",en:"2 Kings",query:"2 Kings"},
  "2chron":{ru:"2 Пар",uk:"2 Хр",en:"2 Chronicles",query:"2 Chronicles"},
  obad:{ru:"Авд",uk:"Авд",en:"Obadiah",query:"Obadiah"},
  joel:{ru:"Иоил",uk:"Йоіл",en:"Joel",query:"Joel"},
  jonah:{ru:"Иона",uk:"Йона",en:"Jonah",query:"Jonah"},
  amos:{ru:"Ам",uk:"Ам",en:"Amos",query:"Amos"},
  isa:{ru:"Ис",uk:"Іс",en:"Isaiah",query:"Isaiah"},
  "1thess":{ru:"1 Фес",uk:"1 Сол",en:"1 Thessalonians",query:"1 Thessalonians"}
};

const versions = {
  ru:"RUSV",
  uk:"UKR",
  en:"ESV"
};
