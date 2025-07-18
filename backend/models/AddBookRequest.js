
class AddBookRequest {
  /**
   * @param {string} isbn
   * @param {string} category
   * @param {string} shelfLocation
   * @param {boolean} read
   */
  
  constructor(isbn, category, shelfLocation, read) {
    this.isbn = isbn;
    this.category = category;
    this.shelfLocation = shelfLocation;
    this.read = read;
  }
}

module.exports = AddBookRequest;
