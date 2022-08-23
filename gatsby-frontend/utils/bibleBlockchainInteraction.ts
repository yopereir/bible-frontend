const bibles =  require('../data/bible_verses.json')
const books =  require('../data/books.json')
const verses: verseType[] = [];

type bookType = {
    Number: Number,
    Name: String
}
type verseType = {
    book: Number,
    chapter: Number,
    verse: Number,
    text: String
};
type bibleType = {
    id: String,
    name: String,
    verses: verseType[]
};

bibles.Bibles.forEach((bible: bibleType) => {
    bible.verses.forEach((verse: verseType) => {
        // verseIdentifier: BookNumber-ChapterNumber-verseNumber-TranslationID
        verses.push({verseIdentifier: verse.book+"-"+verse.chapter+"-"+verse.verse+"-"+bible.id, verse:verse.text})
    });
});

export function getBibleId(bibleName: String) {
    return bibles.Bibles.filter(bible=>bible.name == bibleName)[0].id;
}

export function getBookNumber(bookName: String) {
    return books.filter((book: bookType)=>book.Name == bookName)[0].Number;
}

export function getVerseNumber(verseIdentifier: String) {
    return bibles.Bibles[0].verses.indexOf(bibles.Bibles[0].verses.filter((verse: verseType)=>verse.book+"-"+verse.chapter+"-"+verse.verse+"-"+bibles.Bibles[0].id == verseIdentifier)[0]);
}

export function getVerseIdentifiers(verseIdentifier: String) {
    let ids = verseIdentifier.match(/(\d+)/g);
    return {book: ids[0], chapter: ids[1], verse: ids[2], bible: ids[3]}
}

export function getNumberOfChaptersInBook(bookName: String) {
    const bookNumber = getBookNumber(bookName);
    return bibles.Bibles[0].verses.filter((verse: verseType)=>verse.book == bookNumber).pop().chapter
}

export function getNumberOfVersesInChapterInBook(chapterNumber: Number, bookName: String) {
    const bookNumber = getBookNumber(bookName);
    return bibles.Bibles[0].verses.filter((verse: verseType)=>verse.book == bookNumber && verse.chapter == chapterNumber).pop().verse
}

// USE CASES:
// console.log(verses.length); // total verses in bible
// console.log(books.length); // total books in bible

//export let allBibleVerses = verses;
export let allBibleBooks = books;
export let allBibles = bibles.Bibles;

// get verse number based on verse identifier
//bibles.Bibles[0].verses.indexOf(bibles.Bibles[0].verses.filter(verse=>verse.book+"-"+verse.chapter+"-"+verse.verse+"-"+bibles.Bibles[0].id == "1-10-32-0")[0]);
// get number of verses in each book
//books.forEach(book=>{console.log(book.Name, bibles.Bibles[0].verses.filter(verse=>verse.book == book.Number).length)})
// get number of chapters in each book
//books.forEach(book=>{console.log(book.Name, getNumberOfChaptersInBook(book.Name))})
// get number of verses in given chapter of given book
//console.log(getNumberOfVersesInChapterInBook(22,"Revelation"));