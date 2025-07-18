
class OharaBook {
  /**
   * @param {number} params.Id
   * @param {string} params.BookTitle
   * @param {string} params.Author
   * @param {string} params.Editor
   * @param {string} params.Category
   * @param {string} params.SubCategory
   * @param {string} params.Publisher
   * @param {string} params.PublishedDate
   * @param {string} params.Edition 
   * @param {string} params.Language
   * @param {string} params.ShelfLocation
   * @param {string} params.ISBN
   * @param {string} params.Notes
   * @param {boolean} params.Read
   * @param {datetime} params.DateAdded
   * @param {datetime} params.DateAcquired
   * @param {string} params.ImageLink
   */

  constructor(googleBook, batchProps) {
    var lan;
    switch (googleBook.language) {
      case 'en':
        lan = 'English';
        break;
      case 'es':
        lan = 'Spanish';
        break;
      default:
        lan = googleBook.language;
        break;
    }

    this.Id = googleBook.id;
    this.BookTitle = googleBook.title;
    this.Author = googleBook.authors.join(', ');
    this.Editor = googleBook.publisher;
    this.Category = batchProps.category;
    this.SubCategory = googleBook.categories.join(', ');
    this.Publisher = googleBook.publisher;
    this.PublishedDate = googleBook.publishedDate;
    this.Edition = '';
    this.Language = lan;
    this.ShelfLocation = batchProps.shelfLocation;
    this.ISBN = googleBook.industryIdentifiers[0].identifier;
    this.Notes = googleBook.description;
    this.Read = batchProps.read || false;
    this.DateAdded = new Date();
    this.DateAcquired = new Date();
    this.ImageLink = googleBook.imageLinks.thumbnail;
  }

}

export default OharaBook;
