
function convertToISO(dateStr) {
  if (!dateStr) return new Date().toISOString();

  const [day, month, year] = dateStr.split("/");
  if (!day || !month || !year) return new Date().toISOString();

  const fullYear = year.length === 2 ? `20${year}` : year;
  const isoDate = new Date(`${fullYear}-${month}-${day}`);

  return isNaN(isoDate.getTime()) ? new Date().toISOString() : isoDate.toISOString();
}

module.exports = { convertToISO };
