import { Controller } from "stimulus"

export default class extends Controller {
    static targets = ["entry"]
    static values = {
        path: String,
    }

  connect() {
    this.createObserver();
  }

  createObserver() {
    let observer;
    this.handleIntersect = this.handleIntersect.bind(this)
  
    let options = {
      root: null,
      rootMargin: "0px",
      threshold: 1,
    };
    
    observer = new IntersectionObserver(this.handleIntersect, options);
    observer.observe(this.entryTarget);
  }

  handleIntersect() {
    history.pushState({}, "", this.pathValue);
  }

}
