from bs4 import BeautifulSoup
import json
 
songs = []

with open("musicdb.xml") as fp:
    soup = BeautifulSoup(fp, 'lxml')
    #print(soup)
    #print(soup['mdb'])
    for tag in soup.find_all('music'):
        #print(tag.find('title').text)
        #print(tag.find('artist').text)
        #print(tag.find('difflv').text)
        #print(tag.find('series').text)
        #print(' ')
        diffs = tag.find('difflv').text.split(' ')
        print (tag.find('title').text)
        print(diffs)
        songs.append({
            "name": tag.find('title').text,
            "name_translation": '',
            "bpm": tag.find('bpmmax').text,
            "artist": tag.find('artist').text,
            "artist_translation": "",
            "folder": tag.find('series').text,
            "charts": [
                { "lvl": int(diffs[0]), "style": "single", "diffClass": "beginner" },
                { "lvl": int(diffs[1]), "style": "single", "diffClass": "basic" },
                { "lvl": int(diffs[2]), "style": "single", "diffClass": "difficult" },
                { "lvl": int(diffs[3]), "style": "single", "diffClass": "expert" },
                { "lvl": int(diffs[4]), "style": "single", "diffClass": "challenge" },
                { "lvl": int(diffs[5]), "style": "double", "diffClass": "basic" },
                { "lvl": int(diffs[6]), "style": "double", "diffClass": "difficult" },
                { "lvl": int(diffs[7]), "style": "double", "diffClass": "challenge" },
                { "lvl": int(diffs[8]), "style": "double", "diffClass": "expert" }
            ],
            "remyLink": "",
            "jacket": "",
            "genre": "",
            "saHash": "",
            "saIndex": ""
        })


# Data to be written
dictionary = {
    "meta": {
        "styles": ["single", "double"],
        "difficulties": [
            { "key": "beginner", "color": "#6eccc4" },
            { "key": "basic", "color": "#e0de5c" },
            { "key": "difficult", "color": "#e8715f" },
            { "key": "expert", "color": "#72cc6e" },
            { "key": "challenge", "color": "#cc71e8" }
        ],
        "flags": [],
        "lvlMax": 19,
        "lastUpdated": 0
        },
        "defaults": {
            "style": "single",
            "difficulties": ["expert", "challenge"],
            "flags": [],
            "lowerLvlBound": 1,
            "upperLvlBound": 19
        },
        "i18n": {
            "en": {
            "name": "DDR Omnimix",
            "single": "Single",
            "double": "Double",
            "beginner": "Beginner",
            "basic": "Basic",
            "difficult": "Difficult",
            "expert": "Expert",
            "challenge": "Challenge",
            "$abbr": {
            "beginner": "Beg",
            "basic": "Bas",
            "difficult": "Dif",
            "expert": "Exp",
            "challenge": "Cha"
            }
        },
        "ja": {
            "name": "DDR A3",
            "single": "Single",
            "double": "Double",
            "beginner": "Beginner",
            "basic": "Basic",
            "difficult": "Difficult",
            "expert": "Expert",
            "challenge": "Challenge",
            "$abbr": {
                "beginner": "Beg",
                "basic": "Bas",
                "difficult": "Dif",
                "expert": "Exp",
                "challenge": "Cha"
            }
        }
    },
    "songs": songs
}
 
# Serializing json
json_object = json.dumps(dictionary, indent=4)
 
# Writing to sample.json
with open("../src/songs/omnimix.json", "w") as outfile:
    outfile.write(json_object)