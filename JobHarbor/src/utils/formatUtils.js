/**
 * Format salary value to a readable string
 * @param {number|string} salary - Salary value to format
 * @returns {string} - Formatted salary string
 */
export const formatSalary = (salary) => {
  if (!salary) return 'Salary not specified';
  
  // If salary is already a string, just return it
  if (typeof salary === 'string') {
    return salary;
  }
  
  // If salary is a number, format it
  if (typeof salary === 'number') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(salary);
  }
  
  // If salary is an object with min and max
  if (salary.min && salary.max) {
    const minFormatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(salary.min);
    
    const maxFormatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(salary.max);
    
    return `${minFormatted} - ${maxFormatted}`;
  }
  
  return 'Salary not specified';
};

/**
 * Format date string to a readable format
 * @param {string} dateString - ISO date string to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return '';
    }
    
    // Get time difference in milliseconds
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    // Format relative time
    if (diffDay > 30) {
      const month = date.toLocaleString('default', { month: 'short' });
      const day = date.getDate();
      const year = date.getFullYear();
      return `${month} ${day}, ${year}`;
    } else if (diffDay > 0) {
      return diffDay === 1 ? 'yesterday' : `${diffDay} days ago`;
    } else if (diffHour > 0) {
      return `${diffHour} ${diffHour === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffMin > 0) {
      return `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`;
    } else {
      return 'just now';
    }
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Truncate text to a specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length of the text
 * @returns {string} - Truncated text
 */
export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength) + '...';
};
