const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('inputBook');

  if (isStorageExist()) {
    loadDataFromStorage();
  }

  submitForm.addEventListener('submit', function (e) {
    e.preventDefault();
    addBook();
  });
});

function addBook() {
  const titleBook = document.getElementById('inputBookTitle').value;
  const authorBook = document.getElementById('inputBookAuthor').value;
  const yearBook = parseInt(document.getElementById('inputBookYear').value);
  const isCompleted = document.getElementById('inputBookIsComplete').checked;

  const generatedID = generateId();
  const bookObject = generateBookObject(
    generatedID,
    titleBook,
    authorBook,
    yearBook,
    isCompleted
  );
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBookList = document.getElementById(
    'incompleteBookshelfList'
  );
  uncompletedBookList.innerHTML = '';

  const completedBookList = document.getElementById('completeBookshelfList');
  completedBookList.innerHTML = '';

  for (bookItem of books) {
    const bookElement = makeBook(bookItem);

    if (bookItem.isComplete == false) {
      uncompletedBookList.append(bookElement);
    } else {
      completedBookList.append(bookElement);
    }
  }
});

function makeBook(bookObject) {
  const textTitle = document.createElement('h3');
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement('p');
  textAuthor.innerText = 'Penulis: ' + bookObject.author;

  const textYear = document.createElement('p');
  textYear.innerText = 'Tahun: ' + bookObject.year;

  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('action');

  const Container = document.createElement('article');
  Container.classList.add('book_item');
  Container.append(textTitle, textAuthor, textYear, buttonContainer);
  Container.setAttribute('id', `${bookObject.id}`);

  if (bookObject.isComplete) {
    const unfinishedBook = document.createElement('button');
    unfinishedBook.innerText = 'Belum Selesai dibaca';

    unfinishedBook.classList.add('dark');
    unfinishedBook.addEventListener('click', function () {
      addBookToRead(bookObject.id);
    });

    const removeBook = document.createElement('button');
    removeBook.innerText = 'Hapus buku';

    removeBook.classList.add('pink');
    removeBook.addEventListener('click', function () {
      const sure = confirm('Apakah kamu yakin ingin menghapus buku ini?');
      if (sure) {
        removeBookForever(bookObject.id);
      } else {
        return false;
      }
    });

    buttonContainer.append(unfinishedBook, removeBook);
  } else {
    const finishBook = document.createElement('button');
    finishBook.innerText = 'Selesai dibaca';

    finishBook.classList.add('dark');
    finishBook.addEventListener('click', function () {
      addBookToUnread(bookObject.id);
    });

    const removeBook = document.createElement('button');
    removeBook.innerText = 'Hapus buku';

    removeBook.classList.add('pink');
    removeBook.addEventListener('click', function () {
      const sure = confirm('Apakah kamu yakin ingin menghapus buku ini?');
      if (sure) {
        removeBookForever(bookObject.id);
      } else {
        return false;
      }
    });

    buttonContainer.append(finishBook, removeBook);
  }

  return Container;
}

function findBook(bookId) {
  for (bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function addBookToUnread(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addBookToRead(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBookForever(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  books.splice(books.indexOf(bookTarget), 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// Implementasi Local Storage
function isStorageExist() {
  if (typeof Storage === undefined) {
    alert('Browser kamu tidak support local storage');
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);

  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

// Checkbox
function finish() {
  const checkbox = document.getElementById('inputBookIsComplete');
  const complete = document.getElementById('complete');
  const notComplete = document.getElementById('notComplete');

  if (checkbox.checked == true) {
    complete.style.display = 'inline';
    notComplete.style.display = 'none';
  } else {
    complete.style.display = 'none';
    notComplete.style.display = 'inline';
  }
}

// Fitur Search
const searchButton = document.getElementById('searchSubmit');
searchButton.addEventListener('click', function (e) {
  e.preventDefault();

  const searchTitle = document.getElementById('searchBookTitle').value;
  const searchItem = document.querySelectorAll('.book_item');
  for (book of searchItem) {
    const title = book.innerText;

    if (title.includes(searchTitle)) {
      book.style.display = 'block';
      console.log(title);
    } else {
      book.style.display = 'none';
    }
  }
});
