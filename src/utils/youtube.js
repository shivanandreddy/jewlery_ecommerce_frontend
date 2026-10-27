export const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  
  // Regex to extract video ID from standard links, short links, or embed links
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);

  return (match && match[2].length === 11) 
    ? `https://www.youtube.com/embed/${match[2]}` 
    : null;
};