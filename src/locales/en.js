export const en = {
  bookTable: {
    search: {
      placeholder: 'Search by title or author...',
    },
    filters: {
      genre: {
        placeholder: 'Select Genre',
        all: 'All Genres',
      },
      status: {
        placeholder: 'Select Status',
        all: 'All Statuses',
      },
    },
    table: {
      headers: {
        id: 'ID',
        title: 'Title',
        author: 'Author',
        genre: 'Genre',
        publishedYear: 'Published Year',
        status: 'Status',
        actions: 'Actions',
      },
    },
    pagination: {
      showing: 'Showing',
      to: 'to',
      of: 'of',
      results: 'results',
      previous: 'Previous',
      next: 'Next',
    },
    loading: 'Loading books...',
    error: {
      title: 'Error loading books',
    },
    toast: {
      success: {
        title: 'Success',
        create: 'Book has been added successfully',
        update: 'Book has been updated successfully',
        delete: 'Book has been deleted successfully',
      },
      error: {
        title: 'Error',
      },
    },
    delete: {
      confirmHeader: 'Delete Confirmation',
      confirmMessage: 'Are you sure you want to delete "{title}"?',
    },
  },
  bookModal: {
    addTitle: 'Add New Book',
    editTitle: 'Edit Book',
    fields: {
      title: 'Title',
      author: 'Author',
      genre: 'Genre',
      publishedYear: 'Published Year',
      status: 'Status',
      selectStatus: 'Select Status',
    },
    status: {
      available: 'Available',
      unavailable: 'Unavailable',
    },
    buttons: {
      save: 'Save',
      cancel: 'Cancel',
    },
    validation: {
      titleRequired: 'Title is required',
      authorRequired: 'Author is required',
      genreRequired: 'Genre is required',
      yearRequired: 'Published year is required',
      yearInvalid: 'Published year must be between 1800 and current year',
    },
  },
}; 