/* ============================================================
   BlueLib Catalogue — catalogue.js
   Data-driven book list with search, filter, add, and borrow.
   ============================================================ */

/* -------- Data -------- */
const library = [
  { id: 1, title: "Clean Code",                 author: "Robert C. Martin",  category: "IT",       copies: 4 },
  { id: 2, title: "Introduction to Algorithms", author: "Thomas H. Cormen",  category: "IT",       copies: 2 },
  { id: 3, title: "The Lean Startup",           author: "Eric Ries",         category: "Business", copies: 0 },
  { id: 4, title: "Principles of Marketing",    author: "Philip Kotler",     category: "Business", copies: 5 },
  { id: 5, title: "A Brief History of Time",    author: "Stephen Hawking",   category: "Science",  copies: 1 },
  { id: 6, title: "Cosmos",                     author: "Carl Sagan",        category: "Science",  copies: 3 },
  { id: 7, title: "Things Fall Apart",          author: "Chinua Achebe",     category: "Arts",     copies: 6 }
];

let lastId = 7;

/* -------- Element references -------- */
const grid        = document.getElementById("cards");
const counter     = document.getElementById("counter");
const searchBox   = document.getElementById("q");
const catSelect   = document.getElementById("cat");

const form        = document.getElementById("new-book-form");
const feedback    = document.getElementById("feedback");
const fTitle      = document.getElementById("f-title");
const fAuthor     = document.getElementById("f-author");
const fCat        = document.getElementById("f-cat");
const fCopies     = document.getElementById("f-copies");

/* -------- Rendering -------- */

// Build one card element for a given book.
function buildCard(book) {
  const card = document.createElement("article");
  card.className = "card";
  if (book.copies === 0) {
    card.classList.add("card--out");
  }
  card.dataset.bookId = book.id;

  const title = document.createElement("h3");
  title.className = "card__title";
  title.textContent = book.title;

  const author = document.createElement("p");
  author.className = "card__author";
  author.textContent = book.author;

  const cat = document.createElement("p");
  cat.className = "card__cat";
  cat.textContent = book.category;

  const stock = document.createElement("p");
  stock.className = "card__stock";
  stock.textContent = book.copies === 0
    ? "Out of stock"
    : book.copies + (book.copies === 1 ? " copy left" : " copies left");

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "btn btn--borrow";
  btn.dataset.bookId = book.id;
  if (book.copies === 0) {
    btn.disabled = true;
    btn.textContent = "Out of Stock";
  } else {
    btn.textContent = "Borrow";
  }

  card.append(title, author, cat, stock, btn);
  return card;
}

// Compute the current filtered list based on search term + category.
function currentSelection() {
  const term = searchBox.value.trim().toLowerCase();
  const cat  = catSelect.value;

  return library.filter(b => {
    const titleMatch = b.title.toLowerCase().includes(term);
    const catMatch   = cat === "all" || b.category === cat;
    return titleMatch && catMatch;
  });
}

// Rebuild the grid from scratch with the current selection.
function paint() {
  const shown = currentSelection();
  grid.innerHTML = "";

  if (shown.length === 0) {
    const note = document.createElement("p");
    note.className = "cards__empty";
    note.textContent = "No books match your search.";
    grid.appendChild(note);
  } else {
    shown.forEach(b => grid.appendChild(buildCard(b)));
  }

  counter.textContent = shown.length + " of " + library.length + " shown";
}

/* -------- Borrowing -------- */
function onBorrow(bookId) {
  const book = library.find(b => b.id === bookId);
  if (!book || book.copies === 0) return;
  book.copies -= 1;
  paint();
}

// One listener on the grid handles every Borrow button.
grid.addEventListener("click", e => {
  const btn = e.target.closest(".btn--borrow");
  if (!btn) return;
  onBorrow(Number(btn.dataset.bookId));
});

/* -------- Search & filter -------- */
searchBox.addEventListener("input", paint);
catSelect.addEventListener("change", paint);

/* -------- Add book -------- */

// Print a message below the form. type is "error" or "success".
function notify(msg, type) {
  feedback.textContent = msg;
  feedback.className = "feedback feedback--" + type;
}

function onSubmit(e) {
  e.preventDefault();

  const title  = fTitle.value.trim();
  const author = fAuthor.value.trim();
  const cat    = fCat.value;
  const raw    = fCopies.value.trim();

  if (!title || !author || !cat || !raw) {
    notify("Please complete every field.", "error");
    return;
  }

  const copies = Number(raw);
  if (!Number.isInteger(copies) || copies < 0) {
    notify("Copies must be a whole number of 0 or more.", "error");
    return;
  }

  lastId += 1;
  library.push({ id: lastId, title, author, category: cat, copies });

  form.reset();
  notify('"' + title + '" added.', "success");
  paint();
}

form.addEventListener("submit", onSubmit);

/* -------- Initial paint -------- */
paint();