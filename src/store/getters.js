export default {
  getFilmInfo({ film }) {
    return film;
  },

  getFilmName({ film }) {
    return film.name;
  },

  getFilmYear({ film }) {
    return film.year;
  }
};
