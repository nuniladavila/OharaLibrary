
class GoogleBook {
  /**
   * @param {Object} params
   * @param {string} params.title
   * @param {string[]} params.authors
   * @param {string} params.publisher
   * @param {string} params.publishedDate
   * @param {string} params.description
   * @param {string[]} params.categories
   * @param {string} params.language
   * @param {Object} params.industryIdentifiers
   * @param {number} params.pageCount
   * @param {Object} params.imageLinks
   * @param {string} params.previewLink
   * @param {string} params.infoLink
   * @param {string} params.canonicalVolumeLink
   */
  constructor({
    title,
    authors,
    publisher,
    publishedDate,
    description,
    categories,
    language,
    industryIdentifiers,
    pageCount,
    imageLinks,
    previewLink,
    infoLink,
    canonicalVolumeLink
  }) {
    this.title = title;
    this.authors = authors;
    this.publisher = publisher;
    this.publishedDate = publishedDate;
    this.description = description;
    this.categories = categories;
    this.language = language;
    this.industryIdentifiers = industryIdentifiers;
    this.pageCount = pageCount;
    this.imageLinks = imageLinks;
    this.previewLink = previewLink;
    this.infoLink = infoLink;
    this.canonicalVolumeLink = canonicalVolumeLink;
  }
}

module.exports = GoogleBook;
