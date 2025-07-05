let books = [];

document.addEventListener("DOMContentLoaded", function () {
  loadBooksFromStorage();
  document.getElementById("bookForm").addEventListener("submit", addBook);
  document.getElementById("searchBook").addEventListener("submit", searchBook);
});

const STORAGE_KEY = "Book";
// fungsi menyimpan ke localStorage
function saveBooksToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

// fungsi memuat buku dari localStorage
function loadBooksFromStorage() {
  const storedBooks = localStorage.getItem(STORAGE_KEY);
  if (storedBooks) {
    books = JSON.parse(storedBooks);
  }
  renderBooks();
}

// fungsi membuat ID unik
function generateId() {
  return +new Date();
}

// fungsi tambah buku
function addBook(event) {
  event.preventDefault();

  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = Number(document.getElementById("bookFormYear").value);
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  const book = {
    id: generateId(),
    title,
    author,
    year,
    isComplete
  };

  books.push(book);
  saveBooksToStorage();
  renderBooks();
  document.getElementById("bookForm").reset();
}

// fungsi menampilkan 
function renderBooks(filteredBooks = null) {
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  const bookList = filteredBooks || books;

  bookList.forEach((book) => {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  });
}

// fungsi membuat elemen buku
function createBookElement(book) {
  const bookContainer = document.createElement("div");
  bookContainer.setAttribute("data-bookid", book.id);
  bookContainer.setAttribute("data-testid", "bookItem");

  bookContainer.innerHTML = `
    <h3 data-testid="bookItemTitle">${book.title}</h3>
    <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
    <p data-testid="bookItemYear">Tahun: ${book.year}</p>
    <div>
      <button data-testid="bookItemIsCompleteButton" onclick="toggleBookStatus(${book.id})">
        ${book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}
      </button>
      <button data-testid="bookItemDeleteButton" onclick="deleteBook(${book.id})">Hapus Buku</button>
      <button data-testid="bookItemEditButton" onclick="editBook(${book.id})">Edit Buku</button>
    </div>
  `;

  return bookContainer;
}

// fungsi pindah 
function toggleBookStatus(bookId) {
  const book = books.find((b) => b.id === bookId);
  if (book) {
    book.isComplete = !book.isComplete;
    saveBooksToStorage();
    renderBooks();
  }
}

// fungsi hapus 
function deleteBook(bookId) {
  books = books.filter((b) => b.id !== bookId);
  saveBooksToStorage();
  renderBooks();
}

// fungsi cari 
function searchBook(event) {
  event.preventDefault();
  const query = document.getElementById("searchBookTitle").value.toLowerCase();
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(query)
  );
  renderBooks(filteredBooks);
}

// fungsi mengedit 
function editBook(bookId) {
  const book = books.find((b) => b.id === bookId);
  if (book) {
    document.getElementById("bookFormTitle").value = book.title;
    document.getElementById("bookFormAuthor").value = book.author;
    document.getElementById("bookFormYear").value = book.year;
    document.getElementById("bookFormIsComplete").checked = book.isComplete;

    // hapus buku lama dan simpan perubahan
    books = books.filter((b) => b.id !== bookId);
    saveBooksToStorage();
    renderBooks();
  }
}
