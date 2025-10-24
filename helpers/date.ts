export const fmtIsoDate = (str: string) => {
  const [year, month, day] = str.split('-');
  return `${months[parseInt(month, 10) - 1]} ${day}, ${year}`;
}

const months = [ "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December" ];
