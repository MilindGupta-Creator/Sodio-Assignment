const API_URL = 'https://684d88e665ed08713916668f.mockapi.io/books';

export const bookService = {
  async fetchBooks() {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch books');
    }
    return response.json();
  },

  async addBook(bookData) {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookData),
    });
    if (!response.ok) {
      throw new Error('Failed to add book');
    }
    return response.json();
  },

  async updateBook(bookId, bookData) {
    const response = await fetch(`${API_URL}/${bookId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookData),
    });
    if (!response.ok) {
      throw new Error('Failed to update book');
    }
    return response.json();
  },

  async deleteBook(bookId) {
    const response = await fetch(`${API_URL}/${bookId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete book');
    }
    return response.json();
  }
}; 