
class OharaBook {
  /**
   * @param {object} params - All OharaBook properties
   */
  constructor(params) {
    this.Id = params.Id;
    this.BookTitle = params.BookTitle;
    this.Author = params.Author;
    this.Editor = params.Editor;
    this.Category = params.Category;
    this.SubCategory = params.SubCategory;
    this.Publisher = params.Publisher;
    this.PublishedDate = params.PublishedDate;
    this.Edition = params.Edition || '';
    this.Language = params.Language;
    this.ShelfLocation = params.ShelfLocation;
    this.ISBN = params.ISBN;
    this.Notes = params.Notes;
    this.Read = params.Read || false;
    this.DateAdded = params.DateAdded ? new Date(params.DateAdded) : new Date();
    this.DateAcquired = params.DateAcquired ? new Date(params.DateAcquired) : new Date();
    this.ImageLink = params.ImageLink;
    this.PageCount = params.PageCount || 0;
    this.LastUpdated = new Date();
  }

  static fromGoogleBook(googleBook, batchProps) {
    let lan;
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
    return new OharaBook({
      Id: googleBook.id,
      BookTitle: googleBook.title,
      Author: googleBook?.authors?.join(', '),
      Editor: googleBook.publisher,
      Category: batchProps.category,
      SubCategory: googleBook?.categories?.join(', '),
      Publisher: googleBook.publisher,
      PublishedDate: googleBook.publishedDate,
      Edition: '',
      Language: lan,
      ShelfLocation: batchProps.shelfLocation,
      ISBN: googleBook.industryIdentifiers[0].identifier,
      Notes: googleBook.description,
      Read: batchProps.read || false,
      DateAdded: new Date(),
      DateAcquired: new Date(),
      ImageLink: googleBook?.imageLinks?.thumbnail,
      PageCount: googleBook?.pageCount || 0,
      LastUpdated: new Date()
    });
  }

  static fromManualEntry(reqBody) {
    return new OharaBook({
      Id: reqBody.Id,
      BookTitle: reqBody.BookTitle,
      Author: reqBody.Author,
      Editor: reqBody.Editor,
      Category: reqBody.Category,
      SubCategory: reqBody.SubCategory,
      Publisher: reqBody.Publisher,
      PublishedDate: reqBody.PublishedDate,
      Edition: reqBody.Edition || '',
      Language: reqBody.Language,
      ShelfLocation: reqBody.ShelfLocation,
      ISBN: reqBody.ISBN,
      Notes: reqBody.Notes,
      Read: reqBody.Read || false,
      DateAdded: reqBody.DateAdded ? new Date(reqBody.DateAdded) : new Date(),
      DateAcquired: reqBody.DateAcquired ? new Date(reqBody.DateAcquired) : new Date(),
      ImageLink: reqBody.ImageLink,
      PageCount: reqBody.PageCount || 0,
      LastUpdated: new Date()
    });
  }

}

export default OharaBook;
