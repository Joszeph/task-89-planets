import EventEmitter from "eventemitter3";
import image from "../images/planet.svg";

export default class Application extends EventEmitter {
  static get events() {
    return {
      READY: "ready",
    };
  }

  constructor() {
    super();

    this._loading = document.querySelector(".progress");
    this._planets = [];
    this._create();
    this._load();
    this.emit(Application.events.READY);

    const box = document.createElement("div");
    box.classList.add("box");
    box.innerHTML = this._render({
      name: "Placeholder",
      terrain: "placeholder",
      population: 0,
    });

    document.body.querySelector(".main").appendChild(box);

    this.emit(Application.events.READY);
  }


  // async _load() {
  //   this._startLoading();
  //   let page = 1;
  //   let hasNext = true;

  //   while (hasNext) {
  //     const response = await fetch(`https://swapi.boom.dev/api/planets?page=${page}`);
  //     const data = await response.json();
  //     this._planets = [...this._planets, ...data.results];
  //     hasNext = data.next !== null;
  //     page++;
  //   }

  //   this._stopLoading();
  //   this._create();
  // }

  async _load() {
    this._startLoading();
    let page = 1;
    let hasNext = true;

    const response = await fetch(`https://swapi.boom.dev/api/planets`);
    const data = await response.json();
    this._planets = [...this._planets, ...data.results];
    this._stopLoading();
    this._create();
  }


  _create() {
    const box = document.createElement("div");
    box.classList.add("box");
    for (const planet of this._planets) {
      const boxElement = box.cloneNode();
      boxElement.innerHTML = this._render(planet);
      document.body.querySelector(".main").appendChild(boxElement);
    }
  }

  _startLoading() {
    this._loading.style.display = "block";
  }

  _stopLoading() {
    this._loading.style.display = "none";
  }

  _render({ name, terrain, population }) {
    return `
<article class="media">
  <div class="media-left">
    <figure class="image is-64x64">
      <img src="${image}" alt="planet">
    </figure>
  </div>
  <div class="media-content">
    <div class="content">
    <h4>${name}</h4>
      <p>
        <span class="tag">${terrain}</span> <span class="tag">${population}</span>
        <br>
      </p>
    </div>
  </div>
</article>
    `;
  }
}
