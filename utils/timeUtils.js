/**
 * Get a human-readable time ago string from a date
 * @param {Date} date - The date to calculate time ago from
 * @returns {string} Human-readable time ago string
 */
const getTimeAgo = (date) => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "1 day ago";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  return `${Math.floor(diffInDays / 30)} months ago`;
};

module.exports = {
  getTimeAgo,
};
