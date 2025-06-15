import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { translations, defaultLocale } from '../locales';

const BookModal = ({ visible, onHide, onSubmit, book = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    publishedYear: '',
    status: 'available'
  });
  const [errors, setErrors] = useState({});
  const t = translations[defaultLocale].bookModal;

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        genre: book.genre || '',
        publishedYear: book.publishedYear || '',
        status: book.status || 'available'
      });
    } else {
      setFormData({
        title: '',
        author: '',
        genre: '',
        publishedYear: '',
        status: 'available'
      });
    }
    setErrors({});
  }, [book, visible]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = t.validation.titleRequired;
    if (!formData.author.trim()) newErrors.author = t.validation.authorRequired;
    if (!formData.genre.trim()) newErrors.genre = t.validation.genreRequired;
    if (!formData.publishedYear) newErrors.publishedYear = t.validation.yearRequired;
    if (formData.publishedYear && (isNaN(formData.publishedYear) || formData.publishedYear < 1800 || formData.publishedYear > new Date().getFullYear())) {
      newErrors.publishedYear = t.validation.yearInvalid;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const statusOptions = [
    { label: t.status.available, value: 'available' },
    { label: t.status.unavailable, value: 'unavailable' }
  ];

  const renderFooter = () => {
    return (
      <div>
        <Button label={t.buttons.cancel} icon="pi pi-times" onClick={onHide} className="p-button-text" />
        <Button label={t.buttons.save} icon="pi pi-check" onClick={handleSubmit} autoFocus />
      </div>
    );
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={book ? t.editTitle : t.addTitle}
      footer={renderFooter}
      className="p-fluid"
      style={{ width: '50vw' }}
    >
      <form onSubmit={handleSubmit} className="p-fluid">
        <div className="field">
          <label htmlFor="title">{t.fields.title}</label>
          <InputText
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={errors.title ? 'p-invalid' : ''}
          />
          {errors.title && <small className="p-error">{errors.title}</small>}
        </div>

        <div className="field">
          <label htmlFor="author">{t.fields.author}</label>
          <InputText
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className={errors.author ? 'p-invalid' : ''}
          />
          {errors.author && <small className="p-error">{errors.author}</small>}
        </div>

        <div className="field">
          <label htmlFor="genre">{t.fields.genre}</label>
          <InputText
            id="genre"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            className={errors.genre ? 'p-invalid' : ''}
          />
          {errors.genre && <small className="p-error">{errors.genre}</small>}
        </div>

        <div className="field">
          <label htmlFor="publishedYear">{t.fields.publishedYear}</label>
          <InputText
            id="publishedYear"
            name="publishedYear"
            type="number"
            value={formData.publishedYear}
            onChange={handleChange}
            className={errors.publishedYear ? 'p-invalid' : ''}
          />
          {errors.publishedYear && <small className="p-error">{errors.publishedYear}</small>}
        </div>

        <div className="field">
          <label htmlFor="status">{t.fields.status}</label>
          <Dropdown
            id="status"
            name="status"
            value={formData.status}
            options={statusOptions}
            onChange={handleChange}
            placeholder={t.fields.selectStatus}
          />
        </div>
      </form>
    </Dialog>
  );
};

export default BookModal; 