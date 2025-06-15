import React, { useState, useEffect, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { translations, defaultLocale } from '../locales';
import { bookService } from '../services/bookService';
import BookModal from './BookModal';

function BookTable() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [locale, setLocale] = useState(defaultLocale);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const toast = useRef(null);
  const booksPerPage = 10;

  const t = translations[locale].bookTable;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await bookService.fetchBooks();
        setBooks(data);
      } catch (err) {
        setError(err.message);
        toast.current.show({
          severity: 'error',
          summary: t.toast.error.title,
          detail: err.message,
          life: 3000
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const genres = [...new Set(books.map(book => book.genre))].map(genre => ({
    label: genre,
    value: genre
  }));

  const statuses = [...new Set(books.map(book => book.status))].map(status => ({
    label: status,
    value: status
  }));

  const filteredBooks = books.filter(book => {
    const matchesSearch = searchQuery === '' || 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesGenre = !selectedGenre || book.genre === selectedGenre;
    const matchesStatus = !selectedStatus || book.status === selectedStatus;

    return matchesSearch && matchesGenre && matchesStatus;
  });

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleAddBook = () => {
    setSelectedBook(null);
    setModalVisible(true);
  };

  const handleEditBook = (book) => {
    setSelectedBook(book);
    setModalVisible(true);
  };

  const handleDeleteBook = (book) => {
    confirmDialog({
      message: t.delete.confirmMessage.replace('{title}', book.title),
      header: t.delete.confirmHeader,
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: () => deleteBook(book),
      reject: () => {}
    });
  };

  const deleteBook = async (book) => {
    try {
      await bookService.deleteBook(book.id);
      setBooks(books.filter(b => b.id !== book.id));
      toast.current.show({
        severity: 'success',
        summary: t.toast.success.title,
        detail: t.toast.success.delete,
        life: 3000
      });
    } catch (err) {
      toast.current.show({
        severity: 'error',
        summary: t.toast.error.title,
        detail: err.message,
        life: 3000
      });
    }
  };

  const handleModalSubmit = async (formData) => {
    try {
      if (selectedBook) {
        const updatedBook = await bookService.updateBook(selectedBook.id, formData);
        setBooks(books.map(book => book.id === updatedBook.id ? updatedBook : book));
        toast.current.show({
          severity: 'success',
          summary: t.toast.success.title,
          detail: t.toast.success.update,
          life: 3000
        });
      } else {
        const newBook = await bookService.addBook(formData);
        setBooks([...books, newBook]);
        toast.current.show({
          severity: 'success',
          summary: t.toast.success.title,
          detail: t.toast.success.create,
          life: 3000
        });
      }
      setModalVisible(false);
    } catch (err) {
      setError(err.message);
      toast.current.show({
        severity: 'error',
        summary: t.toast.error.title,
        detail: err.message,
        life: 3000
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">{t.loading}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{t.error.title}</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Toast ref={toast} position="top-right" />
      <ConfirmDialog />

      <div className="mb-6 flex justify-between items-center bg-white p-4 rounded-lg shadow">
        <h1 className="text-2xl font-semibold text-gray-800">Books</h1>
        <Button
          label="Add Book"
          icon="pi pi-plus"
          onClick={handleAddBook}
          className="p-button-primary"
          style={{
            background: '#4f46e5',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 2px 4px rgba(79, 70, 229, 0.1)',
            transition: 'all 0.2s ease'
          }}
        />
      </div>

      <div className="mb-4 p-4 bg-white rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-search"></i>
            </span>
            <InputText
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={t.search.placeholder}
              className="w-full"
            />
          </div>
          
          <Dropdown
            value={selectedGenre}
            options={[{ label: t.filters.genre.all, value: null }, ...genres]}
            onChange={(e) => {
              setSelectedGenre(e.value);
              setCurrentPage(1);
            }}
            placeholder={t.filters.genre.placeholder}
            className="w-full"
          />
          
          <Dropdown
            value={selectedStatus}
            options={[{ label: t.filters.status.all, value: null }, ...statuses]}
            onChange={(e) => {
              setSelectedStatus(e.value);
              setCurrentPage(1);
            }}
            placeholder={t.filters.status.placeholder}
            className="w-full"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.table.headers.id}</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.table.headers.title}</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.table.headers.author}</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.table.headers.genre}</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.table.headers.publishedYear}</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.table.headers.status}</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t.table.headers.actions}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentBooks.map((book) => (
              <tr key={book.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{book.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{book.author}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{book.genre}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.publishedYear}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    book.status.toLowerCase() === 'available' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {book.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Button
                      icon="pi pi-pencil"
                      className="p-button-text p-button-rounded p-button-plain"
                      onClick={() => handleEditBook(book)}
                    />
                    <Button
                      icon="pi pi-trash"
                      className="p-button-text p-button-rounded p-button-danger"
                      onClick={() => handleDeleteBook(book)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
        <div className="flex justify-between flex-1 sm:hidden">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t.pagination.previous}
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t.pagination.next}
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              {t.pagination.showing} <span className="font-medium">{indexOfFirstBook + 1}</span> {t.pagination.to}{' '}
              <span className="font-medium">
                {Math.min(indexOfLastBook, filteredBooks.length)}
              </span>{' '}
              {t.pagination.of} <span className="font-medium">{filteredBooks.length}</span> {t.pagination.results}
            </p>
          </div>
          <div>
            <nav className="inline-flex -space-x-px rounded-md shadow-sm isolate" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 text-gray-400 rounded-l-md border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t.pagination.previous}
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                    currentPage === index + 1
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  } border`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 text-gray-400 rounded-r-md border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t.pagination.next}
              </button>
            </nav>
          </div>
        </div>
      </div>

      <BookModal
        visible={modalVisible}
        onHide={() => setModalVisible(false)}
        onSubmit={handleModalSubmit}
        book={selectedBook}
      />
    </div>
  );
}

export default BookTable;