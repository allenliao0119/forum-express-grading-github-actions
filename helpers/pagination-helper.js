const getOffset = (limit = 10, page = 1) => {
  return (page - 1) * limit
}
const getPagination = (limit, page, total) => {
  const totalPages = Math.ceil(total / limit)
  const currentPage = page < 1 ? 1 : page < totalPages ? page : totalPages
  const prev = currentPage > 1 ? (currentPage - 1) : ''
  const next = currentPage < totalPages ? (currentPage + 1) : ''
  const pages = Array.from({ length: totalPages }).map((_, index) => index + 1)
  return {
    totalPages,
    currentPage,
    prev,
    next,
    pages
  }
}

module.exports = {
  getOffset,
  getPagination
}
