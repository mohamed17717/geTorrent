# geTorrent

find torrent (with different qualities) and subtitle (arabic & english) for the movie in one palce.

## Live Demo

You can find a live demo [here!](https://getorrent.netlify.com/) hosted on [netlify](http://netlify.com).

## Getting Started

### Prerequisites

- [**NodeJs**](https://nodejs.org/en/download/) - to start using npm

### Clone & Install npm pakages

``` bash
git colne https://github.com/mohamed17717/geTorrent.git <filename>
cd <filename>
npm install
```

### Run

```bash
$ npm run serve

DONE  Compiled successfully in 4221ms

  App running at:
  - Local:   http://localhost:8081/ 
  - Network: http://192.168.1.3:8081/

  Note that the development build is not optimized.
  To create a production build, run npm run build.
```

Then open the ***Local*** url because i make it running only on specific hosts.

## Built With

- [VueJs](https://vuejs.org/) - JavaScript framework.
- [Vuex](https://vuex.vuejs.org/) - State management pattern.
- [GulpJs](https://gulpjs.com/) - Task runner.
- [Sass](https://sass-lang.com/) - Preprocessor language that is compiled into CSS.
- [PugJs](https://pugjs.org/) - Templating engine.

## Features

### Torrent

- Torrents with many qualities
- Filter torrents on the highest seeds (speedest one)
- Scrape many sites until find the movie

### Subtitle

- Subtitle 2 languages
- Filter subtitles with the highest feedback

### Design

- Simple design
- Progress bar
- User guide

### Techniques

- Proxy (to avoid CORS in browser)
- There is no backend and all process done in browser
- Use mirror for torrent site to skip login require

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
