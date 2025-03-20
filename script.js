// Fetch Books from Database
async function fetchBooks() {
  let response = await fetch("/books");
  let books = await response.json();
  let bookList = document.getElementById("bookList");

  bookList.innerHTML = "";
  books.forEach((book) => {
      let li = document.createElement("li");
      li.innerHTML = `${book.title} - ${book.author} 
          <button onclick="deleteBook('${book._id}')">❌</button>`;
      bookList.appendChild(li);
  });
}

// Add Book to Database
async function addBook() {
  let title = document.getElementById("bookTitle").value;
  let author = document.getElementById("bookAuthor").value;

  if (title && author) {
      await fetch("/books/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, author })
      });

      document.getElementById("bookTitle").value = "";
      document.getElementById("bookAuthor").value = "";
      fetchBooks();
  }
}

// Delete Book from Database
async function deleteBook(id) {
  await fetch(`/books/delete/${id}`, { method: "DELETE" });
  fetchBooks();
}

// Logout
document.getElementById("logout")?.addEventListener("click", function () {
  localStorage.removeItem("loggedIn");
  window.location.href = "/";
});

// Load Books on Page Load
if (window.location.pathname.includes("dashboard")) {
  fetchBooks();
}
